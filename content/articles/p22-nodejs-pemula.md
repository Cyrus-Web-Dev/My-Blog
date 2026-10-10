---
title: "Node.js untuk Pemula: Apa, Kenapa, dan Server Pertamamu"
slug: nodejs-untuk-pemula-server-pertama
category: backend
type: panduan
level: pemula
published: true
excerpt: "Node.js membawa JavaScript ke luar browser. Dengan satu file kamu sudah bisa punya server web."
goal: "Memahami peran Node.js dan membuat server sederhana."
benefits: "Satu bahasa untuk frontend dan backend, ekosistem paket yang luas."
tags: [nodejs, javascript, backend, pemula]
links:
  - label: "Node.js: Learn"
    url: "https://nodejs.org/en/learn"
  - label: "npm Docs"
    url: "https://docs.npmjs.com"
---

## Apa itu

Node.js adalah **runtime** yang menjalankan JavaScript di luar browser (di mesin V8). Ia dilengkapi `npm`, pengelola paket terbesar untuk JavaScript.

## Server pertama

```js
// server.js
import http from "node:http";

const server = http.createServer((req, res) => {
  if (req.url === "/api/halo") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ pesan: "Halo dari Node.js" }));
  } else {
    res.writeHead(404);
    res.end("Tidak ditemukan");
  }
});

server.listen(3000, () => console.log("http://localhost:3000"));
```

Jalankan dengan `node server.js` (simpan sebagai `server.mjs` atau atur `"type": "module"` di `package.json` agar `import` bekerja).

## Pada praktiknya

Orang jarang memakai modul `http` mentah; mereka memakai framework seperti **Express**, **Fastify**, atau **Next.js**. Tetapi memahami yang mentah membantu kamu tahu apa yang dilakukan framework.

## Model kerja

Node menjalankan JavaScript pada satu thread utama dengan I/O non-blocking, sangat baik untuk pekerjaan yang banyak menunggu (database, jaringan). Untuk perhitungan CPU yang berat, pertimbangkan *worker threads* atau layanan terpisah.

## Dasar npm

```bash
npm init -y
npm install express
npm install -D nodemon
```

Commit `package-lock.json`, dan jangan pernah commit `node_modules`.
