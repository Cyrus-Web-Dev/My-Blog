---
title: "Logging yang Berguna: Apa, Kapan, dan Bagaimana Mencatat"
slug: logging-yang-berguna
category: backend
type: panduan
level: pemula
published: true
excerpt: "Log adalah mata kamu di production. Log yang buruk membuatmu buta, log berlebihan membuatmu tenggelam."
goal: "Menulis log yang membantu menelusuri masalah tanpa membocorkan data."
benefits: "Debugging di production jauh lebih cepat."
tags: [logging, debugging, backend, dasar]
links:
  - label: "OWASP Logging Cheat Sheet"
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"
---

## Level log

- `error`: sesuatu gagal dan butuh perhatian.
- `warn`: anomali yang belum merusak.
- `info`: peristiwa bisnis penting (pesanan dibuat, pembayaran diterima).
- `debug`: detail untuk pengembangan; biasanya mati di production.

## Yang perlu dicatat

- **Konteks**: ID pengguna (bukan data pribadi), ID pesanan, ID request.
- **Apa yang dilakukan dan hasilnya** (sukses/gagal, durasi).
- **Error beserta stack trace**.

```js
logger.error({ err, pesananId, requestId }, "Gagal memproses pembayaran");
```

## Yang TIDAK boleh dicatat

Password, token, kunci API, nomor kartu, isi data pribadi sensitif. Lakukan *masking* bila perlu.

## Praktik baik

1. **Format terstruktur (JSON)** agar mudah dicari.
2. **Satu ID request** di semua log untuk satu permintaan.
3. **Jangan menelan error** (`catch {}` kosong). Catat atau teruskan.
4. **Jangan mencatat berlebihan** di loop panas; biaya dan kebisingan naik.
5. **Atur rotasi dan retensi** agar disk tidak penuh.
6. Pisahkan log aplikasi dari log akses.

## Di Laravel

```php
Log::warning('Stok hampir habis', ['barang_id' => $id, 'sisa' => $sisa]);
```

Konfigurasi saluran di `config/logging.php`; di production, kirim ke layanan terpusat atau stderr untuk dikumpulkan.

## Kebiasaan

Saat memperbaiki bug yang sulit dilacak, tambahkan log yang akan membuat bug serupa mudah ditemukan berikutnya.
