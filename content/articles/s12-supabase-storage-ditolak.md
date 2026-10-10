---
title: "Upload ke Supabase Storage Ditolak: 'new row violates row-level security policy'"
slug: supabase-storage-upload-ditolak-rls
category: database
type: studi-kasus
level: menengah
published: false
excerpt: "Bucket sudah dibuat, kode upload sudah benar, tapi ditolak. Storage juga dilindungi RLS, lewat tabel storage.objects."
goal: "Mengunggah berkas dengan aman sesuai kebijakan akses."
benefits: "Aturan akses berkas terkelola di database, konsisten dengan data aplikasi."
challenges: "Policy untuk Storage mudah terlupa karena letaknya terpisah dari tabel aplikasi."
tags: [supabase, storage, rls, upload]
links:
  - label: "Supabase: Storage access control"
    url: "https://supabase.com/docs/guides/storage/security/access-control"
---

> 📸 **TODO (isi dengan bukti milikmu):** pesan error di Network/Console dan halaman Policies untuk `storage.objects` sebelum dan sesudah.

## Gejala

```
StorageApiError: new row violates row-level security policy
```

## Penyebab

File yang diunggah dicatat sebagai baris di tabel `storage.objects`, dan tabel itu memakai RLS. **Bucket publik hanya membuka *pembacaan*; tidak otomatis mengizinkan unggah.** Tanpa policy `insert`, unggahan ditolak.

## Perbaikan

Izinkan pengguna login mengunggah ke bucket tertentu, dan batasi ke folder miliknya:

```sql
create policy "unggah ke folder sendiri"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatar'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "baca avatar"
on storage.objects for select
using ( bucket_id = 'avatar' );
```

Di client, gunakan jalur yang cocok dengan policy:

```ts
const path = `${user.id}/profil.png`;
await supabase.storage.from("avatar").upload(path, file);
```

## Catatan tambahan

- **`upsert: true`** (menimpa berkas) membutuhkan policy `select` dan `update` juga, bukan hanya `insert`.
- Pastikan pengguna **sudah login** (token terkirim); sesi kosong berarti peran `anon`.
- Batasi ukuran dan tipe berkas di pengaturan bucket, dan validasi di aplikasi.
- Jangan memakai `service_role` di client demi menghindari error ini.
