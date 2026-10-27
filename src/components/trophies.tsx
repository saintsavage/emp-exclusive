import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type Tone = "violet" | "silver" | "crimson";
type Phase = "button" | "charge" | "article" | "collapse" | "return";

type Trophy = {
  id: string;
  title: string;
  designer: string;
  role: string;
  tone: Tone;
  src: string;
  lines: string[];
};

const TROPHIES: Trophy[] = [
  {
    id: "saynts",
    title: "Saynts",
    designer: "Planet Tumi",
    role: "Director",
    tone: "violet",
    src: "/images/trophy-saynts.png",
    lines: [
      "Saynts was imagined by Planet Tumi, director of EMP Exclusive, with EMP Saynt beside her.",
      "The word is the two of them. Not a side name. The pair the house already stands on, set in violet chrome because they are the brand itself.",
      "VII · II · MMXXVI is cut into the line beneath it. SAYNTS is the director and the founder, held as one.",
    ],
  },
  {
    id: "exodist",
    title: "Exodist",
    designer: "EMP OT",
    role: "Designer",
    tone: "silver",
    src: "/images/trophy-exodist.png",
    lines: [
      "Exodist was imagined and designed by EMP OT.",
      "He took it from the book of Exodus. Not a quote for a shirt. A departure. A people walked out of bondage, and the mark was cut to remember that exit.",
      "It was meant to be super Christian. Crosses sit inside the letters. A blade runs through the word. White is struck on black the way scripture refuses to soften. Holy on purpose. Not decoration.",
    ],
  },
  {
    id: "straata",
    title: "Straata Academics",
    designer: "Basco Mmula",
    role: "EMP Wing",
    tone: "crimson",
    src: "/images/trophy-straata.png",
    lines: [
      "Straata Academics comes from how Basco Mmula sees the streets that raised them.",
      "He wanted a mark that could stand with the people those streets turn into survivors. The car stays low because that is the ground they come from. The crown stays high because survival is not where it ends.",
      "Low cars. High standards. In his eyes, the street is the school.",
    ],
  },
];

export function TrophyHall() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("button");
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const articleRef = useRef<HTMLElement | null>(null);
  const timers = useRef<number[]>([]);
  const trophy = TROPHIES.find((item) => item.id === openId) ?? null;

  useEffect(() => {
    return () => {
      for (const id of timers.current) window.clearTimeout(id);
    };
  }, []);

  function clearTimers() {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  }

  function open(id: string) {
    clearTimers();
    setOpenId(id);
    setPhase("charge");
    timers.current.push(window.setTimeout(() => setPhase("article"), 560));
  }

  function close() {
    if (!openId || phase === "collapse" || phase === "return") return;
    clearTimers();
    setPhase("collapse");
    timers.current.push(
      window.setTimeout(() => setPhase("return"), 620),
      window.setTimeout(() => {
        setPhase("button");
        setOpenId(null);
      }, 1380),
    );
  }

  return (
    <>
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        {TROPHIES.map((item) => (
          <TrophyCase
            key={item.id}
            trophy={item}
            charging={openId === item.id && phase === "charge"}
            onOpen={() => open(item.id)}
            setButton={(node) => {
              if (node) buttons.current.set(item.id, node);
              else buttons.current.delete(item.id);
            }}
          />
        ))}
      </div>
      {TROPHIES.map((item) => (
        <OrbRig
          key={item.id}
          tone={item.tone}
          phase={openId === item.id ? phase : "button"}
          live={openId === item.id && phase !== "button"}
          button={() => buttons.current.get(item.id) ?? null}
          article={() => (openId === item.id ? articleRef.current : null)}
        />
      ))}
      <TrophyArticle trophy={trophy} phase={phase} articleRef={articleRef} onClose={close} />
    </>
  );
}

function TrophyCase({
  trophy,
  charging,
  onOpen,
  setButton,
}: {
  trophy: Trophy;
  charging: boolean;
  onOpen: () => void;
  setButton: (node: HTMLButtonElement | null) => void;
}) {
  return (
    <figure className={`trophy trophy-${trophy.tone}${charging ? " is-charge" : ""}`}>
      <div className="trophy-case">
        <div className="trophy-glass">
          <img src={trophy.src} alt={trophy.title} className="trophy-face" />
        </div>
      </div>
      <figcaption className="trophy-plinth">
        <p className="trophy-name">{trophy.title}</p>
        <p className="trophy-by">{trophy.designer}</p>
        <button type="button" className="trophy-tap" ref={setButton} onClick={onOpen}>
          Tap for Information
        </button>
      </figcaption>
    </figure>
  );
}

function OrbRig({
  tone,
  phase,
  live,
  button,
  article,
}: {
  tone: Tone;
  phase: Phase;
  live: boolean;
  button: () => HTMLButtonElement | null;
  article: () => HTMLElement | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const box = (node: HTMLElement) => {
      const previous = node.style.transform;
      node.style.transform = "none";
      const rect = node.getBoundingClientRect();
      node.style.transform = previous;
      return rect;
    };
    const place = (rect: DOMRect, round: string) => {
      el.style.left = `${rect.left}px`;
      el.style.top = `${rect.top}px`;
      el.style.width = `${rect.width}px`;
      el.style.height = `${rect.height}px`;
      el.style.setProperty("--orb-round", round);
    };
    const placePoint = (rect: DOMRect) => {
      el.style.left = `${rect.left + rect.width / 2}px`;
      el.style.top = `${rect.top + rect.height / 2}px`;
      el.style.width = "0px";
      el.style.height = "0px";
    };
    const sync = () => {
      const home = button();
      const card =
        phase === "button" ? null : (article() ?? document.querySelector<HTMLElement>(".trophy-article"));
      el.dataset.card = card ? "1" : "0";
      el.dataset.phase = phase;
      if ((phase === "article" || phase === "collapse") && !card) {
        requestAnimationFrame(sync);
        return;
      }
      if (phase === "charge" && home) {
        el.dataset.animate = "0";
        place(box(home), "999px");
        void el.offsetWidth;
        el.dataset.animate = "1";
        placePoint(box(home));
        return;
      }
      if (phase === "article" && card && home) {
        const rect = box(card);
        const pad = 16;
        const ring = new DOMRect(rect.x - pad, rect.y - pad, rect.width + pad * 2, rect.height + pad * 2);
        el.dataset.animate = "0";
        place(box(home), "999px");
        void el.offsetWidth;
        el.dataset.animate = "1";
        place(ring, "1.4rem");
        return;
      }
      if (phase === "collapse" && card) {
        el.dataset.animate = "1";
        placePoint(box(card));
        return;
      }
      el.dataset.animate = phase === "return" ? "1" : "0";
      if (home) place(box(home), "999px");
    };
    sync();
    if (phase === "button") {
      const jump = () => sync();
      window.addEventListener("resize", jump);
      window.addEventListener("scroll", jump, true);
      return () => {
        window.removeEventListener("resize", jump);
        window.removeEventListener("scroll", jump, true);
      };
    }
    return undefined;
  }, [phase, button, article]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={ref}
      className={`orb-rig orb-rig-${tone} orb-rig-${phase} ${live ? "orb-rig-live" : "orb-rig-idle"}`}
      data-animate={phase === "button" ? "0" : "1"}
      aria-hidden="true"
    >
      <span className="orb" style={{ ["--i" as string]: 0 }} />
      <span className="orb" style={{ ["--i" as string]: 1 }} />
      <span className="orb" style={{ ["--i" as string]: 2 }} />
    </div>,
    document.body,
  );
}

function TrophyArticle({
  trophy,
  phase,
  articleRef,
  onClose,
}: {
  trophy: Trophy | null;
  phase: Phase;
  articleRef: RefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!trophy) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [trophy, onClose]);

  if (!trophy || phase === "button" || phase === "charge") return null;

  const leaving = phase === "collapse" || phase === "return";

  return (
    <div className={`trophy-veil trophy-veil-${trophy.tone} ${phase === "return" ? "is-return" : ""}`}>
      <button type="button" className="trophy-veil-hit" aria-label="Close" onClick={onClose} />
      <article
        ref={articleRef}
        className={`trophy-article ${leaving ? "is-collapse" : "is-in"}`}
        data-tone={trophy.tone}
      >
        <button type="button" className="trophy-close" aria-label="Close" onClick={onClose}>
          <X className="size-5" />
        </button>
        <p className="text-xs tracking-[0.28em] text-white/60 uppercase">Memorial</p>
        <h2 className="mt-3 font-display text-5xl leading-none text-white">{trophy.title}</h2>
        <p className="mt-3 text-sm tracking-[0.18em] text-white/70 uppercase">Imagined by {trophy.designer}</p>
        <img src={trophy.src} alt="" className="trophy-article-mark" />
        <div className="mt-6 space-y-4 text-pretty text-white/85">
          {trophy.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </article>
    </div>
  );
}
