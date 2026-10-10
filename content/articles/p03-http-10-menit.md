---
title: "HTTP dalam 10 Menit: Request, Response, Metode, dan Header"
slug: http-dalam-10-menit-request-response-header
category: api
type: panduan
level: pemula
published: true
excerpt: "HTTP adalah bahasa antara browser dan server. Pahami anatominya dan kamu akan lebih mudah membaca API apa pun."
goal: "Menguasai bagian-bagian request dan response HTTP."
benefits: "Bisa membaca tab Network dan menguji API dengan percaya diri."
tags: [http, api, dasar]
links:
  - label: "MDN: HTTP"
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP"
  - label: "MDN: Metode HTTP"
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods"
---

## Anatomi request

```
POST /api/pengadaan HTTP/1.1
Host: contoh.com
Content-Type: application/json
Authorization: Bearer eyJ...

{"nama": "Laptop", "jumlah": 2}
```

Bagian: **baris awal** (metode, path), **header** (metadata), baris kosong, lalu **body** (opsional).

## Anatomi response

```
HTTP/1.1 201 Created
Content-Type: application/json

{"id": 42, "nama": "Laptop"}
```

## Metode utama

| Metode | Fungsi umum |
|---|---|
| GET | Mengambil data |
| POST | Membuat data / memicu aksi |
| PUT | Mengganti data seluruhnya |
| PATCH | Mengubah sebagian |
| DELETE | Menghapus |

## Header yang sering ditemui

- `Content-Type`: format body (`application/json`).
- `Authorization`: kredensial.
- `Accept`: format yang diinginkan.
- `Cache-Control`: aturan cache.
- `Set-Cookie` / `Cookie`: sesi.

## Coba sendiri

```bash
curl -i https://example.com
```

Flag `-i` menampilkan header respons. Latihan bagus: panggil sebuah API publik dan baca status serta header-nya.
