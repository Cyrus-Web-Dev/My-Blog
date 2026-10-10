import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const posts = await getPosts();
  return [{ url: base, lastModified: new Date() }, ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.updated_at }))];
}
