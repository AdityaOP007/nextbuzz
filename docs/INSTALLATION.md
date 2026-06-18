# NextBuzz Installation Guide

## Step 1: Clone & Prerequisites

Ensure you have:
- **Node.js 18+**
- **PostgreSQL 14+** running locally or remotely
- **npm**

## Step 2: Start PostgreSQL (Docker)

From the project root:

```bash
docker compose up -d
```

Wait until the container is healthy, then continue. Requires **Docker Desktop** to be running.

## Step 3: Backend Setup

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/nextbuzz?schema=public
JWT_SECRET=your-super-secret-jwt-key
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

Optional (for image uploads):

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run migrations and seed:

```bash
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```

API available at **http://localhost:4000**

## Step 4: Frontend Setup

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

```bash
npm install
npm run dev
```

App available at **http://localhost:3000**

## Step 6: Test the App

1. Open http://localhost:3000 — home page with events from database
2. Browse events, filter by category/city
3. Sign in with demo account:
   - Email: `demo@nextbuzz.in`
   - Password: `Password123`
4. Book a ticket, view confirmation
5. Visit `/events/[id]` for event details + route map
6. Visit `/bookings` for booking history

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Can't reach database` | Check PostgreSQL is running and `DATABASE_URL` is correct |
| CORS errors | Ensure `CORS_ORIGIN=http://localhost:3000` in backend `.env` |
| Events not loading | Verify backend is running on port 4000 |
| Map not showing route | Allow browser location permission |
| Upload fails | Configure Cloudinary credentials in backend `.env` |
