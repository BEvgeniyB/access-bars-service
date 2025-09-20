import json
import os
import psycopg2
from datetime import datetime
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Business: Records website visits for analytics tracking
    Args: event - dict with httpMethod, body, headers, requestContext
          context - object with request_id, function_name attributes
    Returns: HTTP response confirming visit recorded
    """
    method: str = event.get('httpMethod', 'POST')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, User-Agent, Referer',
                'Access-Control-Max-Age': '86400'
            },
            'isBase64Encoded': False,
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    # Parse request data
    try:
        body_data = json.loads(event.get('body', '{}'))
        headers = event.get('headers', {})
        request_context = event.get('requestContext', {})
        
        print(f"DEBUG: body_data={body_data}")
        print(f"DEBUG: headers={headers}")
        print(f"DEBUG: request_context={request_context}")
        
        # Extract visit data
        page_url = body_data.get('page', '/')
        user_agent = headers.get('user-agent', headers.get('User-Agent', ''))
        referrer = headers.get('referer', headers.get('Referer', ''))
        
        # Get visitor IP from request context
        visitor_ip = request_context.get('identity', {}).get('sourceIp', 'unknown')
        
        print(f"DEBUG: Extracted data - page={page_url}, ip={visitor_ip}, ua={user_agent[:50] if user_agent else 'None'}")
        
        # Connect to database
        database_url = os.environ.get('DATABASE_URL')
        if not database_url:
            raise Exception('DATABASE_URL not found in environment')
        
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
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