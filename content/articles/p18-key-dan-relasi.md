---
title: "Primary Key, Foreign Key, dan Jenis Relasi Antar Tabel"
slug: primary-key-foreign-key-jenis-relasi
category: database
type: panduan
level: pemula
published: true
excerpt: "Relasi adalah inti database relasional. Pahami satu-ke-banyak dan banyak-ke-banyak, dan desainmu akan rapi."
goal: "Merancang relasi tabel dan constraint yang menjaga integritas data."
benefits: "Database menolak data yatim dan ganda secara otomatis."
tags: [database, relasi, foreign-key, sql]
links:
  - label: "PostgreSQL: Constraints"
    url: "https://www.postgresql.org/docs/current/ddl-constraints.html"
---

## Kunci

- **Primary key**: pengenal unik tiap baris (`id`).
- **Foreign key**: kolom yang merujuk primary key tabel lain, dijaga oleh database.

```sql
create table pelanggan (
  id bigint generated always as identity primary key,
  nama text not null
);

create table pesanan (
  id bigint generated always as identity primary key,
  pelanggan_id bigint not null references pelanggan(id) on delete restrict,
  dibuat timestamptz not null default now()
);
create index on pesanan (pelanggan_id);   -- FK tidak otomatis ber-index di PostgreSQL
```

## Jenis relasi

- **Satu ke banyak (1-N)**: satu pelanggan, banyak pesanan. Kunci asing di sisi "banyak".
- **Satu ke satu (1-1)**: pengguna dan profilnya. Foreign key sekaligus `unique`.
- **Banyak ke banyak (N-N)**: siswa dan kelas. Butuh **tabel penghubung**:

```sql
create table pendaftaran (
  siswa_id bigint references siswa(id),
  kelas_id bigint references kelas(id),
  primary key (siswa_id, kelas_id)
);
```

## Perilaku saat induk dihapus (`ON DELETE`)

- `restrict`/`no action`: tolak penghapusan jika masih ada anak (paling aman).
- `cascade`: ikut hapus anak. Praktis, tapi berbahaya bila salah.
- `set null`: kosongkan rujukan.

Untuk data keuangan, lebih baik **tolak** atau pakai penghapusan lunak (`deleted_at`) daripada `cascade`.
