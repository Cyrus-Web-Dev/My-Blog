---
title: "Dasar Keamanan Web: Ringkasan OWASP Top 10 untuk Developer"
slug: dasar-keamanan-web-ringkasan-owasp-top-10
category: backend
type: panduan
level: pemula
published: true
excerpt: "OWASP Top 10 adalah daftar risiko keamanan aplikasi web yang paling kritis. Ini ringkasan yang bisa langsung dipraktikkan."
goal: "Mengenal kategori risiko utama dan satu langkah pencegahan praktis untuk tiap kategori."
benefits: "Menutup celah yang paling sering dieksploitasi sejak awal pengembangan."
challenges: "Daftar diperbarui berkala; cek edisi terbaru di situs OWASP."
tags: [keamanan, owasp, backend, dasar]
links:
  - label: "OWASP Top 10"
    url: "https://owasp.org/www-project-top-ten/"
  - label: "OWASP Cheat Sheet Series"
    url: "https://cheatsheetseries.owasp.org/"
---

> Ringkasan berikut mengikuti struktur edisi 2021. Edisi lebih baru dapat mengubah urutan atau nama kategori, jadi cek halaman resmi OWASP.

| Risiko | Intinya | Langkah praktis |
|---|---|---|
| **Broken Access Control** | Pengguna mengakses data/aksi yang bukan haknya | Cek otorisasi **per objek di server**, bukan hanya menyembunyikan tombol |
| **Cryptographic Failures** | Data sensitif tidak terlindungi | HTTPS, hash password yang benar, enkripsi data sensitif |
| **Injection** | Input diperlakukan sebagai perintah (SQL, OS, dll.) | Query berparameter, validasi input |
| **Insecure Design** | Kelemahan di rancangan | Pikirkan ancaman sejak desain |
| **Security Misconfiguration** | Pengaturan bawaan/debug terbuka | Matikan debug di production, hapus akun default |
| **Vulnerable & Outdated Components** | Pustaka usang berkerentanan | Perbarui dependensi, `npm audit` / `composer audit` |
| **Identification & Authentication Failures** | Login lemah | Rate limit, 2FA, sesi aman |
| **Software & Data Integrity Failures** | Kode/pembaruan tidak terverifikasi | Kunci dependensi, jaga pipeline CI/CD |
| **Security Logging & Monitoring Failures** | Serangan tak terdeteksi | Log kejadian penting dan pasang peringatan |
| **SSRF** | Server dipaksa memanggil alamat internal | Whitelist URL tujuan, jangan percaya URL dari pengguna |

## Tiga kebiasaan dengan dampak terbesar

1. **Jangan percaya input apa pun**: validasi dan escape.
2. **Otorisasi di server, di setiap request.**
3. **Perbarui dependensi dan jaga rahasia di luar kode.**

Mulailah dengan daftar periksa ini pada proyekmu sendiri; satu kategori per minggu sudah cukup untuk kemajuan nyata.
