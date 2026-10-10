---
title: "Memory Leak di React: Tab Makin Berat Seiring Waktu"
slug: memory-leak-react-tab-makin-berat
category: frontend
type: studi-kasus
level: mahir
published: false
excerpt: "Aplikasi terasa lancar di awal, lalu melambat setelah dipakai lama. Penyebab klasiknya: langganan yang tidak dibersihkan."
goal: "Menemukan dan menutup kebocoran memori di aplikasi React."
benefits: "Aplikasi tetap responsif pada sesi panjang."
challenges: "Kebocoran tidak menimbulkan error; gejalanya muncul pelan dan sulit dikaitkan ke satu penyebab."
tags: [react, performa, memory-leak, devtools]
links:
  - label: "Chrome DevTools: Memory"
    url: "https://developer.chrome.com/docs/devtools/memory-problems"
---

> 📸 **TODO (isi dengan bukti milikmu):** grafik memori yang terus naik di tab Performance/Memory, dan perbandingan heap snapshot sebelum dan sesudah perbaikan.

## Penyebab yang umum

1. **Event listener** pada `window`/`document` yang tidak dilepas.
2. **`setInterval`/`setTimeout`** yang tidak dibersihkan.
3. **Langganan** (WebSocket, observer, store) yang tidak di-unsubscribe.
4. **Request yang tidak dibatalkan** dan menyimpan hasil ke state komponen yang sudah hilang.
5. Cache atau array global yang terus bertambah tanpa batas.

## Pola yang bocor

```tsx
useEffect(() => {
  const id = setInterval(ambilNotifikasi, 5000);
  window.addEventListener("scroll", onScroll);
  // tidak ada pembersihan → tiap mount menambah timer dan listener baru
}, []);
```

## Perbaikan

```tsx
useEffect(() => {
  const id = setInterval(ambilNotifikasi, 5000);
  window.addEventListener("scroll", onScroll);
  return () => {
    clearInterval(id);
    window.removeEventListener("scroll", onScroll);
  };
}, []);
```

Untuk fetch:

```tsx
useEffect(() => {
  const kontrol = new AbortController();
  fetch(url, { signal: kontrol.signal }).then(/* ... */);
  return () => kontrol.abort();
}, [url]);
```

## Cara mendeteksi

1. DevTools → **Memory** → ambil *heap snapshot*.
2. Lakukan aksi berulang (buka-tutup halaman/modal beberapa kali).
3. Ambil snapshot kedua dan bandingkan; lihat objek yang jumlahnya terus naik (*detached DOM nodes*, closure).
4. Tab **Performance** dengan opsi Memory memperlihatkan pola gergaji (sehat) vs tangga naik (bocor).

## Pelajaran

Setiap `useEffect` yang membuka sesuatu harus menutupnya. Jadikan itu kebiasaan, bukan perbaikan belakangan.
