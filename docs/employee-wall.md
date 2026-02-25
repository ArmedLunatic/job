# Employee Wall — Setup Guide

## Supabase Project
- **Project ID:** `tzbidptepylszddznlqq`
- **Region:** us-east-1
- **Dashboard:** https://supabase.com/dashboard/project/tzbidptepylszddznlqq

## Environment Variables

Copy `.env.example` → `.env.local`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL from Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` public key from Supabase → Settings → API |

## Supabase: Storage Buckets (create manually in dashboard)

### `employee-photos` — raw uploaded photos
```
Storage → New bucket → Name: employee-photos → Public: ✅
```

### `employee-cards` — generated card images
```
Storage → New bucket → Name: employee-cards → Public: ✅
```

### RLS policies for each bucket
- **SELECT:** `true` (anyone can read)
- **INSERT:** `true` (open for now; tighten with auth later)

## Supabase: Database Table

Run in SQL Editor → New query:

```sql
create table employees (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  username    text not null,
  role        text not null,
  stamp       text not null default 'none',
  photo_url   text not null,
  card_url    text
);

alter table employees enable row level security;

create policy "anyone can read" on employees
  for select using (true);

create policy "anyone can insert" on employees
  for insert with check (true);
```

## Routes

| Route | Description |
|---|---|
| `/employee-wall` | Upload form — photo + details, generate card, publish |
| `/employees` | Gallery — all published cards |

## Step Roadmap

| Step | Ships |
|---|---|
| 1 ✅ | Scaffold, types, placeholder UI, Supabase client, GitHub, Vercel |
| 2 | Canvas card generation (`<canvas>` → blob → upload to `employee-cards`) |
| 3 | Publish to Supabase `employees` table + live fetch in `/employees` gallery |
