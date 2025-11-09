'''Shared CORS handling utilities'''

def handle_cors_options(allowed_methods='GET, POST, PUT, DELETE, OPTIONS'):
    '''
    Возвращает стандартный CORS response для OPTIONS запросов
    Args: allowed_methods - разрешенные HTTP методы
    Returns: HTTP response dict
    '''
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': allowed_methods,
            'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, X-Admin-Token, Authorization, User-Agent, Referer',
            'Access-Control-Max-Age': '86400'
        },
        'body': '',
        'isBase64Encoded': False
    }
