import Link from "next/link";
import { ArrowRight, Clock, Search } from "lucide-react";
import { getPosts } from "@/lib/posts";
import { CATEGORIES, LEVELS, POST_TYPES, catMeta, typeMeta } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";
import { PostCard } from "@/components/post-card";
import { HeroSpotlight } from "@/components/hero-spotlight";
import { HeroSceneLoader } from "@/components/hero-scene-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type SP = { q?: string; category?: string; type?: string; level?: string };

export default async function Home({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const posts = await getPosts(sp);
  const filtered = Boolean(sp.q || sp.category || sp.type || sp.level);
  const featured = !filtered ? posts[0] : undefined;
  const rest = featured ? posts.slice(1) : posts;

  const href = (o: Partial<SP>) => {
    const p = new URLSearchParams();
    Object.entries({ ...sp, ...o }).forEach(([k, v]) => v && p.set(k, v));
    const s = p.toString();
    return `/${s ? `?${s}` : ""}#artikel`;
  };
  const chip = (active: boolean) =>
    cn("rounded-full border px-3 py-1 text-sm transition", active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted");

  return (
    <>
      <HeroSpotlight>
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">Bacotan Developer Web</p>
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
              Ngebacot soal kode,{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">tanpa bikin ngantuk.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Opini, studi kasus, dan panduan mendalam seputar frontend, backend, API, database, dan framework — dengan bukti, bukan sekadar teori.
            </p>
            <form action="/" className="mt-8 flex max-w-lg gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input name="q" defaultValue={sp.q} placeholder="Cari artikel…" className="h-10 w-full rounded-lg border border-border bg-background/70 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <Button type="submit">Cari</Button>
            </form>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {POST_TYPES.map((t) => <span key={t.value} className="rounded-full border border-border px-3 py-1">{t.emoji} {t.label}</span>)}
            </div>
          </div>
          <div className="relative hidden h-[380px] lg:block"><HeroSceneLoader /></div>
        </div>
      </HeroSpotlight>

      <section id="artikel" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-12">
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="group mb-12 grid overflow-hidden rounded-3xl border border-border bg-card transition hover:shadow-2xl hover:shadow-violet-500/10 md:grid-cols-2">
            <div className="grid min-h-[220px] place-items-center bg-gradient-to-br from-violet-500/25 via-transparent to-amber-400/25 text-7xl">
              {featured.cover_image
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={featured.cover_image} alt={featured.title} className="h-full w-full object-cover" />
                : typeMeta(featured.post_type).emoji}
            </div>
            <div className="flex flex-col justify-center gap-3 p-8">
              <div className="flex gap-2">
                <Badge className="border-primary/40 bg-primary/10 text-primary">Terbaru</Badge>
                <Badge className={catMeta(featured.category).badge}>{catMeta(featured.category).label}</Badge>
              </div>
              <h2 className="text-2xl font-bold leading-snug group-hover:text-primary sm:text-3xl">{featured.title}</h2>
              <p className="text-muted-foreground">{featured.excerpt}</p>
              <p className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{formatDate(featured.created_at)}</span>
                <span className="flex items-center gap-1"><Clock size={13} /> {featured.reading_minutes} mnt</span>
                <span className="ml-auto flex items-center gap-1 text-primary">Baca <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span>
              </p>
            </div>
          </Link>
        )}

        <div className="mb-3 flex flex-wrap gap-2">
          <Link href={href({ category: undefined })} className={chip(!sp.category)}>Semua</Link>
          {CATEGORIES.map((c) => <Link key={c.value} href={href({ category: c.value })} className={chip(sp.category === c.value)}>{c.label}</Link>)}
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          {LEVELS.map((l) => <Link key={l.value} href={href({ level: sp.level === l.value ? undefined : l.value })} className={chip(sp.level === l.value)}>🎚️ {l.label}</Link>)}
        </div>
        <div className="mb-8 flex flex-wrap gap-2">
          {POST_TYPES.map((t) => <Link key={t.value} href={href({ type: sp.type === t.value ? undefined : t.value })} className={chip(sp.type === t.value)}>{t.emoji} {t.label}</Link>)}
        </div>

        {posts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">Belum ada artikel yang cocok. Coba filter lain ☕</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}
          </div>
        )}
      </section>
    </>
  );
}
