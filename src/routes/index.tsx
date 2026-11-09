import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const sendContactEmail = createServerFn({ method: "POST" })
  .inputValidator(z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(254), message: z.string().trim().min(10).max(5000) }))
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;
    if (!apiKey || !fromEmail) throw new Error("Email delivery is not configured yet. Please use WhatsApp for now.");
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `EMP Exclusive Website <${fromEmail}>`,
        to: ["empexclusive.planet@gmail.com"],
        reply_to: data.email,
        subject: `Website enquiry from ${data.name}`,
        text: `Name: ${data.name}\\nEmail: ${data.email}\\n\\n${data.message}`,
      }),
    });
    if (!response.ok) throw new Error("Your message could not be delivered. Please try WhatsApp instead.");
    return { sent: true };
  });

export const Route = createFileRoute("/")({ component: Home });

const projects = [
  { number: "01", name: "EMP HQ", category: "Internal infrastructure", status: "RESTRICTED AREA", description: "EMP's private operations dashboard for managing projects and internal work.", tag: "THE ENGINE", dark: true },
  { number: "02", name: "EMP ID", category: "Identity infrastructure", status: "IN DEVELOPMENT", description: "One sign-in designed to make access across participating EMP websites and apps simpler.", tag: "ONE IDENTITY", dark: false },
  { number: "03", name: "HandOn", category: "Service marketplace", status: "IN DEVELOPMENT", collaboration: "In collaboration with Ahmed Ali", description: "Find local services or offer your skills. HandOn is starting in Francistown.", tag: "LOCAL OPPORTUNITY", dark: false },
  { number: "04", name: "SAYNT AI", category: "Personal technology", status: "IN DEVELOPMENT", description: "A hands-free Android assistant built around voice interaction and everyday commands.", tag: "TECH, REIMAGINED", dark: true },
] as const;


function BrandBranchLogo() {
  return (
    <div className="hidden shrink-0 items-center gap-4 text-white sm:flex">
      <svg viewBox="0 0 100 100" role="img" aria-label="Brand Branch symbol" className="h-24 w-24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 14V86" stroke="currentColor" strokeWidth="5" strokeLinecap="square"/>
        <path d="M27 17H49C76 17 78 47 49 47H27" stroke="currentColor" strokeWidth="5" strokeLinecap="square" strokeLinejoin="round"/>
        <path d="M27 49H53C82 49 82 83 53 83H27" stroke="currentColor" strokeWidth="5" strokeLinecap="square" strokeLinejoin="round"/>
        <path d="M54 49H77" stroke="#e34242" strokeWidth="5" strokeLinecap="square"/>
        <circle cx="81" cy="49" r="4" fill="#e34242"/>
      </svg>
      <div className="leading-none">
        <p className="font-display text-2xl font-semibold tracking-[0.22em]">BRAND</p>
        <p className="mt-2 font-display text-2xl font-semibold tracking-[0.22em]">BRANCH<span className="text-[#e34242]">.</span></p>
        <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.32em] text-white/45">An EMP Exclusive brand house</p>
      </div>
    </div>
  );
}

function Home() {
  const [message, setMessage] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");
  const whatsappUrlOne = `https://wa.me/26776702785?text=${encodeURIComponent(message.trim())}`;
  const whatsappUrlTwo = `https://wa.me/26777506421?text=${encodeURIComponent(message.trim())}`;

  return (
    <main>
      <section className="relative isolate min-h-[650px] overflow-hidden bg-[#080809] text-white sm:min-h-[760px]">
        <img src="/images/cover-hero.jpg" alt="EMP Exclusive" className="bare absolute inset-0 size-full object-cover object-center opacity-65" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
        <div className="relative mx-auto flex min-h-[650px] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:min-h-[760px] sm:pb-24">
          <div className="mb-8 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-white/55">
            <span className="h-px w-9 bg-[#e34242]" /> Independent by nature · Francistown, Botswana
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Ideas Into Impact.</p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl leading-[0.88] tracking-tight sm:text-8xl md:text-9xl">
            Make the idea<br /><span className="text-white/45">matter.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
            We help businesses and creators look sharper, work smarter and get their ideas in front of more people. From branding to websites and custom digital tools, we turn good ideas into things people can use.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#projects" className="inline-flex min-h-12 items-center bg-white px-6 text-sm font-bold text-black transition hover:bg-[#e34242] hover:text-white">Explore what we do <span className="ml-4">↗</span></a>
            <a href="#about" className="inline-flex min-h-12 items-center border border-white/35 px-6 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10">Who we are</a>
          </div>
          <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/20 pt-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
            <span>Creative culture</span><span>Technology</span><span>Entrepreneurship</span><span>Built to grow</span>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:py-28">
        <div className="grid gap-10 md:grid-cols-[0.78fr_1.22fr] md:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted">01 / The thinking</p>
            <h2 className="mt-4 max-w-sm font-display text-4xl leading-[1.02] tracking-tight sm:text-6xl">Good ideas deserve great execution.</h2>
          </div>
          <div className="space-y-6 text-base leading-8 text-muted sm:text-lg">
            <p>We help people and businesses bring their ideas to life. That means memorable brands, useful websites and digital tools that make everyday work easier.</p>
            <p>Whether you're starting small or ready to grow, we'll help you turn your next idea into something real.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/services" className="inline-flex min-h-11 items-center bg-fg px-5 text-sm font-bold text-bg transition hover:bg-[#e34242] hover:text-white">Explore our digital products & services <span className="ml-3">↗</span></Link>
              <Link to="/services#branding" className="inline-flex min-h-11 items-center border border-line px-5 text-sm font-semibold text-fg transition hover:border-[#e34242]">Explore branding & merchandise</Link>
            </div>
            <div className="grid gap-6 border-t border-line pt-7 sm:grid-cols-2">
              <div><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted">Our mission</p><p className="mt-3 text-sm leading-7 text-fg">Build useful ideas, develop skills and create opportunities people can actually use.</p></div>
              <div><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted">Our vision</p><p className="mt-3 text-sm leading-7 text-fg">Help more people turn good ideas into useful products, stronger brands and new opportunities.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="scroll-mt-20 bg-[#0b0b0d] py-20 text-white sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[0.28em] text-white/45">02 / What we're building</p><h2 className="mt-4 font-display text-4xl tracking-tight sm:text-6xl">Different ideas.<br />Shared ambition.</h2></div>
            <p className="max-w-sm text-sm leading-7 text-white/55">Meet the projects we're building. Each one solves a different problem and has a clear purpose.</p>
          </div>
          <div className="mt-12 grid gap-3 sm:grid-cols-2">
            {projects.map((project) => (
              <article key={project.name} className="group relative min-h-[300px] overflow-hidden border border-white/10 bg-[#141416] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#e34242]/70 sm:p-9">
                <div className="absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full border border-white/10 transition duration-500 group-hover:scale-150 group-hover:border-[#e34242]/40" />
                <div className="relative flex items-start justify-between gap-4"><span className="font-display text-2xl text-white/35">{project.number}</span><span className="border border-white/20 px-3 py-1 text-[9px] font-bold tracking-[0.16em] text-white/65">{project.status}</span></div>
                <p className="relative mt-10 text-[10px] font-bold uppercase tracking-[0.24em] text-[#e66a6a]">{project.category}</p>
                <h3 className="relative mt-2 font-display text-4xl tracking-tight sm:text-5xl">{project.name}<span className="text-white/30">.</span></h3>
                {"collaboration" in project ? <p className="relative mt-2 text-xs tracking-wide text-white/55">{project.collaboration}</p> : null}
                <p className="relative mt-4 max-w-lg text-sm leading-7 text-white/60">{project.description}</p>
                <p className="relative mt-7 text-[9px] font-bold tracking-[0.22em] text-white/30">{project.tag}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 text-xs leading-6 text-white/40">Development labels reflect current project status. EMP HQ is an internal, restricted platform and is not open for public access.</p>
        </div>
      </section>

      <section id="impact" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:py-28">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted">03 / Why it matters</p>
        <div className="mt-4 grid gap-10 md:grid-cols-[1fr_0.85fr] md:items-end">
          <h2 className="max-w-2xl font-display text-4xl leading-[1.02] tracking-tight sm:text-6xl">Make useful things. Create real value.</h2>
          <p className="text-base leading-8 text-muted">We focus on results people can feel: easier access to services, better ways to work, stronger brands and more room for good ideas to grow.</p>
        </div>
        <div className="mt-12 grid gap-0 border-y border-line sm:grid-cols-3">
          {[["01", "Access", "Connect people to useful tools, technology and support."], ["02", "Opportunity", "Help people offer skills, find work and build something of their own."], ["03", "Creativity", "Make room for original ideas, independent brands and expression."]].map(([n, title, body]) => (
            <article key={n} className="border-b border-line py-7 sm:border-b-0 sm:border-r sm:px-7 sm:first:pl-0 sm:last:border-r-0"><p className="text-xs font-bold tracking-[0.2em] text-[#d94a4a]">{n}</p><h3 className="mt-5 font-display text-3xl">{title}</h3><p className="mt-3 text-sm leading-7 text-muted">{body}</p></article>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#111113] text-white">
        <div className="absolute -right-20 top-1/2 size-80 -translate-y-1/2 rounded-full border border-white/10 sm:size-[34rem]" />
        <div className="absolute -right-8 top-1/2 size-56 -translate-y-1/2 rounded-full border border-[#d94a4a]/35 sm:size-[26rem]" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:grid-cols-[1fr_auto] sm:items-center sm:py-24">
          <div className="flex items-center gap-6"><BrandBranchLogo /><div><p className="text-xs font-bold uppercase tracking-[0.28em] text-white/45">04 / Brand Branch</p><h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight tracking-tight sm:text-6xl">Your idea deserves a name of its own.</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-white/60">Got a brand idea? We'll help you shape its identity, build its look and put it in front of the right people.</p></div></div>
          <Link to="/trophies" className="inline-flex min-h-12 items-center justify-center bg-white px-6 text-sm font-bold text-black transition hover:bg-[#e34242] hover:text-white">Explore Brand Branch <span className="ml-4">↗</span></Link>
        </div>
      </section>

      <section id="involved" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:py-28">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted">05 / Get involved</p>
        <div className="mt-4 grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-end">
          <h2 className="max-w-2xl font-display text-4xl leading-[1.02] tracking-tight sm:text-6xl">Got something in mind?<br />Let's make it happen.</h2>
          <p className="text-base leading-8 text-muted">Tell us what you're trying to achieve. We'll help you find the right service, plan the next step and bring your idea to life.</p>
        </div>

        <div className="mt-12 grid gap-8 border-t border-line pt-9 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Send us a message</p>
            <form
              className="mt-4 space-y-3"
              onSubmit={async (event) => {
                event.preventDefault();
                setSending(true);
                setEmailStatus("");
                try {
                  await sendContactEmail({ data: { name: contactName, email: contactEmail, message } });
                  setEmailStatus("Your message has been sent to EMP Exclusive.");
                  setMessage("");
                  setContactName("");
                  setContactEmail("");
                } catch (error) {
                  setEmailStatus(error instanceof Error ? error.message : "Message could not be sent. Please try WhatsApp.");
                } finally {
                  setSending(false);
                }
              }}
            >
              <input
                aria-label="Your name"
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
                placeholder="Your name"
                required
                minLength={2}
                maxLength={100}
                className="w-full border border-line bg-transparent p-4 text-sm text-fg outline-none transition placeholder:text-muted/60 focus:border-[#d94a4a]"
              />
              <input
                aria-label="Your email address"
                type="email"
                value={contactEmail}
                onChange={(event) => setContactEmail(event.target.value)}
                placeholder="Your email address"
                required
                maxLength={254}
                className="w-full border border-line bg-transparent p-4 text-sm text-fg outline-none transition placeholder:text-muted/60 focus:border-[#d94a4a]"
              />
              <label htmlFor="contact-message" className="sr-only">Your message</label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Tell us what you're thinking..."
                rows={5}
                required
                minLength={10}
                maxLength={5000}
                className="w-full resize-y border border-line bg-transparent p-4 text-sm leading-7 text-fg outline-none transition placeholder:text-muted/60 focus:border-[#d94a4a]"
              />
              <button
                type="submit"
                disabled={sending || !contactName.trim() || !contactEmail.trim() || message.trim().length < 10}
                className="inline-flex min-h-12 items-center justify-center bg-white px-6 text-sm font-bold text-black transition hover:bg-[#e34242] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {sending ? "Sending..." : "Send email"} <span className="ml-3">↗</span>
              </button>
              {emailStatus ? <p role="status" className="text-sm leading-6 text-muted">{emailStatus}</p> : null}
            </form>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={message.trim() ? whatsappUrlOne : undefined}
                target="_blank"
                rel="noreferrer"
                aria-disabled={!message.trim()}
                className={`inline-flex min-h-12 items-center justify-center px-5 text-sm font-bold transition ${message.trim() ? "bg-[#25D366] text-black hover:bg-[#1fbd5b]" : "cursor-not-allowed bg-line text-muted"}`}
                onClick={(event) => { if (!message.trim()) event.preventDefault(); }}
              >
                WhatsApp 1 <span className="ml-3">↗</span>
              </a>
              <a
                href={message.trim() ? whatsappUrlTwo : undefined}
                target="_blank"
                rel="noreferrer"
                aria-disabled={!message.trim()}
                className={`inline-flex min-h-12 items-center justify-center px-5 text-sm font-bold transition ${message.trim() ? "bg-[#25D366] text-black hover:bg-[#1fbd5b]" : "cursor-not-allowed bg-line text-muted"}`}
                onClick={(event) => { if (!message.trim()) event.preventDefault(); }}
              >
                WhatsApp 2 <span className="ml-3">↗</span>
              </a>
            </div>
            <p className="mt-3 text-xs leading-6 text-muted">WhatsApp opens with your message ready for you to review and send. Email enquiries go to empexclusive.planet@gmail.com once delivery is configured.</p>
          </div>

          <div className="flex flex-col justify-center gap-5">
            <div className="border border-line p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted">Contact line 01</p>
              <p className="mt-2 font-display text-2xl">+267 76 702 785</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href="https://wa.me/26776702785" target="_blank" rel="noreferrer" className="text-sm font-bold text-[#1eaa59] hover:underline">WhatsApp ↗</a>
                <a href="tel:+26776702785" className="text-sm font-bold text-fg hover:underline">Call ↗</a>
              </div>
            </div>
            <div className="border border-line p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted">Contact line 02</p>
              <p className="mt-2 font-display text-2xl">+267 77 506 421</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href="https://wa.me/26777506421" target="_blank" rel="noreferrer" className="text-sm font-bold text-[#1eaa59] hover:underline">WhatsApp ↗</a>
                <a href="tel:+26777506421" className="text-sm font-bold text-fg hover:underline">Call ↗</a>
              </div>
            </div>
            <div className="border border-line p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted">Operating hours</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4"><dt className="text-muted">Monday – Friday</dt><dd className="font-semibold text-fg">08:00 – 17:00</dd></div>
                <div className="flex items-center justify-between gap-4"><dt className="text-muted">Saturday</dt><dd className="font-semibold text-fg">08:00 – 18:00</dd></div>
                <div className="flex items-center justify-between gap-4"><dt className="text-muted">Sunday</dt><dd className="font-semibold text-fg">09:00 – 16:00</dd></div>
              </dl>
              <p className="mt-4 text-xs leading-5 text-muted">Botswana time (CAT). WhatsApp messages can still be sent outside these hours.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-line pt-7"><div><p className="font-display text-2xl">EMP Exclusive</p><p className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-muted">Francistown · Botswana · Building beyond borders</p><a href="mailto:empexclusive.planet@gmail.com" className="mt-3 inline-block text-sm text-muted transition hover:text-fg">empexclusive.planet@gmail.com ↗</a></div><span className="text-sm font-semibold text-muted">Open to thoughtful collaborations</span></div>
      </section>
    </main>
  );
}
