-- Backend policy hardening for dashboard actions that are now wired to Supabase.
-- Keep this migration idempotent because the project already has several policy migrations.

grant select, insert, update, delete on public.documents to authenticated;
grant select, insert, update on public.conversations to authenticated;
grant select, insert, update on public.notifications to authenticated;
grant select on public.subscriptions, public.invoices, public.payments to authenticated;
grant insert on public.support_tickets, public.support_ticket_messages to anon;

create index if not exists notifications_org_read_idx
on public.notifications (organization_id, read_at, created_at desc);

create index if not exists documents_entity_ref_owner_idx
on public.documents (entity_ref, owner_user_id, organization_id, created_at desc)
where entity_ref is not null;

drop policy if exists "support_tickets_public_contact_insert" on public.support_tickets;
create policy "support_tickets_public_contact_insert"
on public.support_tickets for insert
to anon, authenticated
with check (
  requester_user_id is null
  and organization_id is null
  and category = 'contact'
);

drop policy if exists "conversations_update_participant_or_admin" on public.conversations;
create policy "conversations_update_participant_or_admin"
on public.conversations for update
to authenticated
using (
  created_by = (select auth.uid())
  or exists (
    select 1
    from public.conversation_participants cp
    where cp.conversation_id = id
      and cp.user_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
  )
)
with check (
  created_by = (select auth.uid())
  or exists (
    select 1
    from public.conversation_participants cp
    where cp.conversation_id = id
      and cp.user_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
  )
);

drop policy if exists "documents_update_owner_org_or_admin" on public.documents;
create policy "documents_update_owner_org_or_admin"
on public.documents for update
to authenticated
using (
  owner_user_id = (select auth.uid())
  or uploaded_by = (select auth.uid())
  or exists (
    select 1
    from public.organizations o
    where o.id = organization_id
      and o.owner_user_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.organization_members m
    where m.organization_id = organization_id
      and m.user_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
  )
)
with check (
  owner_user_id = (select auth.uid())
  or uploaded_by = (select auth.uid())
  or exists (
    select 1
    from public.organizations o
    where o.id = organization_id
      and o.owner_user_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.organization_members m
    where m.organization_id = organization_id
      and m.user_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
  )
);

drop policy if exists "documents_delete_owner_org_or_admin" on public.documents;
create policy "documents_delete_owner_org_or_admin"
on public.documents for delete
to authenticated
using (
  owner_user_id = (select auth.uid())
  or uploaded_by = (select auth.uid())
  or exists (
    select 1
    from public.organizations o
    where o.id = organization_id
      and o.owner_user_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.organization_members m
    where m.organization_id = organization_id
      and m.user_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
  )
);

drop policy if exists "mahabah_documents_storage_select" on storage.objects;
create policy "mahabah_documents_storage_select"
on storage.objects for select
to authenticated
using (
  bucket_id = 'mahabah-documents'
  and (
    ((storage.foldername(name))[1] = 'users' and (storage.foldername(name))[2] = (select auth.uid())::text)
    or (
      (storage.foldername(name))[1] = 'organizations'
      and (
        exists (
          select 1
          from public.organizations o
          where o.id::text = (storage.foldername(name))[2]
            and o.owner_user_id = (select auth.uid())
        )
        or exists (
          select 1
          from public.organization_members m
          where m.organization_id::text = (storage.foldername(name))[2]
            and m.user_id = (select auth.uid())
        )
      )
    )
    or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
  )
);

drop policy if exists "mahabah_documents_storage_insert" on storage.objects;
create policy "mahabah_documents_storage_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'mahabah-documents'
  and (
    ((storage.foldername(name))[1] = 'users' and (storage.foldername(name))[2] = (select auth.uid())::text)
    or (
      (storage.foldername(name))[1] = 'organizations'
      and (
        exists (
          select 1
          from public.organizations o
          where o.id::text = (storage.foldername(name))[2]
            and o.owner_user_id = (select auth.uid())
        )
        or exists (
          select 1
          from public.organization_members m
          where m.organization_id::text = (storage.foldername(name))[2]
            and m.user_id = (select auth.uid())
        )
      )
    )
    or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
  )
);

drop policy if exists "mahabah_documents_storage_update" on storage.objects;
create policy "mahabah_documents_storage_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'mahabah-documents'
  and (
    ((storage.foldername(name))[1] = 'users' and (storage.foldername(name))[2] = (select auth.uid())::text)
    or (
      (storage.foldername(name))[1] = 'organizations'
      and (
        exists (
          select 1
          from public.organizations o
          where o.id::text = (storage.foldername(name))[2]
            and o.owner_user_id = (select auth.uid())
        )
        or exists (
          select 1
          from public.organization_members m
          where m.organization_id::text = (storage.foldername(name))[2]
            and m.user_id = (select auth.uid())
        )
      )
    )
    or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
  )
)
with check (
  bucket_id = 'mahabah-documents'
  and (
    ((storage.foldername(name))[1] = 'users' and (storage.foldername(name))[2] = (select auth.uid())::text)
    or (
      (storage.foldername(name))[1] = 'organizations'
      and (
        exists (
          select 1
          from public.organizations o
          where o.id::text = (storage.foldername(name))[2]
            and o.owner_user_id = (select auth.uid())
        )
        or exists (
          select 1
          from public.organization_members m
          where m.organization_id::text = (storage.foldername(name))[2]
            and m.user_id = (select auth.uid())
        )
      )
    )
    or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
  )
);

drop policy if exists "mahabah_documents_storage_delete" on storage.objects;
create policy "mahabah_documents_storage_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'mahabah-documents'
  and (
    ((storage.foldername(name))[1] = 'users' and (storage.foldername(name))[2] = (select auth.uid())::text)
    or (
      (storage.foldername(name))[1] = 'organizations'
      and (
        exists (
          select 1
          from public.organizations o
          where o.id::text = (storage.foldername(name))[2]
            and o.owner_user_id = (select auth.uid())
        )
        or exists (
          select 1
          from public.organization_members m
          where m.organization_id::text = (storage.foldername(name))[2]
            and m.user_id = (select auth.uid())
        )
      )
    )
    or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
  )
);

drop policy if exists "support_ticket_messages_insert_owner_org_or_admin" on public.support_ticket_messages;
drop policy if exists "support_ticket_messages_insert_owner_or_admin" on public.support_ticket_messages;
create policy "support_ticket_messages_insert_owner_org_or_admin"
on public.support_ticket_messages for insert
to anon, authenticated
with check (
  (
    sender_user_id is null
    and exists (
      select 1
      from public.support_tickets t
      where t.id = ticket_id
        and t.requester_user_id is null
        and t.organization_id is null
        and t.category = 'contact'
    )
  )
  or (
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
  )
);
