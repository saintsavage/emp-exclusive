import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getPageStats } from "@/lib/emp/api";
import { HOUSE } from "@/lib/emp/house";
import { HouseLove } from "@/components/site-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  loader: async () => ({ stats: await getPageStats() }),
  component: Home,
});

function Home() {
  const initial = Route.useLoaderData();
  const stats = useQuery({
    queryKey: ["stats"],
    queryFn: () => getPageStats(),
    initialData: initial.stats,
  });

  return (
    <main>
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
                alt="EMP Exclusive"
                className="bare size-24 rounded-full object-cover bg-bg ring-4 ring-bg sm:size-28"
              />
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-4xl leading-none tracking-tight sm:text-5xl">
                    EMP Exclusive
                  </h1>
                  <span className="rounded-full bg-fg px-2 py-1 text-xs text-bg">Page</span>
                </div>
                <p className="mt-2 text-sm text-muted">{HOUSE.tagline}</p>
                <p className="mt-1 text-sm text-subtle">
                  <span className="tabular-nums text-fg">{stats.data?.visits ?? 0}</span> visits
                  <span className="mx-2">·</span>
                  <span className="tabular-nums text-fg">{stats.data?.loves ?? 0}</span> loves
                  <span className="mx-2">·</span>
                  <span className="tabular-nums text-fg">{stats.data?.posts ?? 0}</span> posts
                </p>
              </div>
            </div>
            <div className="flex gap-2 pb-1">
              <HouseLove />
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
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
            Who we are
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
            More than one project. One bigger purpose.
          </h2>
          <p className="mt-5 text-base leading-8 text-muted sm:text-lg">
            EMP Exclusive is a growing ecosystem built around technology, creativity and
            opportunities. We bring ideas to life by creating digital platforms, developing
            innovative projects and giving people room to build, create and grow.
          </p>
          <p className="mt-4 text-base leading-8 text-muted sm:text-lg">
            From technology and entrepreneurship to independent brands and creative
            initiatives, our goal is simple: build things that make a difference and create
            opportunities for others along the way. We are a collection of ideas working
            towards something bigger.
          </p>
        </div>

        <div className="mt-14 grid gap-6 border-t border-line pt-10 md:grid-cols-2 md:gap-12">
          <article>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
              Our mission
            </p>
            <h3 className="mt-3 font-display text-2xl tracking-tight">What we do today</h3>
            <p className="mt-4 leading-7 text-muted">
              To turn meaningful ideas into useful technology, creative projects and
              opportunities that help people solve problems, develop their abilities and
              build something of their own.
            </p>
          </article>

          <article>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
              Our vision
            </p>
            <h3 className="mt-3 font-display text-2xl tracking-tight">What we are working towards</h3>
            <p className="mt-4 leading-7 text-muted">
              To grow into an open, connected ecosystem where people, ideas and independent
              ventures can thrive, and where innovation creates lasting value for communities
              across borders.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
