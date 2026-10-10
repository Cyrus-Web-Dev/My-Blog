---
title: "Laravel: Data Sensitif Ikut Terkirim di Respons API"
slug: laravel-data-sensitif-terkirim-di-respons-api
category: api
type: studi-kasus
level: menengah
published: false
excerpt: "return $user; terlihat praktis, sampai kamu sadar semua kolomnya ikut keluar. Pakai API Resource dan lindungi dari mass assignment."
goal: "Respons API hanya berisi kolom yang memang boleh dilihat, dan input hanya mengubah kolom yang diizinkan."
benefits: "Mencegah kebocoran data dan eskalasi hak akses."
challenges: "Masalah tidak terlihat saat pengembangan karena tampilannya tetap 'berfungsi'."
tags: [laravel, api, keamanan, eloquent]
links:
  - label: "Laravel: API Resources"
    url: "https://laravel.com/docs/eloquent-resources"
  - label: "Laravel: Mass Assignment"
    url: "https://laravel.com/docs/eloquent#mass-assignment"
---

> 📸 **TODO (isi dengan bukti milikmu):** respons JSON sebelum perbaikan yang berisi kolom berlebih (sensor nilai sensitif) dan sesudahnya.

## Masalah 1: respons berlebih

```php
public function show(User $user) {
    return $user;   // semua atribut (selain $hidden) ikut terkirim
}
```

Kolom internal seperti `is_admin`, `no_telepon`, `catatan_internal`, atau token bisa ikut keluar.

## Perbaikan: API Resource

```php
class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'    => $this->id,
            'nama'  => $this->nama,
            'email' => $this->when($request->user()?->can('lihat-email', $this->resource), $this->email),
        ];
    }
}

public function show(User $user) {
    return new UserResource($user);
}
```

Dengan allowlist eksplisit, kolom baru di tabel tidak otomatis ikut terekspos.

## Masalah 2: mass assignment

```php
$user->update($request->all());   // pengguna bisa mengirim is_admin=1
```

Perbaikan:

```php
// Model
protected $fillable = ['nama', 'email'];

// Controller: gunakan data tervalidasi
$user->update($request->validated());
```

## Masalah 3: otorisasi per objek

Pastikan pengguna berhak atas **objek tertentu**, bukan hanya sudah login (Policy/Gate: `$this->authorize('view', $user)`).

## Uji

Bandingkan JSON respons dengan daftar kolom yang seharusnya publik. Tulis tes yang menegaskan kolom sensitif **tidak ada** dalam respons.
