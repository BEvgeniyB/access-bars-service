import json
import os
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event, context):
    """
    Business: API для управления расписанием и записями клиентов
    Args: event с httpMethod, queryStringParameters, body; context с request_id
    Returns: HTTP ответ с расписанием или результатом операции
    """
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        database_url = os.environ.get('DATABASE_URL')
        if not database_url:
            return error_response('Database connection not configured', 500)
        
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            return get_schedule(cursor, event)
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action', 'create_booking')
            
            if action == 'update_booking_status':
                return update_booking_status(cursor, conn, body)
            else:
                return create_booking(cursor, conn, event)
        elif method == 'PUT':
            return update_booking(cursor, conn, event)
        elif method == 'DELETE':
            return delete_booking(cursor, conn, event)
        else:
            return error_response('Method not allowed', 405)
            
    except Exception as e:
        return error_response(f'Server error: {str(e)}', 500)
    finally:
        if 'conn' in locals():
            conn.close()

def error_response(message, status_code):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message})
    }

def success_response(data, status_code=200):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(data, default=str)
    }

def get_schedule(cursor, event):
    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'get_schedule')
    
    if action == 'get_bookings':
        return get_bookings(cursor, params)
    elif action == 'get_schedule':
        return get_weekly_schedule(cursor, params)
    
    date_str = params.get('date')
    service_id = params.get('service_id')
    
    if date_str:
        date_filter = f"ms.date = '{date_str}'"
    else:
        today = datetime.now().date()
        dates = [(today + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(7)]
        date_filter = "ms.date IN ('" + "','".join(dates) + "')"
    
    cursor.execute(f"""
        SELECT ms.*, 
               COALESCE(
                   json_agg(
                       json_build_object(
                           'id', b.id,
                           'start_time', b.start_time,
                           'end_time', b.end_time,
                           'service_name', s.name,
                           'client_name', b.client_name,
                           'client_phone', b.client_phone,
                           'status', b.status
                       )
                   ) FILTER (WHERE b.id IS NOT NULL), 
                   '[]'::json
               ) as bookings
        FROM t_p89870318_access_bars_service.master_schedule ms
        LEFT JOIN t_p89870318_access_bars_service.bookings b ON ms.date = b.booking_date
        LEFT JOIN t_p89870318_access_bars_service.services s ON b.service_id = s.id
        WHERE {date_filter} AND ms.is_working = true
        GROUP BY ms.id, ms.date, ms.start_time, ms.end_time, ms.break_start_time, ms.break_end_time, ms.notes
        ORDER BY ms.date
    """)
    
    schedule_data = cursor.fetchall()
    
    if service_id:
        cursor.execute("""
            SELECT duration_minutes FROM t_p89870318_access_bars_service.services 
            WHERE id = %s AND is_active = true
        """, (service_id,))
        service = cursor.fetchone()
        if not service:
            return error_response('Service not found', 404)
        service_duration = service['duration_minutes']
    else:
        service_duration = 60
    
    result = []
    for day in schedule_data:
        available_slots = calculate_slots(day, service_duration)
        
        result.append({
            'date': day['date'].strftime('%Y-%m-%d'),
            'start_time': str(day['start_time']),
            'end_time': str(day['end_time']),
            'break_start_time': str(day['break_start_time']) if day['break_start_time'] else None,
            'break_end_time': str(day['break_end_time']) if day['break_end_time'] else None,
            'available_slots': available_slots,
            'bookings': day['bookings']
        })
    
    return success_response(result)

def calculate_slots(day_schedule, service_duration_minutes):
    slots = []
    date = day_schedule['date']
    start_time = datetime.combine(date, day_schedule['start_time'])
    end_time = datetime.combine(date, day_schedule['end_time'])
    
    break_start = None
    break_end = None
    if day_schedule['break_start_time'] and day_schedule['break_end_time']:
        break_start = datetime.combine(date, day_schedule['break_start_time'])
        break_end = datetime.combine(date, day_schedule['break_end_time'])
    
    existing_bookings = []
    if day_schedule['bookings']:
        for booking in day_schedule['bookings']:
            if booking and booking['start_time'] and booking['end_time']:
                booking_start = datetime.combine(date, booking['start_time'])
                booking_end = datetime.combine(date, booking['end_time'])
                existing_bookings.append((booking_start, booking_end))
    
    current_time = start_time
    slot_duration = timedelta(minutes=service_duration_minutes)
    step = timedelta(minutes=30)
    
    # Разрешаем слоты, которые могут закончиться на 30 минут позже рабочего времени
    extended_end_time = end_time + timedelta(minutes=30)
    while current_time + slot_duration <= extended_end_time:
        slot_end = current_time + slot_duration
        
        if break_start and break_end:
            if not (slot_end <= break_start or current_time >= break_end):
                current_time += step
                continue
        
        slot_available = True
        for booking_start, booking_end in existing_bookings:
            if not (slot_end <= booking_start or current_time >= booking_end):
                slot_available = False
                break
        
        now = datetime.now()
        if current_time < now:
            slot_available = False
        
        if slot_available:
            slots.append(current_time.strftime('%H:%M'))
        
        current_time += step
    
    return slots

def create_booking(cursor, conn, event):
    try:
        body = json.loads(event.get('body', '{}'))
        
        # Логируем полученные данные для отладки
        print(f"Received booking data: {body}")
        
        required_fields = ['service_id', 'booking_date', 'start_time', 'client_name', 'client_phone']
        for field in required_fields:
            if not body.get(field):
                return error_response(f'Missing required field: {field}', 400)
        
        cursor.execute("""
            SELECT duration_minutes, price, name FROM t_p89870318_access_bars_service.services 
            WHERE id = %s AND is_active = true
        """, (body['service_id'],))
        service = cursor.fetchone()
        
        print(f"Searching for service_id: {body['service_id']} (type: {type(body['service_id'])})")
        print(f"Found service: {service}")
        
        if not service:
            return error_response('Service not found', 404)
        
        start_datetime = datetime.strptime(f"{body['booking_date']} {body['start_time']}", '%Y-%m-%d %H:%M')
        end_datetime = start_datetime + timedelta(minutes=service['duration_minutes'])
        
        print(f"Inserting booking: service_id={body['service_id']}, date={body['booking_date']}, start={start_datetime.time()}, end={end_datetime.time()}")
        
        cursor.execute("""
            INSERT INTO t_p89870318_access_bars_service.bookings 
            (service_id, service_name, booking_date, start_time, end_time, client_name, client_phone, client_email, notes)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            body['service_id'],
            service['name'],
            body['booking_date'],
            start_datetime.time(),
            end_datetime.time(),
            body['client_name'],
            body['client_phone'],
            body.get('client_email'),
            body.get('notes')
        ))
        
        booking_id = cursor.fetchone()['id']
        conn.commit()
        
        return success_response({
            'success': True,
            'booking_id': booking_id,
            'end_time': end_datetime.time().strftime('%H:%M')
        }, 201)
        
    except Exception as e:
        conn.rollback()
        return error_response(f'Failed to create booking: {str(e)}', 400)

def update_booking(cursor, conn, event):
    try:
        params = event.get('queryStringParameters') or {}
        booking_id = params.get('id')
        
        if not booking_id:
            return error_response('Booking ID is required', 400)
        
        body = json.loads(event.get('body', '{}'))
        status = body.get('status')
        
        if status not in ['confirmed', 'cancelled', 'completed']:
            return error_response('Invalid status', 400)
        
        cursor.execute("""
            UPDATE t_p89870318_access_bars_service.bookings 
            SET status = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING id
        """, (status, booking_id))
        
        if cursor.rowcount == 0:
            return error_response('Booking not found', 404)
        
        conn.commit()
        
        return success_response({
            'success': True, 
            'message': f'Booking status updated to {status}'
        })
        
    except Exception as e:
        conn.rollback()
        return error_response(f'Failed to update booking: {str(e)}', 400)

def delete_booking(cursor, conn, event):
    try:
        params = event.get('queryStringParameters') or {}
        booking_id = params.get('id')
        
        if not booking_id:
            return error_response('Booking ID is required', 400)
        
        cursor.execute("""
            DELETE FROM t_p89870318_access_bars_service.bookings 
            WHERE id = %s
            RETURNING id
        """, (booking_id,))
        
        if cursor.rowcount == 0:
            return error_response('Booking not found', 404)
        
        conn.commit()
        
        return success_response({
            'success': True, 
            'message': 'Booking deleted successfully'
        })
        
    except Exception as e:
        conn.rollback()
        return error_response(f'Failed to delete booking: {str(e)}', 400)

def get_bookings(cursor, params):
    """Получение записей для конкретной даты (для админ-панели)"""
    date_str = params.get('date')
    if not date_str:
        return error_response('Date is required', 400)
    
    cursor.execute("""
        SELECT 
            b.id,
            b.client_name,
            b.client_phone,
            b.service_id,
            b.booking_date as appointment_date,
            b.start_time as appointment_time,
            b.status,
            b.created_at,
            s.name as service_name
        FROM t_p89870318_access_bars_service.bookings b
        LEFT JOIN t_p89870318_access_bars_service.services s ON b.service_id = s.id
        WHERE b.booking_date = %s
        ORDER BY b.start_time
    """, (date_str,))
    
    bookings = cursor.fetchall()
    
    return success_response({
        'bookings': [dict(booking) for booking in bookings]
    })

def get_weekly_schedule(cursor, params):
    """Получение недельного расписания (для админ-панели)"""
    cursor.execute("""
        SELECT 
            id,
            day_of_week,
            start_time,
            end_time,
            break_start_time as break_start,
            break_end_time as break_end,
            is_working
        FROM t_p89870318_access_bars_service.weekly_schedule
        ORDER BY day_of_week
    """)
    
    schedule = cursor.fetchall()
    
    return success_response({
        'schedule': [dict(day) for day in schedule]
    })

def update_booking_status(cursor, conn, body):
    """Обновление статуса записи (для админ-панели)"""
    try:
        booking_id = body.get('booking_id')
        status = body.get('status')
        
        if not booking_id or not status:
            return error_response('Booking ID and status are required', 400)
        
        if status not in ['pending', 'confirmed', 'cancelled', 'completed']:
            return error_response('Invalid status', 400)
        
        cursor.execute("""
            UPDATE t_p89870318_access_bars_service.bookings 
            SET status = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING id
        """, (status, booking_id))
        
        if cursor.rowcount == 0:
            return error_response('Booking not found', 404)
        
        conn.commit()
        
        return success_response({
            'success': True,
            'message': f'Booking status updated to {status}'
        })
        
    except Exception as e:
        conn.rollback()
        return error_response(f'Failed to update booking status: {str(e)}', 400)