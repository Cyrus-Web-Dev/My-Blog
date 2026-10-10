---
title: "CORS Error di REST API: Penyebab Sebenarnya dan Cara Memperbaikinya"
slug: cors-error-rest-api-penyebab-sebenarnya
category: api
type: studi-kasus
level: menengah
published: false
date: 2026-09-25
excerpt: "Konsol browser berteriak soal CORS padahal API-nya jalan di Postman. Ini karena CORS adalah aturan browser, bukan server."
goal: "Memahami CORS dan memperbaikinya dengan konfigurasi yang benar dan aman."
benefits: "Berhenti menebak-nebak dan berhenti memakai solusi asal seperti membuka semua origin."
challenges: "Pesan error browser sering menyesatkan, terutama bila sebenarnya server mengembalikan error 500."
tags: [cors, api, laravel, nextjs, browser]
links:
  - label: "MDN: CORS"
    url: "https://developer.mozilla.org/id/docs/Web/HTTP/CORS"
---

> 📸 **TODO (isi dengan bukti milikmu):** pesan error CORS di Console, tab Network yang menunjukkan request preflight `OPTIONS`, dan header respons sebelum/sesudah perbaikan.

## Intinya

CORS adalah mekanisme **browser**. Postman tidak peduli, browser peduli. Saat halaman di `app.contoh.com` memanggil API di `api.contoh.com`, browser meminta izin lewat header respons.

## Preflight

Untuk request tertentu (metode seperti `PUT`/`DELETE`, header `Authorization`, atau `Content-Type: application/json`), browser lebih dulu mengirim `OPTIONS`. Server harus menjawab dengan header seperti:

```
Access-Control-Allow-Origin: https://app.contoh.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Kesalahan umum

- `Access-Control-Allow-Origin: *` **tidak boleh** digabung dengan cookie/kredensial. Sebutkan origin secara spesifik dan aktifkan `Allow-Credentials`.
- Server membalas preflight dengan redirect atau 404/401.
- Error 500 di server membuat respons tanpa header CORS, jadi browser hanya menampilkan "CORS error". **Lihat status respons di tab Network** untuk memastikan.
- Origin salah ketik (`http` vs `https`, port berbeda).

## Laravel

```php
// config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['https://app.contoh.com'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

## Next.js (Route Handler)

```ts
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://app.contoh.com",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
```

Cara paling bersih sering kali menghindari lintas origin: biarkan frontend dan API berada di domain yang sama (atau lewat proxy), sehingga CORS tidak diperlukan.
