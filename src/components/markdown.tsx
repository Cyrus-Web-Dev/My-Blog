import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { ZoomImage } from "./zoom-image";
import { CodeBlock } from "./code-block";

// format "md" = Markdown biasa (aman untuk tanda { } < > di teks). Ganti ke "mdx" jika ingin komponen React di dalam artikel.
export function Markdown({ source }: { source: string }) {
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-primary prose-pre:p-0 prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:not-italic">
      <MDXRemote
        source={source}
        components={{ pre: CodeBlock, img: (p) => <ZoomImage src={typeof p.src === "string" ? p.src : undefined} alt={p.alt} /> }}
        options={{
          mdxOptions: {
            format: "md",
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, [rehypePrettyCode, { theme: { dark: "github-dark-dimmed", light: "github-light" }, keepBackground: false }]],
          },
        }}
      />
    </div>
  );
}
