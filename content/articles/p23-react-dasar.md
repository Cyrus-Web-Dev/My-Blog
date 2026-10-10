---
title: "Dasar React: Komponen, Props, dan State"
slug: dasar-react-komponen-props-state
category: framework
type: panduan
level: pemula
published: true
excerpt: "React membangun antarmuka dari potongan kecil yang bisa dipakai ulang. Tiga konsep ini adalah intinya."
goal: "Memahami komponen, props, state, dan render daftar di React."
benefits: "Fondasi untuk Next.js dan ekosistem React lainnya."
tags: [react, frontend, pemula, jsx]
links:
  - label: "React: Learn"
    url: "https://react.dev/learn"
  - label: "React: Thinking in React"
    url: "https://react.dev/learn/thinking-in-react"
---

## Komponen

Fungsi yang mengembalikan tampilan (JSX):

```jsx
function Sapaan({ nama }) {
  return <h1>Halo, {nama}!</h1>;
}
```

## Props: data masuk (hanya baca)

```jsx
<Sapaan nama="Ayu" />
```

Props mengalir dari induk ke anak. Komponen anak tidak mengubahnya.

## State: data yang berubah

```jsx
import { useState } from "react";

function Penghitung() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>Diklik {n} kali</button>;
}
```

Memanggil `setN` membuat React merender ulang komponen dengan nilai baru. **Jangan mengubah state langsung** (`n++`); selalu lewat setter.

## Render daftar

```jsx
<ul>
  {pelanggan.map((p) => (
    <li key={p.id}>{p.nama}</li>
  ))}
</ul>
```

`key` harus unik dan stabil (pakai ID, bukan indeks jika urutan bisa berubah).

## Cara berpikir

1. Pecah antarmuka menjadi komponen.
2. Tentukan state minimal yang benar-benar dibutuhkan.
3. Turunkan nilai lain dari state/props, jangan simpan duplikatnya.

Proyek latihan: daftar tugas dengan tambah, centang, hapus, dan filter.
