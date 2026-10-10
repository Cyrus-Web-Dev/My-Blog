import { cn } from "@/lib/utils";

// Logo BDW: prompt terminal ">_" — ungu dan kuning
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label="BDW" className={cn("h-7 w-7", className)}>
      <defs>
        <linearGradient id="bdw-logo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#4c1d95" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#bdw-logo-bg)" />
      <polyline points="17,20 31,32 17,44" fill="none" stroke="#fbbf24" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="36" y1="46" x2="49" y2="46" stroke="#fde68a" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}
