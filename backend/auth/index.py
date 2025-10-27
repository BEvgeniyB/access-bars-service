import json
import os
import secrets
import psycopg2
from datetime import datetime, timedelta

def handler(event, context):
    '''
    Business: Admin authentication - validates password and issues session tokens with rate limiting
    Args: event - dict with httpMethod, body (password field), requestContext (for IP)
          context - object with attributes: request_id, function_name
    Returns: HTTP response with auth token or error
    '''
    method = event.get('httpMethod', 'POST')
    
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
        
        headers = event.get('headers', {})
        request_context = event.get('requestContext', {})
        
        client_ip = (
            headers.get('x-real-ip') or 
            headers.get('X-Real-Ip') or
            headers.get('x-original-forwarded-for', '').split(',')[0].strip() or
            headers.get('X-Original-Forwarded-For', '').split(',')[0].strip() or
            request_context.get('identity', {}).get('sourceIp', 'unknown')
        )
        
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
            
            # Convert to bytes for comparison to support non-ASCII characters
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
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'success': True,
                        'token': admin_token,
                        'expires_at': expires_at,
                        'message': 'Authentication successful'
                    })
                }
            else:
                cursor.execute("""
                    INSERT INTO login_attempts (ip_address, success) 
                    VALUES (%s, FALSE)
                """, (client_ip,))
                conn.commit()
                
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
        
        except Exception as e:
            print(f"ERROR in auth: {str(e)}")
            print(f"Error type: {type(e).__name__}")
            import traceback
            traceback.print_exc()
            if conn:
                conn.rollback()
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': str(e)})
            }
        
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }