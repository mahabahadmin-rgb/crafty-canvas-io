drop policy if exists "support_ticket_messages_select_owner_or_admin" on public.support_ticket_messages;
create policy "support_ticket_messages_select_owner_org_or_admin"
on public.support_ticket_messages for select
to authenticated
using (
  exists (
    select 1
    from public.support_tickets t
    where t.id = ticket_id
      and (
        t.requester_user_id = (select auth.uid())
        or exists (
          select 1
          from public.organizations o
          where o.id = t.organization_id
            and o.owner_user_id = (select auth.uid())
        )
        or exists (
          select 1
          from public.organization_members m
          where m.organization_id = t.organization_id
            and m.user_id = (select auth.uid())
        )
        or exists (
          select 1
          from public.profiles p
          where p.id = (select auth.uid())
            and p.role = 'admin'
        )
      )
  )
);

drop policy if exists "support_ticket_messages_insert_owner_or_admin" on public.support_ticket_messages;
create policy "support_ticket_messages_insert_owner_org_or_admin"
on public.support_ticket_messages for insert
to authenticated
with check (
  sender_user_id = (select auth.uid())
  and exists (
    select 1
    from public.support_tickets t
    where t.id = ticket_id
      and (
        t.requester_user_id = (select auth.uid())
        or exists (
          select 1
          from public.organizations o
          where o.id = t.organization_id
            and o.owner_user_id = (select auth.uid())
        )
        or exists (
          select 1
          from public.organization_members m
          where m.organization_id = t.organization_id
            and m.user_id = (select auth.uid())
        )
        or exists (
          select 1
          from public.profiles p
          where p.id = (select auth.uid())
            and p.role = 'admin'
        )
      )
  )
);
