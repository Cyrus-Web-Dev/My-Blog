---
title: "SQL Injection: Cara Kerjanya dan Cara Mencegahnya"
slug: sql-injection-cara-kerja-dan-pencegahan
category: database
type: panduan
level: pemula
published: true
excerpt: "Satu kolom login yang ceroboh bisa membuka seluruh database. Pencegahannya sederhana jika dilakukan konsisten."
goal: "Memahami SQL injection dan menulis query yang aman."
benefits: "Menutup salah satu celah web paling klasik."
tags: [keamanan, sql, injection, database]
links:
  - label: "OWASP: SQL Injection"
    url: "https://owasp.org/www-community/attacks/SQL_Injection"
  - label: "OWASP SQL Injection Prevention Cheat Sheet"
    url: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html"
---

## Masalahnya

Jika input pengguna digabung langsung ke string SQL, penyerang bisa mengubah makna query:

```js
// BERBAHAYA
const q = `select * from users where email = '${email}' and password = '${pass}'`;
```

Input `' or '1'='1` pada email membuat kondisi selalu benar, dan penyerang bisa masuk tanpa password, atau lebih buruk, membaca dan menghapus data.

## Solusi utama: query berparameter

Pisahkan **perintah** dari **data**. Database memperlakukan nilai parameter sebagai data, tidak pernah sebagai SQL.

```js
// Node (pg)
await pool.query("select * from users where email = $1", [email]);
```

```php
// Laravel
DB::select('select * from users where email = ?', [$email]);
User::where('email', $email)->first();   // Eloquent otomatis berparameter
```

## Kewaspadaan

- Pada **ORM**, jalur "raw" (`whereRaw`, `DB::raw`, `sql` template) tetap rawan jika memasukkan input langsung. Gunakan binding.
- **Nama kolom/tabel dan arah sort** tidak bisa diparameterkan; validasi dengan *whitelist* (`['nama','dibuat']`).
- Beri akun database aplikasi **hak minimum** (jangan pakai superuser).
- Tampilkan pesan error umum ke pengguna; detail SQL hanya di log.
- Validasi tipe input (angka harus angka) sebagai lapisan tambahan, bukan pengganti parameter.

## Uji

Coba input aneh (`'`, `"`, `;--`) pada form pencarianmu di lingkungan lokal. Jika muncul error SQL, ada yang perlu dibenahi.
