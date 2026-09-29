-- Remove WAY-KID. Add Designer and EMP Verse. First official post from the founder.

delete from members where id = 'waykid';

update members set sort_order = 6 where id = 'mj';
update members set sort_order = 7 where id = 'basco';

insert into members (id, name, role, bio, portrait_url, sort_order) values
  (
    'ahmed',
    'MR AHMED. A',
    'Designer',
    'He sketches the pathways the brand can walk — the lines that take EMP Exclusive to its peak.',
    '',
    8
  ),
  (
    'tango',
    'Tango',
    'EMP Verse',
    'EMP Verse. They put the house in language.',
    '',
    9
  ),
  (
    'lio',
    'Lio',
    'EMP Verse',
    'EMP Verse. They put the house in language.',
    '',
    10
  )
on conflict (id) do update set
  name = excluded.name,
  role = excluded.role,
  bio = excluded.bio,
  portrait_url = excluded.portrait_url,
  sort_order = excluded.sort_order;

update members set sort_order = 11 where id = 'jadoh';
update members set sort_order = 12 where id = 'mastermind';
update members set sort_order = 13 where id = 'bridgett';
update members set sort_order = 14 where id = 'ggee';

update members set
  bio = 'Founder. He holds the house. The vision EMP Exclusive walks in is his.'
where id = 'saynt';

delete from posts;

insert into posts (
  user_id, author_name, author_avatar, kind, title, body, media_url, is_official, created_at
) values (
  'house',
  'EMP Saynt',
  '/images/crew-saynt.jpg',
  'update',
  'From the founder',
  'EMP Exclusive is still on the foundation — and the foundation is holding. The house is stable. What comes next is not a rumour; it is the work.

Nobody in this family wakes up to sleep. Every member is in further study. Nobody is idle. That is the standard.

The end goal was drawn by Saynt and Mr Ahmed: a private life. An estate on the outskirts of a town we choose — one piece of land where the brand lives, keeps itself, and answers to itself. Off-grid. Quiet. Ours.

That picture is the direction.',
  '/images/post-estate-night.jpg',
  true,
  '2026-09-26 22:00:00+00'
);
