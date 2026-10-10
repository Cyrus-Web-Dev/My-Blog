"use client";
import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeBlock({ children, ...props }: React.ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  return (
    <div className="group relative">
      <button
        type="button"
        aria-label="Salin kode"
        onClick={async () => {
          await navigator.clipboard.writeText(ref.current?.textContent ?? "");
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-md border border-border bg-background/80 px-2 py-1 text-xs opacity-0 backdrop-blur transition group-hover:opacity-100 focus:opacity-100"
      >
        {copied ? <><Check size={12} /> Tersalin</> : <><Copy size={12} /> Salin</>}
      </button>
      <pre ref={ref} {...props}>{children}</pre>
    </div>
  );
}
