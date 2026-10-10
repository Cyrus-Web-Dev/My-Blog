---
title: "Membaca Pesan Error dan Stack Trace Tanpa Panik"
slug: membaca-pesan-error-dan-stack-trace
category: backend
type: panduan
level: pemula
published: true
excerpt: "Pesan error adalah petunjuk gratis. Belajar membacanya adalah keterampilan debugging paling murah dan paling berdampak."
goal: "Mampu mengekstrak informasi penting dari error dan stack trace."
benefits: "Menemukan baris penyebab dalam hitungan detik dan mencari solusi dengan kata kunci yang tepat."
tags: [debugging, error, stack-trace, pemula]
links:
  - label: "MDN: JavaScript error reference"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors"
---

## Anatomi error

```
TypeError: Cannot read properties of undefined (reading 'nama')
    at tampilkanUser (src/user.js:12:20)
    at renderHalaman (src/halaman.js:40:5)
    at main (src/index.js:8:3)
```

1. **Jenis dan pesan**: `TypeError`, "tidak bisa membaca properti `nama` dari `undefined`".
2. **Stack trace**: urutan pemanggilan, dari yang paling dekat dengan error di atas.
3. **Lokasi**: berkas, baris, kolom.

## Cara membaca

- Mulai dari pesan, **bukan** dari tumpukan teks panjang.
- Cari **baris pertama yang berasal dari kodemu** (bukan dari `node_modules` atau framework). Itu tempat mulai memeriksa.
- Pesan di atas berarti variabel di depan `.nama` bernilai `undefined`. Pertanyaannya: **mengapa nilainya kosong?** Datanya belum dimuat, salah nama properti, atau respons API berbeda dari dugaan.

## Error umum dan arti cepatnya

| Pesan | Biasanya |
|---|---|
| `Cannot read properties of undefined/null` | Data belum ada / salah path |
| `X is not a function` | Salah nama, salah impor, atau tipe bukan fungsi |
| `X is not defined` | Variabel belum dideklarasikan / lupa impor |
| `Unexpected token < in JSON` | Mengharapkan JSON, tapi server mengirim HTML (halaman error) |
| `Module not found` | Salah jalur impor atau paket belum dipasang |
| `ECONNREFUSED` | Server tujuan tidak berjalan / port salah |

## Mencari solusi

Salin **pesan error yang tepat** (tanpa path pribadi) ke mesin pencari, tambahkan nama teknologi dan versi. Baca juga isu di GitHub resmi; sering ada penjelasan penyebab sebenarnya.
