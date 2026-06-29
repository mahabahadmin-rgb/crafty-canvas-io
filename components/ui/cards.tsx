import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Percent, Timer, WalletCards } from "lucide-react";
import type { Article, Asset, Contribution, KnowledgeResource } from "@/lib/types";
import { formatArea } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { InterestActionButton } from "@/components/dashboard/dashboard-actions";

export function AssetCard({ asset }: { asset: Asset }) {
  return (
    <article className="card-shell soft-lift overflow-hidden rounded-lg">
      <div className="relative overflow-hidden bg-surface">
        <Image
          src={asset.image}
          alt={`رسم معماري لأصل ${asset.titleAr}`}
          width={720}
          height={440}
          className="h-[118px] w-full object-cover grayscale-[16%] sepia-[8%]"
          sizes="(max-width: 768px) 80vw, 25vw"
          loading="eager"
        />
        <div className="absolute right-3 top-3"><StatusBadge label={asset.assetTypeAr} /></div>
        <InterestActionButton
          entityType="asset"
          entityId={asset.id}
          slug={asset.slug}
          title={asset.titleAr}
          activeLabel=""
          inactiveLabel=""
          icon="heart"
          iconClassName="h-4 w-4"
          activeIconClassName="h-4 w-4 fill-[#A7815E]"
          ariaLabel="إضافة الأصل للاهتمام"
          className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/88 text-[#A7815E]"
        />
      </div>
      <div className="px-4 pb-4 pt-3 text-right">
        <h3 className="font-display text-lg font-extrabold leading-7 text-navy">{asset.titleAr}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-muted"><MapPin className="h-3.5 w-3.5" />{asset.cityAr}</p>
        <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-xs font-bold text-muted">
          <span>المساحة</span>
          <span className="text-navy">{formatArea(asset.areaSqm)}</span>
        </div>
        <Link href={`/assets/${asset.slug}`} className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-md border border-[#A7815E]/45 text-xs font-extrabold text-[#8F6B4C] transition hover:bg-[#A7815E] hover:text-white">
          عرض التفاصيل
        </Link>
      </div>
    </article>
  );
}

export function StageTimeline({ contribution }: { contribution: Contribution }) {
  return (
    <ol className="mt-4 grid grid-cols-7 gap-1" aria-label="مراحل المساهمة">
      {contribution.timeline.map((step) => (
        <li key={step.labelAr} className="relative text-center">
          <div className={`mx-auto grid h-5 w-5 place-items-center rounded-full border text-[10px] ${step.current ? "border-gold bg-gold text-navy" : step.completed ? "border-gold-light bg-gold-light/20 text-gold-light" : "border-white/24 bg-white/6 text-white/45"}`}>✓</div>
          <span className="mt-1 hidden text-[9px] leading-3 text-white/48 xl:block">{step.labelAr}</span>
        </li>
      ))}
    </ol>
  );
}

export function ContributionCard({ contribution }: { contribution: Contribution }) {
  return (
    <article className="relative overflow-hidden rounded-lg border border-[#A7815E]/35 bg-[#111820] p-3 text-white shadow-[0_16px_40px_rgb(0_0_0/0.18)] transition hover:border-[#A7815E]/70">
      <div className="relative z-10">
        <div className="relative mb-4 h-32 overflow-hidden rounded-md bg-white/8">
          <Image src={contribution.image} alt="رسم معماري لمشروع مساهمة عقارية" fill className="object-cover grayscale-[10%] sepia-[10%]" sizes="25vw" />
          <InterestActionButton
            entityType="contribution"
            entityId={contribution.id}
            slug={contribution.slug}
            title={contribution.titleAr}
            activeLabel=""
            inactiveLabel=""
            icon="heart"
            iconClassName="h-4 w-4"
            activeIconClassName="h-4 w-4 fill-[#B89A7A]"
            ariaLabel="إضافة المساهمة للاهتمام"
            className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-[#1D1916]/80 text-[#B89A7A]"
          />
        </div>
        <div className="flex items-start justify-between gap-2">
          <div><h3 className="font-display text-base font-extrabold leading-7">{contribution.titleAr}</h3><p className="mt-0.5 flex items-center gap-1 text-xs text-white/58"><MapPin className="h-3 w-3" /> {contribution.cityAr}</p></div>
          <StatusBadge label={contribution.stageAr} inverse />
        </div>
        <dl className="mt-4 grid grid-cols-3 divide-x divide-x-reverse divide-white/12 border-y border-white/10 py-3 text-center">
          <div><dt className="text-xs text-white/45">المدة</dt><dd className="mt-1 text-sm font-bold"><Timer className="mx-auto mb-1 h-3 w-3 text-gold-light" />{contribution.durationMonths}</dd><span className="text-xs text-white/40">شهراً</span></div>
          <div><dt className="text-xs text-white/45">قيمة المساهمة</dt><dd className="mt-1 text-sm font-bold"><WalletCards className="mx-auto mb-1 h-3 w-3 text-gold-light" />{contribution.capitalSar / 1000000}</dd><span className="text-xs text-white/40">مليون ريال</span></div>
          <div><dt className="text-xs text-white/45">العائد المتوقع</dt><dd className="mt-1 text-sm font-bold"><Percent className="mx-auto mb-1 h-3 w-3 text-gold-light" />{contribution.fundedPercent / 10}%</dd><span className="text-xs text-white/40">سنوي</span></div>
        </dl>
        <Link href={`/contributions/${contribution.slug}`} className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-md border border-[#A7815E]/55 text-xs font-bold text-gold-light transition hover:bg-[#A7815E] hover:text-white">عرض المشروع</Link>
      </div>
    </article>
  );
}

export function ArticleCard({ article, compact = false }: { article: Article; compact?: boolean }) {
  return (
    <article className={`card-shell soft-lift overflow-hidden rounded-lg ${compact ? "grid min-w-0" : ""}`} style={compact ? { gridTemplateColumns: "112px minmax(0,1fr)" } : undefined}>
      <div className="relative min-w-0 overflow-hidden bg-surface">
        <Image
          src={article.image}
          alt={`رسم معماري لمقال ${article.titleAr}`}
          width={780}
          height={460}
          className={`${compact ? "h-32" : "h-72 lg:h-64"} w-full object-cover grayscale-[16%] sepia-[8%]`}
          sizes="(max-width: 768px) 85vw, 40vw"
          loading="eager"
        />
      </div>
      <div className="min-w-0 p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold text-gold"><Calendar className="h-3 w-3" />{article.categoryAr} · {article.date}</div>
        <h3 className="font-display text-base font-bold leading-7 text-navy">{article.titleAr}</h3>
        {!compact ? <p className="mt-2 line-clamp-2 text-xs leading-6 text-muted">{article.excerptAr}</p> : null}
        <Link href={`/news/${article.slug}`} className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-gold">اقرأ الخبر <ArrowLeft className="h-3.5 w-3.5" /></Link>
      </div>
    </article>
  );
}

export function ResourceCard({ resource }: { resource: KnowledgeResource }) {
  return (
    <Link href={`/blog/${resource.slug}`} className="card-shell soft-lift overflow-hidden rounded-lg text-center">
      <Image src={resource.image} alt={`رسم معرفي عن ${resource.titleAr}`} width={560} height={360} className="h-[8.5rem] w-full object-cover grayscale-[16%] sepia-[8%]" sizes="220px" loading="eager" />
      <div className="p-4"><h3 className="font-display text-base font-bold leading-7 text-navy">{resource.titleAr}</h3><p className="mt-2 text-xs text-muted">{resource.date}</p></div>
    </Link>
  );
}
