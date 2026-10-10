---
title: "CSS Dasar yang Sering Membingungkan: Box Model dan Specificity"
slug: css-box-model-dan-specificity
category: frontend
type: panduan
level: pemula
published: true
excerpt: "Kenapa lebar elemen tak sesuai dugaan, dan kenapa gayamu 'tidak mau berlaku'? Dua konsep ini jawabannya."
goal: "Memahami box model dan aturan prioritas CSS."
benefits: "Berhenti menebak-nebak dan menebar !important."
tags: [css, dasar, frontend, pemula]
links:
  - label: "MDN: The box model"
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model"
  - label: "MDN: Specificity"
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity"
---

## Box model

Setiap elemen adalah kotak berlapis: **content → padding → border → margin**.

Secara bawaan, `width` hanya mengukur *content*, sehingga padding dan border **menambah** lebar total. Hampir semua proyek mengubahnya:

```css
*, *::before, *::after { box-sizing: border-box; }
```

Dengan `border-box`, `width` sudah termasuk padding dan border, jadi hitungannya lebih intuitif.

**Margin collapse**: margin vertikal antar elemen blok yang berdekatan bisa menyatu (hanya yang terbesar berlaku). Ini bukan bug.

## Specificity: siapa yang menang

Ketika beberapa aturan mengenai elemen yang sama, browser memilih berdasarkan **kekhususan**, lalu urutan kemunculan.

Urutan dari terlemah ke terkuat:

1. Selektor elemen (`p`), pseudo-element.
2. Kelas, atribut, pseudo-class (`.kartu`, `:hover`).
3. ID (`#header`).
4. Gaya inline (`style="..."`).
5. `!important` (hindari).

```css
p { color: black; }          /* lemah */
.kartu p { color: blue; }    /* lebih kuat */
#utama .kartu p { color: red; }  /* lebih kuat lagi */
```

## Tips

- Tulis selektor **serendah mungkin** kekhususannya (satu kelas) agar mudah ditimpa.
- Jangan bertumpu pada ID untuk styling.
- Jika gaya tak berlaku, buka DevTools → **Styles**: aturan yang dicoret adalah yang kalah, dan kamu bisa melihat siapa yang menang.
- Hindari `!important` kecuali untuk kasus yang benar-benar khusus.
- Metodologi penamaan (BEM) atau utilitas (Tailwind) membantu menjaga kekhususan tetap datar.
