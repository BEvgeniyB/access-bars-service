import json
import os
import psycopg2
from datetime import datetime, timedelta

def handler(event, context):
    '''
    Business: Get website analytics data for specified period
    Args: event - dict with httpMethod, queryStringParameters
          context - object with attributes: request_id, function_name, function_version, memory_limit_in_mb
    Returns: HTTP response with analytics data
    '''
    method = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'isBase64Encoded': False,
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    # Get period parameter
    params = event.get('queryStringParameters', {}) or {}
    period_days = int(params.get('days', 7))
    
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