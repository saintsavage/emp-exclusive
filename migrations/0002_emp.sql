-- EMP Exclusive — public page feed, comments, reactions, follows.
-- Rows that are public (posts, members, comments) are world-readable.
-- Writes that belong to a person always carry user_id (TEXT).
-- Official posts are inserted by the house (via Grok), not by visitors.

create table if not exists members (
  id text primary key,
  name text not null,
  role text not null,
  bio text not null,
  portrait_url text not null,
  sort_order int not null default 0
);

create table if not exists posts (
  id serial primary key,
  user_id text not null,
  author_name text not null,
  author_avatar text,
  kind text not null,
  title text,
  body text not null,
  media_url text,
  media_poster text,
  is_official boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists posts_created_at_idx on posts (created_at desc);
create index if not exists posts_kind_idx on posts (kind);

create table if not exists comments (
  id serial primary key,
  post_id int not null references posts(id) on delete cascade,
  user_id text not null,
  author_name text not null,
  author_avatar text,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_post_id_idx on comments (post_id, created_at);

create table if not exists reactions (
  id serial primary key,
  post_id int not null references posts(id) on delete cascade,
  user_id text not null,
  kind text not null,
  created_at timestamptz not null default now(),
  unique (post_id, user_id, kind)
);

create index if not exists reactions_post_id_idx on reactions (post_id);

create table if not exists follows (
  user_id text primary key,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id serial primary key,
  user_id text not null,
  title text not null,
  body text not null,
  href text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on notifications (user_id, created_at desc);

insert into members (id, name, role, bio, portrait_url, sort_order) values
  (
    'saynt',
    'EMP Saynt',
    'Founder',
    'Founder of EMP Exclusive. Holds the house.',
    '',
    1
  ),
  (
    'mk7teen',
    'ItzMK7teen',
    'Co-founder',
    'Co-founder. Building the EMPIRE from the ground.',
    '',
    2
  ),
  (
    'tma',
    'T.M.A',
    'Co-founder',
    'Co-founder. In the house since the relaunch.',
    '',
    3
  ),
  (
    'xanon',
    'Xanon',
    'Co-founder',
    'Co-founder. Part of the reassembly that put the brand back on its feet.',
    '',
    4
  ),
  (
    'tba',
    'TBA',
    'Member',
    'Seat open. The name lands when the house is ready.',
    '',
    5
  )
on conflict (id) do nothing;
