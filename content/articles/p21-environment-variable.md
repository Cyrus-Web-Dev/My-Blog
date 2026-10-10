---
title: "Environment Variable dan Rahasia: Jangan Sampai Bocor ke GitHub"
slug: environment-variable-dan-rahasia-jangan-bocor
category: backend
type: panduan
level: pemula
published: true
excerpt: "Kunci API yang ikut ter-commit adalah kecelakaan klasik. Begini cara mengelola konfigurasi dengan benar."
goal: "Memisahkan konfigurasi dan rahasia dari kode."
benefits: "Aman dari kebocoran dan mudah berpindah antar lingkungan."
challenges: "Variabel bertanda publik di framework tertentu tetap terlihat di browser."
tags: [env, keamanan, konfigurasi, dasar]
links:
  - label: "The Twelve-Factor App: Config"
    url: "https://12factor.net/config"
  - label: "OWASP Secrets Management Cheat Sheet"
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html"
---

## Prinsip

Kode sama di semua lingkungan; **yang berbeda (URL database, kunci API, mode debug) disuntikkan dari luar** lewat environment variable.

## Praktik dasar

1. Simpan nilai di `.env` (lokal) dan di pengaturan platform hosting (production).
2. Tambahkan `.env` ke `.gitignore` **sebelum** commit pertama.
3. Commit `.env.example` berisi nama variabel tanpa nilai rahasia.
4. Baca lewat `process.env.NAMA` (Node) atau `env('NAMA')` / `config()` (Laravel).

## Bedakan publik dan rahasia

Di Next.js, variabel berawalan `NEXT_PUBLIC_` **dibundel ke browser** dan bisa dilihat siapa pun. Aman untuk URL Supabase dan *anon key*, **tidak** untuk `service_role`, kunci pembayaran, atau secret OAuth.

## Jika terlanjur bocor

1. **Cabut/rotasi kunci sekarang juga** (menghapus commit saja tidak cukup; riwayat dan salinan sudah mungkin terambil).
2. Periksa log penggunaan kunci itu.
3. Baru bersihkan riwayat Git bila perlu.

## Pencegahan

Aktifkan secret scanning di GitHub dan pertimbangkan alat pemindai (mis. gitleaks) pada pre-commit atau CI.
