import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Building2, Calendar, Grid2X2, Mail, Newspaper, Scale, TrendingUp } from "lucide-react";
import type { Article } from "@/lib/types";
import { getPublicNewsArticles } from "@/lib/supabase/mahabah";
import { FinalCTA } from "@/components/sections/final-cta";
import { NewsletterForm } from "@/components/sections/newsletter-form";

export const metadata: Metadata = {
  title: "الأخبار",
  description: "تابع آخر أخبار القطاع العقاري والمساهمات العقارية وتحديثات مهابة.",
};

const categories = [
  { label: "جميع الأخبار", value: "", icon: Grid2X2 },
  { label: "أخبار مهابة", value: "أخبار", icon: Building2 },
  { label: "الأصول العقارية", value: "الأصول", icon: Building2 },
  { label: "المساهمات العقارية", value: "المساهمات", icon: Scale },
  { label: "الأنظمة والتشريعات", value: "التشريعات", icon: Scale },
  { label: "السوق العقاري", value: "السوق", icon: TrendingUp },
];

type ListingSearchParams = Record<string, string | string[] | undefined>;

function firstParam(params: ListingSearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function normalized(value: string | number | undefined) {
  return String(value ?? "").toLocaleLowerCase("ar-SA").replace(/\s+/g, " ").trim();
}

function listingHref(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    query.set(key, String(value));
  }
  const search = query.toString();
  return search ? `/news?${search}` : "/news";
}

function NewsCard({ article, wide = false }: { article: Article; wide?: boolean }) {
  return (
    <article className={`overflow-hidden rounded-lg border border-line bg-white shadow-[0_10px_24px_rgb(29_25_22/0.035)] ${wide ? "lg:grid lg:grid-cols-[1fr_1.1fr]" : ""}`}>
      <div className="relative min-h-[210px] overflow-hidden bg-surface">
        <Image src={article.image} alt="" fill className="object-cover grayscale-[5%] sepia-[6%]" sizes={wide ? "50vw" : "33vw"} />
      </div>
      <div className="p-5 text-right">
        <div className="mb-2 flex items-center gap-2 text-xs font-extrabold text-[#A7815E]"><span className="rounded bg-[#F6EDE4] px-2 py-1">{article.categoryAr}</span><Calendar className="h-3.5 w-3.5" />{article.date}</div>
        <h2 className={`${wide ? "text-3xl" : "text-lg"} font-display font-extrabold leading-[1.55] text-[#1D1916]`}>{article.titleAr}</h2>
        <p className="mt-3 line-clamp-3 text-sm font-bold leading-8 text-muted">{article.excerptAr}</p>
        <Link href={`/news/${article.slug}`} className="mt-4 inline-flex h-10 items-center gap-2 rounded-md border border-[#A7815E]/45 px-5 text-xs font-extrabold text-[#8F6B4C]">قراءة الخبر <ArrowLeft className="h-3.5 w-3.5" /></Link>
      </div>
    </article>
  );
}

export default async function NewsPage({ searchParams }: { searchParams?: Promise<ListingSearchParams> }) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const category = firstParam(resolvedSearchParams, "category").trim();
  const requestedPage = Number(firstParam(resolvedSearchParams, "page") || "1");
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;
  const result = await getPublicNewsArticles();
  const filteredArticles = category
    ? result.data.filter((article) => normalized(`${article.categoryAr} ${article.titleAr} ${article.excerptAr}`).includes(normalized(category)))
    : result.data;
  const visiblePool = filteredArticles.length ? filteredArticles : result.data;
  const featured = visiblePool[0];
  const remaining = visiblePool.filter((article) => article.id !== featured.id);
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(remaining.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleNews = remaining.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <section className="section-compact">
        <div className="container-page">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[390px] overflow-hidden">
              <Image src="/images/hero-full-cover.png" alt="" fill priority className="object-contain object-left-bottom" sizes="52vw" />
            </div>
            <div className="text-right">
              <h1 className="font-display text-[clamp(2.4rem,4.2vw,4.4rem)] font-black leading-[1.35] text-[#1D1916]">الأخبار</h1>
              <p className="mt-4 font-display text-2xl font-extrabold leading-10 text-[#A7815E]">تابع آخر أخبار القطاع العقاري والمساهمات العقارية وتحديثات مهابة</p>
              <p className="mt-4 max-w-xl text-sm font-bold leading-8 text-muted">نقدم تغطية شاملة ومستمرة للأخبار العقارية والتنظيمية والاستثمارية ذات العلاقة بالأصول والمساهمات العقارية.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((item) => {
              const Icon = item.icon;
              const active = category === item.value || (!category && !item.value);
              return <Link key={item.label} href={listingHref({ category: item.value })} className={`inline-flex h-14 items-center justify-center gap-2 rounded-md border px-4 text-xs font-extrabold ${active ? "border-[#A7815E] bg-[#F6EDE4] text-[#8F6B4C]" : "border-line bg-white text-[#1D1916]"}`}><Icon className="h-4 w-4 text-[#A7815E]" />{item.label}</Link>;
            })}
          </div>
          {result.error ? <p className="mt-3 rounded-lg border border-[#F0D8B8] bg-[#fff7ec] px-4 py-3 text-right text-xs font-extrabold text-[#8F6B4C]">تعذر تحميل الأخبار الحية من Supabase، وتم عرض بيانات احتياطية.</p> : null}

          <section className="mt-8">
            <NewsCard article={featured} wide />
          </section>

          <section className="mt-8">
            <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">الأخبار</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visibleNews.length === 0
                ? <p className="rounded-lg border border-line bg-white/72 p-6 text-center text-sm font-extrabold text-muted md:col-span-2 lg:col-span-3">لا توجد أخبار مطابقة لهذا التصنيف.</p>
                : visibleNews.map((article) => <NewsCard key={article.id} article={article} />)}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">أخبار مميزة</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {visiblePool.slice(0, 3).map((article) => <NewsCard key={`featured-${article.id}`} article={article} />)}
            </div>
          </section>

          <section className="mt-8 rounded-lg border border-line bg-[#F6F4F1] p-6">
            <div className="grid items-center gap-4 md:grid-cols-[100px_1fr_220px_120px]">
              <Mail className="mx-auto h-16 w-16 text-[#A7815E]" />
              <div className="text-right"><h2 className="font-display text-2xl font-extrabold text-[#1D1916]">اشترك في النشرة الإخبارية</h2><p className="mt-2 text-sm font-bold text-muted">اشترك ليصلك كل جديد من الأخبار والتحديثات العقارية مباشرة إلى بريدك.</p></div>
              <NewsletterForm />
            </div>
          </section>

          <nav className="mt-7 flex flex-wrap items-center justify-center gap-2 px-2" aria-label="الصفحات">
            <Link href={listingHref({ category, page: Math.max(1, currentPage - 1) })} className="h-10 rounded-md border border-line bg-white px-3 py-3 text-xs font-extrabold text-navy sm:px-4">السابق</Link>
            {Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 5).map((item) => <Link key={item} href={listingHref({ category, page: item })} className={`h-10 rounded-md border px-3 py-3 text-xs font-extrabold sm:px-4 ${item === currentPage ? "border-[#A7815E] bg-[#F6EDE4] text-[#8F6B4C]" : "border-line bg-white text-navy"}`}>{item}</Link>)}
            <Link href={listingHref({ category, page: Math.min(totalPages, currentPage + 1) })} className="h-10 rounded-md border border-line bg-white px-3 py-3 text-xs font-extrabold text-navy sm:px-4">التالي</Link>
          </nav>

          <section className="mt-8">
            <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">المركز الإعلامي</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Link href="/news" className="grid grid-cols-[1fr_80px] items-center rounded-lg border border-line bg-white/72 p-5 text-right"><div><h3 className="font-display text-xl font-extrabold text-[#1D1916]">الأخبار</h3><p className="mt-2 text-sm font-bold text-muted">آخر الأخبار والتقارير</p></div><Newspaper className="h-12 w-12 text-[#A7815E]" /></Link>
              <Link href="/blog" className="grid grid-cols-[1fr_80px] items-center rounded-lg border border-line bg-white/72 p-5 text-right"><div><h3 className="font-display text-xl font-extrabold text-[#1D1916]">المدونة</h3><p className="mt-2 text-sm font-bold text-muted">مقالات وتحليلات متخصصة</p></div><Newspaper className="h-12 w-12 text-[#A7815E]" /></Link>
            </div>
          </section>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
