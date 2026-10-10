---
title: "Tailwind Itu Jelek? Kelebihan dan Kekurangannya Setelah Dipakai Serius"
slug: tailwind-itu-jelek-kelebihan-kekurangan
category: frontend
type: ringan
level: pemula
published: true
date: 2026-09-16
excerpt: "Sebagian orang bilang class-nya kayak kereta panjang, sebagian lagi tak mau balik ke CSS biasa. Dua-duanya punya poin."
goal: "Memberi gambaran seimbang supaya pembaca bisa memutuskan sendiri."
benefits: "Memahami kapan Tailwind terasa menolong dan kapan menyulitkan."
challenges: "Kritik terhadap Tailwind sering emosional; perlu dipisahkan dari alasan teknis."
tags: [tailwind, css, frontend, opini]
links:
  - label: "Dokumentasi Tailwind CSS"
    url: "https://tailwindcss.com/docs"
---

## Yang membuatnya enak

- **Cepat membangun.** Tidak bolak-balik antara file HTML dan CSS.
- **Konsisten.** Spacing, warna, dan ukuran berasal dari skala yang sama.
- **CSS tidak menumpuk.** Hanya utility yang dipakai yang ikut dibundel.
- **Tidak sibuk mencari nama class.** Masalah penamaan yang menyita energi hilang.

## Yang bikin sebagian orang kesal

- **Markup menjadi panjang** dan sulit dibaca bila tidak dipecah ke komponen.
- **Kurva belajar nama utility.** Awalnya sering buka dokumentasi.
- **Disiplin tetap dibutuhkan.** Tanpa komponen dan token yang rapi, kodenya bisa berantakan juga.

## Jalan tengah

Ekstrak pola yang berulang menjadi komponen (di React, itu hal alami), simpan warna dan spacing sebagai token di konfigurasi, dan pakai CSS biasa untuk hal yang memang lebih jelas ditulis begitu. Tailwind itu alat, bukan agama.
