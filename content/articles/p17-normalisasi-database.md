---
title: "Desain Tabel: Normalisasi Tanpa Pusing"
slug: desain-tabel-normalisasi-tanpa-pusing
category: database
type: panduan
level: pemula
published: true
excerpt: "Normalisasi intinya satu: jangan simpan fakta yang sama di banyak tempat."
goal: "Memahami 1NF, 2NF, 3NF dengan contoh sederhana."
benefits: "Data konsisten, mudah diubah, dan tidak berulang."
tags: [database, normalisasi, desain, sql]
links:
  - label: "PostgreSQL: Data Definition"
    url: "https://www.postgresql.org/docs/current/ddl.html"
---

## Tabel yang buruk

| pesanan_id | pelanggan | kota | barang | harga |
|---|---|---|---|---|
| 1 | Ayu | Padang | Mouse, Keyboard | 100000, 250000 |

Masalah: satu sel berisi banyak nilai, data pelanggan akan berulang di tiap pesanan, dan mengganti kota Ayu berarti mengubah banyak baris.

## Bentuk Normal 1 (1NF)

Satu sel, satu nilai. Pisahkan barang menjadi baris sendiri.

## Bentuk Normal 2 (2NF)

Setiap kolom bergantung pada **seluruh** kunci. Harga barang adalah fakta tentang *barang*, bukan tentang pesanan, jadi pindahkan ke tabel `barang`.

## Bentuk Normal 3 (3NF)

Kolom tidak boleh bergantung pada kolom non-kunci lain. `kota` adalah fakta tentang *pelanggan*, jadi pindahkan ke tabel `pelanggan`.

## Hasil

```
pelanggan(id, nama, kota)
barang(id, nama, harga)
pesanan(id, pelanggan_id, dibuat)
pesanan_item(pesanan_id, barang_id, jumlah, harga_saat_beli)
```

Perhatikan `harga_saat_beli`: untuk transaksi, **sengaja** menyalin harga saat itu agar dokumen lama tidak berubah ketika harga barang berubah. Ini bukan pelanggaran normalisasi, melainkan mencatat fakta historis.

## Kapan boleh denormalisasi

Untuk laporan atau kinerja baca, setelah terbukti ada masalah dan kamu siap menjaga konsistensinya. Mulai dari desain yang normal.
