-- Fix swapped color and position values in chakras table
-- Current state: color column has numbers (1,2,3...), position column has hex colors
-- Target state: position column has numbers, color column has hex colors

-- Update using CASE to swap values in single query
UPDATE chakras SET
  position = CASE 
    WHEN id = 1 THEN 1
    WHEN id = 2 THEN 2
    WHEN id = 3 THEN 3
    WHEN id = 4 THEN 4
    WHEN id = 5 THEN 5
    WHEN id = 6 THEN 6
    WHEN id = 7 THEN 7
  END,
  color = CASE
    WHEN id = 1 THEN '#E31E24'
    WHEN id = 2 THEN '#FF6B00'
    WHEN id = 3 THEN '#FFD700'
    WHEN id = 4 THEN '#00A86B'
    WHEN id = 5 THEN '#00BFFF'
    WHEN id = 6 THEN '#0066CC'
    WHEN id = 7 THEN '#9370DB'
  END
WHERE id IN (1, 2, 3, 4, 5, 6, 7);
