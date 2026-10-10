---
title: "Indexing dan Query Plan PostgreSQL untuk Developer Web"
slug: indexing-query-plan-postgresql-developer-web
category: database
type: deep-dive
level: mahir
published: true
date: 2026-10-08
excerpt: "Query lambat hampir selalu bisa dijelaskan oleh query plan. Pelajari membacanya dan membuat index yang tepat."
goal: "Mampu menemukan penyebab query lambat dan memilih index yang sesuai."
benefits: "Respons aplikasi lebih cepat dan beban database lebih ringan."
challenges: "Index mempercepat baca tetapi memperlambat tulis dan memakan ruang, jadi harus dipilih dengan sadar."
tags: [postgresql, index, performa, query]
links:
  - label: "PostgreSQL: Using EXPLAIN"
    url: "https://www.postgresql.org/docs/current/using-explain.html"
  - label: "PostgreSQL: Indexes"
    url: "https://www.postgresql.org/docs/current/indexes.html"
---

## Mulai dari mengukur: EXPLAIN ANALYZE

```sql
explain (analyze, buffers)
select * from pesanan where pelanggan_id = 123 order by dibuat desc limit 20;
```

`EXPLAIN` menunjukkan rencana; `ANALYZE` benar-benar menjalankannya dan menampilkan waktu nyata. (Hati-hati: untuk `INSERT/UPDATE/DELETE`, `ANALYZE` benar-benar mengeksekusi perubahan, jadi bungkus dengan transaksi lalu `rollback`.)

Hal yang dicari:

- **Seq Scan** pada tabel besar dengan filter selektif: kandidat index.
- Perbedaan besar antara perkiraan baris (`rows=`) dan kenyataan (`actual rows=`): statistik mungkin basi (`ANALYZE tabel`).
- **Sort** besar yang tumpah ke disk.

## Jenis scan

- **Seq Scan**: membaca seluruh tabel. Wajar untuk tabel kecil atau saat hampir semua baris dibutuhkan.
- **Index Scan / Index Only Scan**: memakai index. *Index Only* tidak perlu menyentuh tabel bila semua kolom ada di index (dan halaman ditandai *visible*).
- **Bitmap Heap Scan**: gabungan, efektif untuk banyak baris tersebar.

## B-tree: index bawaan

Cocok untuk `=`, `<`, `>`, `BETWEEN`, dan `ORDER BY`.

```sql
create index pesanan_pelanggan_idx on pesanan (pelanggan_id);
```

> Di PostgreSQL, kolom foreign key **tidak** otomatis diberi index. Sering kali kamu perlu membuatnya sendiri.

## Index komposit: urutan kolom penting

```sql
create index pesanan_pelanggan_dibuat_idx on pesanan (pelanggan_id, dibuat desc);
```

Index ini melayani query yang memfilter `pelanggan_id` (dan opsional mengurutkan `dibuat`). Aturan praktis: kolom yang difilter dengan `=` di depan, kolom rentang/urutan sesudahnya. Index `(a, b)` tidak membantu query yang hanya memfilter `b`.

## Partial index

Index hanya untuk sebagian baris, lebih kecil dan cepat:

```sql
create index pesanan_belum_bayar_idx on pesanan (dibuat)
where status = 'belum_bayar';
```

## Covering index (INCLUDE)

```sql
create index pesanan_pelanggan_cover_idx
on pesanan (pelanggan_id) include (total, status);
```

Memungkinkan *index-only scan* untuk query yang hanya mengambil kolom tersebut.

## Pencarian teks dan JSON

- `LIKE '%kata%'` tidak bisa memakai B-tree. Gunakan ekstensi `pg_trgm` dengan index GIN:

```sql
create extension if not exists pg_trgm;
create index barang_nama_trgm_idx on barang using gin (nama gin_trgm_ops);
```

- Untuk kolom `jsonb` dan array, index **GIN** juga umum dipakai.
- Untuk pencarian teks penuh, pelajari `tsvector` dan `to_tsquery`.

## Mengapa index kadang tidak dipakai

1. Tabel kecil: seq scan memang lebih murah.
2. Filter tidak selektif (mengembalikan sebagian besar baris).
3. Fungsi pada kolom: `where lower(email) = ...` butuh index ekspresi `on (lower(email))`.
4. Tipe data tidak cocok sehingga terjadi konversi implisit.
5. Statistik basi: jalankan `ANALYZE`.

## Biaya index

Setiap index harus diperbarui pada `INSERT/UPDATE/DELETE` dan memakan ruang disk. Jangan membuat index "untuk berjaga-jaga". Pantau index yang tidak pernah terpakai lewat `pg_stat_user_indexes` (kolom `idx_scan`).

## Menemukan query yang lambat

Aktifkan ekstensi `pg_stat_statements` untuk melihat query dengan total waktu terbesar. Mengoptimalkan beberapa query teratas biasanya memberi dampak terbesar.

## Alur kerja yang disarankan

1. Temukan query lambat (log atau `pg_stat_statements`).
2. Jalankan `EXPLAIN (ANALYZE, BUFFERS)` pada data yang realistis.
3. Buat hipotesis, tambah index yang paling sederhana.
4. Ukur ulang, bandingkan sebelum dan sesudah.
5. Hapus index yang ternyata tidak membantu.

> 📸 **TODO (opsional):** tampilkan keluaran `EXPLAIN ANALYZE` sebelum dan sesudah index dari tabel milikmu (misalnya waktu eksekusi turun dari X ms ke Y ms) sebagai bukti.
