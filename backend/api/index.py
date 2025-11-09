'''
Business: Unified API function - handles authentication (POST /auth) and analytics (GET/POST /analytics)
Args: event - dict with httpMethod, body, queryStringParameters, pathParams
      context - object with attributes: request_id, function_name
Returns: HTTP response with auth token, visit confirmation, or analytics data
'''

import json
import os
import secrets
import psycopg2
from datetime import datetime, timedelta
from typing import Dict, Any

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise ValueError('DATABASE_URL not found in environment')
    return psycopg2.connect(database_url)

def cors_response(allowed_methods='GET, POST, OPTIONS'):
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': allowed_methods,
            'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, X-Admin-Token',
            'Access-Control-Max-Age': '86400'
        },
        'body': '',
        'isBase64Encoded': False
    }

def success_response(data, status_code=200):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(data, default=str),
        'isBase64Encoded': False
    }

def error_response(message, status_code=500):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message}),
        'isBase64Encoded': False
    }

def handle_auth(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return cors_response('POST, OPTIONS')
    
    if method == 'POST':
        correct_password = os.environ.get('PASSWORD')
        if not correct_password:
            return error_response('PASSWORD not configured', 500)
        
        headers = event.get('headers', {})
        request_context = event.get('requestContext', {})
        
        client_ip = (
            headers.get('x-real-ip') or 
            headers.get('X-Real-Ip') or
            headers.get('x-original-forwarded-for', '').split(',')[0].strip() or
            headers.get('X-Original-Forwarded-For', '').split(',')[0].strip() or
            request_context.get('identity', {}).get('sourceIp', 'unknown')
        )
        
        conn = None
        cursor = None
        
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            one_hour_ago = datetime.utcnow() - timedelta(hours=1)
            
            cursor.execute("""
                SELECT COUNT(*) FROM login_attempts 
                WHERE ip_address = %s AND attempt_time > %s AND success = FALSE
            """, (client_ip, one_hour_ago))
            
            failed_attempts = cursor.fetchone()[0]
            
            if failed_attempts >= 5:
                cursor.execute("""
                    SELECT MAX(attempt_time) FROM login_attempts 
                    WHERE ip_address = %s AND success = FALSE
                """, (client_ip,))
                
                last_attempt = cursor.fetchone()[0]
                if last_attempt:
                    wait_until = last_attempt + timedelta(hours=1)
                    wait_seconds = int((wait_until - datetime.utcnow()).total_seconds())
                    
                    if wait_seconds > 0:
                        return {
                            'statusCode': 429,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Retry-After': str(wait_seconds)
                            },
                            'isBase64Encoded': False,
                            'body': json.dumps({
                                'success': False,
                                'error': f'Too many failed attempts. Try again in {wait_seconds // 60} minutes'
                            })
                        }
            
            body_data = json.loads(event.get('body', '{}'))
            provided_password = body_data.get('password', '')
            
            provided_bytes = provided_password.encode('utf-8')
            correct_bytes = correct_password.encode('utf-8')
            
            if secrets.compare_digest(provided_bytes, correct_bytes):
                session_token = secrets.token_urlsafe(32)
                expires_at = (datetime.utcnow() + timedelta(hours=24)).isoformat()
                
                cursor.execute("""
                    INSERT INTO login_attempts (ip_address, success) 
                    VALUES (%s, TRUE)
                """, (client_ip,))
                conn.commit()
                
                admin_token = os.environ.get('ADMIN_TOKEN', session_token)
                
                return success_response({
                    'success': True,
                    'token': admin_token,
                    'expires_at': expires_at,
                    'message': 'Authentication successful'
                })
            else:
                cursor.execute("""
                    INSERT INTO login_attempts (ip_address, success) 
                    VALUES (%s, FALSE)
                """, (client_ip,))
                conn.commit()
                
                return error_response('Invalid password', 401)
        
        except Exception as e:
            print(f"ERROR in auth: {str(e)}")
            import traceback
            traceback.print_exc()
            if conn:
                conn.rollback()
            return error_response(str(e), 500)
        
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
    
    return error_response('Method not allowed', 405)

def handle_analytics(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return cors_response('GET, POST, OPTIONS')
    
    conn = None
    cursor = None
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            headers = event.get('headers', {})
            request_context = event.get('requestContext', {})
            
            page_url = body_data.get('page', '/')
            user_agent = headers.get('user-agent', headers.get('User-Agent', ''))
            referrer = headers.get('referer', headers.get('Referer', ''))
            
            visitor_ip = (
                headers.get('x-real-ip') or 
                headers.get('X-Real-Ip') or
                headers.get('x-original-forwarded-for', '').split(',')[0].strip() or
                headers.get('X-Original-Forwarded-For', '').split(',')[0].strip() or
                request_context.get('identity', {}).get('sourceIp', 'unknown')
            )
            
            visit_time = datetime.utcnow()
            
            insert_query = """
                INSERT INTO t_p89870318_access_bars_service.page_visits 
                (page_url, user_ip, user_agent, referrer, visited_at)
                VALUES (%s, %s, %s, %s, %s)
            """
            
            cursor.execute(insert_query, (page_url, visitor_ip, user_agent, referrer, visit_time))
            conn.commit()
            
            return success_response({
                'success': True,
                'message': 'Visit recorded',
                'timestamp': visit_time.isoformat()
            })
            
        elif method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            period_days = int(params.get('days', 7))
            
            if period_days < 1 or period_days > 365:
                period_days = 7
            
            end_date = datetime.now()
            start_date = end_date - timedelta(days=period_days)
            
            total_visits_query = """
                SELECT COUNT(*) as total_visits
                FROM t_p89870318_access_bars_service.page_visits 
                WHERE visited_at >= %s AND visited_at <= %s
            """
            cursor.execute(total_visits_query, (start_date, end_date))
            total_visits = cursor.fetchone()[0]
            
            unique_visitors_query = """
                SELECT COUNT(DISTINCT user_ip) as unique_visitors
                FROM t_p89870318_access_bars_service.page_visits 
                WHERE visited_at >= %s AND visited_at <= %s
            """
            cursor.execute(unique_visitors_query, (start_date, end_date))
            unique_visitors = cursor.fetchone()[0]
            
            top_pages_query = """
                SELECT page_url, COUNT(*) as visits
                FROM t_p89870318_access_bars_service.page_visits 
                WHERE visited_at >= %s AND visited_at <= %s
                GROUP BY page_url 
                ORDER BY visits DESC 
                LIMIT 10
            """
            cursor.execute(top_pages_query, (start_date, end_date))
            top_pages = [{'page_url': row[0], 'visits': row[1]} for row in cursor.fetchall()]
            
            daily_stats_query = """
                SELECT DATE(visited_at) as visit_date, COUNT(*) as visits
                FROM t_p89870318_access_bars_service.page_visits 
                WHERE visited_at >= %s AND visited_at <= %s
                GROUP BY DATE(visited_at) 
                ORDER BY visit_date
            """
            cursor.execute(daily_stats_query, (start_date, end_date))
            daily_stats = [{'visit_date': str(row[0]), 'visits': row[1]} for row in cursor.fetchall()]
            
            top_referrers_query = """
                SELECT COALESCE(NULLIF(referrer, ''), 'Direct') as referrer, COUNT(*) as visits
                FROM t_p89870318_access_bars_service.page_visits 
                WHERE visited_at >= %s AND visited_at <= %s
                GROUP BY COALESCE(NULLIF(referrer, ''), 'Direct')
                ORDER BY visits DESC 
                LIMIT 10
            """
            cursor.execute(top_referrers_query, (start_date, end_date))
            top_referrers = [{'referrer': row[0], 'visits': row[1]} for row in cursor.fetchall()]
            
            analytics_data = {
                'period_days': period_days,
                'total_visits': total_visits,
                'unique_visitors': unique_visitors,
                'top_pages': top_pages,
                'daily_stats': daily_stats,
                'top_referrers': top_referrers
            }
            
            return success_response(analytics_data)
        
        else:
            return error_response('Method not allowed', 405)
    
    except Exception as e:
        return error_response(str(e), 500)
    
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    params = event.get('queryStringParameters', {}) or {}
    endpoint = params.get('endpoint', 'auth')
    
    if endpoint == 'auth':
        return handle_auth(event, context)
    elif endpoint == 'analytics':
        return handle_analytics(event, context)
    else:
        return error_response('Not found - use ?endpoint=auth or ?endpoint=analytics', 404)