---
title: "Form di React: Controlled Input, Validasi, dan Status Kirim"
slug: form-di-react-controlled-validasi-status-kirim
category: frontend
type: panduan
level: pemula
published: true
excerpt: "Form tampak sepele sampai kamu butuh validasi, error per field, dan status loading. Ini pola dasarnya."
goal: "Membuat form React yang benar dan mudah dirawat."
benefits: "Pengalaman mengisi form yang jelas dan bebas bug umum."
tags: [react, form, validasi, frontend]
links:
  - label: "React: Reacting to input with state"
    url: "https://react.dev/learn/reacting-to-input-with-state"
  - label: "React Hook Form"
    url: "https://react-hook-form.com/"
---

## Controlled input

Nilai input disimpan di state dan diperbarui lewat event.

```tsx
function FormPelanggan() {
  const [nama, setNama] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mengirim, setMengirim] = useState(false);

  async function kirim(e: React.FormEvent) {
    e.preventDefault();
    if (nama.trim().length < 3) return setError("Nama minimal 3 karakter.");
    setError(null);
    setMengirim(true);
    try {
      const res = await fetch("/api/pelanggan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan.");
      setNama("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setMengirim(false);
    }
  }

  return (
    <form onSubmit={kirim}>
      <label htmlFor="nama">Nama</label>
      <input id="nama" value={nama} onChange={(e) => setNama(e.target.value)} aria-invalid={!!error} />
      {error && <p role="alert">{error}</p>}
      <button disabled={mengirim}>{mengirim ? "Menyimpan…" : "Simpan"}</button>
    </form>
  );
}
```

## Hal yang sering terlewat

- **Cegah kirim ganda**: nonaktifkan tombol saat mengirim.
- **Label terhubung** ke input; pesan error mudah dibaca pembaca layar (`role="alert"`).
- **Jangan menghapus isian** saat error terjadi.
- **Validasi ulang di server**; validasi client hanya kenyamanan.

## Saat form membesar

Gunakan **React Hook Form** (performa baik, sedikit render ulang) dipadukan dengan skema **Zod** untuk validasi yang sama di client dan server.
