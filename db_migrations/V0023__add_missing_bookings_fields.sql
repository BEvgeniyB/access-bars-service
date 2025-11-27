-- Добавление недостающих полей в таблицу diary_bookings
ALTER TABLE t_p89870318_access_bars_service.diary_bookings 
ADD COLUMN IF NOT EXISTS owner_id INTEGER,
ADD COLUMN IF NOT EXISTS start_time TIME,
ADD COLUMN IF NOT EXISTS end_time TIME,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Установим owner_id = 1 для существующих записей
UPDATE t_p89870318_access_bars_service.diary_bookings 
SET owner_id = 1 
WHERE owner_id IS NULL;