---
title: "Policy RLS Salah: Data Kosong Padahal Query Benar"
slug: rls-salah-data-kosong-padahal-query-benar
category: database
type: studi-kasus
level: menengah
published: false
date: 2026-09-13
excerpt: "Query berhasil, tanpa error, tapi hasilnya array kosong. Hampir selalu itu Row Level Security yang bekerja diam-diam."
goal: "Mampu mendiagnosis kenapa data tidak muncul akibat RLS dan memperbaikinya dengan benar."
benefits: "Cepat membedakan masalah query, masalah login, dan masalah policy."
challenges: "RLS tidak menghasilkan error saat menolak membaca; ia hanya menyembunyikan baris, sehingga terlihat seperti tabel kosong."
tags: [supabase, rls, postgresql, debugging]
links:
  - label: "Supabase: Row Level Security"
    url: "https://supabase.com/docs/guides/database/postgres/row-level-security"
---

> 📸 **TODO (isi dengan bukti milikmu):** screenshot respons `data: []` tanpa error di DevTools tab Network, lalu halaman Policies di dashboard Supabase sebelum dan sesudah perbaikan.

## Gejala

`select` dari client mengembalikan `[]` dan `error: null`, padahal baris ada di tabel saat dilihat di dashboard.

## Penyebab yang paling sering

1. **RLS aktif tetapi belum ada policy `select`.** Tanpa policy, tidak ada baris yang boleh dibaca.
2. **Policy butuh `auth.uid()`, tapi pengguna belum login** (atau token tidak terkirim), sehingga `auth.uid()` bernilai `null`.
3. **Hanya ada policy `insert`.** Operasi `update` dan `delete` juga membutuhkan hak untuk melihat baris terkait, jadi policy `select` tetap diperlukan.
4. **Kolom pemilik tidak cocok**, misalnya policy membandingkan `user_id = auth.uid()` tetapi data lama diisi `null`.

## Cara mendiagnosis

Tiru peran pengguna langsung di SQL Editor, di dalam transaksi:

```sql
begin;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"UUID-USER-KAMU","role":"authenticated"}', true);

select * from public.catatan;   -- apa yang terlihat oleh user ini?
rollback;
```

Bandingkan dengan `select * from public.catatan;` biasa. Perbedaannya memperlihatkan efek policy. Ingat juga bahwa `service_role` melewati RLS, jadi jangan menguji dengan kunci itu.

## Perbaikan

```sql
alter table public.catatan enable row level security;

create policy "baca catatan sendiri"
on public.catatan for select
to authenticated
using ( (select auth.uid()) = user_id );

create policy "tulis catatan sendiri"
on public.catatan for insert
to authenticated
with check ( (select auth.uid()) = user_id );
```

Membungkus `auth.uid()` dengan `(select ...)` membantu performa pada tabel besar, karena nilainya dievaluasi sekali per query, bukan per baris.

## Pelajaran

Kalau data "hilang" tanpa error, curigai RLS lebih dulu. Dan jangan pernah memperbaikinya dengan memakai service key di client.
