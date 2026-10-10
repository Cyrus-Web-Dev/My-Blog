---
title: "Implementasi 2FA di Laravel: Kode Selalu Salah karena Jam Server"
slug: implementasi-2fa-laravel-jam-server
category: backend
type: studi-kasus
level: menengah
published: false
date: 2026-09-17
excerpt: "Kode TOTP dari aplikasi autentikator terus ditolak. Biasanya bukan kode yang salah, tapi waktu yang tidak sinkron."
goal: "Autentikasi dua faktor TOTP yang stabil dan aman."
benefits: "Akun lebih terlindungi walau password bocor."
challenges: "TOTP bergantung pada waktu; selisih beberapa puluh detik saja membuat kode tidak valid."
tags: [2fa, totp, laravel, keamanan]
links:
  - label: "RFC 6238 (TOTP)"
    url: "https://datatracker.ietf.org/doc/html/rfc6238"
  - label: "PragmaRX Google2FA"
    url: "https://github.com/antonioribeiro/google2fa"
---

> 📸 **TODO (isi dengan bukti milikmu):** screenshot pesan "kode salah", keluaran `date` di server vs jam ponsel, dan halaman setup QR yang berhasil (sensor secret).

## Cara kerja singkat

TOTP menghitung kode dari **secret bersama** dan **waktu saat ini** (dibagi per 30 detik). Server dan aplikasi autentikator harus punya pandangan waktu yang hampir sama.

## Gejala dan penyebab

Kode valid di ponsel, tetapi ditolak server. Penyebab tersering:

1. **Jam server melenceng** (VM atau kontainer tanpa sinkronisasi waktu).
2. Jam ponsel tidak otomatis.
3. Pengguna mengetik tepat saat kode berganti.

Zona waktu **bukan** penyebabnya: TOTP memakai waktu epoch (UTC), jadi yang penting adalah ketepatan jam, bukan zona.

## Perbaikan

Pastikan server tersinkron NTP (di Ubuntu: `timedatectl` menampilkan `System clock synchronized: yes`). Lalu toleransi sedikit selisih saat verifikasi:

```php
use PragmaRX\Google2FA\Google2FA;

$google2fa = new Google2FA();

// Jendela 1 = menerima kode periode sebelum dan sesudahnya
$valid = $google2fa->verifyKey(
    Crypt::decryptString($user->two_factor_secret),
    $request->input('code'),
    1
);
```

## Praktik keamanan penting

- Simpan secret **terenkripsi**, jangan teks biasa.
- Berikan **kode pemulihan** sekali pakai, simpan dalam bentuk hash.
- Batasi percobaan (rate limit) pada endpoint verifikasi agar tidak bisa ditebak.
- Cegah pemakaian ulang kode yang sama dalam periode yang sama.
