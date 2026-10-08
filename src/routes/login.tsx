import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <p className="text-xs tracking-[0.28em] text-muted uppercase">EMP Exclusive</p>
      <h1 className="mt-3 font-display text-5xl leading-none tracking-tight">The floor is open</h1>
      <p className="mt-4 text-pretty text-muted">
        No account. Leave a name to comment. Love the house as many times as you want. Your name
        holds for 20 hours.
      </p>
      <Link to="/" className="mt-8 text-sm text-muted underline-offset-4 hover:text-fg hover:underline">
        Back to the feed
      </Link>
    </main>
  );
}
