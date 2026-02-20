# goPair — Carpooling Web Application

> Share rides. Save money. Reduce emissions. 🚗

## Features

- 🔐 User Authentication (Email / Google / GitHub)
- 🗺️ Ride Publishing & Searching
- 📅 Date & Route-based Filtering
- 💳 Booking Management
- ⭐ Rating & Review System
- 💬 In-App Messaging
- 📊 Dashboard & Analytics
- 🌙 Glassmorphism UI with Dark Mode
- 📱 Fully Responsive

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Glassmorphism
- **Auth:** NextAuth.js
- **Database:** SQLite (Prisma ORM) — swap to PostgreSQL for production
- **State:** Zustand
- **Animations:** Framer Motion
- **Validation:** Zod

## Getting Started

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```
