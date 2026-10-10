---
title: "Membuat REST API di Next.js dengan Route Handler"
slug: membuat-rest-api-nextjs-route-handler
category: api
type: panduan
level: menengah
published: true
excerpt: "Next.js bukan hanya frontend. Route Handler memungkinkanmu membuat endpoint API langsung di proyek yang sama."
goal: "Membuat endpoint CRUD dengan validasi dan penanganan error."
benefits: "Satu repositori untuk UI dan API."
challenges: "Aturan caching dan API dinamis bisa berbeda antar versi Next.js; cek dokumentasi versimu."
tags: [nextjs, api, route-handler, backend]
links:
  - label: "Next.js: Route Handlers"
    url: "https://nextjs.org/docs/app/building-your-application/routing/route-handlers"
---

## Struktur

```
src/app/api/catatan/route.ts          → /api/catatan
src/app/api/catatan/[id]/route.ts     → /api/catatan/:id
```

## Daftar dan tambah

```ts
// src/app/api/catatan/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

const skema = z.object({ isi: z.string().min(1).max(500) });

export async function GET() {
  const data = await db.catatan.semua();
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const hasil = skema.safeParse(await req.json().catch(() => null));
  if (!hasil.success) {
    return NextResponse.json({ errors: hasil.error.flatten().fieldErrors }, { status: 422 });
  }
  const baru = await db.catatan.buat(hasil.data);
  return NextResponse.json(baru, { status: 201 });
}
```

## Parameter dinamis

Pada Next.js 15, `params` bersifat asinkron:

```ts
// src/app/api/catatan/[id]/route.ts
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await db.catatan.cari(id);
  if (!item) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  return NextResponse.json(item);
}
```

## Checklist

- Validasi input (Zod) dan kembalikan status yang tepat (201, 404, 422).
- Periksa autentikasi dan **otorisasi per objek** di setiap handler.
- Jangan membocorkan detail error internal.
- Untuk data milik server yang dipakai halaman, pertimbangkan memanggil fungsi data langsung dari Server Component alih-alih memanggil API sendiri lewat HTTP.
