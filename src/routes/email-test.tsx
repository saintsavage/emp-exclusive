import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/email-test")({ component: EmailTestPage });

function EmailTestPage() {
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function sendTest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/email-test", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Email test failed.");
      setMessage("Test email accepted by Resend. Check the test inbox and spam folder.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not send the test email.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-[75vh] bg-[#080809] px-4 py-20 text-white">
      <section className="mx-auto max-w-xl border border-white/15 bg-white/[0.03] p-7 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#e66a6a]">EMP Exclusive · Mail system</p>
        <h1 className="mt-5 font-display text-4xl">Email delivery test</h1>
        <p className="mt-4 text-sm leading-7 text-white/60">Send one test message to the EMP Exclusive test inbox. This does not create an account or enable EMP ID registration.</p>
        <form onSubmit={sendTest} className="mt-8 space-y-4">
          <label htmlFor="test-token" className="block text-xs font-semibold uppercase tracking-wider text-white/70">Temporary test access key</label>
          <input id="test-token" type="password" autoComplete="off" required value={token} onChange={(event) => setToken(event.target.value)} placeholder="Paste the temporary access key" className="w-full border border-white/20 bg-black px-4 py-3 text-sm text-white outline-none focus:border-[#e34242]" />
          <button type="submit" disabled={busy || !token.trim()} className="w-full bg-[#e34242] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{busy ? "Sending…" : "Send test email"}</button>
        </form>
        {message && <p role="status" className="mt-5 border border-white/15 p-4 text-sm text-white/80">{message}</p>}
        <p className="mt-7 text-xs leading-6 text-white/40">Recipient: empexclusive.planet@gmail.com · Sender: noreply@mail.empexclusive.company</p>
      </section>
    </main>
  );
}
