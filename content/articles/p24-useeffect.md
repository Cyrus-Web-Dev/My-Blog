---
title: "useEffect: Kapan Perlu dan Kapan Tidak Perlu"
slug: useeffect-kapan-perlu-kapan-tidak
category: framework
type: panduan
level: menengah
published: true
excerpt: "useEffect sering dipakai berlebihan. Ia untuk menyinkronkan dengan sistem di luar React, bukan untuk semua hal."
goal: "Memakai useEffect hanya saat memang dibutuhkan dan menulisnya dengan benar."
benefits: "Komponen lebih sederhana, bug render ganda dan loop tak terbatas berkurang."
tags: [react, hooks, useeffect, frontend]
links:
  - label: "React: You Might Not Need an Effect"
    url: "https://react.dev/learn/you-might-not-need-an-effect"
  - label: "React: useEffect"
    url: "https://react.dev/reference/react/useEffect"
---

## Untuk apa

Effect menyinkronkan komponen dengan **sistem eksternal**: langganan event browser, timer, koneksi WebSocket, widget non-React, atau pengambilan data (bila tidak memakai pustaka khusus).

## Yang sebaiknya TIDAK memakai effect

**1. Nilai turunan** dari props/state: hitung saat render.

```jsx
// Kurang baik
const [total, setTotal] = useState(0);
useEffect(() => setTotal(items.reduce((a, i) => a + i.harga, 0)), [items]);

// Baik
const total = items.reduce((a, i) => a + i.harga, 0);
```

**2. Respons terhadap aksi pengguna**: letakkan di event handler (`onClick`, `onSubmit`), bukan di effect.

**3. Mereset state saat prop berubah**: gunakan `key` pada komponen.

## Menulis effect dengan benar

```jsx
useEffect(() => {
  const onResize = () => setLebar(window.innerWidth);
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize); // pembersihan
}, []);
```

- Setiap nilai reaktif yang dipakai di dalam effect harus ada di array dependensi. Biarkan linter (`react-hooks/exhaustive-deps`) membantumu.
- Selalu sediakan **fungsi pembersih** untuk langganan dan timer.
- Pada mode Strict di pengembangan, effect dijalankan dua kali untuk membantu menemukan bug pembersihan; itu disengaja.

## Pengambilan data

Jika memungkinkan, ambil data di Server Component (Next.js) atau gunakan pustaka seperti TanStack Query, yang mengurus cache, status memuat, dan pembatalan. Effect mentah mudah menghasilkan *race condition* (respons lama menimpa yang baru).
