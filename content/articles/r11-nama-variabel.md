---
title: "Kenapa Memberi Nama Variabel Itu Susah Banget"
slug: kenapa-nama-variabel-susah
category: frontend
type: ringan
level: pemula
published: true
date: 2026-09-30
excerpt: "Nama yang buruk membuat kode membingungkan. Berikut aturan sederhana supaya penamaan tidak lagi jadi siksaan."
goal: "Memberi pedoman penamaan yang praktis."
benefits: "Kode lebih mudah dibaca oleh orang lain dan oleh dirimu sendiri nanti."
challenges: "Nama yang baik kadang baru ketemu setelah paham masalahnya, jadi siap mengganti nama itu normal."
tags: [clean-code, penamaan, kebiasaan]
---

Penamaan sulit karena kamu sedang memaksa diri menjelaskan maksud kode dalam satu-dua kata.

## Aturan ringkas

- **Nama menjelaskan isi atau tujuan**, bukan tipe: `daftarPelanggan`, bukan `arr1`.
- **Fungsi diawali kata kerja**: `hitungTotal`, `kirimEmail`.
- **Boolean berbentuk pertanyaan**: `isAktif`, `punyaAkses`, `sudahDibayar`.
- **Hindari singkatan misterius.** `trx` bagi yang menulis jelas, bagi pembaca belum tentu.
- **Konsisten.** Jangan memakai `user`, `pengguna`, dan `member` untuk hal yang sama.
- **Nama panjang yang jelas lebih baik daripada nama pendek yang ambigu.**

## Contoh perbaikan

```ts
// Sebelum
const d = items.filter((i) => i.s === 1);

// Sesudah
const itemAktif = items.filter((item) => item.status === STATUS_AKTIF);
```

Kalau kamu kesulitan menamai sebuah fungsi, itu sering tanda fungsinya melakukan terlalu banyak hal. Pecah, dan namanya biasanya muncul sendiri.
