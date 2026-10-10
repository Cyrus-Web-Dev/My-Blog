---
title: "Testing untuk Pemula: Unit, Integrasi, dan End-to-End"
slug: testing-untuk-pemula-unit-integrasi-e2e
category: framework
type: panduan
level: menengah
published: true
excerpt: "Tes bukan beban tambahan, melainkan jaring pengaman yang membuatmu berani mengubah kode."
goal: "Memahami jenis tes dan menulis tes pertama yang bermanfaat."
benefits: "Refaktor lebih aman dan bug regresi tertangkap otomatis."
tags: [testing, kualitas, vitest, playwright]
links:
  - label: "Vitest"
    url: "https://vitest.dev/guide/"
  - label: "Playwright"
    url: "https://playwright.dev/docs/intro"
  - label: "Laravel: Testing"
    url: "https://laravel.com/docs/testing"
---

## Tiga jenis tes

| Jenis | Menguji | Kecepatan | Jumlah |
|---|---|---|---|
| **Unit** | Satu fungsi/kelas terisolasi | Sangat cepat | Banyak |
| **Integrasi** | Beberapa bagian bekerja bersama (mis. API + database) | Sedang | Sedang |
| **End-to-end (E2E)** | Alur nyata lewat browser | Lambat | Sedikit, untuk alur kritis |

Idealnya piramida: banyak unit, lebih sedikit integrasi, sedikit E2E.

## Contoh tes unit (Vitest/Jest)

```ts
import { describe, it, expect } from "vitest";
import { hitungTotal } from "./keranjang";

describe("hitungTotal", () => {
  it("menjumlahkan harga dikali jumlah", () => {
    const total = hitungTotal([{ harga: 10000, jumlah: 2 }, { harga: 5000, jumlah: 1 }]);
    expect(total).toBe(25000);
  });

  it("mengembalikan 0 untuk keranjang kosong", () => {
    expect(hitungTotal([])).toBe(0);
  });
});
```

## Pola Arrange-Act-Assert

**Siapkan** data, **jalankan** fungsi, **periksa** hasil. Satu tes memeriksa satu perilaku.

## Apa yang layak dites

- Logika bisnis (perhitungan, aturan, status).
- Kasus tepi (kosong, nol, negatif, batas).
- Bug yang pernah terjadi (tes regresi).
- Alur kritis (login, pembayaran) dengan E2E.

Tidak perlu mengejar angka cakupan 100%; kejar kepercayaan pada bagian yang berisiko.

## Kebiasaan baik

Tes harus **cepat, deterministik, dan independen**. Jalankan otomatis di CI. Saat menemukan bug, tulis tes yang gagal dulu, perbaiki, lalu lihat tes itu lulus.
