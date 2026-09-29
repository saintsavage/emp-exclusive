import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

const COLS = 8;
const ROWS = 4;
const PIECES = COLS * ROWS;

type Phase = "gate" | "assemble" | "hold" | "reveal" | "off";

function shouldSkip() {
  if (typeof window === "undefined") return true;
  const params = new URLSearchParams(window.location.search);
  if (params.get("intro") === "1") return false;
  if (params.get("intro") === "0") return true;
  if (navigator.webdriver) return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  return false;
}

export function EmpIntro({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("gate");

  useEffect(() => {
    if (shouldSkip()) {
      setPhase("off");
      return;
    }
    setPhase("assemble");
  }, []);

  useEffect(() => {
    if (phase === "assemble") {
      const t = window.setTimeout(() => setPhase("hold"), 1700);
      return () => window.clearTimeout(t);
    }
    if (phase === "hold") {
      const t = window.setTimeout(() => setPhase("reveal"), 1800);
      return () => window.clearTimeout(t);
    }
    if (phase === "reveal") {
      const t = window.setTimeout(() => setPhase("off"), 950);
      return () => window.clearTimeout(t);
    }
  }, [phase]);

  const playing = phase === "gate" || phase === "assemble" || phase === "hold" || phase === "reveal";

  return (
    <div
      className={cn(
        "emp-root min-h-screen",
        phase === "reveal" && "emp-root-reveal",
        phase === "off" && "emp-root-live",
      )}
    >
      <div className={cn("emp-shell", playing && phase !== "reveal" && "emp-shell-hidden")}>{children}</div>

      {playing ? (
        <div
          className={cn("emp-intro", phase === "reveal" && "emp-intro-out")}
          role="dialog"
          aria-label="EMP Exclusive"
        >
          {phase !== "gate" ? <AssembleGrid /> : null}
          <p className="emp-intro-mark">EMP Exclusive</p>
          <button type="button" className="emp-intro-skip" onClick={() => setPhase("off")}>
            Skip
          </button>
        </div>
      ) : null}
    </div>
  );
}

function AssembleGrid() {
  const cells = useMemo(() => Array.from({ length: PIECES }, (_, i) => i), []);

  return (
    <div className="emp-mosaic">
      <div
        className="emp-mosaic-grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
      >
        {cells.map((i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const dx = (col - (COLS - 1) / 2) * 36;
          const dy = (row - (ROWS - 1) / 2) * 48;
          const rot = (col - 3.5) * 6 + (row - 1.5) * 4;
          const delay = (Math.abs(col - 3.5) + Math.abs(row - 1.5)) * 70;
          return (
            <span
              key={i}
              className="emp-shard"
              style={
                {
                  backgroundPosition: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
                  animationDelay: `${delay}ms`,
                  "--dx": `${dx}px`,
                  "--dy": `${dy}px`,
                  "--rot": `${rot}deg`,
                } as CSSProperties
              }
            />
          );
        })}
      </div>
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
