---
title: "Performa Frontend End-to-End: Dari Bundle ke Render"
slug: performa-frontend-end-to-end
category: frontend
type: deep-dive
level: mahir
published: true
excerpt: "Performa bukan satu trik, melainkan rantai: jaringan, bundle, render, dan interaksi. Berikut peta lengkap dan urutan bekerja."
goal: "Memberi kerangka sistematis untuk menemukan dan memperbaiki penyebab lambat di aplikasi web modern."
benefits: "Perbaikan yang terukur, bukan optimasi dugaan."
challenges: "Metrik berbeda antara lab dan pengguna nyata; selalu verifikasi pada perangkat dan jaringan yang representatif."
tags: [performa, frontend, bundle, rendering, web-vitals]
links:
  - label: "web.dev: Performance"
    url: "https://web.dev/learn/performance"
  - label: "MDN: Web performance"
    url: "https://developer.mozilla.org/en-US/docs/Web/Performance"
---

## Prinsip nol: ukur dulu

Gunakan Lighthouse, tab Performance, dan data pengguna nyata (RUM atau laporan Chrome UX di PageSpeed Insights). Tetapkan target (mis. LCP, INP, CLS) dan bandingkan sebelum dan sesudah. Uji dengan CPU diperlambat dan jaringan 4G lambat; laptop kerjamu bukan ponsel pengguna.

## 1. Jaringan

- **HTTP caching**: aset berhash dengan `Cache-Control` panjang.
- **Kompresi**: Brotli atau gzip untuk teks.
- **CDN** untuk aset statis dan, bila cocok, halaman.
- **Hints**: `preconnect` ke origin penting, `preload` untuk aset kritis (font utama, gambar LCP), `prefetch` untuk navigasi berikutnya.
- **Kurangi request** dan pastikan tidak ada rantai permintaan berurutan (waterfall).

## 2. Ukuran bundle JavaScript

JavaScript mahal dua kali: diunduh dan **dieksekusi** di perangkat yang mungkin lambat.

- Analisis isi bundle (`@next/bundle-analyzer`, `source-map-explorer`, `vite-bundle-visualizer`).
- **Code splitting** per rute dan *lazy load* komponen berat (editor, chart, peta).
- Hindari pustaka besar untuk fungsi kecil; pilih alternatif ringan atau tulis sendiri.
- Pastikan **tree-shaking** bekerja (impor spesifik, paket ESM).
- Di Next.js, Server Components menjaga logika dan dependensi berat tetap di server.

## 3. Gambar dan font

- Format modern (WebP/AVIF), ukuran sesuai (`srcset`/`sizes`), dimensi eksplisit untuk mencegah CLS, `loading="lazy"` untuk di bawah layar pertama (bukan untuk gambar LCP).
- Font: subset karakter, `font-display: swap` (atau `optional`), muat font minimal, dan pertimbangkan font sistem untuk kecepatan.

## 4. Strategi rendering

| Strategi | Cocok untuk |
|---|---|
| Statis (SSG) | Konten yang jarang berubah (blog, dokumentasi) |
| Regenerasi bertahap (ISR) | Konten yang berubah sesekali |
| SSR | Halaman personal atau selalu segar |
| CSR | Aplikasi di balik login yang SEO-nya tidak penting |

Pilih per halaman. Streaming dengan Suspense membuat bagian yang siap tampil lebih dulu.

## 5. Biaya hydration dan render ulang

- Hydration menjalankan JavaScript untuk menghidupkan HTML; semakin banyak komponen interaktif, semakin mahal.
- **Letakkan state sedekat mungkin** dengan pemakainya agar perubahan tidak merender ulang pohon besar.
- Gunakan `memo`, `useMemo`, `useCallback` **setelah** profiling menunjukkan masalah, bukan di mana-mana.
- **Virtualisasi** daftar panjang (render hanya yang terlihat).
- Gunakan `key` yang stabil dan hindari membuat objek/fungsi baru sebagai props pada komponen yang di-memo bila itu terbukti masalah.

## 6. Interaksi (INP)

- Pecah **tugas panjang** (>50 ms) menjadi potongan kecil; berikan kesempatan browser merespons input di antaranya.
- Pindahkan komputasi berat ke **Web Worker**.
- Tunda pekerjaan non-kritis (`requestIdleCallback`, atau tunda setelah interaksi).
- Hindari *layout thrashing*: membaca lalu menulis properti layout bergantian dalam loop.

## 7. Skrip pihak ketiga

Analitik, widget chat, dan iklan sering menjadi penyumbang terbesar kelambatan. Muat dengan `async`/`defer`, tunda hingga idle, dan audit secara berkala apakah masih dibutuhkan.

## 8. Anggaran performa

Tetapkan batas (mis. ukuran bundle awal, LCP) dan gagalkan CI bila dilanggar, agar performa tidak merosot perlahan.

## Urutan kerja yang disarankan

1. Ukur dan temukan metrik terburuk.
2. Perbaiki yang paling besar dampaknya (biasanya gambar, JavaScript berlebih, atau respons server lambat).
3. Ukur ulang.
4. Pasang anggaran dan pemantauan.

> 📸 **TODO (opsional):** screenshot skor Lighthouse atau peta bundle sebelum dan sesudah dari proyekmu sendiri.
