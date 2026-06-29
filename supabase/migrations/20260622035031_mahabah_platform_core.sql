create extension if not exists "pgcrypto";

do $$ begin
  create type public.account_role as enum ('individual', 'business', 'admin');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.review_status as enum ('draft', 'submitted', 'in_review', 'needs_changes', 'approved', 'rejected', 'archived');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.request_status as enum ('draft', 'submitted', 'in_review', 'in_progress', 'completed', 'cancelled');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.invoice_status as enum ('draft', 'due', 'paid', 'overdue', 'cancelled');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.payment_status as enum ('pending', 'succeeded', 'failed', 'refunded');
exception
  when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key,
  role public.account_role not null default 'individual',
  full_name text not null,
  email text,
  phone text,
  city_ar text,
  avatar_url text,
  verification_status public.review_status not null default 'draft',
  profile_completion int not null default 0 check (profile_completion between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null,
  name_ar text not null,
  commercial_registration text,
  activity_type_ar text,
  city_ar text,
  email text,
  phone text,
  website text,
  logo_url text,
  status public.review_status not null default 'draft',
  verification_status public.review_status not null default 'draft',
  profile_completion int not null default 0 check (profile_completion between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null,
  member_role text not null default 'member',
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table if not exists public.real_estate_assets (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid,
  organization_id uuid references public.organizations(id) on delete set null,
  title_ar text not null,
  slug text not null unique,
  city_ar text not null,
  district_ar text,
  asset_type_ar text not null,
  usage_type_ar text not null,
  area_sqm numeric(14,2) not null check (area_sqm > 0),
  estimated_value_sar numeric(16,2),
  price_per_sqm numeric(14,2),
  street_width_m numeric(8,2),
  frontage_count int,
  deed_number text,
  deed_date date,
  listing_date date not null default current_date,
  status public.review_status not null default 'submitted',
  image_url text not null default '/images/asset-commercial-complex.png',
  gallery jsonb not null default '[]'::jsonb,
  excerpt_ar text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint real_estate_assets_owner_required check (owner_user_id is not null or organization_id is not null)
);

create table if not exists public.asset_interests (
  asset_id uuid not null references public.real_estate_assets(id) on delete cascade,
  user_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (asset_id, user_id)
);

create table if not exists public.real_estate_contributions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  asset_id uuid references public.real_estate_assets(id) on delete set null,
  title_ar text not null,
  slug text not null unique,
  city_ar text not null,
  stage_ar text not null default 'تحت الدراسة',
  capital_sar numeric(18,2) not null check (capital_sar > 0),
  investors_count int not null default 0,
  duration_months int not null default 12,
  funded_percent int not null default 0 check (funded_percent between 0 and 100),
  expected_return_percent numeric(6,2),
  remaining_days int,
  license_number text,
  offering_url text,
  status public.review_status not null default 'submitted',
  image_url text not null default '/images/contribution-request-hero-sketch.png',
  excerpt_ar text not null default '',
  timeline jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contribution_interests (
  contribution_id uuid not null references public.real_estate_contributions(id) on delete cascade,
  user_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (contribution_id, user_id)
);

create table if not exists public.services_catalog (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_ar text not null,
  description_ar text not null,
  duration_ar text,
  level_ar text,
  outputs_ar text,
  price_sar numeric(14,2),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  requester_user_id uuid,
  organization_id uuid references public.organizations(id) on delete set null,
  asset_id uuid references public.real_estate_assets(id) on delete set null,
  contribution_id uuid references public.real_estate_contributions(id) on delete set null,
  service_type_ar text not null,
  title_ar text not null,
  description_ar text not null,
  city_ar text,
  asset_type_ar text,
  area_sqm numeric(14,2),
  status public.request_status not null default 'submitted',
  priority text not null default 'normal',
  amount_sar numeric(14,2),
  due_date date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint service_requests_owner_required check (requester_user_id is not null or organization_id is not null)
);

create table if not exists public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  requester_user_id uuid,
  organization_id uuid references public.organizations(id) on delete cascade,
  request_type text not null check (request_type in ('individual', 'business')),
  status public.review_status not null default 'submitted',
  completion_percent int not null default 0 check (completion_percent between 0 and 100),
  submitted_at timestamptz not null default now(),
  reviewed_by uuid,
  reviewed_at timestamptz,
  notes text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint verification_owner_required check (requester_user_id is not null or organization_id is not null)
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  organization_id uuid references public.organizations(id) on delete cascade,
  plan_name_ar text not null,
  status text not null default 'active',
  starts_at date not null default current_date,
  ends_at date,
  amount_sar numeric(14,2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  user_id uuid,
  organization_id uuid references public.organizations(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  title_ar text not null,
  amount_sar numeric(14,2) not null check (amount_sar >= 0),
  status public.invoice_status not null default 'due',
  due_date date,
  paid_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references public.invoices(id) on delete set null,
  user_id uuid,
  organization_id uuid references public.organizations(id) on delete cascade,
  amount_sar numeric(14,2) not null check (amount_sar >= 0),
  method text not null,
  status public.payment_status not null default 'pending',
  provider_reference text,
  paid_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  organization_id uuid references public.organizations(id) on delete cascade,
  title_ar text not null,
  body_ar text not null,
  category text not null default 'system',
  read_at timestamptz,
  action_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  subject_ar text not null,
  status text not null default 'open',
  created_by uuid,
  organization_id uuid references public.organizations(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_user_id uuid,
  body_ar text not null,
  read_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text not null unique,
  requester_user_id uuid,
  organization_id uuid references public.organizations(id) on delete set null,
  category text not null default 'general',
  title_ar text not null,
  description_ar text not null,
  status public.request_status not null default 'submitted',
  priority text not null default 'normal',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  sender_user_id uuid,
  body_ar text not null,
  internal boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'website',
  confirmed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid,
  organization_id uuid references public.organizations(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  bucket text not null default 'mahabah-documents',
  storage_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.platform_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid,
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  organization_id uuid references public.organizations(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists organizations_owner_idx on public.organizations (owner_user_id);
create index if not exists assets_owner_idx on public.real_estate_assets (owner_user_id);
create index if not exists assets_org_status_idx on public.real_estate_assets (organization_id, status);
create index if not exists assets_public_status_idx on public.real_estate_assets (status, listing_date desc);
create index if not exists contributions_org_status_idx on public.real_estate_contributions (organization_id, status);
create index if not exists contributions_public_status_idx on public.real_estate_contributions (status, created_at desc);
create index if not exists service_requests_owner_status_idx on public.service_requests (requester_user_id, status);
create index if not exists service_requests_org_status_idx on public.service_requests (organization_id, status);
create index if not exists invoices_user_status_idx on public.invoices (user_id, status);
create index if not exists invoices_org_status_idx on public.invoices (organization_id, status);
create index if not exists notifications_user_read_idx on public.notifications (user_id, read_at, created_at desc);
create index if not exists support_tickets_owner_status_idx on public.support_tickets (requester_user_id, status);
create index if not exists newsletter_subscribers_created_idx on public.newsletter_subscribers (created_at desc);
create index if not exists audit_logs_entity_idx on public.audit_logs (entity_type, entity_id, created_at desc);

do $$ declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles', 'organizations', 'organization_members', 'real_estate_assets',
    'asset_interests', 'real_estate_contributions', 'contribution_interests',
    'services_catalog', 'service_requests', 'verification_requests',
    'subscriptions', 'invoices', 'payments', 'notifications', 'conversations',
    'conversation_participants', 'messages', 'support_tickets',
    'support_ticket_messages', 'newsletter_subscribers', 'documents', 'platform_settings', 'audit_logs'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end $$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists organizations_set_updated_at on public.organizations;
create trigger organizations_set_updated_at before update on public.organizations for each row execute function public.set_updated_at();
drop trigger if exists assets_set_updated_at on public.real_estate_assets;
create trigger assets_set_updated_at before update on public.real_estate_assets for each row execute function public.set_updated_at();
drop trigger if exists contributions_set_updated_at on public.real_estate_contributions;
create trigger contributions_set_updated_at before update on public.real_estate_contributions for each row execute function public.set_updated_at();
drop trigger if exists services_catalog_set_updated_at on public.services_catalog;
create trigger services_catalog_set_updated_at before update on public.services_catalog for each row execute function public.set_updated_at();
drop trigger if exists service_requests_set_updated_at on public.service_requests;
create trigger service_requests_set_updated_at before update on public.service_requests for each row execute function public.set_updated_at();
drop trigger if exists verification_requests_set_updated_at on public.verification_requests;
create trigger verification_requests_set_updated_at before update on public.verification_requests for each row execute function public.set_updated_at();
drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();
drop trigger if exists invoices_set_updated_at on public.invoices;
create trigger invoices_set_updated_at before update on public.invoices for each row execute function public.set_updated_at();
drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at before update on public.payments for each row execute function public.set_updated_at();
drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at before update on public.conversations for each row execute function public.set_updated_at();
drop trigger if exists support_tickets_set_updated_at on public.support_tickets;
create trigger support_tickets_set_updated_at before update on public.support_tickets for each row execute function public.set_updated_at();

grant usage on schema public to anon, authenticated;
grant select on public.real_estate_assets, public.real_estate_contributions, public.services_catalog to anon;
grant insert on public.newsletter_subscribers to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;

create policy "profiles_select_own" on public.profiles for select to authenticated
using (id = (select auth.uid()));

create policy "profiles_insert_own" on public.profiles for insert to authenticated
with check (id = (select auth.uid()));

create policy "profiles_update_own" on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy "organizations_select_member_or_admin" on public.organizations for select to authenticated
using (
  owner_user_id = (select auth.uid())
  or exists (select 1 from public.organization_members m where m.organization_id = id and m.user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "organizations_insert_owner" on public.organizations for insert to authenticated
with check (owner_user_id = (select auth.uid()));

create policy "organizations_update_owner_or_admin" on public.organizations for update to authenticated
using (
  owner_user_id = (select auth.uid())
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
)
with check (
  owner_user_id = (select auth.uid())
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "organization_members_select_own_org_or_admin" on public.organization_members for select to authenticated
using (
  user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "organization_members_manage_owner_or_admin" on public.organization_members for all to authenticated
using (
  exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
)
with check (
  exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "assets_public_or_owner_select" on public.real_estate_assets for select to anon, authenticated
using (
  status = 'approved'
  or owner_user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "assets_insert_owner_or_org" on public.real_estate_assets for insert to authenticated
with check (
  owner_user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = (select auth.uid()))
);

create policy "assets_update_owner_org_or_admin" on public.real_estate_assets for update to authenticated
using (
  owner_user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
)
with check (
  owner_user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "asset_interests_manage_own" on public.asset_interests for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "contributions_public_or_org_select" on public.real_estate_contributions for select to anon, authenticated
using (
  status = 'approved'
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "contributions_insert_org_member" on public.real_estate_contributions for insert to authenticated
with check (
  exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = (select auth.uid()))
);

create policy "contributions_update_org_or_admin" on public.real_estate_contributions for update to authenticated
using (
  exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
)
with check (
  exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "contribution_interests_manage_own" on public.contribution_interests for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "services_catalog_public_select" on public.services_catalog for select to anon, authenticated
using (active = true or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

create policy "services_catalog_admin_manage" on public.services_catalog for all to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

create policy "service_requests_select_owner_org_or_admin" on public.service_requests for select to authenticated
using (
  requester_user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "service_requests_insert_owner_or_org" on public.service_requests for insert to authenticated
with check (
  requester_user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
);

create policy "service_requests_update_owner_org_or_admin" on public.service_requests for update to authenticated
using (
  requester_user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
)
with check (
  requester_user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "verification_select_owner_org_or_admin" on public.verification_requests for select to authenticated
using (
  requester_user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "verification_insert_owner_or_org" on public.verification_requests for insert to authenticated
with check (
  requester_user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
);

create policy "verification_update_owner_org_or_admin" on public.verification_requests for update to authenticated
using (
  requester_user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
)
with check (
  requester_user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "subscriptions_select_owner_org_or_admin" on public.subscriptions for select to authenticated
using (
  user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "subscriptions_admin_manage" on public.subscriptions for all to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

create policy "invoices_select_owner_org_or_admin" on public.invoices for select to authenticated
using (
  user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "payments_select_owner_org_or_admin" on public.payments for select to authenticated
using (
  user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "payments_insert_owner_or_org" on public.payments for insert to authenticated
with check (
  user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
);

create policy "notifications_select_own_or_org" on public.notifications for select to authenticated
using (
  user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
);

create policy "notifications_update_own_or_org" on public.notifications for update to authenticated
using (
  user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
)
with check (
  user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
);

create policy "conversations_select_participant_or_admin" on public.conversations for select to authenticated
using (
  created_by = (select auth.uid())
  or exists (select 1 from public.conversation_participants cp where cp.conversation_id = id and cp.user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "conversations_insert_creator" on public.conversations for insert to authenticated
with check (created_by = (select auth.uid()));

create policy "conversation_participants_select_own" on public.conversation_participants for select to authenticated
using (
  user_id = (select auth.uid())
  or exists (select 1 from public.conversations c where c.id = conversation_id and c.created_by = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "conversation_participants_insert_creator" on public.conversation_participants for insert to authenticated
with check (
  user_id = (select auth.uid())
  or exists (select 1 from public.conversations c where c.id = conversation_id and c.created_by = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "messages_select_participant_or_admin" on public.messages for select to authenticated
using (
  exists (select 1 from public.conversation_participants cp where cp.conversation_id = conversation_id and cp.user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "messages_insert_participant" on public.messages for insert to authenticated
with check (
  sender_user_id = (select auth.uid())
  and exists (select 1 from public.conversation_participants cp where cp.conversation_id = conversation_id and cp.user_id = (select auth.uid()))
);

create policy "support_tickets_select_owner_org_or_admin" on public.support_tickets for select to authenticated
using (
  requester_user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "support_tickets_insert_owner_or_org" on public.support_tickets for insert to authenticated
with check (
  requester_user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
);

create policy "support_tickets_update_owner_org_or_admin" on public.support_tickets for update to authenticated
using (
  requester_user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
)
with check (
  requester_user_id = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "support_ticket_messages_select_owner_or_admin" on public.support_ticket_messages for select to authenticated
using (
  exists (select 1 from public.support_tickets t where t.id = ticket_id and t.requester_user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "support_ticket_messages_insert_owner_or_admin" on public.support_ticket_messages for insert to authenticated
with check (
  sender_user_id = (select auth.uid())
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "newsletter_subscribers_insert_public" on public.newsletter_subscribers for insert to anon, authenticated
with check (true);

create policy "newsletter_subscribers_admin_select" on public.newsletter_subscribers for select to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

create policy "documents_select_owner_org_or_admin" on public.documents for select to authenticated
using (
  owner_user_id = (select auth.uid())
  or uploaded_by = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

create policy "documents_insert_owner_org" on public.documents for insert to authenticated
with check (
  owner_user_id = (select auth.uid())
  or uploaded_by = (select auth.uid())
  or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = (select auth.uid()))
);

create policy "platform_settings_admin_select" on public.platform_settings for select to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

create policy "platform_settings_admin_manage" on public.platform_settings for all to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

create policy "audit_logs_admin_select" on public.audit_logs for select to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

create policy "audit_logs_admin_insert" on public.audit_logs for insert to authenticated
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
