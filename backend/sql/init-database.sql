-- ============================================================
-- NextBuzz Database Setup
-- Run this in your PostgreSQL client (DBeaver, pgAdmin, etc.)
-- ============================================================
--
-- IMPORTANT: Your app uses the "nextbuzz" database, NOT "postgres".
-- In your DB connection settings, set:
--   Host:     127.0.0.1
--   Port:     5432
--   Username: postgres
--   Password: password        (Docker default from docker-compose.yml)
--   Database: nextbuzz        <-- change this from "postgres"
--
-- ============================================================
-- STEP 1: Create the database (run while connected to "postgres")
-- ============================================================

CREATE DATABASE nextbuzz;

-- After this, reconnect to the "nextbuzz" database, then run STEP 2 below.

-- ============================================================
-- STEP 2: Create tables (run while connected to "nextbuzz")
-- ============================================================

CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100),
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "city" VARCHAR(100),
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "events" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "venue" VARCHAR(255) NOT NULL,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "event_date" DATE NOT NULL,
    "event_time" TIME NOT NULL,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "capacity" INTEGER NOT NULL DEFAULT 100,
    "available_seats" INTEGER NOT NULL,
    "image_url" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "bookings" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "ticket_type" VARCHAR(50) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "booking_status" VARCHAR(50) NOT NULL DEFAULT 'confirmed',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "cart_items" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "cart_items_user_id_event_id_key" ON "cart_items"("user_id", "event_id");

ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "bookings_user_id_fkey";
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "bookings_event_id_fkey";
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_event_id_fkey"
    FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "cart_items" DROP CONSTRAINT IF EXISTS "cart_items_user_id_fkey";
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "cart_items" DROP CONSTRAINT IF EXISTS "cart_items_event_id_fkey";
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_event_id_fkey"
    FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- STEP 3: Seed demo data (only if tables are empty)
-- Password for demo user: Password123
-- ============================================================

INSERT INTO "users" ("id", "first_name", "last_name", "email", "phone", "city", "password_hash", "created_at", "updated_at")
VALUES (
    '7899b01b-8fb2-498c-a5d9-fe2118020732',
    'Aarav', 'Sharma', 'demo@nextbuzz.in', '+91 98765 43210', 'Bengaluru',
    '$2b$12$DMzTAwdgP0qbVuoiH7hgXOQ/rEXXVLoB0GMxeZ7i4cnxCcnCe/D3K',
    NOW(), NOW()
) ON CONFLICT DO NOTHING;

INSERT INTO "events" ("id", "title", "description", "category", "city", "venue", "latitude", "longitude", "event_date", "event_time", "price", "capacity", "available_seats", "image_url", "featured", "created_at", "updated_at") VALUES
('40005bad-b6d1-463d-be6b-806e0e7bc815', 'Sunburn Festival 2025', 'Asia''s biggest electronic music festival returns with 50+ international artists across 4 stages.', 'Music', 'Pune', 'Aamby Valley, Pune', 18.6298000, 73.7997000, '2025-05-30', '16:00:00', 2499.00, 5000, 1200, 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80', true, NOW(), NOW()),
('a0a834d2-c105-4a38-89d3-dcbedb45c9ba', 'Bengaluru Food Carnival', 'A culinary journey through India''s finest street food and gourmet delights.', 'Food', 'Bengaluru', 'Palace Grounds, Bengaluru', 13.0051000, 77.5921000, '2025-06-01', '11:00:00', 299.00, 2000, 850, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80', false, NOW(), NOW()),
('fbaa9f21-7b05-46b6-bb7c-2aa884c04781', 'TechSpark Summit 2025', 'India''s premier tech conference featuring keynotes from industry leaders and startup showcases.', 'Tech', 'Hyderabad', 'HICC, Hyderabad', 17.4726000, 78.3728000, '2025-06-06', '09:00:00', 1499.00, 1500, 420, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', false, NOW(), NOW()),
('1540be78-ca4a-41fa-bf3a-5401f8082538', 'Mindful Yoga Retreat', 'Start your day with guided yoga, meditation, and wellness workshops in nature.', 'Fitness', 'Bengaluru', 'Cubbon Park, Bengaluru', 12.9763000, 77.5929000, '2025-06-07', '06:30:00', 449.00, 100, 35, 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&q=80', false, NOW(), NOW()),
('fb4ebfa1-9232-45ad-993a-abd2eb85e778', 'Stand-Up Comedy Night', 'An evening of laughter with India''s top comedians performing live.', 'Comedy', 'Mumbai', 'Canvas Laugh Factory, Mumbai', 19.0760000, 72.8777000, '2025-06-13', '20:00:00', 799.00, 300, 45, 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=600&q=80', false, NOW(), NOW()),
('b8dd4f1c-d314-4515-bcb5-f6dbe1eec730', 'Kala Ghoda Arts Festival', 'Mumbai''s iconic arts festival celebrating visual arts, music, theatre, and culture.', 'Arts', 'Mumbai', 'Kala Ghoda, Mumbai', 18.9280000, 72.8328000, '2025-06-14', '10:00:00', 0.00, 10000, 5000, 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&q=80', false, NOW(), NOW()),
('e07feb29-7ae5-430d-9766-e1835e3fae39', 'Delhi Music Week', 'A week-long celebration of music featuring indie bands, classical performances, and DJ sets.', 'Music', 'Delhi', 'Jawaharlal Nehru Stadium, Delhi', 28.5833000, 77.2333000, '2025-06-20', '19:00:00', 999.00, 8000, 0, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80', false, NOW(), NOW()),
('605c72be-fd46-4653-9ff7-5cab22c12d77', 'Biryani Bonanza', 'The ultimate biryani festival featuring recipes from across India.', 'Food', 'Hyderabad', 'HITEX, Hyderabad', 17.4722000, 78.3725000, '2025-06-22', '12:00:00', 199.00, 1500, 680, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80', false, NOW(), NOW()),
('acb66f4b-71c8-46b6-8e8e-20853e7e58af', 'Startup Demo Day', 'Watch India''s most promising startups pitch to top VCs and angel investors.', 'Tech', 'Bengaluru', 'IISc Auditorium, Bengaluru', 13.0219000, 77.5667000, '2025-06-28', '10:00:00', 349.00, 500, 120, 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80', false, NOW(), NOW()),
('fdc2d8d6-3378-4880-9224-a01b6bd7d162', 'Monsoon Jazz Festival', 'Smooth jazz under the monsoon skies with international and local artists.', 'Music', 'Mumbai', 'Bandra Fort, Mumbai', 19.0436000, 72.8189000, '2025-07-05', '18:00:00', 1299.00, 800, 320, 'https://images.unsplash.com/photo-1415201364774-f6f0ff5a0d2a?w=600&q=80', false, NOW(), NOW()),
('277b4fc3-9f2b-43fa-90f5-4a0b4e1993a2', 'Craft Beer Festival', 'Sample 50+ craft beers from microbreweries across India.', 'Food', 'Pune', 'Phoenix MarketCity, Pune', 18.5604000, 73.9167000, '2025-07-12', '14:00:00', 599.00, 1000, 450, 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&q=80', false, NOW(), NOW()),
('561f572d-559e-4e88-adc0-b573e2854bf5', 'AI & ML Workshop', 'Hands-on workshop on building production-ready AI applications.', 'Tech', 'Delhi', 'India Habitat Centre, Delhi', 28.5892000, 77.2290000, '2025-07-15', '10:00:00', 899.00, 200, 75, 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80', false, NOW(), NOW()),
('349eb822-bb6b-441a-8336-86a551272b30', 'Marathon for a Cause', 'Run for charity — 5K, 10K, and half marathon categories available.', 'Fitness', 'Chennai', 'Marina Beach, Chennai', 13.0499000, 80.2824000, '2025-07-20', '05:30:00', 499.00, 3000, 1800, 'https://images.unsplash.com/photo-1452626212852-811ead5612c7?w=600&q=80', false, NOW(), NOW()),
('cc64f6e4-b650-42a6-a84f-285c6092e287', 'Contemporary Art Expo', 'Explore works from emerging and established contemporary artists.', 'Arts', 'Delhi', 'National Gallery of Modern Art, Delhi', 28.6109000, 77.2295000, '2025-07-25', '11:00:00', 249.00, 500, 200, 'https://images.unsplash.com/photo-1561214115-f2f695cf247e?w=600&q=80', false, NOW(), NOW()),
('4793b0a7-8cc7-4650-96b3-bd3c9e67aee2', 'Improv Comedy Battle', 'Teams compete in hilarious improv comedy battles — audience picks the winner!', 'Comedy', 'Bengaluru', 'Ranga Shankara, Bengaluru', 12.9716000, 77.5946000, '2025-08-01', '19:30:00', 499.00, 250, 90, 'https://images.unsplash.com/photo-1585699323861-4e27310759d0?w=600&q=80', false, NOW(), NOW()),
('53139aa8-bae0-4a8a-9d3f-c0e262c4bc11', 'Electronic Dance Night', 'Underground EDM experience with top DJs and immersive light shows.', 'Music', 'Hyderabad', 'Boulder Hills Golf Club, Hyderabad', 17.4065000, 78.4772000, '2025-08-08', '21:00:00', 1799.00, 2000, 650, 'https://images.unsplash.com/photo-1571266023763-9f42c020a2a4?w=600&q=80', false, NOW(), NOW()),
('82335b85-2188-4a27-8177-a3d8869be83c', 'Street Food Safari', 'Guided tour through Chennai''s best street food spots with a local expert.', 'Food', 'Chennai', 'T. Nagar, Chennai', 13.0418000, 80.2341000, '2025-08-15', '17:00:00', 399.00, 50, 22, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', false, NOW(), NOW()),
('7a851052-ab05-4e49-9f5c-10100395b0a0', 'DevOps Conference India', 'Learn from DevOps practitioners about CI/CD, Kubernetes, and cloud-native architecture.', 'Tech', 'Pune', 'Hyatt Regency, Pune', 18.5362000, 73.8958000, '2025-08-22', '09:00:00', 1999.00, 800, 340, 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80', false, NOW(), NOW()),
('6c45752c-6a2b-4d58-939d-651c26d1285c', 'Sunrise Pilates Session', 'Outdoor pilates session with certified instructors at a scenic lakeside venue.', 'Fitness', 'Pune', 'Pashan Lake, Pune', 18.5344000, 73.7967000, '2025-08-29', '06:00:00', 349.00, 80, 40, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80', false, NOW(), NOW()),
('c53289c6-0e7b-46ad-afe7-66ecc12d4de5', 'Open Mic Poetry Night', 'Share your poetry or enjoy performances from talented spoken word artists.', 'Arts', 'Hyderabad', 'La Makaan, Hyderabad', 17.4126000, 78.4482000, '2025-09-05', '19:00:00', 199.00, 120, 55, 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80', false, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================
-- STEP 4: Useful queries to verify data in your DB tool
-- ============================================================

-- View all events
SELECT id, title, category, city, price, available_seats, featured
FROM events
ORDER BY featured DESC, event_date ASC;

-- View all users
SELECT id, first_name, last_name, email, city, created_at
FROM users;

-- View all bookings (populated when users book tickets on the site)
SELECT b.id, u.email, e.title, b.quantity, b.total_price, b.booking_status, b.created_at
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN events e ON b.event_id = e.id
ORDER BY b.created_at DESC;

-- View cart items (populated when users add events to cart)
SELECT c.id, u.email, e.title, c.created_at
FROM cart_items c
JOIN users u ON c.user_id = u.id
JOIN events e ON c.event_id = e.id;

-- Count records in each table
SELECT 'users' AS table_name, COUNT(*) AS count FROM users
UNION ALL SELECT 'events', COUNT(*) FROM events
UNION ALL SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL SELECT 'cart_items', COUNT(*) FROM cart_items;
