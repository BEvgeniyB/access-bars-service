import json
import os
from datetime import datetime, timedelta
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get website analytics statistics and reports
    Args: event - dict with httpMethod, queryStringParameters
          context - object with attributes: request_id, function_name, function_version, memory_limit_in_mb
    Returns: HTTP response dict with analytics data
    '''
    method: str = event.get('httpMethod', 'GET')
    
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
            'body': ''
        }
    
    if method == 'GET':
        # Get query parameters
        params = event.get('queryStringParameters', {}) or {}
        days = int(params.get('days', '7'))
        
        # Connect to database
        db_url = os.environ.get('DATABASE_URL')
        if not db_url:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Database not configured'})
            }
        
        try:
            with psycopg2.connect(db_url) as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    # Calculate date range
                    end_date = datetime.now()
                    start_date = end_date - timedelta(days=days)
                    
                    # Total visits in period
                    cur.execute(
                        f"SELECT COUNT(*) as total_visits FROM page_visits WHERE visited_at >= '{start_date.isoformat()}' AND visited_at <= '{end_date.isoformat()}'"
                    )
                    total_visits = cur.fetchone()['total_visits']
                    
                    # Unique visitors (by IP)
                    cur.execute(
                        f"SELECT COUNT(DISTINCT user_ip) as unique_visitors FROM page_visits WHERE visited_at >= '{start_date.isoformat()}' AND visited_at <= '{end_date.isoformat()}'"
                    )
                    unique_visitors = cur.fetchone()['unique_visitors']
                    
                    # Top pages
                    cur.execute(
                        f"SELECT page_url, COUNT(*) as visits FROM page_visits WHERE visited_at >= '{start_date.isoformat()}' AND visited_at <= '{end_date.isoformat()}' GROUP BY page_url ORDER BY visits DESC LIMIT 10"
                    )
                    top_pages = cur.fetchall()
                    
                    # Daily visits
                    cur.execute(
                        f"SELECT DATE(visited_at) as visit_date, COUNT(*) as visits FROM page_visits WHERE visited_at >= '{start_date.isoformat()}' AND visited_at <= '{end_date.isoformat()}' GROUP BY DATE(visited_at) ORDER BY visit_date"
                    )
                    daily_stats = cur.fetchall()
                    
                    # Top referrers
                    cur.execute(
                        f"SELECT referrer, COUNT(*) as visits FROM page_visits WHERE visited_at >= '{start_date.isoformat()}' AND visited_at <= '{end_date.isoformat()}' AND referrer != '' GROUP BY referrer ORDER BY visits DESC LIMIT 5"
                    )
                    top_referrers = cur.fetchall()
                    
                    analytics_data = {
                        'period_days': days,
                        'total_visits': total_visits,
                        'unique_visitors': unique_visitors,
                        'top_pages': [dict(row) for row in top_pages],
                        'daily_stats': [dict(row) for row in daily_stats],
                        'top_referrers': [dict(row) for row in top_referrers]
                    }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(analytics_data, default=str)
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': f'Database error: {str(e)}'})
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }