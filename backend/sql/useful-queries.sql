-- ============================================================
-- NextBuzz — Useful SQL Queries
-- Run these while connected to the "nextbuzz" database
-- ============================================================

-- 1. Check that tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. List all events (same data shown on the website homepage)
SELECT
    title,
    category,
    city,
    venue,
    event_date,
    event_time,
    price,
    available_seats,
    featured
FROM events
ORDER BY featured DESC, event_date ASC;

-- 3. Find events by city
SELECT title, venue, price, available_seats
FROM events
WHERE city = 'Bengaluru'
ORDER BY event_date;

-- 4. Find featured events
SELECT title, category, city, price
FROM events
WHERE featured = true;

-- 5. View registered users
SELECT first_name, last_name, email, phone, city, created_at
FROM users
ORDER BY created_at DESC;

-- 6. View all ticket bookings (created when users book on the site)
SELECT
    u.email AS user_email,
    e.title AS event_title,
    b.quantity,
    b.ticket_type,
    b.total_price,
    b.booking_status,
    b.created_at
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN events e ON b.event_id = e.id
ORDER BY b.created_at DESC;

-- 7. View cart items (created when users add to cart while logged in)
SELECT
    u.email AS user_email,
    e.title AS event_title,
    c.created_at
FROM cart_items c
JOIN users u ON c.user_id = u.id
JOIN events e ON c.event_id = e.id
ORDER BY c.created_at DESC;

-- 8. Revenue summary per event
SELECT
    e.title,
    COUNT(b.id) AS total_bookings,
    SUM(b.quantity) AS tickets_sold,
    SUM(b.total_price) AS total_revenue
FROM events e
LEFT JOIN bookings b ON e.id = b.event_id
GROUP BY e.id, e.title
ORDER BY total_revenue DESC NULLS LAST;

-- 9. Events with low availability
SELECT title, city, available_seats, capacity
FROM events
WHERE available_seats < 50
ORDER BY available_seats ASC;

-- 10. Quick health check — row counts
SELECT 'users' AS table_name, COUNT(*) AS rows FROM users
UNION ALL SELECT 'events', COUNT(*) FROM events
UNION ALL SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL SELECT 'cart_items', COUNT(*) FROM cart_items;
