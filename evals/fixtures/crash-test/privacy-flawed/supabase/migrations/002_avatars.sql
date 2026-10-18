insert into storage.buckets (id, name, public) values ('avatars', 'avatars', false);
create policy "owner reads own avatar" on storage.objects for select using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "owner uploads own avatar" on storage.objects for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
