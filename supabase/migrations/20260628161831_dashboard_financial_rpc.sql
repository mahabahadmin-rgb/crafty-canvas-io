create or replace function public.pay_dashboard_invoice(
  p_invoice_id uuid default null,
  p_invoice_number text default null,
  p_owner_user_id uuid default null,
  p_organization_id uuid default null,
  p_method text default 'mada',
  p_actor_user_id uuid default null,
  p_scope text default 'individual'
)
returns table (
  payment_id uuid,
  invoice_id uuid,
  invoice_number text,
  invoice_title_ar text,
  amount_sar numeric,
  invoice_user_id uuid,
  invoice_organization_id uuid,
  payment_reference text,
  already_paid boolean
)
language plpgsql
set search_path = public
as $$
declare
  invoice_record public.invoices%rowtype;
  payment_record public.payments%rowtype;
  generated_reference text;
begin
  if p_invoice_id is null and nullif(trim(coalesce(p_invoice_number, '')), '') is null then
    return;
  end if;

  select *
  into invoice_record
  from public.invoices i
  where (p_invoice_id is null or i.id = p_invoice_id)
    and (p_invoice_id is not null or i.invoice_number = p_invoice_number)
    and (
      (p_organization_id is not null and i.organization_id = p_organization_id)
      or (p_organization_id is null and p_owner_user_id is not null and i.user_id = p_owner_user_id)
    )
  order by i.created_at desc
  limit 1
  for update;

  if not found then
    return;
  end if;

  if invoice_record.status = 'paid' then
    select *
    into payment_record
    from public.payments p
    where p.invoice_id = invoice_record.id
      and p.status = 'succeeded'
    order by p.created_at desc
    limit 1;

    return query
    select
      payment_record.id,
      invoice_record.id,
      invoice_record.invoice_number,
      invoice_record.title_ar,
      invoice_record.amount_sar,
      invoice_record.user_id,
      invoice_record.organization_id,
      payment_record.provider_reference,
      true;
    return;
  end if;

  generated_reference := 'PAY-' || floor(extract(epoch from clock_timestamp()) * 1000)::bigint::text;

  update public.invoices
  set
    status = 'paid',
    paid_at = clock_timestamp(),
    updated_at = clock_timestamp()
  where id = invoice_record.id
  returning * into invoice_record;

  insert into public.payments (
    invoice_id,
    user_id,
    organization_id,
    amount_sar,
    method,
    status,
    provider_reference,
    paid_at
  )
  values (
    invoice_record.id,
    invoice_record.user_id,
    invoice_record.organization_id,
    invoice_record.amount_sar,
    p_method,
    'succeeded',
    generated_reference,
    clock_timestamp()
  )
  returning * into payment_record;

  insert into public.audit_logs (
    actor_user_id,
    organization_id,
    action,
    entity_type,
    entity_id,
    metadata
  )
  values (
    coalesce(p_actor_user_id, invoice_record.user_id),
    invoice_record.organization_id,
    'invoice_paid',
    'invoice',
    invoice_record.id,
    jsonb_build_object(
      'paymentId', payment_record.id,
      'paymentReference', generated_reference,
      'invoiceNumber', invoice_record.invoice_number,
      'amount', invoice_record.amount_sar,
      'method', p_method,
      'scope', p_scope
    )
  );

  insert into public.notifications (
    user_id,
    organization_id,
    title_ar,
    body_ar,
    category,
    action_url
  )
  values (
    invoice_record.user_id,
    invoice_record.organization_id,
    'تم سداد فاتورة',
    'تم سداد ' || invoice_record.title_ar || ' بنجاح.',
    'financial',
    case when p_scope = 'business' then '/dashboard/business/invoices' else '/dashboard/individual/invoices' end
  );

  return query
  select
    payment_record.id,
    invoice_record.id,
    invoice_record.invoice_number,
    invoice_record.title_ar,
    invoice_record.amount_sar,
    invoice_record.user_id,
    invoice_record.organization_id,
    generated_reference,
    false;
end;
$$;

revoke all on function public.pay_dashboard_invoice(uuid, text, uuid, uuid, text, uuid, text) from public;
revoke all on function public.pay_dashboard_invoice(uuid, text, uuid, uuid, text, uuid, text) from anon;
revoke all on function public.pay_dashboard_invoice(uuid, text, uuid, uuid, text, uuid, text) from authenticated;
grant execute on function public.pay_dashboard_invoice(uuid, text, uuid, uuid, text, uuid, text) to service_role;
