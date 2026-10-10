---
title: "Mengatasi Race Condition di Supabase saat Update Stok Bersamaan"
slug: race-condition-supabase-update-stok
category: database
type: studi-kasus
level: menengah
published: false
date: 2026-09-11
excerpt: "Dua pengguna membeli barang yang sama di waktu hampir bersamaan, dan stok akhir salah. Ini penyebabnya dan cara memperbaikinya di level database."
goal: "Stok atau counter tetap akurat walau banyak permintaan masuk bersamaan."
benefits: "Tidak ada stok negatif atau update yang hilang, tanpa perlu locking rumit di sisi aplikasi."
challenges: "Pola baca-hitung-tulis dari client terlihat benar saat dites sendirian, sehingga bug baru muncul saat ada beban."
tags: [supabase, postgresql, race-condition, rpc]
links:
  - label: "Supabase: Database Functions"
    url: "https://supabase.com/docs/guides/database/functions"
  - label: "PostgreSQL: Concurrency Control"
    url: "https://www.postgresql.org/docs/current/mvcc.html"
---

> 📸 **TODO (isi dengan bukti milikmu):** screenshot hasil reproduksi, misalnya dua tab browser yang menekan tombol beli bersamaan, lalu tabel `produk` dengan stok yang salah. Beri caption "direproduksi ulang di lokal" bila memang dibuat ulang.

## Gejala

Stok awal 10. Dua pengguna masing-masing membeli 1 barang hampir bersamaan. Stok akhir seharusnya 8, tetapi tercatat 9.

## Penyebab

Pola ini rawan:

```ts
// 1. baca
const { data } = await supabase.from("produk").select("stok").eq("id", id).single();
// 2. hitung di aplikasi
const stokBaru = data.stok - 1;
// 3. tulis
await supabase.from("produk").update({ stok: stokBaru }).eq("id", id);
```

Kedua permintaan membaca angka 10, sama-sama menghitung 9, lalu sama-sama menulis 9. Satu pengurangan hilang (*lost update*).

## Solusi: biarkan database yang menghitung, secara atomik

Buat fungsi SQL yang mengurangi stok dalam satu perintah dan menolak bila tidak cukup:

```sql
create or replace function public.kurangi_stok(p_id uuid, p_qty int)
returns int
language plpgsql
as $$
declare
  sisa int;
begin
  update public.produk
     set stok = stok - p_qty
   where id = p_id and stok >= p_qty
  returning stok into sisa;

  if not found then
    raise exception 'Stok tidak cukup';
  end if;
  return sisa;
end $$;
```

Panggil dari client:

```ts
const { data, error } = await supabase.rpc("kurangi_stok", { p_id: id, p_qty: 1 });
```

Perintah `UPDATE ... SET stok = stok - 1` mengunci baris yang sedang diubah, sehingga permintaan kedua menunggu yang pertama selesai lalu membaca nilai terbaru. Kondisi `stok >= p_qty` sekaligus mencegah stok negatif.

## Alternatif: optimistic locking

Tambahkan kolom `versi`. Saat update, sertakan `where versi = <versi yang dibaca>` dan naikkan versinya. Jika tidak ada baris yang berubah, berarti ada orang lain yang mendahului, lalu ulangi atau beri tahu pengguna. Cocok untuk edit dokumen, kurang cocok untuk counter dengan lalu lintas tinggi.

## Pelajaran

Logika yang bergantung pada nilai terbaru sebaiknya ditempatkan di database (satu pernyataan atau transaksi), bukan di aplikasi dengan pola baca lalu tulis.
