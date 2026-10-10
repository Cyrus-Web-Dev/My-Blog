---
title: "Merancang Skema Database yang Tahan Lama: Pola, Anti-Pola, dan Migrasi Aman"
slug: merancang-skema-database-tahan-lama
category: database
type: deep-dive
level: mahir
published: true
excerpt: "Skema yang buruk menjadi beban bertahun-tahun. Berikut keputusan desain yang paling berdampak dan cara mengubahnya tanpa downtime."
goal: "Memberi pedoman merancang skema relasional yang konsisten, mudah berevolusi, dan aman dimigrasi."
benefits: "Data lebih bersih, bug integritas berkurang, dan perubahan skema tidak menakutkan."
challenges: "Banyak keputusan adalah kompromi; yang penting disadari, dicatat, dan diuji dengan data nyata."
tags: [database, skema, postgresql, migrasi, desain]
links:
  - label: "PostgreSQL: Data Types"
    url: "https://www.postgresql.org/docs/current/datatype.html"
  - label: "PostgreSQL: Constraints"
    url: "https://www.postgresql.org/docs/current/ddl-constraints.html"
---

## 1. Pilih tipe data dengan sengaja

- **Uang**: `numeric(p,s)`, bukan `float`. Atau simpan integer satuan terkecil (sen) dengan konsisten.
- **Waktu**: `timestamptz` (menyimpan titik waktu absolut), bukan `timestamp` tanpa zona, kecuali kamu benar-benar paham alasannya.
- **Teks**: `text` cukup di PostgreSQL; batas panjang lewat constraint jika memang aturan bisnis.
- **Boolean** untuk ya/tidak, bukan `smallint` atau string.
- **Pengenal**: `bigint identity` (ringkas, berurutan) atau `uuid` (sulit ditebak, cocok untuk ID yang terpapar di URL atau dibuat di banyak tempat). Pilih sadar tradeoff-nya.

## 2. Biarkan database menjaga integritas

Aturan yang hanya ada di kode aplikasi akan dilanggar suatu hari (skrip, impor, bug). Terapkan di database:

```sql
create table faktur (
  id bigint generated always as identity primary key,
  nomor text not null unique,
  supplier_id bigint not null references supplier(id),
  total numeric(18,2) not null check (total >= 0),
  status text not null check (status in ('draft','diposting','dibatalkan')),
  dibuat timestamptz not null default now()
);
```

`NOT NULL`, `UNIQUE`, `CHECK`, dan foreign key adalah dokumentasi yang ditegakkan.

## 3. Nama dan konvensi

Konsisten: huruf kecil `snake_case`, bentuk tunggal atau jamak (pilih satu), nama FK `<tabel>_id`, kolom waktu seragam (`dibuat`, `diubah`). Konsistensi mengalahkan selera.

## 4. Anti-pola yang sering muncul

- **Entity-Attribute-Value (EAV)**: tabel `(entitas, atribut, nilai)` yang terlihat fleksibel tetapi membuat query, tipe, dan integritas sangat sulit.
- **Kolom berisi daftar** ("1,5,9") alih-alih tabel penghubung.
- **Satu tabel serba bisa** dengan banyak kolom nullable untuk jenis yang berbeda.
- **Memakai `jsonb` sebagai pengganti desain relasional.** `jsonb` bagus untuk atribut yang benar-benar bervariasi atau data eksternal, bukan untuk data inti yang di-join dan difilter terus-menerus.
- **Enum teks tanpa constraint**, sehingga muncul nilai "Aktif", "aktif", "AKTIF".

## 5. Penghapusan: keras, lunak, atau arsip

- **Hapus keras** sederhana, tetapi data hilang.
- **Hapus lunak** (`deleted_at`) menjaga riwayat, tetapi semua query dan unique constraint harus memperhitungkannya (mis. *partial unique index* `where deleted_at is null`).
- Untuk data keuangan, lebih baik **pembatalan/pembalikan** yang tercatat daripada menghapus.

## 6. Data historis dan audit

Salin nilai yang harus tetap seperti saat transaksi (harga, nama, tarif) ke dokumen transaksi. Pertimbangkan tabel audit atau trigger untuk perubahan data sensitif.

## 7. Index dengan alasan

Index kolom FK dan kolom yang sering difilter/diurutkan. Verifikasi dengan `EXPLAIN` dan pantau yang tak terpakai.

## 8. Migrasi tanpa downtime: pola expand/contract

Perubahan yang merusak dibagi tahap:

1. **Expand**: tambah kolom/tabel baru (nullable atau dengan default), tanpa mengubah yang lama.
2. **Dual write / backfill**: aplikasi menulis ke keduanya; isi data lama secara bertahap (per batch).
3. **Migrasi pembacaan**: aplikasi mulai membaca dari struktur baru.
4. **Contract**: setelah yakin, hapus kolom lama dan terapkan `NOT NULL`.

Catatan keamanan operasional:

- Operasi tertentu (`ALTER TABLE` yang menulis ulang tabel, membuat index biasa) bisa mengunci tabel. Pelajari `CREATE INDEX CONCURRENTLY` dan perilaku kunci versi PostgreSQL-mu.
- Setiap migrasi harus bisa **dibalik** atau punya rencana pemulihan; uji di salinan data produksi.
- Pisahkan migrasi skema dari rilis kode yang bergantung padanya.

## Daftar periksa

- [ ] Tipe uang dan waktu tepat.
- [ ] Constraint menegakkan aturan inti.
- [ ] FK ber-index, relasi N-N lewat tabel penghubung.
- [ ] Strategi penghapusan dan audit jelas.
- [ ] Migrasi bertahap dan teruji.
- [ ] Skema terdokumentasi (diagram sederhana + catatan keputusan).

> 📸 **TODO (opsional):** tambahkan diagram ERD skema nyata milikmu (sensor nama sensitif).
