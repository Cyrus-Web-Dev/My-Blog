---
title: "Apa Itu API dan REST? Penjelasan untuk Pemula"
slug: apa-itu-api-dan-rest-untuk-pemula
category: api
type: panduan
level: pemula
published: true
excerpt: "API adalah pelayan restoran: kamu memesan lewat menu, dapur (sistem) menyiapkan, pelayan mengantar hasilnya."
goal: "Memahami konsep API, REST, dan cara mencobanya."
benefits: "Siap menghubungkan frontend dengan backend atau memakai API pihak ketiga."
tags: [api, rest, pemula, dasar]
links:
  - label: "MDN: Introduction to web APIs"
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Web_APIs"
  - label: "OpenAPI Initiative"
    url: "https://www.openapis.org"
---

## Analogi

Kamu (client) tidak masuk dapur. Kamu memesan lewat pelayan (API) memakai menu (dokumentasi), dan menerima hasilnya. Dapur boleh berubah isi, selama menunya tetap.

## REST secara singkat

REST adalah gaya merancang API web memakai:

- **Resource** sebagai kata benda pada URL: `/api/pelanggan`, `/api/pelanggan/5`.
- **Metode HTTP** sebagai aksi: GET, POST, PUT/PATCH, DELETE.
- **Format data** umumnya JSON.
- **Tanpa state** di server antar-request: setiap request membawa informasi yang dibutuhkan (mis. token).

## Pemetaan CRUD

| Aksi | Metode + URL |
|---|---|
| Daftar | `GET /api/pelanggan` |
| Detail | `GET /api/pelanggan/5` |
| Buat | `POST /api/pelanggan` |
| Ubah | `PATCH /api/pelanggan/5` |
| Hapus | `DELETE /api/pelanggan/5` |

## Coba langsung

```bash
curl https://jsonplaceholder.typicode.com/posts/1
```

Dan di JavaScript:

```js
const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
const data = await res.json();
console.log(data.title);
```

## Langkah berikutnya

Buat API kecil sendiri (daftar tugas) dengan Express, Laravel, atau Next.js Route Handler, lalu panggil dari halaman HTML sederhana. Mengalami sendiri alurnya jauh lebih membantu daripada membaca definisi.
