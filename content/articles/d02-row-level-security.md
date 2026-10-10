---
title: "Row Level Security di PostgreSQL dan Supabase: Dari Nol sampai Produksi"
slug: row-level-security-postgresql-supabase-panduan
category: database
type: deep-dive
level: mahir
published: true
date: 2026-10-06
excerpt: "RLS memindahkan aturan 'siapa boleh melihat apa' ke dalam database. Panduan ini membahas dasar, pola, performa, dan jebakan."
goal: "Mampu merancang dan menguji kebijakan RLS yang aman untuk aplikasi nyata."
benefits: "Keamanan data tetap terjaga walau ada bug di kode aplikasi atau client."
challenges: "RLS gagal secara diam-diam (data tampak kosong) dan policy yang buruk bisa memperlambat query."
tags: [postgresql, supabase, rls, keamanan]
links:
  - label: "PostgreSQL: Row Security Policies"
    url: "https://www.postgresql.org/docs/current/ddl-rowsecurity.html"
  - label: "Supabase: Row Level Security"
    url: "https://supabase.com/docs/guides/database/postgres/row-level-security"
---

## Mengapa RLS

Di Supabase, client (browser) berbicara langsung ke database lewat API. Jadi pembatas akses **harus** berada di database. RLS adalah fitur PostgreSQL yang menyaring baris yang boleh dibaca atau diubah sesuai identitas pemanggil.

## Mengaktifkan

```sql
alter table public.catatan enable row level security;
```

Begitu aktif dan **tanpa policy**, tidak ada baris yang bisa diakses oleh peran biasa (pemilik tabel dan peran yang melewati RLS tetap bisa). Itulah sebabnya data tampak kosong tanpa error.

## Peran di Supabase

- `anon`: pengunjung belum login.
- `authenticated`: pengguna sudah login.
- `service_role`: kunci server, **melewati RLS**. Jangan pernah dipakai di client.

## Anatomi policy

```sql
create policy "nama kebijakan"
on public.catatan
for select            -- select | insert | update | delete | all
to authenticated      -- peran yang dikenai
using ( kondisi )     -- baris yang boleh DIBACA / dijadikan target
with check ( kondisi ); -- baris baru yang boleh DITULIS
```

- `USING` menyaring baris yang sudah ada (untuk select, update, delete).
- `WITH CHECK` memeriksa baris hasil tulisan (untuk insert dan update).

## Pola 1: milik sendiri

```sql
create policy "baca milik sendiri" on public.catatan
for select to authenticated
using ( (select auth.uid()) = user_id );

create policy "tulis milik sendiri" on public.catatan
for insert to authenticated
with check ( (select auth.uid()) = user_id );

create policy "ubah milik sendiri" on public.catatan
for update to authenticated
using ( (select auth.uid()) = user_id )
with check ( (select auth.uid()) = user_id );
```

## Pola 2: publik baca, pemilik tulis

```sql
create policy "baca publik" on public.artikel
for select using ( terbit = true );
```

## Pola 3: multi-tenant (anggota organisasi)

```sql
create policy "anggota org bisa baca" on public.proyek
for select to authenticated
using (
  org_id in (
    select org_id from public.anggota where user_id = (select auth.uid())
  )
);
```

## Pola 4: peran admin

Simpan peran di tabel terpisah yang tidak bisa diubah pengguna biasa, lalu rujuk dari policy. Hindari mengandalkan data yang dapat diedit pengguna sendiri (seperti `user_metadata`) untuk keputusan otorisasi.

## Performa

- Bungkus fungsi seperti `auth.uid()` dengan `(select auth.uid())` agar dievaluasi sekali per query.
- **Beri index** pada kolom yang dipakai di policy (`user_id`, `org_id`).
- Hindari subquery berat di dalam policy; bila perlu, pindahkan ke fungsi `security definer` yang dirancang hati-hati.

## Fungsi security definer

Fungsi `security definer` berjalan dengan hak pemiliknya dan dapat melewati RLS. Gunakan dengan hati-hati: tetapkan `search_path` secara eksplisit dan jangan menaruhnya di skema yang terekspos ke API tanpa pertimbangan.

## Menguji policy

```sql
begin;
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"UUID-USER","role":"authenticated"}', true);

select * from public.catatan;          -- harus hanya milik user itu
insert into public.catatan (user_id, isi) values ('UUID-LAIN', 'x');  -- harus ditolak
rollback;
```

Uji **kasus negatif** juga: pastikan pengguna A *tidak* bisa melihat atau mengubah data pengguna B.

## Jebakan umum

1. Lupa mengaktifkan RLS pada tabel baru.
2. Memakai `service_role` di client "biar gampang".
3. Policy `update` tanpa `WITH CHECK`, sehingga pengguna bisa mengubah `user_id` baris ke orang lain.
4. View yang dijalankan dengan hak pemilik sehingga melewati RLS (periksa opsi `security_invoker` pada versi PostgreSQL yang mendukungnya).
5. Lupa policy untuk **Storage** saat mengunggah berkas.
6. Mengira "tidak error" berarti "aman" atau "salah".

## Daftar periksa produksi

- [ ] RLS aktif di semua tabel pada skema yang terekspos.
- [ ] Setiap tabel punya policy untuk tiap operasi yang diperlukan.
- [ ] Kolom pada policy diberi index.
- [ ] Kasus negatif sudah diuji.
- [ ] Tidak ada kunci `service_role` di kode client.

> 📸 **TODO (opsional):** screenshot halaman Policies di dashboard dan hasil uji di SQL Editor sebagai bukti milikmu.
