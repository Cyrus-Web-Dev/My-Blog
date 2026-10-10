"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import type { Post } from "@/lib/types";
import { catMeta, levelMeta, typeMeta } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge } from "./ui/badge";

export function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
  const c = catMeta(post.category), t = typeMeta(post.post_type), lv = levelMeta(post.level);
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.05 }} whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-xl hover:shadow-violet-500/10"
    >
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-violet-500/20 via-transparent to-amber-400/20">
          {post.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.cover_image} alt={post.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          ) : (
            <div className="grid h-full place-items-center text-5xl opacity-60">{t.emoji}</div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={c.badge}>{c.label}</Badge>
            <Badge className="border-border text-muted-foreground">{t.emoji} {t.label}</Badge>
            <Badge className={lv.badge}>{lv.label}</Badge>
          </div>
          <h3 className="text-lg font-semibold leading-snug group-hover:text-primary">{post.title}</h3>
          <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
          <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
            <span>{post.author} · {formatDate(post.created_at)}</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {post.reading_minutes} mnt</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
