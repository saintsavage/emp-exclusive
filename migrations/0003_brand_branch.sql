-- Brand Branch applications and private admin access.
-- Additive only: leaves existing EMP ID/auth tables untouched.

create table if not exists brand_branch_applications (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null,
  applicant_name text not null,
  applicant_email text not null,
  applicant_phone text not null,
  answers jsonb not null,
  attachments jsonb not null default '[]'::jsonb,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'contacted')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists brand_branch_applications_created_at_idx
  on brand_branch_applications (created_at desc);

create index if not exists brand_branch_applications_status_idx
  on brand_branch_applications (status, created_at desc);

create table if not exists brand_branch_admin_links (
  token_hash text primary key,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists brand_branch_admin_links_expires_at_idx
  on brand_branch_admin_links (expires_at);
