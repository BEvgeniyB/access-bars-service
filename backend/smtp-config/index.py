import json
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any

def handler(event, context):
    '''
    Business: Configure and test SMTP email settings for booking notifications
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with request_id, function_name attributes
    Returns: HTTP response dict with SMTP configuration status
    '''
    method = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    # Get current configuration status
    if method == 'GET':
        email_password = os.environ.get('EMAIL_PASSWORD')
        config_status = {
            'has_email_password': bool(email_password),
            'smtp_server': 'smtp.yandex.ru',
            'smtp_port': 587,
            'admin_email': 'natalya.velikaya@yandex.ru',
            'sender_email': 'natalya.velikaya@yandex.ru'
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(config_status)
        }
    
    # Test SMTP configuration
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'test_smtp':
            email_password = os.environ.get('EMAIL_PASSWORD')
            if not email_password:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': False,
                        'error': 'EMAIL_PASSWORD не настроен'
                    })
                }
            
            try:
                # Test SMTP connection
                server = smtplib.SMTP('smtp.yandex.ru', 587)
                server.starttls()
                server.login('natalya.velikaya@yandex.ru', email_password)
                
                # Send test email
                msg = MIMEMultipart()
                msg['From'] = 'natalya.velikaya@yandex.ru'
                msg['To'] = 'natalya.velikaya@yandex.ru'
                msg['Subject'] = 'Тест SMTP настроек - Гармония энергий'
                
                body = '''
Это тестовое письмо для проверки SMTP настроек.

SMTP сервер: smtp.yandex.ru
Порт: 587
Отправитель: natalya.velikaya@yandex.ru

Если вы получили это письмо, то настройки работают корректно!

---
Система уведомлений "Гармония энергий"
                '''
                
                msg.attach(MIMEText(body, 'plain', 'utf-8'))
                server.sendmail('natalya.velikaya@yandex.ru', 'natalya.velikaya@yandex.ru', msg.as_string())
                server.quit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'message': 'Тестовое письмо успешно отправлено на natalya.velikaya@yandex.ru'
                    })
                }
                
            except Exception as e:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': False,
                        'error': f'Ошибка SMTP: {str(e)}'
                    })
                }
        
        # Send booking notification email
        if action == 'send_notification':
            booking_data = body_data.get('booking_data', {})
            email_password = os.environ.get('EMAIL_PASSWORD')
            
            if not email_password:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': False,
                        'error': 'EMAIL_PASSWORD не настроен'
                    })
                }
            
            try:
                server = smtplib.SMTP('smtp.yandex.ru', 587)
                server.starttls()
                server.login('natalya.velikaya@yandex.ru', email_password)
                
                # Email to admin
                msg = MIMEMultipart()
                msg['From'] = 'natalya.velikaya@yandex.ru'
                msg['To'] = 'natalya.velikaya@yandex.ru'
                msg['Subject'] = f'Новая запись: {booking_data.get("service_name", "Услуга")}'
                
                body = f'''
Новая запись на услугу!

👤 Клиент: {booking_data.get("client_name", "Не указано")}
📞 Телефон: {booking_data.get("client_phone", "Не указано")}
📧 Email: {booking_data.get("client_email", "Не указано")}

🗓 Дата: {booking_data.get("appointment_date", "Не указано")}
🕒 Время: {booking_data.get("appointment_time", "Не указано")} - {booking_data.get("end_time", "Не указано")}
💆‍♀️ Услуга: {booking_data.get("service_name", "Не указано")}

Статус: {booking_data.get("status", "pending")}

---
Система записи "Гармония энергий"
Для управления записями перейдите в админ-панель сайта.
                '''
                
                msg.attach(MIMEText(body, 'plain', 'utf-8'))
                server.sendmail('natalya.velikaya@yandex.ru', 'natalya.velikaya@yandex.ru', msg.as_string())
                server.quit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'message': 'Уведомление отправлено администратору'
                    })
                }
                
            except Exception as e:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': False,
                        'error': f'Ошибка отправки: {str(e)}'
                    })
                }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Метод не поддерживается'})
    }