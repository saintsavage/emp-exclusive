import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { emailAndPasswordEnabled } from "@/lib/auth/email-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/login")({ component: Login });

function grokSocialOk() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host.endsWith(".grok-sandbox.com") || host.endsWith(".grok.me") || host === "localhost" || host === "127.0.0.1";
}

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const social = grokSocialOk();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!authEnabled || !emailAndPasswordEnabled) return;
    setError(null);
    setPending(true);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email: email.trim(),
          password,
          name: name.trim() || email.split("@")[0] || "Member",
        });
        if (err) throw new Error(err.message || "Could not create the account.");
      } else {
        const { error: err } = await authClient.signIn.email({
          email: email.trim(),
          password,
        });
        if (err) throw new Error(err.message || "Email or password is off.");
      }
      await authClient.getSession();
      await navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <p className="text-xs tracking-[0.28em] text-muted uppercase">EMP Exclusive</p>
      <h1 className="mt-3 font-display text-5xl leading-none tracking-tight">
        {mode === "up" ? "Join the house" : "Welcome back"}
      </h1>
      <p className="mt-4 text-pretty text-muted">
        Subscribe, react, and comment. EMP Exclusive writes the posts. The feed stays public.
      </p>

      {authEnabled && emailAndPasswordEnabled ? (
        <form className="mt-8 flex flex-col gap-3" onSubmit={onSubmit}>
          {mode === "up" ? (
            <label className="block">
              <span className="mb-1.5 block text-xs tracking-[0.18em] text-muted uppercase">Name</span>
              <Input
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Stage name"
              />
            </label>
          ) : null}
          <label className="block">
            <span className="mb-1.5 block text-xs tracking-[0.18em] text-muted uppercase">Email</span>
            <Input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@mail.com"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs tracking-[0.18em] text-muted uppercase">Password</span>
            <Input
              type="password"
              required
              minLength={8}
              autoComplete={mode === "up" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 characters or more"
            />
          </label>
          {error ? <p className="text-sm text-muted">{error}</p> : null}
          <Button type="submit" className="mt-2" disabled={pending}>
            {pending ? "Hold on…" : mode === "up" ? "Create account" : "Sign in"}
          </Button>
          <button
            type="button"
            className="text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
            onClick={() => {
              setError(null);
              setMode(mode === "up" ? "in" : "up");
            }}
          >
            {mode === "up" ? "Already in the house? Sign in" : "New here? Create an account"}
          </button>
        </form>
      ) : (
        <p className="mt-8 text-sm text-muted">Sign-in is disabled.</p>
      )}

      {authEnabled && social ? (
        <div className="mt-8 flex flex-col gap-2">
          <p className="text-xs tracking-[0.18em] text-muted uppercase">Or continue with</p>
          {GROK_PROVIDERS.map((provider) => (
            <Button
              key={provider.providerId}
              type="button"
              variant="outline"
              onClick={() => signIn(provider.providerId, { callbackURL: "/" })}
            >
              Continue with {provider.label}
            </Button>
          ))}
        </div>
      ) : null}

      <Link to="/" className="mt-8 text-sm text-muted underline-offset-4 hover:text-fg hover:underline">
        Back to the feed
      </Link>
    </main>
  );
}
