'''
Business: Авторизация пользователей через Telegram ID и Group ID (без схемы)
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
    
    if not telegram_id:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'telegram_id обязателен'})
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
        telegram_id_int = int(telegram_id)
        query = '''
            SELECT id, name, email, role, telegram_id, is_admin
            FROM users
            WHERE telegram_id = %s
        '''
        cur.execute(query, (telegram_id_int,))
        user = cur.fetchone()
        
        if not user:
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Пользователь с таким telegram_id не найден'})
            }
        
        user_id, name, email, role, tg_id, is_admin = user
        
        if not is_admin:
            return {
                'statusCode': 403,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Доступ запрещён. Требуется права администратора'})
            }
        
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
                'id': str(user_id),
                'name': name,
                'email': email or '',
                'role': role,
                'is_admin': is_admin,
                'telegram_id': str(tg_id)
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