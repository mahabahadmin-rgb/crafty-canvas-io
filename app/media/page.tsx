import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpenText, Calendar, FileText, Newspaper, PlayCircle, Radio, Search, TrendingUp } from "lucide-react";
import type { Article } from "@/lib/types";
import { getPublicKnowledgeResources, getPublicNewsArticles } from "@/lib/supabase/mahabah";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "المركز الإعلامي",
  description: "المركز الإعلامي لمنصة مهابة: أخبار، مقالات، تقارير، ومكتبة معرفة عقارية.",
};

const mediaSections = [
  { title: "الأخبار", copy: "تحديثات المنصة والمساهمات والشراكات.", icon: Newspaper, href: "/news" },
  { title: "المدونة", copy: "مقالات معرفية حول التطوير والحوكمة.", icon: BookOpenText, href: "/blog" },
  { title: "التقارير", copy: "تحليلات السوق والإفصاحات الدورية.", icon: FileText, href: "/blog/market-analysis" },
  { title: "المرئيات", copy: "لقاءات ومحتوى تعريفي قادم.", icon: PlayCircle, href: "/media" },
];

function SmallArticle({ article }: { article: Article }) {
  return (
    <Link href={`/news/${article.slug}`} className="grid gap-3 rounded-md border border-line bg-[#fffdfa]/76 p-3 transition hover:border-gold/60 md:grid-cols-[120px_1fr]">
      <div className="relative h-24 overflow-hidden rounded-md bg-surface">
        <Image src={article.image} alt="" fill className="object-cover grayscale-[16%] sepia-[8%]" sizes="120px" />
      </div>
      <div className="min-w-0 text-right">
        <div className="mb-1 flex items-center gap-2 text-[11px] font-extrabold text-[#A7815E]">
          <Calendar className="h-3 w-3" />
          {article.date}
        </div>
        <h3 className="line-clamp-2 font-display text-base font-extrabold leading-7 text-navy">{article.titleAr}</h3>
        <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-muted">{article.excerptAr}</p>
      </div>
    </Link>
  );
}

export default async function MediaPage() {
  const [newsResult, resourcesResult] = await Promise.all([
    getPublicNewsArticles(),
    getPublicKnowledgeResources(),
  ]);
  const featured = newsResult.data.find((article) => article.featured) ?? newsResult.data[0];
  const latest = featured ? newsResult.data.filter((article) => article.id !== featured.id).slice(0, 4) : [];
  const stats = [
    { label: "الأخبار المنشورة", value: String(newsResult.data.length), unit: "خبر", icon: Newspaper },
    { label: "التقارير والتحليلات", value: String(resourcesResult.data.filter((item) => `${item.categoryAr} ${item.tabAr}`.includes("تقرير") || `${item.categoryAr} ${item.tabAr}`.includes("تحليل")).length), unit: "تقرير", icon: FileText },
    { label: "مواد معرفية", value: String(resourcesResult.data.length), unit: "مادة", icon: BookOpenText },
    { label: "تحديثات السوق", value: String(newsResult.data.filter((item) => `${item.categoryAr} ${item.titleAr}`.includes("السوق") || `${item.categoryAr} ${item.titleAr}`.includes("تحديث")).length), unit: "مؤشرات", icon: TrendingUp },
  ];

  return (
    <>
      <section className="border-b border-line/70">
        <div className="container-page">
          <div className="relative min-h-[310px] overflow-hidden">
            <Image src="/images/media-featured.png" alt="" fill priority className="object-cover grayscale-[8%] sepia-[8%]" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-l from-[#F6F4F1]/98 via-[#F6F4F1]/76 to-[#F6F4F1]/12" />
            <div className="relative z-10 flex min-h-[310px] items-center justify-start px-4 py-10 text-right">
              <div className="max-w-2xl">
                <h1 className="font-display text-5xl font-extrabold leading-tight text-[#1D1916] md:text-6xl">المركز الإعلامي</h1>
                <p className="mt-4 max-w-xl text-lg font-bold leading-9 text-muted">
                  نافذة مهابة للأخبار والتحليلات والمعرفة العقارية المرتبطة بالأصول والمساهمات والخدمات.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-compact pt-5">
        <div className="container-page">
          <div className="grid overflow-hidden rounded-lg border border-line bg-white/72 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.label} className="grid min-h-[112px] grid-cols-[1fr_56px] items-center gap-4 border-b border-line px-6 py-5 text-right md:odd:border-l lg:border-b-0 lg:border-l lg:last:border-l-0">
                  <div>
                    <h2 className="text-sm font-extrabold text-navy">{item.label}</h2>
                    <div className="mt-2 font-display text-3xl font-extrabold text-[#A7815E]">{item.value}</div>
                    <p className="mt-1 text-xs font-bold text-muted">{item.unit}</p>
                  </div>
                  <Icon className="h-12 w-12 stroke-[1.45] text-[#1D1916]" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-compact">
        <div className="container-page">
          <SectionHeading compact title="أبرز الأخبار" />
          <div className="grid gap-5 lg:grid-cols-[1.25fr_.95fr]">
            {featured ? <article className="card-shell overflow-hidden rounded-lg">
              <div className="relative min-h-[315px] bg-surface">
                <Image src={featured.image} alt="" fill priority className="object-cover grayscale-[12%] sepia-[8%]" sizes="60vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D1916]/72 via-transparent to-transparent" />
                <div className="absolute bottom-0 right-0 p-6 text-right text-white">
                  <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-white/12 px-3 py-1 text-xs font-extrabold backdrop-blur-sm">
                    <Radio className="h-3.5 w-3.5" />
                    {featured.categoryAr} · {featured.date}
                  </div>
                  <h2 className="max-w-2xl font-display text-3xl font-extrabold leading-[1.45]">{featured.titleAr}</h2>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-white/78">{featured.excerptAr}</p>
                  <Link href={`/news/${featured.slug}`} className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-[#A7815E] px-5 text-xs font-extrabold text-white">
                    اقرأ الخبر
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article> : <p className="rounded-lg border border-line bg-white/72 p-6 text-center text-sm font-extrabold text-muted">لا توجد أخبار منشورة حالياً.</p>}

            <div className="grid gap-3">
              {latest.map((article) => (
                <SmallArticle key={article.id} article={article} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-compact">
        <div className="container-page">
          <SectionHeading compact title="أقسام المركز الإعلامي" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {mediaSections.map((section) => {
              const Icon = section.icon;
              return (
                <Link key={section.title} href={section.href} className="card-shell soft-lift min-h-[170px] rounded-lg p-5 text-center">
                  <Icon className="mx-auto h-12 w-12 stroke-[1.45] text-[#A7815E]" />
                  <h2 className="mt-3 font-display text-xl font-extrabold text-navy">{section.title}</h2>
                  <p className="mx-auto mt-2 max-w-[14rem] text-xs leading-6 text-muted">{section.copy}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-compact">
        <div className="container-page">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <SectionHeading compact title="مكتبة المعرفة" />
            <Link href="/news" className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-white px-5 text-xs font-extrabold text-[#8F6B4C]">
              كل الأخبار
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {resourcesResult.data.slice(0, 4).map((resource) => (
              <Link key={resource.id} href={`/blog/${resource.slug}`} className="card-shell soft-lift overflow-hidden rounded-lg text-center">
                <Image src={resource.image} alt="" width={560} height={340} className="h-36 w-full object-cover grayscale-[16%] sepia-[8%]" sizes="25vw" />
                <div className="p-4">
                  <span className="text-[11px] font-extrabold text-[#A7815E]">{resource.tabAr}</span>
                  <h3 className="mt-2 font-display text-base font-extrabold leading-7 text-navy">{resource.titleAr}</h3>
                  <p className="mt-2 text-xs text-muted">{resource.date}</p>
                </div>
              </Link>
            ))}
            {resourcesResult.data.length === 0 ? <p className="rounded-lg border border-line bg-white/72 p-6 text-center text-sm font-extrabold text-muted md:col-span-2 lg:col-span-4">لا توجد مواد معرفية منشورة حالياً.</p> : null}
          </div>
        </div>
      </section>

      <section className="section-compact">
        <div className="container-page">
          <div className="grid gap-4 rounded-lg border border-line bg-white/66 p-5 md:grid-cols-[1fr_280px] md:items-center">
            <div className="text-right">
              <h2 className="font-display text-2xl font-extrabold text-navy">ابحث في أخبار ومعرفة مهابة</h2>
              <p className="mt-2 text-sm leading-7 text-muted">تابع آخر المستجدات والتقارير المرتبطة بسوق الأصول والمساهمات العقارية.</p>
            </div>
            <Link href="/news" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#A7815E] px-6 text-sm font-extrabold text-white">
              <Search className="h-4 w-4" />
              الانتقال إلى الأخبار
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
