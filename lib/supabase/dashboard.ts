import type { DashboardMetric, DashboardNavGroup, DashboardOpportunity, DashboardRoleConfig } from "@/lib/data/dashboard";
import { DEMO_ADMIN_USER_ID, type DashboardActorContext } from "@/lib/supabase/mahabah";
import { getSupabaseAdmin } from "@/lib/supabase/server";

type MetricPatch = Partial<Pick<DashboardMetric, "value" | "unit" | "delta">>;
type SummaryRow = {
  profile_completion?: number | null;
  verification_status?: string | null;
  status?: string | null;
  updated_at?: string | null;
};
type OpportunityAssetRow = {
  id?: string | null;
  slug?: string | null;
  title_ar?: string | null;
  city_ar?: string | null;
  district_ar?: string | null;
  asset_type_ar?: string | null;
  area_sqm?: number | string | null;
  estimated_value_sar?: number | string | null;
  status?: string | null;
  image_url?: string | null;
};

const DEMO_INDIVIDUAL_USER_ID = "11111111-1111-4111-8111-111111111111";
const DEMO_BUSINESS_USER_ID = "22222222-2222-4222-8222-222222222222";
const DEMO_BUSINESS_ORG_ID = "44444444-4444-4444-8444-444444444444";
const OPEN_REQUEST_STATUSES = ["submitted", "in_review", "needs_changes", "in_progress"];
const REVIEW_QUEUE_STATUSES = ["submitted", "in_review", "needs_changes"];
const OPEN_SUPPORT_STATUSES = ["submitted", "in_progress"];

async function tableCount(table: string, filters: Record<string, string | number | boolean | null> = {}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  let query = supabase.from(table).select("*", { count: "exact", head: true });
  for (const [column, value] of Object.entries(filters)) {
    query = value === null ? query.is(column, null) : query.eq(column, value);
  }

  const { count, error } = await query;
  if (error) return null;
  return count ?? 0;
}

async function tableCountIn(table: string, column: string, values: string[], filters: Record<string, string | number | boolean | null> = {}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  let query = supabase.from(table).select("*", { count: "exact", head: true }).in(column, values);
  for (const [filterColumn, value] of Object.entries(filters)) {
    query = value === null ? query.is(filterColumn, null) : query.eq(filterColumn, value);
  }

  const { count, error } = await query;
  if (error) return null;
  return count ?? 0;
}

async function sumAmount(table: string, column: string, filters: Record<string, string | number | boolean | null> = {}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  let query = supabase.from(table).select(column);
  for (const [filterColumn, value] of Object.entries(filters)) {
    query = value === null ? query.is(filterColumn, null) : query.eq(filterColumn, value);
  }

  const { data, error } = await query;
  if (error || !data) return null;
  return data.reduce((total, row) => {
    const value = (row as unknown as Record<string, unknown>)[column];
    return total + (typeof value === "number" ? value : Number(value) || 0);
  }, 0);
}

async function singleRow<T extends Record<string, unknown>>(table: string, select: string, filters: Record<string, string | number | boolean | null>) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  let query = supabase.from(table).select(select);
  for (const [column, value] of Object.entries(filters)) {
    query = value === null ? query.is(column, null) : query.eq(column, value);
  }

  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;
  return data as unknown as T;
}

function patchMetrics(metrics: DashboardMetric[], patchByLabel: Record<string, MetricPatch>) {
  return metrics.map((metric) => {
    const patch = patchByLabel[metric.label];
    return patch ? { ...metric, ...patch } : metric;
  });
}

function patchPlanStats(stats: DashboardRoleConfig["plan"]["stats"], patchByLabel: Record<string, Partial<DashboardRoleConfig["plan"]["stats"][number]>>) {
  return stats.map((stat) => {
    const patch = patchByLabel[stat.label];
    return patch ? { ...stat, ...patch } : stat;
  });
}

function patchNavBadges(nav: DashboardNavGroup[], badges: NonNullable<DashboardRoleConfig["topbarBadges"]>) {
  return nav.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      if (item.path === "notifications" && badges.notifications !== undefined) return { ...item, badge: badges.notifications };
      if (item.path === "messages" && badges.messages !== undefined) return { ...item, badge: badges.messages };
      return item;
    }),
  }));
}

function compactMoney(value: number) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  return new Intl.NumberFormat("ar-SA").format(value);
}

function moneyLabel(value: number | string | null | undefined) {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "حسب التقييم";
  return `${new Intl.NumberFormat("ar-SA").format(amount)} ريال`;
}

function areaLabel(value: number | string | null | undefined) {
  const area = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(area) || area <= 0) return "مساحة غير محددة";
  return `${new Intl.NumberFormat("ar-SA").format(area)} م2`;
}

function opportunityTag(status?: string | null) {
  if (status === "approved") return "فرصة معتمدة";
  if (status === "in_review") return "قيد المراجعة";
  if (status === "submitted") return "فرصة جديدة";
  return "فرصة عقارية";
}

async function listDashboardOpportunities(): Promise<DashboardOpportunity[] | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("real_estate_assets")
    .select("id, slug, title_ar, city_ar, district_ar, asset_type_ar, area_sqm, estimated_value_sar, status, image_url")
    .in("status", ["approved", "submitted", "in_review"])
    .order("listing_date", { ascending: false })
    .limit(4);

  if (error || !data?.length) return null;

  return (data as unknown as OpportunityAssetRow[]).map((asset) => ({
    id: asset.id ?? undefined,
    slug: asset.slug ?? undefined,
    title: asset.title_ar ?? "أصل عقاري",
    city: `${asset.city_ar ?? "الرياض"} - ${asset.district_ar ?? "موقع مميز"}`,
    type: asset.asset_type_ar ?? "أصل عقاري",
    area: areaLabel(asset.area_sqm),
    price: moneyLabel(asset.estimated_value_sar),
    tag: opportunityTag(asset.status),
    image: asset.image_url ?? "/images/asset-commercial-complex.png",
  }));
}

function percentage(part: number | null | undefined, total: number | null | undefined, fallback = 0) {
  if (!part || !total) return `${fallback}%`;
  return `${Math.min(100, Math.round((part / total) * 100))}%`;
}

function statusProgress(status?: string | null) {
  if (status === "approved") return 100;
  if (status === "in_review") return 78;
  if (status === "submitted") return 65;
  if (status === "needs_changes") return 45;
  if (status === "rejected" || status === "archived") return 0;
  return 35;
}

function statusLabel(status?: string | null) {
  if (status === "approved") return "موثق";
  if (status === "in_review" || status === "submitted") return "قيد المراجعة";
  if (status === "needs_changes") return "يحتاج تحديث";
  if (status === "rejected") return "مرفوض";
  if (status === "archived") return "مؤرشف";
  return "قيد الإعداد";
}

function profileProgress(row: SummaryRow | null, fallbackStatus?: string | null) {
  const completion = Number(row?.profile_completion ?? 0);
  return completion > 0 ? completion : statusProgress(row?.verification_status ?? fallbackStatus);
}

function relativeUpdatedLabel(value?: string | null) {
  if (!value) return "محدث الآن";

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "محدث الآن";

  const minutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));
  if (minutes < 1) return "الآن";
  if (minutes < 60) return `منذ ${minutes} دقيقة`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;

  return `منذ ${Math.round(hours / 24)} يوم`;
}

export async function hydrateDashboardConfig(config: DashboardRoleConfig, actor?: DashboardActorContext | null): Promise<DashboardRoleConfig> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return config;

  if (config.role === "individual") {
    const userId = actor?.userId ?? DEMO_INDIVIDUAL_USER_ID;
    const [assets, activeAssets, reviewAssets, interests, contributionInterests, requests, activeRequests, completedRequests, dueInvoices, invoices, unreadNotifications, conversations, profile] = await Promise.all([
      tableCount("real_estate_assets", { owner_user_id: userId }),
      tableCount("real_estate_assets", { owner_user_id: userId, status: "approved" }),
      tableCountIn("real_estate_assets", "status", ["submitted", "in_review", "needs_changes"], { owner_user_id: userId }),
      tableCount("asset_interests", { user_id: userId }),
      tableCount("contribution_interests", { user_id: userId }),
      tableCount("service_requests", { requester_user_id: userId }),
      tableCountIn("service_requests", "status", OPEN_REQUEST_STATUSES, { requester_user_id: userId }),
      tableCount("service_requests", { requester_user_id: userId, status: "completed" }),
      tableCount("invoices", { user_id: userId, status: "due" }),
      tableCount("invoices", { user_id: userId }),
      tableCount("notifications", { user_id: userId, read_at: null }),
      tableCount("conversation_participants", { user_id: userId }),
      singleRow<SummaryRow>("profiles", "profile_completion, verification_status, updated_at", { id: userId }),
    ]);
    const completion = profileProgress(profile);
    const totalInterests = (interests ?? 0) + (contributionInterests ?? 0);
    const topbarBadges = {
      notifications: String(unreadNotifications ?? 0),
      messages: String(conversations ?? 0),
    };
    const liveOpportunities = await listDashboardOpportunities();

    return {
      ...config,
      nav: patchNavBadges(config.nav, topbarBadges),
      opportunities: liveOpportunities ?? config.opportunities,
      topbarBadges,
      updatedAt: relativeUpdatedLabel(profile?.updated_at),
      summaryMetrics: patchMetrics(config.summaryMetrics, {
        "الأصول العقارية": { value: String(assets ?? config.summaryMetrics[0]?.value ?? "0") },
        "المساهمات العقارية": { value: String(contributionInterests ?? config.summaryMetrics[1]?.value ?? "0"), unit: "اهتمام" },
        "طلبات الخدمات": { value: String(requests ?? config.summaryMetrics[2]?.value ?? "0") },
        "عروض الأسعار": { value: String(interests ?? config.summaryMetrics[3]?.value ?? "0"), unit: "اهتمام" },
        "الإشعارات": { value: String(unreadNotifications ?? config.summaryMetrics[4]?.value ?? "0") },
        "العقود": { value: String(invoices ?? config.summaryMetrics[5]?.value ?? "0"), unit: "فواتير" },
      }),
      performanceMetrics: patchMetrics(config.performanceMetrics, {
        "الفرص المتاحة": { value: String(assets ?? 0), unit: "أصل", delta: `${activeAssets ?? 0} معتمد` },
        "العروض المرسلة": { value: String(activeRequests ?? 0), unit: "طلب نشط", delta: `${completedRequests ?? 0} مكتمل` },
        "العقود النشطة": { value: String(completedRequests ?? 0), unit: "طلب مكتمل", delta: `${requests ?? 0} إجمالي الطلبات` },
        "الفواتير المستحقة": { value: String(dueInvoices ?? 0), unit: "فواتير", delta: `${invoices ?? 0} إجمالي الفواتير` },
        "معدل التحويل": { value: percentage(completedRequests, requests, completion), unit: "اكتمال الطلبات", delta: `${reviewAssets ?? 0} أصول قيد المراجعة` },
      }),
      verification: {
        ...config.verification,
        status: statusLabel(profile?.verification_status),
        progress: `${completion}%`,
        description: `اكتمال الملف ${completion}%`,
      },
      plan: {
        ...config.plan,
        stats: patchPlanStats(config.plan.stats, {
          "مساهمات ضمان": { value: String(contributionInterests ?? config.plan.stats[0]?.value ?? "0"), unit: "اهتمام" },
          "أصول مضافة": { value: String(assets ?? config.plan.stats[1]?.value ?? "0"), unit: "أصل" },
          "العروض المستلمة": { value: String(activeRequests ?? config.plan.stats[2]?.value ?? "0"), unit: "طلب نشط" },
          "الفرص المتاحة": { value: String(totalInterests), unit: "اهتمام" },
        }),
      },
      sideCard: {
        ...config.sideCard,
        value: String(interests ?? config.sideCard.value),
        unit: "أصل",
        delta: `${contributionInterests ?? 0} مساهمة مهتم بها`,
      },
    };
  }

  if (config.role === "business") {
    const organizationId = actor?.organizationId ?? DEMO_BUSINESS_ORG_ID;
    const userId = actor?.userId ?? DEMO_BUSINESS_USER_ID;
    const [assets, approvedAssets, contributions, approvedContributions, services, openRequests, completedRequests, payments, paymentsTotal, members, interestedAssets, interestedContributions, unreadNotifications, conversations, organization] = await Promise.all([
      tableCount("real_estate_assets", { organization_id: organizationId }),
      tableCount("real_estate_assets", { organization_id: organizationId, status: "approved" }),
      tableCount("real_estate_contributions", { organization_id: organizationId }),
      tableCount("real_estate_contributions", { organization_id: organizationId, status: "approved" }),
      tableCount("service_requests", { organization_id: organizationId }),
      tableCountIn("service_requests", "status", OPEN_REQUEST_STATUSES, { organization_id: organizationId }),
      tableCount("service_requests", { organization_id: organizationId, status: "completed" }),
      tableCount("payments", { organization_id: organizationId }),
      sumAmount("payments", "amount_sar", { organization_id: organizationId, status: "succeeded" }),
      tableCount("organization_members", { organization_id: organizationId }),
      tableCount("asset_interests", { user_id: userId }),
      tableCount("contribution_interests", { user_id: userId }),
      tableCount("notifications", { organization_id: organizationId, read_at: null }),
      tableCount("conversations", { organization_id: organizationId, status: "open" }),
      singleRow<SummaryRow>("organizations", "status, profile_completion, verification_status, updated_at", { id: organizationId }),
    ]);
    const completion = profileProgress(organization, organization?.status);
    const orgIsReady = organization?.status === "approved" || completion >= 90;
    const targetOpportunities = (interestedAssets ?? 0) + (interestedContributions ?? 0);
    const topbarBadges = {
      notifications: String(unreadNotifications ?? 0),
      messages: String(conversations ?? 0),
    };
    const liveOpportunities = await listDashboardOpportunities();

    return {
      ...config,
      nav: patchNavBadges(config.nav, topbarBadges),
      opportunities: liveOpportunities ?? config.opportunities,
      topbarBadges,
      updatedAt: relativeUpdatedLabel(organization?.updated_at),
      summaryMetrics: patchMetrics(config.summaryMetrics, {
        "حالة المنشأة": { value: orgIsReady ? "مكتمل" : statusLabel(organization?.status), unit: `اكتمال ${completion}%`, delta: relativeUpdatedLabel(organization?.updated_at) },
        "الأصول العقارية": { value: String(assets ?? config.summaryMetrics[1]?.value ?? "0") },
        "المساهمات العقارية": { value: String(contributions ?? config.summaryMetrics[2]?.value ?? "0") },
        "الخدمات العقارية": { value: String(services ?? config.summaryMetrics[3]?.value ?? "0") },
        "الطلبات المفتوحة": { value: String(openRequests ?? config.summaryMetrics[4]?.value ?? "0") },
        "العمليات المالية": { value: String(payments ?? config.summaryMetrics[5]?.value ?? "0") },
      }),
      performanceMetrics: patchMetrics(config.performanceMetrics, {
        "الفرص المتاحة": { value: String(assets ?? 0), unit: "أصل", delta: `${approvedAssets ?? 0} معتمد` },
        "العروض المرسلة": { value: String(openRequests ?? 0), unit: "طلب مفتوح", delta: `${completedRequests ?? 0} مكتمل` },
        "العقود النشطة": { value: String(approvedContributions ?? 0), unit: "مساهمة معتمدة", delta: `${contributions ?? 0} إجمالي المساهمات` },
        "الرصيد الحالي": { value: paymentsTotal === null ? config.performanceMetrics[3]?.value : compactMoney(paymentsTotal), unit: "ريال", delta: `${payments ?? 0} عملية مالية` },
        "معدل التحويل": { value: percentage(completedRequests, services, completion), unit: "اكتمال الطلبات", delta: `${openRequests ?? 0} قيد المتابعة` },
      }),
      verification: {
        ...config.verification,
        status: `${statusLabel(organization?.verification_status)} - ${completion}% مكتمل`,
        progress: `${completion}%`,
        description: `حالة المنشأة: ${statusLabel(organization?.status)}`,
      },
      plan: {
        ...config.plan,
        stats: patchPlanStats(config.plan.stats, {
          "إجمالي العقود": { value: String(approvedContributions ?? config.plan.stats[0]?.value ?? "0"), unit: "مساهمة معتمدة" },
          "أعضاء الفريق": { value: String(members ?? config.plan.stats[1]?.value ?? "0"), unit: "عضو" },
          "الفرص المستهدفة": { value: String(targetOpportunities), unit: "اهتمام" },
          "الفرص المتاحة": { value: String((assets ?? 0) + (contributions ?? 0)), unit: "أصل/مساهمة" },
        }),
      },
      sideCard: {
        ...config.sideCard,
        value: paymentsTotal === null ? config.sideCard.value : compactMoney(paymentsTotal),
        unit: "ريال",
        delta: `${payments ?? 0} عملية مالية`,
      },
    };
  }

  const adminUserId = actor?.userId ?? DEMO_ADMIN_USER_ID;
  const [users, businesses, totalAssets, approvedAssets, pendingAssets, pendingContributions, pendingServiceRequests, serviceRequests, dueInvoices, supportTickets, revenue, reviewContent, unreadNotifications, openConversations] = await Promise.all([
    tableCount("profiles"),
    tableCount("organizations", { verification_status: "approved" }),
    tableCount("real_estate_assets"),
    tableCount("real_estate_assets", { status: "approved" }),
    tableCountIn("real_estate_assets", "status", REVIEW_QUEUE_STATUSES),
    tableCountIn("real_estate_contributions", "status", REVIEW_QUEUE_STATUSES),
    tableCountIn("service_requests", "status", OPEN_REQUEST_STATUSES),
    tableCount("service_requests"),
    tableCount("invoices", { status: "due" }),
    tableCountIn("support_tickets", "status", OPEN_SUPPORT_STATUSES),
    sumAmount("payments", "amount_sar", { status: "succeeded" }),
    tableCount("content_items", { status: "review" }),
    tableCount("notifications", { user_id: adminUserId, read_at: null }),
    tableCount("conversations", { status: "open" }),
  ]);
  const reviewQueue = (pendingAssets ?? 0) + (pendingContributions ?? 0) + (pendingServiceRequests ?? 0) + (supportTickets ?? 0);
  const contentReady = percentage(reviewContent === null ? null : Math.max(0, 20 - reviewContent), 20, 92);
  const topbarBadges = {
    notifications: String(unreadNotifications ?? 0),
    messages: String((openConversations ?? 0) + (supportTickets ?? 0)),
  };
  const liveOpportunities = await listDashboardOpportunities();

  return {
    ...config,
    nav: patchNavBadges(config.nav, topbarBadges),
    opportunities: liveOpportunities ?? config.opportunities,
    topbarBadges,
    summaryMetrics: patchMetrics(config.summaryMetrics, {
      "إجمالي المستخدمين": { value: String(users ?? config.summaryMetrics[0]?.value ?? "0") },
      "المنشآت الموثقة": { value: String(businesses ?? config.summaryMetrics[1]?.value ?? "0") },
      "الأصول قيد المراجعة": { value: String(pendingAssets ?? config.summaryMetrics[2]?.value ?? "0") },
      "طلبات الخدمات": { value: String(serviceRequests ?? config.summaryMetrics[3]?.value ?? "0") },
      "الفواتير المستحقة": { value: String(dueInvoices ?? config.summaryMetrics[4]?.value ?? "0") },
      "بلاغات الدعم": { value: String(supportTickets ?? config.summaryMetrics[5]?.value ?? "0") },
    }),
    performanceMetrics: patchMetrics(config.performanceMetrics, {
      "معدل اعتماد الأصول": { value: percentage(approvedAssets, totalAssets, 0), unit: "من إجمالي الأصول", delta: `${approvedAssets ?? 0} معتمد` },
      "متوسط زمن الرد": { value: String(supportTickets ?? 0), unit: "بلاغ مفتوح", delta: "يتحدث من تذاكر الدعم" },
      "طلبات معلقة": { value: String(reviewQueue), unit: "طلب/عنصر", delta: `${pendingServiceRequests ?? 0} خدمات قيد المتابعة` },
      "إيرادات الاشتراكات": { value: revenue === null ? config.performanceMetrics[3]?.value : compactMoney(revenue), unit: "ريال" },
      "جاهزية المحتوى": { value: contentReady, unit: "مكتمل", delta: `${reviewContent ?? 0} عناصر للمراجعة` },
    }),
    plan: {
      ...config.plan,
      stats: patchPlanStats(config.plan.stats, {
        "طلبات مفتوحة": { value: String(pendingServiceRequests ?? config.plan.stats[0]?.value ?? "0"), unit: "طلب" },
        "أصول للمراجعة": { value: String(pendingAssets ?? config.plan.stats[1]?.value ?? "0"), unit: "أصل" },
        "بلاغات الدعم": { value: String(supportTickets ?? config.plan.stats[2]?.value ?? "0"), unit: "بلاغ" },
        "نسبة الجاهزية": { value: contentReady, unit: "مكتمل" },
      }),
    },
    sideCard: {
      ...config.sideCard,
      value: String(reviewQueue),
      unit: "عنصر",
      delta: `${pendingContributions ?? 0} مساهمة بانتظار المراجعة`,
    },
  };
}
