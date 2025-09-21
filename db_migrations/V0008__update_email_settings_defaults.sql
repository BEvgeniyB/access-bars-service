-- Обновим единственную запись с правильными настройками по умолчанию
UPDATE email_settings 
SET 
    sender_email = '', 
    admin_email = '', 
    smtp_host = 'smtp.yandex.ru', 
    smtp_port = 587, 
    notifications_enabled = true,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;