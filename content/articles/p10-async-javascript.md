---
title: "Async JavaScript: Callback, Promise, dan async/await"
slug: async-javascript-callback-promise-async-await
category: frontend
type: panduan
level: pemula
published: true
excerpt: "Hal yang butuh waktu (jaringan, file, timer) tidak boleh memblokir program. Begini cara JavaScript menanganinya."
goal: "Menulis kode asinkron yang benar dan menghindari kesalahan umum."
benefits: "Memahami error 'undefined' akibat lupa await dan data yang belum siap."
tags: [javascript, async, promise]
links:
  - label: "MDN: Promise"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise"
  - label: "MDN: async function"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function"
---

## Masalahnya

JavaScript menjalankan kode satu per satu pada satu thread. Operasi lambat dijalankan di latar, dan hasilnya dikabarkan belakangan.

## Evolusi

```js
// 1. Callback (rawan bertingkat-tingkat)
ambilUser(1, (user) => ambilPesanan(user.id, (pesanan) => { /* ... */ }));

// 2. Promise
ambilUser(1).then((u) => ambilPesanan(u.id)).then(console.log).catch(console.error);

// 3. async/await (paling mudah dibaca)
async function tampil() {
  try {
    const user = await ambilUser(1);
    const pesanan = await ambilPesanan(user.id);
    console.log(pesanan);
  } catch (err) {
    console.error("Gagal:", err);
  }
}
```

## Paralel vs berurutan

```js
// Berurutan: total waktu = a + b
const a = await ambilA();
const b = await ambilB();

// Paralel (jika tidak saling bergantung): total waktu ≈ yang terlama
const [x, y] = await Promise.all([ambilA(), ambilB()]);
```

## Kesalahan umum

1. **Lupa `await`**: hasilnya adalah Promise, bukan datanya.
2. **`forEach` dengan `async`**: `forEach` tidak menunggu. Gunakan `for...of` atau `Promise.all(array.map(...))`.
3. **Tidak menangani error**: bungkus dengan `try/catch` atau `.catch`.
4. **Mengira `await` hanya menunda baris itu**: ia menjeda fungsi `async` yang bersangkutan, bukan seluruh program.
