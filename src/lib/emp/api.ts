import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { HOUSE } from "@/lib/emp/house";
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

async function authorProfile(userId: string) {
  const sql = await getSql();
  const rows = await sql<{ name: string; email: string; image: string | null }>`
    select name, email, image from "user" where id = ${userId} limit 1
  `;
  const user = rows[0];
  if (!user) return { name: "Member", image: null as string | null };
  const name = user.name?.trim() || user.email?.split("@")[0] || "Member";
  return { name, image: user.image };
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

export const getPageStats = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{ followers: number; posts: number }>`
    select
      (select count(*)::int from follows) as followers,
      (select count(*)::int from posts where kind <> 'story') as posts
  `;
  const row = rows[0];
  const stats: PageStats = {
    followers: Number(row?.followers ?? 0) * HOUSE.subscribeWeight,
    posts: Number(row?.posts ?? 0),
  };
  return stats;
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
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{ post_id: number; kind: string }>`
      select post_id, kind from reactions where user_id = ${context.userId}
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
  .middleware([authMiddleware])
  .validator(z.object({ postId: z.number(), body: z.string().min(1).max(1000) }))
  .handler(async ({ context, data }) => {
    const body = data.body.trim();
    if (!body) throw new Error("Write a comment.");
    const profile = await authorProfile(context.userId);
    const sql = await getSql();
    await sql`
      insert into comments (post_id, user_id, author_name, author_avatar, body)
      values (${data.postId}, ${context.userId}, ${profile.name}, ${profile.image}, ${body})
    `;
    return { ok: true };
  });

export const toggleReaction = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ postId: z.number(), kind: z.enum(["like", "love", "fire"]) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const existing = await sql<{ id: number }>`
      select id from reactions
      where post_id = ${data.postId} and user_id = ${context.userId} and kind = ${data.kind}
      limit 1
    `;
    if (existing[0]) {
      await sql`
        delete from reactions
        where id = ${existing[0].id} and user_id = ${context.userId}
      `;
      return { on: false };
    }
    await sql`
      insert into reactions (post_id, user_id, kind)
      values (${data.postId}, ${context.userId}, ${data.kind})
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
