-- ─── Employee Wall: employees table ─────────────────────────────────────────
-- Apply via: supabase db push  OR  paste into Supabase SQL editor

create table if not exists employees (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz not null    default now(),
  username     text        not null,
  role         text        not null,
  stamp        text        not null    default 'none',
  badge_url    text        not null,
  job_card_url text        not null,
  consent      boolean     not null    default false
);

-- Indexes
create index if not exists employees_created_at_idx on employees (created_at desc);
create index if not exists employees_username_idx   on employees (username);

-- RLS
alter table employees enable row level security;

-- Public read: only rows with consent=true
create policy "public_read" on employees
  for select
  using (consent = true);

-- Public insert: only when consent=true
create policy "public_insert" on employees
  for insert
  with check (consent = true);

-- No UPDATE / DELETE for anon
