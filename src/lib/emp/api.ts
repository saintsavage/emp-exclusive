import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { HOUSE } from "@/lib/emp/house";
import { ensureGuestId } from "@/lib/emp/guest.server";
import type { Comment, Member, NotificationItem, PageStats, Post, PostKind } from "./types";

type PostRow = {
  id: number;
  user_id: string;
  author_name: string;
  author_avatar: string | null;
  kind: string;
  title: string | null;
  body: string;
  media_url: string | null;
  media_poster: string | null;
  is_official: boolean;
  created_at: string | Date;
  like_count: number;
  love_count: number;
  fire_count: number;
  comment_count: number;
};

function stamp(value: string | Date) {
  return value instanceof Date ? value.toISOString() : String(value);
}

function mapPost(row: PostRow): Post {
  return {
    id: Number(row.id),
    userId: row.user_id,
    authorName: row.author_name,
    authorAvatar: row.author_avatar,
    kind: row.kind as PostKind,
    title: row.title,
    body: row.body,
    mediaUrl: row.media_url,
    mediaPoster: row.media_poster,
    isOfficial: Boolean(row.is_official),
    createdAt: stamp(row.created_at),
    likeCount: Number(row.like_count) || 0,
    loveCount: Number(row.love_count) || 0,
    fireCount: Number(row.fire_count) || 0,
    commentCount: Number(row.comment_count) || 0,
  };
}

const POST_SELECT = `
  select p.id, p.user_id, p.author_name, p.author_avatar, p.kind, p.title, p.body,
         p.media_url, p.media_poster, p.is_official, p.created_at,
         (select count(*)::int from reactions r where r.post_id = p.id and r.kind = 'like') as like_count,
         (select count(*)::int from reactions r where r.post_id = p.id and r.kind = 'love') as love_count,
         (select count(*)::int from reactions r where r.post_id = p.id and r.kind = 'fire') as fire_count,
         (select count(*)::int from comments c where c.post_id = p.id) as comment_count
  from posts p
`;

async function guestRow(guestId: string) {
  const sql = await getSql();
  const rows = await sql<{ handle: string; handle_set_at: string | Date | null }>`
    select handle, handle_set_at from guests where id = ${guestId} limit 1
  `;
  const row = rows[0];
  const handle = row?.handle?.trim() ?? "";
  const setAt = row?.handle_set_at ? new Date(row.handle_set_at).getTime() : 0;
  const lockedUntil = setAt ? setAt + HOUSE.handleLockMs : 0;
  const locked = Boolean(handle) && Date.now() < lockedUntil;
  return { handle, lockedUntil: locked ? lockedUntil : 0, locked };
}

function cleanHandle(raw: string) {
  const handle = raw.trim().replace(/\s+/g, " ").slice(0, 24);
  if (handle.length < 2) throw new Error("Pick a name with at least 2 letters.");
  if (!/^[\p{L}\p{N} ._\-']+$/u.test(handle)) throw new Error("That name has characters the house will not take.");
  return handle;
}

async function pageStats(): Promise<PageStats> {
  const sql = await getSql();
  const rows = await sql<{ visits: number; loves: number; posts: number }>`
    select
      (select count(*)::int from visits) as visits,
      (select value::int from house_counters where id = 'loves') as loves,
      (select count(*)::int from posts where kind <> 'story') as posts
  `;
  const row = rows[0];
  return {
    visits: (Number(row?.visits ?? 0) || 0) * HOUSE.visitWeight,
    loves: Number(row?.loves ?? 0) || 0,
    posts: Number(row?.posts ?? 0) || 0,
  };
}

export const listMembers = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{
    id: string;
    name: string;
    role: string;
    bio: string;
    portrait_url: string;
    sort_order: number;
  }>`select id, name, role, bio, portrait_url, sort_order from members order by sort_order asc`;
  return rows.map(
    (row): Member => ({
      id: row.id,
      name: row.name,
      role: row.role,
      bio: row.bio,
      portraitUrl: row.portrait_url,
      sortOrder: Number(row.sort_order),
    }),
  );
});

export const getPageStats = createServerFn({ method: "GET" }).handler(async () => pageStats());

const GuestId = z.object({ guestId: z.string().max(40).optional() });

export const pingVisit = createServerFn({ method: "POST" })
  .validator(GuestId)
  .handler(async ({ data }) => {
    const guestId = await ensureGuestId(data.guestId);
    const sql = await getSql();
    await sql`
      insert into visits (guest_id) values (${guestId})
      on conflict (guest_id) do nothing
    `;
    return pageStats();
  });

export const tapLove = createServerFn({ method: "POST" })
  .validator(GuestId)
  .handler(async ({ data }) => {
    await ensureGuestId(data.guestId);
    const sql = await getSql();
    await sql`update house_counters set value = value + 1 where id = 'loves'`;
    return pageStats();
  });

export const guestProfile = createServerFn({ method: "GET" })
  .validator(GuestId)
  .handler(async ({ data }) => {
    const guestId = await ensureGuestId(data.guestId);
    const row = await guestRow(guestId);
    return { handle: row.handle, locked: row.locked, lockedUntil: row.lockedUntil };
  });

export const setGuestHandle = createServerFn({ method: "POST" })
  .validator(z.object({ handle: z.string().min(2).max(24), guestId: z.string().max(40).optional() }))
  .handler(async ({ data }) => {
    const guestId = await ensureGuestId(data.guestId);
    const row = await guestRow(guestId);
    if (row.locked) throw new Error("That name is locked for 20 hours.");
    const handle = cleanHandle(data.handle);
    const sql = await getSql();
    await sql`
      update guests
      set handle = ${handle}, handle_set_at = now()
      where id = ${guestId}
    `;
    return { handle, locked: true, lockedUntil: Date.now() + HOUSE.handleLockMs };
  });


export const listPosts = createServerFn({ method: "GET" })
  .validator(z.object({ kind: z.enum(["all", "update", "photo", "video", "story"]) }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows =
      data.kind === "all"
        ? await sql.query<PostRow>(`${POST_SELECT} where p.kind <> 'story' order by p.created_at desc`)
        : data.kind === "story"
          ? await sql.query<PostRow>(
              `${POST_SELECT} where p.kind = 'story' and p.created_at > now() - interval '24 hours' order by p.created_at desc`,
            )
          : await sql.query<PostRow>(`${POST_SELECT} where p.kind = $1 order by p.created_at desc`, [
              data.kind,
            ]);
    return rows.map(mapPost);
  });

export const getPost = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql.query<PostRow>(`${POST_SELECT} where p.id = $1`, [data.id]);
    return rows[0] ? mapPost(rows[0]) : null;
  });

export const listComments = createServerFn({ method: "GET" })
  .validator(z.object({ postId: z.number() }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      post_id: number;
      user_id: string;
      author_name: string;
      author_avatar: string | null;
      body: string;
      created_at: string | Date;
    }>`
      select id, post_id, user_id, author_name, author_avatar, body, created_at
      from comments where post_id = ${data.postId} order by created_at asc
    `;
    return rows.map(
      (row): Comment => ({
        id: Number(row.id),
        postId: Number(row.post_id),
        userId: row.user_id,
        authorName: row.author_name,
        authorAvatar: row.author_avatar,
        body: row.body,
        createdAt: stamp(row.created_at),
      }),
    );
  });

export const myReactions = createServerFn({ method: "GET" })
  .validator(GuestId)
  .handler(async ({ data }) => {
    const guestId = await ensureGuestId(data.guestId);
    const sql = await getSql();
    return sql<{ post_id: number; kind: string }>`
      select post_id, kind from reactions where user_id = ${guestId}
    `;
  });

export const followState = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ user_id: string }>`
      select user_id from follows where user_id = ${context.userId} limit 1
    `;
    return { following: rows.length > 0 };
  });

export const listNotifications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      title: string;
      body: string;
      href: string | null;
      read: boolean;
      created_at: string | Date;
    }>`
      select id, title, body, href, read, created_at
      from notifications
      where user_id = ${context.userId}
      order by created_at desc
      limit 40
    `;
    return rows.map(
      (row): NotificationItem => ({
        id: Number(row.id),
        title: row.title,
        body: row.body,
        href: row.href,
        read: Boolean(row.read),
        createdAt: stamp(row.created_at),
      }),
    );
  });

export const createPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      kind: z.enum(["update", "photo", "video", "story"]),
      title: z.string().max(120).optional(),
      body: z.string().min(1).max(4000),
      mediaUrl: z.string().max(2_000_000).optional(),
      mediaPoster: z.string().max(2_000_000).optional(),
      asPage: z.boolean(),
    }),
  )
  .handler(async () => {
    throw new Error("The EMP Exclusive page is closed for public posts.");
  });

export const addComment = createServerFn({ method: "POST" })
  .validator(
    z.object({
      postId: z.number(),
      body: z.string().min(1).max(1000),
      handle: z.string().max(24).optional(),
      guestId: z.string().max(40).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const body = data.body.trim();
    if (!body) throw new Error("Write a comment.");
    const guestId = await ensureGuestId(data.guestId);
    let profile = await guestRow(guestId);
    if (!profile.handle) {
      if (!data.handle?.trim()) throw new Error("Write a name first.");
      profile = {
        handle: cleanHandle(data.handle),
        locked: true,
        lockedUntil: Date.now() + HOUSE.handleLockMs,
      };
      const sqlSet = await getSql();
      await sqlSet`
        update guests
        set handle = ${profile.handle}, handle_set_at = now()
        where id = ${guestId}
      `;
    }
    const sql = await getSql();
    await sql`
      insert into comments (post_id, user_id, author_name, author_avatar, body)
      values (${data.postId}, ${guestId}, ${profile.handle}, ${null}, ${body})
    `;
    return { ok: true };
  });

export const toggleReaction = createServerFn({ method: "POST" })
  .validator(
    z.object({
      postId: z.number(),
      kind: z.enum(["like", "love", "fire"]),
      guestId: z.string().max(40).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const guestId = await ensureGuestId(data.guestId);
    const sql = await getSql();
    const existing = await sql<{ id: number }>`
      select id from reactions
      where post_id = ${data.postId} and user_id = ${guestId} and kind = ${data.kind}
      limit 1
    `;
    if (existing[0]) {
      await sql`delete from reactions where id = ${existing[0].id} and user_id = ${guestId}`;
      return { on: false };
    }
    await sql`
      insert into reactions (post_id, user_id, kind)
      values (${data.postId}, ${guestId}, ${data.kind})
    `;
    return { on: true };
  });


export const toggleFollow = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const existing = await sql<{ user_id: string }>`
      select user_id from follows where user_id = ${context.userId} limit 1
    `;
    if (existing[0]) {
      await sql`delete from follows where user_id = ${context.userId}`;
      return { following: false };
    }
    await sql`insert into follows (user_id) values (${context.userId})`;
    await sql`
      insert into notifications (user_id, title, body, href)
      values (
        ${context.userId},
        'You are on the list',
        'EMP Exclusive will ping this page when a drop lands.',
        '/'
      )
    `;
    return { following: true };
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql`
      update notifications set read = true
      where user_id = ${context.userId} and read = false
    `;
    return { ok: true };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.number() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`delete from posts where id = ${data.id} and user_id = ${context.userId}`;
    return { ok: true };
  });
