create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false
);

alter table public.profiles enable row level security;

create policy "owner can read" on public.profiles for select using (auth.uid() = id);
