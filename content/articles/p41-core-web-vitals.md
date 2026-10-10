---
title: "Core Web Vitals dan Cara Mempercepat Situs"
slug: core-web-vitals-dan-cara-mempercepat-situs
category: frontend
type: panduan
level: menengah
published: true
excerpt: "Tiga metrik Google ini mengukur pengalaman nyata pengunjung: seberapa cepat tampil, responsif, dan stabil."
goal: "Memahami LCP, INP, dan CLS serta cara memperbaikinya."
benefits: "Situs terasa lebih cepat dan lebih ramah pengguna, juga baik untuk SEO."
challenges: "Ambang batas dan metrik dapat diperbarui; periksa web.dev untuk yang terbaru."
tags: [performa, web-vitals, frontend, seo]
links:
  - label: "web.dev: Web Vitals"
    url: "https://web.dev/articles/vitals"
  - label: "PageSpeed Insights"
    url: "https://pagespeed.web.dev/"
---

## Tiga metrik

| Metrik | Mengukur | Target "baik" |
|---|---|---|
| **LCP** (Largest Contentful Paint) | Kecepatan elemen utama tampil | ≤ 2,5 detik |
| **INP** (Interaction to Next Paint) | Responsivitas terhadap interaksi | ≤ 200 ms |
| **CLS** (Cumulative Layout Shift) | Stabilitas tata letak (tidak loncat) | ≤ 0,1 |

## Memperbaiki LCP

- Kompres gambar, pakai format modern (WebP/AVIF), dan ukuran sesuai tampilan.
- Beri `fetchpriority="high"` pada gambar hero; jangan *lazy-load* elemen utama di layar pertama.
- Kurangi waktu respons server (cache, query efisien, CDN).
- Hindari CSS/JS yang memblokir render.

## Memperbaiki INP

- Pecah tugas JavaScript panjang; hindari pekerjaan berat di thread utama.
- Kurangi JavaScript yang dikirim (code splitting, Server Components, buang pustaka berat).
- Hindari render ulang yang tidak perlu.

## Memperbaiki CLS

```html
<img src="foto.jpg" width="800" height="450" alt="...">
```

Tentukan `width`/`height` (atau `aspect-ratio`) untuk gambar dan iklan, sediakan ruang untuk konten yang dimuat belakangan, dan hindari menyisipkan elemen di atas konten yang sudah tampil.

## Cara mengukur

- **Lighthouse** (di DevTools) untuk uji lab.
- **PageSpeed Insights** juga menampilkan data pengguna nyata bila tersedia.
- Ukur sebelum dan sesudah tiap perubahan; jangan menebak.
