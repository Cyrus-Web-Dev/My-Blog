---
title: "Deploy Next.js ke VPS: 502 Bad Gateway Setelah Berhasil Build"
slug: deploy-nextjs-vps-502-bad-gateway
category: backend
type: studi-kasus
level: menengah
published: false
excerpt: "Build sukses, Nginx jalan, tapi browser menampilkan 502. Artinya Nginx tidak bisa berbicara dengan aplikasinya."
goal: "Mendiagnosis dan memperbaiki 502 secara sistematis."
benefits: "Cepat tahu apakah masalah ada di proxy, aplikasi, atau sumber daya server."
tags: [deploy, nginx, nextjs, vps, troubleshooting]
links:
  - label: "Next.js: Self-hosting"
    url: "https://nextjs.org/docs/app/building-your-application/deploying"
---

> 📸 **TODO (isi dengan bukti milikmu):** tampilan 502, `error.log` Nginx, `pm2 logs`/`journalctl`, dan hasil `curl localhost:3000`.

## Memahami 502

Nginx menerima request, mencoba meneruskannya ke aplikasi, dan **tidak mendapat jawaban yang valid**. Jadi periksa dari belakang ke depan.

## Urutan pemeriksaan

**1. Apakah aplikasi berjalan dan mendengarkan?**

```bash
curl -i http://127.0.0.1:3000
ss -tlnp | grep 3000
```

Jika tidak ada jawaban: aplikasi mati atau di port lain.

**2. Lihat log aplikasi**

```bash
pm2 logs            # jika memakai PM2
journalctl -u aplikasi -n 100 --no-pager   # jika memakai systemd
```

Cari error saat start: variabel environment hilang, build tidak ada, port terpakai.

**3. Cocokkan port**

`proxy_pass` di Nginx harus sama dengan port aplikasi.

**4. Proses dibunuh kehabisan memori?**

`next build` di VPS kecil bisa menghabiskan RAM dan terbunuh OOM.

```bash
free -h
dmesg | grep -i "killed process"
```

Solusi: tambah swap, build di CI lalu kirim hasilnya, atau naikkan RAM.

**5. Aplikasi tidak otomatis hidup lagi**

Gunakan PM2 (`pm2 startup`, `pm2 save`) atau service systemd dengan `Restart=always`.

**6. Variabel environment production**

Pastikan `.env.production` atau pengaturan layanan terisi; variabel `NEXT_PUBLIC_*` ditanam saat **build**, jadi ubah lalu **build ulang**.

**7. Log Nginx**

```bash
sudo tail -f /var/log/nginx/error.log
```

Pesan seperti `connect() failed (111: Connection refused)` memastikan aplikasi tidak mendengarkan.

## Pelajaran

502 hampir selalu masalah di belakang Nginx. Mulai dari `curl` ke aplikasi langsung, bukan dari mengubah konfigurasi Nginx.
