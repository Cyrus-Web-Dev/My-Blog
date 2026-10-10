---
title: "HTTPS, TLS, dan Sertifikat: Yang Perlu Dipahami Developer"
slug: https-tls-dan-sertifikat-untuk-developer
category: backend
type: panduan
level: menengah
published: true
excerpt: "Gembok di browser itu bukan hiasan. Ia berarti koneksi terenkripsi dan identitas server terverifikasi."
goal: "Memahami cara kerja HTTPS dan mengaktifkannya dengan benar."
benefits: "Data pengguna terlindungi dan situs tidak ditandai 'tidak aman'."
tags: [https, tls, keamanan, server]
links:
  - label: "MDN: Transport Layer Security"
    url: "https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security"
  - label: "Let's Encrypt"
    url: "https://letsencrypt.org/getting-started/"
---

## Apa yang diberikan HTTPS

1. **Kerahasiaan**: isi komunikasi dienkripsi.
2. **Integritas**: data tidak bisa diubah di tengah jalan tanpa ketahuan.
3. **Autentikasi**: sertifikat membuktikan kamu benar-benar berbicara dengan domain tersebut.

## Ringkasan jabat tangan TLS

Browser dan server menyepakati versi dan algoritma, server menunjukkan **sertifikat** yang ditandatangani otoritas tepercaya (CA), lalu keduanya menurunkan kunci sesi untuk mengenkripsi data selanjutnya.

## Mengaktifkan dengan sertifikat gratis

Let's Encrypt menerbitkan sertifikat gratis. Dengan Nginx dan Certbot (periksa petunjuk resmi untuk perintah terbaru):

```bash
sudo certbot --nginx -d contoh.com -d www.contoh.com
```

Sertifikat berumur pendek dan diperbarui otomatis; pastikan jadwal pembaruan berjalan (`sudo certbot renew --dry-run`).

## Praktik pendukung

- **Alihkan HTTP ke HTTPS** (redirect 301).
- **HSTS** (`Strict-Transport-Security`) menyuruh browser selalu memakai HTTPS. Aktifkan setelah yakin HTTPS stabil.
- Tandai cookie sesi dengan `Secure`.
- Hindari **mixed content**: halaman HTTPS yang memuat gambar/skrip lewat `http://` akan diblokir atau diberi peringatan.

## Masalah umum

- **Peringatan sertifikat**: kedaluwarsa, domain tidak cocok, atau rantai sertifikat tidak lengkap.
- **Pembaruan gagal**: port 80 diblokir firewall, atau DNS belum mengarah ke server.
- Di lokal, gunakan alat seperti `mkcert` bila butuh HTTPS untuk pengembangan.
