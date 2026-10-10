---
title: "GraphQL vs REST: Perbedaan, Kelebihan, dan Kapan Memilih"
slug: graphql-vs-rest-perbedaan-dan-pilihan
category: api
type: panduan
level: menengah
published: true
excerpt: "GraphQL bukan pengganti REST, melainkan alat dengan kekuatan dan harga berbeda."
goal: "Memahami konsep inti GraphQL dan menimbang pemakaiannya."
benefits: "Keputusan teknologi API yang lebih tepat."
tags: [graphql, rest, api, arsitektur]
links:
  - label: "GraphQL: Learn"
    url: "https://graphql.org/learn/"
---

## REST singkatnya

Banyak endpoint, tiap endpoint mengembalikan bentuk data tetap. Masalah umum: *over-fetching* (data terlalu banyak) dan *under-fetching* (butuh beberapa request untuk satu layar).

## GraphQL

Satu endpoint; client **menyebut persis field** yang dibutuhkan.

```graphql
query {
  pengadaan(id: 42) {
    nomor
    supplier { nama }
    items { barang { nama } jumlah }
  }
}
```

Respons mengikuti bentuk query. Sistem tipe (skema) mendeskripsikan semua data dan operasinya, termasuk **mutation** untuk mengubah data.

## Perbandingan

| | REST | GraphQL |
|---|---|---|
| Bentuk respons | Ditentukan server | Ditentukan client |
| Jumlah request per layar | Bisa banyak | Sering satu |
| Caching HTTP | Mudah (URL + GET) | Lebih rumit |
| Kurva belajar | Rendah | Lebih tinggi |
| Dokumentasi | OpenAPI | Skema introspeksi |
| Risiko khas | Over/under-fetching | Query mahal/bersarang dalam |

## Kewaspadaan GraphQL

- **Batasi kedalaman dan kompleksitas query** agar tidak menjadi vektor DoS.
- Masalah **N+1** di resolver; pakai batching (mis. DataLoader).
- **Otorisasi per field/objek** tetap wajib.
- Pertimbangkan monitoring per operasi karena semua lewat satu URL.

## Kapan memilih

- **REST**: API publik sederhana, CRUD, caching HTTP penting, tim kecil.
- **GraphQL**: banyak klien berbeda (web, mobile) dengan kebutuhan data beragam, data sangat berelasi, tim siap mengelola kompleksitasnya.

Keduanya bisa hidup berdampingan; mulai dari yang paling sederhana yang memenuhi kebutuhan.
