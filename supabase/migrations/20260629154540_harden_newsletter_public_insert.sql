-- Harden the public newsletter endpoint policy. The website form writes through
-- the server service client, but keeping the anon policy constrained avoids
-- broad arbitrary inserts if the Data API is used directly.

alter table public.newsletter_subscribers enable row level security;

grant insert on public.newsletter_subscribers to anon;
grant select, insert, update, delete on public.newsletter_subscribers to authenticated;

drop policy if exists "newsletter_subscribers_insert_public" on public.newsletter_subscribers;
create policy "newsletter_subscribers_insert_public"
on public.newsletter_subscribers
for insert
to anon, authenticated
with check (
  email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  and char_length(email) <= 320
  and coalesce(source, 'website') in ('website', 'content_detail_page', 'contact_page', 'footer')
  and confirmed_at is null
);

drop policy if exists "newsletter_subscribers_admin_select" on public.newsletter_subscribers;
create policy "newsletter_subscribers_admin_select"
on public.newsletter_subscribers
for select
to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
