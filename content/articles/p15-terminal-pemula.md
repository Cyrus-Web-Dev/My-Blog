---
title: "Terminal untuk Pemula: Perintah yang Benar-Benar Dipakai Developer"
slug: terminal-untuk-pemula-perintah-wajib
category: backend
type: panduan
level: pemula
published: true
excerpt: "Terminal bukan sihir. Belasan perintah ini sudah cukup untuk pekerjaan harian."
goal: "Nyaman bernavigasi dan mengelola file lewat terminal."
benefits: "Lebih cepat bekerja dan siap mengelola server."
challenges: "Perintah penghapusan tidak punya tempat sampah; salah ketik bisa fatal."
tags: [terminal, linux, dasar, cli]
links:
  - label: "MDN: Command line crash course"
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line"
---

## Navigasi dan berkas

```bash
pwd                 # di folder mana saya?
ls -la              # isi folder (termasuk file tersembunyi)
cd proyek/api       # masuk folder
cd ..               # naik satu level
mkdir baru          # buat folder
touch catatan.txt   # buat file kosong
cp a.txt b.txt      # salin
mv a.txt arsip/     # pindah / ganti nama
rm file.txt         # hapus (TANPA tempat sampah!)
```

## Melihat dan mencari

```bash
cat file.txt            # tampilkan isi
less file.log           # baca per halaman (q untuk keluar)
tail -f storage/logs/laravel.log   # ikuti log secara langsung
grep -rn "kurangiStok" src/        # cari teks di banyak file
```

## Pipa (pipe)

Sambungkan keluaran satu perintah ke perintah lain:

```bash
cat access.log | grep " 500 " | wc -l   # berapa error 500?
```

## Tips

- **Tab** untuk melengkapi nama; **panah atas** untuk perintah sebelumnya; `Ctrl+C` menghentikan proses; `Ctrl+R` mencari riwayat.
- `man perintah` atau `perintah --help` untuk bantuan.
- Hati-hati dengan `rm -rf`. Periksa jalur dua kali sebelum Enter.
- Di Windows, WSL memberi lingkungan Linux yang mirip server.
