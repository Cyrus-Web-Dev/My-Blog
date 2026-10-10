---
title: "Rate Limiting: Melindungi API dari Penyalahgunaan"
slug: rate-limiting-melindungi-api
category: api
type: panduan
level: menengah
published: true
excerpt: "Tanpa batas, satu klien nakal atau skrip yang salah bisa melumpuhkan layananmu. Rate limiting adalah pagar dasarnya."
goal: "Memahami algoritma umum dan menerapkan batas dengan respons yang benar."
benefits: "Layanan stabil dan lebih tahan terhadap brute force serta penyalahgunaan."
tags: [api, rate-limit, keamanan, redis]
links:
  - label: "MDN: 429 Too Many Requests"
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429"
  - label: "Laravel: Rate Limiting"
    url: "https://laravel.com/docs/rate-limiting"
---

## Mengapa

- Mencegah **brute force** pada login dan reset password.
- Melindungi sumber daya dari lonjakan atau skrip bermasalah.
- Mengendalikan biaya API pihak ketiga yang kamu panggil.

## Algoritma umum

- **Fixed window**: maksimum N request per jendela waktu tetap. Sederhana, tetapi bisa meledak di batas jendela.
- **Sliding window**: lebih halus, menghitung dalam jendela bergulir.
- **Token bucket**: ember berisi token yang terisi pelan; tiap request memakai satu. Mengizinkan lonjakan kecil.

## Siapa yang dibatasi

Per **pengguna/kunci API** (lebih adil) dan per **IP** (untuk anonim). Hati-hati: banyak pengguna bisa berbagi satu IP (kantor, NAT).

## Respons yang benar

```
HTTP/1.1 429 Too Many Requests
Retry-After: 30
Content-Type: application/json

{"error":"Terlalu banyak permintaan. Coba lagi dalam 30 detik."}
```

Sertakan `Retry-After` agar klien tahu kapan mencoba lagi.

## Contoh Laravel

```php
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});

Route::middleware('throttle:api')->group(function () { /* ... */ });
```

## Praktik yang baik

- Batas **lebih ketat** untuk endpoint sensitif (login, reset password, kirim OTP).
- Simpan hitungan di penyimpanan bersama (Redis) bila ada banyak instance server.
- Klien harus menghormati 429 dengan backoff, bukan mengulang tanpa jeda.
- Pantau jumlah 429; lonjakan bisa berarti serangan atau bug klien.
