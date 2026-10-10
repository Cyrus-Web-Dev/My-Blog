---
title: "Upload Gambar Massal yang Bikin Aplikasi Hang"
slug: upload-gambar-massal-aplikasi-hang
category: frontend
type: studi-kasus
level: menengah
published: false
date: 2026-09-27
excerpt: "Memilih 200 gambar lalu mengunggah semuanya sekaligus membuat browser macet dan server kewalahan. Batasi konkurensinya."
goal: "Unggah ratusan file tanpa membuat antarmuka membeku atau server tumbang."
benefits: "Aplikasi tetap responsif dan kegagalan sebagian bisa dicoba ulang."
challenges: "Pengujian dengan 3 file tidak memperlihatkan masalah yang muncul pada 200 file."
tags: [upload, performa, javascript, antrian]
links:
  - label: "MDN: Fetch API"
    url: "https://developer.mozilla.org/id/docs/Web/API/Fetch_API"
---

> 📸 **TODO (isi dengan bukti milikmu):** tab Performance atau Memory saat 200 upload serentak, tab Network yang menunjukkan banyak request pending, dan hasil sesudah dibatasi.

## Gejala

Tab browser membeku, banyak request gagal atau time out, server mengembalikan 502/503, atau memori melonjak.

## Penyebab

Memicu ratusan `fetch` sekaligus: browser membatasi koneksi per host (sisanya mengantri), memori terpakai untuk menahan banyak file, dan server menerima lonjakan yang tidak diantisipasi.

## Solusi sisi client: batasi konkurensi

```ts
async function jalankanBerbatas<T>(
  items: T[],
  batas: number,
  kerja: (item: T) => Promise<void>
) {
  const antrean = [...items];
  const pekerja = Array.from({ length: batas }, async () => {
    while (antrean.length) {
      const item = antrean.shift()!;
      await kerja(item);
    }
  });
  await Promise.all(pekerja);
}

await jalankanBerbatas(files, 3, async (file) => {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) gagal.push(file.name);   // kumpulkan untuk dicoba ulang
});
```

Tampilkan progres (selesai/total) dan sediakan tombol "coba ulang yang gagal".

## Solusi sisi server

- Pastikan batas ukuran sesuai (di PHP: `upload_max_filesize`, `post_max_size`; di Nginx: `client_max_body_size`).
- Proses berat (resize, hapus background) dipindahkan ke **antrean/queue** agar request unggah cepat selesai.
- Pertimbangkan unggah langsung ke penyimpanan objek lewat *signed URL* agar server aplikasi tidak menjadi perantara.

## Pelajaran

Selalu uji fitur massal dengan jumlah yang realistis, bukan tiga contoh.
