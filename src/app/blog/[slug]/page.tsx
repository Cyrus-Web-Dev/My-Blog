import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import GithubSlugger from "github-slugger";
import { AlertTriangle, BadgeCheck, Clock, ExternalLink, Sparkles, Target } from "lucide-react";
import { getPostBySlug, getRelated } from "@/lib/posts";
import { catMeta, levelMeta, typeMeta } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/markdown";
import { PostCard } from "@/components/post-card";
import { ReadingProgress } from "@/components/reading-progress";
import { ShareButtons } from "@/components/share-buttons";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  if (!post) return {};
  return {
    title: post.title, description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article", images: post.cover_image ? [post.cover_image] : [] },
  };
}

function toc(md: string) {
  const slugger = new GithubSlugger();
  const out: { level: number; text: string; id: string }[] = [];
  let fence = false;
  for (const line of md.split("\n")) {
    if (line.startsWith("```")) { fence = !fence; continue; }
    if (fence) continue;
    const m = /^(#{2,3})\s+(.+)$/.exec(line);
    if (m) { const text = m[2].replace(/[`*_]/g, ""); out.push({ level: m[1].length, text, id: slugger.slug(text) }); }
  }
  return out;
}

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();
  const related = await getRelated(post);
  const c = catMeta(post.category), t = typeMeta(post.post_type), lv = levelMeta(post.level);
  const headings = toc(post.content);
  const info = [
    { icon: Target, title: "Tujuan Akhir", text: post.goal, tone: "text-sky-400" },
    { icon: Sparkles, title: "Manfaat", text: post.benefits, tone: "text-emerald-400" },
    { icon: AlertTriangle, title: "Tantangan & Kendala", text: post.challenges, tone: "text-amber-400" },
  ].filter((i) => i.text);

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 xl:grid-cols-[1fr_220px]">
        <article className="min-w-0 max-w-3xl">
          <div className="mb-4 flex flex-wrap gap-2">
            <Link href={`/?category=${post.category}#artikel`}><Badge className={c.badge}>{c.label}</Badge></Link>
            <Badge className="border-border text-muted-foreground">{t.emoji} {t.label}</Badge>
            <Badge className={lv.badge}>{lv.label}</Badge>
          </div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{post.author}</span>
            <span>{formatDate(post.created_at)}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {post.reading_minutes} menit baca</span>
          </div>
          {(post.tech_versions || post.verified_at) && (
            <p className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
              <BadgeCheck size={16} className="mt-0.5 shrink-0" />
              <span>
                {post.tech_versions && <>Diuji dengan: <b>{post.tech_versions}</b>. </>}
                {post.verified_at && <>Terakhir diverifikasi {formatDate(post.verified_at)}.</>}
              </span>
            </p>
          )}
          {post.cover_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.cover_image} alt={post.title} className="mt-8 w-full rounded-2xl border border-border" />
          )}
          {info.length > 0 && (
            <div className="my-8 grid gap-3 sm:grid-cols-3">
              {info.map(({ icon: Icon, title, text, tone }) => (
                <div key={title} className="rounded-xl border border-border bg-card p-4">
                  <p className={`mb-1.5 flex items-center gap-1.5 text-sm font-semibold ${tone}`}><Icon size={15} /> {title}</p>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          )}
          <Markdown source={post.content} />
          {post.links.length > 0 && (
            <section className="mt-12 rounded-xl border border-border p-5">
              <h2 className="mb-3 font-semibold">🔗 Referensi & Link</h2>
              <ul className="space-y-2 text-sm">
                {post.links.map((l) => (
                  <li key={l.url}><a href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline">{l.label} <ExternalLink size={12} /></a></li>
                ))}
              </ul>
            </section>
          )}
          <ShareButtons title={post.title} />
          {post.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">{post.tags.map((tg) => <Badge key={tg} className="border-border text-muted-foreground">#{tg}</Badge>)}</div>
          )}
        </article>
        {headings.length > 0 && (
          <aside className="hidden xl:block">
            <nav className="sticky top-24 text-sm">
              <p className="mb-3 font-semibold">Daftar Isi</p>
              <ul className="space-y-2 border-l border-border">
                {headings.map((h) => (
                  <li key={h.id} style={{ paddingLeft: h.level === 3 ? 24 : 12 }}>
                    <a href={`#${h.id}`} className="text-muted-foreground hover:text-foreground">{h.text}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}
      </div>
      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-4">
          <h2 className="mb-6 text-2xl font-bold">Baca juga</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}</div>
        </section>
      )}
    </>
  );
}
