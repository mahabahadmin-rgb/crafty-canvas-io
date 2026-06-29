create table if not exists public.saved_content (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  content_type text not null check (content_type in ('news', 'article')),
  content_slug text not null,
  title_ar text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, content_type, content_slug)
);

create index if not exists saved_content_user_created_idx on public.saved_content (user_id, created_at desc);
create index if not exists saved_content_type_slug_idx on public.saved_content (content_type, content_slug);

drop trigger if exists saved_content_set_updated_at on public.saved_content;
create trigger saved_content_set_updated_at before update on public.saved_content for each row execute function public.set_updated_at();

alter table public.saved_content enable row level security;

grant select, insert, update, delete on public.saved_content to authenticated;

drop policy if exists "saved_content_owner_select" on public.saved_content;
create policy "saved_content_owner_select"
on public.saved_content for select
to authenticated
using (
  user_id = (select auth.uid())
  or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
);

drop policy if exists "saved_content_owner_insert" on public.saved_content;
create policy "saved_content_owner_insert"
on public.saved_content for insert
to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "saved_content_owner_update" on public.saved_content;
create policy "saved_content_owner_update"
on public.saved_content for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists "saved_content_owner_delete" on public.saved_content;
create policy "saved_content_owner_delete"
on public.saved_content for delete
to authenticated
using (user_id = (select auth.uid()));
