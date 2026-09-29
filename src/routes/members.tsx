import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listMembers } from "@/lib/emp/api";
import type { Member } from "@/lib/emp/types";
import { MemberPortrait } from "@/components/member-portrait";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/members")({
  loader: () => listMembers(),
  component: FamilyPage,
});

const FACE_FOCUS: Record<string, string> = {
  saynt: "object-center",
  mk7teen: "object-center",
  mbeha: "object-center",
  xanon: "object-center",
  tumi: "object-center",
  jadoh: "object-center",
  ggee: "object-center",
  bridgett: "object-center",
  mj: "object-center",
  basco: "object-center",
  waykid: "object-center",
  ahmed: "object-center",
  tango: "object-center",
  lio: "object-center",
  wezzz: "object-center",
  malone: "object-center",
  paul: "object-center",
};

type HouseTheme = "founders" | "director" | "cofounders" | "wing" | "designer" | "verse" | "members";

const SECTIONS: {
  title: string;
  ids: readonly string[];
  shared: boolean;
  intro?: string;
  featured?: boolean;
  veil?: boolean;
  theme: HouseTheme;
}[] = [
  {
    title: "Founders",
    ids: ["saynt", "mk7teen"],
    shared: false,
    intro: "The line that built the house. Vision and ground.",
    theme: "founders",
  },
  {
    title: "Director",
    ids: ["tumi"],
    shared: false,
    featured: true,
    theme: "director",
  },
  {
    title: "Co-founders",
    ids: ["mbeha", "xanon", "malone"],
    shared: false,
    intro: "They stood in the relaunch. Each one holds a different piece of the EMPIRE.",
    theme: "cofounders",
  },
  {
    title: "EMP Wing",
    ids: ["mj", "basco"],
    shared: true,
    intro:
      "Two wings that keep EMP at altitude — the Vibe Police. M.J and Basco Mmula. If the energy drops, they lift it. If the room goes quiet, they bring it back.",
    theme: "wing",
  },
  {
    title: "Designer",
    ids: ["ahmed"],
    shared: false,
    featured: true,
    intro: "He draws the map before the house walks it.",
    theme: "designer",
    veil: false,
  },
  {
    title: "The Word",
    ids: ["tango", "lio"],
    shared: true,
    intro: "EMP Verse. Tango and Lio put the house in language.",
    theme: "verse",
  },
  {
    title: "Members",
    ids: ["jadoh", "bridgett", "mastermind", "ggee", "wezzz", "paul"],
    shared: true,
    intro:
      "The rest of the family, under one word. They carry EMP in the streets, in the chats, and in the rooms we have not named yet.",
    theme: "members",
  },
];

function FamilyPage() {
  const initial = Route.useLoaderData();
  const members = useQuery({
    queryKey: ["members"],
    queryFn: () => listMembers(),
    initialData: initial,
  });
  const byId = new Map((members.data ?? []).map((m) => [m.id, m]));
  const sectionRefs = useRef<Record<HouseTheme, HTMLElement | null>>({
    founders: null,
    director: null,
    cofounders: null,
    wing: null,
    designer: null,
    verse: null,
    members: null,
  });
  const [theme, setTheme] = useState<HouseTheme | null>(null);

  useEffect(() => {
    const nodes = Object.values(sectionRefs.current).filter((n): n is HTMLElement => Boolean(n));
    if (nodes.length === 0) return;
    const ratios = new Map<HTMLElement, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target as HTMLElement, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let best: HouseTheme | null = null;
        let bestRatio = 0.16;
        for (const node of nodes) {
          const ratio = ratios.get(node) ?? 0;
          if (ratio >= bestRatio) {
            bestRatio = ratio;
            best = (node.dataset.theme as HouseTheme) ?? null;
          }
        }
        setTheme(best);
        if (best) document.documentElement.dataset.house = best;
        else delete document.documentElement.dataset.house;
      },
      { threshold: [0, 0.12, 0.22, 0.35, 0.5, 0.7], rootMargin: "-12% 0px -18% 0px" },
    );
    for (const node of nodes) io.observe(node);
    return () => {
      io.disconnect();
      delete document.documentElement.dataset.house;
    };
  }, [members.data]);

  return (
    <>
      <HouseVeils active={theme} />
      <main className="relative mx-auto max-w-6xl px-4 py-10">
        <p className="text-xs tracking-[0.28em] text-muted uppercase">The house</p>
        <h1 className="mt-2 font-display text-5xl tracking-tight text-balance">Meet the EMP Family</h1>
        <p className="mt-3 max-w-xl text-pretty text-muted">
          Founders, director, co-founders, wings, designer, verse, and members. Stage names. One bond.
        </p>

        {members.isPending ? (
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {[0, 1, 2, 3].map((key) => (
              <Skeleton key={key} className="aspect-portrait rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="mt-14 space-y-16">
            {SECTIONS.map((section) => {
              const people = section.ids.map((id) => byId.get(id)).filter((m): m is Member => Boolean(m));
              if (people.length === 0) return null;
              return (
                <section
                  key={section.title}
                  data-theme={section.veil === false ? undefined : section.theme}
                  ref={(node) => {
                    if (section.veil === false) return;
                    sectionRefs.current[section.theme] = node;
                  }}
                  className="house-stage"
                >
                  <p className="text-xs tracking-[0.28em] text-subtle uppercase">{section.title}</p>
                  {section.intro ? (
                    <p className="mt-3 max-w-2xl text-pretty text-muted">{section.intro}</p>
                  ) : null}
                  <div
                    className={cn("mt-6 grid gap-8", section.featured ? "sm:grid-cols-1" : "sm:grid-cols-2")}
                  >
                    {people.map((member) => (
                      <article
                        key={member.id}
                        className={cn(
                          "house-card overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]",
                          section.featured && "mx-auto w-full max-w-lg",
                        )}
                      >
                        <MemberPortrait
                          name={member.name}
                          src={member.portraitUrl || null}
                          className={cn("aspect-portrait w-full text-6xl", FACE_FOCUS[member.id])}
                        />
                        <div className="p-5">
                          <p className="text-xs tracking-[0.22em] text-subtle uppercase">{member.role}</p>
                          <h2 className="mt-1 font-display text-3xl">{member.name}</h2>
                          {section.shared ? null : (
                            <p className="mt-3 text-pretty text-muted">{member.bio}</p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

function HouseVeils({ active }: { active: HouseTheme | null }) {
  return (
    <div className="house-veils" aria-hidden="true">
      <div className={cn("house-veil house-veil-founders", active === "founders" && "is-on")} />
      <div className={cn("house-veil house-veil-director", active === "director" && "is-on")} />
      <div className={cn("house-veil house-veil-cofounders", active === "cofounders" && "is-on")}>
        <span className="cof-split cof-split-green" />
        <span className="cof-split cof-split-grey" />
      </div>
      <div className={cn("house-veil house-veil-wing", active === "wing" && "is-on")}>
        <WingMark side="left" />
        <WingMark side="right" />
      </div>
      <div className={cn("house-veil house-veil-verse", active === "verse" && "is-on")} />
      <div className={cn("house-veil house-veil-members", active === "members" && "is-on")}>
        <Starfield />
      </div>
    </div>
  );
}

function WingMark({ side }: { side: "left" | "right" }) {
  return (
    <svg
      className={cn("house-wing", side === "right" && "house-wing-flip")}
      viewBox="0 0 420 520"
      fill="none"
    >
      <defs>
        <linearGradient id={`wing-fill-${side}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="38%" stopColor="#f4f4f0" stopOpacity="0.55" />
          <stop offset="72%" stopColor="#1a1a1c" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
        </linearGradient>
        <filter id={`wing-glow-${side}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        filter={`url(#wing-glow-${side})`}
        fill={`url(#wing-fill-${side})`}
        d="M48 268C52 150 148 46 292 28c-48 62-58 112-18 158-62-8-108 18-96 78-44-22-92 4-86 64-28-32-62-18-68 18 8-58 6-118 24-178Z"
      />
      <path
        fill="rgb(244 244 240 / 0.35)"
        d="M118 214c42-54 102-92 176-108-40 48-46 86-16 122-48 2-82 28-78 70-34-18-66-6-70 28 6-46 8-82-12-112Z"
      />
    </svg>
  );
}

function Starfield() {
  const stars = useMemo(
    () =>
      Array.from({ length: 86 }, (_, i) => ({
        id: i,
        left: ((i * 53) % 100) + (i % 7) * 0.3,
        top: ((i * 37) % 100) + (i % 5) * 0.2,
        size: i % 9 === 0 ? 3 : i % 4 === 0 ? 2 : 1,
        delay: (i % 11) * 0.28,
      })),
    [],
  );

  return (
    <div className="starfield">
      {stars.map((star) => (
        <span
          key={star.id}
          className="star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
