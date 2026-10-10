---
title: "Observability: Log, Metrik, dan Tracing untuk Aplikasi Web"
slug: observability-log-metrik-tracing-aplikasi-web
category: backend
type: deep-dive
level: mahir
published: true
excerpt: "Kamu tidak bisa memperbaiki yang tidak bisa kamu lihat. Observability membuat perilaku sistem di production terbaca."
goal: "Merancang pemantauan yang membantu menemukan masalah sebelum pengguna mengeluh."
benefits: "Waktu pemulihan lebih singkat dan keputusan berdasarkan data."
challenges: "Terlalu banyak data tanpa tujuan menghasilkan biaya tinggi dan kebisingan."
tags: [observability, logging, metrik, tracing, devops]
links:
  - label: "OpenTelemetry"
    url: "https://opentelemetry.io/docs/"
  - label: "Google SRE Book: Monitoring Distributed Systems"
    url: "https://sre.google/sre-book/monitoring-distributed-systems/"
---

## Tiga pilar

| Pilar | Pertanyaan yang dijawab |
|---|---|
| **Log** | Apa yang terjadi pada kejadian tertentu? |
| **Metrik** | Seberapa sehat sistem secara agregat dari waktu ke waktu? |
| **Trace** | Ke mana satu request mengalir dan di mana waktunya habis? |

## 1. Log yang berguna

- **Terstruktur (JSON)** agar bisa dicari dan difilter:

```json
{"level":"error","msg":"pembayaran gagal","pesanan_id":42,"request_id":"a1b2c3","durasi_ms":812}
```

- **Request/correlation ID** di setiap log agar satu request bisa dilacak di berbagai bagian.
- **Level yang bermakna**: `error` untuk yang perlu tindakan, `warn` untuk anomali, `info` untuk peristiwa penting, `debug` hanya saat perlu.
- **Jangan mencatat rahasia atau data pribadi** (password, token, nomor kartu). Masking dan kebijakan retensi penting.

## 2. Metrik: mulai dari yang sederhana

Untuk layanan, ukur **RED**:

- **R**ate: jumlah request per detik.
- **E**rrors: persentase request gagal.
- **D**uration: latensi (lihat persentil p50, p95, p99, bukan hanya rata-rata).

Untuk sumber daya, **USE**: *Utilization*, *Saturation*, *Errors* (CPU, memori, disk, koneksi database, kedalaman antrean).

Rata-rata menyembunyikan masalah: p99 yang lambat berarti sebagian pengguna merasakan kelambatan serius walau rata-rata tampak baik.

## 3. Tracing

*Distributed tracing* mencatat rangkaian *span* (panggilan DB, HTTP keluar, fungsi) untuk satu request, sehingga terlihat bagian mana yang lambat. **OpenTelemetry** adalah standar terbuka untuk instrumentasi dan mengirim data ke berbagai backend.

## 4. Pelacakan error

Gunakan layanan pelacak error (mis. Sentry atau sejenisnya) agar exception dikelompokkan, disertai konteks (versi rilis, pengguna anonim, langkah sebelumnya) dan bisa dihubungkan ke commit.

## 5. Peringatan (alerting)

- Beri peringatan pada **gejala yang dirasakan pengguna** (error rate tinggi, latensi p95 buruk), bukan setiap angka CPU.
- Setiap peringatan harus **bisa ditindaklanjuti** dan punya runbook. Peringatan yang sering diabaikan harus diperbaiki atau dihapus.
- Tentukan **SLO** (mis. 99,5% request sukses dalam sebulan) sebagai pegangan prioritas.

## 6. Health check

Sediakan endpoint ringan (`/health`) untuk memeriksa aplikasi hidup dan, secara terpisah, kesiapan (koneksi DB dan dependensi penting) untuk dipakai load balancer atau orkestrator.

## 7. Dashboard

Satu dashboard ringkas per layanan: RED, sumber daya, rilis (penanda deploy di grafik), dan kedalaman antrean. Penanda deploy membantu menghubungkan lonjakan error dengan perubahan.

## Mulai dari mana

1. Log terstruktur dengan request ID.
2. Pelacak error.
3. Metrik RED dan satu dashboard.
4. Peringatan untuk error rate dan latensi.
5. Tracing saat sistem mulai terdiri dari banyak bagian.

> 📸 **TODO (opsional):** tambahkan screenshot dashboard atau pelacak error dari sistemmu sendiri (sensor data sensitif).
