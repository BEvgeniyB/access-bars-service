import json
import os
import secrets
from datetime import datetime, timedelta

def handler(event, context):
    '''
    Business: Admin authentication - validates password and issues session tokens
    Args: event - dict with httpMethod, body (password field)
          context - object with attributes: request_id, function_name
    Returns: HTTP response with auth token or error
    '''
    method = event.get('httpMethod', 'POST')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'isBase64Encoded': False,
            'body': ''
        }
    
    if method == 'POST':
        # Get password from environment
        correct_password = os.environ.get('PASSWORD')
        if not correct_password:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'PASSWORD not configured'})
            }
        
        # Parse request body
        body_data = json.loads(event.get('body', '{}'))
        provided_password = body_data.get('password', '')
        
        # Validate password
        if provided_password == correct_password:
            # Generate secure session token
            session_token = secrets.token_urlsafe(32)
            expires_at = (datetime.utcnow() + timedelta(hours=24)).isoformat()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'token': session_token,
                    'expires_at': expires_at,
                    'message': 'Authentication successful'
                })
            }
        else:
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': False,
                    'error': 'Invalid password'
                })
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }
