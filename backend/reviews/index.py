'''
Business: API для управления отзывами клиентов с модерацией
Args: event - dict с httpMethod, body, queryStringParameters
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с отзывами или статусом операции
'''

import json
import os
import psycopg2
from typing import Dict, Any, List, Optional

def get_db_connection():
    '''Создает подключение к PostgreSQL используя простой протокол'''
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise ValueError('DATABASE_URL not found in environment')
    
    conn = psycopg2.connect(database_url)
    conn.autocommit = True
    return conn

def get_reviews(status: Optional[str] = None, service: Optional[str] = None) -> List[Dict[str, Any]]:
    '''Получает отзывы из БД с фильтрацией'''
    conn = get_db_connection()
    cur = conn.cursor()
    
    query = "SELECT id, name, service, rating, text, status, created_at FROM reviews WHERE 1=1"
    
    if status:
        query += f" AND status = '{status}'"
    
    if service and service.lower() != 'все':
        query += f" AND LOWER(service) LIKE '%{service.lower()}%'"
    
    query += " ORDER BY created_at DESC"
    
    cur.execute(query)
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
    
    cur.close()
    conn.close()
    
    return reviews

def create_review(name: str, service: str, rating: int, text: str) -> Dict[str, Any]:
    '''Создает новый отзыв со статусом pending'''
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Экранирование одинарных кавычек
    name = name.replace("'", "''")
    service = service.replace("'", "''")
    text = text.replace("'", "''")
    
    query = f"""
        INSERT INTO reviews (name, service, rating, text, status)
        VALUES ('{name}', '{service}', {rating}, '{text}', 'pending')
        RETURNING id, name, service, rating, text, status, created_at
    """
    
    cur.execute(query)
    row = cur.fetchone()
    
    review = {
        'id': row[0],
        'name': row[1],
        'service': row[2],
        'rating': row[3],
        'text': row[4],
        'status': row[5],
        'date': row[6].isoformat() if row[6] else None
    }
    
    cur.close()
    conn.close()
    
    return review

def update_review_status(review_id: int, status: str) -> bool:
    '''Обновляет статус отзыва (для модерации)'''
    conn = get_db_connection()
    cur = conn.cursor()
    
    query = f"UPDATE reviews SET status = '{status}', updated_at = CURRENT_TIMESTAMP WHERE id = {review_id}"
    cur.execute(query)
    
    affected = cur.rowcount
    
    cur.close()
    conn.close()
    
    return affected > 0

def update_review_text(review_id: int, text: str) -> bool:
    '''Обновляет текст отзыва (для редактирования админом)'''
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Экранирование одинарных кавычек
    text = text.replace("'", "''")
    
    query = f"UPDATE reviews SET text = '{text}', updated_at = CURRENT_TIMESTAMP WHERE id = {review_id}"
    cur.execute(query)
    
    affected = cur.rowcount
    
    cur.close()
    conn.close()
    
    return affected > 0

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # CORS preflight
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    # GET - получить отзывы
    if method == 'GET':
        params = event.get('queryStringParameters', {}) or {}
        status = params.get('status', 'approved')
        service = params.get('service')
        
        reviews = get_reviews(status=status, service=service)
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'success': True, 'reviews': reviews}),
            'isBase64Encoded': False
        }
    
    # POST - создать новый отзыв
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        
        name = body_data.get('name', '').strip()
        service = body_data.get('service', '').strip()
        rating = body_data.get('rating', 5)
        text = body_data.get('text', '').strip()
        
        if not name or not service or not text:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'success': False, 'error': 'Заполните все поля'}),
                'isBase64Encoded': False
            }
        
        if rating < 1 or rating > 5:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'success': False, 'error': 'Рейтинг должен быть от 1 до 5'}),
                'isBase64Encoded': False
            }
        
        review = create_review(name, service, rating, text)
        
        return {
            'statusCode': 201,
            'headers': headers,
            'body': json.dumps({'success': True, 'review': review, 'message': 'Отзыв отправлен на модерацию'}),
            'isBase64Encoded': False
        }
    
    # PUT - обновить статус (модерация)
    if method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        
        review_id = body_data.get('id')
        status = body_data.get('status')
        
        if not review_id or not status:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'success': False, 'error': 'ID и статус обязательны'}),
                'isBase64Encoded': False
            }
        
        if status not in ['pending', 'approved', 'rejected']:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'success': False, 'error': 'Неверный статус'}),
                'isBase64Encoded': False
            }
        
        success = update_review_status(review_id, status)
        
        if success:
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'success': True, 'message': 'Статус обновлен'}),
                'isBase64Encoded': False
            }
        else:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'success': False, 'error': 'Отзыв не найден'}),
                'isBase64Encoded': False
            }
    
    # PATCH - обновить текст отзыва (редактирование админом)
    if method == 'PATCH':
        body_data = json.loads(event.get('body', '{}'))
        
        review_id = body_data.get('id')
        text = body_data.get('text', '').strip()
        
        if not review_id or not text:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'success': False, 'error': 'ID и текст обязательны'}),
                'isBase64Encoded': False
            }
        
        success = update_review_text(review_id, text)
        
        if success:
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'success': True, 'message': 'Текст отзыва обновлен'}),
                'isBase64Encoded': False
            }
        else:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'success': False, 'error': 'Отзыв не найден'}),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': headers,
        'body': json.dumps({'success': False, 'error': 'Метод не поддерживается'}),
        'isBase64Encoded': False
    }