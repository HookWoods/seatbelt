create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free'
);

alter table public.profiles enable row level security;

create policy "owner can read" on public.profiles for select using (auth.uid() = id);

-- Only the server changes plans: there is no update policy for users.
create table public.processed_events (id text primary key, created_at timestamptz default now());
alter table public.processed_events enable row level security;
