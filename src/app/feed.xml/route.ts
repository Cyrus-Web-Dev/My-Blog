import { getPosts } from "@/lib/posts";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const posts = await getPosts();
  const items = posts.map((p) => `<item><title>${esc(p.title)}</title><link>${base}/blog/${p.slug}</link><guid>${base}/blog/${p.slug}</guid><pubDate>${new Date(p.created_at).toUTCString()}</pubDate><description>${esc(p.excerpt)}</description></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>BDW — Bacotan Developer Web</title><link>${base}</link><description>Catatan developer: frontend, backend, API, database, framework.</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
