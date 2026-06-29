insert into public.audit_logs (actor_user_id, organization_id, action, entity_type, entity_id, metadata, created_at)
values
  ('33333333-3333-4333-8333-333333333333', null, 'admin_login_success', 'session', null, '{"actorName":"أحمد محمد السبيعي","target":"لوحة التحكم","ip":"188.48.21.10","status":"ناجح"}', now() - interval '2 hours'),
  ('33333333-3333-4333-8333-333333333333', null, 'review_approved', 'real_estate_asset', null, '{"actorName":"نورة عبدالله الحربي","target":"AS-2026-0043","ip":"188.48.21.11","status":"ناجح"}', now() - interval '3 hours'),
  ('33333333-3333-4333-8333-333333333333', null, 'financial_report_exported', 'report', null, '{"actorName":"خالد عبدالعزيز","target":"RPT-9004","ip":"188.48.21.18","status":"مراجعة"}', now() - interval '1 day'),
  (null, null, 'admin_login_rejected', 'session', null, '{"actorName":"غير معروف","target":"admin@mahabah.sa","ip":"91.204.12.7","status":"مرفوض"}', now() - interval '1 day 4 hours'),
  ('33333333-3333-4333-8333-333333333333', null, 'role_permissions_updated', 'admin_role', null, '{"actorName":"مدير النظام العام","target":"مدير المحتوى","ip":"188.48.21.10","status":"حساس"}', now() - interval '2 days'),
  ('33333333-3333-4333-8333-333333333333', null, 'content_status', 'content_item', null, '{"actorName":"فريق المحتوى","target":"الصفحة الرئيسية","ip":"188.48.21.14","status":"ناجح"}', now() - interval '3 days')
on conflict do nothing;
