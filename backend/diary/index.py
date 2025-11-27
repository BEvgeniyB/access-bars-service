'''
Business: Единый API для управления записями, событиями, услугами и клиентами
Args: event с httpMethod, body, queryStringParameters, pathParams; context с request_id
Returns: HTTP response с данными в зависимости от resource
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import urllib.request

SCHEMA = 't_p89870318_access_bars_service'

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    resource = event.get('queryStringParameters', {}).get('resource', 'bookings')
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    
    try:
        if resource == 'debug':
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('SELECT CURRENT_USER as user, SESSION_USER as session, version() as version')
                result = cur.fetchone()
                
                cur.execute(f"SELECT grantee, privilege_type FROM information_schema.role_table_grants WHERE table_schema = '{SCHEMA}' AND table_name = 'diary_bookings' LIMIT 10")
                grants = cur.fetchall()
                
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'current_user': result['user'],
                    'session_user': result['session'],
                    'db_version': result['version'],
                    'grants': [dict(g) for g in grants],
                    'database_url_prefix': db_url[:30] if db_url else 'not set'
                })
            }
        
        if resource == 'bookings':
            if method == 'GET':
                owner_id = event.get('queryStringParameters', {}).get('owner_id')
                booking_date = event.get('queryStringParameters', {}).get('date')
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    query = f'SELECT * FROM {SCHEMA}.diary_bookings LIMIT 10'
                    cur.execute(query)
                    
                    bookings = cur.fetchall()
                    
                    result = []
                    for booking in bookings:
                        result.append({
                            'id': booking['id'],
                            'client_id': booking.get('client_id'),
                            'service_id': booking.get('service_id'),
                            'time': booking['start_time'].strftime('%H:%M') if booking.get('start_time') else '00:00',
                            'date': booking['booking_date'].strftime('%Y-%m-%d') if booking.get('booking_date') else '',
                            'status': booking.get('status', 'pending'),
                            'end_time': booking['end_time'].strftime('%H:%M') if booking.get('end_time') else '00:00'
                        })
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'bookings': result})
                    }
            
            elif method == 'POST':
                body_data = json.loads(event.get('body', '{}'))
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    query = f'''
                        INSERT INTO {SCHEMA}.diary_bookings 
                        (client_id, service_id, owner_id, booking_date, start_time, end_time, status)
                        VALUES ({int(body_data['client_id'])}, {int(body_data['service_id'])}, {int(body_data['owner_id'])}, '{body_data['booking_date']}', '{body_data['start_time']}', '{body_data['end_time']}', '{body_data.get('status', 'pending')}')
                        RETURNING id
                    '''
                    cur.execute(query)
                    
                    booking_id = cur.fetchone()['id']
                    conn.commit()
                    
                    cur.execute(f'''
                        SELECT 
                            b.id as booking_id,
                            b.booking_date,
                            b.start_time,
                            u.name as client_name,
                            u.phone as client_phone,
                            u.email as client_email,
                            s.name as service_name,
                            s.duration_minutes,
                            s.price
                        FROM {SCHEMA}.diary_bookings b
                        LEFT JOIN {SCHEMA}.diary_clients c ON b.client_id = c.id
                        LEFT JOIN {SCHEMA}.diary_users u ON c.user_id = u.id
                        LEFT JOIN {SCHEMA}.diary_services s ON b.service_id = s.id
                        WHERE b.id = {int(booking_id)}
                    ''')
                    
                    booking_data = cur.fetchone()
                    
                    if booking_data:
                        try:
                            telegram_bot_url = 'https://functions.poehali.dev/07b2b89b-011e-472f-b782-0f844489a891'
                            notification_payload = {
                                'booking_id': booking_data['booking_id'],
                                'client_name': booking_data['client_name'] or 'Не указано',
                                'client_phone': booking_data['client_phone'] or 'Не указан',
                                'client_email': booking_data['client_email'] or 'не указан',
                                'service_name': booking_data['service_name'],
                                'duration': booking_data['duration_minutes'],
                                'price': str(booking_data['price']).replace('₽', '').strip(),
                                'date': booking_data['booking_date'].strftime('%d.%m.%Y'),
                                'time': booking_data['start_time'].strftime('%H:%M')
                            }
                            
                            data = json.dumps(notification_payload).encode('utf-8')
                            req = urllib.request.Request(
                                telegram_bot_url,
                                data=data,
                                headers={'Content-Type': 'application/json'}
                            )
                            urllib.request.urlopen(req, timeout=5)
                        except Exception as e:
                            print(f'Failed to send Telegram notification: {e}')
                    
                    return {
                        'statusCode': 201,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'id': booking_id, 'message': 'Booking created'})
                    }
            
            elif method == 'PUT':
                body_data = json.loads(event.get('body', '{}'))
                booking_id = body_data.get('id')
                
                with conn.cursor() as cur:
                    query = f'''
                        UPDATE {SCHEMA}.diary_bookings 
                        SET status = '{body_data['status']}', updated_at = CURRENT_TIMESTAMP
                        WHERE id = {int(booking_id)}
                    '''
                    cur.execute(query)
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'message': 'Booking updated'})
                    }
        
        elif resource == 'events':
            if method == 'GET':
                owner_id = event.get('queryStringParameters', {}).get('owner_id')
                event_date = event.get('queryStringParameters', {}).get('date')
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    query = f'SELECT * FROM {SCHEMA}.diary_calendar_events LIMIT 100'
                    cur.execute(query)
                    
                    events = cur.fetchall()
                    
                    result = []
                    for evt in events:
                        result.append({
                            'id': evt['id'],
                            'type': evt['event_type'],
                            'title': evt['title'],
                            'date': evt['event_date'].strftime('%Y-%m-%d'),
                            'startTime': evt['start_time'].strftime('%H:%M'),
                            'endTime': evt['end_time'].strftime('%H:%M'),
                            'description': evt['description']
                        })
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'events': result})
                }
            
            elif method == 'POST':
                try:
                    body_data = json.loads(event.get('body', '{}'))
                    
                    required_fields = ['owner_id', 'event_date', 'start_time', 'end_time', 'title', 'event_type']
                    missing = [f for f in required_fields if f not in body_data or not body_data[f]]
                    if missing:
                        return {
                            'statusCode': 400,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'isBase64Encoded': False,
                            'body': json.dumps({
                                'error': f'Missing required fields: {", ".join(missing)}'
                            })
                        }
                    
                    with conn.cursor(cursor_factory=RealDictCursor) as cur:
                        cur.execute(f'''
                            SELECT b.id, u.name as client_name, s.name as service_name, 
                                   TO_CHAR(b.start_time, 'HH24:MI') as start_time,
                                   TO_CHAR(b.end_time, 'HH24:MI') as end_time
                            FROM {SCHEMA}.diary_bookings b
                            LEFT JOIN {SCHEMA}.diary_clients c ON b.client_id = c.id
                            LEFT JOIN {SCHEMA}.diary_users u ON c.user_id = u.id
                            LEFT JOIN {SCHEMA}.diary_services s ON b.service_id = s.id
                            WHERE b.owner_id = {int(body_data['owner_id'])} 
                            AND b.booking_date = '{body_data['event_date']}' 
                            AND b.status = 'confirmed'
                            AND b.start_time < '{body_data['end_time']}'::time 
                            AND b.end_time > '{body_data['start_time']}'::time
                        ''')
                        
                        conflicting_bookings = cur.fetchall()
                        
                        if conflicting_bookings and not body_data.get('force', False):
                            conflicts = []
                            for booking in conflicting_bookings:
                                conflicts.append({
                                    'id': booking['id'],
                                    'client': booking['client_name'],
                                    'service': booking['service_name'],
                                    'startTime': booking['start_time'],
                                    'endTime': booking['end_time']
                                })
                            
                            return {
                                'statusCode': 409,
                                'headers': {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': '*'
                                },
                                'isBase64Encoded': False,
                                'body': json.dumps({
                                    'conflict': True,
                                    'bookings': conflicts,
                                    'message': 'Событие конфликтует с подтверждёнными записями'
                                })
                            }
                        
                        if body_data.get('force', False) and conflicting_bookings:
                            booking_ids = ','.join([str(int(b['id'])) for b in conflicting_bookings])
                            cur.execute(f'''
                                UPDATE {SCHEMA}.diary_bookings 
                                SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
                                WHERE id IN ({booking_ids})
                            ''')
                        
                        description = body_data.get('description', '').replace("'", "''")
                        title = body_data['title'].replace("'", "''")
                        
                        query = f'''
                            INSERT INTO {SCHEMA}.diary_calendar_events 
                            (owner_id, event_type, title, event_date, start_time, end_time, description)
                            VALUES ({int(body_data['owner_id'])}, '{body_data['event_type']}', '{title}', '{body_data['event_date']}', '{body_data['start_time']}', '{body_data['end_time']}', '{description}')
                            RETURNING id
                        '''
                        cur.execute(query)
                        
                        result = cur.fetchone()
                        event_id = result['id'] if result else None
                    
                    conn.commit()
                    
                    return {
                        'statusCode': 201,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'id': event_id, 'message': 'Event created'})
                    }
                except Exception as e:
                    import traceback
                    error_msg = str(e) if str(e) else repr(e)
                    error_trace = traceback.format_exc()
                    return {
                        'statusCode': 500,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({
                            'error': f'Server error: {error_msg}',
                            'type': type(e).__name__,
                            'trace': error_trace[:500]
                        })
                    }
            
            elif method == 'DELETE':
                event_id = event.get('queryStringParameters', {}).get('id')
                
                with conn.cursor() as cur:
                    query = f'DELETE FROM {SCHEMA}.diary_calendar_events WHERE id = {int(event_id)}'
                    cur.execute(query)
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'message': 'Event deleted'})
                    }
        
        elif resource == 'services':
            if method == 'GET':
                owner_id = event.get('queryStringParameters', {}).get('owner_id')
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    query = f'SELECT * FROM {SCHEMA}.diary_services'
                    if owner_id:
                        query += f' WHERE owner_id = {int(owner_id)}'
                    query += ' ORDER BY id'
                    
                    cur.execute(query)
                    services = cur.fetchall()
                    
                    result = []
                    for service in services:
                        result.append({
                            'id': service['id'],
                            'name': service['name'],
                            'duration_minutes': service['duration_minutes'],
                            'price': str(service['price']),
                            'active': service.get('active', True),
                            'description': service.get('description', '')
                        })
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'services': result})
                    }
            
            elif method == 'POST':
                body_data = json.loads(event.get('body', '{}'))
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    name = body_data['name'].replace("'", "''")
                    description = body_data.get('description', '').replace("'", "''")
                    
                    query = f'''
                        INSERT INTO {SCHEMA}.diary_services 
                        (owner_id, name, description, duration_minutes, price)
                        VALUES ({int(body_data['owner_id'])}, '{name}', '{description}', {int(body_data['duration_minutes'])}, {float(body_data['price'])})
                        RETURNING id
                    '''
                    cur.execute(query)
                    service_id = cur.fetchone()['id']
                    conn.commit()
                    
                    return {
                        'statusCode': 201,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'id': service_id, 'message': 'Service created'})
                    }
            
            elif method == 'PUT':
                body_data = json.loads(event.get('body', '{}'))
                service_id = body_data.get('id')
                
                with conn.cursor() as cur:
                    name = body_data['name'].replace("'", "''")
                    description = body_data.get('description', '').replace("'", "''")
                    
                    query = f'''
                        UPDATE {SCHEMA}.diary_services 
                        SET name = '{name}', 
                            description = '{description}',
                            duration_minutes = {int(body_data['duration_minutes'])},
                            price = {float(body_data['price'])},
                            updated_at = CURRENT_TIMESTAMP
                        WHERE id = {int(service_id)}
                    '''
                    cur.execute(query)
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'message': 'Service updated'})
                    }
            
            elif method == 'DELETE':
                service_id = event.get('queryStringParameters', {}).get('id')
                
                with conn.cursor() as cur:
                    query = f'DELETE FROM {SCHEMA}.diary_services WHERE id = {int(service_id)}'
                    cur.execute(query)
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'message': 'Service deleted'})
                    }
        
        elif resource == 'admin_data':
            if method == 'GET':
                owner_id = event.get('queryStringParameters', {}).get('owner_id', '1')
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(f'SELECT * FROM {SCHEMA}.diary_bookings WHERE owner_id = {int(owner_id)} LIMIT 100')
                    bookings_raw = cur.fetchall()
                    bookings = [{
                        'id': b['id'],
                        'client_id': b.get('client_id'),
                        'service_id': b.get('service_id'),
                        'time': b['start_time'].strftime('%H:%M') if b.get('start_time') else '00:00',
                        'date': b['booking_date'].strftime('%Y-%m-%d') if b.get('booking_date') else '',
                        'status': b.get('status', 'pending'),
                        'end_time': b['end_time'].strftime('%H:%M') if b.get('end_time') else '00:00'
                    } for b in bookings_raw]
                    
                    cur.execute(f'SELECT * FROM {SCHEMA}.diary_services WHERE owner_id = {int(owner_id)} ORDER BY id')
                    services_raw = cur.fetchall()
                    services = [{
                        'id': s['id'],
                        'name': s['name'],
                        'duration_minutes': s['duration_minutes'],
                        'price': str(s['price']),
                        'active': s.get('active', True),
                        'description': s.get('description', '')
                    } for s in services_raw]
                    
                    cur.execute(f'SELECT * FROM {SCHEMA}.diary_clients WHERE owner_id = {int(owner_id)} ORDER BY id')
                    clients_raw = cur.fetchall()
                    clients = [dict(c) for c in clients_raw]
                    
                    cur.execute(f'SELECT * FROM {SCHEMA}.diary_settings WHERE owner_id = {int(owner_id)} LIMIT 1')
                    settings_raw = cur.fetchone()
                    settings = dict(settings_raw) if settings_raw else {}
                    
                    cur.execute(f'SELECT * FROM {SCHEMA}.diary_calendar_events WHERE owner_id = {int(owner_id)} LIMIT 100')
                    events_raw = cur.fetchall()
                    events = [{
                        'id': e['id'],
                        'type': e['event_type'],
                        'title': e['title'],
                        'date': e['event_date'].strftime('%Y-%m-%d'),
                        'startTime': e['start_time'].strftime('%H:%M'),
                        'endTime': e['end_time'].strftime('%H:%M'),
                        'description': e['description']
                    } for e in events_raw]
                    
                    cur.execute(f'SELECT * FROM {SCHEMA}.diary_week_schedule WHERE owner_id = {int(owner_id)} ORDER BY id')
                    week_schedule_raw = cur.fetchall()
                    weekSchedule = [dict(w) for w in week_schedule_raw]
                    
                    cur.execute(f'SELECT * FROM {SCHEMA}.diary_blocked_dates WHERE owner_id = {int(owner_id)} ORDER BY blocked_date')
                    blocked_dates_raw = cur.fetchall()
                    blockedDates = [{
                        'id': bd['id'],
                        'date': bd['blocked_date'].strftime('%Y-%m-%d'),
                        'reason': bd.get('reason', '')
                    } for bd in blocked_dates_raw]
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({
                            'bookings': bookings,
                            'services': services,
                            'clients': clients,
                            'settings': settings,
                            'events': events,
                            'weekSchedule': weekSchedule,
                            'blockedDates': blockedDates
                        })
                    }
        
        elif resource == 'clients':
            if method == 'GET':
                owner_id = event.get('queryStringParameters', {}).get('owner_id')
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    query = f'''
                        SELECT c.id, c.user_id, u.name, u.phone, u.email 
                        FROM {SCHEMA}.diary_clients c
                        JOIN {SCHEMA}.diary_users u ON c.user_id = u.id
                    '''
                    if owner_id:
                        query += f' WHERE c.owner_id = {int(owner_id)}'
                    query += ' ORDER BY u.name'
                    
                    cur.execute(query)
                    clients = cur.fetchall()
                    
                    result = []
                    for client in clients:
                        result.append({
                            'id': client['id'],
                            'user_id': client['user_id'],
                            'name': client['name'],
                            'phone': client['phone'],
                            'email': client['email']
                        })
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'clients': result})
                    }
            
            elif method == 'POST':
                body_data = json.loads(event.get('body', '{}'))
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    name = body_data['name'].replace("'", "''")
                    phone = body_data.get('phone', '').replace("'", "''")
                    email = body_data.get('email', '').replace("'", "''")
                    
                    cur.execute(f'''
                        INSERT INTO {SCHEMA}.diary_users (name, phone, email)
                        VALUES ('{name}', '{phone}', '{email}')
                        RETURNING id
                    ''')
                    user_id = cur.fetchone()['id']
                    
                    cur.execute(f'''
                        INSERT INTO {SCHEMA}.diary_clients (user_id, owner_id)
                        VALUES ({int(user_id)}, {int(body_data['owner_id'])})
                        RETURNING id
                    ''')
                    client_id = cur.fetchone()['id']
                    
                    conn.commit()
                    
                    return {
                        'statusCode': 201,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'id': client_id, 'user_id': user_id, 'message': 'Client created'})
                    }
        
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Invalid resource or method'})
        }
    
    except Exception as e:
        import traceback
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'error': str(e),
                'type': type(e).__name__,
                'trace': traceback.format_exc()[:1000]
            })
        }
    
    finally:
        if conn:
            conn.close()