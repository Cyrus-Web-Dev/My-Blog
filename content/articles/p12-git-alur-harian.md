---
title: "Git untuk Pemula: Alur Kerja Harian yang Sederhana"
slug: git-untuk-pemula-alur-kerja-harian
category: framework
type: panduan
level: pemula
published: true
excerpt: "Git terlihat menakutkan sampai kamu tahu bahwa 90% pemakaian harian hanya beberapa perintah."
goal: "Menguasai alur dasar Git dan GitHub."
benefits: "Riwayat kode aman, bisa kembali ke kondisi lama, dan siap berkolaborasi."
tags: [git, github, pemula, workflow]
links:
  - label: "Pro Git (buku gratis)"
    url: "https://git-scm.com/book/en/v2"
---

## Konsep

- **Repository**: folder proyek beserta riwayatnya.
- **Commit**: foto keadaan proyek pada satu titik, dengan pesan.
- **Branch**: jalur kerja terpisah.
- **Remote**: salinan di server (mis. GitHub).

## Alur harian

```bash
git status                      # apa yang berubah?
git switch -c fitur/login       # buat cabang baru
# ...edit kode...
git add .                       # siapkan perubahan
git commit -m "feat: tambah form login"
git push -u origin fitur/login  # kirim ke GitHub
```

Lalu buka **Pull Request** di GitHub, minta review, dan gabungkan (merge) ke cabang utama.

## Memperbarui cabang utama

```bash
git switch main
git pull
```

## Kebiasaan baik

- Commit kecil dan sering, satu tujuan per commit.
- `git status` dan `git diff` sebelum commit.
- **Jangan commit rahasia** (`.env`, kunci API). Tambahkan ke `.gitignore`.
- Jangan bekerja langsung di `main` untuk fitur baru.

## Kalau ada konflik

Git menandai bagian yang bentrok dengan `<<<<<<<`, `=======`, `>>>>>>>`. Pilih isi yang benar, hapus penanda, lalu `git add` dan `git commit`. Konflik itu normal, bukan tanda kamu salah.
