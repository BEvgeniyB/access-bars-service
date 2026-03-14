CREATE TABLE t_p89870318_access_bars_service.schedule_work_hours (
    id SERIAL PRIMARY KEY,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME,
    end_time TIME,
    is_day_off BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(day_of_week)
);

INSERT INTO t_p89870318_access_bars_service.schedule_work_hours (day_of_week, start_time, end_time, is_day_off) VALUES
(0, '12:00', '20:00', FALSE),
(1, '16:30', '20:00', FALSE),
(2, NULL, NULL, TRUE),
(3, '10:00', '12:00', FALSE),
(4, '10:00', '20:00', FALSE),
(5, '14:30', '20:00', FALSE),
(6, '12:00', '20:00', FALSE);
