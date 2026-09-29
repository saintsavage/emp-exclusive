-- ItzMk waist-up studio. Jadoh leads members. WAY-KID joins (photo later).

update members set
  portrait_url = '/images/crew-mk7teen-waist.jpg'
where id = 'mk7teen';

update members set sort_order = 8 where id = 'jadoh';
update members set sort_order = 9 where id = 'mastermind';
update members set sort_order = 10 where id = 'bridgett';
update members set sort_order = 11 where id = 'ggee';

insert into members (id, name, role, bio, portrait_url, sort_order) values
  (
    'waykid',
    'WAY-KID',
    'Member',
    'The EMP family. They carry the brand in the streets, in the chats, and in the rooms we have not named yet.',
    '',
    12
  )
on conflict (id) do update set
  name = excluded.name,
  role = excluded.role,
  bio = excluded.bio,
  portrait_url = excluded.portrait_url,
  sort_order = excluded.sort_order;
