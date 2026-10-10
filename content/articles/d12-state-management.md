---
title: "State Management di Frontend Modern: Local, Global, Server, dan URL State"
slug: state-management-frontend-modern
category: framework
type: deep-dive
level: menengah
published: true
excerpt: "Kebanyakan masalah 'state management' sebenarnya karena menaruh semua jenis state di satu tempat. Pisahkan berdasarkan jenisnya."
goal: "Memilih tempat dan alat yang tepat untuk tiap jenis state."
benefits: "Komponen lebih sederhana, lebih sedikit bug sinkronisasi, dan lebih sedikit kode."
tags: [state, react, tanstack-query, arsitektur, frontend]
links:
  - label: "React: Managing State"
    url: "https://react.dev/learn/managing-state"
  - label: "TanStack Query"
    url: "https://tanstack.com/query/latest"
---

## Lima jenis state

| Jenis | Contoh | Tempat yang cocok |
|---|---|---|
| **Lokal UI** | Modal terbuka, tab aktif, nilai input sementara | `useState` di komponen |
| **Bersama (client)** | Tema, keranjang belanja, sidebar | Context, atau store ringan (Zustand, Jotai) |
| **Server (data jarak jauh)** | Daftar pesanan, profil pengguna | Pustaka data (TanStack Query, SWR) atau Server Components |
| **URL** | Halaman, filter, kata pencarian, tab | `searchParams` / router |
| **Form** | Nilai, error, status kirim | State form + pustaka (React Hook Form) + skema validasi |

Kesalahan paling umum: menyalin **data server** ke store global lalu mengurus sendiri status memuat, cache, dan kebasian. Itu pekerjaan pustaka data.

## 1. Mulai lokal, naikkan jika perlu

Simpan state di komponen yang memakainya. Jika dua komponen bersaudara butuh, **angkat ke induk terdekat** (*lifting state up*). Jangan langsung ke global.

## 2. State server: perlakukan sebagai cache

Data dari server bukan milikmu; ia salinan yang bisa basi. Pustaka data mengurus:

```tsx
const { data, isPending, error } = useQuery({
  queryKey: ["pesanan", { status, halaman }],
  queryFn: () => ambilPesanan({ status, halaman }),
});
```

- Cache dan deduplikasi permintaan.
- Penyegaran otomatis dan invalidasi setelah mutasi.
- Status memuat/error yang konsisten.
- Pembatalan permintaan lama (mencegah race condition).

Untuk mutasi:

```tsx
const qc = useQueryClient();
const ubah = useMutation({
  mutationFn: simpanPesanan,
  onSuccess: () => qc.invalidateQueries({ queryKey: ["pesanan"] }),
});
```

Dengan Server Components di Next.js, banyak data bisa diambil di server sehingga tidak perlu menjadi state client sama sekali.

## 3. URL sebagai state

Filter, urutan, halaman, dan kata pencarian yang disimpan di URL membuat tampilan **bisa dibagikan, di-bookmark, dan bekerja dengan tombol Back**. Sering lebih baik daripada state lokal.

## 4. State bersama yang benar-benar global

Biasanya sedikit: sesi/identitas pengguna, tema, preferensi, keranjang. Untuk ini, Context cukup bila jarang berubah; untuk yang sering berubah dan dibaca banyak komponen, store dengan *selector* (Zustand, Jotai) menghindari render ulang berlebih.

```ts
// Zustand: komponen hanya berlangganan bagian yang dipakai
const jumlah = useKeranjang((s) => s.item.length);
```

## 5. Derivasi, bukan duplikasi

Jangan simpan nilai yang bisa dihitung dari state lain.

```tsx
const total = item.reduce((a, i) => a + i.harga * i.jumlah, 0); // hitung, jangan simpan
```

Dua sumber kebenaran untuk satu fakta berarti suatu hari keduanya berbeda.

## 6. Bentuk state yang baik

- **Normalisasi** data bersarang besar (per ID) bila sering diperbarui.
- Gunakan **status eksplisit** (`'idle' | 'loading' | 'success' | 'error'`) daripada banyak boolean yang bisa saling bertentangan.
- Untuk transisi kompleks, `useReducer` atau mesin status memberi alur yang bisa diprediksi.

## Pohon keputusan singkat

1. Hanya satu komponen memakai? → `useState`.
2. Berasal dari server? → pustaka data/Server Component.
3. Perlu bisa dibagikan lewat link? → URL.
4. Banyak komponen jauh membutuhkan dan sering berubah? → store dengan selector.
5. Jarang berubah dan luas dipakai (tema, auth)? → Context.

## Kesalahan yang sering terjadi

- Menyimpan semuanya di Redux/store global "supaya rapi".
- Menyinkronkan state dengan `useEffect` padahal bisa diturunkan.
- Mengabaikan status memuat dan error.
- Context yang memuat state sering berubah sehingga seluruh pohon ter-render ulang.

> 📸 **TODO (opsional):** tambahkan diagram jenis state dari aplikasi milikmu atau screenshot React DevTools Profiler yang menunjukkan render ulang berkurang.
