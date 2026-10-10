---
title: "Laravel Queue: Job Tidak Jalan atau Gagal Diam-diam"
slug: laravel-queue-job-tidak-jalan-atau-gagal-diam-diam
category: backend
type: studi-kasus
level: menengah
published: false
excerpt: "Email tak terkirim, laporan tak terbuat, dan tak ada error di layar. Biasanya masalahnya ada di worker atau konfigurasinya."
goal: "Memastikan job berjalan andal dan kegagalannya terlihat."
benefits: "Pekerjaan latar belakang bisa diandalkan dan mudah dipantau."
challenges: "Kegagalan terjadi di proses terpisah sehingga tidak terlihat dari request yang memicunya."
tags: [laravel, queue, supervisor, backend]
links:
  - label: "Laravel: Queues"
    url: "https://laravel.com/docs/queues"
---

> 📸 **TODO (isi dengan bukti milikmu):** isi tabel `jobs` yang menumpuk, `php artisan queue:failed`, dan log worker.

## Daftar periksa

**1. Apakah worker berjalan?**

```bash
php artisan queue:work
```

Jika tidak ada proses ini, job hanya menumpuk di tabel `jobs`. Di production, jalankan di bawah **Supervisor** atau systemd agar otomatis hidup kembali.

**2. Driver antrean benar?**

`QUEUE_CONNECTION=sync` menjalankan job langsung saat request (tanpa antrean). `database` atau `redis` butuh worker. Pastikan `.env` di server benar dan cache konfigurasi segar (`php artisan config:clear`).

**3. Setelah deploy, restart worker**

Worker menyimpan kode di memori. Tanpa restart, ia memakai kode lama.

```bash
php artisan queue:restart
```

**4. Cek job yang gagal**

```bash
php artisan queue:failed
php artisan queue:retry all
```

Pastikan tabel `failed_jobs` ada (`php artisan queue:failed-table` lalu migrate pada versi yang memerlukannya).

**5. Timeout dan retry**

```php
class KirimLaporan implements ShouldQueue
{
    public int $tries = 3;
    public int $timeout = 120;
    public function backoff(): array { return [10, 60, 300]; }
}
```

Jika job lebih lama dari timeout, ia dibunuh dan dicoba ulang.

**6. Jadikan job idempoten**

Karena bisa dicoba ulang, pastikan menjalankan dua kali tidak menghasilkan efek ganda (mis. email terkirim dua kali).

## Pantau

Gunakan Laravel Horizon (untuk Redis) atau pantau jumlah job menunggu dan gagal, lalu pasang peringatan bila melonjak.
