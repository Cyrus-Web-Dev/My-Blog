import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostForm } from "@/components/post-form";
import type { Post } from "@/lib/types";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return (<><h1 className="mb-8 text-2xl font-bold">Edit bacotan</h1><PostForm post={data as Post} /></>);
}
