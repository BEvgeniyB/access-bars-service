-- Создание таблиц для системы "Структура мироздания"

-- Таблица пользователей с ролями
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'responsible', 'viewer')),
    chakra_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Основная таблица чакр
CREATE TABLE IF NOT EXISTS chakras (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position INTEGER NOT NULL UNIQUE CHECK (position BETWEEN 1 AND 7),
    color VARCHAR(50) NOT NULL,
    symbol_url TEXT,
    continent VARCHAR(100),
    right_statement TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    responsible_user_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ключевые концепции чакр
CREATE TABLE IF NOT EXISTS chakra_concepts (
    id SERIAL PRIMARY KEY,
    chakra_id INTEGER NOT NULL,
    concept TEXT NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Органы тела, связанные с чакрами
CREATE TABLE IF NOT EXISTS chakra_organs (
    id SERIAL PRIMARY KEY,
    chakra_id INTEGER NOT NULL,
    organ_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Науки и дисциплины чакр
CREATE TABLE IF NOT EXISTS chakra_sciences (
    id SERIAL PRIMARY KEY,
    chakra_id INTEGER NOT NULL,
    science_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Зоны ответственности (социальные институты)
CREATE TABLE IF NOT EXISTS chakra_responsibilities (
    id SERIAL PRIMARY KEY,
    chakra_id INTEGER NOT NULL,
    responsibility TEXT NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вопросы на согласование
CREATE TABLE IF NOT EXISTS chakra_questions (
    id SERIAL PRIMARY KEY,
    chakra_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- История изменений
CREATE TABLE IF NOT EXISTS chakra_edit_history (
    id SERIAL PRIMARY KEY,
    chakra_id INTEGER NOT NULL,
    user_id INTEGER,
    field_name VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_chakras_position ON chakras(position);
CREATE INDEX IF NOT EXISTS idx_chakra_concepts_chakra ON chakra_concepts(chakra_id);
CREATE INDEX IF NOT EXISTS idx_chakra_organs_chakra ON chakra_organs(chakra_id);
CREATE INDEX IF NOT EXISTS idx_chakra_sciences_chakra ON chakra_sciences(chakra_id);
CREATE INDEX IF NOT EXISTS idx_chakra_responsibilities_chakra ON chakra_responsibilities(chakra_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Начальные данные: 7 чакр по позициям
INSERT INTO chakras (name, position, color, right_statement) VALUES
('Муладхара', 1, '#E31E24', 'Я имею право действовать'),
('Свадхистана', 2, '#FF6B00', 'Я имею право чувствовать и хотеть'),
('Манипура', 3, '#FFD700', 'Я имею право быть здесь и иметь'),
('Анахата', 4, '#00A86B', 'Я имею право любить и быть любимым'),
('Вишудха', 5, '#00BFFF', 'Я имею право говорить и быть услышанным'),
('Аджна', 6, '#4B0082', 'Я имею право видеть'),
('Сахасрара', 7, '#9370DB', 'Я имею право знать, что происходит');