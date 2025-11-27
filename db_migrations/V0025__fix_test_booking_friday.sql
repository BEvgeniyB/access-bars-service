-- Обновляем существующую запись на правильное время для пятницы (конфликт с учёбой 10:10-13:20)
UPDATE t_p89870318_access_bars_service.diary_bookings 
SET start_time = '11:00', 
    end_time = '12:00',
    booking_time = '11:00'
WHERE id = 2;