'''
Business: CRUD API для админ-панели управления чакрами с правами доступа
Args: event - dict с httpMethod, headers (X-Auth-Token), body, queryStringParameters
      context - object с request_id
Returns: HTTP response с данными или результатом операции
'''

import json
import os
import psycopg2
from typing import Dict, Any, Optional, List
import jwt
from datetime import datetime

SCHEMA = 't_p89870318_access_bars_service'

TABLES = {
    'chakras': ['id', 'name', 'color', 'position', 'right_statement', 'description'],
    'chakra_concepts': ['id', 'chakra_id', 'concept', 'category', 'user_id'],
    'chakra_questions': ['id', 'chakra_id', 'question', 'question_type', 'user_id'],
    'chakra_responsibilities': ['id', 'chakra_id', 'responsibility', 'user_id'],
    'chakra_sciences': ['id', 'chakra_id', 'science_name', 'description', 'user_id'],
    'chakra_organs': ['id', 'chakra_id', 'organ_name', 'description', 'user_id'],
    'users': ['id', 'name', 'email', 'role', 'is_admin', 'telegram_id', 'telegram_username', 'chakra_id']
}

def verify_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        jwt_secret = os.environ.get('ADMIN_TOKEN', 'default-secret-key')
        payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
        return payload
    except:
        return None

def log_change(cur, user_id: int, table: str, record_id: int, field: str, old_val: Any, new_val: Any):
    if table == 'chakras':
        chakra_id = record_id
    else:
        cur.execute(f'SELECT chakra_id FROM {SCHEMA}.{table} WHERE id = %s', (record_id,))
        result = cur.fetchone()
        chakra_id = result[0] if result else None
    
    if chakra_id:
        cur.execute(
            f'''INSERT INTO {SCHEMA}.chakra_edit_history 
                (chakra_id, user_id, field_name, old_value, new_value) 
                VALUES (%s, %s, %s, %s, %s)''',
            (chakra_id, user_id, f'{table}.{field}', str(old_val), str(new_val))
        )

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = event.get('headers', {})
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
    
    if not token:
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Требуется X-Auth-Token'})
        }
    
    user_data = verify_token(token)
    if not user_data:
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Неверный токен'})
        }
    
    user_id = user_data['user_id']
    is_admin = user_data.get('is_admin', False)
    
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
        if method == 'GET':
            return handle_get(cur, event, user_id, is_admin)
        elif method == 'POST':
            return handle_post(cur, conn, event, user_id, is_admin)
        elif method == 'PUT':
            return handle_put(cur, conn, event, user_id, is_admin)
        elif method == 'DELETE':
            return handle_delete(cur, conn, event, user_id, is_admin)
        else:
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Method not allowed'})
            }
    finally:
        cur.close()
        conn.close()

def handle_get(cur, event: Dict[str, Any], user_id: int, is_admin: bool) -> Dict[str, Any]:
    params = event.get('queryStringParameters', {}) or {}
    table = params.get('table')
    target_user_id = params.get('user_id')
    
    if table == 'users' and is_admin:
        cur.execute(f'SELECT id, name, email, role, is_admin, telegram_id, telegram_username, chakra_id FROM {SCHEMA}.users')
        users = cur.fetchall()
        result = [{'id': u[0], 'name': u[1], 'email': u[2], 'role': u[3], 'is_admin': u[4], 'telegram_id': u[5], 'telegram_username': u[6], 'chakra_id': u[7]} for u in users]
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'users': result})
        }
    
    if table == 'history' and is_admin:
        limit = params.get('limit', '100')
        query = f'''
            SELECT h.id, h.chakra_id, h.user_id, u.name as user_name, 
                   h.field_name, h.old_value, h.new_value, h.edited_at,
                   c.name as chakra_name
            FROM {SCHEMA}.chakra_edit_history h
            LEFT JOIN {SCHEMA}.users u ON h.user_id = u.id
            LEFT JOIN {SCHEMA}.chakras c ON h.chakra_id = c.id
            ORDER BY h.edited_at DESC
            LIMIT %s
        '''
        cur.execute(query, (int(limit),))
        rows = cur.fetchall()
        history = [{
            'id': r[0], 'chakra_id': r[1], 'user_id': r[2], 'user_name': r[3],
            'field_name': r[4], 'old_value': r[5], 'new_value': r[6], 
            'edited_at': r[7].isoformat() if r[7] else None, 'chakra_name': r[8]
        } for r in rows]
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'history': history})
        }
    
    if not table or table not in TABLES:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Укажите корректную таблицу'})
        }
    
    columns = TABLES[table]
    chakra_id_param = params.get('chakra_id')
    
    if is_admin and target_user_id and chakra_id_param:
        if 'user_id' in columns and 'chakra_id' in columns:
            cur.execute(f'SELECT * FROM {SCHEMA}.{table} WHERE user_id = %s AND chakra_id = %s', (target_user_id, chakra_id_param))
        elif 'user_id' in columns:
            cur.execute(f'SELECT * FROM {SCHEMA}.{table} WHERE user_id = %s', (target_user_id,))
        elif 'chakra_id' in columns:
            cur.execute(f'SELECT * FROM {SCHEMA}.{table} WHERE chakra_id = %s', (chakra_id_param,))
        else:
            cur.execute(f'SELECT * FROM {SCHEMA}.{table}')
    elif is_admin and target_user_id:
        if 'user_id' in columns:
            cur.execute(f'SELECT * FROM {SCHEMA}.{table} WHERE user_id = %s', (target_user_id,))
        else:
            cur.execute(f'SELECT * FROM {SCHEMA}.{table}')
    elif is_admin and chakra_id_param:
        if 'chakra_id' in columns:
            cur.execute(f'SELECT * FROM {SCHEMA}.{table} WHERE chakra_id = %s', (chakra_id_param,))
        else:
            cur.execute(f'SELECT * FROM {SCHEMA}.{table}')
    elif is_admin:
        cur.execute(f'SELECT * FROM {SCHEMA}.{table}')
    else:
        if 'user_id' in columns:
            cur.execute(f'SELECT * FROM {SCHEMA}.{table} WHERE user_id = %s OR user_id IS NULL', (user_id,))
        else:
            cur.execute(f'SELECT * FROM {SCHEMA}.{table}')
    
    rows = cur.fetchall()
    result = []
    for row in rows:
        item = {}
        for i, col in enumerate(columns):
            item[col] = row[i] if i < len(row) else None
        result.append(item)
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({table: result})
    }

def handle_post(cur, conn, event: Dict[str, Any], user_id: int, is_admin: bool) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    table = body_data.get('table')
    data = body_data.get('data', {})
    
    if not table or table not in TABLES:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Укажите корректную таблицу'})
        }
    
    if 'user_id' in TABLES[table] and not is_admin:
        data['user_id'] = user_id
    
    columns = [k for k in data.keys() if k in TABLES[table]]
    values = [data[k] for k in columns]
    placeholders = ', '.join(['%s'] * len(values))
    cols_str = ', '.join(columns)
    
    query = f'INSERT INTO {SCHEMA}.{table} ({cols_str}) VALUES ({placeholders}) RETURNING id'
    cur.execute(query, values)
    new_id = cur.fetchone()[0]
    conn.commit()
    
    for col in columns:
        log_change(cur, user_id, table, new_id, col, None, data[col])
    conn.commit()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'id': new_id})
    }

def handle_put(cur, conn, event: Dict[str, Any], user_id: int, is_admin: bool) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    table = body_data.get('table')
    record_id = body_data.get('id')
    data = body_data.get('data', {})
    
    if not table or table not in TABLES or not record_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Укажите table и id'})
        }
    
    if not is_admin and 'user_id' in TABLES[table]:
        cur.execute(f'SELECT user_id FROM {SCHEMA}.{table} WHERE id = %s', (record_id,))
        row = cur.fetchone()
        if not row or (row[0] and row[0] != user_id):
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Нет прав на изменение'})
            }
    
    cur.execute(f'SELECT * FROM {SCHEMA}.{table} WHERE id = %s', (record_id,))
    old_row = cur.fetchone()
    if not old_row:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Запись не найдена'})
        }
    
    columns = [k for k in data.keys() if k in TABLES[table] and k != 'id']
    if not columns:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Нет полей для обновления'})
        }
    
    set_clause = ', '.join([f'{col} = %s' for col in columns])
    values = [data[col] for col in columns]
    values.append(record_id)
    
    cur.execute(f'UPDATE {SCHEMA}.{table} SET {set_clause} WHERE id = %s', values)
    conn.commit()
    
    old_data_dict = {TABLES[table][i]: old_row[i] for i in range(len(TABLES[table])) if i < len(old_row)}
    for col in columns:
        old_val = old_data_dict.get(col)
        new_val = data[col]
        if old_val != new_val:
            log_change(cur, user_id, table, record_id, col, old_val, new_val)
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }

def handle_delete(cur, conn, event: Dict[str, Any], user_id: int, is_admin: bool) -> Dict[str, Any]:
    params = event.get('queryStringParameters', {}) or {}
    table = params.get('table')
    record_id = params.get('id')
    
    if not table or table not in TABLES or not record_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Укажите table и id'})
        }
    
    if not is_admin and 'user_id' in TABLES[table]:
        cur.execute(f'SELECT user_id FROM {SCHEMA}.{table} WHERE id = %s', (record_id,))
        row = cur.fetchone()
        if not row or (row[0] and row[0] != user_id):
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Нет прав на удаление'})
            }
    
    cur.execute(f'DELETE FROM {SCHEMA}.{table} WHERE id = %s', (record_id,))
    conn.commit()
    
    log_change(cur, user_id, table, int(record_id), 'deleted', 'exists', 'deleted')
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }