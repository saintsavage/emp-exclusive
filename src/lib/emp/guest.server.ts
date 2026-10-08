import { randomUUID } from "node:crypto";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { getSql } from "@/lib/db";

const COOKIE = "emp_guest";
const YEAR = 60 * 60 * 24 * 400;

function validId(value: string | undefined) {
  return Boolean(value && /^[0-9a-f-]{16,40}$/i.test(value));
}

export async function ensureGuestId(claimed?: string) {
  const cookie = getCookie(COOKIE)?.trim();
  const id = validId(cookie) ? cookie! : validId(claimed) ? claimed! : randomUUID();
  if (id !== cookie) {
    setCookie(COOKIE, id, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: true,
      maxAge: YEAR,
    });
  }
  const sql = await getSql();
  await sql`
    insert into guests (id) values (${id})
    on conflict (id) do nothing
  `;
  return id;
}
