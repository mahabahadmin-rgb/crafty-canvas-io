-- Keep dashboard backend tables exposed consistently through the Supabase Data API.
-- Supabase projects created after 2026-04-28 may not expose new public tables automatically.

grant usage on schema public to anon, authenticated;

grant select on public.service_providers, public.content_items to anon;
grant insert on public.content_comments to anon;

grant select, insert, update, delete on public.service_providers to authenticated;
grant select, insert, update, delete on public.content_items to authenticated;
grant select, insert, update, delete on public.admin_roles to authenticated;
grant select, insert, update, delete on public.content_comments to authenticated;
grant select, insert, update on public.conversations to authenticated;
grant select, insert on public.conversation_participants to authenticated;
grant select, insert on public.messages to authenticated;
grant select, insert, update on public.support_tickets to authenticated;
grant select, insert on public.support_ticket_messages to authenticated;
grant select, insert, update on public.notifications to authenticated;
grant select, insert, update, delete on public.documents to authenticated;
grant select, insert, update, delete on public.platform_settings to authenticated;
grant select, insert on public.audit_logs to authenticated;
grant select, insert, update on public.subscriptions to authenticated;
grant select, insert, update on public.invoices to authenticated;
grant select, insert, update on public.payments to authenticated;

alter table public.service_providers enable row level security;
alter table public.content_items enable row level security;
alter table public.admin_roles enable row level security;
alter table public.content_comments enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_ticket_messages enable row level security;
alter table public.notifications enable row level security;
alter table public.documents enable row level security;
alter table public.platform_settings enable row level security;
alter table public.audit_logs enable row level security;
alter table public.subscriptions enable row level security;
alter table public.invoices enable row level security;
alter table public.payments enable row level security;

drop policy if exists "content_comments_approved_public_select" on public.content_comments;
create policy "content_comments_approved_public_select"
on public.content_comments for select
to anon, authenticated
using (status = 'approved');

drop policy if exists "content_comments_admin_select" on public.content_comments;
create policy "content_comments_admin_select"
on public.content_comments for select
to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

drop policy if exists "invoices_admin_update" on public.invoices;
create policy "invoices_admin_update"
on public.invoices for update
to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

drop policy if exists "payments_admin_update" on public.payments;
create policy "payments_admin_update"
on public.payments for update
to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

drop policy if exists "subscriptions_admin_update" on public.subscriptions;
create policy "subscriptions_admin_update"
on public.subscriptions for update
to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
