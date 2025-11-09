'''Shared HTTP response utilities'''

import json

def success_response(data, status_code=200):
    '''
    Возвращает успешный JSON response
    Args: data - данные для отправки (dict или любой JSON-serializable объект)
          status_code - HTTP код ответа
    Returns: HTTP response dict
    '''
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(data, default=str),
        'isBase64Encoded': False
    }

def error_response(message, status_code=500):
    '''
    Возвращает ошибку JSON response
    Args: message - текст ошибки
          status_code - HTTP код ошибки
    Returns: HTTP response dict
    '''
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message}),
        'isBase64Encoded': False
    }
