---
title: "Arsitektur ERP Kecil: Alur Inventaris, Pengadaan, Keuangan, SDM, Payroll, dan Budgeting"
slug: arsitektur-erp-kecil-inventaris-pengadaan-keuangan
category: framework
type: deep-dive
level: mahir
published: true
date: 2026-10-05
excerpt: "ERP bukan kumpulan menu, melainkan satu aliran data yang terhubung. Berikut cara memikirkan modul, data induk, dan jurnal akuntansinya."
goal: "Memberi peta arsitektur untuk membangun ERP skala kecil-menengah yang konsisten dan bisa diaudit."
benefits: "Data antar modul selalu sinkron, laporan keuangan bisa dipercaya, dan modul baru mudah ditambahkan."
challenges: "Modul saling bergantung; kesalahan desain di data induk atau jurnal menjalar ke seluruh sistem."
tags: [erp, arsitektur, akuntansi, laravel, database]
links:
  - label: "Martin Fowler: MonolithFirst"
    url: "https://martinfowler.com/bliki/MonolithFirst.html"
  - label: "PostgreSQL: Transactions"
    url: "https://www.postgresql.org/docs/current/tutorial-transactions.html"
---

> Artikel ini membahas pola umum. Detail akuntansi (standar yang dipakai, pajak, kebijakan perusahaan) berbeda per organisasi, jadi selalu libatkan akuntan untuk aturan bisnisnya.

## Gambaran besar

ERP mengikat proses bisnis menjadi satu aliran. Contoh paling klasik, **pengadaan sampai pembayaran**:

```
Permintaan Pembelian (PR)
        │  persetujuan + cek anggaran
        ▼
Pesanan Pembelian (PO)
        │
        ▼
Penerimaan Barang (GR)  ──►  Stok bertambah (inventaris)
        │
        ▼
Faktur Supplier (Invoice)  ──►  Jurnal hutang (keuangan)
        │
        ▼
Pembayaran  ──►  Jurnal kas/bank, hutang berkurang
```

Setiap langkah mengubah data di lebih dari satu modul. Karena itu arsitektur dan konsistensi data adalah inti persoalan.

## Modul dan tanggung jawabnya

- **Data induk (master data)**: barang, supplier, pelanggan, karyawan, departemen, akun (COA). Dipakai semua modul.
- **Inventaris**: stok masuk/keluar, gudang, penilaian persediaan.
- **Pengadaan**: PR, PO, penerimaan, faktur.
- **Keuangan/akuntansi**: bagan akun, jurnal, buku besar, laporan, penutupan periode.
- **SDM**: data karyawan, struktur organisasi, absensi/cuti.
- **Payroll**: perhitungan gaji, tunjangan, potongan, slip, jurnal gaji.
- **Budgeting**: anggaran per departemen/akun/periode, realisasi vs anggaran.

## Pola 1: satu sumber kebenaran untuk data induk

Jangan menyalin nama supplier ke setiap modul. Simpan sekali, rujuk lewat ID. Untuk dokumen transaksi (PO, faktur), simpan juga **salinan nilai penting saat transaksi** (harga, nama, tarif) karena data induk bisa berubah, sedangkan dokumen lama tidak boleh ikut berubah.

## Pola 2: jurnal akuntansi double-entry sebagai fondasi

Setiap peristiwa keuangan menghasilkan jurnal dengan aturan tetap: **total debit = total kredit**.

```sql
create table jurnal (
  id bigserial primary key,
  nomor text unique not null,
  tanggal date not null,
  keterangan text,
  sumber_tipe text,        -- 'faktur', 'pembayaran', 'payroll', ...
  sumber_id bigint,        -- rujukan ke dokumen asal
  diposting boolean not null default false
);

create table jurnal_baris (
  id bigserial primary key,
  jurnal_id bigint not null references jurnal(id),
  akun_id bigint not null,
  debit  numeric(18,2) not null default 0 check (debit  >= 0),
  kredit numeric(18,2) not null default 0 check (kredit >= 0),
  check ((debit = 0) <> (kredit = 0))   -- salah satu saja yang terisi
);
```

Validasi keseimbangan di aplikasi **dan** (idealnya) di database, misalnya lewat trigger atau pemeriksaan saat posting.

Prinsip penting:

- Jurnal yang sudah **diposting tidak diubah**; koreksi dilakukan dengan **jurnal pembalik**.
- Pembuatan dokumen sumber dan jurnalnya terjadi dalam **satu transaksi database**: keduanya berhasil atau keduanya batal.
- Gunakan tipe **numeric/decimal**, bukan float, untuk uang.

## Pola 3: buku stok yang hanya bertambah (stock ledger)

Alih-alih hanya menyimpan angka stok saat ini, catat setiap pergerakan (masuk/keluar/penyesuaian) sebagai baris. Stok saat ini adalah hasil agregasi (atau kolom ringkasan yang dijaga konsisten). Keuntungannya: bisa diaudit dan dihitung ulang.

Tentukan metode penilaian persediaan (misalnya rata-rata bergerak atau FIFO) sesuai kebijakan perusahaan, dan hasilnya otomatis memicu jurnal persediaan/HPP.

Jaga konsistensi stok dari update bersamaan dengan operasi atomik di database (lihat topik *race condition*), bukan pola baca-hitung-tulis di aplikasi.

## Pola 4: kontrol anggaran di titik komitmen

Budgeting paling berguna bila terhubung ke proses, bukan hanya laporan. Cek saldo anggaran saat **PR/PO** (komitmen), bukan menunggu faktur (realisasi):

```
Sisa anggaran = Anggaran − Realisasi − Komitmen (PO terbuka)
```

Jika PO melebihi sisa, tolak atau minta persetujuan tambahan.

## Pola 5: payroll sebagai konsumen data SDM

Payroll mengambil data karyawan, absensi, tunjangan, dan potongan dari SDM, menghitung gaji per periode, lalu menghasilkan jurnal beban gaji dan kewajiban terkait. Simpan **hasil perhitungan per periode sebagai arsip tetap**; jangan menghitung ulang slip lama dari data yang sudah berubah. Aturan pajak dan iuran bersifat regulasi dan berubah, jadi pisahkan konfigurasi tarif dari kode.

## Pola 6: persetujuan bertingkat (approval workflow)

Dokumen seperti PR dan PO biasanya melewati status: `draft → diajukan → disetujui/ditolak → selesai`. Modelkan sebagai *state machine* dengan aturan transisi jelas, siapa yang boleh, dan catatan waktu serta pelaku untuk tiap perubahan.

## Pola 7: audit trail dan hak akses

- Catat siapa mengubah apa dan kapan pada data sensitif (jurnal, harga, gaji).
- Terapkan **RBAC** (peran) dengan prinsip hak akses minimum; pisahkan pembuat dan penyetuju (*segregation of duties*).
- Penghapusan data transaksi diganti pembatalan/pembalikan, bukan hapus permanen.

## Penutupan periode

Setelah periode ditutup, transaksi bertanggal di periode itu **dikunci**. Perubahan harus lewat jurnal penyesuaian di periode berjalan. Sediakan proses tutup dan buka kembali yang terbatas dan tercatat.

## Struktur kode: monolit modular dulu

Untuk ERP skala kecil-menengah, **monolit modular** biasanya lebih tepat daripada microservice: satu basis kode dan satu database (transaksi lintas modul mudah), dengan batas modul yang jelas.

```
app/
  Modules/
    Master/        data induk
    Inventaris/
    Pengadaan/
    Keuangan/      jurnal, buku besar, laporan
    SDM/
    Payroll/
    Anggaran/
  Shared/          peran, audit, penomoran dokumen
```

Aturan interaksi: modul lain **tidak** menulis langsung ke tabel modul lain. Mereka memanggil layanan atau memicu *event* (misalnya `FakturDiposting`) yang didengarkan modul Keuangan untuk membuat jurnal.

## Penomoran dokumen

Nomor dokumen (PO-2026-00042) harus unik, berurutan sesuai kebijakan, dan dibuat tanpa tabrakan saat beban bersamaan. Gunakan sekuens atau tabel penomoran dengan penguncian yang aman.

## Hal yang sering terlewat

1. Laporan lambat karena menghitung dari jutaan baris tanpa index atau ringkasan.
2. Zona waktu dan cut-off tanggal transaksi.
3. Pembulatan mata uang yang tidak konsisten antar modul.
4. Tidak ada mekanisme koreksi yang aman.
5. Impor data awal (saldo awal, stok awal) tanpa validasi.
6. Tidak memikirkan multi-cabang atau multi-mata-uang sejak awal bila memang akan dibutuhkan.

## Urutan membangun yang disarankan

1. Data induk dan hak akses.
2. Keuangan inti (COA, jurnal, laporan dasar).
3. Inventaris dan pengadaan, terhubung otomatis ke jurnal.
4. Budgeting dan kontrol anggaran.
5. SDM, lalu payroll.
6. Laporan dan dashboard.

> 📸 **TODO (isi dengan bukti milikmu):** karena kamu sudah menyelesaikan proyek ERP, tambahkan screenshot atau diagram dari sistemmu sendiri (alur PR→PO→GR→Faktur→Pembayaran, contoh jurnal otomatis, laporan anggaran vs realisasi). Sensor data sensitif sebelum dipublikasikan.
