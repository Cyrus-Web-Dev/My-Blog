---
title: "Aksesibilitas Web Dasar: Situs yang Bisa Dipakai Semua Orang"
slug: aksesibilitas-web-dasar
category: frontend
type: panduan
level: pemula
published: true
excerpt: "Aksesibilitas membantu pengguna pembaca layar, pengguna keyboard, penderita buta warna, dan juga siapa pun yang sedang di bawah terik matahari."
goal: "Menerapkan dasar aksesibilitas yang berdampak besar dengan usaha kecil."
benefits: "Lebih banyak orang bisa memakai produkmu, dan kode lebih rapi."
tags: [aksesibilitas, a11y, html, frontend]
links:
  - label: "MDN: Accessibility"
    url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility"
  - label: "web.dev: Learn Accessibility"
    url: "https://web.dev/learn/accessibility"
  - label: "WCAG (W3C)"
    url: "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

## Lima hal berdampak besar

**1. HTML semantik.** Pakai `<button>`, `<a>`, `<nav>`, `<main>`, heading berurutan. Pembaca layar mengandalkannya.

**2. Alt text untuk gambar bermakna.** Jelaskan fungsi atau isi gambar; untuk dekorasi pakai `alt=""`.

**3. Kontras warna.** Pedoman WCAG level AA meminta rasio kontras minimal sekitar 4,5:1 untuk teks biasa. Periksa dengan alat kontras di DevTools. Jangan hanya mengandalkan warna untuk menyampaikan makna (mis. error hanya merah); tambahkan teks atau ikon.

**4. Bisa dioperasikan dengan keyboard.** Semua yang bisa diklik harus bisa dicapai dengan Tab dan dijalankan dengan Enter/Spasi, dan **fokusnya harus terlihat**. Jangan menghapus `outline` tanpa pengganti.

**5. Label pada form.**

```html
<label for="nama">Nama lengkap</label>
<input id="nama" name="nama" autocomplete="name" required>
```

Pesan error terkait field harus bisa dibaca pembaca layar (hubungkan dengan `aria-describedby`).

## ARIA: pakai seperlunya

Aturan pertama ARIA: jika ada elemen HTML bawaan yang melakukan hal itu, pakai elemen itu. ARIA yang salah bisa lebih buruk daripada tanpa ARIA.

## Cara menguji

- Navigasi seluruh halaman hanya dengan keyboard.
- Perbesar teks sampai 200% dan pastikan tidak ada yang rusak.
- Jalankan Lighthouse (kategori Accessibility), tetapi ingat alat otomatis hanya menangkap sebagian masalah.
- Coba pembaca layar sungguhan (NVDA, VoiceOver) pada alur utama.
