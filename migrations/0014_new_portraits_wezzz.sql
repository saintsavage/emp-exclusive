-- New portraits (backgrounds). Wezzz joins the members.

update members set portrait_url = '/images/crew-saynt-suit.jpg' where id = 'saynt';
update members set portrait_url = '/images/crew-xanon-wall.jpg' where id = 'xanon';
update members set portrait_url = '/images/crew-tumi-shear.jpg' where id = 'tumi';
update members set portrait_url = '/images/crew-mj-blue.jpg' where id = 'mj';

update posts set author_avatar = '/images/crew-saynt-suit.jpg'
where user_id = 'house' and author_name = 'EMP Saynt';

insert into members (id, name, role, bio, portrait_url, sort_order) values
  (
    'wezzz',
    'Wezzz',
    'Member',
    'The EMP family. They carry the brand in the streets, in the chats, and in the rooms we have not named yet.',
    '',
    15
  )
on conflict (id) do update set
  name = excluded.name,
  role = excluded.role,
  bio = excluded.bio,
  sort_order = excluded.sort_order;
