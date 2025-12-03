-- Create chakra_basic_needs table
CREATE TABLE IF NOT EXISTS chakra_basic_needs (
  id SERIAL PRIMARY KEY,
  chakra_id INTEGER NOT NULL REFERENCES chakras(id),
  basic_need TEXT NOT NULL,
  description TEXT,
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_chakra_basic_needs_chakra_id ON chakra_basic_needs(chakra_id);
CREATE INDEX IF NOT EXISTS idx_chakra_basic_needs_user_id ON chakra_basic_needs(user_id);

-- Add comment
COMMENT ON TABLE chakra_basic_needs IS 'Базовые потребности для каждой чакры с привязкой к пользователю';