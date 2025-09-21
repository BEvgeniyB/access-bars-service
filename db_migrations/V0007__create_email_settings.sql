CREATE TABLE IF NOT EXISTS email_settings (
    id SERIAL PRIMARY KEY,
    smtp_host VARCHAR(255) NOT NULL DEFAULT 'smtp.yandex.ru',
    smtp_port INTEGER NOT NULL DEFAULT 587,
    sender_email VARCHAR(255) NOT NULL,
    admin_email VARCHAR(255) NOT NULL,
    notifications_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Вставляем настройки по умолчанию
INSERT INTO email_settings (sender_email, admin_email) 
VALUES ('natalya.velikaya@yandex.ru', 'natalya.velikaya@yandex.ru')
ON CONFLICT DO NOTHING;