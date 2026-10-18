create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free'
);

alter table public.profiles enable row level security;

create policy "owner can read" on public.profiles for select using (auth.uid() = id);
create policy "owner can update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
