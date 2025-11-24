-- Добавление полей для Telegram-авторизации и администрирования

-- Добавляем поле is_admin для определения прав администратора
ALTER TABLE t_p89870318_access_bars_service.users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Добавляем поле telegram_group_id для проверки группы
ALTER TABLE t_p89870318_access_bars_service.users 
ADD COLUMN IF NOT EXISTS telegram_group_id VARCHAR(255);

-- Создаём индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_users_telegram_id 
ON t_p89870318_access_bars_service.users(telegram_id);

CREATE INDEX IF NOT EXISTS idx_users_telegram_group_id 
ON t_p89870318_access_bars_service.users(telegram_group_id);

CREATE INDEX IF NOT EXISTS idx_users_is_admin 
ON t_p89870318_access_bars_service.users(is_admin);

-- Комментарии для полей
COMMENT ON COLUMN t_p89870318_access_bars_service.users.is_admin IS 'Признак администратора (TRUE - админ, FALSE - обычный пользователь)';
COMMENT ON COLUMN t_p89870318_access_bars_service.users.telegram_group_id IS 'ID Telegram-группы для двойной проверки доступа';