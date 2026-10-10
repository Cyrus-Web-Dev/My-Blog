---
title: "Pengguna Tiba-tiba Logout: Menangani Token Kedaluwarsa dengan Benar"
slug: pengguna-tiba-tiba-logout-token-kedaluwarsa
category: backend
type: studi-kasus
level: menengah
published: false
excerpt: "Token akses berumur pendek itu bagus untuk keamanan, tapi tanpa alur penyegaran pengguna akan terlempar di tengah pekerjaan."
goal: "Sesi pengguna terasa mulus sambil tetap aman."
benefits: "Tidak ada kehilangan data isian dan tidak ada logout mengejutkan."
challenges: "Penyegaran token yang serentak dari banyak request bisa saling bertabrakan."
tags: [jwt, autentikasi, refresh-token, frontend]
links:
  - label: "OWASP JWT Cheat Sheet"
    url: "https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html"
---

> 📸 **TODO (isi dengan bukti milikmu):** respons 401 di tab Network, log refresh token, dan perilaku sebelum/sesudah perbaikan.

## Gejala

Setelah beberapa waktu, request mulai dibalas 401 dan pengguna dilempar ke halaman login, kadang saat sedang mengisi form panjang.

## Penyebab

Token akses berumur pendek (mis. 15 menit) tidak disegarkan, atau penyegarannya gagal/tabrakan.

## Alur yang benar

1. Simpan **refresh token** (umur lebih panjang) secara aman, idealnya cookie `HttpOnly`.
2. Saat request menerima 401 karena token kedaluwarsa, **segarkan token satu kali** lalu ulangi request asli.
3. Jika penyegaran gagal, baru arahkan ke login.

## Mencegah tabrakan: satu penyegaran bersama

Jika sepuluh request serentak menerima 401, jangan memicu sepuluh penyegaran:

```ts
let sedangRefresh: Promise<string> | null = null;

async function dapatkanTokenBaru() {
  sedangRefresh ??= fetch("/api/auth/refresh", { method: "POST" })
    .then((r) => { if (!r.ok) throw new Error("refresh gagal"); return r.json(); })
    .then((d) => d.accessToken)
    .finally(() => { sedangRefresh = null; });
  return sedangRefresh;
}

async function apiFetch(url: string, init: RequestInit = {}) {
  let res = await fetch(url, init);
  if (res.status === 401) {
    const token = await dapatkanTokenBaru();
    res = await fetch(url, { ...init, headers: { ...init.headers, Authorization: `Bearer ${token}` } });
  }
  return res;
}
```

## Hal lain yang memicu "expired" palsu

- **Jam server dan penerbit token berbeda**; beri toleransi kecil (*clock skew*) saat verifikasi.
- **Rotasi refresh token**: bila dua tab menyegarkan bersamaan dan token lama langsung dicabut, salah satunya gagal. Atur masa toleransi atau koordinasikan antar tab.
- Perhatikan juga masa berlaku sesi total dan kebijakan keamanannya.
