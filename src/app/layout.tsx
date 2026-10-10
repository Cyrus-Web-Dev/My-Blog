import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "BDW — Bacotan Developer Web", template: "%s · BDW" },
  description: "Catatan jujur seorang developer: frontend, backend, API, database, dan framework — lengkap dengan bukti screenshot.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${sans.variable} ${mono.variable} font-sans`}>
        <Providers>
          <Navbar />
          <main className="min-h-[70vh]">{children}</main>
          <footer className="mt-24 border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} BDW — Bacotan Developer Web · <a href="/admin" className="hover:text-foreground">Admin</a>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
