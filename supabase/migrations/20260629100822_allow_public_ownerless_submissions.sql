alter table public.real_estate_assets
  drop constraint if exists real_estate_assets_owner_required;

alter table public.real_estate_assets
  add constraint real_estate_assets_owner_required
  check (
    owner_user_id is not null
    or organization_id is not null
    or metadata ->> 'source' = 'public'
  );

alter table public.service_requests
  drop constraint if exists service_requests_owner_required;

alter table public.service_requests
  add constraint service_requests_owner_required
  check (
    requester_user_id is not null
    or organization_id is not null
    or metadata ->> 'source' = 'public'
  );
