def handler(event, context):
    """
    Business: Тестовое API для проверки работы backend
    Args: event с данными запроса, context с мета-информацией
    Returns: Простой HTTP ответ
    """
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': '{"message": "Test API works", "success": true}'
    }