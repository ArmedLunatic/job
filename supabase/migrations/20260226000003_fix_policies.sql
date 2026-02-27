-- Fix permissive policies left behind by early migration drafts.
--
-- The old 20260226000001 added two policies that bypass the consent filter:
--   "anyone can read"  → using (true)          -- shows non-consent rows
--   "anyone can insert" → with check (true)    -- allows inserts without consent
-- These must be dropped. The canonical consent-gated policies below replace them.
--
-- The old 20260226000002 created employee-photos / employee-cards storage
-- policies that the app never uses. Drop those too.
-- The correct bucket is `pfps` (created by the original 20260225202531 migration).

-- ── employees table: drop stale permissive policies ───────────────────────────
drop policy if exists "anyone can read"  on employees;
drop policy if exists "anyone can insert" on employees;

-- ── employees table: ensure canonical consent-gated policies exist ────────────
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

-- ── storage: drop wrong-bucket policies from early draft ──────────────────────
drop policy if exists "public read photos"   on storage.objects;
drop policy if exists "public read cards"    on storage.objects;
drop policy if exists "public upload photos" on storage.objects;
drop policy if exists "public upload cards"  on storage.objects;

-- ── storage: ensure pfps bucket and its policies exist ───────────────────────
insert into storage.buckets (id, name, public)
values ('pfps', 'pfps', true)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename  = 'objects'
      and policyname = 'pfps public read'
  ) then
    execute $p$
      create policy "pfps public read"
        on storage.objects for select
        using (bucket_id = 'pfps')
    $p$;
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename  = 'objects'
      and policyname = 'pfps public upload'
  ) then
    execute $p$
      create policy "pfps public upload"
        on storage.objects for insert
        with check (bucket_id = 'pfps')
    $p$;
  end if;
end $$;
