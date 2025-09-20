-- Обновляем время работы с 12:00 до 21:00
UPDATE t_p89870318_access_bars_service.master_schedule 
SET start_time = '12:00:00', 
    end_time = '21:00:00',
    break_start_time = NULL,
    break_end_time = NULL,
    notes = 'Рабочий день 12:00-21:00'
WHERE is_working = true;