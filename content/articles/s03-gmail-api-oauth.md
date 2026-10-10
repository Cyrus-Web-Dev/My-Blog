---
title: "Integrasi Gmail API di Laravel: Dari Error OAuth sampai Email Terkirim"
slug: integrasi-gmail-api-laravel-error-oauth
category: api
type: studi-kasus
level: menengah
published: false
date: 2026-09-15
excerpt: "redirect_uri_mismatch, invalid_grant, refresh token yang tidak muncul. Daftar jebakan OAuth Google dan cara menghindarinya."
goal: "Aplikasi dapat mengirim email lewat Gmail API dengan token yang awet."
benefits: "Pengiriman email berbasis akun Google tanpa menyimpan password."
challenges: "Alur OAuth penuh detail kecil: URI, scope, jenis akses, dan status aplikasi di Google Cloud."
tags: [gmail-api, oauth, laravel, google-cloud]
links:
  - label: "Gmail API: Sending Email"
    url: "https://developers.google.com/gmail/api/guides/sending"
  - label: "Google OAuth 2.0 untuk aplikasi web server"
    url: "https://developers.google.com/identity/protocols/oauth2/web-server"
---

> 📸 **TODO (isi dengan bukti milikmu):** layar pesan error OAuth (misalnya `redirect_uri_mismatch`), halaman Credentials di Google Cloud Console (sensor client secret), dan email yang berhasil terkirim.

## Error yang sering muncul

| Error | Penyebab umum |
|---|---|
| `redirect_uri_mismatch` | URI callback di kode tidak sama persis dengan yang didaftarkan (termasuk `http`/`https`, garis miring akhir, port). |
| Refresh token tidak diterima | Tidak memakai `access_type=offline`, atau pengguna sudah pernah menyetujui sehingga Google tidak mengirim refresh token lagi. |
| `invalid_grant` | Refresh token dicabut atau kedaluwarsa. Pada aplikasi berstatus *Testing* dengan tipe pengguna eksternal, refresh token bisa kedaluwarsa dalam 7 hari. |
| `insufficient permissions` | Scope yang diminta tidak mencakup pengiriman email. |

## Konfigurasi klien

```php
$client = new Google\Client();
$client->setClientId(config('services.google.client_id'));
$client->setClientSecret(config('services.google.client_secret'));
$client->setRedirectUri(config('services.google.redirect'));
$client->addScope(Google\Service\Gmail::GMAIL_SEND);
$client->setAccessType('offline');   // agar dapat refresh token
$client->setPrompt('consent');       // paksa tampil persetujuan agar refresh token dikirim
```

Simpan refresh token **terenkripsi** (misalnya dengan `Crypt::encryptString`).

## Mengirim email

Gmail API menerima pesan MIME mentah yang di-encode base64url:

```php
$mime = "To: tujuan@contoh.com\r\n"
      . "Subject: =?UTF-8?B?" . base64_encode('Halo dari Laravel') . "?=\r\n"
      . "MIME-Version: 1.0\r\n"
      . "Content-Type: text/plain; charset=UTF-8\r\n\r\n"
      . "Isi pesan";

$raw = rtrim(strtr(base64_encode($mime), '+/', '-_'), '=');

$message = new Google\Service\Gmail\Message();
$message->setRaw($raw);

(new Google\Service\Gmail($client))->users_messages->send('me', $message);
```

## Jebakan produksi

- Publikasikan aplikasi OAuth (keluar dari status *Testing*) bila token harus awet. Scope sensitif dapat memerlukan proses verifikasi Google.
- Tangani `invalid_grant` dengan meminta pengguna menghubungkan ulang akun, bukan dengan mengulang tanpa henti.
- Pisahkan kredensial per lingkungan (lokal, staging, production).
