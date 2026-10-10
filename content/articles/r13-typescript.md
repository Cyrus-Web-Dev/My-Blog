---
title: "TypeScript: Awalnya Mengesalkan, Lalu Sulit Lepas"
slug: typescript-awalnya-mengesalkan-sulit-lepas
category: frontend
type: ringan
level: pemula
published: true
date: 2026-10-02
excerpt: "Banyak yang merasa TypeScript memperlambat di awal. Ini alasan mengapa banyak tim tetap memilihnya, dan cara memakainya tanpa frustrasi."
goal: "Meyakinkan pembaca yang ragu dan memberi tips agar tidak kapok."
benefits: "Lebih sedikit bug sepele, refaktor lebih berani."
challenges: "Tipe yang rumit bisa membuat kode lebih sulit dibaca dari JavaScript biasa."
tags: [typescript, javascript, frontend]
links:
  - label: "TypeScript Handbook"
    url: "https://www.typescriptlang.org/docs/"
---

TypeScript menangkap kesalahan seperti salah nama properti atau salah tipe argumen **sebelum** kode dijalankan. Editor ikut membantu lewat autocomplete yang akurat, dan refaktor besar terasa lebih aman.

## Biayanya

- Perlu waktu belajar.
- Ada kode tipe tambahan untuk ditulis.
- Tipe yang terlalu cerdas bisa menjadi teka-teki.

## Cara memakainya tanpa frustrasi

1. **Aktifkan mode `strict`** sejak awal. Lebih sulit menyalakannya belakangan.
2. **Hindari `any`.** Gunakan `unknown` bila tipe memang belum diketahui, lalu persempit.
3. **Biarkan inferensi bekerja.** Tidak perlu menulis tipe untuk hal yang sudah jelas.
4. **Validasi data di perbatasan** (respons API, input form) dengan pustaka seperti Zod. Tipe di TypeScript hilang saat runtime, jadi data dari luar tetap perlu dicek.
5. **Mulai sederhana.** Tipe objek dan union sudah memberi sebagian besar manfaat.

TypeScript bukan pengganti testing, tapi ia menghapus satu kelas bug yang membosankan.
