import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getPost, myReactions } from "@/lib/emp/api";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PostCard } from "@/components/feed/post-card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/post/$postId")({
  loader: async ({ params }) => {
    const id = Number(params.postId);
    if (!Number.isFinite(id)) return null;
    return getPost({ data: { id } });
  },
  component: PostPage,
});

function PostPage() {
  const { postId } = Route.useParams();
  const id = Number(postId);
  const { user } = useCurrentUserState();
  const initial = Route.useLoaderData();
  const post = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost({ data: { id } }),
    enabled: Number.isFinite(id),
    initialData: initial ?? undefined,
  });
  const mine = useQuery({
    queryKey: ["myReactions"],
    queryFn: () => myReactions(),
    enabled: Boolean(user),
  });

  const myKinds = (mine.data ?? [])
    .filter((row) => Number(row.post_id) === id)
    .map((row) => row.kind);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Link to="/" className="text-sm text-muted underline-offset-4 hover:text-fg hover:underline">
        Back to the feed
      </Link>
      <div className="mt-6">
        {post.isPending ? (
          <Skeleton className="h-96 rounded-xl" />
        ) : !post.data ? (
          <p className="text-muted">That post is gone.</p>
        ) : (
          <PostCard post={post.data} myKinds={myKinds} featured />
        )}
      </div>
    </main>
  );
}
