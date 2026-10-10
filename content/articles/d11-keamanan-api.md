---
title: "Keamanan API: Threat Modeling dan Daftar Periksa Lengkap"
slug: keamanan-api-threat-modeling-daftar-periksa
category: api
type: deep-dive
level: mahir
published: true
excerpt: "API adalah pintu masuk utama ke datamu. Bayangkan seperti penyerang dulu, baru pasang kunci di tempat yang benar."
goal: "Memberi cara berpikir dan daftar periksa untuk mengamankan API."
benefits: "Menutup kelas celah yang paling sering menyebabkan kebocoran data."
challenges: "Daftar risiko OWASP API Security Top 10 diperbarui berkala; cek edisi terbaru."
tags: [api, keamanan, owasp, threat-modeling]
links:
  - label: "OWASP API Security Project"
    url: "https://owasp.org/www-project-api-security/"
  - label: "OWASP REST Security Cheat Sheet"
    url: "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html"
---

## Threat modeling singkat

Sebelum menulis kontrol keamanan, jawab empat pertanyaan:

1. **Apa yang kita lindungi?** (data pribadi, transaksi, akses admin)
2. **Siapa penyerangnya?** (pengguna iseng, pengguna sah yang curang, pihak luar, orang dalam)
3. **Bagaimana mereka bisa menyerang?** Gambar alur data dan titik masuk. Kerangka **STRIDE** membantu: *Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege*.
4. **Apa kontrolnya dan apa risiko sisanya?**

## Risiko utama (mengacu OWASP API Security Top 10, edisi 2023)

| Risiko | Contoh | Pertahanan |
|---|---|---|
| **Broken Object Level Authorization (BOLA)** | `GET /pesanan/123` bisa dibuka milik orang lain | Cek kepemilikan/izin **per objek** pada setiap endpoint |
| **Broken Authentication** | Login tanpa rate limit, token lemah | Rate limit, token berumur pendek, 2FA, validasi JWT ketat |
| **Broken Object Property Level Authorization** | Respons membocorkan atau menerima field berlebih (mass assignment) | Allowlist field di input dan output |
| **Unrestricted Resource Consumption** | Tanpa batas ukuran/jumlah → DoS atau biaya membengkak | Rate limit, batas ukuran, pagination wajib, timeout |
| **Broken Function Level Authorization** | Pengguna biasa memanggil endpoint admin | Otorisasi berbasis peran per fungsi |
| **Unrestricted Access to Sensitive Business Flows** | Otomatisasi penyalahgunaan (borong tiket, spam daftar) | Deteksi bot, batas per akun/IP, langkah tambahan |
| **SSRF** | API mengambil URL dari pengguna → memanggil jaringan internal | Allowlist tujuan, blokir alamat privat |
| **Security Misconfiguration** | CORS terlalu longgar, debug aktif, header hilang | Konfigurasi aman sebagai kode, tinjau berkala |
| **Improper Inventory Management** | Versi lama atau endpoint lupa masih terbuka | Inventaris API, matikan versi usang |
| **Unsafe Consumption of APIs** | Mempercayai respons API pihak ketiga begitu saja | Validasi data dari pihak ketiga seperti input pengguna |

## Prinsip desain yang melandasi

- **Default tolak.** Izinkan secara eksplisit.
- **Hak akses minimum** untuk pengguna, layanan, dan kredensial database.
- **Pertahanan berlapis**: jangan bergantung pada satu kontrol.
- **Validasi semua input**, termasuk header dan parameter query.
- **Jangan percaya klien**: harga, peran, dan ID pemilik ditentukan server.

## Detail implementasi penting

- **Transport**: HTTPS saja; HSTS.
- **Autentikasi**: simpan rahasia dan kunci API di luar kode; rotasi berkala; kunci API per klien yang bisa dicabut.
- **Otorisasi**: pusatkan logika (policy/middleware), jangan tersebar tak seragam.
- **Rate limiting**: per pengguna/kunci dan per IP, balas `429` dengan `Retry-After`.
- **Input**: batasi ukuran body, validasi skema (OpenAPI/JSON Schema), tolak field tak dikenal bila sesuai.
- **Output**: kembalikan hanya field yang perlu; error umum tanpa stack trace.
- **CORS**: allowlist origin eksplisit; hindari `*` bersama kredensial.
- **Logging**: catat autentikasi, penolakan akses, dan aksi sensitif (tanpa menyimpan rahasia); pantau anomali.
- **Webhook masuk**: verifikasi tanda tangan HMAC dan cap waktu.
- **Dependensi**: pindai kerentanan dan perbarui.

## Uji

- Uji otorisasi dengan **dua akun**: apakah akun A bisa membaca/mengubah data akun B? (BOLA)
- Uji dengan input aneh, terlalu besar, dan tipe salah.
- Lakukan peninjauan keamanan berkala dan, untuk sistem penting, uji penetrasi oleh pihak berwenang.

## Daftar periksa

- [ ] Setiap endpoint punya otorisasi per objek dan per fungsi.
- [ ] Rate limit dan batas ukuran/pagination aktif.
- [ ] Input divalidasi, output difilter dengan allowlist.
- [ ] HTTPS, CORS ketat, tanpa debug di production.
- [ ] Rahasia terkelola dan bisa dirotasi.
- [ ] Log dan peringatan untuk kejadian keamanan.
- [ ] Inventaris endpoint dan versi lama dimatikan.
