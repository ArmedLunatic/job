-- employees table
create table if not exists employees (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  username    text not null,
  role        text not null,
  stamp       text not null default 'none',
  photo_url   text not null,
  card_url    text
);

-- RLS
alter table employees enable row level security;

create policy "anyone can read"
  on employees for select
  using (true);

create policy "anyone can insert"
  on employees for insert
  with check (true);
