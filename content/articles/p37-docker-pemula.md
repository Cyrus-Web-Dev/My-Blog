---
title: "Docker untuk Pemula: Image, Container, dan Dockerfile Pertamamu"
slug: docker-untuk-pemula-image-container-dockerfile
category: backend
type: panduan
level: pemula
published: true
excerpt: "Docker membungkus aplikasi beserta lingkungannya, jadi 'jalan di laptop saya' berarti jalan di mana-mana."
goal: "Memahami konsep Docker dan menjalankan aplikasi dalam container."
benefits: "Lingkungan seragam antara lokal, tim, dan server."
challenges: "Cek ketentuan lisensi Docker Desktop untuk penggunaan di perusahaan."
tags: [docker, container, deploy, devops]
links:
  - label: "Docker: Get started"
    url: "https://docs.docker.com/get-started/"
---

## Konsep

- **Image**: cetakan baca-saja berisi aplikasi dan dependensinya.
- **Container**: image yang sedang berjalan.
- **Dockerfile**: resep membuat image.

## Dockerfile untuk aplikasi Node

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Menyalin `package*.json` lebih dulu membuat langkah `npm ci` bisa di-*cache* selama dependensi tidak berubah. Tambahkan `.dockerignore` berisi `node_modules`, `.env`, `.git`.

## Perintah dasar

```bash
docker build -t aplikasi-saya .
docker run -p 3000:3000 --env-file .env aplikasi-saya
docker ps                    # container berjalan
docker logs <id>             # log
docker stop <id>
```

## Docker Compose: beberapa layanan sekaligus

```yaml
services:
  web:
    build: .
    ports: ["3000:3000"]
    env_file: .env
    depends_on: [db]
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - dbdata:/var/lib/postgresql/data
volumes:
  dbdata:
```

Jalankan dengan `docker compose up -d`. **Volume** menjaga data database tetap ada ketika container dibuat ulang.

## Pegangan penting

- Jangan menaruh rahasia di dalam image; berikan lewat environment saat dijalankan.
- Container bersifat sementara; data yang harus awet taruh di volume atau layanan eksternal.
- Pin versi image (`postgres:16`), bukan `latest`, agar hasilnya bisa diulang.
