---
title: "Antrean dan Pekerjaan Latar Belakang: Retry, Idempotensi, dan Outbox"
slug: antrean-pekerjaan-latar-belakang-retry-idempotensi
category: backend
type: deep-dive
level: mahir
published: true
excerpt: "Antrean membuat aplikasi responsif dan tangguh, tetapi membawa aturan baru: pesan bisa datang dua kali, atau tidak berurutan."
goal: "Merancang pemrosesan latar belakang yang andal dan aman diulang."
benefits: "Efek ganda dan data hilang bisa dicegah sejak desain."
challenges: "Jaminan 'tepat sekali' sulit; yang realistis adalah 'minimal sekali' ditambah handler idempoten."
tags: [antrean, queue, idempotensi, arsitektur, backend]
links:
  - label: "Laravel: Queues"
    url: "https://laravel.com/docs/queues"
  - label: "BullMQ"
    url: "https://docs.bullmq.io/"
---

## Mengapa antrean

Pekerjaan lambat atau tak penting untuk respons (kirim email, buat laporan, proses gambar, panggil API eksternal) dipindahkan ke proses latar belakang. Request cepat selesai, lonjakan beban diratakan, dan kegagalan sementara bisa dicoba ulang.

## Jaminan pengiriman

- **At-most-once**: pesan dikirim paling banyak sekali; bisa hilang.
- **At-least-once**: dijamin sampai, tetapi bisa **terkirim lebih dari sekali**. Ini yang umum dipakai.
- **Exactly-once**: sulit dicapai secara umum; biasanya didekati dengan at-least-once + **idempotensi**.

## Idempotensi: menjalankan dua kali = efek sekali

Strategi:

1. **Kunci idempotensi**: simpan ID pesan/operasi yang sudah diproses, lalu lewati bila muncul lagi.

```sql
create table operasi_selesai (kunci text primary key, selesai_pada timestamptz default now());
```

```ts
const dimasukkan = await db.query(
  "insert into operasi_selesai (kunci) values ($1) on conflict do nothing returning kunci", [pesan.id]);
if (dimasukkan.rowCount === 0) return;   // sudah pernah diproses
await kerjakan(pesan);
```

(Perhatikan urutan dan transaksi agar kunci tidak tercatat jika pekerjaan gagal; letakkan penandaan dan efeknya dalam transaksi yang sama bila efeknya di database yang sama.)

2. **Operasi yang secara alami idempoten**: "set status = dibayar" aman diulang, "tambah saldo 100" tidak.
3. **Pakai kunci unik** di tabel hasil (mis. satu faktur per pesanan).

## Retry yang sehat

- **Backoff eksponensial dengan jitter**: jeda 1s, 2s, 4s, ... ditambah acak kecil agar banyak job tidak mencoba ulang serentak.
- **Batas percobaan**, lalu pindahkan ke **dead-letter queue (DLQ)** untuk diperiksa manual.
- Bedakan error **sementara** (timeout, 503) yang layak dicoba ulang dari **permanen** (data tidak valid) yang tidak.
- **Timeout** per job, agar job macet tidak menahan worker selamanya.

## Pesan racun (poison message)

Pesan yang selalu gagal tidak boleh memblokir seluruh antrean. Batasi percobaan dan pindahkan ke DLQ dengan konteks error.

## Urutan

Sebagian besar antrean tidak menjamin urutan global. Jika urutan penting per entitas (mis. per pesanan), gunakan partisi/kunci grup atau rancang agar status akhir tidak bergantung pada urutan (mis. membawa nomor versi).

## Masalah dua penulisan: pola outbox transaksional

Anggap kamu menyimpan pesanan **dan** mengirim pesan ke antrean. Jika simpan sukses tetapi kirim gagal (atau sebaliknya), data tidak konsisten. Solusi **outbox**:

1. Dalam **satu transaksi database**, simpan pesanan **dan** satu baris di tabel `outbox` (peristiwa yang akan dikirim).
2. Proses terpisah membaca `outbox`, mengirim ke antrean, lalu menandainya terkirim (at-least-once, sehingga konsumen harus idempoten).

```sql
create table outbox (
  id bigserial primary key,
  tipe text not null,
  payload jsonb not null,
  dibuat timestamptz default now(),
  terkirim_pada timestamptz
);
```

## Pemantauan

- **Kedalaman antrean** dan umur pesan tertua.
- Tingkat gagal, jumlah di DLQ, durasi job.
- Peringatan saat antrean menumpuk atau worker mati.

## Daftar periksa

- [ ] Setiap handler idempoten.
- [ ] Retry dengan backoff dan batas, ada DLQ.
- [ ] Timeout per job dan pemisahan error sementara/permanen.
- [ ] Efek di database dan peristiwa keluar terjaga dengan outbox bila perlu.
- [ ] Antrean dan DLQ dipantau.
- [ ] Worker direstart aman saat deploy (selesaikan job berjalan).
