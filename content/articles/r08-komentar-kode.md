---
title: "Komentar Kode: Perlu atau Tanda Kode Jelek?"
slug: komentar-kode-perlu-atau-tanda-kode-jelek
category: backend
type: ringan
level: pemula
published: true
date: 2026-09-24
excerpt: "Ada yang bilang kode bagus tak butuh komentar. Ada yang menulis komentar di setiap baris. Keduanya kurang tepat."
goal: "Memberi pedoman sederhana kapan komentar membantu."
benefits: "Kode yang lebih mudah dipahami tanpa dipenuhi komentar kosong."
challenges: "Komentar bisa basi saat kode berubah dan komentarnya terlupa."
tags: [clean-code, kebiasaan, backend]
---

Aturan yang berguna: **kode menjelaskan "apa", komentar menjelaskan "mengapa".**

## Komentar yang menyia-nyiakan ruang

```js
// tambah 1 ke i
i = i + 1;
```

Kode sudah mengatakannya. Kalau perlu komentar untuk menjelaskan apa yang dilakukan sebuah baris, biasanya nama variabel atau fungsinya yang perlu diperbaiki.

## Komentar yang menyelamatkan

```js
// Pakai pembulatan ke bawah: aturan akuntansi perusahaan,
// selisih sen tidak boleh dibulatkan ke atas.
const nilai = Math.floor(total * 100) / 100;
```

Alasan bisnis, keputusan yang tidak intuitif, jebakan yang pernah terjadi, dan tautan ke tiket atau dokumentasi adalah isi komentar yang bernilai.

## Dua kebiasaan baik

- Hapus kode lama yang dikomentari. Git sudah menyimpannya.
- Saat mengubah kode, baca komentar di dekatnya. Komentar yang salah lebih berbahaya daripada tidak ada komentar.
