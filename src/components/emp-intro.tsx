import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

const COLS = 8;
const ROWS = 4;
const PIECES = COLS * ROWS;
type Phase = "gate" | "assemble" | "hold" | "reveal" | "return" | "off";

function introMode(): "full" | "short" | "skip" {
  if (typeof window === "undefined") return "skip";
  const params = new URLSearchParams(window.location.search);
  if (params.get("intro") === "1") return "full";
  if (params.get("intro") === "0") return "skip";
  if (navigator.webdriver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "skip";
  try {
    return window.localStorage.getItem("emp-intro-seen") === "1" ? "short" : "full";
  } catch {
    return "short";
  }
}

export function EmpIntro({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("gate");

  useEffect(() => {
    const mode = introMode();
    if (mode === "skip") {
      setPhase("off");
      return;
    }
    try { window.localStorage.setItem("emp-intro-seen", "1"); } catch { /* storage may be unavailable */ }
    setPhase(mode === "short" ? "return" : "assemble");
  }, []);

  useEffect(() => {
    if (phase === "assemble") {
      const t = window.setTimeout(() => setPhase("hold"), 1700);
      return () => window.clearTimeout(t);
    }
    if (phase === "hold") {
      const t = window.setTimeout(() => setPhase("reveal"), 1700);
      return () => window.clearTimeout(t);
    }
    if (phase === "reveal") {
      const t = window.setTimeout(() => setPhase("off"), 850);
      return () => window.clearTimeout(t);
    }
    if (phase === "return") {
      const t = window.setTimeout(() => setPhase("off"), 1250);
      return () => window.clearTimeout(t);
    }
  }, [phase]);

  const playing = phase !== "off";

  return (
    <div className={cn("emp-root min-h-screen", phase === "reveal" && "emp-root-reveal", phase === "off" && "emp-root-live")}>
      <div className={cn("emp-shell", playing && phase !== "reveal" && "emp-shell-hidden")}>{children}</div>
      {playing ? (
        <div className={cn("emp-intro", phase === "reveal" && "emp-intro-out", phase === "return" && "emp-intro-return")} role="dialog" aria-label="EMP Exclusive introduction">
          {phase === "assemble" || phase === "hold" ? <AssembleGrid /> : null}
          <p className="emp-intro-mark">EMP Exclusive</p>
          <p className="emp-intro-tagline">BUILT DIFFERENT. CONNECTED BY VISION.</p>
          <button type="button" className="emp-intro-skip" onClick={() => setPhase("off")}>Skip intro</button>
        </div>
      ) : null}
    </div>
  );
}

function AssembleGrid() {
  const cells = useMemo(() => Array.from({ length: PIECES }, (_, i) => i), []);
  return (
    <div className="emp-mosaic">
      <div className="emp-mosaic-grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
        {cells.map((i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const dx = (col - (COLS - 1) / 2) * 36;
          const dy = (row - (ROWS - 1) / 2) * 48;
          const rot = (col - 3.5) * 6 + (row - 1.5) * 4;
          const delay = (Math.abs(col - 3.5) + Math.abs(row - 1.5)) * 70;
          return <span key={i} className="emp-shard" style={{ backgroundPosition: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`, animationDelay: `${delay}ms`, "--dx": `${dx}px`, "--dy": `${dy}px`, "--rot": `${rot}deg` } as CSSProperties} />;
        })}
      </div>
      <svg className="emp-signal-paths" viewBox="0 0 1200 650" aria-hidden="true">
        <path d="M0 325H430L510 245H690L770 325H1200" />
        <path d="M600 245V80M600 405V570M510 245L420 155H280M690 245L780 155H920M510 405L420 495H280M690 405L780 495H920" />
        <path d="M0 325H1200" className="emp-signal-beam" />
        <circle cx="600" cy="325" r="8" />
        <circle cx="280" cy="155" r="5" /><circle cx="920" cy="155" r="5" />
        <circle cx="280" cy="495" r="5" /><circle cx="920" cy="495" r="5" />
      </svg>
      <span className="emp-metal" aria-hidden="true">
        <span className="emp-metal-band emp-metal-soft" />
        <span className="emp-metal-band emp-metal-core" />
        <span className="emp-metal-band emp-metal-edge" />
        <span className="emp-metal-band emp-metal-soft emp-metal-pass-2" />
        <span className="emp-metal-band emp-metal-core emp-metal-pass-2" />
        <span className="emp-metal-band emp-metal-edge emp-metal-pass-2" />
      </span>
    </div>
  );
}
