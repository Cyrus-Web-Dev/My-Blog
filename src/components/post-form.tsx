"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, LEVELS, POST_TYPES } from "@/lib/constants";
import { fieldClass, readingMinutes, slugify } from "@/lib/utils";
import type { Post } from "@/lib/types";
import { Button } from "./ui/button";

const linksToText = (l: Post["links"]) => l.map((x) => `${x.label} | ${x.url}`).join("\n");
const textToLinks = (t: string) =>
  t.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
    const [label, ...rest] = l.split("|");
    const url = rest.join("|").trim();
    return url ? { label: label.trim(), url } : { label: l, url: l };
  });

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function PostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const qc = useQueryClient();
  const supabase = createClient();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState(post?.content ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setUploading(true); setError("");
    const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("post-images").upload(path, file);
    if (error) setError(error.message);
    else {
      const { data } = supabase.storage.from("post-images").getPublicUrl(path);
      const el = contentRef.current, pos = el?.selectionStart ?? content.length;
      setContent(content.slice(0, pos) + `\n![Deskripsi screenshot](${data.publicUrl})\n` + content.slice(pos));
    }
    setUploading(false);
  }

  const save = useMutation({
    mutationFn: async (fd: FormData) => {
      const g = (k: string) => String(fd.get(k) ?? "").trim();
      const title = g("title");
      const body = {
        title, slug: g("slug") || slugify(title), excerpt: g("excerpt"), goal: g("goal"), benefits: g("benefits"),
        challenges: g("challenges"), content, links: textToLinks(g("links")), cover_image: g("cover_image") || null,
        author: g("author"), tags: g("tags").split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
        category: g("category"), post_type: g("post_type"), level: g("level"), tech_versions: g("tech_versions") || null,
        verified_at: g("verified_at") || null, reading_minutes: readingMinutes(content), published: fd.get("published") === "on",
      };
      const res = post ? await supabase.from("posts").update(body).eq("id", post.id) : await supabase.from("posts").insert(body);
      if (res.error) throw new Error(res.error.message);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-posts"] }); router.push("/admin"); router.refresh(); },
    onError: (e: Error) => setError(e.message),
  });

  return (
    <form action={(fd) => save.mutate(fd)} className="mx-auto max-w-3xl space-y-5">
      <Field label="Judul"><input name="title" required defaultValue={post?.title} className={fieldClass} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Kategori">
          <select name="category" defaultValue={post?.category ?? "frontend"} className={fieldClass}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </Field>
        <Field label="Tipe artikel" hint="Ringan / Studi Kasus / Deep Dive / Panduan">
          <select name="post_type" defaultValue={post?.post_type ?? "ringan"} className={fieldClass}>
            {POST_TYPES.map((t) => <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Level pembaca">
        <select name="level" defaultValue={post?.level ?? "menengah"} className={fieldClass}>
          {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
      </Field>
      <Field label="Ringkasan (tampil di kartu & SEO)"><textarea name="excerpt" rows={2} defaultValue={post?.excerpt} className={fieldClass} /></Field>
      <Field label="🎯 Tujuan akhir"><textarea name="goal" rows={2} defaultValue={post?.goal} className={fieldClass} /></Field>
      <Field label="✨ Manfaat"><textarea name="benefits" rows={2} defaultValue={post?.benefits} className={fieldClass} /></Field>
      <Field label="⚠️ Tantangan dan kendala"><textarea name="challenges" rows={2} defaultValue={post?.challenges} className={fieldClass} /></Field>
      <Field label="Isi lengkap (Markdown)" hint="Pakai ## untuk subjudul (otomatis jadi daftar isi), ``` untuk kode, > untuk catatan penting.">
        <textarea ref={contentRef} rows={18} value={content} onChange={(e) => setContent(e.target.value)} className={`${fieldClass} font-mono`} />
      </Field>
      <div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm hover:bg-muted">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />} Upload screenshot ke isi artikel
          <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        </label>
      </div>
      <Field label="Link referensi" hint="Satu per baris: Label | https://url"><textarea name="links" rows={3} defaultValue={post ? linksToText(post.links) : ""} className={fieldClass} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Gambar sampul (URL, opsional)"><input name="cover_image" defaultValue={post?.cover_image ?? ""} className={fieldClass} /></Field>
        <Field label="Tag (pisah koma)"><input name="tags" defaultValue={post?.tags.join(", ")} className={fieldClass} /></Field>
        <Field label="Nama penulis"><input name="author" defaultValue={post?.author ?? process.env.NEXT_PUBLIC_AUTHOR_NAME ?? ""} className={fieldClass} /></Field>
        <Field label="Slug (kosongkan = otomatis)"><input name="slug" defaultValue={post?.slug} className={fieldClass} /></Field>
        <Field label="Versi teknologi" hint="Contoh: Next.js 15.1, Supabase JS 2.47"><input name="tech_versions" defaultValue={post?.tech_versions ?? ""} className={fieldClass} /></Field>
        <Field label="Terakhir diverifikasi"><input type="date" name="verified_at" defaultValue={post?.verified_at ?? ""} className={fieldClass} /></Field>
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={post?.published} /> Terbitkan (tampil publik)</label>
      {error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}
      <Button type="submit" disabled={save.isPending}>{save.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Simpan</Button>
    </form>
  );
}
