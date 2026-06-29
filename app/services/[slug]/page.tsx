import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, CheckCircle2, FileText, Star, Users } from "lucide-react";
import { getServices } from "@/lib/supabase/mahabah";
import { FinalCTA } from "@/components/sections/final-cta";

export async function generateStaticParams() {
  const servicesResult = await getServices();
  return servicesResult.data.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const servicesResult = await getServices();
  const service = servicesResult.data.find((item) => item.slug === slug);
  return { title: service?.titleAr ?? "خدمة عقارية", description: service?.descriptionAr };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const servicesResult = await getServices();
  const service = servicesResult.data.find((item) => item.slug === slug);
  if (!service) notFound();
  const Icon = service.icon;

  return (
    <>
      <section className="section-compact">
        <div className="container-page">
          <nav className="mb-5 text-xs font-bold text-muted"><Link href="/">الرئيسية</Link><span className="mx-2 text-[#A7815E]">›</span><Link href="/services">الخدمات العقارية</Link><span className="mx-2 text-[#A7815E]">›</span>تفاصيل الخدمة</nav>
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[400px] overflow-hidden">
              <Image src="/images/hero-full-cover.png" alt="" fill priority className="object-contain object-left-bottom" sizes="52vw" />
            </div>
            <div className="text-right">
              <h1 className="font-display text-[clamp(2.2rem,4.1vw,4.2rem)] font-black leading-[1.35] text-[#1D1916]">{service.titleAr}</h1>
              <p className="mt-4 max-w-xl text-lg font-bold leading-9 text-muted">{service.descriptionAr}</p>
              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[["مدة التنفيذ", service.durationAr], ["نوع الخدمة", "استشارية"], ["مستوى الخدمة", service.levelAr], ["مخرجات الخدمة", service.outputsAr]].map(([label, value]) => <article key={label} className="rounded-lg border border-line bg-white/72 p-4 text-center"><Icon className="mx-auto h-7 w-7 text-[#A7815E]" /><h2 className="mt-2 text-xs font-extrabold text-muted">{label}</h2><p className="mt-1 text-sm font-black text-[#1D1916]">{value}</p></article>)}
              </div>
              <div className="mt-5 flex flex-wrap gap-3"><Link href="/request-study" className="inline-flex h-12 items-center gap-2 rounded-md bg-[#A7815E] px-7 text-sm font-extrabold text-white">طلب خدمة عقارية</Link><Link href="/contact" className="inline-flex h-12 items-center rounded-md border border-[#A7815E]/45 bg-white px-7 text-sm font-extrabold text-[#8F6B4C]">تواصل معنا</Link></div>
            </div>
          </div>

          <section className="mt-8 grid items-center gap-6 rounded-lg border border-line bg-white/72 p-5 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="relative h-44 overflow-hidden rounded-md bg-surface"><Image src="/images/contribution-request-hero-sketch.png" alt="" fill className="object-contain" sizes="35vw" /></div>
            <div className="text-right"><h2 className="font-display text-2xl font-extrabold text-[#1D1916]">عن الخدمة</h2><p className="mt-3 text-sm font-bold leading-9 text-muted">تقدم هذه الخدمة تحليلاً مهنياً متكاملاً للأصل أو المشروع العقاري وتساعد المالك أو المستثمر على فهم الفرص والتحديات واتخاذ قرارات استثمارية دقيقة.</p></div>
          </section>

          <section className="mt-8">
            <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">ماذا تشمل الخدمة</h2>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              {["تحليل الأصل العقاري", "دراسة الموقع", "دراسة السوق", "تحليل المخاطر", "الفرص الاستثمارية", "التوصيات النهائية"].map((title) => <article key={title} className="rounded-lg border border-line bg-white/72 p-5 text-center"><CheckCircle2 className="mx-auto h-9 w-9 text-[#A7815E]" /><h3 className="mt-3 text-sm font-extrabold text-[#1D1916]">{title}</h3><p className="mt-2 text-xs font-bold leading-6 text-muted">تحليل مهني موثق ضمن نطاق الخدمة.</p></article>)}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">مخرجات الخدمة</h2>
            <div className="grid gap-4 md:grid-cols-4">
              {["ملف تسليم نهائي", "توصيات تطويرية", "مؤشرات وتحليلات", "تقرير احترافي"].map((title) => <article key={title} className="rounded-lg border border-line bg-white/72 p-5 text-center"><FileText className="mx-auto h-9 w-9 text-[#A7815E]" /><h3 className="mt-3 text-sm font-extrabold text-[#1D1916]">{title}</h3></article>)}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">الفئات المستفيدة</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {["ملاك الأصول العقارية", "المستثمرون", "الشركات العقارية"].map((title) => <article key={title} className="rounded-lg border border-line bg-white/72 p-5 text-center"><Users className="mx-auto h-10 w-10 text-[#A7815E]" /><h3 className="mt-3 font-display text-lg font-extrabold text-[#1D1916]">{title}</h3></article>)}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">مزودو الخدمة</h2>
            <div className="grid gap-4 md:grid-cols-4">
              {["شركة رؤى العقارية", "مكتب واثق للاستشارات", "شركة أبعاد للاستشارات", "مكتب البناء المتكامل"].map((provider, index) => <article key={provider} className="rounded-lg border border-line bg-white/72 p-5 text-center"><Building2 className="mx-auto h-10 w-10 text-[#A7815E]" /><h3 className="mt-3 font-display text-lg font-extrabold text-[#1D1916]">{provider}</h3><p className="mt-2 text-sm font-black text-[#1D1916]"><Star className="inline h-4 w-4 fill-[#A7815E] text-[#A7815E]" /> {(4.5 + index / 10).toFixed(1)}</p><Link href={`/services/${service.slug}?provider=${encodeURIComponent(provider)}`} className="mt-3 inline-flex h-9 items-center rounded-md border border-[#A7815E]/45 px-5 text-xs font-extrabold text-[#8F6B4C]">عرض الملف</Link></article>)}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">خدمات ذات صلة</h2>
            <div className="grid gap-4 md:grid-cols-4">
              {servicesResult.data.filter((item) => item.slug !== service.slug).slice(0, 4).map((item) => {
                const RelatedIcon = item.icon;
                return <Link key={item.id} href={`/services/${item.slug}`} className="rounded-lg border border-line bg-white/72 p-5 text-center"><RelatedIcon className="mx-auto h-9 w-9 text-[#A7815E]" /><h3 className="mt-3 text-sm font-extrabold text-[#1D1916]">{item.titleAr}</h3><span className="mt-3 inline-flex text-xs font-extrabold text-[#8F6B4C]">عرض التفاصيل <ArrowLeft className="h-3.5 w-3.5" /></span></Link>;
              })}
            </div>
          </section>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
