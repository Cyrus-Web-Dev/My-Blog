---
title: "Eloquent Relasi: hasMany, belongsTo, dan belongsToMany"
slug: eloquent-relasi-hasmany-belongsto-belongstomany
category: framework
type: panduan
level: menengah
published: true
excerpt: "Relasi membuat query antar tabel terbaca seperti kalimat. Ketahui juga cara menghindari N+1."
goal: "Mendefinisikan dan memakai relasi Eloquent dengan efisien."
benefits: "Kode ringkas dan query terkontrol."
tags: [laravel, eloquent, relasi, database]
links:
  - label: "Laravel: Eloquent Relationships"
    url: "https://laravel.com/docs/eloquent-relationships"
---

## Satu ke banyak

```php
class Supplier extends Model
{
    public function pengadaan() { return $this->hasMany(Pengadaan::class); }
}

class Pengadaan extends Model
{
    public function supplier() { return $this->belongsTo(Supplier::class); }
    public function items()    { return $this->hasMany(PengadaanItem::class); }
}
```

Tabel `pengadaan` memiliki kolom `supplier_id`.

## Banyak ke banyak

```php
class Siswa extends Model
{
    public function kelas() { return $this->belongsToMany(Kelas::class)->withTimestamps(); }
}
```

Butuh tabel penghubung `kelas_siswa` (nama berdasarkan urutan alfabet model).

```php
$siswa->kelas()->attach($kelasId);
$siswa->kelas()->sync([1, 2, 3]);
```

## Memakai relasi

```php
$pengadaan->supplier->nama;       // properti: memuat model terkait
$supplier->pengadaan()->where('status', 'disetujui')->get();   // method: query builder
```

## Hindari N+1: eager loading

```php
$daftar = Pengadaan::with(['supplier', 'items'])->latest()->paginate(20);
$suppliers = Supplier::withCount('pengadaan')->get();
```

Aktifkan `Model::preventLazyLoading(! app()->isProduction())` agar lazy loading tak sengaja langsung ketahuan saat pengembangan.

## Filter berdasarkan relasi

```php
Supplier::whereHas('pengadaan', fn ($q) => $q->where('status', 'disetujui'))->get();
```
