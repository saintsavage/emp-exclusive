import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/trophies")({ component: BrandBranchesPage });

const pillars = [
  {
    number: "01",
    title: "Branch identities",
    text: "A space for distinct brands to develop their own name, visual language and audience while remaining part of the wider EMP ecosystem.",
  },
  {
    number: "02",
    title: "Clothing & merchandise",
    text: "Turn branch identities into physical pieces: apparel, accessories and carefully considered merchandise.",
  },
  {
    number: "03",
    title: "Launch & collaboration",
    text: "Give new branches a route from concept to launch, with room for creators and collaborators to build alongside EMP.",
  },
];

function BrandBranchesPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-[#101012] px-4 py-24 text-white sm:py-32">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">EMP Exclusive · Brand house</p>
          <h1 className="mt-5 max-w-4xl font-display text-6xl leading-[0.95] tracking-tight sm:text-8xl">
            Trophies<span className="text-white/35">.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
            Not awards on a shelf. Trophies is the EMP home for brand branches,
            clothing and merchandise: where independent identities can take shape
            and become something people can wear.
          </p>
          <div className="mt-10 h-px max-w-3xl bg-white/20" />
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
            Create · Develop · Launch
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">The concept</p>
          <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
            More than merchandise. A launchpad for identity.
          </h2>
          <p className="mt-5 text-base leading-8 text-muted">
            EMP branches can grow into their own brands, each with a clear identity
            and purpose. Trophies gives those branches a place to be introduced,
            developed and represented through clothing and creative products.
          </p>
        </div>

        <div className="mt-14 grid gap-8 border-t border-line pt-8 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.number}>
              <p className="font-display text-2xl text-muted">{pillar.number}</p>
              <h3 className="mt-5 font-display text-2xl tracking-tight">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">The collection</p>
          <div className="mt-4 grid gap-6 sm:grid-cols-[1fr_0.8fr] sm:items-end">
            <h2 className="font-display text-4xl tracking-tight sm:text-5xl">The next piece starts as an idea.</h2>
            <p className="text-sm leading-7 text-muted">
              This space will introduce official EMP branches and their releases as
              they are developed. No imaginary stock, no pretend drop dates. Just
              real launches when they are ready.
            </p>
          </div>
          <div className="mt-10 border border-line px-6 py-10 text-center sm:py-14">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">Collection status</p>
            <p className="mt-3 font-display text-3xl">The showcase is being built.</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
              Official branch profiles, apparel previews and release information
              will appear here as each launch is confirmed.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
