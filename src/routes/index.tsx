import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

const projects = [
  {
    number: "01",
    name: "EMP HQ",
    type: "Internal infrastructure",
    status: "RESTRICTED AREA",
    description:
      "The private command centre for the EMP ecosystem. Operations, administration, infrastructure and project oversight stay behind a protected door.",
    tone: "dark",
  },
  {
    number: "02",
    name: "EMP ID",
    type: "Identity infrastructure",
    status: "IN DEVELOPMENT",
    description:
      "One digital identity designed to connect participating websites and apps, so people can move through the ecosystem without creating a new account everywhere.",
    tone: "light",
  },
  {
    number: "03",
    name: "HandOn",
    type: "Service marketplace",
    status: "IN DEVELOPMENT",
    collaboration: "In collaboration with Ahmed Ali",
    description:
      "A Botswana-first marketplace connecting people who need a service with the people ready to provide it. Starting in Francistown.",
    tone: "light",
  },
  {
    number: "04",
    name: "SAYNT AI",
    type: "Personal technology",
    status: "IN DEVELOPMENT",
    description:
      "A hands-free Android assistant built around voice interaction, everyday commands and a more natural way to use your device.",
    tone: "dark",
  },
] as const;

function Home() {
  return (
    <main>
      <section className="relative">
        <div className="relative min-h-[520px] overflow-hidden bg-bg sm:min-h-[640px]">
          <img
            src="/images/cover-hero.jpg"
            alt="EMP Exclusive"
            className="bare absolute inset-0 size-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/15" />
          <div className="relative mx-auto flex min-h-[520px] max-w-6xl flex-col justify-end px-4 pb-14 pt-28 sm:min-h-[640px] sm:pb-20">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/65">
              Francistown, Botswana · Est. 19 December 2024
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-6xl leading-[0.92] tracking-tight text-white sm:text-8xl">
              Ideas into impact.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              EMP Exclusive is an independent creative and technology ecosystem building
              platforms, brands and opportunities with purpose.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#projects" className="inline-flex min-h-12 items-center bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/85">
                Explore our projects <span className="ml-3">↗</span>
              </a>
              <a href="#about" className="inline-flex min-h-12 items-center border border-white/45 px-6 text-sm font-semibold text-white transition hover:bg-white/10">
                Discover EMP
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:py-28">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">01 / About EMP</p>
            <h2 className="mt-4 max-w-sm font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              Built to create what comes next.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-muted sm:text-lg">
            <p>
              EMP Exclusive is a growing ecosystem shaped by technology, creativity and
              entrepreneurship. We turn ideas into useful platforms, independent brands and
              experiences that give people room to build and grow.
            </p>
            <p>
              We are not limited to one industry or one kind of project. The work can take
              different forms, but the purpose stays connected: make meaningful things,
              open doors and create value beyond ourselves.
            </p>
            <div className="grid gap-6 border-t border-line pt-7 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Our mission</p>
                <p className="mt-3 text-sm leading-7 text-fg">
                  Build useful ideas, develop skills and create opportunities people can
                  actually use.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Our vision</p>
                <p className="mt-3 text-sm leading-7 text-fg">
                  Grow a connected ecosystem where people, projects and independent
                  ventures can thrive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="scroll-mt-20 bg-[#101012] py-20 text-white sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">02 / The ecosystem</p>
              <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-6xl">Projects with purpose.</h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-white/55">
              Different disciplines. One ecosystem. Each project is built to solve a
              problem, create access or make something possible.
            </p>
          </div>

          <div className="mt-12 grid gap-px bg-white/15 sm:grid-cols-2">
            {projects.map((project) => (
              <article key={project.name} className="group min-h-[290px] bg-[#101012] p-7 transition hover:bg-[#19191c] sm:p-9">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-2xl text-white/35">{project.number}</span>
                  <span className="border border-white/20 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-white/65">
                    {project.status}
                  </span>
                </div>
                <p className="mt-9 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">{project.type}</p>
                <h3 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">{project.name}</h3>
                {("collaboration" in project) ? (
                  <p className="mt-2 text-xs tracking-wide text-white/55">{project.collaboration}</p>
                ) : null}
                <p className="mt-4 max-w-lg text-sm leading-7 text-white/65">{project.description}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 text-xs leading-6 text-white/40">
            Development labels reflect current project status. EMP HQ is an internal,
            restricted platform and is not open for public access.
          </p>
        </div>
      </section>

      <section id="impact" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">03 / Our impact</p>
        <div className="mt-4 grid gap-10 md:grid-cols-[1fr_1fr] md:items-end">
          <h2 className="max-w-xl font-display text-4xl leading-tight tracking-tight sm:text-6xl">
            Progress means more when it reaches people.
          </h2>
          <p className="max-w-xl text-base leading-8 text-muted">
            Our work is focused on practical outcomes: making services easier to find,
            lowering barriers to digital participation, supporting independent creators
            and giving new ideas a place to grow.
          </p>
        </div>
        <div className="mt-12 grid gap-8 border-t border-line pt-8 sm:grid-cols-3">
          <article>
            <p className="font-display text-3xl">Access</p>
            <p className="mt-3 text-sm leading-7 text-muted">Technology and services that connect people to useful tools and support.</p>
          </article>
          <article>
            <p className="font-display text-3xl">Opportunity</p>
            <p className="mt-3 text-sm leading-7 text-muted">Platforms that help people offer skills, find work and build something of their own.</p>
          </article>
          <article>
            <p className="font-display text-3xl">Creativity</p>
            <p className="mt-3 text-sm leading-7 text-muted">Room for original ideas, independent brands and new forms of expression.</p>
          </article>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:grid-cols-[1fr_auto] sm:items-center sm:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">04 / Brand branches</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">A house for ideas to become brands.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
              Trophies is being reimagined as the home of EMP brand branches and
              merchandise: a place to introduce, develop and launch independent
              identities through clothing and creative products.
            </p>
          </div>
          <Link to="/trophies" className="inline-flex min-h-12 items-center justify-center border border-line px-6 text-sm font-semibold transition hover:bg-bg">
            Explore brand branches <span className="ml-3">↗</span>
          </Link>
        </div>
      </section>

      <section id="involved" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">05 / Get involved</p>
        <div className="mt-4 grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-end">
          <h2 className="max-w-2xl font-display text-4xl leading-tight tracking-tight sm:text-6xl">
            Bring an idea. Build something meaningful.
          </h2>
          <p className="text-base leading-8 text-muted">
            EMP is built to collaborate with people who have ideas, skills and the
            determination to make them real. The ecosystem grows through the work we
            create together.
          </p>
        </div>
        <div className="mt-9 border-t border-line pt-6">
          <p className="font-display text-2xl">EMP Exclusive</p>
          <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted">Francistown · Botswana · Building beyond borders</p>
        </div>
      </section>
    </main>
  );
}
