"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError("");
    const fd = new FormData(e.currentTarget);
    const { error } = await createClient().auth.signInWithPassword({ email: String(fd.get("email")), password: String(fd.get("password")) });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/admin"); router.refresh();
  }
  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="mb-6 text-2xl font-bold">Masuk Admin BDW</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="password" type="password" placeholder="Password" required />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Memproses…" : "Masuk"}</Button>
      </form>
    </div>
  );
}
