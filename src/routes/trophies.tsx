import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const applicationSchema = z.object({
  brandName: z.string().trim().min(2).max(100),
  purpose: z.string().trim().min(10).max(2500),
  inspiration: z.string().max(2500),
  industry: z.string().min(1).max(100),
  otherIndustry: z.string().max(120),
  audience: z.string().trim().min(5).max(1500),
  difference: z.string().max(1500),
  ambition: z.string().max(1500),
  timeline: z.string().max(100),
  personality: z.array(z.string().max(100)).max(12),
  otherPersonality: z.string().max(120),
  colours: z.array(z.string().max(80)).max(12),
  customColours: z.string().max(300),
  deliverables: z.array(z.string().max(120)).min(1).max(40),
  otherDeliverable: z.string().max(250),
  delivery: z.array(z.string().max(120)).max(8),
  businessCardDetails: z.string().max(1200),
  socialPlatforms: z.string().max(600),
  packagingDetails: z.string().max(1200),
  extra: z.string().max(3000),
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(40),
  email: z.string().trim().email().max(254),
  website: z.string().max(0).optional(),
  attachments: z.array(z.object({
    filename: z.string().max(120),
    content: z.string().max(3000000),
    contentType: z.enum(["image/png", "image/jpeg", "application/pdf"]),
  })).max(3),
});

const sendBrandApplication = createServerFn({ method: "POST" })
  .inputValidator(applicationSchema)
  .handler(async ({ data }) => {
    if (data.website) throw new Error("Application could not be submitted.");
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;
    if (!apiKey || !fromEmail) {
      throw new Error("Applications are not accepting email submissions yet. Please contact EMP on WhatsApp while delivery is being configured.");
    }
    const attachmentBytes = data.attachments.reduce((sum, item) => sum + item.content.length, 0);
    if (attachmentBytes > 6000000) throw new Error("Please reduce the total attachment size and try again.");

    const lines = [
      "NEW BRAND BRANCH APPLICATION",
      "",
      `Brand name: ${data.brandName}`,
      `What it represents: ${data.purpose}`,
      `Inspiration: ${data.inspiration || "Not provided"}`,
      `Industry: ${data.industry}${data.otherIndustry ? ` / ${data.otherIndustry}` : ""}`,
      `Target audience: ${data.audience}`,
      `What makes it different: ${data.difference || "Not provided"}`,
      `Long-term ambition: ${data.ambition || "Not provided"}`,
      `Preferred timeline: ${data.timeline || "Not specified"}`,
      `Personality: ${data.personality.join(", ") || "Not provided"}${data.otherPersonality ? ` / ${data.otherPersonality}` : ""}`,
      `Colours: ${data.colours.join(", ") || "Not provided"}${data.customColours ? ` / ${data.customColours}` : ""}`,
      "",
      "END PRODUCTS / DELIVERABLES",
      ...data.deliverables.map((item) => `- ${item}`),
      data.otherDeliverable ? `Other: ${data.otherDeliverable}` : "",
      `Delivery preference: ${data.delivery.join(", ") || "Would like a recommendation"}`,
      `Business card details: ${data.businessCardDetails || "Not applicable"}`,
      `Social platforms: ${data.socialPlatforms || "Not applicable"}`,
      `Packaging details: ${data.packagingDetails || "Not applicable"}`,
      "",
      `Additional information: ${data.extra || "Not provided"}`,
      "",
      "CONTACT DETAILS",
      `Full name: ${data.fullName}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email}`,
      "",
      `Attachments: ${data.attachments.map((item) => item.filename).join(", ") || "None"}`,
      "",
      "This application is subject to review. Design and physical production are assessed separately.",
    ].filter(Boolean);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `EMP Exclusive Website <${fromEmail}>`,
        to: ["empexclusive.planet@gmail.com"],
        reply_to: data.email,
        subject: `Brand Branch application · ${data.brandName}`,
        text: lines.join("\n"),
        attachments: data.attachments.map((item) => ({
          filename: item.filename,
          content: item.content,
          content_type: item.contentType,
        })),
      }),
    });
    if (!response.ok) throw new Error("Your application could not be delivered. Please try WhatsApp instead.");
    return { sent: true };
  });

export const Route = createFileRoute("/trophies")({ component: BrandBranchPage });

function BrandBranchMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={"inline-flex items-center gap-3 " + (compact ? "gap-2" : "")} aria-label="Brand Branch logo">
      <svg viewBox="0 0 88 88" role="img" aria-label="BB monogram" className={compact ? "h-10 w-10 shrink-0" : "h-16 w-16 shrink-0 sm:h-20 sm:w-20"}>
        <rect x="2" y="2" width="84" height="84" rx="12" fill="#09090b" stroke="#f4f4f0" strokeWidth="2"/>
        <path d="M18 17h22c13 0 20 6 20 17 0 7-4 12-10 14 8 2 13 7 13 16 0 12-9 19-23 19H18V17Zm14 13v14h8c5 0 8-2 8-7s-3-7-8-7h-8Zm0 26v15h9c6 0 9-3 9-8s-3-7-9-7h-9Z" fill="#f4f4f0"/>
        <path d="M58 18h12v52H58z" fill="#e34242"/>
        <path d="M55 16h18v5H55z" fill="#e34242"/>
      </svg>
      <span className="leading-none"><span className="block font-display text-sm font-bold tracking-[0.24em] text-white">BRAND</span><span className="mt-1 block font-display text-sm font-bold tracking-[0.24em] text-white">BRANCH<span className="text-[#e34242]">.</span></span></span>
    </div>
  );
}

const stages = [
  ["01", "Find your thing", "Start with what you care about: fashion, art, music, gaming, sport, tech or an idea nobody around you has tried yet."],
  ["02", "Build the identity", "Shape a name, a look, a voice and a reason for people to connect with your brand."],
  ["03", "Make it tangible", "Turn the concept into designs, content, products or a community people can actually experience."],
  ["04", "Put it out there", "Prepare a launch, learn from the response and keep improving with the right support around you."],
];

const deliverableGroups = [
  { title: "Brand identity", options: ["Brand name development", "Logo design", "Complete brand identity", "Full brand package", "Brand guidelines", "Slogan / tagline", "Typography and colour system"] },
  { title: "Business stationery", options: ["Business cards", "Letterheads", "Email signatures", "Invoices and quotation templates", "Company profiles"] },
  { title: "Marketing materials", options: ["Flyers", "Posters", "Brochures", "Banners", "Digital advertisements", "Presentation designs"] },
  { title: "Digital presence", options: ["Social media profile branding", "Social media post templates", "Website design", "Landing page", "App interface design"] },
  { title: "Products and merchandise", options: ["T-shirt and clothing designs", "Caps and hoodies", "Mugs and promotional items", "Stickers and labels", "Product packaging"] },
  { title: "Physical branding", options: ["Shop signage", "Vehicle branding", "Uniforms", "Event displays", "Display stands", "Other"] },
];

type Step = { id: string; title: string; hint?: string; kind: "text" | "textarea" | "single" | "multi" | "deliverables" | "files"; required?: boolean; options?: string[] };

const baseSteps: Step[] = [
  { id: "brandName", title: "What is your brand called?", hint: "A draft name is fine.", kind: "text", required: true },
  { id: "purpose", title: "What's the idea behind it?", hint: "A few sentences are enough.", kind: "textarea", required: true },
  { id: "inspiration", title: "What inspired you?", kind: "textarea" },
  { id: "industry", title: "What kind of brand is it?", kind: "single", required: true, options: ["Fashion", "Technology", "Entertainment", "Beauty", "Lifestyle", "Business", "Art and design", "Food", "Sport", "Other"] },
  { id: "audience", title: "Who is it for?", hint: "Describe your ideal customers or community.", kind: "textarea", required: true },
  { id: "difference", title: "What makes it special?", kind: "textarea" },
  { id: "ambition", title: "What's your big goal for it?", kind: "textarea" },
  { id: "timeline", title: "When do you want to start?", kind: "single", options: ["As soon as possible", "Within a month", "No rush", "Not sure yet"] },
  { id: "personality", title: "Choose your brand's style", hint: "Select all that fit.", kind: "multi", options: ["Luxury", "Streetwear", "Minimalist", "Futuristic", "Corporate", "Creative", "Sporty", "Elegant", "Playful", "Bold", "Other"] },
  { id: "colours", title: "Choose your colours", hint: "Select a palette or choose Other.", kind: "multi", options: ["Black and white", "Red and black", "Blue and silver", "Earth tones", "Pastels", "Monochrome", "Bright colours", "Other"] },
  { id: "deliverables", title: "What do you need made?", hint: "Pick everything you need.", kind: "deliverables", required: true },
  { id: "delivery", title: "How should we deliver it?", hint: "Choose all that apply.", kind: "multi", options: ["Digital files", "Print-ready files", "Printed products", "Help with production", "Not sure, advise me"] },
];

const contactSteps: Step[] = [
  { id: "extra", title: "Anything else to add?", hint: "Share any extra details or links.", kind: "textarea" },
  { id: "files", title: "Add reference files (optional)", hint: "Up to 3 images or PDFs, 2 MB each.", kind: "files" },
  { id: "fullName", title: "Your name", kind: "text", required: true },
  { id: "phone", title: "Your phone number", hint: "Include your country code.", kind: "text", required: true },
  { id: "email", title: "Your email address", kind: "text", required: true },
];

const initialAnswers: Record<string, string | string[]> = {
  brandName: "", purpose: "", inspiration: "", industry: "", otherIndustry: "",
  audience: "", difference: "", ambition: "", timeline: "", personality: [], otherPersonality: "",
  colours: [], customColours: "", deliverables: [], otherDeliverable: "",
  delivery: [], businessCardDetails: "", socialPlatforms: "", packagingDetails: "",
  extra: "", fullName: "", phone: "", email: "",
};

function BrandBranchPage() {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(initialAnswers);
  const [attachments, setAttachments] = useState<{ filename: string; content: string; contentType: "image/png" | "image/jpeg" | "application/pdf" }[]>([]);
  const [fileError, setFileError] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [review, setReview] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selected = (answers.deliverables as string[]) || [];
  const steps = useMemo(() => {
    const conditional: Step[] = [];
    if (selected.includes("Business cards")) conditional.push({ id: "businessCardDetails", title: "Business card details", hint: "How many cards, and do you need printing too?", kind: "textarea" });
    if (selected.includes("Social media profile branding") || selected.includes("Social media post templates")) conditional.push({ id: "socialPlatforms", title: "Which social apps?", hint: "E.g. Instagram, TikTok or Facebook.", kind: "text" });
    if (selected.includes("Product packaging")) conditional.push({ id: "packagingDetails", title: "What needs packaging?", hint: "Tell us the product and any size or material ideas.", kind: "textarea"});
    return [...baseSteps, ...conditional, ...contactSteps];
  }, [selected.join("|")]);
  const current = steps[Math.min(stepIndex, steps.length - 1)];
  const progress = review ? 100 : Math.round(((stepIndex + 1) / steps.length) * 100);
  const update = (id: string, value: string | string[]) => setAnswers((previous) => ({ ...previous, [id]: value }));
  const value = answers[current.id] ?? "";
  const isFilled = Array.isArray(value) ? value.length > 0 : String(value).trim().length > 0;
  const canContinue = !current.required || isFilled;

  const toggle = (id: string, option: string) => {
    const existing = (answers[id] as string[]) || [];
    update(id, existing.includes(option) ? existing.filter((item) => item !== option) : [...existing, option]);
  };

  const handleFiles = async (list: FileList | null) => {
    setFileError("");
    if (!list) return;
    const allowed = ["image/png", "image/jpeg", "application/pdf"];
    const next = [...attachments];
    for (const file of Array.from(list)) {
      if (next.length >= 3) { setFileError("You can attach up to 3 files."); break; }
      if (!allowed.includes(file.type)) { setFileError("Only PNG, JPG and PDF files are supported."); continue; }
      if (file.size > 2 * 1024 * 1024) { setFileError("Each file must be 2 MB or smaller."); continue; }
      if (next.reduce((sum, item) => sum + item.content.length, 0) + file.size * 1.4 > 6000000) { setFileError("Your attachments are too large. Please choose smaller files."); break; }
      const content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
        reader.onerror = () => reject(new Error("A file could not be read."));
        reader.readAsDataURL(file);
      });
      next.push({ filename: file.name, content, contentType: file.type as "image/png" | "image/jpeg" | "application/pdf" });
    }
    setAttachments(next);
  };

  const submit = async () => {
    setSending(true);
    setSubmitError("");
    try {
      await sendBrandApplication({ data: {
        brandName: String(answers.brandName || ""),
        purpose: String(answers.purpose || ""),
        inspiration: String(answers.inspiration || ""),
        industry: String(answers.industry || ""),
        otherIndustry: String(answers.otherIndustry || ""),
        audience: String(answers.audience || ""),
        difference: String(answers.difference || ""),
        ambition: String(answers.ambition || ""),
        timeline: String(answers.timeline || ""),
        personality: (answers.personality as string[]) || [],
        otherPersonality: String(answers.otherPersonality || ""),
        colours: (answers.colours as string[]) || [],
        customColours: String(answers.customColours || ""),
        deliverables: selected,
        otherDeliverable: String(answers.otherDeliverable || ""),
        delivery: (answers.delivery as string[]) || [],
        businessCardDetails: String(answers.businessCardDetails || ""),
        socialPlatforms: String(answers.socialPlatforms || ""),
        packagingDetails: String(answers.packagingDetails || ""),
        extra: String(answers.extra || ""),
        fullName: String(answers.fullName || ""),
        phone: String(answers.phone || ""),
        email: String(answers.email || ""),
        website: "",
        attachments,
      } });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We couldn't submit your application. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (submitted) return (
    <main className="min-h-[75vh] bg-[#09090b] px-4 py-24 text-white">
      <div className="mx-auto max-w-2xl border border-white/15 p-8 text-center sm:p-14">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#e66a6a]">Brand Branch · Application received</p>
        <h1 className="mt-5 font-display text-5xl sm:text-7xl">Your idea is in.</h1>
        <p className="mt-5 text-sm leading-7 text-white/65">Your application was delivered to EMP Exclusive. Our team will review the details and contact you using the phone number you provided.</p>
        <p className="mt-4 text-xs leading-6 text-white/40">Submission does not guarantee acceptance or physical production. We'll confirm the scope and next steps with you.</p>
        <a href="/" className="mt-8 inline-flex min-h-12 items-center bg-white px-6 text-sm font-bold text-black">Return to EMP Exclusive ↗</a>
      </div>
    </main>
  );

  return (
    <main className="bg-bg">
      <section className="relative isolate overflow-hidden bg-[#09090b] px-4 pb-20 pt-24 text-white sm:pb-28 sm:pt-32">
        <div className="absolute -right-24 top-8 size-80 rounded-full border border-white/10 sm:size-[34rem]" />
        <div className="absolute -right-12 top-20 size-56 rounded-full border border-[#e34242]/45 sm:size-[26rem]" />
        <div className="absolute bottom-0 left-0 h-1 w-2/3 bg-gradient-to-r from-[#e34242] via-white/50 to-transparent" />
        <div className="relative mx-auto max-w-6xl">
          <BrandBranchMark />
          <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">EMP Exclusive · The youth brand house</p>
          <p className="mt-12 text-xs font-bold uppercase tracking-[0.28em] text-[#e66a6a]">For the next generation of founders</p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl leading-[0.88] tracking-tight sm:text-8xl md:text-9xl">Don't just wear<br /><span className="text-white/40">a brand.</span><br />Build one.</h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">Brand Branch is a creative launchpad for ambitious people with ideas of their own. Bring your style, your interests and your big plans. We'll help shape the direction and the identity.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#application" className="inline-flex min-h-12 items-center bg-white px-6 text-sm font-bold text-black transition hover:bg-[#e34242] hover:text-white">JOIN BRAND BRANCH <span className="ml-4">↘</span></a>
            <a href="#brand-lab" className="inline-flex min-h-12 items-center border border-white/35 px-6 text-sm font-semibold text-white transition hover:bg-white/10">Explore the brand lab</a>
          </div>
          <div className="mt-16 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/20 pt-5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/45 sm:text-[10px]"><span>Ideas welcome</span><span>Culture first</span><span>Built together</span></div>
        </div>
      </section>

      <section id="brand-lab" className="scroll-mt-20 px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-end">
            <div><p className="text-xs font-bold uppercase tracking-[0.28em] text-muted">01 / The brand lab</p><h2 className="mt-4 max-w-lg font-display text-4xl leading-[1.02] tracking-tight sm:text-6xl">Your ambition.<br />Your own identity.</h2></div>
            <p className="max-w-2xl text-base leading-8 text-muted">Not everybody wants to be an influencer. Some want to design clothes, start a label, build a creative crew, launch a product or turn a personal obsession into a business. This is a place to explore those possibilities without needing everything figured out on day one.</p>
          </div>
          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Fashion & streetwear", "Original clothing, accessories and style-led labels."],
              ["02", "Art & design", "Graphics, illustration, photography and visual culture."],
              ["03", "Music & culture", "Creative collectives, sound, events and communities."],
              ["04", "Ideas & innovation", "Products, digital concepts and unexpected ventures."],
            ].map(([n, title, body]) => <article key={n} className="group border border-line bg-surface p-6 transition hover:-translate-y-1 hover:border-[#d94a4a]/60"><p className="font-display text-3xl text-muted">{n}</p><h3 className="mt-8 font-display text-2xl leading-tight">{title}</h3><p className="mt-3 text-sm leading-7 text-muted">{body}</p><div className="mt-7 h-px w-10 bg-[#d94a4a] transition-all group-hover:w-full" /></article>)}
          </div>
        </div>
      </section>

      <section className="bg-[#101012] px-4 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/45">02 / From idea to identity</p>
          <div className="mt-4 grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
            <h2 className="font-display text-4xl leading-[1.02] tracking-tight sm:text-6xl">Every big brand<br />started somewhere.</h2>
            <div className="grid gap-0 sm:grid-cols-2">{stages.map(([n, title, body]) => <article key={n} className="border-t border-white/15 py-6 sm:px-6 sm:first:pl-0"><p className="text-xs font-bold tracking-[0.2em] text-[#e66a6a]">{n}</p><h3 className="mt-4 font-display text-2xl">{title}</h3><p className="mt-3 text-sm leading-7 text-white/55">{body}</p></article>)}</div>
          </div>
        </div>
      </section>

      <section id="application" className="scroll-mt-20 bg-[#09090b] px-4 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#e66a6a]">03 / Join Brand Branch</p>
            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-6xl">Let's build your idea.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">Short questions, one at a time. Answer what you can.</p>
          </div>
          <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-white/45"><span>{review ? "Final review" : `Question ${stepIndex + 1} of ${steps.length}`}</span><span>{progress}%</span></div>
          <div className="mb-8 h-1 overflow-hidden bg-white/10"><div className="h-full bg-[#e34242] transition-all duration-500" style={{ width: `${progress}%` }} /></div>

          {!review ? (
            <article key={current.id} className="animate-[brand-card-in_.45s_cubic-bezier(.16,1,.3,1)_both] border border-white/15 bg-[#111113] p-5 sm:p-10">
              <div className="mb-6 flex items-center justify-between gap-4"><BrandBranchMark compact /><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#e66a6a]">Application</p></div>
              <h3 className="mt-5 max-w-2xl font-display text-3xl leading-tight sm:text-5xl">{current.title}</h3>
              {current.hint ? <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">{current.hint}</p> : null}
              <div className="mt-8">
                {current.kind === "text" ? <input autoComplete="off" value={String(value)} onChange={(event) => update(current.id, event.target.value)} placeholder="Type your answer..." className="w-full border border-white/20 bg-black/30 p-4 text-base text-white outline-none placeholder:text-white/30 focus:border-[#e34242]" /> : null}
                {current.kind === "textarea" ? <textarea value={String(value)} onChange={(event) => update(current.id, event.target.value)} rows={5} placeholder="Write your answer..." className="w-full resize-y border border-white/20 bg-black/30 p-4 text-base leading-7 text-white outline-none placeholder:text-white/30 focus:border-[#e34242]" /> : null}
                {current.kind === "single" ? <div className="grid gap-2 sm:grid-cols-2">{current.options?.map((option) => <button key={option} type="button" onClick={() => update(current.id, option)} className={`min-h-12 border px-4 text-left text-sm transition ${value === option ? "border-[#e34242] bg-[#e34242]/15 text-white" : "border-white/15 text-white/65 hover:border-white/40"}`}>{option}</button>)}</div> : null}
                {current.kind === "multi" ? <div className="grid gap-2 sm:grid-cols-2">{current.options?.map((option) => { const active = ((value as string[]) || []).includes(option); return <button key={option} type="button" onClick={() => toggle(current.id, option)} className={`min-h-12 border px-4 text-left text-sm transition ${active ? "border-[#e34242] bg-[#e34242]/15 text-white" : "border-white/15 text-white/65 hover:border-white/40"}`}>{active ? "✓  " : "+  "}{option}</button>; })}</div> : null}
                {current.kind === "deliverables" ? <div className="space-y-6">{deliverableGroups.map((group) => <div key={group.title}><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">{group.title}</p><div className="grid gap-2 sm:grid-cols-2">{group.options.map((option) => { const active = selected.includes(option); return <button key={option} type="button" onClick={() => toggle("deliverables", option)} className={`min-h-11 border px-3 text-left text-sm transition ${active ? "border-[#e34242] bg-[#e34242]/15 text-white" : "border-white/15 text-white/65 hover:border-white/40"}`}>{active ? "✓  " : "+  "}{option}</button>; })}</div></div>)}<p className="text-xs text-white/40">{selected.length} deliverable{selected.length === 1 ? "" : "s"} selected</p></div> : null}
                {current.kind === "files" ? <div><input type="file" multiple accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf" onChange={(event) => { void handleFiles(event.target.files); event.currentTarget.value = ""; }} className="block w-full text-sm text-white/65 file:mr-4 file:min-h-11 file:border-0 file:bg-white file:px-4 file:font-bold file:text-black" />{attachments.length ? <ul className="mt-4 space-y-2">{attachments.map((file) => <li key={file.filename} className="flex items-center justify-between gap-3 text-xs text-white/65"><span>{file.filename}</span><button type="button" onClick={() => setAttachments((old) => old.filter((item) => item.filename !== file.filename))} className="text-[#f18b8b]">Remove</button></li>)}</ul> : <p className="mt-3 text-xs text-white/35">No files attached.</p>}{fileError ? <p role="alert" className="mt-3 text-sm text-[#ff9c9c]">{fileError}</p> : null}</div> : null}
                {current.id === "industry" && value === "Other" ? <input value={String(answers.otherIndustry || "")} onChange={(event) => update("otherIndustry", event.target.value)} placeholder="Tell us the industry..." className="mt-4 w-full border border-white/20 bg-black/30 p-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#e34242]" /> : null}
                {current.id === "personality" && ((value as string[]) || []).includes("Other") ? <input value={String(answers.otherPersonality || "")} onChange={(event) => update("otherPersonality", event.target.value)} placeholder="Describe the personality..." className="mt-4 w-full border border-white/20 bg-black/30 p-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#e34242]" /> : null}
                {current.id === "colours" && ((value as string[]) || []).includes("Other") ? <input value={String(answers.customColours || "")} onChange={(event) => update("customColours", event.target.value)} placeholder="Describe your colours..." className="mt-4 w-full border border-white/20 bg-black/30 p-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#e34242]" /> : null}
                {current.id === "deliverables" && selected.includes("Other") ? <input value={String(answers.otherDeliverable || "")} onChange={(event) => update("otherDeliverable", event.target.value)} placeholder="What else should we create?" className="mt-4 w-full border border-white/20 bg-black/30 p-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#e34242]" /> : null}
                {current.id === "phone" ? <p className="mt-3 text-xs text-white/40">We need this number to contact you about your application.</p> : null}
                {current.id === "email" ? <p className="mt-3 text-xs text-white/40">We'll use this address if we need to send you a written update.</p> : null}
              </div>
              <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
                <button type="button" onClick={() => stepIndex === 0 ? document.getElementById("brand-lab")?.scrollIntoView({ behavior: "smooth" }) : setStepIndex((index) => Math.max(0, index - 1))} className="min-h-11 px-3 text-sm text-white/55 hover:text-white">{stepIndex === 0 ? "Back" : "Previous"}</button>
                <button type="button" disabled={!canContinue} onClick={() => { if (stepIndex === steps.length - 1) setReview(true); else setStepIndex((index) => Math.min(steps.length - 1, index + 1)); }} className="min-h-12 bg-white px-7 text-sm font-bold text-black transition hover:bg-[#e34242] hover:text-white disabled:cursor-not-allowed disabled:opacity-30">{stepIndex === steps.length - 1 ? "Review application" : "Next question"} <span className="ml-3">↗</span></button>
              </div>
            </article>
          ) : (
            <article className="border border-white/15 bg-[#111113] p-5 sm:p-10">
              <div className="mb-6 flex items-center justify-between gap-4"><BrandBranchMark compact /><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#e66a6a]">Final check</p></div>
              <h3 className="mt-4 font-display text-4xl sm:text-5xl">Your application.</h3>
              <p className="mt-3 text-sm leading-6 text-white/50">Review your answers. You can go back and change anything before submitting.</p>
              <div className="mt-7 space-y-5">{[
                ["Brand concept", ["brandName", "purpose", "inspiration", "industry", "audience", "difference", "ambition", "timeline"]],
                ["Personality and visual direction", ["personality", "otherPersonality", "colours", "customColours"]],
                ["End products / deliverables", ["deliverables", "otherDeliverable", "delivery", "businessCardDetails", "socialPlatforms", "packagingDetails"]],
                ["Additional information", ["extra"]],
                ["Contact details", ["fullName", "phone", "email"]],
              ].map(([heading, keys]) => <div key={String(heading)} className="border-t border-white/10 pt-4"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">{heading}</p><dl className="mt-3 space-y-2">{(keys as string[]).map((key) => { const item = answers[key]; const display = Array.isArray(item) ? item.join(", ") : String(item || ""); return display ? <div key={key} className="grid gap-1 sm:grid-cols-[9rem_1fr]"><dt className="text-xs capitalize text-white/40">{key.replace(/([A-Z])/g, " $1")}</dt><dd className="break-words text-sm text-white/80">{display}</dd></div> : null; })}</dl></div>)}</div>
              <p className="mt-5 text-xs text-white/40">Attachments: {attachments.map((file) => file.filename).join(", ") || "None"}</p>
              <label className="mt-6 flex items-start gap-3 border-t border-white/10 pt-5 text-xs leading-6 text-white/55"><input type="checkbox" checked={answers.understandScope === "yes"} onChange={(event) => update("understandScope", event.target.checked ? "yes" : "")} className="mt-1 accent-[#e34242]" />I understand that physical printing or production is confirmed separately after the team reviews the request.</label>
              {submitError ? <p role="alert" className="mt-4 text-sm leading-6 text-[#ff9c9c]">{submitError}</p> : null}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6"><button type="button" onClick={() => { setReview(false); setStepIndex(steps.length - 1); }} className="min-h-11 px-3 text-sm text-white/55 hover:text-white">Back to answers</button><button type="button" disabled={sending || answers.understandScope !== "yes"} onClick={() => void submit()} className="min-h-12 bg-white px-7 text-sm font-bold text-black transition hover:bg-[#e34242] hover:text-white disabled:cursor-not-allowed disabled:opacity-30">{sending ? "Submitting..." : "Confirm and submit"} <span className="ml-3">↗</span></button></div>
            </article>
          )}
          <p className="mt-6 text-center text-[10px] leading-5 text-white/35">Your details are used to review this application and contact you. Submissions are subject to review and acceptance.</p>
        </div>
      </section>

      <section className="bg-[#e34242] px-4 py-16 text-white sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/70">04 / Your move</p><h2 className="mt-4 max-w-2xl font-display text-4xl leading-[1.02] tracking-tight sm:text-6xl">Ideas grow here.</h2><p className="mt-5 max-w-xl text-sm leading-7 text-white/80">Brand Branch · An EMP Exclusive brand house.</p></div><a href="/#involved" className="inline-flex min-h-12 shrink-0 items-center justify-center border border-white/70 px-6 text-sm font-bold text-white transition hover:bg-white hover:text-[#e34242]">Contact Us ↗</a></div>
      </section>
    </main>
  );
}
