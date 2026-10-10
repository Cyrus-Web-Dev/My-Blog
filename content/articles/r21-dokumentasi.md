---
title: "Dokumentasi: Dibenci Semua Orang, Dibutuhkan Semua Orang"
slug: dokumentasi-dibenci-tapi-dibutuhkan
category: framework
type: ringan
level: pemula
published: true
excerpt: "Hampir semua orang mengeluh saat tak ada dokumentasi, dan hampir semua orang malas menulisnya. Mulailah dari yang kecil."
goal: "Membuat kebiasaan dokumentasi yang ringan dan benar-benar dibaca."
benefits: "Onboarding lebih cepat dan pengetahuan tidak hilang bersama orangnya."
tags: [dokumentasi, kebiasaan, tim, readme]
---

## Dokumentasi yang paling bernilai (urutan prioritas)

1. **README**: apa proyeknya, cara menjalankan, cara menjalankan tes, cara deploy.
2. **Keputusan penting** (*Architecture Decision Record*): satu halaman berisi konteks, pilihan, keputusan, dan alasan. Enam bulan kemudian kamu akan bertanya "kenapa kita memilih ini?".
3. **Runbook**: langkah menangani masalah yang berulang ("jika antrean macet, lakukan ini").
4. **Komentar kode** untuk "mengapa" yang tidak jelas.

## Cara membuatnya tidak basi

- Letakkan **dekat kode** (di repositori), bukan di tempat terpisah yang terlupa.
- Perbarui dokumentasi **dalam PR yang sama** dengan perubahan kodenya.
- Uji README dengan meminta orang baru mengikutinya; setiap kebingungan adalah bug dokumentasi.
- Singkat lebih baik daripada lengkap tapi tidak dibaca.

> 💡 Dokumentasi terbaik adalah yang ditulis saat kamu masih ingat betapa membingungkannya hal itu.
