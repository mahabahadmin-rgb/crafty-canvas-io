import { assets } from "@/lib/data/assets";
import { contributions } from "@/lib/data/contributions";
import { formatArea, formatSar } from "@/lib/utils";

export type DashboardRole = "individual" | "business" | "admin";
export type TrendTone = "green" | "red" | "blue" | "gold";

export type DashboardNavItem = {
  label: string;
  path: string;
  icon: string;
  badge?: string;
};

export type DashboardNavGroup = {
  title: string;
  items: DashboardNavItem[];
};

export type DashboardMetric = {
  label: string;
  value: string;
  unit?: string;
  delta: string;
  icon: string;
  tone?: TrendTone;
};

export type DashboardOpportunity = {
  id?: string;
  slug?: string;
  title: string;
  city: string;
  type: string;
  area: string;
  price: string;
  tag: string;
  image: string;
};

export type DashboardActivity = {
  title: string;
  description: string;
  time: string;
  icon: string;
  tone: TrendTone;
};

export type DashboardRoleConfig = {
  role: DashboardRole;
  accountLabel: string;
  ownerName: string;
  ownerSubtitle: string;
  heroTitle: string;
  heroDescription: string;
  updatedAt: string;
  heroImage: string;
  heroActions: { label: string; tone: "primary" | "secondary"; icon: string; path: string }[];
  nav: DashboardNavGroup[];
  topbarBadges?: {
    notifications?: string;
    messages?: string;
  };
  summaryMetrics: DashboardMetric[];
  performanceMetrics: DashboardMetric[];
  plan: {
    title: string;
    status: string;
    expiresAt: string;
    action: string;
    stats: { label: string; value: string; unit: string }[];
  };
  verification: {
    title: string;
    status: string;
    description: string;
    progress?: string;
    checks: string[];
  };
  sideCard: {
    title: string;
    value: string;
    unit: string;
    delta: string;
    action: string;
    image: string;
  };
  opportunities: DashboardOpportunity[];
  activities: DashboardActivity[];
};

export type StaticRow = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  amount: string;
  status: string;
  statusTone: TrendTone;
};

const brown = "#8F6B4C";

const individualNav: DashboardNavGroup[] = [
  { title: "", items: [{ label: "الرئيسية", path: "", icon: "home" }] },
  { title: "الأصول العقارية", items: [
    { label: "إضافة أصل عقاري", path: "add-asset", icon: "plus" },
    { label: "استعراض الأصول", path: "browse-assets", icon: "search" },
    { label: "أصولي المضافة", path: "my-assets", icon: "building" },
    { label: "الأصول المهتم بها", path: "interested-assets", icon: "heart" },
  ] },
  { title: "المساهمات العقارية", items: [
    { label: "استعراض المساهمات", path: "browse-contributions", icon: "clipboard" },
    { label: "المساهمات المهتم بها", path: "interested-contributions", icon: "heart" },
  ] },
  { title: "الخدمات العقارية", items: [
    { label: "طلب خدمة عقارية", path: "request-service", icon: "file" },
    { label: "طلباتي", path: "my-requests", icon: "file-text" },
  ] },
  { title: "إدارة الحساب", items: [
    { label: "بيانات الحساب", path: "profile", icon: "id" },
    { label: "الإشعارات", path: "account-notifications", icon: "bell" },
    { label: "الأمان", path: "security", icon: "shield" },
  ] },
  { title: "المالية", items: [
    { label: "الفواتير", path: "invoices", icon: "receipt" },
    { label: "الاشتراك", path: "subscriptions", icon: "crown" },
    { label: "المدفوعات", path: "payments", icon: "wallet" },
  ] },
  { title: "التواصل", items: [
    { label: "الإشعارات", path: "notifications", icon: "bell", badge: "3" },
    { label: "الرسائل", path: "messages", icon: "message", badge: "2" },
    { label: "الدعم الفني", path: "support", icon: "headset" },
  ] },
  { title: "الملف الشخصي", items: [
    { label: "الملف الشخصي", path: "personal-profile", icon: "users" },
    { label: "طلب شارة التوثيق", path: "verification", icon: "shield" },
  ] },
];

const businessNav: DashboardNavGroup[] = [
  { title: "العناصر", items: [{ label: "الرئيسية", path: "", icon: "home" }] },
  { title: "الأصول العقارية", items: [
    { label: "إضافة أصل عقاري", path: "add-asset", icon: "plus" },
    { label: "استعراض الأصول", path: "browse-assets", icon: "box" },
    { label: "أصولي المضافة", path: "company-assets", icon: "users" },
    { label: "الأصول المهتم بها", path: "interested-assets", icon: "heart" },
  ] },
  { title: "المساهمات العقارية", items: [
    { label: "إضافة مساهمة عقارية", path: "add-contribution", icon: "plus" },
    { label: "استعراض المساهمات", path: "browse-contributions", icon: "clipboard" },
    { label: "المساهمات المهتم بها", path: "interested-contributions", icon: "heart" },
    { label: "مساهماتي", path: "company-contributions", icon: "users" },
  ] },
  { title: "الخدمات العقارية", items: [
    { label: "طلب خدمة عقارية", path: "request-service", icon: "file" },
    { label: "طلباتي", path: "my-requests", icon: "file-text" },
  ] },
  { title: "إدارة المنشأة", items: [
    { label: "بيانات المنشأة", path: "company-profile", icon: "id" },
    { label: "طلب شارة التوثيق", path: "verification", icon: "shield" },
  ] },
  { title: "المالية", items: [
    { label: "الفواتير", path: "invoices", icon: "receipt" },
    { label: "الاشتراك", path: "subscriptions", icon: "crown" },
    { label: "المدفوعات", path: "payments", icon: "wallet" },
  ] },
  { title: "التواصل", items: [
    { label: "الإشعارات", path: "notifications", icon: "bell", badge: "3" },
    { label: "الرسائل", path: "messages", icon: "message", badge: "2" },
    { label: "الدعم الفني", path: "support", icon: "headset" },
  ] },
  { title: "", items: [{ label: "الملف الشخصي", path: "profile", icon: "user" }] },
];

const adminNav: DashboardNavGroup[] = [
  { title: "العناصر", items: [{ label: "لوحة التحكم", path: "", icon: "home" }] },
  { title: "إدارة الأصول العقارية", items: [
    { label: "جميع الأصول العقارية", path: "assets", icon: "box" },
    { label: "تفاصيل الأصل العقاري", path: "assets/details", icon: "file-text" },
    { label: "الأصول بانتظار المراجعة", path: "assets/pending", icon: "clock" },
    { label: "الأصول المعتمدة", path: "assets/approved", icon: "shield" },
    { label: "الأصول المرفوضة", path: "assets/rejected", icon: "x" },
  ] },
  { title: "إدارة المساهمات العقارية", items: [
    { label: "جميع المساهمات العقارية", path: "contributions", icon: "clipboard" },
    { label: "تفاصيل المساهمة", path: "contributions/details", icon: "file-text" },
    { label: "المساهمات بانتظار المراجعة", path: "contributions/pending", icon: "clock" },
    { label: "المساهمات المعتمدة", path: "contributions/approved", icon: "shield" },
    { label: "المساهمات المرفوضة", path: "contributions/rejected", icon: "x" },
  ] },
  { title: "إدارة الخدمات العقارية", items: [
    { label: "طلبات الخدمات", path: "service-requests", icon: "file" },
    { label: "تفاصيل الطلب", path: "service-requests/details", icon: "file-text" },
    { label: "الخدمات العقارية", path: "services", icon: "settings" },
    { label: "إضافة خدمة", path: "services/add", icon: "plus" },
    { label: "تعديل خدمة", path: "services/edit", icon: "file-text" },
    { label: "أسعار الخدمات", path: "services/pricing", icon: "circle-dollar" },
  ] },
  { title: "إدارة مزودي الخدمات", items: [
    { label: "مزودو الخدمات", path: "providers", icon: "users" },
    { label: "تفاصيل مزود الخدمة", path: "providers/details", icon: "file-text" },
    { label: "مزودون بانتظار المراجعة", path: "providers/pending", icon: "clock" },
    { label: "مزودون معتمدون", path: "providers/approved", icon: "shield" },
    { label: "مزودون مرفوضون", path: "providers/rejected", icon: "x" },
    { label: "إضافة مزود خدمة", path: "providers/add", icon: "plus" },
    { label: "تعديل مزود خدمة", path: "providers/edit", icon: "file-text" },
    { label: "مستندات المزود", path: "providers/documents", icon: "folder" },
    { label: "تقييمات المزود", path: "providers/ratings", icon: "star" },
    { label: "تصنيفات المزودين", path: "providers/categories", icon: "tag" },
  ] },
  { title: "إدارة الحسابات", items: [
    { label: "جميع الحسابات", path: "accounts", icon: "users" },
    { label: "تفاصيل الحساب", path: "accounts/details", icon: "file-text" },
    { label: "حسابات الأفراد", path: "accounts/individuals", icon: "user" },
    { label: "حسابات المنشآت", path: "accounts/businesses", icon: "building" },
    { label: "الحسابات بانتظار التوثيق", path: "accounts/pending", icon: "clock" },
    { label: "الحسابات الموثقة", path: "accounts/verified", icon: "shield" },
    { label: "الحسابات الموقوفة", path: "accounts/suspended", icon: "x" },
    { label: "إعدادات الحسابات", path: "accounts/settings", icon: "settings" },
  ] },
  { title: "إدارة المنصة", items: [
    { label: "المستخدمون", path: "users", icon: "users" },
    { label: "المنشآت", path: "businesses", icon: "building" },
  ] },
  { title: "المالية", items: [
    { label: "الفواتير", path: "billing", icon: "receipt" },
    { label: "تفاصيل الفاتورة", path: "billing/details", icon: "file-text" },
    { label: "المدفوعات", path: "payments", icon: "circle-dollar" },
    { label: "تفاصيل عملية الدفع", path: "payments/details", icon: "file-text" },
    { label: "الاشتراكات", path: "subscriptions", icon: "crown" },
    { label: "الباقات", path: "plans", icon: "tag" },
    { label: "الإيرادات", path: "revenue", icon: "chart" },
  ] },
  { title: "المحتوى", items: [
    { label: "جميع الصفحات", path: "content", icon: "layout" },
    { label: "تفاصيل الصفحة", path: "content/details", icon: "file-text" },
    { label: "إضافة صفحة", path: "content/add-page", icon: "plus" },
    { label: "تعديل صفحة", path: "content/edit-page", icon: "file-text" },
    { label: "الأخبار والمقالات", path: "content/articles", icon: "file-text" },
    { label: "تفاصيل خبر", path: "content/article-details", icon: "file-text" },
    { label: "إضافة خبر", path: "content/add-article", icon: "plus" },
    { label: "تعديل خبر", path: "content/edit-article", icon: "file-text" },
    { label: "التصنيفات", path: "content/categories", icon: "tag" },
    { label: "الوسائط", path: "content/media", icon: "file" },
    { label: "البنرات", path: "content/banners", icon: "layout" },
    { label: "الأسئلة الشائعة", path: "content/faq", icon: "message" },
    { label: "الشركاء", path: "content/partners", icon: "users" },
  ] },
  { title: "التقارير والتحليلات", items: [
    { label: "لوحة التقارير", path: "reports", icon: "chart" },
    { label: "تقرير الأصول العقارية", path: "reports/assets", icon: "building" },
    { label: "تقرير المساهمات العقارية", path: "reports/contributions", icon: "clipboard" },
    { label: "تقرير الخدمات العقارية", path: "reports/services", icon: "settings" },
    { label: "التقرير المالي", path: "reports/financial", icon: "circle-dollar" },
    { label: "سجل تصدير التقارير", path: "reports/exports", icon: "file-text" },
  ] },
  { title: "التواصل والدعم", items: [
    { label: "الإشعارات", path: "notifications", icon: "bell", badge: "8" },
    { label: "الرسائل", path: "messages", icon: "message", badge: "5" },
    { label: "الدعم", path: "support", icon: "headset" },
  ] },
  { title: "الإعدادات", items: [
    { label: "إعدادات الموقع", path: "settings", icon: "settings" },
    { label: "إعدادات الهوية البصرية", path: "settings/identity", icon: "layout" },
    { label: "إعدادات الصفحة الرئيسية", path: "settings/homepage", icon: "home" },
    { label: "إعدادات الشريط الرئيسي", path: "settings/header", icon: "layout" },
    { label: "إعدادات التذييل", path: "settings/footer", icon: "file-text" },
    { label: "إعدادات الإشعارات", path: "settings/notifications", icon: "bell" },
    { label: "إعدادات الرسائل", path: "settings/messages", icon: "message" },
    { label: "إعدادات البريد الإلكتروني", path: "settings/email", icon: "message" },
    { label: "إعدادات SEO", path: "settings/seo", icon: "tag" },
    { label: "إعدادات التكاملات", path: "settings/integrations", icon: "settings" },
  ] },
  { title: "النظام والصلاحيات", items: [
    { label: "الأدوار والصلاحيات", path: "system/roles", icon: "shield" },
    { label: "إضافة دور وظيفي", path: "system/roles/add", icon: "plus" },
    { label: "تعديل دور وظيفي", path: "system/roles/edit", icon: "file-text" },
    { label: "مدراء النظام", path: "system/admins", icon: "users" },
    { label: "إضافة مدير نظام", path: "system/admins/add", icon: "plus" },
    { label: "تفاصيل مدير النظام", path: "system/admins/details", icon: "user" },
    { label: "سجل الدخول", path: "system/login-log", icon: "clock" },
    { label: "سجل النشاط", path: "system/activity-log", icon: "file-text" },
    { label: "سجل العمليات الحساسة", path: "system/sensitive-log", icon: "shield" },
  ] },
  { title: "مركز المراجعة والاعتماد", items: [
    { label: "لوحة المراجعة الرئيسية", path: "review-center", icon: "settings" },
    { label: "مراجعة الأصول العقارية", path: "review-center/assets", icon: "building" },
    { label: "تفاصيل مراجعة الأصل", path: "review-center/assets/details", icon: "file-text" },
    { label: "مراجعة المساهمات العقارية", path: "review-center/contributions", icon: "clipboard" },
    { label: "تفاصيل مراجعة المساهمة", path: "review-center/contributions/details", icon: "file-text" },
    { label: "مراجعة الخدمات العقارية", path: "review-center/services", icon: "settings" },
    { label: "مراجعة مزودي الخدمات", path: "review-center/providers", icon: "users" },
    { label: "مراجعة طلبات التوثيق", path: "review-center/verification", icon: "folder" },
    { label: "مراجعة الأخبار والمقالات", path: "review-center/content", icon: "file-text" },
    { label: "سجل الاعتمادات", path: "review-center/approvals", icon: "shield" },
  ] },
];

const individualSummary: DashboardMetric[] = [
  { label: "الأصول العقارية", value: "18", unit: "أصل", delta: "+4 عن الشهر الماضي", icon: "building", tone: "green" },
  { label: "المساهمات العقارية", value: "7", unit: "مساهمة", delta: "+2 عن الشهر الماضي", icon: "handshake", tone: "green" },
  { label: "طلبات الخدمات", value: "16", unit: "طلب", delta: "+3 عن الشهر الماضي", icon: "clipboard", tone: "green" },
  { label: "عروض الأسعار", value: "9", unit: "عرض", delta: "+4 عن الشهر الماضي", icon: "tag", tone: "green" },
  { label: "الإشعارات", value: "6", unit: "جديدة", delta: "عرض الكل", icon: "bell", tone: "red" },
  { label: "العقود", value: "5", unit: "عقود", delta: "+1 عن الشهر الماضي", icon: "file", tone: "green" },
];

const businessSummary: DashboardMetric[] = [
  { label: "حالة المنشأة", value: "مكتمل", unit: "جميع البيانات محدثة", delta: "محدث", icon: "shield", tone: "green" },
  { label: "الأصول العقارية", value: "24", unit: "أصل عقاري", delta: "+4 عن الشهر الماضي", icon: "building", tone: "gold" },
  { label: "المساهمات العقارية", value: "8", unit: "مساهمة", delta: "+2 عن الشهر الماضي", icon: "users", tone: "gold" },
  { label: "الخدمات العقارية", value: "12", unit: "خدمة", delta: "+6 عن الشهر الماضي", icon: "settings", tone: "gold" },
  { label: "الطلبات المفتوحة", value: "7", unit: "طلب", delta: "قيد المتابعة", icon: "file", tone: "gold" },
  { label: "العمليات المالية", value: "32", unit: "عملية", delta: "آخر 30 يوم", icon: "receipt", tone: "gold" },
];

const adminSummary: DashboardMetric[] = [
  { label: "إجمالي المستخدمين", value: "2,840", unit: "حساب", delta: "+126 هذا الشهر", icon: "users", tone: "green" },
  { label: "المنشآت الموثقة", value: "318", unit: "منشأة", delta: "+24 هذا الشهر", icon: "building", tone: "green" },
  { label: "الأصول قيد المراجعة", value: "74", unit: "أصل", delta: "18 عاجلة", icon: "box", tone: "gold" },
  { label: "طلبات الخدمات", value: "146", unit: "طلب", delta: "+32 مفتوحة", icon: "clipboard", tone: "blue" },
  { label: "الفواتير المستحقة", value: "39", unit: "فاتورة", delta: "1.8 مليون ريال", icon: "receipt", tone: "red" },
  { label: "بلاغات الدعم", value: "11", unit: "بلاغ", delta: "5 عالية الأولوية", icon: "headset", tone: "red" },
];

const performance = (business = false): DashboardMetric[] => [
  { label: "الفرص المتاحة", value: business ? "25" : "22", unit: "فرصة", delta: "+12% عن الشهر الماضي", icon: "target", tone: "green" },
  { label: "العروض المرسلة", value: business ? "36" : "31", unit: "عرض", delta: "+8% عن الشهر الماضي", icon: "send", tone: "red" },
  { label: "العقود النشطة", value: business ? "14" : "11", unit: "عقد", delta: "+7% عن الشهر الماضي", icon: "file-text", tone: "blue" },
  { label: business ? "الرصيد الحالي" : "الفواتير المستحقة", value: business ? "12,450" : "3", unit: business ? "ريال" : "فواتير", delta: business ? "+3% عن الشهر الماضي" : "+1 عن الشهر الماضي", icon: "receipt", tone: business ? "green" : "red" },
  { label: "معدل التحويل", value: business ? "18%" : "16%", unit: "من اهتمام إلى عقد", delta: business ? "+5% عن الشهر الماضي" : "+4% عن الشهر الماضي", icon: "refresh", tone: "green" },
];

const adminPerformance: DashboardMetric[] = [
  { label: "معدل اعتماد الأصول", value: "64%", unit: "بعد المراجعة", delta: "+6% عن الشهر الماضي", icon: "shield", tone: "green" },
  { label: "متوسط زمن الرد", value: "4.2", unit: "ساعات", delta: "-18% تحسن", icon: "clock", tone: "green" },
  { label: "طلبات معلقة", value: "58", unit: "طلب", delta: "12 تحتاج تصعيد", icon: "clipboard", tone: "red" },
  { label: "إيرادات الاشتراكات", value: "1.2M", unit: "ريال", delta: "+14% عن الشهر الماضي", icon: "circle-dollar", tone: "green" },
  { label: "جاهزية المحتوى", value: "92%", unit: "مكتمل", delta: "7 عناصر للمراجعة", icon: "layout", tone: "blue" },
];

const opportunities: DashboardOpportunity[] = assets.map((asset, index) => ({
  slug: asset.slug,
  title: asset.titleAr,
  city: `${asset.cityAr} - ${asset.districtAr ?? "موقع مميز"}`,
  type: asset.assetTypeAr,
  area: formatArea(asset.areaSqm),
  price: formatSar([2250000, 8800000, 9800000, 3250000][index] ?? 3250000),
  tag: index === 0 ? "أصل يبحث عن دراسة جدوى" : index === 1 ? "أصل يبحث عن مدير مساهمة" : index === 2 ? "أصل يبحث عن مكتب هندسي" : "أصل يبحث عن مطور",
  image: asset.image,
}));

const individualActivities: DashboardActivity[] = [
  { title: "تم إضافة أصل عقاري جديد", description: "أرض سكنية - الرياض - النرجس", time: "منذ 10 دقائق", icon: "building", tone: "green" },
  { title: "تم استلام عرض سعر جديد", description: "عرض رقم #1256", time: "منذ 30 دقيقة", icon: "tag", tone: "red" },
  { title: "تم اعتماد وثيقة جديدة", description: "رخصة بناء - مجمع تجاري", time: "منذ ساعة", icon: "shield", tone: "green" },
  { title: "تم إصدار فاتورة جديدة", description: "فاتورة رقم INV-1045", time: "منذ 5 ساعات", icon: "receipt", tone: "red" },
];

const businessActivities: DashboardActivity[] = [
  { title: "تم إضافة أصل عقاري جديد", description: "أرض تجارية في الرياض - العليا", time: "منذ 10 دقائق", icon: "building", tone: "green" },
  { title: "تم إضافة مساهمة عقارية جديدة", description: "تحت دراسة فريق الاستثمار", time: "منذ 30 دقيقة", icon: "building", tone: "blue" },
  { title: "استلام طلب خدمة جديد", description: "طلب دراسة جدوى - مشروع تجاري", time: "منذ ساعة", icon: "star", tone: "red" },
  { title: "تم اعتماد وثيقة جديدة", description: "رخصة بناء - مجمع تجاري", time: "منذ 3 ساعات", icon: "shield", tone: "green" },
  { title: "تم إصدار فاتورة جديدة", description: "فاتورة رقم INV-1045", time: "منذ 5 ساعات", icon: "receipt", tone: "red" },
];

const adminActivities: DashboardActivity[] = [
  { title: "طلب توثيق منشأة بانتظار المراجعة", description: "شركة مدار التطوير العقاري", time: "منذ 8 دقائق", icon: "shield", tone: "gold" },
  { title: "أصل جديد يحتاج اعتماداً", description: "مجمع تجاري - الرياض", time: "منذ 18 دقيقة", icon: "building", tone: "green" },
  { title: "بلاغ دعم عالي الأولوية", description: "مشكلة في إصدار فاتورة", time: "منذ 42 دقيقة", icon: "headset", tone: "red" },
  { title: "تم نشر مقال جديد", description: "تحديثات حوكمة المساهمات", time: "منذ ساعتين", icon: "file-text", tone: "blue" },
];

export const dashboardRoles: Record<DashboardRole, DashboardRoleConfig> = {
  individual: {
    role: "individual",
    accountLabel: "حساب أفراد",
    ownerName: "بندر",
    ownerSubtitle: "بندر",
    heroTitle: "مرحباً بندر",
    heroDescription: "إدارة أصولك العقارية وطلباتك ومتابعة اهتماماتك من لوحة تحكم موحدة.",
    updatedAt: "01/06/2026",
    heroImage: "/images/asset-commercial-complex.png",
    heroActions: [
      { label: "إضافة أصل عقاري", tone: "primary", icon: "building", path: "add-asset" },
      { label: "طلب خدمة عقارية", tone: "secondary", icon: "file", path: "request-service" },
    ],
    nav: individualNav,
    summaryMetrics: individualSummary,
    performanceMetrics: performance(false),
    plan: {
      title: "خطتك الحالية",
      status: "الخطة الاحترافية",
      expiresAt: "تنتهي في 31/12/2026",
      action: "عرض تفاصيل الاشتراك والفواتير",
      stats: [
        { label: "مساهمات ضمان", value: "7", unit: "مساهمة" },
        { label: "أصول مضافة", value: "18", unit: "أصل" },
        { label: "العروض المستلمة", value: "12", unit: "عرض" },
        { label: "الفرص المتاحة", value: "40", unit: "فرصة" },
      ],
    },
    verification: { title: "حالة توثيق الحساب", status: "موثق", description: "جميع بياناتك موثقة", checks: ["الهوية الوطنية", "بيانات التواصل", "العنوان الوطني"] },
    sideCard: { title: "الأصول المهتم بها", value: "12", unit: "أصل", delta: "+2 عن الشهر الماضي", action: "عرض الأصول", image: "/images/faq-villa-bg.png" },
    opportunities,
    activities: individualActivities,
  },
  business: {
    role: "business",
    accountLabel: "حساب أعمال",
    ownerName: "شركة مهابة العقارية",
    ownerSubtitle: "شركة مهابة العقارية",
    heroTitle: "شركة مهابة العقارية",
    heroDescription: "إدارة الأصول العقارية والمساهمات العقارية والخدمات من مكان واحد",
    updatedAt: "01/06/2026",
    heroImage: "/images/dashboard-business-hero-sketch.png",
    heroActions: [
      { label: "إضافة أصل عقاري", tone: "primary", icon: "building", path: "add-asset" },
      { label: "إضافة مساهمة عقارية", tone: "primary", icon: "users", path: "add-contribution" },
      { label: "طلب خدمة عقارية", tone: "secondary", icon: "file", path: "request-service" },
      { label: "طلب توثيق المنشأة", tone: "secondary", icon: "shield", path: "verification" },
    ],
    nav: businessNav,
    summaryMetrics: businessSummary,
    performanceMetrics: performance(true),
    plan: {
      title: "الخطة الاحترافية",
      status: "إجمالي العقود 36",
      expiresAt: "تنتهي في 31/12/2026",
      action: "عرض تفاصيل الاشتراك والفواتير",
      stats: [
        { label: "إجمالي العقود", value: "36", unit: "عقد" },
        { label: "أعضاء الفريق", value: "12", unit: "عضو" },
        { label: "الفرص المستهدفة", value: "18", unit: "فرصة" },
        { label: "الفرص المتاحة", value: "50", unit: "فرصة" },
      ],
    },
    verification: { title: "حالة توثيق المنشأة", status: "100% مكتمل", description: "جميع متطلبات المنشأة مكتملة", progress: "100%", checks: ["السجل التجاري", "الزكاة", "التأمينات", "التراخيص المهنية"] },
    sideCard: { title: "الرصيد الحالي", value: "12,450", unit: "ريال", delta: "+3% عن الشهر الماضي", action: "عرض الرصيد", image: "/images/faq-villa-bg.png" },
    opportunities,
    activities: businessActivities,
  },
  admin: {
    role: "admin",
    accountLabel: "لوحة التحكم للموقع",
    ownerName: "إدارة مهابة",
    ownerSubtitle: "مركز إدارة المنصة",
    heroTitle: "لوحة التحكم للموقع",
    heroDescription: "إدارة المستخدمين والمنشآت والأصول والمساهمات والمحتوى من مركز تحكم مؤسسي واحد.",
    updatedAt: "09/06/2026",
    heroImage: "/images/media-featured.png",
    heroActions: [
      { label: "مراجعة الطلبات", tone: "primary", icon: "clipboard", path: "service-requests" },
      { label: "إضافة محتوى", tone: "secondary", icon: "layout", path: "content" },
      { label: "تصدير تقرير", tone: "secondary", icon: "file-text", path: "reports" },
    ],
    nav: adminNav,
    summaryMetrics: adminSummary,
    performanceMetrics: adminPerformance,
    plan: {
      title: "حالة تشغيل المنصة",
      status: "تشغيل مستقر",
      expiresAt: "آخر تدقيق: 09/06/2026",
      action: "عرض سجل العمليات والتدقيق",
      stats: [
        { label: "طلبات مفتوحة", value: "58", unit: "طلب" },
        { label: "أصول للمراجعة", value: "74", unit: "أصل" },
        { label: "بلاغات الدعم", value: "11", unit: "بلاغ" },
        { label: "نسبة الجاهزية", value: "92%", unit: "مكتمل" },
      ],
    },
    verification: { title: "امتثال المنصة", status: "مستقر", description: "المؤشرات التشغيلية ضمن الحدود المعتمدة", progress: "92%", checks: ["تحديث المحتوى", "سلامة الروابط", "سجل التدقيق", "قنوات الدعم"] },
    sideCard: { title: "عناصر تحتاج مراجعة", value: "18", unit: "عنصر", delta: "5 عالية الأولوية", action: "عرض قائمة المراجعة", image: "/images/knowledge-library.png" },
    opportunities,
    activities: adminActivities,
  },
};

export const dashboardRoleList = Object.keys(dashboardRoles) as DashboardRole[];

export function dashboardHref(role: DashboardRole, path = "") {
  return path ? `/dashboard/${role}/${path}` : `/dashboard/${role}`;
}

export function findNavItem(role: DashboardRole, path: string) {
  const navItem = dashboardRoles[role].nav.flatMap((group) => group.items).find((item) => item.path === path);
  if (navItem) return navItem;
  const adminAliases: Record<string, DashboardNavItem> = {
    invoices: { label: "الفواتير", path, icon: "receipt" },
    "invoices/details": { label: "تفاصيل الفاتورة", path, icon: "file-text" },
    "invoice-details": { label: "تفاصيل الفاتورة", path, icon: "file-text" },
    "asset-reviews/details": { label: "تفاصيل مراجعة الأصل", path, icon: "file-text" },
    "users-management": { label: "إدارة المستخدمين", path, icon: "users" },
    "business-accounts": { label: "حسابات المنشآت", path, icon: "building" },
    "asset-reviews": { label: "مراجعة الأصول العقارية", path, icon: "building" },
    "contribution-reviews/details": { label: "تفاصيل مراجعة المساهمة", path, icon: "file-text" },
    "contribution-reviews": { label: "مراجعة المساهمات", path, icon: "users" },
    "service-reviews/details": { label: "تفاصيل طلب خدمة", path, icon: "file-text" },
    "service-reviews": { label: "مراجعة طلبات الخدمات", path, icon: "briefcase" },
    "service-requests-management/details": { label: "تفاصيل طلب خدمة", path, icon: "file-text" },
    "service-requests-management": { label: "إدارة طلبات الخدمات", path, icon: "briefcase" },
    "verification-requests": { label: "طلبات شارة التوثيق", path, icon: "folder" },
    "support-tickets": { label: "بلاغات الدعم", path, icon: "headset" },
    "activity-log": { label: "سجل النشاط", path, icon: "file-text" },
    "audit-log": { label: "سجل التدقيق", path, icon: "file-text" },
    "system-settings": { label: "إعدادات النظام", path, icon: "settings" },
    "content-management": { label: "إدارة المحتوى", path, icon: "layout" },
  };
  if (role === "admin" && adminAliases[path]) return adminAliases[path];
  if (role === "individual" && path.startsWith("asset-details")) return { label: "تفاصيل الأصل", path, icon: "file-text" };
  if (role === "individual" && path.startsWith("contribution-details")) return { label: "تفاصيل المساهمة", path, icon: "file-text" };
  if (role === "individual" && path.startsWith("service-details")) return { label: "تفاصيل الطلب", path, icon: "file-text" };
  if (role === "individual" && path === "verification") return { label: "طلب شارة التوثيق", path, icon: "shield" };
  if (role === "business" && path === "my-assets") return { label: "أصولي المضافة", path, icon: "building" };
  if (role === "business" && path === "my-contributions") return { label: "مساهماتي", path, icon: "users" };
  if (role === "business" && path.startsWith("asset-details")) return { label: "تفاصيل الأصل العقاري", path, icon: "file-text" };
  if (role === "business" && path.startsWith("contribution-details")) return { label: "تفاصيل المساهمة", path, icon: "file-text" };
  if (role === "business" && path.startsWith("service-details")) return { label: "تفاصيل الطلب", path, icon: "file-text" };
  return undefined;
}

export function roleLabel(role: DashboardRole) {
  return dashboardRoles[role].accountLabel;
}

export const staticRows: StaticRow[] = [
  { id: "REQ-1045", title: "طلب دراسة أصل عقاري", subtitle: "مجمع تجاري - الرياض", meta: "تم التحديث منذ 10 دقائق", amount: "9,800,000 ريال", status: "قيد المراجعة", statusTone: "gold" },
  { id: "AST-2201", title: "أرض سكنية في النرجس", subtitle: "أصل يبحث عن مطور", meta: "أضيف بواسطة أحمد محمد", amount: "2,250,000 ريال", status: "نشط", statusTone: "green" },
  { id: "INV-1045", title: "فاتورة اشتراك سنوي", subtitle: "الخطة الاحترافية", meta: "تستحق خلال 7 أيام", amount: "12,450 ريال", status: "مستحقة", statusTone: "red" },
  { id: "CNT-781", title: "عقد خدمة هندسية", subtitle: "مكتب هندسي معتمد", meta: "تم اعتماد الوثائق", amount: "36 شهر", status: "موثق", statusTone: "green" },
  { id: "USR-300", title: "مستخدم جديد", subtitle: "حساب أعمال", meta: "بانتظار التحقق النهائي", amount: "4 مستندات", status: "معلق", statusTone: "blue" },
];

export function pageRows(path: string) {
  if (path.includes("asset")) return assets.map((asset) => ({ id: asset.id, title: asset.titleAr, subtitle: `${asset.cityAr} - ${asset.assetTypeAr}`, meta: asset.listingDate, amount: formatArea(asset.areaSqm), status: asset.statusAr, statusTone: "gold" as TrendTone }));
  if (path.includes("contribution")) return contributions.map((item) => ({ id: item.id, title: item.titleAr, subtitle: item.cityAr, meta: item.stageAr, amount: formatSar(item.capitalSar), status: `${item.fundedPercent}% ممول`, statusTone: item.fundedPercent > 60 ? "green" as TrendTone : "blue" as TrendTone }));
  if (path.includes("invoice") || path.includes("billing") || path.includes("payment") || path.includes("subscription")) return staticRows.filter((row) => row.id.includes("INV") || row.title.includes("اشتراك"));
  if (path.includes("user") || path.includes("team") || path.includes("business")) return staticRows.filter((row) => row.id.includes("USR") || row.title.includes("مستخدم"));
  return staticRows;
}

export function isFormPath(path: string) {
  return ["add-asset", "request-service", "add-contribution", "profile", "company-profile", "licenses", "verification", "settings", "security"].includes(path);
}

export { brown as dashboardBrown };
