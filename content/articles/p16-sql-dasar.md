---
title: "SQL Dasar: SELECT, WHERE, JOIN, dan GROUP BY"
slug: sql-dasar-select-where-join-group-by
category: database
type: panduan
level: pemula
published: true
excerpt: "SQL adalah keterampilan yang awet puluhan tahun. Kuasai lima pola ini dan kamu sudah bisa banyak."
goal: "Menulis query dasar untuk membaca dan mengubah data."
benefits: "Mampu menjawab pertanyaan dari data tanpa bergantung pada orang lain."
challenges: "UPDATE atau DELETE tanpa WHERE mengubah semua baris."
tags: [sql, database, pemula, postgresql]
links:
  - label: "PostgreSQL Tutorial"
    url: "https://www.postgresql.org/docs/current/tutorial.html"
---

Misalkan tabel `pelanggan(id, nama, kota)` dan `pesanan(id, pelanggan_id, total, dibuat)`.

## Membaca data

```sql
select nama, kota
from pelanggan
where kota = 'Padang'
order by nama
limit 10;
```

## Menambah, mengubah, menghapus

```sql
insert into pelanggan (nama, kota) values ('Ayu', 'Padang');

update pelanggan set kota = 'Bandung' where id = 5;   -- JANGAN lupa WHERE

delete from pelanggan where id = 5;                   -- JANGAN lupa WHERE
```

> Kebiasaan aman: tulis `select ... where ...` dulu untuk memastikan baris yang terpilih benar, baru ubah menjadi `update`/`delete`.

## JOIN: menggabungkan tabel

```sql
select p.nama, o.total, o.dibuat
from pesanan o
join pelanggan p on p.id = o.pelanggan_id
where o.total > 100000;
```

`join` (inner) hanya menampilkan baris yang cocok di kedua tabel. `left join` mempertahankan semua baris tabel kiri, termasuk pelanggan yang belum pernah memesan.

## Agregasi

```sql
select p.nama, count(*) as jumlah_pesanan, sum(o.total) as total_belanja
from pesanan o
join pelanggan p on p.id = o.pelanggan_id
group by p.nama
having sum(o.total) > 500000
order by total_belanja desc;
```

`where` menyaring baris **sebelum** pengelompokan, `having` menyaring **hasil** kelompok.

## Latihan

Tulis query untuk menampilkan tiga pelanggan dengan total belanja terbesar bulan ini.
