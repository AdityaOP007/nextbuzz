-- NextBuzz persistence debug queries
-- Connect to the "nextbuzz" database before running

SELECT current_database();

SELECT COUNT(*) AS users FROM users;
SELECT COUNT(*) AS events FROM events;
SELECT COUNT(*) AS bookings FROM bookings;
SELECT COUNT(*) AS cart_items FROM cart_items;

SELECT * FROM users ORDER BY created_at DESC;
SELECT * FROM bookings ORDER BY created_at DESC;
SELECT * FROM cart_items ORDER BY created_at DESC;
