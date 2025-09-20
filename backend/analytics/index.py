import json
import os
from datetime import datetime
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Record website page visits and views for analytics
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with attributes: request_id, function_name, function_version, memory_limit_in_mb
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        # Parse request data
        body_data = json.loads(event.get('body', '{}'))
        page_url = body_data.get('page_url', '/')
        user_agent = event.get('headers', {}).get('User-Agent', '')
        referrer = body_data.get('referrer', '')
        session_id = body_data.get('session_id', '')
        
        # Get user IP from headers
        headers = event.get('headers', {})
        user_ip = headers.get('X-Forwarded-For', headers.get('X-Real-IP', 'unknown'))
        
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
                    # Insert visit record using simple query protocol
                    clean_user_agent = user_agent.replace("'", "''")
                    query = f"INSERT INTO page_visits (page_url, user_ip, user_agent, referrer, session_id) VALUES ('{page_url}', '{user_ip}', '{clean_user_agent}', '{referrer}', '{session_id}')"
                    cur.execute(query)
                    conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': 'Visit recorded'})
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