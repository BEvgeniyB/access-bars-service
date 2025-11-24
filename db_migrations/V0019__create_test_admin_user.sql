-- Создание тестового администратора для демонстрации

-- Добавляем тестового администратора с Telegram ID
INSERT INTO t_p89870318_access_bars_service.users 
  (name, email, role, is_admin, telegram_id, telegram_group_id, telegram_username, password_hash)
VALUES 
  ('Тестовый Админ', 'admin@test.com', 'admin', TRUE, '123456789', '-1001234567890', 'test_admin', NULL)
ON CONFLICT DO NOTHING;

-- Обновляем существующего пользователя id=2 как админ для тестирования
UPDATE t_p89870318_access_bars_service.users
SET 
  is_admin = TRUE,
  telegram_id = '987654321',
  telegram_group_id = '-1001234567890'
WHERE id = 2;

COMMENT ON TABLE t_p89870318_access_bars_service.users IS 'Для входа в админку используйте: Telegram ID = 987654321, Group ID = -1001234567890 (Татьяна, админ)';