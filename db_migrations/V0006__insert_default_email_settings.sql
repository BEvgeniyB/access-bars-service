INSERT INTO email_settings (smtp_host, smtp_port, sender_email, admin_email, notifications_enabled) 
VALUES ('smtp.yandex.ru', 587, 'natalya.velikaya@yandex.ru', 'natalya.velikaya@yandex.ru', true)
ON CONFLICT (id) DO NOTHING;