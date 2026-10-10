---
title: "Query PostgreSQL Lambat: Alur Diagnosis dari EXPLAIN sampai Index yang Tepat"
slug: query-postgresql-lambat-alur-diagnosis
category: database
type: studi-kasus
level: menengah
published: false
excerpt: "Halaman laporan memakan beberapa detik. Dengan alur yang sistematis, penyebabnya biasanya ditemukan dalam hitungan menit."
goal: "Mempercepat query lambat secara terukur."
benefits: "Respons cepat dan beban database turun."
challenges: "Perbaikan tanpa pengukuran sering hanya menebak."
tags: [postgresql, performa, explain, index]
links:
  - label: "PostgreSQL: Using EXPLAIN"
    url: "https://www.postgresql.org/docs/current/using-explain.html"
---

> 📸 **TODO (isi dengan bukti milikmu):** keluaran `EXPLAIN (ANALYZE, BUFFERS)` sebelum dan sesudah, dengan waktu eksekusi dari datamu sendiri. Jangan memakai angka karangan.

## Kasus

```sql
select * from pesanan
where pelanggan_id = 123 and status = 'dibayar'
order by dibuat desc
limit 20;
```

## Langkah 1: ukur dulu

```sql
explain (analyze, buffers)
select * from pesanan
where pelanggan_id = 123 and status = 'dibayar'
order by dibuat desc limit 20;
```

Catat: tipe scan, `actual time`, jumlah baris yang dibaca vs dikembalikan.

## Langkah 2: baca tanda-tandanya

- **Seq Scan** pada tabel besar dengan filter selektif → perlu index.
- **Rows Removed by Filter** sangat besar → banyak baris dibaca lalu dibuang.
- **Sort** memakan waktu atau tumpah ke disk → index yang mengikuti urutan bisa membantu.

## Langkah 3: rancang index sesuai pola query

Filter dengan `=` di depan, lalu kolom pengurutan:

```sql
create index pesanan_pelanggan_status_dibuat_idx
on pesanan (pelanggan_id, status, dibuat desc);
```

Jika hanya sebagian kecil baris yang sering dicari, pertimbangkan *partial index*.

## Langkah 4: ukur ulang

Jalankan `EXPLAIN (ANALYZE, BUFFERS)` lagi dan bandingkan. Pastikan plannya kini memakai index dan waktunya turun.

## Langkah 5: periksa efek sampingnya

Index memperlambat penulisan dan memakan ruang. Hapus index yang ternyata tidak dipakai (`pg_stat_user_indexes`).

## Bila masih lambat

Perbarui statistik (`ANALYZE pesanan`), kurangi kolom yang diambil (`select *` boros), periksa N+1 di aplikasi, dan pertimbangkan *pagination* berbasis kursor untuk offset besar.
