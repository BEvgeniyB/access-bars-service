-- Заполнение diary_services данными из services
-- Все услуги привязываются к owner_id = 1

INSERT INTO t_p89870318_access_bars_service.diary_services 
  (owner_id, name, description, duration_minutes, price, active, created_at)
SELECT 
  1 as owner_id,
  name,
  description,
  duration_minutes,
  price::numeric(10,2),
  is_active as active,
  created_at
FROM t_p89870318_access_bars_service.services
ORDER BY id;