---
title: "Validasi Input: di Client untuk Kenyamanan, di Server untuk Keamanan"
slug: validasi-input-client-dan-server
category: backend
type: panduan
level: pemula
published: true
excerpt: "Validasi di browser mudah dilewati. Server harus selalu memeriksa ulang semua yang masuk."
goal: "Menerapkan validasi dua lapis dengan benar."
benefits: "Data bersih, pengguna mendapat umpan balik jelas, dan celah keamanan berkurang."
tags: [validasi, keamanan, zod, laravel]
links:
  - label: "Zod"
    url: "https://zod.dev"
  - label: "Laravel: Validation"
    url: "https://laravel.com/docs/validation"
  - label: "OWASP Input Validation Cheat Sheet"
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"
---

## Dua lapis, dua tujuan

- **Client**: umpan balik cepat dan ramah ("format email salah").
- **Server**: pertahanan sebenarnya. Siapa pun bisa mengirim request langsung tanpa melewati formmu.

Aturan: **jangan pernah mempercayai input dari client**, termasuk yang tampak sudah divalidasi.

## Prinsip

1. **Allowlist** (daftar yang diizinkan) lebih aman daripada blocklist.
2. Periksa **tipe, panjang, rentang, dan format**.
3. Validasi **sebelum** memproses atau menyimpan.
4. Kembalikan pesan yang jelas dengan status 422.
5. Validasi **bukan pengganti** query berparameter dan escaping output.

## Contoh dengan Zod (bisa dipakai di client dan server)

```ts
import { z } from "zod";

export const pengadaanSchema = z.object({
  nama: z.string().min(3).max(100),
  jumlah: z.number().int().positive().max(10000),
  email: z.string().email(),
});

const hasil = pengadaanSchema.safeParse(body);
if (!hasil.success) {
  return Response.json({ errors: hasil.error.flatten().fieldErrors }, { status: 422 });
}
```

## Contoh di Laravel

```php
$data = $request->validate([
    'nama'   => ['required', 'string', 'min:3', 'max:100'],
    'jumlah' => ['required', 'integer', 'min:1', 'max:10000'],
    'email'  => ['required', 'email'],
]);
```

## Yang sering terlewat

- Batas ukuran dan tipe berkas unggahan (periksa tipe sebenarnya, bukan hanya ekstensi).
- Parameter URL dan query string, bukan hanya body.
- Mass assignment: hanya terima field yang diizinkan (`$fillable` di Laravel, atau pilih field secara eksplisit).
