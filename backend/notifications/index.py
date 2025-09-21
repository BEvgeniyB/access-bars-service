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
            # Возвращаем настройки по умолчанию без создания записи
            return {
                'smtp_host': 'smtp.yandex.ru',
                'smtp_port': 587,
                'sender_email': '',
                'admin_email': '',
                'notifications_enabled': True
            }
    except Exception as e:
        raise Exception(f'Ошибка получения настроек email: {str(e)}')
    finally:
        conn.close()

def save_email_settings(settings_data):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # Всегда обновляем первую запись, если она есть, иначе создаем
        cursor.execute("SELECT id FROM t_p89870318_access_bars_service.email_settings ORDER BY id LIMIT 1")
        existing = cursor.fetchone()
        
        if existing:
            # Обновляем единственную запись
            cursor.execute("""
                UPDATE t_p89870318_access_bars_service.email_settings SET 
                smtp_host = %s, 
                smtp_port = %s, 
                sender_email = %s, 
                admin_email = %s, 
                notifications_enabled = %s,
                updated_at = CURRENT_TIMESTAMP
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
            # Создаем новую запись
            cursor.execute("""
                INSERT INTO t_p89870318_access_bars_service.email_settings (smtp_host, smtp_port, sender_email, admin_email, notifications_enabled)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                settings_data.get('smtp_host', 'smtp.yandex.ru'),
                settings_data.get('smtp_port', 587),
                settings_data.get('sender_email', ''),
                settings_data.get('admin_email', ''),
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
    try:
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
        
        # Send status update notification
        if method == 'POST':
            try:
                body_data = json.loads(event.get('body', '{}'))
                action = body_data.get('action')
                
                if action == 'send_notification':
                    # Уведомление администратору о новой записи
                    booking_data = body_data.get('booking_data', {})
                    
                    # Получаем настройки email
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
                                'message': 'Уведомления отключены'
                            })
                        }
                    
                    if not settings['admin_email']:
                        return {
                            'statusCode': 400,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'body': json.dumps({
                                'success': False,
                                'error': 'Email администратора не настроен'
                            })
                        }
                    
                    if not settings['sender_email']:
                        return {
                            'statusCode': 400,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'body': json.dumps({
                                'success': False,
                                'error': 'Email отправителя не настроен'
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
                    
                    # Отправляем уведомление администратору о новой записи
                    msg = MIMEMultipart()
                    msg['From'] = settings['sender_email']
                    msg['To'] = settings['admin_email']
                    msg['Subject'] = f'Новая запись - Гармония энергий'
                    
                    body = f'''
Новая запись в системе!

• Клиент: {booking_data.get('client_name', '')}
• Телефон: {booking_data.get('client_phone', '')}
• Email: {booking_data.get('client_email', 'не указан')}
• Услуга: {booking_data.get('service_name', '')}
• Дата: {booking_data.get('appointment_date', '')}
• Время: {booking_data.get('appointment_time', '')} - {booking_data.get('end_time', '')}
• Статус: ожидает подтверждения

Войдите в админ-панель для подтверждения записи.

---
Система "Гармония энергий"
'''
                    
                    msg.attach(MIMEText(body, 'plain', 'utf-8'))
                    
                    # Отправляем email
                    server = smtplib.SMTP(settings['smtp_host'], settings['smtp_port'])
                    server.starttls()
                    server.login(settings['sender_email'], email_password)
                    server.send_message(msg)
                    server.quit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({
                            'success': True,
                            'message': f'Уведомление администратору отправлено на {settings["admin_email"]}'
                        })
                    }
                
                elif action == 'send_client_confirmation':
                    # Подтверждение записи клиенту
                    booking_data = body_data.get('booking_data', {})
                    
                    # Получаем настройки email
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
                                'message': 'Уведомления отключены'
                            })
                        }
                    
                    if not settings['sender_email']:
                        return {
                            'statusCode': 400,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'body': json.dumps({
                                'success': False,
                                'error': 'Email отправителя не настроен'
                            })
                        }
                    
                    client_email = booking_data.get('client_email')
                    if not client_email:
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
                    
                    # Отправляем подтверждение клиенту
                    msg = MIMEMultipart()
                    msg['From'] = settings['sender_email']
                    msg['To'] = client_email
                    msg['Subject'] = f'Подтверждение записи - Гармония энергий'
                    
                    body = f'''
Добро пожаловать, {booking_data.get('client_name', '')}!

Ваша запись успешно создана:

• Услуга: {booking_data.get('service_name', '')}
• Дата: {booking_data.get('appointment_date', '')}
• Время: {booking_data.get('appointment_time', '')} - {booking_data.get('end_time', '')}
• Статус: ожидает подтверждения

{('• Комментарий: ' + booking_data.get('notes', '')) if booking_data.get('notes') else ''}

Мы свяжемся с вами для подтверждения записи.

---
С уважением,
Команда "Гармония энергий"
'''
                    
                    msg.attach(MIMEText(body, 'plain', 'utf-8'))
                    
                    # Отправляем email
                    server = smtplib.SMTP(settings['smtp_host'], settings['smtp_port'])
                    server.starttls()
                    server.login(settings['sender_email'], email_password)
                    server.send_message(msg)
                    server.quit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({
                            'success': True,
                            'message': f'Подтверждение отправлено клиенту на {client_email}'
                        })
                    }
                
                elif action == 'send_status_update':
                    booking_data = body_data.get('booking_data', {})
                    
                    # Получаем настройки email
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
                                'message': 'Уведомления отключены'
                            })
                        }
                    
                    if not settings['sender_email']:
                        return {
                            'statusCode': 400,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'body': json.dumps({
                                'success': False,
                                'error': 'Email отправителя не настроен'
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
                    
                    # Отправляем уведомление клиенту
                    status_translations = {
                        'pending': 'ожидает подтверждения',
                        'confirmed': 'подтверждена',
                        'cancelled': 'отменена',
                        'completed': 'завершена'
                    }
                    
                    status_text = status_translations.get(booking_data.get('status'), booking_data.get('status', 'неизвестен'))
                    
                    # Создаем email
                    msg = MIMEMultipart()
                    msg['From'] = settings['sender_email']
                    msg['To'] = booking_data.get('client_email', '')
                    msg['Subject'] = f'Изменение статуса записи - Гармония энергий'
                    
                    body = f'''
Добро пожаловать, {booking_data.get('client_name', '')}!

Статус вашей записи изменился:

• Услуга: {booking_data.get('service_name', '')}
• Дата: {booking_data.get('appointment_date', '')}
• Время: {booking_data.get('appointment_time', '')}
• Новый статус: {status_text}

---
С уважением,
Команда "Гармония энергий"
'''
                    
                    msg.attach(MIMEText(body, 'plain', 'utf-8'))
                    
                    # Отправляем email
                    server = smtplib.SMTP(settings['smtp_host'], settings['smtp_port'])
                    server.starttls()
                    server.login(settings['sender_email'], email_password)
                    server.send_message(msg)
                    server.quit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({
                            'success': True,
                            'message': f'Уведомление отправлено на {booking_data.get("client_email", "")}'
                        })
                    }
                
                else:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({
                            'success': False,
                            'error': 'Неизвестное действие'
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
                        'error': f'Ошибка отправки уведомления: {str(e)}'
                    })
                }
        
        # Get settings
        if method == 'GET':
            try:
                settings = get_email_settings()
                
                # Проверяем наличие EMAIL_PASSWORD
                email_password = os.environ.get('EMAIL_PASSWORD')
                has_email_password = bool(email_password)
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'settings': settings,
                        'has_email_password': has_email_password,
                        'smtp_host': settings.get('smtp_host'),
                        'smtp_port': settings.get('smtp_port'),
                        'sender_email': settings.get('sender_email'),
                        'admin_email': settings.get('admin_email'),
                        'notifications_enabled': settings.get('notifications_enabled')
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
                    
                    # Проверяем, что все настройки заполнены
                    if not settings['sender_email'] or not settings['admin_email']:
                        return {
                            'statusCode': 400,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'body': json.dumps({
                                'success': False,
                                'error': 'Заполните email отправителя и администратора'
                            })
                        }
                    
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
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Метод не поддерживается'})
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
                'error': f'Handler error: {str(e)}'
            })
        }