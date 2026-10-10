"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { catMeta, typeMeta } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const supabase = createClient();
  const qc = useQueryClient();
  const router = useRouter();
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Post[];
    },
  });
  const refresh = { onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-posts"] }) };
  const toggle = useMutation({ mutationFn: async (p: Post) => { await supabase.from("posts").update({ published: !p.published }).eq("id", p.id); }, ...refresh });
  const del = useMutation({ mutationFn: async (id: string) => { await supabase.from("posts").delete().eq("id", id); }, ...refresh });

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Bacotan <span className="text-muted-foreground">({posts.length})</span></h1>
        <div className="flex gap-2">
          <Button asChild><Link href="/admin/new"><Plus size={16} /> Bacotan baru</Link></Button>
          <Button variant="outline" onClick={async () => { await supabase.auth.signOut(); router.push("/admin/login"); router.refresh(); }}><LogOut size={16} /> Keluar</Button>
        </div>
      </div>
      {isLoading ? <p className="text-muted-foreground">Memuat…</p> : (
        <div className="divide-y divide-border rounded-2xl border border-border bg-card">
          {posts.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.title}</p>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge className={catMeta(p.category).badge}>{catMeta(p.category).label}</Badge>
                  <span>{typeMeta(p.post_type).emoji} {typeMeta(p.post_type).label}</span>
                  <span>{formatDate(p.created_at)}</span>
                </p>
              </div>
              <Button variant="ghost" size="icon" title={p.published ? "Sembunyikan" : "Terbitkan"} onClick={() => toggle.mutate(p)}>
                {p.published ? <Eye size={16} className="text-emerald-400" /> : <EyeOff size={16} />}
              </Button>
              <Button asChild variant="ghost" size="icon" title="Edit"><Link href={`/admin/${p.id}/edit`}><Pencil size={16} /></Link></Button>
              <Button variant="ghost" size="icon" title="Hapus" onClick={() => confirm(`Hapus "${p.title}"?`) && del.mutate(p.id)}><Trash2 size={16} className="text-red-400" /></Button>
            </div>
          ))}
          {posts.length === 0 && <p className="p-8 text-center text-muted-foreground">Belum ada bacotan. Mulai nulis!</p>}
        </div>
      )}
    </>
  );
}
