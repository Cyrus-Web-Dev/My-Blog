---
title: "Cara Berpikir Sistematis Saat Debugging"
slug: cara-berpikir-sistematis-saat-debugging
category: framework
type: panduan
level: pemula
published: true
excerpt: "Debugging bukan menebak-nebak. Ini metode ilmiah sederhana yang bisa dipakai pada bug apa pun."
goal: "Punya alur tetap untuk menemukan dan memperbaiki bug dengan cepat."
benefits: "Mengurangi waktu terbuang dan perubahan acak yang memperburuk keadaan."
tags: [debugging, problem-solving, metode, pemula]
links:
  - label: "Chrome DevTools"
    url: "https://developer.chrome.com/docs/devtools"
  - label: "MDN: Debugging JavaScript"
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Debugging_JavaScript"
---

## Alur 7 langkah

1. **Pahami gejala.** Apa yang diharapkan, apa yang terjadi? Tulis dalam satu kalimat.
2. **Reproduksi.** Temukan langkah pasti yang memunculkan bug. Bug yang tidak bisa direproduksi tidak bisa diperbaiki dengan yakin.
3. **Persempit lokasi.** Pecah sistem menjadi bagian dan tentukan di bagian mana data mulai salah: input → proses → output.
4. **Buat hipotesis.** "Kemungkinan `user` bernilai null karena sesi kedaluwarsa."
5. **Uji hipotesis**, ubah **satu hal pada satu waktu**.
6. **Perbaiki akar masalah**, bukan gejalanya.
7. **Verifikasi dan cegah.** Pastikan bug hilang, tambahkan tes agar tidak kembali.

## Teknik penyempit

- **Cetak/log di titik-titik kunci**, atau pakai *breakpoint* di DevTools/debugger.
- **Bagi dua (binary search)**: periksa nilai di tengah alur, lalu tentukan bug ada di separuh sebelum atau sesudahnya.
- **Bandingkan yang jalan dan yang tidak**: lingkungan, data, versi, konfigurasi.
- **Cek perubahan terakhir**: `git log`, `git diff`, atau `git bisect`.
- **Sederhanakan**: hapus bagian sampai bug hilang; bagian terakhir yang dihapus adalah petunjuk.

## Jebakan mental

- Mengubah banyak hal sekaligus, lalu tidak tahu mana yang memperbaiki.
- Mempercayai asumsi tanpa memeriksa ("pasti variabel ini terisi").
- Memperbaiki gejala (menambah `if` supaya error hilang) tanpa memahami penyebab.
- Bertahan berjam-jam tanpa istirahat atau bantuan. Setelah 30-60 menit buntu, jelaskan masalah ke orang lain atau ke "bebek karet"; sering jawabannya muncul saat menjelaskan.
