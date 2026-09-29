-- Waist-up ItzMk studio portrait. Confirm Basco photo. Xenon spelling.

update members set
  name = 'ItzMk7teen',
  role = 'Second Founder',
  bio = 'Second founder. Builds the EMPIRE beside Saynt — from the ground, every day.',
  portrait_url = '/images/crew-mk7teen-studio.jpg',
  sort_order = 2
where id = 'mk7teen';

update members set
  name = 'Xenon',
  role = 'Co-founder',
  bio = 'Co-founder. Standard and edge. Sharpened the house after the relaunch.',
  sort_order = 5
where id = 'xanon';

update members set
  role = 'Founder',
  bio = 'Founder. Holds the house. Sets the vision EMP Exclusive walks in.',
  sort_order = 1
where id = 'saynt';

update members set
  role = 'Director',
  bio = 'Director. Holds the frame — how EMP looks, moves, and lands in public.',
  sort_order = 3
where id = 'tumi';

update members set
  role = 'Co-founder',
  bio = 'Co-founder. Presence. Puts EMP in the room and keeps it standing.',
  sort_order = 4
where id = 'mbeha';

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
