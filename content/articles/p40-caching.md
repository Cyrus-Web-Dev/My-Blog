---
title: "Caching: Dari Cache Browser sampai Redis"
slug: caching-dari-browser-sampai-redis
category: backend
type: panduan
level: menengah
published: true
excerpt: "Cara tercepat membuat sesuatu cepat adalah tidak mengerjakannya lagi. Tapi cache punya harga: data bisa basi."
goal: "Memahami lapisan cache dan memilih strategi yang tepat."
benefits: "Respons lebih cepat dan beban server lebih ringan."
challenges: "Membatalkan cache (invalidation) terkenal sebagai salah satu masalah tersulit."
tags: [caching, performa, redis, http]
links:
  - label: "MDN: HTTP caching"
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching"
  - label: "Redis documentation"
    url: "https://redis.io/docs/"
---

## Lapisan cache

1. **Browser**: menyimpan berkas statis dan respons sesuai header.
2. **CDN**: menyimpan salinan di dekat pengguna.
3. **Aplikasi**: hasil perhitungan atau query mahal (sering di Redis atau memori).
4. **Database**: cache internal dan *materialized view*.

## Header HTTP yang penting

```
Cache-Control: public, max-age=31536000, immutable   # aset ber-hash (app.3f9a1c.js)
Cache-Control: no-store                               # data sensitif
Cache-Control: no-cache                               # boleh simpan, tapi cek validitas dulu
ETag: "abc123"                                        # validator untuk cek perubahan
```

Strategi umum: aset statis diberi nama berhash dan cache panjang; HTML cache pendek atau divalidasi ulang.

## Cache aplikasi: pola cache-aside

```js
async function ambilProduk(id) {
  const kunci = `produk:${id}`;
  const tersimpan = await redis.get(kunci);
  if (tersimpan) return JSON.parse(tersimpan);

  const produk = await db.produk.cari(id);
  await redis.set(kunci, JSON.stringify(produk), { EX: 300 }); // kedaluwarsa 5 menit
  return produk;
}
```

Saat data berubah, **hapus atau perbarui** kuncinya.

## Strategi kedaluwarsa

- **TTL**: otomatis habis setelah waktu tertentu (sederhana, menerima sedikit kebasian).
- **Invalidasi eksplisit**: hapus saat data berubah (lebih akurat, lebih rumit).

## Jebakan

- Menyimpan data **per pengguna** pada cache bersama tanpa memasukkan identitas ke kunci, sehingga pengguna A melihat data pengguna B. Ini bocor data serius.
- Cache tanpa batas hidup sehingga data lama bertahan.
- *Cache stampede*: banyak request menghitung ulang bersamaan saat cache habis.
- Mengoptimalkan sebelum mengukur. Pastikan dulu bagian itu memang lambat.
