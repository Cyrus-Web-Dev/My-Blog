---
title: "Layout Responsif: Mobile-First dari Awal"
slug: layout-responsif-mobile-first
category: frontend
type: panduan
level: pemula
published: true
excerpt: "Sebagian besar pengunjung membuka dari ponsel. Rancang untuk layar kecil dulu, lalu perluas."
goal: "Membuat halaman yang nyaman di semua ukuran layar."
benefits: "Lebih sedikit CSS tambalan dan pengalaman mobile yang baik."
tags: [css, responsif, mobile]
links:
  - label: "web.dev: Learn Responsive Design"
    url: "https://web.dev/learn/design"
  - label: "MDN: Responsive design"
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design"
---

## 1. Meta viewport (wajib)

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Tanpa ini, ponsel menampilkan halaman seolah-olah lebar desktop lalu mengecilkannya.

## 2. Mobile-first dengan `min-width`

```css
.kartu-grid { display: grid; gap: 1rem; grid-template-columns: 1fr; }

@media (min-width: 640px)  { .kartu-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .kartu-grid { grid-template-columns: repeat(3, 1fr); } }
```

Gaya dasar untuk layar kecil, lalu tambahkan di layar lebih besar. Di Tailwind: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.

## 3. Satuan fleksibel

Gunakan `rem`, `%`, `fr`, dan `clamp()` untuk ukuran teks yang mengalir:

```css
h1 { font-size: clamp(1.75rem, 4vw + 1rem, 3rem); }
```

## 4. Gambar dan tabel

```css
img { max-width: 100%; height: auto; }
.tabel-bungkus { overflow-x: auto; }
```

## 5. Area sentuh

Tombol dan tautan sebaiknya cukup besar untuk jari (sekitar 44px tinggi).

## Menguji

DevTools → mode perangkat (ikon ponsel), ubah lebar, dan uji juga di ponsel sungguhan. Periksa tidak ada scroll horizontal yang tidak disengaja.
