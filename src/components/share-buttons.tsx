"use client";
import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { Button } from "./ui/button";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = () => window.location.href;
  const open = (u: string) => window.open(u, "_blank", "noopener,noreferrer,width=600,height=500");
  return (
    <div className="mt-10 flex flex-wrap items-center gap-2 border-y border-border py-4">
      <span className="mr-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Share2 size={14} /> Bagikan:</span>
      <Button variant="outline" size="sm" onClick={() => open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url())}`)}>X / Twitter</Button>
      <Button variant="outline" size="sm" onClick={() => open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url())}`)}>LinkedIn</Button>
      <Button variant="outline" size="sm" onClick={async () => { await navigator.clipboard.writeText(url()); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
        {copied ? <><Check size={14} /> Tersalin</> : <><Link2 size={14} /> Salin link</>}
      </Button>
    </div>
  );
}
