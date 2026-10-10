---
title: "TypeScript Dasar: Tipe, Interface, dan Union untuk Pemula"
slug: typescript-dasar-tipe-interface-union
category: frontend
type: panduan
level: pemula
published: true
excerpt: "TypeScript adalah JavaScript dengan pemeriksaan tipe. Kuasai lima konsep ini dan kamu sudah bisa memakainya sehari-hari."
goal: "Menulis TypeScript dasar yang benar."
benefits: "Bug tertangkap di editor sebelum kode berjalan."
tags: [typescript, javascript, dasar, pemula]
links:
  - label: "TypeScript Handbook"
    url: "https://www.typescriptlang.org/docs/handbook/intro.html"
---

## 1. Anotasi tipe

```ts
let nama: string = "Ayu";
let umur: number = 20;
const aktif: boolean = true;
const skor: number[] = [90, 80];
```

Sering tak perlu ditulis: TypeScript **menyimpulkan** tipe (`const x = 5` sudah bertipe `number`).

## 2. Fungsi

```ts
function tambah(a: number, b: number): number {
  return a + b;
}
```

## 3. Objek: interface atau type

```ts
interface Pelanggan {
  id: number;
  nama: string;
  email?: string;   // opsional
}

const p: Pelanggan = { id: 1, nama: "Ayu" };
```

## 4. Union dan literal

```ts
type Status = "draft" | "diposting" | "dibatalkan";

function ubahStatus(s: Status) {}
ubahStatus("draft");     // ok
ubahStatus("selesai");   // error saat menulis kode
```

## 5. Penyempitan (narrowing)

```ts
function panjang(x: string | string[]) {
  if (typeof x === "string") return x.length;
  return x.length;       // di sini x pasti array
}
```

## Generik (pengantar)

```ts
function pertama<T>(arr: T[]): T | undefined {
  return arr[0];
}
```

## Tips awal

- Aktifkan `"strict": true`.
- Hindari `any`; gunakan `unknown` lalu persempit.
- Data dari luar (API) tetap perlu divalidasi saat runtime (mis. Zod); tipe hilang setelah kompilasi.
