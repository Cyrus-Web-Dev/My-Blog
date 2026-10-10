---
title: "Autentikasi Web yang Benar: Session, JWT, 2FA, dan Kesalahan Umum"
slug: autentikasi-web-session-jwt-2fa-kesalahan-umum
category: backend
type: deep-dive
level: mahir
published: true
date: 2026-10-09
excerpt: "Autentikasi mudah dibuat tampak berfungsi, tetapi sulit dibuat benar-benar aman. Berikut peta konsep dan praktik yang layak diikuti."
goal: "Memahami pilihan autentikasi dan menghindari kesalahan keamanan yang paling umum."
benefits: "Akun pengguna lebih aman dan arsitektur login lebih mudah dirawat."
challenges: "Keamanan penuh trade-off; solusi yang cocok bergantung pada jenis aplikasi."
tags: [autentikasi, keamanan, jwt, session, 2fa]
links:
  - label: "OWASP Authentication Cheat Sheet"
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html"
  - label: "OWASP Session Management Cheat Sheet"
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html"
---

> Prinsip utama: **jangan membuat kriptografi dan alur login sendiri bila ada pustaka atau layanan mapan yang bisa dipakai** (framework bawaan, Supabase Auth, dan sejenisnya). Artikel ini membantu kamu memahami dan menilai, bukan menyuruh membangun dari nol.

## Autentikasi vs otorisasi

- **Autentikasi**: siapa kamu?
- **Otorisasi**: apa yang boleh kamu lakukan?

Banyak kebocoran data terjadi bukan karena login jebol, tetapi karena otorisasi lupa diperiksa per objek.

## Password

- Simpan **hash**, bukan password. Gunakan algoritma yang dirancang untuk password: **Argon2id** atau **bcrypt** (hash cepat seperti SHA-256 polos tidak cocok).
- Biarkan pustaka mengurus *salt*.
- Batasi percobaan login (rate limit) dan pertimbangkan penundaan bertahap.
- Pesan error umum ("email atau password salah") agar tidak membocorkan keberadaan akun.
- Dorong password panjang atau passphrase; cek terhadap daftar password bocor bila memungkinkan.

## Session berbasis cookie

Server menyimpan sesi dan memberi browser sebuah ID acak lewat cookie.

```
Set-Cookie: sid=...; HttpOnly; Secure; SameSite=Lax; Path=/
```

- `HttpOnly`: tidak bisa dibaca JavaScript (mengurangi dampak XSS).
- `Secure`: hanya lewat HTTPS.
- `SameSite`: membantu melawan CSRF.

Kelebihan: mudah dicabut (hapus sesi di server), matang, dan cocok untuk aplikasi web biasa. Kekurangan: butuh penyimpanan sesi dan perlu perhatian pada CSRF.

## JWT

JWT adalah token bertanda tangan yang membawa klaim. Cocok untuk skenario tanpa state di server atau antar-layanan.

Hal yang perlu waspada:

- **Sulit dicabut** sebelum kedaluwarsa. Gunakan masa berlaku **pendek** (menit) plus *refresh token*.
- Jangan menyimpan token sensitif di `localStorage` jika ada risiko XSS; cookie `HttpOnly` lebih aman.
- Verifikasi **algoritma dan penerbit** secara eksplisit; tolak token tanpa tanda tangan.
- Jangan menaruh data rahasia di payload; payload hanya di-encode, bukan dienkripsi.

> JWT bukan "lebih modern, jadi lebih baik". Untuk aplikasi web biasa dengan satu backend, sesi berbasis cookie sering lebih sederhana dan lebih mudah diamankan.

## Refresh token

Gunakan rotasi: setiap refresh menerbitkan token baru dan menggugurkan yang lama; bila token lama dipakai lagi, anggap terjadi pencurian dan cabut seluruh rangkaian sesi.

## CSRF dan XSS

- **CSRF**: situs lain membuat browser korban mengirim request dengan cookie-nya. Lawan dengan `SameSite`, token CSRF, dan pengecekan origin.
- **XSS**: skrip jahat berjalan di halamanmu. Lawan dengan *escaping* output (framework modern melakukannya otomatis), sanitasi HTML, dan Content Security Policy.

## Autentikasi dua faktor (2FA)

- **TOTP** (aplikasi autentikator): mudah dan gratis; waktu server harus akurat.
- **Passkey/WebAuthn**: tahan phishing dan semakin didukung luas.
- SMS lebih lemah (risiko SIM swap), tetapi lebih baik daripada tanpa 2FA bila tidak ada pilihan lain.
- Sediakan **kode pemulihan** sekali pakai (disimpan sebagai hash).

## OAuth/OIDC ("Masuk dengan Google")

Gunakan alur *Authorization Code* dengan **PKCE**. Validasi parameter `state` dan `redirect_uri` secara ketat. Simpan token pihak ketiga terenkripsi.

## Kesalahan yang paling sering

1. Menyimpan password sebagai teks biasa atau hash lemah.
2. Tidak membatasi percobaan login.
3. Otorisasi hanya dicek di antarmuka, bukan di server.
4. Token berumur sangat panjang tanpa mekanisme cabut.
5. Rahasia (kunci API, `service_role`) masuk ke kode client atau repositori.
6. Tidak ada log audit untuk login dan perubahan sensitif.
7. Fitur "lupa password" yang bisa disalahgunakan (token tebakan, tanpa kedaluwarsa).

## Daftar periksa singkat

- [ ] HTTPS di mana-mana, cookie `HttpOnly; Secure; SameSite`.
- [ ] Password di-hash dengan Argon2id/bcrypt.
- [ ] Rate limiting pada login dan reset password.
- [ ] Otorisasi per objek di sisi server.
- [ ] 2FA tersedia, ada kode pemulihan.
- [ ] Sesi/token bisa dicabut dan punya masa berlaku wajar.

> 📸 **TODO (opsional):** tambahkan screenshot header cookie di DevTools (sensor nilai) yang memperlihatkan flag `HttpOnly`, `Secure`, dan `SameSite`.
