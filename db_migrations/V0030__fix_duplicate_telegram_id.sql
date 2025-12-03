-- Remove duplicate telegram_id from user 10
UPDATE users SET telegram_id = NULL WHERE id = 10;

-- Add unique constraint to prevent duplicates in future
ALTER TABLE users ADD CONSTRAINT users_telegram_id_unique UNIQUE (telegram_id);