create table if not exists public.content_comments (
  id uuid primary key default gen_random_uuid(),
  content_slug text not null,
  content_type text not null check (content_type in ('news', 'article')),
  author_name text not null,
  body_ar text not null,
  status text not null default 'submitted' check (status in ('submitted', 'approved', 'rejected', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_comments_content_idx on public.content_comments (content_type, content_slug, created_at desc);
create index if not exists content_comments_status_idx on public.content_comments (status, created_at desc);

drop trigger if exists content_comments_set_updated_at on public.content_comments;
create trigger content_comments_set_updated_at before update on public.content_comments for each row execute function public.set_updated_at();

alter table public.content_comments enable row level security;

grant select, insert, update, delete on public.content_comments to authenticated;
grant insert on public.content_comments to anon;

drop policy if exists "content_comments_public_insert" on public.content_comments;
create policy "content_comments_public_insert" on public.content_comments for insert to anon, authenticated
with check (
  status = 'submitted'
  and length(trim(author_name)) between 2 and 120
  and length(trim(body_ar)) between 5 and 2000
);

drop policy if exists "content_comments_admin_manage" on public.content_comments;
create policy "content_comments_admin_manage" on public.content_comments for all to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
