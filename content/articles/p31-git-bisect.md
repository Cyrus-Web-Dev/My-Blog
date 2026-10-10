---
title: "Menemukan Commit Penyebab Bug dengan git bisect"
slug: menemukan-commit-penyebab-bug-git-bisect
category: framework
type: panduan
level: menengah
published: true
excerpt: "Bug muncul, tapi kamu tidak tahu sejak kapan. git bisect mencarinya dengan pencarian biner lewat riwayat commit."
goal: "Menemukan commit yang memperkenalkan bug dengan cepat."
benefits: "Dari ratusan commit, cukup sekitar sepuluh langkah pengecekan."
tags: [git, debugging, bisect, problem-solving]
links:
  - label: "Pro Git: Debugging with Git (bisect)"
    url: "https://git-scm.com/book/en/v2/Git-Tools-Debugging-with-Git"
---

## Idea

Jika kamu tahu satu titik **baik** (dulu masih jalan) dan satu titik **buruk** (sekarang rusak), Git bisa membagi dua rentang itu berulang kali sampai menemukan commit pertama yang rusak.

## Langkah manual

```bash
git bisect start
git bisect bad                 # commit sekarang rusak
git bisect good v1.2.0         # tag/commit yang dulu baik
```

Git memindahkanmu ke commit di tengah. Jalankan aplikasi atau tes, lalu beri tahu:

```bash
git bisect good    # jika di commit ini masih normal
git bisect bad     # jika sudah rusak
```

Ulangi sampai Git menyebut "first bad commit". Setelah selesai:

```bash
git bisect reset   # kembali ke cabang semula
```

## Otomatis dengan skrip

Jika kamu punya perintah yang keluar dengan kode 0 saat baik dan non-0 saat buruk (mis. tes):

```bash
git bisect start HEAD v1.2.0
git bisect run npm test
```

## Tips

- Pastikan kondisi "baik" dan "buruk" diuji dengan cara yang **sama persis** setiap kali.
- Commit kecil dan fokus membuat hasil bisect sangat informatif, satu alasan lagi untuk kebiasaan commit yang rapi.
- Jika commit tertentu tidak bisa diuji (build rusak), gunakan `git bisect skip`.
