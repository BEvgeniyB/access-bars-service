-- Изменяем дефолтное значение статуса с 'confirmed' на 'pending'
ALTER TABLE t_p89870318_access_bars_service.bookings 
ALTER COLUMN status SET DEFAULT 'pending';

-- Обновляем существующие записи со статусом 'confirmed' на 'pending' для тестирования
UPDATE t_p89870318_access_bars_service.bookings 
SET status = 'pending' 
WHERE status = 'confirmed' AND created_at > CURRENT_DATE;