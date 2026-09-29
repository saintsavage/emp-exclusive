import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getPageStats, listMembers, listPosts, myReactions } from "@/lib/emp/api";
import type { Post } from "@/lib/emp/types";
import { HOUSE, isLiveStory } from "@/lib/emp/house";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { FollowButton } from "@/components/site-shell";
import { ClosedWire } from "@/components/feed/composer";
import { PostCard } from "@/components/feed/post-card";
import { StoryViewer } from "@/components/feed/stories-strip";
import { MemberPortrait } from "@/components/member-portrait";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [posts, stories, members, stats] = await Promise.all([
      listPosts({ data: { kind: "all" } }),
      listPosts({ data: { kind: "story" } }),
      listMembers(),
      getPageStats(),
    ]);
    return { posts, stories, members, stats };
  },
  component: Home,
});

const FILTERS = [
  { id: "all", label: "All" },
  { id: "photo", label: "Stills" },
  { id: "video", label: "Film" },
  { id: "update", label: "Notes" },
] as const;

function Home() {
  const initial = Route.useLoaderData();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const { user } = useCurrentUserState();

  const posts = useQuery({
    queryKey: ["posts", filter],
    queryFn: () => listPosts({ data: { kind: filter } }),
    initialData: filter === "all" ? initial.posts : undefined,
  });
  const stories = useQuery({
    queryKey: ["posts", "story"],
    queryFn: () => listPosts({ data: { kind: "story" } }),
    initialData: initial.stories,
  });
  const members = useQuery({
    queryKey: ["members"],
    queryFn: () => listMembers(),
    initialData: initial.members,
  });
  const stats = useQuery({
    queryKey: ["stats"],
    queryFn: () => getPageStats(),
    initialData: initial.stats,
  });
  const mine = useQuery({
    queryKey: ["myReactions"],
    queryFn: () => myReactions(),
    enabled: Boolean(user),
  });

  const mineMap = new Map<number, string[]>();
  for (const row of mine.data ?? []) {
    const list = mineMap.get(Number(row.post_id)) ?? [];
    list.push(row.kind);
    mineMap.set(Number(row.post_id), list);
  }

  return (
    <main>
      <Cover stats={stats.data} stories={stories.data ?? []} />

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-6">
          <ClosedWire />

          <div className="flex flex-wrap gap-1">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={cn(
                  "flex h-11 items-center rounded-full px-4 text-sm transition-colors duration-150",
                  filter === item.id ? "bg-fg text-bg" : "text-muted hover:text-fg",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          {posts.isPending ? (
            <div className="space-y-4">
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-80 rounded-xl" />
            </div>
          ) : posts.isError ? (
            <p className="text-sm text-muted">The feed could not load. Refresh and try again.</p>
          ) : (posts.data ?? []).length === 0 ? (
            <p className="rounded-xl bg-surface px-5 py-10 text-center text-muted shadow-[var(--shadow-border)]">
              The wire is quiet. EMP Exclusive posts here when a drop lands.
            </p>
          ) : (
            <div className="space-y-5">
              {(posts.data ?? []).map((post) => (
                <PostCard key={post.id} post={post} myKinds={mineMap.get(post.id) ?? []} />
              ))}
            </div>
          )}
        </div>

        <aside className="hidden space-y-6 lg:block">
          <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
            <p className="text-xs tracking-[0.22em] text-subtle uppercase">Intro</p>
            <h2 className="mt-2 font-display text-2xl leading-tight">EMPIRE, from Francistown.</h2>
            <p className="mt-3 text-sm text-pretty text-muted">
              Music, fashion, media, a creative house — still discovering the rest. Still on the
              foundation. Yet to rise.
            </p>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link to="/about">Read the house notes</Link>
            </Button>
          </section>

          <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">Family</h2>
              <Link to="/members" className="text-xs tracking-wide text-muted uppercase hover:text-fg">
                All
              </Link>
            </div>
            <ul className="mt-4 space-y-3">
              {(members.data ?? []).map((member) => (
                <li key={member.id} className="flex items-center gap-3">
                  <MemberPortrait
                    name={member.name}
                    src={member.portraitUrl || null}
                    className={cn(
                      "size-12 shrink-0 rounded-full text-xs",
                      ["saynt", "tumi", "mbeha", "mk7teen", "xanon", "jadoh", "ggee", "bridgett", "mj", "basco", "ahmed", "tango", "lio", "wezzz", "malone", "paul"].includes(
                        member.id,
                      )
                        ? "object-center"
                        : "object-top",
                    )}
                  />
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs tracking-wide text-muted uppercase">{member.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
            <p className="text-xs tracking-[0.22em] text-subtle uppercase">Next</p>
            <p className="mt-2 font-display text-2xl leading-tight">Still on the foundation.</p>
            <p className="mt-3 text-sm text-muted">Subscribe. The rise lands here first.</p>
          </section>
        </aside>
      </div>
    </main>
  );
}

function Cover({
  stats,
  stories,
}: {
  stats?: { followers: number; posts: number };
  stories: Post[];
}) {
  const [index, setIndex] = useState<number | null>(null);
  const liveStories = stories.filter((story) => isLiveStory(story.createdAt));
  const live = liveStories.length > 0;

  return (
    <section className="relative">
      <div className="relative aspect-cover overflow-hidden bg-bg">
        <img
          src="/images/cover-hero.jpg"
          alt="E.M.P Exclusive"
          className="bare pointer-events-none size-full object-cover object-top"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <img
              src="/images/avatar.png"
              alt=""
              className="bare size-24 rounded-full object-cover bg-bg ring-4 ring-bg sm:size-28"
            />
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                {live ? (
                  <button
                    type="button"
                    onClick={() => setIndex(0)}
                    className="emp-story-name"
                    aria-label="Open EMP Exclusive stories"
                  >
                    <span className="emp-story-rail" aria-hidden="true">
                      <span className="emp-story-bead emp-story-bead-red" />
                      <span className="emp-story-bead emp-story-bead-silver" />
                      <span className="emp-story-bead emp-story-bead-black" />
                      <span className="emp-story-bead emp-story-bead-blue" />
                    </span>
                    <span className="emp-story-chip">new story</span>
                    <h1 className="font-display text-4xl leading-none tracking-tight sm:text-5xl">
                      EMP Exclusive
                    </h1>
                  </button>
                ) : (
                  <h1 className="font-display text-4xl leading-none tracking-tight sm:text-5xl">
                    EMP Exclusive
                  </h1>
                )}
                <Badge variant="solid">Page</Badge>
              </div>
              <p className="mt-2 text-sm text-muted">{HOUSE.tagline}</p>
              <p className="mt-1 text-sm text-subtle">
                <span className="tabular-nums text-fg">{stats?.followers ?? 0}</span> subscribed
                <span className="mx-2">·</span>
                <span className="tabular-nums text-fg">{stats?.posts ?? 0}</span> posts
              </p>
            </div>
          </div>
          <div className="flex gap-2 pb-1">
            <FollowButton />
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.origin);
                } catch {
                  /* ignore */
                }
              }}
            >
              Share page
            </Button>
          </div>
        </div>
      </div>

      <StoryViewer stories={liveStories} index={index} onClose={() => setIndex(null)} onIndex={setIndex} />
    </section>
  );
}
