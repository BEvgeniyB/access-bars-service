import json
import os
import psycopg2
from typing import Dict, Any, Optional

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Telegram бот для открытия формы пользователя по chakra_id.
    Обрабатывает команды /1-/7 и webhook от Telegram.
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
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    bot_token = os.environ.get('TELEGRAM_CHAKRA_BOT_TOKEN')
    database_url = os.environ.get('DATABASE_URL')
    website_url = os.environ.get('WEBSITE_URL', 'https://chakra-access-bars.poehali.app')
    
    if not bot_token:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'TELEGRAM_CHAKRA_BOT_TOKEN not configured'})
        }
    
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    body_str = event.get('body', '{}')
    update = json.loads(body_str)
    
    message = update.get('message', {})
    chat_id = message.get('chat', {}).get('id')
    text = message.get('text', '')
    telegram_username = message.get('from', {}).get('username', '')
    
    if not chat_id or not text:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True})
        }
    
    if text.startswith('/'):
        command = text.strip()
        
        if command.startswith('/э '):
            search_query = command[3:].strip()
            
            if not search_query:
                send_telegram_message(
                    bot_token,
                    chat_id,
                    '❌ Укажите текст для поиска. Пример: /э любовь'
                )
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps({'ok': True})
                }
            
            results = search_concepts(database_url, search_query)
            
            if not results:
                send_telegram_message(
                    bot_token,
                    chat_id,
                    f'❌ Ничего не найдено по запросу "{search_query}"'
                )
            else:
                message_lines = [f'Найдено: {len(results)}']
                for result in results:
                    line = f"💫 {result['concept']} {result['chakra_id']} {result['user_name']}"
                    message_lines.append(line)
                
                send_telegram_message(
                    bot_token,
                    chat_id,
                    '\n'.join(message_lines)
                )
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True})
            }
        
        if command in ['/1', '/2', '/3', '/4', '/5', '/6', '/7']:
            chakra_id = int(command[1])
            
            if not telegram_username:
                send_telegram_message(
                    bot_token,
                    chat_id,
                    '❌ У вас не установлен username в Telegram. Пожалуйста, установите его в настройках Telegram.'
                )
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps({'ok': True})
                }
            
            user = find_user_by_telegram(database_url, telegram_username, chakra_id)
            
            if not user:
                send_telegram_message(
                    bot_token,
                    chat_id,
                    '❌ Вы не зарегистрированы в системе. Обратитесь к администратору.'
                )
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps({'ok': True})
                }
            
            user_id = user['id']
            base_url = website_url.rstrip('/')
            url = f"{base_url}/structure?chakra={chakra_id}&user={user_id}"
            
            keyboard = {
                'inline_keyboard': [
                    [{'text': '🚀 На сайт', 'url': url}]
                ]
            }
            
            send_telegram_message(
                bot_token,
                chat_id,
                f'✅ Форма чакры {chakra_id} готова!',
                keyboard
            )
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'ok': True})
    }


def search_concepts(database_url: str, search_query: str) -> list:
    '''Поиск энергий по части строки (регистронезависимый)'''
    conn = None
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        escaped_query = search_query.replace("'", "''")
        query = f"""
            SELECT cc.concept, cc.chakra_id, u.name as user_name
            FROM chakra_concepts cc
            LEFT JOIN users u ON cc.user_id = u.id
            WHERE LOWER(cc.concept) LIKE LOWER('%{escaped_query}%')
            ORDER BY cc.chakra_id, cc.concept
        """
        cur.execute(query)
        
        results = []
        for row in cur.fetchall():
            results.append({
                'concept': row[0],
                'chakra_id': row[1],
                'user_name': row[2] or 'Неизвестно'
            })
        
        return results
    finally:
        if conn:
            conn.close()


def find_user_by_telegram(database_url: str, telegram_username: str, chakra_id: int) -> Optional[Dict]:
    '''Поиск пользователя по telegram_username (без проверки chakra_id)'''
    conn = None
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        query = f"SELECT id, chakra_id, telegram_username FROM users WHERE telegram_username = '{telegram_username}'"
        cur.execute(query)
        
        row = cur.fetchone()
        if row:
            return {
                'id': row[0],
                'chakra_id': row[1],
                'telegram_username': row[2]
            }
        
        # Если пользователь не найден - отправляем сообщение
        return None
    finally:
        if conn:
            conn.close()


def send_telegram_message(bot_token: str, chat_id: int, text: str, reply_markup: Optional[Dict] = None):
    '''Отправка сообщения в Telegram'''
    import urllib.request
    import urllib.parse
    
    url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
    
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
    
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))