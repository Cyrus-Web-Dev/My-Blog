---
title: "Memecah Masalah Besar Menjadi Langkah Kecil yang Bisa Dikerjakan"
slug: memecah-masalah-besar-menjadi-langkah-kecil
category: framework
type: panduan
level: pemula
published: true
excerpt: "Tugas besar terasa menakutkan karena kabur. Pecah sampai setiap langkah jelas, dan memulai jadi mudah."
goal: "Menguasai teknik dekomposisi untuk proyek dan bug yang rumit."
benefits: "Progres terlihat, risiko cepat ketahuan, dan tidak lumpuh di depan layar kosong."
tags: [problem-solving, perencanaan, produktivitas, pemula]
---

## Prinsip

Tugas yang baik cukup kecil untuk diselesaikan dalam beberapa jam, dan hasilnya bisa **diperiksa**.

## Langkah

1. **Tulis tujuan akhir dalam satu kalimat.**
2. **Daftar bagian besar** (mis. login, daftar produk, keranjang, pembayaran).
3. **Pecah tiap bagian** sampai langkah konkret: "buat tabel `produk`", "endpoint GET daftar", "kartu produk di UI".
4. **Urutkan berdasarkan risiko dan ketergantungan.** Kerjakan yang paling tidak pasti lebih dulu (integrasi pembayaran, API pihak ketiga) agar kejutan muncul lebih awal.
5. **Potong secara vertikal, bukan horizontal.** Selesaikan satu fitur tipis dari UI sampai database (bisa dipakai), bukan seluruh database dulu lalu seluruh UI.
6. **Kerjakan, centang, tinjau.**

## Contoh vertikal

Alih-alih "bangun semua tabel", mulai dari: *pengguna dapat membuat satu catatan dan melihatnya di daftar*. Itu sudah menyentuh form, API, database, dan tampilan, dan sudah bisa didemokan.

## Bila macet

- Kecilkan langkahnya lagi.
- Tulis dulu versi paling jelek yang berjalan, perbaiki kemudian.
- Kerjakan bagian yang tidak diketahui sebagai **eksperimen kecil terpisah** (spike) dan batasi waktunya.

## Aturan penutup

Selalu punya versi yang **berjalan** di setiap akhir hari. Memperbaiki sistem kecil yang berfungsi lebih mudah daripada memperbaiki sistem besar yang belum pernah menyala.
