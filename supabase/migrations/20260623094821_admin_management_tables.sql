create table if not exists public.service_providers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  category_ar text not null,
  city_ar text not null,
  contact text,
  license_number text,
  status public.review_status not null default 'submitted',
  rating numeric(3,2) not null default 0,
  requests_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_ar text not null,
  kind text not null check (kind in ('page', 'article', 'category', 'media', 'banner', 'faq', 'partner')),
  status text not null default 'draft' check (status in ('published', 'draft', 'review', 'archived')),
  category_ar text,
  author_ar text,
  excerpt_ar text,
  body_ar text,
  view_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists service_providers_status_idx on public.service_providers (status, updated_at desc);
create index if not exists service_providers_category_idx on public.service_providers (category_ar);
create index if not exists content_items_kind_status_idx on public.content_items (kind, status, updated_at desc);
create index if not exists content_items_category_idx on public.content_items (category_ar);

drop trigger if exists service_providers_set_updated_at on public.service_providers;
create trigger service_providers_set_updated_at before update on public.service_providers for each row execute function public.set_updated_at();

drop trigger if exists content_items_set_updated_at on public.content_items;
create trigger content_items_set_updated_at before update on public.content_items for each row execute function public.set_updated_at();

alter table public.service_providers enable row level security;
alter table public.content_items enable row level security;

grant select on public.service_providers, public.content_items to anon;
grant select, insert, update, delete on public.service_providers, public.content_items to authenticated;

drop policy if exists "service_providers_public_or_admin_select" on public.service_providers;
create policy "service_providers_public_or_admin_select" on public.service_providers for select to anon, authenticated
using (
  status = 'approved'
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

drop policy if exists "service_providers_admin_manage" on public.service_providers;
create policy "service_providers_admin_manage" on public.service_providers for all to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

drop policy if exists "content_items_public_or_admin_select" on public.content_items;
create policy "content_items_public_or_admin_select" on public.content_items for select to anon, authenticated
using (
  status = 'published'
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

drop policy if exists "content_items_admin_manage" on public.content_items;
create policy "content_items_admin_manage" on public.content_items for all to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

insert into public.service_providers (slug, name_ar, category_ar, city_ar, contact, license_number, status, rating, requests_count, metadata)
values
  ('ruaa-real-estate', 'شركة رؤى العقارية', 'تقييم عقاري', 'الرياض', '+966 50 200 1001', 'SP-2026-001', 'approved', 4.8, 42, '{"source":"admin_seed"}'),
  ('wathiq-consulting', 'مكتب واثق للاستشارات', 'دراسات جدوى', 'جدة', '+966 50 200 1002', 'SP-2026-002', 'approved', 4.7, 38, '{"source":"admin_seed"}'),
  ('abad-engineering', 'شركة أبعاد للاستشارات', 'هندسة', 'الدمام', '+966 50 200 1003', 'SP-2026-003', 'submitted', 4.4, 21, '{"source":"admin_seed"}'),
  ('binaa-integrated', 'مكتب البناء المتكامل', 'إدارة مشاريع', 'الرياض', '+966 50 200 1004', 'SP-2026-004', 'rejected', 3.9, 12, '{"source":"admin_seed"}')
on conflict (slug) do update set
  name_ar = excluded.name_ar,
  category_ar = excluded.category_ar,
  city_ar = excluded.city_ar,
  contact = excluded.contact,
  license_number = excluded.license_number,
  status = excluded.status,
  rating = excluded.rating,
  requests_count = excluded.requests_count,
  metadata = public.service_providers.metadata || excluded.metadata,
  updated_at = now();

insert into public.content_items (slug, title_ar, kind, status, category_ar, author_ar, excerpt_ar, body_ar, view_count, metadata)
values
  ('home', 'الصفحة الرئيسية', 'page', 'published', 'صفحات الموقع', 'فريق المحتوى', 'واجهة منصة مهابة الرئيسية.', 'محتوى الصفحة الرئيسية لمنصة مهابة.', 12430, '{"source":"admin_seed"}'),
  ('about', 'من نحن', 'page', 'published', 'صفحات تعريفية', 'إدارة المنصة', 'تعريف بمنصة مهابة ورسالتها.', 'محتوى صفحة من نحن.', 4820, '{"source":"admin_seed"}'),
  ('real-estate-investment-guide', 'دليل الاستثمار العقاري', 'article', 'review', 'مقالات', 'سارة العتيبي', 'دليل عملي لفهم فرص الاستثمار العقاري.', 'مسودة مقال دليل الاستثمار العقاري.', 1245, '{"source":"admin_seed"}'),
  ('terms', 'شروط الاستخدام', 'page', 'draft', 'سياسات', 'الشؤون القانونية', 'شروط استخدام منصة مهابة.', 'محتوى شروط الاستخدام.', 980, '{"source":"admin_seed"}'),
  ('riyadh-market-update', 'تحديثات سوق الرياض', 'article', 'published', 'أخبار', 'محمد الشهري', 'قراءة موجزة لتحديثات سوق الرياض.', 'محتوى خبر تحديثات سوق الرياض.', 3118, '{"source":"admin_seed"}'),
  ('faq', 'الأسئلة الشائعة', 'page', 'published', 'مساعدة', 'الدعم', 'إجابات الأسئلة المتكررة.', 'محتوى الأسئلة الشائعة.', 6540, '{"source":"admin_seed"}')
on conflict (slug) do update set
  title_ar = excluded.title_ar,
  kind = excluded.kind,
  status = excluded.status,
  category_ar = excluded.category_ar,
  author_ar = excluded.author_ar,
  excerpt_ar = excluded.excerpt_ar,
  body_ar = excluded.body_ar,
  view_count = excluded.view_count,
  metadata = public.content_items.metadata || excluded.metadata,
  updated_at = now();
