---
title: "Inertia + Vue: Props Tidak Update Setelah Submit Form"
slug: inertia-vue-props-tidak-update-setelah-submit
category: framework
type: studi-kasus
level: menengah
published: false
date: 2026-09-21
excerpt: "Data di server sudah berubah, tetapi tampilan tetap menampilkan nilai lama. Biasanya reaktivitas Vue yang terputus."
goal: "Tampilan selalu mengikuti data terbaru dari server setelah aksi."
benefits: "Memahami aliran data Inertia dan reaktivitas Vue sehingga bug serupa mudah dicegah."
challenges: "Kodenya terlihat benar dan tidak menghasilkan error; datanya hanya tidak ikut berubah."
tags: [inertia, vue, laravel, reaktivitas]
links:
  - label: "Inertia: Partial reloads"
    url: "https://inertiajs.com/partial-reloads"
  - label: "Vue: Reactivity in depth"
    url: "https://vuejs.org/guide/extras/reactivity-in-depth.html"
---

> 📸 **TODO (isi dengan bukti milikmu):** rekaman atau screenshot sebelum/sesudah submit, plus tab Network yang menunjukkan respons Inertia sudah berisi data baru.

## Gejala

Setelah menyimpan, server mengirim props baru, tetapi komponen masih menampilkan nilai lama.

## Penyebab yang umum

**1. Menyalin props sekali ke state lokal**

```vue
<script setup>
const props = defineProps({ pengadaan: Object });
const data = ref(props.pengadaan);   // hanya disalin saat komponen dibuat
</script>
```

`data` tidak akan ikut berubah ketika `props.pengadaan` berubah.

**2. Mendestrukturisasi props** pada Vue versi lama (sebelum 3.5) memutus reaktivitas.

**3. `preserveState: true`** mempertahankan state lokal komponen saat navigasi, sehingga nilai lama tetap dipakai.

## Perbaikan

Gunakan props secara langsung atau lewat `computed`:

```vue
<script setup>
const props = defineProps({ pengadaan: Object });
const total = computed(() => props.pengadaan.items.reduce((a, i) => a + i.subtotal, 0));
</script>
```

Jika memang butuh salinan yang bisa diedit (misalnya form), sinkronkan secara eksplisit:

```js
watch(() => props.pengadaan, (baru) => { form.defaults(baru); form.reset(); });
```

Untuk memuat ulang sebagian data saja setelah aksi:

```js
router.reload({ only: ['pengadaan'] });
```

## Pelajaran

Perlakukan props sebagai sumber kebenaran. Salin hanya bila perlu, dan sinkronkan dengan sengaja.
