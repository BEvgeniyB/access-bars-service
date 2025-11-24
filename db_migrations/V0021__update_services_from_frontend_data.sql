-- Обновляем существующие услуги согласно данным фронтенда

-- id=1: Access Bars (первая сессия) - уже корректно
UPDATE t_p89870318_access_bars_service.services 
SET 
  name = 'Первая сессия Access Bars',
  description = 'Знакомство с методикой, полная диагностика и первый сеанс',
  duration_minutes = 90,
  price = 7000
WHERE id = 1;

-- id=2: Классический массаж (было "Массаж спины")
UPDATE t_p89870318_access_bars_service.services 
SET 
  name = 'Классический массаж',
  description = 'Глубокая проработка мышц и суставов для снятия напряжения и восстановления',
  duration_minutes = 60,
  price = 6000
WHERE id = 2;

-- id=3: Комплексная программа массажа (было "Массаж всего тела")
UPDATE t_p89870318_access_bars_service.services 
SET 
  name = 'Комплексная программа',
  description = 'Сочетание классических техник с ароматерапией',
  duration_minutes = 60,
  price = 7000
WHERE id = 3;

-- id=4: Базовый курс обучения (было "Обучение Access Bars")
UPDATE t_p89870318_access_bars_service.services 
SET 
  name = 'Базовый курс',
  description = 'Обучение технике Access Bars. Доступно всем',
  duration_minutes = 480,
  price = 29000
WHERE id = 4;

-- id=5: Телесное исцеление (было "Целительский сеанс")
UPDATE t_p89870318_access_bars_service.services 
SET 
  name = 'Телесное исцеление',
  description = 'Работа происходит с опорно-двигательным аппаратом, мышцами, связками тела. С обязательным присутствием',
  duration_minutes = 60,
  price = 8000
WHERE id = 5;

-- Добавляем новые услуги из фронтенда

-- Стандартная сессия Access Bars
INSERT INTO t_p89870318_access_bars_service.services 
  (name, description, duration_minutes, price, is_active)
VALUES 
  ('Стандартная сессия', 'Классический сеанс Access Bars для регулярной практики', 60, 7000, true);

-- Интенсивная программа Access Bars (3 сессии)
INSERT INTO t_p89870318_access_bars_service.services 
  (name, description, duration_minutes, price, is_active)
VALUES 
  ('Интенсивная программа', 'Курс из 3 сессий со скидкой для максимального эффекта', 270, 18000, true);

-- Телесное исцеление пакет 3 сеанса
INSERT INTO t_p89870318_access_bars_service.services 
  (name, description, duration_minutes, price, is_active)
VALUES 
  ('Телесное исцеление пакет 3 сеанса', 'Комплексная программа исцеления из 3 сеансов со скидкой', 180, 21000, true);

-- Дистанционное исцеление
INSERT INTO t_p89870318_access_bars_service.services 
  (name, description, duration_minutes, price, is_active)
VALUES 
  ('Дистанционное исцеление', 'Энергетическая работа на расстоянии по видеосвязи из любой точки мира', 60, 7000, true);

-- Повторное обучение Access Bars
INSERT INTO t_p89870318_access_bars_service.services 
  (name, description, duration_minutes, price, is_active)
VALUES 
  ('Повторное обучение', 'Курс для тех, кто уже проходил обучение ранее', 480, 14500, true);

-- Обучение Access Bars для подростков
INSERT INTO t_p89870318_access_bars_service.services 
  (name, description, duration_minutes, price, is_active)
VALUES 
  ('Для подростков', 'Специальный курс Access Bars для подростков', 480, 14500, true);