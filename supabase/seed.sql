insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'ahmed.abdullah@example.com',
    crypt('Mahabah2026!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"account_role":"individual"}',
    '{"display_name":"أحمد عبدالله"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'info@alazdehar.sa',
    crypt('Mahabah2026!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"account_role":"business"}',
    '{"display_name":"شركة الازدهار العقارية"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@mahabah.sa',
    crypt('Mahabah2026!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"account_role":"admin"}',
    '{"display_name":"إدارة مهابة"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
on conflict (id) do update set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = now();

insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    '11111111-1111-4111-8111-111111111111',
    'ahmed.abdullah@example.com',
    '{"sub":"11111111-1111-4111-8111-111111111111","email":"ahmed.abdullah@example.com"}',
    'email',
    now(),
    now(),
    now()
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '22222222-2222-4222-8222-222222222222',
    'info@alazdehar.sa',
    '{"sub":"22222222-2222-4222-8222-222222222222","email":"info@alazdehar.sa"}',
    'email',
    now(),
    now(),
    now()
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    '33333333-3333-4333-8333-333333333333',
    'admin@mahabah.sa',
    '{"sub":"33333333-3333-4333-8333-333333333333","email":"admin@mahabah.sa"}',
    'email',
    now(),
    now(),
    now()
  )
on conflict (provider_id, provider) do update set
  user_id = excluded.user_id,
  identity_data = excluded.identity_data,
  updated_at = now();

insert into public.profiles (id, role, full_name, email, phone, city_ar, avatar_url, verification_status, profile_completion)
values
  ('11111111-1111-4111-8111-111111111111', 'individual', 'أحمد عبدالله', 'ahmed.abdullah@example.com', '+966 50 123 4567', 'الرياض', null, 'approved', 85),
  ('22222222-2222-4222-8222-222222222222', 'business', 'شركة الازدهار العقارية', 'info@alazdehar.sa', '+966 50 123 4567', 'الرياض', '/brand/mahabah-icon-192.png', 'approved', 96),
  ('33333333-3333-4333-8333-333333333333', 'admin', 'إدارة مهابة', 'admin@mahabah.sa', '+966 55 555 0000', 'الرياض', '/brand/mahabah-icon-192.png', 'approved', 100)
on conflict (id) do update set
  role = excluded.role,
  full_name = excluded.full_name,
  email = excluded.email,
  phone = excluded.phone,
  city_ar = excluded.city_ar,
  avatar_url = excluded.avatar_url,
  verification_status = excluded.verification_status,
  profile_completion = excluded.profile_completion,
  updated_at = now();

insert into public.organizations (
  id, owner_user_id, name_ar, commercial_registration, activity_type_ar, city_ar,
  email, phone, website, logo_url, status, verification_status, profile_completion
)
values (
  '44444444-4444-4444-8444-444444444444',
  '22222222-2222-4222-8222-222222222222',
  'شركة الازدهار العقارية',
  '1010123456',
  'إدارة المساهمات العقارية',
  'الرياض',
  'info@alazdehar.sa',
  '+966 50 123 4567',
  'www.alazdehar.sa',
  '/brand/mahabah-icon-192.png',
  'approved',
  'approved',
  96
)
on conflict (id) do update set
  name_ar = excluded.name_ar,
  commercial_registration = excluded.commercial_registration,
  activity_type_ar = excluded.activity_type_ar,
  city_ar = excluded.city_ar,
  email = excluded.email,
  phone = excluded.phone,
  website = excluded.website,
  logo_url = excluded.logo_url,
  status = excluded.status,
  verification_status = excluded.verification_status,
  profile_completion = excluded.profile_completion,
  updated_at = now();

insert into public.organization_members (organization_id, user_id, member_role)
values ('44444444-4444-4444-8444-444444444444', '22222222-2222-4222-8222-222222222222', 'owner')
on conflict (organization_id, user_id) do update set member_role = excluded.member_role;

insert into public.services_catalog (id, slug, title_ar, description_ar, duration_ar, level_ar, outputs_ar, price_sar, active)
values
  ('50000000-0000-4000-8000-000000000001', 'initial-real-estate-consultation', 'استشارة عقارية أولية', 'جلسة أولية لفهم الأصل العقاري وتحديد الفرص والتحديات.', '1 - 3 أيام عمل', 'أساسية', 'ملخص أولي', 500, true),
  ('50000000-0000-4000-8000-000000000002', 'detailed-real-estate-consultation', 'استشارة عقارية مفصلة', 'تحليل متكامل للأصل أو المشروع العقاري يتضمن دراسة الفرص والتحديات والتوصيات الاستثمارية.', '5 - 10 أيام عمل', 'متقدمة', 'تقرير شامل', 2500, true),
  ('50000000-0000-4000-8000-000000000003', 'real-estate-valuation', 'تقييم عقاري', 'تقدير القيمة السوقية للأصل العقاري بواسطة جهة متخصصة.', '5 - 7 أيام عمل', 'متوسطة', 'تقرير تقييم', 1500, true)
on conflict (slug) do update set
  title_ar = excluded.title_ar,
  description_ar = excluded.description_ar,
  duration_ar = excluded.duration_ar,
  level_ar = excluded.level_ar,
  outputs_ar = excluded.outputs_ar,
  price_sar = excluded.price_sar,
  active = excluded.active,
  updated_at = now();

insert into public.real_estate_assets (
  id, owner_user_id, organization_id, title_ar, slug, city_ar, district_ar, asset_type_ar,
  usage_type_ar, area_sqm, estimated_value_sar, price_per_sqm, street_width_m,
  frontage_count, deed_number, listing_date, status, image_url, gallery, excerpt_ar
)
values
  (
    '60000000-0000-4000-8000-000000000001',
    '11111111-1111-4111-8111-111111111111',
    null,
    'أرض سكنية شمال الرياض',
    'north-riyadh-residential-land',
    'الرياض',
    'حي الياسمين',
    'أرض سكنية',
    'سكني',
    8125,
    66000000,
    8125,
    40,
    1,
    '394829001234',
    '2026-05-22',
    'submitted',
    '/images/asset-land-masterplan.png',
    '["/images/asset-land-masterplan.png","/images/hero-raw-land.png","/images/hero-panorama.png"]',
    'أرض سكنية تقع في شمال مدينة الرياض ضمن نطاق عمراني نام وقريب من الطرق الرئيسية والخدمات الحيوية.'
  ),
  (
    '60000000-0000-4000-8000-000000000002',
    null,
    '44444444-4444-4444-8444-444444444444',
    'مجمع تجاري بطريق الملك فهد',
    'king-fahd-commercial-complex',
    'الرياض',
    'حي العليا',
    'أصل قائم',
    'تجاري',
    4680,
    24500000,
    5235,
    36,
    2,
    '4100987654',
    '2026-05-19',
    'approved',
    '/images/asset-commercial-complex.png',
    '["/images/asset-commercial-complex.png","/images/asset-tower.png"]',
    'أصل تجاري على محور رئيسي مرشح لتطوير مشروع مكتبي أو تجاري متوسط الحجم.'
  ),
  (
    '60000000-0000-4000-8000-000000000003',
    null,
    '44444444-4444-4444-8444-444444444444',
    'أرض خام بالدمام',
    'dammam-raw-land',
    'الدمام',
    'حي الشاطئ',
    'أرض خام',
    'استثماري',
    12000,
    38000000,
    3166,
    30,
    2,
    '2200543210',
    '2026-05-14',
    'in_review',
    '/images/hero-raw-land.png',
    '["/images/hero-raw-land.png","/images/final-cta-map-building.png"]',
    'أرض خام قابلة للدراسة وإعادة التخطيط بما يتوافق مع فرص التطوير في المنطقة الشرقية.'
  )
on conflict (slug) do update set
  owner_user_id = excluded.owner_user_id,
  organization_id = excluded.organization_id,
  title_ar = excluded.title_ar,
  city_ar = excluded.city_ar,
  district_ar = excluded.district_ar,
  asset_type_ar = excluded.asset_type_ar,
  usage_type_ar = excluded.usage_type_ar,
  area_sqm = excluded.area_sqm,
  estimated_value_sar = excluded.estimated_value_sar,
  price_per_sqm = excluded.price_per_sqm,
  street_width_m = excluded.street_width_m,
  frontage_count = excluded.frontage_count,
  deed_number = excluded.deed_number,
  listing_date = excluded.listing_date,
  status = excluded.status,
  image_url = excluded.image_url,
  gallery = excluded.gallery,
  excerpt_ar = excluded.excerpt_ar,
  updated_at = now();

insert into public.real_estate_contributions (
  id, organization_id, asset_id, title_ar, slug, city_ar, stage_ar, capital_sar,
  investors_count, duration_months, funded_percent, expected_return_percent,
  remaining_days, license_number, offering_url, status, image_url, excerpt_ar, timeline
)
values
  (
    '70000000-0000-4000-8000-000000000001',
    '44444444-4444-4444-8444-444444444444',
    '60000000-0000-4000-8000-000000000002',
    'مساهمة النخيل العقارية',
    'nakheel-real-estate-contribution',
    'الرياض',
    'تحت الطرح',
    250000000,
    1200,
    24,
    72,
    18,
    16,
    'LIC-2026-00125',
    'https://offering.company.sa/contribution/001',
    'approved',
    '/images/business-pages-hero-sketch.png',
    'مساهمة تطويرية منظمة لمجمع تجاري في الرياض وفق أعلى معايير الحوكمة والإفصاح.',
    '[{"labelAr":"الاكتتاب","completed":true},{"labelAr":"التطوير","completed":false,"current":true}]'
  ),
  (
    '70000000-0000-4000-8000-000000000002',
    '44444444-4444-4444-8444-444444444444',
    '60000000-0000-4000-8000-000000000003',
    'مساهمة الواحة العقارية',
    'alwaha-real-estate-contribution',
    'جدة',
    'قيد الترخيص',
    180000000,
    860,
    18,
    56,
    16,
    32,
    'LIC-2026-00234',
    'https://offering.company.sa/contribution/002',
    'in_review',
    '/images/contribution-request-hero-sketch.png',
    'مساهمة قيد الترخيص لتطوير وحدات تجارية وإدارية متوسطة الحجم.',
    '[{"labelAr":"الدراسة","completed":true},{"labelAr":"الترخيص","completed":false,"current":true}]'
  )
on conflict (slug) do update set
  organization_id = excluded.organization_id,
  asset_id = excluded.asset_id,
  title_ar = excluded.title_ar,
  city_ar = excluded.city_ar,
  stage_ar = excluded.stage_ar,
  capital_sar = excluded.capital_sar,
  investors_count = excluded.investors_count,
  duration_months = excluded.duration_months,
  funded_percent = excluded.funded_percent,
  expected_return_percent = excluded.expected_return_percent,
  remaining_days = excluded.remaining_days,
  license_number = excluded.license_number,
  offering_url = excluded.offering_url,
  status = excluded.status,
  image_url = excluded.image_url,
  excerpt_ar = excluded.excerpt_ar,
  timeline = excluded.timeline,
  updated_at = now();

insert into public.asset_interests (asset_id, user_id)
values
  ('60000000-0000-4000-8000-000000000002', '11111111-1111-4111-8111-111111111111'),
  ('60000000-0000-4000-8000-000000000003', '11111111-1111-4111-8111-111111111111'),
  ('60000000-0000-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222')
on conflict (asset_id, user_id) do nothing;

insert into public.contribution_interests (contribution_id, user_id)
values
  ('70000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111'),
  ('70000000-0000-4000-8000-000000000002', '11111111-1111-4111-8111-111111111111'),
  ('70000000-0000-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222')
on conflict (contribution_id, user_id) do nothing;

insert into public.service_requests (
  id, requester_user_id, organization_id, service_type_ar, title_ar, description_ar,
  city_ar, asset_type_ar, area_sqm, status, priority, amount_sar, due_date
)
values
  ('80000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', null, 'استشارة هندسية', 'استشارة هندسية لمجمع الربيع الإداري', 'طلب دراسة فنية وهندسية لمشروع قائم.', 'الرياض', 'أصل قائم', 6200, 'in_progress', 'normal', 3450, '2026-06-14'),
  ('80000000-0000-4000-8000-000000000002', null, '44444444-4444-4444-8444-444444444444', 'تقييم عقاري', 'تقييم أصل تجاري', 'طلب تقييم أصل تجاري قبل تحويله إلى مساهمة.', 'الرياض', 'أصل قائم', 4680, 'submitted', 'high', 1500, '2026-06-20')
on conflict (id) do update set
  status = excluded.status,
  priority = excluded.priority,
  amount_sar = excluded.amount_sar,
  due_date = excluded.due_date,
  updated_at = now();

insert into public.verification_requests (
  id, requester_user_id, organization_id, request_type, status, completion_percent, notes
)
values
  ('90000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', null, 'individual', 'submitted', 78, 'طلب شارة توثيق حساب فردي'),
  ('90000000-0000-4000-8000-000000000002', null, '44444444-4444-4444-8444-444444444444', 'business', 'approved', 100, 'منشأة موثقة')
on conflict (id) do update set
  status = excluded.status,
  completion_percent = excluded.completion_percent,
  notes = excluded.notes,
  updated_at = now();

insert into public.subscriptions (id, user_id, organization_id, plan_name_ar, status, starts_at, ends_at, amount_sar)
values
  ('a0000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', null, 'الباقة الأساسية', 'active', '2026-01-01', '2026-12-31', 500),
  ('a0000000-0000-4000-8000-000000000002', null, '44444444-4444-4444-8444-444444444444', 'الباقة الاحترافية', 'active', '2026-01-01', '2026-12-31', 5000)
on conflict (id) do update set
  plan_name_ar = excluded.plan_name_ar,
  status = excluded.status,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  amount_sar = excluded.amount_sar,
  updated_at = now();

insert into public.invoices (id, invoice_number, user_id, organization_id, subscription_id, title_ar, amount_sar, status, due_date)
values
  ('b0000000-0000-4000-8000-000000000001', 'INV-2026-00035', '11111111-1111-4111-8111-111111111111', null, 'a0000000-0000-4000-8000-000000000001', 'فاتورة الباقة الأساسية', 500, 'paid', '2026-06-01'),
  ('b0000000-0000-4000-8000-000000000002', 'INV-2026-00104', null, '44444444-4444-4444-8444-444444444444', 'a0000000-0000-4000-8000-000000000002', 'فاتورة الباقة الاحترافية', 5000, 'due', '2026-06-30'),
  ('b0000000-0000-4000-8000-000000000003', 'INV-2026-00036', '11111111-1111-4111-8111-111111111111', null, null, 'دراسة جدوى تفصيلية', 2875, 'due', '2026-07-05'),
  ('b0000000-0000-4000-8000-000000000004', 'INV-2026-00105', null, '44444444-4444-4444-8444-444444444444', null, 'رسوم طرح مساهمة عقارية', 2500, 'paid', '2026-06-18')
on conflict (invoice_number) do update set
  status = excluded.status,
  amount_sar = excluded.amount_sar,
  due_date = excluded.due_date,
  updated_at = now();

insert into public.payments (id, invoice_id, user_id, organization_id, amount_sar, method, status, provider_reference, paid_at)
values
  ('c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', null, 500, 'mada', 'succeeded', 'PAY-DEMO-001', now()),
  ('c0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000002', null, '44444444-4444-4444-8444-444444444444', 5000, 'visa', 'pending', 'PAY-DEMO-002', null),
  ('c0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000004', null, '44444444-4444-4444-8444-444444444444', 2500, 'mada', 'succeeded', 'PAY-DEMO-003', now() - interval '4 days')
on conflict (id) do update set status = excluded.status, paid_at = excluded.paid_at, updated_at = now();

insert into public.notifications (id, user_id, organization_id, title_ar, body_ar, category, action_url)
values
  ('d0000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', null, 'تم استلام طلبك', 'تم استلام طلب الخدمة وسيتم إشعارك بالتحديثات.', 'service', '/dashboard/individual/my-requests'),
  ('d0000000-0000-4000-8000-000000000002', null, '44444444-4444-4444-8444-444444444444', 'اكتملت بيانات المنشأة', 'تم تحديث ملف المنشأة واعتماد بيانات التوثيق.', 'verification', '/dashboard/business/company-profile'),
  ('d0000000-0000-4000-8000-000000000003', '33333333-3333-4333-8333-333333333333', null, 'طلب مراجعة أصل جديد', 'أرض سكنية شمال الرياض بانتظار قرار المراجعة.', 'asset', '/dashboard/admin/review-center/assets'),
  ('d0000000-0000-4000-8000-000000000004', '33333333-3333-4333-8333-333333333333', null, 'طلب دعم مفتوح', 'تذكرة أعمال مرتبطة بطلب تقييم عقاري تحتاج متابعة.', 'support', '/dashboard/admin/support')
on conflict (id) do update set title_ar = excluded.title_ar, body_ar = excluded.body_ar, action_url = excluded.action_url;

insert into public.conversations (id, subject_ar, status, created_by, organization_id)
values
  ('d1000000-0000-4000-8000-000000000001', 'محادثة فريق مهابة', 'open', '11111111-1111-4111-8111-111111111111', null),
  ('d1000000-0000-4000-8000-000000000002', 'محادثة منشأة الازدهار', 'open', '22222222-2222-4222-8222-222222222222', '44444444-4444-4444-8444-444444444444')
on conflict (id) do update set subject_ar = excluded.subject_ar, status = excluded.status, updated_at = now();

insert into public.conversation_participants (conversation_id, user_id)
values
  ('d1000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111'),
  ('d1000000-0000-4000-8000-000000000001', '33333333-3333-4333-8333-333333333333'),
  ('d1000000-0000-4000-8000-000000000002', '22222222-2222-4222-8222-222222222222'),
  ('d1000000-0000-4000-8000-000000000002', '33333333-3333-4333-8333-333333333333')
on conflict (conversation_id, user_id) do nothing;

insert into public.messages (id, conversation_id, sender_user_id, body_ar, created_at)
values
  ('d2000000-0000-4000-8000-000000000001', 'd1000000-0000-4000-8000-000000000001', '33333333-3333-4333-8333-333333333333', 'مرحبا أحمد، شكراً لتواصلك معنا. كيف يمكننا مساعدتك اليوم؟', now() - interval '4 hours'),
  ('d2000000-0000-4000-8000-000000000002', 'd1000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'مرحبا، أريد الاستفسار عن حالة طلب خدمة عقارية برقم SRV-2025-0018.', now() - interval '3 hours 58 minutes'),
  ('d2000000-0000-4000-8000-000000000003', 'd1000000-0000-4000-8000-000000000001', '33333333-3333-4333-8333-333333333333', 'تم استلام طلبك بنجاح وهو حالياً قيد المراجعة من قبل الفريق المختص.', now() - interval '3 hours 55 minutes'),
  ('d2000000-0000-4000-8000-000000000004', 'd1000000-0000-4000-8000-000000000002', '22222222-2222-4222-8222-222222222222', 'نحتاج تحديث حالة مساهمة الواحة العقارية وموعد اكتمال الترخيص.', now() - interval '2 hours'),
  ('d2000000-0000-4000-8000-000000000005', 'd1000000-0000-4000-8000-000000000002', '33333333-3333-4333-8333-333333333333', 'تم ربط استفساركم بمركز المراجعة وسيظهر التحديث في صفحة مساهماتي.', now() - interval '1 hour 48 minutes')
on conflict (id) do update set body_ar = excluded.body_ar;

insert into public.support_tickets (id, ticket_number, requester_user_id, organization_id, category, title_ar, description_ar, status, priority)
values
  ('e0000000-0000-4000-8000-000000000001', 'TK-2026-00041', '11111111-1111-4111-8111-111111111111', null, 'حسابي', 'طلب تعديل بيانات الحساب', 'أحتاج إلى تحديث رقم الجوال المرتبط بحسابي.', 'completed', 'normal'),
  ('e0000000-0000-4000-8000-000000000002', 'TK-2026-00125', null, '44444444-4444-4444-8444-444444444444', 'خدمات عقارية', 'استفسار عن طلب خدمة عقارية', 'استفسار عن حالة طلب التقييم العقاري.', 'submitted', 'normal')
on conflict (ticket_number) do update set
  status = excluded.status,
  priority = excluded.priority,
  updated_at = now();

insert into public.support_ticket_messages (id, ticket_id, sender_user_id, body_ar, internal, created_at)
values
  (
    'e1000000-0000-4000-8000-000000000001',
    'e0000000-0000-4000-8000-000000000001',
    '11111111-1111-4111-8111-111111111111',
    'أحتاج إلى تحديث رقم الجوال المرتبط بحسابي.',
    false,
    now() - interval '2 days'
  ),
  (
    'e1000000-0000-4000-8000-000000000002',
    'e0000000-0000-4000-8000-000000000001',
    '33333333-3333-4333-8333-333333333333',
    'تم تحديث الطلب وإغلاق التذكرة بعد مراجعة بيانات الحساب.',
    false,
    now() - interval '1 day 22 hours'
  ),
  (
    'e1000000-0000-4000-8000-000000000003',
    'e0000000-0000-4000-8000-000000000002',
    '22222222-2222-4222-8222-222222222222',
    'نرغب في معرفة آخر تحديث على طلب التقييم العقاري.',
    false,
    now() - interval '8 hours'
  ),
  (
    'e1000000-0000-4000-8000-000000000004',
    'e0000000-0000-4000-8000-000000000002',
    '33333333-3333-4333-8333-333333333333',
    'تم استلام الاستفسار وربطه بطلب الخدمة، وسيتم إشعاركم عند تحديث الحالة.',
    false,
    now() - interval '7 hours 45 minutes'
  )
on conflict (id) do update set
  body_ar = excluded.body_ar,
  internal = excluded.internal,
  created_at = excluded.created_at;

insert into public.newsletter_subscribers (id, email, source, confirmed_at, metadata)
values
  ('e2000000-0000-4000-8000-000000000001', 'ahmed.abdullah@example.com', 'seed-individual-dashboard', now(), '{"segment":"individual","source":"seed"}'),
  ('e2000000-0000-4000-8000-000000000002', 'info@alazdehar.sa', 'seed-business-dashboard', now(), '{"segment":"business","source":"seed"}'),
  ('e2000000-0000-4000-8000-000000000003', 'investor.demo@mahabah.sa', 'website-footer', null, '{"segment":"prospect","source":"seed"}')
on conflict (email) do update set
  source = excluded.source,
  confirmed_at = excluded.confirmed_at,
  metadata = public.newsletter_subscribers.metadata || excluded.metadata;

insert into public.content_comments (id, content_slug, content_type, author_name, body_ar, status, metadata)
values
  (
    'e3000000-0000-4000-8000-000000000001',
    'riyadh-market-update',
    'news',
    'أحمد عبدالله',
    'تحديث مفيد لسوق الرياض، أحتاج ربطه بفرص الأصول المهتم بها.',
    'approved',
    '{"source":"seed","userId":"11111111-1111-4111-8111-111111111111"}'
  ),
  (
    'e3000000-0000-4000-8000-000000000002',
    'real-estate-investment-guide',
    'article',
    'شركة الازدهار العقارية',
    'نقترح إضافة فقرة عن متطلبات طرح المساهمات العقارية للمنشآت.',
    'submitted',
    '{"source":"seed","organizationId":"44444444-4444-4444-8444-444444444444"}'
  )
on conflict (id) do update set
  content_slug = excluded.content_slug,
  content_type = excluded.content_type,
  author_name = excluded.author_name,
  body_ar = excluded.body_ar,
  status = excluded.status,
  metadata = public.content_comments.metadata || excluded.metadata,
  updated_at = now();

insert into public.saved_content (id, user_id, content_type, content_slug, title_ar, metadata)
values
  (
    'e4000000-0000-4000-8000-000000000001',
    '11111111-1111-4111-8111-111111111111',
    'news',
    'riyadh-market-update',
    'تحديثات سوق الرياض',
    '{"source":"seed","savedFrom":"/news/riyadh-market-update"}'
  ),
  (
    'e4000000-0000-4000-8000-000000000002',
    '11111111-1111-4111-8111-111111111111',
    'article',
    'real-estate-investment-guide',
    'دليل الاستثمار العقاري',
    '{"source":"seed","savedFrom":"/articles/real-estate-investment-guide"}'
  )
on conflict (user_id, content_type, content_slug) do update set
  title_ar = excluded.title_ar,
  metadata = public.saved_content.metadata || excluded.metadata,
  updated_at = now();

insert into public.documents (
  id, owner_user_id, organization_id, entity_type, entity_id, entity_ref,
  bucket, storage_path, file_name, mime_type, size_bytes, uploaded_by
)
values
  (
    'f1000000-0000-4000-8000-000000000001',
    '11111111-1111-4111-8111-111111111111',
    null,
    'asset_deed',
    '60000000-0000-4000-8000-000000000001',
    null,
    'mahabah-documents',
    'users/11111111-1111-4111-8111-111111111111/assets/north-riyadh-deed.pdf',
    'صك أرض شمال الرياض.pdf',
    'application/pdf',
    1820000,
    '11111111-1111-4111-8111-111111111111'
  ),
  (
    'f1000000-0000-4000-8000-000000000002',
    null,
    '44444444-4444-4444-8444-444444444444',
    'contribution_license',
    '70000000-0000-4000-8000-000000000001',
    null,
    'mahabah-documents',
    'organizations/44444444-4444-4444-8444-444444444444/contributions/nakheel-license.pdf',
    'رخصة مساهمة النخيل.pdf',
    'application/pdf',
    2480000,
    '22222222-2222-4222-8222-222222222222'
  ),
  (
    'f1000000-0000-4000-8000-000000000003',
    null,
    '44444444-4444-4444-8444-444444444444',
    'organization_document',
    '44444444-4444-4444-8444-444444444444',
    null,
    'mahabah-documents',
    'organizations/44444444-4444-4444-8444-444444444444/profile/commercial-registration.pdf',
    'السجل التجاري.pdf',
    'application/pdf',
    960000,
    '22222222-2222-4222-8222-222222222222'
  ),
  (
    'f1000000-0000-4000-8000-000000000004',
    '11111111-1111-4111-8111-111111111111',
    null,
    'verification_document',
    '90000000-0000-4000-8000-000000000001',
    null,
    'mahabah-documents',
    'users/11111111-1111-4111-8111-111111111111/verification/identity.pdf',
    'صورة الهوية.pdf',
    'application/pdf',
    740000,
    '11111111-1111-4111-8111-111111111111'
  )
on conflict (id) do update set
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  entity_ref = excluded.entity_ref,
  storage_path = excluded.storage_path,
  file_name = excluded.file_name,
  mime_type = excluded.mime_type,
  size_bytes = excluded.size_bytes;

insert into public.platform_settings (key, value, updated_by)
values
  ('brand.colors', '{"copper":"#A7815E","black":"#1D1916","copperLight":"#B89A7A","warmBeige":"#C8B8A4","softStone":"#D9D1C7","lightBackground":"#F6F4F1","white":"#FFFFFF"}', '33333333-3333-4333-8333-333333333333'),
  ('dashboard.defaultLocale', '{"locale":"ar-SA","dir":"rtl"}', '33333333-3333-4333-8333-333333333333')
on conflict (key) do update set value = excluded.value, updated_by = excluded.updated_by, updated_at = now();

insert into public.audit_logs (id, actor_user_id, organization_id, action, entity_type, entity_id, metadata)
values
  ('f0000000-0000-4000-8000-000000000001', '33333333-3333-4333-8333-333333333333', '44444444-4444-4444-8444-444444444444', 'approve', 'verification_request', '90000000-0000-4000-8000-000000000002', '{"note":"seed approval"}')
on conflict (id) do update set metadata = excluded.metadata;
