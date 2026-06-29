alter table public.documents
add column if not exists entity_ref text;

create index if not exists documents_entity_ref_idx
on public.documents (entity_type, entity_ref, created_at desc)
where entity_ref is not null;
