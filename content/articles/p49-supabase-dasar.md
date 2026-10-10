---
title: "Supabase Dasar: Auth, Database, dan Storage dalam Satu Alur"
slug: supabase-dasar-auth-database-storage
category: database
type: panduan
level: pemula
published: true
excerpt: "Supabase memberi PostgreSQL, autentikasi, penyimpanan berkas, dan API otomatis. Begini peta dasarnya."
goal: "Memahami komponen utama Supabase dan cara memakainya dari JavaScript."
benefits: "Backend fungsional tanpa membangun server dari nol."
challenges: "Keamanan bergantung pada Row Level Security; wajib diaktifkan dan diuji."
tags: [supabase, postgresql, auth, storage]
links:
  - label: "Supabase docs"
    url: "https://supabase.com/docs"
---

## Komponen

- **Database**: PostgreSQL penuh, dengan API otomatis (PostgREST).
- **Auth**: email/password, magic link, OAuth, dan sesi.
- **Storage**: bucket untuk berkas.
- **Realtime** dan **Edge Functions** untuk kebutuhan lanjutan.

## Memulai klien

```ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

*Anon key* boleh ada di client **jika RLS aktif**. Kunci `service_role` tidak boleh.

## CRUD

```ts
// baca
const { data, error } = await supabase.from("catatan").select("*").order("dibuat", { ascending: false });

// tambah
await supabase.from("catatan").insert({ isi: "Halo" });

// ubah dan hapus
await supabase.from("catatan").update({ isi: "Baru" }).eq("id", 1);
await supabase.from("catatan").delete().eq("id", 1);
```

Selalu periksa `error`.

## Login

```ts
await supabase.auth.signUp({ email, password });
await supabase.auth.signInWithPassword({ email, password });
const { data: { user } } = await supabase.auth.getUser();
```

## Wajib: aktifkan RLS

```sql
alter table public.catatan enable row level security;
create policy "milik sendiri" on public.catatan for all to authenticated
using ( (select auth.uid()) = user_id ) with check ( (select auth.uid()) = user_id );
```

Tanpa ini, data bisa terbuka atau (bila RLS aktif tanpa policy) tampak kosong.
