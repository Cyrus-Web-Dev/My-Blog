---
title: "Nginx sebagai Reverse Proxy untuk Aplikasi Node atau Laravel"
slug: nginx-sebagai-reverse-proxy
category: backend
type: panduan
level: menengah
published: true
excerpt: "Nginx berdiri di depan aplikasimu: menerima permintaan, mengurus HTTPS, dan meneruskannya ke aplikasi di belakang."
goal: "Memahami peran reverse proxy dan menulis konfigurasi dasarnya."
benefits: "HTTPS terpusat, file statis cepat, dan aplikasi tidak langsung terpapar internet."
tags: [nginx, server, proxy, deploy]
links:
  - label: "Nginx documentation"
    url: "https://nginx.org/en/docs/"
---

## Mengapa pakai reverse proxy

Aplikasi (mis. Next.js di port 3000) fokus pada logika. Nginx menangani: HTTPS, kompresi, file statis, pembatasan ukuran upload, dan menyalurkan trafik ke beberapa aplikasi berdasarkan domain.

## Konfigurasi dasar

```nginx
server {
    listen 80;
    server_name contoh.com www.contoh.com;

    client_max_body_size 10m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Letakkan di `/etc/nginx/sites-available/`, aktifkan dengan symlink ke `sites-enabled/`.

## Selalu uji sebelum memuat ulang

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Masalah umum

- **502 Bad Gateway**: aplikasi di belakang tidak berjalan atau port salah. Cek proses aplikasinya dan log (`/var/log/nginx/error.log`).
- **413 Request Entity Too Large**: naikkan `client_max_body_size`.
- **Redirect salah ke http**: aplikasi perlu tahu skema asli lewat `X-Forwarded-Proto` (atur *trusted proxies* di framework).
- **504 Gateway Timeout**: aplikasi terlalu lama merespons; periksa query lambat atau naikkan `proxy_read_timeout` bila memang sah.

## Langkah berikut

Aktifkan HTTPS dengan sertifikat gratis (lihat artikel HTTPS dan TLS), dan jalankan aplikasi di bawah pengelola proses (systemd atau PM2) agar otomatis hidup kembali.
