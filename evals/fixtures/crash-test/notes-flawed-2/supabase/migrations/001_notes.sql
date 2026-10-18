create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  body text not null,
  created_at timestamptz default now()
);

alter table public.notes enable row level security;

create policy "anyone can read" on public.notes for select using (true);
create policy "owner can insert" on public.notes for insert with check (auth.uid() = user_id);
