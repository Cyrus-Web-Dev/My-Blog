---
title: "Memahami Status Code HTTP yang Paling Sering Muncul"
slug: memahami-status-code-http-paling-sering-muncul
category: api
type: panduan
level: pemula
published: true
excerpt: "Angka tiga digit itu petunjuk diagnosis. Ketahui artinya dan kamu menghemat banyak waktu debugging."
goal: "Menerjemahkan status code menjadi langkah pemeriksaan konkret."
benefits: "Cepat membedakan salah di client, salah di server, atau salah konfigurasi."
tags: [http, api, debugging]
links:
  - label: "MDN: HTTP response status codes"
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status"
---

## Keluarga kode

- **2xx**: berhasil.
- **3xx**: pengalihan.
- **4xx**: kesalahan di sisi **permintaan** (client).
- **5xx**: kesalahan di sisi **server**.

## Yang paling sering

| Kode | Arti | Pertama kali dicek |
|---|---|---|
| 200 OK | Berhasil | |
| 201 Created | Data dibuat | |
| 204 No Content | Berhasil tanpa isi | |
| 301/302 | Pindah permanen/sementara | Redirect loop? |
| 304 | Tidak berubah (cache) | Normal |
| 400 | Permintaan salah bentuk | Body/JSON/parameter |
| 401 | Belum login / token salah | Header Authorization |
| 403 | Login tapi tidak berhak | Izin/peran |
| 404 | Tidak ditemukan | URL, ID, route |
| 405 | Metode tidak diizinkan | GET vs POST |
| 409 | Konflik | Data ganda |
| 422 | Validasi gagal | Pesan validasi |
| 429 | Terlalu banyak request | Rate limit |
| 500 | Error di aplikasi | **Log server** |
| 502/504 | Gateway/upstream bermasalah | Proxy dan aplikasi di belakangnya |
| 503 | Layanan tidak tersedia | Server mati/maintenance |

## Aturan praktis

4xx: perbaiki **request**. 5xx: baca **log server**. Jangan menebak dari tampilan browser; lihat status di tab Network.
