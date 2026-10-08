import { createFileRoute } from "@tanstack/react-router";
import { HouseLove } from "@/components/site-shell";
import { HOUSE } from "@/lib/emp/house";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs tracking-[0.28em] text-muted uppercase">The house</p>
      <h1 className="mt-2 font-display text-5xl leading-none tracking-tight text-balance">House Notes</h1>
      <p className="mt-3 max-w-xl text-pretty text-muted">
        The official record. Short, and only what the house is willing to put on the wall.
      </p>

      <article className="mt-12">
        <p className="text-xs tracking-[0.28em] text-subtle uppercase">Note 01</p>
        <h2 className="mt-2 font-display text-3xl tracking-tight">Still on the foundation.</h2>
        <div className="mt-5 space-y-5 text-pretty text-lg text-fg/90">
          <p>
            EMP Exclusive is EMPIRE — a brand out of {HOUSE.city}, {HOUSE.country}. Music, fashion,
            media, a creative house, and whatever else we pick up on the way. We started{" "}
            {HOUSE.founded}. The foundation is holding. We are yet to rise.
          </p>
          <p>
            This page is the official wire. EMP Exclusive writes every post. You watch, love, and
            comment as a guest — pick a name, it stays yours for 20 hours. A tap-in app is coming —
            same house, closer to your pocket.
          </p>
        </div>
      </article>

      <article className="mt-14 rounded-xl bg-surface px-6 py-10 shadow-[var(--shadow-border)] sm:px-10">
        <p className="text-xs tracking-[0.28em] text-subtle uppercase">Note 02</p>
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
          <dt className="text-xs tracking-[0.22em] text-subtle uppercase">Form</dt>
          <dd className="mt-2 font-display text-3xl">{HOUSE.disciplines}</dd>
        </div>
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <dt className="text-xs tracking-[0.22em] text-subtle uppercase">Next</dt>
          <dd className="mt-2 font-display text-3xl">The rise</dd>
        </div>
      </dl>

      <div className="mt-10">
        <HouseLove />
      </div>
    </main>
  );
}
