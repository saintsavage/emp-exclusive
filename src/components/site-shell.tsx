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
  { to: "/", label: "Feed" },
  { to: "/members", label: "Family" },
  { to: "/photos", label: "Stills" },
  { to: "/about", label: "House Notes" },
] as const;

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const queryClient = useQueryClient();

  useEffect(() => {
    void pingVisit({ data: { guestId: localGuestId() } })
      .then((stats) => {
        queryClient.setQueryData(["stats"], stats);
      })
      .catch(() => {
        /* first paint can miss a cookie; next tap still counts */
      });
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-bg text-fg">
      <Header />
      <div key={pathname} className="emp-page">
        {children}
      </div>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg text-fg">EMP Exclusive</p>
          <p>EMPIRE · Francistown · Est. 19 Dec 2024</p>
        </div>
      </footer>
    </div>
  );
}

function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-sm transition-colors duration-700">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link to="/" className="flex items-baseline gap-2 pr-2">
          <span className="font-display text-2xl leading-none tracking-tight italic">EMP</span>
          <span className="text-xs font-medium tracking-[0.28em] text-muted uppercase">
            Exclusive
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative flex h-11 items-center px-3 text-sm transition-colors duration-200",
                  active ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                {item.label}
                {active ? <span className="emp-nav-line" /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <HouseLove compact />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle>EMP Exclusive</SheetTitle>
              <nav className="mt-8 flex flex-col gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex h-12 items-center text-lg text-fg"
                  >
                    {item.label}
                  </Link>
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
  const stats = useQuery({
    queryKey: ["stats"],
    queryFn: () => getPageStats(),
  });
  const mutate = useMutation({
    mutationFn: () => tapLove({ data: { guestId: localGuestId() } }),
    onSuccess: (next) => {
      queryClient.setQueryData(["stats"], next);
    },
  });
  const loves = stats.data?.loves ?? 0;

  return (
    <Button
      className={className}
      variant={compact ? "ghost" : "default"}
      size={compact ? "sm" : "default"}
      onClick={() => mutate.mutate()}
      aria-label="Send love to the house"
    >
      <Heart className={cn("size-4", loves > 0 && "fill-fg")} />
      <span className="tabular-nums">{loves}</span>
      {compact ? null : <span>Love</span>}
    </Button>
  );
}

export { HouseLove as FollowButton };
