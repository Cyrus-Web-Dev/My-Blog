---
title: "Git: Cara Membatalkan Kesalahan dengan Aman"
slug: git-cara-membatalkan-kesalahan-dengan-aman
category: framework
type: panduan
level: pemula
published: true
excerpt: "Salah commit, salah file, atau ingin kembali ke kondisi kemarin? Ada perintah yang tepat untuk tiap situasi."
goal: "Tahu perintah pembatal yang aman dan yang berbahaya."
benefits: "Tidak panik saat membuat kesalahan di Git."
challenges: "Perintah seperti reset --hard menghapus perubahan yang belum di-commit tanpa bisa dipulihkan."
tags: [git, undo, reset, revert]
links:
  - label: "Pro Git: Undoing Things"
    url: "https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things"
---

| Situasi | Perintah |
|---|---|
| Buang perubahan di satu file (belum di-add) | `git restore nama-file` |
| Batalkan `git add` | `git restore --staged nama-file` |
| Ubah pesan/isi commit **terakhir** (belum di-push) | `git commit --amend` |
| Batalkan commit terakhir, simpan perubahannya | `git reset --soft HEAD~1` |
| Batalkan commit, simpan perubahan tapi un-stage | `git reset HEAD~1` |
| Batalkan commit **dan buang** perubahannya | `git reset --hard HEAD~1` ⚠️ |
| Batalkan commit yang **sudah di-push** | `git revert <hash>` |
| Simpan pekerjaan setengah jadi | `git stash` / `git stash pop` |

## Aturan emas

- **Riwayat yang sudah dibagikan (di-push) jangan ditulis ulang.** Gunakan `git revert`, yang membuat commit baru yang membatalkan.
- `reset --hard` menghapus perubahan yang belum di-commit. Pikir dua kali.

## Jaring pengaman: reflog

Git mencatat ke mana `HEAD` pernah menunjuk. Setelah salah `reset`, lihat:

```bash
git reflog
git reset --hard <hash-sebelum-salah>
```

Commit yang "hilang" biasanya masih bisa dipulihkan lewat reflog selama belum dibersihkan (umumnya beberapa pekan).
