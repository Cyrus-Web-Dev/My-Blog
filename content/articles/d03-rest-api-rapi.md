---
title: "Merancang REST API yang Rapi: Versioning, Error, dan Pagination"
slug: merancang-rest-api-rapi-versioning-error-pagination
category: api
type: deep-dive
level: mahir
published: true
date: 2026-10-07
excerpt: "API yang konsisten membuat penggunanya (termasuk dirimu sendiri) hemat waktu. Berikut prinsip desain yang praktis."
goal: "Memberi pedoman perancangan REST API yang konsisten, aman, dan mudah dirawat."
benefits: "Integrasi lebih mudah, bug lebih sedikit, dan perubahan di masa depan tidak merusak klien lama."
challenges: "Tidak ada standar tunggal; banyak keputusan adalah kompromi yang harus dijaga konsisten."
tags: [rest, api, desain, backend]
links:
  - label: "RFC 9110: HTTP Semantics"
    url: "https://www.rfc-editor.org/rfc/rfc9110"
  - label: "RFC 9457: Problem Details for HTTP APIs"
    url: "https://www.rfc-editor.org/rfc/rfc9457"
  - label: "OpenAPI Specification"
    url: "https://spec.openapis.org/oas/latest.html"
---

## 1. Resource dan penamaan

Gunakan kata benda jamak untuk koleksi, dan biarkan metode HTTP menyatakan aksinya.

```
GET    /api/v1/pengadaan          daftar
POST   /api/v1/pengadaan          buat
GET    /api/v1/pengadaan/42       detail
PATCH  /api/v1/pengadaan/42       ubah sebagian
DELETE /api/v1/pengadaan/42       hapus
GET    /api/v1/pengadaan/42/items relasi
```

Hindari `/getPengadaan` atau `/hapusPengadaan`. Untuk aksi yang bukan CRUD murni, buat sub-resource: `POST /pengadaan/42/persetujuan`.

## 2. Metode dan sifatnya

- `GET`: aman, tidak mengubah data.
- `PUT`/`DELETE`: idempoten (mengulang tidak mengubah hasil akhir).
- `POST`: membuat atau memicu aksi; tidak idempoten secara bawaan.

## 3. Kode status yang tepat

| Kode | Arti |
|---|---|
| 200 / 201 / 204 | Berhasil / dibuat / berhasil tanpa isi |
| 400 | Permintaan salah bentuk |
| 401 | Belum terautentikasi |
| 403 | Terautentikasi tetapi tidak berhak |
| 404 | Tidak ditemukan |
| 409 | Konflik (mis. data ganda, versi bentrok) |
| 422 | Validasi gagal |
| 429 | Terlalu banyak permintaan |
| 5xx | Kesalahan server |

Jangan mengembalikan `200` dengan isi `{"error": ...}`; klien dan alat pemantau mengandalkan kode status.

## 4. Format error yang konsisten

Gunakan satu bentuk untuk semua error. RFC 9457 (*Problem Details*) adalah acuan standar:

```json
{
  "type": "https://api.contoh.com/errors/validasi",
  "title": "Validasi gagal",
  "status": 422,
  "detail": "Beberapa field tidak valid.",
  "errors": { "email": ["Format email tidak valid"] }
}
```

Jangan membocorkan stack trace atau detail internal di production.

## 5. Pagination

**Offset (page/limit)** sederhana dan cocok untuk data kecil-menengah:

```
GET /pengadaan?page=2&per_page=20
```

Kelemahannya: lambat pada offset besar dan hasil bisa bergeser bila ada data baru. **Cursor** lebih stabil untuk data besar atau feed:

```
GET /pengadaan?limit=20&cursor=eyJpZCI6NDJ9
```

Sertakan metadata (total, halaman berikutnya) secara konsisten:

```json
{ "data": [], "meta": { "per_page": 20, "next_cursor": "eyJpZCI6NjJ9" } }
```

## 6. Filter, sort, pencarian

```
GET /pengadaan?status=disetujui&sort=-created_at&q=laptop
```

Whitelist kolom yang boleh difilter dan diurutkan. Jangan meneruskan input mentah ke query.

## 7. Versioning

Cara paling mudah dipahami adalah prefiks URL (`/v1/`). Buat versi baru hanya untuk perubahan yang **merusak** klien lama (menghapus field, mengubah makna). Menambah field baru yang opsional biasanya aman tanpa versi baru. Umumkan jadwal penghentian versi lama.

## 8. Idempotensi untuk operasi penting

Untuk pembayaran atau pembuatan transaksi, dukung header `Idempotency-Key` agar pengulangan request (karena timeout) tidak membuat data ganda.

## 9. Keamanan dasar

- Otentikasi di setiap endpoint non-publik; **otorisasi per objek** (apakah pengguna ini boleh mengakses ID 42?).
- Rate limiting dengan `429` dan header `Retry-After`.
- Validasi dan batasi ukuran input.
- HTTPS saja; CORS dibatasi ke origin yang dikenal.

## 10. Dokumentasi

Tulis spesifikasi dengan **OpenAPI**. Dari situ kamu bisa membuat dokumentasi interaktif, klien otomatis, dan tes kontrak. Dokumentasi yang selalu cocok dengan kode lebih bernilai daripada dokumentasi panjang yang basi.

## Daftar periksa

- [ ] Nama resource konsisten (jamak, huruf kecil).
- [ ] Status code tepat, error seragam.
- [ ] Pagination dan batas maksimum `limit`.
- [ ] Versi API jelas.
- [ ] Otorisasi per objek diuji.
- [ ] Spesifikasi OpenAPI terbarui.

> 📸 **TODO (opsional):** tambahkan screenshot dokumentasi OpenAPI atau koleksi request API milikmu.
