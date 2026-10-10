---
title: "Panduan Lengkap Server Components di Next.js (App Router)"
slug: panduan-lengkap-server-components-nextjs
category: framework
type: deep-dive
level: mahir
published: true
date: 2026-10-03
excerpt: "Server Components mengubah cara kita membagi pekerjaan antara server dan browser. Panduan ini membahas konsep, pola, dan jebakannya."
goal: "Memahami kapan memakai Server Component, kapan Client Component, dan bagaimana menyusunnya dengan benar."
benefits: "Bundle JavaScript lebih kecil, pengambilan data lebih sederhana, dan halaman lebih cepat tampil."
challenges: "Batas server/client membingungkan di awal, dan aturan caching berubah antar versi Next.js sehingga dokumentasi versi yang dipakai harus selalu dicek."
tags: [nextjs, react, server-components, performa]
links:
  - label: "Next.js: Server and Client Components"
    url: "https://nextjs.org/docs/app/building-your-application/rendering/server-components"
  - label: "React: Server Components"
    url: "https://react.dev/reference/rsc/server-components"
---

> ℹ️ Artikel ini mengacu pada App Router Next.js. Perilaku caching dan API tertentu berbeda antar versi mayor, jadi cocokkan dengan dokumentasi versi yang kamu pakai.

## Ide dasarnya

Di App Router, komponen secara bawaan adalah **Server Component**: dirender di server, dan kodenya **tidak dikirim** ke browser. Hasilnya dikirim sebagai HTML plus data yang dibutuhkan React. Komponen yang membutuhkan interaksi (state, event handler, efek, API browser) ditandai `"use client"` dan menjadi **Client Component**.

| | Server Component | Client Component |
|---|---|---|
| Akses database/secret | Ya | Tidak (jangan!) |
| `useState`, `useEffect` | Tidak | Ya |
| Event handler (`onClick`) | Tidak | Ya |
| JavaScript dikirim ke browser | Tidak | Ya |

## Mengambil data langsung di komponen

Server Component boleh `async`, sehingga tidak perlu `useEffect` dan state loading:

```tsx
// app/artikel/page.tsx  (Server Component)
import { getPosts } from "@/lib/posts";

export default async function Page() {
  const posts = await getPosts();
  return <ul>{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

Query database, pemanggilan API internal, dan penggunaan kunci rahasia aman karena kode ini tidak pernah sampai ke browser.

## Dorong batas client sedekat mungkin ke daun

`"use client"` menjadikan komponen itu **dan semua yang diimpornya** bagian dari bundel client. Jangan menandai seluruh halaman; tandai hanya bagian interaktifnya.

```tsx
// Buruk: seluruh halaman jadi client hanya demi tombol like
"use client";
export default function Page() { /* ... */ }

// Baik: halaman tetap server, hanya tombol yang client
import { LikeButton } from "./like-button"; // "use client" ada di file ini
export default async function Page() {
  const post = await getPost();
  return (<article><h1>{post.title}</h1><LikeButton id={post.id} /></article>);
}
```

## Komposisi: Server Component di dalam Client Component

Client Component tidak boleh mengimpor Server Component, tetapi boleh menerimanya sebagai `children` atau props:

```tsx
// client-shell.tsx
"use client";
export function Panel({ children }: { children: React.ReactNode }) {
  const [buka, setBuka] = useState(true);
  return buka ? <div>{children}</div> : null;
}

// page.tsx (server)
<Panel><DataBerat /></Panel>   // DataBerat tetap dirender di server
```

## Props harus bisa diserialisasi

Data yang melintasi batas server ke client harus berupa nilai yang bisa diserialisasi (string, angka, objek polos, array, dll). Fungsi biasa, instance class, atau koneksi database tidak bisa dikirim sebagai props ke Client Component.

## Hindari waterfall

Jika dua pengambilan data tidak saling bergantung, jalankan paralel:

```tsx
const [user, posts] = await Promise.all([getUser(), getPosts()]);
```

Mengawaitnya berurutan membuat total waktu menjadi jumlah keduanya.

## Streaming dengan Suspense dan loading.tsx

Bagian halaman yang lambat bisa dibungkus `<Suspense>` agar sisanya tampil lebih dulu:

```tsx
<Suspense fallback={<Skeleton />}>
  <KomentarLambat />
</Suspense>
```

File `loading.tsx` pada sebuah segmen rute memberi efek serupa untuk seluruh segmen.

## API dinamis dan halaman dinamis

Membaca `cookies()`, `headers()`, atau `searchParams` membuat rute dirender per permintaan (dinamis). Pada Next.js 15, API-API ini bersifat asinkron:

```tsx
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
}
```

## Caching: periksa versi

Aturan caching `fetch` dan route handler berubah antara versi (Next.js 15 mengubah beberapa default menjadi tidak di-cache). Jangan menghafal; baca bagian caching di dokumentasi versimu dan tentukan strategi eksplisit (`revalidate`, tag, atau `no-store`).

## Menjaga kode server tetap di server

Pasang paket `server-only` pada modul yang tidak boleh masuk bundel client:

```ts
import "server-only";
```

Jika modul itu terimpor dari Client Component, build akan gagal, bukan membocorkan rahasia.

## Kesalahan yang sering terjadi

1. Memakai `useState`/`onClick` di Server Component, lalu bingung dengan pesan error.
2. Menandai terlalu banyak `"use client"` sehingga manfaat server hilang.
3. Mengirim data sangat besar sebagai props ke Client Component.
4. Mengakses `window`/`localStorage` di komponen yang dirender server.
5. Mengira data di-cache padahal tidak (atau sebaliknya).

## Ringkasan

Mulai dari server, tambahkan client hanya untuk interaktivitas, ambil data paralel, bungkus bagian lambat dengan Suspense, dan jaga rahasia dengan `server-only`.

> 📸 **TODO (opsional):** tambahkan screenshot ukuran bundle sebelum dan sesudah memindahkan batas `"use client"` (misalnya dari keluaran `next build`), sebagai bukti milikmu sendiri.
