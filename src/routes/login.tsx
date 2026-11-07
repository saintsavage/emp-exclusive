import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({ component: EmpIdPage });

function EmpIdPage() {
  return (
    <main className="relative isolate flex min-h-[82vh] items-center overflow-hidden bg-[#080809] px-4 py-20 text-white">
      <div className="absolute -right-24 top-1/2 size-[34rem] -translate-y-1/2 rounded-full border border-white/10" />
      <div className="absolute -right-12 top-1/2 size-[25rem] -translate-y-1/2 rounded-full border border-[#d93642]/35" />
      <div className="relative mx-auto w-full max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#e66a6a]">EMP Exclusive · Identity infrastructure</p>
        <div className="mt-8 grid gap-12 md:grid-cols-[1fr_0.8fr] md:items-end">
          <div>
            <p className="font-display text-7xl leading-none tracking-tight sm:text-9xl">EMP<span className="text-[#e34242]"> ID</span></p>
            <h1 className="mt-7 max-w-2xl font-display text-4xl leading-tight sm:text-6xl">One identity.<br />A connected ecosystem.</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/60">EMP ID is being developed as the shared digital identity for participating EMP projects. The goal is simple: create one account and stay connected as you move between the ecosystem's platforms.</p>
          </div>
          <aside className="border border-white/15 bg-white/[0.03] p-7 sm:p-9">
            <span className="inline-flex border border-[#e34242]/50 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-[#f08a8a]">In development</span>
            <h2 className="mt-6 font-display text-3xl">The identity system is not live yet.</h2>
            <p className="mt-4 text-sm leading-7 text-white/55">Account creation and sign-in will be enabled here once the shared EMP ID service is connected and tested. This page is an introduction, not a working registration portal.</p>
            <div className="mt-7 flex flex-col gap-3">
              <Link to="/trophies" className="inline-flex min-h-12 items-center justify-center bg-white px-5 text-sm font-bold text-black transition hover:bg-[#e34242] hover:text-white">Explore Brand Branch <span className="ml-3">↗</span></Link>
              <a href="mailto:empexclusive.planet@gmail.com?subject=EMP%20ID%20updates" className="inline-flex min-h-12 items-center justify-center border border-white/25 px-5 text-sm font-semibold text-white transition hover:bg-white/10">Contact EMP about EMP ID <span className="ml-3">↗</span></a>
            </div>
          </aside>
        </div>
        <div className="mt-16 grid gap-5 border-t border-white/15 pt-7 sm:grid-cols-3">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">01 / One account</p><p className="mt-2 text-sm text-white/75">A single identity across connected EMP platforms.</p></div>
          <div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">02 / Your profile</p><p className="mt-2 text-sm text-white/75">A consistent profile and username wherever EMP ID is supported.</p></div>
          <div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">03 / Connected access</p><p className="mt-2 text-sm text-white/75">Move between projects without creating a separate identity each time.</p></div>
        </div>
      </div>
    </main>
  );
}
