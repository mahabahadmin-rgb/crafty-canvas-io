import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Building2, ChevronDown, Factory, Handshake, Home, MapPin, Search, Store, Target, TrendingUp } from "lucide-react";
import type { Asset } from "@/lib/types";
import { formatArea } from "@/lib/utils";
import { getAssets } from "@/lib/supabase/mahabah";
import { FinalCTA } from "@/components/sections/final-cta";
import { InterestActionButton } from "@/components/dashboard/dashboard-actions";

export const metadata: Metadata = {
  title: "الأصول العقارية",
  description: "استعرض الأصول العقارية الجاهزة للدراسة والتطوير والتحويل إلى مشاريع استثمارية ومساهمات عقارية منظمة.",
};

const chips = ["أرض خام", "أرض سكنية", "أرض تجارية", "أرض صناعية", "أصل قائم", "مشروع متعثر", "متاح", "قيد الدراسة", "قيد التطوير"];
const why = [
  { title: "إمكانية تحويل لمساهمة عقارية", copy: "إمكانية تحويل الأصل إلى مساهمة عقارية منظمة وفق أعلى معايير الحوكمة والامتثال.", icon: Handshake },
  { title: "فرصة استثمار", copy: "أصول مختارة ومناسبة تمنح عوائد استثمارية مجزية.", icon: TrendingUp },
  { title: "فرصة تطوير", copy: "إمكانية تطوير الأصل لمشروع عقاري متكامل يلبي الطلب المتزايد.", icon: Target },
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

function matchesAsset(asset: Asset, filters: { q: string; status: string; type: string; city: string; chip: string }) {
  const haystack = normalized([
    asset.titleAr,
    asset.cityAr,
    asset.districtAr,
    asset.assetTypeAr,
    asset.usageTypeAr,
    asset.statusAr,
    asset.deedNumber,
    asset.excerptAr,
  ].join(" "));

  return (
    (!filters.q || haystack.includes(normalized(filters.q))) &&
    (!filters.status || filters.status === asset.statusAr) &&
    (!filters.type || [asset.assetTypeAr, asset.usageTypeAr].some((value) => normalized(value).includes(normalized(filters.type)))) &&
    (!filters.city || filters.city === asset.cityAr) &&
    (!filters.chip || haystack.includes(normalized(filters.chip)))
  );
}

function SelectFilter({ label, name, value, options }: { label: string; name: string; value: string; options: string[] }) {
  return (
    <label className="relative min-w-0">
      <span className="sr-only">{label}</span>
      <ChevronDown className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <select name={name} defaultValue={value} className="h-12 w-full appearance-none rounded-md border border-line bg-white px-4 pl-10 text-xs font-extrabold text-navy outline-none focus:border-[#A7815E]">
        <option>{label}</option>
        <option>الكل</option>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function AssetListingCard({ asset }: { asset: Asset }) {
  return (
    <article className="overflow-hidden rounded-lg border border-line bg-white shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
      <div className="relative h-36 overflow-hidden bg-surface">
        <Image src={asset.image} alt={`رسم معماري لأصل ${asset.titleAr}`} fill className="object-cover grayscale-[10%] sepia-[8%]" sizes="25vw" />
        <span className="absolute right-3 top-3 rounded bg-[#A7815E] px-3 py-1 text-[11px] font-extrabold text-white">{asset.assetTypeAr}</span>
      </div>
      <div className="p-4 text-right">
        <h3 className="font-display text-lg font-extrabold leading-7 text-[#1D1916]">{asset.titleAr}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs font-bold text-muted"><MapPin className="h-3.5 w-3.5 text-[#A7815E]" />{asset.cityAr}</p>
        <p className="mt-3 text-xs font-bold text-muted">{asset.districtAr}</p>
        <div className="mt-2 flex items-center justify-between text-xs font-bold text-muted">
          <span>المساحة</span>
          <span className="text-[#1D1916]">{formatArea(asset.areaSqm)}</span>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <InterestActionButton
            entityType="asset"
            entityId={asset.id}
            slug={asset.slug}
            title={asset.titleAr}
            className="grid h-9 w-9 place-items-center rounded-md border border-line text-[#A7815E]"
            icon="heart"
            iconClassName="h-4 w-4"
            activeIconClassName="h-4 w-4 fill-current"
            activeLabel=""
            inactiveLabel=""
            ariaLabel="إضافة إلى الاهتمام"
          />
          <Link href={`/assets/${asset.slug}`} className="inline-flex h-9 flex-1 items-center justify-center rounded-md border border-[#A7815E]/45 text-xs font-extrabold text-[#8F6B4C] transition hover:bg-[#A7815E] hover:text-white">عرض التفاصيل</Link>
        </div>
      </div>
    </article>
  );
}

export default async function AssetsPage({ searchParams }: { searchParams?: Promise<ListingSearchParams> }) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const q = firstParam(resolvedSearchParams, "q").trim();
  const status = firstParam(resolvedSearchParams, "status").trim();
  const type = firstParam(resolvedSearchParams, "type").trim();
  const city = firstParam(resolvedSearchParams, "city").trim();
  const chip = firstParam(resolvedSearchParams, "chip").trim();
  const requestedPage = Number(firstParam(resolvedSearchParams, "page") || "1");
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;
  const assetsResult = await getAssets();
  const allAssets = assetsResult.data;
  const filteredAssets = allAssets.filter((asset) => matchesAsset(asset, { q, status, type, city, chip }));
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleAssets = filteredAssets.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const activeParams = { q, status, type, city, chip };
  const stats = [
    { label: "إجمالي الأصول", value: String(allAssets.length), sub: "أصل عقاري", icon: Building2 },
    { label: "الأصول السكنية", value: String(allAssets.filter((asset) => normalized(asset.assetTypeAr + " " + asset.usageTypeAr).includes("سكن")).length), sub: "أصل عقاري", icon: Home },
    { label: "الأصول التجارية", value: String(allAssets.filter((asset) => normalized(asset.assetTypeAr + " " + asset.usageTypeAr).includes("تجار")).length), sub: "أصل عقاري", icon: Store },
    { label: "الأصول الصناعية", value: String(allAssets.filter((asset) => normalized(asset.assetTypeAr + " " + asset.usageTypeAr).includes("صناع")).length), sub: "أصل عقاري", icon: Factory },
  ];

  return (
    <>
      <section className="section-compact">
        <div className="container-page">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[390px] overflow-hidden">
              <Image src="/images/hero-full-cover.png" alt="مبنى عقاري حديث" fill priority className="object-contain object-left-bottom" sizes="52vw" />
            </div>
            <div className="text-right">
              <p className="mb-3 text-sm font-extrabold text-[#A7815E]">الأصول العقارية</p>
              <h1 className="font-display text-[clamp(2.1rem,4.1vw,4.2rem)] font-black leading-[1.35] text-[#1D1916]">
                استعرض الأصول العقارية الجاهزة للدراسة والتطوير والتحويل إلى مشاريع استثمارية ومساهمات عقارية منظمة.
              </h1>
              <p className="mt-5 max-w-xl text-base font-bold leading-9 text-muted">اكتشف مجموعة متنوعة من الأصول العقارية في مختلف مدن المملكة وتعرف على الفرص المتاحة وإمكانات التطوير والاستثمار.</p>
            </div>
          </div>

          <form action="/assets" className="mt-5 rounded-lg border border-line bg-white/82 p-4 shadow-[0_12px_28px_rgb(24_23_21/0.045)]" aria-label="تصفية الأصول">
            <div className="grid gap-3 lg:grid-cols-[1.4fr_repeat(3,1fr)_120px]">
              <label className="relative min-w-0">
                <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input name="q" defaultValue={q} className="h-12 w-full rounded-md border border-line bg-white pr-11 pl-4 text-xs font-extrabold outline-none focus:border-[#A7815E]" placeholder="ابحث عن أصل" />
              </label>
              <SelectFilter label="حالة الأصل" name="status" value={status} options={uniqueValues(allAssets.map((asset) => asset.statusAr))} />
              <SelectFilter label="نوع الأصل" name="type" value={type} options={uniqueValues(allAssets.flatMap((asset) => [asset.assetTypeAr, asset.usageTypeAr]))} />
              <SelectFilter label="المدينة" name="city" value={city} options={uniqueValues(allAssets.map((asset) => asset.cityAr))} />
              <button type="submit" className="h-12 rounded-md bg-[#A7815E] text-sm font-extrabold text-white">بحث</button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {chips.map((item) => {
                const active = chip === item;
                return <Link key={item} href={listingHref("/assets", { ...activeParams, chip: active ? undefined : item, page: undefined })} className={`rounded-md border px-4 py-2 text-xs font-extrabold ${active ? "border-[#A7815E] bg-[#F6EDE4] text-[#8F6B4C]" : "border-line bg-white text-muted"}`}>{item}</Link>;
              })}
            </div>
          </form>
          {assetsResult.error ? <p className="mt-3 rounded-lg border border-[#F0D8B8] bg-[#fff7ec] px-4 py-3 text-right text-xs font-extrabold text-[#8F6B4C]">تعذر تحميل الأصول الحية من Supabase، وتم عرض بيانات احتياطية.</p> : null}

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <article key={stat.label} className="grid grid-cols-[1fr_58px] items-center gap-4 rounded-lg border border-line bg-white/72 p-5">
                  <div>
                    <h2 className="text-sm font-extrabold text-[#1D1916]">{stat.label}</h2>
                    <p className="mt-2 font-display text-3xl font-black text-[#A7815E]">{stat.value}</p>
                    <p className="mt-1 text-xs font-bold text-muted">{stat.sub}</p>
                  </div>
                  <Icon className="h-11 w-11 stroke-[1.5] text-[#A7815E]" />
                </article>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            <Link href="/assets" className="inline-flex h-10 items-center rounded-md border border-line bg-white px-4 text-xs font-extrabold text-navy">عرض جميع الأصول</Link>
            <h2 className="font-display text-3xl font-extrabold text-[#1D1916] gold-divider">الأصول العقارية</h2>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {visibleAssets.length === 0
              ? <p className="rounded-lg border border-line bg-white/72 p-6 text-center text-sm font-extrabold text-muted md:col-span-2 lg:col-span-4">لا توجد أصول مطابقة للفلاتر الحالية.</p>
              : visibleAssets.map((asset) => <AssetListingCard key={asset.id} asset={asset} />)}
          </div>

          <nav className="mt-7 flex flex-wrap items-center justify-center gap-2 px-2" aria-label="الصفحات">
            <Link href={listingHref("/assets", { ...activeParams, page: Math.max(1, currentPage - 1) })} className="h-10 rounded-md border border-line bg-white px-3 py-3 text-xs font-extrabold text-navy sm:px-4">السابق</Link>
            {Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 5).map((item) => (
              <Link key={item} href={listingHref("/assets", { ...activeParams, page: item })} className={`h-10 rounded-md border px-3 py-3 text-xs font-extrabold sm:px-4 ${item === currentPage ? "border-[#1D1916] bg-[#111820] text-white" : "border-line bg-white text-navy"}`}>{item}</Link>
            ))}
            <Link href={listingHref("/assets", { ...activeParams, page: Math.min(totalPages, currentPage + 1) })} className="h-10 rounded-md border border-line bg-white px-3 py-3 text-xs font-extrabold text-navy sm:px-4">التالي</Link>
          </nav>

          <section className="mt-8">
            <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">لماذا هذا الأصل؟</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {why.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-lg border border-line bg-white/72 p-5 text-center">
                    <Icon className="mx-auto h-10 w-10 stroke-[1.5] text-[#A7815E]" />
                    <h3 className="mt-3 font-display text-lg font-extrabold text-[#1D1916]">{item.title}</h3>
                    <p className="mt-2 text-xs font-bold leading-7 text-muted">{item.copy}</p>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
