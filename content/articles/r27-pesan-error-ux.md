---
title: "Kenapa Pengguna Tidak Pernah Membaca Pesan Error-mu"
slug: kenapa-pengguna-tidak-membaca-pesan-error
category: frontend
type: ringan
level: pemula
published: true
excerpt: "'Terjadi kesalahan. Coba lagi.' Pesan itu tidak menolong siapa pun. Pesan error yang baik memberi arah."
goal: "Menulis pesan error yang jelas, sopan, dan bisa ditindaklanjuti."
benefits: "Pengguna tidak buntu dan tiket dukungan berkurang."
tags: [ux, error, frontend, penulisan]
---

## Pesan yang buruk

- "Error 500."
- "Input tidak valid."
- "Terjadi kesalahan."

Tidak ada petunjuk tentang apa yang salah atau apa yang harus dilakukan.

## Pesan yang baik menjawab tiga hal

1. **Apa yang terjadi?**
2. **Mengapa (jika relevan)?**
3. **Apa yang bisa dilakukan sekarang?**

| Buruk | Baik |
|---|---|
| "Input tidak valid." | "Format email belum benar. Contoh: nama@contoh.com." |
| "Terjadi kesalahan." | "Pesananmu belum tersimpan karena koneksi terputus. Data di formulir masih aman, coba kirim lagi." |
| "Akses ditolak." | "Kamu belum punya izin untuk membuka halaman ini. Hubungi admin untuk meminta akses." |

## Prinsip

- Tampilkan pesan **di dekat masalah** (di bawah field yang salah).
- Gunakan bahasa manusia, tanpa kode atau jargon. Simpan detail teknis untuk log.
- **Jangan menyalahkan pengguna.**
- Jangan menghapus isian yang sudah diketik saat terjadi error.
- Jangan membocorkan detail sensitif (mis. membedakan "email tidak terdaftar" dan "password salah" pada login).
