-- Создаем таблицу для хранения статистики посещений
CREATE TABLE IF NOT EXISTS page_visits (
    id SERIAL PRIMARY KEY,
    page_url VARCHAR(255) NOT NULL,
    user_ip VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(255),
    visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(255)
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_page_visits_url ON page_visits(page_url);
CREATE INDEX IF NOT EXISTS idx_page_visits_date ON page_visits(visited_at);
CREATE INDEX IF NOT EXISTS idx_page_visits_session ON page_visits(session_id);