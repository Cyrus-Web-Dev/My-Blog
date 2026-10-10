---
title: "N+1 Query di Laravel: Cara Menemukan dan Memperbaikinya"
slug: n-plus-1-query-laravel-cara-menemukan
category: backend
type: studi-kasus
level: menengah
published: false
date: 2026-09-19
excerpt: "Halaman daftar terasa lambat padahal datanya tidak banyak. Penyebabnya sering ratusan query kecil yang tidak terlihat."
goal: "Menurunkan jumlah query pada halaman daftar dan mencegah masalah serupa muncul lagi."
benefits: "Halaman lebih cepat, beban database lebih ringan."
challenges: "Di data kecil lokal terlihat cepat, jadi masalah baru terasa setelah data bertambah."
tags: [laravel, eloquent, performa, n-plus-1]
links:
  - label: "Laravel: Eager Loading"
    url: "https://laravel.com/docs/eloquent-relationships#eager-loading"
---

> 📸 **TODO (isi dengan bukti milikmu):** tab Queries di Laravel Debugbar yang menampilkan puluhan query duplikat, lalu hasil sesudah perbaikan (jumlah query dan waktu).

## Gejala

Daftar 50 pengadaan, tiap baris menampilkan nama supplier. Total query: 51.

## Penyebab

```php
$pengadaan = Pengadaan::all();           // 1 query

foreach ($pengadaan as $p) {
    echo $p->supplier->nama;             // +1 query per baris (lazy loading)
}
```

Satu query untuk daftar, lalu satu query tambahan untuk setiap relasi yang dibuka: itulah N+1.

## Cara menemukannya

- **Laravel Debugbar** atau Telescope menampilkan jumlah dan isi query.
- Matikan lazy loading di luar production agar masalah langsung terlihat:

```php
// AppServiceProvider::boot()
Model::preventLazyLoading(! $this->app->isProduction());
```

Dengan ini, mengakses relasi yang belum dimuat akan melempar exception saat pengembangan.

## Perbaikan

```php
$pengadaan = Pengadaan::with(['supplier', 'items'])->latest()->paginate(20);
```

Jika hanya butuh jumlah relasi, gunakan `withCount('items')` agar tidak memuat seluruh baris relasi. Query menjadi 3 (daftar, supplier, items), berapa pun banyak barisnya.

## Pelajaran

Ukur jumlah query, bukan hanya waktu. Aktifkan `preventLazyLoading` sejak awal proyek agar N+1 tertangkap sebelum sampai ke pengguna.
