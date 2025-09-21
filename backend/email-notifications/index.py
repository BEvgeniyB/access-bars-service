import json
import smtplib
import os
import psycopg2
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise Exception('DATABASE_URL не настроен')
    return psycopg2.connect(database_url)

def get_email_settings():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT smtp_host, smtp_port, sender_email, admin_email, notifications_enabled FROM email_settings LIMIT 1")
        result = cursor.fetchone()
        
        if result:
            return {
                'smtp_host': result[0],
                'smtp_port': result[1], 
                'sender_email': result[2],
                'admin_email': result[3],
                'notifications_enabled': result[4]
            }
        else:
            # Создать настройки по умолчанию если их нет
            cursor.execute("""
                INSERT INTO email_settings (smtp_host, smtp_port, sender_email, admin_email, notifications_enabled) 
                VALUES (%s, %s, %s, %s, %s) RETURNING smtp_host, smtp_port, sender_email, admin_email, notifications_enabled
            """, ('smtp.yandex.ru', 587, 'natalya.velikaya@yandex.ru', 'natalya.velikaya@yandex.ru', True))
            conn.commit()
            result = cursor.fetchone()
            return {
                'smtp_host': result[0],
                'smtp_port': result[1],
                'sender_email': result[2], 
                'admin_email': result[3],
                'notifications_enabled': result[4]
            }
    finally:
        conn.close()

def save_email_settings(settings):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE email_settings SET 
            smtp_host = %s, smtp_port = %s, sender_email = %s, admin_email = %s, 
            notifications_enabled = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = (SELECT id FROM email_settings LIMIT 1)
        """, (
            settings['smtp_host'], settings['smtp_port'], 
            settings['sender_email'], settings['admin_email'], 
            settings['notifications_enabled']
        ))
        conn.commit()
    finally:
        conn.close()

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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    # Get current configuration status
    if method == 'GET':
        try:
            email_password = os.environ.get('EMAIL_PASSWORD')
            settings = get_email_settings()
            
            config_status = {
                'has_email_password': bool(email_password),
                'smtp_server': settings['smtp_host'],
                'smtp_port': settings['smtp_port'],
                'admin_email': settings['admin_email'],
                'sender_email': settings['sender_email'],
                'notifications_enabled': settings['notifications_enabled']
            }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(config_status)
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': f'Ошибка получения настроек: {str(e)}'
                })
            }
    
    # Save settings 
    if method == 'PUT':
        try:
            body_data = json.loads(event.get('body', '{}'))
            save_email_settings(body_data)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': 'Настройки сохранены'
                })
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': f'Ошибка сохранения: {str(e)}'
                })
            }
    
    # Test SMTP configuration and send notifications
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'test_smtp':
            try:
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
                
                settings = get_email_settings()
                
                # Test SMTP connection
                server = smtplib.SMTP(settings['smtp_host'], settings['smtp_port'])
                server.starttls()
                server.login(settings['sender_email'], email_password)
                
                # Send test email
                msg = MIMEMultipart()
                msg['From'] = settings['sender_email']
                msg['To'] = settings['admin_email']
                msg['Subject'] = 'Тест SMTP настроек - Гармония энергий'
                
                body = f'''
Это тестовое письмо для проверки SMTP настроек.

SMTP сервер: {settings['smtp_host']}
Порт: {settings['smtp_port']}
Отправитель: {settings['sender_email']}
Администратор: {settings['admin_email']}

Если вы получили это письмо, то настройки работают корректно!

---
Система уведомлений "Гармония энергий"
                '''
                
                msg.attach(MIMEText(body, 'plain', 'utf-8'))
                server.sendmail(settings['sender_email'], settings['admin_email'], msg.as_string())
                server.quit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'message': f'Тестовое письмо успешно отправлено на {settings["admin_email"]}'
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
            try:
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
                
                settings = get_email_settings()
                
                if not settings['notifications_enabled']:
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({
                            'success': True,
                            'message': 'Уведомления отключены в настройках'
                        })
                    }
                
                server = smtplib.SMTP(settings['smtp_host'], settings['smtp_port'])
                server.starttls()
                server.login(settings['sender_email'], email_password)
                
                # Email to admin
                msg = MIMEMultipart()
                msg['From'] = settings['sender_email']
                msg['To'] = settings['admin_email']
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
                server.sendmail(settings['sender_email'], settings['admin_email'], msg.as_string())
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