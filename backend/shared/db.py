'''Shared database connection utilities'''

import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection(dict_cursor=False):
    '''
    Создает подключение к PostgreSQL используя простой протокол
    Args: dict_cursor - если True, возвращает результаты как словари
    Returns: connection объект
    '''
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise ValueError('DATABASE_URL not found in environment')
    
    if dict_cursor:
        return psycopg2.connect(database_url, cursor_factory=RealDictCursor)
    return psycopg2.connect(database_url)
