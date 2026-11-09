import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const enquirySchema = z.object({
  product: z.string().trim().min(2).max(180),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(6).max(40),
  details: z.string().trim().min(10).max(3000),
  website: z.string().max(0).optional(),
});

const sendProductEnquiry = createServerFn({ method: "POST" })
  .inputValidator(enquirySchema)
  .handler(async ({ data }) => {
    if (data.website) throw new Error("Your enquiry could not be submitted.");
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;
    if (!apiKey || !fromEmail) throw new Error("Email enquiries are temporarily unavailable. Please contact EMP on WhatsApp.");
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `EMP Exclusive Website <${fromEmail}>`,
        to: ["empexclusive.planet@gmail.com"],
        reply_to: data.email,
        subject: `Product enquiry · ${data.product}`,
        text: [
          "NEW EMP EXCLUSIVE PRODUCT ENQUIRY",
          "",
          `Product / service: ${data.product}`,
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          `WhatsApp / phone: ${data.phone}`,
          "",
          "Requirements:",
          data.details,
          "",
          "Please reply with availability, final pricing and next steps. No payment was collected through this form.",
        ].join("\n"),
      }),
    });
    if (!response.ok) throw new Error("Your enquiry could not be delivered. Please try WhatsApp instead.");
    return { sent: true };
  });

export const Route = createFileRoute("/services")({ component: DigitalProductsPage });

const groups = [
  {
    title: "Website development",
    note: "Business websites and responsive online experiences.",
    products: [
      ["Landing page", "P1,800"],
      ["Starter business website", "P3,500"],
      ["Professional business website", "P6,500"],
      ["Portfolio website", "P2,800"],
      ["Online product catalogue", "P3,500"],
      ["Website redesign", "P1,500"],
    ],
  },
  {
    title: "Forms and integrations",
    note: "Help customers contact you, apply and send useful information.",
    products: [
      ["Contact form integration", "P450"],
      ["Customer application system", "P900"],
      ["Email notification integration", "P750"],
      ["WhatsApp website integration", "P350"],
      ["Multi-form website system", "P1,500"],
    ],
  },
  {
    title: "Business email systems",
    note: "Custom-domain sending and website email workflows.",
    products: [
      ["Custom domain email setup", "P650"],
      ["Website email integration", "P850"],
      ["Automated email notifications", "P750"],
      ["Complete business email configuration", "P1,500"],
    ],
  },
  {
    title: "Anonymous messaging platforms",
    note: "Submission pages and private administration workflows.",
    products: [
      ["Basic anonymous submission website", "P4,500"],
      ["Anonymous feedback platform", "P6,500"],
      ["Private admin inbox integration", "P2,000"],
    ],
  },
  {
    title: "Digital storefronts",
    note: "Show products online and collect customer requests without online checkout.",
    products: [
      ["Basic digital catalogue", "P2,500"],
      ["Business product catalogue", "P3,500"],
      ["Product enquiry system", "P1,200"],
      ["Custom quotation request system", "P1,800"],
    ],
  },
  {
    title: "Custom digital solutions",
    note: "Larger builds are scoped around the features and integrations required.",
    products: [
      ["Custom web application", "From P8,500"],
      ["Business portal", "From P7,500"],
      ["Admin dashboard", "From P3,500"],
      ["User registration and login", "From P2,500"],
      ["Custom business system", "Request a quotation"],
    ],
  },
];

const branding = [
  ["Basic logo design", "P150"],
  ["Premium logo design", "P250"],
  ["Business card design", "P80"],
  ["Flyer / poster design", "P100"],
  ["Social media post", "P60"],
  ["YouTube banner", "P100"],
  ["Personal brand kit", "P300"],
  ["Starter business branding kit", "P450"],
  ["Complete brand identity", "P650"],
];

const packages = [
  { name: "EMP Starter", price: "P200", items: ["Basic logo", "Business card design", "One social media design"] },
  { name: "EMP Creator", price: "P350", items: ["Logo design", "Profile branding", "Two promotional designs"] },
  { name: "EMP Business", price: "P550", items: ["Logo", "Business card", "Flyer", "Social media branding"] },
  { name: "EMP Signature", price: "P800", items: ["Complete brand identity", "Logo variations", "Colour palette and typography", "Business stationery designs", "Social media kit"] },
];

const merchandise = ["Business cards", "T-shirts and hoodies", "Caps and uniforms", "Mugs and promotional items", "Pens and notebooks", "Stickers and labels", "Product packaging", "Shop signage and vehicle branding"];

function DigitalProductsPage() {
  const [product, setProduct] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const request = (item: string) => {
    setProduct(item);
    setStatus("");
    document.getElementById("request")?.scrollIntoView({ behavior: "smooth" });
  };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setStatus("");
    try {
      await sendProductEnquiry({ data: { product, name, email, phone, details } });
      setStatus("Your enquiry has been sent to EMP Exclusive. We'll review your requirements and contact you with pricing and next steps.");
      setName("");
      setEmail("");
      setPhone("");
      setDetails("");
      setProduct("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Your enquiry could not be sent. Please try WhatsApp.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="bg-[#09090b] text-white">
      <section className="border-b border-white/10 px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#e66a6a]">EMP EXCLUSIVE · Make your next move count</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">Get noticed.<br /><span className="text-white/45">Work smarter. Grow.</span></h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-white/65">Need a stronger brand, a website customers can find, or tools that save you time? Choose what you need and we'll help make it happen.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#digital" className="inline-flex min-h-12 items-center bg-white px-5 text-sm font-bold text-black hover:bg-[#e34242] hover:text-white">Explore digital solutions</a>
            <a href="#branding" className="inline-flex min-h-12 items-center border border-white/25 px-5 text-sm font-bold text-white hover:bg-white/10">Explore branding</a>
          </div>
          <p className="mt-8 text-xs leading-6 text-white/40">Prices are starting rates in Botswana pula (BWP). Final pricing depends on requirements. No online payment is taken on this page.</p>
        </div>
      </section>

      <section id="digital" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:py-24">
        <div className="mb-10"><p className="text-xs font-bold uppercase tracking-[0.25em] text-white/40">01 / Digital solutions</p><h2 className="mt-3 font-display text-4xl sm:text-5xl">Less busywork. More progress.</h2></div>
        <div className="grid gap-5 md:grid-cols-2">
          {groups.map((group) => (
            <article key={group.title} className="border border-white/10 bg-white/[0.025] p-6 sm:p-7">
              <h3 className="font-display text-2xl sm:text-3xl">{group.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/50">{group.note}</p>
              <div className="mt-6 divide-y divide-white/10">
                {group.products.map(([label, price]) => (
                  <div key={label} className="flex items-center justify-between gap-4 py-3">
                    <div><p className="text-sm font-medium">{label}</p><p className="mt-1 text-xs text-white/45">{price}</p></div>
                    <button type="button" onClick={() => request(label)} className="shrink-0 border border-white/20 px-3 py-2 text-xs font-bold hover:border-[#e34242] hover:bg-[#e34242]">Request ↗</button>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="branding" className="border-y border-white/10 bg-[#111113] px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#e66a6a]">02 / Branding & design</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">Look like the business you're building.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">Give people a reason to remember your business. We create logos and consistent brand identities that help you look professional wherever customers find you.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {branding.map(([label, price]) => (
              <button key={label} type="button" onClick={() => request(label)} className="flex items-center justify-between gap-3 border border-white/10 bg-black/20 p-4 text-left hover:border-[#e34242]">
                <span className="text-sm">{label}</span><span className="text-sm font-semibold text-white/70">{price}</span>
              </button>
            ))}
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {packages.map((item) => (
              <article key={item.name} className="border border-white/10 p-6">
                <div className="flex items-center justify-between gap-3"><h3 className="font-display text-2xl">{item.name}</h3><span className="text-xl font-semibold text-[#e66a6a]">{item.price}</span></div>
                <ul className="mt-5 space-y-2 text-sm text-white/60">{item.items.map((line) => <li key={line}>• {line}</li>)}</ul>
                <button type="button" onClick={() => request(item.name)} className="mt-6 border border-white/20 px-4 py-2 text-xs font-bold hover:border-[#e34242] hover:bg-[#e34242]">Request this package ↗</button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/40">03 / Physical branding</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">Take your brand beyond the screen.</h2>
            <p className="mt-4 text-sm leading-7 text-white/55">Put your name on the things customers see, carry and use. We prepare the designs and can coordinate production where available. Ask us for a quote.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {merchandise.map((item) => <button key={item} type="button" onClick={() => request(item)} className="border border-white/10 bg-white/[0.025] p-4 text-left text-sm hover:border-[#e34242]">{item}<span className="mt-2 block text-xs text-white/40">Request a quote ↗</span></button>)}
          </div>
        </div>
      </section>

      <section id="request" className="scroll-mt-20 border-t border-white/10 bg-[#111113] px-4 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#e66a6a]">04 / Start a request</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">Tell us what you need.</h2>
            <p className="mt-5 text-sm leading-7 text-white/55">Choose a product and send us your requirements. EMP will review your enquiry and contact you on WhatsApp or email with the final price, availability and delivery details.</p>
            <p className="mt-5 text-xs leading-6 text-white/35">Submitting this form does not create an order or require payment. Work starts only after you approve the quotation and agreed terms.</p>
          </div>
          <form onSubmit={submit} className="space-y-4 border border-white/10 bg-black/25 p-5 sm:p-7">
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Product or service</label>
            <select required value={product} onChange={(event) => setProduct(event.target.value)} className="w-full border border-white/15 bg-[#09090b] p-4 text-sm text-white outline-none focus:border-[#e34242]">
              <option value="">Choose a product or service</option>
              {[...groups.flatMap((group) => group.products.map(([label]) => label)), ...branding.map(([label]) => label), ...packages.map((item) => item.name), ...merchandise].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <input required minLength={2} maxLength={100} value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" className="w-full border border-white/15 bg-transparent p-4 text-sm outline-none focus:border-[#e34242]" />
            <input required type="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" className="w-full border border-white/15 bg-transparent p-4 text-sm outline-none focus:border-[#e34242]" />
            <input required minLength={6} maxLength={40} value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="WhatsApp / phone number (include country code)" className="w-full border border-white/15 bg-transparent p-4 text-sm outline-none focus:border-[#e34242]" />
            <textarea required minLength={10} maxLength={3000} rows={5} value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Tell us what you need, quantities, preferred timeline or any specific features..." className="w-full resize-y border border-white/15 bg-transparent p-4 text-sm leading-7 outline-none focus:border-[#e34242]" />
            <input tabIndex={-1} autoComplete="off" aria-hidden="true" value="" onChange={() => {}} name="website" className="hidden" />
            <button type="submit" disabled={sending || !product || !name.trim() || !email.trim() || !phone.trim() || details.trim().length < 10} className="inline-flex min-h-12 w-full items-center justify-center bg-white px-6 text-sm font-bold text-black hover:bg-[#e34242] hover:text-white disabled:cursor-not-allowed disabled:opacity-40">{sending ? "Sending enquiry..." : "Send product enquiry ↗"}</button>
            {status ? <p role="status" className="border border-white/10 p-4 text-sm leading-6 text-white/75">{status}</p> : null}
            <p className="text-xs leading-6 text-white/35">No online payment. You'll receive a quotation before confirming any work.</p>
          </form>
        </div>
      </section>
    </main>
  );
}
