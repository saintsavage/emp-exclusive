import { createFileRoute } from "@tanstack/react-router";
import { HOUSE } from "@/lib/emp/house";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs tracking-[0.28em] text-muted uppercase">Who we are</p>
      <h1 className="mt-2 font-display text-5xl leading-none tracking-tight text-balance">About EMP</h1>
      <p className="mt-3 max-w-xl text-pretty text-muted">
        Creative work and practical technology from {HOUSE.city}, {HOUSE.country}.
      </p>
      <article className="mt-12 space-y-5 text-pretty text-lg leading-8 text-fg/90">
        <p>
          EMP Exclusive helps businesses, creators and organisations turn ideas into
          things people can see, use and remember.
        </p>
        <p>
          We create brands, websites, digital tools and merchandise. Whether you are
          starting small or ready for your next step, we focus on making the result
          useful, clear and built around what you need.
        </p>
      </article>
      <article className="mt-14 rounded-xl bg-surface px-6 py-10 shadow-[var(--shadow-border)] sm:px-10">
        <p className="text-xs tracking-[0.28em] text-subtle uppercase">Our principle</p>
        <blockquote className="mt-5">
          <p className="font-display text-3xl leading-snug tracking-tight text-balance sm:text-4xl">
            “Perfection will be forged from the brand's imperfection.”
          </p>
          <footer className="mt-6 text-sm tracking-[0.22em] text-muted uppercase">EMP Saynt</footer>
        </blockquote>
      </article>
      <dl className="mt-12 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <dt className="text-xs tracking-[0.22em] text-subtle uppercase">Founded</dt>
          <dd className="mt-2 font-display text-3xl">{HOUSE.foundedShort}</dd>
        </div>
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <dt className="text-xs tracking-[0.22em] text-subtle uppercase">From</dt>
          <dd className="mt-2 font-display text-3xl">{HOUSE.city}</dd>
        </div>
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <dt className="text-xs tracking-[0.22em] text-subtle uppercase">What we do</dt>
          <dd className="mt-2 font-display text-2xl">Brands · Websites · Digital tools</dd>
        </div>
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <dt className="text-xs tracking-[0.22em] text-subtle uppercase">Our promise</dt>
          <dd className="mt-2 font-display text-3xl">Ideas into impact</dd>
        </div>
      </dl>
    </main>
  );
}
