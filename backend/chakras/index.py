import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для работы с системой чакр - получение списка, детальной информации и обновление
    Args: event с httpMethod, body, queryStringParameters, headers
          context с request_id
    Returns: HTTP response с данными чакр
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database configuration missing'})
        }
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            chakra_id = params.get('id')
            
            if chakra_id:
                return get_chakra_detail(cur, chakra_id)
            else:
                return get_all_chakras(cur)
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            chakra_id = body.get('id')
            user_role = event.get('headers', {}).get('X-User-Role', 'viewer')
            user_id = event.get('headers', {}).get('X-User-Id')
            
            if user_role not in ['admin', 'responsible']:
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Insufficient permissions'})
                }
            
            return update_chakra(cur, conn, chakra_id, body, user_id)
        
        cur.close()
        conn.close()
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }

def get_all_chakras(cur) -> Dict[str, Any]:
    query = '''
        SELECT 
            c.id, c.name, c.position, c.color, c.symbol_url,
            c.continent, c.right_statement, c.status,
            u.name as responsible_name
        FROM chakras c
        LEFT JOIN users u ON c.responsible_user_id = u.id
        ORDER BY c.position
    '''
    cur.execute(query)
    chakras = cur.fetchall()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'chakras': [dict(ch) for ch in chakras]}, ensure_ascii=False)
    }

def get_chakra_detail(cur, chakra_id: str) -> Dict[str, Any]:
    cur.execute('''
        SELECT 
            c.*,
            u.name as responsible_name,
            u.email as responsible_email
        FROM chakras c
        LEFT JOIN users u ON c.responsible_user_id = u.id
        WHERE c.id = %s
    ''', (chakra_id,))
    
    chakra = cur.fetchone()
    if not chakra:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Chakra not found'})
        }
    
    chakra_dict = dict(chakra)
    
    cur.execute('SELECT concept, category FROM chakra_concepts WHERE chakra_id = %s', (chakra_id,))
    chakra_dict['concepts'] = [dict(c) for c in cur.fetchall()]
    
    cur.execute('SELECT organ_name, description FROM chakra_organs WHERE chakra_id = %s', (chakra_id,))
    chakra_dict['organs'] = [dict(o) for o in cur.fetchall()]
    
    cur.execute('SELECT science_name, description FROM chakra_sciences WHERE chakra_id = %s', (chakra_id,))
    chakra_dict['sciences'] = [dict(s) for s in cur.fetchall()]
    
    cur.execute('SELECT responsibility, category FROM chakra_responsibilities WHERE chakra_id = %s', (chakra_id,))
    chakra_dict['responsibilities'] = [dict(r) for r in cur.fetchall()]
    
    cur.execute('SELECT question, is_resolved FROM chakra_questions WHERE chakra_id = %s', (chakra_id,))
    chakra_dict['questions'] = [dict(q) for q in cur.fetchall()]
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'chakra': chakra_dict}, ensure_ascii=False)
    }

def update_chakra(cur, conn, chakra_id: str, data: Dict, user_id: str) -> Dict[str, Any]:
    updates = []
    values = []
    
    allowed_fields = ['name', 'color', 'continent', 'right_statement', 'status', 'symbol_url']
    
    for field in allowed_fields:
        if field in data:
            updates.append(f"{field} = %s")
            values.append(data[field])
    
    if not updates:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'No fields to update'})
        }
    
    values.append(chakra_id)
    query = f"UPDATE chakras SET {', '.join(updates)}, updated_at = CURRENT_TIMESTAMP WHERE id = %s"
    
    cur.execute(query, values)
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'message': 'Chakra updated'})
    }