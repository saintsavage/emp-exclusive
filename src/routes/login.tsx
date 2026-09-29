import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <p className="text-xs tracking-[0.28em] text-muted uppercase">EMP Exclusive</p>
      <h1 className="mt-3 font-display text-5xl leading-none tracking-tight">Join the house</h1>
      <p className="mt-4 text-pretty text-muted">
        Sign in to subscribe, react, and comment. EMP Exclusive writes the posts. The feed stays
        public.
      </p>
      <div className="mt-8 flex flex-col gap-2">
        {authEnabled ? (
          GROK_PROVIDERS.map((provider) => (
            <Button
              key={provider.providerId}
              type="button"
              variant="outline"
              onClick={() => signIn(provider.providerId, { callbackURL: "/" })}
            >
              Continue with {provider.label}
            </Button>
          ))
        ) : (
          <p className="text-sm text-muted">Sign-in is disabled.</p>
        )}
      </div>
      <Link to="/" className="mt-8 text-sm text-muted underline-offset-4 hover:text-fg hover:underline">
        Back to the feed
      </Link>
    </main>
  );
}
