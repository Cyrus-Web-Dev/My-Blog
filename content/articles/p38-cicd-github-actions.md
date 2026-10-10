---
title: "CI/CD dengan GitHub Actions: Dari Push ke Tes Otomatis"
slug: cicd-github-actions-dari-push-ke-tes-otomatis
category: framework
type: panduan
level: menengah
published: true
excerpt: "Setiap push menjalankan tes dan build otomatis, sehingga masalah ketahuan sebelum sampai ke production."
goal: "Membuat workflow CI sederhana dan memahami arah menuju deploy otomatis."
benefits: "Kualitas terjaga tanpa mengandalkan ingatan manusia."
tags: [ci-cd, github-actions, devops, otomatisasi]
links:
  - label: "GitHub Actions documentation"
    url: "https://docs.github.com/en/actions"
---

## Istilah

- **CI (Continuous Integration)**: setiap perubahan otomatis dibangun dan diuji.
- **CD (Continuous Delivery/Deployment)**: hasil yang lolos otomatis disiapkan atau dikirim ke server.

## Workflow pertama

Buat `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

Cek versi aksi (`@v4`) di halaman resminya untuk yang terbaru.

## Rahasia

Simpan kunci di **Settings → Secrets and variables → Actions**, lalu rujuk:

```yaml
env:
  API_KEY: ${{ secrets.API_KEY }}
```

Jangan menulis rahasia langsung di berkas workflow.

## Menuju deploy otomatis

Tambahkan job yang berjalan hanya jika tes lolos dan hanya di cabang `main`: masuk ke server lewat SSH dengan kunci khusus deploy, lalu menarik kode dan memuat ulang aplikasi, atau mengirim image ke registry.

## Kebiasaan baik

- Lindungi cabang `main`: wajib CI hijau sebelum merge.
- Buat tes cepat; CI yang lambat diabaikan orang.
- Batasi hak kunci deploy seminimal mungkin.
