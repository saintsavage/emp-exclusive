import { useMemo, useState } from "react";
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
        ].join("\\n"),
      }),
    });
    if (!response.ok) throw new Error("Your enquiry could not be delivered. Please try WhatsApp instead.");
    return { sent: true };
  });

export const Route = createFileRoute("/services")({ component: DigitalProductsPage });

const groups = [
  {
    title: "Websites & online presence",
    note: "Build a polished digital home for your business, work or products.",
    products: [
      ["Landing page", "P1,800"], ["Starter business website", "P3,500"],
      ["Professional business website", "P6,500"], ["Portfolio website", "P2,800"],
      ["Online product catalogue", "P3,500"], ["Website redesign", "P1,500"],
      ["E-commerce website", "Request a quotation"],
    ],
  },
  {
    title: "Forms & customer connections",
    note: "Make it easier for people to enquire, apply and reach your team.",
    products: [
      ["Contact form integration", "P450"], ["Customer application system", "P900"],
      ["Email notification integration", "P750"], ["WhatsApp website integration", "P350"],
      ["Multi-form website system", "P1,500"],
    ],
  },
  {
    title: "Business email systems",
    note: "Professional email setup and reliable website communication workflows.",
    products: [
      ["Custom domain email setup", "P650"], ["Website email integration", "P850"],
      ["Automated email notifications", "P750"], ["Complete business email configuration", "P1,500"],
    ],
  },
  {
    title: "Custom platforms & business systems",
    note: "Purpose-built tools for your workflows, users and operations.",
    products: [
      ["Custom web application", "From P8,500"], ["Business portal", "From P7,500"],
      ["Admin dashboard", "From P3,500"], ["User registration and login", "From P2,500"],
      ["Custom business system", "Request a quotation"], ["Anonymous feedback platform", "P6,500"],
      ["Private admin inbox integration", "P2,000"],
    ],
  },
];

const creative = [
  ["Basic logo design", "P150"], ["Premium logo design", "P250"],
  ["Business card design", "P80"], ["Flyer / poster design", "P100"],
  ["Social media post", "P60"], ["YouTube banner", "P100"],
  ["Personal brand kit", "P300"], ["Starter business branding kit", "P450"],
  ["Complete brand identity", "P650"], ["Youth branding package", "Request a quotation"],
  ["Business cards & marketing materials", "Request a quotation"],
  ["Graphic design", "Request a quotation"],
];

const packages = [
  { name: "EMP Starter", price: "P200", items: ["Basic logo", "Business card design", "One social media design"] },
  { name: "EMP Creator", price: "P350", items: ["Logo design", "Profile branding", "Two promotional designs"] },
  { name: "EMP Business", price: "P550", items: ["Logo", "Business card", "Flyer", "Social media branding"] },
  { name: "EMP Signature", price: "P800", items: ["Complete brand identity", "Logo variations", "Colour palette and typography", "Business stationery designs", "Social media kit"] },
];

const physical = [
  { title: "Custom apparel", description: "T-shirts, hoodies, caps, jackets and uniforms.", icon: "01" },
  { title: "Phone cases & covers", description: "Personalised cases, custom designs and everyday protection.", icon: "02" },
  { title: "Personal accessories", description: "Watches, sunglasses, wallets, bracelets, jewellery and keychains.", icon: "03" },
  { title: "Tech accessories", description: "Earphones, headphones, chargers, cables, power banks and phone holders.", icon: "04" },
  { title: "Lifestyle accessories", description: "Bags, backpacks, bottles, mugs and notebooks.", icon: "05" },
  { title: "Promotional merchandise", description: "Corporate gifts, branded giveaways and event merchandise.", icon: "06" },
  { title: "Professional printing", description: "Business cards, flyers, posters, banners and brochures.", icon: "07" },
  { title: "Product sourcing & distribution", description: "We help source requested products and arrange delivery where available.", icon: "08" },
];

function DigitalProductsPage() {
  const [product, setProduct] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const allDigital = useMemo(() => groups.flatMap((group) => group.products.map(([label, price]) => ({ label, price, category: "Digital solutions", note: group.title }))), []);
  const allCreative = useMemo(() => creative.map(([label, price]) => ({ label, price, category: "Creative studio", note: "Branding, design & marketing" })), []);
  const allPhysical = useMemo(() => physical.map((item) => ({ label: item.title, price: "Request a quote", category: "Lifestyle & merchandise", note: item.description })), []);
  const catalogueItems = useMemo(() => [...allDigital, ...allCreative, ...allPhysical], [allDigital, allCreative, allPhysical]);
  const filteredItems = catalogueItems.filter((item) =>
    (activeCategory === "All" || item.category === activeCategory) &&
    (item.label + " " + item.note).toLowerCase().includes(search.toLowerCase().trim())
  );

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

  const categories = ["All", "Digital solutions", "Creative studio", "Lifestyle & merchandise"];

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_18%,rgba(195,31,43,0.24),transparent_42%),linear-gradient(135deg,#09090b_0%,#141416_55%,#080809_100%)]" />
        <div className="absolute right-[-7rem] top-16 h-80 w-80 rounded-full border border-white/10 sm:right-[-3rem] sm:h-[30rem] sm:w-[30rem]" />
        <div className="absolute right-[-3rem] top-28 h-64 w-64 rounded-full border border-[#c51e2b]/35 sm:right-8 sm:h-[22rem] sm:w-[22rem]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-20">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-white/45">The EMP Exclusive marketplace</p>
              <p className="mt-2 font-display text-2xl font-black tracking-[0.12em] sm:text-3xl">EMP <span className="text-[#d32632]">SHOP</span><span className="text-white/35">.</span></p>
            </div>
            <span className="border border-white/15 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">Browse · Enquire · Create</span>
          </div>
          <div className="mt-16 grid items-end gap-10 md:mt-24 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#f06a73]"><span className="h-px w-8 bg-[#d32632]" />Your next move starts here</p>
              <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.94] tracking-tight sm:text-7xl lg:text-8xl">Good ideas.<br /><span className="text-white/45">Better execution.</span></h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">Explore digital solutions, standout creative work and everyday products. Tell us what you need, and EMP will help you work out the right next step.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#catalogue" className="inline-flex min-h-12 items-center bg-white px-6 text-sm font-bold text-black transition hover:bg-[#d32632] hover:text-white">Explore the catalogue <span className="ml-4">↘</span></a>
                <a href="#request" className="inline-flex min-h-12 items-center border border-white/25 px-6 text-sm font-semibold transition hover:border-white hover:bg-white/10">Start an enquiry <span className="ml-3">↗</span></a>
              </div>
            </div>
            <div className="relative hidden min-h-[300px] items-end md:flex">
              <div className="absolute right-8 top-0 h-64 w-52 rotate-[-8deg] border border-white/15 bg-gradient-to-br from-white/10 to-transparent p-5 shadow-2xl">
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/45">Digital / Creative / Lifestyle</p>
                <div className="mt-10 h-24 border border-white/15 bg-black/40 p-3"><div className="h-1 w-12 bg-[#d32632]" /><div className="mt-3 h-2 w-full bg-white/70" /><div className="mt-2 h-2 w-3/4 bg-white/20" /></div>
                <p className="mt-6 font-display text-2xl">Make it<br /><span className="text-[#f06a73]">happen.</span></p>
              </div>
              <div className="absolute right-0 top-14 h-64 w-48 rotate-[7deg] border border-white/15 bg-[#151517] p-5 shadow-2xl">
                <div className="flex h-full flex-col justify-between border border-white/10 p-3">
                  <span className="text-xs font-black tracking-widest">EMP<span className="text-[#d32632]">.</span></span>
                  <div><div className="h-24 rounded-full border border-[#d32632]/50 bg-[radial-gradient(circle,rgba(211,38,50,0.24),transparent_70%)]" /><p className="mt-4 text-[9px] uppercase tracking-[0.2em] text-white/50">Your vision.<br />Our creation.</p></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-14 grid grid-cols-3 border-y border-white/10 py-4 text-[9px] font-bold uppercase tracking-[0.16em] text-white/45 sm:mt-20 sm:text-[10px] sm:tracking-[0.24em]">
            <span>01 / Digital</span><span className="text-center">02 / Creative</span><span className="text-right">03 / Merchandise</span>
          </div>
        </div>
      </section>

      <section id="catalogue" className="mx-auto max-w-7xl scroll-mt-10 px-4 py-14 sm:px-8 sm:py-20">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#e66a73]">The catalogue</p><h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">Find your next thing.</h2><p className="mt-3 max-w-xl text-sm leading-7 text-white/50">Browse by department or search for a specific service or product.</p></div>
          <div className="w-full md:max-w-sm"><label htmlFor="catalogue-search" className="sr-only">Search the catalogue</label><div className="flex items-center border border-white/15 bg-white/[0.03] px-4 focus-within:border-[#d32632]"><span className="mr-3 text-white/40">⌕</span><input id="catalogue-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products and services..." className="min-h-12 w-full bg-transparent text-sm outline-none placeholder:text-white/35" /></div></div>
        </div>
        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`shrink-0 border px-4 py-2.5 text-xs font-bold transition ${activeCategory === category ? "border-[#d32632] bg-[#d32632] text-white" : "border-white/15 text-white/55 hover:border-white/40 hover:text-white"}`}>{category}</button>)}
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item, index) => (
            <article key={item.label} className="group relative flex min-h-[205px] flex-col justify-between overflow-hidden border border-white/10 bg-[#111113] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#d32632]/70 sm:p-6">
              <div className="absolute right-[-22px] top-[-26px] h-24 w-24 rounded-full border border-white/[0.07] transition duration-500 group-hover:scale-150 group-hover:border-[#d32632]/30" />
              <div className="relative flex items-start justify-between gap-3"><span className="text-[10px] font-bold tracking-[0.2em] text-[#e66a73]">{String(index + 1).padStart(2, "0")}</span><span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/35">{item.category}</span></div>
              <div className="relative mt-7"><h3 className="font-display text-2xl leading-tight">{item.label}</h3><p className="mt-2 text-xs leading-5 text-white/40">{item.note}</p></div>
              <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4"><span className="text-sm font-semibold text-white/75">{item.price}</span><button type="button" onClick={() => request(item.label)} className="inline-flex min-h-9 items-center border border-white/20 px-3 text-[10px] font-bold uppercase tracking-[0.12em] transition hover:border-[#d32632] hover:bg-[#d32632]">Enquire <span className="ml-2">↗</span></button></div>
            </article>
          ))}
          {filteredItems.length === 0 && <div className="border border-white/10 p-8 text-sm text-white/55 sm:col-span-2 xl:col-span-3">No matches yet. Try a different search or choose another department.</div>}
        </div>
        <p className="mt-5 text-xs leading-6 text-white/35">Displayed prices are existing starting rates in Botswana pula where provided. Custom, sourced and availability-dependent items are quoted individually. No online payment is collected here.</p>
      </section>

      <section className="border-y border-white/10 bg-[#101012]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#e66a73]">Creative packages</p><h2 className="mt-3 font-display text-4xl sm:text-5xl">A strong start for your brand.</h2></div><p className="max-w-md text-sm leading-7 text-white/45">Choose a starting package or ask us to tailor a solution around your goals.</p></div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {packages.map((item, index) => <article key={item.name} className={`border p-5 sm:p-6 ${index === 3 ? "border-[#d32632]/60 bg-[#d32632]/[0.06]" : "border-white/10 bg-black/20"}`}><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Brand package / 0{index + 1}</p><h3 className="mt-4 font-display text-2xl">{item.name}</h3><p className="mt-3 font-display text-3xl text-[#f06a73]">{item.price}</p><ul className="mt-5 space-y-2 text-xs leading-5 text-white/55">{item.items.map((line) => <li key={line}>+ {line}</li>)}</ul><button type="button" onClick={() => request(item.name)} className="mt-6 min-h-10 w-full border border-white/20 px-3 text-xs font-bold transition hover:border-[#d32632] hover:bg-[#d32632]">Choose package ↗</button></article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#e66a73]">Physical products</p><h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">Bring your identity into the real world.</h2></div>
          <p className="max-w-2xl text-sm leading-7 text-white/50">Explore apparel, phone cases, tech essentials and accessories. Product availability, personalisation, sourcing and delivery are confirmed during your enquiry.</p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {physical.map((item) => <button key={item.title} type="button" onClick={() => request(item.title)} className="group min-h-[180px] border border-white/10 bg-[#111113] p-5 text-left transition hover:border-[#d32632]/70"><span className="text-[10px] font-bold tracking-[0.2em] text-[#e66a73]">{item.icon} / EMP SHOP</span><h3 className="mt-6 font-display text-xl">{item.title}</h3><p className="mt-2 text-xs leading-5 text-white/45">{item.description}</p><span className="mt-5 inline-block text-[10px] font-bold uppercase tracking-[0.12em] text-white/70 group-hover:text-white">Request a quote ↗</span></button>)}
        </div>
      </section>

      <section id="request" className="scroll-mt-8 border-t border-white/10 bg-[#111113] px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#e66a73]">Let's get it moving</p>
            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-6xl">Tell us what you need.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/55">Send your requirements and EMP will review your enquiry, then respond with availability, final pricing and next steps.</p>
            <div className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm"><p className="text-white/40">WHAT HAPPENS NEXT</p><p>01 / We receive your enquiry.</p><p>02 / We confirm scope, availability and pricing.</p><p>03 / You approve the quotation before work begins.</p></div>
            <p className="mt-6 text-xs leading-6 text-white/35">No online payment is collected through this form. Sourced products and delivery are subject to availability.</p>
          </div>
          <form onSubmit={submit} className="space-y-4 border border-white/10 bg-black/25 p-5 sm:p-8">
            <div><label htmlFor="product" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Product or service</label><select id="product" required value={product} onChange={(event) => setProduct(event.target.value)} className="min-h-12 w-full border border-white/15 bg-[#09090b] p-4 text-sm text-white outline-none focus:border-[#d32632]"><option value="">Choose a product or service</option>{catalogueItems.map((item) => <option key={item.label} value={item.label}>{item.label}</option>)}{packages.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</select></div>
            <div className="grid gap-4 sm:grid-cols-2"><input required minLength={2} maxLength={100} value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" className="min-h-12 w-full border border-white/15 bg-transparent p-4 text-sm outline-none focus:border-[#d32632]" /><input required type="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="min-h-12 w-full border border-white/15 bg-transparent p-4 text-sm outline-none focus:border-[#d32632]" /></div>
            <input required minLength={6} maxLength={40} value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="WhatsApp / phone (include country code)" className="min-h-12 w-full border border-white/15 bg-transparent p-4 text-sm outline-none focus:border-[#d32632]" />
            <textarea required minLength={10} maxLength={3000} rows={5} value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Tell us what you need, quantities, preferences, timeline or specifications..." className="w-full resize-y border border-white/15 bg-transparent p-4 text-sm leading-7 outline-none focus:border-[#d32632]" />
            <input tabIndex={-1} autoComplete="off" aria-hidden="true" value="" onChange={() => {}} name="website" className="hidden" />
            <button type="submit" disabled={sending || !product || !name.trim() || !email.trim() || !phone.trim() || details.trim().length < 10} className="inline-flex min-h-12 w-full items-center justify-center bg-white px-6 text-sm font-bold text-black transition hover:bg-[#d32632] hover:text-white disabled:cursor-not-allowed disabled:opacity-40">{sending ? "Sending enquiry..." : "Send product enquiry"} <span className="ml-3">↗</span></button>
            {status ? <p role="status" className="border border-white/10 p-4 text-sm leading-6 text-white/75">{status}</p> : null}
            <p className="text-xs leading-6 text-white/35">Submitting an enquiry doesn't create an order or require payment.</p>
          </form>
        </div>
      </section>
      <footer className="border-t border-white/10 px-4 py-8 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-display text-xl font-bold tracking-widest">EMP <span className="text-[#d32632]">SHOP</span></p><p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/35">EMP Exclusive · Francistown, Botswana</p></div><div className="flex flex-wrap gap-4 text-xs text-white/50"><a href="https://empexclusive.company" className="hover:text-white">empexclusive.company ↗</a><a href="https://www.tiktok.com/@emp_exclusive" className="hover:text-white">@emp_exclusive ↗</a><a href="https://wa.me/26776702785" className="hover:text-white">WhatsApp ↗</a></div></div><p className="mx-auto mt-6 max-w-7xl text-[10px] uppercase tracking-[0.22em] text-white/25">Your vision. Our creation.</p></footer>
    </main>
  );
}
