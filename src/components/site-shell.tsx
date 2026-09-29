import { useState } from "react";
import { Link, useRouterState, useRouteContext } from "@tanstack/react-router";
import { Bell, Menu } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { followState, listNotifications, markNotificationsRead, toggleFollow } from "@/lib/emp/api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { formatStamp, cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Feed" },
  { to: "/members", label: "Family" },
  { to: "/photos", label: "Stills" },
  { to: "/about", label: "House Notes" },
] as const;

function useResolvedSession() {
  const { sessionUser } = useRouteContext({ from: "__root__" });
  const { user, isPending } = useCurrentUserState();
  const waitingForKnownUser = isPending && sessionUser != null;
  return {
    user,
    waiting: waitingForKnownUser,
    signedOut: !user && !waitingForKnownUser,
  };
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
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
          <NotifyBell />
          <AuthSlot />
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
              <div className="mt-auto pt-8">
                <UserButton />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function AuthSlot() {
  const { user, waiting, signedOut } = useResolvedSession();
  if (waiting) return <Skeleton className="size-9 rounded-full" />;
  if (signedOut || !user) {
    return (
      <Button asChild size="sm" variant="outline">
        <Link to="/login">Sign in</Link>
      </Button>
    );
  }
  return (
    <div className="hidden max-w-48 md:block">
      <UserButton />
    </div>
  );
}

function NotifyBell() {
  const { user, waiting, signedOut } = useResolvedSession();
  const queryClient = useQueryClient();
  const notes = useQuery({
    queryKey: ["notifications"],
    queryFn: () => listNotifications(),
    enabled: Boolean(user),
  });
  const mark = useMutation({
    mutationFn: () => markNotificationsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  if (waiting) return <Skeleton className="size-9 rounded-full" />;
  if (signedOut || !user) return null;

  const unread = (notes.data ?? []).filter((n) => !n.read).length;

  return (
    <DropdownMenu
      onOpenChange={(next) => {
        if (next && unread > 0) mark.mutate();
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="size-4" />
          {unread > 0 ? (
            <span className="absolute top-2 right-2 size-1.5 rounded-full bg-fg" />
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>On the wire</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(notes.data ?? []).length === 0 ? (
          <p className="px-3 py-6 text-sm text-muted">No pings yet. Subscribe to catch drops.</p>
        ) : (
          (notes.data ?? []).slice(0, 8).map((item) => (
            <DropdownMenuItem key={item.id} asChild>
              <Link to={item.href || "/"} className="flex flex-col items-start gap-0.5 py-3">
                <span className="text-sm text-fg">{item.title}</span>
                <span className="line-clamp-2 text-xs text-muted">{item.body}</span>
                <span className="text-xs text-subtle">{formatStamp(item.createdAt)}</span>
              </Link>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function FollowButton({ className }: { className?: string }) {
  const { user, waiting, signedOut } = useResolvedSession();
  const queryClient = useQueryClient();
  const state = useQuery({
    queryKey: ["follow"],
    queryFn: () => followState(),
    enabled: Boolean(user),
  });
  const mutate = useMutation({
    mutationFn: () => toggleFollow(),
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: ["follow"] });
      await queryClient.invalidateQueries({ queryKey: ["stats"] });
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      if (res.following && typeof Notification !== "undefined" && Notification.permission === "default") {
        void Notification.requestPermission();
      }
    },
  });

  if (waiting) return <Skeleton className={cn("h-11 w-28 rounded-md", className)} />;
  if (signedOut || !user) {
    return (
      <Button asChild className={className}>
        <Link to="/login">Subscribe</Link>
      </Button>
    );
  }

  const on = state.data?.following;
  return (
    <Button
      className={className}
      variant={on ? "outline" : "default"}
      onClick={() => mutate.mutate()}
      disabled={mutate.isPending || state.isPending}
    >
      {on ? "Subscribed" : "Subscribe"}
    </Button>
  );
}

export { SignedIn, SignedOut };
