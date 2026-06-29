create table if not exists public.admin_roles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  scope_ar text not null,
  status text not null default 'active' check (status in ('active', 'limited', 'disabled')),
  permissions_count integer not null default 0,
  users_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_roles_status_idx on public.admin_roles (status, updated_at desc);

drop trigger if exists admin_roles_set_updated_at on public.admin_roles;
create trigger admin_roles_set_updated_at before update on public.admin_roles for each row execute function public.set_updated_at();

alter table public.admin_roles enable row level security;

grant select, insert, update, delete on public.admin_roles to authenticated;

drop policy if exists "admin_roles_admin_select" on public.admin_roles;
create policy "admin_roles_admin_select" on public.admin_roles for select to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

drop policy if exists "admin_roles_admin_manage" on public.admin_roles;
create policy "admin_roles_admin_manage" on public.admin_roles for all to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

insert into public.admin_roles (slug, name_ar, scope_ar, status, permissions_count, users_count, metadata)
values
  ('super-admin', 'مدير النظام العام', 'كل المنصة', 'active', 90, 3, '{"source":"admin_seed"}'),
  ('review-manager', 'مدير المراجعة والاعتماد', 'مركز المراجعة', 'active', 46, 8, '{"source":"admin_seed"}'),
  ('finance-manager', 'المدير المالي', 'المالية والتقارير', 'active', 38, 4, '{"source":"admin_seed"}'),
  ('content-manager', 'مدير المحتوى', 'المحتوى والإعدادات', 'active', 28, 6, '{"source":"admin_seed"}'),
  ('reports-viewer', 'مشاهد التقارير', 'قراءة فقط', 'limited', 12, 12, '{"source":"admin_seed"}')
on conflict (slug) do update set
  name_ar = excluded.name_ar,
  scope_ar = excluded.scope_ar,
  status = excluded.status,
  permissions_count = excluded.permissions_count,
  users_count = excluded.users_count,
  metadata = public.admin_roles.metadata || excluded.metadata,
  updated_at = now();
