export default function Loading() {
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-72 animate-pulse rounded-2xl border border-border bg-muted/40" />
      ))}
    </div>
  );
}
