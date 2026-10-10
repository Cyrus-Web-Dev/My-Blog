---
title: "Hashing vs Enkripsi vs Encoding: Jangan Tertukar"
slug: hashing-vs-enkripsi-vs-encoding
category: backend
type: panduan
level: pemula
published: true
excerpt: "Base64 bukan enkripsi, dan hash bukan sesuatu yang bisa dibuka. Tiga konsep ini sering tertukar, dengan akibat keamanan serius."
goal: "Membedakan encoding, hashing, dan enkripsi serta memilih yang tepat."
benefits: "Menghindari kesalahan fatal seperti 'mengamankan' password dengan Base64."
tags: [keamanan, hashing, enkripsi, dasar]
links:
  - label: "OWASP Password Storage Cheat Sheet"
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html"
---

| | Encoding | Hashing | Enkripsi |
|---|---|---|---|
| Tujuan | Mengubah format agar bisa dikirim/disimpan | Sidik jari data | Merahasiakan data |
| Bisa dibalik? | Ya, tanpa rahasia | **Tidak** (satu arah) | Ya, **dengan kunci** |
| Contoh | Base64, URL encoding | SHA-256, bcrypt, Argon2 | AES, RSA |
| Pakai untuk | Mengirim data biner lewat teks | Password, verifikasi integritas | Data sensitif yang perlu dibaca lagi |

## Encoding bukan keamanan

```js
btoa("rahasia");   // "cmFoYXNpYQ=="  → siapa pun bisa membalikkannya
```

Isi JWT hanya di-encode (Base64URL), bukan dienkripsi: jangan menaruh rahasia di dalamnya.

## Hashing

Untuk **password**, jangan simpan teks asli maupun enkripsi; simpan **hash** memakai algoritma yang sengaja lambat dan bergaram: **Argon2id** atau **bcrypt**. Saat login, hitung hash input dan bandingkan.

SHA-256 polos cepat sehingga cocok untuk memeriksa integritas file, tetapi **tidak cocok** untuk password.

## Enkripsi

Gunakan bila data harus bisa dibaca kembali (mis. token pihak ketiga). Pakai pustaka yang mapan (`Crypt` di Laravel, modul `crypto` di Node) dan jaga **kuncinya** terpisah dari data. Jangan merancang algoritma sendiri.

## Ingat

Salah memilih alat di sini adalah sumber kebocoran yang sering: "password dienkripsi" berarti bisa didekripsi seseorang yang memegang kunci; password seharusnya di-hash.
