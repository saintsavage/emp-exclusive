import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

const projects = [
  { number: "01", name: "EMP HQ", category: "Internal infrastructure", status: "RESTRICTED AREA", description: "The private command centre for the EMP ecosystem. Operations, administration and project oversight stay behind a protected door.", tag: "THE ENGINE", dark: true },
  { number: "02", name: "EMP ID", category: "Identity infrastructure", status: "IN DEVELOPMENT", description: "One digital identity designed to connect participating websites and apps across the ecosystem.", tag: "ONE IDENTITY", dark: false },
  { number: "03", name: "HandOn", category: "Service marketplace", status: "IN DEVELOPMENT", collaboration: "In collaboration with Ahmed Ali", description: "A Botswana-first marketplace connecting people who need a service with people ready to provide it. Starting in Francistown.", tag: "LOCAL OPPORTUNITY", dark: false },
  { number: "04", name: "SAYNT AI", category: "Personal technology", status: "IN DEVELOPMENT", description: "A hands-free Android assistant built around voice interaction and everyday commands.", tag: "TECH, REIMAGINED", dark: true },
] as const;

function Home() {
  return (
    <main>
      <section className="relative isolate min-h-[650px] overflow-hidden bg-[#080809] text-white sm:min-h-[760px]">
        <img src="/images/cover-hero.jpg" alt="EMP Exclusive" className="bare absolute inset-0 size-full object-cover object-center opacity-65" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
        <div className="relative mx-auto flex min-h-[650px] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:min-h-[760px] sm:pb-24">
          <div className="mb-8 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-white/55">
            <span className="h-px w-9 bg-[#e34242]" /> Independent by nature · Francistown, Botswana
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Ideas don't build themselves.</p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl leading-[0.88] tracking-tight sm:text-8xl md:text-9xl">
            Make the idea<br /><span className="text-white/45">matter.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
            EMP Exclusive is an independent creative and technology ecosystem building platforms, brands and opportunities with purpose.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#projects" className="inline-flex min-h-12 items-center bg-white px-6 text-sm font-bold text-black transition hover:bg-[#e34242] hover:text-white">Explore the ecosystem <span className="ml-4">↗</span></a>
            <a href="#about" className="inline-flex min-h-12 items-center border border-white/35 px-6 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10">Who we are</a>
          </div>
          <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/20 pt-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
            <span>Creative culture</span><span>Technology</span><span>Entrepreneurship</span><span>Built to grow</span>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:py-28">
        <div className="grid gap-10 md:grid-cols-[0.78fr_1.22fr] md:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted">01 / The thinking</p>
            <h2 className="mt-4 max-w-sm font-display text-4xl leading-[1.02] tracking-tight sm:text-6xl">Built for people who make things happen.</h2>
          </div>
          <div className="space-y-6 text-base leading-8 text-muted sm:text-lg">
            <p>EMP Exclusive is a growing ecosystem shaped by technology, creativity and entrepreneurship. We turn ideas into useful platforms, independent brands and experiences that give people room to build and grow.</p>
            <p>We are not limited to one industry or one kind of project. The work takes different forms, but the purpose stays connected: make meaningful things, open doors and create value beyond ourselves.</p>
            <div className="grid gap-6 border-t border-line pt-7 sm:grid-cols-2">
              <div><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted">Our mission</p><p className="mt-3 text-sm leading-7 text-fg">Build useful ideas, develop skills and create opportunities people can actually use.</p></div>
              <div><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted">Our vision</p><p className="mt-3 text-sm leading-7 text-fg">Grow a connected ecosystem where people, projects and independent ventures can thrive.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="scroll-mt-20 bg-[#0b0b0d] py-20 text-white sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[0.28em] text-white/45">02 / What we're building</p><h2 className="mt-4 font-display text-4xl tracking-tight sm:text-6xl">Different ideas.<br />Shared ambition.</h2></div>
            <p className="max-w-sm text-sm leading-7 text-white/55">A look inside the ecosystem. Each project has its own purpose, its own people and its own road ahead.</p>
          </div>
          <div className="mt-12 grid gap-3 sm:grid-cols-2">
            {projects.map((project) => (
              <article key={project.name} className="group relative min-h-[300px] overflow-hidden border border-white/10 bg-[#141416] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#e34242]/70 sm:p-9">
                <div className="absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full border border-white/10 transition duration-500 group-hover:scale-150 group-hover:border-[#e34242]/40" />
                <div className="relative flex items-start justify-between gap-4"><span className="font-display text-2xl text-white/35">{project.number}</span><span className="border border-white/20 px-3 py-1 text-[9px] font-bold tracking-[0.16em] text-white/65">{project.status}</span></div>
                <p className="relative mt-10 text-[10px] font-bold uppercase tracking-[0.24em] text-[#e66a6a]">{project.category}</p>
                <h3 className="relative mt-2 font-display text-4xl tracking-tight sm:text-5xl">{project.name}<span className="text-white/30">.</span></h3>
                {"collaboration" in project ? <p className="relative mt-2 text-xs tracking-wide text-white/55">{project.collaboration}</p> : null}
                <p className="relative mt-4 max-w-lg text-sm leading-7 text-white/60">{project.description}</p>
                <p className="relative mt-7 text-[9px] font-bold tracking-[0.22em] text-white/30">{project.tag}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 text-xs leading-6 text-white/40">Development labels reflect current project status. EMP HQ is an internal, restricted platform and is not open for public access.</p>
        </div>
      </section>

      <section id="impact" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:py-28">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted">03 / Why it matters</p>
        <div className="mt-4 grid gap-10 md:grid-cols-[1fr_0.85fr] md:items-end">
          <h2 className="max-w-2xl font-display text-4xl leading-[1.02] tracking-tight sm:text-6xl">Progress means more when it reaches people.</h2>
          <p className="text-base leading-8 text-muted">Our work focuses on practical outcomes: making services easier to find, lowering barriers to digital participation, supporting independent creators and giving new ideas a place to grow.</p>
        </div>
        <div className="mt-12 grid gap-0 border-y border-line sm:grid-cols-3">
          {[["01", "Access", "Connect people to useful tools, technology and support."], ["02", "Opportunity", "Help people offer skills, find work and build something of their own."], ["03", "Creativity", "Make room for original ideas, independent brands and expression."]].map(([n, title, body]) => (
            <article key={n} className="border-b border-line py-7 sm:border-b-0 sm:border-r sm:px-7 sm:first:pl-0 sm:last:border-r-0"><p className="text-xs font-bold tracking-[0.2em] text-[#d94a4a]">{n}</p><h3 className="mt-5 font-display text-3xl">{title}</h3><p className="mt-3 text-sm leading-7 text-muted">{body}</p></article>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#111113] text-white">
        <div className="absolute -right-20 top-1/2 size-80 -translate-y-1/2 rounded-full border border-white/10 sm:size-[34rem]" />
        <div className="absolute -right-8 top-1/2 size-56 -translate-y-1/2 rounded-full border border-[#d94a4a]/35 sm:size-[26rem]" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:grid-cols-[1fr_auto] sm:items-center sm:py-24">
          <div><p className="text-xs font-bold uppercase tracking-[0.28em] text-white/45">04 / Brand branches · Trophies</p><h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight tracking-tight sm:text-6xl">Your idea deserves a name of its own.</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-white/60">A youth-focused launchpad for ambitious creators building their own brands, communities and creative identities. Start with an idea. Give it a direction. Make it real.</p></div>
          <Link to="/trophies" className="inline-flex min-h-12 items-center justify-center bg-white px-6 text-sm font-bold text-black transition hover:bg-[#e34242] hover:text-white">Meet the brand house <span className="ml-4">↗</span></Link>
        </div>
      </section>

      <section id="involved" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:py-28">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted">05 / Get involved</p>
        <div className="mt-4 grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-end">
          <h2 className="max-w-2xl font-display text-4xl leading-[1.02] tracking-tight sm:text-6xl">Bring an idea.<br />Build something real.</h2>
          <p className="text-base leading-8 text-muted">EMP grows through people with ideas, skills and the determination to make them happen. We believe good work gets better when the right people build together.</p>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-line pt-7"><div><p className="font-display text-2xl">EMP Exclusive</p><p className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-muted">Francistown · Botswana · Building beyond borders</p></div><a href="mailto:hello@empexclusive.com" className="text-sm font-semibold underline decoration-[#d94a4a] underline-offset-8">Start a conversation ↗</a></div>
      </section>
    </main>
  );
}
