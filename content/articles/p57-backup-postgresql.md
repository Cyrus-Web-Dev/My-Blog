---
title: "Backup dan Restore PostgreSQL: pg_dump, pg_restore, dan Uji Pemulihan"
slug: backup-dan-restore-postgresql
category: database
type: panduan
level: menengah
published: true
excerpt: "Backup yang belum pernah diuji pemulihannya hanyalah harapan. Begini dasar mencadangkan PostgreSQL dengan benar."
goal: "Membuat dan memulihkan backup PostgreSQL serta membangun kebiasaan pengujian."
benefits: "Siap menghadapi salah hapus, kerusakan, atau migrasi gagal."
challenges: "Perintah yang salah saat restore dapat menimpa data; selalu uji ke database terpisah dulu."
tags: [postgresql, backup, database, devops]
links:
  - label: "PostgreSQL: Backup and Restore"
    url: "https://www.postgresql.org/docs/current/backup.html"
---

## Backup logis dengan pg_dump

```bash
# Format kustom (terkompresi, fleksibel saat restore)
pg_dump -h localhost -U app -d aplikasi -Fc -f aplikasi_$(date +%F).dump
```

`-Fc` menghasilkan format kustom yang bisa dipulihkan secara selektif.

## Restore

```bash
createdb -U postgres aplikasi_uji
pg_restore -h localhost -U postgres -d aplikasi_uji --no-owner aplikasi_2026-10-10.dump
```

Restore **ke database uji dulu**, jangan langsung menimpa production.

Untuk backup format SQL polos (`pg_dump` tanpa `-Fc`):

```bash
psql -U postgres -d aplikasi_uji -f cadangan.sql
```

## Otomatisasi

Jadwalkan dengan cron atau scheduler, simpan **di luar server database** (penyimpanan objek, server lain), dan terapkan **retensi** (mis. harian 7 hari, mingguan 4 minggu).

```cron
0 2 * * * pg_dump -U app -d aplikasi -Fc -f /backup/aplikasi_$(date +\%F).dump
```

Simpan kata sandi lewat `~/.pgpass` atau variabel environment, bukan di perintah.

## Aturan 3-2-1

3 salinan data, di 2 jenis media berbeda, 1 di luar lokasi.

## Uji pemulihan secara berkala

Latih dan catat waktu yang dibutuhkan: backup yang tidak bisa dipulihkan tidak ada artinya. Periksa ukuran, jumlah tabel, dan jalankan beberapa query validasi setelah restore.

## Lebih lanjut

Untuk pemulihan ke titik waktu tertentu (*point-in-time recovery*) dan data besar, pelajari backup fisik dan pengarsipan WAL, atau fitur backup dari penyedia database terkelola yang kamu pakai.
