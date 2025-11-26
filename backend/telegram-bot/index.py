import json
import os
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Telegram бот для управления записями Access Bars
    Args: event с httpMethod и body от Telegram webhook
    Returns: HTTP response для Telegram API
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {'statusCode': 405, 'body': json.dumps({'error': 'Method not allowed'})}
    
    # Получаем данные от Telegram
    body_str = event.get('body', '{}')
    if not body_str:
        body_str = '{}'
    body_data = json.loads(body_str)
    
    # Обрабатываем сообщение
    if 'message' in body_data:
        result = handle_message(body_data['message'])
    elif 'callback_query' in body_data:
        result = handle_callback(body_data['callback_query'])
    else:
        result = {'ok': True}
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps(result)
    }


def get_db_connection():
    """Подключение к базе данных"""
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)


def send_telegram_message(chat_id: int, text: str, reply_markup: Optional[Dict] = None):
    """Отправка сообщения в Telegram"""
    import urllib.request
    import urllib.parse
    
    token = os.environ.get('TELEGRAM_BOT_TOKEN')
    if not token:
        return {'ok': False, 'error': 'Token not configured'}
    
    url = f'https://api.telegram.org/bot{token}/sendMessage'
    
    data = {
        'chat_id': chat_id,
        'text': text,
        'parse_mode': 'HTML'
    }
    
    if reply_markup:
        data['reply_markup'] = json.dumps(reply_markup)
    
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        return {'ok': False, 'error': str(e)}


def handle_message(message: Dict[str, Any]) -> Dict[str, Any]:
    """Обработка текстовых сообщений"""
    chat_id = message['chat']['id']
    text = message.get('text', '')
    telegram_id = message['from']['id']
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Проверяем, есть ли пользователь в базе
        cur.execute(
            "SELECT id, role, name FROM t_p89870318_access_bars_service.diary_users WHERE telegram_id = %s",
            (telegram_id,)
        )
        user = cur.fetchone()
        
        if not user and text != '/start':
            send_telegram_message(
                chat_id,
                "👋 Добро пожаловать! Нажмите /start для начала работы"
            )
            return {'ok': True}
        
        # Команда /start
        if text == '/start':
            if not user:
                # Регистрируем нового пользователя
                user_name = message['from'].get('first_name', 'Клиент')
                cur.execute(
                    """
                    INSERT INTO t_p89870318_access_bars_service.diary_users 
                    (telegram_id, role, name) 
                    VALUES (%s, %s, %s) 
                    RETURNING id, role
                    """,
                    (telegram_id, 'client', user_name)
                )
                user = cur.fetchone()
                conn.commit()
            
            show_main_menu(chat_id, user['role'])
        
        # Команда /services - список услуг
        elif text == '/services':
            show_services(chat_id)
        
        # Команда /mybookings - мои записи
        elif text == '/mybookings':
            show_my_bookings(chat_id, user['id'], user['role'])
        
        # Команда /admin - админ панель (только для owner)
        elif text == '/admin' and user['role'] == 'owner':
            show_admin_menu(chat_id)
        
        else:
            send_telegram_message(
                chat_id,
                "Используйте команды:\n/start - главное меню\n/services - услуги\n/mybookings - мои записи"
            )
        
    finally:
        cur.close()
        conn.close()
    
    return {'ok': True}


def handle_callback(callback: Dict[str, Any]) -> Dict[str, Any]:
    """Обработка нажатий на кнопки"""
    chat_id = callback['message']['chat']['id']
    data = callback['data']
    telegram_id = callback['from']['id']
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Получаем пользователя
        cur.execute(
            "SELECT id, role FROM t_p89870318_access_bars_service.diary_users WHERE telegram_id = %s",
            (telegram_id,)
        )
        user = cur.fetchone()
        
        if not user:
            send_telegram_message(chat_id, "Ошибка: пользователь не найден. Нажмите /start")
            return {'ok': True}
        
        # Обработка действий
        if data == 'book_service':
            show_services(chat_id)
        
        elif data.startswith('service_'):
            service_id = int(data.split('_')[1])
            show_available_dates(chat_id, service_id)
        
        elif data.startswith('date_'):
            parts = data.split('_')
            service_id = int(parts[1])
            date_str = parts[2]
            show_available_times(chat_id, service_id, date_str)
        
        elif data.startswith('time_'):
            parts = data.split('_')
            service_id = int(parts[1])
            date_str = parts[2]
            time_str = parts[3]
            create_booking(chat_id, user['id'], service_id, date_str, time_str, cur, conn)
        
        elif data.startswith('cancel_'):
            booking_id = int(data.split('_')[1])
            cancel_booking(chat_id, booking_id, user['id'], user['role'], cur, conn)
        
        elif data == 'my_bookings':
            show_my_bookings(chat_id, user['id'], user['role'])
        
        elif data == 'admin_all_bookings' and user['role'] == 'owner':
            show_all_bookings(chat_id)
        
        elif data == 'admin_block_date' and user['role'] == 'owner':
            send_telegram_message(chat_id, "Функция блокировки дат будет добавлена в следующей версии")
        
    finally:
        cur.close()
        conn.close()
    
    return {'ok': True}


def show_main_menu(chat_id: int, role: str):
    """Показать главное меню"""
    keyboard = {
        'inline_keyboard': [
            [{'text': '📅 Записаться на сеанс', 'callback_data': 'book_service'}],
            [{'text': '📋 Мои записи', 'callback_data': 'my_bookings'}]
        ]
    }
    
    if role == 'owner':
        keyboard['inline_keyboard'].append(
            [{'text': '⚙️ Админ-панель', 'callback_data': 'admin_panel'}]
        )
    
    send_telegram_message(
        chat_id,
        "👋 Добро пожаловать в систему записи Access Bars!\n\nВыберите действие:",
        keyboard
    )


def show_services(chat_id: int):
    """Показать список услуг"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute(
            """
            SELECT id, name, duration_minutes, price, description 
            FROM t_p89870318_access_bars_service.diary_services 
            WHERE active = true 
            ORDER BY id
            """
        )
        services = cur.fetchall()
        
        if not services:
            send_telegram_message(chat_id, "К сожалению, нет доступных услуг")
            return
        
        keyboard = {'inline_keyboard': []}
        text = "📋 <b>Доступные услуги:</b>\n\n"
        
        for service in services:
            text += f"<b>{service['name']}</b>\n"
            text += f"⏱ {service['duration_minutes']} мин | 💰 {service['price']} ₽\n"
            if service['description']:
                text += f"{service['description']}\n"
            text += "\n"
            
            keyboard['inline_keyboard'].append([{
                'text': f"Записаться: {service['name']}",
                'callback_data': f"service_{service['id']}"
            }])
        
        send_telegram_message(chat_id, text, keyboard)
        
    finally:
        cur.close()
        conn.close()


def show_available_dates(chat_id: int, service_id: int):
    """Показать доступные даты"""
    keyboard = {'inline_keyboard': []}
    text = "📅 Выберите дату:\n\n"
    
    # Показываем следующие 7 дней
    today = datetime.now()
    for i in range(7):
        date = today + timedelta(days=i)
        date_str = date.strftime('%Y-%m-%d')
        day_name = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][date.weekday()]
        
        keyboard['inline_keyboard'].append([{
            'text': f"{day_name}, {date.strftime('%d.%m.%Y')}",
            'callback_data': f"date_{service_id}_{date_str}"
        }])
    
    send_telegram_message(chat_id, text, keyboard)


def show_available_times(chat_id: int, service_id: int, date_str: str):
    """Показать доступное время"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Получаем настройки рабочего времени
        cur.execute(
            """
            SELECT key, value FROM t_p89870318_access_bars_service.diary_settings 
            WHERE owner_id = 1 AND key IN ('work_hours_start', 'work_hours_end', 'booking_interval_minutes')
            """
        )
        settings = {row['key']: row['value'] for row in cur.fetchall()}
        
        start_time = datetime.strptime(settings.get('work_hours_start', '09:00'), '%H:%M').time()
        end_time = datetime.strptime(settings.get('work_hours_end', '20:00'), '%H:%M').time()
        interval = int(settings.get('booking_interval_minutes', '30'))
        
        # Получаем занятые слоты
        cur.execute(
            """
            SELECT booking_time FROM t_p89870318_access_bars_service.diary_bookings 
            WHERE booking_date = %s AND status != 'cancelled'
            """,
            (date_str,)
        )
        booked_times = {row['booking_time'] for row in cur.fetchall()}
        
        # Генерируем доступные слоты
        keyboard = {'inline_keyboard': []}
        current = datetime.combine(datetime.today(), start_time)
        end = datetime.combine(datetime.today(), end_time)
        
        text = f"🕐 Выберите время на {date_str}:\n\n"
        
        while current < end:
            time_slot = current.time()
            if time_slot not in booked_times:
                keyboard['inline_keyboard'].append([{
                    'text': time_slot.strftime('%H:%M'),
                    'callback_data': f"time_{service_id}_{date_str}_{time_slot.strftime('%H:%M')}"
                }])
            current += timedelta(minutes=interval)
        
        if not keyboard['inline_keyboard']:
            text += "❌ К сожалению, все слоты заняты. Выберите другую дату."
        
        send_telegram_message(chat_id, text, keyboard)
        
    finally:
        cur.close()
        conn.close()


def create_booking(chat_id: int, user_id: int, service_id: int, date_str: str, time_str: str, cur, conn):
    """Создать запись"""
    try:
        # Получаем информацию об услуге
        cur.execute(
            "SELECT name, price FROM t_p89870318_access_bars_service.diary_services WHERE id = %s",
            (service_id,)
        )
        service = cur.fetchone()
        
        # Создаем запись
        cur.execute(
            """
            INSERT INTO t_p89870318_access_bars_service.diary_bookings 
            (client_id, service_id, booking_date, booking_time, status) 
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
            """,
            (user_id, service_id, date_str, time_str, 'confirmed')
        )
        booking_id = cur.fetchone()['id']
        conn.commit()
        
        text = f"✅ <b>Запись успешно создана!</b>\n\n"
        text += f"📋 Услуга: {service['name']}\n"
        text += f"📅 Дата: {date_str}\n"
        text += f"🕐 Время: {time_str}\n"
        text += f"💰 Стоимость: {service['price']} ₽\n\n"
        text += f"Номер записи: #{booking_id}"
        
        keyboard = {
            'inline_keyboard': [
                [{'text': '📋 Мои записи', 'callback_data': 'my_bookings'}],
                [{'text': '🏠 Главное меню', 'callback_data': 'main_menu'}]
            ]
        }
        
        send_telegram_message(chat_id, text, keyboard)
        
    except Exception as e:
        conn.rollback()
        send_telegram_message(chat_id, f"❌ Ошибка при создании записи: {str(e)}")


def show_my_bookings(chat_id: int, user_id: int, role: str):
    """Показать записи пользователя"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if role == 'owner':
            # Владелец видит все записи
            cur.execute(
                """
                SELECT b.id, b.booking_date, b.booking_time, b.status, 
                       s.name as service_name, u.name as client_name
                FROM t_p89870318_access_bars_service.diary_bookings b
                JOIN t_p89870318_access_bars_service.diary_services s ON b.service_id = s.id
                JOIN t_p89870318_access_bars_service.diary_users u ON b.client_id = u.id
                WHERE b.status != 'cancelled'
                ORDER BY b.booking_date, b.booking_time
                """
            )
        else:
            # Клиент видит только свои записи
            cur.execute(
                """
                SELECT b.id, b.booking_date, b.booking_time, b.status, s.name as service_name
                FROM t_p89870318_access_bars_service.diary_bookings b
                JOIN t_p89870318_access_bars_service.diary_services s ON b.service_id = s.id
                WHERE b.client_id = %s AND b.status != 'cancelled'
                ORDER BY b.booking_date, b.booking_time
                """,
                (user_id,)
            )
        
        bookings = cur.fetchall()
        
        if not bookings:
            send_telegram_message(chat_id, "У вас пока нет записей")
            return
        
        text = "📋 <b>Ваши записи:</b>\n\n"
        keyboard = {'inline_keyboard': []}
        
        for booking in bookings:
            text += f"📅 {booking['booking_date']} в {booking['booking_time']}\n"
            text += f"📋 {booking['service_name']}\n"
            if role == 'owner':
                text += f"👤 Клиент: {booking['client_name']}\n"
            text += f"Статус: {booking['status']}\n"
            text += "\n"
            
            keyboard['inline_keyboard'].append([{
                'text': f"❌ Отменить запись #{booking['id']}",
                'callback_data': f"cancel_{booking['id']}"
            }])
        
        send_telegram_message(chat_id, text, keyboard)
        
    finally:
        cur.close()
        conn.close()


def cancel_booking(chat_id: int, booking_id: int, user_id: int, role: str, cur, conn):
    """Отменить запись"""
    try:
        # Проверяем права
        if role == 'owner':
            cur.execute(
                "UPDATE t_p89870318_access_bars_service.diary_bookings SET status = 'cancelled' WHERE id = %s",
                (booking_id,)
            )
        else:
            cur.execute(
                """
                UPDATE t_p89870318_access_bars_service.diary_bookings 
                SET status = 'cancelled' 
                WHERE id = %s AND client_id = %s
                """,
                (booking_id, user_id)
            )
        
        if cur.rowcount > 0:
            conn.commit()
            send_telegram_message(chat_id, f"✅ Запись #{booking_id} успешно отменена")
        else:
            send_telegram_message(chat_id, "❌ Запись не найдена или у вас нет прав на её отмену")
    
    except Exception as e:
        conn.rollback()
        send_telegram_message(chat_id, f"❌ Ошибка при отмене записи: {str(e)}")


def show_admin_menu(chat_id: int):
    """Показать админ-панель"""
    keyboard = {
        'inline_keyboard': [
            [{'text': '📋 Все записи', 'callback_data': 'admin_all_bookings'}],
            [{'text': '🚫 Заблокировать дату', 'callback_data': 'admin_block_date'}],
            [{'text': '🏠 Главное меню', 'callback_data': 'main_menu'}]
        ]
    }
    
    send_telegram_message(
        chat_id,
        "⚙️ <b>Админ-панель</b>\n\nВыберите действие:",
        keyboard
    )


def show_all_bookings(chat_id: int):
    """Показать все записи (для админа)"""
    show_my_bookings(chat_id, 0, 'owner')