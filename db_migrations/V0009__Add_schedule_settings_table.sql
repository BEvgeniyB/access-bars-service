-- Создание таблицы настроек расписания
CREATE TABLE IF NOT EXISTS t_p89870318_access_bars_service.schedule_settings (
    id SERIAL PRIMARY KEY,
    time_slot_interval_minutes INTEGER NOT NULL DEFAULT 30 CHECK (time_slot_interval_minutes > 0),
    break_duration_minutes INTEGER NOT NULL DEFAULT 30 CHECK (break_duration_minutes >= 0),
    working_hours_start TIME NOT NULL DEFAULT '12:00:00',
    working_hours_end TIME NOT NULL DEFAULT '21:00:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Вставляем настройки по умолчанию
INSERT INTO t_p89870318_access_bars_service.schedule_settings 
(time_slot_interval_minutes, break_duration_minutes, working_hours_start, working_hours_end)
VALUES (30, 30, '12:00:00', '21:00:00')
ON CONFLICT DO NOTHING;

-- Комментарии к полям
COMMENT ON TABLE t_p89870318_access_bars_service.schedule_settings IS 'Настройки расписания: интервалы времени, перерывы, рабочие часы';
COMMENT ON COLUMN t_p89870318_access_bars_service.schedule_settings.time_slot_interval_minutes IS 'Интервал между слотами времени в минутах (по умолчанию 30)';
COMMENT ON COLUMN t_p89870318_access_bars_service.schedule_settings.break_duration_minutes IS 'Длительность технического перерыва после каждого сеанса в минутах (по умолчанию 30)';
COMMENT ON COLUMN t_p89870318_access_bars_service.schedule_settings.working_hours_start IS 'Начало рабочего дня';
COMMENT ON COLUMN t_p89870318_access_bars_service.schedule_settings.working_hours_end IS 'Конец рабочего дня';