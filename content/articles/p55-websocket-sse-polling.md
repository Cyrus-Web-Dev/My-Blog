---
title: "WebSocket vs Server-Sent Events vs Polling: Pilih yang Mana?"
slug: websocket-vs-sse-vs-polling
category: api
type: panduan
level: menengah
published: true
excerpt: "Butuh data yang terus diperbarui? Tiga pendekatan ini punya kecocokan berbeda. Jangan langsung ke yang paling rumit."
goal: "Memilih mekanisme pembaruan real-time yang sesuai kebutuhan."
benefits: "Solusi yang lebih sederhana dan hemat sumber daya."
tags: [realtime, websocket, sse, api]
links:
  - label: "MDN: WebSockets API"
    url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API"
  - label: "MDN: Server-sent events"
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events"
---

## Polling

Client bertanya berkala.

```js
setInterval(async () => {
  const res = await fetch("/api/notifikasi");
  tampilkan(await res.json());
}, 10000);
```

**Kelebihan**: paling sederhana, bekerja di mana saja. **Kekurangan**: ada jeda, boros request jika tak ada perubahan.

## Server-Sent Events (SSE)

Server mendorong data satu arah lewat satu koneksi HTTP.

```js
const es = new EventSource("/api/stream");
es.onmessage = (e) => tampilkan(JSON.parse(e.data));
```

**Kelebihan**: sederhana, otomatis menyambung ulang, bekerja lewat HTTP biasa. **Kekurangan**: satu arah (server → client) dan batasan jumlah koneksi per domain pada HTTP/1.1.

**Cocok untuk**: notifikasi, progres pekerjaan, feed, harga langsung.

## WebSocket

Koneksi dua arah yang terus terbuka.

```js
const ws = new WebSocket("wss://contoh.com/ws");
ws.onmessage = (e) => tampilkan(e.data);
ws.send(JSON.stringify({ tipe: "ketik" }));
```

**Kelebihan**: dua arah, latensi rendah. **Kekurangan**: lebih rumit (penyambungan ulang, autentikasi, skala, proxy/load balancer perlu mendukung).

**Cocok untuk**: chat, kolaborasi, game, dasbor interaktif.

## Cara memilih

1. Tidak butuh real-time ketat? **Polling** dengan interval wajar.
2. Hanya server mengirim ke client? **SSE**.
3. Dua arah dengan frekuensi tinggi? **WebSocket**.
4. Ingin cepat? Pertimbangkan layanan siap pakai (mis. Supabase Realtime) daripada membangun infrastruktur sendiri.

## Hal yang sering terlupa

Autentikasi koneksi, penyambungan ulang dengan backoff, membersihkan koneksi saat komponen dilepas, dan batas koneksi serentak di server.
