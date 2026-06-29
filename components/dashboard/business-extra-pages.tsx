import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Award,
  BadgeCheck,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Coins,
  CreditCard,
  Edit3,
  FileText,
  FileUp,
  Filter,
  Globe,
  Grid2X2,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Send,
  ShieldCheck,
  User,
  UserRound,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { DashboardDocumentUploadButton, SaveAccountSettingsButton, SubmitVerificationRequestButton } from "@/components/dashboard/dashboard-actions";
import { BrandLogo } from "@/components/layout/brand-logo";
import { cn } from "@/lib/utils";
import { dashboardHref, type DashboardRoleConfig } from "@/lib/data/dashboard";
import { navigation } from "@/lib/data/navigation";
import { dashboardBusinessCss } from "@/lib/styles/dashboard-business-css";
import {
  getDashboardBusinessProfile,
  listDashboardAssetsForScope,
  listDashboardContributionsForScope,
  listDashboardFinancial,
  listDashboardServiceRequestsForScope,
  type DashboardActorContext,
} from "@/lib/supabase/mahabah";

const heroImage = "/images/business-pages-hero-sketch.png";
const accent = "#A7815E";

function stableBusinessFormReference(key: string, actor?: DashboardActorContext | null, extra = "new") {
  const owner = actor?.organizationId ?? actor?.userId ?? actor?.email ?? "anonymous";
  return ["business", key, owner, extra]
    .map((part) => part.replaceAll(/[^a-z0-9-@.]/gi, "-"))
    .filter(Boolean)
    .join("-");
}

function BusinessHeader({ ownerName, compact = false }: { ownerName: string; compact?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b mb-border-header bg-white/96 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-[1480px] items-center gap-5 px-5">
        <BrandLogo height={compact ? 50 : 56} priority />
        <nav className="business-header-nav hidden flex-1 items-center justify-center text-[14px] font-extrabold mb-text-navy lg:flex">
          {navigation.map((item) => (
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

function PageHero({
  title,
  subtitle,
  icon: Icon,
  action,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  action?: { label: string; href: string };
}) {
  return (
    <section className="relative overflow-hidden rounded-lg border mb-border-line bg-white">
      <Image src={heroImage} alt="" fill priority className="object-cover object-left-center opacity-[0.84]" sizes="100vw" />
      <div className="absolute inset-0 mb-contribution-hero-fade" />
      <div className="relative ml-auto min-h-[214px] max-w-[650px] px-8 py-8 text-right">
        <Icon className="mb-3 h-14 w-14 mb-text-accent" />
        <h1 className="text-[42px] font-extrabold leading-tight mb-text-navy">{title}</h1>
        <p className="mt-4 max-w-xl text-[16px] font-bold leading-8 mb-text-muted">{subtitle}</p>
        {action ? (
          <Link href={action.href} className="mt-6 inline-flex min-h-12 min-w-56 items-center justify-center gap-3 rounded-md mb-bg-accent px-6 text-[15px] font-extrabold text-white mb-shadow-send">
            <Plus className="h-5 w-5" />
            {action.label}
          </Link>
        ) : null}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-8 rounded-t-lg bg-[#1D1916] px-8 py-8 text-white">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1.1fr]">
        <div>
          <h3 className="text-2xl font-extrabold mb-text-accent">مهابة</h3>
          <p className="mt-2 max-w-48 text-sm font-bold leading-7 text-white/78">منصة متكاملة لإدارة المساهمات العقارية بثقة وشفافية.</p>
        </div>
        {[
          ["روابط سريعة", "الرئيسية", "مهابة", "الأصول", "المساهمات", "الخدمات العقارية"],
          ["عن منصة مهابة", "منصة رقمية متخصصة", "في إدارة المساهمات العقارية", "وفق أعلى معايير الحوكمة"],
          ["خدماتنا", "إدارة الأصول العقارية", "إدارة المساهمات العقارية", "الدعم والمساعدة"],
          ["معلومات التواصل", "9200 01234", "info@mahabah.sa", "@mahabah_sa", "www.mahabah.sa"],
        ].map((col) => (
          <div key={col[0]}>
            <h4 className="mb-3 text-sm font-extrabold mb-text-accent">{col[0]}</h4>
            <div className="grid gap-1 text-sm font-bold leading-6 text-white/80">
              {col.slice(1).map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-7 border-t border-white/12 pt-4 text-xs font-bold text-white/72">جميع الحقوق محفوظة © 2026 منصة مهابة للمساهمات العقارية</div>
    </footer>
  );
}

function TrustStrip() {
  return (
    <section className="mt-6 rounded-lg border mb-border-line bg-white px-6 py-5">
      <h2 className="mb-4 text-center text-[20px] font-extrabold mb-text-navy">الثقة الرقمية</h2>
      <div className="business-trust-grid grid gap-4 text-center">
        {([
          ["نفاذ", "النفاذ الوطني", ShieldCheck],
          ["وثق", "المركز السعودي للأعمال", BadgeCheck],
          ["الهيئة العامة للعقار", "مرخص من الهيئة العامة للعقار", Landmark],
          ["التوقيع الإلكتروني", "معتمد وموثوق", Award],
        ] as Array<[string, string, LucideIcon]>).map(([title, desc, Icon]) => (
          <div key={title as string} className="rounded-md border mb-border-soft bg-white px-4 py-4">
            <Icon className="mx-auto h-8 w-8 mb-text-navy" />
            <strong className="mt-2 block text-[17px] font-extrabold mb-text-green">{title}</strong>
            <span className="text-[12px] font-bold mb-text-muted">{desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: ReactNode }) {
  return (
    <section className="rounded-lg border mb-border-line bg-white p-4">
      <h2 className="mb-4 flex items-center gap-2 text-[20px] font-extrabold mb-text-navy">
        <Icon className="h-5 w-5 mb-text-accent" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  icon: Icon,
  wide = false,
  name,
  type = "text",
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
  wide?: boolean;
  name?: string;
  type?: "text" | "email" | "number";
}) {
  return (
    <div className={cn("rounded-md border mb-border-soft bg-white px-4 py-3 text-right", wide ? "md:col-span-2" : "")}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] font-bold mb-text-muted">{label}</span>
        {Icon ? <Icon className="h-4 w-4 mb-text-accent" /> : null}
      </div>
      {name ? (
        <input
          name={name}
          type={type}
          defaultValue={value}
          className="mt-2 h-8 w-full rounded-sm border-0 bg-transparent p-0 text-right text-[15px] font-extrabold mb-text-navy outline-none focus:bg-[#F6F4F1] focus:px-2"
          aria-label={label}
        />
      ) : (
        <strong className="mt-2 block text-[15px] font-extrabold mb-text-navy">{value}</strong>
      )}
    </div>
  );
}

function UploadBox({ label, entityId }: { label: string; entityId?: string }) {
  return (
    <div className="flex min-h-16 items-center justify-between gap-3 rounded-md border mb-border-soft bg-white px-4">
      <DashboardDocumentUploadButton
        scope="business"
        entityType="business_verification_document"
        entityId={entityId}
        label={label}
        className="cursor-pointer rounded border mb-border-upload px-4 py-1.5 text-[12px] font-extrabold mb-text-navy"
      >
        اختر ملف
      </DashboardDocumentUploadButton>
      <div className="text-right">
        <p className="text-[12px] font-bold mb-text-navy">{label}</p>
        <p className="text-[10px] font-bold mb-text-light">PDF, JPG, PNG الحد الأقصى 10MB</p>
      </div>
      <FileUp className="h-5 w-5 mb-text-accent" />
    </div>
  );
}

function Ring({ value, label }: { value: number; label: string }) {
  return (
    <div className="mx-auto grid h-28 w-28 place-items-center rounded-full p-2" style={{ background: `conic-gradient(${accent} 0 ${value}%, #efe3da ${value}% 100%)` }}>
      <div className="grid h-full w-full place-items-center rounded-full bg-white text-center">
        <strong className="text-2xl font-extrabold mb-text-navy">{value}%</strong>
        <span className="text-[11px] font-bold mb-text-muted">{label}</span>
      </div>
    </div>
  );
}

const contributionItems = [
  { title: "مساهمة النخيل العقارية", city: "الرياض", value: "250 مليون ريال", months: "24 شهر", manager: "أ. أحمد محمد السبيعي", status: "مطروحة", progress: 72, color: "green", image: "/images/business-pages-hero-sketch.png" },
  { title: "مساهمة الواحة العقارية", city: "جدة", value: "180 مليون ريال", months: "18 شهر", manager: "أ. فهد عبدالعزيز", status: "قيد الترخيص", progress: 56, color: "orange", image: "/images/contribution-request-hero-sketch.png" },
  { title: "مساهمة اليسر العقارية", city: "الدمام", value: "320 مليون ريال", months: "30 شهر", manager: "أ. سلطان خالد", status: "قيد الدراسة", progress: 28, color: "blue", image: "/images/dashboard-business-hero-sketch.png" },
];

export function BusinessCompanyContributionsPage({ config }: { config: DashboardRoleConfig }) {
  const kpis = [
    ["إجمالي المساهمات", "12", "مساهمة", Building2],
    ["المساهمات النشطة", "7", "مساهمة", ClipboardList],
    ["قيد الترخيص", "2", "مساهمة", Award],
    ["قيد الدراسة", "2", "مساهمة", FileText],
    ["مكتملة", "1", "مساهمة", CheckCircle2],
    ["إجمالي القيمة التقديرية", "1.2 مليار", "ريال سعودي", Coins],
  ] as const;

  return (
    <div className="min-h-screen bg-white mb-text-navy" dir="rtl">
      <style dangerouslySetInnerHTML={{ __html: dashboardBusinessCss }} />
      <BusinessHeader ownerName={config.ownerName} />
      <main className="mx-auto max-w-[1480px] px-5 py-5">
        <PageHero title="مساهماتي المضافة" subtitle="إدارة ومتابعة جميع المساهمات العقارية الخاصة بمنشأتك من مكان واحد." icon={Building2} action={{ label: "إضافة مساهمة عقارية", href: dashboardHref("business", "add-contribution") }} />
        <section className="business-kpi-grid mt-5 grid gap-4">
          {kpis.map(([label, value, unit, Icon]) => (
            <article key={label} className="rounded-lg border mb-border-line bg-white p-5 text-center">
              <Icon className="mx-auto h-8 w-8 mb-text-accent" />
              <p className="mt-2 text-[13px] font-bold mb-text-muted">{label}</p>
              <strong className="mt-3 block text-[28px] font-extrabold mb-text-navy">{value}</strong>
              <span className="text-[12px] font-bold mb-text-muted">{unit}</span>
            </article>
          ))}
        </section>

        <section className="mt-5 rounded-lg border mb-border-line bg-white p-4">
          <form action={dashboardHref("business", "company-contributions")} className="grid gap-3 lg:grid-cols-[1fr_190px_190px_190px_160px]">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 mb-text-muted" />
              <input name="q" className="h-11 w-full rounded-md border mb-border-soft bg-white pr-10 text-sm font-bold outline-none" placeholder="ابحث باسم المساهمة" />
            </div>
            <select name="city" className="h-11 rounded-md border mb-border-soft bg-white px-3 text-sm font-bold mb-text-muted outline-none">
              <option value="">اختر المدينة</option>
              <option value="riyadh">الرياض</option>
              <option value="jeddah">جدة</option>
              <option value="dammam">الدمام</option>
            </select>
            <select name="status" className="h-11 rounded-md border mb-border-soft bg-white px-3 text-sm font-bold mb-text-muted outline-none">
              <option value="">اختر الحالة</option>
              <option value="active">نشطة</option>
              <option value="licensed">مرخصة</option>
              <option value="under-study">قيد الدراسة</option>
            </select>
            <select name="license" className="h-11 rounded-md border mb-border-soft bg-white px-3 text-sm font-bold mb-text-muted outline-none">
              <option value="">اختر حالة الترخيص</option>
              <option value="approved">معتمد</option>
              <option value="review">قيد المراجعة</option>
              <option value="missing">يتطلب استكمال</option>
            </select>
            <button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-md border mb-border-action bg-white text-sm font-extrabold mb-text-accent">
              <Filter className="h-4 w-4" /> تطبيق الفلتر
            </button>
          </form>
        </section>

        <div className="business-list-layout mt-5 grid gap-5">
          <aside className="grid content-start gap-4">
            <Panel title="ملخص الأداء" icon={ClipboardList}>
              <div className="grid gap-3 text-sm font-bold">
                {["المساهمات المطروحة 7", "المساهمات المرخصة 8", "المساهمات قيد الدراسة 2", "إجمالي حجم المشاريع 1.2 مليار"].map((item) => <span key={item} className="border-b mb-border-subtle pb-2 last:border-b-0">{item}</span>)}
              </div>
            </Panel>
            <Panel title="التنبيهات" icon={Bell}>
              <div className="grid gap-3 text-[13px] font-bold">
                {["مساهمة الواحة العقارية تحتاج استكمال مستند", "مساهمة اليسر العقارية تم تحديث حالة الترخيص", "مساهمة النخيل العقارية اقترب موعد انتهاء الترخيص"].map((item) => <p key={item} className="rounded-md mb-bg-tag p-3 mb-text-navy">{item}</p>)}
              </div>
            </Panel>
            <Panel title="العمليات الأخيرة" icon={CalendarDays}>
              <div className="grid gap-3 text-[12px] font-bold mb-text-muted">
                {["إضافة مساهمة عقارية جديدة", "رفع رخصة المساهمة", "اعتماد الترخيص", "إضافة رابط الطرح"].map((item) => <span key={item}>{item}</span>)}
              </div>
            </Panel>
          </aside>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <Link href={dashboardHref("business", "company-contributions?view=cards")} className="inline-flex h-10 items-center gap-2 rounded-md border mb-border-action px-4 text-sm font-extrabold mb-text-accent"><Grid2X2 className="h-4 w-4" /> عرض ببطاقات</Link>
                <Link href={dashboardHref("business", "company-contributions?view=table")} className="grid h-10 place-items-center rounded-md border mb-border-soft px-4 text-sm font-bold mb-text-muted">عرض جدولي</Link>
              </div>
              <span className="text-sm font-bold mb-text-muted">عرض 1 - 3 من 12 مساهمة</span>
            </div>
            {contributionItems.map((item, index) => (
              <article key={item.title} className="contribution-row-grid grid gap-4 rounded-lg border mb-border-line bg-white p-4">
                <div className="rounded-lg border mb-border-soft bg-white p-4 text-center">
                  <span className="inline-flex rounded-md mb-bg-tag px-5 py-2 text-[12px] font-extrabold mb-text-accent">{item.status}</span>
                  <p className="mt-5 text-[12px] font-bold mb-text-muted">نسبة الإنجاز</p>
                  <Ring value={item.progress} label="" />
                  <p className="mt-4 text-[12px] font-bold mb-text-muted">عرض تقدم المساهمة</p>
                </div>
                <div>
                  <h2 className="text-[26px] font-extrabold mb-text-navy">{item.title}</h2>
                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <Field label="المدينة" value={item.city} icon={MapPin} />
                    <Field label="القيمة التقديرية" value={item.value} icon={Coins} />
                    <Field label="مدة التنفيذ" value={item.months} icon={CalendarDays} />
                    <Field label="مدير المساهمة" value={item.manager} icon={User} />
                    <Field label="الجهة المرخصة بالطرح" value="منصة استثمار للخدمات المالية" icon={Landmark} />
                    <Field label="حالة الترخيص" value="معتمد LIC-2026-00125" icon={CheckCircle2} />
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <Link href={dashboardHref("business", "add-contribution")} className="grid h-10 place-items-center rounded-md border mb-border-action text-sm font-extrabold mb-text-accent">تعديل المساهمة</Link>
                    <Link href={dashboardHref("business", "verification")} className="grid h-10 place-items-center rounded-md border mb-border-action text-sm font-extrabold mb-text-accent">متابعة الترخيص</Link>
                    <Link href={dashboardHref("business", `contribution-details?contribution=${encodeURIComponent(item.title)}`)} className="grid h-10 place-items-center rounded-md border mb-border-soft text-sm font-bold mb-text-muted">المزيد</Link>
                  </div>
                </div>
                <div className="relative min-h-44 overflow-hidden rounded-md border mb-border-soft">
                  <Image src={item.image} alt="" fill priority={index === 0} className="object-cover opacity-80" sizes="260px" />
                  <div className="absolute inset-0 bg-white/30" />
                  <Link href={dashboardHref("business", `contribution-details?contribution=${encodeURIComponent(item.title)}`)} className="absolute bottom-4 left-1/2 min-w-40 -translate-x-1/2 rounded-md border mb-border-action bg-white px-4 py-2 text-center text-sm font-extrabold mb-text-accent">عرض التفاصيل</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
        <section className="mt-6 rounded-lg border mb-border-line bg-white p-5">
          <h2 className="mb-4 text-[18px] font-extrabold mb-text-navy">اختصارات سريعة</h2>
          <div className="grid gap-4 md:grid-cols-5">
            <Link href={dashboardHref("business", "add-contribution")} className="grid h-12 place-items-center rounded-md border mb-border-soft bg-white text-sm font-bold mb-text-navy">إضافة مساهمة عقارية</Link>
            <Link href={dashboardHref("business", "verification")} className="grid h-12 place-items-center rounded-md border mb-border-soft bg-white text-sm font-bold mb-text-navy">متابعة الترخيص</Link>
            <DashboardDocumentUploadButton scope="business" entityType="business_contribution_document" entityId="business-contributions-shortcut" label="رفع مستندات" className="grid h-12 cursor-pointer place-items-center rounded-md border mb-border-soft bg-white text-sm font-bold mb-text-navy">رفع مستندات</DashboardDocumentUploadButton>
            <Link href={dashboardHref("business", "payments")} className="grid h-12 place-items-center rounded-md border mb-border-soft bg-white text-sm font-bold mb-text-navy">المدفوعات</Link>
            <Link href={dashboardHref("business", "request-service")} className="grid h-12 place-items-center rounded-md border mb-border-soft bg-white text-sm font-bold mb-text-navy">طلب خدمة عقارية</Link>
          </div>
        </section>
        <TrustStrip />
        <Footer />
      </main>
    </div>
  );
}

const verificationSteps = ["بيانات المنشأة", "المستندات النظامية", "التحقق والامتثال", "الرسوم", "الإقرار والإرسال"];

export async function BusinessVerificationRequestPage({ config, actor = null }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null }) {
  const profileResult = await getDashboardBusinessProfile(actor);
  const profile = profileResult.data;
  const nationalAddress = `${profile.district}، ${profile.street}، ${profile.city} ${profile.postalCode}`;
  const verificationPercent = Math.max(45, Math.min(100, profile.profileCompletion));
  const verificationSummary = [
    profile.organizationName,
    profile.commercialRegistration,
    profile.city,
    profile.email,
    profile.phone,
  ];
  const formReference = stableBusinessFormReference("verification", actor, profile.id);
  const organizationFields: Array<readonly [string, string, LucideIcon]> = [
    ["اسم المنشأة", profile.organizationName, Building2],
    ["الاسم التجاري", profile.organizationName.replace(/^شركة\s+/, ""), FileText],
    ["رقم السجل التجاري", profile.commercialRegistration, FileText],
    ["رقم المنشأة", profile.id.slice(0, 8).toUpperCase(), Building2],
    ["رقم المنشأ الموحد", profile.id.slice(-12).toUpperCase(), Building2],
    ["نوع النشاط", profile.activityType, Landmark],
    ["المدينة", profile.city, MapPin],
    ["العنوان الوطني", nationalAddress, MapPin],
    ["البريد الإلكتروني", profile.email, Mail],
  ];

  return (
    <div className="min-h-screen bg-white mb-text-navy" dir="rtl">
      <style dangerouslySetInnerHTML={{ __html: dashboardBusinessCss }} />
      <BusinessHeader ownerName={config.ownerName} />
      <main className="mx-auto max-w-[1480px] px-5 py-5">
        <PageHero title="طلب شارة توثيق" subtitle="استكمل متطلبات التحقق والامتثال للحصول على شارة التوثيق الخاصة بمنشأتك داخل منصة مهابة." icon={ShieldCheck} action={{ label: "طلب شارة التوثيق", href: dashboardHref("business", "verification") }} />
        <section className="mt-5 rounded-lg border mb-border-line bg-white px-8 py-5">
          <div className="grid grid-cols-5 items-start">
            {verificationSteps.map((step, index) => (
              <div key={step} className="relative grid place-items-center text-center">
                {index < verificationSteps.length - 1 ? <span className="absolute right-1/2 top-6 h-px w-full mb-bg-line" /> : null}
                <span className={cn("relative z-10 grid h-12 w-12 place-items-center rounded-full border-2 bg-white", index === 0 ? "mb-border-accent mb-text-accent" : "mb-border-muted mb-text-navy")}>
                  {index === 0 ? <Building2 className="h-6 w-6" /> : index === 1 ? <FileText className="h-6 w-6" /> : index === 2 ? <ShieldCheck className="h-6 w-6" /> : index === 3 ? <CreditCard className="h-6 w-6" /> : <Send className="h-6 w-6" />}
                </span>
                <span className="mt-2 text-[13px] font-extrabold mb-text-navy">{step}</span>
              </div>
            ))}
          </div>
        </section>
        <div className="business-contribution-layout mt-5 grid gap-5">
          <aside className="grid content-start gap-4">
            <Panel title="حالة الطلب" icon={ClipboardList}>
              {["رقم الطلب DOC-000001", `الحالة ${businessStatusLabel(profile.verificationStatus)}`, "مدة دقائق", `اكتمال الملف ${verificationPercent}%`].map((item) => <p key={item} className="border-b mb-border-subtle py-2 text-sm font-bold last:border-b-0">{item}</p>)}
            </Panel>
            <Panel title="نسبة الاكتمال" icon={ClipboardList}><Ring value={verificationPercent} label="اكتمل" /></Panel>
            <Panel title="ملخص المنشأة" icon={Landmark}>
              {verificationSummary.map((item) => <p key={item} className="border-b mb-border-subtle py-2 text-[12px] font-bold last:border-b-0">{item}</p>)}
              {profileResult.error ? <p className="mt-3 rounded-md border border-[#F0D8B8] bg-[#fff7ec] px-3 py-2 text-[11px] font-extrabold text-[#8F6B4C]">تم عرض بيانات احتياطية مؤقتة.</p> : null}
            </Panel>
            <Panel title="قائمة التحقق" icon={CheckCircle2}>
              {["بيانات المنشأة", "بيانات المفوض", "المستندات النظامية", "التحقق والامتثال", "الرسوم", "إصدار شارة التوثيق"].map((item, index) => (
                <div key={item} className="flex items-center justify-between py-1 text-[12px] font-bold"><span>{item}</span>{index < 3 ? <CheckCircle2 className="h-4 w-4 mb-text-green" /> : <span className="h-4 w-4 rounded-full border mb-border-warn" />}</div>
              ))}
            </Panel>
          </aside>
          <div className="grid gap-5">
            <Panel title="1. بيانات المنشأة" icon={Building2}>
              <div className="grid gap-4 md:grid-cols-3">
                {organizationFields.map(([label, value, Icon]) => <Field key={label} label={label} value={value} icon={Icon} />)}
              </div>
            </Panel>
            <Panel title="2. بيانات المفوض" icon={User}>
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="اسم المفوض" value={profile.delegateName} icon={User} />
                <Field label="رقم الهوية" value={profile.delegateId} icon={FileText} />
                <Field label="الصفة النظامية" value="مدير عام" icon={ShieldCheck} />
                <Field label="رقم الجوال" value={profile.delegatePhone} icon={Phone} />
                <Field label="البريد الإلكتروني" value={profile.delegateEmail} icon={Mail} />
              </div>
            </Panel>
            <Panel title="3. المستندات النظامية" icon={FileUp}>
              <div className="grid gap-4 md:grid-cols-3">
                {["شهادة الزكاة والضريبة", "شهادة العنوان الوطني", "السجل التجاري", "تفويض رسمي", "هوية المفوض", "شهادة الآيبان البنكي"].map((item) => <UploadBox key={item} label={item} entityId={formReference} />)}
              </div>
            </Panel>
            <section className="grid gap-5 lg:grid-cols-2">
              <Panel title="4. التحقق والامتثال" icon={ShieldCheck}>
                {["السجل التجاري", "العنوان الوطني", "البريد الإلكتروني", "رقم الجوال", "الحساب البنكي"].map((item, index) => (
                  <div key={item} className="flex items-center justify-between py-2 text-sm font-bold">{item}{index < 4 ? <CheckCircle2 className="h-4 w-4 mb-text-green" /> : <span className="h-4 w-4 rounded-full mb-bg-tag" />}</div>
                ))}
              </Panel>
              <Panel title="5. الرسوم" icon={CreditCard}>
                <div className="text-center">
                  <p className="text-sm font-bold mb-text-muted">رسوم إصدار شارة التوثيق</p>
                  <strong className="mt-3 block text-5xl font-extrabold mb-text-navy">500</strong>
                  <span className="text-sm font-bold mb-text-muted">ريال سعودي</span>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {["MADA", "VISA", "Apple Pay"].map((item, index) => (
                    <label key={item} className="grid h-11 cursor-pointer place-items-center rounded-md border mb-border-soft text-sm font-extrabold has-[:checked]:border-[#A7815E] has-[:checked]:bg-[#fff3ec]">
                      <input form="business-verification-request-form" name="paymentMethod" value={item} type="radio" defaultChecked={index === 0} className="sr-only" />
                      {item}
                    </label>
                  ))}
                </div>
              </Panel>
            </section>
            <Panel title="6. الإقرار والإرسال" icon={Send}>
              <form id="business-verification-request-form" className="grid gap-5 lg:grid-cols-2">
                <input type="hidden" name="formReference" defaultValue={formReference} />
                <input type="hidden" name="feeAmount" defaultValue="500" />
                <textarea name="reviewNotes" className="min-h-28 rounded-md border mb-border-soft p-4 text-sm outline-none" placeholder="اكتب ملاحظاتك هنا..." />
                <div className="grid content-between gap-4">
                  {[
                    ["acceptedAccuracy", "أقر بصحة البيانات المدخلة وأتحمل مسؤوليتها."],
                    ["acceptedTerms", "أوافق على شروط استخدام منصة مهابة."],
                    ["acceptedDocuments", "أتحمل مسؤولية المستندات المرفوعة وصحتها."],
                  ].map(([name, item]) => <label key={name} className="flex items-center gap-2 text-sm font-bold"><input name={name} type="checkbox" required defaultChecked /> {item}</label>)}
                  <div className="grid grid-cols-2 gap-4">
                    <SubmitVerificationRequestButton
                      scope="business"
                      mode="draft"
                      displayName={profile.organizationName}
                      note="مسودة طلب شارة توثيق منشأة"
                      payload={{
                        commercialRegistration: profile.commercialRegistration,
                        city: profile.city,
                        delegateName: profile.delegateName,
                        formReference,
                        feeAmount: 500,
                        requestedFrom: "business-verification-page",
                      }}
                      className="h-12 rounded-md border mb-border-action text-sm font-extrabold mb-text-accent"
                    >
                      حفظ كمسودة
                    </SubmitVerificationRequestButton>
                    <SubmitVerificationRequestButton
                      scope="business"
                      mode="submitted"
                      displayName={profile.organizationName}
                      note="طلب شارة توثيق منشأة"
                      payload={{
                        commercialRegistration: profile.commercialRegistration,
                        city: profile.city,
                        delegateName: profile.delegateName,
                        formReference,
                        feeAmount: 500,
                        paymentMethod: "mada",
                        requestedFrom: "business-verification-page",
                      }}
                      className="h-12 rounded-md mb-bg-accent text-sm font-extrabold text-white"
                    >
                      إرسال طلب شارة التوثيق
                    </SubmitVerificationRequestButton>
                  </div>
                </div>
              </form>
            </Panel>
          </div>
        </div>
        <TrustStrip />
        <Footer />
      </main>
    </div>
  );
}

function businessStatusLabel(status: string) {
  if (status === "approved") return "منشأة موثقة";
  if (status === "submitted" || status === "in_review") return "قيد المراجعة";
  if (status === "needs_changes") return "تحتاج تحديث";
  if (status === "rejected") return "مرفوضة";
  return "قيد الإعداد";
}

function businessStatusTone(status: string) {
  return status === "approved" ? "mb-bg-green-soft mb-text-green" : "mb-bg-tag mb-text-accent";
}

function businessMemberSince(value?: string | null) {
  if (!value) return "عضو في منصة مهابة";
  return `عضو منذ ${new Intl.DateTimeFormat("ar-SA", { month: "long", year: "numeric" }).format(new Date(value))}`;
}

export async function BusinessCompanyProfilePage({ config, actor = null }: { config: DashboardRoleConfig; actor?: DashboardActorContext | null }) {
  const [profileResult, assetsResult, contributionsResult, requestsResult, financialResult] = await Promise.all([
    getDashboardBusinessProfile(actor),
    listDashboardAssetsForScope("business", "owned", actor),
    listDashboardContributionsForScope("business", "owned", actor),
    listDashboardServiceRequestsForScope("business", actor),
    listDashboardFinancial("business", actor),
  ]);
  const profile = profileResult.data;
  const logoTitle = profile.organizationName.replace(/^شركة\s+/, "").split(/\s+/).slice(0, 2).join(" ") || profile.organizationName;
  const stats: Array<readonly [string, string, string, LucideIcon]> = [
    ["الأصول العقارية", String(assetsResult.data.length), "أصل", Building2],
    ["المساهمات العقارية", String(contributionsResult.data.length), "مساهمة", CalendarDays],
    ["الخدمات العقارية", String(requestsResult.data.length), "طلب", ShieldCheck],
    ["المساهمات النشطة", String(contributionsResult.data.filter((item) => item.status === "approved").length), "نشطة", CheckCircle2],
    ["العمليات المالية", String(financialResult.invoices.length + financialResult.payments.length), "عملية", WalletCards],
    ["حالة التوثيق", businessStatusLabel(profile.verificationStatus), "", ShieldCheck],
  ];
  const statsHasFallback = Boolean(assetsResult.error || contributionsResult.error || requestsResult.error || financialResult.error);

  return (
    <div className="min-h-screen bg-white mb-text-navy" dir="rtl">
      <style dangerouslySetInnerHTML={{ __html: dashboardBusinessCss }} />
      <BusinessHeader ownerName={config.ownerName} compact />
      <main className="mx-auto max-w-[1480px] px-5 py-5">
        <form>
          <input type="hidden" name="profileCompletion" defaultValue={String(profile.profileCompletion)} />
          <section className="relative overflow-hidden rounded-lg border mb-border-line bg-white p-8">
            <Image src="/images/dashboard-business-hero-sketch.png" alt="" fill priority className="object-cover object-left-center opacity-[0.72]" sizes="100vw" />
            <div className="absolute inset-0 mb-contribution-hero-fade" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[220px_1fr]">
              <div className="rounded-xl bg-[#1D1916] p-7 text-center text-white">
                <Building2 className="mx-auto h-16 w-16 mb-text-accent" />
                <strong className="mt-4 block text-3xl font-extrabold mb-text-accent">{logoTitle}</strong>
                <span className="text-lg font-bold">العقارية</span>
              </div>
              <div className="text-right">
                <h1 className="text-[40px] font-extrabold mb-text-navy">{profile.organizationName}</h1>
                <p className="mt-3 flex items-center gap-2 text-[24px] font-extrabold mb-text-accent"><ShieldCheck className="h-8 w-8" /> شارة توثيق مهابة</p>
                <span className={cn("mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-extrabold", businessStatusTone(profile.verificationStatus))}><CheckCircle2 className="h-4 w-4" /> {businessStatusLabel(profile.verificationStatus)}</span>
                <p className="mt-4 text-sm font-bold mb-text-navy">{businessMemberSince(profile.createdAt)}</p>
                {profileResult.error ? <p className="mt-3 rounded-md border border-[#F0D8B8] bg-[#fff7ec] px-3 py-2 text-xs font-extrabold text-[#8F6B4C]">تعذر تحميل بيانات المنشأة الحية، وتم عرض بيانات احتياطية.</p> : null}
                <div className="mt-8 flex flex-wrap gap-4">
                  <SaveAccountSettingsButton
                    scope="business"
                    kind="profile"
                    payload={{ profileCompletion: profile.profileCompletion }}
                    className="inline-flex h-12 min-w-56 items-center justify-center gap-2 rounded-md mb-bg-accent px-5 text-sm font-extrabold text-white"
                  >
                    <Edit3 className="h-4 w-4" /> حفظ بيانات المنشأة
                  </SaveAccountSettingsButton>
                  <Link href={dashboardHref("business", "add-asset")} className="inline-flex h-12 min-w-56 items-center justify-center gap-2 rounded-md border mb-border-action bg-white px-5 text-sm font-extrabold mb-text-accent"><Plus className="h-4 w-4" /> إضافة أصل عقاري</Link>
                  <Link href={dashboardHref("business", "add-contribution")} className="inline-flex h-12 min-w-56 items-center justify-center gap-2 rounded-md border mb-border-action bg-white px-5 text-sm font-extrabold mb-text-accent"><Plus className="h-4 w-4" /> إضافة مساهمة عقارية</Link>
                </div>
              </div>
            </div>
          </section>

          <div className="business-profile-layout mt-5 grid gap-5">
          <aside className="grid content-start gap-4">
            <Panel title="حالة المنشأة" icon={CheckCircle2}><p className="text-center text-xl font-extrabold mb-text-green">{businessStatusLabel(profile.status)}</p></Panel>
            <Panel title="نسبة اكتمال الملف" icon={ClipboardList}><Ring value={profile.profileCompletion} label="مكتمل" /></Panel>
            <Panel title="قائمة التحقق" icon={CheckCircle2}>
              {["بيانات المنشأة", "بيانات المفوض", "المستندات", "الحساب البنكي", "شارة التوثيق"].map((item) => <div key={item} className="flex items-center justify-between py-2 text-sm font-bold"><span>{item}</span><CheckCircle2 className="h-4 w-4 mb-text-green" /></div>)}
            </Panel>
            <Panel title="اختصارات سريعة" icon={Plus}>
              <div className="grid gap-3">
                <Link href={dashboardHref("business", "verification")} className="grid h-11 place-items-center rounded-md border mb-border-action bg-white text-sm font-extrabold mb-text-accent">طلب شارة توثيق</Link>
                <Link href={dashboardHref("business", "add-asset")} className="grid h-11 place-items-center rounded-md border mb-border-action bg-white text-sm font-extrabold mb-text-accent">إضافة أصل عقاري</Link>
                <Link href={dashboardHref("business", "add-contribution")} className="grid h-11 place-items-center rounded-md border mb-border-action bg-white text-sm font-extrabold mb-text-accent">إضافة مساهمة عقارية</Link>
                <DashboardDocumentUploadButton scope="business" entityType="business_profile_document" entityId={profile.id} label="رفع مستند" className="grid h-11 cursor-pointer place-items-center rounded-md border mb-border-action bg-white text-sm font-extrabold mb-text-accent">رفع مستند</DashboardDocumentUploadButton>
              </div>
            </Panel>
          </aside>
          <div className="grid gap-5">
            <Panel title="بيانات المنشأة" icon={Building2}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field name="name" label="اسم المنشأة" value={profile.organizationName} icon={Building2} />
                <Field name="commercialRegistration" label="رقم السجل التجاري" value={profile.commercialRegistration} icon={FileText} />
                <Field name="activityType" label="نوع النشاط" value={profile.activityType} icon={Edit3} />
                <Field name="city" label="المدينة" value={profile.city} icon={MapPin} />
              </div>
            </Panel>
            <Panel title="أرقام التواصل مع المنشأة" icon={Phone}>
              <div className="grid gap-4 md:grid-cols-4">
                <Field name="phone" label="رقم الجوال" value={profile.phone} icon={Phone} />
                <Field name="landline" label="الهاتف الثابت" value={profile.landline} icon={Phone} />
                <Field name="email" type="email" label="البريد الإلكتروني" value={profile.email} icon={Mail} />
                <Field name="website" label="الموقع الإلكتروني" value={profile.website} icon={Globe} />
              </div>
            </Panel>
            <Panel title="العنوان الوطني للمنشأة" icon={MapPin}>
              <div className="grid gap-4 md:grid-cols-3">
                <Field name="district" label="الحي" value={profile.district} />
                <Field name="street" label="الشارع" value={profile.street} />
                <Field name="buildingNumber" label="رقم المبنى" value={profile.buildingNumber} />
                <Field name="additionalNumber" label="رقم إضافي" value={profile.additionalNumber} />
                <Field name="postalCode" label="الرمز البريدي" value={profile.postalCode} />
                <Field name="nationalAddress" label="رقم العنوان الوطني" value={profile.nationalAddress} />
              </div>
            </Panel>
            <Panel title="بيانات المفوض" icon={User}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field name="delegateName" label="اسم المفوض" value={profile.delegateName} icon={User} />
                <Field name="delegateId" label="رقم الهوية" value={profile.delegateId} icon={FileText} />
                <Field name="delegatePhone" label="رقم الجوال" value={profile.delegatePhone} icon={Phone} />
                <Field name="delegateEmail" type="email" label="البريد الإلكتروني" value={profile.delegateEmail} icon={Mail} />
              </div>
            </Panel>
          </div>
          </div>
        </form>

        <section className="business-kpi-grid mt-5 grid gap-4">
          {stats.map(([label, value, unit, Icon]) => (
            <article key={label} className="rounded-lg border mb-border-line bg-white p-5 text-center">
              <Icon className="mx-auto h-7 w-7 mb-text-accent" />
              <p className="mt-2 text-[13px] font-bold mb-text-muted">{label}</p>
              <strong className="mt-3 block text-[26px] font-extrabold mb-text-navy">{value}</strong>
              {unit ? <span className="text-[12px] font-bold mb-text-muted">{unit}</span> : null}
            </article>
          ))}
        </section>
        {statsHasFallback ? <p className="mt-3 rounded-md border border-[#F0D8B8] bg-[#fff7ec] px-4 py-3 text-sm font-extrabold text-[#8F6B4C]">تعذر تحميل بعض مؤشرات النشاط الحية، وتم عرض البيانات المتاحة مع الاحتياطي.</p> : null}
        <TrustStrip />
        <Footer />
      </main>
    </div>
  );
}
