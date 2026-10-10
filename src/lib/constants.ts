import type { Category, Level, PostType } from "./types";

export const CATEGORIES: { value: Category; label: string; badge: string }[] = [
  { value: "frontend", label: "Frontend", badge: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
  { value: "backend", label: "Backend", badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  { value: "api", label: "API", badge: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  { value: "database", label: "Database", badge: "bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30" },
  { value: "framework", label: "Framework", badge: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
];
export const POST_TYPES: { value: PostType; label: string; emoji: string }[] = [
  { value: "ringan", label: "Bacotan Ringan", emoji: "☕" },
  { value: "studi-kasus", label: "Studi Kasus", emoji: "🔧" },
  { value: "deep-dive", label: "Deep Dive", emoji: "🧭" },
  { value: "panduan", label: "Panduan", emoji: "📘" },
];
export const LEVELS: { value: Level; label: string; badge: string }[] = [
  { value: "pemula", label: "Pemula", badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  { value: "menengah", label: "Menengah", badge: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  { value: "mahir", label: "Mahir", badge: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
];
export const levelMeta = (l: string) => LEVELS.find((x) => x.value === l) ?? LEVELS[1];
export const catMeta = (c: string) => CATEGORIES.find((x) => x.value === c) ?? CATEGORIES[0];
export const typeMeta = (t: string) => POST_TYPES.find((x) => x.value === t) ?? POST_TYPES[0];
