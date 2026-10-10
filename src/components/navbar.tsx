"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { Logo } from "./logo";

export function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <Logo className="h-8 w-8" />
          <span>BDW</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Button asChild variant="ghost" size="sm"><Link href="/">Beranda</Link></Button>
          <Button asChild variant="ghost" size="sm"><Link href="/#artikel">Artikel</Link></Button>
          <Button variant="ghost" size="icon" aria-label="Ganti tema" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
            {mounted && (resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />)}
          </Button>
        </nav>
      </div>
    </header>
  );
}
