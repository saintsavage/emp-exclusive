import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const requestAdminLink = createServerFn({ method: "POST" }).handler(async () => {
  const { requestAdminLink } = await import("@/lib/brand-branch/admin.server");
  return requestAdminLink();
});

const verifyAdminLink = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string().min(1).max(100) }))
  .handler(async ({ data }) => {
    const { verifyAdminLink } = await import("@/lib/brand-branch/admin.server");
    return verifyAdminLink(data.token);
  });

const getApplications = createServerFn({ method: "GET" }).handler(async () => {
  const { listBrandApplications } = await import("@/lib/brand-branch/admin.server");
  return listBrandApplications();
});

const saveApplication = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    id: z.string().uuid(),
    status: z.enum(["pending", "approved", "rejected", "contacted"]),
    adminNote: z.string().max(4000),
  }))
  .handler(async ({ data }) => {
    const { updateBrandApplication } = await import("@/lib/brand-branch/admin.server");
    return updateBrandApplication(data);
  });

const signOutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const { logoutBrandAdmin } = await import("@/lib/brand-branch/admin.server");
  return logoutBrandAdmin();
});

type Application = {
  id: string;
  brand_name: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  answers: Record<string, unknown>;
  attachments: { filename: string; content: string; contentType: string }[];
  status: "pending" | "approved" | "rejected" | "contacted";
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

const statuses = ["pending", "approved", "rejected", "contacted"] as const;

export const Route = createFileRoute("/admin")({
  validateSearch: z.object({ token: z.string().optional() }),
  component: BrandBranchAdmin,
});

function BrandBranchAdmin() {
  const { token } = Route.useSearch();
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [status, setStatus] = useState<Application["status"]>("pending");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const active = applications.find((item) => item.id === activeId) ?? null;
  const counts = useMemo(() => ({
    total: applications.length,
    pending: applications.filter((item) => item.status === "pending").length,
    approved: applications.filter((item) => item.status === "approved").length,
    rejected: applications.filter((item) => item.status === "rejected").length,
    contacted: applications.filter((item) => item.status === "contacted").length,
  }), [applications]);

  const load = async () => {
    setLoading(true);
    try {
      const rows = await getApplications();
      const items = rows as Application[];
      setApplications(items);
      if (items.length && !activeId) {
        setActiveId(items[0].id);
        setStatus(items[0].status);
        setNote(items[0].admin_note ?? "");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load applications.");
      setAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    let live = true;
    setLoading(true);
    void verifyAdminLink({ data: { token } })
      .then(() => {
        if (!live) return;
        setAdmin(true);
        setMessage("Secure admin access confirmed.");
        window.history.replaceState({}, "", "/admin");
      })
      .catch((error) => {
        if (live) setMessage(error instanceof Error ? error.message : "This sign-in link is invalid or expired.");
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => { live = false; };
  }, [token]);

  useEffect(() => {
    if (admin) void load();
  }, [admin]);

  const selectApplication = (item: Application) => {
    setActiveId(item.id);
    setStatus(item.status);
    setNote(item.admin_note ?? "");
  };

  const save = async () => {
    if (!active) return;
    setSaving(true);
    setMessage("");
    try {
      await saveApplication({ data: { id: active.id, status, adminNote: note } });
      setApplications((items) => items.map((item) => item.id === active.id
        ? { ...item, status, admin_note: note, updated_at: new Date().toISOString() }
        : item));
      setMessage("Application updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update application.");
    } finally {
      setSaving(false);
    }
  };

  const requestLink = async () => {
    setRequesting(true);
    setMessage("");
    try {
      await requestAdminLink();
      setMessage("A one-time sign-in link has been sent to empexclusive.planet@gmail.com. It expires in 10 minutes.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not send the sign-in link.");
    } finally {
      setRequesting(false);
    }
  };

  const logout = async () => {
    await signOutAdmin();
    setAdmin(false);
    setApplications([]);
    setActiveId(null);
    setMessage("You have signed out.");
  };

  if (!admin) return (
    <main className="min-h-[75vh] bg-[#09090b] px-4 py-20 text-white">
      <div className="mx-auto max-w-lg border border-white/15 p-8 sm:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#e66a6a]">EMP Exclusive · Private access</p>
        <h1 className="mt-5 font-display text-4xl sm:text-5xl">Brand Branch<br />Admin Inbox.</h1>
        <p className="mt-5 text-sm leading-7 text-white/60">A one-time sign-in link will be sent to the authorised EMP admin email. The link expires after 10 minutes and can only be used once.</p>
        <p className="mt-6 border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">empexclusive.planet@gmail.com</p>
        <button type="button" disabled={requesting || loading} onClick={() => void requestLink()} className="mt-6 min-h-12 w-full bg-white px-5 text-sm font-bold text-black disabled:opacity-50">
          {loading ? "Verifying link…" : requesting ? "Sending secure link…" : "Email me a sign-in link"}
        </button>
        {message ? <p className="mt-4 text-sm text-white/65">{message}</p> : null}
        <a href="/" className="mt-8 inline-block text-xs text-white/45 underline underline-offset-4">Back to EMP Exclusive</a>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#e66a6a]">EMP Exclusive · Brand Branch</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">Application inbox.</h1>
            <p className="mt-2 text-sm text-white/45">Private workspace · empexclusive.planet@gmail.com</p>
          </div>
          <button type="button" onClick={() => void logout()} className="border border-white/25 px-4 py-2 text-sm">Sign out</button>
        </header>

        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {([["Total", counts.total], ["Pending", counts.pending], ["Approved", counts.approved], ["Rejected", counts.rejected], ["Contacted", counts.contacted]] as const).map(([label, value]) => (
            <div key={label} className="border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-wider text-white/45">{label}</p>
              <p className="mt-2 font-display text-3xl">{value}</p>
            </div>
          ))}
        </section>

        {message ? <p className="mt-4 text-sm text-[#f0aaaa]">{message}</p> : null}

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <h2 className="text-sm font-semibold">Applications</h2>
              <button type="button" onClick={() => void load()} className="text-xs text-white/55 underline">Refresh</button>
            </div>
            {loading ? <p className="p-5 text-sm text-white/50">Loading applications…</p> : applications.length === 0 ? <p className="p-5 text-sm text-white/50">No applications received yet.</p> : (
              <div className="max-h-[70vh] overflow-y-auto">
                {applications.map((item) => (
                  <button key={item.id} type="button" onClick={() => selectApplication(item)} className={`block w-full border-b border-white/10 p-4 text-left transition ${activeId === item.id ? "bg-white/10" : "hover:bg-white/[0.04]"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-semibold">{item.brand_name}</span>
                      <span className="text-[10px] uppercase tracking-wider text-[#e7a0a0]">{item.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-white/55">{item.applicant_name} · {item.applicant_email}</p>
                    <p className="mt-2 text-[11px] text-white/35">{new Date(item.created_at).toLocaleString()}</p>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="min-w-0 border border-white/10 p-5 sm:p-6">
            {!active ? <p className="text-sm text-white/45">Select an application to review its details.</p> : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#e66a6a]">Application details</p>
                    <h2 className="mt-2 font-display text-3xl">{active.brand_name}</h2>
                    <p className="mt-1 text-xs text-white/40">ID: {active.id}</p>
                  </div>
                  <span className="text-xs text-white/45">{new Date(active.created_at).toLocaleString()}</span>
                </div>

                <div className="mt-6 grid gap-3 border-y border-white/10 py-5 text-sm sm:grid-cols-2">
                  <div><p className="text-xs text-white/40">Applicant</p><p className="mt-1">{active.applicant_name}</p></div>
                  <div><p className="text-xs text-white/40">Phone</p><p className="mt-1">{active.applicant_phone}</p></div>
                  <div className="sm:col-span-2"><p className="text-xs text-white/40">Email</p><a className="mt-1 inline-block underline" href={`mailto:${active.applicant_email}`}>{active.applicant_email}</a></div>
                </div>

                <div className="mt-5 space-y-4">
                  {Object.entries(active.answers ?? {}).filter(([key]) => !["fullName", "phone", "email", "website", "attachments"].includes(key)).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">{key.replace(/([A-Z])/g, " $1")}</p>
                      <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-white/80">{Array.isArray(value) ? value.join(", ") : String(value ?? "Not provided")}</p>
                    </div>
                  ))}
                </div>

                {active.attachments?.length ? (
                  <div className="mt-6 border-t border-white/10 pt-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-white/45">Reference files</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {active.attachments.map((file) => (
                        <a key={file.filename} href={`data:${file.contentType};base64,${file.content}`} download={file.filename} className="border border-white/20 px-3 py-2 text-xs underline underline-offset-4">{file.filename}</a>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-7 border-t border-white/10 pt-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/45">Review status</label>
                  <select value={status} onChange={(event) => setStatus(event.target.value as Application["status"])} className="mt-2 min-h-11 w-full border border-white/20 bg-[#151517] px-3 text-sm text-white">
                    {statuses.map((item) => <option key={item} value={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</option>)}
                  </select>
                  <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-white/45">Private admin note</label>
                  <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} maxLength={4000} className="mt-2 w-full border border-white/20 bg-[#151517] p-3 text-sm text-white" placeholder="Internal notes about this application…" />
                  <button type="button" disabled={saving} onClick={() => void save()} className="mt-4 min-h-11 bg-white px-5 text-sm font-bold text-black disabled:opacity-50">{saving ? "Saving…" : "Save review"}</button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
