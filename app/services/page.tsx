import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, ChevronDown, Handshake, Search, ShieldCheck, Star } from "lucide-react";
import type { ServiceItem } from "@/lib/data/services";
import { getServices } from "@/lib/supabase/mahabah";
import { FinalCTA } from "@/components/sections/final-cta";

export const metadata: Metadata = {
  title: "الخدمات العقارية",
  description: "خدمات عقارية متخصصة لدعم الأصول والمشاريع والمساهمات العقارية.",
};

const reasons = [
  { title: "خبرات متخصصة", copy: "فريق عمل متخصص بخبرات عالية في القطاع العقاري.", icon: Star },
  { title: "حوكمة وامتثال", copy: "جميع خدماتنا وفق أعلى معايير الحوكمة والامتثال.", icon: ShieldCheck },
  { title: "شبكة شركاء متكاملة", copy: "شبكة واسعة من الشركاء المتخصصين لتقديم أفضل الخدمات.", icon: Handshake },
];
const journey = ["اختيار الخدمة", "إدخال البيانات", "مراجعة الطلب", "إسناد الخدمة", "بدء التنفيذ"];
const providers = ["شركة التقييم المتقدم", "مكتب الهندسة الحديثة", "شركة المستشارين القانونية", "شركة التسويق العقاري"];
const serviceTypes = ["استشارة", "دراسة", "تقييم", "هندسية", "تسويق", "تمويل", "قانونية", "توثيق", "تسجيل"];

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

function matchesService(service: ServiceItem, filters: { type: string; level: string }) {
  const haystack = normalized(`${service.titleAr} ${service.descriptionAr} ${service.outputsAr} ${service.levelAr}`);
  return (
    (!filters.type || haystack.includes(normalized(filters.type))) &&
    (!filters.level || service.levelAr === filters.level)
  );
}

function ServiceSelect({ label, name, value, options }: { label: string; name: string; value: string; options: string[] }) {
  return (
    <label className="relative">
      <ChevronDown className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <select name={name} defaultValue={value} className="h-12 w-full appearance-none rounded-md border border-line bg-white px-4 pl-10 text-xs font-extrabold">
        <option>{label}</option>
        <option>الكل</option>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

export default async function ServicesPage({ searchParams }: { searchParams?: Promise<ListingSearchParams> }) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const type = firstParam(resolvedSearchParams, "type").trim();
  const level = firstParam(resolvedSearchParams, "level").trim();
  const servicesResult = await getServices();
  const services = servicesResult.data.filter((service) => matchesService(service, { type, level }));

  return (
    <>
      <section className="section-compact">
        <div className="container-page">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[390px] overflow-hidden">
              <Image src="/images/hero-full-cover.png" alt="" fill priority className="object-contain object-left-bottom" sizes="52vw" />
            </div>
            <div className="text-right">
              <h1 className="font-display text-[clamp(2.4rem,4.2vw,4.4rem)] font-black leading-[1.35] text-[#1D1916]">الخدمات العقارية</h1>
              <p className="mt-4 font-display text-2xl font-extrabold leading-10 text-[#A7815E]">خدمات عقارية متخصصة لدعم الأصول والمشاريع والمساهمات العقارية</p>
              <p className="mt-4 max-w-xl text-sm font-bold leading-8 text-muted">نوفر منظومة متكاملة من الخدمات العقارية والقانونية والهندسية والاستشارية من خلال نخبة من المتخصصين والشركاء.</p>
            </div>
          </div>
          <form action="/services" className="mt-6 grid gap-3 rounded-lg border border-line bg-white/82 p-4 lg:grid-cols-[1fr_1fr_150px]">
            <ServiceSelect label="نوع الخدمة - جميع الأنواع" name="type" value={type} options={serviceTypes} />
            <ServiceSelect label="مستوى الخدمة - جميع المستويات" name="level" value={level} options={uniqueValues(servicesResult.data.map((service) => service.levelAr))} />
            <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#A7815E] text-sm font-extrabold text-white">بحث <Search className="h-4 w-4" /></button>
          </form>
          {servicesResult.error ? <p className="mt-3 rounded-lg border border-[#F0D8B8] bg-[#fff7ec] px-4 py-3 text-right text-xs font-extrabold text-[#8F6B4C]">تعذر تحميل الخدمات الحية من Supabase، وتم عرض بيانات احتياطية.</p> : null}
        </div>
      </section>

      <section className="section-compact">
        <div className="container-page">
          <h2 className="mb-6 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">الخدمات العقارية</h2>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {services.length === 0 ? <p className="rounded-lg border border-line bg-white/72 p-6 text-center text-sm font-extrabold text-muted md:col-span-3 lg:col-span-6">لا توجد خدمات مطابقة للفلاتر الحالية.</p> : services.map((service, index) => {
              const Icon = service.icon;
              return (
                <article key={service.id} className="rounded-lg border border-line bg-white/72 p-5 text-center shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
                  <span className="block text-right font-display text-lg font-black text-[#A7815E]">{String(index + 1).padStart(2, "0")}</span>
                  <Icon className="mx-auto mt-2 h-10 w-10 text-[#A7815E]" />
                  <h3 className="mt-3 font-display text-base font-extrabold leading-7 text-[#1D1916]">{service.titleAr}</h3>
                  <p className="mt-2 min-h-[58px] text-xs font-bold leading-6 text-muted">{service.descriptionAr}</p>
                  <Link href={`/services/${service.slug}`} className="mt-3 inline-flex h-9 items-center justify-center rounded-md border border-[#A7815E]/45 px-4 text-xs font-extrabold text-[#8F6B4C]">عرض التفاصيل</Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-compact">
        <div className="container-page">
          <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">لماذا خدمات مهابة؟</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {reasons.map((item) => {
              const Icon = item.icon;
              return <article key={item.title} className="rounded-lg border border-line bg-white/72 p-5 text-center"><Icon className="mx-auto h-10 w-10 text-[#A7815E]" /><h3 className="mt-3 font-display text-xl font-extrabold text-[#1D1916]">{item.title}</h3><p className="mt-2 text-xs font-bold leading-7 text-muted">{item.copy}</p></article>;
            })}
          </div>
        </div>
      </section>

      <section className="section-compact">
        <div className="container-page">
          <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">خطوات طلب الخدمة</h2>
          <div className="grid gap-3 md:grid-cols-5">
            {journey.map((step, index) => <article key={step} className="rounded-lg border border-line bg-white/72 p-5 text-center"><span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-[#F6EDE4] font-black text-[#8F6B4C]">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-3 text-sm font-extrabold text-[#1D1916]">{step}</h3></article>)}
          </div>
          <div className="relative mt-8 overflow-hidden rounded-lg border border-line bg-[#F6F4F1] p-6">
            <Image src="/images/final-cta-map-building.png" alt="" fill className="object-cover opacity-25 grayscale-[8%] sepia-[8%]" sizes="100vw" />
            <div className="relative z-10 grid items-center gap-5 lg:grid-cols-[1fr_auto]">
              <div className="text-right"><h2 className="font-display text-3xl font-extrabold text-[#1D1916]">تحتاج خدمة عقارية متخصصة؟</h2><p className="mt-2 text-sm font-bold leading-8 text-muted">نحن هنا لدعمك في كل خطوة من رحلتك العقارية.</p></div>
              <Link href="/request-study" className="inline-flex h-12 items-center gap-2 rounded-md bg-[#A7815E] px-7 text-sm font-extrabold text-white">طلب خدمة عقارية <ArrowLeft className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-compact">
        <div className="container-page">
          <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">مزودو الخدمات</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {providers.map((provider, index) => {
              const linkedService = servicesResult.data[index % Math.max(1, servicesResult.data.length)];
              return <article key={provider} className="rounded-lg border border-line bg-white/72 p-5 text-center"><BriefcaseBusiness className="mx-auto h-10 w-10 text-[#A7815E]" /><h3 className="mt-3 font-display text-lg font-extrabold text-[#1D1916]">{provider}</h3><p className="mt-2 text-xs font-bold text-muted">الرياض</p><p className="mt-2 text-sm font-black text-[#1D1916]">★ {(4.6 + index / 10).toFixed(1)}</p><Link href={linkedService ? `/services/${linkedService.slug}` : "/services"} className="mt-3 inline-flex h-9 items-center rounded-md border border-[#A7815E]/45 px-5 text-xs font-extrabold text-[#8F6B4C]">عرض الملف</Link></article>;
            })}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
