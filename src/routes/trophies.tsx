import { createFileRoute, Link } from "@tanstack/react-router";

function BrandBranchMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "flex items-center gap-3" : "flex flex-col items-start gap-5"}>
      <svg viewBox="0 0 240 170" role="img" aria-label="Brand Branch BB logo" className={compact ? "h-14 w-20" : "h-28 w-40 sm:h-36 sm:w-52"}>
        <defs>
          <linearGradient id="bb-accent" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f06b6b" />
            <stop offset="100%" stopColor="#b91f2b" />
          </linearGradient>
        </defs>
        <path d="M34 140V30h54c29 0 43 14 43 35 0 15-8 25-21 30 18 4 29 16 29 34 0 26-19 41-49 41H34Z" fill="none" stroke="white" strokeWidth="13" strokeLinejoin="round" transform="translate(0 -12) scale(.88 1)" />
        <path d="M115 140V30h50c29 0 44 14 44 35 0 15-8 25-22 30 18 4 30 16 30 34 0 26-20 41-50 41h-52" fill="none" stroke="url(#bb-accent)" strokeWidth="13" strokeLinejoin="round" transform="translate(-3 -12) scale(.88 1)" />
        <path d="M120 12v25m0-8L99 9m21 20 22-20M120 37 96 55m24-18 25 18" fill="none" stroke="url(#bb-accent)" strokeWidth="5" strokeLinecap="round" />
        <circle cx="120" cy="10" r="5" fill="white" />
      </svg>
      <div>
        <p className="font-display text-4xl font-semibold uppercase leading-[0.82] tracking-[0.08em] sm:text-6xl">Brand<span className="text-[#e34242]">.</span><br />Branch<span className="text-[#e34242]">.</span></p>
        <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.34em] text-white/45 sm:text-[10px]">Ideas grow here · BB</p>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/Brand Branch")({ component: BrandBranchesPage });

const stages = [
  { n: "01", title: "Find your thing", text: "Start with what you care about: fashion, art, music, gaming, sport, tech or an idea nobody around you has tried yet." },
  { n: "02", title: "Build the identity", text: "Shape a name, a look, a voice and a reason for people to connect with your brand." },
  { n: "03", title: "Make it tangible", text: "Turn the concept into designs, content, products or a community people can actually experience." },
  { n: "04", title: "Put it out there", text: "Prepare a launch, learn from the response and keep improving with the right support around you." },
];

function BrandBranchesPage() {
  return (
    <main className="bg-bg">
      <section className="relative isolate overflow-hidden bg-[#09090b] px-4 pb-20 pt-24 text-white sm:pb-28 sm:pt-32">
        <div className="absolute -right-24 top-8 size-80 rounded-full border border-white/10 sm:size-[34rem]" />
        <div className="absolute -right-12 top-20 size-56 rounded-full border border-[#e34242]/45 sm:size-[26rem]" />
        <div className="absolute bottom-0 left-0 h-1 w-2/3 bg-gradient-to-r from-[#e34242] via-white/50 to-transparent" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between"><BrandBranchMark /><p className="max-w-xs text-[10px] font-bold uppercase tracking-[0.3em] text-white/50"><span className="mb-3 block h-px w-8 bg-[#e34242]" /> EMP Exclusive · The youth brand house</p></div>
          <p className="mt-12 text-xs font-bold uppercase tracking-[0.28em] text-[#e66a6a]">For the next generation of founders</p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl leading-[0.88] tracking-tight sm:text-8xl md:text-9xl">Don't just wear<br /><span className="text-white/40">a brand.</span><br />Build one.</h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">Brand Branch is a creative launchpad for ambitious young people with ideas of their own. Bring your style, your interests and your big plans. We'll make room for them to grow into real brands.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#brand-lab" className="inline-flex min-h-12 items-center bg-white px-6 text-sm font-bold text-black transition hover:bg-[#e34242] hover:text-white">Explore the brand lab <span className="ml-4">↘</span></a>
            <Link to="/#involved" className="inline-flex min-h-12 items-center border border-white/35 px-6 text-sm font-semibold text-white transition hover:bg-white/10">Get involved</Link>
          </div>
          <div className="mt-16 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/20 pt-5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/45 sm:text-[10px]"><span>Ideas welcome</span><span>Culture first</span><span>Built together</span></div>
        </div>
      </section>

      <section id="brand-lab" className="scroll-mt-20 px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-end">
            <div><p className="text-xs font-bold uppercase tracking-[0.28em] text-muted">01 / The brand lab</p><h2 className="mt-4 max-w-lg font-display text-4xl leading-[1.02] tracking-tight sm:text-6xl">Your ambition.<br />Your own identity.</h2></div>
            <p className="max-w-2xl text-base leading-8 text-muted">Not everybody wants to be an influencer. Some want to design clothes, start a label, build a creative crew, launch a product or turn a personal obsession into a business. This is a place to explore those possibilities without needing to have everything figured out on day one.</p>
          </div>
          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Fashion & streetwear", "Original clothing, accessories and style-led labels."],
              ["02", "Art & design", "Graphics, illustration, photography and visual culture."],
              ["03", "Music & culture", "Creative collectives, sound, events and communities."],
              ["04", "Ideas & innovation", "Products, digital concepts and unexpected ventures."],
            ].map(([n, title, body]) => <article key={n} className="group border border-line bg-surface p-6 transition hover:-translate-y-1 hover:border-[#d94a4a]/60"><p className="font-display text-3xl text-muted">{n}</p><h3 className="mt-8 font-display text-2xl leading-tight">{title}</h3><p className="mt-3 text-sm leading-7 text-muted">{body}</p><div className="mt-7 h-px w-10 bg-[#d94a4a] transition-all group-hover:w-full" /></article>)}
          </div>
        </div>
      </section>

      <section className="bg-[#101012] px-4 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/45">02 / From idea to identity</p>
          <div className="mt-4 grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
            <h2 className="font-display text-4xl leading-[1.02] tracking-tight sm:text-6xl">Every big brand<br />started somewhere.</h2>
            <div className="grid gap-0 sm:grid-cols-2">
              {stages.map((stage) => <article key={stage.n} className="border-t border-white/15 py-6 sm:px-6 sm:first:pl-0"><p className="text-xs font-bold tracking-[0.2em] text-[#e66a6a]">{stage.n}</p><h3 className="mt-4 font-display text-2xl">{stage.title}</h3><p className="mt-3 text-sm leading-7 text-white/55">{stage.text}</p></article>)}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-end">
            <div><p className="text-xs font-bold uppercase tracking-[0.28em] text-muted">03 / More than a logo</p><h2 className="mt-4 max-w-2xl font-display text-4xl leading-[1.02] tracking-tight sm:text-6xl">Make something people can connect with.</h2></div>
            <p className="text-base leading-8 text-muted">A brand is more than a name printed on a hoodie. It's a point of view, a community and a promise. Brand Branch is here to help young creators think beyond the first design and build something with direction.</p>
          </div>
          <div className="mt-12 grid gap-3 md:grid-cols-3">
            <article className="border border-line p-7"><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted">Create</p><h3 className="mt-4 font-display text-3xl">Make it yours.</h3><p className="mt-3 text-sm leading-7 text-muted">Develop the concept, visuals and story that make your idea recognisable.</p></article>
            <article className="border border-line p-7"><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted">Connect</p><h3 className="mt-4 font-display text-3xl">Find your people.</h3><p className="mt-3 text-sm leading-7 text-muted">Build with other ambitious creators, share feedback and grow a community.</p></article>
            <article className="border border-line p-7"><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted">Launch</p><h3 className="mt-4 font-display text-3xl">Take it further.</h3><p className="mt-3 text-sm leading-7 text-muted">Explore clothing, merchandise, collaborations and real-world releases.</p></article>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#e34242] px-4 py-16 text-white sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/70">04 / Your move</p><h2 className="mt-4 max-w-2xl font-display text-4xl leading-[1.02] tracking-tight sm:text-6xl">Got a brand idea<br />living in your notes?</h2><p className="mt-5 max-w-xl text-sm leading-7 text-white/80">Bring it out of the drafts. EMP is building a space for young creators to connect, learn and develop their ideas.</p></div>
          <Link to="/#involved" className="inline-flex min-h-12 shrink-0 items-center justify-center border border-white/70 px-6 text-sm font-bold text-white transition hover:bg-white hover:text-[#e34242]">Connect with EMP <span className="ml-4">↗</span></Link>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted"><span>Brand Branch · An EMP Exclusive brand house</span><span>Ideas → Identity → Impact</span></div>
      </section>
    </main>
  );
}
