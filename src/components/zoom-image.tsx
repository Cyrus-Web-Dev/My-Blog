"use client";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

export function ZoomImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null;
  return (
    <figure className="my-6">
      <Zoom>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt ?? ""} loading="lazy" className="mx-auto w-full rounded-xl border border-border" />
      </Zoom>
      {alt && <figcaption className="mt-2 text-center text-xs text-muted-foreground">📸 {alt} — klik untuk memperbesar</figcaption>}
    </figure>
  );
}
