'''
Business: API для управления отзывами клиентов с модерацией
Args: event - dict с httpMethod, body, queryStringParameters
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с отзывами или статусом операции
'''

import json
import os
from typing import Dict, Any, List, Optional

from shared_db import get_db_connection
from shared_cors import handle_cors_options
from shared_responses import success_response, error_response

def get_reviews(status: Optional[str] = None, service: Optional[str] = None) -> List[Dict[str, Any]]:
    '''Получает отзывы из БД с фильтрацией'''
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        query = "SELECT id, name, service, rating, text, status, created_at FROM reviews WHERE 1=1"
        params = []
        
        if status:
            query += " AND status = %s"
            params.append(status)
        
        if service and service.lower() != 'все':
            query += " AND LOWER(service) LIKE %s"
            params.append(f'%{service.lower()}%')
        
        query += " ORDER BY created_at DESC"
        
        cur.execute(query, tuple(params))
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
        
        return reviews
    finally:
        cur.close()
        conn.close()

def create_review(name: str, service: str, rating: int, text: str) -> Dict[str, Any]:
    '''Создает новый отзыв со статусом pending'''
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
        
        return review
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()

def update_review_status(review_id: int, status: str) -> bool:
    '''Обновляет статус отзыва (для модерации)'''
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        query = "UPDATE reviews SET status = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s"
        cur.execute(query, (status, review_id))
        conn.commit()
        
        affected = cur.rowcount
        return affected > 0
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()

def update_review_text(review_id: int, text: str) -> bool:
    '''Обновляет текст отзыва (для редактирования админом)'''
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        query = "UPDATE reviews SET text = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s"
        cur.execute(query, (text, review_id))
        conn.commit()
        
        affected = cur.rowcount
        return affected > 0
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()

def update_review_full(review_id: int, name: str, service: str, rating: int, text: str) -> bool:
    '''Обновляет все поля отзыва (для полного редактирования админом)'''
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        query = """
            UPDATE reviews 
            SET name = %s, 
                service = %s, 
                rating = %s, 
                text = %s, 
                updated_at = CURRENT_TIMESTAMP 
            WHERE id = %s
        """
        cur.execute(query, (name, service, rating, text, review_id))
        conn.commit()
        
        affected = cur.rowcount
        return affected > 0
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()

def delete_review(review_id: int) -> bool:
    '''Удаляет отзыв из базы данных'''
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        query = "DELETE FROM reviews WHERE id = %s"
        cur.execute(query, (review_id,))
        conn.commit()
        
        affected = cur.rowcount
        return affected > 0
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()

def verify_admin_token(event: Dict[str, Any]) -> bool:
    '''Проверяет административный токен'''
    headers = event.get('headers', {})
    token = headers.get('x-admin-token') or headers.get('X-Admin-Token')
    
    if not token:
        return False
    
    expected_token = os.environ.get('ADMIN_TOKEN')
    if not expected_token:
        return False
    
    return token == expected_token

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return handle_cors_options('GET, POST, PUT, PATCH, DELETE, OPTIONS')
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            status = params.get('status', 'approved')
            service = params.get('service')
            
            reviews = get_reviews(status=status, service=service)
            
            return success_response({'success': True, 'reviews': reviews})
        
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
            
            review = create_review(name, service, rating, text)
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps({'success': True, 'review': review, 'message': 'Отзыв отправлен на модерацию'}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            if not verify_admin_token(event):
                return {
                    'statusCode': 401,
                    'headers': headers,
                    'body': json.dumps({'success': False, 'error': 'Unauthorized'}),
                    'isBase64Encoded': False
                }
            
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
        
        elif method == 'PATCH':
            if not verify_admin_token(event):
                return {
                    'statusCode': 401,
                    'headers': headers,
                    'body': json.dumps({'success': False, 'error': 'Unauthorized'}),
                    'isBase64Encoded': False
                }
            
            body_data = json.loads(event.get('body', '{}'))
            review_id = body_data.get('id')
            
            if not review_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'success': False, 'error': 'ID обязателен'}),
                    'isBase64Encoded': False
                }
            
            if 'text' in body_data and len(set(body_data.keys()) - {'id', 'text'}) == 0:
                text = body_data['text']
                if len(text) > 5000:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'success': False, 'error': 'Текст слишком длинный'}),
                        'isBase64Encoded': False
                    }
                success = update_review_text(review_id, text)
            else:
                name = body_data.get('name', '').strip()
                service = body_data.get('service', '').strip()
                rating = body_data.get('rating')
                text = body_data.get('text', '').strip()
                
                if not name or not service or not text or rating is None:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'success': False, 'error': 'Все поля обязательны'}),
                        'isBase64Encoded': False
                    }
                
                if rating < 1 or rating > 5:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'success': False, 'error': 'Рейтинг должен быть от 1 до 5'}),
                        'isBase64Encoded': False
                    }
                
                success = update_review_full(review_id, name, service, rating, text)
            
            if success:
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'success': True, 'message': 'Отзыв обновлен'}),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'success': False, 'error': 'Отзыв не найден'}),
                    'isBase64Encoded': False
                }
        
        elif method == 'DELETE':
            if not verify_admin_token(event):
                return {
                    'statusCode': 401,
                    'headers': headers,
                    'body': json.dumps({'success': False, 'error': 'Unauthorized'}),
                    'isBase64Encoded': False
                }
            
            params = event.get('queryStringParameters', {}) or {}
            review_id = params.get('id')
            
            if not review_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'success': False, 'error': 'ID обязателен'}),
                    'isBase64Encoded': False
                }
            
            success = delete_review(int(review_id))
            
            if success:
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'success': True, 'message': 'Отзыв удален'}),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'success': False, 'error': 'Отзыв не найден'}),
                    'isBase64Encoded': False
                }
        
        else:
            return {
                'statusCode': 405,
                'headers': headers,
                'body': json.dumps({'success': False, 'error': 'Метод не поддерживается'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'success': False, 'error': str(e)}),
            'isBase64Encoded': False
        }