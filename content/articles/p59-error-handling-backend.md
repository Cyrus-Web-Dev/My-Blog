---
title: "Error Handling di Backend: Gagal dengan Anggun"
slug: error-handling-backend-gagal-dengan-anggun
category: backend
type: panduan
level: menengah
published: true
excerpt: "Error pasti terjadi. Yang membedakan sistem yang baik adalah cara ia gagal: jelas, aman, dan bisa dilacak."
goal: "Merancang penanganan error yang konsisten dan aman."
benefits: "Pengguna mendapat pesan jelas, kamu mendapat informasi cukup, tidak ada kebocoran detail internal."
tags: [error-handling, backend, api, praktik-terbaik]
links:
  - label: "MDN: Control flow and error handling"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling"
---

## Bedakan jenis error

1. **Error pengguna/operasional yang diharapkan**: validasi gagal, data tidak ada, tidak berhak. Kembalikan 4xx dengan pesan jelas.
2. **Error sistem tak terduga**: bug, database mati, timeout. Kembalikan 5xx umum, catat detail di log.

## Satu tempat menangani error

Pusatkan di middleware/handler global agar format seragam.

```ts
class ErrorAplikasi extends Error {
  constructor(public status: number, message: string, public kode?: string) { super(message); }
}

// handler global (contoh konsep)
function tangani(err: unknown) {
  if (err instanceof ErrorAplikasi) {
    return Response.json({ error: err.message, kode: err.kode }, { status: err.status });
  }
  logger.error({ err }, "Error tak terduga");
  return Response.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
}
```

## Aturan praktis

- **Jangan menelan error** diam-diam.
- **Jangan membocorkan** stack trace atau pesan SQL ke pengguna.
- **Tambah konteks** saat meneruskan (apa yang sedang dikerjakan).
- **Bersihkan sumber daya** (`finally`, transaksi di-rollback).
- **Timeout dan retry** untuk panggilan eksternal, dengan batas, dan hanya untuk error sementara.
- **Fail fast**: validasi di awal, sebelum pekerjaan berat.
- Buat tindakan yang bisa gagal sebagian menjadi **idempoten** agar aman diulang.

## Kasus nyata yang sering terlewat

- Promise yang ditolak tanpa penanganan (`unhandledRejection`).
- Error di callback atau event handler yang tak tertangkap `try/catch` luar.
- Pesan error yang berbeda untuk "email tidak terdaftar" dan "password salah", yang membantu penyerang.
