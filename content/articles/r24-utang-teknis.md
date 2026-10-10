---
title: "Utang Teknis: Pinjaman yang Bunganya Nyata"
slug: utang-teknis-pinjaman-yang-bunganya-nyata
category: backend
type: ringan
level: menengah
published: true
excerpt: "Jalan pintas kadang sah, seperti utang. Masalahnya jika bunga tidak pernah dihitung dan pokoknya tak pernah dibayar."
goal: "Mengenali, mengelola, dan membayar utang teknis secara sadar."
benefits: "Kecepatan jangka pendek tanpa mengorbankan kecepatan jangka panjang."
tags: [utang-teknis, kualitas, arsitektur, opini]
links:
  - label: "Martin Fowler: Technical Debt"
    url: "https://martinfowler.com/bliki/TechnicalDebt.html"
---

## Analogi

Mengambil jalan pintas untuk mengejar tenggat seperti berutang: kamu mendapat kecepatan sekarang, tetapi **bunganya** adalah perlambatan di setiap perubahan berikutnya.

## Jenis utang

- **Disengaja dan bijak**: "kita rilis versi sederhana dulu, rapikan bulan depan" (dengan catatan).
- **Disengaja dan ceroboh**: "tidak ada waktu untuk desain".
- **Tidak disengaja**: baru sadar setelah belajar bahwa desain lama kurang tepat.

## Mengelola

1. **Catat.** Utang yang tidak tercatat tidak akan dibayar. Buat tiket dengan label `utang-teknis` dan alasan serta dampaknya.
2. **Ukur bunganya**: bagian mana yang paling sering menimbulkan bug atau menunda fitur?
3. **Bayar yang bunganya paling mahal dulu**, bukan yang paling mengganggu estetika.
4. **Sisihkan kapasitas rutin** (mis. sebagian sprint) untuk pembayaran.
5. **Cegah utang baru**: tes, review, dan definisi selesai yang jelas.

Tidak ada kode tanpa utang. Yang membedakan adalah apakah kamu sadar dan terkendali.
