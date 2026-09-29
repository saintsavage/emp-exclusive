import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listPosts } from "@/lib/emp/api";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/photos")({
  loader: () => listPosts({ data: { kind: "photo" } }),
  component: PhotosPage,
});

function PhotosPage() {
  const initial = Route.useLoaderData();
  const photos = useQuery({
    queryKey: ["posts", "photo"],
    queryFn: () => listPosts({ data: { kind: "photo" } }),
    initialData: initial,
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs tracking-[0.28em] text-muted uppercase">Archive</p>
      <h1 className="mt-2 font-display text-5xl tracking-tight">Stills</h1>
      <p className="mt-3 max-w-xl text-pretty text-muted">
        Every photograph EMP Exclusive posts, in the order it landed.
      </p>

      {photos.isPending ? (
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((key) => (
            <Skeleton key={key} className="aspect-still rounded-lg" />
          ))}
        </div>
      ) : (photos.data ?? []).filter((post) => post.mediaUrl).length === 0 ? (
        <p className="mt-10 rounded-xl bg-surface px-5 py-10 text-center text-muted shadow-[var(--shadow-border)]">
          No stills yet. When EMP Exclusive posts a photograph, it lives here.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
          {(photos.data ?? []).map((post) =>
            post.mediaUrl ? (
              <Link
                key={post.id}
                to="/post/$postId"
                params={{ postId: String(post.id) }}
                className="group overflow-hidden rounded-lg"
              >
                <img
                  src={post.mediaUrl}
                  alt={post.title || post.body.slice(0, 80)}
                  className="aspect-still w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                />
              </Link>
            ) : null,
          )}
        </div>
      )}
    </main>
  );
}
