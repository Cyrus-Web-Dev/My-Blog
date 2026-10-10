export type Category = "frontend" | "backend" | "api" | "database" | "framework";
export type PostType = "ringan" | "studi-kasus" | "deep-dive" | "panduan";
export type Level = "pemula" | "menengah" | "mahir";
export type PostLink = { label: string; url: string };

export type Post = {
  id: string; slug: string; title: string; excerpt: string;
  goal: string; benefits: string; challenges: string; content: string;
  links: PostLink[]; cover_image: string | null; author: string; tags: string[];
  category: Category; post_type: PostType; level: Level; tech_versions: string | null; verified_at: string | null;
  reading_minutes: number; published: boolean; created_at: string; updated_at: string;
};
