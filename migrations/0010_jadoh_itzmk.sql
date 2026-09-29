-- Jadoh leads the members list. ItzMk waist-up studio crop.

update members set
  portrait_url = '/images/crew-mk7teen-up.jpg'
where id = 'mk7teen';

update members set sort_order = 8 where id = 'jadoh';
update members set sort_order = 9 where id = 'mastermind';
update members set sort_order = 10 where id = 'bridgett';
update members set sort_order = 11 where id = 'ggee';
