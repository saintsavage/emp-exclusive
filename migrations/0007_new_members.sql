-- Jadoh, Bridgett, Ggee join as members. Jadoh first of the three.

insert into members (id, name, role, bio, portrait_url, sort_order) values
  (
    'jadoh',
    'Jadoh',
    'Member',
    'Member of EMP Exclusive.',
    '/images/crew-jadoh.jpg',
    8
  ),
  (
    'bridgett',
    'Bridgett',
    'Member',
    'Member of EMP Exclusive.',
    '/images/crew-bridgett.jpg',
    9
  ),
  (
    'ggee',
    'Ggee',
    'Member',
    'Member of EMP Exclusive.',
    '/images/crew-ggee.jpg',
    10
  )
on conflict (id) do update set
  name = excluded.name,
  role = excluded.role,
  bio = excluded.bio,
  portrait_url = excluded.portrait_url,
  sort_order = excluded.sort_order;
