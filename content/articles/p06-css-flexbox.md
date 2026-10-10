---
title: "CSS Flexbox untuk Pemula: Menata Tata Letak Satu Dimensi"
slug: css-flexbox-untuk-pemula
category: frontend
type: panduan
level: pemula
published: true
excerpt: "Flexbox menyelesaikan masalah tengah-tengahkan elemen dan baris navigasi dengan beberapa baris CSS."
goal: "Menguasai properti inti Flexbox dan pola yang paling sering dipakai."
benefits: "Tata letak lebih cepat dan tidak lagi bergantung pada trik float."
tags: [css, flexbox, layout]
links:
  - label: "MDN: Flexbox"
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox"
---

Flexbox menata elemen anak dalam **satu arah** (baris atau kolom).

```css
.baris {
  display: flex;
  flex-direction: row;       /* atau column */
  justify-content: space-between; /* sepanjang sumbu utama */
  align-items: center;       /* sepanjang sumbu silang */
  gap: 1rem;
  flex-wrap: wrap;
}
.isi { flex: 1; }            /* mengisi sisa ruang */
```

## Pola yang sering dipakai

**Tengahkan di tengah halaman**

```css
.tengah { display: flex; justify-content: center; align-items: center; min-height: 100vh; }
```

**Navbar: logo kiri, menu kanan**

```css
.nav { display: flex; justify-content: space-between; align-items: center; }
```

**Footer menempel di bawah**: bungkus dengan `display:flex; flex-direction:column; min-height:100vh` dan beri `flex:1` pada konten utama.

## Mengingat sumbu

`justify-content` bekerja pada sumbu utama (mengikuti `flex-direction`), `align-items` pada sumbu silang. Saat `flex-direction: column`, keduanya "tertukar", sumber kebingungan paling umum.
