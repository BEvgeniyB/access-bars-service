import json
import os
import psycopg2
from datetime import datetime, timedelta

def handler(event, context):
    '''
    Business: Universal analytics function - tracks visits (POST) and provides analytics data (GET)
    Args: event - dict with httpMethod, body, queryStringParameters, headers, requestContext
          context - object with attributes: request_id, function_name, function_version, memory_limit_in_mb
    Returns: HTTP response with visit confirmation or analytics data
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, User-Agent, Referer',
                'Access-Control-Max-Age': '86400'
            },
            'isBase64Encoded': False,
            'body': ''
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'DATABASE_URL not found'})
        }
    
    conn = None
    cursor = None
    
    try:
        conn = psycopg2.connect(database_url)
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
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'message': 'Visit recorded',
                    'timestamp': visit_time.isoformat()
                })
            }
            
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
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps(analytics_data)
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': False,
                'error': str(e)
            })
        }
    
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
