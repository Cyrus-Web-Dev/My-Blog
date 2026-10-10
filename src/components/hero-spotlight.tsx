"use client";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

// Efek sorotan mengikuti kursor (gaya Aceternity UI), ditulis sendiri agar ringan
export function HeroSpotlight({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const bg = useMotionTemplate`radial-gradient(500px circle at ${x}px ${y}px, hsl(262 90% 60% / 0.18), transparent 70%)`;
  return (
    <section
      className="relative overflow-hidden border-b border-border/60"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left); y.set(e.clientY - r.top);
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.5)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.5)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: bg }} />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">{children}</div>
    </section>
  );
}
