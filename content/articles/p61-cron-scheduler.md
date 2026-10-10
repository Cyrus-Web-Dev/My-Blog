---
title: "Cron dan Scheduler: Menjalankan Tugas Terjadwal dengan Benar"
slug: cron-dan-scheduler-tugas-terjadwal
category: backend
type: panduan
level: pemula
published: true
excerpt: "Laporan harian, pembersihan data, pengingat. Cron adalah cara klasik menjalankannya, dengan beberapa jebakan yang sering menjebak."
goal: "Menulis jadwal cron yang benar dan menghindari masalah umum."
benefits: "Tugas rutin berjalan otomatis dan terpantau."
tags: [cron, scheduler, server, otomatisasi]
links:
  - label: "crontab.guru"
    url: "https://crontab.guru/"
  - label: "Laravel: Task Scheduling"
    url: "https://laravel.com/docs/scheduling"
---

## Format cron

```
┌ menit (0-59)
│ ┌ jam (0-23)
│ │ ┌ tanggal (1-31)
│ │ │ ┌ bulan (1-12)
│ │ │ │ ┌ hari dalam minggu (0-7, 0 dan 7 = Minggu)
* * * * *  perintah
```

Contoh:

```cron
0 2 * * *     /usr/bin/php /var/www/app/artisan app:bersihkan   # tiap hari jam 02:00
*/15 * * * *  /usr/local/bin/skrip.sh                           # tiap 15 menit
0 9 * * 1     /usr/local/bin/laporan.sh                         # Senin jam 09:00
```

Edit dengan `crontab -e`. Gunakan crontab.guru untuk memeriksa jadwal.

## Jebakan umum

- **Jalur absolut**: cron punya `PATH` minimal. Tulis jalur lengkap ke program.
- **Zona waktu**: cron memakai zona waktu server. Sepakati dan catat.
- **Keluaran hilang**: arahkan ke log.

```cron
0 2 * * * /usr/local/bin/skrip.sh >> /var/log/skrip.log 2>&1
```

- **Tumpang tindih**: tugas yang lebih lama dari intervalnya berjalan ganda. Gunakan kunci (`flock`) atau fitur `withoutOverlapping()` di Laravel.
- **Pengguna berbeda**: cek siapa pemilik crontab dan izin file.

## Laravel Scheduler

Cukup satu entri cron, sisanya didefinisikan di kode:

```cron
* * * * * cd /var/www/app && php artisan schedule:run >> /dev/null 2>&1
```

```php
// routes/console.php (Laravel 11) atau Kernel
Schedule::command('app:bersihkan')->dailyAt('02:00')->withoutOverlapping();
```

## Pantau

Tugas terjadwal gagal diam-diam. Catat hasil, kirim peringatan bila gagal, atau pakai layanan pemantau *heartbeat* yang memberi tahu bila tugas tidak berjalan.
