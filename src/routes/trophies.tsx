import { createFileRoute } from "@tanstack/react-router";
import { TrophyHall } from "@/components/trophies";

export const Route = createFileRoute("/trophies")({
  component: TrophiesPage,
});

function TrophiesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs tracking-[0.28em] text-muted uppercase">Memorial</p>
      <h1 className="mt-2 font-display text-5xl tracking-tight">Trophies</h1>
      <p className="mt-3 max-w-xl text-pretty text-muted">
        Top-tier pieces the house keeps. Tap the base to read who imagined them, and from where.
      </p>
      <TrophyHall />
    </main>
  );
}
