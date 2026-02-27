-- Cleanup migration: supersedes the early employees table draft.
-- The canonical schema (badge_url, job_card_url, consent, RLS) is in
-- 20250101000000_create_employees.sql which runs first.
--
-- This migration:
--   1. Drops stale permissive policies added by the early draft (no-op if absent)
--   2. Ensures the three columns added in the canonical migration exist, in case
--      this DB was initialised from the old draft only.

-- Drop early-draft policies that bypass the consent filter
drop policy if exists "anyone can read"  on employees;
drop policy if exists "anyone can insert" on employees;

-- Ensure canonical columns exist (no-op if already present)
alter table employees add column if not exists badge_url    text;
alter table employees add column if not exists job_card_url text;
alter table employees add column if not exists consent      boolean not null default false;

-- Ensure canonical indexes exist (no-op if already present)
create index if not exists employees_created_at_idx on employees (created_at desc);
create index if not exists employees_username_idx   on employees (username);

-- Ensure canonical RLS policies exist
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'employees'
      and policyname = 'public_read'
  ) then
    execute $p$
      create policy "public_read" on employees
        for select using (consent = true)
    $p$;
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'employees'
      and policyname = 'public_insert'
  ) then
    execute $p$
      create policy "public_insert" on employees
        for insert with check (consent = true)
    $p$;
  end if;
end $$;
