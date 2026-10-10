---
title: "Fetch API dan Menangani Error dengan Benar"
slug: fetch-api-menangani-error-dengan-benar
category: api
type: panduan
level: pemula
published: true
excerpt: "fetch tidak melempar error untuk 404 atau 500. Banyak bug berawal dari asumsi ini."
goal: "Menulis pemanggilan API yang tangguh: cek status, timeout, dan pesan error yang jelas."
benefits: "Aplikasi tidak diam saja saat API gagal."
tags: [fetch, api, javascript, error-handling]
links:
  - label: "MDN: Fetch API"
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API"
  - label: "MDN: AbortController"
    url: "https://developer.mozilla.org/en-US/docs/Web/API/AbortController"
---

## Fakta penting

`fetch` hanya **menolak (reject)** Promise saat terjadi kegagalan jaringan. Respons 404 atau 500 tetap dianggap "berhasil" sampai kamu memeriksanya.

## Pola yang aman

```js
async function ambilJSON(url, opsi = {}) {
  const res = await fetch(url, opsi);
  if (!res.ok) {
    const teks = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${teks.slice(0, 200)}`);
  }
  return res.json();
}

try {
  const data = await ambilJSON("/api/pengadaan");
} catch (err) {
  tampilkanPesan("Data gagal dimuat. Coba lagi.");
  console.error(err);
}
```

## Timeout dan pembatalan

```js
const kontrol = new AbortController();
const timer = setTimeout(() => kontrol.abort(), 8000);
try {
  const res = await fetch(url, { signal: kontrol.signal });
} finally {
  clearTimeout(timer);
}
```

## Mengirim JSON

```js
await fetch("/api/pengadaan", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nama: "Laptop" }),
});
```

## Tiga keadaan UI yang jangan dilupakan

**Memuat**, **gagal** (dengan tombol coba lagi), dan **kosong**. Antarmuka yang hanya memikirkan keadaan sukses terasa rapuh.
