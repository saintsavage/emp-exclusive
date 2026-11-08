import { createHash, randomBytes } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { getSql } from "@/lib/db";

const ADMIN_EMAIL = (process.env.BRAND_BRANCH_ADMIN_EMAIL || "empexclusive.planet@gmail.com").trim().toLowerCase();
const SESSION_COOKIE = "emp_brand_admin_session";
const SESSION_ISSUER = "https://www.empexclusive.company";
const SESSION_AUDIENCE = "brand-branch-admin";

function secretKey() {
  const value = process.env.BRAND_BRANCH_ADMIN_SECRET?.trim();
  if (!value || value.length < 32) throw new Error("Brand Branch admin security is not configured.");
  return new TextEncoder().encode(value);
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function requestAdminLink() {
  const sql = await getSql();
  const recent = await sql.query<{ recent: boolean }>(
    "select exists(select 1 from brand_branch_admin_links where created_at > now() - interval '60 seconds') as recent",
  );
  if (recent[0]?.recent) return { sent: true };

  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  await sql.query(
    "delete from brand_branch_admin_links where expires_at < now() or used_at is not null",
  );
  await sql.query(
    "insert into brand_branch_admin_links (token_hash, expires_at) values ($1, now() + interval '10 minutes')",
    [tokenHash],
  );

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim();
  if (!apiKey || !fromEmail) throw new Error("Admin email delivery is not configured.");

  const origin = (process.env.BETTER_AUTH_URL || "https://www.empexclusive.company").replace(/\/$/, "");
  const url = `${origin}/admin?token=${token}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `EMP Exclusive <${fromEmail}>`,
      to: [ADMIN_EMAIL],
      subject: "Your Brand Branch admin sign-in link",
      text: `A sign-in link was requested for the Brand Branch admin inbox. It expires in 10 minutes and can only be used once.\n\n${url}\n\nIf you did not request this, ignore this email.`,
    }),
  });
  if (!response.ok) {
    await sql.query("delete from brand_branch_admin_links where token_hash = $1", [tokenHash]);
    throw new Error("The admin sign-in email could not be sent.");
  }
  return { sent: true };
}

export async function verifyAdminLink(token: string) {
  if (!/^[a-f0-9]{64}$/.test(token)) throw new Error("This sign-in link is invalid or expired.");
  const sql = await getSql();
  const rows = await sql.query<{ token_hash: string }>(
    "update brand_branch_admin_links set used_at = now() where token_hash = $1 and used_at is null and expires_at > now() returning token_hash",
    [hashToken(token)],
  );
  if (!rows.length) throw new Error("This sign-in link is invalid, expired, or already used.");

  const jwt = await new SignJWT({ email: ADMIN_EMAIL, role: "brand-branch-admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secretKey());

  setCookie(SESSION_COOKIE, jwt, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/admin",
    maxAge: 8 * 60 * 60,
  });
  return { verified: true };
}

export async function requireBrandAdmin() {
  const token = getCookie(SESSION_COOKIE);
  if (!token) throw new Error("Unauthorized");
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });
    if (payload.email !== ADMIN_EMAIL || payload.role !== "brand-branch-admin") {
      throw new Error("Unauthorized");
    }
  } catch {
    throw new Error("Unauthorized");
  }
}

export async function listBrandApplications() {
  await requireBrandAdmin();
  const sql = await getSql();
  return sql.query(
    `select id, brand_name, applicant_name, applicant_email, applicant_phone,
      answers, attachments, status, admin_note, created_at, updated_at
     from brand_branch_applications order by created_at desc limit 200`,
  );
}

export async function updateBrandApplication(input: {
  id: string;
  status: "pending" | "approved" | "rejected" | "contacted";
  adminNote: string;
}) {
  await requireBrandAdmin();
  const sql = await getSql();
  const rows = await sql.query(
    `update brand_branch_applications
     set status = $2, admin_note = $3, updated_at = now()
     where id = $1
     returning id, status, admin_note, updated_at`,
    [input.id, input.status, input.adminNote.trim().slice(0, 4000)],
  );
  if (!rows.length) throw new Error("Application not found.");
  return rows[0];
}

export async function logoutBrandAdmin() {
  setCookie(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/admin",
    maxAge: 0,
  });
  return { signedOut: true };
}
