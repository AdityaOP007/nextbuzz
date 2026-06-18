# 🎉 NextBuzz — Events That Move You

NextBuzz is a full-stack Event Discovery and Ticket Booking Platform built using **Next.js 15**, **Express.js**, **PostgreSQL**, **Prisma ORM**, and **Tailwind CSS**.

Users can discover events, book tickets, manage bookings, save carts, and explore event locations through an interactive map experience.

---

# 🚀 Features

## User Features

* User Registration & Login
* JWT Authentication
* Event Discovery
* Event Search & Filtering
* Event Details Page
* Ticket Booking
* Booking History
* Cart Management
* User Profile Management
* Interactive Maps & Routing
* Cloudinary Image Uploads

---

## Admin Features

* Event Management
* Event CRUD Operations
* Featured Events
* Seat Availability Management
* Booking Monitoring

---

# 🏗️ Tech Stack

## Frontend

* Next.js 15
* React
* Tailwind CSS
* ShadCN UI
* Axios
* React Hook Form
* Zod Validation

## Backend

* Express.js
* TypeScript
* Prisma ORM
* JWT Authentication
* bcrypt Password Hashing

## Database

* PostgreSQL

## Storage

* Cloudinary

## Maps

* Leaflet.js
* Leaflet Routing Machine

## DevOps

* Docker
* Docker Compose

---

# 📁 Project Structure

```text
NextBuzz/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── lib/
│   ├── public/
│   └── types/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── db/
│   │   └── config/
│   │
│   ├── sql/
│   │   ├── init-database.sql
│   │   ├── useful-queries.sql
│   │   └── debug-queries.sql
│   │
│   └── .env
│
├── docker-compose.yml
├── docs/
└── README.md
```

---

# 🗄️ Database Schema

## Tables

### Users

```sql
users
```

Stores:

* User profile information
* Authentication details

### Events

```sql
events
```

Stores:

* Event details
* Venue
* Pricing
* Seat availability

### Bookings

```sql
bookings
```

Stores:

* Ticket bookings
* Booking history
* User-event relationship

### Cart Items

```sql
cart_items
```

Stores:

* User cart data
* Temporary ticket selections

---

# 🔗 Entity Relationships

```text
Users
 ├── Bookings
 └── Cart Items

Events
 ├── Bookings
 └── Cart Items
```

---

# 🐳 Database Setup

## Docker (Recommended)

From project root:

```bash
docker compose up -d
```

Verify:

```bash
docker ps
docker logs nextbuzz-postgres
```

Database Configuration:

| Field    | Value     |
| -------- | --------- |
| Host     | localhost |
| Port     | 5432      |
| Username | postgres  |
| Password | password  |
| Database | nextbuzz  |

---

# ⚙️ Backend Setup

```bash
cd backend
```

Copy environment file:

### Linux / Mac

```bash
cp .env.example .env
```

### Windows

```powershell
Copy-Item .env.example .env
```

Update `.env`

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/nextbuzz?schema=public"

JWT_SECRET="your-super-secret-jwt-key-change-in-production"

JWT_EXPIRES_IN="7d"

PORT=4000

CORS_ORIGIN="http://localhost:3000"
```

Install dependencies:

```bash
npm install
```

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Seed database:

```bash
npm run seed
```

Start backend:

```bash
npm run dev
```

Backend URL:

```text
http://localhost:4000
```

---

# 🎨 Frontend Setup

Open new terminal:

```bash
cd frontend
```

Copy environment file:

### Linux / Mac

```bash
cp .env.example .env.local
```

### Windows

```powershell
Copy-Item .env.example .env.local
```

Update:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

---

# 🔐 Demo Credentials

```text
Email: demo@nextbuzz.in
Password: Password123
```

---

# 📡 API Endpoints

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/profile
```

---

## Events

```http
GET    /api/events
GET    /api/events/:id
POST   /api/events
PUT    /api/events/:id
DELETE /api/events/:id
```

---

## Bookings

```http
POST /api/bookings
GET  /api/bookings
GET  /api/bookings/:id
```

---

## Cart

```http
GET    /api/cart
POST   /api/cart/:eventId
DELETE /api/cart/:eventId
PUT    /api/cart/sync
```

---

## Uploads

```http
POST /api/upload
```

---

# 🧪 Health Check

```bash
curl http://localhost:4000/api/health
```

Expected:

```json
{
  "success": true
}
```

---

# 📊 Database Verification

Connect:

```bash
docker exec -it nextbuzz-postgres psql -U postgres -d nextbuzz
```

Run:

```sql
SELECT current_database();

SELECT COUNT(*) FROM users;

SELECT COUNT(*) FROM events;

SELECT COUNT(*) FROM bookings;

SELECT COUNT(*) FROM cart_items;
```

Exit:

```sql
\q
```

---

# 🔄 Reset Database

```bash
cd backend

npx prisma migrate reset

npm run seed
```

---

# 🧹 Troubleshooting

## Port Already In Use

### Windows

```powershell
Get-NetTCPConnection -LocalPort 3000

Get-NetTCPConnection -LocalPort 4000

Stop-Process -Id <PID> -Force
```

### Mac / Linux

```bash
lsof -i :3000

lsof -i :4000

kill -9 <PID>
```

---

## Restart PostgreSQL

```bash
docker compose down

docker compose up -d
```

---

## Clear Frontend Cache

### Windows

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

### Linux / Mac

```bash
rm -rf .next
npm run dev
```

---

# 📦 Production Build

## Backend

```bash
cd backend

npm install

npx prisma generate

npx prisma migrate deploy

npm run build

npm start
```

---

## Frontend

```bash
cd frontend

npm install

npm run build

npm start
```

---

# 👨‍💻 Development Workflow

Terminal 1:

```bash
docker compose up -d
```

Terminal 2:

```bash
cd backend
npm run dev
```

Terminal 3:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ using Next.js, Express, PostgreSQL, Prisma and Docker.
