import json
import os
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor
import requests

def handler(event, context):
    '''
    Business: API для управления расписанием и записями клиентов
    Args: event - dict with httpMethod, queryStringParameters, body
          context - object with attributes: request_id, function_name, function_version, memory_limit_in_mb
    Returns: HTTP response dict
    '''
    try:
        method = event.get('httpMethod', 'GET')
        
        # Handle CORS OPTIONS request
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
    
        # Get schedule for specific date or settings
        if method == 'GET':
            database_url = os.environ.get('DATABASE_URL')
            if not database_url:
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Database connection not configured'})
                }
            
            conn = psycopg2.connect(database_url)
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            
            try:
                params = event.get('queryStringParameters') or {}
                action = params.get('action')
                
                if action == 'get_settings':
                    return get_schedule_settings(cursor)
                else:
                    return get_schedule(cursor, event)
            finally:
                conn.close()
        
        # Create new booking
        elif method == 'POST':
            database_url = os.environ.get('DATABASE_URL')
            if not database_url:
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Database connection not configured'})
                }
            
            conn = psycopg2.connect(database_url)
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            
            try:
                body = json.loads(event.get('body', '{}'))
                action = body.get('action', 'create_booking')
                
                if action == 'save_settings':
                    return save_schedule_settings(cursor, conn, body)
                elif action == 'update_booking_status':
                    return update_booking_status(cursor, conn, body)
                elif action == 'update_booking_service':
                    return update_booking_service(cursor, conn, body)
                else:
                    return create_booking(cursor, conn, event)
            finally:
                conn.close()
        
        else:
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Method not allowed'})
            }
            
    except Exception as e:
        print(f"Schedule function error: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Server error: {str(e)}'})
        }

def error_response(message, status_code=500):
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
    action = params.get('action')
    
    if action == 'get_bookings':
        return get_bookings(cursor, params)
    elif action == 'get_weekly_schedule':
        return get_weekly_schedule(cursor, params)
    
    # Получаем настройки расписания
    cursor.execute("""
        SELECT break_duration_minutes 
        FROM t_p89870318_access_bars_service.schedule_settings 
        ORDER BY id LIMIT 1
    """)
    settings_row = cursor.fetchone()
    break_duration = settings_row['break_duration_minutes'] if settings_row else 30
    
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
        available_slots = calculate_slots(day, service_duration, break_duration)
        
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

def calculate_slots(day_schedule, service_duration_minutes, break_duration_minutes=30):
    slots = []
    date = day_schedule['date']
    start_time = datetime.combine(date, day_schedule['start_time'])
    end_time = datetime.combine(date, day_schedule['end_time'])
    
    # Создаем список заблокированных интервалов с учетом 30-минутных перерывов
    blocked_intervals = []
    
    # Добавляем существующие записи + 30 минут после каждой
    if day_schedule['bookings']:
        for booking in day_schedule['bookings']:
            if booking and booking['start_time'] and booking['end_time']:
                # Конвертируем строки времени в объекты time
                start_time_obj = datetime.strptime(booking['start_time'], '%H:%M:%S').time()
                end_time_obj = datetime.strptime(booking['end_time'], '%H:%M:%S').time()
                
                booking_start = datetime.combine(date, start_time_obj)
                booking_end = datetime.combine(date, end_time_obj)
                
                # Блокируем время записи + перерыв после неё
                extended_booking_end = booking_end + timedelta(minutes=break_duration_minutes)
                blocked_intervals.append((booking_start, extended_booking_end))
    
    # Объединяем пересекающиеся интервалы для оптимизации
    blocked_intervals = merge_overlapping_intervals(blocked_intervals)
    
    current_time = start_time
    slot_duration = timedelta(minutes=service_duration_minutes)
    step = timedelta(minutes=30)
    
    # Разрешаем слоты, которые могут закончиться на 30 минут позже рабочего времени
    extended_end_time = end_time + timedelta(minutes=30)
    
    while current_time + slot_duration <= extended_end_time:
        slot_end = current_time + slot_duration
        
        # Проверяем, что слот не пересекается с заблокированными интервалами
        slot_available = True
        for blocked_start, blocked_end in blocked_intervals:
            # Проверяем пересечение: слот должен полностью НЕ пересекаться с блоком
            if not (slot_end <= blocked_start or current_time >= blocked_end):
                slot_available = False
                break
        
        # Дополнительная проверка: достаточно ли времени до следующей записи
        if slot_available:
            # Проверяем, что после нашего слота + 30 минут нет других записей
            our_session_end_with_break = slot_end + timedelta(minutes=30)
            
            for blocked_start, blocked_end in blocked_intervals:
                # Если следующая запись начинается раньше чем через 30 минут после нашего слота
                if blocked_start < our_session_end_with_break and blocked_start >= slot_end:
                    slot_available = False
                    break
        
        # Проверяем, что время ещё не прошло
        now = datetime.now()
        if current_time < now:
            slot_available = False
        
        if slot_available:
            slots.append(current_time.strftime('%H:%M'))
        
        current_time += step
    
    return slots

def merge_overlapping_intervals(intervals):
    """Объединяет пересекающиеся временные интервалы"""
    if not intervals:
        return []
    
    # Сортируем интервалы по времени начала
    sorted_intervals = sorted(intervals, key=lambda x: x[0])
    merged = [sorted_intervals[0]]
    
    for current_start, current_end in sorted_intervals[1:]:
        last_start, last_end = merged[-1]
        
        # Если интервалы пересекаются или касаются
        if current_start <= last_end:
            # Объединяем интервалы
            merged[-1] = (last_start, max(last_end, current_end))
        else:
            # Добавляем новый интервал
            merged.append((current_start, current_end))
    
    return merged

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
            (service_id, service_name, booking_date, start_time, end_time, client_name, client_phone, client_email, notes, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
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
            body.get('notes'),
            'pending'
        ))
        
        booking_id = cursor.fetchone()['id']
        conn.commit()
        
        # Отправляем уведомление администратору о новой записи
        try:
            send_new_booking_notification({
                'client_name': body['client_name'],
                'client_phone': body['client_phone'],
                'client_email': body.get('client_email', ''),
                'service_name': service['name'],
                'booking_date': body['booking_date'],
                'booking_time': start_datetime.time().strftime('%H:%M'),
                'end_time': end_datetime.time().strftime('%H:%M'),
                'notes': body.get('notes', '')
            })
        except Exception as e:
            print(f"Failed to send admin notification: {str(e)}")
        
        # Отправляем подтверждение клиенту
        try:
            send_client_booking_confirmation({
                'client_name': body['client_name'],
                'client_email': body.get('client_email', ''),
                'service_name': service['name'],
                'booking_date': body['booking_date'],
                'booking_time': start_datetime.time().strftime('%H:%M'),
                'end_time': end_datetime.time().strftime('%H:%M'),
                'notes': body.get('notes', '')
            })
        except Exception as e:
            print(f"Failed to send client confirmation: {str(e)}")
        
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
        
        # Получаем данные записи для уведомления
        cursor.execute("""
            SELECT b.*, s.name as service_name
            FROM t_p89870318_access_bars_service.bookings b
            JOIN t_p89870318_access_bars_service.services s ON b.service_id = s.id
            WHERE b.id = %s
        """, (booking_id,))
        
        booking = cursor.fetchone()
        if not booking:
            return error_response('Booking not found', 404)
        
        # Обновляем статус
        cursor.execute("""
            UPDATE t_p89870318_access_bars_service.bookings 
            SET status = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING id
        """, (status, booking_id))
        
        conn.commit()
        
        # Отправляем уведомление клиенту об изменении статуса
        try:
            send_status_update_notification({
                'client_name': booking['client_name'],
                'client_email': booking['client_email'],
                'service_name': booking['service_name'],
                'booking_date': booking['booking_date'].strftime('%Y-%m-%d'),
                'booking_time': booking['start_time'].strftime('%H:%M'),
                'status': status
            })
        except Exception as e:
            print(f"Failed to send status update notification: {str(e)}")
        
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
            b.client_email,
            b.service_id,
            b.booking_date as appointment_date,
            b.start_time as appointment_time,
            b.end_time,
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
            SET status = %s
            WHERE id = %s
            RETURNING id
        """, (status, booking_id))
        
        if cursor.rowcount == 0:
            return error_response('Booking not found', 404)
        
        conn.commit()
        
        # Отправляем уведомление клиенту об изменении статуса
        try:
            # Получаем данные записи для уведомления
            cursor.execute("""
                SELECT b.client_name, b.client_email, b.booking_date, b.start_time, s.name as service_name
                FROM t_p89870318_access_bars_service.bookings b
                LEFT JOIN t_p89870318_access_bars_service.services s ON b.service_id = s.id
                WHERE b.id = %s
            """, (booking_id,))
            booking_data = cursor.fetchone()
            
            print(f"Booking data for notification: {booking_data}")
            
            if booking_data and booking_data['client_email']:
                print(f"Sending status update notification to {booking_data['client_email']}")
                send_status_update_notification({
                    'client_name': booking_data['client_name'],
                    'client_email': booking_data['client_email'],
                    'service_name': booking_data['service_name'],
                    'booking_date': booking_data['booking_date'].strftime('%Y-%m-%d'),
                    'booking_time': booking_data['start_time'].strftime('%H:%M'),
                    'status': status
                })
            else:
                print(f"No email for notification or no booking data: {booking_data}")
        except Exception as e:
            print(f"Failed to send status notification: {str(e)}")
        
        return success_response({
            'success': True,
            'message': f'Booking status updated to {status}'
        })
        
    except Exception as e:
        conn.rollback()
        return error_response(f'Failed to update booking status: {str(e)}', 400)

def update_booking_service(cursor, conn, body):
    """Обновление услуги записи (для админ-панели)"""
    try:
        booking_id = body.get('booking_id')
        service_id = body.get('service_id')
        
        if not booking_id or not service_id:
            return error_response('Booking ID and service ID are required', 400)
        
        # Проверяем, что услуга существует
        cursor.execute("""
            SELECT id, duration_minutes FROM t_p89870318_access_bars_service.services 
            WHERE id = %s AND is_active = true
        """, (service_id,))
        service = cursor.fetchone()
        
        if not service:
            return error_response('Service not found or inactive', 400)
        
        # Получаем текущие данные записи
        cursor.execute("""
            SELECT booking_date, start_time FROM t_p89870318_access_bars_service.bookings 
            WHERE id = %s
        """, (booking_id,))
        booking = cursor.fetchone()
        
        if not booking:
            return error_response('Booking not found', 404)
        
        # Рассчитываем новое время окончания
        start_datetime = datetime.combine(booking['booking_date'], booking['start_time'])
        end_datetime = start_datetime + timedelta(minutes=service['duration_minutes'])
        
        # Обновляем запись
        cursor.execute("""
            UPDATE t_p89870318_access_bars_service.bookings 
            SET service_id = %s, end_time = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING id
        """, (service_id, end_datetime.time(), booking_id))
        
        if cursor.rowcount == 0:
            return error_response('Booking not found', 404)
        
        conn.commit()
        
        return success_response({
            'success': True,
            'message': 'Booking service updated successfully'
        })
        
    except Exception as e:
        conn.rollback()
        return error_response(f'Failed to update booking service: {str(e)}', 400)

def send_new_booking_notification(booking_data):
    """Отправляет уведомление о новой записи"""
    try:
        notifications_url = 'https://functions.poehali.dev/eba9cd24-baee-4359-80c0-d36c5b4643ff'
        
        payload = {
            'action': 'send_notification',
            'booking_data': {
                'client_name': booking_data['client_name'],
                'client_phone': booking_data['client_phone'],
                'client_email': booking_data.get('client_email', ''),
                'service_name': booking_data['service_name'],
                'appointment_date': booking_data['booking_date'],
                'appointment_time': booking_data['booking_time'],
                'end_time': booking_data.get('end_time', ''),
                'status': 'pending'
            }
        }
        
        response = requests.post(
            notifications_url,
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print("New booking notification sent successfully")
            else:
                print(f"Notification failed: {result.get('error', 'Unknown error')}")
        else:
            print(f"Failed to send notification: {response.status_code}")
            
    except Exception as e:
        print(f"Error sending notification: {str(e)}")

def send_client_booking_confirmation(booking_data):
    """Отправляет подтверждение записи клиенту"""
    if not booking_data.get('client_email'):
        print("No client email provided for confirmation")
        return
        
    try:
        notifications_url = 'https://functions.poehali.dev/eba9cd24-baee-4359-80c0-d36c5b4643ff'
        
        payload = {
            'action': 'send_client_confirmation',
            'booking_data': {
                'client_name': booking_data['client_name'],
                'client_email': booking_data['client_email'],
                'service_name': booking_data['service_name'],
                'appointment_date': booking_data['booking_date'],
                'appointment_time': booking_data['booking_time'],
                'end_time': booking_data.get('end_time', ''),
                'notes': booking_data.get('notes', '')
            }
        }
        
        response = requests.post(
            notifications_url,
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print("Client confirmation sent successfully")
            else:
                print(f"Client confirmation failed: {result.get('error', 'Unknown error')}")
        else:
            print(f"Failed to send client confirmation: {response.status_code}")
            
    except Exception as e:
        print(f"Error sending client confirmation: {str(e)}")

def send_status_update_notification(booking_data):
    """Отправляет уведомление об изменении статуса клиенту"""
    if not booking_data.get('client_email'):
        print("No client email provided for status update")
        return
        
    try:
        notifications_url = 'https://functions.poehali.dev/eba9cd24-baee-4359-80c0-d36c5b4643ff'
        
        payload = {
            'action': 'send_status_update',
            'booking_data': {
                'client_name': booking_data['client_name'],
                'client_email': booking_data['client_email'],
                'service_name': booking_data['service_name'],
                'appointment_date': booking_data['booking_date'],
                'appointment_time': booking_data['booking_time'],
                'status': booking_data['status']
            }
        }
        
        print(f"Sending status update notification to {notifications_url}")
        print(f"Payload: {payload}")
        
        response = requests.post(
            notifications_url,
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"Response status: {response.status_code}")
        print(f"Response text: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print("Status update notification sent successfully")
            else:
                print(f"Status notification failed: {result.get('error', 'Unknown error')}")
        else:
            print(f"Failed to send status notification: {response.status_code}")
            
    except Exception as e:
        print(f"Error sending status notification: {str(e)}")

def get_schedule_settings(cursor):
    """Получение настроек расписания"""
    try:
        cursor.execute("""
            SELECT 
                time_slot_interval_minutes,
                break_duration_minutes,
                working_hours_start,
                working_hours_end
            FROM t_p89870318_access_bars_service.schedule_settings
            ORDER BY id
            LIMIT 1
        """)
        
        settings = cursor.fetchone()
        
        if settings:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'settings': dict(settings)
                })
            }
        else:
            # Возвращаем настройки по умолчанию
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'settings': {
                        'time_slot_interval_minutes': 30,
                        'break_duration_minutes': 30,
                        'working_hours_start': '12:00:00',
                        'working_hours_end': '21:00:00'
                    }
                })
            }
    except Exception as e:
        print(f"Error getting schedule settings: {str(e)}")
        return error_response(f'Error getting settings: {str(e)}', 500)

def save_schedule_settings(cursor, conn, body):
    """Сохранение настроек расписания"""
    try:
        settings = body.get('settings', {})
        
        if not settings:
            return error_response('Settings data is required', 400)
        
        # Валидация данных
        interval = settings.get('time_slot_interval_minutes', 30)
        break_duration = settings.get('break_duration_minutes', 30)
        start_time = settings.get('working_hours_start', '12:00:00')
        end_time = settings.get('working_hours_end', '21:00:00')
        
        if not isinstance(interval, int) or interval < 15 or interval > 120:
            return error_response('Invalid time slot interval (must be 15-120 minutes)', 400)
        
        if not isinstance(break_duration, int) or break_duration < 0 or break_duration > 60:
            return error_response('Invalid break duration (must be 0-60 minutes)', 400)
        
        # Проверяем, есть ли уже запись настроек
        cursor.execute("SELECT id FROM t_p89870318_access_bars_service.schedule_settings LIMIT 1")
        existing = cursor.fetchone()
        
        if existing:
            # Обновляем существующую запись
            cursor.execute("""
                UPDATE t_p89870318_access_bars_service.schedule_settings 
                SET 
                    time_slot_interval_minutes = %s,
                    break_duration_minutes = %s,
                    working_hours_start = %s,
                    working_hours_end = %s,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            """, (interval, break_duration, start_time, end_time, existing['id']))
        else:
            # Создаем новую запись
            cursor.execute("""
                INSERT INTO t_p89870318_access_bars_service.schedule_settings 
                (time_slot_interval_minutes, break_duration_minutes, working_hours_start, working_hours_end)
                VALUES (%s, %s, %s, %s)
            """, (interval, break_duration, start_time, end_time))
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'message': 'Settings saved successfully'
            })
        }
        
    except Exception as e:
        print(f"Error saving schedule settings: {str(e)}")
        return error_response(f'Error saving settings: {str(e)}', 500)