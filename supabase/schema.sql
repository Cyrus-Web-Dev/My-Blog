-- Jalankan di Supabase → SQL Editor. GANTI email admin di fungsi is_admin().
create extension if not exists "pgcrypto";

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  goal text not null default '',            -- Tujuan akhir
  benefits text not null default '',        -- Manfaat
  challenges text not null default '',      -- Tantangan dan kendala
  content text not null default '',         -- Isi lengkap (Markdown)
  links jsonb not null default '[]'::jsonb, -- [{label, url}]
  cover_image text,
  author text not null default 'Developer BDW',
  tags text[] not null default '{}',
  category text not null check (category in ('frontend','backend','api','database','framework')),
  post_type text not null default 'ringan' check (post_type in ('ringan','studi-kasus','deep-dive','panduan')),
  level text not null default 'menengah' check (level in ('pemula','menengah','mahir')),
  tech_versions text,                       -- mis. "Next.js 15.1, Supabase JS 2.47"
  verified_at date,                         -- terakhir diverifikasi akurat
  reading_minutes int not null default 1,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists posts_category_idx on public.posts (category);
create index if not exists posts_created_idx on public.posts (created_at desc);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts for each row execute function public.touch_updated_at();

create or replace function public.is_admin() returns boolean language sql stable as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'GANTI_DENGAN_EMAIL_KAMU'
$$;

alter table public.posts enable row level security;
create policy "baca publik artikel terbit" on public.posts for select using (published = true or public.is_admin());
create policy "admin tambah" on public.posts for insert with check (public.is_admin());
create policy "admin ubah" on public.posts for update using (public.is_admin()) with check (public.is_admin());
create policy "admin hapus" on public.posts for delete using (public.is_admin());

-- Bucket screenshot
insert into storage.buckets (id, name, public) values ('post-images', 'post-images', true) on conflict do nothing;
create policy "gambar publik dibaca" on storage.objects for select using (bucket_id = 'post-images');
create policy "admin upload gambar" on storage.objects for insert with check (bucket_id = 'post-images' and public.is_admin());
create policy "admin hapus gambar" on storage.objects for delete using (bucket_id = 'post-images' and public.is_admin());
