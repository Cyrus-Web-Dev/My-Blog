---
title: "Bagaimana Internet Bekerja: Dari Mengetik URL sampai Halaman Tampil"
slug: bagaimana-internet-bekerja-dari-url-sampai-halaman
category: backend
type: panduan
level: pemula
published: true
excerpt: "Apa yang terjadi dalam beberapa ratus milidetik setelah kamu menekan Enter di browser? Ini perjalanan lengkapnya."
goal: "Memahami alur dasar web agar lebih mudah mendiagnosis masalah."
benefits: "Saat ada error, kamu tahu harus mencurigai tahap yang mana."
tags: [dasar, http, dns, pemula]
links:
  - label: "MDN: How the web works"
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_Web_works"
  - label: "MDN: DNS"
    url: "https://developer.mozilla.org/en-US/docs/Glossary/DNS"
---

Saat kamu membuka `https://contoh.com/artikel`:

1. **DNS**: browser menanyakan "alamat IP dari contoh.com?" ke server DNS, yang menjawab misalnya `203.0.113.10`.
2. **Koneksi**: browser membuka koneksi TCP ke alamat itu.
3. **TLS** (untuk HTTPS): kedua pihak bernegosiasi enkripsi dan server menunjukkan sertifikatnya.
4. **HTTP request**: browser mengirim `GET /artikel` beserta header.
5. **Server memproses**: web server meneruskan ke aplikasi, aplikasi mungkin membaca database, lalu menyusun respons.
6. **HTTP response**: server membalas dengan status (mis. 200) dan isi (HTML).
7. **Render**: browser membaca HTML, memuat CSS, JavaScript, dan gambar (masing-masing request tambahan), lalu menggambar halaman.

## Mengapa ini berguna

| Gejala | Tahap yang dicurigai |
|---|---|
| "Server not found" | DNS |
| Peringatan sertifikat | TLS |
| 404 / 500 | Aplikasi di server |
| Halaman putih, error di Console | Render / JavaScript |
| Lambat | Bisa di mana saja; cek tab Network |

Buka DevTools → tab **Network** untuk melihat setiap request, statusnya, dan waktunya.
