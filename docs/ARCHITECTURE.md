# NextBuzz Architecture

## Overview

NextBuzz follows a monorepo structure with a decoupled frontend and backend.

```
┌─────────────────┐     HTTP/REST      ┌─────────────────┐
│   Next.js 15    │ ◄──────────────► │  Express API    │
│   Frontend      │     Axios + JWT   │  + Prisma       │
│   :3000         │                   │  :4000          │
└─────────────────┘                   └────────┬────────┘
                                               │
                                      ┌────────▼────────┐
                                      │   PostgreSQL    │
                                      └─────────────────┘
```

## Frontend Architecture

- **App Router** — Pages: `/`, `/events/[id]`, `/bookings`, `/profile`
- **Context Providers** — Auth, Cart, Toast
- **Services Layer** — Axios clients for API communication
- **Components** — Layout, Home, Events, Booking, Auth, Cart

## Backend Architecture

- **Routes** → **Controllers** → **Prisma** (database)
- **Middleware** — JWT auth, Zod validation
- **Services** — Cloudinary upload

## Database Schema

- `users` — Authentication and profile
- `events` — Event catalog with geo coordinates
- `bookings` — Ticket purchases linked to users and events

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens for authenticated requests
- Zod validation on all inputs
- Prisma parameterized queries (SQL injection protection)
