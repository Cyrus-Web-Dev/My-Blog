---
title: "Transaksi Database dan ACID: Semua Berhasil atau Tidak Sama Sekali"
slug: transaksi-database-dan-acid
category: database
type: panduan
level: menengah
published: true
excerpt: "Transfer saldo yang berhasil memotong tapi gagal menambah adalah mimpi buruk. Transaksi mencegahnya."
goal: "Memahami transaksi dan empat jaminan ACID."
benefits: "Data tetap konsisten walau terjadi error di tengah proses."
tags: [database, transaksi, acid, postgresql]
links:
  - label: "PostgreSQL: Transactions"
    url: "https://www.postgresql.org/docs/current/tutorial-transactions.html"
  - label: "PostgreSQL: Transaction Isolation"
    url: "https://www.postgresql.org/docs/current/transaction-iso.html"
---

## Contoh

```sql
begin;
  update rekening set saldo = saldo - 100000 where id = 1;
  update rekening set saldo = saldo + 100000 where id = 2;
commit;     -- atau rollback; untuk membatalkan semuanya
```

Jika error terjadi di antara dua `update`, seluruh transaksi dibatalkan: tidak ada uang yang "hilang".

## ACID

- **Atomicity**: semua langkah berhasil, atau tidak ada yang berlaku.
- **Consistency**: transaksi membawa database dari satu keadaan valid ke keadaan valid lain (constraint tetap terpenuhi).
- **Isolation**: transaksi yang berjalan bersamaan tidak saling mengacaukan.
- **Durability**: setelah `commit`, data bertahan walau server mati.

## Di aplikasi (Laravel)

```php
DB::transaction(function () use ($asal, $tujuan, $nominal) {
    $asal->decrement('saldo', $nominal);
    $tujuan->increment('saldo', $nominal);
});
```

Jika ada exception di dalam closure, Laravel membatalkan transaksi.

## Hal yang perlu diingat

- Tindakan di luar database (kirim email, panggil API) **tidak ikut dibatalkan** oleh rollback. Lakukan setelah commit, atau pakai antrean.
- Transaksi yang panjang menahan kunci dan menghambat yang lain. Buat sesingkat mungkin.
- Level isolasi menentukan anomali apa yang masih mungkin terjadi (default PostgreSQL: *Read Committed*). Baca dokumentasinya sebelum mengubah.
