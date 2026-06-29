import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, BriefcaseBusiness, Building2, FileSearch, Handshake, Home, MapPin, Maximize2, MessageSquareText, Ruler, SearchCheck, Store, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getAssetBySlug, getAssets } from "@/lib/supabase/mahabah";
import type { Asset } from "@/lib/types";
import { formatArea } from "@/lib/utils";
import { FinalCTA } from "@/components/sections/final-cta";
import { InterestActionButton } from "@/components/dashboard/dashboard-actions";

export async function generateStaticParams() {
  const result = await getAssets();
  return result.data.map((asset) => ({ slug: asset.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: asset } = await getAssetBySlug(slug);
  return { title: asset?.titleAr ?? "أصل عقاري", description: asset?.excerptAr };
}

const services = [
  { title: "استشارة عقارية أولية", icon: MessageSquareText },
  { title: "دراسة جدوى عقارية", icon: FileSearch },
  { title: "استشارة هندسية", icon: Ruler },
  { title: "تقييم عقاري", icon: SearchCheck },
  { title: "تسويق عقود أو مشروع", icon: BriefcaseBusiness },
  { title: "استشارة قانونية", icon: BadgeCheck },
];

const opportunities = [
  { title: "إمكانية التحويل لمساهمة عقارية", copy: "إمكانية هيكلة الأصل وتحويله إلى مساهمة عقارية منظمة.", icon: Handshake },
  { title: "فرصة استثمار", copy: "إمكانية تحقيق عوائد استثمارية مجزية من خلال التطوير أو البيع.", icon: Store },
  { title: "فرصة تطوير", copy: "إمكانية تطوير الأصل لمشروع سكني متكامل يلبي الطلب.", icon: Target },
];

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <article className="rounded-lg border border-line bg-white/72 p-5 text-center">
      <Icon className="mx-auto h-9 w-9 stroke-[1.5] text-[#A7815E]" />
      <h3 className="mt-2 text-xs font-extrabold text-muted">{label}</h3>
      <p className="mt-2 font-display text-lg font-black text-[#1D1916]">{value}</p>
    </article>
  );
}

function SimilarAsset({ asset }: { asset: Asset }) {
  return (
    <article className="overflow-hidden rounded-lg border border-line bg-white">
      <div className="relative h-28 overflow-hidden bg-surface">
        <Image src={asset.image} alt="" fill className="object-cover grayscale-[10%] sepia-[8%]" sizes="25vw" />
        <span className="absolute right-3 top-3 rounded bg-[#A7815E] px-2 py-1 text-[10px] font-extrabold text-white">{asset.assetTypeAr}</span>
      </div>
      <div className="p-3 text-right">
        <h3 className="font-display text-base font-extrabold text-[#1D1916]">{asset.titleAr}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted"><MapPin className="h-3 w-3 text-[#A7815E]" />{asset.cityAr}</p>
        <p className="mt-2 text-xs font-bold text-muted">المساحة <span className="text-[#1D1916]">{formatArea(asset.areaSqm)}</span></p>
        <Link href={`/assets/${asset.slug}`} className="mt-3 inline-flex h-8 w-full items-center justify-center rounded-md border border-[#A7815E]/45 text-xs font-extrabold text-[#8F6B4C]">عرض التفاصيل</Link>
      </div>
    </article>
  );
}

export default async function AssetDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: asset } = await getAssetBySlug(slug);
  if (!asset) notFound();

  const gallery = asset.gallery ?? [asset.image, "/images/hero-raw-land.png", "/images/hero-panorama.png", "/images/final-cta-map-building.png"];
  const relatedResult = await getAssets();
  const related = relatedResult.data.filter((item) => item.slug !== asset.slug).slice(0, 4);

  return (
    <>
      <section className="section-compact">
        <div className="container-page">
          <nav className="mb-5 text-xs font-bold text-muted" aria-label="مسار الصفحة">
            <Link href="/" className="hover:text-[#A7815E]">الرئيسية</Link>
            <span className="mx-2 text-[#A7815E]">›</span>
            <Link href="/assets" className="hover:text-[#A7815E]">الأصول العقارية</Link>
            <span className="mx-2 text-[#A7815E]">›</span>
            <span>{asset.titleAr}</span>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="relative h-[360px] overflow-hidden rounded-lg bg-surface">
                <Image src={asset.image} alt={asset.titleAr} fill priority className="object-cover grayscale-[8%] sepia-[8%]" sizes="52vw" />
              </div>
              <div className="mt-3 grid grid-cols-4 gap-3">
                {gallery.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative h-20 overflow-hidden rounded-md border border-line bg-surface">
                    <Image src={image} alt="" fill className="object-cover grayscale-[8%] sepia-[8%]" sizes="12vw" />
                  </div>
                ))}
              </div>
            </div>

            <div className="text-right">
              <span className="rounded-md bg-[#F6EDE4] px-3 py-2 text-xs font-extrabold text-[#8F6B4C]">{asset.assetTypeAr}</span>
              <h1 className="mt-5 font-display text-[clamp(2rem,4vw,4rem)] font-black leading-tight text-[#1D1916]">{asset.titleAr}</h1>
              <p className="mt-3 flex items-center gap-2 text-sm font-extrabold text-muted"><MapPin className="h-4 w-4 text-[#A7815E]" />{asset.districtAr} - {asset.cityAr}</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Metric label="المساحة" value={formatArea(asset.areaSqm)} icon={Building2} />
                <Metric label="حالة الأصل" value="متاح للدراسة" icon={BadgeCheck} />
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/request-study" className="inline-flex h-12 items-center rounded-md bg-[#A7815E] px-7 text-sm font-extrabold text-white">طلب خدمة عقارية</Link>
                <InterestActionButton
                  entityType="asset"
                  entityId={asset.id}
                  slug={asset.slug}
                  title={asset.titleAr}
                  className="inline-flex h-12 items-center gap-2 rounded-md border border-[#A7815E]/45 bg-white px-7 text-sm font-extrabold text-[#8F6B4C]"
                  icon="heart"
                  iconClassName="h-4 w-4"
                  activeIconClassName="h-4 w-4 fill-current"
                  activeLabel="إزالة الاهتمام"
                  inactiveLabel="اهتمام بالأصل"
                />
              </div>
            </div>
          </div>

          <section className="mt-8 grid items-center gap-6 rounded-lg border border-line bg-white/72 p-5 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="text-right">
              <h2 className="font-display text-2xl font-extrabold text-[#1D1916]">نبذة عن الأصل</h2>
              <p className="mt-3 text-sm font-bold leading-9 text-muted">{asset.excerptAr} يتميز الموقع بقربه من المناطق الحيوية، مما يمنح الأصل مرونة في فرص التطوير السكني أو الاستثماري وفق دراسة منظمة تراعي المتطلبات النظامية.</p>
            </div>
            <div className="relative h-40 overflow-hidden rounded-md bg-surface">
              <Image src="/images/hero-full-cover.png" alt="" fill className="object-cover grayscale-[8%] sepia-[8%]" sizes="35vw" />
            </div>
          </section>

          <section className="mt-7">
            <h2 className="mb-5 text-right font-display text-2xl font-extrabold text-[#1D1916]">معلومات الأصل</h2>
            <div className="grid gap-3 md:grid-cols-6">
              <Metric label="حالة الأصل" value="متاح" icon={BadgeCheck} />
              <Metric label="الواجهة" value="شمالية" icon={Maximize2} />
              <Metric label="المساحة" value={formatArea(asset.areaSqm)} icon={Building2} />
              <Metric label="الحي" value={asset.districtAr ?? "غير محدد"} icon={MapPin} />
              <Metric label="المدينة" value={asset.cityAr} icon={MapPin} />
              <Metric label="نوع الأصل" value={asset.assetTypeAr} icon={Home} />
            </div>
          </section>

          <section className="mt-7 grid gap-5 rounded-lg border border-line bg-white/72 p-5 lg:grid-cols-[1fr_1.6fr]">
            <div className="text-right">
              <h2 className="font-display text-2xl font-extrabold text-[#1D1916]">موقع الأصل</h2>
              <dl className="mt-4 grid gap-3 text-sm font-bold text-muted">
                <div className="flex justify-between border-b border-line pb-2"><dt>المدينة</dt><dd className="text-[#1D1916]">{asset.cityAr}</dd></div>
                <div className="flex justify-between border-b border-line pb-2"><dt>الحي</dt><dd className="text-[#1D1916]">{asset.districtAr}</dd></div>
              </dl>
              <Link href="/contact" className="mt-4 inline-flex text-sm font-extrabold text-[#8F6B4C]">العرض مفتوح على الخريطة</Link>
            </div>
            <div className="relative h-52 overflow-hidden rounded-md bg-[#D9D1C7]">
              <Image src="/images/knowledge-library.png" alt="" fill className="object-cover opacity-65 grayscale-[8%] sepia-[8%]" sizes="55vw" />
              <MapPin className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 fill-[#A7815E] text-[#A7815E]" />
            </div>
          </section>

          <section className="mt-7">
            <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">إمكانية التطوير</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {opportunities.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-lg border border-line bg-white/72 p-5 text-center">
                    <Icon className="mx-auto h-10 w-10 text-[#A7815E]" />
                    <h3 className="mt-3 font-display text-lg font-extrabold text-[#1D1916]">{item.title}</h3>
                    <p className="mt-2 text-xs font-bold leading-7 text-muted">{item.copy}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mt-7">
            <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">الخدمات المرتبطة بالأصل</h2>
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
              {services.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-lg border border-line bg-white/72 p-5 text-center">
                    <Icon className="mx-auto h-9 w-9 text-[#A7815E]" />
                    <h3 className="mt-3 text-sm font-extrabold leading-6 text-[#1D1916]">{item.title}</h3>
                  </article>
                );
              })}
            </div>
            <div className="mt-5 text-center">
              <Link href="/request-study" className="inline-flex h-11 items-center rounded-md bg-[#A7815E] px-7 text-sm font-extrabold text-white">طلب خدمة عقارية</Link>
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <Link href="/assets" className="inline-flex h-10 items-center rounded-md border border-line bg-white px-4 text-xs font-extrabold text-navy">عرض جميع الأصول</Link>
              <h2 className="font-display text-3xl font-extrabold text-[#1D1916] gold-divider">أصول مشابهة</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              {related.map((item) => <SimilarAsset key={item.id} asset={item} />)}
            </div>
          </section>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
