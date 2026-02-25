-- Storage buckets for employee wall
insert into storage.buckets (id, name, public)
values
  ('employee-photos', 'employee-photos', true),
  ('employee-cards',  'employee-cards',  true)
on conflict (id) do nothing;

-- Allow anyone to read objects from both buckets
create policy "public read photos"
  on storage.objects for select
  using (bucket_id = 'employee-photos');

create policy "public read cards"
  on storage.objects for select
  using (bucket_id = 'employee-cards');

-- Allow anyone to upload to both buckets
create policy "public upload photos"
  on storage.objects for insert
  with check (bucket_id = 'employee-photos');

create policy "public upload cards"
  on storage.objects for insert
  with check (bucket_id = 'employee-cards');
