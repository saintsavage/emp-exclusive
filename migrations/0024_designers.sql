update members set sort_order = sort_order + 1 where sort_order >= 9;

update members set
  name = 'EMP LT',
  role = 'Designer',
  bio = 'EMP LT. He sketches the pathways the brand can walk — the lines that take EMP Exclusive to its peak.'
where id = 'ahmed';

insert into members (id, name, role, bio, portrait_url, sort_order) values (
  'empot',
  'EMP OT',
  'Designer',
  'Designer of Exodist. He read Exodus as a departure and cut it into a mark: crosses, a blade, and a faith meant to be unmistakably Christian.',
  '',
  9
) on conflict (id) do update set
  name = excluded.name,
  role = excluded.role,
  bio = excluded.bio,
  portrait_url = excluded.portrait_url,
  sort_order = excluded.sort_order;

update posts
set body = replace(body, 'Mr Ahmed', 'EMP LT')
where body like '%Mr Ahmed%';
