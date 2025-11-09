'''
Business: Unified content API - handles reviews management and email notifications
Args: event - dict with httpMethod, body, queryStringParameters
      context - object with attributes: request_id, function_name
Returns: HTTP response with reviews data or notification status
'''

import json
import os
import smtplib
import psycopg2
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any, List, Optional

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise ValueError('DATABASE_URL not found in environment')
    return psycopg2.connect(database_url)

def cors_response(allowed_methods='GET, POST, OPTIONS'):
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': allowed_methods,
            'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, X-Admin-Token',
            'Access-Control-Max-Age': '86400'
        },
        'body': '',
        'isBase64Encoded': False
    }

def success_response(data, status_code=200):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(data, default=str),
        'isBase64Encoded': False
    }

def error_response(message, status_code=500):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message}),
        'isBase64Encoded': False
    }

def verify_admin_token(event: Dict[str, Any]) -> bool:
    headers = event.get('headers', {})
    token = headers.get('x-admin-token') or headers.get('X-Admin-Token')
    
    if not token:
        return False
    
    expected_token = os.environ.get('ADMIN_TOKEN')
    if not expected_token:
        return False
    
    return token == expected_token

def get_email_settings():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT smtp_host, smtp_port, sender_email, admin_email, notifications_enabled FROM t_p89870318_access_bars_service.email_settings ORDER BY id LIMIT 1")
        result = cursor.fetchone()
        
        if result:
            return {
                'smtp_host': result[0] or 'smtp.yandex.ru',
                'smtp_port': result[1] or 587, 
                'sender_email': result[2] or '',
                'admin_email': result[3] or '',
                'notifications_enabled': result[4] if result[4] is not None else True
            }
        else:
            return {
                'smtp_host': 'smtp.yandex.ru',
                'smtp_port': 587,
                'sender_email': '',
                'admin_email': '',
                'notifications_enabled': True
            }
    finally:
        conn.close()

def handle_reviews(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return cors_response('GET, POST, PUT, PATCH, DELETE, OPTIONS')
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            status = params.get('status', 'approved')
            service = params.get('service')
            
            conn = get_db_connection()
            cur = conn.cursor()
            
            try:
                query = "SELECT id, name, service, rating, text, status, created_at FROM reviews WHERE 1=1"
                query_params = []
                
                if status:
                    query += " AND status = %s"
                    query_params.append(status)
                
                if service and service.lower() != 'все':
                    query += " AND LOWER(service) LIKE %s"
                    query_params.append(f'%{service.lower()}%')
                
                query += " ORDER BY created_at DESC"
                
                cur.execute(query, tuple(query_params))
                rows = cur.fetchall()
                
                reviews = []
                for row in rows:
                    reviews.append({
                        'id': row[0],
                        'name': row[1],
                        'service': row[2],
                        'rating': row[3],
                        'text': row[4],
                        'status': row[5],
                        'date': row[6].isoformat() if row[6] else None
                    })
                
                return success_response({'success': True, 'reviews': reviews})
            finally:
                cur.close()
                conn.close()
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            name = body_data.get('name', '').strip()
            service = body_data.get('service', '').strip()
            rating = body_data.get('rating', 5)
            text = body_data.get('text', '').strip()
            
            if not name or not service or not text:
                return error_response('Заполните все поля', 400)
            
            if len(name) > 255 or len(service) > 255:
                return error_response('Имя и услуга не должны превышать 255 символов', 400)
            
            if len(text) > 5000:
                return error_response('Текст отзыва слишком длинный', 400)
            
            if rating < 1 or rating > 5:
                return error_response('Рейтинг должен быть от 1 до 5', 400)
            
            conn = get_db_connection()
            cur = conn.cursor()
            
            try:
                query = """
                    INSERT INTO reviews (name, service, rating, text, status)
                    VALUES (%s, %s, %s, %s, 'pending')
                    RETURNING id, name, service, rating, text, status, created_at
                """
                
                cur.execute(query, (name, service, rating, text))
                row = cur.fetchone()
                conn.commit()
                
                review = {
                    'id': row[0],
                    'name': row[1],
                    'service': row[2],
                    'rating': row[3],
                    'text': row[4],
                    'status': row[5],
                    'date': row[6].isoformat() if row[6] else None
                }
                
                return success_response({
                    'success': True,
                    'review': review,
                    'message': 'Отзыв отправлен на модерацию'
                }, 201)
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                cur.close()
                conn.close()
        
        elif method == 'PUT':
            if not verify_admin_token(event):
                return error_response('Unauthorized', 401)
            
            body_data = json.loads(event.get('body', '{}'))
            review_id = body_data.get('id')
            status = body_data.get('status')
            
            if not review_id or not status:
                return error_response('ID и статус обязательны', 400)
            
            if status not in ['pending', 'approved', 'rejected']:
                return error_response('Неверный статус', 400)
            
            conn = get_db_connection()
            cur = conn.cursor()
            
            try:
                cur.execute("UPDATE reviews SET status = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s", (status, review_id))
                conn.commit()
                
                if cur.rowcount > 0:
                    return success_response({'success': True, 'message': 'Статус обновлен'})
                else:
                    return error_response('Отзыв не найден', 404)
            finally:
                cur.close()
                conn.close()
        
        elif method == 'PATCH':
            if not verify_admin_token(event):
                return error_response('Unauthorized', 401)
            
            body_data = json.loads(event.get('body', '{}'))
            review_id = body_data.get('id')
            
            if not review_id:
                return error_response('ID обязателен', 400)
            
            conn = get_db_connection()
            cur = conn.cursor()
            
            try:
                if 'text' in body_data and len(set(body_data.keys()) - {'id', 'text'}) == 0:
                    text = body_data['text']
                    if len(text) > 5000:
                        return error_response('Текст слишком длинный', 400)
                    cur.execute("UPDATE reviews SET text = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s", (text, review_id))
                else:
                    name = body_data.get('name', '').strip()
                    service = body_data.get('service', '').strip()
                    rating = body_data.get('rating')
                    text = body_data.get('text', '').strip()
                    
                    if not name or not service or not text or rating is None:
                        return error_response('Все поля обязательны', 400)
                    
                    if rating < 1 or rating > 5:
                        return error_response('Рейтинг должен быть от 1 до 5', 400)
                    
                    cur.execute("""
                        UPDATE reviews 
                        SET name = %s, service = %s, rating = %s, text = %s, updated_at = CURRENT_TIMESTAMP 
                        WHERE id = %s
                    """, (name, service, rating, text, review_id))
                
                conn.commit()
                
                if cur.rowcount > 0:
                    return success_response({'success': True, 'message': 'Отзыв обновлен'})
                else:
                    return error_response('Отзыв не найден', 404)
            finally:
                cur.close()
                conn.close()
        
        elif method == 'DELETE':
            if not verify_admin_token(event):
                return error_response('Unauthorized', 401)
            
            params = event.get('queryStringParameters', {}) or {}
            review_id = params.get('id')
            
            if not review_id:
                return error_response('ID обязателен', 400)
            
            conn = get_db_connection()
            cur = conn.cursor()
            
            try:
                cur.execute("DELETE FROM reviews WHERE id = %s", (review_id,))
                conn.commit()
                
                if cur.rowcount > 0:
                    return success_response({'success': True, 'message': 'Отзыв удален'})
                else:
                    return error_response('Отзыв не найден', 404)
            finally:
                cur.close()
                conn.close()
        
        else:
            return error_response('Метод не поддерживается', 405)
    
    except Exception as e:
        return error_response(str(e), 500)

def handle_notifications(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return cors_response('GET, POST, OPTIONS')
    
    if method == 'POST':
        try:
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'get_email_settings':
                settings = get_email_settings()
                return success_response({'success': True, 'settings': settings})
            
            elif action == 'save_email_settings':
                if not verify_admin_token(event):
                    return error_response('Unauthorized', 401)
                
                settings_data = body_data.get('settings', {})
                
                conn = get_db_connection()
                cursor = conn.cursor()
                
                try:
                    cursor.execute("SELECT id FROM t_p89870318_access_bars_service.email_settings ORDER BY id LIMIT 1")
                    existing = cursor.fetchone()
                    
                    if existing:
                        cursor.execute("""
                            UPDATE t_p89870318_access_bars_service.email_settings 
                            SET smtp_host = %s, smtp_port = %s, sender_email = %s, 
                                admin_email = %s, notifications_enabled = %s, updated_at = CURRENT_TIMESTAMP
                            WHERE id = %s
                        """, (
                            settings_data.get('smtp_host', 'smtp.yandex.ru'),
                            settings_data.get('smtp_port', 587),
                            settings_data.get('sender_email', ''),
                            settings_data.get('admin_email', ''),
                            settings_data.get('notifications_enabled', True),
                            existing[0]
                        ))
                    else:
                        cursor.execute("""
                            INSERT INTO t_p89870318_access_bars_service.email_settings 
                            (smtp_host, smtp_port, sender_email, admin_email, notifications_enabled)
                            VALUES (%s, %s, %s, %s, %s)
                        """, (
                            settings_data.get('smtp_host', 'smtp.yandex.ru'),
                            settings_data.get('smtp_port', 587),
                            settings_data.get('sender_email', ''),
                            settings_data.get('admin_email', ''),
                            settings_data.get('notifications_enabled', True)
                        ))
                    
                    conn.commit()
                    return success_response({'success': True, 'message': 'Настройки сохранены'})
                finally:
                    cursor.close()
                    conn.close()
            
            elif action == 'send_notification':
                booking_data = body_data.get('booking_data', {})
                settings = get_email_settings()
                
                if not settings['notifications_enabled']:
                    return success_response({'success': True, 'message': 'Уведомления отключены'})
                
                if not settings['admin_email'] or not settings['sender_email']:
                    return error_response('Email не настроен', 400)
                
                email_password = os.environ.get('EMAIL_PASSWORD')
                if not email_password:
                    return error_response('EMAIL_PASSWORD не настроен', 500)
                
                msg = MIMEMultipart()
                msg['From'] = settings['sender_email']
                msg['To'] = settings['admin_email']
                msg['Subject'] = f'Новая запись: {booking_data.get("client_name", "")}'
                
                body = f'''
Новая запись на сайте!

Клиент: {booking_data.get('client_name', '')}
Телефон: {booking_data.get('client_phone', '')}
Email: {booking_data.get('client_email', '')}
Услуга: {booking_data.get('service_name', '')}
Дата: {booking_data.get('appointment_date', '')}
Время: {booking_data.get('appointment_time', '')} - {booking_data.get('end_time', '')}
Статус: ожидает подтверждения

Войдите в админ-панель для подтверждения записи.

---
Система "Гармония энергий"
'''
                
                msg.attach(MIMEText(body, 'plain', 'utf-8'))
                
                server = smtplib.SMTP(settings['smtp_host'], settings['smtp_port'])
                server.starttls()
                server.login(settings['sender_email'], email_password)
                server.send_message(msg)
                server.quit()
                
                return success_response({
                    'success': True,
                    'message': f'Уведомление администратору отправлено на {settings["admin_email"]}'
                })
            
            elif action == 'send_client_confirmation':
                booking_data = body_data.get('booking_data', {})
                settings = get_email_settings()
                
                if not settings['notifications_enabled']:
                    return success_response({'success': True, 'message': 'Уведомления отключены'})
                
                client_email = booking_data.get('client_email')
                if not client_email:
                    return success_response({'success': True, 'message': 'Email клиента не указан'})
                
                if not settings['sender_email']:
                    return error_response('Email не настроен', 400)
                
                email_password = os.environ.get('EMAIL_PASSWORD')
                if not email_password:
                    return error_response('EMAIL_PASSWORD не настроен', 500)
                
                msg = MIMEMultipart()
                msg['From'] = settings['sender_email']
                msg['To'] = client_email
                msg['Subject'] = 'Подтверждение записи'
                
                body = f'''
Здравствуйте, {booking_data.get('client_name', '')}!

Ваша запись успешно создана:

Услуга: {booking_data.get('service_name', '')}
Дата: {booking_data.get('appointment_date', '')}
Время: {booking_data.get('appointment_time', '')}

Ожидайте подтверждения от администратора.

---
С уважением,
Наталия Великая
Система "Гармония энергий"
'''
                
                msg.attach(MIMEText(body, 'plain', 'utf-8'))
                
                server = smtplib.SMTP(settings['smtp_host'], settings['smtp_port'])
                server.starttls()
                server.login(settings['sender_email'], email_password)
                server.send_message(msg)
                server.quit()
                
                return success_response({'success': True, 'message': 'Подтверждение отправлено клиенту'})
            
            elif action == 'send_status_update':
                booking_data = body_data.get('booking_data', {})
                settings = get_email_settings()
                
                if not settings['notifications_enabled']:
                    return success_response({'success': True, 'message': 'Уведомления отключены'})
                
                client_email = booking_data.get('client_email')
                if not client_email:
                    return success_response({'success': True, 'message': 'Email клиента не указан'})
                
                if not settings['sender_email']:
                    return error_response('Email не настроен', 400)
                
                email_password = os.environ.get('EMAIL_PASSWORD')
                if not email_password:
                    return error_response('EMAIL_PASSWORD не настроен', 500)
                
                status_text = {
                    'confirmed': 'подтверждена',
                    'cancelled': 'отменена',
                    'completed': 'завершена'
                }.get(booking_data.get('status', ''), 'обновлена')
                
                msg = MIMEMultipart()
                msg['From'] = settings['sender_email']
                msg['To'] = client_email
                msg['Subject'] = f'Запись {status_text}'
                
                body = f'''
Здравствуйте, {booking_data.get('client_name', '')}!

Статус вашей записи изменён на: {status_text}

Услуга: {booking_data.get('service_name', '')}
Дата: {booking_data.get('appointment_date', '')}
Время: {booking_data.get('appointment_time', '')}

---
С уважением,
Наталия Великая
Система "Гармония энергий"
'''
                
                msg.attach(MIMEText(body, 'plain', 'utf-8'))
                
                server = smtplib.SMTP(settings['smtp_host'], settings['smtp_port'])
                server.starttls()
                server.login(settings['sender_email'], email_password)
                server.send_message(msg)
                server.quit()
                
                return success_response({'success': True, 'message': 'Уведомление отправлено клиенту'})
            
            else:
                return error_response('Неизвестное действие', 400)
        
        except Exception as e:
            print(f"Ошибка в notifications: {str(e)}")
            import traceback
            traceback.print_exc()
            return error_response(str(e), 500)
    
    return error_response('Метод не поддерживается', 405)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    params = event.get('queryStringParameters', {}) or {}
    endpoint = params.get('endpoint', 'reviews')
    
    if endpoint == 'reviews':
        return handle_reviews(event, context)
    elif endpoint == 'notifications':
        return handle_notifications(event, context)
    else:
        return error_response('Not found - use ?endpoint=reviews or ?endpoint=notifications', 404)
