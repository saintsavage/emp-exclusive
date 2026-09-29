import { useState } from "react";
import { Link, useNavigate, useRouteContext } from "@tanstack/react-router";
import { Flame, Heart, MessageCircle, Share2, Star, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCurrentUser, useCurrentUserState } from "@/lib/auth/use-current-user";
import { addComment, deletePost, listComments, toggleReaction } from "@/lib/emp/api";
import type { Post, ReactionKind } from "@/lib/emp/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatStamp } from "@/lib/utils";

const REACTIONS: { id: ReactionKind; label: string; icon: typeof Heart }[] = [
  { id: "like", label: "Heart", icon: Heart },
  { id: "love", label: "Spotlight", icon: Star },
  { id: "fire", label: "Heat", icon: Flame },
];

export function PostCard({
  post,
  myKinds = [],
  featured = false,
}: {
  post: Post;
  myKinds?: string[];
  featured?: boolean;
}) {
  const [openComments, setOpenComments] = useState(featured);
  const counts: Record<ReactionKind, number> = {
    like: post.likeCount,
    love: post.loveCount,
    fire: post.fireCount,
  };

  const split = Boolean(
    post.mediaUrl &&
      post.kind !== "video" &&
      !post.mediaUrl.match(/\.(mp4|webm|ogg)(\?|$)/i) &&
      !post.mediaUrl.startsWith("data:video"),
  );

  return (
    <article className="overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]">
      <header className="flex items-start gap-3 p-4 sm:p-5">
        <Avatar className="size-11">
          <AvatarImage src={post.authorAvatar || undefined} alt="" />
          <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{post.authorName}</p>
            {post.isOfficial ? <Badge>Official</Badge> : null}
            <span className="text-xs tracking-wide text-subtle uppercase">{post.kind}</span>
          </div>
          <p className="text-xs text-muted">{formatStamp(post.createdAt)}</p>
        </div>
        <OwnDelete post={post} />
      </header>

      <div className={cn(split && "sm:grid sm:grid-cols-2 sm:items-stretch")}>
        <div className="space-y-3 px-4 pb-4 sm:flex sm:flex-col sm:justify-center sm:px-5">
          {post.title ? (
            <h2 className="font-display text-2xl leading-tight font-medium tracking-tight">
              <Link to="/post/$postId" params={{ postId: String(post.id) }} className="hover:opacity-80">
                {post.title}
              </Link>
            </h2>
          ) : null}
          <p className="whitespace-pre-wrap text-pretty text-fg/90">{post.body}</p>
        </div>
        {post.mediaUrl ? <PostMedia post={post} split={split} /> : null}
      </div>

      <div className="flex flex-wrap items-center gap-1 border-t border-line px-2 py-1">
        {REACTIONS.map((item) => {
          const Icon = item.icon;
          const on = myKinds.includes(item.id);
          return (
            <ReactionButton
              key={item.id}
              postId={post.id}
              kind={item.id}
              on={on}
              count={counts[item.id]}
              label={item.label}
              icon={Icon}
            />
          );
        })}
        <button
          type="button"
          onClick={() => setOpenComments((v) => !v)}
          className="flex h-11 items-center gap-2 rounded-md px-3 text-sm text-muted hover:text-fg"
        >
          <MessageCircle className="size-4" />
          <span className="tabular-nums">{post.commentCount}</span>
        </button>
        <button
          type="button"
          className="ml-auto flex h-11 items-center gap-2 rounded-md px-3 text-sm text-muted hover:text-fg"
          onClick={async () => {
            const url = `${window.location.origin}/post/${post.id}`;
            try {
              await navigator.clipboard.writeText(url);
              toast.success("Link copied.");
            } catch {
              toast.error("Could not copy.");
            }
          }}
        >
          <Share2 className="size-4" />
          Share
        </button>
      </div>

      {openComments ? <CommentThread postId={post.id} /> : null}
    </article>
  );
}

function PostMedia({ post, split = false }: { post: Post; split?: boolean }) {
  if (post.kind === "video" || post.mediaUrl?.match(/\.(mp4|webm|ogg)(\?|$)/i) || post.mediaUrl?.startsWith("data:video")) {
    return (
      <video
        className="aspect-video w-full bg-bg object-cover"
        src={post.mediaUrl ?? undefined}
        poster={post.mediaPoster ?? undefined}
        controls
        playsInline
        preload="metadata"
      />
    );
  }
  return (
    <Link to="/post/$postId" params={{ postId: String(post.id) }} className="block h-full">
      <img
        src={post.mediaUrl ?? ""}
        alt={post.title || post.body.slice(0, 80)}
        className={cn(
          "w-full bg-bg object-cover",
          split ? "aspect-still h-full min-h-56 sm:aspect-auto sm:min-h-full" : "aspect-still",
        )}
      />
    </Link>
  );
}

function ReactionButton({
  postId,
  kind,
  on,
  count,
  label,
  icon: Icon,
}: {
  postId: number;
  kind: ReactionKind;
  on: boolean;
  count: number;
  label: string;
  icon: typeof Heart;
}) {
  const navigate = useNavigate();
  const { user } = useCurrentUserState();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => toggleReaction({ data: { postId, kind } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      void queryClient.invalidateQueries({ queryKey: ["post", postId] });
      void queryClient.invalidateQueries({ queryKey: ["myReactions"] });
    },
    onError: (err) => {
      if (err instanceof Error && err.message === "Unauthorized") {
        void navigate({ to: "/login" });
        return;
      }
      toast.error("Could not react.");
    },
  });

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={on}
      onClick={() => {
        if (!user) {
          void navigate({ to: "/login" });
          return;
        }
        mutation.mutate();
      }}
      className={cn(
        "flex h-11 items-center gap-2 rounded-md px-3 text-sm transition-colors duration-150",
        on ? "text-fg" : "text-muted hover:text-fg",
      )}
    >
      <Icon className={cn("size-4", on && "fill-fg")} />
      <span className="tabular-nums">{count}</span>
    </button>
  );
}

function CommentThread({ postId }: { postId: number }) {
  const { sessionUser } = useRouteContext({ from: "__root__" });
  const { user, isPending } = useCurrentUserState();
  const waitingForKnownUser = isPending && sessionUser != null;
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const comments = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => listComments({ data: { postId } }),
  });
  const mutation = useMutation({
    mutationFn: () => addComment({ data: { postId, body: text } }),
    onSuccess: () => {
      setText("");
      void queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      void queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Could not comment.");
    },
  });

  return (
    <div className="space-y-3 border-t border-line px-4 py-4 sm:px-5">
      {(comments.data ?? []).map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <Avatar className="size-8">
            <AvatarImage src={comment.authorAvatar || undefined} alt="" />
            <AvatarFallback className="text-xs">{comment.authorName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 rounded-lg bg-elevated px-3 py-2">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium">{comment.authorName}</span>
              <span className="text-xs text-subtle">{formatStamp(comment.createdAt)}</span>
            </div>
            <p className="text-sm text-pretty text-fg/90">{comment.body}</p>
          </div>
        </div>
      ))}

      {waitingForKnownUser ? null : user ? (
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!text.trim()) return;
            mutation.mutate();
          }}
        >
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment…"
          />
          <Button type="submit" size="sm" disabled={mutation.isPending || !text.trim()}>
            Send
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted">
          <Link to="/login" className="underline underline-offset-4">
            Sign in
          </Link>{" "}
          to comment.
        </p>
      )}
    </div>
  );
}

function OwnDelete({ post }: { post: Post }) {
  const user = useCurrentUser();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => deletePost({ data: { id: post.id } }),
    onSuccess: () => {
      toast.success("Removed.");
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
  if (!user || user.id !== post.userId) return null;
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Delete post"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
