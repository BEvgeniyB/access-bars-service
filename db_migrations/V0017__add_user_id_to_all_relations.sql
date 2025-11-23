-- Добавляем user_id во все связанные таблицы
ALTER TABLE chakra_concepts ADD COLUMN user_id INTEGER REFERENCES users(id);
ALTER TABLE chakra_organs ADD COLUMN user_id INTEGER REFERENCES users(id);
ALTER TABLE chakra_sciences ADD COLUMN user_id INTEGER REFERENCES users(id);
ALTER TABLE chakra_responsibilities ADD COLUMN user_id INTEGER REFERENCES users(id);
ALTER TABLE chakra_questions ADD COLUMN user_id INTEGER REFERENCES users(id);

-- Привязываем существующие данные к ответственным по умолчанию (через chakra_id)

-- Чакра 1 - Татьяна (user_id = 2)
UPDATE chakra_concepts SET user_id = 2 WHERE chakra_id = 1;
UPDATE chakra_organs SET user_id = 2 WHERE chakra_id = 1;
UPDATE chakra_sciences SET user_id = 2 WHERE chakra_id = 1;
UPDATE chakra_responsibilities SET user_id = 2 WHERE chakra_id = 1;
UPDATE chakra_questions SET user_id = 2 WHERE chakra_id = 1;

-- Чакра 2 - Ира Цветкова (user_id = 3) для первых 8 концепций
UPDATE chakra_concepts SET user_id = 3 WHERE chakra_id = 2 AND id IN (
  SELECT id FROM chakra_concepts WHERE chakra_id = 2 ORDER BY id LIMIT 8
);

-- Чакра 2 - Денис (user_id = 4) для последней "Прибыль"
UPDATE chakra_concepts SET user_id = 4 WHERE chakra_id = 2 AND user_id IS NULL;

-- Остальные данные чакры 2 - к Ире Цветковой
UPDATE chakra_organs SET user_id = 3 WHERE chakra_id = 2;
UPDATE chakra_sciences SET user_id = 3 WHERE chakra_id = 2;
UPDATE chakra_responsibilities SET user_id = 3 WHERE chakra_id = 2;
UPDATE chakra_questions SET user_id = 3 WHERE chakra_id = 2;

-- Чакра 3 - Светлана Целитель (user_id = 5)
UPDATE chakra_concepts SET user_id = 5 WHERE chakra_id = 3;
UPDATE chakra_organs SET user_id = 5 WHERE chakra_id = 3;
UPDATE chakra_sciences SET user_id = 5 WHERE chakra_id = 3;
UPDATE chakra_responsibilities SET user_id = 5 WHERE chakra_id = 3;
UPDATE chakra_questions SET user_id = 5 WHERE chakra_id = 3;

-- Чакра 4 - Наталья Великая (user_id = 6)
UPDATE chakra_concepts SET user_id = 6 WHERE chakra_id = 4;
UPDATE chakra_organs SET user_id = 6 WHERE chakra_id = 4;
UPDATE chakra_sciences SET user_id = 6 WHERE chakra_id = 4;
UPDATE chakra_responsibilities SET user_id = 6 WHERE chakra_id = 4;
UPDATE chakra_questions SET user_id = 6 WHERE chakra_id = 4;

-- Чакра 5 - Ангелина Астахова (user_id = 7)
UPDATE chakra_concepts SET user_id = 7 WHERE chakra_id = 5;
UPDATE chakra_organs SET user_id = 7 WHERE chakra_id = 5;
UPDATE chakra_sciences SET user_id = 7 WHERE chakra_id = 5;
UPDATE chakra_responsibilities SET user_id = 7 WHERE chakra_id = 5;
UPDATE chakra_questions SET user_id = 7 WHERE chakra_id = 5;

-- Чакра 6 - Наташа (user_id = 8)
UPDATE chakra_concepts SET user_id = 8 WHERE chakra_id = 6;
UPDATE chakra_organs SET user_id = 8 WHERE chakra_id = 6;
UPDATE chakra_sciences SET user_id = 8 WHERE chakra_id = 6;
UPDATE chakra_responsibilities SET user_id = 8 WHERE chakra_id = 6;
UPDATE chakra_questions SET user_id = 8 WHERE chakra_id = 6;

-- Чакра 7 - Андрей Казаков (user_id = 9)
UPDATE chakra_concepts SET user_id = 9 WHERE chakra_id = 7;
UPDATE chakra_organs SET user_id = 9 WHERE chakra_id = 7;
UPDATE chakra_sciences SET user_id = 9 WHERE chakra_id = 7;
UPDATE chakra_responsibilities SET user_id = 9 WHERE chakra_id = 7;
UPDATE chakra_questions SET user_id = 9 WHERE chakra_id = 7;