import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-32 text-center">
      <p className="text-7xl font-extrabold text-primary">404</p>
      <h1 className="mt-4 text-xl font-semibold">Halamannya nyasar, kayak import yang salah path.</h1>
      <Button asChild className="mt-6"><Link href="/">Kembali ke beranda</Link></Button>
    </div>
  );
}
