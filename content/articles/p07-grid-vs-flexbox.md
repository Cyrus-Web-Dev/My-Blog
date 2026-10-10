---
title: "CSS Grid: Kapan Dipakai dan Apa Bedanya dengan Flexbox"
slug: css-grid-kapan-dipakai-beda-dengan-flexbox
category: frontend
type: panduan
level: pemula
published: true
excerpt: "Flexbox untuk satu dimensi, Grid untuk dua dimensi. Dengan Grid, galeri responsif cukup beberapa baris."
goal: "Tahu memilih Grid atau Flexbox dan menulis grid responsif."
benefits: "Layout kartu, galeri, dan dashboard jadi ringkas."
tags: [css, grid, layout, responsif]
links:
  - label: "MDN: CSS Grid"
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout"
---

## Perbedaan inti

- **Flexbox**: menata item sepanjang satu baris *atau* satu kolom. Berangkat dari isi.
- **Grid**: menata baris *dan* kolom sekaligus. Berangkat dari tata letak.

## Grid responsif tanpa media query

```css
.galeri {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}
```

Artinya: isi baris dengan sebanyak mungkin kolom selebar minimal 240px, lalu bagi sisa ruangnya rata. Di layar sempit otomatis turun menjadi satu kolom.

## Tata letak halaman

```css
.halaman {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
header  { grid-area: header; }
aside   { grid-area: sidebar; }
main    { grid-area: main; }
footer  { grid-area: footer; }
```

## Cara memilih

Tata letak halaman dan kisi kartu: **Grid**. Komponen kecil di dalamnya (tombol dengan ikon, baris menu): **Flexbox**. Keduanya sering dipakai bersama.
