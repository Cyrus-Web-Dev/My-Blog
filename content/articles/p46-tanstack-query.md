---
title: "TanStack Query untuk Pemula: Mengelola Data dari Server"
slug: tanstack-query-untuk-pemula
category: framework
type: panduan
level: menengah
published: true
excerpt: "Berhenti menulis useEffect + useState + loading + error untuk setiap fetch. Biarkan pustaka mengurus cache dan status."
goal: "Memakai useQuery dan useMutation dengan benar."
benefits: "Kode pengambilan data jauh lebih ringkas dan konsisten."
tags: [tanstack-query, react, data-fetching, frontend]
links:
  - label: "TanStack Query docs"
    url: "https://tanstack.com/query/latest/docs/framework/react/overview"
---

## Pasang provider (sekali)

```tsx
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
```

## Membaca data

```tsx
const { data, isPending, error } = useQuery({
  queryKey: ["pelanggan", halaman],
  queryFn: async () => {
    const res = await fetch(`/api/pelanggan?halaman=${halaman}`);
    if (!res.ok) throw new Error("Gagal memuat");
    return res.json();
  },
});

if (isPending) return <p>Memuat…</p>;
if (error) return <p>{error.message}</p>;
```

**`queryKey`** mengidentifikasi data di cache; sertakan semua variabel yang memengaruhi hasil.

## Mengubah data

```tsx
const qc = useQueryClient();
const tambah = useMutation({
  mutationFn: (baru) => fetch("/api/pelanggan", { method: "POST", body: JSON.stringify(baru) }),
  onSuccess: () => qc.invalidateQueries({ queryKey: ["pelanggan"] }),
});
```

`invalidateQueries` menandai data lama kedaluwarsa sehingga diambil ulang.

## Yang didapat gratis

Cache, deduplikasi request, penyegaran saat jendela kembali fokus, retry otomatis, dan status memuat yang konsisten. Pahami `staleTime` (berapa lama data dianggap segar) untuk mengatur seberapa sering ia mengambil ulang.
