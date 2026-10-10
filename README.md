# BDW — Bacotan Developer Web

Next.js 15 (App Router) + Tailwind + shadcn/ui + Supabase + Framer Motion + TanStack Query + Shiki + react-medium-image-zoom.

## Setup
1. `npm install`
2. Supabase → SQL Editor → jalankan `supabase/schema.sql` (jika database sudah dibuat dari versi sebelumnya, jalankan `supabase/migration-002-panduan-level.sql` saja) (ganti `GANTI_DENGAN_EMAIL_KAMU` dengan emailmu).
3. Supabase → Authentication → Users → buat user dengan email & password yang sama.
4. `cp .env.example .env.local` lalu isi URL, anon key, dan `ADMIN_EMAIL`.
5. (Opsional) Isi 30 artikel awal: tambahkan `SUPABASE_SERVICE_ROLE_KEY` di `.env.local` (Supabase → Project Settings → API; **rahasia, jangan dipublikasikan**), lalu `npm run seed`.
   - 103 artikel (ringan, deep dive, panduan) langsung terbit; 17 studi kasus masuk sebagai **draf** sampai kamu menambah screenshot/pengalaman sendiri lalu menekan ikon mata di /admin.
   - Kolom "diuji dengan" dan "terakhir diverifikasi" sengaja dikosongkan; isi setelah kamu benar-benar mengujinya.
6. `npm run dev` → buka http://localhost:3000 dan http://localhost:3000/admin

## Menulis artikel
Admin → "Bacotan baru". Pakai `##` untuk subjudul (otomatis jadi Daftar Isi), tombol "Upload screenshot" menyisipkan gambar ke isi artikel.
Keamanan: akses tulis dibatasi oleh Row Level Security (`is_admin()`), bukan hanya oleh halaman admin.

## Logo
`public/logo-bdw.svg` (ikon `>_`, ungu + kuning), `public/logo-bdw-lockup.svg` (ikon + tulisan), PNG 512px dan `apple-touch-icon.png`. Favicon otomatis dari `src/app/icon.svg`.
