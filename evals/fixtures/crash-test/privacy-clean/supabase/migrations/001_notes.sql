create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

alter table public.notes enable row level security;

create policy "owner can read" on public.notes for select using (auth.uid() = user_id);
create policy "owner can insert" on public.notes for insert with check (auth.uid() = user_id);
create policy "owner can update" on public.notes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner can delete" on public.notes for delete using (auth.uid() = user_id);
