-- Убираем @ из telegram_username для корректной работы с Telegram API
UPDATE users 
SET telegram_username = REPLACE(telegram_username, '@', '') 
WHERE telegram_username LIKE '@%';