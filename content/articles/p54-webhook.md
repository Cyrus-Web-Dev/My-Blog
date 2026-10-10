---
title: "Webhook: Konsep dan Cara Menerimanya dengan Aman"
slug: webhook-konsep-dan-implementasi-aman
category: api
type: panduan
level: menengah
published: true
excerpt: "Alih-alih terus menanyakan 'sudah bayar belum?', biarkan layanan lain menelepon balik saat ada kejadian. Itulah webhook."
goal: "Memahami webhook dan menerapkan verifikasi serta penanganan yang andal."
benefits: "Integrasi real-time yang efisien dan aman dari pemalsuan."
tags: [webhook, api, keamanan, integrasi]
links:
  - label: "Stripe: Webhook signatures (contoh praktik umum)"
    url: "https://docs.stripe.com/webhooks#verify-events"
---

## Polling vs webhook

- **Polling**: kamu bertanya berulang ("sudah selesai?"). Boros dan lambat.
- **Webhook**: penyedia mengirim `POST` ke URL-mu saat kejadian terjadi.

## Menerima webhook

```ts
// POST /api/webhook/pembayaran
export async function POST(req: Request) {
  const bodyMentah = await req.text();            // butuh teks mentah untuk tanda tangan
  const tandaTangan = req.headers.get("x-signature") ?? "";

  if (!verifikasi(bodyMentah, tandaTangan, process.env.WEBHOOK_SECRET!)) {
    return new Response("Tanda tangan tidak valid", { status: 401 });
  }

  const event = JSON.parse(bodyMentah);
  await antrekan(event);                           // proses lambat di latar belakang
  return new Response("ok", { status: 200 });      // balas cepat
}
```

## Verifikasi tanda tangan (HMAC)

```ts
import { createHmac, timingSafeEqual } from "node:crypto";

function verifikasi(body: string, sig: string, secret: string) {
  const hitung = createHmac("sha256", secret).update(body).digest("hex");
  const a = Buffer.from(hitung), b = Buffer.from(sig);
  return a.length === b.length && timingSafeEqual(a, b);
}
```

Format header dan cara hitung berbeda per penyedia; **ikuti dokumentasi mereka**.

## Praktik yang andal

1. **Balas 2xx cepat**, lalu proses di antrean; penyedia akan mencoba ulang bila lambat atau gagal.
2. **Idempoten**: event yang sama bisa datang lebih dari sekali; simpan ID event yang sudah diproses.
3. **Cek cap waktu** untuk menolak pemutaran ulang (replay).
4. **Jangan percaya isi** begitu saja untuk keputusan penting; bila perlu, konfirmasi status ke API penyedia.
5. Jangan mengurutkan logika dengan asumsi event tiba berurutan.
6. Uji lokal dengan terowongan (mis. ngrok) atau alat bawaan penyedia.
