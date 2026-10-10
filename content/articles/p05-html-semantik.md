---
title: "HTML Semantik: Fondasi yang Sering Dilewatkan"
slug: html-semantik-fondasi-yang-sering-dilewatkan
category: frontend
type: panduan
level: pemula
published: true
excerpt: "Memakai elemen yang tepat membuat situsmu lebih mudah diakses, lebih rapi di mesin pencari, dan lebih mudah dirawat."
goal: "Menulis HTML yang bermakna, bukan tumpukan div."
benefits: "Aksesibilitas, SEO, dan keterbacaan kode meningkat tanpa usaha ekstra."
tags: [html, aksesibilitas, frontend, dasar]
links:
  - label: "MDN: Struktur HTML"
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content"
---

## Pakai elemen sesuai maknanya

```html
<header>…logo dan navigasi…</header>
<nav>…menu…</nav>
<main>
  <article>
    <h1>Judul Artikel</h1>
    <section>
      <h2>Subjudul</h2>
      <p>Isi…</p>
    </section>
  </article>
  <aside>…info samping…</aside>
</main>
<footer>…</footer>
```

## Aturan penting

- Hanya **satu `<h1>`** per halaman, dan urutkan heading tanpa melompat (h1 → h2 → h3).
- **Tombol adalah `<button>`**, tautan adalah `<a>`. Jangan membuat `<div onclick>`: tidak bisa difokus keyboard dan tidak dikenali pembaca layar.
- Setiap input punya **label**:

```html
<label for="email">Email</label>
<input id="email" type="email" name="email" required>
```

- Gambar bermakna punya `alt`; gambar dekoratif `alt=""`.
- Gunakan `<ul>/<ol>` untuk daftar, `<table>` untuk data tabular.

## Uji cepat

Coba navigasi seluruh halaman hanya dengan tombol Tab. Jika ada yang tidak terjangkau atau urutannya aneh, HTML-nya perlu dibenahi.
