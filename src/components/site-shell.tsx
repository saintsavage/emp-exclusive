import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Menu } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPageStats, pingVisit, tapLove } from "@/lib/emp/api";
import { localGuestId } from "@/lib/emp/guest";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/services", label: "Digital products" },
  { href: "/#impact", label: "Impact" },
  { href: "/trophies", label: "Brand Branch" },
  { href: "/login", label: "EMP ID" },
  { href: "/#involved", label: "Get involved" },
] as const;

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  useEffect(() => {
    void pingVisit({ data: { guestId: localGuestId() } })
      .then((stats) => queryClient.setQueryData(["stats"], stats))
      .catch(() => {});
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-bg text-fg">
      <Header />
      <div key={pathname} className="emp-page">{children}</div>
      <footer className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-muted sm:grid-cols-[1fr_1fr_auto] sm:items-start">
          <div>
            <p className="font-display text-lg text-fg">EMP Exclusive</p>
            <Link to="/services" className="mt-2 inline-flex text-xs text-muted underline decoration-white/20 underline-offset-4 hover:text-fg">Digital products & services ↗</Link>
            <p className="mt-3 text-xs">EMPIRE · Francistown · Est. 19 Dec 2024</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-fg">Operating hours</p>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-xs">
              <dt>Monday–Friday</dt><dd>08:00–17:00</dd>
              <dt>Saturday</dt><dd>08:00–18:00</dd>
              <dt>Sunday</dt><dd>09:00–16:00</dd>
            </dl>
            <p className="mt-3 text-[11px] text-muted/70">Botswana time (CAT)</p>
          </div>
          <p className="text-xs sm:text-right">We look forward to hearing from you.</p>
        </div>
        <InstallHouse />
      </footer>
    </div>
  );
}

function InstallHouse() {
  const [ready, setReady] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(true);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    if (standalone) return;
    setHidden(false);
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setReady(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (hidden) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 text-sm text-muted">
      {ready ? (
        <button type="button" className="text-fg underline decoration-white/30 underline-offset-4" onClick={() => { void ready.prompt(); setReady(null); }}>
          Install EMP on this phone
        </button>
      ) : ios ? (
        <p>iPhone: in Safari, tap Share, then Add to Home Screen.</p>
      ) : (
        <p>Android: browser menu, then Install app or Add to Home Screen.</p>
      )}
    </div>
  );
}

type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void> };

function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link to="/" className="flex items-baseline gap-2 pr-2">
          <span className="font-display text-2xl leading-none tracking-tight italic">EMP</span>
          <span className="text-xs font-medium tracking-[0.28em] text-muted uppercase">Exclusive</span>
        </Link>
        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className={cn(
              "relative flex h-11 items-center px-3 text-sm transition-colors duration-200",
              pathname === item.href || (item.href === "/trophies" && pathname === "/trophies") ? "text-fg" : "text-muted hover:text-fg",
            )}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu"><Menu className="size-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle>EMP Exclusive</SheetTitle>
              <nav className="mt-8 flex flex-col gap-1">
                {NAV.map((item) => (
                  <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="flex h-12 items-center text-lg text-fg">
                    {item.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function HouseLove({ className, compact = false }: { className?: string; compact?: boolean }) {
  const queryClient = useQueryClient();
  const stats = useQuery({ queryKey: ["stats"], queryFn: () => getPageStats() });
  const mutate = useMutation({
    mutationFn: () => tapLove({ data: { guestId: localGuestId() } }),
    onSuccess: (next) => queryClient.setQueryData(["stats"], next),
  });
  const loves = stats.data?.loves ?? 0;
  return (
    <Button className={className} variant={compact ? "ghost" : "default"} size={compact ? "sm" : "default"} onClick={() => mutate.mutate()} aria-label="Send love to the house">
      <Heart className={cn("size-4", loves > 0 && "fill-fg")} />
      <span className="tabular-nums">{loves}</span>
      {compact ? null : <span>Love</span>}
    </Button>
  );
}

export { HouseLove as FollowButton };
