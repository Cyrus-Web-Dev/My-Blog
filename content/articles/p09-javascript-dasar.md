---
title: "JavaScript Dasar: Variabel, Fungsi, Scope, dan Method Array"
slug: javascript-dasar-variabel-fungsi-scope-array
category: frontend
type: panduan
level: pemula
published: true
excerpt: "Fondasi JavaScript yang akan terus kamu pakai di framework apa pun."
goal: "Menguasai konsep inti JavaScript modern."
benefits: "Framework terasa jauh lebih mudah bila fondasinya kuat."
tags: [javascript, dasar, pemula]
links:
  - label: "MDN: JavaScript Guide"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide"
---

## Variabel

```js
const nama = "Ayu";   // tidak bisa diberi nilai baru (pilihan utama)
let umur = 20;        // bisa diubah
// hindari var
```

## Fungsi

```js
function tambah(a, b) { return a + b; }
const kali = (a, b) => a * b;   // arrow function
```

## Scope

`let` dan `const` berlaku **di dalam blok** `{ }` tempat dideklarasikan. Variabel di luar fungsi bisa dibaca oleh fungsi di dalamnya (*closure*).

```js
function penghitung() {
  let n = 0;
  return () => ++n;   // mengingat n
}
const hitung = penghitung();
hitung(); // 1
hitung(); // 2
```

## Perbandingan

Gunakan `===` (tanpa konversi tipe), bukan `==`. `0 == ""` bernilai `true`, `0 === ""` bernilai `false`.

## Method array yang wajib akrab

```js
const harga = [10000, 25000, 5000];

harga.map((h) => h * 1.1);          // ubah tiap elemen
harga.filter((h) => h > 8000);      // saring
harga.reduce((jumlah, h) => jumlah + h, 0); // gabungkan jadi satu nilai
harga.find((h) => h > 20000);       // elemen pertama yang cocok
```

## Objek dan destructuring

```js
const user = { nama: "Ayu", kota: "Padang" };
const { nama, kota } = user;
const salinan = { ...user, kota: "Bandung" };
```

Latihan: ambil daftar angka, hitung total yang genap dikali dua, hanya dengan `filter`, `map`, dan `reduce`.
