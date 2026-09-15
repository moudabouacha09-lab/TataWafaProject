# CareMatch — Two-Sided Service Marketplace MVP

A trust-first, manual-coordination service marketplace web app for **Babysitting** and **Teaching/Tutoring** services built with **Next.js (App Router)**, **Tailwind CSS**, and **Supabase**.

---

## Key Features

1. **Client Role**:
   - Browse & search service listings with category and location filters.
   - View provider profile (photo, bio, rate, availability, verified ratings & reviews).
   - Submit service requests with preferred date/time and short note.
   - Receive in-app confirmation with offline phone coordination details.
   - Leave 1–5 star ratings and reviews for completed bookings.

2. **Provider Role**:
   - Create and manage service listing (category: babysitting or teaching, rate, description, availability, location, photo).
   - View public profile preview and past customer reviews.
   - Zero digital inbox clutter — jobs are confirmed manually by phone with the platform coordinator.

3. **Admin Role (Site Owner)**:
   - **Realtime Incoming Requests Dashboard**: Live feed of all requests across statuses (`new` → `in_progress` → `completed` → `cancelled`).
   - Access client phone and provider phone for direct offline coordination.
   - 1-click status transitions.
   - Users and Providers Directory.

4. **Trust & Safety Model**:
   - Every request is confirmed by phone by the site coordinator before the appointment.
   - In-person identity verification upon arrival for babysitters.
   - Cash / in-person payment on completion (no payment gateway fees).

---

## Getting Started

### 1. Run Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Interactive Demo Mode**: If Supabase credentials are not configured yet, the app runs in full interactive demo mode with pre-seeded providers, listings, requests, and reviews. You can switch between **Client**, **Provider**, and **Admin** personas directly from the top bar switcher!

---

### 2. Connect Live Supabase Backend

1. Create a project at [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard and run the entire script in:
   [`supabase/schema.sql`](supabase/schema.sql)
3. Copy your project URL and keys to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
4. Restart the development server:
   ```bash
   npm run dev
   ```

---

## Architecture

- **`app/`**: Next.js App Router pages (`/`, `/services/[id]`, `/my-requests`, `/provider/listing`, `/provider/profile`, `/admin`, `/auth/*`).
- **`components/`**: Reusable UI components (Navbar, Footer, ServiceCard, RequestModal, ReviewModal, RoleSwitcher, StarRating, TrustBanner).
- **`lib/store.ts`**: Unified data layer supporting both live Supabase SQL/Realtime and reactive local storage fallback.
- **`supabase/schema.sql`**: Full schema with Row Level Security (RLS) policies, triggers, and storage configuration.
