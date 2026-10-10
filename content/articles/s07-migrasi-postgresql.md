---
title: "Migrasi PostgreSQL: Menambah Kolom Wajib Tanpa Merusak Data Lama"
slug: migrasi-postgresql-kolom-wajib-data-lama
category: database
type: studi-kasus
level: menengah
published: false
date: 2026-09-23
excerpt: "Menambah kolom NOT NULL ke tabel yang sudah berisi data bisa gagal. Urutan tiga langkah ini menyelamatkannya."
goal: "Menambah kolom wajib pada tabel produksi dengan aman."
benefits: "Migrasi tidak gagal di tengah jalan dan data lama tetap konsisten."
challenges: "Di database lokal yang kosong semuanya mulus; kegagalan baru muncul di data nyata."
tags: [postgresql, migrasi, laravel, database]
links:
  - label: "PostgreSQL: ALTER TABLE"
    url: "https://www.postgresql.org/docs/current/sql-altertable.html"
---

> 📸 **TODO (isi dengan bukti milikmu):** pesan error migrasi (`column contains null values`) dan hasil pengecekan data sebelum/sesudah backfill.

## Gejala

```
ERROR: column "status" of relation "pengadaan" contains null values
```

## Penyebab

Menambah kolom `NOT NULL` tanpa nilai default ke tabel berisi data membuat baris lama tidak punya nilai, sehingga constraint gagal.

## Pola tiga langkah

1. **Tambah kolom sebagai nullable.**
2. **Isi (backfill) data lama.**
3. **Baru terapkan NOT NULL** (dan default bila perlu).

Di Laravel:

```php
public function up(): void
{
    Schema::table('pengadaan', function (Blueprint $t) {
        $t->string('status')->nullable();
    });

    DB::table('pengadaan')->whereNull('status')->update(['status' => 'draft']);

    Schema::table('pengadaan', function (Blueprint $t) {
        $t->string('status')->nullable(false)->default('draft')->change();
    });
}
```

Pada Laravel 10 ke bawah, `->change()` memerlukan paket `doctrine/dbal`; Laravel 11 sudah mendukungnya secara bawaan.

## Mengubah tipe kolom

PostgreSQL kadang tidak bisa mengonversi otomatis. Sertakan `USING`:

```sql
alter table pengadaan
  alter column nilai type numeric(15,2) using nilai::numeric;
```

## Kebiasaan aman

- **Backup dulu**, lalu coba migrasi di salinan data produksi.
- Jalankan perubahan struktural dalam transaksi bila memungkinkan (PostgreSQL mendukung DDL transaksional).
- Untuk tabel sangat besar, backfill bertahap per batch agar tidak mengunci tabel terlalu lama.
