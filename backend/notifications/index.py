import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Business: Отправка email уведомлений для системы записи
    Args: event с httpMethod, body; context с request_id
    Returns: HTTP ответ с результатом отправки
    """
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return error_response('Method not allowed', 405)
    
    try:
        body = json.loads(event.get('body', '{}'))
        notification_type = body.get('type')
        
        if notification_type == 'new_booking':
            return send_new_booking_notification(body)
        elif notification_type == 'status_update':
            return send_status_update_notification(body)
        else:
            return error_response('Invalid notification type', 400)
            
    except Exception as e:
        return error_response(f'Server error: {str(e)}', 500)

def error_response(message: str, status_code: int) -> Dict[str, Any]:
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message})
    }

def success_response(data: Dict[str, Any], status_code: int = 200) -> Dict[str, Any]:
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(data)
    }

def send_email(to_email: str, subject: str, html_content: str) -> bool:
    """Отправляет email через SMTP"""
    try:
        smtp_host = os.environ.get('SMTP_HOST')
        smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        email_user = os.environ.get('EMAIL_USER')
        email_password = os.environ.get('EMAIL_PASSWORD')
        
        if not all([smtp_host, email_user, email_password]):
            print("Missing email configuration")
            return False
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = email_user
        msg['To'] = to_email
        
        html_part = MIMEText(html_content, 'html', 'utf-8')
        msg.attach(html_part)
        
        if smtp_port == 465:
            # SSL подключение для порта 465
            server = smtplib.SMTP_SSL(smtp_host, smtp_port)
        else:
            # TLS подключение для порта 587
            server = smtplib.SMTP(smtp_host, smtp_port)
            server.starttls()
        server.login(email_user, email_password)
        server.send_message(msg)
        server.quit()
        
        return True
        
    except Exception as e:
        print(f"Email sending error: {str(e)}")
        return False

def send_new_booking_notification(data: Dict[str, Any]) -> Dict[str, Any]:
    """Отправляет уведомление о новой записи"""
    try:
        admin_email = os.environ.get('ADMIN_EMAIL')
        if not admin_email:
            return error_response('Admin email not configured', 500)
        
        # Данные записи
        client_name = data.get('client_name', 'Не указано')
        client_phone = data.get('client_phone', 'Не указано')
        client_email = data.get('client_email', 'Не указано')
        service_name = data.get('service_name', 'Не указано')
        booking_date = data.get('booking_date', 'Не указано')
        booking_time = data.get('booking_time', 'Не указано')
        notes = data.get('notes', '')
        
        # Форматируем дату
        try:
            date_obj = datetime.strptime(booking_date, '%Y-%m-%d')
            formatted_date = date_obj.strftime('%d %B %Y')
            weekday = date_obj.strftime('%A')
            weekdays_ru = {
                'Monday': 'Понедельник',
                'Tuesday': 'Вторник', 
                'Wednesday': 'Среда',
                'Thursday': 'Четверг',
                'Friday': 'Пятница',
                'Saturday': 'Суббота',
                'Sunday': 'Воскресенье'
            }
            weekday_ru = weekdays_ru.get(weekday, weekday)
        except:
            formatted_date = booking_date
            weekday_ru = ''
        
        # HTML шаблон для уведомления
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #D4A574, #C8956D); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
                .content {{ background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }}
                .booking-info {{ background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #D4A574; }}
                .info-row {{ display: flex; justify-content: space-between; margin: 8px 0; }}
                .label {{ font-weight: bold; color: #666; }}
                .value {{ color: #333; }}
                .notes {{ background: #e8f4f8; padding: 10px; border-radius: 4px; margin-top: 10px; }}
                .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 14px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🌟 Новая запись!</h1>
                    <p>У вас новая запись на услугу</p>
                </div>
                <div class="content">
                    <div class="booking-info">
                        <h3 style="margin-top: 0; color: #D4A574;">📋 Детали записи</h3>
                        
                        <div class="info-row">
                            <span class="label">👤 Клиент:</span>
                            <span class="value">{client_name}</span>
                        </div>
                        
                        <div class="info-row">
                            <span class="label">📞 Телефон:</span>
                            <span class="value">{client_phone}</span>
                        </div>
                        
                        <div class="info-row">
                            <span class="label">📧 Email:</span>
                            <span class="value">{client_email}</span>
                        </div>
                        
                        <div class="info-row">
                            <span class="label">💆‍♀️ Услуга:</span>
                            <span class="value">{service_name}</span>
                        </div>
                        
                        <div class="info-row">
                            <span class="label">📅 Дата:</span>
                            <span class="value">{weekday_ru}, {formatted_date}</span>
                        </div>
                        
                        <div class="info-row">
                            <span class="label">🕐 Время:</span>
                            <span class="value">{booking_time}</span>
                        </div>
                        
                        {f'<div class="notes"><strong>📝 Комментарий:</strong><br>{notes}</div>' if notes else ''}
                    </div>
                    
                    <p style="text-align: center; margin: 20px 0;">
                        <a href="https://velikaya-nataliya.ru/admin" 
                           style="background: #D4A574; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 6px; display: inline-block;">
                            🔗 Перейти в админ-панель
                        </a>
                    </p>
                </div>
                <div class="footer">
                    <p>Это автоматическое уведомление от системы записи "Гармония энергий"</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        subject = f"🌟 Новая запись: {client_name} на {formatted_date}"
        
        if send_email(admin_email, subject, html_content):
            return success_response({'success': True, 'message': 'Notification sent'})
        else:
            return error_response('Failed to send email', 500)
            
    except Exception as e:
        return error_response(f'Failed to send notification: {str(e)}', 400)

def send_status_update_notification(data: Dict[str, Any]) -> Dict[str, Any]:
    """Отправляет уведомление клиенту об изменении статуса записи"""
    try:
        client_email = data.get('client_email')
        if not client_email:
            return success_response({'success': True, 'message': 'No client email provided'})
        
        client_name = data.get('client_name', 'Клиент')
        service_name = data.get('service_name', 'Услуга')
        booking_date = data.get('booking_date', '')
        booking_time = data.get('booking_time', '')
        status = data.get('status', '')
        
        status_messages = {
            'confirmed': {'text': 'подтверждена', 'color': '#28a745', 'emoji': '✅'},
            'cancelled': {'text': 'отменена', 'color': '#dc3545', 'emoji': '❌'},
            'completed': {'text': 'завершена', 'color': '#007bff', 'emoji': '🎉'}
        }
        
        status_info = status_messages.get(status, {'text': status, 'color': '#6c757d', 'emoji': '📋'})
        
        # Форматируем дату
        try:
            date_obj = datetime.strptime(booking_date, '%Y-%m-%d')
            formatted_date = date_obj.strftime('%d %B %Y')
        except:
            formatted_date = booking_date
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #D4A574, #C8956D); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
                .content {{ background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }}
                .status-info {{ background: white; padding: 20px; border-radius: 8px; margin: 15px 0; text-align: center; border-left: 4px solid {status_info['color']}; }}
                .booking-details {{ background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }}
                .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 14px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>{status_info['emoji']} Статус вашей записи изменился</h1>
                    <p>Уважаемый(ая) {client_name}</p>
                </div>
                <div class="content">
                    <div class="status-info">
                        <h2 style="color: {status_info['color']}; margin: 0;">
                            Ваша запись {status_info['text']}
                        </h2>
                    </div>
                    
                    <div class="booking-details">
                        <h3 style="margin-top: 0; color: #D4A574;">📋 Детали записи</h3>
                        <p><strong>💆‍♀️ Услуга:</strong> {service_name}</p>
                        <p><strong>📅 Дата:</strong> {formatted_date}</p>
                        <p><strong>🕐 Время:</strong> {booking_time}</p>
                    </div>
                </div>
                <div class="footer">
                    <p>С уважением, команда "Гармония энергий"</p>
                    <p>Это автоматическое уведомление</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        subject = f"{status_info['emoji']} Ваша запись {status_info['text']}"
        
        if send_email(client_email, subject, html_content):
            return success_response({'success': True, 'message': 'Client notification sent'})
        else:
            return error_response('Failed to send client email', 500)
            
    except Exception as e:
        return error_response(f'Failed to send client notification: {str(e)}', 400)