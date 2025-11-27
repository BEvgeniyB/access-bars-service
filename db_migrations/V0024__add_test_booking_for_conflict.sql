-- Создание тестовой записи на 28 ноября для проверки конфликта с учёбой
INSERT INTO t_p89870318_access_bars_service.diary_bookings 
(owner_id, client_id, service_id, booking_date, booking_time, start_time, end_time, status)
VALUES 
(1, 1, 5, '2025-11-28', '15:00', '15:00', '16:00', 'confirmed');