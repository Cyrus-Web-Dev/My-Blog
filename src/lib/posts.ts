import { createClient } from "./supabase/server";
import type { Post } from "./types";

export async function getPosts(f: { q?: string; category?: string; type?: string; level?: string } = {}) {
  const supabase = await createClient();
  let query = supabase.from("posts").select("*").eq("published", true).order("created_at", { ascending: false });
  if (f.category) query = query.eq("category", f.category);
  if (f.type) query = query.eq("post_type", f.type);
  if (f.level) query = query.eq("level", f.level);
  if (f.q) {
    const q = f.q.replace(/[,()%*]/g, " ").trim();
    if (q) query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`);
  }
  const { data } = await query;
  return (data ?? []) as Post[];
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  return data as Post | null;
}

export async function getRelated(post: Post) {
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").eq("published", true)
    .eq("category", post.category).neq("id", post.id).order("created_at", { ascending: false }).limit(3);
  return (data ?? []) as Post[];
}
