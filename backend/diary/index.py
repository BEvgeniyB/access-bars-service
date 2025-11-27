import json
import os
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from decimal import Decimal
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Diary API для управления услугами, записями и расписанием владельца
    Args: event - dict с httpMethod, body, queryStringParameters, pathParams
          context - object с request_id, function_name
    Returns: HTTP response dict с данными diary
    '''
    method: str = event.get('httpMethod', 'GET')
    path_params = event.get('pathParams', {})
    query_params = event.get('queryStringParameters', {})
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Telegram-Id, X-User-Role',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = event.get('headers', {})
    telegram_id = headers.get('X-Telegram-Id') or headers.get('x-telegram-id')
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return error_response('DATABASE_URL not configured', 500)
    
    conn = psycopg2.connect(dsn)
    
    try:
        action = query_params.get('action', '')
        
        if method == 'GET' and action == 'users':
            return get_users(conn, telegram_id)
        elif method == 'GET' and action == 'services':
            return get_services(conn, telegram_id)
        elif method == 'POST' and action == 'services':
            body = json.loads(event.get('body', '{}'))
            return create_service(conn, telegram_id, body)
        elif method == 'PUT' and action == 'services':
            service_id = path_params.get('id')
            body = json.loads(event.get('body', '{}'))
            return update_service(conn, telegram_id, service_id, body)
        elif method == 'DELETE' and action == 'services':
            service_id = path_params.get('id')
            return delete_service(conn, telegram_id, service_id)
        elif method == 'GET' and action == 'bookings':
            return get_bookings(conn, telegram_id)
        elif method == 'POST' and action == 'bookings':
            body = json.loads(event.get('body', '{}'))
            return create_booking(conn, telegram_id, body)
        elif method == 'PUT' and action == 'bookings':
            booking_id = path_params.get('id')
            body = json.loads(event.get('body', '{}'))
            return update_booking(conn, telegram_id, booking_id, body)
        elif method == 'GET' and action == 'schedule':
            return get_schedule(conn, telegram_id)
        elif method == 'POST' and action == 'schedule':
            body = json.loads(event.get('body', '{}'))
            return update_schedule(conn, telegram_id, body)
        elif method == 'GET' and action == 'settings':
            return get_settings(conn, telegram_id)
        elif method == 'POST' and action == 'settings':
            body = json.loads(event.get('body', '{}'))
            return update_settings(conn, telegram_id, body)
        else:
            return error_response(f'Unknown action: {action}', 400)
    
    finally:
        conn.close()


def get_user_by_telegram(conn, telegram_id: str) -> Optional[Dict[str, Any]]:
    '''Получить пользователя по telegram_id'''
    if not telegram_id:
        return None
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            'SELECT id, telegram_id, role, name, phone, email FROM t_p89870318_access_bars_service.diary_users WHERE telegram_id = %s',
            (int(telegram_id),)
        )
        result = cur.fetchone()
        return dict(result) if result else None


def get_users(conn, telegram_id: str) -> Dict[str, Any]:
    '''Список пользователей владельца'''
    user = get_user_by_telegram(conn, telegram_id)
    if not user or user['role'] != 'owner':
        return error_response('Access denied', 403)
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            SELECT u.id, u.telegram_id, u.role, u.name, u.phone, u.email, u.created_at
            FROM t_p89870318_access_bars_service.diary_users u
            LEFT JOIN t_p89870318_access_bars_service.diary_clients dc ON u.id = dc.client_id
            WHERE dc.owner_id = %s OR u.id = %s
            ORDER BY u.created_at DESC
        ''', (user['id'], user['id']))
        users = [dict(row) for row in cur.fetchall()]
    
    return success_response({'users': users})


def get_services(conn, telegram_id: str) -> Dict[str, Any]:
    '''Список услуг владельца'''
    user = get_user_by_telegram(conn, telegram_id)
    if not user:
        return error_response('User not found', 404)
    
    owner_id = user['id'] if user['role'] == 'owner' else None
    
    if not owner_id:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                'SELECT owner_id FROM t_p89870318_access_bars_service.diary_clients WHERE client_id = %s',
                (user['id'],)
            )
            result = cur.fetchone()
            if result:
                owner_id = result['owner_id']
    
    if not owner_id:
        return error_response('Owner not found', 404)
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            SELECT id, name, duration_minutes, price, description, active, created_at
            FROM t_p89870318_access_bars_service.diary_services
            WHERE owner_id = %s AND active = true
            ORDER BY created_at DESC
        ''', (owner_id,))
        services = [dict(row) for row in cur.fetchall()]
    
    return success_response({'services': services})


def create_service(conn, telegram_id: str, body: Dict[str, Any]) -> Dict[str, Any]:
    '''Создание новой услуги'''
    user = get_user_by_telegram(conn, telegram_id)
    if not user or user['role'] != 'owner':
        return error_response('Access denied', 403)
    
    name = body.get('name')
    duration = body.get('duration_minutes')
    price = body.get('price')
    description = body.get('description', '')
    
    if not name or not duration or not price:
        return error_response('Missing required fields', 400)
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            INSERT INTO t_p89870318_access_bars_service.diary_services 
            (owner_id, name, duration_minutes, price, description, active, created_at)
            VALUES (%s, %s, %s, %s, %s, true, NOW())
            RETURNING id, name, duration_minutes, price, description, active, created_at
        ''', (user['id'], name, duration, price, description))
        service = dict(cur.fetchone())
        conn.commit()
    
    return success_response({'service': service}, 201)


def update_service(conn, telegram_id: str, service_id: str, body: Dict[str, Any]) -> Dict[str, Any]:
    '''Обновление услуги'''
    user = get_user_by_telegram(conn, telegram_id)
    if not user or user['role'] != 'owner':
        return error_response('Access denied', 403)
    
    if not service_id:
        return error_response('Service ID required', 400)
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            'SELECT owner_id FROM t_p89870318_access_bars_service.diary_services WHERE id = %s',
            (int(service_id),)
        )
        result = cur.fetchone()
        if not result or result['owner_id'] != user['id']:
            return error_response('Service not found', 404)
        
        update_fields = []
        values = []
        
        if 'name' in body:
            update_fields.append('name = %s')
            values.append(body['name'])
        if 'duration_minutes' in body:
            update_fields.append('duration_minutes = %s')
            values.append(body['duration_minutes'])
        if 'price' in body:
            update_fields.append('price = %s')
            values.append(body['price'])
        if 'description' in body:
            update_fields.append('description = %s')
            values.append(body['description'])
        if 'active' in body:
            update_fields.append('active = %s')
            values.append(body['active'])
        
        if not update_fields:
            return error_response('No fields to update', 400)
        
        values.append(int(service_id))
        
        cur.execute(f'''
            UPDATE t_p89870318_access_bars_service.diary_services 
            SET {', '.join(update_fields)}
            WHERE id = %s
            RETURNING id, name, duration_minutes, price, description, active, created_at
        ''', values)
        service = dict(cur.fetchone())
        conn.commit()
    
    return success_response({'service': service})


def delete_service(conn, telegram_id: str, service_id: str) -> Dict[str, Any]:
    '''Удаление (деактивация) услуги'''
    user = get_user_by_telegram(conn, telegram_id)
    if not user or user['role'] != 'owner':
        return error_response('Access denied', 403)
    
    if not service_id:
        return error_response('Service ID required', 400)
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            'SELECT owner_id FROM t_p89870318_access_bars_service.diary_services WHERE id = %s',
            (int(service_id),)
        )
        result = cur.fetchone()
        if not result or result['owner_id'] != user['id']:
            return error_response('Service not found', 404)
        
        cur.execute(
            'UPDATE t_p89870318_access_bars_service.diary_services SET active = false WHERE id = %s',
            (int(service_id),)
        )
        conn.commit()
    
    return success_response({'message': 'Service deleted'})


def get_bookings(conn, telegram_id: str) -> Dict[str, Any]:
    '''Список записей'''
    user = get_user_by_telegram(conn, telegram_id)
    if not user:
        return error_response('User not found', 404)
    
    return success_response({'bookings': []})


def create_booking(conn, telegram_id: str, body: Dict[str, Any]) -> Dict[str, Any]:
    '''Создание записи'''
    user = get_user_by_telegram(conn, telegram_id)
    if not user:
        return error_response('User not found', 404)
    
    service_id = body.get('service_id')
    start_time = body.get('start_time')
    notes = body.get('notes', '')
    
    if not service_id or not start_time:
        return error_response('Missing required fields', 400)
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            'SELECT duration_minutes FROM t_p89870318_access_bars_service.diary_services WHERE id = %s',
            (service_id,)
        )
        result = cur.fetchone()
        if not result:
            return error_response('Service not found', 404)
        
        duration = result['duration_minutes']
        start_dt = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
        end_dt = start_dt + timedelta(minutes=duration)
        
        cur.execute('''
            INSERT INTO t_p89870318_access_bars_service.diary_bookings 
            (service_id, client_id, start_time, end_time, status, notes, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, NOW())
            RETURNING id, service_id, client_id, start_time, end_time, status, notes, created_at
        ''', (service_id, user['id'], start_dt, end_dt, 'pending', notes))
        booking = dict(cur.fetchone())
        conn.commit()
    
    return success_response({'booking': booking}, 201)


def update_booking(conn, telegram_id: str, booking_id: str, body: Dict[str, Any]) -> Dict[str, Any]:
    '''Обновление статуса записи'''
    user = get_user_by_telegram(conn, telegram_id)
    if not user:
        return error_response('User not found', 404)
    
    if not booking_id:
        return error_response('Booking ID required', 400)
    
    status = body.get('status')
    if not status:
        return error_response('Status required', 400)
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            SELECT b.client_id, s.owner_id
            FROM t_p89870318_access_bars_service.diary_bookings b
            JOIN t_p89870318_access_bars_service.diary_services s ON b.service_id = s.id
            WHERE b.id = %s
        ''', (int(booking_id),))
        result = cur.fetchone()
        
        if not result:
            return error_response('Booking not found', 404)
        
        if user['role'] != 'owner' and result['client_id'] != user['id']:
            return error_response('Access denied', 403)
        
        cur.execute('''
            UPDATE t_p89870318_access_bars_service.diary_bookings 
            SET status = %s
            WHERE id = %s
            RETURNING id, service_id, client_id, start_time, end_time, status, notes, created_at
        ''', (status, int(booking_id)))
        booking = dict(cur.fetchone())
        conn.commit()
    
    return success_response({'booking': booking})


def get_schedule(conn, telegram_id: str) -> Dict[str, Any]:
    '''Получить расписание владельца'''
    user = get_user_by_telegram(conn, telegram_id)
    if not user:
        return error_response('User not found', 404)
    
    return success_response({'schedule': []})


def update_schedule(conn, telegram_id: str, body: Dict[str, Any]) -> Dict[str, Any]:
    '''Обновить расписание владельца'''
    user = get_user_by_telegram(conn, telegram_id)
    if not user or user['role'] != 'owner':
        return error_response('Access denied', 403)
    
    schedule = body.get('schedule', [])
    if not schedule:
        return error_response('Schedule required', 400)
    
    with conn.cursor() as cur:
        cur.execute(
            'DELETE FROM t_p89870318_access_bars_service.diary_week_schedule WHERE owner_id = %s',
            (user['id'],)
        )
        
        for item in schedule:
            cur.execute('''
                INSERT INTO t_p89870318_access_bars_service.diary_week_schedule 
                (owner_id, day_of_week, start_time, end_time, is_working)
                VALUES (%s, %s, %s, %s, %s)
            ''', (user['id'], item['day_of_week'], item['start_time'], item['end_time'], item['is_working']))
        
        conn.commit()
    
    return success_response({'message': 'Schedule updated'})


def get_settings(conn, telegram_id: str) -> Dict[str, Any]:
    '''Получить настройки владельца'''
    user = get_user_by_telegram(conn, telegram_id)
    if not user or user['role'] != 'owner':
        return error_response('Access denied', 403)
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            'SELECT slot_duration_minutes, booking_advance_days, auto_confirm FROM t_p89870318_access_bars_service.diary_settings WHERE owner_id = %s',
            (user['id'],)
        )
        result = cur.fetchone()
        settings = dict(result) if result else {'slot_duration_minutes': 30, 'booking_advance_days': 30, 'auto_confirm': False}
    
    return success_response({'settings': settings})


def update_settings(conn, telegram_id: str, body: Dict[str, Any]) -> Dict[str, Any]:
    '''Обновить настройки владельца'''
    user = get_user_by_telegram(conn, telegram_id)
    if not user or user['role'] != 'owner':
        return error_response('Access denied', 403)
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            'SELECT owner_id FROM t_p89870318_access_bars_service.diary_settings WHERE owner_id = %s',
            (user['id'],)
        )
        exists = cur.fetchone()
        
        if exists:
            update_fields = []
            values = []
            
            if 'slot_duration_minutes' in body:
                update_fields.append('slot_duration_minutes = %s')
                values.append(body['slot_duration_minutes'])
            if 'booking_advance_days' in body:
                update_fields.append('booking_advance_days = %s')
                values.append(body['booking_advance_days'])
            if 'auto_confirm' in body:
                update_fields.append('auto_confirm = %s')
                values.append(body['auto_confirm'])
            
            values.append(user['id'])
            
            cur.execute(f'''
                UPDATE t_p89870318_access_bars_service.diary_settings 
                SET {', '.join(update_fields)}
                WHERE owner_id = %s
                RETURNING slot_duration_minutes, booking_advance_days, auto_confirm
            ''', values)
        else:
            cur.execute('''
                INSERT INTO t_p89870318_access_bars_service.diary_settings 
                (owner_id, slot_duration_minutes, booking_advance_days, auto_confirm)
                VALUES (%s, %s, %s, %s)
                RETURNING slot_duration_minutes, booking_advance_days, auto_confirm
            ''', (user['id'], body.get('slot_duration_minutes', 30), body.get('booking_advance_days', 30), body.get('auto_confirm', False)))
        
        settings = dict(cur.fetchone())
        conn.commit()
    
    return success_response({'settings': settings})


def decimal_default(obj):
    '''JSON serializer для Decimal и datetime'''
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f'Object of type {type(obj)} is not JSON serializable')


def success_response(data: Dict[str, Any], status: int = 200) -> Dict[str, Any]:
    '''Успешный ответ'''
    return {
        'statusCode': status,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps(data, default=decimal_default)
    }


def error_response(message: str, status: int = 400) -> Dict[str, Any]:
    '''Ответ с ошибкой'''
    return {
        'statusCode': status,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'error': message})
    }