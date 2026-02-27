-- Storage bucket for $JOB employee wall uploads.
-- PublishPanel.tsx uploads badge PFPs and job-alert cards to the `pfps` bucket.
-- Previous draft of this file referenced wrong bucket names (employee-photos,
-- employee-cards) which the app never uses.

-- Create the bucket used by the app (idempotent)
insert into storage.buckets (id, name, public)
values ('pfps', 'pfps', true)
on conflict (id) do nothing;

-- Drop the wrong-bucket policies from the early draft (no-op if absent)
drop policy if exists "public read photos"  on storage.objects;
drop policy if exists "public read cards"   on storage.objects;
drop policy if exists "public upload photos" on storage.objects;
drop policy if exists "public upload cards"  on storage.objects;

-- RLS: allow anyone to read from pfps
drop policy if exists "pfps public read" on storage.objects;
create policy "pfps public read"
  on storage.objects for select
  using (bucket_id = 'pfps');

-- RLS: allow anyone to upload to pfps
drop policy if exists "pfps public upload" on storage.objects;
create policy "pfps public upload"
  on storage.objects for insert
  with check (bucket_id = 'pfps');
