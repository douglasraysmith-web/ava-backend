
-- AVA_RAILWAY_POSTGRES_SCHEMA_v1_0.sql
-- Owner-ready pilot schema. Run in Railway Postgres psql/SQL client after review.
-- No customer data should be entered until owner approval and security checks pass.

create extension if not exists pgcrypto;

create table if not exists ava_customers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lifecycle_state text not null default 'active',
  display_name text,
  company_name text,
  email text,
  phone text,
  consent_status text not null default 'unknown',
  notes_private text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists ava_projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_id uuid references ava_customers(id) on delete set null,
  project_name text not null,
  project_type text,
  status text not null default 'draft',
  privacy_class text not null default 'owner_private',
  notes_private text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists ava_rooms (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  project_id uuid references ava_projects(id) on delete cascade,
  room_name text,
  length_ft numeric,
  width_ft numeric,
  height_ft numeric,
  seating_notes text,
  lighting_notes text,
  acoustic_notes text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists ava_devices (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  project_id uuid references ava_projects(id) on delete set null,
  room_id uuid references ava_rooms(id) on delete set null,
  manufacturer text,
  model text,
  series text,
  device_category text,
  target_platform text,
  role_in_system text,
  connection_methods text[] default '{}',
  verification_state text not null default 'unverified',
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists ava_sources (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source_name text not null,
  source_url text,
  source_type text not null,
  manufacturer text,
  model_or_series text,
  platform text,
  device_category text,
  authority_level text not null default 'unverified',
  access_requirement text not null default 'public_or_unknown',
  lifecycle_state text not null default 'proposed',
  last_verified_date date,
  notes text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists ava_driver_protocols (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  device_id uuid references ava_devices(id) on delete set null,
  source_id uuid references ava_sources(id) on delete set null,
  manufacturer text,
  model_or_series text,
  target_platform text,
  availability_state text not null default 'LIVE_LOOKUP_REQUIRED',
  confidence_level text not null default 'F',
  control_methods text[] default '{}',
  access_requirement text not null default 'unknown',
  certification_status text not null default 'unknown',
  field_ready_status text not null default 'not_field_ready',
  notes text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists ava_command_codes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  device_id uuid references ava_devices(id) on delete cascade,
  source_id uuid references ava_sources(id) on delete set null,
  command_name text not null,
  command_method text,
  command_payload text,
  command_safety_class text not null default 'SAFE_REFERENCE',
  source_status text not null default 'unverified',
  field_test_status text not null default 'not_tested',
  public_allowed boolean not null default false,
  notes text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists ava_files (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  file_kind text not null,
  storage_path text,
  source_id uuid references ava_sources(id) on delete set null,
  project_id uuid references ava_projects(id) on delete set null,
  access_scope text not null default 'owner_private',
  lifecycle_state text not null default 'active',
  checksum_sha256 text,
  notes text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists ava_corrections (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  visible_failure text not null,
  likely_cause text,
  repair text,
  verification_check text,
  do_not_repeat_rule text,
  carryforward_rule text,
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists ava_audit_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  actor_type text not null default 'unknown',
  action text not null,
  target_table text,
  target_id uuid,
  privacy_class text not null default 'internal',
  result text not null default 'recorded',
  metadata jsonb not null default '{}'::jsonb
);

-- Enable RLS for defense in depth. Server-side service role can be used by trusted functions.
alter table ava_customers enable row level security;
alter table ava_projects enable row level security;
alter table ava_rooms enable row level security;
alter table ava_devices enable row level security;
alter table ava_sources enable row level security;
alter table ava_driver_protocols enable row level security;
alter table ava_command_codes enable row level security;
alter table ava_files enable row level security;
alter table ava_corrections enable row level security;
alter table ava_audit_events enable row level security;

-- Public-safe read policy for records explicitly marked public. Private data remains blocked.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'ava_sources'
      and policyname = 'ava_sources_public_read'
  ) then
    create policy ava_sources_public_read on ava_sources
      for select using (access_requirement = 'public' and lifecycle_state = 'active');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'ava_files'
      and policyname = 'ava_files_public_read'
  ) then
    create policy ava_files_public_read on ava_files
      for select using (access_scope = 'public' and lifecycle_state = 'active');
  end if;
end
$$;

-- All private write/read operations should go through server-side owner-authenticated functions.


-- v7.8.3 AVA verified teaching core: owner-only teaching ledger and verified source registry.
-- These tables are for source locations, rights notes, public-safe backup knowledge, and correction-style learning.
-- Do not store raw copyrighted works, secrets, customer private records, payment records, or unclear-rights full works here.
create table if not exists ava_teaching_lessons (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lesson_key text not null unique,
  lesson_title text,
  lesson_category text not null default 'verified_source_intelligence',
  source_authority text not null default 'proposed',
  rights_status text not null default 'unknown',
  public_safe_use text not null default 'reference_only_until_verified',
  owner_only_notes text,
  lifecycle_state text not null default 'proposed',
  verification_date date,
  lesson_body text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists ava_verified_source_registry (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  source_name text not null,
  official_location text,
  source_category text not null default 'public_source_location',
  material_type text,
  rights_status text not null default 'item_level_rights_required',
  reuse_restrictions text not null default 'verify_item_level_rights_before_reuse',
  verification_date date,
  public_safe_use text not null default 'source_location_and_rights_note_only',
  owner_only_notes text,
  lifecycle_state text not null default 'proposed',
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_ava_teaching_lessons_key on ava_teaching_lessons(lesson_key);
create index if not exists idx_ava_teaching_lessons_state on ava_teaching_lessons(lifecycle_state);
create index if not exists idx_ava_verified_source_registry_name on ava_verified_source_registry(source_name);
create index if not exists idx_ava_verified_source_registry_state on ava_verified_source_registry(lifecycle_state);
