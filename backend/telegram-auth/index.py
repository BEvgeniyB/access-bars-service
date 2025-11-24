'''
Business: Авторизация пользователей через Telegram ID и Group ID
Args: event - dict с httpMethod, body (telegram_id, telegram_group_id)
      context - object с request_id
Returns: HTTP response с JWT-токеном и данными пользователя
'''

import json
import os
import psycopg2
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import jwt

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_raw = event.get('body', '{}')
    if not body_raw or body_raw.strip() == '':
        body_raw = '{}'
    body_data = json.loads(body_raw)
    telegram_id: str = body_data.get('telegram_id', '').strip()
    telegram_group_id: str = body_data.get('telegram_group_id', '').strip()
    
    if not telegram_id or not telegram_group_id:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'telegram_id и telegram_group_id обязательны'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'DATABASE_URL не настроен'})
        }
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    try:
        query = '''
            SELECT id, name, email, role, is_admin, telegram_id, telegram_group_id, telegram_username
            FROM t_p89870318_access_bars_service.users
            WHERE telegram_id = %s AND telegram_group_id = %s
        '''
        cur.execute(query, (telegram_id, telegram_group_id))
        user = cur.fetchone()
        
        if not user:
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Неверный telegram_id или telegram_group_id'})
            }
        
        user_id, name, email, role, is_admin, tg_id, tg_group, tg_username = user
        
        jwt_secret = os.environ.get('ADMIN_TOKEN', 'default-secret-key')
        token_payload = {
            'user_id': user_id,
            'telegram_id': telegram_id,
            'is_admin': is_admin or False,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }
        token = jwt.encode(token_payload, jwt_secret, algorithm='HS256')
        
        result = {
            'success': True,
            'token': token,
            'user': {
                'id': user_id,
                'name': name,
                'email': email,
                'role': role,
                'is_admin': is_admin or False,
                'telegram_id': tg_id,
                'telegram_username': tg_username
            }
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps(result)
        }
    
    finally:
        cur.close()
        conn.close()