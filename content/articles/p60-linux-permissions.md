---
title: "Izin File di Linux: chmod, chown, dan Error 'Permission denied'"
slug: izin-file-linux-chmod-chown-permission-denied
category: backend
type: panduan
level: pemula
published: true
excerpt: "'Permission denied' adalah error yang pasti ditemui di server. Pahami cara membaca izin dan memperbaikinya dengan aman."
goal: "Membaca dan mengatur izin file/folder dengan benar."
benefits: "Aplikasi bisa menulis log dan upload tanpa membuka akses berlebihan."
challenges: "Menyetel 777 'biar jalan' membuka celah keamanan serius."
tags: [linux, permission, server, dasar]
links:
  - label: "Ubuntu: File permissions"
    url: "https://help.ubuntu.com/community/FilePermissions"
---

## Membaca izin

```bash
ls -l
-rw-r--r--  1 deploy www-data  1200 Okt 10 storage/app.log
```

`-rw-r--r--` = jenis + tiga kelompok: **pemilik (user)**, **grup**, **lainnya**. Setiap kelompok punya `r` (baca), `w` (tulis), `x` (eksekusi; untuk folder: boleh masuk).

## Notasi angka

`r=4`, `w=2`, `x=1`. Jadi `644` = pemilik baca/tulis, lainnya baca saja. `755` = pemilik penuh, lainnya baca/eksekusi.

## Mengubah

```bash
chmod 644 file.txt         # izin file biasa
chmod 755 skrip.sh         # skrip yang dapat dieksekusi
chown deploy:www-data file.txt   # ubah pemilik dan grup
chmod -R g+w storage       # beri grup izin tulis pada folder dan isinya
```

## Kasus umum: aplikasi tidak bisa menulis

Laravel gagal menulis `storage/` atau `bootstrap/cache/`; Node gagal menulis ke folder upload. Penyebab: proses web berjalan sebagai pengguna lain (mis. `www-data`) yang tidak punya izin tulis.

Perbaikan yang aman:

```bash
sudo chown -R deploy:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

## Yang jangan dilakukan

- **`chmod 777`**: membuka tulis ke semua pengguna di server. Hindari.
- Menjalankan aplikasi sebagai `root`.
- Membiarkan file rahasia (`.env`) dapat dibaca semua orang: `chmod 600 .env`.

## Prinsip

Beri izin **sesedikit mungkin** yang dibutuhkan, dan tulis hanya pada folder yang memang harus ditulis.
