CREATE TABLE IF NOT EXISTS email_settings (
    id SERIAL PRIMARY KEY,
    smtp_host VARCHAR(255) NOT NULL DEFAULT 'smtp.yandex.ru',
    smtp_port INTEGER NOT NULL DEFAULT 587,
    sender_email VARCHAR(255) NOT NULL DEFAULT 'natalya.velikaya@yandex.ru',
    admin_email VARCHAR(255) NOT NULL DEFAULT 'natalya.velikaya@yandex.ru',
    notifications_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);