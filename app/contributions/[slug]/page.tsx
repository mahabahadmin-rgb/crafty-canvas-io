import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Banknote, Building2, Calendar, ExternalLink, FileSearch, MapPin, ShieldCheck, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getContributionBySlug, getContributions, getServices } from "@/lib/supabase/mahabah";
import type { Contribution } from "@/lib/types";
import { FinalCTA } from "@/components/sections/final-cta";
import { InterestActionButton } from "@/components/dashboard/dashboard-actions";

export async function generateStaticParams() {
  const result = await getContributions();
  return result.data.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: contribution } = await getContributionBySlug(slug);
  return { title: contribution?.titleAr ?? "مساهمة عقارية", description: contribution?.excerptAr };
}

function InfoCard({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <article className="rounded-lg border border-line bg-white/72 p-5 text-center">
      <Icon className="mx-auto h-9 w-9 text-[#A7815E]" />
      <h3 className="mt-2 text-xs font-extrabold text-muted">{label}</h3>
      <p className="mt-2 font-display text-lg font-black text-[#1D1916]">{value}</p>
    </article>
  );
}

function SimilarCard({ item, index }: { item: Contribution; index: number }) {
  return (
    <article className="overflow-hidden rounded-lg border border-line bg-white">
      <div className="relative h-32 overflow-hidden bg-surface">
        <Image src={item.image} alt="" fill className="object-cover grayscale-[8%] sepia-[8%]" sizes="25vw" />
        <span className="absolute right-3 top-3 rounded bg-white/90 px-2 py-1 text-[10px] font-extrabold text-[#1D1916]">{index % 2 ? "سكنية" : "تجارية"}</span>
        <span className="absolute bottom-3 right-3 rounded bg-[#0F5F4A] px-2 py-1 text-[10px] font-extrabold text-white">متاحة للاستثمار</span>
      </div>
      <div className="p-4 text-right">
        <h3 className="font-display text-base font-extrabold text-[#1D1916]">{item.titleAr}</h3>
        <p className="mt-2 text-xs font-bold text-muted">الحد الأدنى للاستثمار</p>
        <p className="font-display text-lg font-black text-[#A7815E]">{index % 2 ? "75,000" : "50,000"}</p>
        <Link href={`/contributions/${item.slug}`} className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-md border border-[#A7815E]/45 text-xs font-extrabold text-[#8F6B4C]">عرض التفاصيل</Link>
      </div>
    </article>
  );
}

export default async function ContributionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: contribution } = await getContributionBySlug(slug);
  if (!contribution) notFound();
  const [relatedResult, servicesResult] = await Promise.all([getContributions(), getServices()]);
  const related = relatedResult.data.filter((item) => item.slug !== contribution.slug).slice(0, 4);
  const relatedServices = servicesResult.data.slice(0, 6);
  const title = contribution.slug === "almurooj-office" ? "مساهمة مجمع أعمال الرياض" : contribution.titleAr;

  return (
    <>
      <section className="section-compact">
        <div className="container-page">
          <nav className="mb-5 text-xs font-bold text-muted">
            <Link href="/">الرئيسية</Link><span className="mx-2 text-[#A7815E]">›</span><Link href="/contributions">المساهمات العقارية</Link><span className="mx-2 text-[#A7815E]">›</span>تفاصيل المساهمة
          </nav>
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="relative h-[350px] overflow-hidden rounded-lg bg-surface">
                <Image src={contribution.image} alt="" fill priority className="object-cover grayscale-[5%] sepia-[6%]" sizes="52vw" />
              </div>
              <div className="mt-3 grid grid-cols-4 gap-3">
                {["/images/asset-commercial-complex.png", "/images/asset-tower.png", "/images/about-lobby.png", "/images/hero-completed.png"].map((image) => (
                  <div key={image} className="relative h-20 overflow-hidden rounded-md border border-line bg-surface">
                    <Image src={image} alt="" fill className="object-cover grayscale-[8%] sepia-[8%]" sizes="12vw" />
                  </div>
                ))}
              </div>
            </div>
            <div className="text-right">
              <span className="rounded-md bg-[#F6EDE4] px-3 py-2 text-xs font-extrabold text-[#8F6B4C]">مساهمة تجارية</span>
              <h1 className="mt-5 font-display text-[clamp(2rem,4vw,4rem)] font-black leading-tight text-[#1D1916]">{title}</h1>
              <p className="mt-3 flex items-center gap-2 text-sm font-extrabold text-muted"><MapPin className="h-4 w-4 text-[#A7815E]" />{contribution.cityAr}</p>
              <p className="mt-5 text-sm font-bold text-muted">الجهة الطارحة</p>
              <p className="mt-1 font-display text-xl font-extrabold text-[#1D1916]">شركة الطرح العقاري</p>
              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                <InfoCard label="نوع المساهمة" value="تجارية" icon={Building2} />
                <InfoCard label="المدينة" value={contribution.cityAr} icon={MapPin} />
                <InfoCard label="حالة المساهمة" value="متاحة للاستثمار" icon={BadgeCheck} />
                <InfoCard label="الحد الأدنى للاستثمار" value="50,000 ريال" icon={Banknote} />
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/contributions" className="inline-flex h-12 items-center gap-2 rounded-md bg-[#A7815E] px-7 text-sm font-extrabold text-white">الانتقال إلى جهة الطرح <ExternalLink className="h-4 w-4" /></Link>
                <InterestActionButton
                  entityType="contribution"
                  entityId={contribution.id}
                  slug={contribution.slug}
                  title={contribution.titleAr}
                  className="inline-flex h-12 items-center gap-2 rounded-md border border-[#A7815E]/45 bg-white px-7 text-sm font-extrabold text-[#8F6B4C]"
                  icon="heart"
                  iconClassName="h-4 w-4"
                  activeIconClassName="h-4 w-4 fill-current"
                  activeLabel="إزالة الاهتمام"
                  inactiveLabel="الاهتمام بالمساهمة"
                />
              </div>
            </div>
          </div>

          <section className="mt-8 grid items-center gap-6 rounded-lg border border-line bg-white/72 p-5 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="relative h-44 overflow-hidden rounded-md bg-surface">
              <Image src="/images/contribution-request-hero-sketch.png" alt="" fill className="object-contain" sizes="35vw" />
            </div>
            <div className="text-right">
              <h2 className="font-display text-2xl font-extrabold text-[#1D1916]">نبذة عن المساهمة</h2>
              <p className="mt-3 text-sm font-bold leading-9 text-muted">{contribution.excerptAr} تهدف المساهمة إلى تطوير وتشغيل مجمع أعمال حديث في أحد المواقع الحيوية بمدينة الرياض، مع إدارة احترافية وتقارير دورية وحوكمة واضحة.</p>
            </div>
          </section>

          <section className="mt-7">
            <h2 className="mb-5 text-right font-display text-2xl font-extrabold text-[#1D1916]">معلومات المساهمة</h2>
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
              <InfoCard label="نوع المساهمة" value="تجارية" icon={Building2} />
              <InfoCard label="المدينة" value={contribution.cityAr} icon={MapPin} />
              <InfoCard label="حالة المساهمة" value="متاحة للاستثمار" icon={BadgeCheck} />
              <InfoCard label="الحد الأدنى للاستثمار" value="50,000 ريال" icon={Banknote} />
              <InfoCard label="الجهة الطارحة" value="شركة الطرح العقاري" icon={Building2} />
              <InfoCard label="مدة الاستثمار" value="24 شهراً" icon={Calendar} />
            </div>
          </section>

          <section className="mt-7 grid gap-5 lg:grid-cols-2">
            <div className="rounded-lg border border-line bg-white/72 p-5">
              <h2 className="mb-4 text-right font-display text-2xl font-extrabold text-[#1D1916]">موقع المشروع</h2>
              <div className="grid gap-4 lg:grid-cols-[170px_1fr]">
                <dl className="grid gap-3 text-sm font-bold text-muted">
                  <div className="border-b border-line pb-2">المدينة <span className="float-left text-[#1D1916]">{contribution.cityAr}</span></div>
                  <div className="border-b border-line pb-2">الحي <span className="float-left text-[#1D1916]">الملك عبدالله المالي</span></div>
                  <Link href="/contact" className="text-[#8F6B4C]">عرض على الخريطة</Link>
                </dl>
                <div className="relative min-h-[180px] overflow-hidden rounded-md bg-[#D9D1C7]">
                  <Image src="/images/knowledge-library.png" alt="" fill className="object-cover opacity-65 grayscale-[8%] sepia-[8%]" sizes="35vw" />
                  <MapPin className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 fill-[#A7815E] text-[#A7815E]" />
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-line bg-white/72 p-5">
              <h2 className="mb-4 text-right font-display text-2xl font-extrabold text-[#1D1916]">مؤشرات المشروع</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <InfoCard label="فرصة استثمارية" value="8% - 10%" icon={TrendingUp} />
                <InfoCard label="مشروع منظم" value="طرح مرخص" icon={ShieldCheck} />
                <InfoCard label="حوكمة وشفافية" value="تقارير دورية" icon={FileSearch} />
              </div>
            </div>
          </section>

          <section className="mt-7 grid gap-5 lg:grid-cols-2">
            <div className="rounded-lg border border-line bg-white/72 p-5 text-right">
              <h2 className="font-display text-2xl font-extrabold text-[#1D1916]">الجهة الطارحة</h2>
              <Building2 className="mt-5 h-20 w-20 text-[#A7815E]" />
              <h3 className="mt-3 font-display text-xl font-extrabold text-[#1D1916]">شركة الطرح العقاري</h3>
              <p className="mt-2 text-sm font-bold leading-8 text-muted">شركة متخصصة في إدارة وطرح المساهمات العقارية وفق الأنظمة والضوابط المعتمدة.</p>
            </div>
            <div className="rounded-lg border border-line bg-white/72 p-5 text-right">
              <h2 className="font-display text-2xl font-extrabold text-[#1D1916]">الاستثمار متاح عبر الجهة المرخصة</h2>
              <p className="mt-3 text-sm font-bold leading-8 text-muted">للاطلاع على شروط الاستثمار والتفاصيل الكاملة يرجى زيارة موقع الجهة الطارحة.</p>
              <Link href="/contributions" className="mt-5 inline-flex h-12 items-center gap-2 rounded-md bg-[#A7815E] px-7 text-sm font-extrabold text-white">الانتقال إلى جهة الطرح <ExternalLink className="h-4 w-4" /></Link>
            </div>
          </section>

          <section className="mt-7">
            <h2 className="mb-5 text-right font-display text-2xl font-extrabold text-[#1D1916]">خدمات مرتبطة بالمساهمة</h2>
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
              {relatedServices.map((service) => {
                const Icon = service.icon;
                return (
                  <article key={service.id} className="rounded-lg border border-line bg-white/72 p-4 text-center">
                    <Icon className="mx-auto h-8 w-8 text-[#A7815E]" />
                    <h3 className="mt-2 text-xs font-extrabold leading-6 text-[#1D1916]">{service.titleAr}</h3>
                  </article>
                );
              })}
            </div>
            <div className="mt-5 text-center">
              <Link href="/request-study" className="inline-flex h-11 items-center rounded-md border border-[#A7815E]/45 px-7 text-sm font-extrabold text-[#8F6B4C]">طلب خدمة عقارية +</Link>
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <Link href="/contributions" className="inline-flex h-10 items-center rounded-md border border-line bg-white px-4 text-xs font-extrabold text-navy">عرض جميع المساهمات</Link>
              <h2 className="font-display text-3xl font-extrabold text-[#1D1916] gold-divider">مساهمات مشابهة</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              {related.map((item, index) => <SimilarCard key={item.id} item={item} index={index} />)}
            </div>
          </section>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
