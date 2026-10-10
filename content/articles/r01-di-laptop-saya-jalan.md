---
title: "Kenapa Developer Selalu Bilang 'Di Laptop Saya Jalan'"
slug: kenapa-di-laptop-saya-jalan
category: backend
type: ringan
level: pemula
published: true
date: 2026-09-10
excerpt: "Kalimat legendaris itu bukan alasan, melainkan gejala. Ini penyebab umum aplikasi jalan di laptop tapi rusak di server, dan cara menutupnya."
goal: "Membuat pembaca paham bahwa 'beda environment' adalah masalah yang bisa dicegah, bukan nasib."
benefits: "Deploy lebih tenang, bug 'cuma di server' lebih cepat ketemu."
challenges: "Menyamakan environment butuh disiplin kecil yang terasa merepotkan di awal."
tags: [deployment, environment, devops]
links:
  - label: "The Twelve-Factor App (Config)"
    url: "https://12factor.net/config"
---

Setiap developer pernah mengucapkannya. Aplikasi mulus di laptop, lalu tumbang begitu masuk server. Hampir selalu penyebabnya salah satu dari daftar ini.

## Penyebab yang paling sering

- **Versi runtime berbeda.** Laptop pakai Node atau PHP versi baru, server masih versi lama.
- **Environment variable hilang.** File `.env` hanya ada di laptop.
- **Data berbeda.** Database lokal bersih dan rapi, database production penuh data aneh.
- **Huruf besar-kecil nama file.** Windows dan macOS umumnya tidak membedakan `Header.tsx` dan `header.tsx`, Linux membedakannya.
- **Zona waktu dan locale.** Format tanggal atau urutan sorting bisa berbeda antar mesin.
- **Dependency tidak dikunci.** Tanpa lockfile, `npm install` hari ini bisa menghasilkan versi paket yang berbeda dari kemarin.

## Cara menutupnya

1. **Commit lockfile** (`package-lock.json`, `composer.lock`) dan gunakan `npm ci` di server atau CI.
2. **Tulis `.env.example`** berisi semua nama variabel yang dibutuhkan, tanpa nilai rahasianya.
3. **Kunci versi runtime** lewat `engines` di `package.json`, file `.nvmrc`, atau Docker.
4. **Punya staging** yang semirip mungkin dengan production.
5. **Jalankan build di CI**, sehingga error pertama muncul di mesin yang bersih, bukan di depan pengguna.

> 💡 Aturan praktis: kalau sebuah aplikasi hanya bisa jalan di satu mesin, itu bukan aplikasi, itu eksperimen.
