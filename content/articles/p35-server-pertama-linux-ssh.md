---
title: "Server Pertama: Linux, SSH, dan Langkah Keamanan Dasar"
slug: server-pertama-linux-ssh-keamanan-dasar
category: backend
type: panduan
level: menengah
published: true
excerpt: "Menyewa VPS itu mudah. Mengamankannya sejak menit pertama yang sering terlewat."
goal: "Menyiapkan server Linux dengan akses aman sebelum menaruh aplikasi."
benefits: "Mengurangi risiko diserang lewat celah paling umum."
challenges: "Salah mengatur firewall atau SSH bisa mengunci dirimu sendiri dari server."
tags: [server, linux, ssh, deploy, keamanan]
links:
  - label: "OpenSSH Manual"
    url: "https://www.openssh.com/manual.html"
  - label: "Ubuntu Server documentation"
    url: "https://ubuntu.com/server/docs"
---

> Contoh memakai Ubuntu. Jaga satu sesi SSH tetap terbuka saat mengubah pengaturan akses, agar tidak terkunci.

## 1. Masuk dan perbarui

```bash
ssh root@IP-SERVER
apt update && apt upgrade -y
```

## 2. Buat pengguna biasa

```bash
adduser deploy
usermod -aG sudo deploy
```

Pakai pengguna ini untuk pekerjaan harian, bukan `root`.

## 3. Login dengan kunci SSH

Di komputermu:

```bash
ssh-keygen -t ed25519
ssh-copy-id deploy@IP-SERVER
```

Setelah login kunci berhasil (uji di sesi baru), matikan login password di `/etc/ssh/sshd_config`:

```
PasswordAuthentication no
PermitRootLogin no
```

lalu muat ulang: `sudo systemctl reload ssh` (atau `sshd` sesuai distribusi).

## 4. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

Buka hanya port yang dibutuhkan. Port database tidak seharusnya terbuka ke internet.

## 5. Hal yang perlu dijaga

- Pembaruan keamanan rutin (pertimbangkan *unattended-upgrades*).
- Cadangan (backup) database dan berkas penting, **dan uji pemulihannya**.
- Pemantauan dasar: `df -h` (disk), `free -h` (memori), `journalctl -u nama-layanan` (log).
- Jangan menaruh rahasia di repositori; pakai environment variable.

## Alur deploy sederhana

Tarik kode (`git pull`), pasang dependensi, build, jalankan migrasi, lalu muat ulang layanan. Setelah paham, otomatiskan dengan CI/CD.
