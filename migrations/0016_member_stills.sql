-- New stills. MasterMind becomes Rorry. Bridgett sits after Jadoh.

update members set
  portrait_url = '/images/crew-xanon-blue.jpg'
where id = 'xanon';

update members set
  name = 'Rorry',
  portrait_url = '/images/crew-rorry.jpg',
  sort_order = 13
where id = 'mastermind';

update members set
  portrait_url = '/images/crew-bridgett-white.jpg',
  sort_order = 12
where id = 'bridgett';

update members set
  portrait_url = '/images/crew-jadoh-bow.jpg',
  sort_order = 11
where id = 'jadoh';

update members set sort_order = 14 where id = 'ggee';
update members set sort_order = 15 where id = 'wezzz';
