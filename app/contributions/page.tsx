import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Building2, ChevronDown, ClipboardCheck, Factory, Home, Hotel, MapPin, Search, ShieldCheck, TrendingUp, Users } from "lucide-react";
import type { Contribution } from "@/lib/types";
import { getContributions } from "@/lib/supabase/mahabah";
import { FinalCTA } from "@/components/sections/final-cta";
import { InterestActionButton } from "@/components/dashboard/dashboard-actions";

export const metadata: Metadata = {
  title: "المساهمات العقارية",
  description: "استعرض المساهمات العقارية المنظمة والفرص الاستثمارية المطروحة عبر الجهات المرخصة.",
};

const contributionTypes = [
  { label: "سكنية", icon: Home },
  { label: "تجارية", icon: Building2 },
  { label: "صناعية", icon: Factory },
  { label: "ضيافة", icon: Hotel },
  { label: "مختلطة", icon: Building2 },
  { label: "متعددة الاستخدام", icon: Users },
  { label: "تطوير أرض", icon: ClipboardCheck },
];

type ListingSearchParams = Record<string, string | string[] | undefined>;

function firstParam(params: ListingSearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function normalized(value: string | number | undefined) {
  return String(value ?? "").toLocaleLowerCase("ar-SA").replace(/\s+/g, " ").trim();
}

function uniqueValues(values: Array<string | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort((a, b) => a.localeCompare(b, "ar-SA"));
}

function listingHref(pathname: string, params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "" || value === "الكل") continue;
    query.set(key, String(value));
  }
  const search = query.toString();
  return search ? `${pathname}?${search}` : pathname;
}

function contributionType(contribution: Contribution, index: number) {
  const text = normalized(`${contribution.titleAr} ${contribution.excerptAr} ${contribution.stageAr}`);
  if (text.includes("سكن")) return "سكنية";
  if (text.includes("صناع")) return "صناعية";
  if (text.includes("فندق") || text.includes("ضياف")) return "ضيافة";
  if (text.includes("أرض")) return "تطوير أرض";
  if (text.includes("مختلط") || text.includes("متعدد")) return "مختلطة";
  return index % 3 === 0 ? "تجارية" : index % 3 === 1 ? "سكنية" : "مختلطة";
}

function contributionStatus(contribution: Contribution) {
  if (contribution.stageAr === "مفتوحة") return "متاحة للاستثمار";
  if (contribution.stageAr === "تحت الطرح") return "قيد الطرح";
  if (contribution.stageAr === "مغلقة" || contribution.stageAr === "تخارج") return "مغلقة الاكتتاب";
  return contribution.stageAr;
}

function matchesContribution(row: { contribution: Contribution; type: string; status: string }, filters: { type: string; city: string; status: string }) {
  return (
    (!filters.type || row.type === filters.type) &&
    (!filters.city || row.contribution.cityAr === filters.city) &&
    (!filters.status || [row.status, row.contribution.stageAr].some((value) => normalized(value).includes(normalized(filters.status))))
  );
}

function SelectBox({ label, name, value, options }: { label: string; name: string; value: string; options: string[] }) {
  return (
    <label className="relative min-w-0">
      <ChevronDown className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <select name={name} defaultValue={value} className="h-12 w-full appearance-none rounded-md border border-line bg-white px-4 pl-10 text-xs font-extrabold text-[#1D1916] outline-none focus:border-[#A7815E]">
        <option>{label}</option>
        <option>الكل</option>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function ContributionListingCard({ contribution, type, status, index }: { contribution: Contribution; type: string; status: string; index: number }) {
  return (
    <article className="overflow-hidden rounded-lg border border-line bg-white shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
      <div className="relative h-36 overflow-hidden bg-surface">
        <Image src={contribution.image} alt="" fill className="object-cover grayscale-[7%] sepia-[7%]" sizes="25vw" />
        <span className="absolute right-3 top-3 rounded bg-white/90 px-3 py-1 text-[11px] font-extrabold text-[#1D1916]">{type}</span>
        <span className={`absolute bottom-3 right-3 rounded px-3 py-1 text-[11px] font-extrabold text-white ${index % 3 === 1 ? "bg-[#0F5F4A]" : index % 3 === 2 ? "bg-[#0E4672]" : "bg-[#A7815E]"}`}>{status}</span>
      </div>
      <div className="p-4 text-right">
        <h3 className="font-display text-lg font-extrabold text-[#1D1916]">{contribution.titleAr}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs font-bold text-muted"><MapPin className="h-3.5 w-3.5 text-[#A7815E]" />{contribution.cityAr}</p>
        <p className="mt-3 text-xs font-bold text-muted">الحد الأدنى للاستثمار</p>
        <p className="mt-1 font-display text-xl font-black text-[#A7815E]">{index % 2 ? "100,000" : "50,000"}</p>
        <div className="mt-4 flex items-center gap-2">
          <InterestActionButton
            entityType="contribution"
            entityId={contribution.id}
            slug={contribution.slug}
            title={contribution.titleAr}
            className="grid h-9 w-9 place-items-center rounded-md border border-line text-[#A7815E]"
            icon="heart"
            iconClassName="h-4 w-4"
            activeIconClassName="h-4 w-4 fill-current"
            activeLabel=""
            inactiveLabel=""
            ariaLabel="حفظ المساهمة"
          />
          <Link href={`/contributions/${contribution.slug}`} className="inline-flex h-9 flex-1 items-center justify-center rounded-md border border-[#A7815E]/45 text-xs font-extrabold text-[#8F6B4C]">عرض التفاصيل</Link>
        </div>
      </div>
    </article>
  );
}

export default async function ContributionsPage({ searchParams }: { searchParams?: Promise<ListingSearchParams> }) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const type = firstParam(resolvedSearchParams, "type").trim();
  const city = firstParam(resolvedSearchParams, "city").trim();
  const status = firstParam(resolvedSearchParams, "status").trim();
  const requestedPage = Number(firstParam(resolvedSearchParams, "page") || "1");
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;
  const contributionsResult = await getContributions();
  const rows = contributionsResult.data.map((contribution, index) => ({
    contribution,
    index,
    type: contributionType(contribution, index),
    status: contributionStatus(contribution),
  }));
  const filteredRows = rows.filter((row) => matchesContribution(row, { type, city, status }));
  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const activeParams = { type, city, status };

  return (
    <>
      <section className="section-compact">
        <div className="container-page">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[390px] overflow-hidden">
              <Image src="/images/contribution-request-hero-sketch.png" alt="" fill priority className="object-contain object-left-bottom" sizes="52vw" />
            </div>
            <div className="text-right">
              <h1 className="font-display text-[clamp(2.4rem,4.2vw,4.4rem)] font-black leading-[1.35] text-[#1D1916]">المساهمات العقارية</h1>
              <p className="mt-4 font-display text-2xl font-extrabold leading-10 text-[#A7815E]">استعرض المساهمات العقارية المنظمة والفرص الاستثمارية المطروحة عبر الجهات المرخصة.</p>
              <p className="mt-4 max-w-xl text-sm font-bold leading-8 text-muted">تعرف على المساهمات العقارية المتاحة واطلع على تفاصيلها ومؤشرات الأداء وفرص الاستثمار.</p>
            </div>
          </div>

          <form action="/contributions" className="mt-6 rounded-lg border border-line bg-white/82 p-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_1fr_150px]">
              <SelectBox label="نوع المساهمة" name="type" value={type} options={contributionTypes.map((item) => item.label)} />
              <SelectBox label="المدينة" name="city" value={city} options={uniqueValues(rows.map((row) => row.contribution.cityAr))} />
              <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#A7815E] text-sm font-extrabold text-white">بحث <Search className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-4 lg:grid-cols-7">
              {contributionTypes.map((item) => {
                const Icon = item.icon;
                const active = type === item.label;
                return <Link key={item.label} href={listingHref("/contributions", { ...activeParams, type: active ? undefined : item.label, page: undefined })} className={`inline-flex h-12 items-center justify-center gap-2 rounded-md border text-xs font-extrabold ${active ? "border-[#A7815E] bg-[#F6EDE4] text-[#8F6B4C]" : "border-line bg-white text-[#1D1916]"}`}><Icon className="h-4 w-4 text-[#A7815E]" />{item.label}</Link>;
              })}
            </div>
          </form>
          {contributionsResult.error ? <p className="mt-3 rounded-lg border border-[#F0D8B8] bg-[#fff7ec] px-4 py-3 text-right text-xs font-extrabold text-[#8F6B4C]">تعذر تحميل المساهمات الحية من Supabase، وتم عرض بيانات احتياطية.</p> : null}

          <div className="mt-8 flex items-center justify-between gap-3">
            <Link href="/contributions" className="inline-flex h-10 items-center rounded-md border border-line bg-white px-4 text-xs font-extrabold text-navy">عرض جميع المساهمات</Link>
            <h2 className="font-display text-3xl font-extrabold text-[#1D1916] gold-divider">المساهمات العقارية</h2>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-3 lg:grid-cols-6">
            {visibleRows.length === 0
              ? <p className="rounded-lg border border-line bg-white/72 p-6 text-center text-sm font-extrabold text-muted md:col-span-3 lg:col-span-6">لا توجد مساهمات مطابقة للفلاتر الحالية.</p>
              : visibleRows.map((row) => <ContributionListingCard key={row.contribution.id} contribution={row.contribution} type={row.type} status={row.status} index={row.index} />)}
          </div>

          <div className="mt-7 grid gap-4 rounded-lg bg-[#111820] p-5 text-white md:grid-cols-3">
            {[
              { title: "مساهمات مرخصة", copy: "جميع المساهمات عبر جهات مرخصة من هيئة السوق المالية.", icon: ClipboardCheck },
              { title: "فرص استثمارية منظمة", copy: "مساهمات مدروسة بعوائد مستهدفة ومخاطر محسوبة.", icon: TrendingUp },
              { title: "حوكمة وشفافية عالية", copy: "تطبيق أعلى معايير الحوكمة والإفصاح لحماية حقوق المساهمين.", icon: ShieldCheck },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="grid grid-cols-[1fr_64px] items-center gap-4 border-white/10 md:border-l md:last:border-l-0">
                  <div className="text-right">
                    <h3 className="font-display text-xl font-extrabold text-white">{item.title}</h3>
                    <p className="mt-2 text-xs font-bold leading-6 text-white/70">{item.copy}</p>
                  </div>
                  <Icon className="h-12 w-12 text-[#A7815E]" />
                </article>
              );
            })}
          </div>

          <nav className="mt-7 flex flex-wrap items-center justify-center gap-2 px-2" aria-label="الصفحات">
            <Link href={listingHref("/contributions", { ...activeParams, page: Math.max(1, currentPage - 1) })} className="h-10 rounded-md border border-line bg-white px-3 py-3 text-xs font-extrabold text-navy sm:px-4">السابق</Link>
            {Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 5).map((item) => <Link key={item} href={listingHref("/contributions", { ...activeParams, page: item })} className={`h-10 rounded-md border px-3 py-3 text-xs font-extrabold sm:px-4 ${item === currentPage ? "border-[#A7815E] bg-[#F6EDE4] text-[#8F6B4C]" : "border-line bg-white text-navy"}`}>{item}</Link>)}
            <Link href={listingHref("/contributions", { ...activeParams, page: Math.min(totalPages, currentPage + 1) })} className="h-10 rounded-md border border-line bg-white px-3 py-3 text-xs font-extrabold text-navy sm:px-4">التالي</Link>
          </nav>

          <section className="mt-8">
            <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">لماذا الاستثمار عبر المساهمات العقارية؟</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {["تنويع الفرص الاستثمارية", "إدارة احترافية للمشاريع", "حوكمة وشفافية"].map((title) => (
                <article key={title} className="rounded-lg border border-line bg-white/72 p-5 text-center">
                  <Users className="mx-auto h-10 w-10 text-[#A7815E]" />
                  <h3 className="mt-3 font-display text-lg font-extrabold text-[#1D1916]">{title}</h3>
                  <p className="mt-2 text-xs font-bold leading-7 text-muted">تمكين المستثمر من متابعة الفرصة والمخاطر والعوائد بوضوح.</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">مساهمات مميزة</h2>
            <div className="grid gap-5 md:grid-cols-4">
              {rows.slice(0, 4).map((row) => <ContributionListingCard key={`featured-${row.contribution.id}`} contribution={row.contribution} type={row.type} status={row.status} index={row.index} />)}
            </div>
          </section>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
