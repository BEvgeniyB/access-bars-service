import json
import os
from datetime import datetime, timedelta, time
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event, context):
    """
    Business: API для проверки доступности временных слотов для записи
    Args: event с httpMethod, queryStringParameters; context с request_id
    Returns: HTTP ответ с доступными слотами времени
    """
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return error_response('Method not allowed', 405)
    
    try:
        database_url = os.environ.get('DATABASE_URL')
        if not database_url:
            return error_response('Database connection not configured', 500)
        
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        params = event.get('queryStringParameters') or {}
        date_str = params.get('date')
        service_id = params.get('service_id')
        
        if not date_str:
            return error_response('Date parameter is required', 400)
        
        if not service_id:
            return error_response('Service ID parameter is required', 400)
        
        # Получаем информацию об услуге
        cursor.execute("""
            SELECT duration_minutes, name FROM t_p89870318_access_bars_service.services 
            WHERE id = %s AND is_active = true
        """, (service_id,))
        service = cursor.fetchone()
        
        if not service:
            return error_response('Service not found', 404)
        
        # Получаем рабочие часы для указанной даты
        cursor.execute("""
            SELECT start_time, end_time, break_start_time, break_end_time
            FROM t_p89870318_access_bars_service.master_schedule 
            WHERE date = %s AND is_working = true
        """, (date_str,))
        schedule = cursor.fetchone()
        
        if not schedule:
            return success_response({
                'date': date_str,
                'service_name': service['name'],
                'available_slots': [],
                'message': 'Нерабочий день'
            })
        
        # Получаем существующие записи на эту дату
        cursor.execute("""
            SELECT start_time, end_time FROM t_p89870318_access_bars_service.bookings 
            WHERE booking_date = %s AND status IN ('confirmed', 'pending')
        """, (date_str,))
        existing_bookings = cursor.fetchall()
        
        # Генерируем доступные слоты
        available_slots = generate_available_slots(
            schedule, 
            service['duration_minutes'], 
            existing_bookings,
            date_str
        )
        
        return success_response({
            'date': date_str,
            'service_name': service['name'],
            'service_duration': service['duration_minutes'],
            'available_slots': available_slots,
            'working_hours': {
                'start': str(schedule['start_time']),
                'end': str(schedule['end_time']),
                'break_start': str(schedule['break_start_time']) if schedule['break_start_time'] else None,
                'break_end': str(schedule['break_end_time']) if schedule['break_end_time'] else None
            }
        })
        
    except Exception as e:
        return error_response(f'Server error: {str(e)}', 500)
    finally:
        if 'conn' in locals():
            conn.close()

def generate_available_slots(schedule, service_duration_minutes, existing_bookings, date_str):
    """Генерирует список доступных временных слотов"""
    slots = []
    
    # Конвертируем дату в объект datetime
    date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
    
    # Рабочее время
    start_time = datetime.combine(date_obj, schedule['start_time'])
    end_time = datetime.combine(date_obj, schedule['end_time'])
    
    # Время перерыва (если есть)
    break_start = None
    break_end = None
    if schedule['break_start_time'] and schedule['break_end_time']:
        break_start = datetime.combine(date_obj, schedule['break_start_time'])
        break_end = datetime.combine(date_obj, schedule['break_end_time'])
    
    # Существующие записи
    booked_periods = []
    for booking in existing_bookings:
        booking_start = datetime.combine(date_obj, booking['start_time'])
        booking_end = datetime.combine(date_obj, booking['end_time'])
        booked_periods.append((booking_start, booking_end))
    
    # Генерируем слоты с шагом 30 минут
    current_time = start_time
    slot_duration = timedelta(minutes=service_duration_minutes)
    step = timedelta(minutes=30)
    
    # Разрешаем сеансы заканчиваться на 30 минут позже рабочего времени
    extended_end_time = end_time + timedelta(minutes=30)
    
    while current_time + slot_duration <= extended_end_time:
        slot_end = current_time + slot_duration
        
        # Проверка на время перерыва
        if break_start and break_end:
            if not (slot_end <= break_start or current_time >= break_end):
                current_time += step
                continue
        
        # Проверка на пересечение с существующими записями
        slot_available = True
        for booking_start, booking_end in booked_periods:
            if not (slot_end <= booking_start or current_time >= booking_end):
                slot_available = False
                break
        
        # Проверка на прошедшее время (только для сегодняшней даты)
        now = datetime.now()
        if date_obj == now.date() and current_time < now:
            slot_available = False
        
        if slot_available:
            slots.append(current_time.strftime('%H:%M'))
        
        current_time += step
    
    return slots

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