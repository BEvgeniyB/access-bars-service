-- Добавление зон ответственности для чакр
INSERT INTO chakra_responsibilities (chakra_id, responsibility, category) VALUES
(1, 'Государство', 'Зона ответственности'),
(3, 'Законы', 'Зона ответственности');

-- Добавление предметов/наук для чакр
INSERT INTO chakra_sciences (chakra_id, science_name, description) VALUES
(3, 'Химия', NULL),
(4, 'Физика', NULL),
(4, 'Обществознание', NULL),
(4, 'Семейный кодекс', NULL),
(5, 'Русский язык', NULL),
(5, 'Литература', NULL),
(5, 'Ораторское искусство', NULL);

-- Добавление органов тела для чакр
INSERT INTO chakra_organs (chakra_id, organ_name, description) VALUES
(1, 'Половые органы', NULL),
(3, 'Желудок', NULL),
(3, 'Печень', NULL),
(3, 'Селезенка', NULL),
(4, 'Грудная клетка', NULL),
(4, 'Сердце', NULL),
(4, 'Легкие', NULL),
(4, 'Руки', NULL),
(4, 'ВСД', NULL),
(5, 'Горло', NULL),
(5, 'Трахея', NULL),
(5, 'Щитовидная железа', NULL),
(5, 'Шея', NULL),
(5, 'Язык', NULL),
(5, 'Зубы', NULL),
(5, 'Рот', NULL);

-- Добавление вопросов для чакр
INSERT INTO chakra_questions (chakra_id, question, is_resolved) VALUES
(1, 'Тело (режим, здоровье, еда)', false),
(1, 'Гигиена/чистота', false),
(1, 'Целительств о 4', false),
(2, 'Разум? Материализация? (пересечение с 4)', false),
(4, 'Материализация? (пересечение с 2)', false),
(5, 'Галактическая частп?', false);
