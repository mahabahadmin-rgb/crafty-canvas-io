insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'mahabah-documents',
  'mahabah-documents',
  false,
  10485760,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
)
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create index if not exists documents_owner_entity_idx
on public.documents (owner_user_id, organization_id, entity_type, entity_id, created_at desc);

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
      and exists (
        select 1
        from public.organizations o
        where o.id::text = (storage.foldername(name))[2]
          and o.owner_user_id = (select auth.uid())
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
      and exists (
        select 1
        from public.organizations o
        where o.id::text = (storage.foldername(name))[2]
          and o.owner_user_id = (select auth.uid())
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
      and exists (
        select 1
        from public.organizations o
        where o.id::text = (storage.foldername(name))[2]
          and o.owner_user_id = (select auth.uid())
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
      and exists (
        select 1
        from public.organizations o
        where o.id::text = (storage.foldername(name))[2]
          and o.owner_user_id = (select auth.uid())
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
      and exists (
        select 1
        from public.organizations o
        where o.id::text = (storage.foldername(name))[2]
          and o.owner_user_id = (select auth.uid())
      )
    )
    or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
  )
);
