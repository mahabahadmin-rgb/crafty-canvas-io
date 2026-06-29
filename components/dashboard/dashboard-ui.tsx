import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  CheckCircle2,
  CircleCheck,
  CircleDollarSign,
  Clock3,
  ClipboardList,
  Crown,
  File,
  FileSearch,
  FileText,
  Heart,
  Info,
  MapPin,
  MessageSquare,
  PenLine,
  Plus,
  RefreshCcw,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Star,
  Tag,
  Target,
  UploadCloud,
  UserRound,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { AdminAccountStatusButton, AdminManagementActionButton, DashboardDocumentUploadButton, DashboardRequestFormSubmitButton, InterestActionButton, ReviewDecisionButton, SaveAccountSettingsButton, SubmitVerificationRequestButton } from "@/components/dashboard/dashboard-actions";
import { AdminArchiveConversationButton, AdminMessageThread, AdminNotificationReadButton, AdminNotificationSendForm, AdminSupportTicketReplyForm, AdminSupportTicketUpdateButton, ArchiveConversationButton, DashboardMessageThread, DashboardSupportTicketForm, DashboardSupportTicketReplyForm, DashboardSupportTicketUpdateButton, MarkNotificationsReadButton } from "@/components/dashboard/communication-actions";
import { FinancialExportButton, PayInvoiceButton, SubscriptionPlanButton } from "@/components/dashboard/financial-actions";
import { cn, formatArea, formatSar } from "@/lib/utils";
import { realEstateServices } from "@/lib/data/services";
import {
  listDashboardFinancial,
  listDashboardPlatformSettings,
  listDashboardAdminAccounts,
  listDashboardAdminAssets,
  listDashboardAdminAuditLogs,
  listDashboardAdminContributions,
  listDashboardAdminContentComments,
  listDashboardAdminContentItems,
  listDashboardAdminConversations,
  listDashboardAdminMessages,
  listDashboardAdminProviders,
  listDashboardAdminRoles,
  listDashboardAdminServiceCatalog,
  listDashboardAdminServiceRequests,
  getDashboardAdminSupportTicket,
  listDashboardAdminNotifications,
  listDashboardAdminVerificationRequests,
  getServices,
  getDashboardSupportTicket,
  getDashboardBusinessProfile,
  getDashboardIndividualProfile,
  listDashboardAdminSupportTickets,
  listDashboardConversations,
  listDashboardAssetsForScope,
  listDashboardContributionsForScope,
  listDashboardServiceRequestsForScope,
  listDashboardSystemAdmins,
  listDashboardDocumentsForEntity,
  listDashboardMessages,
  listDashboardNotifications,
  listDashboardSupportTickets,
  type DashboardAdminAccount,
  type DashboardAdminAccountKind,
  type DashboardAdminAccountStatus,
  type DashboardAdminAssetRow,
  type DashboardAdminAuditLog,
  type DashboardAdminContentItem,
  type DashboardAdminContentComment,
  type DashboardAdminContentCommentStatus,
  type DashboardAdminContentKind,
  type DashboardAdminContentStatus,
  type DashboardAdminContributionRow,
  type DashboardDocumentRow,
  type DashboardAdminProvider,
  type DashboardAdminProviderStatus,
  type DashboardAdminRole,
  type DashboardAdminReviewStatus,
  type DashboardAdminServiceCatalogItem,
  type DashboardAdminServiceRequest,
  type DashboardAdminServiceRequestStatus,
  type DashboardActorContext,
  type DashboardDataScope,
  type DashboardNotification,
  type DashboardAdminVerificationRequest,
  type DashboardEntityRequestKind,
  type DashboardEntityRequestScope,
  type DashboardFinancialData,
  type DashboardFinancialScope,
  type DashboardInvoice,
  type DashboardPayment,
  type DashboardPlatformSetting,
  type DashboardSubscription,
  type DashboardSupportTicket,
  type DashboardSystemAdmin,
  supabaseRuntimeState,
} from "@/lib/supabase/mahabah";
import {
  dashboardBrown,
  dashboardHref,
  findNavItem,
  isFormPath,
  pageRows,
  type DashboardActivity,
  type DashboardMetric,
  type DashboardOpportunity,
  type DashboardRole,
  type DashboardRoleConfig,
  type StaticRow,
  type TrendTone,
} from "@/lib/data/dashboard";

const icons: Record<string, LucideIcon> = {
  building: Building2,
  handshake: Heart,
  clipboard: ClipboardList,
  tag: Tag,
  bell: Bell,
  file: File,
  target: Target,
  send: Send,
  "file-text": FileText,
  receipt: CalendarCheck,
  refresh: RefreshCcw,
  users: Users,
  star: Star,
  shield: ShieldCheck,
  chart: BarChart3,
  layout: BriefcaseBusiness,
  headset: MessageSquare,
  "circle-dollar": CircleDollarSign,
  clock: CalendarCheck,
  crown: Crown,
  plus: Plus,
  settings: Settings2,
  location: MapPin,
  user: UserRound,
  x: XCircle,
};

const uiColors = {
  surface: "#fffdf9",
  border: "rgba(232, 222, 212, 0.95)",
  navy: "#1D1916",
  muted: "#5f5953",
  redBrown: "#8F6B4C",
  softRed: "#fff0eb",
  redBorder: "#8F6B4C",
};

const toneStyles: Record<TrendTone, { text: string; bg: string; border: string; dot: string }> = {
  green: { text: "#087342", bg: "#e9f7ef", border: "#b9e1ca", dot: "#087342" },
  red: { text: "#8F6B4C", bg: "#fff0eb", border: "#efc5b9", dot: "#8F6B4C" },
  blue: { text: "#A7815E", bg: "#F6F4F1", border: "#D9D1C7", dot: "#A7815E" },
  gold: { text: "#A7815E", bg: "#fbf3e9", border: "#e3c8aa", dot: "#A7815E" },
};

function Icon({ name, className, style }: { name: string; className?: string; style?: CSSProperties }) {
  const Component = icons[name] ?? File;
  return <Component className={className} style={style} />;
}

function StatusPill({ label, tone = "gold" }: { label: string; tone?: TrendTone }) {
  const style = toneStyles[tone];
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold" style={{ backgroundColor: style.bg, borderColor: style.border, color: style.text }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: style.dot }} />
      {label}
    </span>
  );
}

export function DashboardTopbar({ config }: { config: DashboardRoleConfig }) {
  const badges = config.topbarBadges ?? {};
  return (
    <div className="mb-4 hidden items-center justify-between gap-4 lg:flex">
      <div className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-card" style={{ borderColor: uiColors.border }}>
        <div className="grid h-12 w-12 place-items-center rounded-full" style={{ backgroundColor: "#f1e7de", color: "#7b5131" }}>
          <Users className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-ink">{config.ownerSubtitle}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">{config.accountLabel}<CheckCircle2 className="h-3.5 w-3.5 text-[#087342]" /></p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {[{ icon: Bell, count: badges.notifications ?? "0", path: "notifications", label: "الإشعارات" }, { icon: MessageSquare, count: badges.messages ?? "0", path: "messages", label: "الرسائل" }].map(({ icon: Component, count, path, label }) => (
          <Link key={path} href={dashboardHref(config.role, path)} className="relative grid h-12 w-12 place-items-center rounded-2xl border bg-white text-navy shadow-card" style={{ borderColor: uiColors.border }} aria-label={label}>
            <Component className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-bold text-white" style={{ backgroundColor: uiColors.redBrown }}>{count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function DashboardHero({ config }: { config: DashboardRoleConfig }) {
  return (
    <section className="relative min-w-0 overflow-hidden rounded-[22px] border bg-white p-5 shadow-card md:p-7" style={{ backgroundColor: uiColors.surface, borderColor: uiColors.border }}>
      <div className="absolute inset-0 opacity-[0.46]">
        <Image src={config.heroImage} alt="" fill className="object-cover object-left grayscale-[8%]" sizes="80vw" priority />
      </div>
      <div className="absolute inset-0" style={{ background: "linear-gradient(to left, rgba(255,253,249,0.98) 0%, rgba(255,253,249,0.96) 42%, rgba(255,253,249,0.68) 72%, rgba(255,253,249,0.26) 100%)" }} />
      <div className="relative grid min-h-[265px] min-w-0 content-between gap-8 md:min-h-[315px]">
        <div className="w-full max-w-xl justify-self-start text-right">
          <h1 className="font-display text-3xl font-extrabold leading-[1.45] text-navy md:text-[34px]" style={{ color: uiColors.navy }}>{config.heroTitle}</h1>
          <p className="mt-3 max-w-lg text-lg font-semibold leading-8" style={{ color: uiColors.navy }}>{config.heroDescription}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-bold" style={{ color: "#1f1f1f" }}><CheckCircle2 className="h-4 w-4" style={{ color: "#087342" }} />آخر تحديث: {config.updatedAt}</p>
        </div>
        <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {config.heroActions.map((action) => (
            <Link
              key={action.label}
              href={dashboardHref(config.role, action.path)}
              className={cn("flex min-h-14 items-center justify-center gap-3 rounded-xl border px-4 text-sm font-extrabold transition", action.tone === "primary" ? "shadow-[0_18px_38px_rgb(167_129_94/0.2)]" : "")}
              style={
                action.tone === "primary"
                  ? { backgroundColor: dashboardBrown, borderColor: dashboardBrown, color: "#ffffff" }
                  : { backgroundColor: "#fffdf9", borderColor: uiColors.redBorder, color: uiColors.redBrown }
              }
            >
              <Icon name={action.icon} className="h-5 w-5" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MetricCard({ metric, compact = false }: { metric: DashboardMetric; compact?: boolean }) {
  const tone = toneStyles[metric.tone ?? "gold"];
  return (
    <article className="min-w-0 rounded-[18px] border p-4 text-center shadow-card" style={{ backgroundColor: uiColors.surface, borderColor: uiColors.border }}>
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-full border" style={{ backgroundColor: tone.bg, borderColor: tone.border, color: tone.text }}>
        <Icon name={metric.icon} className="h-5 w-5" />
      </div>
      <p className="mt-3 text-xs font-bold text-muted">{metric.label}</p>
      <div className="mt-2 font-display text-3xl font-extrabold text-navy">{metric.value}</div>
      <p className="mt-1 text-xs font-semibold text-ink/70">{metric.unit}</p>
      {!compact ? <Sparkline tone={metric.tone ?? "gold"} /> : null}
      <p className="mt-2 text-xs font-bold" style={{ color: tone.text }}>{metric.delta}</p>
    </article>
  );
}

function Sparkline({ tone }: { tone: TrendTone }) {
  const stroke = tone === "red" ? "#8F6B4C" : tone === "blue" ? "#A7815E" : tone === "green" ? "#087342" : "#A7815E";
  return (
    <svg viewBox="0 0 120 28" className="mt-3 h-7 w-full" aria-hidden="true">
      <polyline points="2,22 20,17 38,9 56,20 74,13 92,18 118,10" fill="none" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {[2, 20, 38, 56, 74, 92, 118].map((x, i) => <circle key={x} cx={x} cy={[22, 17, 9, 20, 13, 18, 10][i]} r="2.5" fill={stroke} />)}
    </svg>
  );
}

export function PlanCard({ config }: { config: DashboardRoleConfig }) {
  return (
    <article className="rounded-[22px] border p-5 text-white shadow-[0_22px_54px_rgb(0_0_0/0.16)]" style={{ borderColor: "#8F6B4C", background: "radial-gradient(circle at 12% 12%, rgba(184,154,122,0.18), transparent 16rem), linear-gradient(135deg, #151210, #2D2823)" }}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-white/62">{config.plan.title}</p>
          <h2 className="mt-1 font-display text-xl font-extrabold">{config.plan.status}</h2>
          <p className="mt-1 text-xs text-gold-light">{config.plan.expiresAt}</p>
        </div>
        <Crown className="h-8 w-8 text-gold-light" />
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {config.plan.stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/12 bg-white/5 p-3 text-center">
            <p className="text-[11px] text-white/55">{stat.label}</p>
            <strong className="mt-1 block text-xl">{stat.value}</strong>
            <span className="text-[11px] text-white/55">{stat.unit}</span>
          </div>
        ))}
      </div>
      <Link href={dashboardHref(config.role, config.role === "admin" ? "system/activity-log" : "subscriptions")} className="mt-4 grid min-h-11 w-full place-items-center rounded-xl border border-gold/35 text-sm font-bold text-gold-light">{config.plan.action}</Link>
    </article>
  );
}

export function VerificationCard({ config }: { config: DashboardRoleConfig }) {
  return (
    <article className="rounded-[22px] border p-5 text-center shadow-card" style={{ backgroundColor: uiColors.surface, borderColor: uiColors.border }}>
      <div className="mb-4 flex items-center justify-center gap-2 text-navy"><ShieldCheck className="h-6 w-6 text-[#087342]" /><h2 className="font-display text-xl font-extrabold">{config.verification.title}</h2></div>
      {config.verification.progress ? <div className="mx-auto mb-4 grid h-28 w-28 place-items-center rounded-full border-[8px] border-[#087342] text-xl font-extrabold text-[#087342]">{config.verification.progress}</div> : <p className="font-display text-3xl font-extrabold text-[#087342]">{config.verification.status}</p>}
      <p className="mt-2 text-sm font-semibold text-muted">{config.verification.description}</p>
      <div className="mt-4 grid gap-2 text-right text-sm">
        {config.verification.checks.map((check) => <span key={check} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#087342]" />{check}</span>)}
      </div>
      <Link href={dashboardHref(config.role, config.role === "admin" ? "review-center/verification" : "verification")} className="mt-5 grid min-h-11 w-full place-items-center rounded-xl border border-line bg-white text-sm font-bold text-[#8F6B4C]">عرض التفاصيل</Link>
    </article>
  );
}

export function SideInterestCard({ config }: { config: DashboardRoleConfig }) {
  return (
    <article className="relative overflow-hidden rounded-[22px] border p-5 text-center shadow-card" style={{ backgroundColor: uiColors.surface, borderColor: uiColors.border }}>
      <Image src={config.sideCard.image} alt="" fill className="object-cover opacity-[0.18]" sizes="30vw" />
      <div className="relative">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-[#edf8f1] text-[#087342]"><Heart className="h-6 w-6" /></div>
        <h2 className="font-display text-xl font-extrabold text-navy">{config.sideCard.title}</h2>
        <strong className="mt-3 block font-display text-4xl text-navy">{config.sideCard.value}</strong>
        <p className="text-sm text-muted">{config.sideCard.unit}</p>
        <p className="mt-2 text-xs font-bold text-[#087342]">{config.sideCard.delta}</p>
        <Link href={dashboardHref(config.role, config.role === "admin" ? "review-center" : "interested-assets")} className="mt-4 grid min-h-11 w-full place-items-center rounded-xl border border-line bg-white text-sm font-bold text-[#8F6B4C]">{config.sideCard.action}</Link>
      </div>
    </article>
  );
}

export function OpportunityCard({ item, role }: { item: DashboardOpportunity; role: DashboardRole }) {
  const detailsHref = dashboardHref(role, role === "admin"
    ? "assets"
    : `asset-details?asset=${encodeURIComponent(item.slug ?? item.id ?? item.title)}`);
  const canPersistInterest = role !== "admin" && Boolean(item.id || item.slug);

  return (
    <article className="min-w-[220px] overflow-hidden rounded-[18px] border shadow-card" style={{ backgroundColor: uiColors.surface, borderColor: uiColors.border }}>
      <div className="relative h-32 bg-surface">
        <Image src={item.image} alt={`رسم ${item.title}`} fill className="object-cover grayscale-[8%]" sizes="240px" />
        <span className="absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold" style={{ backgroundColor: uiColors.softRed, color: uiColors.redBrown }}>{item.tag}</span>
      </div>
      <div className="p-4 text-center">
        <h3 className="font-display text-lg font-extrabold text-navy">{item.title}</h3>
        <p className="mt-1 text-xs text-muted">{item.city}</p>
        <p className="mt-2 text-xs text-ink">{item.type} · {item.area}</p>
        <p className="mt-1 text-xs font-bold text-ink">السعر: {item.price}</p>
        <div className="mt-3 flex gap-2">
          {canPersistInterest ? (
            <>
              <InterestActionButton entityType="asset" entityId={item.id} slug={item.slug} title={item.title} className="min-h-9 flex-1 rounded-lg border bg-white text-xs font-bold" style={{ borderColor: uiColors.border, color: uiColors.redBrown }} />
              <InterestActionButton entityType="asset" entityId={item.id} slug={item.slug} title={item.title} activeLabel="" inactiveLabel="" icon="heart" iconClassName="h-4 w-4" activeIconClassName="h-4 w-4 fill-[#8F6B4C]" ariaLabel="حفظ" className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-white text-[#8F6B4C]" />
            </>
          ) : (
            <>
              <Link href={detailsHref} className="grid min-h-9 flex-1 place-items-center rounded-lg border bg-white text-xs font-bold" style={{ borderColor: uiColors.border, color: uiColors.redBrown }}>
                {role === "admin" ? "إدارة الأصل" : "عرض التفاصيل"}
              </Link>
              <Link href={detailsHref} aria-label="عرض التفاصيل" className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-white text-[#8F6B4C]">
                <Heart className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export function ActivityTimeline({ items, role }: { items: DashboardActivity[]; role: DashboardRole }) {
  const activityHref = dashboardHref(role, role === "admin" ? "system/activity-log" : "notifications");

  return (
    <article className="rounded-[22px] border p-5 shadow-card" style={{ backgroundColor: uiColors.surface, borderColor: uiColors.border }}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-extrabold text-navy">آخر الأنشطة</h2>
        <Link href={activityHref} className="rounded-full border px-4 py-1.5 text-xs font-bold" style={{ borderColor: uiColors.border, color: uiColors.redBrown }}>عرض الكل</Link>
      </div>
      <div className="grid gap-3">
        {items.map((item) => {
          const tone = toneStyles[item.tone];
          return (
            <div key={item.title} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-line/70 pb-3 last:border-b-0">
              <span className="text-xs text-muted">{item.time}</span>
              <div className="text-right"><p className="text-sm font-bold text-ink">{item.title}</p><p className="mt-1 text-xs text-muted">{item.description}</p></div>
              <span className="grid h-11 w-11 place-items-center rounded-full border" style={{ backgroundColor: tone.bg, borderColor: tone.border, color: tone.text }}><Icon name={item.icon} className="h-5 w-5" /></span>
            </div>
          );
        })}
      </div>
      <Link href={activityHref} className="mt-4 grid min-h-10 w-full place-items-center rounded-xl border text-sm font-bold" style={{ borderColor: uiColors.border, color: uiColors.redBrown }}>عرض جميع الأنشطة</Link>
    </article>
  );
}

const individualHomeStats = [
  { title: "الأصول المضافة", value: "12", unit: "أصل عقاري", icon: "building", path: "my-assets" },
  { title: "الأصول المهتم بها", value: "8", unit: "أصول عقارية", icon: "heart", path: "interested-assets" },
  { title: "المساهمات المهتم بها", value: "5", unit: "مساهمات عقارية", icon: "chart", path: "interested-contributions" },
  { title: "طلبات الخدمات", value: "7", unit: "طلبات", icon: "clipboard", path: "request-service" },
];

function individualStatsFromConfig(config: DashboardRoleConfig) {
  const byLabel = new Map(config.summaryMetrics.map((metric) => [metric.label, metric]));
  return individualHomeStats.map((item) => {
    if (item.title === "الأصول المضافة") {
      const metric = byLabel.get("الأصول العقارية");
      return metric ? { ...item, value: metric.value, unit: metric.unit ?? item.unit } : item;
    }
    if (item.title === "الأصول المهتم بها") {
      const metric = byLabel.get("عروض الأسعار");
      return metric ? { ...item, value: metric.value, unit: "أصول عقارية" } : item;
    }
    if (item.title === "المساهمات المهتم بها") {
      const metric = byLabel.get("المساهمات العقارية");
      return metric ? { ...item, value: metric.value, unit: "مساهمات عقارية" } : item;
    }
    if (item.title === "طلبات الخدمات") {
      const metric = byLabel.get("طلبات الخدمات");
      return metric ? { ...item, value: metric.value, unit: metric.unit ?? item.unit } : item;
    }
    return item;
  });
}

type IndividualPerformanceItem = {
  title: string;
  value: string;
  unit: string;
  icon: string;
  progress?: boolean;
  progressValue?: string;
};

const individualPerformanceItems: IndividualPerformanceItem[] = [
  { title: "حالة الأصول", value: "9 أصول نشطة", unit: "3 قيد المراجعة", icon: "building" },
  { title: "حالة الخدمات", value: "4 قيد التنفيذ", unit: "3 مكتملة", icon: "settings" },
  { title: "حالة الحساب", value: "85%", unit: "اكتمال الملف الشخصي", icon: "user", progress: true, progressValue: "85%" },
  { title: "حالة الاشتراك", value: "الباقة الأساسية", unit: "متبقي 24 يوم", icon: "crown" },
];

function metricByLabel(config: DashboardRoleConfig, label: string) {
  return config.performanceMetrics.find((metric) => metric.label === label);
}

function progressWidth(value?: string) {
  const pct = Number.parseFloat(value ?? "");
  if (!Number.isFinite(pct)) return "0%";
  return `${Math.min(100, Math.max(0, pct))}%`;
}

function individualPerformanceItemsFromConfig(config: DashboardRoleConfig): IndividualPerformanceItem[] {
  const assets = metricByLabel(config, "الفرص المتاحة");
  const services = metricByLabel(config, "العروض المرسلة");
  const completed = metricByLabel(config, "العقود النشطة");
  const dueInvoices = metricByLabel(config, "الفواتير المستحقة");
  const accountProgress = config.verification.progress ?? metricByLabel(config, "معدل التحويل")?.value ?? individualPerformanceItems[2].value;

  return [
    {
      title: "حالة الأصول",
      value: `${assets?.value ?? individualPerformanceItems[0].value} ${assets?.unit ?? ""}`.trim(),
      unit: assets?.delta ?? individualPerformanceItems[0].unit,
      icon: "building",
    },
    {
      title: "حالة الخدمات",
      value: `${services?.value ?? individualPerformanceItems[1].value} ${services?.unit ?? ""}`.trim(),
      unit: services?.delta ?? completed?.delta ?? individualPerformanceItems[1].unit,
      icon: "settings",
    },
    {
      title: "حالة الحساب",
      value: accountProgress,
      unit: config.verification.description || individualPerformanceItems[2].unit,
      icon: "user",
      progress: true,
      progressValue: accountProgress,
    },
    {
      title: "حالة الاشتراك",
      value: config.plan.status || individualPerformanceItems[3].value,
      unit: dueInvoices ? `${dueInvoices.value} ${dueInvoices.unit ?? ""} مستحقة`.trim() : config.plan.expiresAt || individualPerformanceItems[3].unit,
      icon: "crown",
    },
  ];
}

const individualQuickAccess = [
  { title: "الدعم الفني", icon: "headset", path: "support" },
  { title: "الفواتير", icon: "receipt", path: "invoices" },
  { title: "طلب خدمة عقارية", icon: "settings", path: "request-service" },
  { title: "استعراض المساهمات", icon: "chart", path: "browse-contributions" },
  { title: "استعراض الأصول", icon: "building", path: "browse-assets" },
  { title: "إضافة أصل عقاري", icon: "building", path: "add-asset" },
];

function IndividualStatCard({ item, role }: { item: (typeof individualHomeStats)[number]; role: DashboardRole }) {
  return (
    <article className="rounded-lg border border-[#ece1d8] bg-white px-5 py-3 text-center shadow-[0_10px_24px_rgb(29_25_22/0.025)]">
      <div className="flex min-h-20 items-start justify-between gap-5 text-right">
        <div>
          <h2 className="text-[15px] font-extrabold text-[#1D1916]">{item.title}</h2>
          <div className="mt-3 font-display text-3xl font-extrabold leading-none text-[#1D1916]">{item.value}</div>
          <p className="mt-1.5 text-sm font-bold text-[#6E6258]">{item.unit}</p>
        </div>
        <Icon name={item.icon} className="h-10 w-10 stroke-[1.35] text-[#8F6B4C]" />
      </div>
      <Link href={dashboardHref(role, item.path)} className="mt-2 flex min-h-8 items-center justify-between border-t border-[#eee4dc] pt-2 text-sm font-bold text-[#1D1916]">
        <span>عرض التفاصيل</span>
        <ArrowLeft className="h-4 w-4" />
      </Link>
    </article>
  );
}

function IndividualSectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-8">
      <span className="h-px w-24 bg-[#D9D1C7]" aria-hidden="true" />
      <h2 className="font-display text-xl font-extrabold text-[#1D1916]">{children}</h2>
      <span className="h-px w-24 bg-[#D9D1C7]" aria-hidden="true" />
    </div>
  );
}

function ScoreRing({ value = 92, label = "درجة الحساب" }: { value?: number; label?: string }) {
  const score = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className="grid place-items-center text-center">
      <div className="grid h-32 w-32 place-items-center rounded-full p-2" style={{ background: `conic-gradient(#A7815E 0 ${score}%, #D9D1C7 ${score}% 100%)` }}>
        <div className="grid h-full w-full place-items-center rounded-full bg-white">
          <div>
            <div className="font-display text-4xl font-extrabold leading-none text-[#1D1916]">{score}</div>
            <div className="mt-1 text-sm font-bold text-[#1D1916]">من 100</div>
          </div>
        </div>
      </div>
      <p className="mt-2 text-sm font-extrabold text-[#1D1916]">{label}</p>
    </div>
  );
}

function IndividualPerformancePanel({ config }: { config: DashboardRoleConfig }) {
  const items = individualPerformanceItemsFromConfig(config);

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article key={item.title} className="rounded-lg border border-[#ece1d8] bg-white px-5 py-3 text-right shadow-[0_10px_24px_rgb(29_25_22/0.025)]">
          <div className="flex min-h-20 items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-[15px] font-extrabold text-[#1D1916]">{item.title}</h3>
              <div className="mt-3 font-display text-[28px] font-extrabold leading-tight text-[#1D1916]">{item.value}</div>
              <p className="mt-1.5 text-sm font-bold text-[#1D1916]">{item.unit}</p>
            </div>
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#F6F4F1] text-[#8F6B4C]">
              <Icon name={item.icon} className="h-8 w-8 stroke-[1.35]" />
            </span>
          </div>
          {item.progress ? (
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#EFE8E2]">
              <span className="block h-full rounded-full bg-[#8F6B4C]" style={{ width: progressWidth(item.progressValue ?? item.value) }} />
            </div>
          ) : (
            <div className="mt-4 border-t border-[#eee4dc] pt-3 text-sm font-bold text-[#8F6B4C]">
              <Link href={dashboardHref("individual")} className="inline-flex items-center gap-2">
                عرض التفاصيل
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          )}
          </article>
      ))}
    </section>
  );
}

function IndividualQuickAccessCard({ item, role }: { item: (typeof individualQuickAccess)[number]; role: DashboardRole }) {
  return (
    <Link href={dashboardHref(role, item.path)} className="grid min-h-24 place-items-center rounded-lg border border-[#ece1d8] bg-white px-5 py-4 text-center shadow-[0_10px_24px_rgb(29_25_22/0.02)] transition hover:border-[#B89A7A] hover:bg-[#fffaf5]">
      <Icon name={item.icon} className="mb-3 h-10 w-10 stroke-[1.35] text-[#8F6B4C]" />
      <span className="text-[15px] font-extrabold text-[#1D1916]">{item.title}</span>
    </Link>
  );
}

function IndividualDashboardFooter() {
  return (
    <footer className="mt-4 bg-[#1D1916] px-7 py-4 text-white">
      <div className="grid gap-5 md:items-center" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div className="text-right">
          <div className="font-display text-3xl font-extrabold text-white">مهابة</div>
          <div className="mt-1 text-xs tracking-[0.28em] text-[#B89A7A]">MAHABAH</div>
          <p className="mt-2 max-w-xs text-sm leading-6 text-white/78">مهابة - حيث تُصان الثروة وتُبنى الأصول.</p>
        </div>
        <div className="border-y border-white/10 py-3 md:border-x md:border-y-0 md:px-8 md:py-0">
          <h3 className="text-sm font-extrabold text-[#B89A7A]">روابط مهمة</h3>
          <div className="mt-2 grid gap-1.5 text-sm text-white/78">
            {["سياسة الخصوصية", "شروط الاستخدام", "إخلاء المسؤولية"].map((item) => (
              <span key={item} className="flex items-center justify-between gap-3">
                {item}
                <ArrowLeft className="h-4 w-4 text-[#B89A7A]" />
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-[#B89A7A]">تواصل معنا</h3>
          <div className="mt-2 grid gap-1.5 text-sm text-white/80" dir="ltr">
            <span>0510515010</span>
            <span>mahabah.sa</span>
            <span>info@mahabah.sa</span>
            <span>@mahabah_contrib</span>
          </div>
        </div>
      </div>
      <div className="mt-3 border-t border-white/10 pt-3 text-center text-xs text-white/70">جميع الحقوق محفوظة © 2026 مهابة لإدارة المساهمات العقارية</div>
    </footer>
  );
}

function IndividualDashboardHome({ config }: { config: DashboardRoleConfig }) {
  const homeStats = individualStatsFromConfig(config);

  return (
    <div className="grid gap-4">
      <section className="individual-dashboard-hero relative overflow-hidden rounded-lg border border-[#ece1d8] bg-white shadow-[0_10px_24px_rgb(29_25_22/0.025)]">
        <div className="individual-hero-art pointer-events-none">
          <Image src="/images/hero-construction.png" alt="" fill priority className="object-cover object-left-center grayscale-[4%] sepia-[8%]" sizes="(min-width: 1024px) 720px, 100vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-white/0 lg:bg-gradient-to-r lg:from-white/0 lg:via-white/42 lg:to-white" />
        <div dir="ltr" className="individual-hero-body relative z-10 flex items-end p-5 lg:items-center lg:justify-end lg:p-7">
          <div dir="rtl" className="w-full text-right lg:max-w-xl">
            <h1 className="font-display text-4xl font-extrabold leading-tight text-[#1D1916] lg:text-5xl">أهلاً بك، بندر</h1>
            <p className="mt-4 max-w-xl text-lg font-bold leading-8 text-[#1D1916]">إدارة أصولك العقارية وطلباتك وخدماتك<br className="hidden sm:block" />من مكان واحد.</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={dashboardHref(config.role, "add-asset")} className="inline-flex min-h-11 min-w-52 items-center justify-center gap-3 rounded-md bg-[#A7815E] px-6 text-sm font-extrabold text-white shadow-[0_12px_22px_rgb(167_129_94/0.22)]">
                <Plus className="h-5 w-5" />
                إضافة أصل عقاري
              </Link>
              <Link href={dashboardHref(config.role, "request-service")} className="inline-flex min-h-11 min-w-52 items-center justify-center gap-3 rounded-md border border-[#B89A7A] bg-white px-6 text-sm font-extrabold text-[#A7815E]">
                <BriefcaseBusiness className="h-5 w-5" />
                طلب خدمة عقارية
              </Link>
            </div>
          </div>
        </div>
      </section>

      <IndividualSectionTitle>الإحصائيات</IndividualSectionTitle>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {homeStats.map((item) => <IndividualStatCard key={item.title} item={item} role={config.role} />)}
      </section>

      <IndividualSectionTitle>مؤشرات الأداء</IndividualSectionTitle>
      <IndividualPerformancePanel config={config} />

      <IndividualSectionTitle>الوصول السريع</IndividualSectionTitle>
      <section className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
        {individualQuickAccess.map((item) => <IndividualQuickAccessCard key={item.title} item={item} role={config.role} />)}
      </section>

      <IndividualDashboardFooter />
    </div>
  );
}

export function DashboardOverview({ config, actor: _actor = null }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null }) {
  if (config.role === "individual") return <IndividualDashboardHome config={config} />;
  if (config.role === "business") return <BusinessDashboardHome config={config} />;

  return <GenericDashboardOverview config={config} surface="admin" />;
}

function dashboardMetric(config: DashboardRoleConfig, label: string) {
  return config.summaryMetrics.find((metric) => metric.label === label);
}

function dashboardPerformanceMetric(config: DashboardRoleConfig, label: string) {
  return config.performanceMetrics.find((metric) => metric.label === label);
}

function businessKpisFromConfig(config: DashboardRoleConfig) {
  const definitions = [
    { title: "العمليات المالية", icon: CircleDollarSign, tone: "gold" as TrendTone },
    { title: "الطلبات المفتوحة", icon: FileText, tone: "blue" as TrendTone },
    { title: "الخدمات العقارية", icon: Settings2, tone: "gold" as TrendTone },
    { title: "المساهمات العقارية", icon: Users, tone: "gold" as TrendTone },
    { title: "الأصول العقارية", icon: Building2, tone: "gold" as TrendTone },
    { title: "حالة المنشأة", icon: CheckCircle2, tone: "green" as TrendTone },
  ];
  return definitions.map((item) => {
    const metric = dashboardMetric(config, item.title);
    return {
      ...item,
      value: metric?.value ?? "0",
      unit: metric?.unit ?? metric?.delta ?? "محدث",
    };
  });
}

function businessRingPercent(value?: string) {
  const parsed = Number.parseFloat((value ?? "").replace("%", ""));
  return Number.isFinite(parsed) ? Math.min(100, Math.max(0, Math.round(parsed))) : 0;
}

function businessRingsFromConfig(config: DashboardRoleConfig) {
  const conversion = dashboardPerformanceMetric(config, "معدل التحويل");
  const activeContributions = dashboardPerformanceMetric(config, "العقود النشطة");
  const openRequests = dashboardPerformanceMetric(config, "العروض المرسلة");
  const balance = dashboardPerformanceMetric(config, "الرصيد الحالي");
  const verificationProgress = config.verification.progress ?? "0%";

  return [
    { label: "اكتمال ملف المنشأة", value: verificationProgress, percent: businessRingPercent(verificationProgress), status: config.verification.description, tone: "#A7815E" },
    { label: "حالة التوثيق", value: verificationProgress, percent: businessRingPercent(verificationProgress), status: config.verification.status, tone: "#C76B1F" },
    { label: "مستوى النشاط", value: conversion?.value ?? "0%", percent: businessRingPercent(conversion?.value), status: conversion?.unit ?? "اكتمال", tone: "#A7815E" },
    { label: "الطلبات المفتوحة", value: openRequests?.value ?? "0", percent: businessRingPercent(conversion?.value), status: openRequests?.unit ?? "طلب", tone: "#A7815E" },
    { label: "المساهمات المعتمدة", value: activeContributions?.value ?? "0", percent: businessRingPercent(conversion?.value), status: activeContributions?.unit ?? balance?.delta ?? "مساهمة", tone: "#C76B1F" },
  ];
}

function BusinessDashboardHome({ config }: { config: DashboardRoleConfig }) {
  const kpis = businessKpisFromConfig(config);
  const rings = businessRingsFromConfig(config);
  const quickActions = [
    { label: "إضافة أصل عقاري", subtitle: "أضف عقارك وأدره بسهولة", icon: Building2, href: dashboardHref(config.role, "add-asset") },
    { label: "إضافة مساهمة عقارية", subtitle: "أعلن عن مساهمتك العقارية", icon: BarChart3, href: dashboardHref(config.role, "add-contribution") },
    { label: "طلب خدمة عقارية", subtitle: "خدمات احترافية سريعة", icon: FileText, href: dashboardHref(config.role, "request-service") },
    { label: "طلب شارة التوثيق", subtitle: "أثبت موثوقية منشأتك", icon: ShieldCheck, href: dashboardHref(config.role, "verification") },
  ];

  return (
    <div className="grid gap-5">
      <section className="relative overflow-hidden rounded-lg border bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]" style={{ borderColor: "#E8DED4" }}>
        <div className="absolute inset-y-0 left-0 hidden w-[58%] opacity-90 lg:block" aria-hidden="true">
          <Image src="/images/dashboard-business-hero-sketch.png" alt="" fill className="object-cover object-left" sizes="55vw" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/80 to-white" />
        <div className="relative grid min-h-72 content-between gap-8">
          <div className="flex items-start justify-between gap-5">
            <ShieldCheck className="mt-3 h-16 w-16 shrink-0 text-[#A7815E]" />
            <div className="max-w-xl text-right">
              <p className="text-sm font-bold text-[#6E6258]">مرحباً بك في</p>
              <h1 className="mt-1 font-display text-4xl font-extrabold leading-tight text-[#1D1916]">شركة مهابة العقارية</h1>
              <p className="mt-3 text-lg font-bold leading-8 text-[#1D1916]">إدارة الأصول العقارية والمساهمات العقارية والخدمات من مكان واحد</p>
              <div className="mt-6">
                <p className="text-sm font-bold text-[#6E6258]">رقم المنشأة</p>
                <strong className="mt-1 block font-display text-2xl font-extrabold text-[#1D1916]">MB-2026-001</strong>
              </div>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4" dir="rtl">
            {quickActions.map(({ label, subtitle, icon: IconComp, href }) => (
              <Link key={label} href={href} className="flex min-h-24 items-center justify-between gap-4 rounded-md border bg-white/92 p-4 text-right transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgb(29_25_22/0.08)]" style={{ borderColor: "#D9D1C7" }}>
                <IconComp className="h-10 w-10 shrink-0 text-[#A7815E]" />
                <span>
                  <strong className="block text-base font-extrabold text-[#A7815E]">{label}</strong>
                  <span className="mt-1 block text-xs font-bold text-[#6E6258]">{subtitle}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <Info className="h-5 w-5 text-[#1D1916]" />
          <h2 className="font-display text-lg font-extrabold text-[#1D1916]">بيانات المنشأة الرئيسية</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6" dir="ltr">
          {kpis.map(({ title, value, unit, icon: IconComp, tone }) => {
            const color = toneStyles[tone];
            return (
              <article key={title} className="rounded-lg border bg-white p-4 text-center shadow-[0_10px_24px_rgb(29_25_22/0.035)]" style={{ borderColor: "#ECE1D8" }}>
                <p className="text-xs font-bold text-[#6E6258]">{title}</p>
                <strong className="mt-3 block font-display text-3xl font-extrabold text-[#1D1916]">{value}</strong>
                <span className="mt-1 block text-xs font-bold text-[#6E6258]">{unit}</span>
                <span className="mx-auto mt-4 grid h-10 w-10 place-items-center rounded-full" style={{ backgroundColor: color.bg, color: color.text }}>
                  <IconComp className="h-5 w-5" />
                </span>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <article className="rounded-lg border bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]" style={{ borderColor: "#ECE1D8" }}>
          <div className="mb-5 flex items-center justify-between">
            <BarChart3 className="h-5 w-5 text-[#A7815E]" />
            <div className="text-right">
              <h2 className="font-display text-xl font-extrabold text-[#1D1916]">مؤشرات الأداء</h2>
              <p className="mt-1 text-xs font-bold text-[#6E6258]">قياس أداء منشأتك خلال الفترة الحالية</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            {rings.map((item) => (
              <div key={item.label} className="text-center">
                <div className="mx-auto grid h-28 w-28 place-items-center rounded-full" style={{ background: `conic-gradient(${item.tone} 0 ${item.percent}%, #EEE7DF ${item.percent}% 100%)` }}>
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-white">
                    <strong className="font-display text-xl font-extrabold text-[#1D1916]">{item.value}</strong>
                  </div>
                </div>
                <p className="mt-3 text-sm font-extrabold text-[#1D1916]">{item.label}</p>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#087342]"><CheckCircle2 className="h-3.5 w-3.5" />{item.status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]" style={{ borderColor: "#ECE1D8" }}>
          <h2 className="mb-4 text-right font-display text-xl font-extrabold text-[#1D1916]">آخر تحديث</h2>
          <div className="rounded-lg bg-[#F6F4F1] p-4 text-center">
            <CalendarCheck className="mx-auto h-9 w-9 text-[#1D1916]" />
            <p className="mt-3 text-sm font-bold text-[#6E6258]">{config.updatedAt}</p>
            <strong className="mt-1 block text-base font-extrabold text-[#1D1916]">تحديث البيانات</strong>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#087342]"><CheckCircle2 className="h-3.5 w-3.5" />محدث</span>
          </div>
          <div className="mt-4 grid gap-2">
            {config.activities.slice(0, 3).map((item) => (
              <Link key={item.title} href={dashboardHref(config.role, "notifications")} className="flex items-center justify-between border-b border-[#EEE4DC] py-3 last:border-b-0">
                <CheckCircle2 className="h-4 w-4 text-[#087342]" />
                <span className="text-sm font-bold text-[#1D1916]">{item.title}</span>
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <BusinessMiniPanel title="طلبات تحتاج متابعة" icon={<FileText className="h-5 w-5" />} items={[
          { label: `${dashboardMetric(config, "الطلبات المفتوحة")?.value ?? "0"} طلبات مفتوحة`, href: dashboardHref(config.role, "my-requests") },
          { label: dashboardPerformanceMetric(config, "العروض المرسلة")?.delta ?? "طلبات الخدمات", href: dashboardHref(config.role, "my-requests") },
          { label: "طلب خدمة عقارية", href: dashboardHref(config.role, "request-service") },
        ]} />
        <BusinessMiniPanel title="المساهمات النشطة" icon={<Users className="h-5 w-5" />} items={[
          { label: `${dashboardMetric(config, "المساهمات العقارية")?.value ?? "0"} مساهمات`, href: dashboardHref(config.role, "company-contributions") },
          { label: dashboardPerformanceMetric(config, "العقود النشطة")?.delta ?? "استعراض المساهمات", href: dashboardHref(config.role, "browse-contributions") },
          { label: "إضافة مساهمة عقارية", href: dashboardHref(config.role, "add-contribution") },
        ]} />
        <BusinessMiniPanel title="العمليات الأخيرة" icon={<Clock3 className="h-5 w-5" />} items={config.plan.stats.slice(0, 3).map((stat) => ({
          label: `${stat.label}: ${stat.value} ${stat.unit}`,
          href: dashboardHref(config.role, stat.label.includes("فريق") ? "profile" : stat.label.includes("عقود") ? "company-contributions" : "browse-assets"),
        }))} />
      </section>
    </div>
  );
}

function BusinessMiniPanel({ title, icon, items }: { title: string; icon: ReactNode; items: Array<{ label: string; href: string }> }) {
  return (
    <article className="rounded-lg border bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]" style={{ borderColor: "#ECE1D8" }}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[#A7815E]">{icon}</span>
        <h2 className="font-display text-lg font-extrabold text-[#1D1916]">{title}</h2>
      </div>
      <div className="grid gap-2">
        {items.map((item) => (
          <Link key={item.label} href={item.href} className="flex items-center justify-between rounded-md border border-[#EEE4DC] px-3 py-3 transition hover:border-[#B89A7A] hover:bg-[#fffaf5]">
            <ArrowLeft className="h-4 w-4 text-[#A7815E]" />
            <span className="text-sm font-bold text-[#1D1916]">{item.label}</span>
          </Link>
        ))}
      </div>
    </article>
  );
}

function GenericDashboardOverview({ config, surface }: { config: DashboardRoleConfig; surface: DashboardRole }) {
  return (
    <div className="grid gap-5" data-dashboard-surface={surface}>
      <DashboardTopbar config={config} />
      <DashboardHero config={config} />
      <section className="grid min-w-0 gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }} aria-label="ملخص المؤشرات">
        {config.summaryMetrics.map((metric) => <MetricCard key={metric.label} metric={metric} compact />)}
      </section>
      <section className="min-w-0 rounded-[22px] border p-4 shadow-card" style={{ backgroundColor: uiColors.surface, borderColor: uiColors.border }}>
        <h2 className="mb-4 text-right font-display text-xl font-extrabold text-navy">مؤشرات الأداء</h2>
        <div className="grid min-w-0 gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))" }}>
          {config.performanceMetrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
        </div>
      </section>
      <section className="grid min-w-0 gap-4 xl:grid-cols-[1.15fr_0.75fr_0.75fr]">
        <PlanCard config={config} />
        <VerificationCard config={config} />
        <SideInterestCard config={config} />
      </section>
      <section className="min-w-0 rounded-[22px] border p-4 shadow-card" style={{ backgroundColor: uiColors.surface, borderColor: uiColors.border }}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link href={dashboardHref(config.role, config.role === "admin" ? "assets" : "browse-assets")} className="rounded-full border px-4 py-1.5 text-xs font-bold" style={{ borderColor: uiColors.border, color: uiColors.redBrown }}>عرض الكل</Link>
          <h2 className="font-display text-xl font-extrabold text-navy">الفرص العقارية المتاحة لك</h2>
        </div>
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2 xl:grid xl:grid-cols-4 xl:overflow-visible">
          {config.opportunities.map((item) => <OpportunityCard key={`${config.role}-${item.title}`} item={item} role={config.role} />)}
        </div>
      </section>
      <ActivityTimeline items={config.activities} role={config.role} />
    </div>
  );
}

async function BusinessCompanyProfilePage({ config: _config, actor = null }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null }) {
  const profileResult = await getDashboardBusinessProfile(actor);
  const profile = profileResult.data;
  const documentEntityId = actor?.organizationId ?? profile.id;
  const documentsResult = await listDashboardDocumentsForEntity({
    scope: "business",
    entityId: documentEntityId,
    entityTypes: ["organization_document", "business_verification_document", "business_profile_document"],
    actor: actor ?? { organizationId: documentEntityId },
  });
  const statusTone = profile.verificationStatus === "approved" ? "green" : profile.verificationStatus === "rejected" ? "red" : "gold";
  const statusLabel = profile.verificationStatus === "approved" ? "منشأة موثقة" : profile.verificationStatus === "rejected" ? "مرفوضة" : profile.verificationStatus === "needs_changes" ? "تحتاج تحديث" : "قيد المراجعة";

  return (
    <div className="grid gap-4">
      <IndividualPageHero
        title="بيانات المنشأة"
        subtitle="إدارة بيانات المنشأة، العنوان الوطني، بيانات التواصل، والمفوض من سجل Supabase."
        image="/images/dashboard-business-hero-sketch.png"
        actionNode={
          <DashboardDocumentUploadButton
            scope="business"
            entityType="organization_document"
            entityId={documentEntityId}
            label={profile.organizationName}
            className="inline-flex min-h-11 min-w-48 cursor-pointer items-center justify-center gap-3 rounded-md bg-[#A7815E] px-6 text-sm font-extrabold text-white shadow-[0_12px_22px_rgb(167_129_94/0.22)]"
          >
            رفع مستند منشأة
          </DashboardDocumentUploadButton>
        }
      />

      {profileResult.error ? <section className="rounded-lg border border-[#F0D8B8] bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل بيانات المنشأة الحية من Supabase، وتم عرض بيانات احتياطية.</section> : null}

      <section className="grid gap-4 xl:grid-cols-[1fr_0.38fr]">
        <form className="grid gap-4">
          <SectionBox title="بيانات المنشأة" icon={<Building2 className="h-5 w-5" />}>
            <input type="hidden" name="profileCompletion" value={String(profile.profileCompletion)} />
            <div className="grid gap-3 md:grid-cols-3">
              <Field name="name" label="اسم المنشأة" placeholder="اسم المنشأة" value={profile.organizationName} />
              <Field name="commercialRegistration" label="رقم السجل التجاري" placeholder="رقم السجل التجاري" value={profile.commercialRegistration} />
              <Field name="activityType" label="نوع النشاط" placeholder="نوع النشاط" value={profile.activityType} />
              <Field name="city" label="المدينة" placeholder="المدينة" value={profile.city} />
              <Field name="email" label="البريد الإلكتروني" placeholder="البريد الإلكتروني" value={profile.email} type="email" />
              <Field name="phone" label="رقم الجوال" placeholder="رقم الجوال" value={profile.phone} />
              <Field name="landline" label="الهاتف الثابت" placeholder="الهاتف الثابت" value={profile.landline} />
              <Field name="website" label="الموقع الإلكتروني" placeholder="الموقع الإلكتروني" value={profile.website} />
              <Field name="nationalAddress" label="العنوان الوطني" placeholder="العنوان الوطني" value={profile.nationalAddress} />
            </div>
          </SectionBox>

          <SectionBox title="العنوان الوطني للمنشأة" icon={<MapPin className="h-5 w-5" />}>
            <div className="grid gap-3 md:grid-cols-3">
              <Field name="district" label="الحي" placeholder="الحي" value={profile.district} />
              <Field name="street" label="الشارع" placeholder="الشارع" value={profile.street} />
              <Field name="buildingNumber" label="رقم المبنى" placeholder="رقم المبنى" value={profile.buildingNumber} />
              <Field name="additionalNumber" label="الرقم الإضافي" placeholder="الرقم الإضافي" value={profile.additionalNumber} />
              <Field name="postalCode" label="الرمز البريدي" placeholder="الرمز البريدي" value={profile.postalCode} />
            </div>
          </SectionBox>

          <SectionBox title="بيانات المفوض" icon={<UserRound className="h-5 w-5" />}>
            <div className="grid gap-3 md:grid-cols-2">
              <Field name="delegateName" label="اسم المفوض" placeholder="اسم المفوض" value={profile.delegateName} />
              <Field name="delegateId" label="رقم الهوية" placeholder="رقم الهوية" value={profile.delegateId} />
              <Field name="delegatePhone" label="رقم الجوال" placeholder="رقم جوال المفوض" value={profile.delegatePhone} />
              <Field name="delegateEmail" label="البريد الإلكتروني" placeholder="بريد المفوض" value={profile.delegateEmail} type="email" />
            </div>
          </SectionBox>

          <div className="flex flex-wrap gap-3">
            <SaveAccountSettingsButton
              scope="business"
              kind="profile"
              payload={{ source: "business-company-profile" }}
              className="min-h-12 rounded-md bg-[#A7815E] px-7 text-sm font-extrabold text-white"
            >
              حفظ بيانات المنشأة
            </SaveAccountSettingsButton>
            <Link href={dashboardHref("business", "verification")} className="grid min-h-12 place-items-center rounded-md border border-[#B89A7A] bg-white px-7 text-sm font-extrabold text-[#A7815E]">طلب شارة التوثيق</Link>
          </div>
        </form>

        <aside className="grid content-start gap-4">
          <SectionBox title="حالة المنشأة" icon={<ShieldCheck className="h-5 w-5" />}>
            <div className="grid place-items-center gap-3 text-center">
              <Image src={profile.logoUrl ?? "/brand/mahabah-icon-192.png"} alt="" width={92} height={92} className="rounded-2xl border border-[#ece1d8] bg-white p-3" />
              <h2 className="font-display text-2xl font-extrabold text-[#1D1916]">{profile.organizationName}</h2>
              <StatusPill label={statusLabel} tone={statusTone} />
              <p className="text-sm font-bold text-[#6E6258]">آخر تحديث: {formatDashboardDate(profile.updatedAt)}</p>
            </div>
          </SectionBox>
          <SectionBox title="نسبة اكتمال الملف" icon={<BarChart3 className="h-5 w-5" />}>
            <ScoreRing value={profile.profileCompletion} label="اكتمال ملف المنشأة" />
          </SectionBox>
          <SectionBox title="اختصارات سريعة" icon={<Settings2 className="h-5 w-5" />}>
            <div className="grid gap-2">
              <Link href={dashboardHref("business", "add-asset")} className="grid min-h-10 place-items-center rounded-md border border-[#ece1d8] text-sm font-extrabold text-[#1D1916]">إضافة أصل عقاري</Link>
              <Link href={dashboardHref("business", "add-contribution")} className="grid min-h-10 place-items-center rounded-md border border-[#ece1d8] text-sm font-extrabold text-[#1D1916]">إضافة مساهمة عقارية</Link>
              <Link href={dashboardHref("business", "invoices")} className="grid min-h-10 place-items-center rounded-md border border-[#ece1d8] text-sm font-extrabold text-[#1D1916]">الفواتير والمدفوعات</Link>
            </div>
          </SectionBox>
          <DashboardDocumentsPanel title="مستندات المنشأة" documents={documentsResult.data} error={documentsResult.error} emptyLabel="لا توجد مستندات مرفوعة للمنشأة بعد." />
        </aside>
      </section>
    </div>
  );
}

async function BusinessPersonalProfilePage({ config, actor = null }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null }) {
  const [profileResult, assetsResult, contributionsResult, serviceRequestsResult, financialResult] = await Promise.all([
    getDashboardBusinessProfile(actor),
    listDashboardAssetsForScope(businessScope(config), "owned", actor),
    listDashboardContributionsForScope(businessScope(config), "owned", actor),
    listDashboardServiceRequestsForScope(businessScope(config), actor),
    listDashboardFinancial(businessScope(config), actor),
  ]);
  const profile = profileResult.data;
  const completion = Math.min(100, Math.max(0, Math.round(profile.profileCompletion)));
  const financialOperations = financialResult.invoices.length + financialResult.payments.length + financialResult.subscriptions.length;
  const activityStats = [
    { title: "الأصول العقارية", value: String(assetsResult.data.length), unit: "أصل", icon: <Building2 className="h-7 w-7" />, tone: "copper" as const },
    { title: "المساهمات العقارية", value: String(contributionsResult.data.length), unit: "مساهمة", icon: <Users className="h-7 w-7" />, tone: "blue" as const },
    { title: "طلبات الخدمات", value: String(serviceRequestsResult.data.length), unit: "طلب", icon: <BriefcaseBusiness className="h-7 w-7" />, tone: "green" as const },
    { title: "العمليات المالية", value: String(financialOperations), unit: "عملية", icon: <FileText className="h-7 w-7" /> },
  ];

  return (
    <CommunicationPageChrome title="الملف الشخصي" active="الملف الشخصي">
      <section className="grid gap-4 xl:grid-cols-4" dir="ltr">
        <aside className="grid gap-4 xl:col-span-1" dir="rtl">
          <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-center shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
            <h2 className="font-display text-lg font-extrabold text-[#1D1916]">نسبة اكتمال الملف</h2>
            <div className="mx-auto mt-6 grid h-36 w-36 place-items-center rounded-full" style={{ background: `conic-gradient(#087342 0 ${completion}%, #E8E4DE ${completion}% 100%)` }}>
              <div className="grid h-28 w-28 place-items-center rounded-full bg-white">
                <div>
                  <strong className="block font-display text-4xl font-extrabold text-[#1D1916]">{completion}%</strong>
                  <span className="text-sm font-extrabold text-[#1D1916]">منشأة</span>
                </div>
              </div>
            </div>
            <p className="mt-5 text-sm font-bold text-[#6E6258]">بيانات المفوض والمنشأة متصلة بسجل Supabase.</p>
            <Link href={dashboardHref("business", "company-profile")} className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-md border border-[#B89A7A] text-sm font-extrabold text-[#A7815E]">تحديث بيانات المنشأة</Link>
          </article>
        </aside>

        <main className="grid gap-4 xl:col-span-3" dir="rtl">
          <form className="rounded-lg border border-[#ece1d8] bg-white p-6 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
            <div className="mb-5 flex items-center justify-between">
            <SaveAccountSettingsButton
              scope="business"
              kind="profile"
              payload={{ source: "business-personal-profile", profileCompletion: profile.profileCompletion }}
              collectFormValues={false}
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#ece1d8] px-4 text-sm font-extrabold text-[#1D1916]"
            >
                <PenLine className="h-4 w-4" />
                حفظ التعديلات
              </SaveAccountSettingsButton>
              <h2 className="font-display text-xl font-extrabold text-[#1D1916]">معلومات المفوض</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-4">
              <div className="text-center lg:col-span-1">
                <div className="relative mx-auto grid h-32 w-32 place-items-center rounded-full bg-[#F4F0EC]">
                  <UserRound className="h-20 w-20 text-[#1D1916]" />
                  <span className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full border border-[#ece1d8] bg-white text-[#A7815E]">
                    <BadgeCheck className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl font-extrabold text-[#1D1916]">{profile.delegateName}</h3>
                <span className="mt-2 inline-flex rounded-md bg-[#e8f7ec] px-3 py-1 text-xs font-extrabold text-[#087342]">مفوض منشأة</span>
                <p className="mt-3 text-xs font-bold leading-6 text-[#6E6258]">{profile.organizationName}<br />{profile.commercialRegistration}</p>
              </div>
              <div className="grid gap-3 lg:col-span-3 md:grid-cols-2">
                <Field name="delegateName" label="اسم المفوض" value={profile.delegateName} placeholder="اسم المفوض" />
                <Field name="delegateId" label="رقم الهوية" value={profile.delegateId} placeholder="رقم الهوية" />
                <Field name="delegatePhone" label="رقم الجوال" value={profile.delegatePhone} placeholder="رقم الجوال" />
                <Field name="delegateEmail" label="البريد الإلكتروني" value={profile.delegateEmail} placeholder="البريد الإلكتروني" type="email" />
                <Field name="name" label="اسم المنشأة" value={profile.organizationName} placeholder="اسم المنشأة" />
                <Field name="city" label="المدينة" value={profile.city} placeholder="المدينة" />
                <Field name="email" label="بريد المنشأة" value={profile.email} placeholder="بريد المنشأة" type="email" />
                <Field name="phone" label="رقم المنشأة" value={profile.phone} placeholder="رقم المنشأة" />
              </div>
            </div>
          </form>

          <section>
            <h2 className="mb-4 text-right font-display text-xl font-extrabold text-[#1D1916]">ملخص نشاط المنشأة</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {activityStats.map((item) => <CommunicationStatCard key={item.title} title={item.title} value={item.value} unit={item.unit} icon={item.icon} tone={item.tone} />)}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <Link href={dashboardHref("business", "company-profile")} className="grid min-h-12 place-items-center rounded-md border border-[#B89A7A] bg-white px-5 text-sm font-extrabold text-[#A7815E]">بيانات المنشأة</Link>
            <Link href={dashboardHref("business", "verification")} className="grid min-h-12 place-items-center rounded-md border border-[#B89A7A] bg-white px-5 text-sm font-extrabold text-[#A7815E]">طلب شارة التوثيق</Link>
            <Link href={dashboardHref("business", "support")} className="grid min-h-12 place-items-center rounded-md border border-[#B89A7A] bg-white px-5 text-sm font-extrabold text-[#A7815E]">الدعم الفني</Link>
          </section>
        </main>
      </section>
      {profileResult.error ? <section className="rounded-lg border border-[#F0D8B8] bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل بيانات الملف الشخصي الحية، وتم عرض بيانات احتياطية.</section> : null}
    </CommunicationPageChrome>
  );
}

const individualAssets = [
  { title: "فيلا السالم الفاخرة", city: "الرياض", area: "750 م2", type: "فيلا سكنية", status: "نشط", tone: "green" as TrendTone, image: "/images/faq-villa-bg.png", progress: "استلام الملكية" },
  { title: "مجمع الربيع الإداري", city: "الدمام", area: "3,120 م2", type: "مبنى إداري", status: "قيد الدراسة", tone: "gold" as TrendTone, image: "/images/asset-commercial-complex.png", progress: "مراجعة البيانات" },
  { title: "مبنى الريان التجاري", city: "جدة", area: "1,800 م2", type: "مبنى تجاري", status: "نشط", tone: "green" as TrendTone, image: "/images/asset-tower.png", progress: "الدراسة الأولية" },
  { title: "أرض النخيل", city: "الرياض", area: "25,000 م2", type: "أرض خام", status: "نشط", tone: "green" as TrendTone, image: "/images/asset-residential-land.png", progress: "استلام الملكية" },
  { title: "أرض الواحة", city: "الرياض", area: "1,950 م2", type: "أرض سكنية", status: "قيد الدراسة", tone: "gold" as TrendTone, image: "/images/hero-raw-land.png", progress: "تحليل" },
  { title: "مستودع الصناعية", city: "الدمام", area: "2,300 م2", type: "مستودع", status: "نشط", tone: "green" as TrendTone, image: "/images/asset-land-masterplan.png", progress: "استلام الملكية" },
  { title: "مجمع التلال السكني", city: "الرياض", area: "4,100 م2", type: "مجمع سكني", status: "نشط", tone: "green" as TrendTone, image: "/images/hero-completed.png", progress: "الدراسة الأولية" },
  { title: "مبنى الخليج التجاري", city: "جدة", area: "2,850 م2", type: "مبنى تجاري", status: "غير نشط", tone: "red" as TrendTone, image: "/images/media-featured.png", progress: "استلام الملكية" },
];

type IndividualAssetCardItem = {
  id: string;
  slug: string;
  title: string;
  city: string;
  area: string;
  type: string;
  status: string;
  tone: TrendTone;
  image: string;
  progress: string;
  value: number;
};

function individualAssetFallbackRows(): IndividualAssetCardItem[] {
  return individualAssets.map((item, index) => ({
    ...item,
    id: `static-individual-asset-${index + 1}`,
    slug: `static-individual-asset-${index + 1}`,
    value: item.city === "الرياض" ? 28500000 : 19800000,
  }));
}

function mapDashboardAssetToIndividualCard(row: DashboardAdminAssetRow): IndividualAssetCardItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.titleAr,
    city: row.cityAr,
    area: formatArea(row.areaSqm),
    type: row.assetTypeAr,
    status: reviewStatusLabel(row.status),
    tone: reviewStatusTone(row.status),
    image: row.image,
    progress: row.status === "approved" ? "معتمد" : row.status === "rejected" ? "مرفوض" : "قيد المراجعة",
    value: row.estimatedValueSar || row.areaSqm * (row.pricePerSqm ?? 0),
  };
}

function IndividualPageHero({ title, subtitle, image, action, actionNode }: { title: string; subtitle: string; image: string; action?: { label: string; href: string }; actionNode?: ReactNode }) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-[#ece1d8] bg-white shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
      <div
        className="absolute inset-y-0 left-0 hidden opacity-95 lg:block"
        style={{ width: "60%", backgroundImage: `url(${image})`, backgroundPosition: "left bottom", backgroundSize: "cover", backgroundRepeat: "no-repeat", filter: "saturate(.62) sepia(.18) contrast(1.04)" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/32 to-white" />
      <div dir="ltr" className="relative z-10 flex min-h-56 items-center justify-end p-6 text-right lg:min-h-64">
        <div dir="rtl" className="max-w-xl">
          <h1 className="font-display text-4xl font-extrabold leading-tight text-[#A7815E] lg:text-5xl">{title}</h1>
          <p className="mt-3 max-w-lg text-base font-bold leading-8 text-[#1D1916]">{subtitle}</p>
          {actionNode ? <div className="mt-5">{actionNode}</div> : null}
          {action ? (
            <Link href={action.href} className="mt-5 inline-flex min-h-11 min-w-48 items-center justify-center gap-3 rounded-md bg-[#A7815E] px-6 text-sm font-extrabold text-white shadow-[0_12px_22px_rgb(167_129_94/0.22)]">
              <Plus className="h-5 w-5" />
              {action.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function IndividualKpiCard({ title, value, unit, icon, tone = "gold", link, href }: { title: string; value: string; unit: string; icon: string; tone?: TrendTone; link?: string; href?: string }) {
  const toneStyle = toneStyles[tone];
  return (
    <article className="rounded-lg border border-[#ece1d8] bg-white px-5 py-4 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
      <div className="flex min-h-20 items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-extrabold text-[#1D1916]">{title}</h2>
          <div className="mt-2 font-display text-4xl font-extrabold leading-none text-[#1D1916]">{value}</div>
          <p className="mt-1 text-xs font-bold text-[#6E6258]">{unit}</p>
        </div>
        <Icon name={icon} className="h-10 w-10 stroke-[1.45]" style={{ color: toneStyle.text }} />
      </div>
      {link && href ? (
        <Link href={href} className="mt-3 flex min-h-9 items-center justify-between border-t border-[#eee4dc] pt-2 text-xs font-bold text-[#1D1916]">
          <span>{link}</span>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      ) : null}
    </article>
  );
}

function FilterBox({ label, href }: { label: string; href?: string }) {
  return (
    <Link href={href ?? `?filter=${encodeURIComponent(label)}`} className="flex h-12 items-center justify-between rounded-md border border-[#ece1d8] bg-white px-4 text-sm font-bold text-[#1D1916]">
      <span>{label}</span>
      <ChevronGlyph />
    </Link>
  );
}

function ChevronGlyph() {
  return <span className="text-lg leading-none text-[#6E6258]">⌄</span>;
}

function normalizeDashboardSearch(value: string) {
  return value.toLocaleLowerCase("ar-SA").replace(/\s+/g, " ").trim();
}

function matchesDashboardSearch(query: string, values: Array<string | number | null | undefined>) {
  const normalizedQuery = normalizeDashboardSearch(query);
  if (!normalizedQuery) return true;
  return values.some((value) => normalizeDashboardSearch(String(value ?? "")).includes(normalizedQuery));
}

function matchesDashboardStatus(status: string, statusParam: string) {
  if (!statusParam) return true;
  const normalizedStatus = normalizeDashboardSearch(status);
  const statusGroups: Record<string, string[]> = {
    approved: ["approved", "معتمد", "نشط", "مكتمل", "completed", "succeeded"],
    pending: ["pending", "قيد المراجعة", "قيد الدراسة", "بانتظار", "assigned", "submitted", "in_progress"],
    assigned: ["assigned", "قيد التنفيذ", "in_progress"],
    completed: ["completed", "مكتمل", "منجز", "succeeded"],
    submitted: ["submitted", "جديد", "مرسل"],
    rejected: ["rejected", "مرفوض", "غير نشط", "failed"],
    urgent: ["urgent", "بحاجة إجراء", "عاجل"],
  };
  const accepted = statusGroups[statusParam] ?? [statusParam];
  return accepted.some((item) => normalizedStatus.includes(normalizeDashboardSearch(item)));
}

function dashboardQueryHref(role: DashboardRole, path: string, params: Record<string, string | undefined>) {
  const [basePath, rawQuery] = path.split("?");
  const query = new URLSearchParams(rawQuery ?? "");
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
    else query.delete(key);
  });
  const qs = query.toString();
  return dashboardHref(role, `${basePath}${qs ? `?${qs}` : ""}`);
}

function dashboardPageParam(searchParams: DashboardSearchParams) {
  const page = Number(stringParam(searchParams, "page"));
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

function paginateDashboardRows<T>(rows: T[], searchParams: DashboardSearchParams, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const page = Math.min(dashboardPageParam(searchParams), totalPages);
  const start = (page - 1) * pageSize;
  return {
    page,
    totalPages,
    rows: rows.slice(start, start + pageSize),
  };
}

function DashboardPaginationControls({
  role,
  path,
  page,
  totalPages,
  params = {},
}: {
  role: DashboardRole;
  path: string;
  page: number;
  totalPages: number;
  params?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const pageHref = (nextPage: number) => dashboardQueryHref(role, path, {
    ...params,
    page: nextPage > 1 ? String(nextPage) : undefined,
  });

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="ترقيم الصفحات">
      <Link href={pageHref(Math.max(1, page - 1))} className={cn("grid h-10 min-w-10 place-items-center rounded-md border px-4 text-sm font-extrabold", page === 1 ? "pointer-events-none border-[#ece1d8] bg-[#f7f3ef] text-[#9b9189]" : "border-[#ece1d8] bg-white text-[#1D1916]")}>السابق</Link>
      {pages.map((item) => (
        <Link key={item} href={pageHref(item)} className={cn("grid h-10 min-w-10 place-items-center rounded-md border px-4 text-sm font-extrabold", item === page ? "border-[#A7815E] bg-[#A7815E] text-white" : "border-[#ece1d8] bg-white text-[#1D1916]")}>{item}</Link>
      ))}
      <Link href={pageHref(Math.min(totalPages, page + 1))} className={cn("grid h-10 min-w-10 place-items-center rounded-md border px-4 text-sm font-extrabold", page === totalPages ? "pointer-events-none border-[#ece1d8] bg-[#f7f3ef] text-[#9b9189]" : "border-[#ece1d8] bg-white text-[#1D1916]")}>التالي</Link>
    </nav>
  );
}

function IndividualAssetCard({ item, management = false }: { item: IndividualAssetCardItem; management?: boolean }) {
  const tone = toneStyles[item.tone];
  return (
    <article className="overflow-hidden rounded-lg border border-[#ece1d8] bg-white shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
      <div className="relative h-36 bg-[#f5eee7]">
        <Image src={item.image} alt="" fill className="object-cover grayscale-[10%] sepia-[8%]" sizes="310px" />
      </div>
      <div className="p-4 text-right">
        <h3 className="font-display text-xl font-extrabold text-[#1D1916]">{item.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm font-bold text-[#6E6258]"><MapPin className="h-4 w-4" />{item.city}</p>
        <div className="mt-2 flex items-center justify-between gap-3 text-sm font-bold text-[#6E6258]">
          <span>{item.area}</span>
          <span className="rounded-md px-3 py-1 text-xs" style={{ backgroundColor: tone.bg, color: tone.text }}>{item.status}</span>
        </div>
        <p className="mt-2 text-xs font-bold text-[#6E6258]">{item.type}</p>
        {management ? (
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#eee4dc] pt-3 text-center text-xs font-bold text-[#A7815E]">
            <DashboardDocumentUploadButton scope="individual" entityType="asset_document" entityId={item.id} label={item.title} className="grid cursor-pointer gap-1"><FileText className="mx-auto h-4 w-4" />رفع مستند</DashboardDocumentUploadButton>
            <Link href={dashboardHref("individual", `add-asset?asset=${encodeURIComponent(item.slug)}`)} className="grid gap-1"><PenLine className="mx-auto h-4 w-4" />تعديل</Link>
            <Link href={dashboardHref("individual", `asset-details?asset=${encodeURIComponent(item.slug)}`)} className="grid gap-1"><Search className="mx-auto h-4 w-4" />عرض التفاصيل</Link>
          </div>
        ) : (
          <Link href={dashboardHref("individual", `asset-details?asset=${encodeURIComponent(item.slug)}`)} className="mt-4 flex min-h-10 items-center justify-center rounded-md border border-[#B89A7A] text-sm font-extrabold text-[#1D1916]">
            عرض التفاصيل
          </Link>
        )}
      </div>
    </article>
  );
}

async function IndividualBrowseAssetsPage({ config, variant, actor = null, searchParams = {} }: { config: DashboardRoleConfig; variant: "browse" | "mine"; actor?: DashboardActorContext | null; searchParams?: DashboardSearchParams }) {
  const mine = variant === "mine";
  const activePath = mine ? "my-assets" : "browse-assets";
  const result = await listDashboardAssetsForScope("individual", mine ? "owned" : "all", actor);
  const assetDocumentResults = mine
    ? await Promise.all(
        result.data.map((row) =>
          listDashboardDocumentsForEntity({
            scope: "individual",
            entityId: row.id,
            entityRef: row.slug,
            entityTypes: ["asset_document", "asset_review_decision", "asset_deed", "asset_site_plan", "asset_valuation", "real_estate_asset"],
            actor,
          }),
        ),
      )
    : [];
  const notificationsResult = mine ? await listDashboardNotifications("individual", actor) : null;
  const q = stringParam(searchParams, "q").trim();
  const activeStatus = stringParam(searchParams, "status").trim();
  const allRows = result.data.length ? result.data.map((row) => mapDashboardAssetToIndividualCard(row)) : individualAssetFallbackRows();
  const rows = allRows.filter((row) => matchesDashboardSearch(q, [row.title, row.city, row.area, row.type, row.status, row.progress]) && matchesDashboardStatus(row.status, activeStatus));
  const pagination = paginateDashboardRows(rows, searchParams, mine ? 4 : 8);
  const heroTitle = mine ? "أصولي المضافة" : "استعراض الأصول";
  const heroSubtitle = mine ? "إدارة ومتابعة جميع الأصول العقارية التي قمت بإضافتها إلى منصة مهابة." : "يمكنك تصفح وإدارة جميع أصولك العقارية المضافة ومتابعة حالتها بسهولة.";
  const heroImage = mine ? "/images/asset-commercial-complex.png" : "/images/hero-panorama.png";
  const approvedCount = result.data.filter((row) => row.status === "approved").length;
  const pendingCount = result.data.filter((row) => row.status === "pending").length;
  const rejectedCount = result.data.filter((row) => row.status === "rejected").length;
  const needsChangesCount = result.data.filter((row) => row.status === "needs_changes").length;
  const assetStatusSummary: [string, string, TrendTone][] = [
    ["معتمدة", `${approvedCount} أصول`, "green"],
    ["قيد المراجعة", `${pendingCount} أصول`, "gold"],
    ["تحتاج تعديل", `${needsChangesCount} أصول`, "blue"],
    ["مرفوضة", `${rejectedCount} أصول`, "red"],
  ];
  const stats = mine
    ? [
        { title: "إجمالي الأصول", value: String(allRows.length), unit: "أصل", icon: "building", link: "عرض جميع الأصول", href: dashboardHref(config.role, "my-assets") },
        { title: "أصول معتمدة", value: String(approvedCount), unit: "أصول", icon: "shield", link: "عرض جميع الأصول المعتمدة", href: dashboardHref(config.role, "my-assets?status=approved") },
        { title: "أصول قيد الدراسة", value: String(pendingCount), unit: "أصول", icon: "clock", link: "عرض جميع الأصول قيد الدراسة", href: dashboardHref(config.role, "my-assets?status=pending") },
        { title: "أصول مرفوضة", value: String(rejectedCount), unit: "أصل", icon: "file", link: "عرض جميع الأصول المرفوضة", href: dashboardHref(config.role, "my-assets?status=rejected") },
      ]
    : [
        { title: "إجمالي الأصول", value: String(allRows.length), unit: "أصل عقاري", icon: "building", link: undefined },
        { title: "أصول معتمدة", value: String(approvedCount), unit: "أصول", icon: "shield", link: undefined },
        { title: "أصول قيد الدراسة", value: String(pendingCount), unit: "أصول", icon: "clock", link: undefined },
        { title: "أصول مرفوضة", value: String(rejectedCount), unit: "أصل", icon: "x", link: undefined },
      ];

  return (
    <div className="grid gap-4">
      <IndividualPageHero title={heroTitle} subtitle={heroSubtitle} image={heroImage} action={mine ? { label: "إضافة أصل عقاري", href: dashboardHref(config.role, "add-asset") } : { label: "إضافة أصل عقاري", href: dashboardHref(config.role, "add-asset") }} />
      {result.error ? <section className="rounded-lg border border-[#F0D8B8] bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل الأصول الحية من Supabase، وتم عرض البيانات الاحتياطية المتاحة.</section> : null}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => <IndividualKpiCard key={item.title} {...item} />)}
      </section>

      <section className="rounded-lg border border-[#ece1d8] bg-white p-4 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
        <form action={dashboardHref(config.role, activePath)} className="grid gap-3 lg:grid-cols-5">
          {activeStatus ? <input type="hidden" name="status" value={activeStatus} /> : null}
          <label className="relative block">
            <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1D1916]" />
            <input name="q" defaultValue={q} suppressHydrationWarning className="h-12 w-full rounded-md border border-[#ece1d8] bg-white pl-16 pr-12 text-sm font-bold outline-none focus:border-[#A7815E]" placeholder="ابحث عن أصل عقاري" />
            <button type="submit" className="absolute left-2 top-1/2 h-8 -translate-y-1/2 rounded bg-[#1D1916] px-3 text-xs font-extrabold text-white">بحث</button>
          </label>
          <FilterBox label="كل الأصول" href={dashboardHref(config.role, activePath)} />
          <FilterBox label="المعتمدة" href={dashboardHref(config.role, `${activePath}?status=approved${q ? `&q=${encodeURIComponent(q)}` : ""}`)} />
          <FilterBox label="قيد المراجعة" href={dashboardHref(config.role, `${activePath}?status=pending${q ? `&q=${encodeURIComponent(q)}` : ""}`)} />
          <FilterBox label="المرفوضة" href={dashboardHref(config.role, `${activePath}?status=rejected${q ? `&q=${encodeURIComponent(q)}` : ""}`)} />
        </form>
      </section>

      {mine ? (
        <section className="grid gap-3 md:grid-cols-4">
          {assetStatusSummary.map(([label, value, tone]) => {
            const s = toneStyles[tone];
            return <article key={label} className="rounded-lg border border-[#ece1d8] bg-white p-4 text-center text-sm font-extrabold text-[#1D1916]"><span className="mx-auto mb-2 block h-2 w-2 rounded-full" style={{ backgroundColor: s.dot }} />{label}<p className="mt-2 text-xs text-[#6E6258]">{value}</p></article>;
          })}
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {rows.length ? pagination.rows.map((item) => <IndividualAssetCard key={item.id} item={item} management={mine} />) : <div className="rounded-lg border border-[#ece1d8] bg-white p-8 text-center text-sm font-extrabold text-[#6E6258] md:col-span-2 xl:col-span-4">لا توجد أصول مطابقة للبحث أو الفلتر الحالي.</div>}
      </section>

      {!mine ? (
        <DashboardPaginationControls role={config.role} path={activePath} page={pagination.page} totalPages={pagination.totalPages} params={{ q, status: activeStatus }} />
      ) : (
        <IndividualMyAssetsPanels assets={result.data} documents={assetDocumentResults} notifications={notificationsResult?.data ?? []} />
      )}
    </div>
  );
}

function IndividualMyAssetsPanels({ assets, documents, notifications }: { assets: DashboardAdminAssetRow[]; documents: { data: DashboardDocumentRow[]; error?: string }[]; notifications: DashboardNotification[] }) {
  const latestAssetNotifications = notifications
    .filter((notification) => `${notification.category} ${notification.title} ${notification.body} ${notification.actionUrl ?? ""}`.includes("asset") || `${notification.title} ${notification.body}`.includes("أصل"))
    .slice(0, 3)
    .map((notification) => notification.title);
  const latestUpdates = latestAssetNotifications.length
    ? latestAssetNotifications
    : assets
        .slice()
        .sort((first, second) => new Date(second.submittedAt ?? second.listingDate).getTime() - new Date(first.submittedAt ?? first.listingDate).getTime())
        .slice(0, 3)
        .map((asset) => `${asset.titleAr}: ${reviewStatusLabel(asset.status)}`);
  const missingDocumentAssets = assets.filter((asset, index) => (documents[index]?.data.length ?? 0) === 0);
  const actionItems = [
    ...assets.filter((asset) => asset.status === "needs_changes").map((asset) => `${asset.titleAr}: يحتاج تحديث بيانات`),
    ...missingDocumentAssets.map((asset) => `${asset.titleAr}: رفع مستندات الأصل`),
    ...assets.filter((asset) => !asset.deedNumber).map((asset) => `${asset.titleAr}: إضافة رقم الصك`),
  ].slice(0, 3);
  const totalDocuments = documents.reduce((sum, item) => sum + item.data.length, 0);
  const activeAssets = assets.filter((asset) => asset.status === "approved").length;
  const pendingAssets = assets.filter((asset) => asset.status === "pending" || asset.status === "needs_changes").length;
  const averageReviewAge = (() => {
    const ages = assets
      .filter((asset) => asset.status === "pending" || asset.status === "needs_changes")
      .map((asset) => {
        const startedAt = new Date(asset.submittedAt ?? asset.listingDate).getTime();
        if (Number.isNaN(startedAt)) return null;
        return Math.max(0, Math.ceil((Date.now() - startedAt) / 86_400_000));
      })
      .filter((value): value is number => typeof value === "number");
    return ages.length ? Math.round(ages.reduce((sum, value) => sum + value, 0) / ages.length) : 0;
  })();
  const lastActivity = [
    ...latestUpdates,
    ...documents.flatMap((item) => item.data.slice(0, 1).map((document) => `تم رفع ${document.fileName}`)),
  ].slice(0, 3);
  const studySteps = ["استلام الأصل", "مراجعة البيانات", "الدراسة الأولية", "التحليل", "الاعتماد"];
  const completedStudySteps = activeAssets > 0 ? 5 : pendingAssets > 0 ? 3 : assets.length > 0 ? 2 : 0;

  return (
    <div className="grid gap-4">
      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <h2 className="mb-4 font-display text-xl font-extrabold text-[#1D1916]">آخر التحديثات</h2>
          {(latestUpdates.length ? latestUpdates : ["لا توجد تحديثات أصول حالياً"]).map((item, index) => (
            <div key={item} className="flex items-center justify-between border-b border-[#eee4dc] py-3 last:border-b-0">
              <span className="text-sm font-bold text-[#1D1916]">{item}</span>
              <span className="text-xs font-bold text-[#6E6258]">{index === 0 ? "منذ يومين" : index === 1 ? "منذ 3 أيام" : "منذ 5 أيام"}</span>
            </div>
          ))}
        </article>
        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <h2 className="mb-4 font-display text-xl font-extrabold text-[#1D1916]">الأصول التي تحتاج إجراء</h2>
          {(actionItems.length ? actionItems : ["لا توجد إجراءات مطلوبة حالياً"]).map((item, index) => {
            const Component = index === 0 ? UploadCloud : index === 1 ? Info : AlertTriangle;
            const color = index === 0 ? "#A7815E" : index === 1 ? "#B89A7A" : "#8F6B4C";
            return <div key={item} className="flex items-center justify-between border-b border-[#eee4dc] py-3 last:border-b-0"><span className="text-sm font-bold text-[#1D1916]">{item}</span><Component className="h-5 w-5" style={{ color }} /></div>;
          })}
        </article>
        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <h2 className="mb-4 font-display text-xl font-extrabold text-[#1D1916]">حالة كل أصل</h2>
          {studySteps.map((item, index) => (
            <div key={item} className="flex items-center gap-3 py-2">
              <span className={cn("grid h-6 w-6 place-items-center rounded-full border text-xs", index < completedStudySteps ? "border-[#087342] bg-[#e9f7ef] text-[#087342]" : "border-[#d8d1ca] text-[#9b9189]")}>{index < completedStudySteps ? "✓" : ""}</span>
              <span className="text-sm font-bold text-[#1D1916]">{item}</span>
            </div>
          ))}
        </article>
      </section>
      <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <h2 className="mb-5 font-display text-xl font-extrabold text-[#1D1916]">مؤشرات الأداء</h2>
          <div className="grid gap-3 md:grid-cols-4">
            <IndividualKpiCard title="تحتاج إجراء" value={String(actionItems.length)} unit="أصل" icon="settings" />
            <IndividualKpiCard title="الأصول النشطة" value={String(activeAssets)} unit="أصول" icon="building" tone="green" />
            <IndividualKpiCard title="المستندات المرفوعة" value={String(totalDocuments)} unit="مستند" icon="shield" tone="green" />
            <IndividualKpiCard title="متوسط مدة الدراسة" value={String(averageReviewAge)} unit="يوم" icon="clock" />
          </div>
        </article>
        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <h2 className="mb-4 font-display text-xl font-extrabold text-[#1D1916]">النشاط الأخير</h2>
          {(lastActivity.length ? lastActivity : ["لا يوجد نشاط أصول حديث"]).map((item) => (
            <div key={item} className="flex items-center justify-between border-b border-[#eee4dc] py-3 last:border-b-0">
              <span className="text-sm font-bold text-[#1D1916]">{item}</span>
              <ArrowLeft className="h-4 w-4 text-[#A7815E]" />
            </div>
          ))}
        </article>
      </section>
    </div>
  );
}

function InterestedAssetCard({ item, saved = false }: { item: IndividualAssetCardItem; saved?: boolean }) {
  const tone = toneStyles[item.tone];
  return (
    <article className="overflow-hidden rounded-lg border border-[#ece1d8] bg-white shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
      <div className="relative h-32 bg-[#f5eee7]">
        <Image src={item.image} alt="" fill className="object-cover grayscale-[10%] sepia-[8%]" sizes="310px" />
        <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/92 text-[#A7815E] shadow-sm">
          <Heart className={cn("h-4 w-4", saved ? "fill-current" : "")} />
        </span>
      </div>
      <div className="p-4 text-right">
        <h3 className="font-display text-lg font-extrabold text-[#1D1916]">{item.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs font-bold text-[#6E6258]"><MapPin className="h-4 w-4" />{item.city}</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-bold text-[#6E6258]">
          <span>{item.area}</span>
          <span className="justify-self-end rounded-md px-3 py-1" style={{ backgroundColor: tone.bg, color: tone.text }}>{item.status}</span>
          <span>{item.type}</span>
          <span className="justify-self-end">{formatSar(item.value)}</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#eee4dc] pt-3 text-center text-[11px] font-extrabold text-[#A7815E]">
          <Link href={dashboardHref("individual", `asset-details?asset=${encodeURIComponent(item.slug)}`)} className="grid gap-1"><Search className="mx-auto h-4 w-4" />عرض التفاصيل</Link>
          <InterestActionButton
            entityType="asset"
            slug={item.slug}
            title={item.title}
            initialInterested={saved}
            className="grid gap-1"
            icon="heart"
            iconClassName="mx-auto h-4 w-4"
            activeIconClassName="mx-auto h-4 w-4 fill-current"
          />
          <Link href={dashboardHref("individual", "interested-assets?compare=1")} className="grid gap-1"><CircleDollarSign className="mx-auto h-4 w-4" />مقارنة</Link>
        </div>
      </div>
    </article>
  );
}

function SmallPanel({ title, items, action, actionHref }: { title: string; items: string[]; action?: string; actionHref?: string }) {
  return (
    <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
      <h2 className="mb-4 font-display text-xl font-extrabold text-[#1D1916]">{title}</h2>
      <div className="grid gap-2">
        {items.map((item, index) => (
          <div key={item} className="flex items-center justify-between gap-4 border-b border-[#eee4dc] py-2.5 last:border-b-0">
            <span className="text-sm font-bold leading-6 text-[#1D1916]">{item}</span>
            <span className="text-xs font-bold text-[#6E6258]">{index === 0 ? "منذ ساعتين" : index === 1 ? "منذ 5 ساعات" : "منذ يوم"}</span>
          </div>
        ))}
      </div>
      {action && actionHref ? <Link href={actionHref} className="mt-4 inline-flex text-sm font-extrabold text-[#1D1916]">{action} ←</Link> : null}
    </article>
  );
}

function TrustDigitalStrip() {
  const trust = [
    ["نفاذ", "الدخول الموحد", ShieldCheck],
    ["التوقيع الإلكتروني", "معتمد وموثق", ShieldCheck],
    ["الهيئة العامة للعقار", "مرخص من الهيئة", ShieldCheck],
    ["وثق", "معتمد للأعمال", ShieldCheck],
  ] as const;

  return (
    <section className="grid gap-3 rounded-lg border border-[#ece1d8] bg-white p-4 shadow-[0_10px_24px_rgb(29_25_22/0.035)] md:grid-cols-4">
      {trust.map(([title, subtitle, IconComponent]) => (
        <div key={title} className="flex items-center justify-center gap-3 border-b border-[#eee4dc] pb-3 text-right md:border-b-0 md:border-l md:pb-0 last:md:border-l-0">
          <IconComponent className="h-7 w-7 text-[#1D1916]" />
          <div>
            <p className="text-sm font-extrabold text-[#1D1916]">{title}</p>
            <p className="mt-1 text-xs font-bold text-[#6E6258]">{subtitle}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

function InterestedAssetsComparison({ rows, role, q, activeStatus, activeCity }: { rows: IndividualAssetCardItem[]; role: DashboardRole; q: string; activeStatus: string; activeCity: string }) {
  if (rows.length < 2) {
    return (
      <section className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-extrabold text-[#1D1916]">مقارنة الأصول</h2>
          <Link href={dashboardQueryHref(role, "interested-assets", { q, status: activeStatus, city: activeCity })} className="text-sm font-extrabold text-[#A7815E]">إغلاق المقارنة</Link>
        </div>
        <p className="mt-3 text-sm font-bold leading-7 text-[#6E6258]">تحتاج إلى أصلين محفوظين على الأقل لعرض مقارنة فعلية.</p>
      </section>
    );
  }

  const comparisonRows = rows.slice(0, 3);
  const metrics = [
    ["المدينة", (item: IndividualAssetCardItem) => item.city],
    ["المساحة", (item: IndividualAssetCardItem) => item.area],
    ["نوع الأصل", (item: IndividualAssetCardItem) => item.type],
    ["القيمة", (item: IndividualAssetCardItem) => formatSar(item.value)],
    ["الحالة", (item: IndividualAssetCardItem) => item.status],
    ["التقدم", (item: IndividualAssetCardItem) => item.progress],
  ] as const;

  return (
    <section className="overflow-hidden rounded-lg border border-[#ece1d8] bg-white text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee4dc] p-5">
        <div>
          <h2 className="font-display text-xl font-extrabold text-[#1D1916]">مقارنة الأصول</h2>
          <p className="mt-1 text-sm font-bold text-[#6E6258]">مقارنة مباشرة بين الأصول المحفوظة حسب الفلاتر الحالية.</p>
        </div>
        <Link href={dashboardQueryHref(role, "interested-assets", { q, status: activeStatus, city: activeCity })} className="grid min-h-10 place-items-center rounded-md border border-[#B89A7A] bg-white px-4 text-sm font-extrabold text-[#A7815E]">إغلاق المقارنة</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="bg-[#f4ede5] text-xs font-extrabold text-[#5f5953]">
              <th className="px-4 py-3 text-right">المعيار</th>
              {comparisonRows.map((item) => <th key={item.id} className="px-4 py-3 text-right">{item.title}</th>)}
            </tr>
          </thead>
          <tbody>
            {metrics.map(([label, value]) => (
              <tr key={label} className="border-t border-[#eee4dc]">
                <td className="px-4 py-3 font-extrabold text-[#1D1916]">{label}</td>
                {comparisonRows.map((item) => <td key={`${item.id}-${label}`} className="px-4 py-3 font-bold text-[#6E6258]">{value(item)}</td>)}
              </tr>
            ))}
            <tr className="border-t border-[#eee4dc]">
              <td className="px-4 py-3 font-extrabold text-[#1D1916]">الإجراء</td>
              {comparisonRows.map((item) => (
                <td key={`${item.id}-action`} className="px-4 py-3">
                  <Link href={dashboardHref(role, `asset-details?asset=${encodeURIComponent(item.slug)}`)} className="inline-flex min-h-9 items-center rounded-md border border-[#B89A7A] px-3 text-xs font-extrabold text-[#A7815E]">عرض التفاصيل</Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

async function IndividualInterestedAssetsPage({ config, actor = null, searchParams = {} }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null; searchParams?: DashboardSearchParams }) {
  const [result, allAssetsResult, notificationsResult] = await Promise.all([
    listDashboardAssetsForScope("individual", "interested", actor),
    listDashboardAssetsForScope("individual", "all", actor),
    listDashboardNotifications("individual", actor),
  ]);
  const q = stringParam(searchParams, "q").trim();
  const activeStatus = stringParam(searchParams, "status").trim();
  const activeCity = stringParam(searchParams, "city").trim();
  const compareMode = stringParam(searchParams, "compare") === "1";
  const allRows = result.data.length ? result.data.map((row) => mapDashboardAssetToIndividualCard(row)) : individualAssetFallbackRows().slice(0, 4);
  const rows = allRows.filter((row) => {
    const cityMatches = activeCity === "riyadh" ? row.city === "الرياض" : true;
    return cityMatches && matchesDashboardSearch(q, [row.title, row.city, row.area, row.type, row.status, row.value]) && matchesDashboardStatus(row.status, activeStatus);
  });
  const pagination = paginateDashboardRows(rows, searchParams, 4);
  const riyadhCount = allRows.filter((row) => row.city === "الرياض").length;
  const approvedCount = allRows.filter((row) => matchesDashboardStatus(row.status, "approved")).length;
  const pendingCount = allRows.filter((row) => matchesDashboardStatus(row.status, "pending")).length;
  const interestedIds = new Set(result.data.map((row) => row.id));
  const discoverableAssets = allAssetsResult.data.filter((row) => !interestedIds.has(row.id));
  const newAssetItems = discoverableAssets
    .slice()
    .sort((first, second) => new Date(second.submittedAt ?? second.listingDate).getTime() - new Date(first.submittedAt ?? first.listingDate).getTime())
    .slice(0, 3)
    .map((row) => `${row.titleAr} - ${row.cityAr}`);
  const recommendedAssets = discoverableAssets
    .filter((row) => allRows.some((saved) => saved.city === row.cityAr || saved.type === row.assetTypeAr))
    .slice(0, 3)
    .map((row) => row.titleAr);
  const interestedNotifications = notificationsResult.data
    .filter((notification) => `${notification.category} ${notification.title} ${notification.body} ${notification.actionUrl ?? ""}`.includes("asset") || `${notification.title} ${notification.body}`.includes("أصل"))
    .slice(0, 3)
    .map((notification) => notification.title);
  const recentInterestActivity = [
    ...allRows.slice(0, 3).map((row) => `${row.title}: ${row.status}`),
    ...interestedNotifications,
  ].slice(0, 3);
  const stats = [
    { title: "إجمالي الأصول المهتم بها", value: String(allRows.length), unit: "أصل", icon: "star", link: "عرض جميع الأصول", href: dashboardHref(config.role, "interested-assets") },
    { title: "أصول معتمدة", value: String(approvedCount), unit: "أصول", icon: "building", link: "عرض جميع الأصول المعتمدة", href: dashboardHref(config.role, "interested-assets?status=approved") },
    { title: "أصول قيد المراجعة", value: String(pendingCount), unit: "أصل", icon: "chart", link: "عرض أصول قيد المراجعة", href: dashboardHref(config.role, "interested-assets?status=pending") },
    { title: "أصول في الرياض", value: String(riyadhCount), unit: "أصل", icon: "location", link: "عرض جميع أصول في الرياض", href: dashboardHref(config.role, "interested-assets?city=riyadh") },
  ];

  return (
    <div className="grid gap-4">
      <IndividualPageHero
        title="الأصول المهتم بها"
        subtitle="تابع الأصول العقارية التي أضفتها إلى قائمة الاهتمام وقارن بينها لاتخاذ القرار المناسب."
        image="/images/asset-commercial-complex.png"
        action={{ label: "إضافة أصل عقاري", href: dashboardHref(config.role, "add-asset") }}
      />
      {result.error || allAssetsResult.error || notificationsResult.error ? <section className="rounded-lg border border-[#F0D8B8] bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل جزء من بيانات الاهتمام الحية من Supabase، وتم عرض البيانات المتاحة.</section> : null}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => <IndividualKpiCard key={item.title} {...item} />)}
      </section>

      <section className="rounded-lg border border-[#ece1d8] bg-white p-4 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
        <form action={dashboardHref(config.role, "interested-assets")} className="grid gap-3 lg:grid-cols-6">
          {activeStatus ? <input type="hidden" name="status" value={activeStatus} /> : null}
          {activeCity ? <input type="hidden" name="city" value={activeCity} /> : null}
          <label className="relative block lg:col-span-2">
            <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1D1916]" />
            <input name="q" defaultValue={q} className="h-12 w-full rounded-md border border-[#ece1d8] bg-white pl-16 pr-12 text-sm font-bold outline-none focus:border-[#A7815E]" placeholder="ابحث عن أصل عقاري" />
            <button type="submit" className="absolute left-2 top-1/2 h-8 -translate-y-1/2 rounded bg-[#1D1916] px-3 text-xs font-extrabold text-white">بحث</button>
          </label>
          <FilterBox label="الرياض" href={dashboardHref(config.role, `interested-assets?city=riyadh${activeStatus ? `&status=${encodeURIComponent(activeStatus)}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`)} />
          <FilterBox label="المعتمدة" href={dashboardHref(config.role, `interested-assets?status=approved${activeCity ? `&city=${encodeURIComponent(activeCity)}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`)} />
          <FilterBox label="قيد المراجعة" href={dashboardHref(config.role, `interested-assets?status=pending${activeCity ? `&city=${encodeURIComponent(activeCity)}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`)} />
          <Link href={dashboardHref(config.role, "interested-assets")} className="flex h-12 items-center justify-center gap-2 rounded-md border border-[#ece1d8] bg-white px-4 text-sm font-extrabold text-[#1D1916]">
            <RefreshCcw className="h-4 w-4" />
            إعادة تعيين
          </Link>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {rows.length === 0 ? <EmptyDashboardState title="لا توجد أصول مطابقة" description="غيّر البحث أو الفلاتر لعرض أصول محفوظة أخرى من قاعدة البيانات." /> : pagination.rows.map((item) => <InterestedAssetCard key={item.id} item={item} saved />)}
      </section>

      <div className="flex justify-center">
        <DashboardPaginationControls role={config.role} path="interested-assets" page={pagination.page} totalPages={pagination.totalPages} params={{ q, status: activeStatus, city: activeCity, compare: compareMode ? "1" : undefined }} />
      </div>

      {compareMode ? <InterestedAssetsComparison rows={rows} role={config.role} q={q} activeStatus={activeStatus} activeCity={activeCity} /> : null}

      <section className="grid gap-4 xl:grid-cols-[0.75fr_1.25fr_0.9fr]">
        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-center shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <h2 className="font-display text-xl font-extrabold text-[#1D1916]">مقارنة الأصول</h2>
          <p className="mt-2 text-sm font-bold leading-7 text-[#6E6258]">اختر أصلين أو أكثر للمقارنة.</p>
          <Link href={dashboardHref(config.role, "interested-assets?compare=1")} className="mt-5 grid min-h-11 place-items-center rounded-md border border-[#B89A7A] px-6 text-sm font-extrabold text-[#A7815E]">اختيار الأصول للمقارنة</Link>
        </article>
        <article className="overflow-hidden rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold text-[#1D1916]">
            {rows.slice(0, 2).map((item) => (
              <div key={item.title} className="rounded-md border border-[#eee4dc] p-2">
                <div className="relative mb-2 h-16 overflow-hidden rounded bg-[#f5eee7]"><Image src={item.image} alt="" fill className="object-cover" sizes="140px" /></div>
                {item.title}
              </div>
            ))}
            <div className="grid gap-2 text-right text-[#6E6258]">
              {["المدينة", "المساحة", "الاستخدام", "السعر", "الحالة"].map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </article>
        <SmallPanel title="الأصول الجديدة" items={newAssetItems.length ? newAssetItems : ["لا توجد أصول جديدة خارج قائمة اهتمامك حالياً"]} action="عرض المزيد" actionHref={dashboardHref(config.role, "browse-assets")} />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <SmallPanel title="قد يعجبك أيضاً" items={recommendedAssets.length ? recommendedAssets : newAssetItems.length ? newAssetItems : ["لا توجد توصيات إضافية حسب البيانات الحالية"]} action="عرض المزيد" actionHref={dashboardHref(config.role, "browse-assets")} />
        <SmallPanel title="تنبيهات الاهتمام" items={interestedNotifications.length ? interestedNotifications : ["لا توجد تنبيهات اهتمام جديدة"]} action="عرض جميع التنبيهات" actionHref={dashboardHref(config.role, "notifications")} />
        <SmallPanel title="النشاط الأخير" items={recentInterestActivity.length ? recentInterestActivity : ["لا يوجد نشاط اهتمام حديث"]} action="عرض جميع الأنشطة" actionHref={dashboardHref(config.role, "notifications")} />
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        <IndividualKpiCard title="عدد الأصول المحفوظة" value={String(allRows.length)} unit="أصل" icon="star" />
        <IndividualKpiCard title="عدد المقارنات المتاحة" value={String(allRows.length >= 2 ? Math.min(3, allRows.length) : 0)} unit="أصول" icon="circle-dollar" />
        <IndividualKpiCard title="أصول مقترحة" value={String(recommendedAssets.length)} unit="أصل" icon="bell" />
        <IndividualKpiCard title="تحديثات بالبيانات" value={String(interestedNotifications.length)} unit="تنبيهات" icon="settings" />
      </section>
      <TrustDigitalStrip />
    </div>
  );
}

function AssetDetailTile({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <article className="rounded-lg border border-[#ece1d8] bg-white p-4 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs font-extrabold text-[#6E6258]">{label}</span>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#f5eee7] text-[#A7815E]">{icon}</span>
      </div>
      <strong className="font-display text-2xl font-extrabold text-[#1D1916]">{value}</strong>
    </article>
  );
}

function AssetFieldList({ title, items }: { title: string; items: Array<[string, string]> }) {
  return (
    <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
      <h2 className="mb-4 flex items-center justify-between font-display text-xl font-extrabold text-[#1D1916]">
        {title}
        <FileText className="h-5 w-5 text-[#A7815E]" />
      </h2>
      <div className="grid gap-2">
        {items.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 border-b border-[#eee4dc] py-2.5 last:border-b-0">
            <span className="text-sm font-bold text-[#6E6258]">{label}</span>
            <strong className="text-sm font-extrabold text-[#1D1916]">{value}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

async function IndividualAssetDetailsPage({ config, actor = null, searchParams = {} }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null; searchParams?: DashboardSearchParams }) {
  const result = await listDashboardAssetsForScope("individual", "all", actor);
  const asset = selectEntityByParam(result.data, searchParams, "asset", "id", "slug") ?? result.data[0];

  if (!asset) {
    return (
      <div className="grid gap-4">
        <IndividualPageHero
          title="تفاصيل الأصل العقاري"
          subtitle="لا توجد أصول عقارية متاحة لعرض تفاصيلها حالياً."
          image="/images/asset-land-masterplan.png"
          action={{ label: "إضافة أصل عقاري", href: dashboardHref(config.role, "add-asset") }}
        />
        <section className="rounded-lg border border-[#ece1d8] bg-white p-8 text-center text-sm font-extrabold text-[#6E6258] shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          لا توجد أصول مرتبطة بهذا الحساب بعد. أضف أصل عقاري جديد أو عد إلى استعراض الأصول.
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href={dashboardHref(config.role, "add-asset")} className="grid min-h-11 place-items-center rounded-md bg-[#A7815E] px-5 text-sm font-extrabold text-white">إضافة أصل عقاري</Link>
            <Link href={dashboardHref(config.role, "browse-assets")} className="grid min-h-11 place-items-center rounded-md border border-[#B89A7A] bg-white px-5 text-sm font-extrabold text-[#A7815E]">استعراض الأصول</Link>
          </div>
        </section>
      </div>
    );
  }

  const liveEstimatedValue = (asset as { estimatedValueSar?: number }).estimatedValueSar;
  const estimatedValue = formatSar(typeof liveEstimatedValue === "number" ? liveEstimatedValue : asset.areaSqm * (asset.pricePerSqm ?? 0));
  const district = asset.districtAr ?? "غير محدد";
  const deedNumber = asset.deedNumber ?? "غير متوفر";
  const gallery = asset.gallery ?? [asset.image, "/images/hero-raw-land.png", "/images/hero-panorama.png"];
  const [documentsResult, notificationsResult] = await Promise.all([
    listDashboardDocumentsForEntity({
      scope: "individual",
      entityId: asset.id,
      entityRef: asset.slug,
      entityTypes: ["asset_document", "asset_review_decision", "asset_deed", "asset_site_plan", "asset_valuation", "real_estate_asset"],
      actor,
    }),
    listDashboardNotifications("individual", actor),
  ]);
  const statusStepMap: Record<DashboardAdminReviewStatus, number> = { pending: 2, needs_changes: 2, approved: 5, rejected: 1 };
  const completedStudySteps = statusStepMap[asset.status] ?? (asset.rawStatus === "submitted" || asset.rawStatus === "in_review" ? 3 : 2);
  const deedStatus = asset.status === "approved" ? "معتمد" : asset.status === "rejected" ? "مرفوض" : asset.status === "needs_changes" ? "يحتاج تعديل" : "تحت المراجعة";
  const siteReference = asset.slug ? `mahabah.sa/assets/${asset.slug}` : asset.cityAr && district !== "غير محدد" ? `${asset.cityAr}، ${district}` : "غير متاح";
  const assetNotifications = notificationsResult.data
    .filter((notification) => {
      const haystack = `${notification.category} ${notification.title} ${notification.body} ${notification.actionUrl ?? ""}`;
      return haystack.includes("asset") || haystack.includes("أصل") || haystack.includes(asset.slug) || haystack.includes(asset.id) || haystack.includes(asset.titleAr);
    })
    .slice(0, 3);
  const assetAlertItems = assetNotifications.length
    ? assetNotifications.map((notification) => notification.title)
    : [
        `${asset.titleAr} حالته الحالية: ${asset.statusAr}`,
        documentsResult.data.length ? `عدد المستندات المرتبطة: ${documentsResult.data.length}` : "لا توجد مستندات مرتبطة بهذا الأصل بعد",
        `آخر تحديث: ${formatDashboardDate(asset.submittedAt ?? asset.listingDate)}`,
      ];
  const similarAssets = result.data
    .filter((candidate) => candidate.id !== asset.id && (candidate.cityAr === asset.cityAr || candidate.assetTypeAr === asset.assetTypeAr || candidate.usageTypeAr === asset.usageTypeAr))
    .slice(0, 3)
    .map((candidate) => candidate.titleAr);
  const assetTraits = [
    asset.cityAr,
    district !== "غير محدد" ? district : null,
    asset.usageTypeAr,
    asset.frontageCount ? `${asset.frontageCount} واجهة` : null,
    asset.streetWidthM ? `شارع ${asset.streetWidthM} م` : null,
    asset.statusAr,
  ].filter(Boolean) as string[];

  return (
    <div className="grid gap-4">
      <IndividualPageHero
        title="تفاصيل الأصل العقاري"
        subtitle="عرض بيانات الأصل، مستنداته، موقعه، وحالته التشغيلية داخل حساب الأفراد."
        image="/images/asset-land-masterplan.png"
        action={{ label: "طلب خدمة عقارية", href: dashboardHref(config.role, "request-service") }}
      />
      {result.error ? <section className="rounded-lg border border-[#F0D8B8] bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل تفاصيل الأصل الحية من Supabase، وتم عرض بيانات احتياطية.</section> : null}

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="overflow-hidden rounded-lg border border-[#ece1d8] bg-white shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <div className="relative min-h-[310px] bg-[#f5eee7]">
            <Image src={asset.image} alt="" fill className="object-cover grayscale-[8%] sepia-[10%]" sizes="900px" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D1916]/42 via-transparent to-transparent" />
            <div className="absolute bottom-5 right-5 max-w-2xl text-right text-white">
              <span className="mb-3 inline-flex rounded-md bg-white/92 px-4 py-1.5 text-xs font-extrabold text-[#A7815E]">{asset.statusAr}</span>
              <h2 className="font-display text-4xl font-extrabold leading-tight">{asset.titleAr}</h2>
              <p className="mt-2 flex items-center gap-2 text-sm font-bold text-white/86"><MapPin className="h-4 w-4" />{asset.cityAr}، {district}</p>
            </div>
          </div>
          <div className="grid gap-3 p-4 md:grid-cols-4">
            {gallery.slice(0, 4).map((image) => (
              <div key={image} className="relative h-24 overflow-hidden rounded-md border border-[#eee4dc] bg-[#f5eee7]">
                <Image src={image} alt="" fill className="object-cover grayscale-[8%] sepia-[10%]" sizes="180px" />
              </div>
            ))}
          </div>
        </article>

        <aside className="grid gap-4 content-start">
          <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
            <h2 className="font-display text-xl font-extrabold text-[#1D1916]">إجراءات الأصل</h2>
            <p className="mt-2 text-sm font-bold leading-7 text-[#6E6258]">{asset.excerptAr}</p>
            <div className="mt-5 grid gap-3">
              <InterestActionButton entityType="asset" slug={asset.slug} title={asset.titleAr} className="min-h-11 rounded-md bg-[#A7815E] px-5 text-sm font-extrabold text-white" />
              <Link href={dashboardHref(config.role, "request-service")} className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#B89A7A] bg-white px-5 text-sm font-extrabold text-[#A7815E]">طلب خدمة على الأصل</Link>
              <Link href={dashboardHref(config.role, "browse-assets")} className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#ece1d8] bg-white px-5 text-sm font-extrabold text-[#1D1916]">العودة لاستعراض الأصول</Link>
            </div>
          </article>
          <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
            <h2 className="mb-4 font-display text-xl font-extrabold text-[#1D1916]">حالة الدراسة</h2>
            {["استلام الأصل", "مراجعة البيانات", "الدراسة الأولية", "التحليل", "الاعتماد"].map((step, index) => (
              <div key={step} className="flex items-center gap-3 border-b border-[#eee4dc] py-3 last:border-b-0">
                <span className={cn("grid h-7 w-7 place-items-center rounded-full border text-xs font-extrabold", index < completedStudySteps ? "border-[#087342] bg-[#e9f7ef] text-[#087342]" : "border-[#d8d1ca] bg-white text-[#9b9189]")}>{index < completedStudySteps ? "✓" : index + 1}</span>
                <span className="text-sm font-bold text-[#1D1916]">{step}</span>
              </div>
            ))}
          </article>
        </aside>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <AssetDetailTile label="المساحة" value={formatArea(asset.areaSqm)} icon={<Building2 className="h-5 w-5" />} />
        <AssetDetailTile label="القيمة التقديرية" value={estimatedValue} icon={<CircleDollarSign className="h-5 w-5" />} />
        <AssetDetailTile label="نوع الأصل" value={asset.assetTypeAr} icon={<Tag className="h-5 w-5" />} />
        <AssetDetailTile label="حالة الأصل" value={asset.statusAr} icon={<ShieldCheck className="h-5 w-5" />} />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <AssetFieldList title="بيانات الأصل" items={[["المدينة", asset.cityAr], ["الحي", district], ["نوع الاستخدام", asset.usageTypeAr], ["عرض الشارع", `${asset.streetWidthM ?? 0} م`], ["عدد الواجهات", `${asset.frontageCount ?? 0}`], ["تاريخ الإضافة", asset.listingDate]]} />
        <AssetFieldList title="بيانات الصك والموقع" items={[["رقم الصك", deedNumber], ["نوع الصك", deedNumber === "غير متوفر" ? "غير مكتمل" : "صك إلكتروني"], ["حالة الصك", deedStatus], ["جهة الإصدار", deedNumber === "غير متوفر" ? "غير محددة" : "وزارة العدل"], ["المخطط", documentsResult.data.some((doc) => doc.entityType.includes("site_plan")) ? "مرفوع" : "غير مرفوع"], ["رابط الأصل", siteReference]]} />
        <DashboardDocumentsPanel title="مرفقات الأصل" documents={documentsResult.data} error={documentsResult.error} emptyLabel="لا توجد مستندات مرفوعة لهذا الأصل بعد." />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <SmallPanel title="تنبيهات الأصل" items={assetAlertItems} action="عرض جميع التنبيهات" actionHref={dashboardHref(config.role, "notifications")} />
        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <h2 className="font-display text-xl font-extrabold text-[#1D1916]">وصف الأصل</h2>
          <p className="mt-3 text-sm font-bold leading-8 text-[#6E6258]">{asset.excerptAr} يتم عرض هذه البيانات للمراجعة الداخلية ومتابعة الطلبات المرتبطة بالأصل قبل الانتقال إلى أي مسار استثماري أو خدمي.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {assetTraits.slice(0, 3).map((item) => <span key={item} className="rounded-md border border-[#ece1d8] bg-[#fffaf4] px-3 py-2 text-center text-xs font-extrabold text-[#A7815E]">{item}</span>)}
          </div>
        </article>
        <SmallPanel title="أصول مشابهة" items={similarAssets.length ? similarAssets : ["لا توجد أصول مشابهة ضمن البيانات الحالية"]} action="استعراض الأصول" actionHref={dashboardHref(config.role, "browse-assets")} />
      </section>

      <TrustDigitalStrip />
    </div>
  );
}

const individualContributionCards = [
  { title: "مساهمة حي الواحة", city: "الدمام", value: "1.2 مليار ريال", duration: "48 شهر", roi: "9%", investors: "1,450", image: "/images/hero-panorama.png", progress: "64%" },
  { title: "مساهمة مجمع النرجس", city: "جدة", value: "620 مليون ريال", duration: "30 شهر", roi: "12%", investors: "950", image: "/images/asset-commercial-complex.png", progress: "72%" },
  { title: "مساهمة أبراج الرياض", city: "الرياض", value: "1.8 مليار ريال", duration: "42 شهر", roi: "6%", investors: "1,800", image: "/images/asset-tower.png", progress: "48%" },
  { title: "مساهمة النخيل التجاري", city: "الرياض", value: "750 مليون ريال", duration: "36 شهر", roi: "7.5%", investors: "1,200", image: "/images/media-featured.png", progress: "58%" },
];

type IndividualContributionCardItem = {
  id: string;
  slug: string;
  title: string;
  city: string;
  value: string;
  duration: string;
  roi: string;
  investors: string;
  image: string;
  progress: string;
  status: string;
};

function individualContributionFallbackRows(): IndividualContributionCardItem[] {
  return individualContributionCards.map((item, index) => ({
    ...item,
    id: `static-individual-contribution-${index + 1}`,
    slug: `static-individual-contribution-${index + 1}`,
    status: "معتمد",
  }));
}

function mapDashboardContributionToIndividualCard(row: DashboardAdminContributionRow): IndividualContributionCardItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.titleAr,
    city: row.cityAr,
    value: formatSar(row.capitalSar),
    duration: `${row.durationMonths} شهر`,
    roi: row.expectedReturnPercent ? `${row.expectedReturnPercent}%` : "تحت التقييم",
    investors: `${row.investorsCount}`,
    image: row.image,
    progress: `${row.fundedPercent}%`,
    status: reviewStatusLabel(row.status),
  };
}

function ContributionCard({ item, saved = false }: { item: IndividualContributionCardItem; saved?: boolean }) {
  return (
    <article className="overflow-hidden rounded-lg border border-[#8F6B4C] text-white shadow-[0_16px_34px_rgb(29_25_22/0.18)]" style={{ background: "linear-gradient(180deg,#2D2823,#1D1916)" }}>
      <div className="relative h-32 bg-[#f5eee7]">
        <Image src={item.image} alt="" fill className="object-cover grayscale-[10%] sepia-[8%]" sizes="310px" />
        <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/92 text-[#A7815E] shadow-sm">
          <Heart className={cn("h-4 w-4", saved ? "fill-current" : "")} />
        </span>
      </div>
      <div className="p-4 text-right">
        <h3 className="font-display text-lg font-extrabold">{item.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs font-bold text-white/72"><MapPin className="h-4 w-4" />{item.city}</p>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-bold text-white/78">
          <span>قيمة المشروع</span><strong className="text-left text-white">{item.value}</strong>
          <span>مدة الاستثمار</span><strong className="text-left text-white">{item.duration}</strong>
          <span>نسبة الإنجاز</span><strong className="text-left text-white">{item.roi}</strong>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/12">
          <span className="block h-full rounded-full bg-[#A7815E]" style={{ width: item.progress }} />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs font-extrabold">
          <span>عدد المستثمرين</span>
          <span>{item.investors} مستثمر</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Link href={dashboardHref("individual", `contribution-details?contribution=${encodeURIComponent(item.slug)}`)} className="inline-flex min-h-9 items-center justify-center rounded-md border border-white/18 px-2 text-[11px] font-extrabold text-white">عرض التفاصيل</Link>
          <InterestActionButton entityType="contribution" slug={item.slug} title={item.title} initialInterested={saved} className="min-h-9 rounded-md border border-[#B89A7A] px-2 text-[11px] font-extrabold text-[#f2b18f]" />
          <Link href={dashboardHref("individual", "interested-contributions?compare=1")} className="grid min-h-9 place-items-center rounded-md border border-white/18 px-2 text-[11px] font-extrabold text-white">مقارنة</Link>
        </div>
      </div>
    </article>
  );
}

function MiniContributionStrip({ title, items }: { title: string; items: IndividualContributionCardItem[] }) {
  return (
    <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
      <h2 className="mb-4 font-display text-xl font-extrabold text-[#1D1916]">{title}</h2>
      <div className="grid gap-3 md:grid-cols-3">
        {items.slice(0, 3).map((item) => (
          <div key={`${title}-${item.title}`} className="rounded-md border border-[#eee4dc] p-3 text-center">
            <div className="relative mx-auto mb-2 h-16 w-full overflow-hidden rounded bg-[#f5eee7]"><Image src={item.image} alt="" fill className="object-cover" sizes="140px" /></div>
            <p className="text-xs font-extrabold text-[#1D1916]">{item.title}</p>
            <p className="mt-1 text-xs font-bold text-[#6E6258]">{item.value}</p>
          </div>
        ))}
      </div>
      <Link href={dashboardHref("individual", "browse-contributions")} className="mt-4 inline-flex text-sm font-extrabold text-[#1D1916]">عرض جميع {title} ←</Link>
    </article>
  );
}

function InterestedContributionsComparison({ rows, role, q, activeStatus }: { rows: IndividualContributionCardItem[]; role: DashboardRole; q: string; activeStatus: string }) {
  if (rows.length < 2) {
    return (
      <section className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-extrabold text-[#1D1916]">مقارنة المساهمات</h2>
          <Link href={dashboardQueryHref(role, "interested-contributions", { q, status: activeStatus })} className="text-sm font-extrabold text-[#A7815E]">إغلاق المقارنة</Link>
        </div>
        <p className="mt-3 text-sm font-bold leading-7 text-[#6E6258]">تحتاج إلى مساهمتين محفوظتين على الأقل لعرض مقارنة فعلية.</p>
      </section>
    );
  }

  const comparisonRows = rows.slice(0, 3);
  const metrics = [
    ["المدينة", (item: IndividualContributionCardItem) => item.city],
    ["قيمة المشروع", (item: IndividualContributionCardItem) => item.value],
    ["مدة الاستثمار", (item: IndividualContributionCardItem) => item.duration],
    ["العائد / الإنجاز", (item: IndividualContributionCardItem) => item.roi],
    ["عدد المستثمرين", (item: IndividualContributionCardItem) => `${item.investors} مستثمر`],
    ["الحالة", (item: IndividualContributionCardItem) => item.status],
  ] as const;

  return (
    <section className="overflow-hidden rounded-lg border border-[#8F6B4C] text-right text-white shadow-[0_16px_34px_rgb(29_25_22/0.16)]" style={{ background: "linear-gradient(180deg,#2D2823,#1D1916)" }}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-5">
        <div>
          <h2 className="font-display text-xl font-extrabold">مقارنة المساهمات</h2>
          <p className="mt-1 text-sm font-bold text-white/68">مقارنة مباشرة بين المساهمات المحفوظة حسب الفلاتر الحالية.</p>
        </div>
        <Link href={dashboardQueryHref(role, "interested-contributions", { q, status: activeStatus })} className="grid min-h-10 place-items-center rounded-md border border-[#B89A7A] px-4 text-sm font-extrabold text-[#f2b18f]">إغلاق المقارنة</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="bg-white/8 text-xs font-extrabold text-white/68">
              <th className="px-4 py-3 text-right">المعيار</th>
              {comparisonRows.map((item) => <th key={item.id} className="px-4 py-3 text-right">{item.title}</th>)}
            </tr>
          </thead>
          <tbody>
            {metrics.map(([label, value]) => (
              <tr key={label} className="border-t border-white/10">
                <td className="px-4 py-3 font-extrabold text-white">{label}</td>
                {comparisonRows.map((item) => <td key={`${item.id}-${label}`} className="px-4 py-3 font-bold text-white/72">{value(item)}</td>)}
              </tr>
            ))}
            <tr className="border-t border-white/10">
              <td className="px-4 py-3 font-extrabold text-white">الإجراء</td>
              {comparisonRows.map((item) => (
                <td key={`${item.id}-action`} className="px-4 py-3">
                  <Link href={dashboardHref(role, `contribution-details?contribution=${encodeURIComponent(item.slug)}`)} className="inline-flex min-h-9 items-center rounded-md border border-[#B89A7A] px-3 text-xs font-extrabold text-[#f2b18f]">عرض التفاصيل</Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

async function IndividualContributionsPage({ config, variant, actor = null, searchParams = {} }: { config: DashboardRoleConfig; variant: "browse" | "interested"; actor?: DashboardActorContext | null; searchParams?: DashboardSearchParams }) {
  const interested = variant === "interested";
  const activePath = interested ? "interested-contributions" : "browse-contributions";
  const [result, allContributionsResult, notificationsResult] = await Promise.all([
    listDashboardContributionsForScope("individual", interested ? "interested" : "all", actor),
    listDashboardContributionsForScope("individual", "all", actor),
    listDashboardNotifications("individual", actor),
  ]);
  const q = stringParam(searchParams, "q").trim();
  const activeStatus = stringParam(searchParams, "status").trim();
  const compareMode = interested && stringParam(searchParams, "compare") === "1";
  const allRows = result.data.length ? result.data.map((row) => mapDashboardContributionToIndividualCard(row)) : individualContributionFallbackRows();
  const rows = allRows.filter((row) => matchesDashboardSearch(q, [row.title, row.city, row.value, row.duration, row.roi, row.investors, row.status]) && matchesDashboardStatus(row.status, activeStatus));
  const pagination = paginateDashboardRows(rows, searchParams, 8);
  const approvedCount = result.data.filter((row) => row.status === "approved").length;
  const pendingCount = result.data.filter((row) => row.status === "pending").length;
  const totalCapital = result.data.reduce((sum, row) => sum + row.capitalSar, 0);
  const savedContributionIds = new Set(result.data.map((row) => row.id));
  const discoverableContributions = allContributionsResult.data.filter((row) => !savedContributionIds.has(row.id));
  const newContributionRows = (interested ? discoverableContributions : result.data)
    .slice()
    .sort((first, second) => new Date(second.submittedAt ?? "").getTime() - new Date(first.submittedAt ?? "").getTime())
    .map((row) => mapDashboardContributionToIndividualCard(row));
  const recommendedContributionRows = (interested ? discoverableContributions : result.data)
    .filter((row) => !interested || result.data.some((saved) => saved.cityAr === row.cityAr || saved.stageAr === row.stageAr))
    .map((row) => mapDashboardContributionToIndividualCard(row));
  const contributionNotifications = notificationsResult.data
    .filter((notification) => `${notification.category} ${notification.title} ${notification.body} ${notification.actionUrl ?? ""}`.includes("contribution") || `${notification.title} ${notification.body}`.includes("مساهمة"))
    .slice(0, 3)
    .map((notification) => notification.title);
  const contributionActivityItems = [
    ...rows.slice(0, 3).map((row) => `${row.title}: ${row.status}`),
    ...contributionNotifications,
  ].slice(0, 3);
  const averageDurationMonths = result.data.length ? Math.round(result.data.reduce((sum, row) => sum + row.durationMonths, 0) / result.data.length) : 0;
  const availableComparisonCount = rows.length >= 2 ? Math.min(3, rows.length) : 0;
  const stats = interested
    ? [
        { title: "إجمالي المساهمات المحفوظة", value: String(allRows.length), unit: "مساهمة", icon: "star", link: "عرض جميع المساهمات", href: dashboardHref(config.role, "interested-contributions") },
        { title: "مساهمات معتمدة", value: String(approvedCount), unit: "مساهمات", icon: "chart", link: "عرض المساهمات المعتمدة", href: dashboardHref(config.role, "interested-contributions?status=approved") },
        { title: "مساهمات قيد المراجعة", value: String(pendingCount), unit: "مساهمات", icon: "file", link: "عرض قيد المراجعة", href: dashboardHref(config.role, "interested-contributions?status=pending") },
        { title: "مساهمات في الرياض", value: String(allRows.filter((row) => row.city === "الرياض").length), unit: "مساهمات", icon: "location", link: "عرض في الرياض", href: dashboardHref(config.role, "interested-contributions?q=الرياض") },
      ]
    : [
        { title: "مساهمات معتمدة", value: String(approvedCount), unit: "مساهمة", icon: "shield", link: "عرض جميع المعتمدة", href: dashboardHref(config.role, "browse-contributions?status=approved") },
        { title: "مساهمات قيد المراجعة", value: String(pendingCount), unit: "مساهمة", icon: "building", link: "عرض قيد المراجعة", href: dashboardHref(config.role, "browse-contributions?status=pending") },
        { title: "إجمالي قيمة المشاريع", value: totalCapital ? formatSar(totalCapital).replace(" ريال سعودي", "") : "0", unit: "ريال", icon: "circle-dollar", link: "عرض جميع المشاريع", href: dashboardHref(config.role, "browse-contributions") },
        { title: "إجمالي المساهمات", value: String(allRows.length), unit: "مساهمة", icon: "chart", link: "عرض جميع المساهمات", href: dashboardHref(config.role, "browse-contributions") },
      ];

  return (
    <div className="grid gap-4">
      <IndividualPageHero
        title={interested ? "المساهمات المهتم بها" : "المساهمات العقارية"}
        subtitle={interested ? "تابع المساهمات العقارية التي أضفتها إلى قائمة الاهتمام وقارن بينها لاختيار الفرصة الاستثمارية المناسبة." : "استعرض المساهمات العقارية المطروحة وقارن الفرص الاستثمارية المصنفة وفق أعلى معايير الحوكمة."}
        image={interested ? "/images/contribution-request-hero-sketch.png" : "/images/hero-construction.png"}
        action={{ label: interested ? "استعراض جميع المساهمات" : "استعراض الفرص الاستثمارية", href: dashboardHref(config.role, "browse-contributions") }}
      />
      {result.error || allContributionsResult.error || notificationsResult.error ? <section className="rounded-lg border border-[#F0D8B8] bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل جزء من بيانات المساهمات الحية من Supabase، وتم عرض البيانات المتاحة.</section> : null}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => <IndividualKpiCard key={item.title} {...item} />)}
      </section>

      <section className="rounded-lg border border-[#ece1d8] bg-white p-4 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
        <form action={dashboardHref(config.role, activePath)} className="grid gap-3 lg:grid-cols-6">
          {activeStatus ? <input type="hidden" name="status" value={activeStatus} /> : null}
          <label className="relative block lg:col-span-2">
            <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1D1916]" />
            <input name="q" defaultValue={q} className="h-12 w-full rounded-md border border-[#ece1d8] bg-white pl-16 pr-12 text-sm font-bold outline-none focus:border-[#A7815E]" placeholder="ابحث عن مساهمة" />
            <button type="submit" className="absolute left-2 top-1/2 h-8 -translate-y-1/2 rounded bg-[#1D1916] px-3 text-xs font-extrabold text-white">بحث</button>
          </label>
          <FilterBox label="كل المساهمات" href={dashboardHref(config.role, activePath)} />
          <FilterBox label="المعتمدة" href={dashboardHref(config.role, `${activePath}?status=approved${q ? `&q=${encodeURIComponent(q)}` : ""}`)} />
          <FilterBox label="قيد المراجعة" href={dashboardHref(config.role, `${activePath}?status=pending${q ? `&q=${encodeURIComponent(q)}` : ""}`)} />
          <Link href={dashboardHref(config.role, activePath)} className="flex h-12 items-center justify-center gap-2 rounded-md border border-[#ece1d8] bg-white px-4 text-sm font-extrabold text-[#1D1916]">
            <RefreshCcw className="h-4 w-4" />
            إعادة تعيين
          </Link>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {rows.length ? pagination.rows.map((item) => <ContributionCard key={item.id} item={item} saved={interested} />) : <div className="rounded-lg border border-[#ece1d8] bg-white p-8 text-center text-sm font-extrabold text-[#6E6258] md:col-span-2 xl:col-span-4">لا توجد مساهمات مطابقة للبحث أو الفلتر الحالي.</div>}
      </section>

      <div className="flex justify-center">
        <DashboardPaginationControls role={config.role} path={activePath} page={pagination.page} totalPages={pagination.totalPages} params={{ q, status: activeStatus, compare: compareMode ? "1" : undefined }} />
      </div>

      {compareMode ? <InterestedContributionsComparison rows={rows} role={config.role} q={q} activeStatus={activeStatus} /> : null}

      {interested ? (
        <section className="grid gap-4 xl:grid-cols-3">
          <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
            <h2 className="font-display text-xl font-extrabold text-[#1D1916]">مقارنة المساهمات</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {rows.slice(0, 2).map((item) => (
                <div key={item.title} className="rounded-md border border-[#eee4dc] p-3 text-center">
                  <div className="relative mb-2 h-14 overflow-hidden rounded"><Image src={item.image} alt="" fill className="object-cover" sizes="120px" /></div>
                  <p className="text-xs font-bold text-[#1D1916]">{item.title}</p>
                </div>
              ))}
            </div>
            <Link href={dashboardHref(config.role, "interested-contributions?compare=1")} className="mt-4 grid min-h-10 w-full place-items-center rounded-md border border-[#B89A7A] text-sm font-extrabold text-[#A7815E]">اختر للمقارنة</Link>
          </article>
          <MiniContributionStrip title="المساهمات الجديدة" items={newContributionRows.length ? newContributionRows : rows} />
          <MiniContributionStrip title="فرص استثمارية مقترحة لك" items={recommendedContributionRows.length ? recommendedContributionRows : newContributionRows} />
        </section>
      ) : (
        <section className="grid gap-4 xl:grid-cols-3">
          <MiniContributionStrip title="المساهمات المميزة" items={rows} />
          <MiniContributionStrip title="المساهمات الجديدة" items={newContributionRows.length ? newContributionRows : rows} />
          <MiniContributionStrip title="فرص استثمارية مقترحة لك" items={recommendedContributionRows.length ? recommendedContributionRows : rows.slice(1).concat(rows[0] ? [rows[0]] : [])} />
        </section>
      )}

      <section className="grid gap-4 xl:grid-cols-2">
        <SmallPanel title={interested ? "تنبيهات المساهمات" : "تنبيهات السوق"} items={contributionNotifications.length ? contributionNotifications : ["لا توجد تنبيهات مساهمات جديدة"]} action="عرض جميع التنبيهات" actionHref={dashboardHref(config.role, "notifications")} />
        <SmallPanel title="النشاط الأخير" items={contributionActivityItems.length ? contributionActivityItems : ["لا يوجد نشاط مساهمات حديث"]} action="عرض جميع الأنشطة" actionHref={dashboardHref(config.role, "notifications")} />
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        {(interested
          ? [
              ["المساهمات المحفوظة", String(rows.length), "مساهمة", "star"],
              ["المقارنات المتاحة", String(availableComparisonCount), "مساهمات", "circle-dollar"],
              ["فرص مقترحة", String(recommendedContributionRows.length), "مساهمة", "bell"],
              ["التنبيهات الجديدة", String(contributionNotifications.length), "تنبيهات", "settings"],
            ]
          : [
              ["متوسط عدد المستثمرين", String(result.data.length ? Math.round(result.data.reduce((sum, row) => sum + row.investorsCount, 0) / result.data.length) : 0), "مستثمر", "users"],
              ["متوسط مدة الاستثمار", String(averageDurationMonths), "شهر", "clock"],
              ["المشاريع النشطة", String(approvedCount), "مشروع", "building"],
              ["إجمالي القيمة الاستثمارية", totalCapital ? formatSar(totalCapital).replace(" ريال سعودي", "") : "0", "ريال", "circle-dollar"],
            ]).map(([title, value, unit, icon]) => <IndividualKpiCard key={title} title={title} value={value} unit={unit} icon={icon} />)}
      </section>
      <TrustDigitalStrip />
    </div>
  );
}

async function IndividualContributionDetailsPage({ config, actor = null, searchParams = {} }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null; searchParams?: DashboardSearchParams }) {
  const result = await listDashboardContributionsForScope("individual", "all", actor);
  const contribution = selectEntityByParam(result.data, searchParams, "contribution", "id", "slug") ?? result.data[0];

  if (!contribution) {
    return (
      <div className="grid gap-4">
        <IndividualPageHero
          title="تفاصيل المساهمة العقارية"
          subtitle="لا توجد مساهمات عقارية متاحة لعرض تفاصيلها حالياً."
          image="/images/contribution-request-hero-sketch.png"
          action={{ label: "استعراض المساهمات", href: dashboardHref(config.role, "browse-contributions") }}
        />
        <section className="rounded-lg border border-[#ece1d8] bg-white p-8 text-center text-sm font-extrabold text-[#6E6258] shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          لا توجد مساهمات متاحة لهذا الحساب بعد. يمكنك استعراض المساهمات المنشورة أو متابعة التنبيهات عند إضافة مساهمات جديدة.
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href={dashboardHref(config.role, "browse-contributions")} className="grid min-h-11 place-items-center rounded-md bg-[#A7815E] px-5 text-sm font-extrabold text-white">استعراض المساهمات</Link>
            <Link href={dashboardHref(config.role, "notifications")} className="grid min-h-11 place-items-center rounded-md border border-[#B89A7A] bg-white px-5 text-sm font-extrabold text-[#A7815E]">متابعة الإشعارات</Link>
          </div>
        </section>
      </div>
    );
  }

  const funded = `${contribution.fundedPercent}%`;
  const expectedReturn = contribution.expectedReturnPercent ? `${contribution.expectedReturnPercent}%` : "تحت التقييم";
  const remainingDays = contribution.remainingDays ? `${contribution.remainingDays} يوم` : "غير محدد";
  const gallery = [contribution.image, "/images/hero-panorama.png", "/images/asset-tower.png", "/images/asset-land-masterplan.png"];
  const [documentsResult, notificationsResult] = await Promise.all([
    listDashboardDocumentsForEntity({
      scope: "individual",
      entityId: contribution.id,
      entityRef: contribution.slug,
      entityTypes: ["contribution_document", "contribution_review_decision", "contribution_license", "contribution_study", "contribution_financial_statement"],
      actor,
    }),
    listDashboardNotifications("individual", actor),
  ]);
  const contributionNotifications = notificationsResult.data
    .filter((notification) => {
      const haystack = `${notification.category} ${notification.title} ${notification.body} ${notification.actionUrl ?? ""}`;
      return haystack.includes("contribution") || haystack.includes("مساهمة") || haystack.includes(contribution.slug) || haystack.includes(contribution.id) || haystack.includes(contribution.titleAr);
    })
    .slice(0, 3);
  const contributionAlertItems = contributionNotifications.length
    ? contributionNotifications.map((notification) => notification.title)
    : [
        `${contribution.titleAr} في مرحلة ${contribution.stageAr}`,
        documentsResult.data.length ? `عدد مستندات المساهمة: ${documentsResult.data.length}` : "لا توجد مستندات مرتبطة بهذه المساهمة بعد",
        `نسبة التمويل الحالية: ${funded}`,
      ];
  const contributionTraits = [
    contribution.stageAr,
    `${contribution.investorsCount} مستثمر`,
    expectedReturn !== "تحت التقييم" ? `عائد ${expectedReturn}` : null,
    remainingDays !== "غير محدد" ? `متبقي ${remainingDays}` : null,
    contribution.status === "approved" ? "معتمدة" : reviewStatusLabel(contribution.status),
  ].filter(Boolean) as string[];
  const similarContributions = result.data
    .filter((candidate) => candidate.id !== contribution.id && (candidate.cityAr === contribution.cityAr || candidate.stageAr === contribution.stageAr))
    .slice(0, 3)
    .map((candidate) => candidate.titleAr);

  return (
    <div className="grid gap-4">
      <IndividualPageHero
        title="تفاصيل المساهمة العقارية"
        subtitle="عرض بيانات المساهمة، التمويل، الجدول الزمني، المستندات، ومؤشرات الاستثمار داخل حساب الأفراد."
        image="/images/contribution-request-hero-sketch.png"
        action={{ label: "استعراض المساهمات", href: dashboardHref(config.role, "browse-contributions") }}
      />
      {result.error ? <section className="rounded-lg border border-[#F0D8B8] bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل تفاصيل المساهمة الحية من Supabase، وتم عرض بيانات احتياطية.</section> : null}

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="overflow-hidden rounded-lg border border-[#ece1d8] bg-white shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <div className="relative min-h-[330px] bg-[#f5eee7]">
            <Image src={contribution.image} alt="" fill className="object-cover grayscale-[8%] sepia-[10%]" sizes="900px" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D1916]/56 via-transparent to-transparent" />
            <div className="absolute bottom-5 right-5 max-w-2xl text-right text-white">
              <span className="mb-3 inline-flex rounded-md bg-white/92 px-4 py-1.5 text-xs font-extrabold text-[#A7815E]">{contribution.stageAr}</span>
              <h2 className="font-display text-4xl font-extrabold leading-tight">{contribution.titleAr}</h2>
              <p className="mt-2 flex items-center gap-2 text-sm font-bold text-white/86"><MapPin className="h-4 w-4" />{contribution.cityAr}</p>
            </div>
          </div>
          <div className="grid gap-3 p-4 md:grid-cols-4">
            {gallery.map((image) => (
              <div key={image} className="relative h-24 overflow-hidden rounded-md border border-[#eee4dc] bg-[#f5eee7]">
                <Image src={image} alt="" fill className="object-cover grayscale-[8%] sepia-[10%]" sizes="180px" />
              </div>
            ))}
          </div>
        </article>

        <aside className="grid gap-4 content-start">
          <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
            <h2 className="font-display text-xl font-extrabold text-[#1D1916]">إجراءات المساهمة</h2>
            <p className="mt-2 text-sm font-bold leading-7 text-[#6E6258]">{contribution.excerptAr}</p>
            <div className="mt-5 grid gap-3">
              <InterestActionButton entityType="contribution" slug={contribution.slug} title={contribution.titleAr} className="min-h-11 rounded-md bg-[#A7815E] px-5 text-sm font-extrabold text-white" />
              <Link href={dashboardHref(config.role, `support?topic=${encodeURIComponent(contribution.titleAr)}`)} className="grid min-h-11 place-items-center rounded-md border border-[#B89A7A] bg-white px-5 text-sm font-extrabold text-[#A7815E]">طلب معلومات إضافية</Link>
              <Link href={dashboardHref(config.role, "browse-contributions")} className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#ece1d8] bg-white px-5 text-sm font-extrabold text-[#1D1916]">العودة لاستعراض المساهمات</Link>
            </div>
          </article>
          <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
            <h2 className="mb-4 font-display text-xl font-extrabold text-[#1D1916]">نسبة التمويل</h2>
            <div className="flex items-center justify-between text-sm font-extrabold text-[#1D1916]">
              <span>الممول</span>
              <span>{funded}</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#efe8e1]">
              <span className="block h-full rounded-full bg-[#A7815E]" style={{ width: funded }} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-md border border-[#eee4dc] p-3"><p className="text-xs font-bold text-[#6E6258]">المتبقي</p><strong className="mt-1 block text-[#1D1916]">{remainingDays}</strong></div>
              <div className="rounded-md border border-[#eee4dc] p-3"><p className="text-xs font-bold text-[#6E6258]">العائد المتوقع</p><strong className="mt-1 block text-[#A7815E]">{expectedReturn}</strong></div>
            </div>
          </article>
        </aside>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <AssetDetailTile label="رأس المال" value={formatSar(contribution.capitalSar)} icon={<CircleDollarSign className="h-5 w-5" />} />
        <AssetDetailTile label="نسبة التمويل" value={funded} icon={<BarChart3 className="h-5 w-5" />} />
        <AssetDetailTile label="مدة الاستثمار" value={`${contribution.durationMonths} شهر`} icon={<CalendarCheck className="h-5 w-5" />} />
        <AssetDetailTile label="عدد المستثمرين" value={`${contribution.investorsCount}`} icon={<Users className="h-5 w-5" />} />
      </section>

      <section className="rounded-lg border border-[#ece1d8] bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
        <h2 className="mb-5 text-right font-display text-xl font-extrabold text-[#1D1916]">مسار المساهمة</h2>
        <div className="grid gap-3 md:grid-cols-7">
          {contribution.timeline.map((step, index) => (
            <div key={step.labelAr} className="grid place-items-center gap-2 text-center">
              <span className={cn("grid h-11 w-11 place-items-center rounded-full border text-sm font-extrabold", step.completed || step.current ? "border-[#A7815E] bg-[#fff3ec] text-[#A7815E]" : "border-[#d8d1ca] bg-white text-[#9b9189]")}>{step.completed ? "✓" : index + 1}</span>
              <span className="text-xs font-extrabold text-[#1D1916]">{step.labelAr}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <AssetFieldList title="بيانات المساهمة" items={[["المدينة", contribution.cityAr], ["مرحلة المساهمة", contribution.stageAr], ["رأس المال", formatSar(contribution.capitalSar)], ["مدة الاستثمار", `${contribution.durationMonths} شهر`], ["العائد المتوقع", expectedReturn], ["الأيام المتبقية", remainingDays]]} />
        <AssetFieldList title="مؤشرات الاستثمار" items={[["عدد المستثمرين", `${contribution.investorsCount} مستثمر`], ["نسبة التمويل", funded], ["رقم الترخيص", contribution.licenseNumber || "غير مضاف"], ["رابط الطرح", contribution.offeringUrl || "غير مضاف"], ["مستوى المخاطر", contribution.risk], ["حالة الإفصاح", documentsResult.data.length ? "مستندات مرفوعة" : "بانتظار المستندات"]]} />
        <DashboardDocumentsPanel title="مستندات المساهمة" documents={documentsResult.data} error={documentsResult.error} emptyLabel="لا توجد مستندات مرفوعة لهذه المساهمة بعد." />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <SmallPanel title="تنبيهات المساهمة" items={contributionAlertItems} action="عرض جميع التنبيهات" actionHref={dashboardHref(config.role, "notifications")} />
        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <h2 className="font-display text-xl font-extrabold text-[#1D1916]">وصف المساهمة</h2>
          <p className="mt-3 text-sm font-bold leading-8 text-[#6E6258]">{contribution.excerptAr} تظهر هذه الصفحة للمستثمر الفردي لمراجعة بيانات المساهمة قبل إضافتها إلى قائمة الاهتمام أو طلب معلومات إضافية.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {contributionTraits.slice(0, 3).map((item) => <span key={item} className="rounded-md border border-[#ece1d8] bg-[#fffaf4] px-3 py-2 text-center text-xs font-extrabold text-[#A7815E]">{item}</span>)}
          </div>
        </article>
        <SmallPanel title="مساهمات مشابهة" items={similarContributions.length ? similarContributions : ["لا توجد مساهمات مشابهة ضمن البيانات الحالية"]} action="استعراض المساهمات" actionHref={dashboardHref(config.role, "browse-contributions")} />
      </section>

      <TrustDigitalStrip />
    </div>
  );
}

function RequestServiceStep({ index, title, subtitle, icon, active = false }: { index: number; title: string; subtitle: string; icon: ReactNode; active?: boolean }) {
  const activeStyle = active ? { backgroundColor: "#A7815E", borderColor: "#A7815E", color: "#ffffff" } : { backgroundColor: "#ffffff", borderColor: "#eadcd2", color: "#1D1916" };
  const badgeStyle = active ? { backgroundColor: "#A7815E", borderColor: "#A7815E", color: "#ffffff" } : { backgroundColor: "#ffffff", borderColor: "#eadcd2", color: "#A7815E" };
  return (
    <div className="grid min-w-0 place-items-center gap-2 text-center">
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border text-lg" style={activeStyle}>{icon}</span>
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-extrabold" style={badgeStyle}>{index}</span>
      <div>
        <p className="text-sm font-extrabold text-[#1D1916]">{title}</p>
        <p className="mt-1 text-xs font-bold text-[#6E6258]">{subtitle}</p>
      </div>
    </div>
  );
}

function ServiceTypeCard({ title, subtitle, icon, href, selected = false }: { title: string; subtitle: string; icon: ReactNode; href: string; selected?: boolean }) {
  return (
    <Link href={href} className={cn("relative min-h-36 rounded-lg border bg-white p-4 text-center shadow-[0_10px_24px_rgb(29_25_22/0.025)]", selected ? "border-[#A7815E]" : "border-[#ece1d8]")}>
      {selected ? <span className="absolute left-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-[#A7815E] text-xs text-white">✓</span> : null}
      <span className="mx-auto grid h-10 w-10 place-items-center text-[#A7815E]">{icon}</span>
      <h3 className="mt-2 text-base font-extrabold text-[#1D1916]">{title}</h3>
      <p className="mt-2 text-xs font-bold leading-6 text-[#6E6258]">{subtitle}</p>
    </Link>
  );
}

const dashboardServiceOptions = [
  { title: "تقييم عقاري", subtitle: "تقييم احترافي لقيمة الأصل الحالية.", icon: <Building2 className="h-8 w-8" />, duration: "3 أيام عمل", amount: 1200 },
  { title: "دراسة جدوى تفصيلية", subtitle: "دراسة متكاملة تشمل جميع الجوانب المالية والفنية.", icon: <FileText className="h-8 w-8" />, duration: "7 أيام عمل", amount: 2500 },
  { title: "دراسة جدوى أولية", subtitle: "دراسة مختصرة لتقييم الفكرة الاستثمارية.", icon: <BarChart3 className="h-8 w-8" />, duration: "4 أيام عمل", amount: 950 },
  { title: "استشارة عقارية أولية", subtitle: "استشارة مهنية حول الفرص والخيارات المتاحة.", icon: <MessageSquare className="h-8 w-8" />, duration: "يوم عمل", amount: 350 },
  { title: "تمويل مساهمة عقارية", subtitle: "حلول تمويلية للمساهمات والمشاريع العقارية.", icon: <CircleDollarSign className="h-8 w-8" />, duration: "10 أيام عمل", amount: 4200 },
  { title: "استشارة هندسية", subtitle: "استشارات هندسية فنية للمشاريع العقارية.", icon: <BriefcaseBusiness className="h-8 w-8" />, duration: "5 أيام عمل", amount: 1800 },
  { title: "تسويق أصل أو مشروع", subtitle: "خدمات تسويق احترافية للوصول للمستثمرين.", icon: <Bell className="h-8 w-8" />, duration: "14 يوم عمل", amount: 6500 },
  { title: "مراجعة عقود قانونية", subtitle: "مراجعة العقود والالتزامات العقارية.", icon: <ShieldCheck className="h-8 w-8" />, duration: "5 أيام عمل", amount: 1600 },
];

function IndividualRequestServicePage({ config, searchParams = {}, actor = null }: { config: DashboardRoleConfig; searchParams?: DashboardSearchParams; actor?: DashboardActorContext | null }) {
  const steps = [
    ["اختيار الخدمة", "اختيار الخدمة العقارية", <Settings2 key="settings" className="h-6 w-6" />],
    ["بيانات الطلب", "بيانات العميل والأصل", <FileText key="file" className="h-6 w-6" />],
    ["مراجعة الطلب", "مراجعة البيانات والتفاصيل", <Search key="search" className="h-6 w-6" />],
    ["الدفع", "إتمام السداد الإلكتروني", <CircleDollarSign key="money" className="h-6 w-6" />],
    ["التنفيذ", "تنفيذ الخدمة وتسليم المخرجات", <CheckCircle2 key="check" className="h-6 w-6" />],
  ] as const;
  const selectedServiceTitle = stringParam(searchParams, "service").trim() || "دراسة جدوى تفصيلية";
  const selectedService = dashboardServiceOptions.find((service) => service.title === selectedServiceTitle) ?? dashboardServiceOptions[1];
  const vatAmount = Math.round(selectedService.amount * 0.15);
  const totalAmount = selectedService.amount + vatAmount;
  const formReference = stableDashboardFormReference(config.role, "service-request", actor, selectedService.title);

  return (
    <div className="grid gap-4">
      <IndividualPageHero
        title="طلب خدمة عقارية"
        subtitle="احصل على خدمات عقارية احترافية من خلال شبكة مزودي الخدمات المعتمدين لدى مهابة."
        image="/images/asset-commercial-complex.png"
        action={{ label: "استعراض طلباتي السابقة", href: dashboardHref(config.role, "my-requests") }}
      />

      <section className="rounded-lg border border-[#ece1d8] bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
        <div dir="rtl" className="grid gap-5 md:grid-cols-5">
          {steps.map(([title, subtitle, icon], index) => <RequestServiceStep key={title} index={index + 1} title={title} subtitle={subtitle} icon={icon} active={index === 0} />)}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <h2 className="font-display text-lg font-extrabold text-[#1D1916]">حالة الطلب</h2>
          <p className="mt-3 rounded-md bg-[#e8f7ec] px-4 py-3 text-sm font-extrabold text-[#087342]">اختيار الخدمة</p>
          <p className="mt-2 text-xs font-bold leading-6 text-[#6E6258]">يمكنك متابعة الطلب والانتقال لمرحلة الدفع بعد استكمال البيانات.</p>
        </article>
        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)] xl:col-span-2">
          <h2 className="mb-4 font-display text-lg font-extrabold text-[#1D1916]">ملخص سريع</h2>
          <div className="grid gap-3 text-center md:grid-cols-3">
            <div className="rounded-md border border-[#eee4dc] p-3"><p className="text-xs font-bold text-[#6E6258]">الخدمة</p><strong className="mt-1 block text-[#1D1916]">{selectedService.title}</strong></div>
            <div className="rounded-md border border-[#eee4dc] p-3"><p className="text-xs font-bold text-[#6E6258]">المدة</p><strong className="mt-1 block text-[#1D1916]">{selectedService.duration}</strong></div>
            <div className="rounded-md border border-[#eee4dc] p-3"><p className="text-xs font-bold text-[#6E6258]">الإجمالي</p><strong className="mt-1 block text-[#A7815E]">{formatSar(totalAmount).replace(" سعودي", "")}</strong></div>
          </div>
        </article>
      </section>

      <SectionBox title="اختر نوع الخدمة" icon={<Settings2 className="h-5 w-5" />}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {dashboardServiceOptions.map((service) => (
            <ServiceTypeCard
              key={service.title}
              title={service.title}
              subtitle={service.subtitle}
              icon={service.icon}
              href={dashboardHref(config.role, `request-service?service=${encodeURIComponent(service.title)}`)}
              selected={service.title === selectedService.title}
            />
          ))}
        </div>
      </SectionBox>

      <form className="grid gap-4 xl:grid-cols-12">
        <input type="hidden" name="sourcePath" value={`${config.role}-request-service`} />
        <input type="hidden" name="formReference" value={formReference} />
        <input type="hidden" name="title" value={selectedService.title} />
        <input type="hidden" name="serviceType" value={selectedService.title} />
        <input type="hidden" name="selectedService" value={selectedService.title} />
        <input type="hidden" name="amount" value={String(totalAmount)} />
        <input type="hidden" name="duration" value={selectedService.duration} />
        <input type="hidden" name="vatAmount" value={String(vatAmount)} />
        <main className="grid gap-4 xl:col-span-8">
          <SectionBox title="بيانات الطلب" icon={<FileText className="h-5 w-5" />}>
            <div className="grid gap-3 md:grid-cols-3">
              <Field name="contactName" label="الاسم الكامل" placeholder="أدخل الاسم الكامل" />
              <Field name="mobile" label="رقم الجوال" placeholder="05xxxxxxxx" />
              <Field name="email" label="البريد الإلكتروني" placeholder="example@domain.com" type="email" />
              <Field name="organizationName" label="اسم المنشأة (اختياري)" placeholder="أدخل اسم المنشأة" />
              <Field name="commercialRegistration" label="رقم السجل التجاري (اختياري)" placeholder="أدخل رقم السجل التجاري" />
            </div>
          </SectionBox>
          <SectionBox title="بيانات الأصل" icon={<MapPin className="h-5 w-5" />}>
            <div className="grid gap-3 md:grid-cols-3">
              <Field name="city" label="المدينة" placeholder="اختر المدينة" />
              <Field name="assetType" label="نوع الأصل" placeholder="اختر نوع الأصل" />
              <Field name="areaSqm" label="المساحة (م2)" placeholder="أدخل المساحة" type="number" />
              <Field name="assetDescription" label="وصف الأصل" placeholder="اكتب وصفاً تفصيلياً عن الأصل العقاري والغرض من الخدمة المطلوبة" textarea />
            </div>
          </SectionBox>
          <SectionBox title="تفاصيل الخدمة" icon={<Settings2 className="h-5 w-5" />}>
            <div className="grid gap-3">
              <Field name="description" label="وصف الطلب" placeholder="اكتب تفاصيل طلبك ومتطلبات الخدمة المطلوبة" textarea />
              <UploadBox label="رفع المرفقات الاختيارية" entityId={formReference} scope={config.role === "business" ? "business" : "individual"} />
            </div>
          </SectionBox>
        </main>

        <aside className="grid gap-4 content-start xl:col-span-4">
          <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
            <h2 className="mb-4 font-display text-xl font-extrabold text-[#1D1916]">ملخص الطلب</h2>
            {[
              ["الخدمة المختارة", selectedService.title],
              ["مدة التنفيذ", selectedService.duration],
              ["السعر الأساسي", formatSar(selectedService.amount).replace(" سعودي", "")],
              ["ضريبة القيمة المضافة", formatSar(vatAmount).replace(" سعودي", "")],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border-b border-[#eee4dc] py-3 text-sm font-bold">
                <span className="text-[#6E6258]">{label}</span>
                <strong className="text-[#1D1916]">{value}</strong>
              </div>
            ))}
            <div className="flex items-center justify-between pt-4 font-display text-xl font-extrabold">
              <span className="text-[#1D1916]">الإجمالي</span>
              <span className="text-[#A7815E]">{formatSar(totalAmount).replace(" سعودي", "")}</span>
            </div>
          </article>
          <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
            <h2 className="mb-4 font-display text-lg font-extrabold text-[#1D1916]">وسائل الدفع</h2>
            <div className="grid grid-cols-4 gap-2">
              {["مدى", "Visa", "Mastercard", "Apple Pay"].map((item, index) => (
                <label key={item} className="grid min-h-14 cursor-pointer place-items-center rounded-md border border-[#ece1d8] bg-white text-center text-xs font-extrabold text-[#1D1916] has-[:checked]:border-[#A7815E] has-[:checked]:bg-[#fff3ec]">
                  <input name="paymentMethod" value={item} type="radio" defaultChecked={index === 0} className="sr-only" />
                  {item}
                </label>
              ))}
            </div>
            <DashboardRequestFormSubmitButton
              kind="service_request"
              scope={config.role === "business" ? "business" : "individual"}
              mode="submitted"
              className="mt-4 min-h-12 w-full rounded-md bg-[#A7815E] text-sm font-extrabold text-white"
            >
              إتمام الدفع
            </DashboardRequestFormSubmitButton>
            <p className="mt-2 text-center text-[11px] font-bold text-[#6E6258]">بالضغط على إتمام الدفع، أنت توافق على الشروط والأحكام.</p>
          </article>
          <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
            <h2 className="mb-3 font-display text-lg font-extrabold text-[#1D1916]">الأسئلة الشائعة</h2>
            {["كيف يتم تنفيذ الخدمة؟", "كم يستغرق التنفيذ؟", "كيف أتابع طلب الخدمة؟", "هل يمكن إلغاء الطلب؟"].map((item) => (
              <Link key={item} href={dashboardHref(config.role, `support?topic=${encodeURIComponent(item)}`)} className="flex w-full items-center justify-between border-b border-[#eee4dc] py-2 text-sm font-bold text-[#1D1916] last:border-b-0">
                <span>{item}</span>
                <span>+</span>
              </Link>
            ))}
          </article>
        </aside>
      </form>

      <section className="grid gap-3 md:grid-cols-4">
        <IndividualKpiCard title="الحوكمة" value="موثقة" unit="تحت معايير واضحة" icon="shield" />
        <IndividualKpiCard title="الشفافية" value="كاملة" unit="في العمليات والتقارير" icon="target" />
        <IndividualKpiCard title="الامتثال" value="معتمد" unit="وفق اللوائح المحلية" icon="file" />
        <IndividualKpiCard title="شبكة مزودي خدمات" value="45+" unit="مزود خدمة" icon="users" />
      </section>
      <TrustDigitalStrip />
    </div>
  );
}

const individualServiceRequests = [
  { id: "SRV-2026-001", title: "دراسة جدوى تفصيلية", asset: "أرض سكنية شمال الرياض", status: "قيد التنفيذ", tone: "blue" as TrendTone, provider: "مكتب الرؤية للاستشارات", date: "12/06/2026", amount: "2,875 ريال", progress: 64, due: "19/06/2026", icon: FileSearch },
  { id: "SRV-2026-002", title: "تقييم عقاري", asset: "مبنى الريان التجاري", status: "بانتظار الدفع", tone: "gold" as TrendTone, provider: "شركة معيار للتقييم", date: "10/06/2026", amount: "1,725 ريال", progress: 32, due: "18/06/2026", icon: BadgeCheck },
  { id: "SRV-2026-003", title: "استشارة هندسية", asset: "مجمع الربيع الإداري", status: "مكتمل", tone: "green" as TrendTone, provider: "مكتب أبعاد الهندسي", date: "06/06/2026", amount: "3,450 ريال", progress: 100, due: "14/06/2026", icon: BriefcaseBusiness },
  { id: "SRV-2026-004", title: "مراجعة عقود قانونية", asset: "أرض النخيل", status: "بحاجة إجراء", tone: "red" as TrendTone, provider: "مكتب العدل القانوني", date: "02/06/2026", amount: "2,300 ريال", progress: 48, due: "16/06/2026", icon: ShieldCheck },
];

type IndividualServiceRequestCardItem = {
  id: string;
  title: string;
  asset: string;
  status: string;
  tone: TrendTone;
  provider: string;
  date: string;
  amount: string;
  progress: number;
  due: string;
  icon: LucideIcon;
  description: string;
  reviewNote?: string | null;
  reviewDecision?: string | null;
  reviewAt?: string | null;
};

function individualServiceRequestFallbackRows(): IndividualServiceRequestCardItem[] {
  return individualServiceRequests.map((request) => ({ ...request, description: "طلب خدمة عقارية مرتبط بحساب الأفراد." }));
}

function mapDashboardServiceRequestToIndividualCard(row: DashboardAdminServiceRequest): IndividualServiceRequestCardItem {
  return {
    id: row.id,
    title: row.title,
    asset: row.assetType || "أصل عقاري",
    status: serviceStatusLabel(row.status),
    tone: serviceStatusTone(row.status),
    provider: row.provider,
    date: formatDashboardDate(row.submittedAt),
    amount: formatSar(row.price),
    progress: row.status === "completed" ? 100 : row.status === "assigned" ? 62 : row.status === "urgent" ? 35 : row.status === "needs_changes" ? 24 : 18,
    due: row.dueAt ? formatDashboardDate(row.dueAt) : "غير محدد",
    icon: row.status === "completed" ? BadgeCheck : row.status === "urgent" || row.status === "needs_changes" ? ShieldCheck : row.status === "assigned" ? BriefcaseBusiness : FileSearch,
    description: row.description,
    reviewNote: row.latestReviewNote,
    reviewDecision: row.latestReviewDecision,
    reviewAt: row.latestReviewAt,
  };
}

function ServiceRequestCard({ request }: { request: IndividualServiceRequestCardItem }) {
  const RequestIcon = request.icon;
  return (
    <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
      <div className="flex items-start justify-between gap-4">
        <StatusPill label={request.status} tone={request.tone} />
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[#f5eee7] text-[#A7815E]"><RequestIcon className="h-6 w-6" /></span>
      </div>
      <h3 className="mt-4 font-display text-2xl font-extrabold text-[#1D1916]">{request.title}</h3>
      <p className="mt-1 text-sm font-bold text-[#6E6258]">{request.id}</p>
      {request.reviewNote ? (
        <div className="mt-4 rounded-md border border-[#F0D8B8] bg-[#fff7ec] p-3 text-xs font-extrabold leading-6 text-[#8F6B4C]">
          ملاحظة المراجعة: {request.reviewNote}
        </div>
      ) : null}
      <div className="mt-4 grid gap-2 text-sm font-bold text-[#1D1916]">
        <DetailRow label="الأصل المرتبط" value={request.asset} />
        <DetailRow label="مزود الخدمة" value={request.provider} />
        <DetailRow label="تاريخ الطلب" value={request.date} />
        <DetailRow label="المبلغ" value={request.amount} />
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs font-extrabold text-[#1D1916]">
          <span>نسبة الإنجاز</span>
          <span>{request.progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#efe8e1]">
          <span className="block h-full rounded-full bg-[#A7815E]" style={{ width: `${request.progress}%` }} />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        <Link href={dashboardHref("individual", `service-details?request=${encodeURIComponent(request.id)}`)} className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#B89A7A] bg-white px-3 text-xs font-extrabold text-[#A7815E]">عرض التفاصيل</Link>
        <Link href={dashboardHref("individual", "messages")} className="grid min-h-10 place-items-center rounded-md border border-[#ece1d8] bg-white px-3 text-xs font-extrabold text-[#1D1916]">رسالة المزود</Link>
        <FinancialExportButton filename={`${request.id}-service.csv`} rows={[{ id: request.id, title: request.title, status: request.status, provider: request.provider, amount: request.amount }]} className="inline-flex min-h-10 items-center justify-center gap-1 rounded-md border border-[#ece1d8] bg-white px-3 text-xs font-extrabold text-[#1D1916]">تحميل</FinancialExportButton>
      </div>
    </article>
  );
}

async function IndividualMyRequestsPage({ config, actor = null, searchParams = {} }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null; searchParams?: DashboardSearchParams }) {
  const result = await listDashboardServiceRequestsForScope("individual", actor);
  const requestDocumentResults = await Promise.all(
    result.data.map((row) =>
      listDashboardDocumentsForEntity({
        scope: "individual",
        entityId: row.id,
        entityRef: row.id,
        entityTypes: ["service_request_document", "service_request_delivery", "service_request"],
        actor,
      }),
    ),
  );
  const q = stringParam(searchParams, "q").trim();
  const activeStatus = stringParam(searchParams, "status").trim();
  const allRequests = result.data.length ? result.data.map((row) => mapDashboardServiceRequestToIndividualCard(row)) : individualServiceRequestFallbackRows();
  const requests = allRequests.filter((request) => matchesDashboardSearch(q, [request.id, request.title, request.asset, request.provider, request.status, request.amount]) && matchesDashboardStatus(request.status, activeStatus));
  const pagination = paginateDashboardRows(requests, searchParams, 8);
  const activeCount = result.data.filter((row) => row.status === "assigned").length;
  const completedCount = result.data.filter((row) => row.status === "completed").length;
  const urgentCount = result.data.filter((row) => row.status === "urgent").length;
  const actionItems = allRequests
    .filter((request) => request.tone === "red" || request.reviewNote || request.progress < 35)
    .slice(0, 3)
    .map((request) => request.reviewNote ? `${request.title}: ${request.reviewNote}` : `${request.title} بحاجة متابعة`);
  const deliveryItems = allRequests
    .filter((request) => request.progress >= 80 || request.status === "مكتمل")
    .slice(0, 3)
    .map((request) => `${request.title} - ${request.provider}`);
  const activityItems = allRequests
    .slice(0, 3)
    .map((request) => `تم تحديث ${request.title} إلى ${request.status} بتاريخ ${request.date}`);
  const requestDocumentCount = requestDocumentResults.reduce((sum, item) => sum + item.data.length, 0);
  const requestDurations = result.data
    .map((row) => {
      const start = new Date(row.submittedAt).getTime();
      const end = new Date(row.dueAt).getTime();
      if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return null;
      return Math.ceil((end - start) / 86_400_000);
    })
    .filter((value): value is number => typeof value === "number");
  const averageDurationDays = requestDurations.length ? Math.round(requestDurations.reduce((sum, days) => sum + days, 0) / requestDurations.length) : 0;
  return (
    <div className="grid gap-4">
      <IndividualPageHero
        title="طلباتي"
        subtitle="متابعة طلبات الخدمات العقارية، حالات التنفيذ، المدفوعات، والتسليمات من مكان واحد."
        image="/images/asset-commercial-complex.png"
        action={{ label: "طلب خدمة عقارية", href: dashboardHref(config.role, "request-service") }}
      />
      {result.error ? <section className="rounded-lg border border-[#F0D8B8] bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل طلبات الخدمات الحية من Supabase، وتم عرض بيانات احتياطية.</section> : null}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <IndividualKpiCard title="إجمالي الطلبات" value={String(allRequests.length)} unit="طلب" icon="file-text" />
        <IndividualKpiCard title="قيد التنفيذ" value={String(activeCount)} unit="طلبات" icon="settings" tone="blue" />
        <IndividualKpiCard title="مكتملة" value={String(completedCount)} unit="طلبات" icon="shield" tone="green" />
        <IndividualKpiCard title="بحاجة إجراء" value={String(urgentCount)} unit="طلبات" icon="bell" tone="red" />
      </section>

      <section className="rounded-lg border border-[#ece1d8] bg-white p-4 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
        <form action={dashboardHref(config.role, "my-requests")} className="grid gap-3 lg:grid-cols-6">
          {activeStatus ? <input type="hidden" name="status" value={activeStatus} /> : null}
          <label className="relative block lg:col-span-2">
            <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1D1916]" />
            <input name="q" defaultValue={q} className="h-12 w-full rounded-md border border-[#ece1d8] bg-white pl-16 pr-12 text-sm font-bold outline-none focus:border-[#A7815E]" placeholder="ابحث برقم الطلب أو اسم الخدمة" />
            <button type="submit" className="absolute left-2 top-1/2 h-8 -translate-y-1/2 rounded bg-[#1D1916] px-3 text-xs font-extrabold text-white">بحث</button>
          </label>
          <FilterBox label="كل الطلبات" href={dashboardHref(config.role, "my-requests")} />
          <FilterBox label="قيد التنفيذ" href={dashboardHref(config.role, `my-requests?status=assigned${q ? `&q=${encodeURIComponent(q)}` : ""}`)} />
          <FilterBox label="مكتملة" href={dashboardHref(config.role, `my-requests?status=completed${q ? `&q=${encodeURIComponent(q)}` : ""}`)} />
          <Link href={dashboardHref(config.role, "my-requests")} className="flex h-12 items-center justify-center gap-2 rounded-md border border-[#ece1d8] bg-white px-4 text-sm font-extrabold text-[#1D1916]">
            <RefreshCcw className="h-4 w-4" />
            إعادة تعيين
          </Link>
        </form>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {requests.length ? pagination.rows.map((request) => <ServiceRequestCard key={request.id} request={request} />) : <div className="rounded-lg border border-[#ece1d8] bg-white p-8 text-center text-sm font-extrabold text-[#6E6258] xl:col-span-4">لا توجد طلبات مطابقة للبحث أو الفلتر الحالي.</div>}
      </section>
      <DashboardPaginationControls role={config.role} path="my-requests" page={pagination.page} totalPages={pagination.totalPages} params={{ q, status: activeStatus }} />

      <section className="grid gap-4 xl:grid-cols-3">
        <SmallPanel title="طلبات تحتاج إجراء" items={actionItems.length ? actionItems : ["لا توجد طلبات تحتاج إجراء حالياً"]} action="عرض جميع الإجراءات" actionHref={dashboardHref(config.role, "my-requests?status=urgent")} />
        <SmallPanel title="آخر التسليمات" items={deliveryItems.length ? deliveryItems : ["لا توجد تسليمات مكتملة حالياً"]} action="عرض الملفات" actionHref={dashboardHref(config.role, "my-requests?status=completed")} />
        <SmallPanel title="النشاط الأخير" items={activityItems.length ? activityItems : ["لا يوجد نشاط خدمات حديث"]} action="عرض جميع الأنشطة" actionHref={dashboardHref(config.role, "notifications")} />
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        <IndividualKpiCard title="إجمالي المدفوع" value={formatSar(result.data.reduce((sum, row) => sum + row.price, 0)).replace(" ريال سعودي", "")} unit="ريال" icon="circle-dollar" />
        <IndividualKpiCard title="متوسط مدة التنفيذ" value={String(averageDurationDays)} unit="أيام" icon="clock" />
        <IndividualKpiCard title="المرفقات" value={String(requestDocumentCount)} unit="مستند" icon="file" />
        <IndividualKpiCard title="مزودو الخدمة" value={String(new Set(requests.map((request) => request.provider)).size)} unit="مزودين" icon="users" />
      </section>
      <TrustDigitalStrip />
    </div>
  );
}

async function IndividualServiceDetailsPage({ config, actor = null, searchParams = {} }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null; searchParams?: DashboardSearchParams }) {
  const result = await listDashboardServiceRequestsForScope("individual", actor);
  const selectedRequest = result.source === "supabase" ? selectEntityByParam(result.data, searchParams, "request", "id") : undefined;

  if (!selectedRequest) {
    return (
      <div className="grid gap-4">
        <IndividualPageHero
          title="تفاصيل الطلب"
          subtitle="لا يوجد طلب خدمة عقارية متصل بقاعدة البيانات لعرض تفاصيله حالياً."
          image="/images/asset-commercial-complex.png"
          action={{ label: "طلب خدمة عقارية", href: dashboardHref(config.role, "request-service") }}
        />
        {result.error ? <section className="rounded-lg border border-[#F0D8B8] bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل تفاصيل الطلب من Supabase: {result.error}</section> : null}
        <section className="rounded-lg border border-[#ece1d8] bg-white p-8 text-center text-sm font-extrabold text-[#6E6258] shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          أنشئ طلب خدمة عقارية جديد أو عد إلى قائمة طلباتك. لا يتم عرض أزرار رفع المستندات إلا بعد وجود طلب فعلي في قاعدة البيانات.
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href={dashboardHref(config.role, "request-service")} className="grid min-h-11 place-items-center rounded-md bg-[#A7815E] px-5 text-sm font-extrabold text-white">طلب خدمة عقارية</Link>
            <Link href={dashboardHref(config.role, "my-requests")} className="grid min-h-11 place-items-center rounded-md border border-[#B89A7A] bg-white px-5 text-sm font-extrabold text-[#A7815E]">عرض طلباتي</Link>
          </div>
        </section>
      </div>
    );
  }

  const request = mapDashboardServiceRequestToIndividualCard(selectedRequest);
  const documentsResult = await listDashboardDocumentsForEntity({
    scope: "individual",
    entityId: selectedRequest.id,
    entityTypes: ["service_request_document", "individual_service_request_request"],
    actor,
  });
  const financial = await listDashboardFinancial("individual", actor);
  const messagesResult = await listDashboardMessages("individual", undefined, actor);
  const serviceCatalogResult = await getServices();
  const serviceCatalog = serviceCatalogResult.data;
  const serviceInvoice = financial.invoices.find((invoice) => matchesDashboardSearch(selectedRequest.id, [invoice.invoiceNumber, invoice.title]) || matchesDashboardSearch(selectedRequest.title, [invoice.title]));
  const servicePayment = financial.payments.find((payment) => payment.invoiceId === serviceInvoice?.id || payment.invoiceNumber === serviceInvoice?.invoiceNumber || matchesDashboardSearch(selectedRequest.title, [payment.title]));
  const providerMessages = messagesResult.data
    .filter((message) => !message.mine)
    .slice(-3)
    .map((message) => `${message.body} - ${formatDashboardDateTime(message.createdAt)}`);
  const paymentFacts: [string, string][] = [
    ["رسوم الخدمة", serviceInvoice ? formatSar(serviceInvoice.amount / 1.15) : request.amount],
    ["ضريبة القيمة المضافة", serviceInvoice ? formatSar(serviceInvoice.amount - serviceInvoice.amount / 1.15) : "غير محددة"],
    ["الإجمالي", serviceInvoice ? formatSar(serviceInvoice.amount) : request.amount],
    ["طريقة الدفع", servicePayment ? paymentMethodLabel(servicePayment.method) : "بانتظار السداد"],
    ["حالة السداد", serviceInvoice?.statusLabel ?? (selectedRequest.price > 0 ? "بانتظار السداد" : "لا توجد فاتورة")],
    ["رقم الفاتورة", serviceInvoice?.invoiceNumber ?? "غير صادر"],
  ];
  const serviceSummaryBadges = [
    selectedRequest.status === "completed" ? "مكتمل" : selectedRequest.status === "assigned" ? "قيد التنفيذ" : "قيد المراجعة",
    serviceInvoice?.status === "paid" || servicePayment?.status === "succeeded" ? "دفع مكتمل" : "بانتظار السداد",
    documentsResult.data.length ? `${documentsResult.data.length} مرفقات` : "لا توجد مرفقات",
  ];
  const service = serviceCatalog.find((item) => item.titleAr === request.title) ?? serviceCatalog[0] ?? realEstateServices[3]!;
  const RequestIcon = request.icon;
  const serviceSteps = [
    ["استلام الطلب", true],
    ["تعيين المزود", selectedRequest.status === "assigned" || selectedRequest.status === "completed"],
    ["مراجعة البيانات", selectedRequest.status === "assigned" || selectedRequest.status === "completed" || selectedRequest.status === "needs_changes"],
    ["إعداد التقرير", selectedRequest.status === "assigned" || selectedRequest.status === "completed"],
    ["التسليم النهائي", selectedRequest.status === "completed"],
  ] as const;

  return (
    <div className="grid gap-4">
      <IndividualPageHero
        title="تفاصيل الطلب"
        subtitle="عرض حالة طلب الخدمة العقارية، بيانات المزود، المدفوعات، المرفقات، وسجل التنفيذ."
        image="/images/asset-commercial-complex.png"
        action={{ label: "العودة إلى طلباتي", href: dashboardHref(config.role, "my-requests") }}
      />
      {result.error ? <section className="rounded-lg border border-[#F0D8B8] bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل تفاصيل الطلب الحية من Supabase، وتم عرض بيانات احتياطية.</section> : null}

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <div className="flex items-start justify-between gap-4">
            <StatusPill label={request.status} tone={request.tone} />
            <span className="grid h-14 w-14 place-items-center rounded-full bg-[#f5eee7] text-[#A7815E]"><RequestIcon className="h-7 w-7" /></span>
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-[#1D1916]">{request.title}</h2>
          <p className="mt-2 text-sm font-bold leading-7 text-[#6E6258]">{request.description || service.descriptionAr}</p>
          {request.reviewNote ? (
            <div className="mt-5 rounded-md border border-[#F0D8B8] bg-[#fff7ec] p-4 text-sm font-extrabold leading-7 text-[#8F6B4C]">
              <p>ملاحظة الإدارة: {request.reviewNote}</p>
              {request.reviewAt ? <p className="mt-1 text-xs text-[#6E6258]">آخر مراجعة: {formatDashboardDate(request.reviewAt)}</p> : null}
            </div>
          ) : null}
          <div className="mt-5 grid gap-2">
            <DetailRow label="رقم الطلب" value={request.id} />
            <DetailRow label="الأصل المرتبط" value={request.asset} />
            <DetailRow label="تاريخ الطلب" value={request.date} />
            <DetailRow label="الموعد المتوقع" value={request.due} />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <Link href={dashboardHref(config.role, "messages")} className="grid min-h-11 place-items-center rounded-md bg-[#A7815E] px-4 text-sm font-extrabold text-white">رسالة المزود</Link>
            <DashboardDocumentUploadButton scope={config.role === "business" ? "business" : "individual"} entityType="service_request_document" entityId={request.id} label={request.id} className="grid min-h-11 cursor-pointer place-items-center rounded-md border border-[#B89A7A] bg-white px-4 text-sm font-extrabold text-[#A7815E]">رفع مستند</DashboardDocumentUploadButton>
            <Link href={dashboardHref(config.role, "my-requests")} className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#ece1d8] bg-white px-4 text-sm font-extrabold text-[#1D1916]">طلباتي</Link>
          </div>
        </article>

        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <h2 className="mb-4 font-display text-xl font-extrabold text-[#1D1916]">تقدم التنفيذ</h2>
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between text-sm font-extrabold text-[#1D1916]">
              <span>نسبة الإنجاز</span>
              <span>{request.progress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[#efe8e1]">
              <span className="block h-full rounded-full bg-[#A7815E]" style={{ width: `${request.progress}%` }} />
            </div>
          </div>
          <div className="grid gap-2">
            {serviceSteps.map(([step, done], index) => (
              <div key={step} className="flex items-center gap-3 border-b border-[#eee4dc] py-3 last:border-b-0">
                <span className={cn("grid h-8 w-8 place-items-center rounded-full border text-xs font-extrabold", done ? "border-[#087342] bg-[#e9f7ef] text-[#087342]" : "border-[#d8d1ca] bg-white text-[#9b9189]")}>{done ? "✓" : index + 1}</span>
                <span className="text-sm font-bold text-[#1D1916]">{step}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <AssetDetailTile label="قيمة الطلب" value={request.amount} icon={<CircleDollarSign className="h-5 w-5" />} />
        <AssetDetailTile label="مدة الخدمة" value={service.durationAr} icon={<CalendarCheck className="h-5 w-5" />} />
        <AssetDetailTile label="مستوى الخدمة" value={service.levelAr} icon={<ShieldCheck className="h-5 w-5" />} />
        <AssetDetailTile label="المخرجات" value={service.outputsAr} icon={<FileText className="h-5 w-5" />} />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <AssetFieldList title="بيانات الطلب" items={[["الخدمة", request.title], ["مزود الخدمة", request.provider], ["الأصل", request.asset], ["حالة الطلب", request.status], ["تاريخ البداية", request.date], ["تاريخ التسليم", request.due]]} />
        <AssetFieldList title="المدفوعات" items={paymentFacts} />
        <DashboardDocumentsPanel title="المرفقات والتسليمات" documents={documentsResult.data} error={documentsResult.error} emptyLabel="لا توجد مرفقات مرتبطة بهذا الطلب بعد." />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <SmallPanel title="رسائل المزود" items={providerMessages.length ? providerMessages : ["لا توجد رسائل مزود مرتبطة بالحساب بعد"]} action="فتح الرسائل" actionHref={dashboardHref(config.role, "messages")} />
        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <h2 className="font-display text-xl font-extrabold text-[#1D1916]">ملخص الخدمة</h2>
          <p className="mt-3 text-sm font-bold leading-8 text-[#6E6258]">{request.description || `${request.title} مرتبط بـ ${request.asset} ويتم تنفيذه عبر ${request.provider}.`}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {serviceSummaryBadges.map((item) => <span key={item} className="rounded-md border border-[#ece1d8] bg-[#fffaf4] px-3 py-2 text-center text-xs font-extrabold text-[#A7815E]">{item}</span>)}
          </div>
        </article>
        <SmallPanel title="طلبات مشابهة" items={serviceCatalog.filter((item) => item.titleAr !== request.title).slice(0, 3).map((item) => item.titleAr)} action="طلب خدمة جديدة" actionHref={dashboardHref(config.role, "request-service")} />
      </section>

      <TrustDigitalStrip />
    </div>
  );
}

function documentSizeLabel(size?: number | null) {
  if (!size || size <= 0) return "حجم غير محدد";
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function DashboardDocumentsPanel({ title, documents, error, emptyLabel }: { title: string; documents: DashboardDocumentRow[]; error?: string; emptyLabel: string }) {
  return (
    <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
      <h2 className="mb-4 font-display text-xl font-extrabold text-[#1D1916]">{title}</h2>
      {error ? <p className="mb-3 rounded-md border border-[#F0D8B8] bg-[#fff7ec] p-3 text-xs font-extrabold text-[#8F6B4C]">تعذر تحميل المستندات الحية من Supabase.</p> : null}
      {documents.length === 0 ? (
        <p className="rounded-md border border-[#eee4dc] bg-[#fffdf9] p-4 text-sm font-bold text-[#6E6258]">{emptyLabel}</p>
      ) : documents.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between gap-4 border-b border-[#eee4dc] py-3 last:border-b-0">
          <div className="min-w-0">
            <span className="block truncate text-sm font-bold text-[#1D1916]">{doc.fileName}</span>
            <span className="mt-1 block text-xs font-bold text-[#6E6258]">{formatDashboardDate(doc.createdAt)}</span>
          </div>
          <span className="shrink-0 text-xs font-extrabold text-[#A7815E]">{documentSizeLabel(doc.sizeBytes)}</span>
        </div>
      ))}
    </article>
  );
}

function DetailRow({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#eee4dc] py-2.5 text-sm font-bold last:border-b-0">
      <span className="flex items-center gap-2 text-[#6E6258]">
        {icon ? <span className="text-[#A7815E]">{icon}</span> : null}
        {label}
      </span>
      <strong className="text-left text-[#1D1916]">{value}</strong>
    </div>
  );
}

function ToggleRow({ label, description, name, defaultChecked = true }: { label: string; description?: string; name?: string; defaultChecked?: boolean }) {
  const fieldName = name ?? label;
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 border-b border-[#eee4dc] py-2.5 last:border-b-0">
      <div className="text-right">
        <p className="text-sm font-extrabold text-[#1D1916]">{label}</p>
        {description ? <p className="mt-1 text-xs font-bold text-[#6E6258]">{description}</p> : null}
      </div>
      <input name={fieldName} type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative h-6 w-11 rounded-full bg-[#D9D1C7] transition peer-checked:bg-[#A7815E]">
        <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:right-6" />
      </span>
    </label>
  );
}

function IconTile({ title, subtitle, icon }: { title: string; subtitle: string; icon: ReactNode }) {
  return (
    <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-center shadow-[0_10px_24px_rgb(29_25_22/0.025)]">
      <span className="mx-auto grid h-11 w-11 place-items-center text-[#A7815E]">{icon}</span>
      <h3 className="mt-3 text-base font-extrabold text-[#1D1916]">{title}</h3>
      <p className="mt-2 text-xs font-bold leading-6 text-[#6E6258]">{subtitle}</p>
    </article>
  );
}

function ActivityList({ title, items }: { title: string; items: Array<[string, string, ReactNode]> }) {
  return (
    <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
      <h2 className="mb-4 font-display text-xl font-extrabold text-[#1D1916]">{title}</h2>
      <div className="grid gap-1">
        {items.map(([main, meta, icon]) => (
          <div key={`${title}-${main}`} className="flex items-center justify-between gap-4 border-b border-[#eee4dc] py-2.5 last:border-b-0">
            <span className="text-sm font-extrabold text-[#1D1916]">{main}<small className="mt-1 block text-xs font-bold text-[#6E6258]">{meta}</small></span>
            <span className="text-[#A7815E]">{icon}</span>
          </div>
        ))}
      </div>
      <Link href={`?activity=${encodeURIComponent(title)}`} className="mt-4 inline-flex text-sm font-extrabold text-[#1D1916]">عرض جميع الأنشطة ←</Link>
    </article>
  );
}

async function IndividualProfilePage({ config, actor = null }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null }) {
  const [profileResult, notificationsResult, auditLogsResult] = await Promise.all([
    getDashboardIndividualProfile(actor),
    listDashboardNotifications("individual", actor),
    listDashboardAdminAuditLogs("activity"),
  ]);
  const profile = profileResult.data;
  const verified = profile.verificationStatus === "approved";
  const verificationLabel = verified ? "موثق" : profile.verificationStatus === "submitted" || profile.verificationStatus === "in_review" ? "قيد المراجعة" : profile.verificationStatus === "needs_changes" ? "يحتاج تحديث" : "قيد الإعداد";
  const lastProfileUpdate = profile.updatedAt ?? profile.createdAt;
  const profileActivityItems: Array<[string, string, ReactNode]> = [
    ...notificationsResult.data.slice(0, 2).map((notification) => [notification.title, formatDashboardDateTime(notification.createdAt), <Bell key={`notification-${notification.id}`} className="h-5 w-5" />] as [string, string, ReactNode]),
    ...auditLogsResult.data.slice(0, 2).map((log) => [log.event, formatDashboardDateTime(log.time), <CheckCircle2 key={`audit-${log.id}`} className="h-5 w-5" />] as [string, string, ReactNode]),
  ].slice(0, 4);
  if (profileActivityItems.length === 0) {
    profileActivityItems.push(["تحديث بيانات الحساب", formatDashboardDateTime(lastProfileUpdate), <CheckCircle2 key="profile-fallback" className="h-5 w-5" />]);
  }

  return (
    <div className="grid gap-4" data-dashboard-form>
      <IndividualPageHero
        title="بيانات الحساب"
        subtitle="إدارة معلومات حسابك وتحديث بياناتك الشخصية وتفضيلاتك العقارية."
        image="/images/dashboard-individual-hero.png"
        actionNode={
          <SaveAccountSettingsButton
            scope={config.role === "business" ? "business" : "individual"}
            kind="profile"
            payload={{ source: "profile-hero-save" }}
            className="inline-flex min-h-11 min-w-48 items-center justify-center gap-3 rounded-md bg-[#A7815E] px-6 text-sm font-extrabold text-white shadow-[0_12px_22px_rgb(167_129_94/0.22)]"
          >
            حفظ التغييرات
          </SaveAccountSettingsButton>
        }
      />

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <h2 className="mb-5 font-display text-xl font-extrabold text-[#1D1916]">الملف الشخصي</h2>
          <div className="grid gap-5 md:grid-cols-[170px_1fr]">
            <div className="grid justify-items-center text-center">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border" style={{ backgroundColor: "#fff4ee", borderColor: "#e2b69d" }}>
                <span className="absolute left-1/2 top-7 z-10 block h-9 w-9 -translate-x-1/2 rounded-full" style={{ backgroundColor: "#B89A7A" }} />
                <span className="absolute bottom-5 left-1/2 block h-16 w-20 -translate-x-1/2 rounded-t-full" style={{ backgroundColor: "#B89A7A" }} />
                <span className="absolute bottom-2 left-2 grid h-8 w-8 place-items-center rounded-full border border-[#B89A7A] bg-white text-[#A7815E]"><PenLine className="h-4 w-4" /></span>
              </div>
              <DashboardDocumentUploadButton scope="individual" entityType="profile_avatar" entityId={profile.id} label="الصورة الشخصية" className="mt-4 grid min-h-10 cursor-pointer place-items-center rounded-md border border-[#B89A7A] px-4 text-sm font-extrabold text-[#A7815E]">تغيير الصورة</DashboardDocumentUploadButton>
            </div>
            <div>
              <h3 className="mb-4 font-display text-2xl font-extrabold text-[#1D1916]">{profile.fullName}</h3>
              <DetailRow label="رقم العضوية" value={profile.membershipNumber} icon={<Settings2 className="h-4 w-4" />} />
              <DetailRow label="نوع الحساب" value="حساب أفراد" icon={<UserRound className="h-4 w-4" />} />
              <DetailRow label="تاريخ الانضمام" value={formatDashboardDate(profile.createdAt)} icon={<CalendarCheck className="h-4 w-4" />} />
              <DetailRow label="حالة الحساب" value={verificationLabel} icon={<CheckCircle2 className={cn("h-4 w-4", verified ? "text-[#087342]" : "text-[#A7815E]")} />} />
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <h2 className="mb-4 font-display text-xl font-extrabold text-[#1D1916]">اكتمال الملف الشخصي</h2>
          <div className="grid items-center gap-5 md:grid-cols-[160px_1fr]">
            <ScoreRing value={profile.profileCompletion} />
            <div>
              <p className="mb-3 text-sm font-extrabold text-[#1D1916]">العناصر المتبقية</p>
              <DetailRow label="استكمال العنوان" value="مطلوب" icon={<MapPin className="h-4 w-4" />} />
              <DetailRow label="إضافة صورة الهوية" value="اختياري" icon={<FileText className="h-4 w-4" />} />
              <Link href={dashboardHref(config.role, "verification")} className="mt-4 grid min-h-10 place-items-center rounded-md border border-[#B89A7A] px-6 text-sm font-extrabold text-[#A7815E]">عرض جميع المتطلبات</Link>
            </div>
          </div>
        </article>
      </section>

      <form className="grid gap-4 xl:grid-cols-2">
        <SectionBox title="البيانات الشخصية" icon={<UserRound className="h-5 w-5" />}>
          <div className="grid gap-3 md:grid-cols-2">
            <Field name={config.role === "business" ? "name" : "fullName"} label={config.role === "business" ? "اسم المنشأة" : "الاسم الكامل"} value={profile.fullName} placeholder="أدخل الاسم" />
            <Field name="phone" label="رقم الجوال" value={profile.phone} placeholder="05xxxxxxxx" />
            <Field name="email" label="البريد الإلكتروني" value={profile.email} placeholder="example@domain.com" type="email" />
            <Field name="identityNumber" label={config.role === "business" ? "رقم السجل التجاري" : "رقم الهوية"} value={profile.identityNumber} placeholder="أدخل الرقم" />
            <Field name="birthDate" label="تاريخ الميلاد" value={profile.birthDate} placeholder="yyyy/mm/dd" />
            <Field name="nationality" label="الجنسية" value={profile.nationality} placeholder="الجنسية" />
          </div>
        </SectionBox>
        <SectionBox title="بيانات التواصل" icon={<MapPin className="h-5 w-5" />}>
          <div className="grid gap-3 md:grid-cols-2">
            <Field name="city" label="المدينة" value={profile.city} placeholder="المدينة" />
            <Field name="postalCode" label="الرمز البريدي" value={profile.postalCode} placeholder="الرمز البريدي" />
            <Field name="country" label="الدولة" value={profile.country} placeholder="الدولة" />
            <Field name="profileCompletion" label="نسبة اكتمال الملف" value={String(profile.profileCompletion)} placeholder="88" type="number" />
            <Field name="address" label="العنوان" value={profile.address} placeholder="العنوان التفصيلي" textarea />
          </div>
          <SaveAccountSettingsButton
            scope={config.role === "business" ? "business" : "individual"}
            kind="profile"
            payload={{ source: "profile-contact-form" }}
            className="mt-4 grid min-h-11 w-full place-items-center rounded-md bg-[#A7815E] text-sm font-extrabold text-white"
          >
            حفظ بيانات الحساب
          </SaveAccountSettingsButton>
        </SectionBox>
      </form>

      {profileResult.error ? <section className="rounded-lg border border-[#F0D8B8] bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل بيانات الحساب الحية من Supabase، وتم عرض بيانات احتياطية.</section> : null}

      <section className="grid gap-4 xl:grid-cols-2">
        <SectionBox title="الحسابات المرتبطة" icon={<ShieldCheck className="h-5 w-5" />}>
          <div className="grid gap-3 md:grid-cols-3">
            <IconTile title="رقم الجوال" subtitle="موثق" icon={<MessageSquare className="h-8 w-8" />} />
            <IconTile title="البريد الإلكتروني" subtitle="موثق" icon={<Send className="h-8 w-8" />} />
            <IconTile title="النفاذ الوطني" subtitle="مرتبط" icon={<ShieldCheck className="h-8 w-8" />} />
          </div>
        </SectionBox>
        <SectionBox title="معلومات التوثيق" icon={<CheckCircle2 className="h-5 w-5" />}>
          <DetailRow label="حالة التحقق" value={verificationLabel} />
          <DetailRow label="آخر تحديث" value={formatDashboardDate(lastProfileUpdate)} />
          <DetailRow label="مستوى الثقة" value={verified ? "مرتفع" : profile.verificationStatus === "needs_changes" ? "يحتاج تحديث" : "قيد الرفع"} />
        </SectionBox>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <SectionBox title="التفضيلات العقارية" icon={<Star className="h-5 w-5" />}>
          <div className="grid gap-3 md:grid-cols-3">
            <IconTile title="المدن المفضلة" subtitle="الرياض، جدة، الدمام" icon={<MapPin className="h-8 w-8" />} />
            <IconTile title="المساهمات المفضلة" subtitle="تطوير، دخل، إعادة هيكلة" icon={<BarChart3 className="h-8 w-8" />} />
            <IconTile title="الأصول المفضلة" subtitle="سكني، تجاري، فندقي" icon={<Building2 className="h-8 w-8" />} />
          </div>
          <SaveAccountSettingsButton
            scope={config.role === "business" ? "business" : "individual"}
            kind="preferences"
            payload={{ preferredCities: "الرياض، جدة، الدمام", preferredContributions: "تطوير، دخل، إعادة هيكلة", preferredAssets: "سكني، تجاري، فندقي" }}
            collectFormValues={false}
            className="mt-4 grid min-h-10 w-full place-items-center rounded-md border border-[#B89A7A] text-sm font-extrabold text-[#A7815E]"
          >
            تحديث التفضيلات
          </SaveAccountSettingsButton>
        </SectionBox>
        <SectionBox title="الإشعارات" icon={<Bell className="h-5 w-5" />}>
          <form className="grid gap-2">
            <ToggleRow name="assetNotifications" label="إشعارات الأصول" description="استلام تنبيهات حول الأصول الجديدة والتحديثات" />
            <ToggleRow name="contributionNotifications" label="إشعارات المساهمات" description="استلام تنبيهات حول المساهمات المتاحة" />
            <ToggleRow name="messageNotifications" label="الرسائل" description="استلام الرسائل من إدارة المنصة" />
            <ToggleRow name="opportunityNotifications" label="الفرص الجديدة" description="استلام فرص استثمارية تناسب اهتماماتك" />
            <SaveAccountSettingsButton
              scope={config.role === "business" ? "business" : "individual"}
              kind="preferences"
              payload={{ preferencesSection: "profile_notifications" }}
              className="mt-3 grid min-h-10 w-full place-items-center rounded-md border border-[#B89A7A] text-sm font-extrabold text-[#A7815E]"
            >
              حفظ تفضيلات الإشعارات
            </SaveAccountSettingsButton>
          </form>
        </SectionBox>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <SectionBox title="الأمان السريع" icon={<ShieldCheck className="h-5 w-5" />}>
          <div className="grid gap-3 md:grid-cols-3">
            <IconTile title="تغيير كلمة المرور" subtitle="تحديث كلمة المرور الخاصة" icon={<FileText className="h-8 w-8" />} />
            <IconTile title="التحقق الثنائي" subtitle="تفعيل التحقق لحماية حسابك" icon={<ShieldCheck className="h-8 w-8" />} />
            <IconTile title="الأجهزة الموثوقة" subtitle="إدارة الأجهزة المتصلة" icon={<BriefcaseBusiness className="h-8 w-8" />} />
          </div>
        </SectionBox>
        <ActivityList title="سجل النشاط" items={profileActivityItems} />
      </section>
      <TrustDigitalStrip />
    </div>
  );
}

function NotificationItem({
  title,
  subtitle,
  meta,
  unread = false,
  icon,
  actionUrl,
}: {
  title: string;
  subtitle: string;
  meta: string;
  unread?: boolean;
  icon: ReactNode;
  actionUrl?: string | null;
}) {
  const content = (
    <article className="grid gap-3 border-b border-[#eee4dc] py-4 last:border-b-0 md:grid-cols-[1fr_auto_auto] md:items-center">
      <div className="text-right">
        <h3 className="text-base font-extrabold text-[#1D1916]">{title}</h3>
        <p className="mt-1 text-sm font-bold leading-6 text-[#6E6258]">{subtitle}</p>
      </div>
      <span className={cn("text-sm font-extrabold", unread ? "text-[#A7815E]" : "text-[#6E6258]")}>{unread ? "غير مقروء" : "مقروءة"}</span>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-[#6E6258]">{meta}</span>
        <span className="grid h-12 w-12 place-items-center rounded-full border border-[#eee4dc] text-[#A7815E]">{icon}</span>
      </div>
    </article>
  );

  if (!actionUrl) return content;

  return (
    <Link href={actionUrl} className="block rounded-md transition hover:bg-[#fbf8f4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A7815E]" aria-label={`فتح تفاصيل: ${title}`}>
      {content}
    </Link>
  );
}

function notificationCategoryLabel(category: string) {
  const normalized = category.toLowerCase();
  if (normalized.includes("asset")) return "أصل عقاري";
  if (normalized.includes("contribution")) return "مساهمة عقارية";
  if (normalized.includes("service")) return "خدمة عقارية";
  if (normalized.includes("verification")) return "التوثيق";
  if (normalized.includes("support")) return "الدعم الفني";
  if (normalized.includes("message")) return "الرسائل";
  if (normalized.includes("invoice") || normalized.includes("payment")) return "المالية";
  return "النظام";
}

function notificationIcon(category: string) {
  const normalized = category.toLowerCase();
  if (normalized.includes("asset")) return <Building2 className="h-5 w-5" />;
  if (normalized.includes("contribution")) return <BarChart3 className="h-5 w-5" />;
  if (normalized.includes("service")) return <Settings2 className="h-5 w-5" />;
  if (normalized.includes("message")) return <MessageSquare className="h-5 w-5" />;
  if (normalized.includes("support")) return <FileText className="h-5 w-5" />;
  if (normalized.includes("verification")) return <ShieldCheck className="h-5 w-5" />;
  return <Bell className="h-5 w-5" />;
}

function notificationCategoryCount(notifications: DashboardNotification[], matcher: string) {
  return notifications.filter((notification) => notification.category.toLowerCase().includes(matcher)).length;
}

function notificationTypeMatches(notification: DashboardNotification, type: string) {
  if (!type || type === "الكل") return true;
  const normalized = notification.category.toLowerCase();
  if (type === "الأصول") return normalized.includes("asset");
  if (type === "المساهمات") return normalized.includes("contribution");
  if (type === "الخدمات") return normalized.includes("service");
  if (type === "الحساب") return normalized.includes("account") || normalized.includes("verification");
  return true;
}

function notificationStatusMatches(notification: DashboardNotification, status: string) {
  if (!status || status === "الكل") return true;
  if (status === "مقروءة") return !notification.unread;
  if (status === "غير مقروءة") return notification.unread;
  return true;
}

function notificationPeriodMatches(notification: DashboardNotification, period: string) {
  if (!period || period === "الكل") return true;
  const timestamp = new Date(notification.createdAt).getTime();
  if (Number.isNaN(timestamp)) return false;
  const ageMs = Date.now() - timestamp;
  if (period === "آخر يوم") return ageMs <= 24 * 60 * 60 * 1000;
  if (period === "آخر أسبوع") return ageMs <= 7 * 24 * 60 * 60 * 1000;
  if (period === "آخر شهر") return ageMs <= 30 * 24 * 60 * 60 * 1000;
  return true;
}

function notificationPriorityMatches(notification: DashboardNotification, priority: string) {
  if (!priority) return true;
  const normalized = normalizeDashboardSearch(`${notification.category} ${notification.title} ${notification.body}`);
  if (priority === "urgent") return notification.unread || normalized.includes("عاجل") || normalized.includes("urgent");
  return true;
}

async function IndividualNotificationsPage({ config, actor = null, searchParams = {} }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null; searchParams?: DashboardSearchParams }) {
  const scope = config.role === "business" ? "business" : "individual";
  const notificationsResult = await listDashboardNotifications(scope, actor);
  const typeFilter = stringParam(searchParams, "type").trim() || "الكل";
  const statusFilter = stringParam(searchParams, "status").trim() || "الكل";
  const periodFilter = stringParam(searchParams, "period").trim();
  const priorityFilter = stringParam(searchParams, "priority").trim();
  const allNotifications = notificationsResult.data;
  const notifications = allNotifications.filter((notification) => notificationTypeMatches(notification, typeFilter) && notificationStatusMatches(notification, statusFilter) && notificationPeriodMatches(notification, periodFilter) && notificationPriorityMatches(notification, priorityFilter));
  const unreadNotifications = notifications.filter((notification) => notification.unread);
  const allUnreadNotifications = allNotifications.filter((notification) => notification.unread);
  const urgent = allUnreadNotifications.length ? allUnreadNotifications.slice(0, 3) : allNotifications.slice(0, 3);
  const todayIso = new Date().toISOString().slice(0, 10);
  const todayCount = allNotifications.filter((notification) => notification.createdAt.startsWith(todayIso)).length;
  const readCount = notifications.length - unreadNotifications.length;

  return (
    <div className="grid gap-4">
      <IndividualPageHero
        title="الإشعارات"
        subtitle="تابع آخر التحديثات والتنبيهات المتعلقة بالأصول والمساهمات والخدمات العقارية."
        image="/images/dashboard-individual-hero.png"
        actionNode={
          <MarkNotificationsReadButton scope={scope} className="inline-flex min-h-11 min-w-48 items-center justify-center gap-3 rounded-md bg-[#A7815E] px-6 text-sm font-extrabold text-white shadow-[0_12px_22px_rgb(167_129_94/0.22)]">
            تحديد الكل كمقروء
          </MarkNotificationsReadButton>
        }
      />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <IndividualKpiCard title="جميع الإشعارات" value={String(allNotifications.length)} unit="إشعار" icon="bell" tone="red" />
        <IndividualKpiCard title="غير المقروءة" value={String(allUnreadNotifications.length)} unit="إشعار" icon="send" tone="green" />
        <IndividualKpiCard title="إشعارات الأصول" value={String(notificationCategoryCount(allNotifications, "asset"))} unit="إشعار" icon="building" />
        <IndividualKpiCard title="إشعارات المساهمات" value={String(notificationCategoryCount(allNotifications, "contribution"))} unit="إشعارات" icon="chart" />
      </section>

      <section className="rounded-lg border border-[#ece1d8] bg-white p-4 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
        <div className="grid gap-4 xl:grid-cols-3">
          <div>
            <h2 className="mb-3 text-sm font-extrabold text-[#1D1916]">النوع</h2>
            <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
              {["الكل", "الأصول", "المساهمات", "الخدمات", "الحساب"].map((item) => <Link key={item} href={dashboardQueryHref(config.role, "notifications", { type: item === "الكل" ? undefined : item, status: statusFilter === "الكل" ? undefined : statusFilter, period: periodFilter || undefined, priority: priorityFilter || undefined })} className={cn("grid min-h-10 place-items-center rounded-md border px-3 text-xs font-extrabold", item === typeFilter ? "border-[#B89A7A] bg-[#fff3ec] text-[#A7815E]" : "border-[#ece1d8] bg-white text-[#1D1916]")}>{item}</Link>)}
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-extrabold text-[#1D1916]">الحالة</h2>
            <div className="grid grid-cols-3 gap-2">
              {["الكل", "مقروءة", "غير مقروءة"].map((item) => <Link key={item} href={dashboardQueryHref(config.role, "notifications", { type: typeFilter === "الكل" ? undefined : typeFilter, status: item === "الكل" ? undefined : item, period: periodFilter || undefined, priority: priorityFilter || undefined })} className={cn("grid min-h-10 place-items-center rounded-md border px-3 text-xs font-extrabold", item === statusFilter ? "border-[#B89A7A] bg-[#fff3ec] text-[#A7815E]" : "border-[#ece1d8] bg-white text-[#1D1916]")}>{item}</Link>)}
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-extrabold text-[#1D1916]">التاريخ</h2>
            <div className="grid grid-cols-3 gap-2">
              {["آخر يوم", "آخر أسبوع", "آخر شهر"].map((item) => <Link key={item} href={dashboardQueryHref(config.role, "notifications", { type: typeFilter === "الكل" ? undefined : typeFilter, status: statusFilter === "الكل" ? undefined : statusFilter, period: item === periodFilter ? undefined : item, priority: priorityFilter || undefined })} className={cn("grid min-h-10 place-items-center rounded-md border px-3 text-xs font-extrabold", item === periodFilter ? "border-[#B89A7A] bg-[#fff3ec] text-[#A7815E]" : "border-[#ece1d8] bg-white text-[#1D1916]")}>{item}</Link>)}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
        <div className="mb-4 flex items-center justify-between">
          <Link href={dashboardQueryHref(config.role, "notifications", { priority: priorityFilter === "urgent" ? undefined : "urgent", type: typeFilter === "الكل" ? undefined : typeFilter, status: statusFilter === "الكل" ? undefined : statusFilter, period: periodFilter || undefined })} className="text-sm font-extrabold text-[#A7815E]">{priorityFilter === "urgent" ? "عرض كل الإشعارات" : "عرض جميع التنبيهات"} ←</Link>
          <h2 className="flex items-center gap-2 font-display text-xl font-extrabold text-[#1D1916]"><Bell className="h-5 w-5 text-[#A7815E]" />إشعارات عاجلة</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {urgent.map((item) => (
            <article key={item.id} className="rounded-md border p-4" style={{ backgroundColor: "#fff7f0", borderColor: "#D9D1C7" }}>
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#B89A7A] text-white">!</span>
                <div>
                  <h3 className="text-sm font-extrabold text-[#1D1916]">{item.title}</h3>
                  <p className="mt-2 text-xs font-bold leading-6 text-[#6E6258]">{item.body}</p>
                  <p className="mt-1 text-xs font-bold text-[#6E6258]">{formatDashboardDate(item.createdAt)}</p>
                </div>
              </div>
            </article>
          ))}
          {!urgent.length ? <p className="rounded-md border border-[#ece1d8] bg-white p-4 text-center text-sm font-extrabold text-[#6E6258] md:col-span-3">لا توجد إشعارات عاجلة حالياً.</p> : null}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.45fr]">
        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <h2 className="mb-4 font-display text-xl font-extrabold text-[#1D1916]">قائمة الإشعارات</h2>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              title={notification.title}
              subtitle={notification.body || notificationCategoryLabel(notification.category)}
              meta={formatDashboardDate(notification.createdAt)}
              unread={notification.unread}
              icon={notificationIcon(notification.category)}
              actionUrl={notification.actionUrl}
            />
          ))}
          {!notifications.length ? <p className="py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد إشعارات مطابقة للفلاتر الحالية.</p> : null}
          {notificationsResult.error ? <p className="mt-4 rounded-md border border-[#F0D8B8] bg-[#fff7ec] p-3 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل الإشعارات الحية، وتم عرض المتاح فقط.</p> : null}
          <Link href={dashboardHref(config.role, "notifications")} className="mt-4 inline-flex text-sm font-extrabold text-[#1D1916]">عرض جميع الإشعارات ←</Link>
        </article>
        <div className="grid gap-4 content-start">
          <SectionBox title="الجدول الزمني للإشعارات" icon={<Clock3 className="h-5 w-5" />}>
            <DetailRow label="اليوم" value={String(todayCount)} />
            <DetailRow label="غير المقروء" value={String(unreadNotifications.length)} />
            <DetailRow label="المقروء" value={String(readCount)} />
            <DetailRow label="الإجمالي" value={String(notifications.length)} />
          </SectionBox>
          <SectionBox title="تفضيلات الإشعارات" icon={<Bell className="h-5 w-5" />}>
            <form className="grid gap-2">
              <ToggleRow name="assetNotifications" label="إشعارات الأصول" />
              <ToggleRow name="contributionNotifications" label="إشعارات المساهمات" />
              <ToggleRow name="serviceNotifications" label="إشعارات الخدمات" />
              <ToggleRow name="messageNotifications" label="الرسائل" />
              <ToggleRow name="opportunityNotifications" label="الفرص الجديدة" />
              <SaveAccountSettingsButton
                scope={scope}
                kind="preferences"
                payload={{ preferencesSection: "notifications_page" }}
                className="mt-3 grid min-h-10 w-full place-items-center rounded-md border border-[#B89A7A] text-sm font-extrabold text-[#A7815E]"
              >
                حفظ التفضيلات
              </SaveAccountSettingsButton>
            </form>
          </SectionBox>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <SectionBox title="الإشعارات حسب النوع" icon={<Bell className="h-5 w-5" />}>
          <div className="grid gap-3 md:grid-cols-3">
            <IndividualKpiCard title="الحساب" value={String(notificationCategoryCount(notifications, "account"))} unit="إشعارات" icon="settings" />
            <IndividualKpiCard title="المساهمات العقارية" value={String(notificationCategoryCount(notifications, "contribution"))} unit="إشعارات" icon="chart" />
            <IndividualKpiCard title="الأصول العقارية" value={String(notificationCategoryCount(notifications, "asset"))} unit="إشعار" icon="building" />
          </div>
        </SectionBox>
        <ActivityList title="النشاط الأخير" items={[
          ["إضافة أصل جديد", "منذ ساعتين", <Building2 key="a" className="h-5 w-5" />],
          ["حفظ مساهمة للاهتمام", "منذ 5 ساعات", <Star key="b" className="h-5 w-5" />],
          ["طلب خدمة عقارية", "منذ يوم", <Settings2 key="c" className="h-5 w-5" />],
          ["تحديث بيانات الحساب", "منذ يومين", <FileText key="d" className="h-5 w-5" />],
        ]} />
        <SectionBox title="إحصائيات التفاعل" icon={<BarChart3 className="h-5 w-5" />}>
          <div className="grid grid-cols-2 gap-3">
            <IndividualKpiCard title="إشعارات مطابقة" value={String(notifications.length)} unit="إشعارات" icon="star" />
            <IndividualKpiCard title="إشعارات تمت قراءتها" value={String(readCount)} unit="إشعار" icon="send" />
            <IndividualKpiCard title="إشعارات جديدة" value={String(unreadNotifications.length)} unit="إشعار" icon="bell" />
            <IndividualKpiCard title="إشعارات الخدمات" value={String(notificationCategoryCount(notifications, "service"))} unit="إشعارات" icon="target" />
          </div>
        </SectionBox>
      </section>
      <TrustDigitalStrip />
    </div>
  );
}

async function IndividualSecurityPage({ config }: { config: DashboardRoleConfig }) {
  const auditLogsResult = await listDashboardAdminAuditLogs("login");
  const loginLogs = auditLogsResult.data.slice(0, 5);
  const trustedDevices = loginLogs.slice(0, 3).map((log) => ({
    label: log.target && log.target !== "auth_session" ? log.target : log.event,
    activity: formatDashboardDateTime(log.time),
  }));
  const activeSessionCount = Math.max(1, loginLogs.filter((log) => log.status === "ناجح").slice(0, 3).length);
  const latestLogin = loginLogs[0];
  const identityCheckDate = latestLogin ? formatDashboardDate(latestLogin.time) : "غير محدد";

  return (
    <div className="grid gap-4" data-dashboard-form>
      <IndividualPageHero
        title="الأمان"
        subtitle="إدارة إعدادات الأمان والتحقق وحماية حسابك في منصة مهابة."
        image="/images/dashboard-individual-hero.png"
        actionNode={
          <SaveAccountSettingsButton
            scope={config.role === "business" ? "business" : "individual"}
            kind="security"
            payload={{ securityScore: 85, twoFactorEnabled: true, trustedDevices: 3, loginAlerts: true }}
            collectFormValues={false}
            className="inline-flex min-h-11 min-w-48 items-center justify-center gap-3 rounded-md bg-[#A7815E] px-6 text-sm font-extrabold text-white shadow-[0_12px_22px_rgb(167_129_94/0.22)]"
          >
            حفظ التغييرات
          </SaveAccountSettingsButton>
        }
      />

      <section className="grid gap-4 rounded-lg border border-[#ece1d8] bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)] md:grid-cols-4">
        <div className="text-center"><ShieldCheck className="mx-auto h-12 w-12 text-[#A7815E]" /><p className="mt-2 text-sm font-extrabold text-[#1D1916]">درجة الأمان</p></div>
        <ScoreRing />
        <div className="text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-[#087342]" /><p className="mt-2 text-sm font-extrabold text-[#1D1916]">حالة الحماية</p><strong className="text-[#087342]">ممتازة</strong></div>
        <div className="text-center"><CalendarCheck className="mx-auto h-8 w-8 text-[#1D1916]" /><p className="mt-2 text-sm font-extrabold text-[#1D1916]">آخر مراجعة أمنية</p><strong className="text-[#1D1916]">{identityCheckDate}</strong></div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <SectionBox title="تغيير كلمة المرور" icon={<ShieldCheck className="h-5 w-5" />}>
          <form className="grid gap-3">
            <Field name="currentPassword" label="كلمة المرور الحالية" placeholder="أدخل كلمة المرور الحالية" type="password" />
            <Field name="newPassword" label="كلمة المرور الجديدة" placeholder="أدخل كلمة المرور الجديدة" type="password" />
            <Field name="confirmPassword" label="تأكيد كلمة المرور" placeholder="أعد إدخال كلمة المرور الجديدة" type="password" />
            <SaveAccountSettingsButton
              scope={config.role === "business" ? "business" : "individual"}
              kind="security"
              payload={{ passwordRotationRequested: true }}
              className="grid min-h-11 place-items-center rounded-md border border-[#B89A7A] text-sm font-extrabold text-[#A7815E]"
            >
              تحديث كلمة المرور
            </SaveAccountSettingsButton>
          </form>
        </SectionBox>
        <SectionBox title="التحقق الثنائي" icon={<ShieldCheck className="h-5 w-5" />}>
          <DetailRow label="التحقق عبر الجوال" value="مفعل" icon={<CheckCircle2 className="h-4 w-4 text-[#087342]" />} />
          <DetailRow label="التحقق عبر البريد الإلكتروني" value="مفعل" icon={<CheckCircle2 className="h-4 w-4 text-[#087342]" />} />
          <SaveAccountSettingsButton
            scope={config.role === "business" ? "business" : "individual"}
            kind="security"
            payload={{ twoFactorEnabled: true, smsVerification: true, emailVerification: true }}
            collectFormValues={false}
            className="mt-4 grid min-h-11 w-full place-items-center rounded-md border border-[#B89A7A] text-sm font-extrabold text-[#A7815E]"
          >
            إدارة التحقق الثنائي
          </SaveAccountSettingsButton>
        </SectionBox>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <SectionBox title="الأجهزة الموثوقة" icon={<BriefcaseBusiness className="h-5 w-5" />}>
          {(trustedDevices.length ? trustedDevices : [{ label: "لا توجد أجهزة موثوقة مسجلة", activity: "غير محدد" }]).map((item) => (
            <div key={item.label} className="flex items-center justify-between border-b border-[#eee4dc] py-3 last:border-b-0">
              <Link href="/api/auth/logout" className="rounded-md border border-[#B89A7A] px-3 py-2 text-xs font-extrabold text-[#A7815E]">تسجيل الخروج</Link>
              <div className="text-right"><p className="text-sm font-extrabold text-[#1D1916]">{item.label}</p><p className="text-xs font-bold text-[#6E6258]">آخر نشاط: {item.activity}</p></div>
            </div>
          ))}
          <Link href={dashboardHref(config.role, "security?section=devices")} className="mt-3 inline-flex text-sm font-extrabold text-[#1D1916]">عرض جميع الأجهزة ←</Link>
        </SectionBox>
        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-center shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <h2 className="font-display text-xl font-extrabold text-[#1D1916]">الجلسات النشطة</h2>
          <div className="mt-6 font-display text-5xl font-extrabold text-[#1D1916]">{activeSessionCount}</div>
          <p className="mt-2 text-sm font-bold text-[#6E6258]">جلسات نشطة الآن</p>
          <div className="relative mx-auto mt-5 h-28 w-40"><Image src="/images/final-cta-map-building.png" alt="" fill className="object-cover opacity-35" sizes="180px" /></div>
          <Link href="/api/auth/logout" className="mt-4 grid min-h-10 place-items-center rounded-md border border-[#B89A7A] px-5 text-sm font-extrabold text-[#A7815E]">تسجيل الخروج</Link>
        </article>
        <SectionBox title="سجل تسجيل الدخول" icon={<Clock3 className="h-5 w-5" />}>
          {loginLogs.length ? loginLogs.map((log) => (
            <DetailRow key={log.id} label={formatDashboardDateTime(log.time)} value={log.status} icon={<CheckCircle2 className="h-4 w-4 text-[#087342]" />} />
          )) : <DetailRow label="لا توجد سجلات دخول" value="غير محدد" icon={<Info className="h-4 w-4 text-[#A7815E]" />} />}
          <Link href={dashboardHref(config.role, "security?section=login-log")} className="mt-3 inline-flex text-sm font-extrabold text-[#1D1916]">عرض جميع السجلات ←</Link>
        </SectionBox>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <SectionBox title="إعدادات التنبيهات الأمنية" icon={<Bell className="h-5 w-5" />}>
          <form className="grid gap-2">
            <ToggleRow name="loginAlerts" label="إشعار تسجيل الدخول الجديد" />
            <ToggleRow name="passwordChangeAlerts" label="إشعار تغيير كلمة المرور" />
            <ToggleRow name="newDeviceAlerts" label="إشعار إضافة جهاز جديد" />
            <ToggleRow name="sensitiveActionAlerts" label="إشعار الأنشطة الحساسة" />
            <SaveAccountSettingsButton
              scope={config.role === "business" ? "business" : "individual"}
              kind="security"
              payload={{ securitySection: "alert_preferences" }}
              className="mt-4 grid min-h-10 w-full place-items-center rounded-md border border-[#B89A7A] text-sm font-extrabold text-[#A7815E]"
            >
              تحديث الإعدادات
            </SaveAccountSettingsButton>
          </form>
        </SectionBox>
        <SectionBox title="التحقق من الهوية" icon={<ShieldCheck className="h-5 w-5" />}>
          <div className="grid gap-3 md:grid-cols-3">
            <IconTile title="تاريخ آخر تحقق" subtitle={identityCheckDate} icon={<CalendarCheck className="h-8 w-8" />} />
            <IconTile title="حالة الهوية" subtitle="سارية" icon={<UserRound className="h-8 w-8" />} />
            <IconTile title="النفاذ الوطني" subtitle="موثق" icon={<ShieldCheck className="h-8 w-8" />} />
          </div>
          <Link href={dashboardHref(config.role, "verification")} className="mt-4 grid min-h-10 w-full place-items-center rounded-md border border-[#B89A7A] text-sm font-extrabold text-[#A7815E]">عرض تفاصيل التحقق</Link>
        </SectionBox>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <SectionBox title="مركز الأمان" icon={<ShieldCheck className="h-5 w-5" />}>
          <div className="grid gap-3 md:grid-cols-4">
            <IconTile title="التحقق من الهوية" subtitle="التحقق من الوثائق" icon={<UserRound className="h-8 w-8" />} />
            <IconTile title="إدارة كلمات المرور" subtitle="قوة كلمة المرور" icon={<FileText className="h-8 w-8" />} />
            <IconTile title="التحقق الثنائي" subtitle="تفعيل الحماية" icon={<ShieldCheck className="h-8 w-8" />} />
            <IconTile title="حماية الحساب" subtitle="نصائح أمنية" icon={<Target className="h-8 w-8" />} />
          </div>
        </SectionBox>
        <ActivityList title="النشاط الأمني الأخير" items={[
          ["تسجيل دخول ناجح من جهاز جديد", "منذ ساعتين", <CheckCircle2 key="a" className="h-5 w-5 text-[#087342]" />],
          ["تحديث كلمة المرور", "منذ يوم", <CheckCircle2 key="b" className="h-5 w-5 text-[#087342]" />],
          ["تفعيل التحقق الثنائي عبر الجوال", "منذ يومين", <CheckCircle2 key="c" className="h-5 w-5 text-[#087342]" />],
          ["إضافة جهاز موثوق جديد", "منذ 3 أيام", <CheckCircle2 key="d" className="h-5 w-5 text-[#087342]" />],
        ]} />
      </section>
      <TrustDigitalStrip />
    </div>
  );
}

function InvoiceStatus({ label, tone }: { label: string; tone: TrendTone }) {
  const s = toneStyles[tone];
  return <span className="inline-flex min-h-8 items-center justify-center rounded-md px-3 text-xs font-extrabold" style={{ backgroundColor: s.bg, color: s.text }}>{label}</span>;
}

function financeScope(role: DashboardRole): DashboardFinancialScope {
  if (role === "admin") return "admin";
  return role === "business" ? "business" : "individual";
}

function formatDashboardDate(value?: string | null) {
  if (!value) return "غير محدد";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-SA", { year: "numeric", month: "long", day: "numeric" }).format(date);
}

function formatDashboardDateTime(value?: string | null) {
  if (!value) return "غير محدد";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-SA", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

function paymentMethodLabel(method: string) {
  const normalized = method.toLowerCase();
  if (normalized.includes("mada")) return "مدى";
  if (normalized.includes("visa")) return "Visa";
  if (normalized.includes("apple")) return "Apple Pay";
  if (normalized.includes("bank")) return "تحويل بنكي";
  return method;
}

function financeExportRows(financial: DashboardFinancialData) {
  return [
    ...financial.invoices.map((invoice) => ({
      النوع: "فاتورة",
      الرقم: invoice.invoiceNumber,
      العميل: invoice.customer,
      الوصف: invoice.title,
      المبلغ: invoice.amount,
      الحالة: invoice.statusLabel,
      التاريخ: invoice.dueDate,
    })),
    ...financial.payments.map((payment) => ({
      النوع: "دفعة",
      الرقم: payment.providerReference ?? payment.id,
      العميل: payment.customer,
      الوصف: payment.title,
      المبلغ: payment.amount,
      الحالة: payment.statusLabel,
      التاريخ: payment.paidAt ?? payment.createdAt,
    })),
  ];
}

async function IndividualInvoicesPage({ config, actor = null, searchParams = {} }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null; searchParams?: DashboardSearchParams }) {
  const scope = financeScope(config.role);
  const financial = await listDashboardFinancial(scope, actor);
  const q = stringParam(searchParams, "q").trim();
  const invoiceQuery = stringParam(searchParams, "invoice").trim();
  const activeStatus = stringParam(searchParams, "status").trim();
  const invoices = financial.invoices.filter((invoice) => {
    const matchesText = matchesDashboardSearch(q, [invoice.invoiceNumber, invoice.title, invoice.customer, invoice.statusLabel, invoice.amount, invoice.dueDate, invoice.issuedAt]);
    const matchesInvoice = !invoiceQuery || normalizeDashboardSearch(invoice.invoiceNumber).includes(normalizeDashboardSearch(invoiceQuery));
    const matchesStatus = !activeStatus || invoice.status === activeStatus;
    return matchesText && matchesInvoice && matchesStatus;
  });
  const dueInvoice = financial.invoices.find((invoice) => invoice.status === "due" || invoice.status === "overdue");
  const defaultPaymentMethod = financial.summary.paymentMethods[0] ?? "mada";
  const invoiceGridStyle = { gridTemplateColumns: "repeat(auto-fit, minmax(7.5rem, 1fr))" };
  const accountType = scope === "business" ? "منشأتك" : "حسابك";

  return (
    <div className="grid gap-4">
      <IndividualPageHero
        title="الفواتير"
        subtitle={`استعرض جميع الفواتير والمدفوعات المرتبطة بـ${accountType}.`}
        image="/images/dashboard-individual-hero.png"
        action={{ label: "عرض المدفوعات", href: dashboardHref(config.role, "payments") }}
      />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <IndividualKpiCard title="إجمالي الفواتير" value={String(financial.summary.totalInvoices)} unit="فاتورة" icon="file" />
        <IndividualKpiCard title="فواتير مدفوعة" value={String(financial.summary.paidInvoices)} unit="فاتورة" icon="shield" tone="green" />
        <IndividualKpiCard title="فواتير قيد الانتظار" value={String(financial.summary.pendingInvoices)} unit="فواتير" icon="clock" />
        <IndividualKpiCard title="فواتير متأخرة" value={String(financial.summary.overdueInvoices)} unit="فاتورة" icon="x" tone="red" />
      </section>

      <section className="grid gap-3 rounded-lg border border-[#ece1d8] bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)] md:grid-cols-4">
        <DetailRow label="إجمالي المدفوعات" value={formatSar(financial.summary.totalPaid)} />
        <DetailRow label="إجمالي المستحقات" value={formatSar(financial.summary.outstanding)} />
        <DetailRow label="آخر عملية دفع" value={formatDashboardDate(financial.payments[0]?.paidAt ?? financial.payments[0]?.createdAt)} />
        <DetailRow label="حالة الحساب" value={financial.summary.overdueInvoices ? "توجد فواتير متأخرة" : "لا توجد التزامات متأخرة"} icon={<CheckCircle2 className="h-4 w-4 text-[#087342]" />} />
      </section>

      <section className="rounded-lg border border-[#ece1d8] bg-white p-4 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
        <form action={dashboardHref(config.role, "invoices")} className="grid gap-3 lg:grid-cols-5">
          <label className="relative block lg:col-span-2">
            <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1D1916]" />
            <input name="q" defaultValue={q} className="h-12 w-full rounded-md border border-[#ece1d8] bg-white pr-12 text-sm font-bold outline-none focus:border-[#A7815E]" placeholder="ابحث برقم الفاتورة أو الخدمة" />
          </label>
          <label className="grid gap-2 text-sm font-extrabold text-[#1D1916]">
            رقم الفاتورة
            <input name="invoice" defaultValue={invoiceQuery} className="h-12 rounded-md border border-[#ece1d8] bg-white px-3 text-sm font-bold outline-none focus:border-[#A7815E]" placeholder="أدخل رقم الفاتورة" />
          </label>
          <label className="grid gap-2 text-sm font-extrabold text-[#1D1916]">
            الحالة
            <select name="status" defaultValue={activeStatus} className="h-12 rounded-md border border-[#ece1d8] bg-white px-3 text-sm font-bold outline-none focus:border-[#A7815E]">
              <option value="">الكل</option>
              <option value="paid">مدفوعة</option>
              <option value="due">قيد الانتظار</option>
              <option value="overdue">متأخرة</option>
            </select>
          </label>
          <button type="submit" className="flex h-12 items-center justify-center gap-2 rounded-md border border-[#B89A7A] bg-white px-4 text-sm font-extrabold text-[#A7815E]">
            <RefreshCcw className="h-4 w-4" />
            تصفية
          </button>
          <FinancialExportButton
            filename={`mahabah-${scope}-statement.csv`}
            rows={financeExportRows(financial)}
            className="flex h-12 items-center justify-center gap-2 rounded-md bg-[#1D1916] px-4 text-sm font-extrabold text-white"
          />
        </form>
      </section>

      <section className="rounded-lg border border-[#ece1d8] bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
        <h2 className="mb-4 text-right font-display text-xl font-extrabold text-[#1D1916]">قائمة الفواتير</h2>
        <div className="overflow-hidden rounded-md border border-[#eee4dc]">
          <div className="hidden bg-[#fbf7f2] px-4 py-3 text-xs font-extrabold text-[#6E6258] md:grid" style={invoiceGridStyle}>
            <span>رقم الفاتورة</span><span>نوع الفاتورة</span><span>التاريخ</span><span>المبلغ</span><span>الحالة</span><span>الإجراءات</span>
          </div>
          {invoices.length === 0 ? <div className="border-t border-[#eee4dc] px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد فواتير مطابقة للبحث الحالي.</div> : null}
          {invoices.map((invoice) => (
            <div key={invoice.id} className="grid gap-3 border-t border-[#eee4dc] px-4 py-3 text-sm font-bold text-[#1D1916] md:items-center" style={invoiceGridStyle}>
              <span>{invoice.invoiceNumber}</span>
              <span>{invoice.title}</span>
              <span>{formatDashboardDate(invoice.dueDate || invoice.issuedAt)}</span>
              <strong>{formatSar(invoice.amount)}</strong>
              <InvoiceStatus label={invoice.statusLabel} tone={invoice.tone} />
              <span className="flex gap-2">
                <Link href={dashboardHref(config.role, "payments")} className="inline-flex min-h-8 items-center rounded-md border border-[#ece1d8] px-3 text-xs font-extrabold">عرض</Link>
                <FinancialExportButton
                  filename={`${invoice.invoiceNumber}.csv`}
                  rows={[{ invoiceNumber: invoice.invoiceNumber, title: invoice.title, amount: invoice.amount, status: invoice.statusLabel, dueDate: invoice.dueDate }]}
                  className="inline-flex min-h-8 items-center gap-1 rounded-md border border-[#ece1d8] px-3 text-xs font-extrabold"
                  children="تحميل"
                />
                {invoice.status === "due" || invoice.status === "overdue" ? (
                  <PayInvoiceButton scope={scope} invoiceId={invoice.id} invoiceNumber={invoice.invoiceNumber} method={defaultPaymentMethod} testId={`pay-invoice-row-${invoice.invoiceNumber}`} className="min-h-8 rounded-md border border-[#B89A7A] px-3 text-xs font-extrabold text-[#A7815E]" />
                ) : null}
              </span>
            </div>
          ))}
          {!invoices.length ? <div className="border-t border-[#eee4dc] px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد فواتير حالياً.</div> : null}
        </div>
        <Link href={dashboardHref(config.role, "payments")} className="mt-4 block w-full text-center text-sm font-extrabold text-[#1D1916]">عرض المدفوعات ←</Link>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <SmallPanel title="الفواتير الأخيرة" items={invoices.slice(0, 3).map((invoice) => `${invoice.title} - ${formatSar(invoice.amount)}`)} action="عرض الكل" actionHref={dashboardHref(config.role, "invoices")} />
        <article className="rounded-lg border p-5 text-center shadow-[0_10px_24px_rgb(29_25_22/0.035)]" style={{ backgroundColor: "#fff7f0", borderColor: "#D9D1C7" }}>
          <Bell className="mx-auto h-8 w-8 text-[#A7815E]" />
          <h2 className="mt-2 font-display text-xl font-extrabold text-[#A7815E]">مستحق الدفع</h2>
          <p className="mt-2 text-sm font-extrabold text-[#1D1916]">{dueInvoice?.title ?? "لا توجد فاتورة مستحقة"}</p>
          <strong className="mt-3 block font-display text-3xl text-[#A7815E]">{formatSar(dueInvoice?.amount ?? 0)}</strong>
          <p className="mt-1 text-xs font-bold text-[#6E6258]">تاريخ الاستحقاق {formatDashboardDate(dueInvoice?.dueDate)}</p>
          {dueInvoice ? <PayInvoiceButton scope={scope} invoiceId={dueInvoice.id} invoiceNumber={dueInvoice.invoiceNumber} method={defaultPaymentMethod} testId={`pay-invoice-card-${dueInvoice.invoiceNumber}`} className="mt-4 min-h-11 rounded-md bg-[#A7815E] px-8 text-sm font-extrabold text-white" /> : null}
        </article>
        <SectionBox title="طرق الدفع المحفوظة" icon={<CircleDollarSign className="h-5 w-5" />}>
          <div className="grid grid-cols-3 gap-3 text-center">
            {financial.summary.paymentMethods.slice(0, 3).map((item) => <div key={item} className="rounded-md border border-[#eee4dc] p-4 text-sm font-extrabold text-[#1D1916]">{paymentMethodLabel(item)}</div>)}
          </div>
          <Link href={dashboardHref(config.role, "payments")} className="mt-4 flex min-h-10 w-full items-center justify-center rounded-md border border-[#B89A7A] text-sm font-extrabold text-[#A7815E]">إدارة وسائل الدفع</Link>
        </SectionBox>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <SectionBox title="التقارير المالية" icon={<FileText className="h-5 w-5" />}>
          <div className="grid grid-cols-2 gap-3">
            {["تحميل كشف حساب", "تقرير المدفوعات", "تقرير الفواتير", "تقرير الضرائب"].map((item) => <FinancialExportButton key={item} filename={`${scope}-${item}.csv`} rows={financeExportRows(financial)} className="rounded-lg border border-[#ece1d8] bg-white p-5 text-center text-sm font-extrabold text-[#1D1916] shadow-[0_10px_24px_rgb(29_25_22/0.025)]" children={item} />)}
          </div>
        </SectionBox>
        <ActivityList title="سجل العمليات المالية" items={[
          ...(invoices.slice(0, 2).map((invoice) => [`تم إصدار ${invoice.title}`, formatDashboardDate(invoice.issuedAt), <CheckCircle2 key={invoice.id} className="h-5 w-5 text-[#087342]" />] as [string, string, ReactNode])),
          ...(financial.payments.slice(0, 2).map((payment) => [`تم دفع ${payment.title}`, formatDashboardDate(payment.paidAt ?? payment.createdAt), <CheckCircle2 key={payment.id} className="h-5 w-5 text-[#087342]" />] as [string, string, ReactNode])),
        ]} />
        <SmallPanel title="إشعارات الفواتير" items={dueInvoice ? [`${dueInvoice.title} بانتظار الدفع`, "تذكير موعد الاستحقاق", "يمكن السداد عبر مدى أو البطاقة"] : ["لا توجد فواتير مستحقة", "تم تحديث السجل المالي", "يمكنك تحميل كشف الحساب"]} action="عرض الكل" actionHref={dashboardHref(config.role, "notifications")} />
      </section>
      <TrustDigitalStrip />
    </div>
  );
}

function PlanFeature({ label, included = true }: { label: string; included?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-[#eee4dc] py-2.5 text-sm font-bold last:border-b-0">
      <span className="text-[#1D1916]">{label}</span>
      {included ? <CheckCircle2 className="h-4 w-4 text-[#087342]" /> : <XCircle className="h-4 w-4 text-[#8F6B4C]" />}
    </div>
  );
}

function PlanBox({
  scope,
  title,
  price,
  amount,
  subtitle,
  active = false,
  features,
}: {
  scope: DashboardFinancialScope;
  title: string;
  price: string;
  amount: number;
  subtitle: string;
  active?: boolean;
  features: string[];
}) {
  const planName = `الباقة ${title}`;

  return (
    <article className="rounded-lg border bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]" style={{ borderColor: active ? "#A7815E" : "#ece1d8", backgroundColor: active ? "#fffaf7" : "#ffffff" }}>
      <div className="flex items-start justify-between gap-4">
        <Crown className="h-9 w-9 text-[#A7815E]" />
        <div>
          <h3 className="font-display text-2xl font-extrabold text-[#1D1916]">{title}</h3>
          <p className="mt-1 text-xs font-bold text-[#6E6258]">{subtitle}</p>
        </div>
      </div>
      <div className="mt-5 font-display text-4xl font-extrabold text-[#1D1916]">{price}</div>
      <p className="mt-1 text-xs font-bold text-[#6E6258]">شهرياً</p>
      <div className="mt-4">
        {features.map((item) => <PlanFeature key={item} label={item} />)}
      </div>
      {active ? (
        <div className="mt-5 grid min-h-11 w-full place-items-center rounded-md border bg-[#A7815E] px-5 text-sm font-extrabold text-white" style={{ borderColor: "#B89A7A" }}>
          الخطة الحالية
        </div>
      ) : (
        <SubscriptionPlanButton scope={scope} planName={planName} amount={amount} className="mt-5 flex min-h-11 w-full items-center justify-center rounded-md border border-[#B89A7A] bg-white px-5 text-sm font-extrabold text-[#A7815E]" >
          اختيار الخطة
        </SubscriptionPlanButton>
      )}
    </article>
  );
}

async function IndividualSubscriptionsPage({ config, actor = null }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null }) {
  const scope = financeScope(config.role);
  const financial = await listDashboardFinancial(scope, actor);
  const currentSubscription = financial.subscriptions[0];
  const dueInvoice = financial.invoices.find((invoice) => invoice.status === "due" || invoice.status === "overdue");
  const planName = currentSubscription?.planName ?? financial.summary.activePlan;
  const defaultPaymentMethod = financial.summary.paymentMethods[0] ?? "mada";

  return (
    <div className="grid gap-4">
      <IndividualPageHero
        title="الاشتراك"
        subtitle="إدارة خطة الاشتراك والمزايا والحدود المتاحة لحسابك في منصة مهابة."
        image="/images/dashboard-individual-hero.png"
        action={{ label: "عرض الفواتير", href: dashboardHref(config.role, "invoices") }}
      />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <IndividualKpiCard title="الخطة الحالية" value={planName.replace("الباقة ", "")} unit={financial.summary.subscriptionStatus} icon="crown" />
        <IndividualKpiCard title="الأيام المتبقية" value={String(financial.summary.subscriptionDaysRemaining)} unit="يوم" icon="clock" />
        <IndividualKpiCard title="المزايا المستخدمة" value="64%" unit="من الحدود المتاحة" icon="chart" tone="green" />
        <IndividualKpiCard title="الفاتورة القادمة" value={String(financial.summary.nextInvoiceAmount)} unit="ريال" icon="circle-dollar" />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <PlanBox scope={scope} title="أساسية" price="0 ريال" amount={0} subtitle="للبداية واستكشاف الفرص" active={planName.includes("أساسية")} features={["استعراض الأصول", "حفظ 5 اهتمامات", "إشعارات محدودة", "دعم عبر البريد"]} />
        <PlanBox scope={scope} title="احترافية" price={formatSar(scope === "business" ? 5000 : 500)} amount={scope === "business" ? 5000 : 500} subtitle={scope === "business" ? "الخطة المناسبة لحساب المنشآت" : "الخطة المناسبة للمستثمر الفردي"} active={planName.includes("احترافية")} features={["حفظ غير محدود", "مقارنات متقدمة", "تقارير شهرية", "دعم أولوية"]} />
        <PlanBox scope={scope} title="نخبة" price={formatSar(scope === "business" ? 12000 : 1200)} amount={scope === "business" ? 12000 : 1200} subtitle="للمتابعة المكثفة والفرص الخاصة" active={planName.includes("نخبة")} features={["فرص مبكرة", "مستشار مخصص", "تقارير تفصيلية", "جلسة شهرية"]} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.55fr]">
        <SectionBox title="تفاصيل الاشتراك الحالي" icon={<Crown className="h-5 w-5" />}>
          <DetailRow label="اسم الخطة" value={planName} />
          <DetailRow label="حالة الاشتراك" value={financial.summary.subscriptionStatus} icon={<CheckCircle2 className="h-4 w-4 text-[#087342]" />} />
          <DetailRow label="تاريخ التجديد" value={formatDashboardDate(currentSubscription?.endsAt)} />
          <DetailRow label="طريقة الدفع" value={paymentMethodLabel(defaultPaymentMethod)} />
          <DetailRow label="عدد المستخدمين" value={scope === "business" ? "5 مستخدمين" : "1 مستخدم"} />
          <Link href={dashboardHref(config.role, "payments")} className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md border border-[#B89A7A] px-6 text-sm font-extrabold text-[#A7815E]">تعديل الدفع</Link>
        </SectionBox>
        <article className="rounded-lg border p-5 text-center shadow-[0_10px_24px_rgb(29_25_22/0.035)]" style={{ backgroundColor: "#fff7f0", borderColor: "#D9D1C7" }}>
          <Bell className="mx-auto h-8 w-8 text-[#A7815E]" />
          <h2 className="mt-3 font-display text-xl font-extrabold text-[#1D1916]">تجديد قريب</h2>
          <p className="mt-2 text-sm font-bold leading-7 text-[#6E6258]">سيتم تجديد اشتراكك تلقائياً بعد {financial.summary.subscriptionDaysRemaining} يوم.</p>
          <strong className="mt-3 block font-display text-3xl text-[#A7815E]">{formatSar(currentSubscription?.amount ?? financial.summary.nextInvoiceAmount)}</strong>
          {dueInvoice ? (
            <PayInvoiceButton scope={scope} invoiceId={dueInvoice.id} invoiceNumber={dueInvoice.invoiceNumber} method={defaultPaymentMethod} testId={`pay-subscription-${dueInvoice.invoiceNumber}`} className="mt-4 min-h-11 rounded-md bg-[#A7815E] px-8 text-sm font-extrabold text-white" />
          ) : (
            <Link href={dashboardHref(config.role, "payments")} className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-[#A7815E] px-8 text-sm font-extrabold text-white">إدارة الدفع</Link>
          )}
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <SectionBox title="استخدام المزايا" icon={<BarChart3 className="h-5 w-5" />}>
          <DetailRow label="الأصول المحفوظة" value="28 / غير محدود" />
          <DetailRow label="المقارنات" value="7 / 20" />
          <DetailRow label="تقارير السوق" value="4 / 10" />
          <DetailRow label="طلبات الخدمة" value="5 / 10" />
        </SectionBox>
        <SmallPanel title="سجل الفواتير" items={financial.invoices.slice(0, 3).map((invoice) => `${invoice.title} - ${formatSar(invoice.amount)}`)} action="عرض الفواتير" actionHref={dashboardHref(config.role, "invoices")} />
        <ActivityList title="نشاط الاشتراك" items={[
          ["تم تجديد الاشتراك", formatDashboardDate(currentSubscription?.startsAt), <CheckCircle2 key="a" className="h-5 w-5 text-[#087342]" />],
          ["تم تحديث وسيلة الدفع", formatDashboardDate(financial.payments[0]?.createdAt), <CircleDollarSign key="b" className="h-5 w-5" />],
          ["تم إصدار فاتورة اشتراك", formatDashboardDate(financial.invoices[0]?.issuedAt), <FileText key="c" className="h-5 w-5" />],
        ]} />
      </section>
      <TrustDigitalStrip />
    </div>
  );
}

function TransactionRow({ id, title, date, amount, status, tone }: { id: string; title: string; date: string; amount: string; status: string; tone: TrendTone }) {
  return (
    <div className="grid gap-3 border-t border-[#eee4dc] px-4 py-3 text-sm font-bold text-[#1D1916] md:grid-cols-5 md:items-center">
      <span>{id}</span>
      <span>{title}</span>
      <span>{date}</span>
      <strong>{amount}</strong>
      <InvoiceStatus label={status} tone={tone} />
    </div>
  );
}

async function IndividualPaymentsPage({ config, actor = null }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null }) {
  const scope = financeScope(config.role);
  const financial = await listDashboardFinancial(scope, actor);
  const dueInvoice = financial.invoices.find((invoice) => invoice.status === "due" || invoice.status === "overdue");
  const successfulPayments = financial.payments.filter((payment) => payment.status === "succeeded");
  const defaultPaymentMethod = financial.summary.paymentMethods[0] ?? "mada";

  return (
    <div className="grid gap-4">
      <IndividualPageHero
        title="المدفوعات"
        subtitle="متابعة عمليات الدفع ووسائل السداد والمدفوعات المجدولة المرتبطة بحسابك."
        image="/images/dashboard-individual-hero.png"
        action={{ label: "عرض الفواتير", href: dashboardHref(config.role, "invoices") }}
      />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <IndividualKpiCard title="إجمالي المدفوعات" value={String(financial.summary.totalPaid)} unit="ريال" icon="circle-dollar" />
        <IndividualKpiCard title="عمليات ناجحة" value={String(successfulPayments.length)} unit="عملية" icon="shield" tone="green" />
        <IndividualKpiCard title="بانتظار الدفع" value={String(financial.summary.pendingInvoices + financial.payments.filter((payment) => payment.status === "pending").length)} unit="عمليات" icon="clock" />
        <IndividualKpiCard title="وسائل محفوظة" value={String(financial.summary.paymentMethods.length)} unit="وسائل" icon="file" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.45fr]">
        <section className="rounded-lg border border-[#ece1d8] bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <div className="mb-4 flex items-center justify-between">
            <FinancialExportButton filename={`mahabah-${scope}-payments.csv`} rows={financeExportRows(financial)} className="inline-flex items-center gap-2 text-sm font-extrabold text-[#A7815E]" children="تصدير العمليات" />
            <h2 className="font-display text-xl font-extrabold text-[#1D1916]">سجل المدفوعات</h2>
          </div>
          <div className="hidden grid-cols-5 rounded-t-md bg-[#fbf7f2] px-4 py-3 text-xs font-extrabold text-[#6E6258] md:grid">
            <span>رقم العملية</span><span>الوصف</span><span>التاريخ</span><span>المبلغ</span><span>الحالة</span>
          </div>
          {financial.payments.map((payment) => (
            <TransactionRow
              key={payment.id}
              id={payment.providerReference ?? payment.id}
              title={payment.title}
              date={formatDashboardDate(payment.paidAt ?? payment.createdAt)}
              amount={formatSar(payment.amount)}
              status={payment.statusLabel}
              tone={payment.tone}
            />
          ))}
          {!financial.payments.length ? <div className="border-t border-[#eee4dc] px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد عمليات دفع حتى الآن.</div> : null}
        </section>

        <div className="grid gap-4 content-start">
          <article className="rounded-lg border p-5 text-center shadow-[0_10px_24px_rgb(29_25_22/0.035)]" style={{ backgroundColor: "#fff7f0", borderColor: "#D9D1C7" }}>
            <Clock3 className="mx-auto h-8 w-8 text-[#A7815E]" />
            <h2 className="mt-3 font-display text-xl font-extrabold text-[#1D1916]">دفعة مستحقة</h2>
            <p className="mt-2 text-sm font-bold text-[#6E6258]">{dueInvoice?.title ?? "لا توجد دفعة مستحقة"}</p>
            <strong className="mt-3 block font-display text-3xl text-[#A7815E]">{formatSar(dueInvoice?.amount ?? 0)}</strong>
            {dueInvoice ? <PayInvoiceButton scope={scope} invoiceId={dueInvoice.id} invoiceNumber={dueInvoice.invoiceNumber} method={defaultPaymentMethod} testId={`pay-payment-card-${dueInvoice.invoiceNumber}`} className="mt-4 min-h-11 rounded-md bg-[#A7815E] px-8 text-sm font-extrabold text-white" /> : null}
          </article>
          <SectionBox title="وسائل الدفع" icon={<CircleDollarSign className="h-5 w-5" />}>
            <div className="grid gap-3">
              {financial.summary.paymentMethods.map((item, index) => (
                <div key={item} className="flex items-center justify-between rounded-md border border-[#eee4dc] p-3">
                  <span className="text-sm font-extrabold text-[#1D1916]">{paymentMethodLabel(item)} {index < 2 ? "**** " + (index === 0 ? "1025" : "8842") : ""}</span>
                  {index === 0 ? <span className="rounded-md bg-[#e8f7ec] px-2 py-1 text-xs font-extrabold text-[#087342]">افتراضية</span> : null}
                </div>
              ))}
            </div>
          </SectionBox>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <SmallPanel title="إشعارات الدفع" items={dueInvoice ? [`${dueInvoice.title} بانتظار الدفع`, "تذكير بموعد الاشتراك", "وسائل الدفع جاهزة"] : ["تمت عملية الدفع بنجاح", "لا توجد دفعات مستحقة", "وسائل الدفع محدثة"]} action="عرض الكل" actionHref={dashboardHref(config.role, "notifications")} />
        <ActivityList title="آخر العمليات" items={[
          ...(financial.payments.slice(0, 2).map((payment) => [`تم دفع ${payment.title}`, formatDashboardDate(payment.paidAt ?? payment.createdAt), <CheckCircle2 key={payment.id} className="h-5 w-5 text-[#087342]" />] as [string, string, ReactNode])),
          ["تم إنشاء فاتورة اشتراك", formatDashboardDate(financial.invoices[0]?.issuedAt), <FileText key="c" className="h-5 w-5" />],
        ]} />
        <SectionBox title="التقارير المالية" icon={<FileText className="h-5 w-5" />}>
          <div className="grid grid-cols-2 gap-3">
            {["كشف مدفوعات", "تقرير ضريبي", "كشف حساب", "تقرير اشتراك"].map((item) => <FinancialExportButton key={item} filename={`${scope}-${item}.csv`} rows={financeExportRows(financial)} className="rounded-lg border border-[#ece1d8] bg-white p-5 text-center text-sm font-extrabold text-[#1D1916] shadow-[0_10px_24px_rgb(29_25_22/0.025)]" children={item} />)}
          </div>
        </SectionBox>
      </section>
      <TrustDigitalStrip />
    </div>
  );
}

function CommunicationPageChrome({ title, active, children }: { title: string; active: string; children: ReactNode }) {
  return (
    <div className="grid min-w-0 max-w-full gap-4" style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
      <div className="relative max-w-full overflow-hidden border-b border-[#eee4dc] bg-white">
        <div className="mx-auto h-28 w-full max-w-5xl opacity-85">
          <Image src="/images/dashboard-individual-hero.png" alt="" width={1983} height={793} className="h-full w-full object-cover object-center" priority />
        </div>
      </div>
      <header className="grid justify-items-end gap-2 text-right">
        <h1 className="font-display text-3xl font-extrabold text-[#1D1916]">{title}</h1>
        <div className="text-sm font-bold text-[#6E6258]">
          الرئيسية <span className="mx-2 text-[#A7815E]">›</span> التواصل <span className="mx-2 text-[#A7815E]">›</span> <span className="text-[#A7815E]">{active}</span>
        </div>
      </header>
      {children}
      <CommunicationFooter />
    </div>
  );
}

function CommunicationFooter() {
  return (
    <footer className="grid gap-6 rounded-t-lg bg-[#1D1916] px-8 py-6 text-white md:grid-cols-[1fr_1fr_1.2fr]">
      <div>
        <strong className="block font-display text-3xl font-extrabold">مهابة</strong>
        <span className="mt-1 block text-[10px] font-bold tracking-[0.35em] text-[#A7815E]">MAHABAH</span>
        <p className="mt-2 text-xs font-bold text-white/70">إدارة المساهمات العقارية</p>
      </div>
      <div>
        <h2 className="text-sm font-extrabold text-[#A7815E]">روابط مهمة</h2>
        <div className="mt-3 grid gap-2 text-xs font-bold text-white/78">
          <span>سياسة الخصوصية</span>
          <span>شروط الاستخدام</span>
          <span>إخلاء المسؤولية</span>
        </div>
      </div>
      <div>
        <h2 className="text-sm font-extrabold text-[#A7815E]">تواصل معنا</h2>
        <div className="mt-3 grid gap-2 text-xs font-bold text-white/78">
          <span>0510151010</span>
          <span>info@mahabah.sa</span>
          <span>mahabah.sa</span>
          <span>الرياض - المملكة العربية السعودية</span>
        </div>
      </div>
      <p className="border-t border-white/10 pt-4 text-center text-xs font-bold text-white/68 md:col-span-3">جميع الحقوق محفوظة © 2025 - مهابة - إدارة المساهمات العقارية</p>
    </footer>
  );
}

function CommunicationStatCard({ title, value, unit, icon, tone = "copper" }: { title: string; value: string; unit: string; icon: ReactNode; tone?: "copper" | "green" | "blue" | "gray" }) {
  const colors = {
    copper: ["#fff4ee", "#A7815E"],
    green: ["#e8f7ec", "#087342"],
    blue: ["#eef6ff", "#2F6FB0"],
    gray: ["#f3f1ee", "#6E6258"],
  } as const;
  const [bg, fg] = colors[tone];

  return (
    <article className="flex min-h-28 items-center justify-between rounded-lg border border-[#ece1d8] bg-white px-6 py-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
      <span className="grid h-14 w-14 place-items-center rounded-full" style={{ backgroundColor: bg, color: fg }}>{icon}</span>
      <div className="text-right">
        <p className="text-sm font-extrabold text-[#1D1916]">{title}</p>
        <strong className="mt-2 block font-display text-3xl font-extrabold text-[#1D1916]">{value}</strong>
        <span className="text-xs font-bold text-[#6E6258]">{unit}</span>
      </div>
    </article>
  );
}

function ConversationPreview({ name, message, time, href, active = false, unread, icon }: { name: string; message: string; time: string; href: string; active?: boolean; unread?: number; icon?: ReactNode }) {
  return (
    <Link href={href} className="flex w-full items-center justify-between gap-3 border-b border-[#eee4dc] p-4 text-right last:border-b-0" style={{ backgroundColor: active ? "#F6F0EA" : "#ffffff" }}>
      <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#1D1916] ring-1 ring-[#ece1d8]">{icon ?? <UserRound className="h-5 w-5" />}</span>
      <span className="min-w-0 flex-1">
        <strong className="block text-sm text-[#1D1916]">{name}</strong>
        <small className="mt-1 block truncate text-xs font-bold text-[#6E6258]">{message}</small>
      </span>
      <span className="grid justify-items-end gap-1 text-xs font-bold text-[#6E6258]">
        {time}
        {unread ? <b className="grid h-5 min-w-5 place-items-center rounded-full bg-[#A7815E] px-1 text-[10px] text-white">{unread}</b> : null}
      </span>
    </Link>
  );
}

async function IndividualMessagesPage({ config, actor = null, searchParams = {} }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null; searchParams?: DashboardSearchParams }) {
  const scope = config.role === "business" ? "business" : "individual";
  const conversationsResult = await listDashboardConversations(scope, actor);
  const q = stringParam(searchParams, "q").trim();
  const selectedConversationRef = stringParam(searchParams, "conversation");
  const isNewConversation = stringParam(searchParams, "new") === "1";
  const allConversations = conversationsResult.data;
  const conversations = allConversations.filter((conversation) => matchesDashboardSearch(q, [conversation.id, conversation.subject, conversation.latestMessage, conversation.status]));
  const activeConversation = isNewConversation ? undefined : allConversations.find((conversation) => conversation.id === selectedConversationRef) ?? conversations[0] ?? allConversations[0];
  const messagesResult = isNewConversation ? { data: [], source: conversationsResult.source } : await listDashboardMessages(scope, activeConversation?.id, actor);
  const messages = messagesResult.data;
  const activeConversationId = isNewConversation ? undefined : activeConversation?.id ?? messages[0]?.conversationId;
  const threadMessages = messages.map((message) => ({
    id: message.id,
    text: message.body,
    time: formatDashboardDateTime(message.createdAt),
    mine: message.mine,
  }));
  const activeSubject = isNewConversation ? "محادثة جديدة" : activeConversation?.subject ?? "فريق مهابة";
  const latestAt = activeConversation?.latestAt ?? messages.at(-1)?.createdAt;
  return (
    <CommunicationPageChrome title="الرسائل" active="الرسائل">
      <section className="grid gap-4 xl:grid-cols-3" dir="ltr">
        <aside className="overflow-hidden rounded-lg border border-[#ece1d8] bg-white shadow-[0_10px_24px_rgb(29_25_22/0.035)]" dir="rtl">
          <div className="flex min-h-16 items-center justify-between border-b border-[#eee4dc] px-5">
            <Link href={dashboardHref(config.role, "messages?new=1")} className="grid h-10 w-10 place-items-center rounded-md border border-[#ece1d8] text-[#1D1916]" aria-label="رسالة جديدة">
              <PenLine className="h-5 w-5" />
            </Link>
            <h2 className="font-display text-lg font-extrabold text-[#1D1916]">المحادثات</h2>
          </div>
          <div className="border-b border-[#eee4dc] p-4">
            <form action={dashboardHref(config.role, "messages")} className="relative block">
              <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E6258]" />
              <input name="q" defaultValue={q} className="h-11 w-full rounded-md border border-[#ece1d8] bg-white pl-16 pr-11 text-sm font-bold outline-none" placeholder="بحث في المحادثات..." />
              <button type="submit" className="absolute left-2 top-1/2 h-7 -translate-y-1/2 rounded bg-[#1D1916] px-3 text-[11px] font-extrabold text-white">بحث</button>
            </form>
          </div>
          {conversations.map((conversation, index) => (
            <ConversationPreview
              key={conversation.id}
              name={conversation.subject}
              message={conversation.latestMessage ?? "لا توجد رسائل بعد"}
              time={formatDashboardDateTime(conversation.latestAt)}
              href={dashboardHref(config.role, `messages?conversation=${encodeURIComponent(conversation.id)}`)}
              active={conversation.id === activeConversation?.id}
              unread={conversation.id === activeConversation?.id && messages.some((message) => !message.mine && !message.readAt) ? messages.filter((message) => !message.mine && !message.readAt).length : undefined}
              icon={index === 0 ? <span className="text-xs font-extrabold">مهابة</span> : <MessageSquare className="h-5 w-5" />}
            />
          ))}
          {!conversations.length ? <p className="p-5 text-center text-sm font-extrabold text-[#6E6258]">لا توجد محادثات مطابقة.</p> : null}
          {conversationsResult.error ? <p className="m-4 rounded-md border border-[#F0D8B8] bg-[#fff7ec] p-3 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل المحادثات الحية.</p> : null}
        </aside>

        <main className="grid min-h-[610px] overflow-hidden rounded-lg border border-[#ece1d8] bg-white shadow-[0_10px_24px_rgb(29_25_22/0.035)]" dir="rtl">
          <header className="flex min-h-20 items-center justify-end border-b border-[#eee4dc] px-6">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <h2 className="font-display text-xl font-extrabold text-[#1D1916]">{activeSubject}</h2>
                <p className="mt-1 flex items-center justify-end gap-2 text-xs font-bold text-[#087342]"><span className="h-2 w-2 rounded-full bg-[#087342]" /> متصل</p>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#1D1916] text-xs font-extrabold text-white">مهابة</span>
            </div>
          </header>
          <DashboardMessageThread scope={scope} conversationId={activeConversationId} initialMessages={threadMessages} createNew={isNewConversation} subject={activeSubject} />
          {messagesResult.error ? <p className="px-6 pb-4 text-center text-xs font-extrabold text-[#8F6B4C]">تعذر تحميل الرسائل الحية.</p> : null}
        </main>

        <aside className="grid gap-4 content-start" dir="rtl">
          <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-center shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-[#ece1d8] bg-white">
              <strong className="font-display text-2xl text-[#1D1916]">مهابة</strong>
            </div>
            <h2 className="mt-4 font-display text-xl font-extrabold text-[#1D1916]">فريق مهابة</h2>
            <p className="mt-1 text-sm font-bold text-[#6E6258]">فريق خدمة العملاء</p>
            <Link href={dashboardHref(config.role, "profile")} className="mt-5 grid min-h-11 w-full place-items-center rounded-md border border-[#B89A7A] text-sm font-extrabold text-[#A7815E]">عرض الملف الشخصي</Link>
          </article>
          <SectionBox title="تفاصيل المحادثة" icon={<Info className="h-5 w-5" />}>
            <DetailRow label="رقم المحادثة" value={activeConversationId ?? "غير محدد"} />
            <DetailRow label="حالة المحادثة" value={activeConversation?.status ?? "غير محدد"} />
            <DetailRow label="آخر نشاط" value={formatDashboardDateTime(latestAt)} />
          </SectionBox>
          <SectionBox title="الملفات المشتركة" icon={<FileText className="h-5 w-5" />}>
            <p className="py-4 text-center text-sm font-bold text-[#6E6258]">لا توجد ملفات مشتركة</p>
          </SectionBox>
          <ArchiveConversationButton scope={scope} conversationId={activeConversationId} className="grid min-h-12 place-items-center rounded-md border border-[#B89A7A] bg-white text-sm font-extrabold text-[#9C3D22]">حذف المحادثة</ArchiveConversationButton>
        </aside>
      </section>
    </CommunicationPageChrome>
  );
}

async function AdminMessagesPage({ config, actor = null, searchParams = {} }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null; searchParams?: DashboardSearchParams }) {
  const conversationsResult = await listDashboardAdminConversations();
  const q = stringParam(searchParams, "q").trim();
  const selectedConversationRef = stringParam(searchParams, "conversation");
  const allConversations = conversationsResult.data;
  const conversations = allConversations.filter((conversation) => matchesDashboardSearch(q, [conversation.id, conversation.subject, conversation.latestMessage, conversation.status, conversation.ownerLabel]));
  const activeConversation = allConversations.find((conversation) => conversation.id === selectedConversationRef) ?? conversations[0] ?? allConversations[0];
  const messagesResult = await listDashboardAdminMessages(activeConversation?.id, actor);
  const threadMessages = messagesResult.data.map((message) => ({
    id: message.id,
    text: message.body,
    time: formatDashboardDateTime(message.createdAt),
    mine: message.mine,
  }));
  const unreadCount = messagesResult.data.filter((message) => !message.mine && !message.readAt).length;

  return (
    <div className="grid gap-5">
      <DashboardTopbar config={config} />
      <section className="rounded-[24px] border bg-white p-5 shadow-card md:p-6" style={{ borderColor: uiColors.border }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <StatusPill label="مركز الرسائل" tone="gold" />
            <h1 className="mt-3 font-display text-3xl font-extrabold text-[#1D1916]">رسائل العملاء والمنشآت</h1>
            <p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-[#6E6258]">متابعة محادثات الأفراد وحسابات الأعمال والرد عليها مباشرة من بيانات Supabase مع تسجيل الأثر في سجل النشاط.</p>
          </div>
          <Link href={dashboardHref("admin", "support")} className="inline-flex min-h-11 items-center justify-center rounded-xl border bg-white px-5 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>فتح تذاكر الدعم</Link>
        </div>
      </section>

      {conversationsResult.error || messagesResult.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل بعض بيانات الرسائل الحية.</section> : null}

      <section className="grid gap-4 md:grid-cols-3">
        <CommunicationStatCard title="إجمالي المحادثات" value={String(allConversations.length)} unit="محادثة" icon={<MessageSquare className="h-7 w-7" />} />
        <CommunicationStatCard title="رسائل غير مقروءة" value={String(unreadCount)} unit="رسائل" icon={<Bell className="h-7 w-7" />} tone="copper" />
        <CommunicationStatCard title="حسابات أعمال" value={String(allConversations.filter((conversation) => Boolean(conversation.organizationId)).length)} unit="محادثة" icon={<BriefcaseBusiness className="h-7 w-7" />} tone="blue" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.85fr_1.35fr_0.65fr]">
        <aside className="overflow-hidden rounded-[22px] border bg-white shadow-card" style={{ borderColor: uiColors.border }}>
          <div className="border-b border-[#eee4dc] p-5">
            <h2 className="font-display text-xl font-extrabold text-[#1D1916]">المحادثات</h2>
            <form action={dashboardHref("admin", "messages")} className="relative mt-4 block">
              <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E6258]" />
              <input name="q" defaultValue={q} className="h-11 w-full rounded-md border border-[#ece1d8] bg-white pl-16 pr-11 text-sm font-bold outline-none" placeholder="بحث بالعميل أو الموضوع..." />
              <button type="submit" className="absolute left-2 top-1/2 h-7 -translate-y-1/2 rounded bg-[#1D1916] px-3 text-[11px] font-extrabold text-white">بحث</button>
            </form>
          </div>
          {conversations.map((conversation) => (
            <ConversationPreview
              key={conversation.id}
              name={conversation.ownerLabel ?? conversation.subject}
              message={conversation.latestMessage ?? conversation.subject}
              time={formatDashboardDateTime(conversation.latestAt)}
              href={dashboardHref("admin", `messages?conversation=${encodeURIComponent(conversation.id)}`)}
              active={conversation.id === activeConversation?.id}
              icon={conversation.organizationId ? <BriefcaseBusiness className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
            />
          ))}
          {!conversations.length ? <p className="p-5 text-center text-sm font-extrabold text-[#6E6258]">لا توجد محادثات مطابقة.</p> : null}
        </aside>

        <main className="grid min-h-[650px] overflow-hidden rounded-[22px] border bg-white shadow-card" style={{ borderColor: uiColors.border }}>
          <header className="flex min-h-20 items-center justify-between border-b border-[#eee4dc] px-6">
            <div className="text-right">
              <h2 className="font-display text-xl font-extrabold text-[#1D1916]">{activeConversation?.subject ?? "لا توجد محادثة محددة"}</h2>
              <p className="mt-1 text-xs font-bold text-[#6E6258]">{activeConversation?.ownerLabel ?? "اختر محادثة من القائمة"}</p>
            </div>
            {activeConversation ? <InvoiceStatus label={activeConversation.status === "open" ? "مفتوحة" : activeConversation.status} tone={activeConversation.status === "open" ? "green" : "blue"} /> : null}
          </header>
          <AdminMessageThread conversationId={activeConversation?.id} initialMessages={threadMessages} />
        </main>

        <aside className="grid content-start gap-4">
          <SectionBox title="تفاصيل المحادثة" icon={<Info className="h-5 w-5" />}>
            <DetailRow label="رقم المحادثة" value={activeConversation?.id ?? "غير محدد"} />
            <DetailRow label="العميل" value={activeConversation?.ownerLabel ?? "غير محدد"} />
            <DetailRow label="النوع" value={activeConversation?.organizationId ? "حساب أعمال" : "حساب فردي"} />
            <DetailRow label="آخر نشاط" value={formatDashboardDateTime(activeConversation?.latestAt)} />
          </SectionBox>
          <AdminArchiveConversationButton conversationId={activeConversation?.id} className="grid min-h-12 place-items-center rounded-md border border-[#B89A7A] bg-white text-sm font-extrabold text-[#9C3D22]">أرشفة المحادثة</AdminArchiveConversationButton>
          <Link href={dashboardHref("admin", "notifications")} className="grid min-h-12 place-items-center rounded-md bg-[#1D1916] text-sm font-extrabold text-white">إرسال إشعار</Link>
        </aside>
      </section>
    </div>
  );
}

function supportStatusMeta(status: string): { label: string; tone: TrendTone } {
  const normalized = status.toLowerCase();
  if (normalized === "submitted" || normalized === "new" || normalized === "open") return { label: "مفتوحة", tone: "green" };
  if (normalized === "in_progress" || normalized === "assigned") return { label: "قيد المعالجة", tone: "gold" };
  if (normalized === "draft" || normalized === "pending") return { label: "قيد الإنتظار", tone: "blue" };
  if (normalized === "completed" || normalized === "closed") return { label: "مغلقة", tone: "blue" };
  if (normalized === "rejected" || normalized === "cancelled") return { label: "مغلقة", tone: "red" };
  return { label: status, tone: "gold" };
}

function TicketRow({ ticket, role }: { ticket: DashboardSupportTicket; role: DashboardRole }) {
  const status = supportStatusMeta(ticket.status);
  return (
    <div className="grid gap-3 border-t border-[#eee4dc] px-4 py-3 text-sm font-bold text-[#1D1916] md:grid-cols-5 md:items-center">
      <span>{ticket.ticketNumber}</span>
      <span>{ticket.title}</span>
      <span>{ticket.category}</span>
      <InvoiceStatus label={status.label} tone={status.tone} />
      <Link href={dashboardHref(role, `support?ticket=${encodeURIComponent(ticket.id)}`)} className="grid min-h-9 place-items-center rounded-md border border-[#B89A7A] text-xs font-extrabold text-[#A7815E]">عرض</Link>
    </div>
  );
}

async function IndividualSupportPage({ config, searchParams = {}, actor = null }: { config: DashboardRoleConfig; searchParams?: Record<string, string | string[] | undefined>; actor?: DashboardActorContext | null }) {
  const scope = config.role === "business" ? "business" : "individual";
  const ticketsResult = await listDashboardSupportTickets(scope, actor);
  const q = stringParam(searchParams, "q").trim();
  const activeStatus = stringParam(searchParams, "status").trim();
  const allTickets = ticketsResult.data;
  const tickets = allTickets.filter((ticket) => {
    const normalizedStatus = ticket.status.toLowerCase();
    const statusMatches = !activeStatus
      || (activeStatus === "open" && ["submitted", "new", "open"].includes(normalizedStatus))
      || (activeStatus === "pending" && ["draft", "pending"].includes(normalizedStatus))
      || (activeStatus === "in_progress" && ["in_progress", "assigned"].includes(normalizedStatus))
      || (activeStatus === "closed" && ["completed", "closed", "rejected", "cancelled"].includes(normalizedStatus));
    return statusMatches && matchesDashboardSearch(q, [ticket.id, ticket.ticketNumber, ticket.title, ticket.category, ticket.status]);
  });
  const selectedTicketId = stringParam(searchParams, "ticket") || tickets[0]?.id;
  const ticketDetail = selectedTicketId ? await getDashboardSupportTicket(scope, selectedTicketId, actor) : { ticket: null, messages: [], source: ticketsResult.source as "supabase" | "static" };
  const openTickets = allTickets.filter((ticket) => ["submitted", "new", "open"].includes(ticket.status.toLowerCase()));
  const pendingTickets = allTickets.filter((ticket) => ["draft", "pending"].includes(ticket.status.toLowerCase()));
  const processingTickets = allTickets.filter((ticket) => ["in_progress", "assigned"].includes(ticket.status.toLowerCase()));
  const closedTickets = allTickets.filter((ticket) => ["completed", "closed", "rejected", "cancelled"].includes(ticket.status.toLowerCase()));
  return (
    <CommunicationPageChrome title="الدعم الفني" active="الدعم الفني">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CommunicationStatCard title="التذاكر المفتوحة" value={String(openTickets.length)} unit="تذاكر" icon={<MessageSquare className="h-7 w-7" />} tone="green" />
        <CommunicationStatCard title="قيد الإنتظار" value={String(pendingTickets.length)} unit="تذكرة" icon={<FileText className="h-7 w-7" />} tone="blue" />
        <CommunicationStatCard title="قيد المعالجة" value={String(processingTickets.length)} unit="تذكرة" icon={<Clock3 className="h-7 w-7" />} />
        <CommunicationStatCard title="التذاكر المغلقة" value={String(closedTickets.length)} unit="تذكرة" icon={<CheckCircle2 className="h-7 w-7" />} tone="green" />
      </section>

      <section className="grid gap-4 xl:grid-cols-2" dir="ltr">
        <div dir="rtl">
        <SectionBox title="إنشاء تذكرة جديدة" icon={<FileText className="h-5 w-5" />}>
          <DashboardSupportTicketForm scope={scope} />
        </SectionBox>
        </div>

        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]" dir="rtl">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-extrabold text-[#1D1916]">سجل التذاكر</h2>
            <form action={dashboardHref(config.role, "support")} className="flex gap-3">
              <label className="relative block">
                <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E6258]" />
                <input name="q" defaultValue={q} className="h-11 w-72 rounded-md border border-[#ece1d8] pr-11 text-sm font-bold outline-none" placeholder="بحث برقم التذكرة أو عنوان المشكلة..." />
              </label>
              <select name="status" defaultValue={activeStatus} className="h-11 rounded-md border border-[#ece1d8] px-4 text-sm font-bold text-[#6E6258] outline-none">
                <option value="">كل الحالات</option>
                <option value="open">مفتوحة</option>
                <option value="pending">قيد الإنتظار</option>
                <option value="in_progress">قيد المعالجة</option>
                <option value="closed">مغلقة</option>
              </select>
              <button type="submit" className="h-11 rounded-md bg-[#1D1916] px-5 text-sm font-extrabold text-white">بحث</button>
            </form>
          </div>
          <div className="hidden rounded-t-md bg-[#fbf7f2] px-4 py-3 text-xs font-extrabold text-[#6E6258] md:grid md:grid-cols-5">
            <span>رقم التذكرة</span><span>الموضوع</span><span>التصنيف</span><span>الحالة</span><span>الإجراء</span>
          </div>
          {tickets.map((ticket) => <TicketRow key={ticket.id} ticket={ticket} role={config.role} />)}
          {!tickets.length ? <p className="border-t border-[#eee4dc] px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد تذاكر دعم مطابقة.</p> : null}
          {ticketsResult.error ? <p className="mt-4 rounded-md border border-[#F0D8B8] bg-[#fff7ec] p-3 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل تذاكر الدعم الحية، وتم عرض المتاح فقط.</p> : null}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-[#6E6258]">
            <span>عرض {tickets.length ? `1 - ${tickets.length}` : "0"} من {tickets.length} تذكرة</span>
            <div className="flex gap-2">
              {["»", "1", "2", "3", "...", "7", "«"].map((item, index) => (
                <Link key={`${item}-${index}`} href={dashboardHref(config.role, `support?page=${item === "»" ? "previous" : item === "«" ? "next" : item === "..." ? "more" : item}`)} className={cn("grid h-9 min-w-9 place-items-center rounded-md border border-[#ece1d8] px-2", item === "1" ? "bg-[#A7815E] text-white" : "bg-white text-[#1D1916]")}>{item}</Link>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]" dir="rtl">
        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-extrabold text-[#1D1916]">تفاصيل التذكرة</h2>
              <p className="mt-1 text-sm font-bold text-[#6E6258]">{ticketDetail.ticket?.ticketNumber ?? "لا توجد تذكرة محددة"}</p>
            </div>
            {ticketDetail.ticket ? <InvoiceStatus label={supportStatusMeta(ticketDetail.ticket.status).label} tone={supportStatusMeta(ticketDetail.ticket.status).tone} /> : null}
          </div>
          {ticketDetail.ticket ? (
            <div className="grid gap-4">
              <div className="grid gap-3 md:grid-cols-2">
                <DetailRow label="الموضوع" value={ticketDetail.ticket.title} />
                <DetailRow label="التصنيف" value={ticketDetail.ticket.category} />
                <DetailRow label="الأولوية" value={ticketDetail.ticket.priority} />
                <DetailRow label="آخر تحديث" value={formatDashboardDateTime(ticketDetail.ticket.updatedAt ?? ticketDetail.ticket.createdAt)} />
              </div>
              <div className="rounded-md border border-[#eee4dc] bg-[#fbf8f4] p-4">
                <h3 className="text-sm font-extrabold text-[#1D1916]">وصف المشكلة</h3>
                <p className="mt-2 text-sm font-bold leading-7 text-[#6E6258]">{ticketDetail.ticket.description ?? "لا يوجد وصف مرفق."}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <DashboardSupportTicketUpdateButton scope={scope} ticketId={ticketDetail.ticket.id} status="submitted" className="min-h-11 rounded-md border border-[#B89A7A] bg-white px-5 text-sm font-extrabold text-[#A7815E]">
                  إعادة فتح التذكرة
                </DashboardSupportTicketUpdateButton>
                <DashboardSupportTicketUpdateButton scope={scope} ticketId={ticketDetail.ticket.id} status="completed" className="min-h-11 rounded-md bg-[#087342] px-5 text-sm font-extrabold text-white">
                  إغلاق التذكرة
                </DashboardSupportTicketUpdateButton>
                <DashboardSupportTicketUpdateButton scope={scope} ticketId={ticketDetail.ticket.id} status="cancelled" className="min-h-11 rounded-md border border-[#efc5b9] bg-[#fff0eb] px-5 text-sm font-extrabold text-[#9C3D22]">
                  إلغاء التذكرة
                </DashboardSupportTicketUpdateButton>
              </div>
            </div>
          ) : (
            <p className="py-8 text-center text-sm font-extrabold text-[#6E6258]">اختر تذكرة من السجل لعرض التفاصيل.</p>
          )}
          {ticketDetail.error ? <p className="mt-4 rounded-md border border-[#F0D8B8] bg-[#fff7ec] p-3 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل تفاصيل التذكرة كاملة.</p> : null}
        </article>

        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <h2 className="font-display text-xl font-extrabold text-[#1D1916]">محادثة التذكرة</h2>
          <div className="mt-4 grid max-h-80 gap-3 overflow-auto rounded-md border border-[#eee4dc] bg-[#fbf8f4] p-4">
            {ticketDetail.messages.map((message) => (
              <div key={message.id} className={cn("rounded-md border p-3 text-sm font-bold leading-7", message.mine ? "mr-8 bg-[#F4EAE0] text-[#1D1916]" : "ml-8 bg-white text-[#1D1916]")} style={{ borderColor: "#ece1d8" }}>
                <p>{message.body}</p>
                <span className="mt-1 block text-xs text-[#6E6258]">{formatDashboardDateTime(message.createdAt)}</span>
              </div>
            ))}
            {!ticketDetail.messages.length ? <p className="py-5 text-center text-sm font-extrabold text-[#6E6258]">لا توجد ردود على هذه التذكرة بعد.</p> : null}
          </div>
          {ticketDetail.ticket ? (
            <div className="mt-4">
              <DashboardSupportTicketReplyForm scope={scope} ticketId={ticketDetail.ticket.id} />
            </div>
          ) : null}
        </article>
      </section>
    </CommunicationPageChrome>
  );
}

async function AdminSupportPage({ config, searchParams = {}, actor = null }: { config: DashboardRoleConfig; searchParams?: Record<string, string | string[] | undefined>; actor?: DashboardActorContext | null }) {
  const ticketsResult = await listDashboardAdminSupportTickets();
  const q = stringParam(searchParams, "q").trim();
  const activeStatus = stringParam(searchParams, "status").trim();
  const allTickets = ticketsResult.data;
  const tickets = allTickets.filter((ticket) => {
    const normalizedStatus = ticket.status.toLowerCase();
    const statusMatches = !activeStatus
      || (activeStatus === "open" && ["submitted", "new", "open"].includes(normalizedStatus))
      || (activeStatus === "in_progress" && ["in_progress", "assigned"].includes(normalizedStatus))
      || (activeStatus === "closed" && ["completed", "closed", "cancelled", "rejected"].includes(normalizedStatus))
      || (activeStatus === "business" && Boolean(ticket.organizationId));
    return statusMatches && matchesDashboardSearch(q, [ticket.id, ticket.ticketNumber, ticket.title, ticket.category, ticket.status, ticket.ownerLabel, ticket.priority]);
  });
  const selectedTicketId = stringParam(searchParams, "ticket") || tickets[0]?.id;
  const ticketDetail = selectedTicketId ? await getDashboardAdminSupportTicket(selectedTicketId, actor) : { ticket: null, messages: [], source: ticketsResult.source as "supabase" | "static" };
  const openTickets = allTickets.filter((ticket) => ["submitted", "new", "open"].includes(ticket.status.toLowerCase()));
  const processingTickets = allTickets.filter((ticket) => ["in_progress", "assigned"].includes(ticket.status.toLowerCase()));
  const closedTickets = allTickets.filter((ticket) => ["completed", "closed", "cancelled", "rejected"].includes(ticket.status.toLowerCase()));
  const businessTickets = allTickets.filter((ticket) => Boolean(ticket.organizationId));

  return (
    <div className="grid gap-5">
      <DashboardTopbar config={config} />
      <section className="rounded-[24px] border bg-white p-5 shadow-card md:p-6" style={{ borderColor: uiColors.border }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <StatusPill label="مركز الدعم" tone="gold" />
            <h1 className="mt-3 font-display text-3xl font-extrabold text-[#1D1916]">الدعم والرسائل</h1>
            <p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-[#6E6258]">إدارة تذاكر الدعم الواردة من حسابات الأفراد والأعمال، تحديث الحالات، والرد على العملاء من قاعدة البيانات.</p>
          </div>
          <Link href={dashboardHref("admin", "settings/messages")} className="inline-flex min-h-11 items-center justify-center rounded-xl border bg-white px-5 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إعدادات الرسائل</Link>
        </div>
      </section>

      {ticketsResult.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل تذاكر الدعم الحية، وتم عرض البيانات المتاحة.</section> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CommunicationStatCard title="إجمالي التذاكر" value={String(allTickets.length)} unit="تذكرة" icon={<FileText className="h-7 w-7" />} />
        <CommunicationStatCard title="مفتوحة" value={String(openTickets.length)} unit="تذاكر" icon={<MessageSquare className="h-7 w-7" />} tone="green" />
        <CommunicationStatCard title="قيد المعالجة" value={String(processingTickets.length)} unit="تذكرة" icon={<Clock3 className="h-7 w-7" />} tone="blue" />
        <CommunicationStatCard title="حسابات أعمال" value={String(businessTickets.length)} unit="تذاكر" icon={<BriefcaseBusiness className="h-7 w-7" />} tone="gray" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.85fr]">
        <article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-extrabold text-[#1D1916]">سجل تذاكر الدعم</h2>
            <form action={dashboardHref("admin", "support")} className="flex flex-wrap gap-3">
              <label className="relative block">
                <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E6258]" />
                <input name="q" defaultValue={q} className="h-11 w-72 rounded-md border border-[#ece1d8] pr-11 text-sm font-bold outline-none" placeholder="بحث برقم التذكرة أو العميل..." />
              </label>
              <select name="status" defaultValue={activeStatus} className="h-11 rounded-md border border-[#ece1d8] px-4 text-sm font-bold text-[#6E6258] outline-none">
                <option value="">كل الحالات</option>
                <option value="open">مفتوحة</option>
                <option value="in_progress">قيد المعالجة</option>
                <option value="closed">مغلقة</option>
                <option value="business">حسابات أعمال</option>
              </select>
              <button type="submit" className="h-11 rounded-md bg-[#1D1916] px-5 text-sm font-extrabold text-white">بحث</button>
            </form>
          </div>
          <div className="overflow-hidden rounded-xl border" style={{ borderColor: uiColors.border }}>
            <div className="hidden bg-[#fbf7f2] px-4 py-3 text-xs font-extrabold text-[#6E6258] md:grid md:grid-cols-[0.8fr_1.2fr_0.9fr_0.7fr_0.7fr_0.6fr]">
              <span>رقم التذكرة</span><span>الموضوع</span><span>العميل</span><span>التصنيف</span><span>الحالة</span><span>إجراء</span>
            </div>
            {tickets.map((ticket) => {
              const status = supportStatusMeta(ticket.status);
              return (
                <div key={ticket.id} className="grid gap-3 border-t border-[#eee4dc] px-4 py-3 text-sm font-bold text-[#1D1916] md:grid-cols-[0.8fr_1.2fr_0.9fr_0.7fr_0.7fr_0.6fr] md:items-center">
                  <span>{ticket.ticketNumber}</span>
                  <span>{ticket.title}</span>
                  <span>{ticket.ownerLabel ?? "غير محدد"}</span>
                  <span>{ticket.category}</span>
                  <InvoiceStatus label={status.label} tone={status.tone} />
                  <Link href={dashboardHref("admin", `support?ticket=${encodeURIComponent(ticket.id)}`)} className="grid min-h-9 place-items-center rounded-md border border-[#B89A7A] text-xs font-extrabold text-[#A7815E]">عرض</Link>
                </div>
              );
            })}
            {!tickets.length ? <p className="border-t border-[#eee4dc] px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد تذاكر دعم حالياً.</p> : null}
          </div>
        </article>

        <aside className="grid content-start gap-4">
          <article className="rounded-[22px] border bg-white p-5 text-right shadow-card" style={{ borderColor: uiColors.border }}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-extrabold text-[#1D1916]">تفاصيل التذكرة</h2>
                <p className="mt-1 text-sm font-bold text-[#6E6258]">{ticketDetail.ticket?.ticketNumber ?? "لا توجد تذكرة محددة"}</p>
              </div>
              {ticketDetail.ticket ? <InvoiceStatus label={supportStatusMeta(ticketDetail.ticket.status).label} tone={supportStatusMeta(ticketDetail.ticket.status).tone} /> : null}
            </div>
            {ticketDetail.ticket ? (
              <div className="grid gap-3">
                <DetailRow label="العميل" value={ticketDetail.ticket.ownerLabel ?? "غير محدد"} />
                <DetailRow label="الموضوع" value={ticketDetail.ticket.title} />
                <DetailRow label="التصنيف" value={ticketDetail.ticket.category} />
                <DetailRow label="آخر تحديث" value={formatDashboardDateTime(ticketDetail.ticket.updatedAt ?? ticketDetail.ticket.createdAt)} />
                <p className="rounded-md border border-[#eee4dc] bg-[#fbf8f4] p-3 text-sm font-bold leading-7 text-[#6E6258]">{ticketDetail.ticket.description ?? "لا يوجد وصف مرفق."}</p>
                <div className="grid gap-2 md:grid-cols-3">
                  <AdminSupportTicketUpdateButton ticketId={ticketDetail.ticket.id} status="in_progress" className="min-h-10 rounded-md border border-[#B89A7A] bg-white px-3 text-xs font-extrabold text-[#A7815E]">معالجة</AdminSupportTicketUpdateButton>
                  <AdminSupportTicketUpdateButton ticketId={ticketDetail.ticket.id} status="completed" className="min-h-10 rounded-md bg-[#087342] px-3 text-xs font-extrabold text-white">إغلاق</AdminSupportTicketUpdateButton>
                  <AdminSupportTicketUpdateButton ticketId={ticketDetail.ticket.id} status="cancelled" className="min-h-10 rounded-md border border-[#efc5b9] bg-[#fff0eb] px-3 text-xs font-extrabold text-[#9C3D22]">إلغاء</AdminSupportTicketUpdateButton>
                </div>
              </div>
            ) : <p className="py-8 text-center text-sm font-extrabold text-[#6E6258]">اختر تذكرة لعرض التفاصيل.</p>}
          </article>

          <article className="rounded-[22px] border bg-white p-5 text-right shadow-card" style={{ borderColor: uiColors.border }}>
            <h2 className="font-display text-xl font-extrabold text-[#1D1916]">محادثة التذكرة</h2>
            <div className="mt-4 grid max-h-72 gap-3 overflow-auto rounded-md border border-[#eee4dc] bg-[#fbf8f4] p-4">
              {ticketDetail.messages.map((message) => (
                <div key={message.id} className={cn("rounded-md border p-3 text-sm font-bold leading-7", message.mine ? "mr-8 bg-[#F4EAE0]" : "ml-8 bg-white")} style={{ borderColor: "#ece1d8" }}>
                  <p>{message.body}</p>
                  <span className="mt-1 block text-xs text-[#6E6258]">{formatDashboardDateTime(message.createdAt)}{message.internal ? " · داخلي" : ""}</span>
                </div>
              ))}
              {!ticketDetail.messages.length ? <p className="py-5 text-center text-sm font-extrabold text-[#6E6258]">لا توجد ردود بعد.</p> : null}
            </div>
            {ticketDetail.ticket ? <div className="mt-4"><AdminSupportTicketReplyForm ticketId={ticketDetail.ticket.id} /></div> : null}
            {ticketDetail.error ? <p className="mt-4 rounded-md border border-[#F0D8B8] bg-[#fff7ec] p-3 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل تفاصيل التذكرة كاملة.</p> : null}
          </article>
        </aside>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <SettingsPanel title="توزيع الحالات"><div className="grid gap-3">{[["مفتوحة", openTickets.length], ["قيد المعالجة", processingTickets.length], ["مغلقة", closedTickets.length]].map(([label, count]) => <div key={label} className="flex items-center justify-between rounded-xl border p-3 text-sm font-bold" style={{ borderColor: uiColors.border }}><span>{label}</span><strong className="text-[#A7815E]">{count}</strong></div>)}</div></SettingsPanel>
        <SettingsPanel title="آخر العملاء"><div className="grid gap-3">{tickets.slice(0, 4).map((ticket) => <Link key={`${ticket.id}-owner`} href={dashboardHref("admin", `support?ticket=${encodeURIComponent(ticket.id)}`)} className="flex justify-between rounded-xl border p-3 text-sm font-bold" style={{ borderColor: uiColors.border }}><span>{ticket.ownerLabel ?? "غير محدد"}</span><strong>{ticket.ticketNumber}</strong></Link>)}</div></SettingsPanel>
        <SettingsPanel title="إجراءات سريعة"><div className="grid gap-3"><Link href={dashboardHref("admin", "settings/messages")} className="grid min-h-11 place-items-center rounded-xl border text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>قوالب الرسائل</Link><Link href={dashboardHref("admin", "settings/notifications")} className="grid min-h-11 place-items-center rounded-xl border text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إعدادات الإشعارات</Link><Link href={dashboardHref("admin", "system/activity-log")} className="grid min-h-11 place-items-center rounded-xl border text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>سجل النشاط</Link></div></SettingsPanel>
      </section>
    </div>
  );
}

function adminNotificationTargetMeta(notification: DashboardNotification): { label: string; tone: TrendTone } {
  if (notification.targetType === "business") return { label: "أعمال", tone: "gold" };
  if (notification.targetType === "admin") return { label: "إدارة", tone: "blue" };
  if (notification.targetType === "individual") return { label: "أفراد", tone: "green" };
  return { label: "عام", tone: "blue" };
}

async function AdminNotificationsPage({ config }: { config: DashboardRoleConfig }) {
  const result = await listDashboardAdminNotifications();
  const notifications = result.data;
  const unread = notifications.filter((notification) => notification.unread);
  const individualCount = notifications.filter((notification) => notification.targetType === "individual").length;
  const businessCount = notifications.filter((notification) => notification.targetType === "business").length;
  const adminCount = notifications.filter((notification) => notification.targetType === "admin").length;

  return (
    <div className="grid gap-5">
      <DashboardTopbar config={config} />
      <section className="rounded-[24px] border bg-white p-5 shadow-card md:p-6" style={{ borderColor: uiColors.border }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <StatusPill label="مركز الإشعارات" tone="gold" />
            <h1 className="mt-3 font-display text-3xl font-extrabold text-[#1D1916]">إدارة الإشعارات</h1>
            <p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-[#6E6258]">إرسال ومتابعة إشعارات الأفراد والأعمال والإدارة من جدول الإشعارات مباشرة.</p>
          </div>
          <Link href={dashboardHref("admin", "settings/notifications")} className="inline-flex min-h-11 items-center justify-center rounded-xl border bg-white px-5 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إعدادات الإشعارات</Link>
        </div>
      </section>

      {result.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل الإشعارات الحية، وتم عرض البيانات المتاحة.</section> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CommunicationStatCard title="إجمالي الإشعارات" value={String(notifications.length)} unit="إشعار" icon={<Bell className="h-7 w-7" />} />
        <CommunicationStatCard title="غير مقروءة" value={String(unread.length)} unit="إشعار" icon={<AlertTriangle className="h-7 w-7" />} tone="blue" />
        <CommunicationStatCard title="حسابات الأفراد" value={String(individualCount)} unit="إشعار" icon={<UserRound className="h-7 w-7" />} tone="green" />
        <CommunicationStatCard title="حسابات الأعمال" value={String(businessCount)} unit="إشعار" icon={<BriefcaseBusiness className="h-7 w-7" />} tone="gray" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-extrabold text-[#1D1916]">سجل الإشعارات</h2>
              <p className="mt-1 text-sm font-bold text-[#6E6258]">آخر الإشعارات المرسلة أو الناتجة من إجراءات المنصة.</p>
            </div>
            <Link href={dashboardHref("admin", "system/activity-log")} className="inline-flex min-h-10 items-center justify-center rounded-md border px-4 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>سجل النشاط</Link>
          </div>
          <div className="overflow-hidden rounded-xl border" style={{ borderColor: uiColors.border }}>
            <div className="hidden bg-[#fbf7f2] px-4 py-3 text-xs font-extrabold text-[#6E6258] md:grid md:grid-cols-[1.4fr_0.8fr_0.8fr_0.7fr_0.7fr_0.7fr]">
              <span>الإشعار</span><span>المستهدف</span><span>التصنيف</span><span>الحالة</span><span>التاريخ</span><span>إجراء</span>
            </div>
            {notifications.map((notification) => {
              const target = adminNotificationTargetMeta(notification);
              return (
                <div key={notification.id} className="grid gap-3 border-t border-[#eee4dc] px-4 py-4 text-sm font-bold text-[#1D1916] md:grid-cols-[1.4fr_0.8fr_0.8fr_0.7fr_0.7fr_0.7fr] md:items-center">
                  <div>
                    <strong className="block font-display text-base">{notification.title}</strong>
                    <span className="mt-1 block leading-6 text-[#6E6258]">{notification.body}</span>
                    {notification.actionUrl ? <Link href={notification.actionUrl} className="mt-2 inline-flex text-xs font-extrabold text-[#A7815E]">فتح الرابط</Link> : null}
                  </div>
                  <div className="grid gap-1">
                    <InvoiceStatus label={target.label} tone={target.tone} />
                    <span className="text-xs text-[#6E6258]">{notification.targetLabel ?? "غير محدد"}</span>
                  </div>
                  <span>{notification.category}</span>
                  <InvoiceStatus label={notification.unread ? "غير مقروء" : "مقروء"} tone={notification.unread ? "gold" : "green"} />
                  <span>{formatDashboardDateTime(notification.createdAt)}</span>
                  {notification.targetType === "admin" ? (
                    <AdminNotificationReadButton notificationId={notification.id} read={notification.unread} className="grid min-h-9 place-items-center rounded-md border border-[#B89A7A] px-3 text-xs font-extrabold text-[#A7815E]">
                      {notification.unread ? "تحديد كمقروء" : "إرجاع كغير مقروء"}
                    </AdminNotificationReadButton>
                  ) : (
                    <span className="grid min-h-9 place-items-center rounded-md border border-[#E6D9CF] bg-[#F8F5F1] px-3 text-xs font-extrabold text-[#8A7E73]">سجل إرسال</span>
                  )}
                </div>
              );
            })}
            {!notifications.length ? <p className="border-t border-[#eee4dc] px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد إشعارات حالياً.</p> : null}
          </div>
        </article>

        <aside className="grid content-start gap-4">
          <article className="rounded-[22px] border bg-white p-5 text-right shadow-card" style={{ borderColor: uiColors.border }}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-extrabold text-[#1D1916]">إرسال إشعار</h2>
                <p className="mt-1 text-sm font-bold leading-6 text-[#6E6258]">سيتم حفظ الإشعار في Supabase ويظهر في لوحة المستهدف.</p>
              </div>
              <Send className="h-6 w-6 text-[#A7815E]" />
            </div>
            <AdminNotificationSendForm />
          </article>

          <SettingsPanel title="توزيع المستهدفين">
            <div className="grid gap-3">
              {[["أفراد", individualCount], ["أعمال", businessCount], ["إدارة", adminCount]].map(([label, count]) => (
                <div key={label} className="flex items-center justify-between rounded-xl border p-3 text-sm font-bold" style={{ borderColor: uiColors.border }}>
                  <span>{label}</span>
                  <strong className="text-[#A7815E]">{count}</strong>
                </div>
              ))}
            </div>
          </SettingsPanel>
        </aside>
      </section>
    </div>
  );
}

async function IndividualPersonalProfilePage({ config, actor = null }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null }) {
  const [profileResult, financialResult, assetsResult, contributionsResult, serviceRequestsResult] = await Promise.all([
    getDashboardIndividualProfile(actor),
    listDashboardFinancial("individual", actor),
    listDashboardAssetsForScope("individual", "owned", actor),
    listDashboardContributionsForScope("individual", "interested", actor),
    listDashboardServiceRequestsForScope("individual", actor),
  ]);
  const profile = profileResult.data;
  const completion = Math.min(100, Math.max(0, Math.round(profile.profileCompletion)));
  const verified = profile.verificationStatus === "approved";
  const verificationLabel = verified ? "مستثمر فرد" : "قيد التحقق";
  const paidInvoices = financialResult.invoices.filter((invoice) => invoice.status === "paid").length;
  const completedRequests = serviceRequestsResult.data.filter((request) => request.status === "completed").length;
  const addedAssets = assetsResult.data.length;
  const interestedContributions = contributionsResult.data.length;
  const activityStats = [
    { title: "الفواتير المدفوعة", value: String(paidInvoices), unit: "فاتورة", icon: <FileText className="h-7 w-7" /> },
    { title: "الطلبات المكتملة", value: String(completedRequests), unit: "طلبات", icon: <BriefcaseBusiness className="h-7 w-7" />, tone: "green" as const },
    { title: "المساهمات المهتم بها", value: String(interestedContributions), unit: "مساهمة", icon: <Users className="h-7 w-7" />, tone: "blue" as const },
    { title: "الأصول المضافة", value: String(addedAssets), unit: "أصل عقاري", icon: <Building2 className="h-7 w-7" />, tone: "copper" as const },
  ];
  const achievementRows = [
    { title: "مستثمر نشط", subtitle: `أضفت ${addedAssets} أصول`, IconComp: ShieldCheck, tone: addedAssets >= 5 ? "green" : "gray" },
    { title: "متابع ذكي", subtitle: `تتابع ${interestedContributions} مساهمات`, IconComp: Star, tone: interestedContributions >= 10 ? "blue" : "gray" },
    { title: "مساهم مميز", subtitle: `${completedRequests} طلبات مكتملة`, IconComp: Crown, tone: completedRequests >= 3 ? "purple" : "gray" },
    { title: "مستخدم موثوق", subtitle: verificationLabel, IconComp: BadgeCheck, tone: verified ? "gold" : "gray" },
    { title: "المدفوعات", subtitle: `${paidInvoices} فواتير مدفوعة`, IconComp: Target, tone: paidInvoices > 0 ? "green" : "gray" },
  ];

  return (
    <CommunicationPageChrome title="الملف الشخصي" active="الملف الشخصي">
      <section className="grid gap-4 xl:grid-cols-4" dir="ltr">
        <aside className="grid gap-4 xl:col-span-1" dir="rtl">
          <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-center shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
            <h2 className="font-display text-lg font-extrabold text-[#1D1916]">نسبة اكتمال الملف</h2>
            <div className="mx-auto mt-6 grid h-36 w-36 place-items-center rounded-full" style={{ background: `conic-gradient(#087342 0 ${completion}%, #E8E4DE ${completion}% 100%)` }}>
              <div className="grid h-28 w-28 place-items-center rounded-full bg-white">
                <div>
                  <strong className="block font-display text-4xl font-extrabold text-[#1D1916]">{completion}%</strong>
                  <span className="text-sm font-extrabold text-[#1D1916]">ممتاز</span>
                </div>
              </div>
            </div>
            <p className="mt-5 text-sm font-bold text-[#6E6258]">أكمل ملفك للاستفادة من جميع المزايا</p>
            <div className="mt-5 grid gap-3 text-right text-sm font-bold text-[#1D1916]">
              {["المعلومات الشخصية", "بيانات التواصل", "التحقق من الهوية", "العنوان"].map((item) => (
                <span key={item} className="flex items-center justify-between">
                  <CheckCircle2 className="h-4 w-4 text-[#087342]" />
                  {item}
                </span>
              ))}
              <span className="flex items-center justify-between">
                <span className="grid h-4 w-4 place-items-center rounded-full bg-[#C54B28] text-[10px] text-white">!</span>
                شارة التوثيق
              </span>
            </div>
            <Link href={dashboardHref(config.role, "verification")} className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-md border border-[#B89A7A] text-sm font-extrabold text-[#A7815E]">
              تحديث الملف
            </Link>
          </article>
        </aside>

        <main className="grid gap-4 xl:col-span-3" dir="rtl">
          <article className="rounded-lg border border-[#ece1d8] bg-white p-6 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
            <div className="mb-5 flex items-center justify-between">
              <SaveAccountSettingsButton
                scope={config.role === "business" ? "business" : "individual"}
                kind="profile"
                payload={{ fullName: profile.fullName, email: profile.email, phone: profile.phone, city: profile.city, profileCompletion: profile.profileCompletion }}
                collectFormValues={false}
                className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#ece1d8] px-4 text-sm font-extrabold text-[#1D1916]"
              >
                <PenLine className="h-4 w-4" />
                تعديل
              </SaveAccountSettingsButton>
              <h2 className="font-display text-xl font-extrabold text-[#1D1916]">معلومات الحساب</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-4">
              <div className="text-center lg:col-span-1">
                <div className="relative mx-auto grid h-32 w-32 place-items-center rounded-full bg-[#F4F0EC]">
                  <UserRound className="h-20 w-20 text-[#1D1916]" />
                  <span className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full border border-[#ece1d8] bg-white text-[#A7815E]">
                    <BadgeCheck className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl font-extrabold text-[#1D1916]">{profile.fullName}</h3>
                <span className="mt-2 inline-flex rounded-md bg-[#e8f7ec] px-3 py-1 text-xs font-extrabold text-[#087342]">{verificationLabel}</span>
                <p className="mt-3 text-xs font-bold leading-6 text-[#6E6258]">عضو منذ {formatDashboardDate(profile.createdAt)}<br />{profile.membershipNumber}</p>
              </div>
              <div className="grid gap-0 lg:col-span-3">
                <DetailRow label="الاسم الكامل" value={profile.fullName} icon={<UserRound className="h-4 w-4 text-[#1D1916]" />} />
                <DetailRow label="رقم الجوال" value={profile.phone} icon={<MessageSquare className="h-4 w-4 text-[#1D1916]" />} />
                <DetailRow label="البريد الإلكتروني" value={profile.email} icon={<Send className="h-4 w-4 text-[#1D1916]" />} />
                <DetailRow label="المدينة" value={`${profile.city} - ${profile.country}`} icon={<MapPin className="h-4 w-4 text-[#1D1916]" />} />
                <DetailRow label="تاريخ الميلاد" value={profile.birthDate} icon={<CalendarCheck className="h-4 w-4 text-[#1D1916]" />} />
                <DetailRow label="الجنسية" value={profile.nationality} icon={<BadgeCheck className="h-4 w-4 text-[#1D1916]" />} />
              </div>
            </div>
          </article>

          <section>
            <h2 className="mb-4 text-right font-display text-xl font-extrabold text-[#1D1916]">ملخص نشاطك</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {activityStats.map((item) => <CommunicationStatCard key={item.title} title={item.title} value={item.value} unit={item.unit} icon={item.icon} tone={item.tone} />)}
            </div>
          </section>

          <section className="rounded-lg border border-[#ece1d8] bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
            <h2 className="mb-4 text-right font-display text-lg font-extrabold text-[#1D1916]">الإنجازات والشارات</h2>
            <div className="grid gap-4 md:grid-cols-5">
              {achievementRows.map(({ title, subtitle, IconComp, tone }) => (
                <article key={title} className="border-l border-[#eee4dc] p-3 text-center last:border-l-0">
                  <span
                    className="mx-auto grid h-14 w-14 place-items-center rounded-full"
                    style={{
                      backgroundColor: tone === "green" ? "#e8f7ec" : tone === "blue" ? "#eef6ff" : tone === "purple" ? "#f0e9ff" : tone === "gold" ? "#fff4dc" : "#f3f1ee",
                      color: tone === "green" ? "#087342" : tone === "blue" ? "#2F6FB0" : tone === "purple" ? "#7b3db8" : tone === "gold" ? "#C07327" : "#77716A",
                    }}
                  >
                    <IconComp className="h-8 w-8" />
                  </span>
                  <strong className="mt-3 block text-sm font-extrabold text-[#1D1916]">{title}</strong>
                  <p className="mt-1 text-xs font-bold text-[#6E6258]">{subtitle}</p>
                </article>
              ))}
            </div>
          </section>
        </main>
      </section>
      {profileResult.error ? <section className="rounded-lg border border-[#F0D8B8] bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل بيانات الملف الشخصي الحية، وتم عرض بيانات احتياطية.</section> : null}
    </CommunicationPageChrome>
  );
}

function UploadRequirementCard({ title, subtitle, entityType, entityId, scope = "individual" }: { title: string; subtitle: string; entityType: string; entityId?: string; scope?: "individual" | "business" }) {
  return (
    <article className="rounded-lg border border-[#ece1d8] bg-white p-4 text-center">
      <h3 className="font-display text-base font-extrabold text-[#1D1916]">{title}</h3>
      <p className="mt-2 min-h-10 text-xs font-bold leading-5 text-[#6E6258]">{subtitle}</p>
      <DashboardDocumentUploadButton scope={scope} entityType={entityType} entityId={entityId} label={title} className="mt-4 block cursor-pointer rounded-md border border-[#ece1d8] bg-white p-5">
        <UploadCloud className="mx-auto h-8 w-8 text-[#1D1916]" />
        <strong className="mt-2 block text-sm font-extrabold text-[#1D1916]">اضغط للرفع</strong>
        <span className="mt-1 block text-xs font-bold text-[#6E6258]">أو اسحب الملف هنا</span>
      </DashboardDocumentUploadButton>
      <p className="mt-3 text-xs font-bold text-[#6E6258]">JPG, PNG, PDF (الحد الأقصى 8MB)</p>
    </article>
  );
}

async function IndividualVerificationBadgePage({ config, actor = null }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null }) {
  const scope = config.role === "business" ? "business" : "individual";
  const individualProfileResult = scope === "individual" ? await getDashboardIndividualProfile(actor) : null;
  const businessProfileResult = scope === "business" ? await getDashboardBusinessProfile(actor) : null;
  const individualProfile = individualProfileResult?.data ?? null;
  const businessProfile = businessProfileResult?.data ?? null;
  const formReference = stableDashboardFormReference(scope, "verification", actor);
  const displayName = businessProfile?.organizationName ?? individualProfile?.fullName ?? config.ownerName;
  const identityNumber = businessProfile?.delegateId ?? individualProfile?.identityNumber ?? "";
  const city = businessProfile?.city ?? individualProfile?.city ?? "الرياض";
  const email = businessProfile?.delegateEmail ?? businessProfile?.email ?? individualProfile?.email ?? "";
  const verificationError = businessProfileResult?.error ?? individualProfileResult?.error;

  return (
    <CommunicationPageChrome title="طلب شارة التوثيق" active="طلب شارة التوثيق">
      <section className="rounded-lg border border-[#ece1d8] bg-white p-6 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
        <div className="flex items-center justify-between gap-4">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-[#fff4ee] text-[#A7815E]">
            <BadgeCheck className="h-12 w-12" />
          </span>
          <div className="text-right">
            <h2 className="font-display text-lg font-extrabold text-[#1D1916]">شارة التوثيق تمنح حسابك مصداقية أعلى وتعزز من ثقة المستثمرين بك</h2>
            <p className="mt-3 text-sm font-bold leading-7 text-[#6E6258]">بعد التحقق من هويتك ومستنداتك، ستحصل على شارة توثيق ظاهرة في ملفك الشخصي.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4" dir="ltr">
        <form className="grid gap-4 xl:col-span-3" dir="rtl">
          <input type="hidden" name="formReference" defaultValue={formReference} />
          <SectionBox title="معلومات الهوية" icon={<FileText className="h-5 w-5" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field name="identityType" label={scope === "business" ? "نوع المستند" : "نوع الهوية"} value={scope === "business" ? "سجل تجاري / هوية مفوض" : "هوية وطنية"} placeholder="اختر نوع المستند" />
              <Field name="identityNumber" label={scope === "business" ? "رقم هوية المفوض" : "رقم الهوية"} value={identityNumber} placeholder="أدخل رقم الهوية" />
              <Field name="birthDate" label={scope === "business" ? "تاريخ إصدار السجل" : "تاريخ الميلاد"} value={individualProfile?.birthDate ?? ""} placeholder="yyyy/mm/dd" />
              <Field name="identityIssueDate" label="تاريخ إصدار المستند" placeholder="yyyy/mm/dd" />
            </div>
          </SectionBox>

          <SectionBox title="إرفاق المستندات" icon={<UploadCloud className="h-5 w-5" />}>
            <p className="mb-4 text-right text-xs font-bold text-[#6E6258]">يرجى رفع صور واضحة للمستندات المطلوبة</p>
            <div className="grid gap-4 md:grid-cols-3">
              <UploadRequirementCard scope={scope} title={scope === "business" ? "السجل التجاري" : "صورة الهوية"} subtitle={scope === "business" ? "نسخة واضحة من السجل التجاري أو الترخيص" : "الهوية الأمامية والخلفية (يجب أن تكون واضحة)"} entityType="verification_identity_document" entityId={formReference} />
              <UploadRequirementCard scope={scope} title={scope === "business" ? "هوية المفوض" : "صورة سلفي"} subtitle={scope === "business" ? "هوية المفوض الرسمي أو التفويض النظامي" : "صورة واضحة لوجهك وأنت تحمل هويتك"} entityType="verification_selfie_document" entityId={formReference} />
              <UploadRequirementCard scope={scope} title="إثبات العنوان" subtitle="فاتورة خدمات أو كشف حساب بنكي لا يتجاوز 3 أشهر" entityType="verification_address_document" entityId={formReference} />
            </div>
          </SectionBox>

          <SectionBox title="معلومات إضافية (اختياري)" icon={<FileText className="h-5 w-5" />}>
            <div className="grid gap-4">
              <Field name="displayName" label="الاسم الظاهر في الشارة" value={displayName} placeholder="كما ترغب أن يظهر في شارة التوثيق" />
              <Field name="bio" label="نبذة تعريفية" placeholder={scope === "business" ? "اكتب نبذة مختصرة عن المنشأة وخبراتها (اختياري)" : "اكتب نبذة مختصرة عن نفسك وخبراتك (اختياري)"} textarea />
              <label className="flex items-center justify-end gap-3 text-sm font-bold leading-7 text-[#1D1916]">
                <span>أقر بأن جميع المعلومات والمستندات المرفقة صحيحة وأتحمل مسؤولية أي بيانات غير صحيحة.</span>
                <input name="acceptedTerms" type="checkbox" required className="h-4 w-4 accent-[#A7815E]" />
              </label>
              <SubmitVerificationRequestButton
                scope={scope}
                displayName={displayName}
                note={scope === "business" ? "طلب شارة توثيق منشأة" : "طلب شارة توثيق حساب فردي"}
                payload={{
                  identityType: scope === "business" ? "سجل تجاري / هوية مفوض" : "هوية وطنية",
                  identityNumber,
                  birthDate: individualProfile?.birthDate ?? "",
                  commercialRegistration: businessProfile?.commercialRegistration ?? "",
                  city,
                  email,
                  formReference,
                  feeAmount: scope === "business" ? 500 : 0,
                  requestedFrom: `${scope}-verification-page`,
                }}
                className="min-h-12 w-full rounded-md text-sm font-extrabold text-white md:col-span-3"
                style={{ backgroundColor: "#C54B00" }}
              >
                إرسال طلب التوثيق
              </SubmitVerificationRequestButton>
            </div>
          </SectionBox>
        </form>

        <aside className="grid gap-4 content-start" dir="rtl">
          <SectionBox title="مزايا شارة التوثيق" icon={<BadgeCheck className="h-5 w-5" />}>
            <div className="text-center">
              <BadgeCheck className="mx-auto h-24 w-24 text-[#D18A42]" />
            </div>
            <div className="mt-4 grid gap-4 text-sm font-bold text-[#1D1916]">
              {["زيادة ثقة المستثمرين بك", "تميز حسابك بين المستثمرين", "أولوية في عرض طلباتك وخدماتك", "تعزيز مصداقيتك في المنصة", "الوصول إلى مزايا حصرية"].map((item) => (
                <span key={item} className="flex items-center justify-between">
                  <CheckCircle2 className="h-4 w-4 text-[#087342]" />
                  {item}
                </span>
              ))}
            </div>
          </SectionBox>
          <article className="rounded-lg border border-[#ece1d8] bg-[#F7EEE7] p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
            <h2 className="font-display text-lg font-extrabold text-[#1D1916]">ملاحظات هامة</h2>
            <ul className="mt-4 grid gap-3 text-sm font-bold leading-7 text-[#1D1916]">
              <li>يتم دراسة الطلب خلال 1-3 أيام عمل</li>
              <li>ستصلك إشعار بنتيجة الطلب</li>
              <li>يمكنك إعادة تقديم الطلب في حال الرفض</li>
            </ul>
          </article>
          <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-center shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
            <MessageSquare className="mx-auto h-8 w-8 text-[#1D1916]" />
            <h2 className="mt-3 font-display text-lg font-extrabold text-[#1D1916]">هل تحتاج مساعدة؟</h2>
            <p className="mt-2 text-sm font-bold text-[#6E6258]">فريق الدعم جاهز لمساعدتك</p>
            <Link href={dashboardHref(config.role, "support")} className="mt-4 grid min-h-11 w-full place-items-center rounded-md border border-[#B89A7A] text-sm font-extrabold text-[#A7815E]">تواصل مع الدعم</Link>
          </article>
        </aside>
      </section>
      {verificationError ? <section className="rounded-lg border border-[#F0D8B8] bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل بيانات التوثيق الحية، وتم عرض بيانات احتياطية.</section> : null}
    </CommunicationPageChrome>
  );
}

function Field({ label, placeholder, name, value, type = "text", textarea = false }: { label: string; placeholder: string; name?: string; value?: string; type?: string; textarea?: boolean }) {
  return (
    <label className={cn("grid gap-2 text-sm font-extrabold text-[#1D1916]", textarea ? "md:col-span-3" : "")}>
      {label}
      {textarea ? (
        <textarea name={name} defaultValue={value} className="min-h-24 rounded-md border border-[#ece1d8] bg-white p-3 text-sm font-bold outline-none focus:border-[#A7815E]" placeholder={placeholder} />
      ) : (
        <input name={name} type={type} defaultValue={value} className="h-12 rounded-md border border-[#ece1d8] bg-white px-3 text-sm font-bold outline-none focus:border-[#A7815E]" placeholder={placeholder} />
      )}
    </label>
  );
}

function SectionBox({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-[#ece1d8] bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
      <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-extrabold text-[#1D1916]">
        <span className="text-[#A7815E]">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function UploadBox({ label, entityId, scope = "individual" }: { label: string; entityId?: string; scope?: "individual" | "business" }) {
  return (
    <DashboardDocumentUploadButton
      scope={scope}
      entityType={`${scope}_dashboard_document`}
      entityId={entityId}
      label={label}
      className="grid min-h-24 cursor-pointer place-items-center rounded-md border border-dashed border-[#d6b89a] bg-[#fffaf4] px-3 text-center text-xs font-extrabold text-[#1D1916]"
    >
      <UploadCloud className="mb-2 h-6 w-6 text-[#A7815E]" />
      {label}
    </DashboardDocumentUploadButton>
  );
}

function IndividualAddAssetPage({ actor = null }: { actor?: DashboardActorContext | null }) {
  const formReference = stableDashboardFormReference("individual", "add-asset", actor);
  const steps = [
    ["بيانات الأصل", Building2],
    ["الموقع", MapPin],
    ["الصك والمستندات", FileText],
    ["معلومات التطوير", BarChart3],
    ["المراجعة والإرسال", CircleCheck],
  ];

  return (
    <div className="grid gap-4">
      <IndividualPageHero title="أضف أصلك العقاري" subtitle="ابدأ رحلتك في تحويل الأصل العقاري إلى فرصة استثمارية منظمة وفق أعلى معايير الحوكمة." image="/images/hero-construction.png" />
      <section className="rounded-lg border border-[#ece1d8] bg-white p-4 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
        <div className="grid gap-3 md:grid-cols-5">
          {steps.map(([label, IconComponent], index) => {
            const StepIcon = IconComponent as typeof Building2;
            return (
              <div key={label as string} className="relative grid place-items-center gap-2 text-center text-xs font-extrabold text-[#1D1916]">
                <span className={cn("grid h-12 w-12 place-items-center rounded-full border", index === 0 ? "border-[#A7815E] bg-[#fff3ec] text-[#A7815E]" : "border-[#eadcd2] bg-white text-[#A7815E]")}><StepIcon className="h-5 w-5" /></span>
                {index + 1}. {label as string}
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-12">
        <aside className="grid gap-4 content-start xl:col-span-3">
          <article className="rounded-lg border border-[#ece1d8] bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
            <h2 className="mb-3 font-display text-xl font-extrabold text-[#1D1916]">حالة الطلب</h2>
            <span className="mb-4 block rounded-md bg-[#e8f7ec] py-2 text-center text-sm font-extrabold text-[#087342]">جديد</span>
            {["مسودة", "مراجعة", "تحليل", "دراسة", "مكتمل"].map((item, index) => (
              <div key={item} className="flex items-center gap-2 py-2 text-sm font-bold text-[#1D1916]">
                <span className={cn("h-3 w-3 rounded-full border", index === 0 ? "border-[#A7815E] bg-[#A7815E]" : "border-[#cfc6be]")} />
                {item}
              </div>
            ))}
          </article>
          <article className="rounded-lg border border-[#ece1d8] bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
            <h2 className="mb-3 font-display text-lg font-extrabold text-[#1D1916]">ملخص الأصل</h2>
            {["نوع الأصل", "المدينة", "المساحة", "نوع الاستخدام", "مستندات", "حالة الصك"].map((item) => <p key={item} className="border-b border-[#eee4dc] py-2 text-xs font-bold text-[#6E6258]">{item}: لم يتم تحديده</p>)}
          </article>
          <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-center shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
            <MessageSquare className="mx-auto h-8 w-8 text-[#A7815E]" />
            <h2 className="mt-2 font-display text-lg font-extrabold text-[#1D1916]">تحتاج مساعدة؟</h2>
            <p className="mt-2 text-xs font-bold leading-6 text-[#6E6258]">فريق مهابة جاهز لمساعدتك في إضافة الأصل.</p>
            <Link href={dashboardHref("individual", "support")} className="mt-3 grid min-h-10 w-full place-items-center rounded-md bg-[#A7815E] text-sm font-extrabold text-white">تواصل معنا</Link>
          </article>
        </aside>

        <form className="grid gap-4 xl:col-span-6">
          <input type="hidden" name="sourcePath" value="individual-add-asset" />
          <input type="hidden" name="formReference" value={formReference} />
          <input type="hidden" name="amount" value="2500000" />
          <SectionBox title="1. بيانات الأصل" icon={<Building2 className="h-5 w-5" />}>
            <div className="grid gap-3 md:grid-cols-3">
              <Field name="assetType" label="نوع الأصل" placeholder="اختر نوع الأصل" />
              <Field name="title" label="اسم الأصل" placeholder="أدخل اسم الأصل" />
              <Field name="usageType" label="نوع الاستخدام" placeholder="اختر نوع الاستخدام" />
              <Field name="areaSqm" label="المساحة (م2)" placeholder="أدخل المساحة" type="number" />
              <Field name="description" label="وصف الأصل" placeholder="اكتب وصفاً تفصيلياً عن الأصل العقاري" textarea />
            </div>
          </SectionBox>
          <SectionBox title="2. موقع الأصل" icon={<MapPin className="h-5 w-5" />}>
            <div className="grid gap-3 md:grid-cols-3">
              <Field name="city" label="المدينة" placeholder="اختر المدينة" />
              <Field name="district" label="الحي" placeholder="اختر الحي" />
              <Field name="address" label="العنوان" placeholder="أدخل العنوان التفصيلي" />
              <div className="relative min-h-24 overflow-hidden rounded-md border border-[#ece1d8] bg-[#f5eee7] md:col-span-3">
                <Image src="/images/final-cta-map-building.png" alt="" fill className="object-cover opacity-70" sizes="600px" />
                <MapPin className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-[#A7815E]" />
              </div>
            </div>
          </SectionBox>
          <SectionBox title="3. بيانات الصك" icon={<FileText className="h-5 w-5" />}>
            <div className="grid gap-3 md:grid-cols-4">
              <Field name="deedNumber" label="رقم الصك" placeholder="أدخل رقم الصك" />
              <Field name="deedDate" label="تاريخ الصك" placeholder="اختر التاريخ" />
              <Field name="deedType" label="نوع الصك" placeholder="اختر نوع الصك" />
              <Field name="deedIssuer" label="جهة الإصدار" placeholder="اختر الجهة" />
            </div>
          </SectionBox>
          <SectionBox title="4. معلومات التطوير" icon={<BarChart3 className="h-5 w-5" />}>
            <div className="grid gap-3 md:grid-cols-4">
              {["هل سبق تطوير الأصل؟", "أفضل استخدام متوقع؟", "هل توجد دراسة سابقة؟", "هل توجد ملاحظات؟"].map((item) => <FilterBox key={item} label={item} />)}
              <Field name="developmentNotes" label="تفاصيل إضافية" placeholder="اكتب أي معلومات إضافية تساعد في دراسة الأصل" textarea />
            </div>
          </SectionBox>
          <SectionBox title="5. المرفقات" icon={<UploadCloud className="h-5 w-5" />}>
            <div className="grid gap-3 md:grid-cols-5">
              {["الصك العقاري", "المخططات", "الصور", "الدراسات السابقة", "مستندات إضافية"].map((item) => <UploadBox key={item} label={item} entityId={formReference} />)}
            </div>
          </SectionBox>
          <SectionBox title="6. المراجعة والإرسال" icon={<ShieldCheck className="h-5 w-5" />}>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#1D1916]"><input name="acceptedAccuracy" type="checkbox" required /> أقر بأن جميع البيانات المدخلة صحيحة.</label>
            <label className="flex items-center gap-2 text-sm font-bold text-[#1D1916]"><input name="acceptedTerms" type="checkbox" required /> أوافق على الشروط والأحكام وسياسة الخصوصية.</label>
            <div className="mt-5 flex flex-wrap gap-3">
              <DashboardRequestFormSubmitButton
                kind="asset"
                scope="individual"
                mode="submitted"
                className="min-h-12 min-w-48 rounded-md bg-[#A7815E] px-6 text-sm font-extrabold text-white"
              >
                إرسال الأصل
              </DashboardRequestFormSubmitButton>
              <DashboardRequestFormSubmitButton
                kind="asset"
                scope="individual"
                mode="draft"
                className="min-h-12 min-w-40 rounded-md border border-[#B89A7A] bg-white px-6 text-sm font-extrabold text-[#A7815E]"
              >
                حفظ كمسودة
              </DashboardRequestFormSubmitButton>
            </div>
          </SectionBox>
        </form>

        <aside className="grid gap-4 content-start xl:col-span-3">
          <article className="rounded-lg border border-[#ece1d8] bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
            <h2 className="mb-4 font-display text-lg font-extrabold text-[#1D1916]">لماذا إضافة الأصل عبر مهابة؟</h2>
            {[
              ["دراسة الجدوى", Target],
              ["الهيكلة والتنظيم", Settings2],
              ["الحوكمة والامتثال", ShieldCheck],
              ["تعظيم القيمة", BarChart3],
              ["الوصول للمستثمرين", Users],
            ].map(([item, IconComponent]) => {
              const AsideIcon = IconComponent as typeof Target;
              return <div key={item as string} className="flex gap-3 border-b border-[#eee4dc] py-3 last:border-b-0"><AsideIcon className="h-5 w-5 shrink-0 text-[#A7815E]" /><p className="text-sm font-bold leading-6 text-[#1D1916]">{item as string}</p></div>;
            })}
          </article>
        </aside>
      </div>

      <section className="grid gap-4 rounded-lg border border-[#ece1d8] bg-white p-5 shadow-[0_10px_24px_rgb(29_25_22/0.035)] md:grid-cols-5">
        {[
          ["استلام الطلب", MapPin],
          ["مراجعة البيانات", FileText],
          ["تحليل الأصل", BarChart3],
          ["إعداد التوصية", Settings2],
          ["التواصل مع المالك", MessageSquare],
        ].map(([item, IconComponent]) => {
          const StepIcon = IconComponent as typeof MapPin;
          return <div key={item as string} className="text-center"><StepIcon className="mx-auto h-7 w-7 text-[#A7815E]" /><p className="mt-2 text-sm font-extrabold text-[#1D1916]">{item as string}</p></div>;
        })}
      </section>
    </div>
  );
}

function pageDescription(role: DashboardRole, title: string) {
  if (role === "admin") return `إدارة ${title} ومراجعتها ضمن لوحة تحكم مهابة المركزية.`;
  return `تنظيم ${title} واستعراض الحالات والطلبات المرتبطة بحسابك داخل منصة مهابة.`;
}

type AdminAssetStatus = DashboardAdminReviewStatus;

const adminAssetStatusMeta: Record<AdminAssetStatus, { label: string; tone: TrendTone; action: string }> = {
  pending: { label: "بانتظار المراجعة", tone: "gold", action: "مراجعة الأصل" },
  needs_changes: { label: "مطلوب تحديث", tone: "red", action: "متابعة الملاحظات" },
  approved: { label: "معتمد", tone: "green", action: "عرض التفاصيل" },
  rejected: { label: "مرفوض", tone: "red", action: "عرض سبب الرفض" },
};

function adminAssetExportRows(rows: DashboardAdminAssetRow[]) {
  return rows.map((row) => ({
    "رقم الأصل": row.id,
    "اسم الأصل": row.titleAr,
    "المالك": row.owner,
    "المدينة": row.cityAr,
    "نوع الأصل": row.assetTypeAr,
    "المساحة": row.areaSqm,
    "القيمة التقديرية": row.estimatedValueSar,
    "الحالة": adminAssetStatusMeta[row.status].label,
    "المخاطر": row.risk,
    "تاريخ الإرسال": row.submittedAt,
  }));
}

function AdminAssetKpis({ rows, activeStatus }: { rows: DashboardAdminAssetRow[]; activeStatus?: AdminAssetStatus }) {
  const total = rows.length;
  const pending = rows.filter((item) => item.status === "pending").length;
  const approved = rows.filter((item) => item.status === "approved").length;
  const rejected = rows.filter((item) => item.status === "rejected").length;
  const cards = [
    { title: "إجمالي الأصول", value: String(total), unit: "أصل عقاري", icon: "building", tone: "blue" as TrendTone, active: !activeStatus },
    { title: "بانتظار المراجعة", value: String(pending), unit: "طلبات", icon: "clock", tone: "gold" as TrendTone, active: activeStatus === "pending" },
    { title: "الأصول المعتمدة", value: String(approved), unit: "أصول", icon: "shield", tone: "green" as TrendTone, active: activeStatus === "approved" },
    { title: "الأصول المرفوضة", value: String(rejected), unit: "أصول", icon: "x", tone: "red" as TrendTone, active: activeStatus === "rejected" },
  ];

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const tone = toneStyles[card.tone];
        return (
          <article key={card.title} className={cn("rounded-[18px] border bg-white p-4 text-right shadow-card", card.active ? "ring-2 ring-[#A7815E]/30" : "")} style={{ borderColor: card.active ? "#A7815E" : uiColors.border }}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold text-[#5f5953]">{card.title}</p>
                <strong className="mt-2 block font-display text-4xl font-extrabold text-[#1D1916]">{card.value}</strong>
                <span className="text-xs font-bold text-[#6E6258]">{card.unit}</span>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-full border" style={{ backgroundColor: tone.bg, borderColor: tone.border, color: tone.text }}>
                <Icon name={card.icon} className="h-6 w-6" />
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function AdminAssetsHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="relative overflow-hidden rounded-[24px] border bg-white p-5 shadow-card md:p-6" style={{ borderColor: uiColors.border }}>
      <Image src="/images/asset-land-masterplan.png" alt="" fill className="object-cover opacity-[0.12] grayscale-[12%] sepia-[12%]" sizes="80vw" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <StatusPill label="إدارة الأصول العقارية" tone="gold" />
          <h1 className="mt-3 font-display text-3xl font-extrabold text-[#1D1916]">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-[#5f5953]">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={dashboardHref("admin", "assets/pending")} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#A7815E] px-5 text-sm font-extrabold text-white">بدء المراجعة</Link>
          <Link href={dashboardHref("admin", "reports/assets")} className="inline-flex min-h-11 items-center justify-center rounded-xl border bg-white px-5 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>تقرير الأصول</Link>
        </div>
      </div>
    </section>
  );
}

function AdminAssetFilters({ title, rows, q, activePath }: { title: string; rows: DashboardAdminAssetRow[]; q: string; activePath: string }) {
  const qSuffix = q ? `?q=${encodeURIComponent(q)}` : "";
  const filters = [
    ["كل الأصول", "assets"],
    ["بانتظار المراجعة", "assets/pending"],
    ["المعتمدة", "assets/approved"],
    ["المرفوضة", "assets/rejected"],
  ];
  return (
    <section className="rounded-[20px] border bg-white p-4 shadow-card" style={{ borderColor: uiColors.border }}>
      <form action={dashboardHref("admin", activePath)} className="grid gap-3 lg:grid-cols-[1.4fr_repeat(4,1fr)_auto]">
        <label className="relative block">
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6E6258]" />
          <input name="q" defaultValue={q} className="h-12 w-full rounded-xl border bg-[#fffdf9] pl-16 pr-12 text-sm font-bold outline-none focus:border-[#A7815E]" style={{ borderColor: uiColors.border }} placeholder={`ابحث في ${title}`} />
          <button type="submit" className="absolute left-2 top-1/2 h-8 -translate-y-1/2 rounded-lg bg-[#1D1916] px-3 text-xs font-extrabold text-white">بحث</button>
        </label>
        {filters.map(([filter, path]) => (
          <Link key={filter} href={dashboardHref("admin", `${path}${qSuffix}`)} className="flex h-12 items-center justify-between rounded-xl border bg-white px-4 text-sm font-extrabold text-[#1D1916]" style={{ borderColor: uiColors.border }}>
            <span>{filter}</span>
            <ChevronGlyph />
          </Link>
        ))}
        <FinancialExportButton filename="mahabah-admin-assets.csv" rows={adminAssetExportRows(rows)} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border bg-white px-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>تصدير</FinancialExportButton>
      </form>
    </section>
  );
}

function AdminAssetsTable({ rows, compact = false }: { rows: DashboardAdminAssetRow[]; compact?: boolean }) {
  return (
    <section className="overflow-hidden rounded-[22px] border bg-white shadow-card" style={{ borderColor: uiColors.border }}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-right text-sm" style={{ minWidth: 980 }}>
          <thead>
            <tr className="bg-[#f4ede5] text-xs font-extrabold text-[#5f5953]">
              {["الأصل العقاري", "المالك", "المدينة", "المساحة", "القيمة", "الحالة", "الإجراء"].map((header) => (
                <th key={header} className="px-4 py-3 font-extrabold first:w-[270px]">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? <tr><td colSpan={7} className="px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد أصول مطابقة لهذا التصنيف.</td></tr> : null}
            {rows.map((row) => {
              const meta = adminAssetStatusMeta[row.status];
              return (
                <tr key={row.id} className="border-b last:border-b-0" style={{ borderColor: uiColors.border }}>
                  <td className="px-4 py-4 align-middle">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f5eee7]">
                        <Image src={row.image} alt="" fill className="object-cover grayscale-[12%] sepia-[8%]" sizes="90px" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-display text-lg font-extrabold text-[#1D1916]">{row.titleAr}</p>
                        <p className="mt-1 text-xs font-bold text-[#6E6258]">{row.id} · {row.assetTypeAr}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle font-bold text-[#1D1916]">{row.owner}</td>
                  <td className="px-4 py-4 align-middle font-bold text-[#6E6258]">{row.cityAr}</td>
                  <td className="px-4 py-4 align-middle font-bold text-[#1D1916]">{formatArea(row.areaSqm)}</td>
                  <td className="px-4 py-4 align-middle font-bold text-[#1D1916]">{compact ? formatDashboardDate(row.submittedAt) : formatSar(row.estimatedValueSar)}</td>
                  <td className="px-4 py-4 align-middle"><StatusPill label={meta.label} tone={meta.tone} /></td>
                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-wrap gap-2">
                      <Link href={dashboardHref("admin", `assets/details?asset=${encodeURIComponent(row.slug || row.id)}`)} className="inline-flex min-h-10 items-center justify-center rounded-xl border bg-white px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>{meta.action}</Link>
                      {row.status === "pending" ? <ReviewDecisionButton entityType="asset" entityId={row.id} slug={row.slug} title={row.titleAr} decision="approved" className="min-h-10 rounded-xl bg-[#087342] px-3 text-xs font-extrabold text-white">اعتماد</ReviewDecisionButton> : null}
                      {row.status === "pending" ? <ReviewDecisionButton entityType="asset" entityId={row.id} slug={row.slug} title={row.titleAr} decision="rejected" className="min-h-10 rounded-xl border bg-[#fff0eb] px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: "#efc5b9" }}>رفض</ReviewDecisionButton> : null}
                      {row.status === "rejected" ? <ReviewDecisionButton entityType="asset" entityId={row.id} slug={row.slug} title={row.titleAr} decision="needs_changes" className="min-h-10 rounded-xl border bg-white px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إعادة فتح</ReviewDecisionButton> : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

async function AdminAssetDetailsPage({ config, searchParams = {} }: { config: DashboardRoleConfig; searchParams?: DashboardSearchParams }) {
  const assetsResult = await listDashboardAdminAssets();
  const selectedAsset = selectEntityByParam(assetsResult.data, searchParams, "asset", "id", "slug");
  const asset = selectedAsset ?? assetsResult.data.find((row) => row.status === "pending") ?? assetsResult.data[0];
  if (!asset) {
    return <div className="grid gap-5"><DashboardTopbar config={config} /><AdminAssetsHeader title="تفاصيل الأصل العقاري" subtitle="صفحة مراجعة تفصيلية تجمع بيانات الأصل والمالك والمرفقات وقرار الاعتماد قبل النشر." /><section className="rounded-[22px] border bg-white p-8 text-center text-sm font-extrabold text-[#6E6258]" style={{ borderColor: uiColors.border }}>لا توجد أصول لعرض تفاصيلها.</section></div>;
  }
  const checks = [
    ["بيانات الصك", "مكتملة", "green"],
    ["الموقع والمساحة", "مطابقة", "green"],
    ["الصور والمرفقات", "تحتاج مراجعة", "gold"],
    ["مخاطر الامتثال", "متوسطة", "red"],
  ] as const;

  return (
    <div className="grid gap-5">
      <DashboardTopbar config={config} />
      <AdminAssetsHeader title="تفاصيل الأصل العقاري" subtitle="صفحة مراجعة تفصيلية تجمع بيانات الأصل والمالك والمرفقات وقرار الاعتماد قبل النشر." />
      <section className="grid gap-5 lg:grid-cols-3">
        <article className="overflow-hidden rounded-[22px] border bg-white shadow-card lg:col-span-2" style={{ borderColor: uiColors.border }}>
          <div className="relative h-72 bg-[#f5eee7]">
            <Image src={asset.image} alt="" fill className="object-cover grayscale-[8%] sepia-[8%]" sizes="850px" priority />
            <span className="absolute right-5 top-5"><StatusPill label={adminAssetStatusMeta[asset.status].label} tone={adminAssetStatusMeta[asset.status].tone} /></span>
          </div>
          <div className="p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="font-display text-3xl font-extrabold text-[#1D1916]">{asset.titleAr}</h2>
                <p className="mt-2 flex items-center gap-2 text-sm font-bold text-[#6E6258]"><MapPin className="h-4 w-4" />{asset.cityAr} - {asset.districtAr}</p>
              </div>
              <div className="text-right md:text-left">
                <p className="text-xs font-bold text-[#6E6258]">القيمة التقديرية</p>
                <strong className="font-display text-2xl font-extrabold text-[#1D1916]">{formatSar(asset.estimatedValueSar)}</strong>
              </div>
            </div>
            <p className="mt-4 text-sm font-bold leading-8 text-[#5f5953]">{asset.excerptAr}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {[
                ["نوع الأصل", asset.assetTypeAr],
                ["الاستخدام", asset.usageTypeAr],
                ["المساحة", formatArea(asset.areaSqm)],
                ["عرض الشارع", `${asset.streetWidthM} م`],
                ["عدد الواجهات", `${asset.frontageCount}`],
                ["رقم الصك", asset.deedNumber],
                ["تاريخ الإرسال", formatDashboardDate(asset.submittedAt)],
                ["المراجع", asset.reviewer],
                ["مصدر البيانات", assetsResult.source === "supabase" ? "Supabase" : "بيانات تجريبية"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border bg-[#fffdf9] p-3" style={{ borderColor: uiColors.border }}>
                  <p className="text-xs font-bold text-[#6E6258]">{label}</p>
                  <p className="mt-1 text-sm font-extrabold text-[#1D1916]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </article>
        <aside className="grid content-start gap-4">
          <article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}>
            <h3 className="font-display text-xl font-extrabold text-[#1D1916]">قرار المراجعة</h3>
            <div className="mt-4 grid gap-2">
              <ReviewDecisionButton entityType="asset" entityId={asset.id} slug={asset.slug} title={asset.titleAr} decision="approved" className="min-h-11 rounded-xl px-4 text-sm font-extrabold text-white" style={{ backgroundColor: "#087342" }}>اعتماد الأصل</ReviewDecisionButton>
              <ReviewDecisionButton entityType="asset" entityId={asset.id} slug={asset.slug} title={asset.titleAr} decision="needs_changes" className="min-h-11 rounded-xl border bg-white px-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>طلب تعديل البيانات</ReviewDecisionButton>
              <ReviewDecisionButton entityType="asset" entityId={asset.id} slug={asset.slug} title={asset.titleAr} decision="rejected" className="min-h-11 rounded-xl border bg-[#fff0eb] px-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#efc5b9" }}>رفض الأصل</ReviewDecisionButton>
            </div>
          </article>
          <article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}>
            <h3 className="font-display text-xl font-extrabold text-[#1D1916]">قائمة التحقق</h3>
            <div className="mt-3 grid gap-3">
              {checks.map(([label, value, tone]) => {
                const style = toneStyles[tone as TrendTone];
                return (
                  <div key={label} className="flex items-center justify-between border-b border-[#eee7e0] pb-3 last:border-b-0">
                    <span className="text-sm font-bold text-[#1D1916]">{label}</span>
                    <span className="rounded-full px-3 py-1 text-xs font-extrabold" style={{ backgroundColor: style.bg, color: style.text }}>{value}</span>
                  </div>
                );
              })}
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}

async function AdminAssetsPage({ config, status, searchParams = {} }: { config: DashboardRoleConfig; status?: AdminAssetStatus; searchParams?: DashboardSearchParams }) {
  const assetsResult = await listDashboardAdminAssets();
  const q = stringParam(searchParams, "q").trim();
  const activePath = activePathFromStatus(status);
  const statusRows = status ? assetsResult.data.filter((row) => row.status === status) : assetsResult.data;
  const rows = statusRows.filter((row) => matchesDashboardSearch(q, [row.id, row.titleAr, row.owner, row.cityAr, row.districtAr, row.assetTypeAr, row.usageTypeAr, row.rawStatus, adminAssetStatusMeta[row.status].label, row.risk, row.estimatedValueSar, row.areaSqm]));
  const firstAssetRef = rows[0]?.slug || rows[0]?.id || assetsResult.data[0]?.slug || assetsResult.data[0]?.id;
  const assetDetailsPath = firstAssetRef ? `assets/details?asset=${encodeURIComponent(firstAssetRef)}` : "assets/details";
  const titles = {
    all: ["جميع الأصول العقارية", "إدارة جميع الأصول العقارية المرسلة للمنصة مع أدوات البحث والتصفية ومتابعة حالة الاعتماد."],
    pending: ["الأصول بانتظار المراجعة", "قائمة تشغيل يومية للأصول التي تحتاج مراجعة بيانات ومرفقات قبل الاعتماد أو الرفض."],
    needs_changes: ["الأصول المطلوب تحديثها", "الأصول التي أعادها فريق المراجعة مع ملاحظات لاستكمال البيانات أو المستندات."],
    approved: ["الأصول المعتمدة", "الأصول التي اجتازت المراجعة وأصبحت جاهزة للظهور أو الربط بالمساهمات والخدمات."],
    rejected: ["الأصول المرفوضة", "الأصول التي تم رفضها مع أسباب القرار وخيارات إعادة الفتح عند استكمال البيانات."],
  } as const;
  const [title, subtitle] = status ? titles[status] : titles.all;

  return (
    <div className="grid gap-5">
      <DashboardTopbar config={config} />
      <AdminAssetsHeader title={title} subtitle={subtitle} />
      <AdminAssetKpis rows={assetsResult.data} activeStatus={status} />
      <AdminAssetFilters title={title} rows={rows} q={q} activePath={activePath} />
      {assetsResult.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر الاتصال ببيانات الأصول الحية، وتم عرض بيانات تجريبية مؤقتة.</section> : null}
      <section className="flex flex-wrap gap-2">
        {[
          ["جميع الأصول", "assets"],
          ["بانتظار المراجعة", "assets/pending"],
          ["المعتمدة", "assets/approved"],
          ["المرفوضة", "assets/rejected"],
          ["تفاصيل أصل", assetDetailsPath],
        ].map(([label, path]) => (
          <Link key={path} href={dashboardHref("admin", path)} className={cn("inline-flex min-h-10 items-center justify-center rounded-xl border px-4 text-sm font-extrabold", activePath === path ? "bg-[#A7815E] text-white" : "bg-white text-[#1D1916]")} style={{ borderColor: activePath === path ? "#A7815E" : uiColors.border }}>
            {label}
          </Link>
        ))}
      </section>
      <AdminAssetsTable rows={rows} compact={status === "pending"} />
      {status === "rejected" ? (
        <section className="grid gap-4 xl:grid-cols-3">
          {rows.map((row) => (
            <article key={`${row.id}-reason`} className="rounded-[18px] border bg-white p-4 shadow-card" style={{ borderColor: uiColors.border }}>
              <h3 className="font-display text-lg font-extrabold text-[#1D1916]">{row.titleAr}</h3>
              <p className="mt-2 text-sm font-bold leading-7 text-[#6E6258]">سبب الرفض: نقص في مرفقات الملكية أو عدم وضوح بيانات الاستخدام والمساحة.</p>
              <ReviewDecisionButton entityType="asset" entityId={row.id} slug={row.slug} title={row.titleAr} decision="needs_changes" className="mt-4 min-h-10 rounded-xl border px-4 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إعادة فتح المراجعة</ReviewDecisionButton>
            </article>
          ))}
        </section>
      ) : null}
    </div>
  );
}

type AdminContributionStatus = DashboardAdminReviewStatus;

const adminContributionStatusMeta: Record<AdminContributionStatus, { label: string; tone: TrendTone; action: string }> = {
  pending: { label: "بانتظار المراجعة", tone: "gold", action: "مراجعة المساهمة" },
  needs_changes: { label: "مطلوب تحديث", tone: "red", action: "متابعة الملاحظات" },
  approved: { label: "معتمدة", tone: "green", action: "عرض التفاصيل" },
  rejected: { label: "مرفوضة", tone: "red", action: "عرض سبب الرفض" },
};

function adminContributionExportRows(rows: DashboardAdminContributionRow[]) {
  return rows.map((row) => ({
    "رقم المساهمة": row.id,
    "اسم المساهمة": row.titleAr,
    "المنشأة": row.sponsor,
    "المدينة": row.cityAr,
    "المرحلة": row.stageAr,
    "رأس المال": row.capitalSar,
    "نسبة التمويل": row.fundedPercent,
    "الحالة": adminContributionStatusMeta[row.status].label,
    "المخاطر": row.risk,
    "تاريخ الإرسال": row.submittedAt,
  }));
}

function AdminContributionKpis({ rows, activeStatus }: { rows: DashboardAdminContributionRow[]; activeStatus?: AdminContributionStatus }) {
  const total = rows.length;
  const pending = rows.filter((item) => item.status === "pending").length;
  const approved = rows.filter((item) => item.status === "approved").length;
  const rejected = rows.filter((item) => item.status === "rejected").length;
  const cards = [
    { title: "إجمالي المساهمات", value: String(total), unit: "مساهمة عقارية", icon: "clipboard", tone: "blue" as TrendTone, active: !activeStatus },
    { title: "بانتظار المراجعة", value: String(pending), unit: "طلبات", icon: "clock", tone: "gold" as TrendTone, active: activeStatus === "pending" },
    { title: "المساهمات المعتمدة", value: String(approved), unit: "مساهمات", icon: "shield", tone: "green" as TrendTone, active: activeStatus === "approved" },
    { title: "المساهمات المرفوضة", value: String(rejected), unit: "مساهمات", icon: "x", tone: "red" as TrendTone, active: activeStatus === "rejected" },
  ];

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const tone = toneStyles[card.tone];
        return (
          <article key={card.title} className={cn("rounded-[18px] border bg-white p-4 text-right shadow-card", card.active ? "ring-2 ring-[#A7815E]/30" : "")} style={{ borderColor: card.active ? "#A7815E" : uiColors.border }}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold text-[#5f5953]">{card.title}</p>
                <strong className="mt-2 block font-display text-4xl font-extrabold text-[#1D1916]">{card.value}</strong>
                <span className="text-xs font-bold text-[#6E6258]">{card.unit}</span>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-full border" style={{ backgroundColor: tone.bg, borderColor: tone.border, color: tone.text }}>
                <Icon name={card.icon} className="h-6 w-6" />
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function AdminContributionsHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="relative overflow-hidden rounded-[24px] border bg-white p-5 shadow-card md:p-6" style={{ borderColor: uiColors.border }}>
      <Image src="/images/contribution-dark-art.png" alt="" fill className="object-cover opacity-[0.12] grayscale-[12%] sepia-[12%]" sizes="80vw" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <StatusPill label="إدارة المساهمات العقارية" tone="gold" />
          <h1 className="mt-3 font-display text-3xl font-extrabold text-[#1D1916]">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-[#5f5953]">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={dashboardHref("admin", "contributions/pending")} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#A7815E] px-5 text-sm font-extrabold text-white">بدء المراجعة</Link>
          <Link href={dashboardHref("admin", "reports/contributions")} className="inline-flex min-h-11 items-center justify-center rounded-xl border bg-white px-5 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>تقرير المساهمات</Link>
        </div>
      </div>
    </section>
  );
}

function AdminContributionFilters({ title, rows, q, activePath }: { title: string; rows: DashboardAdminContributionRow[]; q: string; activePath: string }) {
  const qSuffix = q ? `?q=${encodeURIComponent(q)}` : "";
  const filters = [
    ["كل المساهمات", "contributions"],
    ["بانتظار المراجعة", "contributions/pending"],
    ["المعتمدة", "contributions/approved"],
    ["المرفوضة", "contributions/rejected"],
  ];
  return (
    <section className="rounded-[20px] border bg-white p-4 shadow-card" style={{ borderColor: uiColors.border }}>
      <form action={dashboardHref("admin", activePath)} className="grid gap-3 lg:grid-cols-[1.4fr_repeat(4,1fr)_auto]">
        <label className="relative block">
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6E6258]" />
          <input name="q" defaultValue={q} className="h-12 w-full rounded-xl border bg-[#fffdf9] pl-16 pr-12 text-sm font-bold outline-none focus:border-[#A7815E]" style={{ borderColor: uiColors.border }} placeholder={`ابحث في ${title}`} />
          <button type="submit" className="absolute left-2 top-1/2 h-8 -translate-y-1/2 rounded-lg bg-[#1D1916] px-3 text-xs font-extrabold text-white">بحث</button>
        </label>
        {filters.map(([filter, path]) => (
          <Link key={filter} href={dashboardHref("admin", `${path}${qSuffix}`)} className="flex h-12 items-center justify-between rounded-xl border bg-white px-4 text-sm font-extrabold text-[#1D1916]" style={{ borderColor: uiColors.border }}>
            <span>{filter}</span>
            <ChevronGlyph />
          </Link>
        ))}
        <FinancialExportButton filename="mahabah-admin-contributions.csv" rows={adminContributionExportRows(rows)} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border bg-white px-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>تصدير</FinancialExportButton>
      </form>
    </section>
  );
}

function FundingBar({ value }: { value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-extrabold text-[#6E6258]">
        <span>{value}%</span>
        <span>التمويل</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#eee7e0]">
        <span className="block h-full rounded-full bg-[#A7815E]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function AdminContributionsTable({ rows, compact = false }: { rows: DashboardAdminContributionRow[]; compact?: boolean }) {
  return (
    <section className="overflow-hidden rounded-[22px] border bg-white shadow-card" style={{ borderColor: uiColors.border }}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-right text-sm" style={{ minWidth: 980 }}>
          <thead>
            <tr className="bg-[#f4ede5] text-xs font-extrabold text-[#5f5953]">
              {["المساهمة", "المنشأة", "المدينة", "رأس المال", "التمويل", "الحالة", "الإجراء"].map((header) => (
                <th key={header} className="px-4 py-3 font-extrabold first:w-[270px]">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? <tr><td colSpan={7} className="px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد مساهمات مطابقة لهذا التصنيف.</td></tr> : null}
            {rows.map((row) => {
              const meta = adminContributionStatusMeta[row.status];
              return (
                <tr key={row.id} className="border-b last:border-b-0" style={{ borderColor: uiColors.border }}>
                  <td className="px-4 py-4 align-middle">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f5eee7]">
                        <Image src={row.image} alt="" fill className="object-cover grayscale-[12%] sepia-[8%]" sizes="90px" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-display text-lg font-extrabold text-[#1D1916]">{row.titleAr}</p>
                        <p className="mt-1 text-xs font-bold text-[#6E6258]">{row.id} · {compact ? row.submittedAt : row.stageAr}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle font-bold text-[#1D1916]">{row.sponsor}</td>
                  <td className="px-4 py-4 align-middle font-bold text-[#6E6258]">{row.cityAr}</td>
                  <td className="px-4 py-4 align-middle font-bold text-[#1D1916]">{formatSar(row.capitalSar)}</td>
                  <td className="px-4 py-4 align-middle"><FundingBar value={row.fundedPercent} /></td>
                  <td className="px-4 py-4 align-middle"><StatusPill label={meta.label} tone={meta.tone} /></td>
                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-wrap gap-2">
                      <Link href={dashboardHref("admin", `contributions/details?contribution=${encodeURIComponent(row.slug || row.id)}`)} className="inline-flex min-h-10 items-center justify-center rounded-xl border bg-white px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>{meta.action}</Link>
                      {row.status === "pending" ? <ReviewDecisionButton entityType="contribution" entityId={row.id} slug={row.slug} title={row.titleAr} decision="approved" className="min-h-10 rounded-xl bg-[#087342] px-3 text-xs font-extrabold text-white">اعتماد</ReviewDecisionButton> : null}
                      {row.status === "pending" ? <ReviewDecisionButton entityType="contribution" entityId={row.id} slug={row.slug} title={row.titleAr} decision="rejected" className="min-h-10 rounded-xl border bg-[#fff0eb] px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: "#efc5b9" }}>رفض</ReviewDecisionButton> : null}
                      {row.status === "rejected" ? <ReviewDecisionButton entityType="contribution" entityId={row.id} slug={row.slug} title={row.titleAr} decision="needs_changes" className="min-h-10 rounded-xl border bg-white px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إعادة فتح</ReviewDecisionButton> : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

async function AdminContributionDetailsPage({ config, searchParams = {} }: { config: DashboardRoleConfig; searchParams?: DashboardSearchParams }) {
  const contributionsResult = await listDashboardAdminContributions();
  const selectedContribution = selectEntityByParam(contributionsResult.data, searchParams, "contribution", "id", "slug");
  const contribution = selectedContribution ?? contributionsResult.data.find((row) => row.status === "pending") ?? contributionsResult.data[0];
  if (!contribution) {
    return <div className="grid gap-5"><DashboardTopbar config={config} /><AdminContributionsHeader title="تفاصيل المساهمة" subtitle="صفحة مراجعة تفصيلية تجمع بيانات المساهمة والتمويل والحوكمة قبل اعتماد الطرح." /><section className="rounded-[22px] border bg-white p-8 text-center text-sm font-extrabold text-[#6E6258]" style={{ borderColor: uiColors.border }}>لا توجد مساهمات لعرض تفاصيلها.</section></div>;
  }
  const checks = [
    ["نشرة الطرح", "مكتملة", "green"],
    ["اعتماد رأس المال", "مطابقة", "green"],
    ["دراسة العوائد", "تحتاج مراجعة", "gold"],
    ["مخاطر الإفصاح", "متوسطة", "red"],
  ] as const;

  return (
    <div className="grid gap-5">
      <DashboardTopbar config={config} />
      <AdminContributionsHeader title="تفاصيل المساهمة" subtitle="صفحة مراجعة تفصيلية تجمع بيانات المساهمة والتمويل والحوكمة قبل اعتماد الطرح." />
      <section className="grid gap-5 lg:grid-cols-3">
        <aside className="grid content-start gap-4">
          <article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}>
            <h3 className="font-display text-xl font-extrabold text-[#1D1916]">قرار المراجعة</h3>
            <div className="mt-4 grid gap-2">
              <ReviewDecisionButton entityType="contribution" entityId={contribution.id} slug={contribution.slug} title={contribution.titleAr} decision="approved" className="min-h-11 rounded-xl px-4 text-sm font-extrabold text-white" style={{ backgroundColor: "#087342" }}>اعتماد المساهمة</ReviewDecisionButton>
              <ReviewDecisionButton entityType="contribution" entityId={contribution.id} slug={contribution.slug} title={contribution.titleAr} decision="needs_changes" className="min-h-11 rounded-xl border bg-white px-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>طلب تعديل البيانات</ReviewDecisionButton>
              <ReviewDecisionButton entityType="contribution" entityId={contribution.id} slug={contribution.slug} title={contribution.titleAr} decision="rejected" className="min-h-11 rounded-xl border bg-[#fff0eb] px-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#efc5b9" }}>رفض المساهمة</ReviewDecisionButton>
            </div>
          </article>
          <article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}>
            <h3 className="font-display text-xl font-extrabold text-[#1D1916]">قائمة التحقق</h3>
            <div className="mt-3 grid gap-3">
              {checks.map(([label, value, tone]) => {
                const style = toneStyles[tone as TrendTone];
                return (
                  <div key={label} className="flex items-center justify-between border-b border-[#eee7e0] pb-3 last:border-b-0">
                    <span className="text-sm font-bold text-[#1D1916]">{label}</span>
                    <span className="rounded-full px-3 py-1 text-xs font-extrabold" style={{ backgroundColor: style.bg, color: style.text }}>{value}</span>
                  </div>
                );
              })}
            </div>
          </article>
        </aside>
        <article className="overflow-hidden rounded-[22px] border bg-white shadow-card lg:col-span-2" style={{ borderColor: uiColors.border }}>
          <div className="relative h-72 bg-[#f5eee7]">
            <Image src={contribution.image} alt="" fill className="object-cover grayscale-[8%] sepia-[8%]" sizes="850px" priority />
            <span className="absolute right-5 top-5"><StatusPill label={adminContributionStatusMeta[contribution.status].label} tone={adminContributionStatusMeta[contribution.status].tone} /></span>
          </div>
          <div className="p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="font-display text-3xl font-extrabold text-[#1D1916]">{contribution.titleAr}</h2>
                <p className="mt-2 flex items-center gap-2 text-sm font-bold text-[#6E6258]"><MapPin className="h-4 w-4" />{contribution.cityAr} · {contribution.stageAr}</p>
              </div>
              <div className="text-right md:text-left">
                <p className="text-xs font-bold text-[#6E6258]">رأس المال</p>
                <strong className="font-display text-2xl font-extrabold text-[#1D1916]">{formatSar(contribution.capitalSar)}</strong>
              </div>
            </div>
            <p className="mt-4 text-sm font-bold leading-8 text-[#5f5953]">{contribution.excerptAr}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {[
                ["نسبة التمويل", `${contribution.fundedPercent}%`],
                ["عدد المستثمرين", `${contribution.investorsCount}`],
                ["مدة الاستثمار", `${contribution.durationMonths} شهر`],
                ["العائد المتوقع", `${contribution.expectedReturnPercent}%`],
                ["الأيام المتبقية", `${contribution.remainingDays} يوم`],
                ["المنشأة", contribution.sponsor],
                ["تاريخ الإرسال", formatDashboardDate(contribution.submittedAt)],
                ["المراجع", contribution.reviewer],
                ["مصدر البيانات", contributionsResult.source === "supabase" ? "Supabase" : "بيانات تجريبية"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border bg-[#fffdf9] p-3" style={{ borderColor: uiColors.border }}>
                  <p className="text-xs font-bold text-[#6E6258]">{label}</p>
                  <p className="mt-1 text-sm font-extrabold text-[#1D1916]">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border bg-[#fffdf9] p-4" style={{ borderColor: uiColors.border }}>
              <FundingBar value={contribution.fundedPercent} />
              <div className="mt-4 grid gap-2 md:grid-cols-4">
                {contribution.timeline.slice(0, 4).map((item) => (
                  <div key={item.labelAr} className="flex items-center gap-2 text-xs font-extrabold text-[#1D1916]">
                    <span className={cn("grid h-6 w-6 place-items-center rounded-full border", item.completed ? "border-[#087342] bg-[#e9f7ef] text-[#087342]" : item.current ? "border-[#A7815E] bg-[#fbf3e9] text-[#A7815E]" : "border-[#D9D1C7] text-[#6E6258]")}>{item.completed ? "✓" : item.current ? "•" : ""}</span>
                    {item.labelAr}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

async function AdminContributionsPage({ config, status, searchParams = {} }: { config: DashboardRoleConfig; status?: AdminContributionStatus; searchParams?: DashboardSearchParams }) {
  const contributionsResult = await listDashboardAdminContributions();
  const q = stringParam(searchParams, "q").trim();
  const activePath = activeContributionPathFromStatus(status);
  const statusRows = status ? contributionsResult.data.filter((row) => row.status === status) : contributionsResult.data;
  const rows = statusRows.filter((row) => matchesDashboardSearch(q, [row.id, row.titleAr, row.sponsor, row.cityAr, row.stageAr, row.licenseNumber, row.offeringUrl, row.rawStatus, adminContributionStatusMeta[row.status].label, row.risk, row.capitalSar, row.fundedPercent, row.investorsCount]));
  const firstContributionRef = rows[0]?.slug || rows[0]?.id || contributionsResult.data[0]?.slug || contributionsResult.data[0]?.id;
  const contributionDetailsPath = firstContributionRef ? `contributions/details?contribution=${encodeURIComponent(firstContributionRef)}` : "contributions/details";
  const titles = {
    all: ["جميع المساهمات العقارية", "إدارة جميع المساهمات العقارية ومتابعة حالتها التمويلية والتنظيمية قبل الطرح أو الاعتماد."],
    pending: ["المساهمات بانتظار المراجعة", "قائمة المساهمات التي تحتاج تدقيق رأس المال ونشرة الطرح والحوكمة قبل الاعتماد."],
    needs_changes: ["المساهمات المطلوب تحديثها", "المساهمات التي تحتاج استكمال ملاحظات المراجعة قبل الاعتماد أو الطرح."],
    approved: ["المساهمات المعتمدة", "المساهمات التي اجتازت المراجعة وأصبحت جاهزة للظهور والمتابعة التشغيلية."],
    rejected: ["المساهمات المرفوضة", "المساهمات التي تم رفضها مع أسباب القرار وخيارات إعادة الفتح عند استكمال البيانات."],
  } as const;
  const [title, subtitle] = status ? titles[status] : titles.all;

  return (
    <div className="grid gap-5">
      <DashboardTopbar config={config} />
      <AdminContributionsHeader title={title} subtitle={subtitle} />
      <AdminContributionKpis rows={contributionsResult.data} activeStatus={status} />
      <AdminContributionFilters title={title} rows={rows} q={q} activePath={activePath} />
      {contributionsResult.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر الاتصال ببيانات المساهمات الحية، وتم عرض بيانات تجريبية مؤقتة.</section> : null}
      <section className="flex flex-wrap gap-2">
        {[
          ["جميع المساهمات", "contributions"],
          ["بانتظار المراجعة", "contributions/pending"],
          ["المعتمدة", "contributions/approved"],
          ["المرفوضة", "contributions/rejected"],
          ["تفاصيل مساهمة", contributionDetailsPath],
        ].map(([label, path]) => (
          <Link key={path} href={dashboardHref("admin", path)} className={cn("inline-flex min-h-10 items-center justify-center rounded-xl border px-4 text-sm font-extrabold", activePath === path ? "bg-[#A7815E] text-white" : "bg-white text-[#1D1916]")} style={{ borderColor: activePath === path ? "#A7815E" : uiColors.border }}>
            {label}
          </Link>
        ))}
      </section>
      <AdminContributionsTable rows={rows} compact={status === "pending"} />
      {status === "rejected" ? (
        <section className="grid gap-4 xl:grid-cols-3">
          {rows.map((row) => (
            <article key={`${row.id}-reason`} className="rounded-[18px] border bg-white p-4 shadow-card" style={{ borderColor: uiColors.border }}>
              <h3 className="font-display text-lg font-extrabold text-[#1D1916]">{row.titleAr}</h3>
              <p className="mt-2 text-sm font-bold leading-7 text-[#6E6258]">سبب الرفض: نقص في إفصاحات الطرح أو عدم اكتمال دراسة العوائد والمخاطر.</p>
              <ReviewDecisionButton entityType="contribution" entityId={row.id} slug={row.slug} title={row.titleAr} decision="needs_changes" className="mt-4 min-h-10 rounded-xl border px-4 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إعادة فتح المراجعة</ReviewDecisionButton>
            </article>
          ))}
        </section>
      ) : null}
    </div>
  );
}

function activeContributionPathFromStatus(status?: AdminContributionStatus) {
  if (!status) return "contributions";
  return `contributions/${status}`;
}

type AdminServiceRequestStatus = DashboardAdminServiceRequestStatus;

const adminServiceRequestStatusMeta: Record<AdminServiceRequestStatus, { label: string; tone: TrendTone; action: string }> = {
  new: { label: "طلب جديد", tone: "gold", action: "تعيين مزود" },
  assigned: { label: "قيد التنفيذ", tone: "blue", action: "عرض التفاصيل" },
  completed: { label: "مكتمل", tone: "green", action: "عرض التقرير" },
  urgent: { label: "عاجل", tone: "red", action: "معالجة عاجلة" },
  needs_changes: { label: "مطلوب تحديث", tone: "red", action: "متابعة الملاحظات" },
  cancelled: { label: "ملغي", tone: "red", action: "عرض سبب الإلغاء" },
};

function adminServiceRequestsForCatalog(service: DashboardAdminServiceCatalogItem, requests: DashboardAdminServiceRequest[]) {
  return requests.filter((request) => request.serviceType === service.titleAr || request.title.includes(service.titleAr)).length;
}

function adminServiceRequestExportRows(rows: DashboardAdminServiceRequest[]) {
  return rows.map((row) => ({
    "رقم الطلب": row.id,
    "عنوان الطلب": row.title,
    "نوع الخدمة": row.serviceType,
    "طالب الخدمة": row.requester,
    "المدينة": row.city,
    "نوع الأصل": row.assetType,
    "المساحة": row.areaSqm,
    "الحالة": adminServiceRequestStatusMeta[row.status].label,
    "الأولوية": row.priority,
    "مزود الخدمة": row.provider,
    "القيمة": row.price,
    "تاريخ الطلب": row.submittedAt,
    "تاريخ التسليم": row.dueAt,
  }));
}

function AdminServicesHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="relative overflow-hidden rounded-[24px] border bg-white p-5 shadow-card md:p-6" style={{ borderColor: uiColors.border }}>
      <Image src="/images/hero-completed.png" alt="" fill className="object-cover opacity-[0.12] grayscale-[12%] sepia-[12%]" sizes="80vw" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <StatusPill label="إدارة الخدمات العقارية" tone="gold" />
          <h1 className="mt-3 font-display text-3xl font-extrabold text-[#1D1916]">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-[#5f5953]">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={dashboardHref("admin", "services/add")} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#A7815E] px-5 text-sm font-extrabold text-white">إضافة خدمة</Link>
          <Link href={dashboardHref("admin", "services/pricing")} className="inline-flex min-h-11 items-center justify-center rounded-xl border bg-white px-5 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إدارة الأسعار</Link>
        </div>
      </div>
    </section>
  );
}

function AdminServiceKpis({ active = "requests", requests, serviceCount = 0 }: { active?: "requests" | "catalog" | "pricing"; requests: DashboardAdminServiceRequest[]; serviceCount?: number }) {
  const urgent = requests.filter((item) => item.status === "urgent").length;
  const completed = requests.filter((item) => item.status === "completed").length;
  const cards = [
    { title: "طلبات الخدمات", value: String(requests.length), unit: "طلب", icon: "file", tone: "blue" as TrendTone, active: active === "requests" },
    { title: "الخدمات العقارية", value: String(serviceCount), unit: "خدمة", icon: "settings", tone: "gold" as TrendTone, active: active === "catalog" },
    { title: "طلبات مكتملة", value: String(completed), unit: "طلبات", icon: "shield", tone: "green" as TrendTone, active: false },
    { title: "طلبات عاجلة", value: String(urgent), unit: "طلبات", icon: "x", tone: "red" as TrendTone, active: false },
  ];

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const tone = toneStyles[card.tone];
        return (
          <article key={card.title} className={cn("rounded-[18px] border bg-white p-4 text-right shadow-card", card.active ? "ring-2 ring-[#A7815E]/30" : "")} style={{ borderColor: card.active ? "#A7815E" : uiColors.border }}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold text-[#5f5953]">{card.title}</p>
                <strong className="mt-2 block font-display text-4xl font-extrabold text-[#1D1916]">{card.value}</strong>
                <span className="text-xs font-bold text-[#6E6258]">{card.unit}</span>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-full border" style={{ backgroundColor: tone.bg, borderColor: tone.border, color: tone.text }}>
                <Icon name={card.icon} className="h-6 w-6" />
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function AdminServiceNav({ activePath, requestDetailPath = "service-requests/details" }: { activePath: string; requestDetailPath?: string }) {
  const items = [
    { label: "طلبات الخدمات", path: "service-requests", active: "service-requests" },
    { label: "تفاصيل الطلب", path: requestDetailPath, active: "service-requests/details" },
    { label: "الخدمات العقارية", path: "services", active: "services" },
    { label: "إضافة خدمة", path: "services/add", active: "services/add" },
    { label: "تعديل خدمة", path: "services/edit", active: "services/edit" },
    { label: "أسعار الخدمات", path: "services/pricing", active: "services/pricing" },
  ];
  return (
    <section className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link key={item.active} href={dashboardHref("admin", item.path)} className={cn("inline-flex min-h-10 items-center justify-center rounded-xl border px-4 text-sm font-extrabold", activePath === item.active ? "bg-[#A7815E] text-white" : "bg-white text-[#1D1916]")} style={{ borderColor: activePath === item.active ? "#A7815E" : uiColors.border }}>
          {item.label}
        </Link>
      ))}
    </section>
  );
}

function AdminServiceFilters({ title, rows, q = "", activePath = "service-requests" }: { title: string; rows?: DashboardAdminServiceRequest[]; q?: string; activePath?: string }) {
  const qSuffix = q ? `&q=${encodeURIComponent(q)}` : "";
  const filters = [
    ["كل الحالات", "service-requests"],
    ["طلبات جديدة", "service-requests?status=new"],
    ["قيد التنفيذ", "service-requests?status=assigned"],
    ["مكتملة", "service-requests?status=completed"],
    ["عاجلة", "service-requests?status=urgent"],
  ];
  return (
    <section className="rounded-[20px] border bg-white p-4 shadow-card" style={{ borderColor: uiColors.border }}>
      <form action={dashboardHref("admin", activePath)} className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_repeat(6,minmax(105px,auto))]">
        <label className="relative block">
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6E6258]" />
          <input name="q" defaultValue={q} className="h-12 w-full rounded-xl border bg-[#fffdf9] pl-16 pr-12 text-sm font-bold outline-none focus:border-[#A7815E]" style={{ borderColor: uiColors.border }} placeholder={`ابحث في ${title}`} />
          <button type="submit" className="absolute left-2 top-1/2 h-8 -translate-y-1/2 rounded-lg bg-[#1D1916] px-3 text-xs font-extrabold text-white">بحث</button>
        </label>
        {filters.map(([filter, path]) => (
          <Link key={filter} href={dashboardHref("admin", `${path}${path.includes("?") ? qSuffix : q ? `?q=${encodeURIComponent(q)}` : ""}`)} className="flex h-12 items-center justify-between rounded-xl border bg-white px-4 text-sm font-extrabold text-[#1D1916]" style={{ borderColor: uiColors.border }}>
            <span>{filter}</span>
            <ChevronGlyph />
          </Link>
        ))}
        {rows ? (
          <FinancialExportButton filename="mahabah-admin-service-requests.csv" rows={adminServiceRequestExportRows(rows)} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border bg-white px-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>تصدير</FinancialExportButton>
        ) : null}
      </form>
    </section>
  );
}

async function AdminServiceRequestsPage({ config, searchParams = {} }: { config: DashboardRoleConfig; searchParams?: DashboardSearchParams }) {
  const requestsResult = await listDashboardAdminServiceRequests();
  const servicesResult = await listDashboardAdminServiceCatalog();
  const q = stringParam(searchParams, "q").trim();
  const activeStatus = stringParam(searchParams, "status").trim();
  const rows = requestsResult.data.filter((row) => {
    const statusMatches = activeStatus ? row.status === activeStatus : true;
    return statusMatches && matchesDashboardSearch(q, [row.id, row.title, row.serviceType, row.description, row.requester, row.provider, row.city, row.assetType, row.rawStatus, adminServiceRequestStatusMeta[row.status].label, row.price]);
  });
  const firstRequestId = rows[0]?.id || requestsResult.data[0]?.id;
  const requestDetailPath = firstRequestId ? `service-requests/details?request=${encodeURIComponent(firstRequestId)}` : "service-requests/details";

  return (
    <div className="grid gap-5">
      <DashboardTopbar config={config} />
      <AdminServicesHeader title="طلبات الخدمات" subtitle="إدارة طلبات الخدمات العقارية وتوزيعها على مزودي الخدمة ومتابعة مدد التنفيذ." />
      <AdminServiceKpis active="requests" requests={requestsResult.data} serviceCount={servicesResult.data.length} />
      <AdminServiceFilters title="طلبات الخدمات" rows={rows} q={q} activePath="service-requests" />
      {requestsResult.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر الاتصال ببيانات طلبات الخدمات الحية، وتم عرض بيانات تجريبية مؤقتة.</section> : null}
      <AdminServiceNav activePath="service-requests" requestDetailPath={requestDetailPath} />
      <section className="overflow-hidden rounded-[22px] border bg-white shadow-card" style={{ borderColor: uiColors.border }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-right text-sm" style={{ minWidth: 1120 }}>
            <thead>
              <tr className="bg-[#f4ede5] text-xs font-extrabold text-[#5f5953]">
                {["الطلب", "طالب الخدمة", "المدينة", "مزود الخدمة", "الموعد", "القيمة", "الحالة", "الإجراء"].map((header) => (
                  <th key={header} className="px-4 py-3 font-extrabold first:w-[270px]">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد طلبات خدمات حالياً.</td>
                </tr>
              ) : rows.map((row) => {
                const meta = adminServiceRequestStatusMeta[row.status];
                return (
                  <tr key={row.id} className="border-b last:border-b-0" style={{ borderColor: uiColors.border }}>
                    <td className="px-4 py-4 align-middle">
                      <p className="font-display text-lg font-extrabold text-[#1D1916]">{row.title}</p>
                      <p className="mt-1 text-xs font-bold text-[#6E6258]">{row.id} · {row.serviceType}</p>
                    </td>
                    <td className="px-4 py-4 align-middle font-bold text-[#1D1916]">{row.requester}</td>
                    <td className="px-4 py-4 align-middle font-bold text-[#6E6258]">{row.city}</td>
                    <td className="px-4 py-4 align-middle font-bold text-[#1D1916]">{row.provider}</td>
                    <td className="px-4 py-4 align-middle font-bold text-[#1D1916]">{formatDashboardDate(row.dueAt || row.submittedAt)}</td>
                    <td className="px-4 py-4 align-middle font-bold text-[#1D1916]">{formatSar(row.price)}</td>
                    <td className="px-4 py-4 align-middle"><StatusPill label={meta.label} tone={meta.tone} /></td>
                    <td className="px-4 py-4 align-middle">
                      <div className="flex flex-wrap gap-2">
                        <Link href={dashboardHref("admin", `service-requests/details?request=${encodeURIComponent(row.id)}`)} className="inline-flex min-h-10 items-center justify-center rounded-xl border bg-white px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>عرض</Link>
                        {row.status === "new" || row.status === "urgent" ? (
                          <ReviewDecisionButton entityType="service_request" entityId={row.id} title={row.title} decision="approved" className="min-h-10 rounded-xl bg-[#087342] px-3 text-xs font-extrabold text-white">تعيين</ReviewDecisionButton>
                        ) : null}
                        {row.status !== "completed" ? (
                          <ReviewDecisionButton entityType="service_request" entityId={row.id} title={row.title} decision="needs_changes" className="min-h-10 rounded-xl border bg-white px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>معلومات</ReviewDecisionButton>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

async function AdminServiceRequestDetailsPage({ config, searchParams = {} }: { config: DashboardRoleConfig; searchParams?: DashboardSearchParams }) {
  const requestsResult = await listDashboardAdminServiceRequests();
  const selectedRequest = selectEntityByParam(requestsResult.data, searchParams, "request", "id");
  const request = selectedRequest ?? requestsResult.data.find((item) => item.status !== "completed") ?? requestsResult.data[0];
  const meta = request ? adminServiceRequestStatusMeta[request.status] : null;
  return (
    <div className="grid gap-5">
      <DashboardTopbar config={config} />
      <AdminServicesHeader title="تفاصيل الطلب" subtitle="مراجعة طلب الخدمة وتعيين مزود ومتابعة التسليمات والملاحظات التشغيلية." />
      {requestsResult.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر الاتصال ببيانات الطلب الحية، وتم عرض بيانات تجريبية مؤقتة.</section> : null}
      {request && meta ? (
        <section className="grid gap-5 lg:grid-cols-3">
          <aside className="grid content-start gap-4">
            <article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}>
              <h3 className="font-display text-xl font-extrabold text-[#1D1916]">إجراءات الطلب</h3>
              <div className="mt-4 grid gap-2">
                <ReviewDecisionButton entityType="service_request" entityId={request.id} title={request.title} decision="approved" className="min-h-11 rounded-xl px-4 text-sm font-extrabold text-white" style={{ backgroundColor: "#087342" }}>تعيين مزود خدمة</ReviewDecisionButton>
                <ReviewDecisionButton entityType="service_request" entityId={request.id} title={request.title} decision="needs_changes" className="min-h-11 rounded-xl border bg-white px-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>طلب معلومات إضافية</ReviewDecisionButton>
                <ReviewDecisionButton entityType="service_request" entityId={request.id} title={request.title} decision="rejected" className="min-h-11 rounded-xl border bg-[#fff0eb] px-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#efc5b9" }}>إغلاق الطلب</ReviewDecisionButton>
              </div>
            </article>
            <article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}>
              <h3 className="font-display text-xl font-extrabold text-[#1D1916]">مسار التنفيذ</h3>
              {["استلام الطلب", "مراجعة النطاق", "تعيين المزود", "إصدار التقرير"].map((step, index) => {
                const completedStep = request.status === "completed" || (request.status === "assigned" && index < 3) || index < 2;
                return (
                  <div key={step} className="flex items-center gap-3 border-b py-3 last:border-b-0" style={{ borderColor: uiColors.border }}>
                    <span className={cn("grid h-7 w-7 place-items-center rounded-full border text-xs", completedStep ? "border-[#087342] bg-[#e9f7ef] text-[#087342]" : "border-[#D9D1C7] text-[#6E6258]")}>{completedStep ? "✓" : ""}</span>
                    <span className="text-sm font-extrabold text-[#1D1916]">{step}</span>
                  </div>
                );
              })}
            </article>
          </aside>
          <article className="rounded-[22px] border bg-white p-5 shadow-card lg:col-span-2" style={{ borderColor: uiColors.border }}>
            <StatusPill label={meta.label} tone={meta.tone} />
            <h2 className="mt-4 font-display text-3xl font-extrabold text-[#1D1916]">{request.title}</h2>
            <p className="mt-3 text-sm font-bold leading-8 text-[#5f5953]">{request.description}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {[
                ["رقم الطلب", request.id],
                ["نوع الخدمة", request.serviceType],
                ["طالب الخدمة", request.requester],
                ["مزود الخدمة", request.provider],
                ["المدينة", request.city],
                ["نوع الأصل", request.assetType],
                ["المساحة", formatArea(request.areaSqm)],
                ["تاريخ الطلب", formatDashboardDate(request.submittedAt)],
                ["موعد التسليم", formatDashboardDate(request.dueAt)],
                ["السعر", formatSar(request.price)],
                ["الأولوية", request.priority],
                ["الحالة الخام", request.rawStatus],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border bg-[#fffdf9] p-3" style={{ borderColor: uiColors.border }}>
                  <p className="text-xs font-bold text-[#6E6258]">{label}</p>
                  <p className="mt-1 break-words text-sm font-extrabold text-[#1D1916]">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border bg-[#fffdf9] p-4" style={{ borderColor: uiColors.border }}>
              <h3 className="font-display text-xl font-extrabold text-[#1D1916]">ملاحظات الطلب</h3>
              <p className="mt-2 text-sm font-bold leading-8 text-[#5f5953]">{request.latestReviewNote ?? "الطلب مرتبط بأصل عقاري يحتاج مراجعة نطاق العمل وتأكيد المستندات قبل إرساله لمزود الخدمة."}</p>
              {request.latestReviewAt ? <p className="mt-2 text-xs font-bold text-[#6E6258]">آخر مراجعة: {formatDashboardDate(request.latestReviewAt)}</p> : null}
            </div>
          </article>
        </section>
      ) : (
        <section className="rounded-[22px] border bg-white p-8 text-center text-sm font-extrabold text-[#6E6258]" style={{ borderColor: uiColors.border }}>لا توجد طلبات خدمات لعرض تفاصيلها.</section>
      )}
    </div>
  );
}

async function AdminServicesCatalogPage({ config }: { config: DashboardRoleConfig }) {
  const requestsResult = await listDashboardAdminServiceRequests();
  const servicesResult = await listDashboardAdminServiceCatalog();
  const firstRequestId = requestsResult.data[0]?.id;
  const requestDetailPath = firstRequestId ? `service-requests/details?request=${encodeURIComponent(firstRequestId)}` : "service-requests/details";
  return (
    <div className="grid gap-5">
      <DashboardTopbar config={config} />
      <AdminServicesHeader title="الخدمات العقارية" subtitle="إدارة كتالوج الخدمات العقارية المعروضة في المنصة وحالة كل خدمة ومخرجاتها." />
      <AdminServiceKpis active="catalog" requests={requestsResult.data} serviceCount={servicesResult.data.length} />
      <AdminServiceFilters title="الخدمات العقارية" rows={requestsResult.data} />
      <AdminServiceNav activePath="services" requestDetailPath={requestDetailPath} />
      {servicesResult.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل كتالوج الخدمات الحي، وتم عرض بيانات احتياطية مؤقتة.</section> : null}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {servicesResult.data.map((service) => (
          <article key={service.id} className="rounded-[20px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-extrabold text-[#1D1916]">{service.titleAr}</h3>
                <p className="mt-2 min-h-14 text-sm font-bold leading-7 text-[#5f5953]">{service.descriptionAr}</p>
              </div>
              <StatusPill label={service.status} tone={service.status === "نشطة" ? "green" : "red"} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl border p-3" style={{ borderColor: uiColors.border }}><p className="text-xs text-[#6E6258]">المدة</p><p className="text-xs font-extrabold text-[#1D1916]">{service.durationAr}</p></div>
              <div className="rounded-xl border p-3" style={{ borderColor: uiColors.border }}><p className="text-xs text-[#6E6258]">السعر</p><p className="text-xs font-extrabold text-[#1D1916]">{formatSar(service.basePrice)}</p></div>
              <div className="rounded-xl border p-3" style={{ borderColor: uiColors.border }}><p className="text-xs text-[#6E6258]">الطلبات</p><p className="text-xs font-extrabold text-[#1D1916]">{adminServiceRequestsForCatalog(service, requestsResult.data)}</p></div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href={dashboardHref("admin", `services/edit?service=${encodeURIComponent(service.id)}`)} className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl border bg-white text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>تعديل الخدمة</Link>
              <Link href={dashboardHref("admin", "services/pricing")} className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl bg-[#A7815E] text-xs font-extrabold text-white">تعديل السعر</Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

async function AdminServiceFormPage({ config, mode, searchParams = {} }: { config: DashboardRoleConfig; mode: "add" | "edit"; searchParams?: DashboardSearchParams }) {
  const editing = mode === "edit";
  const servicesResult = await listDashboardAdminServiceCatalog();
  const selectedServiceRef = entityParam(searchParams, "service", "id");
  const service = servicesResult.data.find((item) => item.id === selectedServiceRef || item.slug === selectedServiceRef) ?? servicesResult.data[1] ?? servicesResult.data[0]!;
  const editEntityId = editing && service.source === "supabase" ? service.id : undefined;
  const editSlug = editing ? service.slug : undefined;
  const servicePayload = {
    titleAr: editing ? service.titleAr : "خدمة عقارية جديدة",
    descriptionAr: editing ? service.descriptionAr : "خدمة عقارية مدارة من لوحة الإدارة.",
    levelAr: editing ? service.levelAr : "تشغيلية",
    durationAr: editing ? service.durationAr : "حسب الطلب",
    outputsAr: editing ? service.outputsAr : "تقرير خدمة",
    priceSar: editing ? service.basePrice : 0,
  };
  return (
    <div className="grid gap-5">
      <DashboardTopbar config={config} />
      <AdminServicesHeader title={editing ? "تعديل خدمة" : "إضافة خدمة"} subtitle={editing ? "تحديث بيانات الخدمة ومخرجاتها وأسعارها قبل نشرها في الكتالوج." : "إنشاء خدمة عقارية جديدة وربطها بمخرجات وسعر ومدة تنفيذ واضحة."} />
      <AdminServiceNav activePath={editing ? "services/edit" : "services/add"} />
      {servicesResult.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل بيانات الخدمة الحية، وتم عرض بيانات احتياطية مؤقتة.</section> : null}
      <section className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <form className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}>
          <h2 className="font-display text-xl font-extrabold text-[#1D1916]">بيانات الخدمة</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              ["اسم الخدمة", "titleAr", editing ? service.titleAr : "", "text"],
              ["مستوى الخدمة", "levelAr", editing ? service.levelAr : "", "text"],
              ["مدة التنفيذ", "durationAr", editing ? service.durationAr : "", "text"],
              ["مخرجات الخدمة", "outputsAr", editing ? service.outputsAr : "", "text"],
              ["السعر الأساسي", "priceSar", editing ? String(service.basePrice) : "", "number"],
              ["حالة الخدمة", "status", editing ? service.status : "نشطة", "text"],
            ].map(([label, name, value, inputType]) => (
              <label key={label} className="grid gap-2 text-sm font-extrabold text-[#1D1916]">
                {label}
                <input name={name} type={inputType} defaultValue={value} className="h-12 rounded-xl border bg-[#fffdf9] px-4 text-sm outline-none focus:border-[#A7815E]" style={{ borderColor: uiColors.border }} placeholder={`أدخل ${label}`} />
              </label>
            ))}
            <label className="grid gap-2 text-sm font-extrabold text-[#1D1916] md:col-span-2">
              وصف الخدمة
              <textarea name="descriptionAr" defaultValue={editing ? service.descriptionAr : ""} className="min-h-32 rounded-xl border bg-[#fffdf9] p-4 text-sm outline-none focus:border-[#A7815E]" style={{ borderColor: uiColors.border }} placeholder="اكتب وصف الخدمة" />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <AdminManagementActionButton action="service_catalog_save" entityId={editEntityId} slug={editSlug} title={servicePayload.titleAr} payload={servicePayload} className="min-h-11 rounded-xl bg-[#A7815E] px-6 text-sm font-extrabold text-white">{editing ? "حفظ التعديلات" : "إضافة الخدمة"}</AdminManagementActionButton>
            <Link href={dashboardHref("admin", "services")} className="inline-flex min-h-11 items-center justify-center rounded-xl border bg-white px-6 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إلغاء</Link>
          </div>
        </form>
        <aside className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}>
          <h3 className="font-display text-xl font-extrabold text-[#1D1916]">معاينة الخدمة</h3>
          <p className="mt-3 text-sm font-bold leading-7 text-[#5f5953]">تظهر الخدمة في صفحة الخدمات بعد اعتماد البيانات والسعر والمخرجات.</p>
          <div className="mt-4 rounded-xl border bg-[#fffdf9] p-4" style={{ borderColor: uiColors.border }}>
            <p className="font-display text-lg font-extrabold text-[#1D1916]">{editing ? service.titleAr : "خدمة عقارية جديدة"}</p>
            <p className="mt-2 text-xs font-bold text-[#6E6258]">{editing ? service.outputsAr : "مخرجات الخدمة"}</p>
          </div>
        </aside>
      </section>
    </div>
  );
}

async function AdminServicePricingPage({ config }: { config: DashboardRoleConfig }) {
  const requestsResult = await listDashboardAdminServiceRequests();
  const servicesResult = await listDashboardAdminServiceCatalog();
  const firstRequestId = requestsResult.data[0]?.id;
  const requestDetailPath = firstRequestId ? `service-requests/details?request=${encodeURIComponent(firstRequestId)}` : "service-requests/details";
  return (
    <div className="grid gap-5">
      <DashboardTopbar config={config} />
      <AdminServicesHeader title="أسعار الخدمات" subtitle="إدارة أسعار الخدمات العقارية حسب المستوى والمدة ومخرجات التسليم." />
      <AdminServiceKpis active="pricing" requests={requestsResult.data} serviceCount={servicesResult.data.length} />
      <AdminServiceNav activePath="services/pricing" requestDetailPath={requestDetailPath} />
      {servicesResult.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل أسعار الخدمات الحية، وتم عرض بيانات احتياطية مؤقتة.</section> : null}
      <section className="overflow-hidden rounded-[22px] border bg-white shadow-card" style={{ borderColor: uiColors.border }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-right text-sm" style={{ minWidth: 900 }}>
            <thead>
              <tr className="bg-[#f4ede5] text-xs font-extrabold text-[#5f5953]">
                {["الخدمة", "المستوى", "السعر الأساسي", "سعر عاجل", "مدة التنفيذ", "آخر تحديث", "الإجراء"].map((header) => (
                  <th key={header} className="px-4 py-3 font-extrabold first:w-[290px]">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {servicesResult.data.map((service) => (
                <tr key={service.id} className="border-b last:border-b-0" style={{ borderColor: uiColors.border }}>
                  <td className="px-4 py-4 font-display text-lg font-extrabold text-[#1D1916]">{service.titleAr}</td>
                  <td className="px-4 py-4 font-bold text-[#6E6258]">{service.levelAr}</td>
                  <td className="px-4 py-4 font-bold text-[#1D1916]">{formatSar(service.basePrice)}</td>
                  <td className="px-4 py-4 font-bold text-[#1D1916]">{formatSar(Math.round(service.basePrice * 1.35))}</td>
                  <td className="px-4 py-4 font-bold text-[#6E6258]">{service.durationAr}</td>
                  <td className="px-4 py-4 font-bold text-[#6E6258]">{service.updatedAt ? formatDashboardDate(service.updatedAt) : "---"}</td>
                  <td className="px-4 py-4">
                    <form className="grid min-w-60 grid-cols-[1fr_1fr_auto] gap-2">
                      <input type="hidden" name="titleAr" value={service.titleAr} />
                      <input type="hidden" name="descriptionAr" value={service.descriptionAr} />
                      <input type="hidden" name="levelAr" value={service.levelAr} />
                      <input type="hidden" name="outputsAr" value={service.outputsAr} />
                      <input type="hidden" name="status" value={service.status} />
                      <input
                        name="priceSar"
                        type="number"
                        min="0"
                        defaultValue={service.basePrice}
                        aria-label={`السعر الأساسي ${service.titleAr}`}
                        className="h-10 rounded-xl border bg-[#fffdf9] px-3 text-xs font-bold outline-none focus:border-[#A7815E]"
                        style={{ borderColor: uiColors.border }}
                      />
                      <input
                        name="durationAr"
                        defaultValue={service.durationAr}
                        aria-label={`مدة التنفيذ ${service.titleAr}`}
                        className="h-10 rounded-xl border bg-[#fffdf9] px-3 text-xs font-bold outline-none focus:border-[#A7815E]"
                        style={{ borderColor: uiColors.border }}
                      />
                      <AdminManagementActionButton
                        action="service_catalog_save"
                        entityId={service.source === "supabase" ? service.id : undefined}
                        slug={service.slug}
                        title={service.titleAr}
                        className="min-h-10 rounded-xl bg-[#A7815E] px-4 text-xs font-extrabold text-white"
                      >
                        حفظ
                      </AdminManagementActionButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

type AdminProviderStatus = DashboardAdminProviderStatus;

const adminProviderStatusMeta: Record<AdminProviderStatus, { label: string; tone: TrendTone; action: string }> = {
  pending: { label: "بانتظار المراجعة", tone: "gold", action: "مراجعة المزود" },
  approved: { label: "معتمد", tone: "green", action: "عرض التفاصيل" },
  rejected: { label: "مرفوض", tone: "red", action: "عرض سبب الرفض" },
};

const providerNames = ["مكتب أفق الهندسي", "شركة تقييم المتقدمة", "مكتب عدل للاستشارات", "شركة مدار للتسويق", "مؤسسة وثق العقارية", "شركة رواسي لإدارة المشاريع", "مكتب بصمة للتصميم", "شركة إتقان القانونية", "دار الخبرة للتثمين", "مكتب عمران للاستشارات"];
const providerStatuses: AdminProviderStatus[] = ["pending", "approved", "approved", "rejected", "approved", "pending", "approved", "rejected", "approved", "pending"];
const adminProviderRows: DashboardAdminProvider[] = providerNames.map((name, index) => ({
  id: `PRV-${1300 + index}`,
  slug: `provider-${1300 + index}`,
  name,
  status: providerStatuses[index] ?? "pending",
  category: ["استشارات هندسية", "تقييم عقاري", "مراجعة قانونية", "تسويق عقاري", "توثيق عقاري"][index % 5],
  city: ["الرياض", "جدة", "الدمام", "الخبر"][index % 4],
  contact: ["0501234567", "0552345678", "0533456789", "0564567890"][index % 4],
  requests: [18, 42, 25, 9, 31, 12, 22, 6, 28, 14][index],
  rating: [4.7, 4.9, 4.5, 3.8, 4.6, 4.2, 4.8, 3.9, 4.4, 4.1][index],
  joinedAt: ["14/06/2026", "10/06/2026", "02/06/2026", "29/05/2026"][index % 4],
  license: `LIC-${82000 + index}`,
}));

function AdminProvidersHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="relative overflow-hidden rounded-[24px] border bg-white p-5 shadow-card md:p-6" style={{ borderColor: uiColors.border }}>
      <Image src="/images/about-lobby.png" alt="" fill className="object-cover opacity-[0.12] grayscale-[12%] sepia-[12%]" sizes="80vw" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <StatusPill label="إدارة مزودي الخدمات" tone="gold" />
          <h1 className="mt-3 font-display text-3xl font-extrabold text-[#1D1916]">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-[#5f5953]">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={dashboardHref("admin", "providers/add")} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#A7815E] px-5 text-sm font-extrabold text-white">إضافة مزود خدمة</Link>
          <Link href={dashboardHref("admin", "providers/categories")} className="inline-flex min-h-11 items-center justify-center rounded-xl border bg-white px-5 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>التصنيفات</Link>
        </div>
      </div>
    </section>
  );
}

function AdminProviderKpis({ rows, activeStatus }: { rows: DashboardAdminProvider[]; activeStatus?: AdminProviderStatus }) {
  const pending = rows.filter((item) => item.status === "pending").length;
  const approved = rows.filter((item) => item.status === "approved").length;
  const rejected = rows.filter((item) => item.status === "rejected").length;
  const cards = [
    { title: "إجمالي المزودين", value: String(rows.length), unit: "مزود", icon: "users", tone: "blue" as TrendTone, active: !activeStatus },
    { title: "بانتظار المراجعة", value: String(pending), unit: "مزودين", icon: "clock", tone: "gold" as TrendTone, active: activeStatus === "pending" },
    { title: "مزودون معتمدون", value: String(approved), unit: "مزودين", icon: "shield", tone: "green" as TrendTone, active: activeStatus === "approved" },
    { title: "مزودون مرفوضون", value: String(rejected), unit: "مزودين", icon: "x", tone: "red" as TrendTone, active: activeStatus === "rejected" },
  ];

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const tone = toneStyles[card.tone];
        return (
          <article key={card.title} className={cn("rounded-[18px] border bg-white p-4 text-right shadow-card", card.active ? "ring-2 ring-[#A7815E]/30" : "")} style={{ borderColor: card.active ? "#A7815E" : uiColors.border }}>
            <div className="flex items-center justify-between gap-4">
              <div><p className="text-sm font-extrabold text-[#5f5953]">{card.title}</p><strong className="mt-2 block font-display text-4xl font-extrabold text-[#1D1916]">{card.value}</strong><span className="text-xs font-bold text-[#6E6258]">{card.unit}</span></div>
              <span className="grid h-12 w-12 place-items-center rounded-full border" style={{ backgroundColor: tone.bg, borderColor: tone.border, color: tone.text }}><Icon name={card.icon} className="h-6 w-6" /></span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function AdminProviderNav({ activePath, detailPath = "providers/details", editPath = "providers/edit" }: { activePath: string; detailPath?: string; editPath?: string }) {
  const items = [
    { label: "مزودو الخدمات", path: "providers", active: "providers" },
    { label: "تفاصيل المزود", path: detailPath, active: "providers/details" },
    { label: "بانتظار المراجعة", path: "providers/pending", active: "providers/pending" },
    { label: "المعتمدون", path: "providers/approved", active: "providers/approved" },
    { label: "المرفوضون", path: "providers/rejected", active: "providers/rejected" },
    { label: "إضافة", path: "providers/add", active: "providers/add" },
    { label: "تعديل", path: editPath, active: "providers/edit" },
    { label: "المستندات", path: "providers/documents", active: "providers/documents" },
    { label: "التقييمات", path: "providers/ratings", active: "providers/ratings" },
    { label: "التصنيفات", path: "providers/categories", active: "providers/categories" },
  ];
  return <section className="flex flex-wrap gap-2">{items.map((item) => <Link key={item.active} href={dashboardHref("admin", item.path)} className={cn("inline-flex min-h-10 items-center justify-center rounded-xl border px-4 text-sm font-extrabold", activePath === item.active ? "bg-[#A7815E] text-white" : "bg-white text-[#1D1916]")} style={{ borderColor: activePath === item.active ? "#A7815E" : uiColors.border }}>{item.label}</Link>)}</section>;
}

function AdminProviderFilters({ title, q, sort, activePath, category }: { title: string; q: string; sort: string; activePath: string; category?: string }) {
  const filters = [
    ["كل المزودين", "providers", undefined],
    ["التصنيف", "providers", "category"],
    ["المدينة", "providers", "city"],
    ["تاريخ الانضمام", "providers", "joined"],
  ] as const;
  return (
    <section className="rounded-[20px] border bg-white p-4 shadow-card" style={{ borderColor: uiColors.border }}>
      <form action={dashboardHref("admin", activePath)} className="grid gap-3 lg:grid-cols-5">
        {sort ? <input type="hidden" name="sort" value={sort} /> : null}
        {category ? <input type="hidden" name="category" value={category} /> : null}
        <label className="relative block">
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6E6258]" />
          <input name="q" defaultValue={q} suppressHydrationWarning className="h-12 w-full rounded-xl border bg-[#fffdf9] pl-16 pr-12 text-sm font-bold outline-none focus:border-[#A7815E]" style={{ borderColor: uiColors.border }} placeholder={`ابحث في ${title}`} />
          <button type="submit" className="absolute left-2 top-1/2 h-8 -translate-y-1/2 rounded-lg bg-[#1D1916] px-3 text-xs font-extrabold text-white">بحث</button>
        </label>
        {filters.map(([filter, path, nextSort]) => <Link key={filter} href={dashboardQueryHref("admin", path, { q, sort: nextSort, category })} className={cn("flex h-12 items-center justify-between rounded-xl border px-4 text-sm font-extrabold", sort === nextSort ? "bg-[#fbf3e9] text-[#8F6B4C]" : "bg-white text-[#1D1916]")} style={{ borderColor: sort === nextSort ? "#e3c8aa" : uiColors.border }}><span>{filter}</span><ChevronGlyph /></Link>)}
      </form>
      {category ? <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-extrabold text-[#6E6258]"><span className="rounded-xl border bg-[#fffdf9] px-3 py-2" style={{ borderColor: uiColors.border }}>التصنيف: {category}</span><Link href={dashboardQueryHref("admin", activePath, { q, sort })} className="rounded-xl border px-3 py-2 text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إلغاء فلتر التصنيف</Link></div> : null}
    </section>
  );
}

function AdminProvidersTable({ rows }: { rows: DashboardAdminProvider[] }) {
  return (
    <section className="overflow-hidden rounded-[22px] border bg-white shadow-card" style={{ borderColor: uiColors.border }}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-right text-sm" style={{ minWidth: 980 }}>
          <thead><tr className="bg-[#f4ede5] text-xs font-extrabold text-[#5f5953]">{["مزود الخدمة", "التصنيف", "المدينة", "الطلبات", "التقييم", "الحالة", "الإجراء"].map((header) => <th key={header} className="px-4 py-3 font-extrabold first:w-[270px]">{header}</th>)}</tr></thead>
          <tbody>
            {rows.length === 0 ? <tr><td colSpan={7} className="px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد مزودات خدمة مطابقة للبحث الحالي.</td></tr> : null}
            {rows.map((row) => {
              const meta = adminProviderStatusMeta[row.status];
              return (
                <tr key={row.id} className="border-b last:border-b-0" style={{ borderColor: uiColors.border }}>
                  <td className="px-4 py-4 align-middle"><p className="font-display text-lg font-extrabold text-[#1D1916]">{row.name}</p><p className="mt-1 text-xs font-bold text-[#6E6258]">{row.id} · {row.license}</p></td>
                  <td className="px-4 py-4 align-middle font-bold text-[#1D1916]">{row.category}</td>
                  <td className="px-4 py-4 align-middle font-bold text-[#6E6258]">{row.city}</td>
                  <td className="px-4 py-4 align-middle font-bold text-[#1D1916]">{row.requests}</td>
                  <td className="px-4 py-4 align-middle font-bold text-[#1D1916]">{row.rating} / 5</td>
                  <td className="px-4 py-4 align-middle"><StatusPill label={meta.label} tone={meta.tone} /></td>
                  <td className="px-4 py-4 align-middle"><Link href={dashboardHref("admin", `providers/details?provider=${encodeURIComponent(row.slug || row.id)}`)} className="inline-flex min-h-10 items-center justify-center rounded-xl border bg-white px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>{meta.action}</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

async function AdminProvidersPage({ config, status, searchParams = {} }: { config: DashboardRoleConfig; status?: AdminProviderStatus; searchParams?: DashboardSearchParams }) {
  const providersResult = await listDashboardAdminProviders();
  const allRows = providersResult.data;
  const q = stringParam(searchParams, "q").trim();
  const sort = stringParam(searchParams, "sort").trim();
  const category = stringParam(searchParams, "category").trim();
  const statusRows = status ? allRows.filter((row) => row.status === status) : allRows;
  const categoryRows = category ? statusRows.filter((row) => normalizeDashboardSearch(row.category) === normalizeDashboardSearch(category)) : statusRows;
  const matchedRows = categoryRows.filter((row) => matchesDashboardSearch(q, [row.id, row.slug, row.name, row.category, row.city, row.contact, row.license, row.status, adminProviderStatusMeta[row.status].label, row.requests, row.rating]));
  const rows = [...matchedRows].sort((a, b) => {
    if (sort === "category") return a.category.localeCompare(b.category, "ar");
    if (sort === "city") return a.city.localeCompare(b.city, "ar");
    if (sort === "joined") return b.joinedAt.localeCompare(a.joinedAt, "ar");
    return 0;
  });
  const firstProviderRef = rows[0]?.slug || rows[0]?.id || allRows[0]?.slug || allRows[0]?.id;
  const providerDetailPath = firstProviderRef ? `providers/details?provider=${encodeURIComponent(firstProviderRef)}` : "providers/details";
  const providerEditPath = firstProviderRef ? `providers/edit?provider=${encodeURIComponent(firstProviderRef)}` : "providers/edit";
  const title = category ? `مزودو ${category}` : status === "pending" ? "مزودون بانتظار المراجعة" : status === "approved" ? "مزودون معتمدون" : status === "rejected" ? "مزودون مرفوضون" : "مزودو الخدمات";
  const activePath = status ? `providers/${status}` : "providers";
  return <div className="grid gap-5"><DashboardTopbar config={config} /><AdminProvidersHeader title={title} subtitle="إدارة مزودي الخدمات العقارية والتحقق من مستنداتهم وتصنيفاتهم وتقييماتهم التشغيلية." /><AdminProviderKpis rows={allRows} activeStatus={status} /><AdminProviderFilters title={title} q={q} sort={sort} activePath={activePath} category={category || undefined} /><AdminProviderNav activePath={activePath} detailPath={providerDetailPath} editPath={providerEditPath} />{providersResult.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر الاتصال ببيانات مزودي الخدمات الحية، وتم عرض بيانات تجريبية مؤقتة.</section> : null}<AdminProvidersTable rows={rows} />{status === "rejected" ? <section className="grid gap-4 xl:grid-cols-3">{rows.map((row) => <article key={`${row.id}-reason`} className="rounded-[18px] border bg-white p-4 shadow-card" style={{ borderColor: uiColors.border }}><h3 className="font-display text-lg font-extrabold text-[#1D1916]">{row.name}</h3><p className="mt-2 text-sm font-bold leading-7 text-[#6E6258]">سبب الرفض: نقص في الترخيص المهني أو عدم اكتمال مستندات الاعتماد.</p><AdminManagementActionButton action="provider_status" entityId={row.id} slug={row.slug} title={row.name} status="pending" className="mt-4 min-h-10 rounded-xl border px-4 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إعادة فتح المراجعة</AdminManagementActionButton></article>)}</section> : null}</div>;
}

async function AdminProviderDetailsPage({ config, searchParams = {} }: { config: DashboardRoleConfig; searchParams?: DashboardSearchParams }) {
  const providersResult = await listDashboardAdminProviders();
  const selectedProvider = selectEntityByParam(providersResult.data, searchParams, "provider", "id", "slug");
  const provider = selectedProvider ?? providersResult.data.find((row) => row.status === "pending") ?? providersResult.data[0] ?? adminProviderRows[0];
  const meta = adminProviderStatusMeta[provider.status];
  return (
    <div className="grid gap-5">
      <DashboardTopbar config={config} />
      <AdminProvidersHeader title="تفاصيل مزود الخدمة" subtitle="مراجعة بيانات المزود ومجالات الخدمة والمستندات والتقييم قبل الاعتماد." />
      <AdminProviderNav activePath="providers/details" detailPath={`providers/details?provider=${encodeURIComponent(provider.slug || provider.id)}`} editPath={`providers/edit?provider=${encodeURIComponent(provider.slug || provider.id)}`} />
      <section className="grid gap-5 lg:grid-cols-3">
        <aside className="grid content-start gap-4">
          <article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><h3 className="font-display text-xl font-extrabold text-[#1D1916]">إجراءات الاعتماد</h3><div className="mt-4 grid gap-2"><AdminManagementActionButton action="provider_status" entityId={provider.id} slug={provider.slug} title={provider.name} status="approved" className="min-h-11 rounded-xl px-4 text-sm font-extrabold text-white" style={{ backgroundColor: "#087342" }}>اعتماد المزود</AdminManagementActionButton><AdminManagementActionButton action="provider_status" entityId={provider.id} slug={provider.slug} title={provider.name} status="pending" className="min-h-11 rounded-xl border bg-white px-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>طلب استكمال مستند</AdminManagementActionButton><AdminManagementActionButton action="provider_status" entityId={provider.id} slug={provider.slug} title={provider.name} status="rejected" className="min-h-11 rounded-xl border bg-[#fff0eb] px-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#efc5b9" }}>رفض المزود</AdminManagementActionButton></div></article>
          <article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><h3 className="font-display text-xl font-extrabold text-[#1D1916]">التحقق</h3>{["السجل التجاري", "الترخيص المهني", "العنوان الوطني", "الحساب البنكي"].map((item, index) => <div key={item} className="flex items-center justify-between border-b py-3 last:border-b-0" style={{ borderColor: uiColors.border }}><span className="text-sm font-extrabold text-[#1D1916]">{item}</span><StatusPill label={index < 2 ? "مكتمل" : "قيد المراجعة"} tone={index < 2 ? "green" : "gold"} /></div>)}</article>
        </aside>
        <article className="rounded-[22px] border bg-white p-5 shadow-card lg:col-span-2" style={{ borderColor: uiColors.border }}>
          <StatusPill label={meta.label} tone={meta.tone} />
          <h2 className="mt-4 font-display text-3xl font-extrabold text-[#1D1916]">{provider.name}</h2>
          <p className="mt-3 text-sm font-bold leading-8 text-[#5f5953]">مزود خدمة متخصص في {provider.category} ضمن شبكة مهابة لمزودي الخدمات العقارية.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-4">{[["رقم المزود", provider.id], ["التصنيف", provider.category], ["المدينة", provider.city], ["رقم التواصل", provider.contact], ["رقم الترخيص", provider.license], ["عدد الطلبات", String(provider.requests)], ["التقييم", `${provider.rating} / 5`], ["تاريخ الانضمام", provider.joinedAt]].map(([label, value]) => <div key={label} className="rounded-xl border bg-[#fffdf9] p-3" style={{ borderColor: uiColors.border }}><p className="text-xs font-bold text-[#6E6258]">{label}</p><p className="mt-1 text-sm font-extrabold text-[#1D1916]">{value}</p></div>)}</div>
        </article>
      </section>
    </div>
  );
}

async function AdminProviderFormPage({ config, mode, searchParams = {} }: { config: DashboardRoleConfig; mode: "add" | "edit"; searchParams?: DashboardSearchParams }) {
  const editing = mode === "edit";
  const providersResult = await listDashboardAdminProviders();
  const selectedProvider = selectEntityByParam(providersResult.data, searchParams, "provider", "id", "slug");
  const provider = (editing ? selectedProvider : undefined) ?? providersResult.data.find((row) => row.status === "approved") ?? providersResult.data[0] ?? adminProviderRows[1];
  const providerRef = provider.slug || provider.id;
  const savePayload = { name: editing ? provider.name : "مزود خدمة جديد", category: editing ? provider.category : "خدمات عقارية", city: editing ? provider.city : "الرياض", contact: editing ? provider.contact : "", license: editing ? provider.license : "", rating: editing ? provider.rating : 0, requests: editing ? provider.requests : 0 };
  const providerFields = [
    ["اسم المزود", "name", editing ? provider.name : ""],
    ["التصنيف", "category", editing ? provider.category : ""],
    ["المدينة", "city", editing ? provider.city : ""],
    ["رقم التواصل", "contact", editing ? provider.contact : ""],
    ["رقم الترخيص", "license", editing ? provider.license : ""],
  ];
  return (
    <div className="grid gap-5">
      <DashboardTopbar config={config} />
      <AdminProvidersHeader title={editing ? "تعديل مزود خدمة" : "إضافة مزود خدمة"} subtitle={editing ? "تحديث بيانات مزود الخدمة ومجالاته ومعلومات الترخيص." : "إضافة مزود خدمة جديد وإدخال بيانات التحقق والتصنيف."} />
      <AdminProviderNav activePath={editing ? "providers/edit" : "providers/add"} detailPath={`providers/details?provider=${encodeURIComponent(providerRef)}`} editPath={`providers/edit?provider=${encodeURIComponent(providerRef)}`} />
      <form className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}>
        <h2 className="font-display text-xl font-extrabold text-[#1D1916]">بيانات المزود</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {providerFields.map(([label, name, value]) => (
            <label key={name} className="grid gap-2 text-sm font-extrabold text-[#1D1916]">
              {label}
              <input name={name} defaultValue={value} className="h-12 rounded-xl border bg-[#fffdf9] px-4 text-sm outline-none focus:border-[#A7815E]" style={{ borderColor: uiColors.border }} placeholder={`أدخل ${label}`} />
            </label>
          ))}
          <label className="grid gap-2 text-sm font-extrabold text-[#1D1916]">
            حالة المزود
            <select name="status" defaultValue={editing ? provider.status : "pending"} className="h-12 rounded-xl border bg-[#fffdf9] px-4 text-sm outline-none focus:border-[#A7815E]" style={{ borderColor: uiColors.border }}>
              <option value="pending">بانتظار المراجعة</option>
              <option value="approved">معتمد</option>
              <option value="rejected">مرفوض</option>
            </select>
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <AdminManagementActionButton action="provider_save" entityId={editing ? provider.id : undefined} slug={editing ? provider.slug : undefined} title={savePayload.name} status={editing ? provider.status : "pending"} payload={savePayload} className="min-h-11 rounded-xl bg-[#A7815E] px-6 text-sm font-extrabold text-white">{editing ? "حفظ التعديلات" : "إضافة المزود"}</AdminManagementActionButton>
          <Link href={dashboardHref("admin", "providers")} className="inline-flex min-h-11 items-center justify-center rounded-xl border bg-white px-6 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إلغاء</Link>
        </div>
      </form>
    </div>
  );
}

async function AdminProviderDocumentsPage({ config }: { config: DashboardRoleConfig }) {
  const providersResult = await listDashboardAdminProviders();
  const rows = providersResult.data.length ? providersResult.data : adminProviderRows;
  const providerDocumentRows = await Promise.all(rows.slice(0, 6).map(async (provider) => ({
    provider,
    documents: await listDashboardDocumentsForEntity({
      scope: "admin",
      entityId: provider.id,
      entityRef: provider.slug || provider.id,
      entityTypes: ["provider_document", "provider_license", "provider_commercial_record", "provider_national_address"],
    }),
  })));
  return <div className="grid gap-5"><DashboardTopbar config={config} /><AdminProvidersHeader title="مستندات المزود" subtitle="متابعة مستندات الاعتماد والهوية المهنية لكل مزود خدمة." /><AdminProviderNav activePath="providers/documents" />{providersResult.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل مزودي الخدمات الحية، وتم عرض البيانات المتاحة مع الاحتياطي.</section> : null}<section className="grid gap-4 xl:grid-cols-3">{providerDocumentRows.map(({ provider, documents }) => <article key={provider.id} className="rounded-[20px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><div className="flex items-start justify-between gap-3"><div><h3 className="font-display text-lg font-extrabold text-[#1D1916]">{provider.name}</h3><p className="mt-1 text-xs font-bold text-[#6E6258]">{provider.license} · {provider.category}</p></div><StatusPill label={`${documents.data.length} ملفات`} tone={documents.data.length ? "green" : "gold"} /></div>{documents.error ? <p className="mt-3 rounded-xl border bg-[#fff7ec] p-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل مستندات هذا المزود من Supabase.</p> : null}<div className="mt-4 grid gap-2">{documents.data.length === 0 ? <p className="rounded-xl border bg-[#fffdf9] p-3 text-sm font-bold text-[#6E6258]" style={{ borderColor: uiColors.border }}>لا توجد مستندات مرفوعة لهذا المزود بعد.</p> : documents.data.map((doc) => <div key={doc.id} className="flex items-center justify-between gap-3 border-b pb-2 last:border-b-0" style={{ borderColor: uiColors.border }}><div className="min-w-0"><span className="block truncate text-sm font-bold text-[#1D1916]">{doc.fileName}</span><span className="mt-1 block text-xs font-bold text-[#6E6258]">{formatDashboardDate(doc.createdAt)}</span></div><span className="shrink-0 text-xs font-extrabold text-[#A7815E]">{documentSizeLabel(doc.sizeBytes)}</span></div>)}</div><div className="mt-4 flex flex-wrap gap-2"><DashboardDocumentUploadButton scope="admin" entityType="provider_document" entityId={provider.id} label={`مستندات ${provider.name}`} className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-xl border px-4 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>رفع مستند</DashboardDocumentUploadButton><Link href={dashboardHref("admin", `providers/details?provider=${encodeURIComponent(provider.slug || provider.id)}`)} className="inline-flex min-h-10 items-center justify-center rounded-xl border px-4 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>تفاصيل المزود</Link></div></article>)}</section></div>;
}

async function AdminProviderRatingsPage({ config }: { config: DashboardRoleConfig }) {
  const [providersResult, requestsResult] = await Promise.all([
    listDashboardAdminProviders(),
    listDashboardAdminServiceRequests(),
  ]);
  const providerRows = providersResult.data.length ? providersResult.data : adminProviderRows;
  const requestRows = requestsResult.data;
  const completedRequests = requestRows.filter((request) => request.status === "completed");
  const providerRatingRows = providerRows.slice(0, 8).map((provider) => {
    const relatedRequests = requestRows.filter((request) => request.provider === provider.name || request.serviceType === provider.category);
    const completedCount = relatedRequests.filter((request) => request.status === "completed").length;
    const activeCount = relatedRequests.filter((request) => request.status === "assigned" || request.status === "urgent" || request.status === "needs_changes").length;
    const ratingTone: TrendTone = provider.rating >= 4.6 ? "green" : provider.rating >= 4 ? "gold" : "red";
    const statusMeta = provider.status === "approved"
      ? { label: "معتمد", tone: "green" as TrendTone }
      : provider.status === "rejected"
        ? { label: "مرفوض", tone: "red" as TrendTone }
        : { label: "قيد المراجعة", tone: "gold" as TrendTone };
    const note = provider.rating >= 4.6
      ? "أداء مرتفع في الطلبات المكتملة مع التزام جيد بجودة التسليم."
      : provider.rating >= 4
        ? "أداء مستقر ويحتاج متابعة دورية لسرعة معالجة الطلبات المفتوحة."
        : "يحتاج مراجعة تشغيلية ومتابعة تحسين تجربة المستفيدين قبل التوسع.";
    return {
      provider,
      relatedRequests,
      completedCount: Math.max(completedCount, provider.requests),
      activeCount,
      ratingTone,
      statusMeta,
      note,
    };
  });
  const avgRating = providerRatingRows.length ? (providerRatingRows.reduce((sum, row) => sum + row.provider.rating, 0) / providerRatingRows.length).toFixed(1) : "0";
  const exportRows = providerRatingRows.map((row) => ({
    id: row.provider.id,
    name: row.provider.name,
    category: row.provider.category,
    city: row.provider.city,
    status: row.statusMeta.label,
    rating: row.provider.rating,
    completedRequests: row.completedCount,
    activeRequests: row.activeCount,
    source: providersResult.source,
  }));
  return <div className="grid gap-5"><DashboardTopbar config={config} /><AdminProvidersHeader title="تقييمات المزود" subtitle="متابعة تقييمات مزودي الخدمات وجودة التنفيذ وملاحظات العملاء." /><AdminProviderNav activePath="providers/ratings" />{providersResult.error || requestsResult.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل جزء من بيانات التقييم الحية، وتم استخدام البيانات المتاحة مع الاحتياطي.</section> : null}<section className="grid gap-4 md:grid-cols-4">{[["متوسط التقييم", avgRating, "من 5"], ["مزودون نشطون", String(providerRows.filter((row) => row.status === "approved").length), "مزود"], ["طلبات مكتملة", String(completedRequests.length || providerRatingRows.reduce((sum, row) => sum + row.completedCount, 0)), "طلب"], ["مصدر البيانات", providersResult.source === "supabase" ? "Supabase" : "احتياطي", ""]].map(([label, value, unit]) => <article key={label} className="rounded-[18px] border bg-white p-4 shadow-card" style={{ borderColor: uiColors.border }}><p className="text-xs font-extrabold text-[#6E6258]">{label}</p><strong className="mt-2 block font-display text-2xl font-extrabold text-[#1D1916]">{value}</strong>{unit ? <span className="text-xs font-bold text-[#A7815E]">{unit}</span> : null}</article>)}</section><section className="rounded-[20px] border bg-white p-4 shadow-card" style={{ borderColor: uiColors.border }}><div className="flex flex-wrap items-center gap-3"><Link href={dashboardHref("admin", "providers?status=approved")} className="inline-flex min-h-11 items-center justify-center rounded-xl border bg-white px-4 text-sm font-extrabold text-[#1D1916]" style={{ borderColor: uiColors.border }}>المزودون المعتمدون</Link><Link href={dashboardHref("admin", "service-requests")} className="inline-flex min-h-11 items-center justify-center rounded-xl border bg-white px-4 text-sm font-extrabold text-[#1D1916]" style={{ borderColor: uiColors.border }}>طلبات الخدمات</Link><FinancialExportButton filename="mahabah-provider-ratings.csv" rows={exportRows} className="inline-flex min-h-11 items-center justify-center rounded-xl border bg-white px-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>تصدير التقييمات</FinancialExportButton></div></section><section className="grid gap-4 xl:grid-cols-2">{providerRatingRows.length === 0 ? <article className="rounded-[20px] border bg-white p-8 text-center text-sm font-extrabold text-[#6E6258] shadow-card xl:col-span-2" style={{ borderColor: uiColors.border }}>لا توجد تقييمات مزودين متاحة حالياً.</article> : providerRatingRows.map((row) => <article key={row.provider.id} className="rounded-[20px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><div className="flex items-start justify-between gap-3"><div><h3 className="font-display text-lg font-extrabold text-[#1D1916]">{row.provider.name}</h3><p className="mt-1 text-xs font-bold text-[#6E6258]">{row.provider.category} · {row.provider.city}</p></div><div className="text-left"><span className="block font-display text-2xl font-extrabold text-[#A7815E]">{row.provider.rating}</span><StatusPill label={row.statusMeta.label} tone={row.statusMeta.tone} /></div></div><div className="mt-4 h-2 rounded-full bg-[#EFE8E1]"><span className="block h-2 rounded-full bg-[#A7815E]" style={{ width: `${Math.min(100, Math.max(0, row.provider.rating * 20))}%` }} /></div><div className="mt-4 grid gap-3 md:grid-cols-3">{[["مكتملة", row.completedCount], ["قيد المتابعة", row.activeCount], ["طلبات مرتبطة", row.relatedRequests.length]].map(([label, value]) => <div key={label} className="rounded-xl border bg-[#fffdf9] p-3 text-center" style={{ borderColor: uiColors.border }}><strong className="font-display text-xl text-[#1D1916]">{value}</strong><p className="mt-1 text-xs font-bold text-[#6E6258]">{label}</p></div>)}</div><p className="mt-4 text-sm font-bold leading-7 text-[#5f5953]">{row.note}</p><div className="mt-4 flex flex-wrap gap-2"><Link href={dashboardHref("admin", `providers/details?provider=${encodeURIComponent(row.provider.slug || row.provider.id)}`)} className="inline-flex min-h-10 items-center justify-center rounded-xl border px-4 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>تفاصيل المزود</Link><Link href={dashboardHref("admin", `service-requests?q=${encodeURIComponent(row.provider.name)}`)} className="inline-flex min-h-10 items-center justify-center rounded-xl border px-4 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>الطلبات المرتبطة</Link><StatusPill label={row.ratingTone === "green" ? "ممتاز" : row.ratingTone === "gold" ? "مستقر" : "بحاجة متابعة"} tone={row.ratingTone} /></div></article>)}</section></div>;
}

async function AdminProviderCategoriesPage({ config }: { config: DashboardRoleConfig }) {
  const providersResult = await listDashboardAdminProviders();
  const providerRows = providersResult.data.length ? providersResult.data : adminProviderRows;
  const defaultCategories = ["استشارات هندسية", "تقييم عقاري", "مراجعة قانونية", "تسويق عقاري", "توثيق عقاري", "إدارة مشاريع"];
  const categories = Array.from(new Set([...providerRows.map((row) => row.category).filter(Boolean), ...defaultCategories]));
  return <div className="grid gap-5"><DashboardTopbar config={config} /><AdminProvidersHeader title="تصنيفات المزودين" subtitle="إدارة تصنيفات مزودي الخدمات وربطها بالخدمات العقارية وطلبات المنصة." /><AdminProviderNav activePath="providers/categories" />{providersResult.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل تصنيفات المزودين الحية، وتم عرض البيانات المتاحة مع الاحتياطي.</section> : null}<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{categories.map((category) => { const count = providerRows.filter((row) => row.category === category).length; return <article key={category} className="rounded-[20px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><Tag className="h-7 w-7 text-[#A7815E]" /><h3 className="mt-3 font-display text-xl font-extrabold text-[#1D1916]">{category}</h3><p className="mt-2 text-sm font-bold text-[#6E6258]">{count} مزودين</p><Link href={dashboardHref("admin", `providers?category=${encodeURIComponent(category)}`)} className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl border px-4 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>عرض المزودين</Link></article>; })}</section></div>;
}

const adminAccountStatusMeta: Record<DashboardAdminAccountStatus, { label: string; tone: TrendTone; action: string }> = {
  pending: { label: "بانتظار التوثيق", tone: "gold", action: "مراجعة التوثيق" },
  verified: { label: "موثق", tone: "green", action: "عرض التفاصيل" },
  suspended: { label: "موقوف", tone: "red", action: "عرض سبب الإيقاف" },
};

function AdminAccountsHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="relative overflow-hidden rounded-[24px] border bg-white p-5 shadow-card md:p-6" style={{ borderColor: uiColors.border }}>
      <Image src="/images/about-lobby.png" alt="" fill className="object-cover opacity-[0.12] grayscale-[12%] sepia-[12%]" sizes="80vw" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <StatusPill label="إدارة الحسابات" tone="gold" />
          <h1 className="mt-3 font-display text-3xl font-extrabold text-[#1D1916]">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-[#5f5953]">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={dashboardHref("admin", "accounts/pending")} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#A7815E] px-5 text-sm font-extrabold text-white">مراجعة التوثيق</Link>
          <Link href={dashboardHref("admin", "accounts/settings")} className="inline-flex min-h-11 items-center justify-center rounded-xl border bg-white px-5 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إعدادات الحسابات</Link>
        </div>
      </div>
    </section>
  );
}

function adminAccountExportRows(rows: DashboardAdminAccount[]) {
  return rows.map((row) => ({
    "رقم الحساب": row.id,
    "اسم الحساب": row.name,
    "نوع الحساب": row.typeLabel,
    "المدينة": row.city,
    "البريد": row.email,
    "الجوال": row.phone,
    "الأصول": row.assets,
    "المساهمات": row.contributions,
    "الحالة": adminAccountStatusMeta[row.status].label,
    "نسبة الاكتمال": row.profileCompletion,
  }));
}

function AdminAccountKpis({ rows, activeStatus, activeKind }: { rows: DashboardAdminAccount[]; activeStatus?: DashboardAdminAccountStatus; activeKind?: DashboardAdminAccountKind }) {
  const cards = [
    { title: "إجمالي الحسابات", value: String(rows.length), unit: "حساب", icon: "users", tone: "blue" as TrendTone, active: !activeStatus && !activeKind },
    { title: "حسابات الأفراد", value: String(rows.filter((item) => item.kind === "individual").length), unit: "حساب", icon: "user", tone: "gold" as TrendTone, active: activeKind === "individual" },
    { title: "حسابات المنشآت", value: String(rows.filter((item) => item.kind === "business").length), unit: "منشأة", icon: "building", tone: "blue" as TrendTone, active: activeKind === "business" },
    { title: "بانتظار التوثيق", value: String(rows.filter((item) => item.status === "pending").length), unit: "حساب", icon: "clock", tone: "gold" as TrendTone, active: activeStatus === "pending" },
    { title: "الحسابات الموثقة", value: String(rows.filter((item) => item.status === "verified").length), unit: "حساب", icon: "shield", tone: "green" as TrendTone, active: activeStatus === "verified" },
    { title: "الحسابات الموقوفة", value: String(rows.filter((item) => item.status === "suspended").length), unit: "حساب", icon: "x", tone: "red" as TrendTone, active: activeStatus === "suspended" },
  ];

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const tone = toneStyles[card.tone];
        return (
          <article key={card.title} className={cn("rounded-[18px] border bg-white p-4 text-right shadow-card", card.active ? "ring-2 ring-[#A7815E]/30" : "")} style={{ borderColor: card.active ? "#A7815E" : uiColors.border }}>
            <div className="flex items-center justify-between gap-4">
              <div><p className="text-sm font-extrabold text-[#5f5953]">{card.title}</p><strong className="mt-2 block font-display text-4xl font-extrabold text-[#1D1916]">{card.value}</strong><span className="text-xs font-bold text-[#6E6258]">{card.unit}</span></div>
              <span className="grid h-12 w-12 place-items-center rounded-full border" style={{ backgroundColor: tone.bg, borderColor: tone.border, color: tone.text }}><Icon name={card.icon} className="h-6 w-6" /></span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function AdminAccountNav({ activePath, detailPath = "accounts/details" }: { activePath: string; detailPath?: string }) {
  const items = [
    { label: "جميع الحسابات", path: "accounts", active: "accounts" },
    { label: "تفاصيل الحساب", path: detailPath, active: "accounts/details" },
    { label: "الأفراد", path: "accounts/individuals", active: "accounts/individuals" },
    { label: "المنشآت", path: "accounts/businesses", active: "accounts/businesses" },
    { label: "بانتظار التوثيق", path: "accounts/pending", active: "accounts/pending" },
    { label: "الموثقة", path: "accounts/verified", active: "accounts/verified" },
    { label: "الموقوفة", path: "accounts/suspended", active: "accounts/suspended" },
    { label: "الإعدادات", path: "accounts/settings", active: "accounts/settings" },
  ];
  return <section className="flex flex-wrap gap-2">{items.map((item) => <Link key={item.active} href={dashboardHref("admin", item.path)} className={cn("inline-flex min-h-10 items-center justify-center rounded-xl border px-4 text-sm font-extrabold", activePath === item.active ? "bg-[#A7815E] text-white" : "bg-white text-[#1D1916]")} style={{ borderColor: activePath === item.active ? "#A7815E" : uiColors.border }}>{item.label}</Link>)}</section>;
}

function AdminAccountFilters({ title, rows, q, sort, activePath }: { title: string; rows: DashboardAdminAccount[]; q: string; sort: string; activePath: string }) {
  const quickFilters = [
    ["الأفراد", "accounts/individuals", undefined],
    ["المنشآت", "accounts/businesses", undefined],
    ["بانتظار التوثيق", "accounts/pending", undefined],
    ["آخر دخول", "accounts", "lastLogin"],
  ] as const;
  return (
    <section className="rounded-[20px] border bg-white p-4 shadow-card" style={{ borderColor: uiColors.border }}>
      <div className="grid gap-3 lg:grid-cols-[1.4fr_repeat(4,1fr)_auto]">
        <form action={dashboardHref("admin", activePath)} className="contents">
          {sort ? <input type="hidden" name="sort" value={sort} /> : null}
          <label className="relative block">
            <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6E6258]" />
            <input name="q" defaultValue={q} suppressHydrationWarning className="h-12 w-full rounded-xl border bg-[#fffdf9] pl-16 pr-12 text-sm font-bold outline-none focus:border-[#A7815E]" style={{ borderColor: uiColors.border }} placeholder={`ابحث في ${title}`} />
            <button type="submit" className="absolute left-2 top-1/2 h-8 -translate-y-1/2 rounded-lg bg-[#1D1916] px-3 text-xs font-extrabold text-white">بحث</button>
          </label>
        </form>
        {quickFilters.map(([filter, path, nextSort]) => <Link key={filter} href={dashboardQueryHref("admin", path, { q, sort: nextSort })} className={cn("flex h-12 items-center justify-between rounded-xl border px-4 text-sm font-extrabold", sort === nextSort ? "bg-[#fbf3e9] text-[#8F6B4C]" : "bg-white text-[#1D1916]")} style={{ borderColor: sort === nextSort ? "#e3c8aa" : uiColors.border }}><span>{filter}</span><ChevronGlyph /></Link>)}
        <FinancialExportButton filename="mahabah-admin-accounts.csv" rows={adminAccountExportRows(rows)} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border bg-white px-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>تصدير</FinancialExportButton>
      </div>
    </section>
  );
}

function AdminAccountsTable({ rows }: { rows: DashboardAdminAccount[] }) {
  return (
    <section className="overflow-hidden rounded-[22px] border bg-white shadow-card" style={{ borderColor: uiColors.border }}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-right text-sm" style={{ minWidth: 1040 }}>
          <thead><tr className="bg-[#f4ede5] text-xs font-extrabold text-[#5f5953]">{["الحساب", "النوع", "المدينة", "الأصول", "المساهمات", "آخر دخول", "الحالة", "الإجراء"].map((header) => <th key={header} className="px-4 py-3 font-extrabold first:w-[280px]">{header}</th>)}</tr></thead>
          <tbody>
            {rows.length === 0 ? <tr><td colSpan={8} className="px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد حسابات مطابقة لهذا التصنيف.</td></tr> : null}
            {rows.map((row) => {
              const meta = adminAccountStatusMeta[row.status];
              return (
                <tr key={row.id} className="border-b last:border-b-0" style={{ borderColor: uiColors.border }}>
                  <td className="px-4 py-4 align-middle"><p className="font-display text-lg font-extrabold text-[#1D1916]">{row.name}</p><p className="mt-1 text-xs font-bold text-[#6E6258]">{row.id} · {row.email}</p></td>
                  <td className="px-4 py-4 align-middle font-bold text-[#1D1916]">{row.typeLabel}</td>
                  <td className="px-4 py-4 align-middle font-bold text-[#6E6258]">{row.city}</td>
                  <td className="px-4 py-4 align-middle font-bold text-[#1D1916]">{row.assets}</td>
                  <td className="px-4 py-4 align-middle font-bold text-[#1D1916]">{row.contributions}</td>
                  <td className="px-4 py-4 align-middle font-bold text-[#6E6258]">{row.lastLogin}</td>
                  <td className="px-4 py-4 align-middle"><StatusPill label={meta.label} tone={meta.tone} /></td>
                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-wrap gap-2">
                      <Link href={dashboardHref("admin", `accounts/details?account=${encodeURIComponent(row.id)}`)} className="inline-flex min-h-10 items-center justify-center rounded-xl border bg-white px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>{meta.action}</Link>
                      {row.status === "pending" ? <AdminAccountStatusButton accountId={row.id} kind={row.kind} status="verified" className="min-h-10 rounded-xl bg-[#087342] px-3 text-xs font-extrabold text-white">اعتماد</AdminAccountStatusButton> : null}
                      {row.status === "verified" ? <AdminAccountStatusButton accountId={row.id} kind={row.kind} status="suspended" className="min-h-10 rounded-xl border bg-[#fff0eb] px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: "#efc5b9" }}>إيقاف</AdminAccountStatusButton> : null}
                      {row.status === "suspended" ? <AdminAccountStatusButton accountId={row.id} kind={row.kind} status="verified" className="min-h-10 rounded-xl border bg-white px-3 text-xs font-extrabold text-[#087342]" style={{ borderColor: "#CDE9D8" }}>تفعيل</AdminAccountStatusButton> : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

async function AdminAccountsPage({ config, status, kind, searchParams = {} }: { config: DashboardRoleConfig; status?: DashboardAdminAccountStatus; kind?: DashboardAdminAccountKind; searchParams?: DashboardSearchParams }) {
  const accounts = await listDashboardAdminAccounts();
  const q = stringParam(searchParams, "q").trim();
  const sort = stringParam(searchParams, "sort").trim();
  const scopedRows = accounts.data.filter((row) => (!status || row.status === status) && (!kind || row.kind === kind));
  const matchedRows = scopedRows.filter((row) => matchesDashboardSearch(q, [row.id, row.name, row.kind, row.typeLabel, row.city, row.email, row.phone, row.status, adminAccountStatusMeta[row.status].label, row.assets, row.contributions, row.joinedAt, row.lastLogin, row.profileCompletion, row.commercialRegistration]));
  const rows = [...matchedRows].sort((a, b) => {
    if (sort === "city") return a.city.localeCompare(b.city, "ar");
    if (sort === "joined") return b.joinedAt.localeCompare(a.joinedAt, "ar");
    if (sort === "lastLogin") return b.lastLogin.localeCompare(a.lastLogin, "ar");
    if (sort === "profile") return b.profileCompletion - a.profileCompletion;
    return 0;
  });
  const firstAccountRef = rows[0]?.id || accounts.data[0]?.id;
  const accountDetailPath = firstAccountRef ? `accounts/details?account=${encodeURIComponent(firstAccountRef)}` : "accounts/details";
  const title = kind === "individual" ? "حسابات الأفراد" : kind === "business" ? "حسابات المنشآت" : status === "pending" ? "الحسابات بانتظار التوثيق" : status === "verified" ? "الحسابات الموثقة" : status === "suspended" ? "الحسابات الموقوفة" : "جميع الحسابات";
  const activePath = kind === "individual" ? "accounts/individuals" : kind === "business" ? "accounts/businesses" : status ? `accounts/${status}` : "accounts";
  return <div className="grid gap-5"><DashboardTopbar config={config} /><AdminAccountsHeader title={title} subtitle="إدارة حسابات الأفراد والمنشآت ومتابعة التوثيق والإيقاف والصلاحيات المرتبطة بالحساب." /><AdminAccountKpis rows={accounts.data} activeStatus={status} activeKind={kind} /><AdminAccountFilters title={title} rows={rows} q={q} sort={sort} activePath={activePath} /><AdminAccountNav activePath={activePath} detailPath={accountDetailPath} />{accounts.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر الاتصال ببيانات الحسابات الحية، وتم عرض بيانات تجريبية مؤقتة.</section> : null}<AdminAccountsTable rows={rows} />{status === "suspended" ? <section className="grid gap-4 xl:grid-cols-3">{rows.map((row) => <article key={`${row.id}-suspended`} className="rounded-[18px] border bg-white p-4 shadow-card" style={{ borderColor: uiColors.border }}><h3 className="font-display text-lg font-extrabold text-[#1D1916]">{row.name}</h3><p className="mt-2 text-sm font-bold leading-7 text-[#6E6258]">سبب الإيقاف: مخالفة سياسة الاستخدام أو وجود بلاغ يحتاج مراجعة من فريق الامتثال.</p><AdminAccountStatusButton accountId={row.id} kind={row.kind} status="verified" className="mt-4 min-h-10 rounded-xl border px-4 text-xs font-extrabold text-[#087342]" style={{ borderColor: "#CDE9D8" }}>إعادة تفعيل الحساب</AdminAccountStatusButton></article>)}</section> : null}</div>;
}

async function AdminAccountDetailsPage({ config, searchParams = {} }: { config: DashboardRoleConfig; searchParams?: DashboardSearchParams }) {
  const accounts = await listDashboardAdminAccounts();
  const selectedAccount = selectEntityByParam(accounts.data, searchParams, "account", "id");
  const account = selectedAccount ?? accounts.data.find((row) => row.status === "pending") ?? accounts.data[0];
  if (!account) {
    return <div className="grid gap-5"><DashboardTopbar config={config} /><AdminAccountsHeader title="تفاصيل الحساب" subtitle="عرض معلومات الحساب ونشاطه وحالة التوثيق والإجراءات الإدارية المتاحة." /><AdminAccountNav activePath="accounts/details" /><section className="rounded-[22px] border bg-white p-8 text-center text-sm font-extrabold text-[#6E6258]" style={{ borderColor: uiColors.border }}>لا توجد حسابات لعرض تفاصيلها.</section></div>;
  }
  const meta = adminAccountStatusMeta[account.status];
  return (
    <div className="grid gap-5">
      <DashboardTopbar config={config} />
      <AdminAccountsHeader title="تفاصيل الحساب" subtitle="عرض معلومات الحساب ونشاطه وحالة التوثيق والإجراءات الإدارية المتاحة." />
      <AdminAccountNav activePath="accounts/details" />
      <section className="grid gap-5 lg:grid-cols-3">
        <aside className="grid content-start gap-4">
          <article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><h3 className="font-display text-xl font-extrabold text-[#1D1916]">إجراءات الحساب</h3><div className="mt-4 grid gap-2"><AdminAccountStatusButton accountId={account.id} kind={account.kind} status="verified" className="min-h-11 rounded-xl px-4 text-sm font-extrabold text-white" style={{ backgroundColor: "#087342" }}>اعتماد التوثيق</AdminAccountStatusButton><AdminAccountStatusButton accountId={account.id} kind={account.kind} status="pending" className="min-h-11 rounded-xl border bg-white px-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>طلب تحديث بيانات</AdminAccountStatusButton><AdminAccountStatusButton accountId={account.id} kind={account.kind} status="suspended" className="min-h-11 rounded-xl border bg-[#fff0eb] px-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#efc5b9" }}>إيقاف الحساب</AdminAccountStatusButton></div></article>
          <article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><h3 className="font-display text-xl font-extrabold text-[#1D1916]">سجل مختصر</h3>{[["آخر تحديث", formatDashboardDate(account.lastLogin)], ["تاريخ الانضمام", formatDashboardDate(account.joinedAt)], ["نسبة اكتمال الملف", `${account.profileCompletion}%`], ["مصدر البيانات", accounts.source === "supabase" ? "Supabase" : "بيانات تجريبية"]].map(([item, value]) => <div key={item} className="border-b py-3 last:border-b-0" style={{ borderColor: uiColors.border }}><p className="text-sm font-extrabold text-[#1D1916]">{item}</p><p className="mt-1 text-xs font-bold text-[#6E6258]">{value}</p></div>)}</article>
        </aside>
        <article className="rounded-[22px] border bg-white p-5 shadow-card lg:col-span-2" style={{ borderColor: uiColors.border }}>
          <StatusPill label={meta.label} tone={meta.tone} />
          <h2 className="mt-4 font-display text-3xl font-extrabold text-[#1D1916]">{account.name}</h2>
          <p className="mt-3 text-sm font-bold leading-8 text-[#5f5953]">حساب {account.typeLabel} ضمن منصة مهابة، مرتبط بملف توثيق ونشاط عقاري قابل للمراجعة من مركز الإدارة.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-4">{[["رقم الحساب", account.id], ["نوع الحساب", account.typeLabel], ["المدينة", account.city], ["الجوال", account.phone], ["البريد", account.email], ["الأصول", String(account.assets)], ["المساهمات", String(account.contributions)], ["تاريخ الانضمام", formatDashboardDate(account.joinedAt)], ["السجل التجاري", account.commercialRegistration ?? "---"], ["نسبة الاكتمال", `${account.profileCompletion}%`]].map(([label, value]) => <div key={label} className={cn("rounded-xl border bg-[#fffdf9] p-3", label === "البريد" || label === "تاريخ الانضمام" || label === "رقم الحساب" ? "md:col-span-2" : "")} style={{ borderColor: uiColors.border }}><p className="text-xs font-bold text-[#6E6258]">{label}</p><p className={cn("mt-1 break-words font-extrabold text-[#1D1916]", label === "البريد" || label === "رقم الحساب" ? "text-xs leading-6" : "text-sm")}>{value}</p></div>)}</div>
        </article>
      </section>
    </div>
  );
}

function adminAccountSettingKey(title: string) {
  return `account-setting-${normalizeDashboardSearch(title).replaceAll(" ", "-") || "policy"}`;
}

async function AdminAccountSettingsPage({ config }: { config: DashboardRoleConfig }) {
  const settingsResult = await listDashboardPlatformSettings("account-setting-");
  const savedSettings = new Map(settingsResult.data.map((setting) => [setting.key, platformSettingRecord(setting)]));
  const settings = [
    { title: "التوثيق الإلزامي", description: "تفعيل مراجعة الهوية قبل نشر الأصول", defaultActive: true },
    { title: "إيقاف تلقائي للبلاغات", description: "إيقاف الحساب بعد 3 بلاغات مؤكدة", defaultActive: true },
    { title: "صلاحيات المنشآت", description: "السماح بإضافة فريق عمل للمنشأة", defaultActive: true },
    { title: "تنبيهات الامتثال", description: "إرسال إشعار عند تغيير حالة الحساب", defaultActive: true },
    { title: "مدة جلسة الدخول", description: "120 دقيقة قبل انتهاء الجلسة", defaultActive: false },
    { title: "مراجعة البريد والجوال", description: "تأكيد قنوات التواصل قبل الاعتماد", defaultActive: false },
  ].map((setting) => {
    const key = adminAccountSettingKey(setting.title);
    const saved = savedSettings.get(key);
    const active = typeof saved?.active === "boolean" ? saved.active : setting.defaultActive;
    return {
      ...setting,
      key,
      active,
      updatedAt: typeof saved?.savedAt === "string" ? saved.savedAt : "",
    };
  });
  return (
    <div className="grid gap-5">
      <DashboardTopbar config={config} />
      <AdminAccountsHeader title="إعدادات الحسابات" subtitle="ضبط قواعد التوثيق والإيقاف والتنبيهات والسياسات العامة لحسابات المنصة." />
      <AdminAccountNav activePath="accounts/settings" />
      {settingsResult.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل إعدادات الحسابات المحفوظة، وتم عرض القيم الافتراضية.</section> : null}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {settings.map((setting) => <article key={setting.key} className="rounded-[20px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><div className="flex items-start justify-between gap-4"><Settings2 className="h-7 w-7 text-[#A7815E]" /><StatusPill label={setting.active ? "مفعل" : "غير مفعل"} tone={setting.active ? "green" : "gold"} /></div><h3 className="mt-4 font-display text-xl font-extrabold text-[#1D1916]">{setting.title}</h3><p className="mt-2 text-sm font-bold leading-7 text-[#6E6258]">{setting.description}</p>{setting.updatedAt ? <p className="mt-2 text-xs font-bold text-[#8A7E73]">آخر حفظ: {formatDashboardDate(setting.updatedAt)}</p> : null}<div className="mt-4 flex flex-wrap gap-2"><SettingsActionButton settingsKey={setting.key} label={setting.title} payload={{ section: "account_settings", title: setting.title, description: setting.description, active: !setting.active }} className="inline-flex min-h-10 items-center justify-center rounded-xl border px-4 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>{setting.active ? "تعطيل الإعداد" : "تفعيل الإعداد"}</SettingsActionButton><Link href={dashboardQueryHref("admin", "accounts", { q: setting.title })} className="inline-flex min-h-10 items-center justify-center rounded-xl border px-4 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>مراجعة الحسابات</Link></div></article>)}
      </section>
    </div>
  );
}

type AdminContentStatus = DashboardAdminContentStatus;
type AdminContentCommentStatus = DashboardAdminContentCommentStatus;
type AdminContentKind = Extract<DashboardAdminContentKind, "page" | "article">;

const adminContentStatusMeta: Record<AdminContentStatus, { label: string; tone: TrendTone; action: string }> = {
  published: { label: "منشور", tone: "green", action: "عرض" },
  draft: { label: "مسودة", tone: "blue", action: "تعديل" },
  review: { label: "بانتظار المراجعة", tone: "gold", action: "مراجعة" },
  archived: { label: "مؤرشف", tone: "red", action: "عرض" },
};

const adminContentCommentStatusMeta: Record<AdminContentCommentStatus, { label: string; tone: TrendTone }> = {
  submitted: { label: "بانتظار المراجعة", tone: "gold" },
  approved: { label: "معتمد", tone: "green" },
  rejected: { label: "مرفوض", tone: "red" },
  archived: { label: "مؤرشف", tone: "blue" },
};

const adminContentRows: DashboardAdminContentItem[] = [
  { id: "CNT-7101", slug: "home", title: "الصفحة الرئيسية", kind: "page", typeLabel: "صفحة", status: "published", category: "صفحات الموقع", author: "فريق المحتوى", updatedAt: "14/06/2026", views: "12,430" },
  { id: "CNT-7102", slug: "about", title: "من نحن", kind: "page", typeLabel: "صفحة", status: "published", category: "صفحات تعريفية", author: "إدارة المنصة", updatedAt: "13/06/2026", views: "4,820" },
  { id: "CNT-7103", slug: "real-estate-investment-guide", title: "دليل الاستثمار العقاري", kind: "article", typeLabel: "خبر/مقال", status: "review", category: "مقالات", author: "سارة العتيبي", updatedAt: "12/06/2026", views: "1,245" },
  { id: "CNT-7104", slug: "terms", title: "شروط الاستخدام", kind: "page", typeLabel: "صفحة", status: "draft", category: "سياسات", author: "الشؤون القانونية", updatedAt: "10/06/2026", views: "980" },
  { id: "CNT-7105", slug: "riyadh-market-update", title: "تحديثات سوق الرياض", kind: "article", typeLabel: "خبر/مقال", status: "published", category: "أخبار", author: "محمد الشهري", updatedAt: "09/06/2026", views: "3,118" },
  { id: "CNT-7106", slug: "faq", title: "الأسئلة الشائعة", kind: "page", typeLabel: "صفحة", status: "published", category: "مساعدة", author: "الدعم", updatedAt: "08/06/2026", views: "6,540" },
  { id: "CNT-7107", slug: "contribution-governance", title: "حوكمة المساهمات العقارية", kind: "article", typeLabel: "خبر/مقال", status: "draft", category: "حوكمة", author: "فريق التحرير", updatedAt: "06/06/2026", views: "740" },
  { id: "CNT-7108", slug: "privacy", title: "سياسة الخصوصية", kind: "page", typeLabel: "صفحة", status: "review", category: "سياسات", author: "الشؤون القانونية", updatedAt: "04/06/2026", views: "1,870" },
];

function AdminContentHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="relative overflow-hidden rounded-[24px] border bg-white p-5 shadow-card md:p-6" style={{ borderColor: uiColors.border }}>
      <Image src="/images/about-lobby.png" alt="" fill className="object-cover opacity-[0.12] grayscale-[12%] sepia-[12%]" sizes="80vw" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <StatusPill label="إدارة المحتوى" tone="gold" />
          <h1 className="mt-3 font-display text-3xl font-extrabold text-[#1D1916]">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-[#5f5953]">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={dashboardHref("admin", "content/add-page")} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#A7815E] px-5 text-sm font-extrabold text-white">إضافة صفحة</Link>
          <Link href={dashboardHref("admin", "content/add-article")} className="inline-flex min-h-11 items-center justify-center rounded-xl border bg-white px-5 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إضافة خبر</Link>
        </div>
      </div>
    </section>
  );
}

function AdminContentKpis({ rows, activeKind, activeStatus }: { rows: DashboardAdminContentItem[]; activeKind?: AdminContentKind; activeStatus?: AdminContentStatus }) {
  const cards = [
    { title: "إجمالي المحتوى", value: String(rows.length), unit: "عنصر", icon: "layout", tone: "blue" as TrendTone, active: !activeKind && !activeStatus },
    { title: "الصفحات", value: String(rows.filter((item) => item.kind === "page").length), unit: "صفحة", icon: "file-text", tone: "gold" as TrendTone, active: activeKind === "page" },
    { title: "الأخبار والمقالات", value: String(rows.filter((item) => item.kind === "article").length), unit: "مقال", icon: "file", tone: "blue" as TrendTone, active: activeKind === "article" },
    { title: "منشور", value: String(rows.filter((item) => item.status === "published").length), unit: "عنصر", icon: "shield", tone: "green" as TrendTone, active: activeStatus === "published" },
    { title: "مسودات", value: String(rows.filter((item) => item.status === "draft").length), unit: "عنصر", icon: "file-text", tone: "blue" as TrendTone, active: activeStatus === "draft" },
    { title: "بانتظار المراجعة", value: String(rows.filter((item) => item.status === "review").length), unit: "عنصر", icon: "clock", tone: "gold" as TrendTone, active: activeStatus === "review" },
  ];

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const tone = toneStyles[card.tone];
        return <article key={card.title} className={cn("rounded-[18px] border bg-white p-4 text-right shadow-card", card.active ? "ring-2 ring-[#A7815E]/30" : "")} style={{ borderColor: card.active ? "#A7815E" : uiColors.border }}><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-extrabold text-[#5f5953]">{card.title}</p><strong className="mt-2 block font-display text-4xl font-extrabold text-[#1D1916]">{card.value}</strong><span className="text-xs font-bold text-[#6E6258]">{card.unit}</span></div><span className="grid h-12 w-12 place-items-center rounded-full border" style={{ backgroundColor: tone.bg, borderColor: tone.border, color: tone.text }}><Icon name={card.icon} className="h-6 w-6" /></span></div></article>;
      })}
    </section>
  );
}

function AdminContentNav({ activePath, pageDetailPath = "content/details", articleDetailPath = "content/article-details", pageEditPath = "content/edit-page", articleEditPath = "content/edit-article" }: { activePath: string; pageDetailPath?: string; articleDetailPath?: string; pageEditPath?: string; articleEditPath?: string }) {
  const items = [
    { label: "الصفحات", path: "content", active: "content" },
    { label: "تفاصيل الصفحة", path: pageDetailPath, active: "content/details" },
    { label: "إضافة صفحة", path: "content/add-page", active: "content/add-page" },
    { label: "تعديل صفحة", path: pageEditPath, active: "content/edit-page" },
    { label: "الأخبار", path: "content/articles", active: "content/articles" },
    { label: "تفاصيل خبر", path: articleDetailPath, active: "content/article-details" },
    { label: "إضافة خبر", path: "content/add-article", active: "content/add-article" },
    { label: "تعديل خبر", path: articleEditPath, active: "content/edit-article" },
    { label: "التصنيفات", path: "content/categories", active: "content/categories" },
    { label: "الوسائط", path: "content/media", active: "content/media" },
    { label: "البنرات", path: "content/banners", active: "content/banners" },
    { label: "الأسئلة", path: "content/faq", active: "content/faq" },
    { label: "الشركاء", path: "content/partners", active: "content/partners" },
  ];
  return <section className="flex flex-wrap gap-2">{items.map((item) => <Link key={item.active} href={dashboardHref("admin", item.path)} className={cn("inline-flex min-h-10 items-center justify-center rounded-xl border px-4 text-sm font-extrabold", activePath === item.active ? "bg-[#A7815E] text-white" : "bg-white text-[#1D1916]")} style={{ borderColor: activePath === item.active ? "#A7815E" : uiColors.border }}>{item.label}</Link>)}</section>;
}

function AdminContentFilters({ title, q, sort, activePath }: { title: string; q: string; sort: string; activePath: string }) {
  const filters = [
    ["الصفحات", "content", undefined],
    ["الأخبار", "content/articles", undefined],
    ["الحالة", "content", "status"],
    ["آخر تحديث", "content", "updated"],
  ] as const;
  return (
    <section className="rounded-[20px] border bg-white p-4 shadow-card" style={{ borderColor: uiColors.border }}>
      <form action={dashboardHref("admin", activePath)} className="grid gap-3 lg:grid-cols-5">
        {sort ? <input type="hidden" name="sort" value={sort} /> : null}
        <label className="relative block">
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6E6258]" />
          <input name="q" defaultValue={q} suppressHydrationWarning className="h-12 w-full rounded-xl border bg-[#fffdf9] pl-16 pr-12 text-sm font-bold outline-none focus:border-[#A7815E]" style={{ borderColor: uiColors.border }} placeholder={`ابحث في ${title}`} />
          <button type="submit" className="absolute left-2 top-1/2 h-8 -translate-y-1/2 rounded-lg bg-[#1D1916] px-3 text-xs font-extrabold text-white">بحث</button>
        </label>
        {filters.map(([filter, path, nextSort]) => <Link key={filter} href={dashboardQueryHref("admin", path, { q, sort: nextSort })} className={cn("flex h-12 items-center justify-between rounded-xl border px-4 text-sm font-extrabold", sort === nextSort ? "bg-[#fbf3e9] text-[#8F6B4C]" : "bg-white text-[#1D1916]")} style={{ borderColor: sort === nextSort ? "#e3c8aa" : uiColors.border }}><span>{filter}</span><ChevronGlyph /></Link>)}
      </form>
    </section>
  );
}

function AdminContentTable({ rows }: { rows: DashboardAdminContentItem[] }) {
  return (
    <section className="overflow-hidden rounded-[22px] border bg-white shadow-card" style={{ borderColor: uiColors.border }}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-right text-sm" style={{ minWidth: 1040 }}>
          <thead><tr className="bg-[#f4ede5] text-xs font-extrabold text-[#5f5953]">{["العنوان", "النوع", "التصنيف", "المحرر", "المشاهدات", "آخر تحديث", "الحالة", "الإجراء"].map((header) => <th key={header} className="px-4 py-3 font-extrabold first:w-[310px]">{header}</th>)}</tr></thead>
          <tbody>{rows.length === 0 ? <tr><td colSpan={8} className="px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد عناصر محتوى مطابقة للبحث الحالي.</td></tr> : null}{rows.map((row) => { const meta = adminContentStatusMeta[row.status]; return <tr key={row.id} className="border-b last:border-b-0" style={{ borderColor: uiColors.border }}><td className="px-4 py-4 align-middle"><p className="font-display text-lg font-extrabold text-[#1D1916]">{row.title}</p><p className="mt-1 text-xs font-bold text-[#6E6258]">{row.id}</p></td><td className="px-4 py-4 align-middle font-bold text-[#1D1916]">{row.typeLabel}</td><td className="px-4 py-4 align-middle font-bold text-[#6E6258]">{row.category}</td><td className="px-4 py-4 align-middle font-bold text-[#1D1916]">{row.author}</td><td className="px-4 py-4 align-middle font-bold text-[#1D1916]">{row.views}</td><td className="px-4 py-4 align-middle font-bold text-[#6E6258]">{row.updatedAt}</td><td className="px-4 py-4 align-middle"><StatusPill label={meta.label} tone={meta.tone} /></td><td className="px-4 py-4 align-middle"><Link href={dashboardHref("admin", `${row.kind === "article" ? "content/article-details" : "content/details"}?content=${encodeURIComponent(row.slug || row.id)}`)} className="inline-flex min-h-10 items-center justify-center rounded-xl border bg-white px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>{meta.action}</Link></td></tr>; })}</tbody>
        </table>
      </div>
    </section>
  );
}

function AdminContentCommentsPanel({ comments }: { comments: DashboardAdminContentComment[] }) {
  const visibleComments = comments.slice(0, 6);
  return (
    <section className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold text-[#A7815E]">تعليقات المحتوى</p>
          <h3 className="mt-1 font-display text-xl font-extrabold text-[#1D1916]">مراجعة التعليقات العامة</h3>
        </div>
        <StatusPill label={`${comments.length} تعليق`} tone="gold" />
      </div>
      <div className="mt-4 grid gap-3">
        {visibleComments.length === 0 ? <div className="rounded-xl border bg-[#fffdf9] p-4 text-center text-sm font-extrabold text-[#6E6258]" style={{ borderColor: uiColors.border }}>لا توجد تعليقات محتوى بانتظار الإدارة.</div> : null}
        {visibleComments.map((comment) => {
          const meta = adminContentCommentStatusMeta[comment.status];
          return (
            <article key={comment.id} className="rounded-[18px] border bg-[#fffdf9] p-4" style={{ borderColor: uiColors.border }}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="font-display text-lg font-extrabold text-[#1D1916]">{comment.authorName}</h4>
                  <p className="mt-1 text-xs font-bold text-[#6E6258]">{comment.contentType === "news" ? "خبر" : "مقال"} · {comment.contentSlug} · {comment.createdAt}</p>
                </div>
                <StatusPill label={meta.label} tone={meta.tone} />
              </div>
              <p className="mt-3 text-sm font-bold leading-7 text-[#5f5953]">{comment.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <AdminManagementActionButton action="content_comment_status" entityId={comment.id} slug={comment.contentSlug} title={comment.authorName} status="approved" className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl bg-[#087342] px-3 text-xs font-extrabold text-white">اعتماد التعليق</AdminManagementActionButton>
                <AdminManagementActionButton action="content_comment_status" entityId={comment.id} slug={comment.contentSlug} title={comment.authorName} status="rejected" className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl border bg-white px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>رفض</AdminManagementActionButton>
                <AdminManagementActionButton action="content_comment_status" entityId={comment.id} slug={comment.contentSlug} title={comment.authorName} status="archived" className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl border bg-[#fff0eb] px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: "#efc5b9" }}>أرشفة</AdminManagementActionButton>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

async function AdminContentPage({ config, kind, status, searchParams = {} }: { config: DashboardRoleConfig; kind?: AdminContentKind; status?: AdminContentStatus; searchParams?: DashboardSearchParams }) {
  const contentResult = await listDashboardAdminContentItems();
  const commentsResult = await listDashboardAdminContentComments();
  const allRows = contentResult.data;
  const q = stringParam(searchParams, "q").trim();
  const sort = stringParam(searchParams, "sort").trim();
  const scopedRows = allRows.filter((row) => (!kind || row.kind === kind) && (!status || row.status === status));
  const matchedRows = scopedRows.filter((row) => matchesDashboardSearch(q, [row.id, row.slug, row.title, row.kind, row.typeLabel, row.status, adminContentStatusMeta[row.status].label, row.category, row.author, row.updatedAt, row.views]));
  const rows = [...matchedRows].sort((a, b) => {
    if (sort === "status") return adminContentStatusMeta[a.status].label.localeCompare(adminContentStatusMeta[b.status].label, "ar");
    if (sort === "category") return a.category.localeCompare(b.category, "ar");
    if (sort === "updated") return b.updatedAt.localeCompare(a.updatedAt, "ar");
    return 0;
  });
  const firstPageRef = rows.find((row) => row.kind === "page")?.slug || rows.find((row) => row.kind === "page")?.id || allRows.find((row) => row.kind === "page")?.slug || allRows.find((row) => row.kind === "page")?.id;
  const firstArticleRef = rows.find((row) => row.kind === "article")?.slug || rows.find((row) => row.kind === "article")?.id || allRows.find((row) => row.kind === "article")?.slug || allRows.find((row) => row.kind === "article")?.id;
  const pageDetailPath = firstPageRef ? `content/details?content=${encodeURIComponent(firstPageRef)}` : "content/details";
  const articleDetailPath = firstArticleRef ? `content/article-details?content=${encodeURIComponent(firstArticleRef)}` : "content/article-details";
  const pageEditPath = firstPageRef ? `content/edit-page?content=${encodeURIComponent(firstPageRef)}` : "content/edit-page";
  const articleEditPath = firstArticleRef ? `content/edit-article?content=${encodeURIComponent(firstArticleRef)}` : "content/edit-article";
  const title = kind === "article" ? "الأخبار والمقالات" : status === "published" ? "المحتوى المنشور" : status === "draft" ? "المسودات" : status === "review" ? "بانتظار المراجعة" : "جميع الصفحات";
  const activePath = kind === "article" ? "content/articles" : "content";
  return <div className="grid gap-5"><DashboardTopbar config={config} /><AdminContentHeader title={title} subtitle="إدارة صفحات الموقع والأخبار والمقالات وحالات النشر والتصنيفات والوسائط المرتبطة بالمحتوى." /><AdminContentKpis rows={allRows} activeKind={kind} activeStatus={status} /><AdminContentFilters title={title} q={q} sort={sort} activePath={activePath} /><AdminContentNav activePath={activePath} pageDetailPath={pageDetailPath} articleDetailPath={articleDetailPath} pageEditPath={pageEditPath} articleEditPath={articleEditPath} />{contentResult.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر الاتصال ببيانات المحتوى الحية، وتم عرض بيانات تجريبية مؤقتة.</section> : null}{commentsResult.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل تعليقات المحتوى الحية مؤقتاً.</section> : null}<AdminContentCommentsPanel comments={commentsResult.data} /><AdminContentTable rows={rows} /></div>;
}

async function AdminContentDetailsPage({ config, kind = "page", searchParams = {} }: { config: DashboardRoleConfig; kind?: AdminContentKind; searchParams?: DashboardSearchParams }) {
  const contentResult = await listDashboardAdminContentItems();
  const selectedContent = selectEntityByParam(contentResult.data, searchParams, "content", "id", "slug");
  const item = selectedContent ?? contentResult.data.find((row) => row.kind === kind) ?? contentResult.data[0] ?? adminContentRows[0];
  const meta = adminContentStatusMeta[item.status];
  const title = kind === "article" ? "تفاصيل خبر" : "تفاصيل الصفحة";
  return (
    <div className="grid gap-5">
      <DashboardTopbar config={config} />
      <AdminContentHeader title={title} subtitle="مراجعة بيانات المحتوى وحالة النشر والوسائط والإجراءات التحريرية." />
      <AdminContentNav activePath={kind === "article" ? "content/article-details" : "content/details"} pageDetailPath={item.kind === "page" ? `content/details?content=${encodeURIComponent(item.slug || item.id)}` : undefined} articleDetailPath={item.kind === "article" ? `content/article-details?content=${encodeURIComponent(item.slug || item.id)}` : undefined} pageEditPath={item.kind === "page" ? `content/edit-page?content=${encodeURIComponent(item.slug || item.id)}` : undefined} articleEditPath={item.kind === "article" ? `content/edit-article?content=${encodeURIComponent(item.slug || item.id)}` : undefined} />
      <section className="grid gap-5 lg:grid-cols-3">
        <aside className="grid content-start gap-4">
          <article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><h3 className="font-display text-xl font-extrabold text-[#1D1916]">إجراءات النشر</h3><div className="mt-4 grid gap-2"><AdminManagementActionButton action="content_status" entityId={item.id} slug={item.slug} title={item.title} status="published" className="min-h-11 rounded-xl px-4 text-sm font-extrabold text-white" style={{ backgroundColor: "#087342" }}>نشر المحتوى</AdminManagementActionButton><AdminManagementActionButton action="content_status" entityId={item.id} slug={item.slug} title={item.title} status="draft" className="min-h-11 rounded-xl border bg-white px-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>حفظ كمسودة</AdminManagementActionButton><AdminManagementActionButton action="content_status" entityId={item.id} slug={item.slug} title={item.title} status="archived" className="min-h-11 rounded-xl border bg-[#fff0eb] px-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#efc5b9" }}>إلغاء النشر</AdminManagementActionButton></div></article>
          <article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><h3 className="font-display text-xl font-extrabold text-[#1D1916]">جاهزية المحتوى</h3>{["العنوان", "الرابط", "SEO", "الصورة الرئيسية"].map((check, index) => <div key={check} className="flex items-center justify-between border-b py-3 last:border-b-0" style={{ borderColor: uiColors.border }}><span className="text-sm font-extrabold text-[#1D1916]">{check}</span><StatusPill label={index < 3 ? "مكتمل" : "مراجعة"} tone={index < 3 ? "green" : "gold"} /></div>)}</article>
        </aside>
        <article className="rounded-[22px] border bg-white p-5 shadow-card lg:col-span-2" style={{ borderColor: uiColors.border }}>
          <StatusPill label={meta.label} tone={meta.tone} />
          <h2 className="mt-4 font-display text-3xl font-extrabold text-[#1D1916]">{item.title}</h2>
          <p className="mt-3 text-sm font-bold leading-8 text-[#5f5953]">محتوى {item.typeLabel} ضمن منصة مهابة، قابل للإدارة من ناحية النشر والتصنيف والوسائط وتحسين الظهور.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-4">{[["رقم المحتوى", item.id], ["النوع", item.typeLabel], ["التصنيف", item.category], ["المحرر", item.author], ["المشاهدات", item.views], ["آخر تحديث", item.updatedAt], ["الرابط", kind === "article" ? "/media/market-update" : "/about"], ["لغة المحتوى", "العربية"]].map(([label, value]) => <div key={label} className={cn("rounded-xl border bg-[#fffdf9] p-3", label === "الرابط" ? "md:col-span-2" : "")} style={{ borderColor: uiColors.border }}><p className="text-xs font-bold text-[#6E6258]">{label}</p><p className="mt-1 break-words text-sm font-extrabold text-[#1D1916]">{value}</p></div>)}</div>
        </article>
      </section>
    </div>
  );
}

async function AdminContentFormPage({ config, kind, mode, actor, searchParams = {} }: { config: DashboardRoleConfig; kind: AdminContentKind; mode: "add" | "edit"; actor?: DashboardActorContext | null; searchParams?: DashboardSearchParams }) {
  const editing = mode === "edit";
  const contentResult = await listDashboardAdminContentItems();
  const selectedContent = selectEntityByParam(contentResult.data, searchParams, "content", "id", "slug");
  const item = (editing && selectedContent?.kind === kind ? selectedContent : undefined) ?? contentResult.data.find((row) => row.kind === kind) ?? contentResult.data[0] ?? adminContentRows[0];
  const title = kind === "article" ? (editing ? "تعديل خبر" : "إضافة خبر") : (editing ? "تعديل صفحة" : "إضافة صفحة");
  const contentUploadReference = editing && item.id ? item.id : stableDashboardFormReference("admin", `content-${kind}`, actor, stringParam(searchParams, "draft") || item.slug || kind);
  const savePayload = { title: editing ? item.title : "محتوى جديد", slug: editing ? item.slug : undefined, kind, category: editing ? item.category : "صفحات الموقع", author: editing ? item.author : "فريق المحتوى", excerpt: "ملخص قصير يظهر في البطاقات ونتائج البحث داخل المنصة.", seo: "مهابة، عقار، مساهمات", formReference: editing ? undefined : contentUploadReference };
  const contentFields = [
    ["العنوان", "title", editing ? item.title : ""],
    ["الرابط", "slug", editing ? item.slug : ""],
    ["التصنيف", "category", editing ? item.category : ""],
    ["المحرر", "author", editing ? item.author : ""],
    ["وسم SEO", "seo", editing ? "مهابة، عقار، مساهمات" : ""],
  ];
  return (
    <div className="grid gap-5">
      <DashboardTopbar config={config} />
      <AdminContentHeader title={title} subtitle="إدارة بيانات المحتوى الأساسية وحالة النشر ومعلومات الظهور في محركات البحث." />
      <AdminContentNav activePath={kind === "article" ? (editing ? "content/edit-article" : "content/add-article") : (editing ? "content/edit-page" : "content/add-page")} pageDetailPath={item.kind === "page" ? `content/details?content=${encodeURIComponent(item.slug || item.id)}` : undefined} articleDetailPath={item.kind === "article" ? `content/article-details?content=${encodeURIComponent(item.slug || item.id)}` : undefined} pageEditPath={item.kind === "page" ? `content/edit-page?content=${encodeURIComponent(item.slug || item.id)}` : undefined} articleEditPath={item.kind === "article" ? `content/edit-article?content=${encodeURIComponent(item.slug || item.id)}` : undefined} />
      <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <form className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}>
          <h2 className="font-display text-xl font-extrabold text-[#1D1916]">بيانات المحتوى</h2>
          <input type="hidden" name="kind" value={kind} />
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {contentFields.map(([label, name, value]) => (
              <label key={name} className="grid gap-2 text-sm font-extrabold text-[#1D1916]">
                {label}
                <input name={name} defaultValue={value} className="h-12 rounded-xl border bg-[#fffdf9] px-4 text-sm outline-none focus:border-[#A7815E]" style={{ borderColor: uiColors.border }} placeholder={`أدخل ${label}`} />
              </label>
            ))}
            <label className="grid gap-2 text-sm font-extrabold text-[#1D1916]">
              حالة النشر
              <select name="status" defaultValue={editing ? item.status : "draft"} className="h-12 rounded-xl border bg-[#fffdf9] px-4 text-sm outline-none focus:border-[#A7815E]" style={{ borderColor: uiColors.border }}>
                <option value="draft">مسودة</option>
                <option value="review">قيد المراجعة</option>
                <option value="published">منشور</option>
                <option value="archived">مؤرشف</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-extrabold text-[#1D1916] md:col-span-2">
              ملخص المحتوى
              <textarea name="excerpt" defaultValue={editing ? "ملخص قصير يظهر في البطاقات ونتائج البحث داخل المنصة." : ""} className="min-h-28 rounded-xl border bg-[#fffdf9] p-4 text-sm outline-none focus:border-[#A7815E]" style={{ borderColor: uiColors.border }} placeholder="اكتب ملخص المحتوى" />
            </label>
            <label className="grid gap-2 text-sm font-extrabold text-[#1D1916] md:col-span-2">
              نص المحتوى
              <textarea name="body" defaultValue={editing ? "محتوى قابل للتحرير من لوحة الإدارة." : ""} className="min-h-36 rounded-xl border bg-[#fffdf9] p-4 text-sm outline-none focus:border-[#A7815E]" style={{ borderColor: uiColors.border }} placeholder="اكتب نص المحتوى" />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <AdminManagementActionButton action="content_save" entityId={editing ? item.id : undefined} slug={editing ? item.slug : undefined} title={savePayload.title} status={editing ? item.status : "draft"} payload={savePayload} className="min-h-11 rounded-xl bg-[#A7815E] px-6 text-sm font-extrabold text-white">{editing ? "حفظ التعديلات" : "إضافة المحتوى"}</AdminManagementActionButton>
            <Link href={dashboardHref("admin", kind === "article" ? "content/articles" : "content")} className="inline-flex min-h-11 items-center justify-center rounded-xl border bg-white px-6 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إلغاء</Link>
          </div>
        </form>
        <aside className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}>
          <UploadCloud className="h-8 w-8 text-[#A7815E]" />
          <h3 className="mt-3 font-display text-xl font-extrabold text-[#1D1916]">الصورة الرئيسية</h3>
          <p className="mt-2 text-sm font-bold leading-7 text-[#6E6258]">اختر صورة متوافقة مع هوية مهابة وتظهر في البطاقات والبنرات.</p>
          <DashboardDocumentUploadButton scope="admin" entityType="content_image" entityId={contentUploadReference} label="الصورة الرئيسية" className="mt-4 inline-flex min-h-10 cursor-pointer items-center justify-center rounded-xl border px-4 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>رفع صورة</DashboardDocumentUploadButton>
        </aside>
      </section>
    </div>
  );
}

async function AdminContentCardsPage({ config, type }: { config: DashboardRoleConfig; type: "categories" | "media" | "banners" | "faq" | "partners" }) {
  const map = {
    categories: { title: "التصنيفات", subtitle: "إدارة تصنيفات الصفحات والأخبار والمقالات.", active: "content/categories", kind: "category" as DashboardAdminContentKind, items: ["أخبار السوق", "مقالات", "حوكمة", "خدمات عقارية", "سياسات", "مساعدة"], icon: Tag, cta: "حفظ التصنيف" },
    media: { title: "الوسائط", subtitle: "إدارة الصور والملفات المستخدمة في صفحات الموقع والمقالات.", active: "content/media", kind: "media" as DashboardAdminContentKind, items: ["صورة الصفحة الرئيسية", "صورة عن مهابة", "دليل الاستثمار PDF", "صورة مقال السوق", "أيقونة خدمة", "ملف تعريفي"], icon: UploadCloud, cta: "حفظ الملف" },
    banners: { title: "البنرات", subtitle: "إدارة بنرات الصفحة الرئيسية والصفحات الداخلية وحالة عرضها.", active: "content/banners", kind: "banner" as DashboardAdminContentKind, items: ["بنر الرئيسية", "بنر الخدمات", "بنر المساهمات", "بنر الأخبار", "بنر الشركاء", "بنر التواصل"], icon: LayoutIcon, cta: "حفظ البنر" },
    faq: { title: "الأسئلة الشائعة", subtitle: "إدارة الأسئلة والأجوبة المعروضة للمستخدمين.", active: "content/faq", kind: "faq" as DashboardAdminContentKind, items: ["كيف أضيف أصل؟", "كيف تتم المراجعة؟", "ما هي المساهمات؟", "طرق الدفع", "التوثيق", "الدعم الفني"], icon: MessageSquare, cta: "حفظ السؤال" },
    partners: { title: "الشركاء", subtitle: "إدارة شعارات وبيانات الشركاء وترتيب ظهورهم.", active: "content/partners", kind: "partner" as DashboardAdminContentKind, items: ["شركة البناء المتطور", "رواسي العقارية", "مدار للاستثمار", "أفق للتطوير", "وثق للخدمات", "الدار العقارية"], icon: Users, cta: "حفظ الشريك" },
  }[type];
  const cardSlug = (title: string) => `admin-${type}-${settingsFieldName(title)}`;
  const contentResult = await listDashboardAdminContentItems();
  const liveRows = contentResult.data.filter((row) => row.kind === map.kind);
  const cards = liveRows.length
    ? liveRows.map((row) => ({ key: row.id, title: row.title, subtitle: row.category, status: row.status, updatedAt: row.updatedAt, row }))
    : map.items.map((item, index) => ({ key: item, title: item, subtitle: type === "media" ? "وسيط غير محفوظ بعد" : `${index + 2} عناصر مرتبطة`, status: "review" as DashboardAdminContentStatus, updatedAt: null as string | null, row: null, order: index + 1, slug: cardSlug(item) }));
  const CardIcon = map.icon;
  return <div className="grid gap-5"><DashboardTopbar config={config} /><AdminContentHeader title={map.title} subtitle={map.subtitle} /><AdminContentNav activePath={map.active} />{contentResult.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل عناصر المحتوى الحية، وتم عرض عناصر قابلة للحفظ.</section> : null}<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{cards.map((card) => { const meta = adminContentStatusMeta[card.status]; return <article key={card.key} className="rounded-[20px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><div className="flex items-start justify-between gap-4"><CardIcon className="h-7 w-7 text-[#A7815E]" /><StatusPill label={meta.label} tone={meta.tone} /></div><h3 className="mt-4 font-display text-xl font-extrabold text-[#1D1916]">{card.title}</h3><p className="mt-2 text-sm font-bold leading-7 text-[#6E6258]">{card.row ? `آخر تحديث: ${card.updatedAt}` : card.subtitle}</p><div className="mt-4 flex flex-wrap gap-2">{card.row ? <><AdminManagementActionButton action="content_status" entityId={card.row.id} slug={card.row.slug} title={card.row.title} status="published" className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl bg-[#087342] px-3 text-xs font-extrabold text-white">نشر</AdminManagementActionButton><AdminManagementActionButton action="content_status" entityId={card.row.id} slug={card.row.slug} title={card.row.title} status="archived" className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl border bg-white px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>أرشفة</AdminManagementActionButton></> : <AdminManagementActionButton action="content_save" slug={card.slug} title={card.title} status="draft" payload={{ slug: card.slug, title: card.title, kind: map.kind, category: map.title, section: type, order: card.order, excerpt: card.subtitle, body: `${map.title}: ${card.title}` }} className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl border px-4 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>{map.cta}</AdminManagementActionButton>}</div></article>; })}</section></div>;
}

const LayoutIcon = BriefcaseBusiness;

const adminPlanRows = [
  { name: "الباقة الأساسية", description: "باقة مناسبة للأفراد لعرض الأصول العقارية الأساسية.", price: "200.00 ريال سعودي / شهر", duration: "شهر واحد", features: 5, subscribers: 450, active: true },
  { name: "الباقة الاحترافية", description: "باقة متقدمة تناسب المستثمرين وأصحاب المحافظ.", price: "500.00 ريال سعودي / شهر", duration: "3 أشهر", features: 12, subscribers: 320, active: true },
  { name: "الباقة المميزة", description: "جميع المميزات مع دعم أولوية وتقارير متقدمة.", price: "1,000.00 ريال سعودي / شهر", duration: "6 أشهر", features: 20, subscribers: 200, active: true },
  { name: "الباقة السنوية", description: "باقة سنوية مع خصم خاص للمشتركين.", price: "2,000.00 ريال سعودي / سنة", duration: "سنة واحدة", features: 20, subscribers: 100, active: true },
  { name: "باقة المؤسسات", description: "حلول متكاملة للشركات والمؤسسات العقارية.", price: "5,000.00 ريال سعودي / شهر", duration: "شهر واحد", features: 30, subscribers: 40, active: false },
  { name: "باقة مخصصة", description: "باقة مخصصة حسب احتياجات العميل.", price: "تواصل معنا", duration: "-", features: 0, subscribers: 10, active: false },
];

type AdminRevenueSource = {
  label: string;
  value: number;
  pct: string;
  pctNumber: number;
  color: string;
};

type AdminRevenuePoint = {
  label: string;
  value: number;
};

type AdminRevenueMetrics = {
  payments: DashboardPayment[];
  totalRevenue: number;
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  growthPct: number;
  sources: AdminRevenueSource[];
  series: AdminRevenuePoint[];
};

const revenueSourceDefinitions = [
  { key: "subscriptions", label: "الاشتراكات", color: "#B4542E" },
  { key: "services", label: "الخدمات العقارية", color: "#78C6AD" },
  { key: "verification", label: "رسوم التوثيق", color: "#8E84C9" },
  { key: "other", label: "رسوم إضافية", color: "#C8869A" },
] as const;

function AdminFinanceHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="relative overflow-hidden rounded-[24px] border bg-white p-5 shadow-card md:p-6" style={{ borderColor: uiColors.border }}>
      <Image src="/images/about-lobby.png" alt="" fill className="object-cover opacity-[0.12] grayscale-[12%] sepia-[12%]" sizes="80vw" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <StatusPill label="المالية" tone="gold" />
          <h1 className="mt-3 font-display text-3xl font-extrabold text-[#1D1916]">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-[#5f5953]">{subtitle}</p>
        </div>
        <Link href={dashboardHref("admin")} className="inline-flex min-h-11 items-center justify-center rounded-xl border bg-white px-5 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>العودة إلى القائمة الرئيسية</Link>
      </div>
    </section>
  );
}

function AdminFinanceNav({ activePath, invoiceDetailPath = "billing/details", paymentDetailPath = "payments/details" }: { activePath: string; invoiceDetailPath?: string; paymentDetailPath?: string }) {
  const items = [
    { label: "الفواتير", path: "billing", active: "billing" },
    { label: "تفاصيل الفاتورة", path: invoiceDetailPath, active: "billing/details" },
    { label: "المدفوعات", path: "payments", active: "payments" },
    { label: "تفاصيل عملية الدفع", path: paymentDetailPath, active: "payments/details" },
    { label: "الاشتراكات", path: "subscriptions", active: "subscriptions" },
    { label: "الباقات", path: "plans", active: "plans" },
    { label: "الإيرادات", path: "revenue", active: "revenue" },
  ];
  return <section className="flex flex-wrap gap-2">{items.map((item) => <Link key={item.active} href={dashboardHref("admin", item.path)} className={cn("inline-flex min-h-10 items-center justify-center rounded-xl border px-4 text-sm font-extrabold", activePath === item.active ? "bg-[#A7815E] text-white" : "bg-white text-[#1D1916]")} style={{ borderColor: activePath === item.active ? "#A7815E" : uiColors.border }}>{item.label}</Link>)}</section>;
}

function AdminFinanceKpis({ cards }: { cards: { label: string; value: string; unit: string; icon: string; tone: TrendTone }[] }) {
  return <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{cards.map((card) => { const tone = toneStyles[card.tone]; return <article key={card.label} className="rounded-[18px] border bg-white p-4 text-right shadow-card" style={{ borderColor: uiColors.border }}><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-extrabold text-[#5f5953]">{card.label}</p><strong className="mt-2 block font-display text-3xl font-extrabold text-[#1D1916]">{card.value}</strong><span className="text-xs font-bold text-[#6E6258]">{card.unit}</span></div><span className="grid h-12 w-12 place-items-center rounded-full border" style={{ backgroundColor: tone.bg, borderColor: tone.border, color: tone.text }}><Icon name={card.icon} className="h-6 w-6" /></span></div></article>; })}</section>;
}

function AdminFinanceFilters({
  search,
  activePath,
  q,
  status,
  primary,
  primaryHref,
  exportRows,
  exportFilename = "mahabah-admin-finance.csv",
  showStatusFilters = true,
}: {
  search: string;
  activePath: string;
  q: string;
  status: string;
  primary?: string;
  primaryHref?: string;
  exportRows?: Array<Record<string, string | number | null | undefined>>;
  exportFilename?: string;
  showStatusFilters?: boolean;
}) {
  const statusFilters = [
    ["كل الحالات", undefined],
    ["مدفوعة", "paid"],
    ["معلقة", "pending"],
    ["فاشلة", "failed"],
  ] as const;
  return (
    <section className="rounded-[20px] border bg-white p-4 shadow-card" style={{ borderColor: uiColors.border }}>
      <div className="flex flex-wrap items-center gap-3">
        {primary && primaryHref ? <Link href={primaryHref} className="inline-flex h-12 shrink-0 items-center rounded-xl bg-[#A54118] px-5 text-sm font-extrabold text-white">{primary}</Link> : null}
        {primary && !primaryHref ? <Link href={dashboardHref("admin", "plans?new=1")} className="grid h-12 shrink-0 place-items-center rounded-xl bg-[#A54118] px-5 text-sm font-extrabold text-white">{primary}</Link> : null}
        <form action={dashboardHref("admin", activePath)} className="relative block min-w-[260px] flex-[1_1_320px]">
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6E6258]" />
          <input name="q" defaultValue={q} suppressHydrationWarning className="h-12 w-full rounded-xl border bg-[#fffdf9] pl-16 pr-12 text-sm font-bold outline-none focus:border-[#A7815E]" style={{ borderColor: uiColors.border }} placeholder={search} />
          <button type="submit" className="absolute left-2 top-1/2 h-8 -translate-y-1/2 rounded-lg bg-[#1D1916] px-3 text-xs font-extrabold text-white">بحث</button>
        </form>
        {showStatusFilters ? statusFilters.map(([filter, nextStatus]) => <Link key={filter} href={dashboardQueryHref("admin", activePath, { q, status: nextStatus })} className={cn("flex h-12 shrink-0 items-center justify-between rounded-xl border px-4 text-sm font-extrabold", status === nextStatus ? "bg-[#fbf3e9] text-[#8F6B4C]" : "bg-white text-[#1D1916]")} style={{ borderColor: status === nextStatus ? "#e3c8aa" : uiColors.border, width: "10rem" }}><span>{filter}</span><ChevronGlyph /></Link>) : null}
        {exportRows ? (
          <FinancialExportButton filename={exportFilename} rows={exportRows} className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border bg-white px-5 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }} children="تصدير" />
        ) : (
          <FinancialExportButton filename={exportFilename} rows={[]} className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border bg-white px-5 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }} children="تصدير" />
        )}
      </div>
    </section>
  );
}

function adminCustomerTypeLabel(type: DashboardInvoice["customerType"]) {
  if (type === "business") return "منشأة";
  if (type === "individual") return "فرد";
  return "منصة";
}

function adminSubscriptionTone(status: string): TrendTone {
  if (status === "active") return "green";
  if (status === "expired" || status === "cancelled") return "red";
  if (status === "pending") return "gold";
  return "blue";
}

function adminInvoicePaymentMethod(invoice: DashboardInvoice, payments: DashboardPayment[]) {
  const payment = payments.find((item) => item.invoiceId === invoice.id && item.status === "succeeded") ?? payments.find((item) => item.invoiceId === invoice.id);
  return payment ? paymentMethodLabel(payment.method) : "---";
}

function adminFinanceAmountTotal(rows: Array<{ amount: number }>) {
  return rows.reduce((total, row) => total + row.amount, 0);
}

function adminRevenuePaymentDate(payment: DashboardPayment) {
  const date = new Date(payment.paidAt ?? payment.createdAt);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function adminRevenueMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function adminRevenueSourceKey(payment: DashboardPayment): (typeof revenueSourceDefinitions)[number]["key"] {
  const normalized = normalizeDashboardSearch(`${payment.title} ${payment.invoiceNumber ?? ""} ${payment.method}`);
  if (normalized.includes("اشتراك") || normalized.includes("باقة") || normalized.includes("subscription") || normalized.includes("plan")) return "subscriptions";
  if (normalized.includes("خدمة") || normalized.includes("service") || normalized.includes("request")) return "services";
  if (normalized.includes("توثيق") || normalized.includes("شارة") || normalized.includes("verification") || normalized.includes("badge")) return "verification";
  return "other";
}

function buildAdminRevenueMetrics(financial: DashboardFinancialData): AdminRevenueMetrics {
  const payments = financial.payments.filter((payment) => payment.status === "succeeded" && payment.amount > 0);
  const today = new Date();
  const currentMonthKey = adminRevenueMonthKey(today);
  const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const previousMonthKey = adminRevenueMonthKey(previousMonth);
  const sourceTotals = new Map<string, number>();
  const monthTotals = new Map<string, number>();

  for (const payment of payments) {
    const paymentDate = adminRevenuePaymentDate(payment);
    const monthKey = adminRevenueMonthKey(paymentDate);
    const sourceKey = adminRevenueSourceKey(payment);
    sourceTotals.set(sourceKey, (sourceTotals.get(sourceKey) ?? 0) + payment.amount);
    monthTotals.set(monthKey, (monthTotals.get(monthKey) ?? 0) + payment.amount);
  }

  const totalRevenue = adminFinanceAmountTotal(payments);
  const sources = revenueSourceDefinitions.map((source) => {
    const value = sourceTotals.get(source.key) ?? 0;
    const pctNumber = totalRevenue > 0 ? (value / totalRevenue) * 100 : 0;
    return { label: source.label, value, pct: `${pctNumber.toFixed(1)}%`, pctNumber, color: source.color };
  });
  const series = Array.from({ length: 11 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (10 - index), 1);
    return {
      label: new Intl.DateTimeFormat("ar-SA", { month: "short", year: "numeric" }).format(date),
      value: monthTotals.get(adminRevenueMonthKey(date)) ?? 0,
    };
  });

  const currentMonthRevenue = monthTotals.get(currentMonthKey) ?? 0;
  const previousMonthRevenue = monthTotals.get(previousMonthKey) ?? 0;
  const growthPct = previousMonthRevenue > 0 ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 : currentMonthRevenue > 0 ? 100 : 0;

  return { payments, totalRevenue, currentMonthRevenue, previousMonthRevenue, growthPct, sources, series };
}

function matchesAdminFinanceStatus(status: string, label: string, statusParam: string) {
  if (!statusParam) return true;
  const normalized = normalizeDashboardSearch(`${status} ${label}`);
  const groups: Record<string, string[]> = {
    paid: ["paid", "succeeded", "active", "مدفوعة", "ناجحة", "نشط"],
    pending: ["pending", "due", "draft", "معلقة", "مستحقة", "مسودة", "قيد"],
    failed: ["failed", "overdue", "cancelled", "refunded", "فاشلة", "متأخرة", "ملغاة", "مستردة", "منتهية"],
  };
  return (groups[statusParam] ?? [statusParam]).some((item) => normalized.includes(normalizeDashboardSearch(item)));
}

function filterAdminInvoices(rows: DashboardInvoice[], q: string, status: string, payments: DashboardPayment[]) {
  return rows.filter((invoice) => matchesDashboardSearch(q, [invoice.id, invoice.invoiceNumber, invoice.customer, adminCustomerTypeLabel(invoice.customerType), invoice.title, invoice.amount, invoice.status, invoice.statusLabel, invoice.issuedAt, invoice.dueDate, adminInvoicePaymentMethod(invoice, payments)]) && matchesAdminFinanceStatus(invoice.status, invoice.statusLabel, status));
}

function filterAdminPayments(rows: DashboardPayment[], q: string, status: string) {
  return rows.filter((payment) => matchesDashboardSearch(q, [payment.id, payment.providerReference, payment.invoiceId, payment.invoiceNumber, payment.customer, adminCustomerTypeLabel(payment.customerType), payment.title, payment.amount, payment.method, paymentMethodLabel(payment.method), payment.status, payment.statusLabel, payment.createdAt, payment.paidAt]) && matchesAdminFinanceStatus(payment.status, payment.statusLabel, status));
}

function filterAdminSubscriptions(rows: DashboardSubscription[], q: string, status: string) {
  return rows.filter((subscription) => matchesDashboardSearch(q, [subscription.id, subscription.customer, adminCustomerTypeLabel(subscription.customerType), subscription.planName, subscription.amount, subscription.status, subscription.statusLabel, subscription.startsAt, subscription.endsAt, subscription.daysRemaining]) && matchesAdminFinanceStatus(subscription.status, subscription.statusLabel, status));
}

function adminPlanSettingKey(name: string) {
  return `subscription-plan-${normalizeDashboardSearch(name).replaceAll(" ", "-") || "new"}`;
}

type AdminPlanRow = (typeof adminPlanRows)[number] & {
  settingKey: string;
  revenue: number;
  source: "configured" | "supabase" | "settings";
};

function adminPlanValue(setting: DashboardPlatformSetting) {
  if (!setting.value || typeof setting.value !== "object" || Array.isArray(setting.value)) return null;
  const value = setting.value as Record<string, unknown>;
  if (value.section !== "subscription_plans") return null;
  const title = typeof value.title === "string" && value.title.trim() ? value.title.trim() : typeof value.name === "string" && value.name.trim() ? value.name.trim() : "";
  if (!title) return null;
  const features = typeof value.features === "number" ? value.features : typeof value.features === "string" ? Number(value.features) : 0;
  return {
    key: setting.key,
    name: title,
    description: typeof value.description === "string" && value.description.trim() ? value.description.trim() : "باقة محفوظة من لوحة الإدارة.",
    price: typeof value.price === "string" && value.price.trim() ? value.price.trim() : "تواصل معنا",
    duration: typeof value.duration === "string" && value.duration.trim() ? value.duration.trim() : "-",
    features: Number.isFinite(features) ? Number(features) : 0,
    active: typeof value.active === "boolean" ? value.active : true,
  };
}

function buildAdminPlanRows(financial: DashboardFinancialData, settings: DashboardPlatformSetting[] = []): AdminPlanRow[] {
  const savedPlans = settings.map(adminPlanValue).filter((plan): plan is NonNullable<ReturnType<typeof adminPlanValue>> => Boolean(plan));
  const savedPlanMap = new Map(savedPlans.map((plan) => [normalizeDashboardSearch(plan.name), plan]));
  const usedPlanNames = new Set<string>();
  const rows: AdminPlanRow[] = adminPlanRows.map((row) => {
    const savedPlan = savedPlanMap.get(normalizeDashboardSearch(row.name));
    const matchingSubscriptions = financial.subscriptions.filter((subscription) => normalizeDashboardSearch(subscription.planName) === normalizeDashboardSearch(row.name));
    matchingSubscriptions.forEach((subscription) => usedPlanNames.add(normalizeDashboardSearch(subscription.planName)));
    return {
      ...row,
      ...(savedPlan ? { description: savedPlan.description, price: savedPlan.price, duration: savedPlan.duration, features: savedPlan.features, active: savedPlan.active } : {}),
      settingKey: savedPlan?.key ?? adminPlanSettingKey(row.name),
      subscribers: financial.source === "supabase" ? matchingSubscriptions.length : row.subscribers,
      revenue: adminFinanceAmountTotal(matchingSubscriptions),
      active: savedPlan ? savedPlan.active : row.active || matchingSubscriptions.some((subscription) => subscription.status === "active"),
      source: savedPlan ? "settings" : matchingSubscriptions.length > 0 ? "supabase" : "configured",
    };
  });
  const extraRows = financial.subscriptions
    .filter((subscription) => !usedPlanNames.has(normalizeDashboardSearch(subscription.planName)))
    .reduce<Array<(typeof rows)[number]>>((collection, subscription) => {
      const existing = collection.find((row) => normalizeDashboardSearch(row.name) === normalizeDashboardSearch(subscription.planName));
      if (existing) {
        existing.subscribers += 1;
        existing.revenue += subscription.amount;
        existing.active = existing.active || subscription.status === "active";
        return collection;
      }
      collection.push({
        settingKey: adminPlanSettingKey(subscription.planName),
        name: subscription.planName,
        description: "باقة مضافة من بيانات الاشتراكات الحية.",
        price: formatSar(subscription.amount),
        duration: `${subscription.daysRemaining} يوم متبق`,
        features: 0,
        subscribers: 1,
        active: subscription.status === "active",
        revenue: subscription.amount,
        source: "supabase",
      });
      return collection;
    }, []);
  const extraSavedRows: AdminPlanRow[] = savedPlans
    .filter((plan) => !rows.some((row) => normalizeDashboardSearch(row.name) === normalizeDashboardSearch(plan.name)) && !extraRows.some((row) => normalizeDashboardSearch(row.name) === normalizeDashboardSearch(plan.name)))
    .map((plan) => ({
      settingKey: plan.key,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      duration: plan.duration,
      features: plan.features,
      subscribers: 0,
      active: plan.active,
      revenue: 0,
      source: "settings",
    }));
  return [...rows, ...extraRows, ...extraSavedRows];
}

async function AdminInvoicesPage({ config, searchParams = {} }: { config: DashboardRoleConfig; searchParams?: DashboardSearchParams }) {
  const financial = await listDashboardFinancial("admin");
  const q = stringParam(searchParams, "q").trim();
  const status = stringParam(searchParams, "status").trim();
  const invoices = filterAdminInvoices(financial.invoices, q, status, financial.payments);
  const totalAmount = adminFinanceAmountTotal(invoices);
  const firstInvoiceRef = invoices[0]?.invoiceNumber || invoices[0]?.id || financial.invoices[0]?.invoiceNumber || financial.invoices[0]?.id;
  const firstPaymentRef = financial.payments[0]?.providerReference || financial.payments[0]?.id;
  const invoiceDetailPath = firstInvoiceRef ? `billing/details?invoice=${encodeURIComponent(firstInvoiceRef)}` : "billing/details";
  const paymentDetailPath = firstPaymentRef ? `payments/details?payment=${encodeURIComponent(firstPaymentRef)}` : "payments/details";
  return <div className="grid gap-5"><DashboardTopbar config={config} /><AdminFinanceHeader title="الفواتير" subtitle="إدارة فواتير المنصة وحالات الدفع والاستحقاق والتصدير." /><AdminFinanceKpis cards={[{ label: "إجمالي الفواتير", value: String(invoices.length), unit: "فاتورة", icon: "receipt", tone: "gold" }, { label: "المبلغ الإجمالي", value: formatSar(totalAmount), unit: "ريال سعودي", icon: "circle-dollar", tone: "gold" }, { label: "الفواتير المدفوعة", value: String(invoices.filter((invoice) => invoice.status === "paid").length), unit: "فاتورة", icon: "shield", tone: "green" }, { label: "الفواتير المستحقة", value: String(invoices.filter((invoice) => invoice.status === "due" || invoice.status === "overdue").length), unit: "فاتورة", icon: "clock", tone: "red" }]} /><AdminFinanceFilters search="البحث برقم الفاتورة أو العميل..." activePath="billing" q={q} status={status} exportRows={financeExportRows({ ...financial, invoices, payments: [] })} exportFilename="mahabah-admin-invoices.csv" /><AdminFinanceNav activePath="billing" invoiceDetailPath={invoiceDetailPath} paymentDetailPath={paymentDetailPath} /><section className="overflow-hidden rounded-[22px] border bg-white shadow-card" style={{ borderColor: uiColors.border }}><div className="overflow-x-auto"><table className="w-full border-collapse text-right text-sm" style={{ minWidth: 1180 }}><thead><tr className="bg-[#f4ede5] text-xs font-extrabold text-[#5f5953]">{["رقم الفاتورة", "العميل", "نوع الحساب", "تاريخ الإصدار", "تاريخ الاستحقاق", "المبلغ", "الحالة", "طريقة الدفع", "الإجراءات"].map((header) => <th key={header} className="px-4 py-3 font-extrabold">{header}</th>)}</tr></thead><tbody>{invoices.length === 0 ? <tr><td colSpan={9} className="px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد فواتير مطابقة للبحث الحالي.</td></tr> : null}{invoices.map((invoice) => <tr key={invoice.id} className="border-b last:border-b-0" style={{ borderColor: uiColors.border }}><td className="px-4 py-4 font-bold text-[#1D1916]">{invoice.invoiceNumber}</td><td className="px-4 py-4 font-bold text-[#1D1916]">{invoice.customer}<small className="mt-1 block text-xs font-bold text-[#6E6258]">{invoice.title}</small></td><td className="px-4 py-4 font-bold text-[#6E6258]">{adminCustomerTypeLabel(invoice.customerType)}</td><td className="px-4 py-4 font-bold text-[#6E6258]">{formatDashboardDate(invoice.issuedAt)}</td><td className="px-4 py-4 font-bold text-[#6E6258]">{formatDashboardDate(invoice.dueDate)}</td><td className="px-4 py-4 font-bold text-[#1D1916]">{formatSar(invoice.amount)}</td><td className="px-4 py-4"><StatusPill label={invoice.statusLabel} tone={invoice.tone} /></td><td className="px-4 py-4 font-bold text-[#6E6258]">{adminInvoicePaymentMethod(invoice, financial.payments)}</td><td className="px-4 py-4"><div className="flex flex-wrap gap-2"><Link href={dashboardHref("admin", `billing/details?invoice=${encodeURIComponent(invoice.invoiceNumber || invoice.id)}`)} className="inline-flex min-h-10 items-center rounded-xl border px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>عرض</Link>{invoice.status !== "paid" ? <AdminManagementActionButton action="invoice_status" entityId={invoice.id} slug={invoice.invoiceNumber} title={invoice.title} payload={{ status: "paid" }} collectFormValues={false} className="inline-flex min-h-10 items-center rounded-xl bg-[#087342] px-3 text-xs font-extrabold text-white">تحصيل</AdminManagementActionButton> : null}{invoice.status !== "cancelled" ? <AdminManagementActionButton action="invoice_status" entityId={invoice.id} slug={invoice.invoiceNumber} title={invoice.title} payload={{ status: "cancelled" }} collectFormValues={false} className="inline-flex min-h-10 items-center rounded-xl border bg-white px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إلغاء</AdminManagementActionButton> : null}</div></td></tr>)}</tbody></table></div></section></div>;
}

async function AdminInvoiceDetailsPage({ config, searchParams = {} }: { config: DashboardRoleConfig; searchParams?: DashboardSearchParams }) {
  const financial = await listDashboardFinancial("admin");
  const selectedInvoiceRef = stringParam(searchParams, "invoice");
  const invoice = selectedInvoiceRef ? financial.invoices.find((item) => item.id === selectedInvoiceRef || item.invoiceNumber === selectedInvoiceRef) ?? financial.invoices[0] : financial.invoices[0];
  const method = invoice ? adminInvoicePaymentMethod(invoice, financial.payments) : "---";
  return <div className="grid gap-5"><DashboardTopbar config={config} /><AdminFinanceHeader title="تفاصيل الفاتورة" subtitle="عرض ملخص الفاتورة ومعلومات العميل والتفاصيل الضريبية والإجراءات." /><AdminFinanceNav activePath="billing/details" />{invoice ? <><section className="grid gap-4 lg:grid-cols-3"><article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><StatusPill label={invoice.statusLabel} tone={invoice.tone} /><h2 className="mt-4 font-display text-3xl font-extrabold text-[#1D1916]">{formatSar(invoice.amount)}</h2><p className="mt-1 text-sm font-bold text-[#6E6258]">ملخص الفاتورة</p><FinanceFacts facts={[["المبلغ الأساسي", formatSar(invoice.amount / 1.15)], ["ضريبة القيمة المضافة (15%)", formatSar(invoice.amount - invoice.amount / 1.15)], ["المبلغ الإجمالي", formatSar(invoice.amount)]]} /></article><article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><h3 className="font-display text-xl font-extrabold text-[#1D1916]">معلومات العميل</h3><FinanceFacts facts={[["اسم العميل", invoice.customer], ["نوع العميل", adminCustomerTypeLabel(invoice.customerType)], ["مصدر البيانات", financial.source === "supabase" ? "Supabase" : "بيانات تجريبية"], ["حالة الحساب", invoice.customerType === "business" ? "منشأة" : "فرد"]]} /></article><article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><h3 className="font-display text-xl font-extrabold text-[#1D1916]">معلومات الفاتورة</h3><FinanceFacts facts={[["رقم الفاتورة", invoice.invoiceNumber], ["نوع الفاتورة", invoice.title], ["تاريخ الإصدار", formatDashboardDate(invoice.issuedAt)], ["تاريخ الاستحقاق", formatDashboardDate(invoice.dueDate)], ["طريقة الدفع", method], ["رقم المرجع", invoice.id]]} /></article></section><FinanceBreakdown title={invoice.title} amount={invoice.amount} /><FinanceActions primaryHref={dashboardQueryHref("admin", "payments", { q: invoice.invoiceNumber || invoice.customer })} primary="عرض المدفوعات" secondary="تحميل CSV" dangerHref={dashboardQueryHref("admin", "billing", { q: invoice.invoiceNumber || invoice.customer })} danger="رجوع للفواتير" rows={[{ invoiceNumber: invoice.invoiceNumber, customer: invoice.customer, title: invoice.title, amount: invoice.amount, status: invoice.statusLabel }]} /></> : <section className="rounded-[22px] border bg-white p-8 text-center text-sm font-extrabold text-[#6E6258]" style={{ borderColor: uiColors.border }}>لا توجد فواتير لعرض تفاصيلها.</section>}</div>;
}

async function AdminPaymentsPage({ config, searchParams = {} }: { config: DashboardRoleConfig; searchParams?: DashboardSearchParams }) {
  const financial = await listDashboardFinancial("admin");
  const q = stringParam(searchParams, "q").trim();
  const status = stringParam(searchParams, "status").trim();
  const payments = filterAdminPayments(financial.payments, q, status);
  const succeeded = payments.filter((payment) => payment.status === "succeeded").length;
  const pending = payments.filter((payment) => payment.status === "pending").length;
  const failed = payments.filter((payment) => payment.status === "failed").length;
  const firstInvoiceRef = financial.invoices[0]?.invoiceNumber || financial.invoices[0]?.id;
  const firstPaymentRef = payments[0]?.providerReference || payments[0]?.id || financial.payments[0]?.providerReference || financial.payments[0]?.id;
  const invoiceDetailPath = firstInvoiceRef ? `billing/details?invoice=${encodeURIComponent(firstInvoiceRef)}` : "billing/details";
  const paymentDetailPath = firstPaymentRef ? `payments/details?payment=${encodeURIComponent(firstPaymentRef)}` : "payments/details";
  return <div className="grid gap-5"><DashboardTopbar config={config} /><AdminFinanceHeader title="المدفوعات" subtitle="متابعة عمليات الدفع الناجحة والمعلقة والفاشلة وطرق الدفع المستخدمة." /><AdminFinanceKpis cards={[{ label: "إجمالي المدفوعات", value: formatSar(adminFinanceAmountTotal(payments)), unit: "ريال سعودي", icon: "circle-dollar", tone: "gold" }, { label: "عدد المدفوعات الناجحة", value: String(succeeded), unit: "مدفوعة", icon: "shield", tone: "green" }, { label: "عدد المدفوعات المعلقة", value: String(pending), unit: "معلقة", icon: "clock", tone: "gold" }, { label: "عدد المدفوعات الفاشلة", value: String(failed), unit: "فاشلة", icon: "x", tone: "red" }]} /><AdminFinanceFilters search="البحث برقم الفاتورة أو العميل..." activePath="payments" q={q} status={status} exportRows={financeExportRows({ ...financial, invoices: [], payments })} exportFilename="mahabah-admin-payments.csv" /><AdminFinanceNav activePath="payments" invoiceDetailPath={invoiceDetailPath} paymentDetailPath={paymentDetailPath} /><FinancePaymentsTable payments={payments} /></div>;
}

function FinancePaymentsTable({ payments }: { payments: DashboardPayment[] }) {
  return <section className="overflow-hidden rounded-[22px] border bg-white shadow-card" style={{ borderColor: uiColors.border }}><div className="overflow-x-auto"><table className="w-full border-collapse text-right text-sm" style={{ minWidth: 1180 }}><thead><tr className="bg-[#f4ede5] text-xs font-extrabold text-[#5f5953]">{["رقم العملية", "رقم الفاتورة", "العميل", "المبلغ", "طريقة الدفع", "الحالة", "تاريخ العملية", "الإجراءات"].map((header) => <th key={header} className="px-4 py-3 font-extrabold">{header}</th>)}</tr></thead><tbody>{payments.length === 0 ? <tr><td colSpan={8} className="px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد مدفوعات مطابقة للبحث الحالي.</td></tr> : null}{payments.map((payment) => <tr key={payment.id} className="border-b last:border-b-0" style={{ borderColor: uiColors.border }}><td className="px-4 py-4 font-bold text-[#1D1916]">{payment.providerReference ?? payment.id}</td><td className="px-4 py-4 font-bold text-[#6E6258]">{payment.invoiceNumber ?? payment.invoiceId ?? "---"}</td><td className="px-4 py-4 font-bold text-[#1D1916]">{payment.customer}<small className="mt-1 block text-xs font-bold text-[#6E6258]">{adminCustomerTypeLabel(payment.customerType)}</small></td><td className="px-4 py-4 font-bold text-[#1D1916]">{formatSar(payment.amount)}</td><td className="px-4 py-4 font-bold text-[#6E6258]">{paymentMethodLabel(payment.method)}</td><td className="px-4 py-4"><StatusPill label={payment.statusLabel} tone={payment.tone} /></td><td className="px-4 py-4 font-bold text-[#6E6258]">{formatDashboardDate(payment.paidAt ?? payment.createdAt)}</td><td className="px-4 py-4"><div className="flex flex-wrap gap-2"><Link href={dashboardHref("admin", `payments/details?payment=${encodeURIComponent(payment.providerReference || payment.id)}`)} className="inline-flex min-h-10 items-center rounded-xl border px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>عرض</Link>{payment.status !== "succeeded" ? <AdminManagementActionButton action="payment_status" entityId={payment.id} slug={payment.providerReference ?? undefined} title={payment.title} payload={{ status: "succeeded" }} collectFormValues={false} className="inline-flex min-h-10 items-center rounded-xl bg-[#087342] px-3 text-xs font-extrabold text-white">اعتماد</AdminManagementActionButton> : null}{payment.status !== "failed" ? <AdminManagementActionButton action="payment_status" entityId={payment.id} slug={payment.providerReference ?? undefined} title={payment.title} payload={{ status: "failed" }} collectFormValues={false} className="inline-flex min-h-10 items-center rounded-xl border bg-white px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>فشل</AdminManagementActionButton> : null}</div></td></tr>)}</tbody></table></div></section>;
}

async function AdminPaymentDetailsPage({ config, searchParams = {} }: { config: DashboardRoleConfig; searchParams?: DashboardSearchParams }) {
  const financial = await listDashboardFinancial("admin");
  const selectedPaymentRef = stringParam(searchParams, "payment");
  const payment = selectedPaymentRef ? financial.payments.find((item) => item.id === selectedPaymentRef || item.providerReference === selectedPaymentRef) ?? financial.payments[0] : financial.payments[0];
  return <div className="grid gap-5"><DashboardTopbar config={config} /><AdminFinanceHeader title="تفاصيل عملية الدفع" subtitle="عرض معلومات العملية والعميل ومسار معالجة الدفع والإيصال." /><AdminFinanceNav activePath="payments/details" />{payment ? <><section className="grid gap-4 lg:grid-cols-3"><article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><StatusPill label={payment.statusLabel} tone={payment.tone} /><h2 className="mt-4 font-display text-3xl font-extrabold text-[#1D1916]">{formatSar(payment.amount)}</h2><FinanceFacts facts={[["طريقة الدفع", paymentMethodLabel(payment.method)], ["تاريخ الدفع", formatDashboardDate(payment.paidAt ?? payment.createdAt)]]} /></article><article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><h3 className="font-display text-xl font-extrabold text-[#1D1916]">معلومات العملية</h3><FinanceFacts facts={[["رقم الفاتورة", payment.invoiceNumber ?? "---"], ["رقم العملية", payment.providerReference ?? payment.id], ["المبلغ", formatSar(payment.amount)], ["رسوم العملية", formatSar(0)], ["الحالة", payment.statusLabel], ["رقم المرجع", payment.id]]} /></article><article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><h3 className="font-display text-xl font-extrabold text-[#1D1916]">معلومات العميل</h3><FinanceFacts facts={[["اسم العميل", payment.customer], ["نوع العميل", adminCustomerTypeLabel(payment.customerType)], ["مصدر البيانات", financial.source === "supabase" ? "Supabase" : "بيانات تجريبية"]]} /></article></section><section className="grid gap-4 lg:grid-cols-2"><FinanceBreakdown compact title={payment.title} amount={payment.amount} /><article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><h3 className="font-display text-xl font-extrabold text-[#1D1916]">تفاصيل الدفع</h3>{["تم إنشاء عملية الدفع", payment.status === "pending" ? "بانتظار المعالجة" : "جاري معالجة الدفع", payment.status === "succeeded" ? "تم إتمام عملية الدفع بنجاح" : payment.statusLabel].map((step, index) => <div key={`${step}-${index}`} className="flex items-start gap-3 border-b py-3 last:border-b-0" style={{ borderColor: uiColors.border }}><StatusPill label="✓" tone={payment.status === "failed" && index === 2 ? "red" : "green"} /><div><p className="text-sm font-extrabold text-[#1D1916]">{step}</p><p className="text-xs font-bold text-[#6E6258]">{formatDashboardDate(payment.paidAt ?? payment.createdAt)}</p></div></div>)}</article></section><FinanceActions primaryHref={dashboardQueryHref("admin", "payments", { q: payment.providerReference || payment.id })} primary="عرض المدفوعات" secondary="تحميل CSV" dangerHref={payment.invoiceNumber ? dashboardHref("admin", `billing/details?invoice=${encodeURIComponent(payment.invoiceNumber)}`) : dashboardQueryHref("admin", "billing", { q: payment.customer })} danger="عرض الفاتورة" rows={[{ payment: payment.providerReference ?? payment.id, invoice: payment.invoiceNumber, customer: payment.customer, amount: payment.amount, status: payment.statusLabel }]} /></> : <section className="rounded-[22px] border bg-white p-8 text-center text-sm font-extrabold text-[#6E6258]" style={{ borderColor: uiColors.border }}>لا توجد عمليات دفع لعرض تفاصيلها.</section>}</div>;
}

async function AdminSubscriptionsPage({ config, searchParams = {} }: { config: DashboardRoleConfig; searchParams?: DashboardSearchParams }) {
  const financial = await listDashboardFinancial("admin");
  const q = stringParam(searchParams, "q").trim();
  const status = stringParam(searchParams, "status").trim();
  const subscriptions = filterAdminSubscriptions(financial.subscriptions, q, status);
  const active = subscriptions.filter((subscription) => subscription.status === "active").length;
  const expired = subscriptions.filter((subscription) => subscription.status === "expired" || subscription.status === "cancelled").length;
  const pending = subscriptions.filter((subscription) => subscription.status !== "active" && subscription.status !== "expired" && subscription.status !== "cancelled").length;
  const exportRows = subscriptions.map((subscription) => ({
    النوع: "اشتراك",
    الرقم: subscription.id,
    العميل: subscription.customer,
    الباقة: subscription.planName,
    المبلغ: subscription.amount,
    الحالة: subscription.statusLabel,
    البداية: subscription.startsAt,
    النهاية: subscription.endsAt,
  }));
  return <div className="grid gap-5"><DashboardTopbar config={config} /><AdminFinanceHeader title="الاشتراكات" subtitle="إدارة اشتراكات العملاء وحالاتها والباقات المرتبطة بها." /><AdminFinanceKpis cards={[{ label: "إجمالي الاشتراكات", value: String(subscriptions.length), unit: "اشتراك", icon: "shield", tone: "green" }, { label: "الاشتراكات المعلقة", value: String(pending), unit: "اشتراك", icon: "clock", tone: "gold" }, { label: "الاشتراكات المنتهية", value: String(expired), unit: "اشتراك", icon: "x", tone: "red" }, { label: "الاشتراكات النشطة", value: String(active), unit: "اشتراك", icon: "circle-dollar", tone: "gold" }]} /><AdminFinanceFilters search="البحث برقم الاشتراك أو العميل..." activePath="subscriptions" q={q} status={status} exportRows={exportRows} exportFilename="mahabah-admin-subscriptions.csv" /><AdminFinanceNav activePath="subscriptions" /><section className="overflow-hidden rounded-[22px] border bg-white shadow-card" style={{ borderColor: uiColors.border }}><div className="overflow-x-auto"><table className="w-full border-collapse text-right text-sm" style={{ minWidth: 1180 }}><thead><tr className="bg-[#f4ede5] text-xs font-extrabold text-[#5f5953]">{["رقم الاشتراك", "العميل", "الباقة", "تاريخ البداية", "تاريخ الانتهاء", "المبلغ", "حالة الاشتراك", "نوع الحساب", "الإجراءات"].map((header) => <th key={header} className="px-4 py-3 font-extrabold">{header}</th>)}</tr></thead><tbody>{subscriptions.length === 0 ? <tr><td colSpan={9} className="px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد اشتراكات مطابقة للبحث الحالي.</td></tr> : null}{subscriptions.map((subscription) => <tr key={subscription.id} className="border-b last:border-b-0" style={{ borderColor: uiColors.border }}><td className="px-4 py-4 font-bold text-[#1D1916]">{subscription.id}</td><td className="px-4 py-4 font-bold text-[#1D1916]">{subscription.customer}</td><td className="px-4 py-4 font-bold text-[#6E6258]">{subscription.planName}</td><td className="px-4 py-4 font-bold text-[#6E6258]">{formatDashboardDate(subscription.startsAt)}</td><td className="px-4 py-4 font-bold text-[#6E6258]">{formatDashboardDate(subscription.endsAt)}</td><td className="px-4 py-4 font-bold text-[#1D1916]">{formatSar(subscription.amount)}</td><td className="px-4 py-4"><StatusPill label={subscription.statusLabel} tone={adminSubscriptionTone(subscription.status)} /></td><td className="px-4 py-4 font-bold text-[#6E6258]">{adminCustomerTypeLabel(subscription.customerType)}</td><td className="px-4 py-4"><div className="flex flex-wrap gap-2"><Link href={dashboardQueryHref("admin", "billing", { q: subscription.customer })} className="inline-flex min-h-10 items-center rounded-xl border px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>عرض الفواتير</Link>{subscription.status !== "active" ? <AdminManagementActionButton action="subscription_status" entityId={subscription.id} title={subscription.planName} payload={{ status: "active" }} collectFormValues={false} className="inline-flex min-h-10 items-center rounded-xl bg-[#087342] px-3 text-xs font-extrabold text-white">تفعيل</AdminManagementActionButton> : null}{subscription.status !== "cancelled" ? <AdminManagementActionButton action="subscription_status" entityId={subscription.id} title={subscription.planName} payload={{ status: "cancelled" }} collectFormValues={false} className="inline-flex min-h-10 items-center rounded-xl border bg-white px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إلغاء</AdminManagementActionButton> : null}</div></td></tr>)}</tbody></table></div></section></div>;
}

async function AdminPlansPage({ config, searchParams = {} }: { config: DashboardRoleConfig; searchParams?: DashboardSearchParams }) {
  const [financial, planSettings] = await Promise.all([
    listDashboardFinancial("admin"),
    listDashboardPlatformSettings("subscription-plan-"),
  ]);
  const q = stringParam(searchParams, "q").trim();
  const editName = stringParam(searchParams, "edit");
  const creating = Boolean(stringParam(searchParams, "new"));
  const allRows = buildAdminPlanRows(financial, planSettings.data);
  const rows = allRows.filter((row) => matchesDashboardSearch(q, [row.name, row.description, row.price, row.duration, row.features, row.subscribers, row.revenue, row.active ? "نشطة" : "غير نشطة"]));
  const selectedPlan = creating ? undefined : allRows.find((row) => row.name === editName) ?? rows[0];
  const exportRows = rows.map((row) => ({ الباقة: row.name, الوصف: row.description, السعر: row.price, المشتركين: row.subscribers, الإيراد: row.revenue, الحالة: row.active ? "نشطة" : "غير نشطة" }));
  return <div className="grid gap-5"><DashboardTopbar config={config} /><AdminFinanceHeader title="الباقات" subtitle="إدارة باقات الاشتراك وأسعارها ومميزاتها وحالة ظهورها." /><AdminFinanceKpis cards={[{ label: "إجمالي الباقات", value: String(rows.length), unit: "باقة", icon: "circle-dollar", tone: "gold" }, { label: "الباقات النشطة", value: String(rows.filter((row) => row.active).length), unit: "باقة", icon: "shield", tone: "green" }, { label: "إيراد الباقات", value: formatSar(adminFinanceAmountTotal(rows.map((row) => ({ amount: row.revenue })))), unit: "ريال سعودي", icon: "chart", tone: "green" }, { label: "إجمالي المشتركين", value: String(rows.reduce((total, row) => total + row.subscribers, 0)), unit: "مشترك", icon: "users", tone: "gold" }]} />{financial.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل الاشتراكات الحية، وتم عرض بيانات الباقات الاحتياطية.</section> : null}{planSettings.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل إعدادات الباقات المحفوظة، وتم عرض البيانات المتاحة.</section> : null}<AdminFinanceFilters search="البحث باسم الباقة أو الوصف..." activePath="plans" q={q} status="" primary="إضافة باقة جديدة" primaryHref={dashboardHref("admin", "plans?new=1")} exportRows={exportRows} exportFilename="mahabah-admin-plans.csv" showStatusFilters={false} /><AdminFinanceNav activePath="plans" />{creating || editName ? <form className="grid gap-4 rounded-[22px] border bg-white p-5 shadow-card lg:grid-cols-4" style={{ borderColor: uiColors.border }}><input type="hidden" name="previousKey" defaultValue={selectedPlan?.settingKey ?? ""} /><input name="title" defaultValue={selectedPlan?.name ?? ""} required className="h-12 rounded-xl border bg-[#fffdf9] px-4 text-sm font-bold outline-none" style={{ borderColor: uiColors.border }} placeholder="اسم الباقة" /><input name="price" defaultValue={selectedPlan?.price ?? ""} required className="h-12 rounded-xl border bg-[#fffdf9] px-4 text-sm font-bold outline-none" style={{ borderColor: uiColors.border }} placeholder="السعر" /><input name="duration" defaultValue={selectedPlan?.duration ?? ""} className="h-12 rounded-xl border bg-[#fffdf9] px-4 text-sm font-bold outline-none" style={{ borderColor: uiColors.border }} placeholder="مدة الاشتراك" /><input name="features" type="number" min="0" defaultValue={selectedPlan?.features ?? 0} className="h-12 rounded-xl border bg-[#fffdf9] px-4 text-sm font-bold outline-none" style={{ borderColor: uiColors.border }} placeholder="عدد الميزات" /><textarea name="description" defaultValue={selectedPlan?.description ?? ""} className="min-h-24 rounded-xl border bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none lg:col-span-3" style={{ borderColor: uiColors.border }} placeholder="وصف الباقة" /><label className="flex h-12 items-center gap-3 rounded-xl border px-4 text-sm font-extrabold text-[#1D1916]" style={{ borderColor: uiColors.border }}><input name="active" type="checkbox" defaultChecked={selectedPlan?.active ?? true} />نشطة</label><div className="flex flex-wrap gap-3 lg:col-span-4"><AdminManagementActionButton action="settings_save" slug={selectedPlan?.settingKey ?? "subscription-plan-new-plan"} title={selectedPlan?.name ?? "باقة جديدة"} payload={{ section: "subscription_plans", source: "admin_plans" }} className="min-h-11 rounded-xl bg-[#A7815E] px-6 text-sm font-extrabold text-white">حفظ الباقة</AdminManagementActionButton><Link href={dashboardHref("admin", "plans")} className="inline-flex min-h-11 items-center rounded-xl border px-5 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إلغاء</Link></div></form> : null}<section className="overflow-hidden rounded-[22px] border bg-white shadow-card" style={{ borderColor: uiColors.border }}><div className="overflow-x-auto"><table className="w-full border-collapse text-right text-sm" style={{ minWidth: 1120 }}><thead><tr className="bg-[#f4ede5] text-xs font-extrabold text-[#5f5953]">{["اسم الباقة", "الوصف", "السعر", "مدة الاشتراك", "عدد الميزات", "عدد المشتركين", "الإيراد", "الحالة", "الإجراءات"].map((header) => <th key={header} className="px-4 py-3 font-extrabold">{header}</th>)}</tr></thead><tbody>{rows.length === 0 ? <tr><td colSpan={9} className="px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد باقات مطابقة للبحث الحالي.</td></tr> : null}{rows.map((row) => <tr key={row.name} className="border-b last:border-b-0" style={{ borderColor: uiColors.border }}><td className="px-4 py-4 font-display text-lg font-extrabold text-[#1D1916]">{row.name}</td><td className="px-4 py-4 font-bold text-[#6E6258]">{row.description}</td><td className="px-4 py-4 font-bold text-[#1D1916]">{row.price}</td><td className="px-4 py-4 font-bold text-[#6E6258]">{row.duration}</td><td className="px-4 py-4 font-bold text-[#1D1916]">{row.features || "-"}</td><td className="px-4 py-4 font-bold text-[#1D1916]">{row.subscribers}</td><td className="px-4 py-4 font-bold text-[#1D1916]">{formatSar(row.revenue)}</td><td className="px-4 py-4"><StatusPill label={row.active ? "نشطة" : "غير نشطة"} tone={row.active ? "green" : "red"} /></td><td className="px-4 py-4"><div className="flex flex-wrap gap-2"><Link href={dashboardHref("admin", `plans?edit=${encodeURIComponent(row.name)}`)} className="grid min-h-10 place-items-center rounded-xl border px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>تعديل</Link><AdminManagementActionButton action="settings_save" slug={row.settingKey} title={row.name} payload={{ section: "subscription_plans", active: !row.active, name: row.name, title: row.name, description: row.description, price: row.price, duration: row.duration, features: row.features }} collectFormValues={false} className="grid min-h-10 place-items-center rounded-xl border px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>{row.active ? "تعطيل" : "تفعيل"}</AdminManagementActionButton></div></td></tr>)}</tbody></table></div></section></div>;
}

async function AdminRevenuePage({ config }: { config: DashboardRoleConfig }) {
  const financial = await listDashboardFinancial("admin");
  const metrics = buildAdminRevenueMetrics(financial);
  const exportRows = [
    ...metrics.sources.map((source) => ({ النوع: "مصدر إيراد", البند: source.label, المبلغ: source.value, النسبة: source.pct })),
    ...metrics.series.map((point) => ({ النوع: "إيراد شهري", البند: point.label, المبلغ: point.value, النسبة: "" })),
  ];
  const growthTone: TrendTone = metrics.growthPct >= 0 ? "green" : "red";
  return <div className="grid gap-5"><DashboardTopbar config={config} /><AdminFinanceHeader title="الإيرادات" subtitle="تحليل إيرادات المنصة حسب الفترة ومصادر الدخل ونسب النمو." /><AdminFinanceKpis cards={[{ label: "إجمالي الإيرادات", value: formatSar(metrics.totalRevenue), unit: financial.source === "supabase" ? "ريال سعودي" : "بيانات تجريبية", icon: "circle-dollar", tone: "gold" }, { label: "إجمالي هذا الشهر", value: formatSar(metrics.currentMonthRevenue), unit: "ريال سعودي", icon: "chart", tone: "green" }, { label: "إجمالي الشهر الماضي", value: formatSar(metrics.previousMonthRevenue), unit: "ريال سعودي", icon: "chart", tone: "gold" }, { label: "نسبة النمو", value: `${metrics.growthPct.toFixed(2)}%`, unit: "عن الشهر الماضي", icon: "shield", tone: growthTone }]} />{financial.error ? <section className="rounded-[18px] border bg-[#fff8f2] p-4 text-sm font-bold text-[#8F6B4C]" style={{ borderColor: "#efdbc8" }}>تعذر تحميل بيانات Supabase المالية، ويتم عرض بيانات احتياطية مؤقتة: {financial.error}</section> : null}<AdminFinanceNav activePath="revenue" /><section className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-xl font-extrabold text-[#1D1916]">نظرة عامة على الإيرادات</h2><div className="flex gap-2"><Link href={dashboardHref("admin", "revenue?range=month")} className="inline-flex h-10 items-center rounded-xl border px-4 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>شهري</Link><Link href={dashboardHref("admin", "revenue?range=12m")} className="inline-flex h-10 items-center rounded-xl border px-4 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>آخر 12 شهر</Link><FinancialExportButton filename="mahabah-revenue.csv" rows={exportRows} className="h-10 rounded-xl border px-4 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>تصدير</FinancialExportButton></div></div><RevenueLineChart series={metrics.series} /></section><section className="grid gap-4 lg:grid-cols-2"><article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><h3 className="font-display text-xl font-extrabold text-[#1D1916]">مصادر الإيرادات</h3><div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center"><RevenueDonut sources={metrics.sources} total={metrics.totalRevenue} /><div className="grid flex-1 gap-3">{metrics.sources.map((source) => <div key={source.label} className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-sm font-extrabold text-[#1D1916]"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: source.color }} />{source.label}</span><span className="text-sm font-bold text-[#6E6258]">{formatSar(source.value)} · {source.pct}</span></div>)}</div></div></article><article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><h3 className="font-display text-xl font-extrabold text-[#1D1916]">تفصيل الإيرادات</h3><div className="mt-4 overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-[#6E6258]" style={{ borderColor: uiColors.border }}><th className="py-3 text-right">البند</th><th className="py-3 text-right">المبلغ</th><th className="py-3 text-right">النسبة</th></tr></thead><tbody>{metrics.sources.map((source) => <tr key={source.label} className="border-b last:border-b-0" style={{ borderColor: uiColors.border }}><td className="py-3 font-extrabold text-[#1D1916]">{source.label}</td><td className="py-3 font-bold text-[#1D1916]">{formatSar(source.value)}</td><td className="py-3 font-bold text-[#6E6258]">{source.pct}</td></tr>)}<tr><td className="py-3 font-extrabold text-[#1D1916]">الإجمالي</td><td className="py-3 font-extrabold text-[#A54118]">{formatSar(metrics.totalRevenue)}</td><td className="py-3 font-extrabold text-[#1D1916]">{metrics.totalRevenue > 0 ? "100%" : "0%"}</td></tr></tbody></table></div></article></section></div>;
}

function FinanceFacts({ facts }: { facts: [string, string][] }) {
  return <div className="mt-4 grid gap-3">{facts.map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 border-b pb-2 last:border-b-0" style={{ borderColor: uiColors.border }}><span className="text-sm font-bold text-[#6E6258]">{label}</span><strong className="text-sm text-[#1D1916]">{value}</strong></div>)}</div>;
}

function FinanceBreakdown({ compact = false, title = "بند مالي", amount = 0 }: { compact?: boolean; title?: string; amount?: number }) {
  const baseAmount = amount / 1.15;
  const taxAmount = amount - baseAmount;
  return <section className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><h3 className="font-display text-xl font-extrabold text-[#1D1916]">{compact ? "ملخص المبلغ" : "تفاصيل الفاتورة"}</h3><div className="mt-4 overflow-x-auto"><table className="w-full text-sm" style={{ minWidth: compact ? 420 : 720 }}><thead><tr className="bg-[#f4ede5] text-[#5f5953]"><th className="px-4 py-3 text-right">البند</th><th className="px-4 py-3 text-right">المبلغ</th>{!compact ? <><th className="px-4 py-3 text-right">الضريبة</th><th className="px-4 py-3 text-right">الإجمالي</th></> : null}</tr></thead><tbody><tr><td className="px-4 py-3 font-bold">{title}</td><td className="px-4 py-3 font-bold">{formatSar(baseAmount)}</td>{!compact ? <><td className="px-4 py-3 font-bold">{formatSar(taxAmount)}</td><td className="px-4 py-3 font-bold">{formatSar(amount)}</td></> : null}</tr><tr className="border-t" style={{ borderColor: uiColors.border }}><td className="px-4 py-3 font-extrabold">المبلغ الإجمالي</td><td className="px-4 py-3 font-extrabold text-[#A54118]">{formatSar(amount)}</td>{!compact ? <><td /><td className="px-4 py-3 font-extrabold text-[#A54118]">{formatSar(amount)}</td></> : null}</tr></tbody></table></div></section>;
}

function FinanceActions({
  primary,
  secondary,
  danger,
  primaryHref,
  dangerHref,
  rows = [],
}: {
  primary: string;
  secondary: string;
  danger: string;
  primaryHref: string;
  dangerHref: string;
  rows?: Array<Record<string, string | number | null | undefined>>;
}) {
  return <section className="flex flex-wrap justify-between gap-3"><Link href={dangerHref} className="inline-flex min-h-11 items-center justify-center rounded-xl border bg-[#fff0eb] px-5 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#efc5b9" }}>{danger}</Link><div className="flex flex-wrap gap-3"><FinancialExportButton filename="mahabah-admin-finance-detail.csv" rows={rows} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border bg-white px-5 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>{secondary}</FinancialExportButton><Link href={primaryHref} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#A54118] px-5 text-sm font-extrabold text-white">{primary}</Link></div></section>;
}

function RevenueLineChart({ series }: { series: AdminRevenuePoint[] }) {
  const maxValue = Math.max(...series.map((point) => point.value), 1);
  const points = series.map((point, index) => {
    const x = series.length === 1 ? 500 : 40 + (index * 920) / (series.length - 1);
    const y = 300 - (point.value / maxValue) * 230;
    return `${x},${y}`;
  }).join(" ");
  const latest = series[series.length - 1] ?? { label: "الشهر الحالي", value: 0 };
  return <svg viewBox="0 0 1000 340" className="h-[320px] w-full" role="img" aria-label="مخطط الإيرادات"><defs><linearGradient id="revenueArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#B4542E" stopOpacity="0.18" /><stop offset="100%" stopColor="#B4542E" stopOpacity="0" /></linearGradient></defs>{[0, 1, 2, 3, 4].map((line) => <line key={line} x1="30" x2="970" y1={60 + line * 55} y2={60 + line * 55} stroke="#E8DED4" strokeWidth="1" />)}<polyline points={`40,300 ${points} 960,300`} fill="url(#revenueArea)" stroke="none" /><polyline points={points} fill="none" stroke="#B4542E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{points.split(" ").filter(Boolean).map((point) => { const [x, y] = point.split(",").map(Number); return <circle key={point} cx={x} cy={y} r="5" fill="#B4542E" stroke="#fff" strokeWidth="2" />; })}<text x="760" y="70" fill="#1D1916" fontSize="18" fontWeight="700">{latest.label}</text><text x="760" y="96" fill="#B4542E" fontSize="16" fontWeight="700">{formatSar(latest.value)}</text></svg>;
}

function RevenueDonut({ sources, total }: { sources: AdminRevenueSource[]; total: number }) {
  let cursor = 0;
  const gradientStops = sources.map((source) => {
    const start = cursor;
    cursor += source.pctNumber;
    return `${source.color} ${start}% ${cursor}%`;
  }).join(", ");
  const background = total > 0 ? `conic-gradient(${gradientStops})` : "#E8DED4";
  return <div className="relative h-44 w-44 shrink-0 rounded-full" style={{ background }}><div className="absolute inset-10 grid place-items-center rounded-full bg-white text-center"><strong className="font-display text-xl text-[#1D1916]">{formatSar(total)}</strong><span className="text-xs font-bold text-[#6E6258]">ريال سعودي</span></div></div>;
}

type AdminReportKind = "overview" | "assets" | "contributions" | "services" | "financial" | "exports";
type AdminReportRow = {
  id: string;
  name: string;
  kind: string;
  owner: string;
  period: string;
  status: string;
  downloads: number;
  updatedAt: string;
};

const reportMeta: Record<AdminReportKind, { title: string; subtitle: string; active: string }> = {
  overview: { title: "لوحة التقارير", subtitle: "نظرة عامة على مؤشرات المنصة وأحدث التقارير القابلة للتصدير.", active: "reports" },
  assets: { title: "تقرير الأصول العقارية", subtitle: "تحليل أداء الأصول العقارية حسب الحالة والمدينة والقيمة.", active: "reports/assets" },
  contributions: { title: "تقرير المساهمات العقارية", subtitle: "متابعة مؤشرات المساهمات وحالات الاعتماد والاهتمام.", active: "reports/contributions" },
  services: { title: "تقرير الخدمات العقارية", subtitle: "تحليل طلبات الخدمات ومعدلات الإنجاز والاستجابة.", active: "reports/services" },
  financial: { title: "التقرير المالي", subtitle: "ملخص الإيرادات والفواتير والمدفوعات والاشتراكات.", active: "reports/financial" },
  exports: { title: "سجل تصدير التقارير", subtitle: "متابعة ملفات التقارير المصدرة وحالتها ونوعها.", active: "reports/exports" },
};

const adminReportRows: AdminReportRow[] = [
  { id: "RPT-9001", name: "تقرير الأصول الأسبوعي", kind: "الأصول العقارية", owner: "مركز الإدارة", period: "آخر 7 أيام", status: "جاهز", downloads: 42, updatedAt: "14/06/2026" },
  { id: "RPT-9002", name: "تقرير المساهمات الشهري", kind: "المساهمات العقارية", owner: "فريق المراجعة", period: "آخر 30 يوم", status: "جاهز", downloads: 31, updatedAt: "13/06/2026" },
  { id: "RPT-9003", name: "تقرير الخدمات المفتوحة", kind: "الخدمات العقارية", owner: "عمليات الخدمات", period: "آخر 30 يوم", status: "قيد التحديث", downloads: 18, updatedAt: "12/06/2026" },
  { id: "RPT-9004", name: "التقرير المالي التنفيذي", kind: "مالي", owner: "الفريق المالي", period: "ربع سنوي", status: "جاهز", downloads: 55, updatedAt: "10/06/2026" },
  { id: "RPT-9005", name: "سجل الاعتمادات", kind: "تشغيلي", owner: "مركز المراجعة", period: "آخر 90 يوم", status: "مجدول", downloads: 9, updatedAt: "09/06/2026" },
];

const reportSeries = [72, 86, 64, 118, 104, 138, 126, 168, 154, 182, 171, 205];

function AdminReportsHeader({ title, subtitle, exportRows, filename }: { title: string; subtitle: string; exportRows: Array<Record<string, string | number | null | undefined>>; filename: string }) {
  return <section className="relative overflow-hidden rounded-[24px] border bg-white p-5 shadow-card md:p-6" style={{ borderColor: uiColors.border }}><Image src="/images/about-lobby.png" alt="" fill className="object-cover opacity-[0.12] grayscale-[12%] sepia-[12%]" sizes="80vw" /><div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><StatusPill label="التقارير" tone="gold" /><h1 className="mt-3 font-display text-3xl font-extrabold text-[#1D1916]">{title}</h1><p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-[#5f5953]">{subtitle}</p></div><div className="flex flex-wrap gap-2"><FinancialExportButton filename={filename} rows={exportRows} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#A7815E] px-5 text-sm font-extrabold text-white">تصدير CSV</FinancialExportButton><FinancialExportButton filename={filename.replace(".csv", "-excel.csv")} rows={exportRows} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border bg-white px-5 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>تصدير Excel</FinancialExportButton></div></div></section>;
}

function AdminReportsNav({ activePath }: { activePath: string }) {
  const items = [["لوحة التقارير", "reports"], ["الأصول العقارية", "reports/assets"], ["المساهمات", "reports/contributions"], ["الخدمات", "reports/services"], ["المالي", "reports/financial"], ["سجل التصدير", "reports/exports"]];
  return <section className="flex flex-wrap gap-2">{items.map(([label, path]) => <Link key={path} href={dashboardHref("admin", path)} className={cn("inline-flex min-h-10 items-center justify-center rounded-xl border px-4 text-sm font-extrabold", activePath === path ? "bg-[#A7815E] text-white" : "bg-white text-[#1D1916]")} style={{ borderColor: activePath === path ? "#A7815E" : uiColors.border }}>{label}</Link>)}</section>;
}

type AdminReportKpiCard = { label: string; value: string; unit: string; icon: string; tone: TrendTone };
type AdminReportDistributionItem = readonly [label: string, percent: number];

function AdminReportsKpis({ cards }: { cards: AdminReportKpiCard[] }) {
  return <AdminFinanceKpis cards={cards} />;
}

function reportExportRows(rows: AdminReportRow[]) {
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    kind: row.kind,
    period: row.period,
    owner: row.owner,
    status: row.status,
    downloads: row.downloads,
    updatedAt: row.updatedAt,
  }));
}

function reportSeriesFromRows(rows: AdminReportRow[]) {
  if (!rows.length) return reportSeries;
  const bucketCount = Math.min(12, Math.max(1, rows.length));
  const buckets = Array.from({ length: bucketCount }, () => 0);
  rows.forEach((row, index) => {
    const bucketIndex = Math.min(bucketCount - 1, Math.floor((index / rows.length) * bucketCount));
    buckets[bucketIndex] += Math.max(1, row.downloads);
  });
  return buckets;
}

function AdminReportsFilters({ activePath, q, status, exportRows, filename }: { activePath: string; q: string; status: string; exportRows: Array<Record<string, string | number | null | undefined>>; filename: string }) {
  const filters = [["كل الحالات", "all"], ["جاهز", "جاهز"], ["مكتمل", "مكتمل"], ["قيد التحديث", "قيد التحديث"], ["مجدول", "مجدول"]] as const;
  return <section className="rounded-[20px] border bg-white p-4 shadow-card" style={{ borderColor: uiColors.border }}><div className="flex flex-wrap items-center gap-3"><form action={dashboardHref("admin", activePath)} className="relative block min-w-[260px] flex-[1_1_320px]">{status ? <input type="hidden" name="status" value={status} /> : null}<Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6E6258]" /><input name="q" defaultValue={q} suppressHydrationWarning className="h-12 w-full rounded-xl border bg-[#fffdf9] pl-16 pr-12 text-sm font-bold outline-none focus:border-[#A7815E]" style={{ borderColor: uiColors.border }} placeholder="البحث باسم التقرير أو نوعه..." /><button type="submit" className="absolute left-2 top-1/2 h-8 -translate-y-1/2 rounded-lg bg-[#1D1916] px-3 text-xs font-extrabold text-white">بحث</button></form>{filters.map(([filter, nextStatus]) => <Link key={filter} href={dashboardQueryHref("admin", activePath, { q, status: nextStatus })} className={cn("flex h-12 shrink-0 items-center justify-between rounded-xl border px-4 text-sm font-extrabold", status === nextStatus ? "bg-[#fbf3e9] text-[#8F6B4C]" : "bg-white text-[#1D1916]")} style={{ borderColor: status === nextStatus ? "#e3c8aa" : uiColors.border, width: "10rem" }}><span>{filter}</span><ChevronGlyph /></Link>)}<FinancialExportButton filename={filename} rows={exportRows} className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border bg-white px-5 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>تصدير</FinancialExportButton></div></section>;
}

async function loadAdminReportMetricsData() {
  const [assets, contributions, services, financial] = await Promise.all([
    listDashboardAdminAssets(),
    listDashboardAdminContributions(),
    listDashboardAdminServiceRequests(),
    listDashboardFinancial("admin"),
  ]);
  return { assets, contributions, services, financial };
}

function reportReviewStatusLabel(status: DashboardAdminReviewStatus) {
  if (status === "approved") return "جاهز";
  if (status === "rejected") return "مرفوض";
  return "قيد التحديث";
}

function reportPaymentStatusLabel(status: DashboardPayment["status"]) {
  if (status === "succeeded") return "مكتمل";
  if (status === "failed" || status === "refunded") return "مرفوض";
  return "قيد التحديث";
}

function reportRowId(prefix: string, id: string, index: number) {
  const normalized = id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase();
  return `${prefix}-${normalized || String(index + 1).padStart(4, "0")}`;
}

function reportRowsForKind(kind: AdminReportKind, data: Awaited<ReturnType<typeof loadAdminReportMetricsData>>): AdminReportRow[] {
  const assetRows: AdminReportRow[] = data.assets.data.map((row, index) => ({
    id: reportRowId("RPT-AST", row.id, index),
    name: `تقرير أصل: ${row.titleAr}`,
    kind: "الأصول العقارية",
    owner: row.owner,
    period: row.cityAr,
    status: reportReviewStatusLabel(row.status),
    downloads: Math.max(1, Math.round(row.estimatedValueSar / 1_000_000)),
    updatedAt: formatDashboardDate(row.submittedAt || row.listingDate),
  }));

  const contributionRows: AdminReportRow[] = data.contributions.data.map((row, index) => ({
    id: reportRowId("RPT-CON", row.id, index),
    name: `تقرير مساهمة: ${row.titleAr}`,
    kind: "المساهمات العقارية",
    owner: row.sponsor,
    period: `${row.durationMonths} شهر`,
    status: reportReviewStatusLabel(row.status),
    downloads: Math.max(1, row.investorsCount),
    updatedAt: formatDashboardDate(row.submittedAt),
  }));

  const serviceRows: AdminReportRow[] = data.services.data.map((row, index) => ({
    id: reportRowId("RPT-SRV", row.id, index),
    name: `تقرير خدمة: ${row.title}`,
    kind: "الخدمات العقارية",
    owner: row.requester,
    period: row.serviceType,
    status: row.status === "completed" ? "مكتمل" : "قيد التحديث",
    downloads: Math.max(1, Math.round(row.price / 1000)),
    updatedAt: formatDashboardDate(row.submittedAt),
  }));

  const financialRows: AdminReportRow[] = [
    ...data.financial.invoices.map((row, index) => ({
      id: reportRowId("RPT-INV", row.id, index),
      name: `تقرير فاتورة: ${row.title}`,
      kind: "مالي",
      owner: row.customer,
      period: row.invoiceNumber,
      status: row.status === "paid" ? "مكتمل" : row.status === "cancelled" ? "مرفوض" : "قيد التحديث",
      downloads: Math.max(1, Math.round(row.amount / 1000)),
      updatedAt: formatDashboardDate(row.issuedAt),
    })),
    ...data.financial.payments.map((row, index) => ({
      id: reportRowId("RPT-PAY", row.id, index),
      name: `تقرير دفع: ${row.title}`,
      kind: "مالي",
      owner: row.customer,
      period: row.method,
      status: reportPaymentStatusLabel(row.status),
      downloads: Math.max(1, Math.round(row.amount / 1000)),
      updatedAt: formatDashboardDate(row.paidAt ?? row.createdAt),
    })),
  ];

  const rowsByKind: Record<AdminReportKind, AdminReportRow[]> = {
    overview: [...assetRows, ...contributionRows, ...serviceRows, ...financialRows],
    assets: assetRows,
    contributions: contributionRows,
    services: serviceRows,
    financial: financialRows,
    exports: [...assetRows, ...contributionRows, ...serviceRows, ...financialRows].map((row, index) => ({ ...row, status: index % 2 ? row.status : row.status === "قيد التحديث" ? "مجدول" : row.status })),
  };
  const rows = rowsByKind[kind];
  return rows.length ? rows : adminReportRows.filter((row) => kind === "overview" || kind === "exports" || row.kind.includes(reportMeta[kind].title.replace("تقرير ", "").replace("التقرير ", "").replace(" العقارية", "")) || kind === "financial");
}

function reportExportStats(data: Awaited<ReturnType<typeof loadAdminReportMetricsData>>) {
  const rows = reportRowsForKind("exports", data);
  const downloads = rows.reduce((sum, row) => sum + row.downloads, 0);
  return { rows, downloads };
}

function reportOpenServiceCount(rows: DashboardAdminServiceRequest[]) {
  return rows.filter((row) => row.status === "new" || row.status === "assigned" || row.status === "urgent").length;
}

function reportMonthlyPaymentTotals(payments: DashboardPayment[]) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const previousMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const previousMonth = previousMonthDate.getMonth();
  const previousYear = previousMonthDate.getFullYear();
  return payments.reduce((totals, payment) => {
    if (payment.status !== "succeeded") return totals;
    const date = new Date(payment.paidAt ?? payment.createdAt);
    if (Number.isNaN(date.getTime())) return totals;
    if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) totals.current += payment.amount;
    if (date.getFullYear() === previousYear && date.getMonth() === previousMonth) totals.previous += payment.amount;
    return totals;
  }, { current: 0, previous: 0 });
}

function reportGrowthPercent(current: number, previous: number) {
  if (!previous) return current ? "100%" : "0%";
  return `${Math.round(((current - previous) / previous) * 100)}%`;
}

function compactDashboardMoney(value: number) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  return new Intl.NumberFormat("ar-SA").format(value);
}

function adminReportKpiCards(kind: AdminReportKind, data: Awaited<ReturnType<typeof loadAdminReportMetricsData>>): AdminReportKpiCard[] {
  const reportRows = reportRowsForKind(kind, data);
  const exportStats = reportExportStats(data);
  const assetValue = data.assets.data.reduce((sum, row) => sum + row.estimatedValueSar, 0);
  const contributionCapital = data.contributions.data.reduce((sum, row) => sum + row.capitalSar, 0);
  const contributionInterest = data.contributions.data.reduce((sum, row) => sum + row.investorsCount, 0);
  const completedServices = data.services.data.filter((row) => row.status === "completed").length;
  const openServices = reportOpenServiceCount(data.services.data);
  const succeededPayments = data.financial.payments.filter((row) => row.status === "succeeded");
  const paymentTotals = reportMonthlyPaymentTotals(data.financial.payments);

  const sets: Record<AdminReportKind, AdminReportKpiCard[]> = {
    overview: [
      { label: "إجمالي التقارير", value: String(reportRows.length), unit: "تقرير", icon: "file-text", tone: "gold" },
      { label: "مصادر البيانات", value: String(data.assets.data.length + data.contributions.data.length + data.services.data.length + data.financial.invoices.length), unit: "سجل", icon: "chart", tone: "blue" },
      { label: "تقارير جاهزة", value: String(reportRows.filter((row) => row.status === "جاهز" || row.status === "مكتمل").length), unit: "تقرير", icon: "shield", tone: "green" },
      { label: "عمليات تصدير", value: String(exportStats.downloads), unit: "تحميل", icon: "clock", tone: "gold" },
    ],
    assets: [
      { label: "الأصول", value: String(data.assets.data.length), unit: "أصل", icon: "building", tone: "gold" },
      { label: "المعتمدة", value: String(data.assets.data.filter((row) => row.status === "approved").length), unit: "أصل", icon: "shield", tone: "green" },
      { label: "قيد المراجعة", value: String(data.assets.data.filter((row) => row.status === "pending").length), unit: "أصل", icon: "clock", tone: "gold" },
      { label: "القيمة الإجمالية", value: compactDashboardMoney(assetValue), unit: "ريال", icon: "circle-dollar", tone: "blue" },
    ],
    contributions: [
      { label: "المساهمات", value: String(data.contributions.data.length), unit: "مساهمة", icon: "clipboard", tone: "gold" },
      { label: "المعتمدة", value: String(data.contributions.data.filter((row) => row.status === "approved").length), unit: "مساهمة", icon: "shield", tone: "green" },
      { label: "الاهتمامات", value: String(contributionInterest), unit: "مستثمر", icon: "users", tone: "blue" },
      { label: "رأس المال", value: compactDashboardMoney(contributionCapital), unit: "ريال", icon: "circle-dollar", tone: "gold" },
    ],
    services: [
      { label: "طلبات الخدمات", value: String(data.services.data.length), unit: "طلب", icon: "settings", tone: "blue" },
      { label: "مكتملة", value: String(completedServices), unit: "طلب", icon: "shield", tone: "green" },
      { label: "مفتوحة", value: String(openServices), unit: "طلب", icon: "clock", tone: "gold" },
      { label: "نسبة الإنجاز", value: `${data.services.data.length ? Math.round((completedServices / data.services.data.length) * 100) : 0}%`, unit: "من الطلبات", icon: "chart", tone: "green" },
    ],
    financial: [
      { label: "الإيرادات", value: compactDashboardMoney(data.financial.summary.totalPaid), unit: "ريال", icon: "circle-dollar", tone: "gold" },
      { label: "الفواتير", value: String(data.financial.invoices.length), unit: "فاتورة", icon: "receipt", tone: "blue" },
      { label: "المدفوعات", value: String(succeededPayments.length), unit: "عملية ناجحة", icon: "shield", tone: "green" },
      { label: "النمو", value: reportGrowthPercent(paymentTotals.current, paymentTotals.previous), unit: "شهري", icon: "chart", tone: paymentTotals.current >= paymentTotals.previous ? "green" : "red" },
    ],
    exports: [
      { label: "إجمالي التصدير", value: String(exportStats.downloads), unit: "تحميل", icon: "file-text", tone: "gold" },
      { label: "تقارير جاهزة", value: String(exportStats.rows.filter((row) => row.status === "جاهز").length), unit: "ملف", icon: "file", tone: "green" },
      { label: "مكتملة", value: String(exportStats.rows.filter((row) => row.status === "مكتمل").length), unit: "ملف", icon: "chart", tone: "blue" },
      { label: "مجدولة", value: String(exportStats.rows.filter((row) => row.status === "مجدول").length), unit: "عملية", icon: "clock", tone: "gold" },
    ],
  };
  return sets[kind];
}

function adminReportDistribution(data: Awaited<ReturnType<typeof loadAdminReportMetricsData>>): AdminReportDistributionItem[] {
  const items = [
    ["الأصول العقارية", data.assets.data.length] as const,
    ["المساهمات", data.contributions.data.length] as const,
    ["الخدمات", data.services.data.length] as const,
    ["المالية", data.financial.invoices.length + data.financial.payments.length] as const,
  ];
  const total = Math.max(items.reduce((sum, [, value]) => sum + value, 0), 1);
  return items.map(([label, value]) => [label, Math.round((value / total) * 100)] as const);
}

function AdminReportsTable({ rows }: { rows: AdminReportRow[] }) {
  return <section className="overflow-hidden rounded-[22px] border bg-white shadow-card" style={{ borderColor: uiColors.border }}><div className="overflow-x-auto"><table className="w-full border-collapse text-right text-sm" style={{ minWidth: 980 }}><thead><tr className="bg-[#f4ede5] text-xs font-extrabold text-[#5f5953]">{["رقم التقرير", "اسم التقرير", "النوع", "الفترة", "المسؤول", "آخر تحديث", "التحميلات", "الحالة", "الإجراء"].map((header) => <th key={header} className="px-4 py-3 font-extrabold">{header}</th>)}</tr></thead><tbody>{rows.length === 0 ? <tr><td colSpan={9} className="px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد تقارير مطابقة للبحث الحالي.</td></tr> : null}{rows.map((row) => <tr key={row.id} className="border-b last:border-b-0" style={{ borderColor: uiColors.border }}><td className="px-4 py-4 font-bold text-[#1D1916]">{row.id}</td><td className="px-4 py-4 font-display text-lg font-extrabold text-[#1D1916]">{row.name}</td><td className="px-4 py-4 font-bold text-[#6E6258]">{row.kind}</td><td className="px-4 py-4 font-bold text-[#6E6258]">{row.period}</td><td className="px-4 py-4 font-bold text-[#1D1916]">{row.owner}</td><td className="px-4 py-4 font-bold text-[#6E6258]">{row.updatedAt}</td><td className="px-4 py-4 font-bold text-[#1D1916]">{row.downloads}</td><td className="px-4 py-4"><StatusPill label={row.status} tone={row.status === "جاهز" || row.status === "مكتمل" ? "green" : "gold"} /></td><td className="px-4 py-4"><FinancialExportButton filename={`mahabah-${row.id}.csv`} rows={reportExportRows([row])} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>تحميل</FinancialExportButton></td></tr>)}</tbody></table></div></section>;
}

async function AdminReportsPage({ config, kind = "overview", searchParams = {} }: { config: DashboardRoleConfig; kind?: AdminReportKind; searchParams?: DashboardSearchParams }) {
  const meta = reportMeta[kind];
  const reportData = await loadAdminReportMetricsData();
  const distribution = adminReportDistribution(reportData);
  const q = stringParam(searchParams, "q").trim();
  const status = stringParam(searchParams, "status").trim();
  const rows = reportRowsForKind(kind, reportData).filter((row) => {
    const statusMatches = !status || status === "all" || normalizeDashboardSearch(row.status).includes(normalizeDashboardSearch(status));
    return statusMatches && matchesDashboardSearch(q, [row.id, row.name, row.kind, row.owner, row.period, row.status, row.downloads, row.updatedAt]);
  });
  const exportRows = reportExportRows(rows);
  const filename = `mahabah-admin-${kind}-reports.csv`;
  return <div className="grid gap-5"><DashboardTopbar config={config} /><AdminReportsHeader title={meta.title} subtitle={meta.subtitle} exportRows={exportRows} filename={filename} /><AdminReportsKpis cards={adminReportKpiCards(kind, reportData)} /><AdminReportsFilters activePath={meta.active} q={q} status={status} exportRows={exportRows} filename={filename} /><AdminReportsNav activePath={meta.active} />{kind !== "exports" ? <section className="grid gap-4 xl:grid-cols-[1.35fr_0.9fr]"><article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><h2 className="font-display text-xl font-extrabold text-[#1D1916]">اتجاه المؤشرات</h2><ReportsLineChart series={reportSeriesFromRows(rows)} /></article><article className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><h2 className="font-display text-xl font-extrabold text-[#1D1916]">توزيع التقارير</h2><div className="mt-5 flex flex-col items-center gap-5 md:flex-row md:justify-center"><ReportsDonut distribution={distribution} /><div className="grid min-w-44 gap-3">{distribution.map(([label, percent]) => <div key={label} className="flex items-center justify-between gap-6 text-sm font-bold"><span className="text-[#1D1916]">{label}</span><span className="text-[#6E6258]">{percent}%</span></div>)}</div></div></article></section> : null}<AdminReportsTable rows={rows} /></div>;
}

function ReportsLineChart({ series = reportSeries }: { series?: number[] }) {
  const safeSeries = series.length ? series : reportSeries;
  const minValue = Math.min(...safeSeries);
  const maxValue = Math.max(...safeSeries);
  const range = Math.max(1, maxValue - minValue);
  const points = safeSeries.map((value, index) => {
    const x = safeSeries.length === 1 ? 500 : 42 + (index * 902) / (safeSeries.length - 1);
    const y = 270 - ((value - minValue) / range) * 210;
    return `${x},${y}`;
  }).join(" ");
  return <svg viewBox="0 0 1000 320" className="h-[300px] w-full" role="img" aria-label="مخطط التقارير"><defs><linearGradient id="reportsArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#A7815E" stopOpacity="0.2" /><stop offset="100%" stopColor="#A7815E" stopOpacity="0" /></linearGradient></defs>{[0, 1, 2, 3, 4].map((line) => <line key={line} x1="30" x2="970" y1={55 + line * 52} y2={55 + line * 52} stroke="#E8DED4" />)}<polyline points={`42,270 ${points} 944,270`} fill="url(#reportsArea)" /><polyline points={points} fill="none" stroke="#A7815E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{points.split(" ").map((point) => { const [x, y] = point.split(",").map(Number); return <circle key={point} cx={x} cy={y} r="5" fill="#A7815E" stroke="#fff" strokeWidth="2" />; })}</svg>;
}

function ReportsDonut({ distribution }: { distribution: AdminReportDistributionItem[] }) {
  const colors = ["#A7815E", "#78C6AD", "#8E84C9", "#C8869A"];
  let cursor = 0;
  const stops = distribution.map(([, percent], index) => {
    const start = cursor;
    cursor += percent;
    return `${colors[index % colors.length]} ${start}% ${cursor}%`;
  }).join(", ");
  const background = cursor ? `conic-gradient(${stops})` : "#E8DED4";
  return <div className="relative shrink-0 rounded-full" style={{ width: 176, height: 176, background }}><div className="absolute grid place-items-center rounded-full bg-white text-center" style={{ inset: 40 }}><strong className="font-display text-2xl text-[#1D1916]">{distribution.length}</strong><span className="text-xs font-bold text-[#6E6258]">مصادر</span></div></div>;
}

type AdminSettingsKind = "site" | "identity" | "homepage" | "header" | "footer" | "notifications" | "messages" | "email" | "seo" | "integrations";

const settingsMeta: Record<AdminSettingsKind, { no: string; title: string; active: string; subtitle: string }> = {
  site: { no: "10.1", title: "إعدادات الموقع", active: "settings", subtitle: "إدارة معلومات الموقع الأساسية وحالة النظام والتفضيلات العامة." },
  identity: { no: "10.2", title: "إعدادات الهوية البصرية", active: "settings/identity", subtitle: "التحكم بالشعارات والألوان والخطوط وأنماط العناصر." },
  homepage: { no: "10.3", title: "إعدادات الصفحة الرئيسية", active: "settings/homepage", subtitle: "تخصيص العرض الرئيسي والأقسام والإحصائيات وتحسينات الصفحة." },
  header: { no: "10.4", title: "إعدادات الشريط الرئيسي", active: "settings/header", subtitle: "ترتيب عناصر القائمة وسلوك الشريط في الموقع العام." },
  footer: { no: "10.5", title: "إعدادات التذييل", active: "settings/footer", subtitle: "تكوين أقسام التذييل وروابط التواصل والهوية السفلية." },
  notifications: { no: "10.6", title: "إعدادات الإشعارات", active: "settings/notifications", subtitle: "ضبط قنوات الإشعار وأنواعها والمستلمين والتوقيت." },
  messages: { no: "10.7", title: "إعدادات الرسائل", active: "settings/messages", subtitle: "إدارة قوالب الرسائل وتصميمها وخيارات الإرسال." },
  email: { no: "10.8", title: "إعدادات البريد الإلكتروني", active: "settings/email", subtitle: "إعداد SMTP والمرسل الافتراضي وحدود الإرسال." },
  seo: { no: "10.9", title: "إعدادات SEO", active: "settings/seo", subtitle: "تحسين الظهور في محركات البحث والبيانات المنظمة." },
  integrations: { no: "10.10", title: "إعدادات التكاملات", active: "settings/integrations", subtitle: "إدارة الربط مع خدمات الدفع والتسويق والتحليلات والتخزين." },
};

const settingTabs = Object.values(settingsMeta).map((item) => [item.title.replace("إعدادات ", ""), item.active]);

function AdminSettingsHeader({ meta }: { meta: (typeof settingsMeta)[AdminSettingsKind] }) {
  return <section className="relative overflow-hidden rounded-[24px] border bg-white p-5 shadow-card md:p-6" style={{ borderColor: uiColors.border }}><Image src="/images/about-lobby.png" alt="" fill className="object-cover opacity-[0.12] grayscale sepia-[18%]" sizes="80vw" /><div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="text-sm font-extrabold text-[#A7815E]">الرئيسية ‹ الإعدادات ‹ {meta.title}</p><h1 className="mt-2 font-display text-3xl font-extrabold text-[#1D1916] md:text-4xl">{meta.no} {meta.title}</h1><p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-[#5f5953]">{meta.subtitle}</p></div><Link href={dashboardHref("admin", "settings")} className="inline-flex min-h-11 items-center justify-center rounded-xl border bg-white px-5 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}><ArrowLeft className="ml-2 h-4 w-4" />عودة إلى الإعدادات</Link></div></section>;
}

function AdminSettingsNav({ activePath }: { activePath: string }) {
  return <section className="flex flex-wrap gap-2">{settingTabs.map(([label, path]) => <Link key={path} href={dashboardHref("admin", path)} className={cn("inline-flex min-h-10 items-center justify-center rounded-xl border px-4 text-sm font-extrabold", activePath === path ? "bg-[#A7815E] text-white" : "bg-white text-[#1D1916]")} style={{ borderColor: activePath === path ? "#A7815E" : uiColors.border }}>{label}</Link>)}</section>;
}

function SettingsPanel({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return <section className={cn("min-w-0 rounded-[22px] border bg-white p-5 shadow-card", className)} style={{ borderColor: uiColors.border }}><h2 className="mb-4 font-display text-xl font-extrabold text-[#1D1916]">{title}</h2>{children}</section>;
}

function settingsFieldName(label: string) {
  const normalized = label
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "_")
    .replace(/^_+|_+$/g, "");
  return normalized ? `setting_${normalized}` : `setting_${Date.now()}`;
}

function platformSettingRecord(setting: DashboardPlatformSetting) {
  return setting.value && typeof setting.value === "object" && !Array.isArray(setting.value)
    ? setting.value as Record<string, unknown>
    : {};
}

function platformSettingBoolean(settings: DashboardPlatformSetting[], fieldName: string, fallback: boolean) {
  for (const setting of settings) {
    const value = platformSettingRecord(setting)[fieldName];
    if (typeof value === "boolean") return value;
    if (value === "enabled") return true;
    if (value === "disabled") return false;
  }
  return fallback;
}

function platformSettingString(settings: DashboardPlatformSetting[], fieldName: string, fallback: string) {
  for (const setting of settings) {
    const value = platformSettingRecord(setting)[fieldName];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return fallback;
}

function SettingsInput({ label, value, wide = false, name, type = "text", required = false }: { label: string; value: string; wide?: boolean; name?: string; type?: string; required?: boolean }) {
  return <label className={cn("grid gap-2 text-sm font-extrabold text-[#1D1916]", wide && "md:col-span-2")}><span>{label}</span><input name={name ?? settingsFieldName(label)} type={type} defaultValue={value} required={required} className="h-12 rounded-xl border bg-[#fffdf9] px-4 text-sm font-bold text-[#5f5953] outline-none focus:border-[#A7815E]" style={{ borderColor: uiColors.border }} /></label>;
}

function SettingsSelect({ label, value, name, options }: { label: string; value: string; name?: string; options?: string[] }) {
  const choices = Array.from(new Set([value, ...(options ?? ["نشط", "غير نشط", "العربية", "الرياض (GMT+3)"])]));
  return <label className="grid gap-2 text-sm font-extrabold text-[#1D1916]"><span>{label}</span><select name={name ?? settingsFieldName(label)} defaultValue={value} className="h-12 rounded-xl border bg-[#fffdf9] px-4 text-sm font-bold text-[#5f5953] outline-none focus:border-[#A7815E]" style={{ borderColor: uiColors.border }}>{choices.map((choice) => <option key={choice} value={choice}>{choice}</option>)}</select></label>;
}

function SettingsCheckboxSwitch({ name, defaultChecked = true, readOnly = false, label }: { name: string; defaultChecked?: boolean; readOnly?: boolean; label?: string }) {
  return <label className={cn("inline-flex justify-center", readOnly ? "cursor-default" : "cursor-pointer")} aria-label={label}>
    <input name={name} type="checkbox" defaultChecked={defaultChecked} disabled={readOnly} className="peer sr-only" />
    <span className="relative inline-flex h-6 w-11 rounded-full bg-[#cfc8c1] transition peer-checked:bg-[#A7815E] peer-disabled:opacity-90">
      <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:right-6" />
    </span>
  </label>;
}

function SettingsActionButton({ settingsKey, label, payload, className, style, children }: { settingsKey: string; label: string; payload?: Record<string, string | number | boolean | null>; className?: string; style?: CSSProperties; children: ReactNode }) {
  return <AdminManagementActionButton action="settings_save" slug={settingsKey} title={label} payload={{ label, ...payload }} className={className} style={style}>{children}</AdminManagementActionButton>;
}

function SettingsToggleRow({ label, detail, on = true }: { label: string; detail?: string; on?: boolean }) {
  const fieldName = settingsFieldName(label);
  return <div className="flex w-full items-center justify-between gap-4 border-b py-3 text-right last:border-b-0" style={{ borderColor: uiColors.border }}><span><span className="block text-sm font-extrabold text-[#1D1916]">{label}</span>{detail ? <span className="mt-1 block text-xs font-bold text-[#8A7E73]">{detail}</span> : null}</span><SettingsCheckboxSwitch name={fieldName} defaultChecked={on} label={label} /></div>;
}

function SettingsSaveBar({ settingsKey = "admin_settings", label = "إعدادات الإدارة", section }: { settingsKey?: string; label?: string; section?: string }) {
  return <div className="flex justify-start"><AdminManagementActionButton action="settings_save" slug={settingsKey} title={label} payload={{ label, ...(section ? { section } : {}) }} className="min-h-11 rounded-xl bg-[#A7815E] px-6 text-sm font-extrabold text-white">حفظ التغييرات</AdminManagementActionButton></div>;
}

function SiteMiniPreview({ compact = false }: { compact?: boolean }) {
  return <div className="overflow-hidden rounded-[18px] border bg-[#fbf8f4]" style={{ borderColor: uiColors.border }}><div className="flex items-center justify-between p-4"><strong className="font-display text-2xl text-[#1D1916]">مهابة</strong><span className="text-xl">☰</span></div><div className="relative grid min-h-[220px] place-items-center overflow-hidden p-6 text-center"><Image src="/images/about-lobby.png" alt="" fill className="object-cover opacity-25 grayscale sepia" sizes="420px" /><div className="relative"><h3 className="font-display text-2xl font-extrabold text-[#1D1916]">{compact ? "مرحباً بك في مهابة" : "استثمر بثقة في عقارك"}</h3><p className="mt-2 text-sm font-bold leading-7 text-[#5f5953]">منصة متكاملة لإدارة الأصول والمساهمات العقارية بكفاءة وشفافية</p><div className="mt-4 flex justify-center gap-2"><Link href="/" className="rounded-lg bg-[#A7815E] px-4 py-2 text-xs font-extrabold text-white">استكشف المنصة</Link><Link href="/contact" className="rounded-lg border bg-white px-4 py-2 text-xs font-extrabold text-[#1D1916]" style={{ borderColor: uiColors.border }}>تواصل معنا</Link></div></div></div><div className="flex justify-center gap-2 pb-3">{[0, 1, 2, 3].map((dot) => <span key={dot} className={cn("h-2 w-2 rounded-full", dot === 0 ? "bg-[#A7815E]" : "bg-[#e4d8cb]")} />)}</div></div>;
}

function AdminSettingsShell({ config, kind, children }: { config: DashboardRoleConfig; kind: AdminSettingsKind; children: ReactNode }) {
  const meta = settingsMeta[kind];
  return <div className="grid gap-5" data-dashboard-form><DashboardTopbar config={config} /><AdminSettingsHeader meta={meta} /><AdminSettingsNav activePath={meta.active} />{children}</div>;
}

function AdminSiteSettingsPage({ config }: { config: DashboardRoleConfig }) {
  return <AdminSettingsShell config={config} kind="site"><section className="grid gap-4 xl:grid-cols-[1fr_300px]"><SettingsPanel title="معلومات الموقع"><div className="grid gap-4 md:grid-cols-2"><SettingsInput label="اسم الموقع" value="مهابة - إدارة المساهمات العقارية" wide /><SettingsInput label="البريد الإلكتروني العام" value="info@mahabah.sa" /><SettingsInput label="رقم الهاتف العام" value="+966 11 123 4567" /><SettingsInput label="عنوان الموقع" value="الرياض، المملكة العربية السعودية" wide /><label className="grid gap-2 md:col-span-2"><span className="text-sm font-extrabold text-[#1D1916]">نبذة عن الموقع</span><textarea name="setting_site_description" defaultValue="منصة متكاملة لإدارة المساهمات العقارية، تتيح للمستخدمين إدارة الأصول، الخدمات والتقارير بكفاءة وشفافية تامة." className="min-h-24 rounded-xl border bg-[#fffdf9] p-4 text-sm font-bold text-[#5f5953] outline-none" style={{ borderColor: uiColors.border }} /></label></div></SettingsPanel><div className="grid gap-4"><SettingsPanel title="معلومات النظام"><div className="grid gap-3 text-sm font-bold text-[#5f5953]">{[["إصدار النظام", "v2.6.0"], ["آخر تحديث", "15 مايو 2026"], ["بيئة التشغيل", "Production"], ["عنوان الموقع", "https://mahabah.sa"]].map(([a, b]) => <div key={a} className="flex justify-between gap-4"><span>{a}</span><strong className="text-[#1D1916]">{b}</strong></div>)}</div></SettingsPanel><SettingsPanel title="مساعدة"><p className="text-sm font-bold leading-7 text-[#5f5953]">تتيح هذه الصفحة إدارة المعلومات الأساسية مثل الاسم والشعار وطرق التواصل.</p></SettingsPanel></div></section><SettingsPanel title="إعدادات عامة"><div className="grid gap-4 md:grid-cols-3"><SettingsSelect label="تنسيق التاريخ" value="يوم / شهر / سنة" /><SettingsSelect label="اللغة الافتراضية" value="العربية" /><SettingsSelect label="المنطقة الزمنية" value="الرياض (GMT+3)" /><SettingsSelect label="حالة الموقع" value="نشط" /><SettingsSelect label="عدد العناصر في الصفحة" value="20" /><SettingsToggleRow label="تفعيل وضع الصيانة" detail="تعطيل الوصول العام إلى الموقع" on={false} /></div></SettingsPanel><SettingsSaveBar settingsKey="site-settings" label="إعدادات الموقع" section="site" /></AdminSettingsShell>;
}

function AdminIdentitySettingsPage({ config }: { config: DashboardRoleConfig }) {
  const colors = [["Copper Light", "#B89A7A"], ["Warm Beige", "#C8B8A4"], ["Soft Stone", "#D9D1C7"], ["Light Background", "#F6F4F1"], ["White", "#FFFFFF"], ["النحاسي", "#A7815E"], ["الأسود الفاخر", "#1D1916"]];
  return <AdminSettingsShell config={config} kind="identity"><section className="grid gap-4 xl:grid-cols-[0.8fr_1.4fr]"><SettingsPanel title="معاينة الهوية البصرية"><SiteMiniPreview compact /></SettingsPanel><div className="grid gap-4"><SettingsPanel title="الشعار"><div className="grid gap-4 md:grid-cols-3">{["الشعار الرئيسي", "الشعار الثانوي", "أيقونة الموقع"].map((label, index) => <div key={label} className="grid place-items-center gap-3 rounded-2xl border p-5 text-center" style={{ borderColor: uiColors.border }}><div className={cn("grid h-24 w-full place-items-center rounded-xl", index === 2 ? "bg-[#1D1916]" : "bg-white")}><strong className={cn("font-display text-3xl", index === 2 ? "text-white" : "text-[#1D1916]")}>{index === 2 ? "م" : "مهابة"}</strong></div><p className="text-sm font-extrabold text-[#5f5953]">{label}</p><div className="flex gap-2"><DashboardDocumentUploadButton scope="admin" entityType="brand_asset" label={label} className="grid cursor-pointer rounded-lg border p-2" style={{ borderColor: uiColors.border }}><UploadCloud className="h-4 w-4" /></DashboardDocumentUploadButton><SettingsActionButton settingsKey={"brand-asset-delete-" + label} label={"حذف " + label} payload={{ asset: label, deleteRequested: true }} className="rounded-lg border px-3 py-2 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>حذف</SettingsActionButton></div></div>)}</div></SettingsPanel><SettingsPanel title="الألوان"><div className="grid grid-cols-2 gap-3 md:grid-cols-7">{colors.map(([name, color]) => <div key={name} className="text-center"><span className="block h-16 rounded-xl border" style={{ backgroundColor: color, borderColor: uiColors.border }} /><p className="mt-2 text-xs font-bold text-[#5f5953]">{name}</p><p className="text-xs font-extrabold text-[#1D1916]">{color}</p></div>)}</div></SettingsPanel></div></section><section className="grid gap-4 lg:grid-cols-3"><SettingsPanel title="الخطوط"><div className="grid gap-3"><SettingsInput label="الخط الأساسي" value="Tajawal Bold" /><SettingsInput label="الخط الثانوي" value="Tajawal Regular" /></div></SettingsPanel><SettingsPanel title="أنماط العناصر"><div className="grid gap-3"><SettingsActionButton settingsKey="identity-primary-button" label="تحديث الزر الأساسي" payload={{ component: "primary_button" }} className="min-h-11 rounded-xl bg-[#A7815E] px-4 text-sm font-extrabold text-white">زر أساسي</SettingsActionButton><SettingsActionButton settingsKey="identity-secondary-button" label="تحديث الزر الثانوي" payload={{ component: "secondary_button" }} className="min-h-11 rounded-xl border bg-white px-4 text-sm font-extrabold text-[#1D1916]" style={{ borderColor: uiColors.border }}>زر ثانوي</SettingsActionButton><SettingsInput label="حقول الإدخال" value="نص الحقل" /></div></SettingsPanel><SettingsPanel title="الخلفيات والأنماط"><div className="grid grid-cols-2 gap-3"><div className="h-28 rounded-xl border bg-[#f7f5f2]" style={{ borderColor: uiColors.border }} /><div className="relative h-28 overflow-hidden rounded-xl border" style={{ borderColor: uiColors.border }}><Image src="/images/about-lobby.png" alt="" fill className="object-cover opacity-60 grayscale sepia" sizes="220px" /></div></div></SettingsPanel></section><SettingsSaveBar settingsKey="identity-settings" label="إعدادات الهوية البصرية" section="identity" /></AdminSettingsShell>;
}

async function AdminHomepageSettingsPage({ config }: { config: DashboardRoleConfig }) {
  const settings = await listDashboardPlatformSettings();
  const sections = ["شركاؤنا", "أحدث الأخبار", "الإحصائيات", "عن مهابة", "خدماتنا", "المشاريع المميزة"];
  const sectionVisible = (item: string, fallback: boolean) => platformSettingBoolean(settings.data, `homepage_section_${settingsFieldName(item)}_visible`, fallback);
  return <AdminSettingsShell config={config} kind="homepage"><section className="grid gap-4 xl:grid-cols-[0.9fr_1.6fr]"><SettingsPanel title="معاينة الصفحة الرئيسية"><SiteMiniPreview /></SettingsPanel><SettingsPanel title="إعدادات العرض"><div className="grid gap-4 lg:grid-cols-3"><div className="relative min-h-40 overflow-hidden rounded-xl border" style={{ borderColor: uiColors.border }}><Image src="/images/about-lobby.png" alt="" fill className="object-cover opacity-70 grayscale sepia" sizes="300px" /></div><div className="grid gap-3 lg:col-span-2"><SettingsSelect label="نوع العرض" value="منزلق (Slider)" /><SettingsInput label="العنوان الرئيسي" value="استثمر بثقة في عقارك" /><SettingsInput label="النص الفرعي" value="منصة متكاملة لإدارة الأصول والمساهمات العقارية بكفاءة وشفافية" /><SettingsToggleRow label="الانتقال التلقائي" /><SettingsToggleRow label="عرض نقاط التنقل" /></div></div></SettingsPanel></section><SettingsPanel title="الأقسام الظاهرة في الصفحة الرئيسية"><div className="grid gap-3 md:grid-cols-6">{sections.map((item, index) => <div key={item} className="flex min-h-12 items-center justify-between rounded-xl border bg-[#fffdf9] px-4 text-sm font-extrabold text-[#1D1916]" style={{ borderColor: uiColors.border }}><span>{item}</span><SettingsCheckboxSwitch name={`homepage_section_${settingsFieldName(item)}_visible`} defaultChecked={sectionVisible(item, index !== 0)} label={`عرض قسم ${item}`} /></div>)}</div></SettingsPanel><section className="grid gap-4 lg:grid-cols-3"><SettingsPanel title="إعدادات SEO للصفحة الرئيسية"><div className="grid gap-3"><SettingsInput label="عنوان الصفحة" value="منصة إدارة المساهمات العقارية | مهابة" /><SettingsInput label="الوصف التعريفي" value="منصة متكاملة لإدارة الأصول والمساهمات العقارية بكفاءة وشفافية عالية." /><SettingsInput label="الكلمات المفتاحية" value="مساهمات عقارية، إدارة أصول، استثمار عقاري" /></div></SettingsPanel><SettingsPanel title="إعدادات الإحصائيات"><div className="grid gap-3">{["إجمالي الأصول المدارة", "عدد المساهمات", "عدد المستثمرين", "القيمة الإجمالية"].map((item) => <SettingsToggleRow key={item} label={item} />)}<SettingsActionButton settingsKey="homepage-stat-add" label="إضافة إحصائية" payload={{ section: "homepage_stats", createRequested: true }} className="min-h-11 rounded-xl border text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إضافة إحصائية +</SettingsActionButton></div></SettingsPanel><SettingsPanel title="إعدادات المشاريع المميزة"><div className="grid gap-3"><SettingsSelect label="عدد المشاريع المعروضة" value="6 مشاريع" /><SettingsSelect label="ترتيب العرض" value="الأحدث أولاً" /><SettingsToggleRow label="عرض أزرار التنقل" /><SettingsToggleRow label="عرض زر عرض جميع المشاريع" /></div></SettingsPanel></section><SettingsSaveBar settingsKey="homepage-settings" label="إعدادات الصفحة الرئيسية" section="homepage" /></AdminSettingsShell>;
}

const headerItems = [["الرئيسية", "الصفحة الرئيسية", true], ["عن مهابة", "/about", true], ["المشاريع", "/projects", true], ["الخدمات", "/services", true], ["الأخبار", "/news", true], ["تواصل معنا", "/contact", true], ["الوظائف", "/careers", false]] as const;

async function AdminHeaderSettingsPage({ config }: { config: DashboardRoleConfig }) {
  const settings = await listDashboardPlatformSettings();
  const headerNavActive = (label: string, fallback: boolean) => platformSettingBoolean(settings.data, `header_nav_${settingsFieldName(label)}_active`, fallback);
  return <AdminSettingsShell config={config} kind="header"><section className="grid gap-4 xl:grid-cols-[0.9fr_1.4fr_0.8fr]"><SettingsPanel title="معاينة الشريط الرئيسي"><SiteMiniPreview /></SettingsPanel><SettingsPanel title="عناصر الشريط الرئيسي"><div className="overflow-x-auto"><table className="w-full text-sm" style={{ minWidth: 560 }}><thead><tr className="border-b text-[#6E6258]" style={{ borderColor: uiColors.border }}><th className="py-3 text-right">#</th><th className="py-3 text-right">العنصر</th><th className="py-3 text-right">الرابط</th><th className="py-3 text-right">مفعل</th><th className="py-3 text-right">ترتيب</th></tr></thead><tbody>{headerItems.map(([label, link, active], index) => <tr key={label} className="border-b last:border-b-0" style={{ borderColor: uiColors.border }}><td className="py-3 font-bold">{String(index + 1).padStart(2, "0")}</td><td className="py-3 font-extrabold text-[#1D1916]">{label}</td><td className="py-3"><span className="rounded-lg border px-3 py-2 text-xs font-bold text-[#5f5953]" style={{ borderColor: uiColors.border }}>{link}</span></td><td className="py-3"><SettingsCheckboxSwitch name={`header_nav_${settingsFieldName(label)}_active`} defaultChecked={headerNavActive(label, active)} label={`تفعيل ${label}`} /></td><td className="py-3"><span className="rounded-lg border px-3 py-2 text-xs font-bold" style={{ borderColor: uiColors.border }}>{index + 1}</span></td></tr>)}</tbody></table></div><SettingsActionButton settingsKey="header-nav-add" label="إضافة عنصر جديد" payload={{ section: "header_navigation", createRequested: true }} className="mt-4 min-h-11 w-full rounded-xl border text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إضافة عنصر جديد +</SettingsActionButton></SettingsPanel><SettingsPanel title="إعدادات عامة"><div className="grid gap-4"><SettingsSelect label="نمط الشريط" value="شفاف (Transparent)" /><SettingsSelect label="تثبيت الشريط" value="تثبيت عند التمرير" /><div className="grid grid-cols-3 gap-2 text-center text-xs font-bold"><SettingsActionButton settingsKey="header-style-transparent" label="تغيير نمط الشريط إلى شفاف" payload={{ headerStyle: "transparent" }} className="rounded-xl border p-3" style={{ borderColor: uiColors.border }}>شفاف</SettingsActionButton><SettingsActionButton settingsKey="header-style-light" label="تغيير نمط الشريط إلى فاتح" payload={{ headerStyle: "light" }} className="rounded-xl border p-3" style={{ borderColor: uiColors.border }}>فاتح</SettingsActionButton><SettingsActionButton settingsKey="header-style-dark" label="تغيير نمط الشريط إلى داكن" payload={{ headerStyle: "dark" }} className="rounded-xl border bg-[#1D1916] p-3 text-white" style={{ borderColor: uiColors.border }}>داكن</SettingsActionButton></div><SettingsToggleRow label="عرض الشريط في الجوال" /><SettingsToggleRow label="إظهار زر طلب استشارة" /><SettingsToggleRow label="إظهار اللغة" on={false} /></div></SettingsPanel></section><SettingsSaveBar settingsKey="header-settings" label="إعدادات الشريط الرئيسي" section="header" /></AdminSettingsShell>;
}

async function AdminFooterSettingsPage({ config }: { config: DashboardRoleConfig }) {
  const settings = await listDashboardPlatformSettings();
  const socialUrls = ["https://x.com/mahabah_sa", "https://instagram.com/mahabah_sa", "https://linkedin.com/company/mahabah", "https://youtube.com/@mahabah_sa"].map((url, index) => platformSettingString(settings.data, `setting_footer_social_${index + 1}`, url));
  const socialActive = (index: number) => platformSettingBoolean(settings.data, `setting_footer_social_${index + 1}_active`, index !== 3);
  const footerContentItems = ["عن مهابة", "الرؤية والرسالة", "فريق العمل", "الإنجازات"];

  return (
    <AdminSettingsShell config={config} kind="footer">
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr_1fr]">
        <SettingsPanel title="معاينة التذييل">
          <div className="rounded-2xl bg-[#1D1916] p-6 text-white">
            <h3 className="font-display text-3xl">مهابة</h3>
            <p className="mt-3 max-w-sm text-sm leading-7 text-[#F6F4F1]">منصة متكاملة لإدارة الأصول والمساهمات العقارية بكفاءة وشفافية</p>
            <div className="mt-5 grid gap-3 text-sm md:grid-cols-3">
              <div>إدارة الأصول العقارية<br />إدارة المساهمات<br />الخدمات</div>
              <div>الرئيسية<br />عن مهابة<br />المشاريع</div>
              <div>+966 11 123 4567<br />info@mahabah.sa<br />mahabah.sa</div>
            </div>
          </div>
        </SettingsPanel>
        <SettingsPanel title="الشعار والوصف">
          <div className="grid gap-3">
            <div className="grid h-28 place-items-center rounded-xl border" style={{ borderColor: uiColors.border }}>
              <strong className="font-display text-3xl text-[#1D1916]">مهابة</strong>
            </div>
            <SettingsInput label="الوصف" value="منصة متكاملة لإدارة الأصول والمساهمات العقارية بكفاءة وشفافية" />
          </div>
        </SettingsPanel>
        <SettingsPanel title="أقسام التذييل">
          <div className="grid gap-2">
            {["عن الشركة", "روابط سريعة", "الخدمات", "تواصل معنا", "النشرة البريدية", "وسائل التواصل الاجتماعي"].map((item) => <SettingsToggleRow key={item} label={item} />)}
            <SettingsActionButton settingsKey="footer-section-add" label="إضافة قسم تذييل" payload={{ section: "footer", createRequested: true }} className="min-h-11 rounded-xl border text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>
              إضافة قسم جديد +
            </SettingsActionButton>
          </div>
        </SettingsPanel>
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        <SettingsPanel title="محتوى الأقسام">
          <div className="grid gap-2">
            {footerContentItems.map((item, index) => (
              <div key={item} className="flex min-h-10 items-center justify-between gap-3 rounded-lg border px-3 text-sm font-bold" style={{ borderColor: uiColors.border }}>
                <span>{item}</span>
                <SettingsActionButton
                  settingsKey={`footer-content-${settingsFieldName(item)}`}
                  label={`تعديل محتوى ${item}`}
                  payload={{ section: "footer_content", item, order: index + 1 }}
                  className="rounded-lg border px-3 py-1 text-xs font-extrabold text-[#8F6B4C]"
                  style={{ borderColor: uiColors.border }}
                >
                  تعديل
                </SettingsActionButton>
              </div>
            ))}
          </div>
        </SettingsPanel>
        <SettingsPanel title="وسائل التواصل الاجتماعي">
          <div className="grid gap-3">
            {socialUrls.map((url, index) => (
              <div key={`${url}-${index}`} className="flex items-center gap-2">
                <SettingsCheckboxSwitch name={`setting_footer_social_${index + 1}_active`} defaultChecked={socialActive(index)} label={`تفعيل رابط التواصل ${index + 1}`} />
                <input name={`setting_footer_social_${index + 1}`} defaultValue={url} className="h-10 flex-1 rounded-lg border px-3 text-xs font-bold" style={{ borderColor: uiColors.border }} />
              </div>
            ))}
          </div>
        </SettingsPanel>
        <SettingsPanel title="إعدادات التذييل">
          <div className="grid gap-3">
            <SettingsInput label="لون الخلفية" value="#1D1916" />
            <SettingsInput label="لون النص" value="#F6F4F1" />
            <SettingsInput label="لون الروابط" value="#A7815E" />
            <SettingsSelect label="محاذاة المحتوى" value="وسط" />
          </div>
        </SettingsPanel>
      </section>
      <SettingsSaveBar settingsKey="footer-settings" label="إعدادات التذييل" section="footer" />
    </AdminSettingsShell>
  );
}

async function AdminNotificationSettingsPage({ config }: { config: DashboardRoleConfig }) {
  const settings = await listDashboardPlatformSettings();
  const types = ["المساهمات", "المشاريع", "المدفوعات والفواتير", "التقارير", "النظام والتحديثات"];
  const notificationChannelActive = (type: string, col: number, fallback: boolean) => platformSettingBoolean(settings.data, `notification_${settingsFieldName(type)}_${col}`, fallback);
  return <AdminSettingsShell config={config} kind="notifications"><section className="grid gap-4 xl:grid-cols-[0.8fr_1fr_1fr]"><SettingsPanel title="معاينة الإشعارات"><div className="grid gap-3 rounded-xl bg-[#fbf8f4] p-4">{["تم استلام مساهمة جديدة", "تم تحديث حالة مشروع", "تم إضافة أصل عقاري جديد", "تم استلام رسالة جديدة"].map((item, index) => <div key={item} className="flex items-center justify-between rounded-xl bg-white p-3 text-sm font-bold text-[#1D1916]"><span>{item}</span><span className="text-xs text-[#8A7E73]">منذ {index + 1}0 دقيقة</span></div>)}</div><SettingsActionButton settingsKey="notifications-preview-customize" label="تخصيص معاينة الإشعارات" payload={{ section: "notifications_preview" }} className="mt-4 min-h-10 w-full rounded-xl border text-sm font-extrabold" style={{ borderColor: uiColors.border }}>تخصيص المعاينة</SettingsActionButton></SettingsPanel><SettingsPanel title="إعدادات عامة"><SettingsToggleRow label="تفعيل الإشعارات" detail="تفعيل أو إيقاف جميع الإشعارات في النظام" /><SettingsToggleRow label="الإشعارات داخل النظام" /><SettingsToggleRow label="الإشعارات الصوتية" on={false} /><SettingsToggleRow label="الاهتزاز للأجهزة المحمولة" /><SettingsSelect label="تجميع الإشعارات" value="كل 15 دقيقة" /></SettingsPanel><SettingsPanel title="قنوات الإشعارات"><SettingsToggleRow label="داخل النظام" detail="عرض الإشعارات في لوحة التحكم" /><SettingsToggleRow label="البريد الإلكتروني" detail="إرسال الإشعارات عبر البريد الإلكتروني" /><SettingsToggleRow label="رسائل SMS" on={false} /><SettingsToggleRow label="إشعارات الجوال" /><SettingsToggleRow label="إشعارات المتصفح" on={false} /></SettingsPanel></section><section className="grid gap-4 lg:grid-cols-[0.7fr_1.2fr_0.8fr]"><SettingsPanel title="توقيت الإشعارات"><div className="grid gap-3"><SettingsInput label="وقت البدء" value="08:00 AM" /><SettingsInput label="وقت الانتهاء" value="08:00 PM" /><div className="flex flex-wrap gap-2">{["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"].map((day) => <span key={day} className="rounded-lg bg-[#A7815E] px-3 py-2 text-xs font-bold text-white">{day}</span>)}</div></div></SettingsPanel><SettingsPanel title="أنواع الإشعارات"><div className="overflow-x-auto"><table className="w-full text-sm" style={{ minWidth: 560 }}><thead><tr className="text-[#6E6258]"><th className="py-2 text-right">نوع الإشعار</th><th>داخل النظام</th><th>البريد</th><th>SMS</th><th>الجوال</th></tr></thead><tbody>{types.map((type, index) => <tr key={type} className="border-t" style={{ borderColor: uiColors.border }}><td className="py-3 font-extrabold text-[#1D1916]">{type}</td>{[0, 1, 2, 3].map((col) => <td key={col} className="text-center"><SettingsCheckboxSwitch name={`notification_${settingsFieldName(type)}_${col}`} defaultChecked={notificationChannelActive(type, col, index + col !== 5)} label={`${type} - قناة ${col + 1}`} /></td>)}</tr>)}</tbody></table></div></SettingsPanel><SettingsPanel title="مستلمو الإشعارات"><div className="grid gap-3">{["جميع المستخدمين", "مدراء النظام فقط", "مجموعات محددة"].map((item, index) => <div key={item} className="flex items-center justify-between rounded-xl border p-3 text-sm font-extrabold" style={{ borderColor: uiColors.border }}><span>{item}</span><SettingsCheckboxSwitch name={`notification_recipient_${settingsFieldName(item)}`} defaultChecked={index === 1} label={`تفعيل مستلم ${item}`} /></div>)}<SettingsActionButton settingsKey="notifications-recipients-manage" label="إدارة مستلمي الإشعارات" payload={{ section: "notification_recipients" }} className="min-h-10 rounded-xl border text-sm font-extrabold" style={{ borderColor: uiColors.border }}>إدارة المستلمين</SettingsActionButton></div></SettingsPanel></section><SettingsSaveBar settingsKey="notifications-settings" label="إعدادات الإشعارات" section="notifications" /></AdminSettingsShell>;
}

async function AdminMessageSettingsPage({ config }: { config: DashboardRoleConfig }) {
  const settings = await listDashboardPlatformSettings();
  const templates = ["تأكيد التسجيل", "تأكيد البريد الإلكتروني", "إعادة تعيين كلمة المرور", "تغيير كلمة المرور", "تأكيد إنشاء مساهمة", "رسالة عامة"];
  const templateActive = (item: string, fallback: boolean) => platformSettingBoolean(settings.data, `message_template_${settingsFieldName(item)}_active`, fallback);
  return <AdminSettingsShell config={config} kind="messages"><section className="grid gap-4 xl:grid-cols-[0.8fr_1.6fr]"><SettingsPanel title="معاينة الرسائل"><SiteMiniPreview compact /><h3 className="mt-5 font-display text-lg font-extrabold text-[#1D1916]">متغيرات الرسائل المتاحة</h3><div className="mt-3 flex flex-wrap gap-2">{["{{site_name}}", "{{user_name}}", "{{user_email}}", "{{reset_link}}", "{{activation_link}}", "{{date}}", "{{time}}", "{{support_email}}"].map((item) => <span key={item} className="rounded-lg border bg-[#fffdf9] px-3 py-2 text-xs font-extrabold" style={{ borderColor: uiColors.border }}>{item}</span>)}</div></SettingsPanel><SettingsPanel title="قوالب الرسائل"><div className="overflow-x-auto"><table className="w-full text-sm" style={{ minWidth: 760 }}><thead><tr className="text-[#6E6258]"><th className="py-3 text-right">القالب</th><th className="text-right">الوصف</th><th>الحالة</th><th>إجراء</th></tr></thead><tbody>{templates.map((item, index) => <tr key={item} className="border-t" style={{ borderColor: uiColors.border }}><td className="py-3 font-extrabold text-[#1D1916]">{item}</td><td className="py-3 font-bold text-[#5f5953]">إرسال عند {index < 3 ? "تفعيل إجراء مهم في النظام" : "تحديث بيانات المستخدم"}</td><td className="text-center"><SettingsCheckboxSwitch name={`message_template_${settingsFieldName(item)}_active`} defaultChecked={templateActive(item, index !== 3 && index !== 5)} label={`تفعيل قالب ${item}`} /></td><td className="text-center"><SettingsActionButton settingsKey={"message-template-" + item} label={"تعديل قالب " + item} payload={{ template: item }} className="rounded-lg border px-3 py-2 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>تعديل</SettingsActionButton></td></tr>)}</tbody></table></div><SettingsActionButton settingsKey="message-template-add" label="إضافة قالب رسالة جديد" payload={{ section: "message_templates", createRequested: true }} className="mt-4 min-h-11 w-full rounded-xl border text-sm font-extrabold" style={{ borderColor: uiColors.border }}>إضافة قالب رسالة جديد +</SettingsActionButton></SettingsPanel></section><section className="grid gap-4 lg:grid-cols-3"><SettingsPanel title="تصميم الرسائل"><div className="grid gap-3"><SettingsSelect label="عرض المحتوى" value="عرض الجوال" /><SettingsSelect label="النمط" value="فاتح" /><SettingsInput label="لون أساسي" value="#A7815E" /><SettingsInput label="لون النص" value="#1D1916" /></div></SettingsPanel><SettingsPanel title="معاينة التصميم"><div className="rounded-2xl border bg-[#F6F4F1] p-5 text-center" style={{ borderColor: uiColors.border }}><strong className="font-display text-3xl text-[#1D1916]">مهابة</strong><p className="mt-4 font-extrabold text-[#1D1916]">{"{{user_name}}"}</p><p className="mt-2 text-sm font-bold text-[#5f5953]">نص الرسالة يظهر هنا.</p><SettingsActionButton settingsKey="message-preview-confirm-email" label="حفظ زر تأكيد البريد الإلكتروني" payload={{ templateAction: "confirm_email" }} className="mt-4 rounded-lg bg-[#A7815E] px-4 py-2 text-xs font-extrabold text-white">تأكيد البريد الإلكتروني</SettingsActionButton></div></SettingsPanel><SettingsPanel title="إعدادات متقدمة"><SettingsToggleRow label="تفعيل إرسال الرسائل" /><SettingsToggleRow label="استخدام طابور الإرسال" /><SettingsToggleRow label="إعادة المحاولة في حال الفشل" /><SettingsSelect label="عدد مرات إعادة المحاولة" value="3 مرات" /><SettingsSelect label="فترة الانتظار بين المحاولات" value="5 دقائق" /></SettingsPanel></section><SettingsSaveBar settingsKey="messages-settings" label="إعدادات الرسائل" section="messages" /></AdminSettingsShell>;
}

function AdminEmailSettingsPage({ config }: { config: DashboardRoleConfig }) {
  const emailTemplates = ["تأكيد التسجيل", "إعادة تعيين كلمة المرور", "إشعارات النظام", "التقارير الدورية", "إشعارات المشاريع"];
  const trustedDomains = ["mahabah.sa", "mahabah.com", "mahabah.net"];

  return (
    <AdminSettingsShell config={config} kind="email">
      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr_0.8fr]">
        <SettingsPanel title="معاينة البريد الإلكتروني">
          <SiteMiniPreview compact />
          <div className="mt-4 grid gap-2">
            {emailTemplates.map((item) => (
              <div key={item} className="flex justify-between rounded-lg border px-3 py-2 text-sm font-bold" style={{ borderColor: uiColors.border }}>
                <span>{item}</span>
                <span>3 قوالب</span>
              </div>
            ))}
          </div>
          <SettingsActionButton settingsKey="email-template-add" label="إضافة قالب بريد جديد" payload={{ section: "email_templates", createRequested: true }} className="mt-4 min-h-10 w-full rounded-xl border text-sm font-extrabold" style={{ borderColor: uiColors.border }}>
            إضافة قالب جديد +
          </SettingsActionButton>
        </SettingsPanel>
        <div className="grid gap-4">
          <SettingsPanel title="إعدادات SMTP">
            <div className="grid gap-3 md:grid-cols-2">
              <SettingsInput label="اسم المضيف SMTP Host" value="smtp.mahabah.sa" />
              <SettingsInput label="منفذ SMTP" value="587" />
              <SettingsInput label="اسم المستخدم" value="no-reply@mahabah.sa" />
              <SettingsInput label="كلمة المرور" value="••••••••••••••" />
              <SettingsSelect label="بروتوكول الأمان" value="STARTTLS" />
              <SettingsSelect label="التشفير" value="TLS" />
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              <SettingsToggleRow label="تفعيل المستخدم وكلمة المرور" />
              <SettingsToggleRow label="السماح بالإرسال من نطاقات متعددة" on={false} />
            </div>
            <SettingsActionButton settingsKey="email-smtp-test" label="اختبار اتصال SMTP" payload={{ section: "smtp", testRequested: true }} className="mt-4 min-h-10 rounded-xl border px-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>
              اختبار الاتصال
            </SettingsActionButton>
          </SettingsPanel>
          <SettingsPanel title="إعدادات المرسل الافتراضي">
            <div className="grid gap-3 md:grid-cols-2">
              <SettingsInput label="البريد الإلكتروني المرسل" value="no-reply@mahabah.sa" />
              <SettingsInput label="اسم المرسل" value="مهابة - إدارة المساهمات العقارية" />
              <SettingsInput label="عنوان الرد" value="support@mahabah.sa" wide />
            </div>
          </SettingsPanel>
        </div>
        <div className="grid gap-4">
          <SettingsPanel title="إعدادات عامة">
            <SettingsToggleRow label="تفعيل خدمة البريد الإلكتروني" />
            <SettingsToggleRow label="استخدام إعدادات SMTP المخصصة" />
            <SettingsToggleRow label="تفعيل التحقق من شهادة SSL" />
            <SettingsToggleRow label="تفعيل سجل عمليات الإرسال" />
            <SettingsToggleRow label="إرسال نسخة إلى البريد الاحتياطي" on={false} />
            <SettingsInput label="البريد الاحتياطي" value="backup@mahabah.sa" />
          </SettingsPanel>
          <SettingsPanel title="نطاقات الإرسال الموثوقة">
            <div className="grid gap-2">
              {trustedDomains.map((item) => (
                <div key={item} className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm font-bold" style={{ borderColor: uiColors.border }}>
                  <span>{item}</span>
                  <SettingsActionButton
                    settingsKey={`email-domain-remove-${item.replaceAll(".", "-")}`}
                    label={`حذف نطاق ${item}`}
                    payload={{ section: "trusted_domains", domain: item, removeRequested: true }}
                    className="grid h-8 w-8 place-items-center rounded-lg border text-xs font-extrabold text-[#8F6B4C]"
                    style={{ borderColor: uiColors.border }}
                  >
                    حذف
                  </SettingsActionButton>
                </div>
              ))}
              <SettingsActionButton settingsKey="email-domain-add" label="إضافة نطاق إرسال جديد" payload={{ section: "trusted_domains", createRequested: true }} className="min-h-10 rounded-xl border text-sm font-extrabold" style={{ borderColor: uiColors.border }}>
                إضافة نطاق جديد +
              </SettingsActionButton>
            </div>
          </SettingsPanel>
          <SettingsPanel title="حدود الإرسال">
            <SettingsInput label="الحد الأقصى اليومي" value="10000 رسالة" />
            <SettingsInput label="الحد الأقصى في الساعة" value="1000 رسالة" />
          </SettingsPanel>
        </div>
      </section>
      <SettingsSaveBar settingsKey="email-settings" label="إعدادات البريد الإلكتروني" section="email" />
    </AdminSettingsShell>
  );
}

function AdminSeoSettingsPage({ config }: { config: DashboardRoleConfig }) {
  return <AdminSettingsShell config={config} kind="seo"><section className="grid gap-4 xl:grid-cols-[1.2fr_0.9fr]"><SettingsPanel title="معاينة محرك البحث"><div className="rounded-2xl border p-5" style={{ borderColor: uiColors.border }}><strong className="text-lg text-[#3156A3]">مهابة - إدارة المساهمات العقارية بكفاءة وشفافية</strong><p className="mt-1 text-sm font-bold text-[#0B8043]">https://www.mahabah.sa</p><p className="mt-2 text-sm font-bold leading-7 text-[#5f5953]">منصة متكاملة لإدارة الأصول والمساهمات العقارية بكفاءة وشفافية.</p></div><p className="mt-4 text-sm font-bold leading-7 text-[#5f5953]">هذه معاينة لكيفية ظهور موقعك في نتائج محركات البحث.</p></SettingsPanel><SettingsPanel title="إعدادات عامة"><SettingsToggleRow label="تفعيل SEO للموقع" /><SettingsToggleRow label="فهرسة الموقع في محركات البحث" /><SettingsToggleRow label="السماح باتباع الروابط" /><SettingsToggleRow label="السماح بمحركات البحث بتتبع الصور" /><SettingsToggleRow label="منع أرشفة الصفحات التجريبية" on={false} /></SettingsPanel></section><section className="grid gap-4 lg:grid-cols-3"><SettingsPanel title="خرائط الموقع Sitemap"><SettingsInput label="رابط خريطة الموقع" value="https://www.mahabah.sa/sitemap.xml" /><SettingsActionButton settingsKey="seo-sitemap-resubmit" label="إعادة إرسال خريطة الموقع" payload={{ section: "sitemap", submitRequested: true }} className="mt-3 min-h-10 w-full rounded-xl border text-sm font-extrabold" style={{ borderColor: uiColors.border }}>إعادة إرسال خريطة الموقع</SettingsActionButton><SettingsInput label="ملف Robots.txt" value="https://www.mahabah.sa/robots.txt" /></SettingsPanel><SettingsPanel title="البيانات الأساسية للموقع"><div className="grid gap-3"><SettingsInput label="عنوان الموقع Title" value="مهابة - إدارة المساهمات العقارية بكفاءة وشفافية" /><SettingsInput label="الوصف التعريفي Meta Description" value="منصة متكاملة لإدارة الأصول والمساهمات العقارية بكفاءة وشفافية." /><SettingsInput label="الكلمات المفتاحية Meta Keywords" value="إدارة عقارات، مساهمات عقارية، أصول عقارية" /></div></SettingsPanel><SettingsPanel title="إعدادات الصفحة الرئيسية"><div className="grid gap-3"><SettingsInput label="عنوان الصفحة الرئيسية" value="مهابة - إدارة الأصول والمساهمات العقارية" /><SettingsInput label="وصف الصفحة الرئيسية" value="اكتشف منصة مهابة لإدارة الأصول والمساهمات العقارية." /><div className="relative h-24 overflow-hidden rounded-xl border" style={{ borderColor: uiColors.border }}><Image src="/images/about-lobby.png" alt="" fill className="object-cover opacity-60 grayscale sepia" sizes="300px" /></div><DashboardDocumentUploadButton scope="admin" entityType="seo_homepage_image" label="صورة الصفحة الرئيسية" className="grid min-h-10 cursor-pointer place-items-center rounded-xl border text-sm font-extrabold" style={{ borderColor: uiColors.border }}>تغيير الصورة</DashboardDocumentUploadButton></div></SettingsPanel></section><section className="grid gap-4 lg:grid-cols-2"><SettingsPanel title="البيانات المنظمة Schema Markup"><SettingsSelect label="نوع المخطط" value="Organization" /><StatusPill label="مفعل" tone="green" /><SettingsActionButton settingsKey="seo-schema-edit" label="تعديل مخطط البيانات المنظمة" payload={{ section: "schema_markup" }} className="mt-4 min-h-10 w-full rounded-xl border text-sm font-extrabold" style={{ borderColor: uiColors.border }}>تعديل مخطط البيانات المنظمة</SettingsActionButton></SettingsPanel><SettingsPanel title="إعدادات وسائل التواصل الاجتماعي"><div className="grid gap-3"><SettingsInput label="X" value="@mahabah_sa" /><SettingsInput label="Instagram" value="mahabah_sa" /><SettingsInput label="LinkedIn" value="Mahabah.sa" /></div></SettingsPanel></section><SettingsSaveBar settingsKey="seo-settings" label="إعدادات SEO" section="seo" /></AdminSettingsShell>;
}

type IntegrationCategory = "الكل" | "التسويق والبريد" | "الدفع والفوترة" | "التخزين والملفات" | "التحليلات والتقارير";

type IntegrationCard = {
  name: string;
  desc: string;
  active: boolean;
  category: Exclude<IntegrationCategory, "الكل">;
  updatedAt?: string;
};

const integrationCategories: IntegrationCategory[] = ["الكل", "التسويق والبريد", "الدفع والفوترة", "التخزين والملفات", "التحليلات والتقارير"];

const integrationCards: IntegrationCard[] = [
  { name: "Google Analytics 4", desc: "ربط الموقع بخدمة تحليلات جوجل لعرض التقارير والإحصائيات التفصيلية.", active: true, category: "التحليلات والتقارير" },
  { name: "Mailchimp", desc: "ربط الموقع بحساب Mailchimp لإدارة الحملات البريدية والقوائم.", active: true, category: "التسويق والبريد" },
  { name: "WhatsApp Business", desc: "ربط الواتساب للتواصل مع العملاء وإرسال الرسائل والإشعارات.", active: true, category: "التسويق والبريد" },
  { name: "Stripe", desc: "بوابة دفع آمنة لقبول المدفوعات عبر بطاقات الائتمان والمحافظ.", active: true, category: "الدفع والفوترة" },
  { name: "Google Drive", desc: "ربط التخزين السحابي لرفع الملفات وحفظ النسخ الاحتياطية.", active: false, category: "التخزين والملفات" },
  { name: "Twilio SMS", desc: "إرسال واستقبال رسائل SMS عبر Twilio API.", active: false, category: "التسويق والبريد" },
  { name: "Cloudflare", desc: "تحسين الأداء والحماية عبر شبكة Cloudflare.", active: true, category: "التحليلات والتقارير" },
  { name: "PayPal", desc: "قبول المدفوعات عبر حساب PayPal التجاري.", active: false, category: "الدفع والفوترة" },
  { name: "Slack", desc: "إرسال التنبيهات والإشعارات إلى قنوات Slack.", active: true, category: "التسويق والبريد" },
  { name: "Zoho CRM", desc: "مزامنة العملاء والبيانات مع نظام Zoho CRM.", active: false, category: "التسويق والبريد" },
];

function integrationCategoryFromParam(value: string): IntegrationCategory {
  return integrationCategories.includes(value as IntegrationCategory) ? value as IntegrationCategory : "الكل";
}

function integrationSettingValue(setting: DashboardPlatformSetting) {
  if (!setting.value || typeof setting.value !== "object" || Array.isArray(setting.value)) return null;
  const value = setting.value as Record<string, unknown>;
  const name = typeof value.integration === "string" && value.integration.trim() ? value.integration.trim() : "";
  if (!name) return null;
  return {
    name,
    active: typeof value.active === "boolean" ? value.active : undefined,
    category: typeof value.category === "string" ? value.category : undefined,
    updatedAt: setting.updatedAt,
  };
}

function mergeIntegrationSettings(settings: DashboardPlatformSetting[]): IntegrationCard[] {
  const saved = new Map(settings.map(integrationSettingValue).filter((item): item is NonNullable<ReturnType<typeof integrationSettingValue>> => Boolean(item)).map((item) => [normalizeDashboardSearch(item.name), item]));
  return integrationCards.map((card) => {
    const savedCard = saved.get(normalizeDashboardSearch(card.name));
    if (!savedCard) return card;
    return {
      ...card,
      active: typeof savedCard.active === "boolean" ? savedCard.active : card.active,
      category: integrationCategories.includes(savedCard.category as IntegrationCategory) && savedCard.category !== "الكل" ? savedCard.category as Exclude<IntegrationCategory, "الكل"> : card.category,
      updatedAt: savedCard.updatedAt,
    };
  });
}

async function AdminIntegrationsSettingsPage({ config, searchParams = {} }: { config: DashboardRoleConfig; searchParams?: DashboardSearchParams }) {
  const settings = await listDashboardPlatformSettings("integration-");
  const supabaseStatus = supabaseRuntimeState();
  const q = stringParam(searchParams, "q").trim();
  const category = integrationCategoryFromParam(stringParam(searchParams, "category"));
  const normalizedQuery = q.toLocaleLowerCase("ar-SA");
  const integrationRows: IntegrationCard[] = [
    {
      name: "Supabase",
      desc: supabaseStatus.configured
        ? "قاعدة البيانات والمصادقة والتخزين جاهزة لتشغيل لوحات الأفراد والأعمال والإدارة."
        : `الربط الخلفي غير مكتمل. المفاتيح الناقصة: ${supabaseStatus.missing.length ? supabaseStatus.missing.join("، ") : "غير محددة"}.`,
      active: supabaseStatus.configured,
      category: "التخزين والملفات",
    },
    ...mergeIntegrationSettings(settings.data),
  ];
  const cards = integrationRows.filter((card) => {
    const categoryMatches = category === "الكل" ? true : card.category === category;
    const queryMatches = normalizedQuery
      ? [card.name, card.desc, card.category].some((value) => value.toLocaleLowerCase("ar-SA").includes(normalizedQuery))
      : true;
    return categoryMatches && queryMatches;
  });
  const activeCount = cards.filter((card) => card.active).length;
  const activePercent = cards.length ? Math.round((activeCount / cards.length) * 100) : 0;
  const kpis = [
    { label: "إجمالي التكاملات", value: String(cards.length), unit: "تكامل مطابق", icon: "settings", tone: "gold" as TrendTone },
    { label: "التكاملات النشطة", value: String(activeCount), unit: `من إجمالي ${cards.length}`, icon: "shield", tone: "green" as TrendTone },
    { label: "التكاملات غير النشطة", value: String(cards.length - activeCount), unit: `من إجمالي ${cards.length}`, icon: "x", tone: "red" as TrendTone },
  ];

  return (
    <AdminSettingsShell config={config} kind="integrations">
      <section className="grid gap-4 xl:grid-cols-[1fr_3fr]">
        <SettingsPanel title="نظرة عامة على التكاملات">
          <div className="mx-auto grid h-32 w-32 place-items-center rounded-full text-center" style={{ background: `conic-gradient(#A7815E 0 ${activePercent}%, #EFE8E1 ${activePercent}% 100%)` }}>
            <div className="grid h-20 w-20 place-items-center rounded-full bg-white">
              <strong className="font-display text-2xl">{activePercent}%</strong>
              <span className="text-xs font-bold">تكامل نشط</span>
            </div>
          </div>
        </SettingsPanel>
        <section className="grid gap-4 md:grid-cols-3">
          {kpis.map((card) => (
            <article key={card.label} className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-extrabold text-[#5f5953]">{card.label}</p>
                  <strong className="mt-2 block font-display text-4xl text-[#1D1916]">{card.value}</strong>
                  <span className="text-xs font-bold text-[#8A7E73]">{card.unit}</span>
                </div>
                <span className="grid h-14 w-14 place-items-center rounded-full" style={{ backgroundColor: toneStyles[card.tone].bg }}>
                  <Icon name={card.icon} className="h-6 w-6 text-[#A7815E]" />
                </span>
              </div>
            </article>
          ))}
        </section>
      </section>
      {settings.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل إعدادات التكاملات المحفوظة، وتم عرض الحالة الافتراضية.</section> : null}
      <section className="rounded-[20px] border bg-white p-4 shadow-card" style={{ borderColor: uiColors.border }}>
        <div className="flex flex-wrap items-center gap-3">
          <form action={dashboardHref("admin", "settings/integrations")} className="relative min-w-[260px] flex-1">
            {category !== "الكل" ? <input type="hidden" name="category" value={category} /> : null}
            <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6E6258]" />
            <input name="q" defaultValue={q} suppressHydrationWarning className="h-12 w-full rounded-xl border bg-[#fffdf9] pl-16 pr-12 text-sm font-bold outline-none" style={{ borderColor: uiColors.border }} placeholder="ابحث عن تكامل..." />
            <button type="submit" className="absolute left-2 top-1/2 h-8 -translate-y-1/2 rounded-lg bg-[#1D1916] px-3 text-xs font-extrabold text-white">بحث</button>
          </form>
          {integrationCategories.map((item) => (
            <Link key={item} href={dashboardQueryHref("admin", "settings/integrations", { q, category: item === "الكل" ? undefined : item })} className={cn("grid h-11 place-items-center rounded-xl border px-4 text-sm font-extrabold", item === category ? "bg-[#A7815E] text-white" : "bg-white text-[#1D1916]")} style={{ borderColor: uiColors.border }}>
              {item}
            </Link>
          ))}
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.length === 0 ? <article className="rounded-[20px] border bg-white p-6 text-center text-sm font-extrabold text-[#6E6258] shadow-card md:col-span-2 xl:col-span-4" style={{ borderColor: uiColors.border }}>لا توجد تكاملات مطابقة للبحث الحالي.</article> : null}
        {cards.map((card) => {
          const isSupabaseCard = card.name === "Supabase";
          return (
            <article key={card.name} className="rounded-[20px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <strong className="font-display text-lg text-[#1D1916]">{card.name}</strong>
                <StatusPill label={card.active ? "نشط" : "غير نشط"} tone={card.active ? "green" : "gold"} />
              </div>
              <p className="min-h-16 text-sm font-bold leading-7 text-[#5f5953]">{card.desc}</p>
              <p className="mt-4 text-xs font-bold text-[#8A7E73]">التصنيف: {card.category}</p>
              <p className="mt-1 text-xs font-bold text-[#8A7E73]">تم التحديث: {card.updatedAt ? formatDashboardDate(card.updatedAt) : card.active ? "20 مايو 2024" : "غير مفعل"}</p>
              {isSupabaseCard ? (
                <Link href="/api/system/status" className="mt-4 grid min-h-10 w-full place-items-center rounded-xl border text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>
                  عرض حالة الربط
                </Link>
              ) : (
                <SettingsActionButton settingsKey={"integration-" + card.name} label={card.active ? "إعدادات " + card.name : "تفعيل " + card.name} payload={{ integration: card.name, category: card.category, active: !card.active }} className="mt-4 min-h-10 w-full rounded-xl border text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>
                  {card.active ? "تعطيل" : "تفعيل"}
                </SettingsActionButton>
              )}
            </article>
          );
        })}
      </section>
      <SettingsPanel title="إدارة التكاملات بسهولة">
        <div className="grid gap-4 md:grid-cols-3">
          {["آمن وموثوق", "سهل التفعيل", "تحديث تلقائي"].map((item) => (
            <div key={item} className="rounded-2xl border p-5 text-center" style={{ borderColor: uiColors.border }}>
              <ShieldCheck className="mx-auto h-8 w-8 text-[#A7815E]" />
              <h3 className="mt-3 font-display text-lg font-extrabold text-[#1D1916]">{item}</h3>
              <p className="mt-2 text-sm font-bold leading-7 text-[#5f5953]">ربط سلس مع الخدمات الخارجية لدعم سير العمل.</p>
            </div>
          ))}
        </div>
      </SettingsPanel>
    </AdminSettingsShell>
  );
}

function AdminSettingsPage({ config, kind, searchParams = {} }: { config: DashboardRoleConfig; kind: AdminSettingsKind; searchParams?: DashboardSearchParams }) {
  if (kind === "identity") return <AdminIdentitySettingsPage config={config} />;
  if (kind === "homepage") return <AdminHomepageSettingsPage config={config} />;
  if (kind === "header") return <AdminHeaderSettingsPage config={config} />;
  if (kind === "footer") return <AdminFooterSettingsPage config={config} />;
  if (kind === "notifications") return <AdminNotificationSettingsPage config={config} />;
  if (kind === "messages") return <AdminMessageSettingsPage config={config} />;
  if (kind === "email") return <AdminEmailSettingsPage config={config} />;
  if (kind === "seo") return <AdminSeoSettingsPage config={config} />;
  if (kind === "integrations") return <AdminIntegrationsSettingsPage config={config} searchParams={searchParams} />;
  return <AdminSiteSettingsPage config={config} />;
}

type AdminSystemKind = "roles" | "roleAdd" | "roleEdit" | "admins" | "adminAdd" | "adminDetails" | "login" | "activity" | "sensitive";

const systemMeta: Record<AdminSystemKind, { no: string; title: string; active: string; subtitle: string }> = {
  roles: { no: "11.1", title: "الأدوار والصلاحيات", active: "system/roles", subtitle: "إدارة الأدوار الوظيفية ونطاقات الوصول داخل لوحة التحكم." },
  roleAdd: { no: "11.2", title: "إضافة دور وظيفي", active: "system/roles/add", subtitle: "إنشاء دور جديد وتحديد الصلاحيات المرتبطة به." },
  roleEdit: { no: "11.3", title: "تعديل دور وظيفي", active: "system/roles/edit", subtitle: "تحديث بيانات الدور وصلاحياته ومستخدميه المرتبطين." },
  admins: { no: "11.4", title: "مدراء النظام", active: "system/admins", subtitle: "متابعة حسابات مدراء النظام وحالاتهم وآخر نشاط." },
  adminAdd: { no: "11.5", title: "إضافة مدير نظام", active: "system/admins/add", subtitle: "إضافة مدير جديد وربطه بدور وظيفي وصلاحيات تشغيلية." },
  adminDetails: { no: "11.6", title: "تفاصيل مدير النظام", active: "system/admins/details", subtitle: "عرض بيانات المدير والصلاحيات والجلسات وسجل النشاط." },
  login: { no: "11.7", title: "سجل الدخول", active: "system/login-log", subtitle: "مراجعة محاولات الدخول الناجحة والمرفوضة ومواقعها." },
  activity: { no: "11.8", title: "سجل النشاط", active: "system/activity-log", subtitle: "متابعة إجراءات مدراء النظام على عناصر المنصة." },
  sensitive: { no: "11.9", title: "سجل العمليات الحساسة", active: "system/sensitive-log", subtitle: "توثيق العمليات الحرجة التي تتطلب مراجعة أمنية أو اعتماد." },
};

const systemTabs = Object.values(systemMeta).map((item) => [item.title, item.active]);

function AdminSystemHeader({ meta }: { meta: (typeof systemMeta)[AdminSystemKind] }) {
  return <section className="relative overflow-hidden rounded-[24px] border bg-white p-5 shadow-card md:p-6" style={{ borderColor: uiColors.border }}><Image src="/images/about-lobby.png" alt="" fill className="object-cover opacity-[0.12] grayscale sepia-[18%]" sizes="80vw" /><div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="text-sm font-extrabold text-[#A7815E]">الرئيسية ‹ النظام والصلاحيات ‹ {meta.title}</p><h1 className="mt-2 font-display text-3xl font-extrabold text-[#1D1916] md:text-4xl">{meta.no} {meta.title}</h1><p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-[#5f5953]">{meta.subtitle}</p></div><Link href={dashboardHref("admin", "system/roles")} className="inline-flex min-h-11 items-center justify-center rounded-xl border bg-white px-5 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}><ArrowLeft className="ml-2 h-4 w-4" />العودة إلى النظام</Link></div></section>;
}

function AdminSystemNav({ activePath }: { activePath: string }) {
  return <section className="flex flex-wrap gap-2">{systemTabs.map(([label, path]) => <Link key={path} href={dashboardHref("admin", path)} className={cn("inline-flex min-h-10 items-center justify-center rounded-xl border px-4 text-sm font-extrabold", activePath === path ? "bg-[#A7815E] text-white" : "bg-white text-[#1D1916]")} style={{ borderColor: activePath === path ? "#A7815E" : uiColors.border }}>{label}</Link>)}</section>;
}

function AdminSystemShell({ config, kind, children }: { config: DashboardRoleConfig; kind: AdminSystemKind; children: ReactNode }) {
  const meta = systemMeta[kind];
  return <div className="grid gap-5"><DashboardTopbar config={config} /><AdminSystemHeader meta={meta} /><AdminSystemNav activePath={meta.active} />{children}</div>;
}

function SystemKpis({
  mode,
  roles = [],
  admins = [],
  logs = [],
}: {
  mode: "roles" | "admins" | "logs";
  roles?: DashboardAdminRole[];
  admins?: DashboardSystemAdmin[];
  logs?: DashboardAdminAuditLog[];
}) {
  const roleCards = [
    { label: "إجمالي الأدوار", value: String(roles.length), unit: "دور", icon: "shield", tone: "gold" as TrendTone },
    { label: "الأدوار النشطة", value: String(roles.filter((row) => row.status === "نشط").length), unit: "دور", icon: "shield", tone: "green" as TrendTone },
    { label: "إجمالي الصلاحيات", value: String(roles.reduce((total, row) => total + row.permissions, 0)), unit: "صلاحية", icon: "settings", tone: "blue" as TrendTone },
    { label: "مدراء مرتبطون", value: String(roles.reduce((total, row) => total + row.users, 0)), unit: "مدير", icon: "users", tone: "gold" as TrendTone },
  ];
  const adminCards = [
    { label: "مدراء النظام", value: String(admins.length), unit: "مدير", icon: "users", tone: "gold" as TrendTone },
    { label: "نشطون الآن", value: String(admins.filter((row) => row.status === "نشط").length), unit: "مدراء", icon: "shield", tone: "green" as TrendTone },
    { label: "جلسات مفتوحة", value: String(admins.reduce((total, row) => total + row.sessions, 0)), unit: "جلسة", icon: "clock", tone: "blue" as TrendTone },
    { label: "تنبيهات أمنية", value: String(admins.filter((row) => row.status !== "نشط").length), unit: "تنبيه", icon: "x", tone: "red" as TrendTone },
  ];
  const logCards = [
    { label: "إجمالي السجلات", value: String(logs.length), unit: "عملية", icon: "file-text", tone: "gold" as TrendTone },
    { label: "عمليات ناجحة", value: String(logs.filter((row) => row.status === "ناجح").length), unit: "عملية", icon: "shield", tone: "green" as TrendTone },
    { label: "تحتاج مراجعة", value: String(logs.filter((row) => row.status === "مراجعة" || row.status === "حساس").length), unit: "عملية", icon: "clock", tone: "gold" as TrendTone },
    { label: "مرفوضة", value: String(logs.filter((row) => row.status === "مرفوض").length), unit: "عملية", icon: "x", tone: "red" as TrendTone },
  ];
  const sets = { roles: roleCards, admins: adminCards, logs: logCards };
  return <AdminFinanceKpis cards={sets[mode]} />;
}

function AdminSystemSearchBar({ activePath, q, placeholder, action }: { activePath: string; q: string; placeholder: string; action?: ReactNode }) {
  return (
    <section className="rounded-[20px] border bg-white p-4 shadow-card" style={{ borderColor: uiColors.border }}>
      <div className="flex flex-wrap items-center gap-3">
        <form action={dashboardHref("admin", activePath)} className="relative min-w-[260px] flex-1">
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6E6258]" />
          <input name="q" defaultValue={q} suppressHydrationWarning className="h-12 w-full rounded-xl border bg-[#fffdf9] pl-16 pr-12 text-sm font-bold outline-none" style={{ borderColor: uiColors.border }} placeholder={placeholder} />
          <button type="submit" className="absolute left-2 top-1/2 h-8 -translate-y-1/2 rounded-lg bg-[#1D1916] px-3 text-xs font-extrabold text-white">بحث</button>
        </form>
        {action}
      </div>
    </section>
  );
}

function AdminRoleTable({ rows }: { rows: DashboardAdminRole[] }) {
  return <section className="overflow-hidden rounded-[22px] border bg-white shadow-card" style={{ borderColor: uiColors.border }}><div className="overflow-x-auto"><table className="w-full text-sm" style={{ minWidth: 940 }}><thead><tr className="bg-[#f4ede5] text-xs font-extrabold text-[#5f5953]">{["الدور الوظيفي", "نطاق الوصول", "عدد المدراء", "الصلاحيات", "آخر تحديث", "الحالة", "الإجراءات"].map((header) => <th key={header} className="px-4 py-3 text-right">{header}</th>)}</tr></thead><tbody>{rows.length === 0 ? <tr><td colSpan={7} className="px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد أدوار وظيفية مسجلة حالياً.</td></tr> : rows.map((row) => <tr key={row.id || row.slug} className="border-b last:border-b-0" style={{ borderColor: uiColors.border }}><td className="px-4 py-4 font-display text-lg font-extrabold text-[#1D1916]">{row.name}</td><td className="px-4 py-4 font-bold text-[#5f5953]">{row.scope}</td><td className="px-4 py-4 font-bold">{row.users}</td><td className="px-4 py-4"><div className="h-2 w-28 rounded-full bg-[#EFE8E1]"><span className="block h-2 rounded-full bg-[#A7815E]" style={{ width: `${Math.min(row.permissions, 90)}%` }} /></div><span className="text-xs font-bold text-[#8A7E73]">{row.permissions} صلاحية</span></td><td className="px-4 py-4 font-bold text-[#5f5953]">{row.updated}</td><td className="px-4 py-4"><StatusPill label={row.status} tone={row.status === "نشط" ? "green" : row.status === "معطل" ? "red" : "gold"} /></td><td className="px-4 py-4"><Link href={dashboardHref("admin", `system/roles/edit?role=${encodeURIComponent(row.slug || row.id)}`)} className="rounded-xl border px-4 py-2 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>تعديل</Link></td></tr>)}</tbody></table></div></section>;
}

async function AdminRolesPage({ config, searchParams = {} }: { config: DashboardRoleConfig; searchParams?: DashboardSearchParams }) {
  const result = await listDashboardAdminRoles();
  const q = stringParam(searchParams, "q").trim();
  const rows = result.data.filter((row) => matchesDashboardSearch(q, [row.id, row.slug, row.name, row.scope, row.status, row.users, row.permissions, row.updated]));
  return <AdminSystemShell config={config} kind="roles"><SystemKpis mode="roles" roles={result.data} />{result.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل الأدوار من Supabase، وتم عرض بيانات احتياطية مؤقتة.</section> : null}<AdminSystemSearchBar activePath="system/roles" q={q} placeholder="البحث باسم الدور أو الصلاحية..." action={<Link href={dashboardHref("admin", "system/roles/add")} className="inline-flex h-12 items-center rounded-xl bg-[#A54118] px-5 text-sm font-extrabold text-white"><Plus className="ml-2 h-4 w-4" />إضافة دور وظيفي</Link>} /><AdminRoleTable rows={rows} /></AdminSystemShell>;
}

function PermissionMatrix({ namePrefix = "permission", readOnly = false }: { namePrefix?: string; readOnly?: boolean } = {}) {
  const groups = ["الرئيسية", "الأصول العقارية", "المساهمات", "الخدمات", "المالية", "التقارير", "الإعدادات", "النظام والصلاحيات"];
  const actions = ["عرض", "إضافة", "تعديل", "اعتماد", "حذف"];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" style={{ minWidth: 760 }}>
        <thead>
          <tr className="text-[#6E6258]">
            <th className="py-3 text-right">القسم</th>
            {actions.map((action) => <th key={action} className="py-3 text-center">{action}</th>)}
          </tr>
        </thead>
        <tbody>
          {groups.map((group, row) => (
            <tr key={group} className="border-t" style={{ borderColor: uiColors.border }}>
              <td className="py-3 font-extrabold text-[#1D1916]">{group}</td>
              {actions.map((action, col) => {
                const enabled = row < 5 || col < 2;
                const fieldName = `${namePrefix}_${settingsFieldName(`${group}_${action}`)}`;
                return (
                  <td key={action} className="text-center">
                    <SettingsCheckboxSwitch name={fieldName} defaultChecked={enabled} readOnly={readOnly} label={`${group} - ${action}`} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function AdminRoleFormPage({ config, mode, searchParams = {} }: { config: DashboardRoleConfig; mode: "add" | "edit"; searchParams?: DashboardSearchParams }) {
  const kind = mode === "add" ? "roleAdd" : "roleEdit";
  const rolesResult = mode === "edit" ? await listDashboardAdminRoles() : undefined;
  const selectedRoleRef = entityParam(searchParams, "role", "id", "slug");
  const selectedRole = selectedRoleRef && rolesResult ? rolesResult.data.find((row) => row.id === selectedRoleRef || row.slug === selectedRoleRef) : undefined;
  const roleTitle = mode === "add" ? "مدير الاعتمادات" : selectedRole?.name ?? "مدير المراجعة والاعتماد";
  const roleStatus = selectedRole?.status ?? "نشط";
  const roleScope = selectedRole?.scope ?? "مركز المراجعة والاعتماد";
  const rolePermissions = selectedRole?.permissions ?? 46;
  const roleUsers = selectedRole?.users ?? 8;
  const roleSlug = selectedRole?.slug || selectedRole?.id || (mode === "add" ? "approval-manager" : "review-manager");
  const roleStatusOptions = Array.from(new Set([roleStatus, "نشط", "محدود", "معطل"]));
  const roleScopeOptions = Array.from(new Set([roleScope, "مركز المراجعة والاعتماد", "إدارة النظام", "المالية", "الدعم الفني"]));
  return (
    <AdminSystemShell config={config} kind={kind}>
      <form className="grid gap-4">
        {rolesResult?.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل بيانات الدور الحية من Supabase، وتم عرض البيانات المتاحة مع الاحتياطي.</section> : null}
        <section className="grid gap-4 xl:grid-cols-[0.9fr_1.4fr]">
          <SettingsPanel title="بيانات الدور">
            <div className="grid gap-4 md:grid-cols-2">
              <SettingsInput name="name" label="اسم الدور" value={roleTitle} required />
              <SettingsSelect name="status" label="حالة الدور" value={roleStatus} options={roleStatusOptions} />
              <SettingsInput name="description" label="وصف الدور" value="مسؤول عن مراجعة واعتماد الأصول والمساهمات والطلبات." wide />
              <SettingsSelect name="scope" label="نطاق الوصول" value={roleScope} options={roleScopeOptions} />
              <SettingsSelect name="sensitivity" label="مستوى الحساسية" value="مرتفع" options={["منخفض", "متوسط", "مرتفع"]} />
            </div>
          </SettingsPanel>
          <SettingsPanel title="ملخص الدور">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border p-4 text-center" style={{ borderColor: uiColors.border }}><strong className="font-display text-3xl">{rolePermissions}</strong><p className="text-sm font-bold text-[#5f5953]">صلاحية مفعلة</p></div>
              <div className="rounded-2xl border p-4 text-center" style={{ borderColor: uiColors.border }}><strong className="font-display text-3xl">{roleUsers}</strong><p className="text-sm font-bold text-[#5f5953]">مدراء مرتبطون</p></div>
              <div className="rounded-2xl border p-4 text-center" style={{ borderColor: uiColors.border }}><strong className="font-display text-3xl">12</strong><p className="text-sm font-bold text-[#5f5953]">صلاحية حساسة</p></div>
            </div>
            <div className="mt-5 grid gap-3">
              <SettingsToggleRow label="تفعيل سجل عمليات الدور" />
              <SettingsToggleRow label="طلب مصادقة ثنائية للعمليات الحساسة" />
              <SettingsToggleRow label="إشعار مدير النظام عند التعديل" />
            </div>
          </SettingsPanel>
        </section>
        <SettingsPanel title="مصفوفة الصلاحيات"><PermissionMatrix namePrefix="permission" /></SettingsPanel>
        <section className="flex flex-wrap justify-between gap-3">
          <Link href={dashboardHref("admin", "system/roles")} className="min-h-11 rounded-xl border bg-white px-5 py-3 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إلغاء</Link>
          <AdminManagementActionButton action="admin_role_save" entityId={selectedRole?.id} slug={roleSlug} title={roleTitle} payload={{ slug: roleSlug, users: roleUsers, sensitivity: "مرتفع" }} className="min-h-11 rounded-xl bg-[#A7815E] px-6 text-sm font-extrabold text-white">{mode === "add" ? "حفظ الدور" : "حفظ التعديلات"}</AdminManagementActionButton>
        </section>
      </form>
    </AdminSystemShell>
  );
}

function AdminAdminsTable({ rows }: { rows: DashboardSystemAdmin[] }) {
  return <section className="overflow-hidden rounded-[22px] border bg-white shadow-card" style={{ borderColor: uiColors.border }}><div className="overflow-x-auto"><table className="w-full text-sm" style={{ minWidth: 980 }}><thead><tr className="bg-[#f4ede5] text-xs font-extrabold text-[#5f5953]">{["اسم المدير", "البريد الإلكتروني", "الدور", "آخر دخول", "الجلسات", "الحالة", "الإجراءات"].map((header) => <th key={header} className="px-4 py-3 text-right">{header}</th>)}</tr></thead><tbody>{rows.length === 0 ? <tr><td colSpan={7} className="px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا يوجد مدراء نظام مسجلون حالياً.</td></tr> : rows.map((row) => <tr key={row.id || row.email} className="border-b last:border-b-0" style={{ borderColor: uiColors.border }}><td className="px-4 py-4 font-display text-lg font-extrabold text-[#1D1916]">{row.name}</td><td className="px-4 py-4 font-bold text-[#5f5953]">{row.email}</td><td className="px-4 py-4 font-bold text-[#1D1916]">{row.role}</td><td className="px-4 py-4 font-bold text-[#5f5953]">{row.lastLogin}</td><td className="px-4 py-4 font-bold">{row.sessions}</td><td className="px-4 py-4"><StatusPill label={row.status} tone={row.status === "نشط" ? "green" : "red"} /></td><td className="px-4 py-4"><Link href={dashboardHref("admin", `system/admins/details?admin=${encodeURIComponent(row.id || row.email)}`)} className="rounded-xl border px-4 py-2 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>عرض</Link></td></tr>)}</tbody></table></div></section>;
}

async function AdminSystemAdminsPage({ config, searchParams = {} }: { config: DashboardRoleConfig; searchParams?: DashboardSearchParams }) {
  const result = await listDashboardSystemAdmins();
  const q = stringParam(searchParams, "q").trim();
  const rows = result.data.filter((row) => matchesDashboardSearch(q, [row.id, row.name, row.email, row.role, row.status, row.lastLogin, row.sessions]));
  return <AdminSystemShell config={config} kind="admins"><SystemKpis mode="admins" admins={result.data} />{result.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل مدراء النظام من Supabase، وتم عرض بيانات احتياطية مؤقتة.</section> : null}<AdminSystemSearchBar activePath="system/admins" q={q} placeholder="البحث باسم المدير أو البريد..." action={<Link href={dashboardHref("admin", "system/admins/add")} className="inline-flex h-12 items-center rounded-xl bg-[#A54118] px-5 text-sm font-extrabold text-white"><Plus className="ml-2 h-4 w-4" />إضافة مدير نظام</Link>} /><AdminAdminsTable rows={rows} /></AdminSystemShell>;
}

function AdminSystemAdminFormPage({ config }: { config: DashboardRoleConfig }) {
  return (
    <AdminSystemShell config={config} kind="adminAdd">
      <form className="grid gap-4">
        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <SettingsPanel title="بيانات مدير النظام">
            <div className="grid gap-4 md:grid-cols-2">
              <SettingsInput name="fullName" label="الاسم الكامل" value="عبدالعزيز محمد" required />
              <SettingsInput name="email" label="البريد الإلكتروني" value="admin.new@mahabah.sa" type="email" required />
              <SettingsInput name="phone" label="رقم الجوال" value="+966 50 123 4567" required />
              <SettingsSelect name="adminRole" label="الدور الوظيفي" value="مدير المراجعة والاعتماد" options={["مدير المراجعة والاعتماد", "مدير النظام العام", "مدير الدعم الفني", "مدير المالية"]} />
              <SettingsSelect name="status" label="حالة الحساب" value="نشط" options={["نشط", "محدود", "معطل"]} />
              <SettingsSelect name="language" label="لغة الواجهة" value="العربية" options={["العربية", "English"]} />
            </div>
          </SettingsPanel>
          <SettingsPanel title="الأمان والوصول">
            <SettingsToggleRow label="إرسال دعوة تفعيل بالبريد" />
            <SettingsToggleRow label="تفعيل المصادقة الثنائية" />
            <SettingsToggleRow label="تقييد الوصول حسب IP" on={false} />
            <SettingsInput name="sessionDuration" label="مدة الجلسة" value="120 دقيقة" />
            <SettingsInput name="allowedIp" label="نطاق IP مسموح" value="188.48.21.0/24" />
          </SettingsPanel>
        </section>
        <SettingsPanel title="الصلاحيات الممنوحة"><PermissionMatrix namePrefix="admin_permission" /></SettingsPanel>
        <section className="flex flex-wrap justify-between gap-3 rounded-[20px] border bg-white p-4 shadow-card" style={{ borderColor: uiColors.border }}>
          <Link href={dashboardHref("admin", "system/admins")} className="min-h-11 rounded-xl border bg-white px-5 py-3 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إلغاء</Link>
          <AdminManagementActionButton action="admin_user_save" slug="admin-new-user" title="مدير نظام جديد" payload={{ sessions: 1 }} className="min-h-11 rounded-xl bg-[#A7815E] px-6 text-sm font-extrabold text-white">حفظ مدير النظام</AdminManagementActionButton>
        </section>
      </form>
    </AdminSystemShell>
  );
}

async function AdminSystemAdminDetailsPage({ config, searchParams = {} }: { config: DashboardRoleConfig; searchParams?: DashboardSearchParams }) {
  const [auditLogs, admins] = await Promise.all([listDashboardAdminAuditLogs("activity"), listDashboardSystemAdmins()]);
  const selectedAdminRef = entityParam(searchParams, "admin", "id", "email");
  const selectedAdmin = selectedAdminRef ? admins.data.find((row) => row.id === selectedAdminRef || row.email === selectedAdminRef) : undefined;
  const admin = selectedAdmin ?? admins.data[0] ?? { id: "admin", name: "مدير النظام", email: "admin@mahabah.sa", role: "مدير النظام العام", status: "نشط" as const, lastLogin: "غير متوفر", sessions: 0 };
  return <AdminSystemShell config={config} kind="adminDetails"><section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr_1fr]">{admins.error ? <div className="xl:col-span-3 rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل بيانات مدير النظام من Supabase، وتم عرض بيانات احتياطية مؤقتة.</div> : null}<SettingsPanel title="بطاقة المدير"><div className="text-center"><div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#EFE8E1]"><UserRound className="h-10 w-10 text-[#A7815E]" /></div><h2 className="mt-4 font-display text-2xl font-extrabold text-[#1D1916]">{admin.name}</h2><p className="font-bold text-[#5f5953]">{admin.role}</p><StatusPill label={admin.status} tone={admin.status === "نشط" ? "green" : "red"} /></div></SettingsPanel><SettingsPanel title="معلومات الحساب"><div className="grid gap-3">{[["البريد الإلكتروني", admin.email], ["رقم الجوال", "مسجل في ملف المدير"], ["آخر دخول", admin.lastLogin], ["الجلسات المفتوحة", String(admin.sessions)], ["مصادقة ثنائية", "مفعلة"]].map(([label, value]) => <div key={label} className="flex justify-between border-b pb-2 last:border-b-0" style={{ borderColor: uiColors.border }}><span className="font-bold text-[#5f5953]">{label}</span><strong>{value}</strong></div>)}</div></SettingsPanel><SettingsPanel title="إجراءات الحساب"><div className="grid gap-3"><AdminManagementActionButton action="admin_security_action" entityId={admin.id} slug="reset_password" title="إعادة تعيين كلمة مرور مدير النظام" payload={{ label: "إعادة تعيين كلمة مرور مدير النظام", adminId: admin.id, securityAction: "reset_password" }} className="min-h-11 rounded-xl border text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إعادة تعيين كلمة المرور</AdminManagementActionButton><AdminManagementActionButton action="admin_security_action" entityId={admin.id} slug="revoke_sessions" title="إنهاء جلسات مدير النظام" payload={{ label: "إنهاء جلسات مدير النظام", adminId: admin.id, securityAction: "revoke_sessions" }} className="min-h-11 rounded-xl border text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>إنهاء الجلسات المفتوحة</AdminManagementActionButton><AdminManagementActionButton action="admin_user_save" entityId={admin.id} slug="admin-account-suspended" title={admin.name} payload={{ fullName: admin.name, email: admin.email, adminRole: admin.role, status: "معطل", sessions: 0 }} className="min-h-11 rounded-xl bg-[#fff0eb] text-sm font-extrabold text-[#A54118]">إيقاف الحساب مؤقتاً</AdminManagementActionButton></div></SettingsPanel></section><section className="grid gap-4 lg:grid-cols-2"><SettingsPanel title="صلاحيات المدير"><PermissionMatrix namePrefix="admin_permission" readOnly /></SettingsPanel><SettingsPanel title="آخر النشاطات">{auditLogs.error ? <p className="mb-3 rounded-xl border bg-[#fff7ec] p-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل سجل النشاط الحي، وتم عرض بيانات تجريبية.</p> : null}<SystemLogList rows={auditLogs.data.slice(0, 4)} /></SettingsPanel></section></AdminSystemShell>;
}

function SystemLogList({ rows }: { rows: DashboardAdminAuditLog[] }) {
  return <div className="grid gap-3">{rows.map((row) => <div key={row.id} className="rounded-2xl border p-4" style={{ borderColor: uiColors.border }}><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-display text-lg font-extrabold text-[#1D1916]">{row.event}</p><p className="mt-1 text-sm font-bold text-[#5f5953]">{row.user} · {row.target}</p></div><StatusPill label={row.status} tone={row.status === "ناجح" ? "green" : row.status === "مرفوض" || row.status === "حساس" ? "red" : "gold"} /></div><p className="mt-3 text-xs font-bold text-[#8A7E73]">{row.time} · IP {row.ip}</p></div>)}</div>;
}

async function AdminSystemLogsPage({ config, kind, searchParams = {} }: { config: DashboardRoleConfig; kind: "login" | "activity" | "sensitive"; searchParams?: DashboardSearchParams }) {
  const result = await listDashboardAdminAuditLogs(kind);
  const q = stringParam(searchParams, "q").trim();
  const status = stringParam(searchParams, "status").trim();
  const rows = result.data.filter((row) => {
    const statusMatches = !status || status === "all" || normalizeDashboardSearch(row.status).includes(normalizeDashboardSearch(status));
    return statusMatches && matchesDashboardSearch(q, [row.id, row.user, row.event, row.target, row.ip, row.time, row.status]);
  });
  const exportRows = rows.map((row) => ({
    "رقم السجل": row.id,
    المستخدم: row.user,
    العملية: row.event,
    العنصر: row.target,
    "عنوان IP": row.ip,
    "التاريخ والوقت": row.time,
    الحالة: row.status,
  }));
  const filters = [["كل الحالات", "all"], ["ناجح", "ناجح"], ["مراجعة", "مراجعة"], ["مرفوض", "مرفوض"], ["حساس", "حساس"]] as const;
  return <AdminSystemShell config={config} kind={kind}><SystemKpis mode="logs" logs={result.data} /><section className="rounded-[20px] border bg-white p-4 shadow-card" style={{ borderColor: uiColors.border }}><div className="flex flex-wrap items-center gap-3"><form action={dashboardHref("admin", systemMeta[kind].active)} className="relative min-w-[260px] flex-1">{status ? <input type="hidden" name="status" value={status} /> : null}<Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6E6258]" /><input name="q" defaultValue={q} suppressHydrationWarning className="h-12 w-full rounded-xl border bg-[#fffdf9] pl-16 pr-12 text-sm font-bold outline-none" style={{ borderColor: uiColors.border }} placeholder="البحث في السجلات..." /><button type="submit" className="absolute left-2 top-1/2 h-8 -translate-y-1/2 rounded-lg bg-[#1D1916] px-3 text-xs font-extrabold text-white">بحث</button></form>{filters.map(([filter, nextStatus]) => <Link key={filter} href={dashboardQueryHref("admin", systemMeta[kind].active, { q, status: nextStatus })} className={cn("flex h-12 w-40 items-center justify-between rounded-xl border px-4 text-sm font-extrabold", status === nextStatus ? "bg-[#fbf3e9] text-[#8F6B4C]" : "bg-white text-[#1D1916]")} style={{ borderColor: status === nextStatus ? "#e3c8aa" : uiColors.border }}><span>{filter}</span><ChevronGlyph /></Link>)}<FinancialExportButton filename={`mahabah-admin-${kind}-logs.csv`} rows={exportRows} className="h-12 rounded-xl border px-5 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>تصدير</FinancialExportButton></div></section>{result.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر الاتصال بسجل التدقيق الحي، وتم عرض بيانات تجريبية مؤقتة.</section> : null}<section className="overflow-hidden rounded-[22px] border bg-white shadow-card" style={{ borderColor: uiColors.border }}><div className="overflow-x-auto"><table className="w-full text-sm" style={{ minWidth: 980 }}><thead><tr className="bg-[#f4ede5] text-xs font-extrabold text-[#5f5953]">{["رقم السجل", "المستخدم", "العملية", "العنصر", "عنوان IP", "التاريخ والوقت", "الحالة"].map((header) => <th key={header} className="px-4 py-3 text-right">{header}</th>)}</tr></thead><tbody>{rows.length === 0 ? <tr><td colSpan={7} className="px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد سجلات مطابقة حالياً.</td></tr> : rows.map((row) => <tr key={row.id} className="border-b last:border-b-0" style={{ borderColor: uiColors.border }}><td className="px-4 py-4 font-bold">{row.id}</td><td className="px-4 py-4 font-extrabold text-[#1D1916]">{row.user}</td><td className="px-4 py-4 font-bold text-[#5f5953]">{row.event}</td><td className="px-4 py-4 font-bold">{row.target}</td><td className="px-4 py-4 font-bold text-[#5f5953]">{row.ip}</td><td className="px-4 py-4 font-bold text-[#5f5953]">{row.time}</td><td className="px-4 py-4"><StatusPill label={row.status} tone={row.status === "ناجح" ? "green" : row.status === "مرفوض" || row.status === "حساس" ? "red" : "gold"} /></td></tr>)}</tbody></table></div></section></AdminSystemShell>;
}

type ReviewKind = "dashboard" | "assets" | "assetDetails" | "contributions" | "contributionDetails" | "services" | "providers" | "verification" | "content" | "approvals";

const reviewMeta: Record<ReviewKind, { no: string; title: string; active: string; subtitle: string }> = {
  dashboard: { no: "12.1", title: "لوحة المراجعة الرئيسية", active: "review-center", subtitle: "متابعة جميع طلبات المراجعة والاعتماد حسب النوع والأولوية." },
  assets: { no: "12.2", title: "مراجعة الأصول العقارية", active: "review-center/assets", subtitle: "قائمة الأصول العقارية الواردة للمراجعة والاعتماد." },
  assetDetails: { no: "12.3", title: "تفاصيل مراجعة الأصل", active: "review-center/assets/details", subtitle: "فحص بيانات الأصل والمستندات ودرجة التقييم قبل القرار." },
  contributions: { no: "12.4", title: "مراجعة المساهمات العقارية", active: "review-center/contributions", subtitle: "مراجعة طلبات المساهمات العقارية وحالاتها ومراجعيها." },
  contributionDetails: { no: "12.5", title: "تفاصيل مراجعة المساهمة", active: "review-center/contributions/details", subtitle: "تفاصيل المساهمة والمستندات وملاحظات المراجعين وقرار الاعتماد." },
  services: { no: "12.6", title: "مراجعة الخدمات العقارية", active: "review-center/services", subtitle: "مراجعة الخدمات العقارية المقدمة من المزودين قبل نشرها." },
  providers: { no: "12.7", title: "مراجعة مزودي الخدمات", active: "review-center/providers", subtitle: "اعتماد مزودي الخدمات ومتابعة تصنيفاتهم وأدائهم." },
  verification: { no: "12.8", title: "مراجعة طلبات التوثيق", active: "review-center/verification", subtitle: "فحص مستندات التوثيق وطلبات التحقق من المنشآت والحسابات." },
  content: { no: "12.9", title: "مراجعة الأخبار والمقالات", active: "review-center/content", subtitle: "اعتماد المحتوى التحريري قبل النشر على الموقع." },
  approvals: { no: "12.10", title: "سجل الاعتمادات", active: "review-center/approvals", subtitle: "سجل العمليات الاعتمادية واستهلاك الاعتمادات حسب النوع." },
};

const reviewTabs = Object.values(reviewMeta).map((item) => [item.title, item.active]);

function ReviewHeader({ meta }: { meta: (typeof reviewMeta)[ReviewKind] }) {
  return <section className="relative overflow-hidden rounded-[24px] border bg-white p-5 shadow-card md:p-6" style={{ borderColor: uiColors.border }}><Image src="/images/about-lobby.png" alt="" fill className="object-cover opacity-[0.12] grayscale sepia-[18%]" sizes="80vw" /><div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="text-sm font-extrabold text-[#A7815E]">الرئيسية ‹ مركز المراجعة والاعتماد ‹ {meta.title}</p><h1 className="mt-2 font-display text-3xl font-extrabold text-[#1D1916] md:text-4xl">{meta.no} {meta.title}</h1><p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-[#5f5953]">{meta.subtitle}</p></div><Link href={dashboardHref("admin", "review-center")} className="inline-flex min-h-11 items-center justify-center rounded-xl border bg-white px-5 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}><ArrowLeft className="ml-2 h-4 w-4" />العودة إلى المركز</Link></div></section>;
}

function ReviewNav({ activePath }: { activePath: string }) {
  return <section className="flex flex-wrap gap-2">{reviewTabs.map(([label, path]) => <Link key={path} href={dashboardHref("admin", path)} className={cn("inline-flex min-h-10 items-center justify-center rounded-xl border px-4 text-sm font-extrabold", activePath === path ? "bg-[#A7815E] text-white" : "bg-white text-[#1D1916]")} style={{ borderColor: activePath === path ? "#A7815E" : uiColors.border }}>{label}</Link>)}</section>;
}

function ReviewShell({ config, kind, children }: { config: DashboardRoleConfig; kind: ReviewKind; children: ReactNode }) {
  const meta = reviewMeta[kind];
  return <div className="grid gap-5"><DashboardTopbar config={config} /><ReviewHeader meta={meta} /><ReviewNav activePath={meta.active} />{children}</div>;
}

type ReviewKpiCard = {
  label: string;
  value: string;
  unit: string;
  icon: string;
  tone: TrendTone;
};

function ReviewKpis({ cards }: { cards: ReviewKpiCard[] }) {
  return <section className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>{cards.map(({ label, value, unit, icon, tone }) => <article key={label} className="rounded-[22px] border bg-white p-5 shadow-card" style={{ borderColor: uiColors.border }}><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-extrabold text-[#1D1916]">{label}</p><strong className="mt-2 block font-display text-3xl text-[#1D1916]">{value}</strong><span className="text-xs font-bold text-[#5f5953]">{unit}</span></div><span className="grid h-14 w-14 shrink-0 place-items-center rounded-full" style={{ backgroundColor: toneStyles[tone].bg }}><Icon name={icon} className="h-6 w-6 text-[#A7815E]" /></span></div></article>)}</section>;
}

type ReviewQueueStatusFilter = "pending" | "approved" | "rejected";

function reviewQueueFilterHref(input: { basePath: string; status?: ReviewQueueStatusFilter; q?: string }) {
  const query = new URLSearchParams();
  if (input.status) query.set("status", input.status);
  if (input.q) query.set("q", input.q);
  const qs = query.toString();
  return dashboardHref("admin", `${input.basePath}${qs ? `?${qs}` : ""}`);
}

function ReviewFilters({ search, basePath, q = "", activeStatus }: { search: string; basePath: string; q?: string; activeStatus?: ReviewQueueStatusFilter }) {
  const filters: Array<[string, ReviewQueueStatusFilter | undefined]> = [["جميع الحالات", undefined], ["قيد المراجعة", "pending"], ["معتمد", "approved"], ["مرفوض", "rejected"]];
  return <section className="rounded-[20px] border bg-white p-4 shadow-card" style={{ borderColor: uiColors.border }}><div className="flex flex-wrap items-center gap-3"><form action={dashboardHref("admin", basePath)} className="relative min-w-[260px] flex-1">{activeStatus ? <input type="hidden" name="status" value={activeStatus} /> : null}<Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6E6258]" /><input name="q" defaultValue={q} className="h-12 w-full rounded-xl border bg-[#fffdf9] pl-20 pr-12 text-sm font-bold outline-none" style={{ borderColor: uiColors.border }} placeholder={search} /><button type="submit" className="absolute left-2 top-1/2 h-9 -translate-y-1/2 rounded-lg bg-[#101010] px-4 text-xs font-extrabold text-white">بحث</button></form>{filters.map(([filter, status]) => <Link key={filter} href={reviewQueueFilterHref({ basePath, status, q })} className={cn("flex h-12 w-40 items-center justify-between rounded-xl border px-4 text-sm font-extrabold", activeStatus === status ? "bg-[#A7815E] text-white" : "bg-white text-[#1D1916]")} style={{ borderColor: activeStatus === status ? "#A7815E" : uiColors.border }}><span>{filter}</span><ChevronGlyph /></Link>)}</div></section>;
}

function ReviewDonut({ total = "248" }: { total?: string }) {
  const segments = [
    { color: "#101010", dash: "38 62", offset: 0 },
    { color: "#C96F35", dash: "24 76", offset: -38 },
    { color: "#DDA66D", dash: "16 84", offset: -62 },
    { color: "#9AA7B3", dash: "13 87", offset: -78 },
    { color: "#CDD4DA", dash: "9 91", offset: -91 },
  ];
  return <div className="relative mx-auto grid place-items-center" style={{ width: 224, height: 224 }}><svg viewBox="0 0 42 42" className="h-full w-full -rotate-90" role="img" aria-label="توزيع المراجعات">{segments.map((segment) => <circle key={segment.color} cx="21" cy="21" r="15.915" fill="transparent" stroke={segment.color} strokeWidth="7" strokeDasharray={segment.dash} strokeDashoffset={segment.offset} />)}</svg><div className="absolute inset-14 grid place-items-center rounded-full bg-white text-center"><span className="text-sm font-bold text-[#5f5953]">إجمالي</span><strong className="font-display text-3xl text-[#1D1916]">{total}</strong></div></div>;
}

type ReviewQueueRow = {
  id: string;
  name: string;
  type: string;
  city: string;
  owner: string;
  date: string;
  status: string;
  statusTone: TrendTone;
  priority: string;
  priorityTone: TrendTone;
  detailPath: string;
  entityType?: "asset" | "contribution" | "service_request";
  entityId?: string;
  slug?: string;
  managementAction?: "provider_status" | "content_status";
  statusForAction?: DashboardAdminProviderStatus | DashboardAdminContentStatus;
};

function isDashboardUuid(value: string | undefined) {
  return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));
}

function canReviewQueueRowAct(row: ReviewQueueRow) {
  if (row.entityType === "service_request") return isDashboardUuid(row.entityId);
  if (row.entityType === "asset" || row.entityType === "contribution") return Boolean(isDashboardUuid(row.entityId) || row.slug);
  if (row.managementAction) return Boolean(isDashboardUuid(row.entityId) || row.slug);
  return false;
}

function latestReviewQueueRows(input: {
  assets: DashboardAdminAssetRow[];
  contributions: DashboardAdminContributionRow[];
  services: DashboardAdminServiceRequest[];
  providers: DashboardAdminProvider[];
  verification: DashboardAdminVerificationRequest[];
  content: DashboardAdminContentItem[];
}): ReviewQueueRow[] {
  const detailQueryPath = (path: string, key: string, value: string) => `${path}?${key}=${encodeURIComponent(value)}`;
  const rows: ReviewQueueRow[] = [
    ...input.assets.slice(0, 3).map((row) => ({ id: row.id, name: row.titleAr, type: "أصل عقاري", city: row.cityAr, owner: row.owner, date: formatDashboardDate(row.submittedAt), status: adminAssetStatusMeta[row.status].label, statusTone: adminAssetStatusMeta[row.status].tone, priority: row.risk, priorityTone: row.risk === "مرتفع" ? "red" as TrendTone : row.risk === "متوسط" ? "gold" as TrendTone : "green" as TrendTone, detailPath: detailQueryPath("review-center/assets/details", "asset", row.slug || row.id), entityType: "asset" as const, entityId: row.id, slug: row.slug })),
    ...input.contributions.slice(0, 3).map((row) => ({ id: row.id, name: row.titleAr, type: "مساهمة عقارية", city: row.cityAr, owner: row.sponsor, date: formatDashboardDate(row.submittedAt), status: adminContributionStatusMeta[row.status].label, statusTone: adminContributionStatusMeta[row.status].tone, priority: row.risk, priorityTone: row.risk === "مرتفع" ? "red" as TrendTone : row.risk === "متوسط" ? "gold" as TrendTone : "green" as TrendTone, detailPath: detailQueryPath("review-center/contributions/details", "contribution", row.slug || row.id), entityType: "contribution" as const, entityId: row.id, slug: row.slug })),
    ...input.services.slice(0, 2).map((row) => ({ id: row.id, name: row.title, type: "خدمة عقارية", city: row.city, owner: row.requester, date: formatDashboardDate(row.submittedAt), status: row.rawStatus, statusTone: row.status === "completed" ? "green" as TrendTone : row.status === "urgent" ? "red" as TrendTone : "gold" as TrendTone, priority: row.priority, priorityTone: row.status === "urgent" ? "red" as TrendTone : "gold" as TrendTone, detailPath: detailQueryPath("service-requests/details", "request", row.id), entityType: "service_request" as const, entityId: row.id })),
    ...input.providers.slice(0, 2).map((row) => ({ id: row.id, name: row.name, type: "مزود خدمة", city: row.city, owner: row.category, date: formatDashboardDate(row.joinedAt), status: adminProviderStatusMeta[row.status].label, statusTone: adminProviderStatusMeta[row.status].tone, priority: `${row.rating.toFixed(1)} تقييم`, priorityTone: "gold" as TrendTone, detailPath: detailQueryPath("providers/details", "provider", row.slug || row.id), managementAction: "provider_status" as const, statusForAction: row.status, slug: row.slug })),
    ...input.verification.slice(0, 2).map((row) => ({ id: row.id, name: row.requester, type: row.typeLabel, city: row.city, owner: row.typeLabel, date: formatDashboardDate(row.submittedAt), status: adminVerificationStatusMeta[row.status].label, statusTone: adminVerificationStatusMeta[row.status].tone, priority: `${row.completionPercent}%`, priorityTone: row.completionPercent >= 90 ? "green" as TrendTone : "gold" as TrendTone, detailPath: "review-center/verification" })),
    ...input.content.slice(0, 2).map((row) => ({ id: row.id, name: row.title, type: row.typeLabel, city: row.category, owner: row.author, date: row.updatedAt, status: adminContentStatusMeta[row.status].label, statusTone: adminContentStatusMeta[row.status].tone, priority: row.views, priorityTone: "gold" as TrendTone, detailPath: detailQueryPath(row.kind === "article" ? "content/article-details" : "content/details", "content", row.slug || row.id), managementAction: "content_status" as const, statusForAction: row.status, slug: row.slug })),
  ];
  return rows.slice(0, 8);
}

function reviewQueueManagementStatus(action: "provider_status" | "content_status", decision: "approved" | "rejected") {
  if (action === "provider_status") return decision === "approved" ? "approved" : "rejected";
  return decision === "approved" ? "published" : "archived";
}

function ReviewQueueActions({ row, actionable }: { row: ReviewQueueRow; actionable: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href={dashboardHref("admin", row.detailPath)} className="rounded-xl border px-4 py-2 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>عرض</Link>
      {actionable && row.entityType ? (
        <>
          <ReviewDecisionButton entityType={row.entityType} entityId={row.entityId} slug={row.slug} title={row.name} decision="approved" className="min-h-9 rounded-xl bg-[#087342] px-3 text-xs font-extrabold text-white">اعتماد</ReviewDecisionButton>
          <ReviewDecisionButton entityType={row.entityType} entityId={row.entityId} slug={row.slug} title={row.name} decision="needs_changes" className="min-h-9 rounded-xl border bg-white px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>تعديل</ReviewDecisionButton>
          <ReviewDecisionButton entityType={row.entityType} entityId={row.entityId} slug={row.slug} title={row.name} decision="rejected" className="min-h-9 rounded-xl border bg-[#fff0eb] px-3 text-xs font-extrabold text-[#A54118]" style={{ borderColor: "#efc5b9" }}>رفض</ReviewDecisionButton>
        </>
      ) : null}
      {actionable && row.managementAction ? (
        <>
          <AdminManagementActionButton action={row.managementAction} slug={row.slug} title={row.name} status={reviewQueueManagementStatus(row.managementAction, "approved")} payload={{ label: row.name }} className="min-h-9 rounded-xl bg-[#087342] px-3 text-xs font-extrabold text-white">اعتماد</AdminManagementActionButton>
          <AdminManagementActionButton action={row.managementAction} slug={row.slug} title={row.name} status={reviewQueueManagementStatus(row.managementAction, "rejected")} payload={{ label: row.name }} className="min-h-9 rounded-xl border bg-[#fff0eb] px-3 text-xs font-extrabold text-[#A54118]" style={{ borderColor: "#efc5b9" }}>رفض</AdminManagementActionButton>
        </>
      ) : null}
    </div>
  );
}

function ReviewQueueTable({ rows }: { rows: ReviewQueueRow[] }) {
  return <section className="overflow-hidden rounded-[22px] border bg-white shadow-card" style={{ borderColor: uiColors.border }}><div className="overflow-x-auto"><table className="w-full text-sm" style={{ minWidth: 980 }}><thead><tr className="bg-[#f4ede5] text-xs font-extrabold text-[#5f5953]">{["رقم الطلب", "الاسم", "النوع", "المدينة", "المالك", "تاريخ الإرسال", "الحالة", "درجة الحساسية", "الإجراءات"].map((header) => <th key={header} className="px-4 py-3 text-right">{header}</th>)}</tr></thead><tbody>{rows.length === 0 ? <tr><td colSpan={9} className="px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد طلبات مراجعة مطابقة.</td></tr> : rows.map((row) => { const actionable = canReviewQueueRowAct(row); return <tr key={`${row.type}-${row.id}`} className="border-b last:border-b-0" style={{ borderColor: uiColors.border }}><td className="px-4 py-4 font-bold">{row.id}</td><td className="px-4 py-4 font-display text-lg font-extrabold text-[#1D1916]">{row.name}</td><td className="px-4 py-4 font-bold text-[#5f5953]">{row.type}</td><td className="px-4 py-4 font-bold">{row.city}</td><td className="px-4 py-4 font-bold text-[#5f5953]">{row.owner}</td><td className="px-4 py-4 font-bold text-[#5f5953]">{row.date}</td><td className="px-4 py-4"><StatusPill label={row.status} tone={row.statusTone} /></td><td className="px-4 py-4"><StatusPill label={row.priority} tone={row.priorityTone} /></td><td className="px-4 py-4"><ReviewQueueActions row={row} actionable={actionable} /></td></tr>; })}</tbody></table></div></section>;
}

type AdminVerificationStatus = DashboardAdminReviewStatus;

const adminVerificationStatusMeta: Record<AdminVerificationStatus, { label: string; tone: TrendTone }> = {
  pending: { label: "قيد المراجعة", tone: "gold" },
  needs_changes: { label: "مطلوب تحديث", tone: "red" },
  approved: { label: "معتمد", tone: "green" },
  rejected: { label: "مرفوض", tone: "red" },
};

function stringParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

type DashboardSearchParams = Record<string, string | string[] | undefined>;

function stableDashboardFormReference(scope: string, key: string, actor?: DashboardActorContext | null, extra = "new") {
  const owner = actor?.organizationId ?? actor?.userId ?? actor?.email ?? "anonymous";
  return [scope, key, owner, extra]
    .map((part) => part.replaceAll(/[^a-z0-9-@.]/gi, "-"))
    .filter(Boolean)
    .join("-");
}

function entityParam(params: DashboardSearchParams | undefined, ...keys: string[]) {
  for (const key of keys) {
    const value = stringParam(params ?? {}, key).trim();
    if (value) return value;
  }
  return "";
}

function selectEntityByParam<T extends { id: string; slug?: string }>(rows: T[], params: DashboardSearchParams | undefined, ...keys: string[]) {
  const selected = entityParam(params, ...keys);
  if (!selected) return rows[0];
  return rows.find((row) => row.id === selected || row.slug === selected) ?? rows[0];
}

function verificationStatusFromParam(value: string): AdminVerificationStatus | undefined {
  return value === "pending" || value === "approved" || value === "rejected" ? value : undefined;
}

function verificationReviewHref(input: { status?: AdminVerificationStatus; q?: string }) {
  const query = new URLSearchParams();
  if (input.status) query.set("status", input.status);
  if (input.q) query.set("q", input.q);
  const qs = query.toString();
  return dashboardHref("admin", `review-center/verification${qs ? `?${qs}` : ""}`);
}

function verificationExportRows(rows: DashboardAdminVerificationRequest[]) {
  return rows.map((row) => ({
    "رقم الطلب": row.id,
    "طالب التوثيق": row.requester,
    "نوع الطلب": row.typeLabel,
    "الحالة": adminVerificationStatusMeta[row.status].label,
    "الحالة الخام": row.rawStatus,
    "نسبة الاكتمال": row.completionPercent,
    "المدينة": row.city,
    "تاريخ الإرسال": row.submittedAt,
    "تاريخ المراجعة": row.reviewedAt,
    "المراجع": row.reviewer,
    "الملاحظات": row.notes,
  }));
}

function AdminVerificationKpis({ rows, activeStatus }: { rows: DashboardAdminVerificationRequest[]; activeStatus?: AdminVerificationStatus }) {
  const cards = [
    { title: "إجمالي طلبات التوثيق", value: String(rows.length), unit: "طلب", icon: "shield", tone: "gold" as TrendTone, active: !activeStatus },
    { title: "قيد المراجعة", value: String(rows.filter((row) => row.status === "pending").length), unit: "طلب", icon: "clock", tone: "blue" as TrendTone, active: activeStatus === "pending" },
    { title: "طلبات معتمدة", value: String(rows.filter((row) => row.status === "approved").length), unit: "طلب", icon: "shield", tone: "green" as TrendTone, active: activeStatus === "approved" },
    { title: "طلبات مرفوضة", value: String(rows.filter((row) => row.status === "rejected").length), unit: "طلب", icon: "x", tone: "red" as TrendTone, active: activeStatus === "rejected" },
  ];

  return <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{cards.map((card) => <article key={card.title} className={cn("rounded-[22px] border bg-white p-5 shadow-card", card.active ? "ring-2 ring-[#A7815E]/30" : "")} style={{ borderColor: card.active ? "#A7815E" : uiColors.border }}><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-extrabold text-[#1D1916]">{card.title}</p><strong className="mt-2 block font-display text-3xl text-[#1D1916]">{card.value}</strong><span className="text-xs font-bold text-[#5f5953]">{card.unit}</span></div><span className="grid h-14 w-14 shrink-0 place-items-center rounded-full" style={{ backgroundColor: toneStyles[card.tone].bg, color: toneStyles[card.tone].text }}><Icon name={card.icon} className="h-6 w-6" /></span></div></article>)}</section>;
}

function AdminVerificationFilters({ rows, activeStatus, q }: { rows: DashboardAdminVerificationRequest[]; activeStatus?: AdminVerificationStatus; q: string }) {
  const filters: Array<[string, AdminVerificationStatus | undefined]> = [
    ["كل الطلبات", undefined],
    ["قيد المراجعة", "pending"],
    ["المعتمدة", "approved"],
    ["المرفوضة", "rejected"],
  ];
  return (
    <section className="rounded-[20px] border bg-white p-4 shadow-card" style={{ borderColor: uiColors.border }}>
      <div className="flex flex-wrap items-center gap-3">
        <form action={dashboardHref("admin", "review-center/verification")} className="relative min-w-[260px] flex-1">
          {activeStatus ? <input type="hidden" name="status" value={activeStatus} /> : null}
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6E6258]" />
          <input name="q" defaultValue={q} className="h-12 w-full rounded-xl border bg-[#fffdf9] pl-20 pr-12 text-sm font-bold outline-none focus:border-[#A7815E]" style={{ borderColor: uiColors.border }} placeholder="ابحث باسم طالب التوثيق أو رقم الطلب..." />
          <button type="submit" className="absolute left-2 top-1/2 h-9 -translate-y-1/2 rounded-lg bg-[#1D1916] px-4 text-xs font-extrabold text-white">بحث</button>
        </form>
        {filters.map(([label, status]) => (
          <Link key={label} href={verificationReviewHref({ status, q })} className={cn("inline-flex h-12 items-center justify-center rounded-xl border px-4 text-sm font-extrabold", activeStatus === status ? "bg-[#A7815E] text-white" : "bg-white text-[#1D1916]")} style={{ borderColor: activeStatus === status ? "#A7815E" : uiColors.border }}>{label}</Link>
        ))}
        <FinancialExportButton filename="mahabah-admin-verification-requests.csv" rows={verificationExportRows(rows)} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border bg-white px-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>تصدير</FinancialExportButton>
      </div>
    </section>
  );
}

function AdminVerificationTable({ rows }: { rows: DashboardAdminVerificationRequest[] }) {
  return <section className="overflow-hidden rounded-[22px] border bg-white shadow-card" style={{ borderColor: uiColors.border }}><div className="overflow-x-auto"><table className="w-full text-sm" style={{ minWidth: 1100 }}><thead><tr className="bg-[#f4ede5] text-xs font-extrabold text-[#5f5953]">{["رقم الطلب", "طالب التوثيق", "النوع", "تاريخ الإرسال", "نسبة الاكتمال", "الحالة", "المراجع", "الإجراءات"].map((header) => <th key={header} className="px-4 py-3 text-right">{header}</th>)}</tr></thead><tbody>{rows.length === 0 ? <tr><td colSpan={8} className="px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد طلبات توثيق مطابقة.</td></tr> : rows.map((row) => { const meta = adminVerificationStatusMeta[row.status]; return <tr key={row.id} className="border-b last:border-b-0" style={{ borderColor: uiColors.border }}><td className="px-4 py-4 align-middle font-bold text-[#1D1916]">{row.id}</td><td className="px-4 py-4 align-middle"><p className="font-display text-lg font-extrabold text-[#1D1916]">{row.requester}</p><p className="mt-1 text-xs font-bold text-[#6E6258]">{row.city} · {row.rawStatus}</p></td><td className="px-4 py-4 align-middle font-bold text-[#5f5953]">{row.typeLabel}</td><td className="px-4 py-4 align-middle font-bold text-[#5f5953]">{formatDashboardDate(row.submittedAt)}</td><td className="px-4 py-4 align-middle"><div className="min-w-28"><div className="mb-1 flex justify-between text-xs font-bold text-[#5f5953]"><span>اكتمال</span><span>{row.completionPercent}%</span></div><div className="h-2 rounded-full bg-[#EFE8E1]"><span className="block h-2 rounded-full bg-[#A7815E]" style={{ width: `${Math.min(100, Math.max(0, row.completionPercent))}%` }} /></div></div></td><td className="px-4 py-4 align-middle"><StatusPill label={meta.label} tone={meta.tone} /></td><td className="px-4 py-4 align-middle font-bold text-[#5f5953]">{row.reviewer}</td><td className="px-4 py-4 align-middle"><div className="flex flex-wrap gap-2"><ReviewDecisionButton entityType="verification_request" entityId={row.id} decision="approved" className="min-h-10 rounded-xl bg-[#087342] px-3 text-xs font-extrabold text-white">اعتماد</ReviewDecisionButton><ReviewDecisionButton entityType="verification_request" entityId={row.id} decision="needs_changes" className="min-h-10 rounded-xl border bg-white px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>تحديث</ReviewDecisionButton><ReviewDecisionButton entityType="verification_request" entityId={row.id} decision="rejected" className="min-h-10 rounded-xl border bg-[#fff0eb] px-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: "#efc5b9" }}>رفض</ReviewDecisionButton></div></td></tr>; })}</tbody></table></div></section>;
}

async function AdminVerificationRequestsPage({ config, searchParams = {} }: { config: DashboardRoleConfig; searchParams?: Record<string, string | string[] | undefined> }) {
  const result = await listDashboardAdminVerificationRequests();
  const activeStatus = verificationStatusFromParam(stringParam(searchParams, "status"));
  const q = stringParam(searchParams, "q").trim();
  const normalizedQuery = q.toLocaleLowerCase("ar-SA");
  const rows = result.data.filter((row) => {
    const statusMatches = activeStatus ? row.status === activeStatus : true;
    const queryMatches = normalizedQuery
      ? [row.id, row.requester, row.typeLabel, row.city, row.rawStatus, row.notes ?? ""].some((value) => value.toLocaleLowerCase("ar-SA").includes(normalizedQuery))
      : true;
    return statusMatches && queryMatches;
  });
  const latest = rows[0] ?? result.data[0];

  return (
    <ReviewShell config={config} kind="verification">
      <AdminVerificationKpis rows={result.data} activeStatus={activeStatus} />
      <AdminVerificationFilters rows={rows} activeStatus={activeStatus} q={q} />
      {result.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر الاتصال ببيانات طلبات التوثيق الحية، وتم عرض بيانات تجريبية مؤقتة.</section> : null}
      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.75fr]">
        <AdminVerificationTable rows={rows} />
        <div className="grid content-start gap-4">
          <SettingsPanel title="ملخص التوثيق">
            <ReviewDonut total={String(result.data.length)} />
            <div className="mt-4 grid gap-3">
              {[
                ["متوسط اكتمال الملفات", `${Math.round(result.data.reduce((sum, row) => sum + row.completionPercent, 0) / Math.max(result.data.length, 1))}%`],
                ["طلبات تحتاج مراجعة", String(result.data.filter((row) => row.status === "pending").length)],
                ["مصدر البيانات", result.source === "supabase" ? "Supabase" : "بيانات تجريبية"],
              ].map(([label, value]) => <div key={label} className="flex items-center justify-between rounded-xl border p-3 text-sm font-bold" style={{ borderColor: uiColors.border }}><span className="text-[#5f5953]">{label}</span><strong className="text-[#1D1916]">{value}</strong></div>)}
            </div>
          </SettingsPanel>
          <SettingsPanel title="آخر طلب">
            {latest ? <div className="grid gap-3"><StatusPill label={adminVerificationStatusMeta[latest.status].label} tone={adminVerificationStatusMeta[latest.status].tone} /><h3 className="font-display text-xl font-extrabold text-[#1D1916]">{latest.requester}</h3><p className="text-sm font-bold leading-7 text-[#5f5953]">{latest.notes ?? "طلب توثيق بانتظار مراجعة مستندات الهوية والامتثال."}</p><div className="rounded-xl border bg-[#fffdf9] p-3 text-sm font-bold text-[#5f5953]" style={{ borderColor: uiColors.border }}>تاريخ الإرسال: {formatDashboardDate(latest.submittedAt)}</div></div> : <p className="text-sm font-bold text-[#5f5953]">لا توجد طلبات لعرضها.</p>}
          </SettingsPanel>
        </div>
      </section>
    </ReviewShell>
  );
}

async function loadReviewCenterData() {
  const [assets, contributions, services, providers, verification, content, auditLogs] = await Promise.all([
    listDashboardAdminAssets(),
    listDashboardAdminContributions(),
    listDashboardAdminServiceRequests(),
    listDashboardAdminProviders(),
    listDashboardAdminVerificationRequests(),
    listDashboardAdminContentItems(),
    listDashboardAdminAuditLogs("activity"),
  ]);
  return { assets, contributions, services, providers, verification, content, auditLogs };
}

function reviewRowsForKind(kind: "assets" | "contributions" | "services" | "providers" | "verification" | "content", data: Awaited<ReturnType<typeof loadReviewCenterData>>) {
  return latestReviewQueueRows({
    assets: kind === "assets" ? data.assets.data : [],
    contributions: kind === "contributions" ? data.contributions.data : [],
    services: kind === "services" ? data.services.data : [],
    providers: kind === "providers" ? data.providers.data : [],
    verification: kind === "verification" ? data.verification.data : [],
    content: kind === "content" ? data.content.data : [],
  });
}

function reviewQueueStatusBucket(row: ReviewQueueRow): ReviewQueueStatusFilter {
  if (row.status.includes("معتمد") || row.status.includes("منشور")) return "approved";
  if (row.status.includes("مرفوض") || row.status.includes("مؤرشف")) return "rejected";
  return "pending";
}

function reviewDashboardKpiCards(data: Awaited<ReturnType<typeof loadReviewCenterData>>): ReviewKpiCard[] {
  return [
    { label: "الأصول العقارية", value: String(data.assets.data.filter((row) => row.status === "pending").length), unit: "للمراجعة", icon: "building", tone: "gold" },
    { label: "المساهمات العقارية", value: String(data.contributions.data.filter((row) => row.status === "pending").length), unit: "للمراجعة", icon: "clipboard", tone: "gold" },
    { label: "الخدمات العقارية", value: String(data.services.data.filter((row) => row.status !== "completed").length), unit: "للمتابعة", icon: "file", tone: "blue" },
    { label: "مزودو الخدمات", value: String(data.providers.data.filter((row) => row.status === "pending").length), unit: "للمراجعة", icon: "users", tone: "gold" },
    { label: "طلبات التوثيق", value: String(data.verification.data.filter((row) => row.status === "pending").length), unit: "للمراجعة", icon: "folder", tone: "gold" },
    { label: "الأخبار والمقالات", value: String(data.content.data.filter((row) => row.status === "review" || row.status === "draft").length), unit: "للمراجعة", icon: "file-text", tone: "gold" },
  ];
}

function reviewQueueKpiCards(kind: "assets" | "contributions" | "services" | "providers" | "verification" | "content", rows: ReviewQueueRow[]): ReviewKpiCard[] {
  const meta: Record<"assets" | "contributions" | "services" | "providers" | "verification" | "content", { total: string; unit: string; icon: string }> = {
    assets: { total: "إجمالي الأصول", unit: "أصل", icon: "building" },
    contributions: { total: "إجمالي المساهمات", unit: "مساهمة", icon: "clipboard" },
    services: { total: "إجمالي الخدمات", unit: "خدمة", icon: "file" },
    providers: { total: "إجمالي المزودين", unit: "مزود", icon: "users" },
    verification: { total: "إجمالي طلبات التوثيق", unit: "طلب", icon: "shield" },
    content: { total: "إجمالي المحتوى", unit: "محتوى", icon: "file-text" },
  };
  const pending = rows.filter((row) => reviewQueueStatusBucket(row) === "pending").length;
  const approved = rows.filter((row) => reviewQueueStatusBucket(row) === "approved").length;
  const rejected = rows.filter((row) => reviewQueueStatusBucket(row) === "rejected").length;
  const needsAttention = rows.filter((row) => row.priorityTone === "red" || row.priorityTone === "gold").length;
  return [
    { label: meta[kind].total, value: String(rows.length), unit: meta[kind].unit, icon: meta[kind].icon, tone: "gold" },
    { label: "قيد المراجعة", value: String(pending), unit: meta[kind].unit, icon: "clock", tone: "blue" },
    { label: "معتمد", value: String(approved), unit: meta[kind].unit, icon: "shield", tone: "green" },
    { label: "مرفوض", value: String(rejected), unit: meta[kind].unit, icon: "x", tone: "red" },
    { label: "يحتاج متابعة", value: String(needsAttention), unit: meta[kind].unit, icon: "target", tone: "gold" },
  ];
}

function reviewQueueSeries(rows: ReviewQueueRow[]) {
  if (!rows.length) return reportSeries;
  return rows.slice(0, 12).map((row) => {
    if (row.priorityTone === "red") return 100;
    if (row.priorityTone === "gold") return 70;
    if (reviewQueueStatusBucket(row) === "approved") return 35;
    if (reviewQueueStatusBucket(row) === "rejected") return 20;
    return 55;
  });
}

function filterReviewQueueRows(rows: ReviewQueueRow[], searchParams: Record<string, string | string[] | undefined>) {
  const status = stringParam(searchParams, "status");
  const activeStatus: ReviewQueueStatusFilter | undefined = status === "pending" || status === "approved" || status === "rejected" ? status : undefined;
  const q = stringParam(searchParams, "q").trim();
  const normalizedQuery = q.toLocaleLowerCase("ar-SA");
  const filteredRows = rows.filter((row) => {
    const statusMatches = activeStatus ? reviewQueueStatusBucket(row) === activeStatus : true;
    const queryMatches = normalizedQuery
      ? [row.id, row.name, row.type, row.city, row.owner, row.status, row.priority].some((value) => value.toLocaleLowerCase("ar-SA").includes(normalizedQuery))
      : true;
    return statusMatches && queryMatches;
  });
  return { rows: filteredRows, q, activeStatus };
}

async function ReviewDashboardPage({ config }: { config: DashboardRoleConfig }) {
  const data = await loadReviewCenterData();
  const rows = latestReviewQueueRows({ assets: data.assets.data, contributions: data.contributions.data, services: data.services.data, providers: data.providers.data, verification: data.verification.data, content: data.content.data });
  const total = data.assets.data.length + data.contributions.data.length + data.services.data.length + data.providers.data.length + data.verification.data.length + data.content.data.length;
  const approved = data.assets.data.filter((row) => row.status === "approved").length + data.contributions.data.filter((row) => row.status === "approved").length + data.providers.data.filter((row) => row.status === "approved").length + data.verification.data.filter((row) => row.status === "approved").length + data.content.data.filter((row) => row.status === "published").length;
  const rejected = data.assets.data.filter((row) => row.status === "rejected").length + data.contributions.data.filter((row) => row.status === "rejected").length + data.providers.data.filter((row) => row.status === "rejected").length + data.verification.data.filter((row) => row.status === "rejected").length + data.content.data.filter((row) => row.status === "archived").length;
  const pending = Math.max(total - approved - rejected, 0);
  const hasFallback = Boolean(data.assets.error || data.contributions.error || data.services.error || data.providers.error || data.verification.error || data.content.error);
  return <ReviewShell config={config} kind="dashboard"><ReviewKpis cards={reviewDashboardKpiCards(data)} />{hasFallback ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل بعض بيانات مركز المراجعة من Supabase، وتم عرض البيانات المتاحة مع الاحتياطي.</section> : null}<section className="grid gap-4 xl:grid-cols-[1.3fr_0.8fr]"><SettingsPanel title="حالات المراجعة حسب النوع"><div className="grid gap-5 md:grid-cols-[1fr_1fr] md:items-center"><ReviewDonut total={String(total)} /><div className="grid gap-3">{[`معتمد ${approved}`, `قيد المراجعة ${pending}`, `مرفوض ${rejected}`, `أصول ${data.assets.data.length}`, `مساهمات ${data.contributions.data.length}`].map((item) => <div key={item} className="flex justify-between border-b pb-2 text-sm font-bold" style={{ borderColor: uiColors.border }}><span>{item}</span><span className="text-[#A7815E]">●</span></div>)}</div></div></SettingsPanel><SettingsPanel title="أداء المراجعة"><div className="grid gap-3">{[[String(total), "إجمالي الطلبات"], [String(approved), "إجمالي معتمد"], [String(rejected), "إجمالي مرفوض"], [data.auditLogs.source === "supabase" ? "حي" : "احتياطي", "مصدر سجل النشاط"]].map(([value, label]) => <div key={label} className="flex items-center justify-between rounded-xl border p-4" style={{ borderColor: uiColors.border }}><span className="font-bold text-[#5f5953]">{label}</span><strong className="font-display text-2xl text-[#1D1916]">{value}</strong></div>)}</div></SettingsPanel></section><SettingsPanel title="آخر الطلبات الواردة"><ReviewQueueTable rows={rows} /></SettingsPanel></ReviewShell>;
}

async function ReviewQueuePage({ config, kind, searchParams = {} }: { config: DashboardRoleConfig; kind: "assets" | "contributions" | "services" | "providers" | "verification" | "content"; searchParams?: Record<string, string | string[] | undefined> }) {
  const data = await loadReviewCenterData();
  const allRows = reviewRowsForKind(kind, data);
  const { rows, q, activeStatus } = filterReviewQueueRows(allRows, searchParams);
  const total = rows.length;
  const approved = rows.filter((row) => row.status.includes("معتمد") || row.status.includes("منشور")).length;
  const rejected = rows.filter((row) => row.status.includes("مرفوض") || row.status.includes("مؤرشف")).length;
  const hasFallback = Boolean(data.assets.error || data.contributions.error || data.services.error || data.providers.error || data.verification.error || data.content.error);
  return <ReviewShell config={config} kind={kind}><ReviewKpis cards={reviewQueueKpiCards(kind, allRows)} />{hasFallback ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل بعض بيانات المراجعة الحية، وتم عرض البيانات المتاحة مع الاحتياطي.</section> : null}<ReviewFilters search={`ابحث في ${reviewMeta[kind].title}...`} basePath={reviewMeta[kind].active} q={q} activeStatus={activeStatus} /><section className="grid gap-4 xl:grid-cols-[1.35fr_0.8fr]"><ReviewQueueTable rows={rows} /><div className="grid gap-4"><SettingsPanel title="توزيع الطلبات حسب النوع"><ReviewDonut total={String(total)} /><Link href={dashboardHref("admin", kind === "contributions" ? "reports/contributions" : kind === "services" ? "reports/services" : "reports/assets")} className="mt-4 grid min-h-11 w-full place-items-center rounded-xl border text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>عرض التقرير التفصيلي</Link></SettingsPanel><SettingsPanel title="تقرير أداء المراجعة"><div className="grid gap-3">{[[`${total ? Math.round((approved / total) * 100) : 0}%`, "نسبة الاعتماد"], [`${total ? Math.round((rejected / total) * 100) : 0}%`, "نسبة الرفض"], [data.auditLogs.source === "supabase" ? "حي" : "احتياطي", "مصدر السجل"]].map(([label, value]) => <div key={value} className="flex items-center justify-between rounded-xl border p-3" style={{ borderColor: uiColors.border }}><span className="font-bold text-[#5f5953]">{value}</span><strong className="font-display text-xl">{label}</strong></div>)}</div></SettingsPanel></div></section><section className="grid gap-4 lg:grid-cols-3"><SettingsPanel title="آخر المراجعات"><SystemLogList rows={data.auditLogs.data.slice(0, 4)} /></SettingsPanel><SettingsPanel title="إحصائيات الأداء"><ReportsLineChart series={reviewQueueSeries(rows.length ? rows : allRows)} /></SettingsPanel><SettingsPanel title="تنبيهات مهمة"><div className="grid gap-3">{[["طلبات بانتظار مراجعة", Math.max(total - approved - rejected, 0)], ["طلبات مرفوضة", rejected], ["طلبات معتمدة", approved]].map(([item, count]) => <div key={item} className="flex items-center justify-between rounded-xl border p-3 text-sm font-bold" style={{ borderColor: uiColors.border }}><span>{item}</span><strong className="text-[#A54118]">{count}</strong></div>)}</div></SettingsPanel></section></ReviewShell>;
}

async function ReviewDetailPage({ config, kind, searchParams = {} }: { config: DashboardRoleConfig; kind: "assetDetails" | "contributionDetails"; searchParams?: DashboardSearchParams }) {
  const contribution = kind === "contributionDetails";
  const assetsResult = contribution ? undefined : await listDashboardAdminAssets();
  const contributionsResult = contribution ? await listDashboardAdminContributions() : undefined;
  const selectedAsset = assetsResult ? selectEntityByParam(assetsResult.data, searchParams, "asset", "id", "slug") : undefined;
  const selectedContribution = contributionsResult ? selectEntityByParam(contributionsResult.data, searchParams, "contribution", "id", "slug") : undefined;
  const reviewEntity: { entityType: "asset" | "contribution"; entityId: string; slug: string; title: string; reference: string; city: string; owner: string; value: string; submittedAt: string; image: string; statusLabel: string; statusTone: TrendTone; reviewer: string; risk: string; rawStatus: string; documentTypes: string[]; criteria: [string, number, string][]; baseScore: number } | undefined = selectedContribution
    ? {
        entityType: "contribution",
        entityId: selectedContribution.id,
        slug: selectedContribution.slug,
        title: selectedContribution.titleAr,
        reference: selectedContribution.licenseNumber ?? selectedContribution.id,
        city: selectedContribution.cityAr,
        owner: selectedContribution.sponsor,
        value: formatSar(selectedContribution.capitalSar),
        submittedAt: selectedContribution.submittedAt,
        image: selectedContribution.image,
        statusLabel: adminContributionStatusMeta[selectedContribution.status].label,
        statusTone: adminContributionStatusMeta[selectedContribution.status].tone,
        reviewer: selectedContribution.reviewer,
        risk: selectedContribution.risk,
        rawStatus: selectedContribution.rawStatus,
        documentTypes: ["contribution_document", "contribution_review_decision", "contribution_license", "contribution_study", "contribution_financial_statement"],
        criteria: [
          ["بيانات المساهمة", selectedContribution.titleAr && selectedContribution.cityAr ? 18 : 10, "البيانات الأساسية"],
          ["الرخصة ورابط الطرح", selectedContribution.licenseNumber && selectedContribution.offeringUrl ? 18 : selectedContribution.licenseNumber || selectedContribution.offeringUrl ? 12 : 7, "الامتثال"],
          ["المؤشرات المالية", selectedContribution.capitalSar > 0 && selectedContribution.durationMonths > 0 ? 18 : 10, "التحليل المالي"],
          ["التقدم والتمويل", selectedContribution.fundedPercent >= 50 ? 17 : selectedContribution.fundedPercent > 0 ? 12 : 8, "مؤشرات الطرح"],
          ["المخاطر", selectedContribution.risk === "منخفض" ? 18 : selectedContribution.risk === "متوسط" ? 14 : 9, "درجة المخاطر"],
        ],
        baseScore: selectedContribution.status === "approved" ? 92 : selectedContribution.status === "rejected" ? 36 : selectedContribution.status === "needs_changes" ? 58 : 72,
      }
    : selectedAsset
      ? {
          entityType: "asset",
          entityId: selectedAsset.id,
          slug: selectedAsset.slug,
          title: selectedAsset.titleAr,
          reference: selectedAsset.deedNumber ?? selectedAsset.id,
          city: selectedAsset.cityAr,
          owner: selectedAsset.owner,
          value: formatSar(selectedAsset.estimatedValueSar),
          submittedAt: selectedAsset.submittedAt,
          image: selectedAsset.image,
          statusLabel: adminAssetStatusMeta[selectedAsset.status].label,
          statusTone: adminAssetStatusMeta[selectedAsset.status].tone,
          reviewer: selectedAsset.reviewer,
          risk: selectedAsset.risk,
          rawStatus: selectedAsset.rawStatus,
          documentTypes: ["asset_document", "asset_review_decision", "asset_deed", "asset_site_plan", "asset_valuation"],
          criteria: [
            ["بيانات الأصل", selectedAsset.titleAr && selectedAsset.cityAr ? 18 : 10, "البيانات الأساسية"],
            ["الصك والموقع", selectedAsset.deedNumber ? 18 : 8, "المستندات"],
            ["المساحة والأبعاد", selectedAsset.areaSqm > 0 && selectedAsset.streetWidthM ? 17 : selectedAsset.areaSqm > 0 ? 12 : 8, "البيانات الفنية"],
            ["القيمة التقديرية", selectedAsset.estimatedValueSar > 0 ? 17 : 8, "التقييم"],
            ["المخاطر", selectedAsset.risk === "منخفض" ? 18 : selectedAsset.risk === "متوسط" ? 14 : 9, "درجة المخاطر"],
          ],
          baseScore: selectedAsset.status === "approved" ? 92 : selectedAsset.status === "rejected" ? 36 : selectedAsset.status === "needs_changes" ? 58 : 72,
        }
      : undefined;
  const hasFallback = Boolean(assetsResult?.error || contributionsResult?.error);
  const entityLabel = contribution ? "المساهمة" : "الأصل";
  if (!reviewEntity) {
    return <ReviewShell config={config} kind={kind}>{hasFallback ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل بيانات التفاصيل الحية من Supabase، ولم يتم العثور على {entityLabel} مطابق.</section> : null}<section className="rounded-[22px] border bg-white p-8 text-center text-sm font-extrabold text-[#6E6258]" style={{ borderColor: uiColors.border }}>لا توجد بيانات مراجعة مطابقة للطلب الحالي.</section></ReviewShell>;
  }
  const [documentsResult, auditLogs] = await Promise.all([
    listDashboardDocumentsForEntity({ scope: "admin", entityId: reviewEntity.entityId, entityRef: reviewEntity.slug, entityTypes: reviewEntity.documentTypes }),
    listDashboardAdminAuditLogs(),
  ]);
  const documentScore = documentsResult.data.length ? Math.min(10, documentsResult.data.length * 2) : 0;
  const reviewScore = Math.min(100, Math.max(0, reviewEntity.baseScore + documentScore));
  const statusProgress = reviewEntity.rawStatus === "approved" ? 100 : reviewEntity.rawStatus === "rejected" ? 100 : reviewEntity.rawStatus === "needs_changes" ? 66 : 50;
  const relatedAuditLogs = auditLogs.data
    .filter((row) => matchesDashboardSearch(reviewEntity.entityId, [row.id, row.target, row.event]) || matchesDashboardSearch(reviewEntity.title, [row.target, row.event]) || matchesDashboardSearch(reviewEntity.reference, [row.target, row.event]))
    .slice(0, 4);
  const reviewNotes = relatedAuditLogs.length
    ? relatedAuditLogs.map((row) => ({ author: row.user, note: `${row.event} - ${row.status}`, time: row.time }))
    : [{ author: reviewEntity.reviewer, note: `${reviewEntity.statusLabel}، مستوى المخاطر ${reviewEntity.risk}.`, time: formatDashboardDate(reviewEntity.submittedAt) }];
  const reviewTimeline: [string, string, boolean][] = [
    ["استلام الطلب", formatDashboardDate(reviewEntity.submittedAt), true],
    ["مراجعة المستندات", `${documentsResult.data.length} ملفات`, documentsResult.data.length > 0],
    ["تحليل المخاطر", reviewEntity.risk, true],
    ["قرار المراجعة", reviewEntity.statusLabel, reviewEntity.rawStatus === "approved" || reviewEntity.rawStatus === "rejected"],
  ];

  return (
    <ReviewShell config={config} kind={kind}>
      {hasFallback ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل بيانات التفاصيل الحية من Supabase، وتم عرض البيانات المتاحة مع الاحتياطي.</section> : null}
      {documentsResult.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل مستندات المراجعة الحية من Supabase.</section> : null}
      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.5fr_0.8fr]">
        <SettingsPanel title={contribution ? "بيانات المساهمة" : "حالة المراجعة"}>
          <StatusPill label={reviewEntity.statusLabel} tone={reviewEntity.statusTone} />
          <h2 className="mt-5 font-display text-2xl font-extrabold text-[#1D1916]">{reviewEntity.title}</h2>
          <p className="mt-2 text-sm font-bold text-[#5f5953]">{reviewEntity.reference}</p>
          <p className="mt-3 text-xs font-bold text-[#8A7E73]">المراجع: {reviewEntity.reviewer}</p>
        </SettingsPanel>
        <SettingsPanel title={contribution ? "المعلومات الأساسية" : "صورة وبيانات الأصل"}>
          <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
            <div className="relative min-h-48 overflow-hidden rounded-2xl border" style={{ borderColor: uiColors.border }}><Image src={reviewEntity.image} alt="" fill className="object-cover" sizes="420px" /></div>
            <div className="grid gap-3">{[["المدينة", reviewEntity.city], ["المالك", reviewEntity.owner], ["القيمة", reviewEntity.value], ["تاريخ الإرسال", formatDashboardDate(reviewEntity.submittedAt)], ["المخاطر", reviewEntity.risk]].map(([label, value]) => <div key={label} className="flex justify-between border-b pb-2" style={{ borderColor: uiColors.border }}><span className="font-bold text-[#5f5953]">{label}</span><strong>{value}</strong></div>)}</div>
          </div>
        </SettingsPanel>
        <SettingsPanel title="درجة التقييم">
          <div className="mx-auto grid h-36 w-36 place-items-center rounded-full text-center" style={{ background: `conic-gradient(#24A36A 0 ${reviewScore}%, #E7E0D8 ${reviewScore}% 100%)` }}>
            <div className="grid h-24 w-24 place-items-center rounded-full bg-white"><strong className="font-display text-3xl">{reviewScore}</strong><span className="text-xs font-bold">من 100</span></div>
          </div>
          <p className="mt-4 text-center text-sm font-bold text-[#A7815E]">{documentsResult.data.length ? `${documentsResult.data.length} مستندات` : "لا توجد مستندات"}</p>
        </SettingsPanel>
      </section>
      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr_1fr]">
        <DashboardDocumentsPanel title="المستندات المرفقة" documents={documentsResult.data} error={documentsResult.error} emptyLabel={`لا توجد مستندات مرفوعة لهذا ${entityLabel} بعد.`} />
        <SettingsPanel title="معايير المراجعة">
          <div className="overflow-x-auto"><table className="w-full text-sm" style={{ minWidth: 560 }}><thead><tr className="text-[#6E6258]"><th className="py-3 text-right">المعيار</th><th>الدرجة</th><th>الوزن</th><th>النتيجة</th></tr></thead><tbody>{reviewEntity.criteria.map(([item, score, group]) => <tr key={item} className="border-t" style={{ borderColor: uiColors.border }}><td className="py-3 font-extrabold">{item}</td><td className="text-center">{score} / 20</td><td className="text-center">20%</td><td className="text-center"><StatusPill label={score >= 17 ? "ممتاز" : score >= 12 ? "جيد" : "بحاجة تحديث"} tone={score >= 17 ? "green" : score >= 12 ? "blue" : "gold"} /></td><td className="sr-only">{group}</td></tr>)}</tbody></table></div>
        </SettingsPanel>
        <SettingsPanel title="ملاحظات المراجعين">
          <div className="grid gap-4">{reviewNotes.map((note, index) => <div key={`${note.author}-${note.time}-${index}`} className="border-r-2 pr-4" style={{ borderColor: index === 0 ? "#A7815E" : "#C9D8CE" }}><p className="font-extrabold text-[#1D1916]">{note.author}</p><p className="mt-1 text-sm font-bold leading-7 text-[#5f5953]">{note.note}</p><p className="mt-1 text-xs font-bold text-[#8A7E73]">{note.time}</p></div>)}</div>
        </SettingsPanel>
      </section>
      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr_0.8fr]">
        <SettingsPanel title="تاريخ المراجعة">
          <div className="grid gap-3">{reviewTimeline.map(([step, value, done]) => <div key={step} className="flex items-center justify-between border-b pb-2" style={{ borderColor: uiColors.border }}><span className="font-bold">{step}</span><span className={cn("text-sm font-bold", done ? "text-[#087342]" : "text-[#5f5953]")}>{value}</span></div>)}</div>
          <div className="mt-4 h-2 rounded-full bg-[#EFE8E1]"><span className="block h-2 rounded-full bg-[#A7815E]" style={{ width: `${statusProgress}%` }} /></div>
        </SettingsPanel>
        <SettingsPanel title="قرار المراجعة">
          <div className="grid gap-3 md:grid-cols-3">
            <ReviewDecisionButton entityType={reviewEntity.entityType} entityId={reviewEntity.entityId} slug={reviewEntity.slug} title={reviewEntity.title} decision="approved" note={`اعتماد ${entityLabel} من شاشة تفاصيل المراجعة.`} className="rounded-2xl border bg-[#EAF6EF] p-5 font-extrabold text-[#1D6A43]" style={{ borderColor: "#CDE9D8" }}>اعتماد {entityLabel}</ReviewDecisionButton>
            <ReviewDecisionButton entityType={reviewEntity.entityType} entityId={reviewEntity.entityId} slug={reviewEntity.slug} title={reviewEntity.title} decision="needs_changes" note={`طلب تعديل بيانات ${entityLabel} من شاشة تفاصيل المراجعة.`} className="rounded-2xl border bg-[#FFF7EC] p-5 font-extrabold text-[#A7815E]" style={{ borderColor: "#F0D8B8" }}>طلب تعديل</ReviewDecisionButton>
            <ReviewDecisionButton entityType={reviewEntity.entityType} entityId={reviewEntity.entityId} slug={reviewEntity.slug} title={reviewEntity.title} decision="rejected" note={`رفض ${entityLabel} من شاشة تفاصيل المراجعة.`} className="rounded-2xl border bg-[#FDEDED] p-5 font-extrabold text-[#A54118]" style={{ borderColor: "#F1C8C8" }}>رفض {entityLabel}</ReviewDecisionButton>
          </div>
        </SettingsPanel>
        <SettingsPanel title="مرفقات القرار">
          <DashboardDocumentUploadButton scope="admin" entityType={`${reviewEntity.entityType}_review_decision`} entityId={reviewEntity.entityId} label={`مرفق قرار ${reviewEntity.title}`} className="grid min-h-40 cursor-pointer place-items-center rounded-xl border border-dashed text-center text-sm font-bold text-[#5f5953]" style={{ borderColor: uiColors.border }}>اسحب وأفلت الملفات هنا<br />أو اضغط لاختيار ملف<br />PDF, PNG, JPG</DashboardDocumentUploadButton>
        </SettingsPanel>
      </section>
    </ReviewShell>
  );
}

type ApprovalLogRow = {
  id: string;
  desc: string;
  method: string;
  credits: number;
  status: string;
  tone: TrendTone;
  time: string;
  href: string;
};

function approvalKpiCards(rows: ApprovalLogRow[]): ReviewKpiCard[] {
  const totalCredits = rows.reduce((sum, row) => sum + row.credits, 0);
  const successCredits = rows.filter((row) => row.tone === "green").reduce((sum, row) => sum + row.credits, 0);
  const pendingCredits = rows.filter((row) => row.tone === "gold").reduce((sum, row) => sum + row.credits, 0);
  const failedCredits = rows.filter((row) => row.tone === "red").reduce((sum, row) => sum + row.credits, 0);
  return [
    { label: "إجمالي الاعتمادات", value: String(totalCredits), unit: "اعتماد", icon: "shield", tone: "gold" },
    { label: "اعتمادات ناجحة", value: String(successCredits), unit: "اعتماد", icon: "shield", tone: "green" },
    { label: "اعتمادات معلقة", value: String(pendingCredits), unit: "اعتماد", icon: "clock", tone: "blue" },
    { label: "اعتمادات فاشلة", value: String(failedCredits), unit: "اعتماد", icon: "x", tone: "red" },
    { label: "عدد العمليات", value: String(rows.length), unit: "عملية", icon: "chart", tone: "gold" },
  ];
}

function approvalRowsFromFinancial(payments: DashboardPayment[]): ApprovalLogRow[] {
  return payments.map((payment) => ({
    id: payment.providerReference ?? payment.id,
    desc: payment.title,
    method: paymentMethodLabel(payment.method),
    credits: Math.max(1, Math.round(payment.amount / 100)),
    status: payment.statusLabel,
    tone: payment.tone,
    time: formatDashboardDate(payment.paidAt ?? payment.createdAt),
    href: dashboardHref("admin", `payments/details?payment=${encodeURIComponent(payment.providerReference || payment.id)}`),
  }));
}

function filterApprovalRows(rows: ApprovalLogRow[], searchParams: Record<string, string | string[] | undefined>) {
  const q = stringParam(searchParams, "q").trim();
  const status = stringParam(searchParams, "status").trim();
  const normalizedQuery = q.toLocaleLowerCase("ar-SA");
  const filteredRows = rows.filter((row) => {
    const statusMatches = status ? row.status.includes(status) : true;
    const queryMatches = normalizedQuery
      ? [row.id, row.desc, row.method, row.status, row.time].some((value) => value.toLocaleLowerCase("ar-SA").includes(normalizedQuery))
      : true;
    return statusMatches && queryMatches;
  });
  return { rows: filteredRows, q };
}

function approvalExportRows(rows: ApprovalLogRow[]) {
  return rows.map((row) => ({
    "رقم العملية": row.id,
    الوصف: row.desc,
    "طريقة الدفع": row.method,
    الاعتمادات: row.credits,
    الحالة: row.status,
    "التاريخ والوقت": row.time,
  }));
}

function approvalMethodShares(rows: ApprovalLogRow[]) {
  const total = Math.max(rows.length, 1);
  return Array.from(rows.reduce((map, row) => map.set(row.method, (map.get(row.method) ?? 0) + 1), new Map<string, number>()))
    .map(([method, count]) => [method, `${Math.round((count / total) * 100)}%`] as const)
    .slice(0, 4);
}

function approvalSeries(rows: ApprovalLogRow[]) {
  const sourceRows = rows.length ? rows : [];
  if (!sourceRows.length) return reportSeries;
  return sourceRows.slice(0, 12).map((row) => row.credits);
}

async function ApprovalLogPage({ config, searchParams = {} }: { config: DashboardRoleConfig; searchParams?: Record<string, string | string[] | undefined> }) {
  const financial = await listDashboardFinancial("admin");
  const allRows = approvalRowsFromFinancial(financial.payments);
  const { rows, q } = filterApprovalRows(allRows, searchParams);
  const credits = rows.reduce((sum, row) => sum + row.credits, 0);
  const maxCredits = rows.reduce((max, row) => Math.max(max, row.credits), 0);
  const minCredits = rows.reduce((min, row) => Math.min(min, row.credits), rows[0]?.credits ?? 0);
  const methodShares = approvalMethodShares(rows.length ? rows : allRows);
  return <ReviewShell config={config} kind="approvals"><ReviewKpis cards={approvalKpiCards(allRows)} />{financial.error ? <section className="rounded-[18px] border bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل سجل الاعتمادات المالي من Supabase، وتم عرض بيانات احتياطية مؤقتة.</section> : null}<section className="rounded-[20px] border bg-white p-4 shadow-card" style={{ borderColor: uiColors.border }}><div className="flex flex-wrap items-center gap-3"><form action={dashboardHref("admin", "review-center/approvals")} className="relative min-w-[260px] flex-1"><Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6E6258]" /><input name="q" defaultValue={q} className="h-12 w-full rounded-xl border bg-[#fffdf9] pl-20 pr-12 text-sm font-bold outline-none" style={{ borderColor: uiColors.border }} placeholder="ابحث برقم العملية أو الوصف..." /><button type="submit" className="absolute left-2 top-1/2 h-9 -translate-y-1/2 rounded-lg bg-[#101010] px-4 text-xs font-extrabold text-white">بحث</button></form><Link href={dashboardHref("admin", "review-center/approvals")} className="grid h-12 place-items-center rounded-xl border bg-white px-4 text-sm font-extrabold text-[#1D1916]" style={{ borderColor: uiColors.border }}>كل العمليات</Link><Link href={dashboardHref("admin", "payments")} className="grid h-12 place-items-center rounded-xl border bg-white px-4 text-sm font-extrabold text-[#1D1916]" style={{ borderColor: uiColors.border }}>المدفوعات</Link><FinancialExportButton filename="mahabah-approval-log.csv" rows={approvalExportRows(rows)} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border bg-white px-5 text-sm font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>تصدير</FinancialExportButton></div></section><section className="grid gap-4 xl:grid-cols-[1.35fr_0.8fr]"><section className="overflow-hidden rounded-[22px] border bg-white shadow-card" style={{ borderColor: uiColors.border }}><div className="overflow-x-auto"><table className="w-full text-sm" style={{ minWidth: 900 }}><thead><tr className="bg-[#f4ede5] text-xs font-extrabold text-[#5f5953]">{["رقم العملية", "الوصف", "طريقة الدفع", "الاعتمادات", "الحالة", "التاريخ والوقت", "الإجراءات"].map((header) => <th key={header} className="px-4 py-3 text-right">{header}</th>)}</tr></thead><tbody>{rows.length === 0 ? <tr><td colSpan={7} className="px-4 py-8 text-center text-sm font-extrabold text-[#6E6258]">لا توجد عمليات مطابقة.</td></tr> : rows.map((row) => <tr key={row.id} className="border-b last:border-b-0" style={{ borderColor: uiColors.border }}><td className="px-4 py-4 font-bold">{row.id}</td><td className="px-4 py-4 font-extrabold text-[#1D1916]">{row.desc}</td><td className="px-4 py-4 font-bold text-[#5f5953]">{row.method}</td><td className="px-4 py-4 font-extrabold text-[#A54118]">{row.credits}</td><td className="px-4 py-4"><StatusPill label={row.status} tone={row.tone} /></td><td className="px-4 py-4 font-bold text-[#5f5953]">{row.time}</td><td className="px-4 py-4"><Link href={row.href} className="rounded-xl border px-4 py-2 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: uiColors.border }}>عرض</Link></td></tr>)}</tbody></table></div></section><div className="grid gap-4"><SettingsPanel title="توزيع الاعتمادات حسب نوع العملية"><ReviewDonut total={String(credits)} /></SettingsPanel><SettingsPanel title="ملخص الاعتمادات"><div className="grid grid-cols-2 gap-3">{[["إجمالي العمليات", rows.length], ["إجمالي الاعتمادات", credits], ["أعلى عملية", maxCredits], ["أقل عملية", minCredits]].map(([label, value]) => <div key={label} className="rounded-xl border p-3 text-center" style={{ borderColor: uiColors.border }}><strong className="font-display text-2xl">{value}</strong><p className="text-xs font-bold text-[#5f5953]">{label}</p></div>)}</div></SettingsPanel></div></section><section className="grid gap-4 lg:grid-cols-3"><SettingsPanel title="طرق الدفع المستخدمة"><div className="grid gap-3">{methodShares.map(([label, value]) => <div key={label}><div className="mb-1 flex justify-between text-sm font-bold"><span>{label}</span><span>{value}</span></div><div className="h-2 rounded-full bg-[#EFE8E1]"><span className="block h-2 rounded-full bg-[#A7815E]" style={{ width: value }} /></div></div>)}</div></SettingsPanel><SettingsPanel title="اتجاه استهلاك الاعتمادات"><ReportsLineChart series={approvalSeries(rows.length ? rows : allRows)} /></SettingsPanel><SettingsPanel title="آخر العمليات الكبيرة"><div className="grid gap-3">{rows.slice(0, 3).map((row) => <Link key={row.id} href={row.href} className="flex justify-between rounded-xl border p-3 text-sm font-bold" style={{ borderColor: uiColors.border }}><span>{row.desc}</span><strong>{row.credits}</strong></Link>)}</div></SettingsPanel></section></ReviewShell>;
}

function activePathFromStatus(status?: AdminAssetStatus) {
  if (!status) return "assets";
  return `assets/${status}`;
}

function reviewStatusLabel(status: DashboardAdminReviewStatus) {
  if (status === "approved") return "معتمد";
  if (status === "rejected") return "مرفوض";
  return "قيد المراجعة";
}

function reviewStatusTone(status: DashboardAdminReviewStatus): TrendTone {
  if (status === "approved") return "green";
  if (status === "rejected") return "red";
  return "gold";
}

function serviceStatusLabel(status: DashboardAdminServiceRequestStatus) {
  if (status === "completed") return "مكتمل";
  if (status === "assigned") return "قيد التنفيذ";
  if (status === "urgent") return "عاجل";
  if (status === "needs_changes") return "مطلوب تحديث";
  if (status === "cancelled") return "ملغي";
  return "جديد";
}

function serviceStatusTone(status: DashboardAdminServiceRequestStatus): TrendTone {
  if (status === "completed") return "green";
  if (status === "urgent" || status === "needs_changes" || status === "cancelled") return "red";
  if (status === "assigned") return "blue";
  return "gold";
}

function businessScope(config: DashboardRoleConfig): DashboardDataScope {
  return config.role === "business" ? "business" : "individual";
}

function businessRouteHref(config: DashboardRoleConfig, path: string) {
  return dashboardHref(config.role, path);
}

function EmptyDashboardState({ title, description }: { title: string; description: string }) {
  return (
    <section className="rounded-lg border border-[#ece1d8] bg-white p-8 text-center shadow-[0_10px_24px_rgb(29_25_22/0.035)] md:col-span-2 xl:col-span-3">
      <FileSearch className="mx-auto h-10 w-10 text-[#A7815E]" />
      <h2 className="mt-3 font-display text-2xl font-extrabold text-[#1D1916]">{title}</h2>
      <p className="mt-2 text-sm font-bold leading-7 text-[#6E6258]">{description}</p>
    </section>
  );
}

async function BusinessAssetsPage({ config, variant, actor = null, searchParams = {} }: { config: DashboardRoleConfig; variant: "browse" | "owned" | "interested"; actor?: DashboardActorContext | null; searchParams?: DashboardSearchParams }) {
  const result = await listDashboardAssetsForScope(businessScope(config), variant === "browse" ? "all" : variant, actor);
  const q = stringParam(searchParams, "q").trim();
  const activeStatus = stringParam(searchParams, "status").trim();
  const allRows = result.data;
  const rows = allRows.filter((row) => matchesDashboardSearch(q, [row.titleAr, row.cityAr, row.districtAr, row.assetTypeAr, row.usageTypeAr, row.owner, reviewStatusLabel(row.status)]) && matchesDashboardStatus(reviewStatusLabel(row.status), activeStatus));
  const pagination = paginateDashboardRows(rows, searchParams, 6);
  const activePath = variant === "owned" ? "company-assets" : variant === "interested" ? "interested-assets" : "browse-assets";
  const title = variant === "owned" ? "أصولي المضافة" : variant === "interested" ? "الأصول المهتم بها" : "استعراض الأصول";
  const subtitle = variant === "owned"
    ? "إدارة الأصول العقارية المرتبطة بحساب الأعمال ومتابعة حالاتها من Supabase."
    : variant === "interested"
      ? "الأصول المحفوظة في قائمة الاهتمام والمتزامنة مع قاعدة البيانات."
      : "استعراض الأصول العقارية الحية وحالات الاعتماد والبيانات المالية.";
  const totalValue = allRows.reduce((sum, row) => sum + (row.estimatedValueSar || 0), 0);

  return (
    <div className="grid gap-4">
      <IndividualPageHero title={title} subtitle={subtitle} image="/images/hero-panorama.png" action={{ label: "إضافة أصل عقاري", href: businessRouteHref(config, "add-asset") }} />
      {result.error ? <section className="rounded-lg border border-[#F0D8B8] bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل الأصول الحية من Supabase، وتم عرض بيانات احتياطية.</section> : null}
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <IndividualKpiCard title="إجمالي الأصول" value={String(allRows.length)} unit="أصل" icon="building" />
        <IndividualKpiCard title="المعتمدة" value={String(allRows.filter((row) => row.status === "approved").length)} unit="أصل" icon="shield" tone="green" />
        <IndividualKpiCard title="قيد المراجعة" value={String(allRows.filter((row) => row.status === "pending").length)} unit="أصل" icon="clock" />
        <IndividualKpiCard title="إجمالي القيمة" value={formatSar(totalValue).replace(" ريال سعودي", "")} unit="ريال" icon="circle-dollar" />
      </section>
      <section className="rounded-lg border border-[#ece1d8] bg-white p-4 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
        <form action={businessRouteHref(config, activePath)} className="grid gap-3 lg:grid-cols-5">
          {activeStatus ? <input type="hidden" name="status" value={activeStatus} /> : null}
          <label className="relative block">
            <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1D1916]" />
            <input name="q" defaultValue={q} className="h-12 w-full rounded-md border border-[#ece1d8] bg-white pl-16 pr-12 text-sm font-bold outline-none focus:border-[#A7815E]" placeholder="ابحث عن أصل عقاري" />
            <button type="submit" className="absolute left-2 top-1/2 h-8 -translate-y-1/2 rounded bg-[#1D1916] px-3 text-xs font-extrabold text-white">بحث</button>
          </label>
          <FilterBox label="كل الأصول" href={businessRouteHref(config, activePath)} />
          <FilterBox label="المعتمدة" href={businessRouteHref(config, `${activePath}?status=approved${q ? `&q=${encodeURIComponent(q)}` : ""}`)} />
          <FilterBox label="قيد المراجعة" href={businessRouteHref(config, `${activePath}?status=pending${q ? `&q=${encodeURIComponent(q)}` : ""}`)} />
          <Link href={businessRouteHref(config, activePath)} className="flex h-12 items-center justify-center gap-2 rounded-md border border-[#ece1d8] bg-white px-4 text-sm font-extrabold text-[#1D1916]">
            <RefreshCcw className="h-4 w-4" />
            إعادة تعيين
          </Link>
        </form>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.length === 0 ? <EmptyDashboardState title="لا توجد أصول مطابقة" description="سيظهر هنا أي أصل يتم إنشاؤه أو حفظه في Supabase." /> : pagination.rows.map((row) => <BusinessAssetCard key={row.id} config={config} row={row} management={variant === "owned"} interested={variant === "interested"} />)}
      </section>
      <DashboardPaginationControls role={config.role} path={activePath} page={pagination.page} totalPages={pagination.totalPages} params={{ q, status: activeStatus }} />
    </div>
  );
}

function BusinessAssetCard({ config, row, management = false, interested = false }: { config: DashboardRoleConfig; row: DashboardAdminAssetRow; management?: boolean; interested?: boolean }) {
  return (
    <article className="overflow-hidden rounded-lg border border-[#ece1d8] bg-white shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
      <div className="relative h-40 bg-[#f5eee7]">
        <Image src={row.image} alt="" fill className="object-cover grayscale-[10%] sepia-[8%]" sizes="420px" />
      </div>
      <div className="p-4 text-right">
        <div className="flex items-start justify-between gap-3">
          <StatusPill label={reviewStatusLabel(row.status)} tone={reviewStatusTone(row.status)} />
          <Building2 className="h-7 w-7 text-[#A7815E]" />
        </div>
        <h3 className="mt-4 font-display text-2xl font-extrabold text-[#1D1916]">{row.titleAr}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm font-bold text-[#6E6258]"><MapPin className="h-4 w-4" />{row.cityAr}{row.districtAr ? ` - ${row.districtAr}` : ""}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-bold text-[#1D1916]">
          <DetailRow label="نوع الأصل" value={row.assetTypeAr} />
          <DetailRow label="المساحة" value={formatArea(row.areaSqm)} />
          <DetailRow label="القيمة" value={formatSar(row.estimatedValueSar || 0)} />
          <DetailRow label="المالك" value={row.owner} />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <Link href={businessRouteHref(config, `asset-details?asset=${encodeURIComponent(row.slug)}`)} className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#B89A7A] bg-white px-3 text-xs font-extrabold text-[#A7815E]">عرض التفاصيل</Link>
          {management ? <DashboardDocumentUploadButton scope="business" entityType="asset_document" entityId={row.id} label={row.titleAr} className="grid min-h-10 cursor-pointer place-items-center rounded-md border border-[#ece1d8] bg-white px-3 text-xs font-extrabold text-[#1D1916]">رفع مستند</DashboardDocumentUploadButton> : <InterestActionButton entityType="asset" slug={row.slug} title={row.titleAr} initialInterested={interested} className="min-h-10 rounded-md border border-[#ece1d8] bg-white px-3 text-xs font-extrabold text-[#1D1916]" />}
          <Link href={businessRouteHref(config, management ? `add-asset?asset=${encodeURIComponent(row.slug)}` : "add-asset")} className="grid min-h-10 place-items-center rounded-md border border-[#ece1d8] bg-white px-3 text-xs font-extrabold text-[#1D1916]">{management ? "تعديل" : "إضافة أصل"}</Link>
        </div>
      </div>
    </article>
  );
}

async function BusinessAssetDetailsPage({ config, actor = null, searchParams = {} }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null; searchParams?: DashboardSearchParams }) {
  const result = await listDashboardAssetsForScope(businessScope(config), "all", actor);
  const row = selectEntityByParam(result.data, searchParams, "asset", "id", "slug") ?? result.data[0];

  if (!row) return <EmptyDashboardState title="لا توجد أصول للعرض" description="أضف أصل عقاري جديد ليظهر في صفحة التفاصيل." />;

  const documentsResult = await listDashboardDocumentsForEntity({
    scope: businessScope(config),
    entityId: row.id,
    entityRef: row.slug,
    entityTypes: ["asset_document", "asset_review_decision", "asset_deed", "asset_site_plan", "asset_valuation", "real_estate_asset"],
    actor,
  });

  return (
    <div className="grid gap-4">
      <IndividualPageHero title="تفاصيل الأصل العقاري" subtitle="بيانات الأصل، حالة المراجعة، المستندات، والعمليات المرتبطة من قاعدة البيانات." image={row.image} action={{ label: "العودة للأصول", href: businessRouteHref(config, "browse-assets") }} />
      <section className="grid gap-4 xl:grid-cols-[1fr_0.55fr]">
        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <StatusPill label={reviewStatusLabel(row.status)} tone={reviewStatusTone(row.status)} />
          <h2 className="mt-4 font-display text-3xl font-extrabold text-[#1D1916]">{row.titleAr}</h2>
          <p className="mt-2 text-sm font-bold leading-7 text-[#6E6258]">{row.excerptAr}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <DetailRow label="المدينة" value={row.cityAr} />
            <DetailRow label="الحي" value={row.districtAr ?? "غير محدد"} />
            <DetailRow label="نوع الأصل" value={row.assetTypeAr} />
            <DetailRow label="الاستخدام" value={row.usageTypeAr} />
            <DetailRow label="المساحة" value={formatArea(row.areaSqm)} />
            <DetailRow label="القيمة التقديرية" value={formatSar(row.estimatedValueSar || 0)} />
            <DetailRow label="رقم الصك" value={row.deedNumber ?? "غير مضاف"} />
            <DetailRow label="تاريخ الإدراج" value={row.listingDate} />
          </div>
        </article>
        <aside className="grid content-start gap-4">
          <BusinessAssetCard config={config} row={row} management={row.organizationId != null} />
          <DashboardDocumentUploadButton scope="business" entityType="asset_document" entityId={row.id} label={row.titleAr} className="grid min-h-12 cursor-pointer place-items-center rounded-md bg-[#A7815E] px-5 text-sm font-extrabold text-white">رفع مستند للأصل</DashboardDocumentUploadButton>
          <DashboardDocumentsPanel title="مرفقات الأصل" documents={documentsResult.data} error={documentsResult.error} emptyLabel="لا توجد مستندات مرفوعة لهذا الأصل بعد." />
        </aside>
      </section>
    </div>
  );
}

async function BusinessContributionsPage({ config, variant, actor = null, searchParams = {} }: { config: DashboardRoleConfig; variant: "browse" | "owned" | "interested"; actor?: DashboardActorContext | null; searchParams?: DashboardSearchParams }) {
  const result = await listDashboardContributionsForScope(businessScope(config), variant === "browse" ? "all" : variant, actor);
  const q = stringParam(searchParams, "q").trim();
  const activeStatus = stringParam(searchParams, "status").trim();
  const allRows = result.data;
  const rows = allRows.filter((row) => matchesDashboardSearch(q, [row.titleAr, row.cityAr, row.sponsor, row.licenseNumber, row.offeringUrl, reviewStatusLabel(row.status), row.rawStatus, row.capitalSar, row.durationMonths]) && matchesDashboardStatus(reviewStatusLabel(row.status), activeStatus));
  const pagination = paginateDashboardRows(rows, searchParams, 6);
  const activePath = variant === "owned" ? "company-contributions" : variant === "interested" ? "interested-contributions" : "browse-contributions";
  const title = variant === "owned" ? "مساهماتي" : variant === "interested" ? "المساهمات المهتم بها" : "استعراض المساهمات";
  const totalCapital = allRows.reduce((sum, row) => sum + row.capitalSar, 0);

  return (
    <div className="grid gap-4">
      <IndividualPageHero title={title} subtitle="قائمة مساهمات عقارية متصلة بقاعدة البيانات مع حالات الاعتماد والطرح." image="/images/contribution-request-hero-sketch.png" action={{ label: "إضافة مساهمة عقارية", href: businessRouteHref(config, "add-contribution") }} />
      {result.error ? <section className="rounded-lg border border-[#F0D8B8] bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل المساهمات الحية من Supabase، وتم عرض بيانات احتياطية.</section> : null}
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <IndividualKpiCard title="إجمالي المساهمات" value={String(allRows.length)} unit="مساهمة" icon="chart" />
        <IndividualKpiCard title="المعتمدة" value={String(allRows.filter((row) => row.status === "approved").length)} unit="مساهمة" icon="shield" tone="green" />
        <IndividualKpiCard title="قيد المراجعة" value={String(allRows.filter((row) => row.status === "pending").length)} unit="مساهمة" icon="clock" />
        <IndividualKpiCard title="قيمة المشاريع" value={formatSar(totalCapital).replace(" ريال سعودي", "")} unit="ريال" icon="circle-dollar" />
      </section>
      <section className="rounded-lg border border-[#ece1d8] bg-white p-4 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
        <form action={businessRouteHref(config, activePath)} className="grid gap-3 lg:grid-cols-5">
          {activeStatus ? <input type="hidden" name="status" value={activeStatus} /> : null}
          <label className="relative block">
            <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1D1916]" />
            <input name="q" defaultValue={q} className="h-12 w-full rounded-md border border-[#ece1d8] bg-white pl-16 pr-12 text-sm font-bold outline-none focus:border-[#A7815E]" placeholder="ابحث عن مساهمة عقارية" />
            <button type="submit" className="absolute left-2 top-1/2 h-8 -translate-y-1/2 rounded bg-[#1D1916] px-3 text-xs font-extrabold text-white">بحث</button>
          </label>
          <FilterBox label="كل المساهمات" href={businessRouteHref(config, activePath)} />
          <FilterBox label="المعتمدة" href={businessRouteHref(config, `${activePath}?status=approved${q ? `&q=${encodeURIComponent(q)}` : ""}`)} />
          <FilterBox label="قيد المراجعة" href={businessRouteHref(config, `${activePath}?status=pending${q ? `&q=${encodeURIComponent(q)}` : ""}`)} />
          <Link href={businessRouteHref(config, activePath)} className="flex h-12 items-center justify-center gap-2 rounded-md border border-[#ece1d8] bg-white px-4 text-sm font-extrabold text-[#1D1916]">
            <RefreshCcw className="h-4 w-4" />
            إعادة تعيين
          </Link>
        </form>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.length === 0 ? <EmptyDashboardState title="لا توجد مساهمات مطابقة" description="ستظهر هنا المساهمات المحفوظة أو المنشأة من لوحة الأعمال." /> : pagination.rows.map((row) => <BusinessContributionCard key={row.id} config={config} row={row} management={variant === "owned"} interested={variant === "interested"} />)}
      </section>
      <DashboardPaginationControls role={config.role} path={activePath} page={pagination.page} totalPages={pagination.totalPages} params={{ q, status: activeStatus }} />
    </div>
  );
}

function BusinessContributionCard({ config, row, management = false, interested = false }: { config: DashboardRoleConfig; row: DashboardAdminContributionRow; management?: boolean; interested?: boolean }) {
  const progress = `${row.fundedPercent}%`;
  return (
    <article className="overflow-hidden rounded-lg border border-[#8F6B4C] text-white shadow-[0_16px_34px_rgb(29_25_22/0.18)]" style={{ background: "linear-gradient(180deg,#2D2823,#1D1916)" }}>
      <div className="relative h-36 bg-[#f5eee7]">
        <Image src={row.image} alt="" fill className="object-cover grayscale-[10%] sepia-[8%]" sizes="420px" />
      </div>
      <div className="p-4 text-right">
        <div className="flex items-center justify-between">
          <StatusPill label={reviewStatusLabel(row.status)} tone={reviewStatusTone(row.status)} />
          <span className="text-xs font-bold text-white/68">{row.sponsor}</span>
        </div>
        <h3 className="mt-4 font-display text-2xl font-extrabold">{row.titleAr}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs font-bold text-white/72"><MapPin className="h-4 w-4" />{row.cityAr}</p>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-bold text-white/78">
          <span>قيمة المشروع</span><strong className="text-left text-white">{formatSar(row.capitalSar)}</strong>
          <span>مدة الاستثمار</span><strong className="text-left text-white">{row.durationMonths} شهر</strong>
          <span>العائد المتوقع</span><strong className="text-left text-white">{row.expectedReturnPercent ?? 0}%</strong>
          <span>رقم الترخيص</span><strong className="text-left text-white">{row.licenseNumber || "غير مضاف"}</strong>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/12">
          <span className="block h-full rounded-full bg-[#A7815E]" style={{ width: progress }} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Link href={businessRouteHref(config, `contribution-details?contribution=${encodeURIComponent(row.slug)}`)} className="inline-flex min-h-9 items-center justify-center rounded-md border border-white/18 px-2 text-[11px] font-extrabold text-white">عرض التفاصيل</Link>
          {management ? <DashboardDocumentUploadButton scope="business" entityType="contribution_document" entityId={row.id} label={row.titleAr} className="grid min-h-9 cursor-pointer place-items-center rounded-md border border-[#B89A7A] px-2 text-[11px] font-extrabold text-[#f2b18f]">رفع مستند</DashboardDocumentUploadButton> : <InterestActionButton entityType="contribution" slug={row.slug} title={row.titleAr} initialInterested={interested} className="min-h-9 rounded-md border border-[#B89A7A] px-2 text-[11px] font-extrabold text-[#f2b18f]" />}
          <Link href={businessRouteHref(config, "company-contributions")} className="grid min-h-9 place-items-center rounded-md border border-white/18 px-2 text-[11px] font-extrabold text-white">{management ? "إدارة" : "مساهماتي"}</Link>
        </div>
      </div>
    </article>
  );
}

async function BusinessContributionDetailsPage({ config, actor = null, searchParams = {} }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null; searchParams?: DashboardSearchParams }) {
  const result = await listDashboardContributionsForScope(businessScope(config), "all", actor);
  const row = selectEntityByParam(result.data, searchParams, "contribution", "id", "slug") ?? result.data[0];

  if (!row) return <EmptyDashboardState title="لا توجد مساهمات للعرض" description="أضف مساهمة عقارية جديدة ليتم ربطها هنا." />;

  const documentsResult = await listDashboardDocumentsForEntity({
    scope: businessScope(config),
    entityId: row.id,
    entityRef: row.slug,
    entityTypes: ["contribution_document", "contribution_review_decision", "contribution_license", "contribution_study", "contribution_financial_statement"],
    actor,
  });

  return (
    <div className="grid gap-4">
      <IndividualPageHero title="تفاصيل المساهمة" subtitle="بيانات المساهمة، الترخيص، الطرح، وحالة اعتماد الإدارة من Supabase." image={row.image} action={{ label: "العودة للمساهمات", href: businessRouteHref(config, "browse-contributions") }} />
      <section className="grid gap-4 xl:grid-cols-[1fr_0.55fr]">
        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <StatusPill label={reviewStatusLabel(row.status)} tone={reviewStatusTone(row.status)} />
          <h2 className="mt-4 font-display text-3xl font-extrabold text-[#1D1916]">{row.titleAr}</h2>
          <p className="mt-2 text-sm font-bold leading-7 text-[#6E6258]">{row.excerptAr}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <DetailRow label="المدينة" value={row.cityAr} />
            <DetailRow label="الراعي" value={row.sponsor} />
            <DetailRow label="رأس المال" value={formatSar(row.capitalSar)} />
            <DetailRow label="عدد المستثمرين" value={`${row.investorsCount} مستثمر`} />
            <DetailRow label="مدة التنفيذ" value={`${row.durationMonths} شهر`} />
            <DetailRow label="نسبة التمويل" value={`${row.fundedPercent}%`} />
            <DetailRow label="رقم الترخيص" value={row.licenseNumber || "غير مضاف"} />
            <DetailRow label="رابط الطرح" value={row.offeringUrl || "غير مضاف"} />
          </div>
        </article>
        <aside className="grid content-start gap-4">
          <BusinessContributionCard config={config} row={row} management={row.organizationId != null} />
          <DashboardDocumentUploadButton scope="business" entityType="contribution_document" entityId={row.id} label={row.titleAr} className="grid min-h-12 cursor-pointer place-items-center rounded-md bg-[#A7815E] px-5 text-sm font-extrabold text-white">رفع مستند للمساهمة</DashboardDocumentUploadButton>
          <DashboardDocumentsPanel title="مرفقات المساهمة" documents={documentsResult.data} error={documentsResult.error} emptyLabel="لا توجد مستندات مرفوعة لهذه المساهمة بعد." />
        </aside>
      </section>
    </div>
  );
}

async function BusinessRequestsPage({ config, actor = null, searchParams = {} }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null; searchParams?: DashboardSearchParams }) {
  const result = await listDashboardServiceRequestsForScope(businessScope(config), actor);
  const q = stringParam(searchParams, "q").trim();
  const activeStatus = stringParam(searchParams, "status").trim();
  const allRows = result.data;
  const rows = allRows.filter((row) => matchesDashboardSearch(q, [row.id, row.title, row.serviceType, row.description, row.provider, row.requester, row.city, row.assetType, row.rawStatus, serviceStatusLabel(row.status), row.price]) && matchesDashboardStatus(serviceStatusLabel(row.status), activeStatus));
  const pagination = paginateDashboardRows(rows, searchParams, 6);
  const totalAmount = allRows.reduce((sum, row) => sum + row.price, 0);

  return (
    <div className="grid gap-4">
      <IndividualPageHero title="طلباتي" subtitle="متابعة طلبات الخدمات العقارية المتصلة بحساب الأعمال من Supabase." image="/images/asset-commercial-complex.png" action={{ label: "طلب خدمة عقارية", href: businessRouteHref(config, "request-service") }} />
      {result.error ? <section className="rounded-lg border border-[#F0D8B8] bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل الطلبات الحية من Supabase، وتم عرض بيانات احتياطية.</section> : null}
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <IndividualKpiCard title="إجمالي الطلبات" value={String(allRows.length)} unit="طلب" icon="file-text" />
        <IndividualKpiCard title="قيد التنفيذ" value={String(allRows.filter((row) => row.status === "assigned").length)} unit="طلب" icon="settings" tone="blue" />
        <IndividualKpiCard title="مكتملة" value={String(allRows.filter((row) => row.status === "completed").length)} unit="طلب" icon="shield" tone="green" />
        <IndividualKpiCard title="إجمالي التكاليف" value={formatSar(totalAmount).replace(" ريال سعودي", "")} unit="ريال" icon="circle-dollar" />
      </section>
      <section className="rounded-lg border border-[#ece1d8] bg-white p-4 shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
        <form action={businessRouteHref(config, "my-requests")} className="grid gap-3 lg:grid-cols-5">
          {activeStatus ? <input type="hidden" name="status" value={activeStatus} /> : null}
          <label className="relative block">
            <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1D1916]" />
            <input name="q" defaultValue={q} className="h-12 w-full rounded-md border border-[#ece1d8] bg-white pl-16 pr-12 text-sm font-bold outline-none focus:border-[#A7815E]" placeholder="ابحث في طلبات الخدمات" />
            <button type="submit" className="absolute left-2 top-1/2 h-8 -translate-y-1/2 rounded bg-[#1D1916] px-3 text-xs font-extrabold text-white">بحث</button>
          </label>
          <FilterBox label="كل الطلبات" href={businessRouteHref(config, "my-requests")} />
          <FilterBox label="قيد التنفيذ" href={businessRouteHref(config, `my-requests?status=assigned${q ? `&q=${encodeURIComponent(q)}` : ""}`)} />
          <FilterBox label="مكتملة" href={businessRouteHref(config, `my-requests?status=completed${q ? `&q=${encodeURIComponent(q)}` : ""}`)} />
          <Link href={businessRouteHref(config, "my-requests")} className="flex h-12 items-center justify-center gap-2 rounded-md border border-[#ece1d8] bg-white px-4 text-sm font-extrabold text-[#1D1916]">
            <RefreshCcw className="h-4 w-4" />
            إعادة تعيين
          </Link>
        </form>
      </section>
      <section className="grid gap-4 xl:grid-cols-3">
        {rows.length === 0 ? <EmptyDashboardState title="لا توجد طلبات خدمات" description="سيظهر هنا أي طلب خدمة يتم إنشاؤه من لوحة الأعمال." /> : pagination.rows.map((row) => <BusinessServiceRequestCard key={row.id} config={config} row={row} />)}
      </section>
      <DashboardPaginationControls role={config.role} path="my-requests" page={pagination.page} totalPages={pagination.totalPages} params={{ q, status: activeStatus }} />
    </div>
  );
}

function BusinessServiceRequestCard({ config, row }: { config: DashboardRoleConfig; row: DashboardAdminServiceRequest }) {
  const progress = row.status === "completed" ? 100 : row.status === "assigned" ? 62 : row.status === "urgent" ? 35 : row.status === "needs_changes" ? 24 : row.status === "cancelled" ? 0 : 18;
  return (
    <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
      <div className="flex items-start justify-between gap-4">
        <StatusPill label={serviceStatusLabel(row.status)} tone={serviceStatusTone(row.status)} />
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[#f5eee7] text-[#A7815E]"><BriefcaseBusiness className="h-6 w-6" /></span>
      </div>
      <h3 className="mt-4 font-display text-2xl font-extrabold text-[#1D1916]">{row.title}</h3>
      <p className="mt-1 text-sm font-bold text-[#6E6258]">{row.id}</p>
      {row.latestReviewNote ? (
        <div className="mt-4 rounded-md border border-[#F0D8B8] bg-[#fff7ec] p-3 text-xs font-extrabold leading-6 text-[#8F6B4C]">
          ملاحظة المراجعة: {row.latestReviewNote}
        </div>
      ) : null}
      <div className="mt-4 grid gap-2 text-sm font-bold text-[#1D1916]">
        <DetailRow label="نوع الخدمة" value={row.serviceType} />
        <DetailRow label="مزود الخدمة" value={row.provider} />
        <DetailRow label="تاريخ الطلب" value={formatDashboardDate(row.submittedAt)} />
        <DetailRow label="المبلغ" value={formatSar(row.price)} />
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs font-extrabold text-[#1D1916]">
          <span>نسبة الإنجاز</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#efe8e1]">
          <span className="block h-full rounded-full bg-[#A7815E]" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        <Link href={businessRouteHref(config, `service-details?request=${encodeURIComponent(row.id)}`)} className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#B89A7A] bg-white px-3 text-xs font-extrabold text-[#A7815E]">عرض التفاصيل</Link>
        <Link href={businessRouteHref(config, "messages")} className="grid min-h-10 place-items-center rounded-md border border-[#ece1d8] bg-white px-3 text-xs font-extrabold text-[#1D1916]">رسالة</Link>
        <DashboardDocumentUploadButton scope="business" entityType="service_request_document" entityId={row.id} label={row.title} className="grid min-h-10 cursor-pointer place-items-center rounded-md border border-[#ece1d8] bg-white px-3 text-xs font-extrabold text-[#1D1916]">رفع</DashboardDocumentUploadButton>
      </div>
    </article>
  );
}

async function BusinessServiceDetailsPage({ config, actor = null, searchParams = {} }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null; searchParams?: DashboardSearchParams }) {
  const result = await listDashboardServiceRequestsForScope(businessScope(config), actor);
  const row = result.source === "supabase" ? selectEntityByParam(result.data, searchParams, "request", "id") : undefined;

  if (!row) {
    return (
      <div className="grid gap-4">
        <IndividualPageHero title="تفاصيل الطلب" subtitle="لا يوجد طلب خدمة عقارية متصل بحساب الأعمال في قاعدة البيانات لعرض تفاصيله حالياً." image="/images/asset-commercial-complex.png" action={{ label: "طلب خدمة عقارية", href: businessRouteHref(config, "request-service") }} />
        {result.error ? <section className="rounded-lg border border-[#F0D8B8] bg-[#fff7ec] p-4 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل تفاصيل الطلب من Supabase: {result.error}</section> : null}
        <section className="rounded-lg border border-[#ece1d8] bg-white p-8 text-center text-sm font-extrabold text-[#6E6258] shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          أنشئ طلب خدمة جديد أو راجع قائمة طلبات المنشأة. لا تظهر أزرار رفع المستندات إلا بعد حفظ طلب فعلي في قاعدة البيانات.
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href={businessRouteHref(config, "request-service")} className="grid min-h-11 place-items-center rounded-md bg-[#A7815E] px-5 text-sm font-extrabold text-white">طلب خدمة عقارية</Link>
            <Link href={businessRouteHref(config, "my-requests")} className="grid min-h-11 place-items-center rounded-md border border-[#B89A7A] bg-white px-5 text-sm font-extrabold text-[#A7815E]">عرض الطلبات</Link>
          </div>
        </section>
      </div>
    );
  }

  const documentsResult = await listDashboardDocumentsForEntity({
    scope: businessScope(config),
    entityId: row.id,
    entityTypes: ["service_request_document", "business_service_request_request"],
    actor,
  });
  const financial = await listDashboardFinancial(businessScope(config), actor);
  const messagesResult = await listDashboardMessages(businessScope(config), undefined, actor);
  const serviceInvoice = financial.invoices.find((invoice) => matchesDashboardSearch(row.id, [invoice.invoiceNumber, invoice.title]) || matchesDashboardSearch(row.title, [invoice.title]));
  const servicePayment = financial.payments.find((payment) => payment.invoiceId === serviceInvoice?.id || payment.invoiceNumber === serviceInvoice?.invoiceNumber || matchesDashboardSearch(row.title, [payment.title]));
  const progress = row.status === "completed" ? 100 : row.status === "assigned" ? 62 : row.status === "urgent" ? 35 : row.status === "needs_changes" ? 24 : row.status === "cancelled" ? 0 : 18;
  const serviceSteps = [
    ["استلام الطلب", true],
    ["تعيين المزود", row.status === "assigned" || row.status === "completed"],
    ["مراجعة البيانات", row.status === "assigned" || row.status === "completed" || row.status === "needs_changes"],
    ["تنفيذ الخدمة", row.status === "assigned" || row.status === "completed"],
    ["إغلاق الطلب", row.status === "completed"],
  ] as const;
  const paymentFacts: [string, string][] = [
    ["رسوم الخدمة", serviceInvoice ? formatSar(serviceInvoice.amount / 1.15) : formatSar(row.price)],
    ["ضريبة القيمة المضافة", serviceInvoice ? formatSar(serviceInvoice.amount - serviceInvoice.amount / 1.15) : "غير محددة"],
    ["الإجمالي", serviceInvoice ? formatSar(serviceInvoice.amount) : formatSar(row.price)],
    ["طريقة الدفع", servicePayment ? paymentMethodLabel(servicePayment.method) : "بانتظار السداد"],
    ["حالة السداد", serviceInvoice?.statusLabel ?? (row.price > 0 ? "بانتظار السداد" : "لا توجد فاتورة")],
    ["رقم الفاتورة", serviceInvoice?.invoiceNumber ?? "غير صادر"],
  ];
  const providerMessages = messagesResult.data
    .filter((message) => !message.mine)
    .slice(-3)
    .map((message) => `${message.body} - ${formatDashboardDateTime(message.createdAt)}`);
  const summaryBadges = [
    row.status === "completed" ? "مكتمل" : row.status === "assigned" ? "قيد التنفيذ" : row.status === "needs_changes" ? "مطلوب تحديث" : "قيد المراجعة",
    serviceInvoice?.status === "paid" || servicePayment?.status === "succeeded" ? "دفع مكتمل" : "بانتظار السداد",
    documentsResult.data.length ? `${documentsResult.data.length} مرفقات` : "لا توجد مرفقات",
  ];

  return (
    <div className="grid gap-4">
      <IndividualPageHero title="تفاصيل الطلب" subtitle="حالة طلب الخدمة، مزود التنفيذ، المبلغ، والمرفقات من قاعدة البيانات." image="/images/asset-commercial-complex.png" action={{ label: "العودة إلى طلباتي", href: businessRouteHref(config, "my-requests") }} />
      <section className="grid gap-4 xl:grid-cols-[1fr_0.55fr]">
        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <StatusPill label={serviceStatusLabel(row.status)} tone={serviceStatusTone(row.status)} />
          <h2 className="mt-4 font-display text-3xl font-extrabold text-[#1D1916]">{row.title}</h2>
          <p className="mt-2 text-sm font-bold leading-7 text-[#6E6258]">{row.description}</p>
          {row.latestReviewNote ? (
            <div className="mt-5 rounded-md border border-[#F0D8B8] bg-[#fff7ec] p-4 text-sm font-extrabold leading-7 text-[#8F6B4C]">
              <p>ملاحظة الإدارة: {row.latestReviewNote}</p>
              {row.latestReviewAt ? <p className="mt-1 text-xs text-[#6E6258]">آخر مراجعة: {formatDashboardDate(row.latestReviewAt)}</p> : null}
            </div>
          ) : null}
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <DetailRow label="رقم الطلب" value={row.id} />
            <DetailRow label="نوع الخدمة" value={row.serviceType} />
            <DetailRow label="المدينة" value={row.city} />
            <DetailRow label="نوع الأصل" value={row.assetType} />
            <DetailRow label="المساحة" value={formatArea(row.areaSqm)} />
            <DetailRow label="المبلغ" value={formatSar(row.price)} />
            <DetailRow label="مزود الخدمة" value={row.provider} />
            <DetailRow label="تاريخ الطلب" value={formatDashboardDate(row.submittedAt)} />
            <DetailRow label="تاريخ الاستحقاق" value={row.dueAt ? formatDashboardDate(row.dueAt) : "غير محدد"} />
          </div>
        </article>
        <aside className="grid content-start gap-4">
          <BusinessServiceRequestCard config={config} row={row} />
          <Link href={businessRouteHref(config, "support")} className="grid min-h-12 place-items-center rounded-md border border-[#B89A7A] bg-white px-5 text-sm font-extrabold text-[#A7815E]">طلب دعم حول الطلب</Link>
        </aside>
      </section>
      <section className="grid gap-4 xl:grid-cols-[1fr_0.55fr]">
        <DashboardDocumentsPanel title="مرفقات الطلب" documents={documentsResult.data} error={documentsResult.error} emptyLabel="لا توجد مستندات مرفوعة لهذا الطلب بعد." />
        <DashboardDocumentUploadButton scope="business" entityType="service_request_document" entityId={row.id} label={row.title} className="grid min-h-40 cursor-pointer place-items-center rounded-lg border border-dashed border-[#B89A7A] bg-white p-5 text-center text-sm font-extrabold text-[#A7815E]">
          رفع مستند جديد للطلب
        </DashboardDocumentUploadButton>
      </section>
      <section className="grid gap-4 xl:grid-cols-3">
        <AssetFieldList title="المدفوعات" items={paymentFacts} />
        <SmallPanel title="رسائل المزود" items={providerMessages.length ? providerMessages : ["لا توجد رسائل مزود مرتبطة بالمنشأة بعد"]} action="فتح الرسائل" actionHref={businessRouteHref(config, "messages")} />
        <article className="rounded-lg border border-[#ece1d8] bg-white p-5 text-right shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
          <h2 className="font-display text-xl font-extrabold text-[#1D1916]">تقدم التنفيذ</h2>
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs font-extrabold text-[#1D1916]"><span>نسبة الإنجاز</span><span>{progress}%</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-[#efe8e1]"><span className="block h-full rounded-full bg-[#A7815E]" style={{ width: `${progress}%` }} /></div>
          </div>
          <div className="mt-4 grid gap-2">
            {serviceSteps.map(([step, done], index) => <div key={step} className="flex items-center gap-3 border-b border-[#eee4dc] py-2 last:border-b-0"><span className={cn("grid h-7 w-7 place-items-center rounded-full border text-xs font-extrabold", done ? "border-[#087342] bg-[#e9f7ef] text-[#087342]" : "border-[#d8d1ca] bg-white text-[#9b9189]")}>{done ? "✓" : index + 1}</span><span className="text-sm font-bold text-[#1D1916]">{step}</span></div>)}
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-3">
            {summaryBadges.map((item) => <span key={item} className="rounded-md border border-[#ece1d8] bg-[#fffaf4] px-3 py-2 text-center text-xs font-extrabold text-[#A7815E]">{item}</span>)}
          </div>
        </article>
      </section>
    </div>
  );
}

export function StaticTablePage({ config, activePath, searchParams = {}, actor = null }: { config: DashboardRoleConfig; activePath: string; searchParams?: Record<string, string | string[] | undefined>; actor?: DashboardActorContext | null }) {
  const navItem = findNavItem(config.role, activePath);
  const title = navItem?.label ?? "صفحة لوحة التحكم";
  const query = stringParam(searchParams, "q").trim().toLocaleLowerCase("ar-SA");
  const status = stringParam(searchParams, "status").trim();
  const rows = pageRows(activePath).filter((row) => {
    const queryMatches = query
      ? [row.id, row.title, row.subtitle, row.meta, row.amount, row.status].some((value) => value.toLocaleLowerCase("ar-SA").includes(query))
      : true;
    const statusMatches = status ? row.status === status : true;
    return queryMatches && statusMatches;
  });

  if (config.role === "individual" && activePath === "add-asset") return <IndividualAddAssetPage actor={actor} />;
  if (config.role === "individual" && activePath === "browse-assets") return <IndividualBrowseAssetsPage config={config} variant="browse" actor={actor} searchParams={searchParams} />;
  if (config.role === "individual" && activePath === "my-assets") return <IndividualBrowseAssetsPage config={config} variant="mine" actor={actor} searchParams={searchParams} />;
  if (config.role === "individual" && activePath === "interested-assets") return <IndividualInterestedAssetsPage config={config} actor={actor} searchParams={searchParams} />;
  if (config.role === "individual" && activePath.startsWith("asset-details")) return <IndividualAssetDetailsPage config={config} actor={actor} searchParams={searchParams} />;
  if (config.role === "individual" && activePath === "browse-contributions") return <IndividualContributionsPage config={config} variant="browse" actor={actor} searchParams={searchParams} />;
  if (config.role === "individual" && activePath === "interested-contributions") return <IndividualContributionsPage config={config} variant="interested" actor={actor} searchParams={searchParams} />;
  if (config.role === "individual" && activePath.startsWith("contribution-details")) return <IndividualContributionDetailsPage config={config} actor={actor} searchParams={searchParams} />;
  if (config.role === "individual" && activePath === "request-service") return <IndividualRequestServicePage config={config} searchParams={searchParams} actor={actor} />;
  if (config.role === "individual" && activePath === "my-requests") return <IndividualMyRequestsPage config={config} actor={actor} searchParams={searchParams} />;
  if (config.role === "individual" && activePath.startsWith("service-details")) return <IndividualServiceDetailsPage config={config} actor={actor} searchParams={searchParams} />;
  if (config.role === "individual" && activePath === "profile") return <IndividualProfilePage config={config} actor={actor} />;
  if (config.role === "individual" && activePath === "account-notifications") return <IndividualNotificationsPage config={config} actor={actor} searchParams={searchParams} />;
  if (config.role === "individual" && activePath === "security") return <IndividualSecurityPage config={config} />;
  if (config.role === "individual" && activePath === "invoices") return <IndividualInvoicesPage config={config} actor={actor} searchParams={searchParams} />;
  if (config.role === "individual" && activePath === "subscriptions") return <IndividualSubscriptionsPage config={config} actor={actor} />;
  if (config.role === "individual" && activePath === "payments") return <IndividualPaymentsPage config={config} actor={actor} />;
  if (config.role === "individual" && activePath === "notifications") return <IndividualNotificationsPage config={config} actor={actor} searchParams={searchParams} />;
  if (config.role === "individual" && activePath === "messages") return <IndividualMessagesPage config={config} actor={actor} searchParams={searchParams} />;
  if (config.role === "individual" && activePath === "support") return <IndividualSupportPage config={config} searchParams={searchParams} actor={actor} />;
  if (config.role === "individual" && activePath === "personal-profile") return <IndividualPersonalProfilePage config={config} actor={actor} />;
  if (config.role === "individual" && activePath === "verification") return <IndividualVerificationBadgePage config={config} actor={actor} />;
  if (config.role === "business" && activePath === "browse-assets") return <BusinessAssetsPage config={config} variant="browse" actor={actor} searchParams={searchParams} />;
  if (config.role === "business" && (activePath === "company-assets" || activePath === "my-assets")) return <BusinessAssetsPage config={config} variant="owned" actor={actor} searchParams={searchParams} />;
  if (config.role === "business" && activePath === "interested-assets") return <BusinessAssetsPage config={config} variant="interested" actor={actor} searchParams={searchParams} />;
  if (config.role === "business" && activePath.startsWith("asset-details")) return <BusinessAssetDetailsPage config={config} actor={actor} searchParams={searchParams} />;
  if (config.role === "business" && activePath === "browse-contributions") return <BusinessContributionsPage config={config} variant="browse" actor={actor} searchParams={searchParams} />;
  if (config.role === "business" && activePath === "interested-contributions") return <BusinessContributionsPage config={config} variant="interested" actor={actor} searchParams={searchParams} />;
  if (config.role === "business" && (activePath === "company-contributions" || activePath === "my-contributions")) return <BusinessContributionsPage config={config} variant="owned" actor={actor} searchParams={searchParams} />;
  if (config.role === "business" && activePath.startsWith("contribution-details")) return <BusinessContributionDetailsPage config={config} actor={actor} searchParams={searchParams} />;
  if (config.role === "business" && activePath === "request-service") return <IndividualRequestServicePage config={config} searchParams={searchParams} actor={actor} />;
  if (config.role === "business" && activePath === "my-requests") return <BusinessRequestsPage config={config} actor={actor} searchParams={searchParams} />;
  if (config.role === "business" && activePath.startsWith("service-details")) return <BusinessServiceDetailsPage config={config} actor={actor} searchParams={searchParams} />;
  if (config.role === "business" && activePath === "invoices") return <IndividualInvoicesPage config={config} actor={actor} searchParams={searchParams} />;
  if (config.role === "business" && activePath === "subscriptions") return <IndividualSubscriptionsPage config={config} actor={actor} />;
  if (config.role === "business" && activePath === "payments") return <IndividualPaymentsPage config={config} actor={actor} />;
  if (config.role === "business" && activePath === "notifications") return <IndividualNotificationsPage config={config} actor={actor} searchParams={searchParams} />;
  if (config.role === "business" && activePath === "messages") return <IndividualMessagesPage config={config} actor={actor} searchParams={searchParams} />;
  if (config.role === "business" && activePath === "support") return <IndividualSupportPage config={config} searchParams={searchParams} actor={actor} />;
  if (config.role === "business" && activePath === "company-profile") return <BusinessCompanyProfilePage config={config} actor={actor} />;
  if (config.role === "business" && activePath === "verification") return <IndividualVerificationBadgePage config={config} actor={actor} />;
  if (config.role === "business" && activePath === "profile") return <BusinessPersonalProfilePage config={config} actor={actor} />;

  if (config.role === "admin" && activePath === "assets") return <AdminAssetsPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "assets/details") return <AdminAssetDetailsPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "assets/pending") return <AdminAssetsPage config={config} status="pending" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "assets/approved") return <AdminAssetsPage config={config} status="approved" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "assets/rejected") return <AdminAssetsPage config={config} status="rejected" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "contributions") return <AdminContributionsPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "contributions/details") return <AdminContributionDetailsPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "contributions/pending") return <AdminContributionsPage config={config} status="pending" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "contributions/approved") return <AdminContributionsPage config={config} status="approved" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "contributions/rejected") return <AdminContributionsPage config={config} status="rejected" searchParams={searchParams} />;
  if (config.role === "admin" && (activePath === "service-requests" || activePath === "service-requests-management")) return <AdminServiceRequestsPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && (activePath === "service-requests/details" || activePath === "service-requests-management/details")) return <AdminServiceRequestDetailsPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "services") return <AdminServicesCatalogPage config={config} />;
  if (config.role === "admin" && activePath === "services/add") return <AdminServiceFormPage config={config} mode="add" />;
  if (config.role === "admin" && activePath === "services/edit") return <AdminServiceFormPage config={config} mode="edit" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "services/pricing") return <AdminServicePricingPage config={config} />;
  if (config.role === "admin" && activePath === "providers") return <AdminProvidersPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "providers/details") return <AdminProviderDetailsPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "providers/pending") return <AdminProvidersPage config={config} status="pending" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "providers/approved") return <AdminProvidersPage config={config} status="approved" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "providers/rejected") return <AdminProvidersPage config={config} status="rejected" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "providers/add") return <AdminProviderFormPage config={config} mode="add" />;
  if (config.role === "admin" && activePath === "providers/edit") return <AdminProviderFormPage config={config} mode="edit" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "providers/documents") return <AdminProviderDocumentsPage config={config} />;
  if (config.role === "admin" && activePath === "providers/ratings") return <AdminProviderRatingsPage config={config} />;
  if (config.role === "admin" && activePath === "providers/categories") return <AdminProviderCategoriesPage config={config} />;
  if (config.role === "admin" && activePath === "accounts") return <AdminAccountsPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "accounts/details") return <AdminAccountDetailsPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "accounts/individuals") return <AdminAccountsPage config={config} kind="individual" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "accounts/businesses") return <AdminAccountsPage config={config} kind="business" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "accounts/pending") return <AdminAccountsPage config={config} status="pending" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "accounts/verified") return <AdminAccountsPage config={config} status="verified" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "accounts/suspended") return <AdminAccountsPage config={config} status="suspended" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "accounts/settings") return <AdminAccountSettingsPage config={config} />;
  if (config.role === "admin" && (activePath === "users" || activePath === "users-management")) return <AdminAccountsPage config={config} kind="individual" searchParams={searchParams} />;
  if (config.role === "admin" && (activePath === "businesses" || activePath === "business-accounts")) return <AdminAccountsPage config={config} kind="business" searchParams={searchParams} />;
  if (config.role === "admin" && (activePath === "content" || activePath === "content-management")) return <AdminContentPage config={config} kind="page" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "content/details") return <AdminContentDetailsPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "content/add-page") return <AdminContentFormPage config={config} kind="page" mode="add" actor={actor} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "content/edit-page") return <AdminContentFormPage config={config} kind="page" mode="edit" actor={actor} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "content/articles") return <AdminContentPage config={config} kind="article" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "content/article-details") return <AdminContentDetailsPage config={config} kind="article" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "content/add-article") return <AdminContentFormPage config={config} kind="article" mode="add" actor={actor} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "content/edit-article") return <AdminContentFormPage config={config} kind="article" mode="edit" actor={actor} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "content/categories") return <AdminContentCardsPage config={config} type="categories" />;
  if (config.role === "admin" && activePath === "content/media") return <AdminContentCardsPage config={config} type="media" />;
  if (config.role === "admin" && activePath === "content/banners") return <AdminContentCardsPage config={config} type="banners" />;
  if (config.role === "admin" && activePath === "content/faq") return <AdminContentCardsPage config={config} type="faq" />;
  if (config.role === "admin" && activePath === "content/partners") return <AdminContentCardsPage config={config} type="partners" />;
  if (config.role === "admin" && (activePath === "billing" || activePath === "invoices")) return <AdminInvoicesPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && (activePath === "billing/details" || activePath === "invoices/details" || activePath === "invoice-details")) return <AdminInvoiceDetailsPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "payments") return <AdminPaymentsPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "payments/details") return <AdminPaymentDetailsPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "subscriptions") return <AdminSubscriptionsPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "plans") return <AdminPlansPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "revenue") return <AdminRevenuePage config={config} />;
  if (config.role === "admin" && activePath === "notifications") return <AdminNotificationsPage config={config} />;
  if (config.role === "admin" && (activePath === "support" || activePath === "support-tickets")) return <AdminSupportPage config={config} searchParams={searchParams} actor={actor} />;
  if (config.role === "admin" && activePath === "messages") return <AdminMessagesPage config={config} searchParams={searchParams} actor={actor} />;
  if (config.role === "admin" && activePath === "reports") return <AdminReportsPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "reports/assets") return <AdminReportsPage config={config} kind="assets" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "reports/contributions") return <AdminReportsPage config={config} kind="contributions" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "reports/services") return <AdminReportsPage config={config} kind="services" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "reports/financial") return <AdminReportsPage config={config} kind="financial" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "reports/exports") return <AdminReportsPage config={config} kind="exports" searchParams={searchParams} />;
  if (config.role === "admin" && (activePath === "settings" || activePath === "system-settings")) return <AdminSettingsPage config={config} kind="site" />;
  if (config.role === "admin" && activePath === "settings/identity") return <AdminSettingsPage config={config} kind="identity" />;
  if (config.role === "admin" && activePath === "settings/homepage") return <AdminSettingsPage config={config} kind="homepage" />;
  if (config.role === "admin" && activePath === "settings/header") return <AdminSettingsPage config={config} kind="header" />;
  if (config.role === "admin" && activePath === "settings/footer") return <AdminSettingsPage config={config} kind="footer" />;
  if (config.role === "admin" && activePath === "settings/notifications") return <AdminSettingsPage config={config} kind="notifications" />;
  if (config.role === "admin" && activePath === "settings/messages") return <AdminSettingsPage config={config} kind="messages" />;
  if (config.role === "admin" && activePath === "settings/email") return <AdminSettingsPage config={config} kind="email" />;
  if (config.role === "admin" && activePath === "settings/seo") return <AdminSettingsPage config={config} kind="seo" />;
  if (config.role === "admin" && activePath === "settings/integrations") return <AdminSettingsPage config={config} kind="integrations" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "system/roles") return <AdminRolesPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "system/roles/add") return <AdminRoleFormPage config={config} mode="add" />;
  if (config.role === "admin" && activePath === "system/roles/edit") return <AdminRoleFormPage config={config} mode="edit" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "system/admins") return <AdminSystemAdminsPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "system/admins/add") return <AdminSystemAdminFormPage config={config} />;
  if (config.role === "admin" && activePath === "system/admins/details") return <AdminSystemAdminDetailsPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "system/login-log") return <AdminSystemLogsPage config={config} kind="login" searchParams={searchParams} />;
  if (config.role === "admin" && (activePath === "system/activity-log" || activePath === "activity-log" || activePath === "audit-log")) return <AdminSystemLogsPage config={config} kind="activity" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "system/sensitive-log") return <AdminSystemLogsPage config={config} kind="sensitive" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "review-center") return <ReviewDashboardPage config={config} />;
  if (config.role === "admin" && (activePath === "review-center/assets" || activePath === "asset-reviews")) return <ReviewQueuePage config={config} kind="assets" searchParams={searchParams} />;
  if (config.role === "admin" && (activePath === "review-center/assets/details" || activePath === "asset-reviews/details")) return <ReviewDetailPage config={config} kind="assetDetails" searchParams={searchParams} />;
  if (config.role === "admin" && (activePath === "review-center/contributions" || activePath === "contribution-reviews")) return <ReviewQueuePage config={config} kind="contributions" searchParams={searchParams} />;
  if (config.role === "admin" && (activePath === "review-center/contributions/details" || activePath === "contribution-reviews/details")) return <ReviewDetailPage config={config} kind="contributionDetails" searchParams={searchParams} />;
  if (config.role === "admin" && (activePath === "review-center/services" || activePath === "service-reviews")) return <ReviewQueuePage config={config} kind="services" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "service-reviews/details") return <AdminServiceRequestDetailsPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "review-center/providers") return <ReviewQueuePage config={config} kind="providers" searchParams={searchParams} />;
  if (config.role === "admin" && (activePath === "review-center/verification" || activePath === "verification-requests")) return <AdminVerificationRequestsPage config={config} searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "review-center/content") return <ReviewQueuePage config={config} kind="content" searchParams={searchParams} />;
  if (config.role === "admin" && activePath === "review-center/approvals") return <ApprovalLogPage config={config} searchParams={searchParams} />;

  if (isFormPath(activePath)) return <DashboardFormPage config={config} title={title} activePath={activePath} rows={rows} actor={actor} searchParams={searchParams} />;

  return (
    <div className="grid gap-5">
      <DashboardTopbar config={config} />
      <section className="rounded-[24px] border p-5 shadow-card md:p-6" style={{ backgroundColor: uiColors.surface, borderColor: uiColors.border }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <StatusPill label={config.accountLabel} tone="gold" />
            <h1 className="mt-3 font-display text-3xl font-extrabold text-navy">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">{pageDescription(config.role, title)}</p>
          </div>
          <Link href={dashboardHref(config.role)} className="inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-bold text-white" style={{ backgroundColor: dashboardBrown }}>العودة للوحة التحكم</Link>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        {config.summaryMetrics.slice(0, 4).map((metric) => <MetricCard key={metric.label} metric={metric} compact />)}
      </section>

      <section className="rounded-[22px] border p-4 shadow-card" style={{ backgroundColor: uiColors.surface, borderColor: uiColors.border }}>
        <form action={dashboardHref(config.role, activePath)} className="mb-4 grid gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
          <label className="relative block">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input name="q" defaultValue={stringParam(searchParams, "q")} suppressHydrationWarning className="h-11 w-full rounded-xl border border-line bg-[#fbf8f4] pr-10 text-sm outline-none focus:border-gold" placeholder={`ابحث في ${title}`} />
          </label>
          <select name="status" defaultValue={stringParam(searchParams, "status")} suppressHydrationWarning className="h-11 rounded-xl border bg-white px-4 text-sm font-bold text-navy outline-none focus:border-gold" style={{ borderColor: uiColors.border }}>
            <option value="">كل الحالات</option>
            <option value="قيد المراجعة">قيد المراجعة</option>
            <option value="موثق">موثق</option>
          </select>
          <button type="submit" className="grid h-11 place-items-center rounded-xl px-5 text-sm font-extrabold text-white" style={{ backgroundColor: dashboardBrown }}>تطبيق</button>
          <Link href={dashboardHref(config.role, activePath)} className="grid h-11 place-items-center rounded-xl border bg-white px-5 text-sm font-bold text-navy hover:text-gold" style={{ borderColor: uiColors.border }}>إعادة ضبط</Link>
        </form>
        <div className="overflow-hidden rounded-2xl border" style={{ borderColor: uiColors.border }}>
          <div className="hidden grid-cols-[1.1fr_1fr_0.7fr_0.7fr_0.7fr] bg-[#f4ede5] px-4 py-3 text-xs font-extrabold text-muted md:grid">
            <span>العنصر</span><span>الوصف</span><span>آخر تحديث</span><span>القيمة</span><span>الحالة</span>
          </div>
          <div className="divide-y bg-white" style={{ borderColor: uiColors.border }}>
            {rows.map((row) => <TableRow key={row.id} row={row} />)}
            {!rows.length ? <p className="px-4 py-8 text-center text-sm font-extrabold text-muted">لا توجد نتائج مطابقة للبحث الحالي.</p> : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function TableRow({ row }: { row: StaticRow }) {
  return (
    <div className="grid gap-3 px-4 py-4 text-sm md:grid-cols-[1.1fr_1fr_0.7fr_0.7fr_0.7fr] md:items-center">
      <div><p className="font-bold text-navy">{row.title}</p><p className="mt-1 text-xs text-muted">{row.id}</p></div>
      <p className="text-muted">{row.subtitle}</p>
      <p className="text-muted">{row.meta}</p>
      <p className="font-bold text-ink">{row.amount}</p>
      <StatusPill label={row.status} tone={row.statusTone} />
    </div>
  );
}

async function DashboardFormPage({ config, title, activePath, rows, actor = null, searchParams = {} }: { config: DashboardRoleConfig; title: string; activePath: string; rows: StaticRow[]; actor?: DashboardActorContext | null; searchParams?: DashboardSearchParams }) {
  const formLabel = activePath.includes("asset") ? "بيانات الأصل" : activePath.includes("contribution") ? "بيانات المساهمة" : activePath.includes("profile") ? "بيانات الحساب" : activePath.includes("verification") ? "متطلبات التوثيق" : "بيانات الطلب";
  const requestKind: DashboardEntityRequestKind | null = activePath.includes("add-asset")
    ? "asset"
    : activePath.includes("add-contribution")
      ? "contribution"
      : activePath.includes("request-service")
        ? "service_request"
        : null;
  const requestScope: DashboardEntityRequestScope = config.role === "business" ? "business" : "individual";
  const connectedRequest = Boolean(requestKind && config.role !== "admin");
  const selectedAssetParam = requestKind === "asset" ? entityParam(searchParams, "asset", "id", "slug") : "";
  const formReferenceOwner = (actor?.organizationId ?? actor?.userId ?? actor?.email ?? "anonymous").replaceAll(/[^a-z0-9-@.]/gi, "-");
  const formReferenceEntity = (selectedAssetParam || "new").replaceAll(/[^a-z0-9-]/gi, "-");
  const formReference = `${requestScope}-${requestKind ?? "management"}-${activePath.replaceAll(/[^a-z0-9-]/gi, "-")}-${formReferenceOwner}-${formReferenceEntity}`;
  const businessProfileResult = connectedRequest && config.role === "business" ? await getDashboardBusinessProfile(actor) : null;
  const individualProfileResult = connectedRequest && config.role !== "business" ? await getDashboardIndividualProfile(actor) : null;
  const selectedAssetResult = selectedAssetParam ? await listDashboardAssetsForScope(requestScope, "owned", actor) : null;
  const selectedAsset = selectedAssetParam ? selectEntityByParam(selectedAssetResult?.data ?? [], searchParams, "asset", "id", "slug") : undefined;
  const businessProfile = businessProfileResult?.data ?? null;
  const individualProfile = individualProfileResult?.data ?? null;
  const profileLoadError = businessProfileResult?.error ?? individualProfileResult?.error ?? selectedAssetResult?.error;
  const requesterName = businessProfile?.delegateName ?? individualProfile?.fullName ?? config.ownerName;
  const organizationName = businessProfile?.organizationName ?? "";
  const commercialRegistration = businessProfile?.commercialRegistration ?? "";
  const contactPhone = businessProfile?.delegatePhone ?? businessProfile?.phone ?? individualProfile?.phone ?? "";
  const contactEmail = businessProfile?.delegateEmail ?? businessProfile?.email ?? individualProfile?.email ?? "";
  const defaultCityValue = selectedAsset?.cityAr ?? businessProfile?.city ?? individualProfile?.city ?? "الرياض";
  const defaultTitle = requestKind === "asset"
    ? selectedAsset
      ? `تعديل ${selectedAsset.titleAr}`
      : `${config.role === "business" ? organizationName || "أصل منشأة" : requesterName || "أصل فردي"} - ${title}`
    : requestKind === "contribution"
      ? `مساهمة عقارية - ${organizationName || title}`
      : requestKind === "service_request"
        ? `طلب خدمة عقارية - ${config.role === "business" ? organizationName || title : requesterName || title}`
        : title;
  const defaultDescription = requestKind === "asset"
    ? selectedAsset
      ? selectedAsset.excerptAr || "طلب تعديل بيانات أصل عقاري قائم وربطه بمراجعة الإدارة."
      : "طلب إضافة أصل عقاري تم إرساله من لوحة التحكم لمراجعته واعتماده."
    : requestKind === "contribution"
      ? "طلب إضافة مساهمة عقارية من حساب الأعمال لمراجعة الترخيص والطرح."
      : requestKind === "service_request"
        ? "طلب خدمة عقارية جديد لمتابعة التنفيذ والتسعير."
        : "تحديث بيانات لوحة التحكم.";
  const requestTypeLabel = requestKind === "service_request" ? "نوع الخدمة" : requestKind === "contribution" ? "نوع المساهمة" : "نوع الأصل";
  const requestTypeName = requestKind === "service_request" ? "serviceType" : "assetType";
  const requestTypeValue = requestKind === "service_request" ? "دراسة جدوى عقارية" : requestKind === "contribution" ? "مساهمة تطوير" : selectedAsset?.assetTypeAr ?? "أرض تجارية";
  const defaultAmount = requestKind === "contribution" ? 25000000 : requestKind === "service_request" ? 1500 : 2500000;
  const defaultAreaSqm = requestKind === "contribution" ? 5000 : requestKind === "service_request" ? 250 : selectedAsset?.areaSqm ?? 500;
  const defaultAssetAmount = selectedAsset?.estimatedValueSar ?? defaultAmount;
  const amountLabel = requestKind === "contribution" ? "رأس مال المساهمة" : requestKind === "service_request" ? "ميزانية الخدمة" : "القيمة التقديرية";
  const formFields: Array<{ label: string; name: string; type?: "text" | "number" | "email"; defaultValue: string; required?: boolean }> = [
    { label: "اسم الطلب", name: "title", defaultValue: defaultTitle, required: true },
    { label: "المدينة", name: "city", defaultValue: defaultCityValue, required: true },
    { label: requestTypeLabel, name: requestTypeName, defaultValue: requestTypeValue, required: true },
    { label: amountLabel, name: "amount", type: "number", defaultValue: String(defaultAssetAmount), required: true },
    { label: "المساحة بالمتر المربع", name: "areaSqm", type: "number", defaultValue: String(defaultAreaSqm), required: requestKind !== "service_request" },
    { label: "رقم التواصل", name: "mobile", defaultValue: contactPhone, required: true },
    { label: "البريد الإلكتروني", name: "email", type: "email", defaultValue: contactEmail, required: true },
  ];

  return (
    <div className="grid gap-5">
      <DashboardTopbar config={config} />
      <section className="relative overflow-hidden rounded-[24px] border p-5 shadow-card md:p-6" style={{ backgroundColor: uiColors.surface, borderColor: uiColors.border }}>
        <Image src="/images/final-cta-map-building.png" alt="" fill className="object-cover opacity-[0.12]" sizes="80vw" />
        <div className="relative">
          <StatusPill label={connectedRequest ? "نموذج متصل" : "نموذج إدارة"} tone="gold" />
          <h1 className="mt-3 font-display text-3xl font-extrabold text-navy">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
            {connectedRequest ? "سيتم حفظ الطلب وربطه بقاعدة البيانات وقوائم المراجعة في لوحة الإدارة." : "يمكنك مراجعة البيانات والانتقال إلى لوحة التحكم أو صفحة التفاصيل المرتبطة."}
          </p>
        </div>
      </section>
      <section className="grid gap-5 xl:grid-cols-[1fr_0.45fr]">
        <form className="rounded-[22px] border p-5 shadow-card" style={{ backgroundColor: uiColors.surface, borderColor: uiColors.border }}>
          <input type="hidden" name="sourcePath" defaultValue={activePath} />
          <input type="hidden" name="formReference" defaultValue={formReference} />
          <input type="hidden" name="formLabel" defaultValue={formLabel} />
          {selectedAsset ? <input type="hidden" name="sourceEntityId" defaultValue={selectedAsset.id} /> : null}
          {selectedAsset?.slug ? <input type="hidden" name="sourceEntitySlug" defaultValue={selectedAsset.slug} /> : null}
          <input type="hidden" name="usageType" defaultValue={requestKind === "asset" ? selectedAsset?.usageTypeAr ?? "استثماري" : ""} />
          {selectedAsset?.districtAr ? <input type="hidden" name="district" defaultValue={selectedAsset.districtAr} /> : null}
          {selectedAsset?.deedNumber ? <input type="hidden" name="deedNumber" defaultValue={selectedAsset.deedNumber} /> : null}
          <input type="hidden" name="stage" defaultValue={requestKind === "contribution" ? "تحت الدراسة" : ""} />
          <input type="hidden" name="priority" defaultValue={requestKind === "service_request" ? "normal" : ""} />
          <input type="hidden" name="contactName" defaultValue={requesterName} />
          {organizationName ? <input type="hidden" name="organizationName" defaultValue={organizationName} /> : null}
          {commercialRegistration ? <input type="hidden" name="commercialRegistration" defaultValue={commercialRegistration} /> : null}
          {profileLoadError ? <p className="mb-4 rounded-xl border bg-[#fff7ec] p-3 text-xs font-extrabold text-[#8F6B4C]" style={{ borderColor: "#F0D8B8" }}>تعذر تحميل بيانات الحساب الحية، وتم استخدام بيانات احتياطية داخل النموذج.</p> : null}
          <h2 className="mb-4 font-display text-xl font-extrabold text-navy">{formLabel}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {formFields.map((field) => (
              <label key={field.name} className="grid gap-2 text-sm font-bold text-ink">
                {field.label}
                <input
                  name={field.name}
                  type={field.type ?? "text"}
                  defaultValue={field.defaultValue}
                  required={field.required}
                  min={field.type === "number" ? 0 : undefined}
                  className="h-12 rounded-xl border border-line bg-[#fbf8f4] px-4 text-sm outline-none focus:border-gold"
                  placeholder={`أدخل ${field.label}`}
                />
              </label>
            ))}
            <label className="grid gap-2 text-sm font-bold text-ink md:col-span-2">
              الوصف
              <textarea name="description" required defaultValue={defaultDescription} className="min-h-32 rounded-xl border border-line bg-[#fbf8f4] p-4 text-sm outline-none focus:border-gold" placeholder="اكتب وصفاً مختصراً" />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {requestKind && connectedRequest ? (
              <>
                <DashboardRequestFormSubmitButton
                  kind={requestKind}
                  scope={requestScope}
                  mode="draft"
                  className="min-h-12 rounded-xl px-7 text-sm font-extrabold text-white"
                  style={{ backgroundColor: dashboardBrown }}
                >
                  حفظ كمسودة
                </DashboardRequestFormSubmitButton>
                <DashboardRequestFormSubmitButton
                  kind={requestKind}
                  scope={requestScope}
                  mode="submitted"
                  className="min-h-12 rounded-xl border bg-white px-7 text-sm font-extrabold"
                  style={{ borderColor: uiColors.border, color: uiColors.redBrown }}
                >
                  إرسال الطلب
                </DashboardRequestFormSubmitButton>
              </>
            ) : (
              <>
                <Link href={dashboardHref(config.role)} className="grid min-h-12 place-items-center rounded-xl px-7 text-sm font-extrabold text-white" style={{ backgroundColor: dashboardBrown }}>العودة للوحة</Link>
                <Link href={dashboardHref(config.role, "notifications")} className="grid min-h-12 place-items-center rounded-xl border bg-white px-7 text-sm font-extrabold" style={{ borderColor: uiColors.border, color: uiColors.redBrown }}>متابعة الإشعارات</Link>
              </>
            )}
          </div>
        </form>
        <aside className="grid gap-4">
          <div className="rounded-[22px] border border-dashed border-[#d6b89a] bg-[#fffaf4] p-5 text-center shadow-card">
            <FileText className="mx-auto h-9 w-9 text-gold" />
            <h3 className="mt-3 font-display text-lg font-extrabold text-navy">مرفقات مطلوبة</h3>
            <p className="mt-2 text-sm leading-7 text-muted">الصكوك، التراخيص، الهوية أو السجل التجاري، وأي وثائق داعمة.</p>
            {connectedRequest ? (
              <div className="mt-4 grid gap-2">
                {["صك أو ترخيص", "مستند هوية/سجل", "ملف داعم"].map((label) => (
                  <DashboardDocumentUploadButton
                    key={label}
                    scope={config.role === "business" ? "business" : "individual"}
                    entityType={`${requestScope}_${requestKind}_pre_submission`}
                    entityId={formReference}
                    label={label}
                    className="grid min-h-10 cursor-pointer place-items-center rounded-xl border bg-white px-3 text-xs font-extrabold text-[#8F6B4C]"
                    style={{ borderColor: uiColors.border }}
                  >
                    رفع {label}
                  </DashboardDocumentUploadButton>
                ))}
              </div>
            ) : null}
          </div>
          <div className="rounded-[22px] border p-5 shadow-card" style={{ backgroundColor: uiColors.surface, borderColor: uiColors.border }}>
            <h3 className="mb-3 font-display text-lg font-extrabold text-navy">آخر عناصر مرتبطة</h3>
            <div className="grid gap-3">
              {rows.slice(0, 3).map((row) => <div key={row.id} className="rounded-xl border border-line bg-white p-3"><p className="text-sm font-bold text-navy">{row.title}</p><p className="mt-1 text-xs text-muted">{row.status}</p></div>)}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
