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
            default_settings = {
                'smtp_host': 'smtp.yandex.ru',
                'smtp_port': 587,
                'sender_email': 'natalya.velikaya@yandex.ru',
                'admin_email': 'natalya.velikaya@yandex.ru',
                'notifications_enabled': True
            }
            
            cursor.execute("""
                INSERT INTO email_settings (smtp_host, smtp_port, sender_email, admin_email, notifications_enabled)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                default_settings['smtp_host'],
                default_settings['smtp_port'],
                default_settings['sender_email'],
                default_settings['admin_email'],
                default_settings['notifications_enabled']
            ))
            conn.commit()
            
            return default_settings
    except Exception as e:
        raise Exception(f'Ошибка получения настроек email: {str(e)}')
    finally:
        conn.close()

def save_email_settings(settings_data):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # Проверим, есть ли уже настройки
        cursor.execute("SELECT id FROM email_settings LIMIT 1")
        existing = cursor.fetchone()
        
        if existing:
            # Обновляем существующие настройки
            cursor.execute("""
                UPDATE email_settings SET 
                smtp_host = %s, 
                smtp_port = %s, 
                sender_email = %s, 
                admin_email = %s, 
                notifications_enabled = %s,
                updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            """, (
                settings_data.get('smtp_host'),
                settings_data.get('smtp_port'),
                settings_data.get('sender_email'),
                settings_data.get('admin_email'),
                settings_data.get('notifications_enabled', True),
                existing[0]
            ))
        else:
            # Создаем новые настройки
            cursor.execute("""
                INSERT INTO email_settings (smtp_host, smtp_port, sender_email, admin_email, notifications_enabled)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                settings_data.get('smtp_host'),
                settings_data.get('smtp_port'),
                settings_data.get('sender_email'),
                settings_data.get('admin_email'),
                settings_data.get('notifications_enabled', True)
            ))
        
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise Exception(f'Ошибка сохранения настроек: {str(e)}')
    finally:
        conn.close()

def handler(event, context):
    '''
    Business: Handles email notifications for bookings and admin settings
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with attributes: request_id, function_name, function_version, memory_limit_in_mb
    Returns: HTTP response dict
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
    
    # Get settings
    if method == 'GET':
        try:
            settings = get_email_settings()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'settings': settings
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
                            'error': 'EMAIL_PASSWORD не настроен в секретах'
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
        
        # Send booking notification email to admin
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

👤 Клиент: {booking_data.get('client_name', '')}
📞 Телефон: {booking_data.get('client_phone', '')}
📧 Email: {booking_data.get('client_email', 'Не указано')}

🗓 Дата: {booking_data.get('booking_date', '')}
🕒 Время: {booking_data.get('booking_time', '')} - {booking_data.get('end_time', '')}
💆‍♀️ Услуга: {booking_data.get('service_name', '')}

📝 Примечания: {booking_data.get('notes', 'Нет')}

Статус: pending

---
Система записи "Гармония энергий"
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
        
        # Send client confirmation email
        if action == 'send_client_confirmation':
            try:
                booking_data = body_data.get('booking_data', {})
                
                if not booking_data.get('client_email'):
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({
                            'success': True,
                            'message': 'Email клиента не указан'
                        })
                    }
                
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
                
                # Email to client
                msg = MIMEMultipart()
                msg['From'] = settings['sender_email']
                msg['To'] = booking_data['client_email']
                msg['Subject'] = f'Подтверждение записи - {booking_data.get("service_name", "")}'
                
                body = f'''
Здравствуйте, {booking_data.get('client_name', '')}!

Спасибо за запись в центр "Гармония энергий". Ваша запись успешно создана.

📋 ДЕТАЛИ ЗАПИСИ:
🗓 Дата: {booking_data.get('appointment_date', '')}
🕒 Время: {booking_data.get('appointment_time', '')} - {booking_data.get('end_time', '')}
💆‍♀️ Услуга: {booking_data.get('service_name', '')}

📝 Примечания: {booking_data.get('notes', 'Нет')}

Статус: Ожидает подтверждения

Мы свяжемся с вами для подтверждения записи.

До встречи!

---
С уважением,
Центр восстановления "Гармония энергий"
                '''
                
                msg.attach(MIMEText(body, 'plain', 'utf-8'))
                server.sendmail(settings['sender_email'], booking_data['client_email'], msg.as_string())
                server.quit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'message': f'Подтверждение отправлено клиенту на {booking_data["client_email"]}'
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
        
        # Send status update email to client
        if action == 'send_status_update':
            try:
                booking_data = body_data.get('booking_data', {})
                
                if not booking_data.get('client_email'):
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({
                            'success': True,
                            'message': 'Email клиента не указан'
                        })
                    }
                
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
                
                # Status mapping for user-friendly messages
                status_messages = {
                    'confirmed': 'подтверждена',
                    'cancelled': 'отменена', 
                    'completed': 'завершена'
                }
                
                status_text = status_messages.get(booking_data.get('status'), booking_data.get('status'))
                
                server = smtplib.SMTP(settings['smtp_host'], settings['smtp_port'])
                server.starttls()
                server.login(settings['sender_email'], email_password)
                
                # Email to client
                msg = MIMEMultipart()
                msg['From'] = settings['sender_email']
                msg['To'] = booking_data['client_email']
                msg['Subject'] = f'Изменение статуса записи - {booking_data.get("service_name", "")}'
                
                body = f'''
Здравствуйте, {booking_data.get('client_name', '')}!

Статус вашей записи изменен.

📋 ДЕТАЛИ ЗАПИСИ:
🗓 Дата: {booking_data.get('appointment_date', '')}
🕒 Время: {booking_data.get('appointment_time', '')}
💆‍♀️ Услуга: {booking_data.get('service_name', '')}

🔄 Новый статус: Запись {status_text}

Если у вас есть вопросы, свяжитесь с нами.

---
С уважением,
Центр восстановления "Гармония энергий"
                '''
                
                msg.attach(MIMEText(body, 'plain', 'utf-8'))
                server.sendmail(settings['sender_email'], booking_data['client_email'], msg.as_string())
                server.quit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'message': f'Уведомление о статусе отправлено клиенту на {booking_data["client_email"]}'
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