export const POST_KINDS = ["update", "photo", "video", "story"] as const;
export type PostKind = (typeof POST_KINDS)[number];

export const REACTION_KINDS = ["like", "love", "fire"] as const;
export type ReactionKind = (typeof REACTION_KINDS)[number];

export type Member = {
  id: string;
  name: string;
  role: string;
  bio: string;
  portraitUrl: string;
  sortOrder: number;
};

export type Post = {
  id: number;
  userId: string;
  authorName: string;
  authorAvatar: string | null;
  kind: PostKind;
  title: string | null;
  body: string;
  mediaUrl: string | null;
  mediaPoster: string | null;
  isOfficial: boolean;
  createdAt: string;
  likeCount: number;
  loveCount: number;
  fireCount: number;
  commentCount: number;
};

export type Comment = {
  id: number;
  postId: number;
  userId: string;
  authorName: string;
  authorAvatar: string | null;
  body: string;
  createdAt: string;
};

export type NotificationItem = {
  id: number;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: string;
};

export type PageStats = {
  followers: number;
  posts: number;
};
