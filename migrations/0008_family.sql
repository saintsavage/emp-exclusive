-- Family structure: two founders, director, co-founders, EMP Wings, members.
-- Xenon name fix. ItzMk second founder. Basco Mmula joins as EMP Wing.

update members set
  role = 'Founder',
  bio = 'Holds the house. Sets the vision EMP Exclusive walks in — the mind behind the movement.',
  sort_order = 1
where id = 'saynt';

update members set
  name = 'ItzMk7teen',
  role = 'Second Founder',
  bio = 'Second founder. Builds the EMPIRE beside Saynt — from the ground, every day.',
  portrait_url = '/images/crew-mk7teen-studio.jpg',
  sort_order = 2
where id = 'mk7teen';

update members set
  role = 'Director',
  bio = 'Holds the frame of the house. How EMP looks, moves, and lands in public starts here.',
  sort_order = 3
where id = 'tumi';

update members set
  role = 'Co-founder',
  bio = 'In the room since the relaunch. Steadies the house when the work gets loud.',
  sort_order = 4
where id = 'mbeha';

update members set
  name = 'Xenon',
  role = 'Co-founder',
  bio = 'Part of the reassembly. Keeps the EMPIRE sharp and the standard high.',
  sort_order = 5
where id = 'xanon';

update members set
  role = 'EMP Wing',
  bio = 'EMP Wing. One half of the Vibe Police — keeps the house at altitude.',
  sort_order = 6
where id = 'mj';

insert into members (id, name, role, bio, portrait_url, sort_order) values
  (
    'basco',
    'Basco Mmula',
    'EMP Wing',
    'EMP Wing. One half of the Vibe Police — keeps the house at altitude.',
    '/images/crew-basco.jpg',
    7
  )
on conflict (id) do update set
  name = excluded.name,
  role = excluded.role,
  bio = excluded.bio,
  portrait_url = excluded.portrait_url,
  sort_order = excluded.sort_order;

update members set
  role = 'Member',
  bio = 'The EMP family. They carry the brand in the streets, in the chats, and in the rooms we have not named yet.',
  sort_order = 8
where id = 'mastermind';

update members set
  role = 'Member',
  bio = 'The EMP family. They carry the brand in the streets, in the chats, and in the rooms we have not named yet.',
  sort_order = 9
where id = 'jadoh';

update members set
  role = 'Member',
  bio = 'The EMP family. They carry the brand in the streets, in the chats, and in the rooms we have not named yet.',
  sort_order = 10
where id = 'bridgett';

update members set
  role = 'Member',
  bio = 'The EMP family. They carry the brand in the streets, in the chats, and in the rooms we have not named yet.',
  sort_order = 11
where id = 'ggee';
