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

DAY_MAPPING = {
    'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
    'friday': 5, 'saturday': 6, 'sunday': 7
}

DAY_REVERSE_MAPPING = {v: k for k, v in DAY_MAPPING.items()}

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
        
        if resource == 'debug_all':
            owner_id = event.get('queryStringParameters', {}).get('owner_id', '1')
            
            tables_data = {}
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                tables = [
                    'diary_users',
                    'diary_clients', 
                    'diary_services',
                    'diary_bookings',
                    'diary_calendar_events',
                    'diary_week_schedule',
                    'diary_blocked_dates',
                    'diary_settings'
                ]
                
                for table in tables:
                    try:
                        cur.execute(f'SELECT * FROM {SCHEMA}.{table} LIMIT 100')
                        rows = cur.fetchall()
                        
                        serialized_rows = []
                        for row in rows:
                            serialized_row = {}
                            for key, value in dict(row).items():
                                if hasattr(value, 'strftime'):
                                    serialized_row[key] = value.strftime('%Y-%m-%d %H:%M:%S') if hasattr(value, 'hour') else value.strftime('%Y-%m-%d')
                                elif type(value).__name__ == 'Decimal':
                                    serialized_row[key] = str(value)
                                else:
                                    serialized_row[key] = value
                            serialized_rows.append(serialized_row)
                        
                        tables_data[table] = {
                            'count': len(rows),
                            'data': serialized_rows
                        }
                    except Exception as e:
                        tables_data[table] = {
                            'error': str(e),
                            'type': type(e).__name__
                        }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps(tables_data, ensure_ascii=False)
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
                            telegram_bot_url = 'https://functions.poehali.dev/a4a6cfec-c23a-4a91-bf7b-9574e18236fb'
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
                            'title': evt.get('title', ''),
                            'date': evt['start_date'].strftime('%Y-%m-%d') if evt.get('start_date') else '',
                            'startTime': evt['start_time'].strftime('%H:%M') if evt.get('start_time') else '',
                            'endTime': evt['end_time'].strftime('%H:%M') if evt.get('end_time') else '',
                            'description': evt.get('description', '')
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
                    
                    required_fields = ['owner_id', 'start_time', 'end_time', 'title', 'event_type']
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
                        conflicting_bookings = []
                        try:
                            cur.execute(f'''
                                SELECT b.id, u.name as client_name, s.name as service_name, 
                                       TO_CHAR(b.start_time, 'HH24:MI') as start_time,
                                       TO_CHAR(b.end_time, 'HH24:MI') as end_time
                                FROM {SCHEMA}.diary_bookings b
                                LEFT JOIN {SCHEMA}.diary_clients c ON b.client_id = c.id
                                LEFT JOIN {SCHEMA}.diary_users u ON c.user_id = u.id
                                LEFT JOIN {SCHEMA}.diary_services s ON b.service_id = s.id
                                WHERE b.owner_id = {int(body_data['owner_id'])} 
                                AND b.booking_date = '{body_data.get('date', body_data.get('start_date', ''))}'""  
                                AND b.status = 'confirmed'
                                AND b.start_time < '{body_data['end_time']}'::time 
                                AND b.end_time > '{body_data['start_time']}'::time
                            ''')
                            
                            conflicting_bookings = cur.fetchall()
                        except Exception as e:
                            print(f'Warning: Could not check booking conflicts: {e}')
                        
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
                        
                        start_date = body_data.get('date', body_data.get('start_date', ''))
                        if not start_date:
                            return {
                                'statusCode': 400,
                                'headers': {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': '*'
                                },
                                'isBase64Encoded': False,
                                'body': json.dumps({'error': 'Missing required field: date or start_date'})
                            }
                        
                        query = f'''
                            INSERT INTO {SCHEMA}.diary_calendar_events 
                            (owner_id, event_type, title, start_date, start_time, end_time, description)
                            VALUES ({int(body_data['owner_id'])}, '{body_data['event_type']}', '{title}', '{start_date}', '{body_data['start_time']}', '{body_data['end_time']}', '{description}')
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
                    
                    active = 'true' if body_data.get('active', True) else 'false'
                    
                    query = f'''
                        UPDATE {SCHEMA}.diary_services 
                        SET name = '{name}', 
                            description = '{description}',
                            duration_minutes = {int(body_data['duration_minutes'])},
                            price = {float(body_data['price'])},
                            active = {active},
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
                
                bookings = []
                services = []
                clients = []
                settings = {}
                events = []
                weekSchedule = []
                blockedDates = []
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    try:
                        query = f'SELECT * FROM {SCHEMA}.diary_bookings WHERE owner_id = {int(owner_id)} LIMIT 100'
                        cur.execute(query)
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
                    except Exception as e:
                        import traceback
                        print(f'[ERROR] Could not load bookings: {type(e).__name__}: {str(e)}')
                        print(f'[ERROR] Traceback: {traceback.format_exc()}')
                    
                    try:
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
                    except Exception as e:
                        print(f'Warning: Could not load services: {e}')
                    
                    try:
                        cur.execute(f'''
                            SELECT c.id, c.user_id, c.owner_id, c.total_visits, c.last_visit_date, c.created_at,
                                   u.name, u.phone, u.email
                            FROM {SCHEMA}.diary_clients c
                            LEFT JOIN {SCHEMA}.diary_users u ON c.user_id = u.id
                            WHERE c.owner_id = {int(owner_id)} 
                            ORDER BY c.id
                        ''')
                        clients_raw = cur.fetchall()
                        clients = [{
                            'id': c['id'],
                            'user_id': c['user_id'],
                            'owner_id': c['owner_id'],
                            'name': c.get('name', 'Без имени'),
                            'phone': c.get('phone'),
                            'email': c.get('email'),
                            'total_visits': c.get('total_visits', 0),
                            'last_visit_date': c['last_visit_date'].strftime('%Y-%m-%d') if c.get('last_visit_date') else None,
                            'created_at': c['created_at'].strftime('%Y-%m-%d %H:%M:%S') if c.get('created_at') else None
                        } for c in clients_raw]
                    except Exception as e:
                        print(f'Warning: Could not load clients: {e}')
                    
                    try:
                        cur.execute(f'SELECT key, value FROM {SCHEMA}.diary_settings WHERE owner_id = {int(owner_id)}')
                        settings_rows = cur.fetchall()
                        settings = {row['key']: row['value'] for row in settings_rows}
                    except Exception as e:
                        print(f'Warning: Could not load settings: {e}')
                        settings = {}
                    
                    try:
                        cur.execute(f'SELECT * FROM {SCHEMA}.diary_calendar_events WHERE owner_id = {int(owner_id)} LIMIT 100')
                        events_raw = cur.fetchall()
                        events = [{
                            'id': e['id'],
                            'type': e['event_type'],
                            'title': e.get('title', ''),
                            'date': e['start_date'].strftime('%Y-%m-%d') if e.get('start_date') else '',
                            'startTime': e['start_time'].strftime('%H:%M') if e.get('start_time') else '',
                            'endTime': e['end_time'].strftime('%H:%M') if e.get('end_time') else '',
                            'description': e.get('description', '')
                        } for e in events_raw]
                    except Exception as e:
                        print(f'Warning: Could not load events: {e}')
                    
                    try:
                        cur.execute(f'SELECT * FROM {SCHEMA}.diary_week_schedule WHERE owner_id = {int(owner_id)} ORDER BY week_number, day_of_week, start_time')
                        week_schedule_raw = cur.fetchall()
                        weekSchedule = [{
                            'id': w['id'],
                            'dayOfWeek': DAY_REVERSE_MAPPING.get(w['day_of_week'], 'monday'),
                            'startTime': w['start_time'].strftime('%H:%M') if w.get('start_time') else '00:00',
                            'endTime': w['end_time'].strftime('%H:%M') if w.get('end_time') else '00:00',
                            'weekNumber': w.get('week_number', 1),
                            'title': w.get('title', ''),
                            'description': w.get('description', '')
                        } for w in week_schedule_raw]
                    except Exception as e:
                        print(f'Warning: Could not load week schedule: {e}')
                    
                    try:
                        cur.execute(f'SELECT * FROM {SCHEMA}.diary_blocked_dates WHERE owner_id = {int(owner_id)} ORDER BY blocked_date')
                        blocked_dates_raw = cur.fetchall()
                        blockedDates = [{
                            'id': bd['id'],
                            'date': bd['blocked_date'].strftime('%Y-%m-%d'),
                            'reason': bd.get('reason', '')
                        } for bd in blocked_dates_raw]
                    except Exception as e:
                        print(f'Warning: Could not load blocked dates: {e}')
                    
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
        
        elif resource == 'settings':
            if method == 'GET':
                owner_id = event.get('queryStringParameters', {}).get('owner_id', '1')
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(f'SELECT * FROM {SCHEMA}.diary_settings WHERE owner_id = {int(owner_id)}')
                    settings_rows = cur.fetchall()
                    
                    settings = {}
                    for row in settings_rows:
                        settings[row['key']] = row['value']
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'settings': settings})
                    }
            
            elif method == 'PUT':
                body_data = json.loads(event.get('body', '{}'))
                owner_id = body_data.get('owner_id', 1)
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    for key, value in body_data.items():
                        if key == 'owner_id':
                            continue
                        
                        key_escaped = key.replace("'", "''")
                        value_escaped = str(value).replace("'", "''")
                        
                        cur.execute(f"""
                            INSERT INTO {SCHEMA}.diary_settings (owner_id, key, value)
                            VALUES ({int(owner_id)}, '{key_escaped}', '{value_escaped}')
                            ON CONFLICT (owner_id, key) 
                            DO UPDATE SET value = '{value_escaped}'
                        """)
                    
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'message': 'Settings updated'})
                    }
        
        elif resource == 'week_schedule':
            if method == 'GET':
                owner_id = event.get('queryStringParameters', {}).get('owner_id')
                date_param = event.get('queryStringParameters', {}).get('date')
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    query = f'SELECT * FROM {SCHEMA}.diary_week_schedule'
                    if owner_id:
                        query += f' WHERE owner_id = {int(owner_id)}'
                    query += ' ORDER BY week_number, day_of_week, start_time'
                    
                    cur.execute(query)
                    schedules = cur.fetchall()
                    
                    active_cycle_start = None
                    active_week_number = None
                    
                    if date_param and schedules:
                        from datetime import datetime, timedelta
                        
                        target_date = datetime.strptime(date_param, '%Y-%m-%d').date()
                        
                        unique_cycles = {}
                        for schedule in schedules:
                            cycle_date = schedule.get('cycle_start_date')
                            if cycle_date:
                                unique_cycles[cycle_date] = True
                        
                        valid_cycles = [cd for cd in unique_cycles.keys() if cd <= target_date]
                        
                        if valid_cycles:
                            active_cycle_start = max(valid_cycles)
                            
                            days_diff = (target_date - active_cycle_start).days
                            weeks_diff = days_diff // 7
                            
                            active_week_number = (weeks_diff % 2) + 1
                    
                    if date_param and active_cycle_start and active_week_number:
                        result = []
                        for schedule in schedules:
                            if (schedule.get('cycle_start_date') == active_cycle_start and 
                                schedule.get('week_number') == active_week_number):
                                result.append({
                                    'id': schedule['id'],
                                    'dayOfWeek': DAY_REVERSE_MAPPING.get(schedule['day_of_week'], 'monday'),
                                    'startTime': schedule['start_time'].strftime('%H:%M') if schedule.get('start_time') else '00:00',
                                    'endTime': schedule['end_time'].strftime('%H:%M') if schedule.get('end_time') else '00:00',
                                    'weekNumber': schedule.get('week_number', 1),
                                    'title': schedule.get('title', ''),
                                    'description': schedule.get('description', ''),
                                    'cycleStartDate': schedule.get('cycle_start_date').strftime('%Y-%m-%d') if schedule.get('cycle_start_date') else None
                                })
                    else:
                        result = []
                        for schedule in schedules:
                            result.append({
                                'id': schedule['id'],
                                'dayOfWeek': DAY_REVERSE_MAPPING.get(schedule['day_of_week'], 'monday'),
                                'startTime': schedule['start_time'].strftime('%H:%M') if schedule.get('start_time') else '00:00',
                                'endTime': schedule['end_time'].strftime('%H:%M') if schedule.get('end_time') else '00:00',
                                'weekNumber': schedule.get('week_number', 1),
                                'title': schedule.get('title', ''),
                                'description': schedule.get('description', ''),
                                'cycleStartDate': schedule.get('cycle_start_date').strftime('%Y-%m-%d') if schedule.get('cycle_start_date') else None
                            })
                    
                    response_body = {'schedule': result}
                    
                    if date_param:
                        response_body['cycleStartDate'] = active_cycle_start.strftime('%Y-%m-%d') if active_cycle_start else None
                        response_body['weekNumber'] = active_week_number
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps(response_body)
                    }
            
            elif method == 'POST':
                body_data = json.loads(event.get('body', '{}'))
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    title = body_data.get('title', '').replace("'", "''")
                    description = body_data.get('description', '').replace("'", "''")
                    
                    day_of_week_value = body_data.get('day_of_week', 1)
                    if isinstance(day_of_week_value, str):
                        day_of_week_value = DAY_MAPPING.get(day_of_week_value.lower(), 1)
                    else:
                        day_of_week_value = int(day_of_week_value)
                    
                    owner_id = int(body_data['owner_id'])
                    week_number = int(body_data.get('week_number', 1))
                    start_time = body_data['start_time']
                    end_time = body_data['end_time']
                    cycle_start_date = body_data.get('cycle_start_date')
                    
                    cur.execute(f'''
                        SELECT id FROM {SCHEMA}.diary_week_schedule 
                        WHERE owner_id = {owner_id} 
                        AND week_number = {week_number}
                        AND day_of_week = {day_of_week_value}
                        AND start_time = '{start_time}'::time
                        AND end_time = '{end_time}'::time
                        AND cycle_start_date = '{cycle_start_date}'::date
                    ''')
                    existing = cur.fetchone()
                    
                    if existing:
                        return {
                            'statusCode': 409,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'isBase64Encoded': False,
                            'body': json.dumps({'error': 'Такое расписание уже существует', 'duplicate': True})
                        }
                    
                    query = f'''
                        INSERT INTO {SCHEMA}.diary_week_schedule 
                        (owner_id, week_number, day_of_week, start_time, end_time, title, description, cycle_start_date)
                        VALUES (
                            {owner_id}, 
                            {week_number}, 
                            {day_of_week_value}, 
                            '{start_time}', 
                            '{end_time}', 
                            '{title}', 
                            '{description}',
                            '{cycle_start_date}'
                        )
                        RETURNING id
                    '''
                    cur.execute(query)
                    schedule_id = cur.fetchone()['id']
                    conn.commit()
                    
                    return {
                        'statusCode': 201,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'id': schedule_id, 'message': 'Schedule created'})
                    }
            
            elif method == 'DELETE':
                schedule_id = event.get('queryStringParameters', {}).get('id')
                
                with conn.cursor() as cur:
                    query = f'DELETE FROM diary_week_schedule WHERE id = {int(schedule_id)}'
                    cur.execute(query)
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'message': 'Schedule deleted'})
                    }
        
        elif resource == 'blocked_dates':
            if method == 'GET':
                owner_id = event.get('queryStringParameters', {}).get('owner_id')
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    query = f'SELECT * FROM {SCHEMA}.diary_blocked_dates'
                    if owner_id:
                        query += f' WHERE owner_id = {int(owner_id)}'
                    query += ' ORDER BY blocked_date'
                    
                    cur.execute(query)
                    blocked_dates = cur.fetchall()
                    
                    result = []
                    for bd in blocked_dates:
                        result.append({
                            'id': bd['id'],
                            'date': bd['blocked_date'].strftime('%Y-%m-%d'),
                            'reason': bd.get('reason', '')
                        })
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'blockedDates': result})
                    }
            
            elif method == 'POST':
                body_data = json.loads(event.get('body', '{}'))
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    reason = body_data.get('reason', '').replace("'", "''")
                    
                    query = f'''
                        INSERT INTO {SCHEMA}.diary_blocked_dates 
                        (owner_id, blocked_date, reason)
                        VALUES ({int(body_data['owner_id'])}, '{body_data['date']}', '{reason}')
                        RETURNING id
                    '''
                    cur.execute(query)
                    blocked_date_id = cur.fetchone()['id']
                    conn.commit()
                    
                    return {
                        'statusCode': 201,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'id': blocked_date_id, 'message': 'Blocked date created'})
                    }
            
            elif method == 'DELETE':
                blocked_date_id = event.get('queryStringParameters', {}).get('id')
                
                with conn.cursor() as cur:
                    query = f'DELETE FROM {SCHEMA}.diary_blocked_dates WHERE id = {int(blocked_date_id)}'
                    cur.execute(query)
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'message': 'Blocked date deleted'})
                    }
        
        elif resource == 'booking_data':
            if method == 'GET':
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(f'SELECT * FROM {SCHEMA}.diary_services WHERE active = TRUE ORDER BY name')
                    services = cur.fetchall()
                    
                    cur.execute(f'SELECT key, value FROM {SCHEMA}.diary_settings')
                    settings_rows = cur.fetchall()
                    settings_dict = {row['key']: row['value'] for row in settings_rows}
                    
                    services_list = []
                    for service in services:
                        services_list.append({
                            'id': str(service['id']),
                            'name': service['name'],
                            'duration': service['duration_minutes'],
                            'price': float(service['price']),
                            'description': service.get('description', '')
                        })
                    
                    settings = {
                        'telegram_bot_username': settings_dict.get('telegram_bot_username', ''),
                        'work_hours_start': settings_dict.get('work_hours_start', '09:00'),
                        'work_hours_end': settings_dict.get('work_hours_end', '18:00')
                    }
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'services': services_list, 'settings': settings})
                    }
        
        elif resource == 'appointments':
            if method == 'POST':
                try:
                    body_data = json.loads(event.get('body', '{}'))
                    print(f'[APPOINTMENTS] Получены данные: {body_data}')
                    
                    service_id = body_data.get('service_id')
                    appointment_date = body_data.get('appointment_date')
                    appointment_time = body_data.get('appointment_time')
                    client_name = body_data.get('client_name')
                    client_phone = body_data.get('client_phone')
                    client_telegram = body_data.get('client_telegram')
                    owner_id = body_data.get('owner_id', 1)
                    
                    with conn.cursor(cursor_factory=RealDictCursor) as cur:
                            query = f"SELECT duration_minutes, prep_time, buffer_time FROM {SCHEMA}.diary_services WHERE id = {int(service_id)}"
                            print(f'[APPOINTMENTS] SQL запрос: {query}')
                            cur.execute(query)
                            service = cur.fetchone()
                            print(f'[APPOINTMENTS] Результат запроса: {service}')
                        
                            if not service:
                                print(f'[APPOINTMENTS] Услуга не найдена!')
                                return {
                                    'statusCode': 400,
                                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                                    'isBase64Encoded': False,
                                    'body': json.dumps({'error': 'Service not found'})
                                }
                            
                            print(f'[APPOINTMENTS] Шаг 1: Получены данные услуги')
                            duration_minutes = service['duration_minutes'] or 60
                            prep_time = service.get('prep_time', 0) or 0
                            buffer_time = service.get('buffer_time', 0) or 0
                            print(f'[APPOINTMENTS] duration={duration_minutes}, prep={prep_time}, buffer={buffer_time}')
                        
                            print(f'[APPOINTMENTS] Шаг 2: Ищем/создаем пользователя')
                            phone_escaped = client_phone.replace("'", "''")
                            cur.execute(f"SELECT id FROM {SCHEMA}.diary_users WHERE phone = '{phone_escaped}' LIMIT 1")
                            existing_user = cur.fetchone()
                            
                            if existing_user:
                                user_id = existing_user['id']
                                print(f'[APPOINTMENTS] Найден существующий user_id={user_id}')
                            else:
                                name_escaped = client_name.replace("'", "''")
                                telegram_escaped = (client_telegram or '').replace("'", "''")
                                
                                cur.execute(f"""
                                    INSERT INTO {SCHEMA}.diary_users (name, phone, telegram_username, role, owner_id)
                                    VALUES ('{name_escaped}', '{phone_escaped}', '{telegram_escaped}', 'client', {int(owner_id)})
                                    RETURNING id
                                """)
                                user_id = cur.fetchone()['id']
                                conn.commit()
                                print(f'[APPOINTMENTS] Создан новый user_id={user_id}')
                        
                            print(f'[APPOINTMENTS] Шаг 3: Ищем/создаем клиента')
                            cur.execute(f"SELECT id FROM {SCHEMA}.diary_clients WHERE user_id = {int(user_id)} LIMIT 1")
                            existing_client = cur.fetchone()
                            
                            if existing_client:
                                client_id = existing_client['id']
                                print(f'[APPOINTMENTS] Найден существующий client_id={client_id}')
                            else:
                                cur.execute(f"""
                                    INSERT INTO {SCHEMA}.diary_clients (user_id, owner_id)
                                    VALUES ({int(user_id)}, {int(owner_id)})
                                    RETURNING id
                                """)
                                client_id = cur.fetchone()['id']
                                conn.commit()
                                print(f'[APPOINTMENTS] Создан новый client_id={client_id}')
                        
                            print(f'[APPOINTMENTS] Шаг 4: Создаем бронирование')
                            from datetime import datetime, timedelta
                            start_dt = datetime.strptime(appointment_time, '%H:%M')
                            end_dt = start_dt + timedelta(minutes=duration_minutes + buffer_time)
                            end_time_str = end_dt.strftime('%H:%M')
                            print(f'[APPOINTMENTS] Время: {appointment_time} - {end_time_str}')
                            
                            cur.execute(f"""
                                INSERT INTO {SCHEMA}.diary_bookings 
                                (client_id, service_id, owner_id, booking_date, start_time, end_time, status, created_at)
                                VALUES ({int(client_id)}, {int(service_id)}, {int(owner_id)}, '{appointment_date}', '{appointment_time}', '{end_time_str}', 'pending', CURRENT_TIMESTAMP)
                                RETURNING id
                            """)
                            booking_id = cur.fetchone()['id']
                            conn.commit()
                            print(f'[APPOINTMENTS] Создана запись booking_id={booking_id}')
                        
                            cur.execute(f"""
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
                            """)
                            
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
                    
                    print(f'[APPOINTMENTS] УСПЕХ! Возвращаем результат')
                    return {
                        'statusCode': 201,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'id': booking_id, 'message': 'Appointment created successfully'})
                    }
                except Exception as e:
                    print(f'[APPOINTMENTS] ОШИБКА: {str(e)}')
                    import traceback
                    print(f'[APPOINTMENTS] Traceback: {traceback.format_exc()}')
                    return {
                        'statusCode': 500,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': str(e)})
                    }
        
        elif resource == 'available_slots':
            if method == 'GET':
                service_id = event.get('queryStringParameters', {}).get('service_id')
                date = event.get('queryStringParameters', {}).get('date')
                current_time_str = event.get('queryStringParameters', {}).get('current_time')
                
                print(f'[SLOTS] === НАЧАЛО ЗАПРОСА ===')
                print(f'[SLOTS] Параметры: service_id={service_id}, date={date}, current_time={current_time_str}')
                
                if not all([date, service_id]):
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'date and service_id required'})
                    }
                
                from datetime import datetime, timedelta
                
                try:
                    with conn.cursor(cursor_factory=RealDictCursor) as cur:
                        # Проверяем, не заблокирована ли дата
                        cur.execute(f"SELECT id FROM {SCHEMA}.diary_blocked_dates WHERE blocked_date = '{date}'")
                        blocked_result = cur.fetchone()
                        
                        print(f'[SLOTS] Проверка блокировки для {date}: {blocked_result}')
                        
                        if blocked_result:
                            print(f'[SLOTS] ДАТА ЗАБЛОКИРОВАНА! Возвращаем пустой массив слотов')
                            return {
                                'statusCode': 200,
                                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                                'isBase64Encoded': False,
                                'body': json.dumps({'slots': [], 'message': 'Date is blocked'})
                            }
                        
                        # Get service duration
                        cur.execute(f'SELECT duration_minutes FROM {SCHEMA}.diary_services WHERE id = {int(service_id)}')
                        service = cur.fetchone()
                        if not service:
                            return {
                                'statusCode': 404,
                                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                                'body': json.dumps({'error': 'Service not found'})
                            }
                        
                        duration = service['duration_minutes']
                        print(f'[SLOTS] Длительность услуги: {duration} мин')
                        
                        # Get settings
                        cur.execute(f'SELECT key, value FROM {SCHEMA}.diary_settings')
                        settings_rows = cur.fetchall()
                        settings = {row['key']: row['value'] for row in settings_rows}
                        
                        print(f'[SLOTS] Все настройки из БД: {settings}')
                        
                        work_start = settings.get('work_hours_start', '10:00')
                        work_end = settings.get('work_hours_end', '20:00')
                        prep_time = int(settings.get('prep_time', '0'))
                        buffer_time = int(settings.get('buffer_time', '0'))
                        work_priority = settings.get('work_priority', 'False') == 'True'
                        
                        print(f'[SLOTS] Рабочие часы: {work_start} - {work_end}')
                        print(f'[SLOTS] prep_time: {prep_time}, buffer_time: {buffer_time}, work_priority: {work_priority}')
                        
                        # Total time needed: prep + service + buffer
                        total_time_needed = prep_time + duration + buffer_time
                        print(f'[SLOTS] Общее время для слота: {total_time_needed} мин')
                        
                        # Определяем день недели для даты
                        date_obj = datetime.strptime(date, '%Y-%m-%d')
                        day_names = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
                        day_of_week = day_names[date_obj.weekday()]
                        target_weekday = date_obj.isoweekday()
                        
                        print(f'[SLOTS] Дата: {date}, день недели: {day_of_week} ({target_weekday})')
                    
                        # Получаем расписание учёбы для этого дня с учётом цикла
                        cur.execute(f'''
                            SELECT DISTINCT cycle_start_date 
                            FROM {SCHEMA}.diary_week_schedule 
                            WHERE cycle_start_date <= '{date}'
                            ORDER BY cycle_start_date DESC 
                            LIMIT 1
                        ''')
                        
                        cycle_row = cur.fetchone()
                        study_periods = []
                        
                        print(f'[SLOTS] Найден цикл расписания: {cycle_row}')
                        
                        if cycle_row:
                            cycle_start_date = cycle_row['cycle_start_date']
                            
                            # Считаем номер недели
                            days_diff = (date_obj - datetime.strptime(str(cycle_start_date), '%Y-%m-%d')).days
                            weeks_passed = days_diff // 7
                            week_number = (weeks_passed % 2) + 1
                            
                            print(f'[SLOTS] Цикл начат: {cycle_start_date}, прошло дней: {days_diff}, недель: {weeks_passed}, номер недели в цикле: {week_number}')
                            
                            # Получаем расписание для этой недели и дня
                            cur.execute(f'''
                                SELECT start_time, end_time
                                FROM {SCHEMA}.diary_week_schedule
                                WHERE day_of_week = {target_weekday}
                                  AND cycle_start_date = '{cycle_start_date}' 
                                  AND week_number = {week_number}
                            ''')
                            
                            study_periods = cur.fetchall()
                            print(f'[SLOTS] Периоды учёбы: {study_periods}')
                        
                        # Получаем разовые события на эту дату
                        cur.execute(f'''
                            SELECT start_time, end_time
                            FROM {SCHEMA}.diary_calendar_events
                            WHERE start_date = '{date}'
                        ''')
                        
                        events = cur.fetchall()
                        print(f'[SLOTS] Разовые события на {date}: {events}')
                        
                        # Get existing bookings for the date
                        cur.execute(f'''
                            SELECT start_time, end_time
                            FROM {SCHEMA}.diary_bookings 
                            WHERE booking_date = '{date}' AND status != 'cancelled'
                        ''')
                        bookings = cur.fetchall()
                        print(f'[SLOTS] Существующие записи на {date}: {bookings}')
                        
                        # Generate time slots
                        slots = []
                        
                        def time_to_minutes(time_val):
                            if isinstance(time_val, str):
                                parts = time_val.split(':')
                                return int(parts[0]) * 60 + int(parts[1])
                            else:
                                return time_val.hour * 60 + time_val.minute
                        
                        # ЛОГИКА ПРИОРИТЕТОВ
                        available_periods = []
                        
                        print(f'[SLOTS] Начало расчёта доступных периодов...')
                        print(f'[SLOTS] work_priority = {work_priority}')
                        
                        if work_priority:
                            # Приоритет рабочего времени
                            start_minutes = time_to_minutes(work_start)
                            end_minutes = time_to_minutes(work_end)
                            
                            current_start = start_minutes
                            sorted_events = sorted(events, key=lambda e: time_to_minutes(e['start_time'])) if events else []
                            
                            for event in sorted_events:
                                event_start = time_to_minutes(event['start_time'])
                                event_end = time_to_minutes(event['end_time'])
                                
                                if event_start > current_start and event_start < end_minutes:
                                    if event_start - current_start >= total_time_needed:
                                        available_periods.append((current_start, min(event_start, end_minutes)))
                                    current_start = max(event_end, current_start)
                            
                            if current_start < end_minutes and end_minutes - current_start >= total_time_needed:
                                available_periods.append((current_start, end_minutes))
                        else:
                            # Учёба имеет приоритет
                            work_start_min = time_to_minutes(work_start)
                            work_end_min = time_to_minutes(work_end)
                            
                            if study_periods:
                                temp_periods = [(work_start_min, work_end_min)]
                                
                                for study in study_periods:
                                    study_start = time_to_minutes(study['start_time'])
                                    study_end = time_to_minutes(study['end_time'])
                                    
                                    new_temp_periods = []
                                    for period_start, period_end in temp_periods:
                                        if study_end <= period_start or study_start >= period_end:
                                            new_temp_periods.append((period_start, period_end))
                                        elif study_start <= period_start < study_end < period_end:
                                            new_temp_periods.append((study_end, period_end))
                                        elif period_start < study_start < period_end <= study_end:
                                            new_temp_periods.append((period_start, study_start))
                                        elif period_start < study_start and study_end < period_end:
                                            new_temp_periods.append((period_start, study_start))
                                            new_temp_periods.append((study_end, period_end))
                                    
                                    temp_periods = new_temp_periods
                                
                                sorted_events = sorted(events, key=lambda e: time_to_minutes(e['start_time'])) if events else []
                                
                                for period_start, period_end in temp_periods:
                                    current_start = period_start
                                    
                                    for event in sorted_events:
                                        event_start = time_to_minutes(event['start_time'])
                                        event_end = time_to_minutes(event['end_time'])
                                        
                                        if event_start > current_start and event_start < period_end:
                                            if event_start - current_start >= total_time_needed:
                                                available_periods.append((current_start, event_start))
                                            current_start = max(event_end, current_start)
                                    
                                    if current_start < period_end and period_end - current_start >= total_time_needed:
                                        available_periods.append((current_start, period_end))
                            else:
                                current_start = work_start_min
                                sorted_events = sorted(events, key=lambda e: time_to_minutes(e['start_time'])) if events else []
                                
                                for event in sorted_events:
                                    event_start = time_to_minutes(event['start_time'])
                                    event_end = time_to_minutes(event['end_time'])
                                    
                                    if event_start > current_start and event_start < work_end_min:
                                        if event_start - current_start >= total_time_needed:
                                            available_periods.append((current_start, event_start))
                                        current_start = max(event_end, current_start)
                                
                                if current_start < work_end_min and work_end_min - current_start >= total_time_needed:
                                    available_periods.append((current_start, work_end_min))
                        
                        # Генерируем слоты для каждого доступного периода
                        for period_idx, (period_start, period_end) in enumerate(available_periods):
                            current = period_start
                            is_first_period = (period_idx == 0)
                            is_last_period = (period_idx == len(available_periods) - 1)
                            first_slot_in_period = True
                            
                            while True:
                                # Prep time нужен перед каждым слотом, кроме самого первого в первом периоде
                                current_prep = 0 if (is_first_period and first_slot_in_period) else prep_time
                                
                                # Вариант А: Клиент видит время T, но резервируется (T - prep) до (T + duration + buffer)
                                # slot_start_time - это время, которое видит клиент
                                slot_start_time = current + current_prep
                                
                                # Проверяем, что весь блок (prep + услуга + buffer) помещается в период
                                slot_time_needed = current_prep + duration + buffer_time
                                slot_fits = current + slot_time_needed <= period_end
                                
                                if not slot_fits and is_last_period:
                                    overhang = (current + slot_time_needed) - period_end
                                    if overhang <= 60:
                                        slot_fits = True
                                
                                if not slot_fits:
                                    break
                                
                                # Показываем клиенту время после prep
                                slot_start = f"{slot_start_time // 60:02d}:{slot_start_time % 60:02d}"
                                
                                # Фактическое резервирование: с prep до конца buffer
                                actual_start_min = current  # Начало prep
                                actual_end_min = current + slot_time_needed  # Конец buffer
                                
                                print(f'[SLOTS DEBUG] Слот {slot_start}: резерв {actual_start_min//60:02d}:{actual_start_min%60:02d} - {actual_end_min//60:02d}:{actual_end_min%60:02d} (prep:{current_prep}, услуга:{duration}, buffer:{buffer_time})')
                                
                                # Проверяем конфликты с существующими записями
                                is_available = True
                                for booking in bookings:
                                    booking_start_min = time_to_minutes(booking['start_time'])
                                    booking_end_min = time_to_minutes(booking['end_time'])
                                    
                                    if actual_start_min < booking_end_min and actual_end_min > booking_start_min:
                                        is_available = False
                                        print(f'[SLOTS DEBUG] Конфликт с записью {booking_start_min//60:02d}:{booking_start_min%60:02d} - {booking_end_min//60:02d}:{booking_end_min%60:02d}')
                                        break
                                
                                if is_available:
                                    slots.append(slot_start)
                                
                                first_slot_in_period = False
                                
                                # Шаг между слотами: duration + buffer (или 30 мин если услуга без длительности)
                                if duration > 0:
                                    current += duration + buffer_time
                                else:
                                    current += 30  # booking_interval_minutes
                        
                        print(f'[SLOTS] Всего сгенерировано слотов (до фильтрации): {len(slots)}')
                        print(f'[SLOTS] Доступные периоды: {available_periods}')
                        
                        # Фильтруем прошедшие слоты если передано текущее время
                        if current_time_str:
                            try:
                                current_time_parts = current_time_str.split(':')
                                current_minutes = int(current_time_parts[0]) * 60 + int(current_time_parts[1]) + 20
                                
                                print(f'[SLOTS] Текущее время + 20 мин: {current_minutes // 60:02d}:{current_minutes % 60:02d}')
                                
                                filtered_slots = []
                                for slot in slots:
                                    slot_time_parts = slot.split(':')
                                    slot_minutes = int(slot_time_parts[0]) * 60 + int(slot_time_parts[1])
                                    
                                    if slot_minutes > current_minutes:
                                        filtered_slots.append(slot)
                                
                                print(f'[SLOTS] Слотов после фильтрации по времени: {len(filtered_slots)}')
                                slots = filtered_slots
                            except Exception as filter_err:
                                print(f'[SLOTS] ОШИБКА при фильтрации: {filter_err}')
                                pass
                        
                        print(f'[SLOTS] === ИТОГОВЫЙ РЕЗУЛЬТАТ: {len(slots)} слотов ===')
                        print(f'[SLOTS] Слоты: {slots}')
                        
                        return {
                            'statusCode': 200,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'isBase64Encoded': False,
                            'body': json.dumps({'slots': slots})
                        }
                except Exception as slot_error:
                    import traceback
                    return {
                        'statusCode': 500,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({
                            'error': f'Slot generation error: {str(slot_error)}',
                            'type': type(slot_error).__name__,
                            'trace': traceback.format_exc()[:2000]
                        })
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