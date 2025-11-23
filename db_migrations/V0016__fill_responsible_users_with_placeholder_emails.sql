-- Заполняем ответственных (используем placeholder email, т.к. поле обязательно)
INSERT INTO users (name, email, role, chakra_id, telegram_id, telegram_username) VALUES
('Татьяна', 'tatyana@placeholder.local', 'responsible', 1, NULL, NULL),
('Ира Цветкова', 'ira.tsvetkova@placeholder.local', 'responsible', 2, NULL, NULL),
('Денис', 'denis@placeholder.local', 'responsible', 2, NULL, NULL),
('Светлана Целитель', 'svetlana.tselitel@placeholder.local', 'responsible', 3, NULL, NULL),
('Наталья Великая', 'natalya.velikaya@placeholder.local', 'responsible', 4, NULL, NULL),
('Ангелина Астахова', 'angelina.astahova@placeholder.local', 'responsible', 5, NULL, NULL),
('Наташа', 'natasha@placeholder.local', 'responsible', 6, NULL, NULL),
('Андрей Казаков', 'andrey.kazakov@placeholder.local', 'responsible', 7, NULL, NULL);

-- Привязываем первого ответственного к каждой чакре
UPDATE chakras SET responsible_user_id = (SELECT id FROM users WHERE chakra_id = 1 ORDER BY id LIMIT 1) WHERE position = 1;
UPDATE chakras SET responsible_user_id = (SELECT id FROM users WHERE chakra_id = 2 ORDER BY id LIMIT 1) WHERE position = 2;
UPDATE chakras SET responsible_user_id = (SELECT id FROM users WHERE chakra_id = 3 ORDER BY id LIMIT 1) WHERE position = 3;
UPDATE chakras SET responsible_user_id = (SELECT id FROM users WHERE chakra_id = 4 ORDER BY id LIMIT 1) WHERE position = 4;
UPDATE chakras SET responsible_user_id = (SELECT id FROM users WHERE chakra_id = 5 ORDER BY id LIMIT 1) WHERE position = 5;
UPDATE chakras SET responsible_user_id = (SELECT id FROM users WHERE chakra_id = 6 ORDER BY id LIMIT 1) WHERE position = 6;
UPDATE chakras SET responsible_user_id = (SELECT id FROM users WHERE chakra_id = 7 ORDER BY id LIMIT 1) WHERE position = 7;