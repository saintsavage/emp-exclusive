-- Keep the sample story live for the next 24 hours, then it drops.
update posts
set created_at = now()
where kind = 'story' and media_url = '/images/cover-hero.jpg';

insert into members (id, name, role, bio, portrait_url, sort_order) values
  (
    'malone',
    'Mr Malone',
    'Co-founder',
    'Co-founder. Holds his piece of the EMPIRE beside the relaunch line.',
    '',
    6
  ),
  (
    'paul',
    'Paul',
    'Member',
    'The EMP family. They carry the brand in the streets, in the chats, and in the rooms we have not named yet.',
    '',
    16
  )
on conflict (id) do update set
  name = excluded.name,
  role = excluded.role,
  bio = excluded.bio,
  sort_order = excluded.sort_order;
