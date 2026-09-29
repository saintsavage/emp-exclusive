-- Clear demo feed. Lock the wall to official drops only (composer removed).
-- Replace fictional members with the real house.

delete from posts;
delete from notifications;

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
on conflict (id) do update set
  name = excluded.name,
  role = excluded.role,
  bio = excluded.bio,
  portrait_url = excluded.portrait_url,
  sort_order = excluded.sort_order;

delete from members
where id not in ('saynt', 'mk7teen', 'tma', 'xanon', 'tba');
