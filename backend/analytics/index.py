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
    
    # Handle CORS OPTIONS request
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
    
    # Connect to database
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'DATABASE_URL not found'})
        }
    
    try:
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        if method == 'POST':
            # TRACK VISIT functionality
            try:
                body_data = json.loads(event.get('body', '{}'))
                headers = event.get('headers', {})
                request_context = event.get('requestContext', {})
                
                # Extract visit data
                page_url = body_data.get('page', '/')
                user_agent = headers.get('user-agent', headers.get('User-Agent', ''))
                referrer = headers.get('referer', headers.get('Referer', ''))
                
                # Get visitor IP from headers
                visitor_ip = (
                    headers.get('x-real-ip') or 
                    headers.get('X-Real-Ip') or
                    headers.get('x-original-forwarded-for', '').split(',')[0].strip() or
                    headers.get('X-Original-Forwarded-For', '').split(',')[0].strip() or
                    request_context.get('identity', {}).get('sourceIp', 'unknown')
                )
                
                # Insert visit record using simple query (escape single quotes)
                page_url_escaped = page_url.replace("'", "''")
                visitor_ip_escaped = visitor_ip.replace("'", "''")
                user_agent_escaped = user_agent.replace("'", "''") if user_agent else ''
                referrer_escaped = referrer.replace("'", "''") if referrer else ''
                
                visit_time = datetime.utcnow()
                visit_time_str = visit_time.isoformat()
                
                insert_query = f"""
                    INSERT INTO t_p89870318_access_bars_service.page_visits (page_url, user_ip, user_agent, referrer, visited_at)
                    VALUES ('{page_url_escaped}', '{visitor_ip_escaped}', '{user_agent_escaped}', '{referrer_escaped}', '{visit_time_str}')
                """
                
                cursor.execute(insert_query)
                conn.commit()
                cursor.close()
                conn.close()
                
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
                
            except Exception as e:
                cursor.close()
                conn.close()
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
                
        elif method == 'GET':
            # ANALYTICS functionality
            try:
                params = event.get('queryStringParameters', {}) or {}
                period_days = int(params.get('days', 7))
                
                # Calculate date range
                end_date = datetime.now()
                start_date = end_date - timedelta(days=period_days)
                start_date_str = start_date.strftime('%Y-%m-%d')
                end_date_str = end_date.strftime('%Y-%m-%d')
                
                # Total visits in period
                total_visits_query = f"""
                    SELECT COUNT(*) as total_visits
                    FROM t_p89870318_access_bars_service.page_visits 
                    WHERE DATE(visited_at) >= '{start_date_str}' AND DATE(visited_at) <= '{end_date_str}'
                """
                cursor.execute(total_visits_query)
                total_visits = cursor.fetchone()[0]
                
                # Unique visitors (by IP)
                unique_visitors_query = f"""
                    SELECT COUNT(DISTINCT user_ip) as unique_visitors
                    FROM t_p89870318_access_bars_service.page_visits 
                    WHERE DATE(visited_at) >= '{start_date_str}' AND DATE(visited_at) <= '{end_date_str}'
                """
                cursor.execute(unique_visitors_query)
                unique_visitors = cursor.fetchone()[0]
                
                # Top pages
                top_pages_query = f"""
                    SELECT page_url, COUNT(*) as visits
                    FROM t_p89870318_access_bars_service.page_visits 
                    WHERE DATE(visited_at) >= '{start_date_str}' AND DATE(visited_at) <= '{end_date_str}'
                    GROUP BY page_url 
                    ORDER BY visits DESC 
                    LIMIT 10
                """
                cursor.execute(top_pages_query)
                top_pages = [{'page_url': row[0], 'visits': row[1]} for row in cursor.fetchall()]
                
                # Daily stats
                daily_stats_query = f"""
                    SELECT DATE(visited_at) as visit_date, COUNT(*) as visits
                    FROM t_p89870318_access_bars_service.page_visits 
                    WHERE DATE(visited_at) >= '{start_date_str}' AND DATE(visited_at) <= '{end_date_str}'
                    GROUP BY DATE(visited_at) 
                    ORDER BY visit_date
                """
                cursor.execute(daily_stats_query)
                daily_stats = [{'visit_date': str(row[0]), 'visits': row[1]} for row in cursor.fetchall()]
                
                # Top referrers
                top_referrers_query = f"""
                    SELECT COALESCE(NULLIF(referrer, ''), 'Direct') as referrer, COUNT(*) as visits
                    FROM t_p89870318_access_bars_service.page_visits 
                    WHERE DATE(visited_at) >= '{start_date_str}' AND DATE(visited_at) <= '{end_date_str}'
                    GROUP BY COALESCE(NULLIF(referrer, ''), 'Direct')
                    ORDER BY visits DESC 
                    LIMIT 10
                """
                cursor.execute(top_referrers_query)
                top_referrers = [{'referrer': row[0], 'visits': row[1]} for row in cursor.fetchall()]
                
                cursor.close()
                conn.close()
                
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
                
            except Exception as e:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'error': str(e),
                        'period_days': period_days,
                        'total_visits': 0,
                        'unique_visitors': 0,
                        'top_pages': [],
                        'daily_stats': [],
                        'top_referrers': []
                    })
                }
        else:
            cursor.close()
            conn.close()
            return {
                'statusCode': 405,
                'headers': {'Access-Control-Allow-Origin': '*'},
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
            'body': json.dumps({'error': str(e)})
        }