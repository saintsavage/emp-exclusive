import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type Tone = "silver" | "crimson";

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
  const trophy = TROPHIES.find((item) => item.id === openId) ?? null;

  return (
    <>
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        {TROPHIES.map((item) => (
          <TrophyCase key={item.id} trophy={item} onOpen={() => setOpenId(item.id)} />
        ))}
      </div>
      <TrophyArticle trophy={trophy} onClose={() => setOpenId(null)} />
    </>
  );
}

function TrophyCase({ trophy, onOpen }: { trophy: Trophy; onOpen: () => void }) {
  return (
    <figure className={`trophy trophy-${trophy.tone}`}>
      <div className="trophy-case">
        <div className="trophy-glass">
          <img src={trophy.src} alt={trophy.title} className="trophy-face" />
        </div>
      </div>
      <figcaption className="trophy-plinth">
        <p className="trophy-name">{trophy.title}</p>
        <p className="trophy-by">{trophy.designer}</p>
        <button type="button" className="trophy-tap" onClick={onOpen}>
          Tap for Information
        </button>
      </figcaption>
    </figure>
  );
}

function TrophyArticle({ trophy, onClose }: { trophy: Trophy | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (trophy && !dialog.open) dialog.showModal();
    if (!trophy && dialog.open) dialog.close();
  }, [trophy, mounted]);

  if (!mounted) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      className={`trophy-read trophy-read-${trophy?.tone ?? "silver"}`}
      aria-label={trophy ? `${trophy.title} article` : "Trophy"}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {trophy ? (
        <article className="trophy-article" data-tone={trophy.tone}>
          <button type="button" className="trophy-close" aria-label="Close" onClick={onClose}>
            <X className="size-5" />
          </button>
          <p className="text-xs tracking-[0.28em] text-white/60 uppercase">Memorial</p>
          <h2 className="mt-3 font-display text-5xl leading-none text-white">{trophy.title}</h2>
          <p className="mt-3 text-sm tracking-[0.18em] text-white/70 uppercase">
            Imagined by {trophy.designer}
          </p>
          <img src={trophy.src} alt="" className="trophy-article-mark" />
          <div className="mt-6 space-y-4 text-pretty text-white/85">
            {trophy.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </article>
      ) : null}
    </dialog>,
    document.body,
  );
}
