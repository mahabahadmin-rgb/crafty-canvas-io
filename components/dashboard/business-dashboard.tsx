import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Bell,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FileCheck2,
  FileText,
  Headphones,
  Landmark,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  UserRound,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { DashboardDocumentUploadButton, DashboardRequestFormSubmitButton } from "@/components/dashboard/dashboard-actions";
import { cn } from "@/lib/utils";
import { dashboardHref, type DashboardRoleConfig } from "@/lib/data/dashboard";
import { navigation } from "@/lib/data/navigation";
import { dashboardBusinessCss } from "@/lib/styles/dashboard-business-css";
import { getDashboardBusinessProfile, type DashboardActorContext } from "@/lib/supabase/mahabah";

const accent = "#A7815E";

function stableBusinessFormReference(key: string, actor?: DashboardActorContext | null, extra = "new") {
  const owner = actor?.organizationId ?? actor?.userId ?? actor?.email ?? "anonymous";
  return ["business", key, owner, extra]
    .map((part) => part.replaceAll(/[^a-z0-9-@.]/gi, "-"))
    .filter(Boolean)
    .join("-");
}

type BusinessCard = {
  label: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  status?: string;
};

type BusinessPerformanceCard = {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  status: string;
  kind: "text" | "ring";
  unit?: string;
};

const mainCards: BusinessCard[] = [
  { label: "حالة المنشأة", value: "مكتمل", unit: "جميع البيانات محدثة", icon: ShieldCheck, status: "محدث" },
  { label: "الأصول العقارية", value: "24", unit: "أصل عقاري", icon: Building2 },
  { label: "المساهمات العقارية", value: "8", unit: "مساهمة", icon: Users },
  { label: "الخدمات العقارية", value: "12", unit: "خدمة", icon: SlidersHorizontal },
  { label: "الطلبات المفتوحة", value: "7", unit: "طلب", icon: FileText },
  { label: "العمليات المالية", value: "32", unit: "عملية", icon: WalletCards },
];

const summaryIcons: Record<string, LucideIcon> = {
  "حالة المنشأة": ShieldCheck,
  "الأصول العقارية": Building2,
  "المساهمات العقارية": Users,
  "الخدمات العقارية": SlidersHorizontal,
  "الطلبات المفتوحة": FileText,
  "العمليات المالية": WalletCards,
};

function businessCardsFromConfig(config: DashboardRoleConfig): BusinessCard[] {
  if (!config.summaryMetrics.length) return mainCards;

  return config.summaryMetrics.map((metric) => ({
    label: metric.label,
    value: metric.value,
    unit: metric.unit ?? metric.delta,
    icon: summaryIcons[metric.label] ?? Building2,
    status: metric.delta,
  }));
}

const performanceCards: BusinessPerformanceCard[] = [
  { label: "آخر تحديث", value: "منذ 15 دقيقة", sub: "تحديث البيانات", icon: CalendarDays, status: "محدث", kind: "text" },
  { label: "الطلبات المكتملة", value: "85%", sub: "من إجمالي الطلبات", icon: CheckCircle2, status: "ممتاز", kind: "ring" },
  { label: "متوسط الاستجابة", value: "2.1", unit: "ساعة", sub: "متوسط الوقت", icon: Headphones, status: "ممتاز", kind: "ring" },
  { label: "مستوى النشاط", value: "78%", sub: "مستوى النشاط", icon: TrendingUp, status: "جيد", kind: "ring" },
  { label: "حالة التوثيق", value: "100%", sub: "مستوى التوثيق", icon: ShieldCheck, status: "موثوق", kind: "ring" },
  { label: "اكتمال ملف المنشأة", value: "96%", sub: "مستوى الاكتمال", icon: Building2, status: "ممتاز", kind: "ring" },
];

function businessPerformanceMetric(config: DashboardRoleConfig, label: string) {
  return config.performanceMetrics.find((metric) => metric.label === label);
}

function metricNumber(value?: string) {
  const number = Number.parseFloat((value ?? "").replace(/,/g, ""));
  return Number.isFinite(number) ? number : 0;
}

function percentStatus(value: string) {
  const pct = metricNumber(value);
  if (pct >= 90) return "ممتاز";
  if (pct >= 70) return "جيد";
  if (pct > 0) return "قيد المتابعة";
  return "يحتاج متابعة";
}

function businessPerformanceCardsFromConfig(config: DashboardRoleConfig): BusinessPerformanceCard[] {
  const assets = businessPerformanceMetric(config, "الفرص المتاحة");
  const openRequests = businessPerformanceMetric(config, "العروض المرسلة");
  const activeContributions = businessPerformanceMetric(config, "العقود النشطة");
  const balance = businessPerformanceMetric(config, "الرصيد الحالي");
  const conversion = businessPerformanceMetric(config, "معدل التحويل");
  const verificationProgress = config.verification.progress ?? performanceCards[4].value;
  const activityBase = metricNumber(assets?.value) + metricNumber(openRequests?.value) + metricNumber(activeContributions?.value);
  const activityLevel = `${Math.min(100, Math.round((activityBase / 40) * 100))}%`;
  const responseHours = Math.max(0.5, Math.round(metricNumber(openRequests?.value) * 3) / 10).toFixed(1);

  return [
    {
      ...performanceCards[0],
      value: config.updatedAt || performanceCards[0].value,
      status: balance?.delta ?? performanceCards[0].status,
    },
    {
      ...performanceCards[1],
      value: conversion?.value ?? performanceCards[1].value,
      sub: conversion?.unit ?? performanceCards[1].sub,
      status: percentStatus(conversion?.value ?? performanceCards[1].value),
    },
    {
      ...performanceCards[2],
      value: responseHours,
      sub: openRequests?.delta ?? performanceCards[2].sub,
      status: metricNumber(openRequests?.value) > 0 ? "قيد المتابعة" : "ممتاز",
    },
    {
      ...performanceCards[3],
      value: activityLevel,
      sub: `${assets?.value ?? 0} أصول / ${activeContributions?.value ?? 0} مساهمات`,
      status: percentStatus(activityLevel),
    },
    {
      ...performanceCards[4],
      value: verificationProgress,
      sub: config.verification.status,
      status: percentStatus(verificationProgress),
    },
    {
      ...performanceCards[5],
      value: verificationProgress,
      sub: config.verification.description,
      status: percentStatus(verificationProgress),
    },
  ];
}

const actionCards = [
  { title: "طلب شارة التوثيق", desc: "أثبت موثوقية منشأتك", icon: ShieldCheck, path: "verification" },
  { title: "طلب خدمة عقارية", desc: "خدمات احترافية سريعة", icon: FileCheck2, path: "request-service" },
  { title: "إضافة مساهمة عقارية", desc: "أعلن عن مساهمتك العقارية", icon: TrendingUp, path: "add-contribution" },
  { title: "إضافة أصل عقاري", desc: "أضف عقارك وادره بسهولة", icon: Building2, path: "add-asset" },
];

function ActionCard({ item }: { item: (typeof actionCards)[number] }) {
  const Icon = item.icon;
  return (
    <Link
      href={dashboardHref("business", item.path)}
      className="group flex min-h-[98px] items-center justify-center gap-5 rounded-lg border mb-border-action bg-white px-4 text-right transition hover:mb-border-hover hover:mb-bg-hover"
    >
      <Icon className="h-11 w-11 shrink-0 stroke-[1.6] mb-text-accent" />
      <span>
        <strong className="block text-[17px] font-extrabold leading-7 mb-text-accent-strong">{item.title}</strong>
        <span className="mt-0.5 block text-[13px] font-bold mb-text-muted">{item.desc}</span>
      </span>
    </Link>
  );
}

function StatCard({ card }: { card: BusinessCard }) {
  const Icon = card.icon;
  const isStatus = card.label === "حالة المنشأة";
  return (
    <article className="grid min-h-[178px] place-items-center rounded-lg border mb-border-line bg-white px-4 py-5 text-center mb-shadow-card">
      <div>
        <p className="text-[14px] font-bold mb-text-muted">{card.label}</p>
        {isStatus ? (
          <>
            <CheckCircle2 className="mx-auto mt-5 h-7 w-7 mb-text-green-strong" />
            <strong className="mt-2 block text-[30px] font-extrabold leading-none mb-text-green-strong">{card.value}</strong>
          </>
        ) : (
          <>
            <strong className="mt-5 block text-[38px] font-extrabold leading-none mb-text-navy">{card.value}</strong>
            <span className="mt-2 block text-[13px] font-bold mb-text-muted">{card.unit}</span>
            <span className="mx-auto mt-4 grid h-11 w-11 place-items-center rounded-full mb-bg-accent-soft mb-text-accent">
              <Icon className="h-6 w-6 stroke-[1.6]" />
            </span>
          </>
        )}
        <p className={cn("mt-3 text-[12px] font-bold", isStatus ? "mb-text-muted" : "mb-text-green-strong")}>{isStatus ? card.unit : card.status ?? "+ عن الشهر الماضي"}</p>
      </div>
    </article>
  );
}

function RingCard({ item }: { item: BusinessPerformanceCard }) {
  const Icon = item.icon;
  const pct = Number.parseFloat(item.value) || 78;
  const ring = `conic-gradient(${accent} 0 ${pct}%, #efe3da ${pct}% 100%)`;
  return (
    <article className="grid min-h-[176px] place-items-center rounded-lg border mb-border-line bg-white px-4 py-4 text-center">
      {item.kind === "text" ? (
        <>
          <Icon className="h-10 w-10 mb-text-navy" />
          <p className="mt-5 text-[13px] font-bold mb-text-muted">{item.value}</p>
          <p className="mt-2 text-[13px] font-bold mb-text-muted">{item.sub}</p>
        </>
      ) : (
        <>
          <p className="text-[13px] font-bold mb-text-navy">{item.label}</p>
          <div className="mt-3 grid h-[92px] w-[92px] place-items-center rounded-full p-[7px]" style={{ background: ring }}>
            <div className="grid h-full w-full place-items-center rounded-full bg-white">
              <div>
                <strong className="block text-[24px] font-extrabold leading-none mb-text-navy">{item.value}</strong>
                {item.unit ? <span className="text-[12px] font-bold mb-text-navy">{item.unit}</span> : null}
              </div>
            </div>
          </div>
          <p className="mt-2 text-[12px] font-bold mb-text-muted">{item.sub}</p>
        </>
      )}
      <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-bold mb-text-green">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {item.status}
      </span>
    </article>
  );
}

export async function BusinessDashboardHome({ config, actor = null }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null }) {
  const profileResult = await getDashboardBusinessProfile(actor);
  const profile = profileResult.data;
  const cards = businessCardsFromConfig(config);
  const performance = businessPerformanceCardsFromConfig(config);
  const facilityNumber = profile.commercialRegistration || profile.id.slice(0, 8).toUpperCase();
  const heroDescription = profile.activityType && profile.city
    ? `${profile.activityType} في ${profile.city}، مع إدارة الأصول والمساهمات والخدمات من مكان واحد.`
    : config.heroDescription;

  return (
    <div className="business-dashboard grid gap-6 pb-5">
      <section className="relative overflow-hidden rounded-lg border mb-border-hero bg-white mb-shadow-hero">
        <Image src="/images/dashboard-business-hero-sketch.png" alt="" fill priority className="object-cover object-left-bottom opacity-[0.82]" sizes="(min-width: 1024px) 900px, 100vw" />
        <div className="absolute inset-0 mb-hero-fade" />
        <div className="relative grid min-h-[410px] content-between gap-8 px-6 py-8 lg:px-8">
          <div className="ml-auto flex max-w-[550px] items-start gap-6 text-right">
            <ShieldCheck className="mt-8 h-[76px] w-[76px] shrink-0 stroke-[1.4] mb-text-accent" />
            <div>
              <p className="text-[17px] font-bold mb-text-muted">مرحباً بك في</p>
              <h1 className="mt-2 text-[42px] font-extrabold leading-[1.2] mb-text-navy">{profile.organizationName || config.heroTitle}</h1>
              <p className="mt-5 text-[20px] font-bold leading-9 mb-text-body">{heroDescription}</p>
              <div className="mt-8">
                <p className="text-[15px] font-bold mb-text-muted">رقم المنشأة</p>
                <strong className="mt-2 block text-[24px] font-extrabold tracking-wide mb-text-navy">{facilityNumber}</strong>
              </div>
              {profileResult.error ? <p className="mt-3 rounded-md border border-[#F0D8B8] bg-[#fff7ec] px-3 py-2 text-xs font-extrabold text-[#8F6B4C]">تعذر تحميل بيانات المنشأة الحية، وتم عرض بيانات احتياطية مؤقتة.</p> : null}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {actionCards.map((item) => <ActionCard key={item.title} item={item} />)}
          </div>
        </div>
      </section>

      <section className="business-stats-grid grid gap-5">
        {cards.map((card) => <StatCard key={card.label} card={card} />)}
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-4">
          <span className="text-[13px] font-bold mb-text-muted">قياس أداء منشأتك خلال الفترة الحالية</span>
          <h2 className="flex items-center gap-2 text-[20px] font-extrabold mb-text-navy">
            <TrendingUp className="h-6 w-6 mb-text-accent" />
            مؤشرات الأداء
          </h2>
        </div>
        <div className="business-performance-grid grid gap-5">
          {performance.map((item) => <RingCard key={item.label} item={item} />)}
        </div>
      </section>

      <div className="mt-1 flex items-center justify-between border-t mb-border-footer pt-5 text-[13px] font-bold mb-text-muted">
        <span>جميع الحقوق محفوظة © 2026 منصة مهابة للمساهمات العقارية</span>
        <span>نسخة 1.0.0</span>
      </div>
    </div>
  );
}

const steps = [
  { label: "بيانات المساهمة", icon: ClipboardList, state: "done" },
  { label: "المستندات النظامية", icon: FileText, state: "active" },
  { label: "الترخيص والامتثال", icon: Landmark, state: "next" },
  { label: "الرسوم والسداد", icon: CreditCard, state: "next" },
  { label: "جاهز للإرسال", icon: Send, state: "next" },
];

const summaryRows = [
  ["رقم الطلب", "CON-000001"],
  ["تاريخ الإنشاء", "01 / 08 / 1447"],
  ["آخر حفظ", "قبل دقيقة واحدة"],
  ["حالة الطلب", "قيد الإعداد"],
];

const contributionRows = [
  ["نوع المساهمة", "مساهمة تطوير"],
  ["قيمة المشروع", "25,000,000 ريال"],
  ["مدة التنفيذ", "24 شهر"],
  ["مدير المساهمة", "أ. أحمد محمد السبيعي"],
];

const checklist = [
  ["بيانات الأصل العقاري", true],
  ["بيانات المساهمة", true],
  ["رابط المساهمة وجهة الطرح", true],
  ["الترخيص النظامي", true],
  ["الدراسات والمستندات", true],
  ["رخصة المساهمة العقارية", true],
  ["رسوم السداد", false],
  ["جاهز للإرسال", false],
];

function BusinessHeader({ ownerName }: { ownerName: string }) {
  return (
    <header className="sticky top-0 z-40 border-b mb-border-header bg-white/96 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-[1480px] items-center gap-5 px-5">
        <BrandLogo height={56} priority />
        <nav className="business-header-nav hidden flex-1 items-center justify-center text-[14px] font-extrabold mb-text-navy lg:flex">
          {navigation.filter((item) => item.href !== "/about").map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:mb-text-accent">
              {item.labelAr === "الأصول" ? "الأصول العقارية" : item.labelAr}
            </Link>
          ))}
        </nav>
        <div className="mr-auto flex items-center gap-4">
          <Link href={dashboardHref("business", "notifications")} className="relative grid h-10 w-10 place-items-center rounded-full mb-text-navy" aria-label="الإشعارات">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full mb-bg-accent" />
          </Link>
          <Link href={dashboardHref("business", "profile")} className="hidden items-center gap-2 text-[13px] font-extrabold mb-text-navy md:flex">
            <UserRound className="h-8 w-8 rounded-full border mb-border-user p-1 mb-text-accent" />
            {ownerName}
          </Link>
        </div>
      </div>
    </header>
  );
}

function InfoBox({ title, children, icon: Icon = FileText, id }: { title: string; children: ReactNode; icon?: LucideIcon; id?: string }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-lg border mb-border-line bg-white p-4 mb-shadow-panel">
      <h2 className="mb-4 flex items-center gap-2 text-[20px] font-extrabold mb-text-navy">
        <Icon className="h-5 w-5 mb-text-accent" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, value, name, required = false, wide = false }: { label: string; value: string; name?: string; required?: boolean; wide?: boolean }) {
  return (
    <label className={cn("grid gap-1.5 text-[12px] font-bold mb-text-muted", wide ? "md:col-span-2" : "")}>
      <span>{label} {required ? <span className="mb-text-accent">*</span> : null}</span>
      <input name={name} defaultValue={value} required={required} className="h-10 rounded-md border mb-border-soft bg-white px-3 text-[13px] font-bold mb-text-navy outline-none focus:mb-border-accent" />
    </label>
  );
}

function UploadBox({ title, file, entityId }: { title: string; file: string; entityId?: string }) {
  return (
    <div className="flex min-h-[74px] items-center justify-between gap-3 rounded-md border mb-border-soft bg-white px-3">
      <DashboardDocumentUploadButton
        scope="business"
        entityType="business_contribution_document"
        entityId={entityId}
        label={title}
        className="cursor-pointer rounded border mb-border-upload px-3 py-1 text-[12px] font-extrabold mb-text-navy"
      >
        رفع
      </DashboardDocumentUploadButton>
      <div className="min-w-0 text-right">
        <p className="truncate text-[12px] font-bold mb-text-navy">{title}</p>
        <p className="mt-1 truncate text-[11px] font-bold mb-text-light">{file}</p>
      </div>
      <FileText className="h-5 w-5 mb-text-accent" />
    </div>
  );
}

function SidebarPanel({ title, children, icon: Icon }: { title: string; children: ReactNode; icon: LucideIcon }) {
  return (
    <aside className="rounded-lg border mb-border-line bg-white p-4">
      <h3 className="mb-4 flex items-center gap-2 text-[17px] font-extrabold mb-text-navy">
        <Icon className="h-5 w-5 mb-text-accent" />
        {title}
      </h3>
      {children}
    </aside>
  );
}

export async function BusinessContributionRequestPage({ config, actor = null }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null }) {
  const profileResult = await getDashboardBusinessProfile(actor);
  const profile = profileResult.data;
  const managerName = profile.delegateName || config.ownerName;
  const organizationName = profile.organizationName || config.heroTitle;
  const formReference = stableBusinessFormReference("add-contribution", actor, profile.id);

  return (
    <div className="min-h-screen bg-white mb-text-navy" dir="rtl">
      <style dangerouslySetInnerHTML={{ __html: dashboardBusinessCss }} />
      <BusinessHeader ownerName={config.ownerName} />
      <form>
      <main className="mx-auto max-w-[1480px] px-5 py-5">
        <input type="hidden" name="sourcePath" defaultValue="business-add-contribution" />
        <input type="hidden" name="formReference" defaultValue={formReference} />
        <input type="hidden" name="organizationName" defaultValue={organizationName} />
        <input type="hidden" name="commercialRegistration" defaultValue={profile.commercialRegistration} />
        <input type="hidden" name="assetType" defaultValue="أرض تجارية" />
        <input type="hidden" name="feeAmount" defaultValue="5000" />
        <input type="hidden" name="expectedReturnPercent" defaultValue="11" />
        <input type="hidden" name="remainingDays" defaultValue="45" />
        <section className="relative overflow-hidden rounded-lg border mb-border-line bg-white">
          <Image src="/images/contribution-request-hero-sketch.png" alt="" fill priority className="object-cover object-left-center opacity-[0.86]" sizes="100vw" />
          <div className="absolute inset-0 mb-contribution-hero-fade" />
          <div className="relative mr-auto min-h-[176px] max-w-[650px] px-7 py-8 text-right">
            <Building2 className="mb-2 h-12 w-12 mb-text-accent" />
            <h1 className="text-[44px] font-extrabold leading-tight mb-text-navy">إضافة مساهمة عقارية</h1>
            <p className="mt-4 max-w-xl text-[15px] font-bold leading-8 mb-text-muted">أكمل جميع البيانات والمستندات المطلوبة لتحويل الأصل العقاري إلى مساهمة عقارية وفقاً لمتطلبات الهيئة العامة للعقار.</p>
            {profileResult.error ? <p className="mt-3 rounded-md border border-[#F0D8B8] bg-[#fff7ec] px-3 py-2 text-xs font-extrabold text-[#8F6B4C]">تعذر تحميل بيانات المنشأة الحية، وتم استخدام بيانات احتياطية داخل النموذج.</p> : null}
          </div>
        </section>

        <section className="mt-5 rounded-lg border mb-border-line bg-white px-8 py-5">
          <div className="grid grid-cols-5 items-start gap-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const active = step.state === "active";
              const done = step.state === "done";
              return (
                <div key={step.label} className="relative grid place-items-center text-center">
                  {index < steps.length - 1 ? <span className="absolute right-1/2 top-6 h-px w-full mb-bg-line" /> : null}
                  <span className={cn("relative z-10 grid h-12 w-12 place-items-center rounded-full border-2 bg-white", active ? "mb-border-accent mb-text-accent" : done ? "mb-border-green mb-text-green" : "mb-border-muted mb-text-navy")}>
                    <Icon className="h-6 w-6" />
                    {active || done ? <span className={cn("absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full text-white", active ? "mb-bg-accent" : "mb-bg-green")}><Check className="h-3 w-3" /></span> : null}
                  </span>
                  <span className="mt-2 text-[13px] font-extrabold mb-text-navy">{step.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        <div className="business-contribution-layout mt-5 grid gap-5">
          <aside className="grid content-start gap-4">
            <SidebarPanel title="ملخص الطلب" icon={ClipboardList}>
              <div className="grid gap-3 text-[12px] font-bold">
                {summaryRows.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3 border-b mb-border-subtle pb-2 last:border-b-0">
                    <span className="mb-text-muted">{label}</span>
                    <strong className={cn("mb-text-navy", value === "قيد الإعداد" ? "rounded mb-bg-tag px-2 py-1 mb-text-accent" : "")}>{value}</strong>
                  </div>
                ))}
              </div>
            </SidebarPanel>
            <SidebarPanel title="نسبة اكتمال الطلب" icon={TrendingUp}>
              <div className="mx-auto grid h-32 w-32 place-items-center rounded-full p-3" style={{ background: "conic-gradient(#A7815E 0 78%, #efe3da 78% 100%)" }}>
                <div className="grid h-full w-full place-items-center rounded-full bg-white text-center">
                  <strong className="text-2xl font-extrabold">78%</strong>
                  <span className="text-xs font-bold mb-text-muted">مكتمل</span>
                </div>
              </div>
              <Link href={dashboardHref("business", `contribution-details?contribution=${encodeURIComponent("مساهمة النخيل التجارية")}`)} className="mt-4 block w-full rounded-md border mb-border-action py-2 text-center text-[12px] font-extrabold mb-text-navy">عرض التفاصيل</Link>
            </SidebarPanel>
            <SidebarPanel title="ملخص المساهمة" icon={Landmark}>
              <div className="grid gap-3 text-[12px] font-bold">
                {contributionRows.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3 border-b mb-border-subtle pb-2 last:border-b-0">
                    <span className="mb-text-muted">{label}</span>
                    <strong className="mb-text-navy">{value}</strong>
                  </div>
                ))}
                <a href="https://istithmar.sa/offering/CON-000001" target="_blank" rel="noreferrer" className="mt-1 text-right mb-text-accent underline">عرض الرابط</a>
              </div>
            </SidebarPanel>
            <SidebarPanel title="قائمة التحقق" icon={TrendingUp}>
              <div className="grid gap-2 text-[12px] font-bold">
                {checklist.map(([label, complete]) => (
                  <div key={label as string} className="flex items-center justify-between gap-3">
                    <span className="mb-text-navy">{label}</span>
                    <span className={cn("grid h-5 w-5 place-items-center rounded-full border", complete ? "mb-border-green mb-bg-green-soft mb-text-green" : "mb-border-warn mb-text-warn")}>{complete ? <Check className="h-3 w-3" /> : null}</span>
                  </div>
                ))}
              </div>
            </SidebarPanel>
          </aside>

          <div className="grid gap-5">
            <InfoBox id="business-contribution-details" title="1. بيانات الأصل العقاري" icon={Building2}>
              <div className="grid gap-4 md:grid-cols-3">
                <Field name="selectedAsset" label="اختر الأصل العقاري" value="أرض تجارية - حي النخيل" required />
                <Field name="deedNumber" label="رقم الصك" value="310115001234" required />
                <Field name="deedDate" label="تاريخ الصك" value="01/05/1443 هـ" required />
                <Field name="city" label="المدينة" value="الرياض" required />
                <Field name="district" label="الحي" value="حي النخيل" required />
                <Field name="areaSqm" label="المساحة (م²)" value="5,000" required />
                <Field name="usageType" label="نوع الاستخدام" value="تجاري" required />
                <Field name="assetDescription" label="وصف الأصل" value="أرض تجارية على شارع رئيسي" wide />
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <UploadBox title="صك الملكية" file="صك_الملكية.pdf" entityId={formReference} />
                <UploadBox title="مخطط الأرض" file="مخطط_الأرض.pdf" entityId={formReference} />
              </div>
            </InfoBox>

            <InfoBox title="2. بيانات المساهمة العقارية" icon={Building2}>
              <div className="grid gap-4 md:grid-cols-3">
                <Field name="title" label="اسم المساهمة" value="مساهمة النخيل التجارية" required />
                <Field name="stage" label="نوع المساهمة" value="مساهمة تطوير" required />
                <Field name="amount" label="قيمة المشروع التقديرية (ريال)" value="25,000,000" required />
                <Field name="durationMonths" label="مدة التنفيذ" value="24 شهر" required />
                <Field name="unitsCount" label="عدد الوحدات المتوقع" value="10 وحدات" required />
                <Field name="managerName" label="مدير المساهمة" value={managerName} required />
                <Field name="description" label="وصف المساهمة" value="تطوير مبنى تجاري متعدد الاستخدامات يتضمن وحدات تجزئة ومكاتب إدارية." wide required />
              </div>
              <div className="mt-5 rounded-lg border mb-border-inset mb-bg-paper p-4">
                <h3 className="mb-3 text-[15px] font-extrabold mb-text-navy">رابط المساهمة (من الجهة المرخصة بطرح المساهمة)</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <Field name="offeringUrl" label="رابط طرح المساهمة" value="https://istithmar.sa/offering/CON-000001" required />
                  <Field name="licensedEntityName" label="اسم الجهة المرخصة" value="منصة استثمار للخدمات المالية" required />
                  <Field name="authorizedPlatform" label="الجهة المرخصة بطرح المساهمة" value="منصة استثمار مرخصة" required />
                </div>
                <p className="mt-3 inline-flex items-center gap-2 text-[12px] font-bold mb-text-green"><CheckCircle2 className="h-4 w-4" />تم التحقق من الرابط بنجاح</p>
              </div>
            </InfoBox>

            <InfoBox title="3. المتطلبات النظامية" icon={FileText}>
              <div className="grid gap-4 md:grid-cols-3">
                {["التقييم الأول", "التقييم الثاني", "التقييم الثالث", "الدراسة الهندسية", "المراجعة القانونية", "المستندات الداعمة"].map((title, index) => (
                  <UploadBox key={title} title={title} file={`${title.replaceAll(" ", "_")}.pdf - ${(index + 1.8).toFixed(1)} MB`} entityId={formReference} />
                ))}
              </div>
            </InfoBox>

            <InfoBox title="4. الترخيص والامتثال" icon={Landmark}>
              <div className="grid gap-4 md:grid-cols-4">
                <Field name="licenseNumber" label="رخصة المساهمة العقارية" value="LIC-2024-000567" required />
                <Field name="licenseExpiry" label="تاريخ الانتهاء" value="15/10/1445 هـ" required />
                <Field name="licenseStatus" label="حالة الإصدار" value="معتمد" required />
                <UploadBox title="ملف الرخصة" file="رخصة_المساهمة_العقارية.pdf" entityId={formReference} />
              </div>
            </InfoBox>

            <InfoBox title="5. الرسوم والإرسال" icon={CreditCard}>
              <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr_0.9fr]">
                <div className="rounded-lg border mb-border-soft p-4">
                  <h3 className="mb-3 text-[14px] font-extrabold">ملخص السداد</h3>
                  <div className="flex justify-between text-sm font-bold"><span>المبلغ الإجمالي</span><strong>5,000 ريال</strong></div>
                  <div className="mt-2 flex justify-between text-sm font-bold mb-text-muted"><span>حالة السداد</span><span>لم يتم السداد</span></div>
                </div>
                <div className="rounded-lg border mb-border-soft p-4">
                  <h3 className="mb-3 text-[14px] font-extrabold">طرق الدفع</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {["Apple Pay", "VISA", "MADA"].map((method, index) => (
                      <label key={method} className="grid h-12 cursor-pointer place-items-center rounded-md border mb-border-soft bg-white text-sm font-extrabold has-[:checked]:border-[#A7815E] has-[:checked]:bg-[#fff3ec]">
                        <input name="paymentMethod" value={method} type="radio" defaultChecked={index === 2} className="sr-only" />
                        {method}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border mb-border-soft p-4">
                  <h3 className="mb-3 text-[14px] font-extrabold">تفاصيل الرسوم</h3>
                  <div className="grid gap-1 text-[12px] font-bold mb-text-muted">
                    <span>رسوم الدراسة: 1,000</span>
                    <span>رسوم المراجعة: 1,500</span>
                    <span>رسوم المعالجة: 2,500</span>
                    <strong className="mt-2 mb-text-accent">الإجمالي: 5,000</strong>
                  </div>
                </div>
              </div>
            </InfoBox>

            <InfoBox title="المراجعة والإرسال" icon={Send}>
              <div className="grid gap-4 lg:grid-cols-[1fr_1fr_0.75fr]">
                <textarea name="reviewNotes" className="min-h-24 rounded-md border mb-border-soft p-3 text-sm outline-none" placeholder="اكتب أي ملاحظات إضافية" />
                <div className="rounded-md border mb-border-soft p-3 text-[12px] font-bold leading-7 mb-text-navy">
                  <label className="flex gap-2"><input name="acceptedAccuracy" type="checkbox" required defaultChecked /> أقر بصحة البيانات والمستندات.</label>
                  <label className="flex gap-2"><input name="acceptedTerms" type="checkbox" required defaultChecked /> أوافق على الشروط والأحكام.</label>
                  <label className="flex gap-2"><input name="privacyAccepted" type="checkbox" required defaultChecked /> أوافق على سياسة الخصوصية.</label>
                </div>
                <div className="rounded-md border mb-border-soft p-3 text-center">
                  <p className="text-xs font-bold mb-text-muted">رقم الطلب</p>
                  <strong className="mt-1 block text-sm">CON-000001</strong>
                  <DashboardRequestFormSubmitButton
                    kind="contribution"
                    scope="business"
                    mode="submitted"
                    className="mt-4 w-full rounded-md mb-bg-success-soft py-2 text-sm font-extrabold mb-text-green"
                  >
                    جاهز للإرسال
                  </DashboardRequestFormSubmitButton>
                </div>
              </div>
            </InfoBox>
          </div>
        </div>
      </main>
      <div className="business-sticky-actions sticky bottom-0 z-30 border-t mb-border-line px-5 py-3">
        <div className="business-submit-grid mx-auto grid max-w-[1480px] gap-4">
          <DashboardRequestFormSubmitButton
            kind="contribution"
            scope="business"
            mode="submitted"
            className="min-h-12 rounded-md mb-bg-accent text-[15px] font-extrabold text-white mb-shadow-send"
          >
            إرسال طلب المساهمة العقارية
          </DashboardRequestFormSubmitButton>
          <DashboardRequestFormSubmitButton
            kind="contribution"
            scope="business"
            mode="draft"
            className="min-h-12 rounded-md border mb-border-draft text-[15px] font-extrabold text-white"
          >
            حفظ كمسودة
          </DashboardRequestFormSubmitButton>
        </div>
      </div>
      </form>
    </div>
  );
}
