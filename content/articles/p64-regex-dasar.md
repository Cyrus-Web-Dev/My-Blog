---
title: "Regex Dasar: Mencari Pola Teks Tanpa Pusing"
slug: regex-dasar-mencari-pola-teks
category: backend
type: panduan
level: pemula
published: true
excerpt: "Regular expression terlihat seperti sandi, padahal dibangun dari beberapa bagian sederhana."
goal: "Membaca dan menulis regex dasar dengan percaya diri."
benefits: "Validasi dan pencarian teks yang efisien."
challenges: "Regex bisa sangat lambat (catastrophic backtracking) pada pola dan input tertentu."
tags: [regex, string, dasar, javascript]
links:
  - label: "MDN: Regular expressions"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions"
  - label: "regex101"
    url: "https://regex101.com/"
---

## Bahan dasar

| Pola | Arti |
|---|---|
| `abc` | Teks harfiah "abc" |
| `.` | Satu karakter apa saja |
| `\d` `\w` `\s` | Digit, karakter kata, spasi |
| `[abc]` `[a-z]` | Salah satu dari set |
| `^` `$` | Awal dan akhir teks |
| `*` `+` `?` | 0+, 1+, 0 atau 1 kali |
| `{3}` `{2,5}` | Tepat 3, antara 2 dan 5 kali |
| `( )` | Grup (tangkap) |
| `\|` | Atau |

## Contoh di JavaScript

```js
const kodePos = /^\d{5}$/;
kodePos.test("25111");   // true

const tanggal = /(\d{4})-(\d{2})-(\d{2})/;
const [, tahun, bulan, hari] = "2026-10-10".match(tanggal);

"a1b22c333".replace(/\d+/g, "#");   // "a#b#c#"
```

Flag `g` = semua kecocokan, `i` = abaikan huruf besar/kecil.

## Praktik baik

- **Uji dan visualisasikan** di regex101 sebelum memakainya.
- Jangan memvalidasi email dengan regex yang rumit; cukup pemeriksaan sederhana lalu **kirim email konfirmasi**.
- **Jangkarkan** pola (`^...$`) saat memvalidasi seluruh teks.
- Beri komentar penjelasan untuk pola yang rumit.

## Peringatan performa

Pola dengan pengulangan bersarang (`(a+)+`) bisa memicu *catastrophic backtracking* pada input tertentu, sehingga satu input jahat menghabiskan CPU (serangan ReDoS). Hindari pola semacam itu pada input yang tak tepercaya, dan batasi panjang input.
