# $JOB Site — Setup & Operations

## Overview

The $JOB site is a memecoin marketing/onboarding site. Users can:
1. Generate a **Job Alert Card** (1200×675 PNG) and **Badge PFP** (1024×1024 PNG) locally in the browser.
2. Preview and download both images with no server required.
3. Optionally publish to the **Employee Wall** (Supabase Storage + Postgres).

All image generation happens on the client via the Canvas API. Nothing is uploaded until the user explicitly clicks **Publish** and checks the consent box.

---

## Local Development

```bash
cp .env.example .env.local
# fill in Supabase values (or leave blank to run locally without publish)
npm install
npm run dev
# → http://localhost:3000
```

The site works fully without Supabase env vars — image generation and downloads work. The Publish button and /employees page require Supabase.

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

---

## Supabase Setup

### 1. Create a project
Go to https://supabase.com and create a new project.

### 2. Create the `pfps` storage bucket

In the Supabase dashboard:
1. Go to **Storage** → **New bucket**
2. Name: `pfps`
3. **Public bucket**: ✅ Yes (images must be publicly accessible)
4. Click **Create bucket**

Or via SQL Editor:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('pfps', 'pfps', true);
```

### 3. Apply the database migration

In the Supabase dashboard:
1. Go to **SQL Editor**
2. Paste the contents of `supabase/migrations/20250101000000_create_employees.sql`
3. Click **Run**

Or if using the Supabase CLI:
```bash
supabase db push
# or
supabase migration up
```

### 4. Configure Storage RLS (optional but recommended)

The default policy for a public bucket allows all reads. To restrict writes to only authenticated flows (i.e. the anon key with the `pfps` bucket), add a storage policy:

```sql
-- Allow public uploads to pfps bucket
CREATE POLICY "public_upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'pfps');

-- Allow public reads
CREATE POLICY "public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'pfps');
```

---

## Database Schema

```sql
Table: employees
  id           uuid        PK  default gen_random_uuid()
  created_at   timestamptz     default now()
  username     text
  role         text            (engineer|designer|product|operations|marketing|leadership|other)
  stamp        text            (none|star|rocket|crown|lightning|heart)
  badge_url    text            public URL of badge PFP in storage
  job_card_url text            public URL of job alert card in storage
  consent      boolean         always true (RLS only allows insert where consent=true)
```

RLS:
- `SELECT`: public, where `consent = true`
- `INSERT`: public, where `consent = true`
- No `UPDATE` or `DELETE` for anon

---

## Image Generation — How It Works

Files: `src/lib/job/image-gen.ts`

- **Job Alert Card (1200×675)**: LinkedIn-style notification card with avatar, username, role pill, and action buttons.
- **Badge PFP (1024×1024)**: Dark gradient circular badge with $JOB branding, avatar, role, and optional stamp text.

### Customising the canvas layout
Edit `generateJobAlertCard` and `generateBadgePfp` in `src/lib/job/image-gen.ts`. Key constants:
- `AV_R`: avatar radius (pixels)
- `FONT`: font stack
- Colors are inline hex strings — search for `#2563EB` (blue accent) to find them

### Adding/editing job cards
Edit the `JOBS` array in `src/components/job/JobBoard.tsx`.

### Editing stamp text/colors
Edit `STAMP_TEXT` and `STAMP_COLOR` in `src/lib/job/image-gen.ts`.

---

## Publish Flow

1. User fills in username + role + stamp + avatar.
2. User clicks **Generate Job Alert** and **Generate Badge PFP**.
3. Both images must be generated before Publish appears.
4. User checks consent checkbox.
5. On click: images uploaded to `pfps/{username}/{timestamp}-badge.png` and `pfps/{username}/{timestamp}-job-alert.png`.
6. DB row inserted with public URLs + consent=true.
7. Toast notification + link to `/employees`.

---

## Deployment

Standard Next.js deployment — works on Vercel, Netlify, or any Node host.

```bash
npm run build
npm start
```

For Vercel: set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the project environment variables.
