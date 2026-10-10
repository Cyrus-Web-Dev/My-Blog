---
title: "Kenapa 'Refactor Dulu' Jarang Disetujui, dan Cara Menjelaskannya"
slug: kenapa-refactor-jarang-disetujui
category: framework
type: ringan
level: menengah
published: true
excerpt: "Bagi bisnis, refactor tidak menambah fitur. Kuncinya menerjemahkan manfaat teknis menjadi bahasa dampak."
goal: "Memberi cara mengomunikasikan kebutuhan perbaikan kode kepada non-teknis."
benefits: "Peluang disetujui lebih besar dan perbaikan bisa dijadwalkan secara wajar."
tags: [refactor, komunikasi, utang-teknis, karier]
---

"Kodenya jelek, perlu ditulis ulang" jarang meyakinkan siapa pun. Pemangku kepentingan peduli pada hasil: kecepatan fitur, jumlah bug, biaya, risiko.

## Terjemahkan ke dampak

| Bahasa teknis | Bahasa dampak |
|---|---|
| "Modul ini spaghetti" | "Setiap fitur di modul ini memakan dua kali lebih lama dan sering memunculkan bug baru." |
| "Tidak ada tes" | "Tiap rilis berisiko, jadi kita butuh waktu pengecekan manual yang panjang." |
| "Dependensi usang" | "Ada risiko keamanan dan upgrade makin mahal bila ditunda." |

## Cara mengajukannya

1. **Tunjukkan data**: berapa jam terbuang, berapa bug dari bagian itu.
2. **Usulkan lingkup kecil dan terukur**, bukan "tulis ulang semuanya".
3. **Sisipkan di jalur fitur**: bersihkan area yang memang akan disentuh (aturan Pramuka: tinggalkan kode lebih bersih dari sebelumnya).
4. **Sepakati tanda berhasil** (waktu build turun, bug berkurang).

Refactor yang dijelaskan sebagai investasi dengan hasil terukur jauh lebih mudah disetujui daripada yang dijelaskan sebagai selera.
