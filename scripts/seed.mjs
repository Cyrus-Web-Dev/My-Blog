// Memasukkan semua artikel di content/articles/*.md ke Supabase.
// Jalankan: npm run seed   (butuh SUPABASE_SERVICE_ROLE_KEY di .env.local — JANGAN diawali NEXT_PUBLIC_)
import { createClient } from "@supabase/supabase-js";
import matter from "gray-matter";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Isi NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di .env.local");
const supabase = createClient(url, key);
const author = process.env.NEXT_PUBLIC_AUTHOR_NAME || "Developer BDW";

const minutes = (t) => Math.max(1, Math.round(t.trim().split(/\s+/).filter(Boolean).length / 200));
const dir = "content/articles";
const rows = readdirSync(dir).filter((f) => f.endsWith(".md")).sort().map((f, i) => {
  const { data: d, content } = matter(readFileSync(join(dir, f), "utf8"));
  return {
    slug: d.slug, title: d.title, excerpt: d.excerpt ?? "", goal: d.goal ?? "", benefits: d.benefits ?? "",
    challenges: d.challenges ?? "", content: content.trim(), links: d.links ?? [], cover_image: d.cover ?? null,
    author, tags: d.tags ?? [], category: d.category, post_type: d.type, level: d.level ?? "menengah",
    tech_versions: d.tech ?? null, verified_at: d.verified ?? null,
    reading_minutes: minutes(content), published: d.published ?? false,
    created_at: (d.date ? new Date(d.date) : new Date(Date.now() - i * 60_000)).toISOString(),
  };
});

const { error } = await supabase.from("posts").upsert(rows, { onConflict: "slug" });
if (error) { console.error(error); process.exit(1); }
console.log(`✅ ${rows.length} artikel masuk (${rows.filter((r) => r.published).length} terbit, ${rows.filter((r) => !r.published).length} draf).`);
