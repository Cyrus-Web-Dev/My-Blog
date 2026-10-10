-- Jalankan HANYA jika database sudah dibuat dari schema.sql versi sebelumnya.
alter table public.posts drop constraint if exists posts_post_type_check;
alter table public.posts add constraint posts_post_type_check
  check (post_type in ('ringan','studi-kasus','deep-dive','panduan'));
alter table public.posts add column if not exists level text not null default 'menengah'
  check (level in ('pemula','menengah','mahir'));
