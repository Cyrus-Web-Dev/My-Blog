---
title: "Menulis Commit Message dan Nama Branch yang Rapi"
slug: menulis-commit-message-dan-branch-rapi
category: framework
type: panduan
level: pemula
published: true
excerpt: "Riwayat Git yang rapi adalah dokumentasi gratis. Begini kebiasaan kecil yang membuatnya mudah dibaca."
goal: "Menerapkan konvensi commit dan branch yang konsisten."
benefits: "Review lebih cepat, pencarian bug lebih mudah, changelog bisa dibuat otomatis."
tags: [git, commit, konvensi, kolaborasi]
links:
  - label: "Conventional Commits"
    url: "https://www.conventionalcommits.org"
---

## Format commit yang populer

```
<tipe>: <ringkasan singkat dalam bentuk perintah>

<opsional: penjelasan MENGAPA, bukan hanya apa>
```

Tipe umum: `feat` (fitur), `fix` (perbaikan), `docs`, `refactor`, `test`, `chore`.

```
fix: cegah stok negatif saat pembelian bersamaan

Pengurangan stok kini atomik di database. Sebelumnya dua request
bersamaan bisa menimpa satu sama lain.
```

## Ciri pesan yang baik

- Ringkasan sekitar 50-72 karakter.
- Menjelaskan **alasan**; "apa" sudah terlihat di diff.
- Satu commit, satu tujuan. Hindari "fix macam-macam".

## Nama branch

```
fitur/login-2fa
fix/stok-negatif
docs/readme-setup
```

Singkat, huruf kecil, dipisah tanda hubung, dengan awalan jenis pekerjaan.

## Deskripsi Pull Request

Tuliskan: masalahnya apa, solusinya apa, cara mengujinya, dan screenshot bila ada perubahan tampilan. Reviewer (dan kamu bulan depan) akan berterima kasih.
