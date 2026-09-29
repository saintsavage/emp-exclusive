-- Real house portraits and the full crew. T.M.A becomes Sir Mbeha.
-- Director sits after the co-founders and before members. TBA seat closed.

insert into members (id, name, role, bio, portrait_url, sort_order) values
  (
    'saynt',
    'EMP Saynt',
    'Founder',
    'Founder of EMP Exclusive. Holds the house.',
    '/images/member-saynt.jpg',
    1
  ),
  (
    'mk7teen',
    'ItzMk7teen',
    'Co-founder',
    'Co-founder. Building the EMPIRE from the ground.',
    '/images/member-mk7teen.jpg',
    2
  ),
  (
    'mbeha',
    'Sir Mbeha',
    'Co-founder',
    'Co-founder. In the house since the relaunch.',
    '/images/member-mbeha.jpg',
    3
  ),
  (
    'xanon',
    'Xanon',
    'Co-founder',
    'Co-founder. Part of the reassembly that put the brand back on its feet.',
    '/images/member-xanon.jpg',
    4
  ),
  (
    'tumi',
    'Planet Tumi',
    'Director',
    'Director. Holds the frame of the house.',
    '/images/member-tumi.jpg',
    5
  ),
  (
    'mastermind',
    'MasterMind',
    'Member',
    'Member of EMP Exclusive.',
    '/images/member-mastermind.jpg',
    6
  ),
  (
    'mj',
    'M.J',
    'Member',
    'Member of EMP Exclusive.',
    '/images/member-mj.jpg',
    7
  )
on conflict (id) do update set
  name = excluded.name,
  role = excluded.role,
  bio = excluded.bio,
  portrait_url = excluded.portrait_url,
  sort_order = excluded.sort_order;

delete from members
where id not in ('saynt', 'mk7teen', 'mbeha', 'xanon', 'tumi', 'mastermind', 'mj');
