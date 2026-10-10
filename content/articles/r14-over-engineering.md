---
title: "Jangan Over-engineering: Kapan Cukup Itu Cukup"
slug: jangan-over-engineering-kapan-cukup
category: backend
type: ringan
level: pemula
published: true
date: 2026-10-04
excerpt: "Microservice untuk aplikasi dengan sepuluh pengguna? Mari bicara soal kerumitan yang tidak kamu butuhkan."
goal: "Mengingatkan bahwa kesederhanaan adalah fitur."
benefits: "Pengembangan lebih cepat, perawatan lebih murah."
challenges: "Sulit menilai kapan kerumitan memang diperlukan; butuh pengalaman dan data."
tags: [arsitektur, kesederhanaan, opini]
---

Over-engineering adalah membangun solusi untuk masalah yang belum ada.

## Gejalanya

- Abstraksi berlapis untuk satu implementasi.
- Memecah aplikasi kecil menjadi banyak layanan sebelum ada alasan skala atau tim.
- "Siapa tahu nanti butuh" menjadi alasan menambah fitur.

## Prinsip yang menolong

- **YAGNI** (*You Aren't Gonna Need It*): jangan bangun yang belum dibutuhkan.
- **Aturan tiga**: baru buat abstraksi setelah pola yang sama muncul tiga kali.
- **Monolit yang rapi** sering lebih baik sebagai titik awal daripada sistem terdistribusi. Pisahkan modul secara logis dulu, pisahkan layanan kalau ada alasan nyata.

## Tapi jangan terlalu ekstrem

Kesederhanaan bukan berarti ceroboh. Hal-hal mendasar seperti keamanan, backup, dan migrasi database tetap harus dari awal. Yang ditunda adalah kerumitan spekulatif.

> 💡 Pertanyaan pengaman: "Masalah nyata apa yang kuselesaikan hari ini dengan kerumitan ini?" Kalau jawabannya samar, sederhanakan.
