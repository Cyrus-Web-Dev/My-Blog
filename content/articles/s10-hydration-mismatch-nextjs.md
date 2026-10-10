---
title: "Next.js Hydration Mismatch: Penyebab dan Cara Memperbaikinya"
slug: nextjs-hydration-mismatch-penyebab-dan-perbaikan
category: frontend
type: studi-kasus
level: menengah
published: false
excerpt: "Konsol memperingatkan bahwa HTML dari server berbeda dengan hasil render di browser. Biasanya sumbernya bisa dilacak."
goal: "Menghilangkan peringatan hydration dan memastikan tampilan konsisten."
benefits: "Menghindari UI yang berkedip, salah tampil, atau berperilaku aneh setelah dimuat."
challenges: "Pesan error sering tidak menunjuk baris tepatnya, dan sebagian penyebab berasal dari luar kode (ekstensi browser)."
tags: [nextjs, react, hydration, ssr]
links:
  - label: "Next.js: Hydration error"
    url: "https://nextjs.org/docs/messages/react-hydration-error"
  - label: "React: hydrateRoot"
    url: "https://react.dev/reference/react-dom/client/hydrateRoot"
---

> 📸 **TODO (isi dengan bukti milikmu):** screenshot pesan error di Console/overlay Next.js (diff HTML server vs client), lalu hasil setelah perbaikan.

## Gejala

```
Warning: Text content did not match. Server: "10/10/2026" Client: "10/9/2026"
```

atau "Hydration failed because the server rendered HTML didn't match the client".

## Cara kerja singkat

Server menghasilkan HTML. Di browser, React "menghidupkan" (hydrate) HTML itu dan **mengharapkan hasil render pertama identik**. Jika berbeda, React memperingatkan dan bisa membuang serta merender ulang bagian itu.

## Penyebab umum

1. **Nilai yang berbeda tiap render**: `Date.now()`, `new Date()` dengan zona waktu berbeda, `Math.random()`.
2. **Memeriksa lingkungan browser saat render**: `typeof window !== "undefined" ? A : B`, `localStorage`, ukuran layar.
3. **HTML tidak valid**: `<div>` di dalam `<p>`, `<a>` bersarang, `<tr>` tanpa `<tbody>` yang membuat browser mengoreksi struktur.
4. **Ekstensi browser** yang mengubah DOM sebelum hydration (uji di jendela incognito tanpa ekstensi).
5. Data berbeda antara server dan client.

## Perbaikan

**Nilai khusus client: render setelah mount**

```tsx
"use client";
import { useEffect, useState } from "react";

export function Waktu() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => setNow(new Date().toLocaleString("id-ID")), []);
  return <span>{now ?? "…"}</span>;
}
```

**Perbedaan kecil yang memang disengaja** (mis. cap waktu): `suppressHydrationWarning` pada elemen itu saja.

**Format tanggal/zona waktu**: tetapkan secara eksplisit (`timeZone: "Asia/Jakarta"`) di server dan client.

**Komponen yang hanya bisa jalan di browser**: muat dengan `dynamic(() => import(...), { ssr: false })` di dalam Client Component.

**HTML tidak valid**: perbaiki struktur elemen.

## Pelajaran

Render pertama harus murni dan deterministik. Hal yang bergantung pada browser atau waktu dipindahkan ke `useEffect`.
