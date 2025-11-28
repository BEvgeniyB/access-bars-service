-- Обновление рабочего времени на 10:00
UPDATE t_p89870318_access_bars_service.diary_settings 
SET value = '10:00' 
WHERE key = 'work_hours_start';
