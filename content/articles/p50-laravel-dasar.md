---
title: "Laravel Dasar: Route, Controller, dan Eloquent"
slug: laravel-dasar-route-controller-eloquent
category: framework
type: panduan
level: pemula
published: true
excerpt: "Tiga konsep ini adalah tulang punggung hampir semua aplikasi Laravel."
goal: "Membuat CRUD sederhana dengan Laravel."
benefits: "Fondasi untuk aplikasi bisnis yang rapi dan terstruktur."
tags: [laravel, php, backend, pemula]
links:
  - label: "Laravel docs"
    url: "https://laravel.com/docs"
---

## Alur request

Request → **Route** → **Controller** → **Model** (Eloquent) → **View**/JSON.

## Route

```php
// routes/web.php
use App\Http\Controllers\PelangganController;
Route::resource('pelanggan', PelangganController::class);
```

`resource` membuat route CRUD standar (index, create, store, show, edit, update, destroy).

## Model dan migrasi

```bash
php artisan make:model Pelanggan -mcr   # model + migrasi + controller resource
```

```php
// migrasi
Schema::create('pelanggan', function (Blueprint $t) {
    $t->id();
    $t->string('nama');
    $t->string('kota')->nullable();
    $t->timestamps();
});
```

```bash
php artisan migrate
```

## Controller

```php
public function store(Request $request)
{
    $data = $request->validate([
        'nama' => ['required', 'string', 'max:100'],
        'kota' => ['nullable', 'string', 'max:100'],
    ]);

    Pelanggan::create($data);       // pastikan $fillable di model
    return redirect()->route('pelanggan.index');
}

public function index()
{
    return view('pelanggan.index', ['daftar' => Pelanggan::latest()->paginate(15)]);
}
```

## Model

```php
class Pelanggan extends Model
{
    protected $fillable = ['nama', 'kota'];
}
```

## Kebiasaan baik

- Selalu validasi input dan batasi `$fillable`.
- Gunakan `paginate()`, bukan `all()`, untuk daftar besar.
- Simpan konfigurasi di `.env`, jangan di kode.
