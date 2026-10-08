-- Guest floor: visits, house loves, and a handle locked for 20 hours.
create table if not exists guests (
  id text primary key,
  handle text not null default '',
  handle_set_at timestamptz
);

create table if not exists visits (
  guest_id text primary key,
  created_at timestamptz not null default now()
);

create table if not exists house_counters (
  id text primary key,
  value bigint not null default 0
);

insert into house_counters (id, value) values ('loves', 0)
on conflict (id) do nothing;
