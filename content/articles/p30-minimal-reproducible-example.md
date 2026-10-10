---
title: "Membuat Minimal Reproducible Example: Kunci Mendapat Bantuan"
slug: membuat-minimal-reproducible-example
category: framework
type: panduan
level: pemula
published: true
excerpt: "Bug yang bisa direproduksi dalam 20 baris hampir selalu cepat terpecahkan, kadang oleh dirimu sendiri saat membuatnya."
goal: "Menyusun contoh minimal yang mengisolasi masalah."
benefits: "Menemukan akar masalah lebih cepat dan membuat pertanyaan mudah dijawab orang lain."
tags: [debugging, problem-solving, komunitas, pemula]
links:
  - label: "Stack Overflow: Minimal reproducible example"
    url: "https://stackoverflow.com/help/minimal-reproducible-example"
---

## Mengapa

Proyek nyata penuh hal yang tidak relevan. Contoh minimal menyingkirkan semuanya kecuali penyebab masalah.

## Langkah

1. **Salin proyek** (atau buat proyek baru yang kosong).
2. **Hapus** bagian demi bagian (halaman lain, fitur lain, styling, data besar) sambil memeriksa apakah bug masih muncul.
3. Jika bug **hilang** setelah menghapus sesuatu, bagian itu terkait masalah. Kembalikan.
4. Ganti data nyata dengan data **contoh sederhana**.
5. Berhenti saat tidak ada lagi yang bisa dihapus tanpa menghilangkan bug.

## Hasil yang baik

- Bisa dijalankan oleh orang lain tanpa langkah rumit (idealnya satu berkas atau repositori kecil/CodeSandbox/StackBlitz).
- Menyertakan versi teknologi yang dipakai.
- Menyatakan: *yang diharapkan* vs *yang terjadi*.
- Tidak mengandung rahasia atau data pribadi.

## Bonus

Sering kali, saat mengerjakan langkah penyederhanaan, kamu menemukan sendiri penyebabnya. Ini sebabnya teknik ini berguna bahkan jika kamu tidak berniat bertanya ke siapa pun.
