# $JOB — Corporate HR Portal

A satirical "stupid corporate HR portal" built with Next.js and Supabase. Employees can clock in, generate a badge card, and submit themselves to the public employee wall.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Supabase** (Postgres + Storage)

## Setup

### 1. Clone & install

```bash
git clone https://github.com/ArmedLunatic/job.git
cd job
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once it's ready, go to **Project Settings → API**
3. Copy your **Project URL** and **anon public** key

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the database migrations

In your Supabase project, go to **SQL Editor** and run each migration file in order:

1. `supabase/migrations/20250101000000_create_employees.sql`
2. `supabase/migrations/20260226000001_employees.sql`
3. `supabase/migrations/20260226000002_storage_buckets.sql`

> Alternatively, if you have the [Supabase CLI](https://supabase.com/docs/guides/cli) installed and linked to your project:
> ```bash
> supabase db push
> ```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Clock In Form** — fill in your name, role, and department
- **Badge Preview** — generates a downloadable employee ID card
- **Employee Wall** — public directory of submitted employees (`/employees`)
- **Job Board** — open positions listing
- **Payroll Strip** — ticker of fake payroll data

## Deploy

Deploy to Vercel in one click — just set the two `NEXT_PUBLIC_*` env vars in your Vercel project settings.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ArmedLunatic/job)
