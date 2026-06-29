import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Building2, Calendar, FileText, Newspaper, Settings, TrendingUp } from "lucide-react";
import type { KnowledgeResource } from "@/lib/types";
import { getPublicKnowledgeResources } from "@/lib/supabase/mahabah";
import { FinalCTA } from "@/components/sections/final-cta";

export const metadata: Metadata = {
  title: "المدونة",
  description: "مقالات وتحليلات متخصصة في القطاع العقاري والمساهمات العقارية.",
};

const categories = [
  { label: "جميع المقالات", value: "", icon: FileText },
  { label: "المساهمات العقارية", value: "المساهمات", icon: TrendingUp },
  { label: "الأصول العقارية", value: "الأصول", icon: Building2 },
  { label: "التنظيمات والتشريعات", value: "التنظيمات", icon: Settings },
  { label: "الاستثمار العقاري", value: "الاستثمار", icon: TrendingUp },
  { label: "إدارة الأصول", value: "إدارة الأصول", icon: Building2 },
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
  return search ? `/blog?${search}` : "/blog";
}

function BlogCard({ item }: { item: KnowledgeResource }) {
  return (
    <article className="card-shell soft-lift overflow-hidden rounded-lg bg-white">
      <Link href={`/blog/${item.slug}`} className="block">
        <div className="relative h-52 bg-[#f6f1eb]">
          <Image src={item.image} alt="" fill className="object-cover grayscale-[18%] sepia-[12%]" sizes="(min-width: 1024px) 33vw, 100vw" />
          <span className="absolute right-4 top-4 rounded-md bg-[#fff7ee] px-3 py-1 text-xs font-extrabold text-[#A7815E]">{item.tabAr}</span>
        </div>
        <div className="p-5 text-right">
          <div className="flex justify-end gap-2 text-xs font-bold text-muted">
            <span>{item.date}</span>
            <Calendar className="h-4 w-4 text-[#A7815E]" />
          </div>
          <h2 className="mt-3 min-h-[68px] font-display text-xl font-extrabold leading-8 text-[#1D1916]">{item.titleAr}</h2>
          <p className="mt-2 line-clamp-3 text-sm font-bold leading-7 text-muted">{item.excerptAr}</p>
          <span className="mt-5 inline-flex h-10 items-center justify-center rounded-md border border-[#A7815E]/45 px-6 text-xs font-extrabold text-[#8F6B4C]">
            قراءة المقال
          </span>
        </div>
      </Link>
    </article>
  );
}

function MediaLink({ title, copy, href, icon: Icon }: { title: string; copy: string; href: string; icon: typeof Newspaper }) {
  return (
    <Link href={href} className="grid min-h-[150px] grid-cols-[1fr_90px] items-center gap-5 rounded-lg border border-line bg-white/72 p-6 text-right transition hover:border-[#A7815E]/55">
      <div>
        <h2 className="font-display text-2xl font-extrabold text-navy">{title}</h2>
        <p className="mt-2 text-sm font-bold leading-7 text-muted">{copy}</p>
        <span className="mt-4 inline-flex h-10 items-center gap-2 rounded-md border border-[#A7815E]/45 px-5 text-xs font-extrabold text-[#8F6B4C]">
          عرض {title}
          <ArrowLeft className="h-4 w-4" />
        </span>
      </div>
      <Icon className="h-16 w-16 stroke-[1.25] text-[#A7815E]" />
    </Link>
  );
}

export default async function BlogPage({ searchParams }: { searchParams?: Promise<ListingSearchParams> }) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const category = firstParam(resolvedSearchParams, "category").trim();
  const requestedPage = Number(firstParam(resolvedSearchParams, "page") || "1");
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;
  const result = await getPublicKnowledgeResources();
  const filteredItems = category
    ? result.data.filter((item) => normalized(`${item.tabAr} ${item.categoryAr} ${item.titleAr} ${item.excerptAr}`).includes(normalized(category)))
    : result.data;
  const pageSize = 9;
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <section className="section-compact">
        <div className="container-page">
          <div className="grid min-h-[340px] items-center overflow-hidden rounded-lg border border-line bg-white/66 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="relative min-h-[300px] lg:min-h-[340px]">
              <Image src="/images/knowledge-library.png" alt="" fill priority className="object-cover grayscale-[18%] sepia-[12%]" sizes="55vw" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#F6F4F1]/72" />
            </div>
            <header className="p-8 text-right lg:p-12">
              <nav className="mb-5 text-xs font-bold text-muted">
                <Link href="/" className="hover:text-gold">الرئيسية</Link>
                <span className="mx-2 text-gold">›</span>
                <span>المدونة</span>
              </nav>
              <h1 className="font-display text-5xl font-extrabold leading-tight text-[#1D1916]">المدونة</h1>
              <p className="mt-5 max-w-xl text-lg font-extrabold leading-9 text-[#A7815E]">
                مقالات وتحليلات متخصصة في القطاع العقاري والمساهمات العقارية.
              </p>
              <p className="mt-3 max-w-xl text-base font-bold leading-8 text-muted">
                نقدم محتوى معرفي يعزز فهمك للسوق العقاري ويدعم قراراتك الاستثمارية بثقة.
              </p>
            </header>
          </div>
        </div>
      </section>

      <section className="section-compact pt-0">
        <div className="container-page">
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => {
              const Icon = category.icon;
              const active = firstParam(resolvedSearchParams, "category").trim() === category.value || (!firstParam(resolvedSearchParams, "category").trim() && !category.value);
              return (
                <Link
                  key={category.label}
                  href={listingHref({ category: category.value })}
                  className={`flex min-h-16 items-center justify-center gap-3 rounded-md border px-4 text-sm font-extrabold ${
                    active ? "border-[#A7815E] bg-white text-[#8F6B4C]" : "border-line bg-white/66 text-navy"
                  }`}
                >
                  <Icon className="h-5 w-5 text-[#A7815E]" />
                  {category.label}
                </Link>
              );
            })}
          </div>
          {result.error ? <p className="mt-3 rounded-lg border border-[#F0D8B8] bg-[#fff7ec] px-4 py-3 text-right text-xs font-extrabold text-[#8F6B4C]">تعذر تحميل المقالات الحية من Supabase، وتم عرض بيانات احتياطية.</p> : null}
        </div>
      </section>

      <section className="section-compact pt-0">
        <div className="container-page">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visibleItems.length === 0
              ? <p className="rounded-lg border border-line bg-white/72 p-6 text-center text-sm font-extrabold text-muted md:col-span-2 lg:col-span-3">لا توجد مقالات مطابقة لهذا التصنيف.</p>
              : visibleItems.map((item) => <BlogCard key={item.id} item={item} />)}
          </div>
          <div className="mt-8 flex items-center justify-center gap-2">
            <Link href={listingHref({ category, page: Math.max(1, currentPage - 1) })} className="h-10 min-w-10 rounded-md border border-line bg-white px-3 py-2 text-center text-sm font-extrabold text-muted">السابق</Link>
            {Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 5).map((item) => (
              <Link key={item} href={listingHref({ category, page: item })} className={`h-10 min-w-10 rounded-md border px-3 py-2 text-center text-sm font-extrabold ${item === currentPage ? "border-[#A7815E] bg-[#A7815E] text-white" : "border-line bg-white text-muted"}`}>
                {item}
              </Link>
            ))}
            <Link href={listingHref({ category, page: Math.min(totalPages, currentPage + 1) })} className="h-10 min-w-10 rounded-md border border-line bg-white px-3 py-2 text-center text-sm font-extrabold text-muted">التالي</Link>
          </div>
        </div>
      </section>

      <section className="section-compact pt-0">
        <div className="container-page grid gap-5 lg:grid-cols-2">
          <MediaLink href="/blog" title="المدونة" copy="مقالات وتحليلات متخصصة في القطاع العقاري والمساهمات العقارية." icon={FileText} />
          <MediaLink href="/news" title="الأخبار" copy="تابع أهم الأخبار والتحديثات في القطاع العقاري والمساهمات العقارية." icon={Newspaper} />
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
