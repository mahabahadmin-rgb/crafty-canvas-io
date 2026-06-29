import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Clock3,
  Eye,
  FileText,
  UserRound,
} from "lucide-react";
import type { Article } from "@/lib/types";
import { getPublicKnowledgeResources, getPublicNewsArticles, listApprovedContentComments, type PublicContentComment } from "@/lib/supabase/mahabah";
import { SectionHeading } from "@/components/ui/section-heading";
import { FinalCTA } from "@/components/sections/final-cta";
import { ContentCommentForm, ContentDetailNewsletterForm, ContentUtilityActions } from "@/components/sections/content-detail-actions";

type Variant = "news" | "article";

const articleParagraphs = [
  "يشهد القطاع العقاري تحولاً كبيراً في طريقة تنظيم الأصول العقارية، حيث أصبح تحويل الأصل العقاري إلى مساهمة منظمة خياراً فعالاً لتعظيم القيمة الاستثمارية وتوزيع المخاطر والعوائد بصورة مستدامة لجميع الأطراف.",
  "ومن خلال هذا المسار، تساعد مهابة ملاك الأصول على دراسة الجدوى الفنية والمالية والقانونية، ثم بناء نموذج استثماري واضح يحافظ على حقوق المستثمرين ويلتزم بأفضل الممارسات والمعايير.",
];

const newsParagraphs = [
  "أعلنت شركة مهابة لإدارة المساهمات العقارية عن إطلاق مشروعها الجديد الذي يستهدف تحويل الأصول العقارية غير المستغلة إلى مساهمات استثمارية منظمة وفق أعلى معايير الحوكمة والشفافية.",
  "ويأتي هذا المشروع في إطار رؤية الشركة لتمكين ملاك الأصول العقارية من تحقيق أقصى استفادة من أصولهم وتحويلها إلى فرص استثمارية حقيقية تساهم في دعم الاقتصاد الوطني وتعزز القطاع العقاري.",
];

const valueCards = [
  { title: "محتوى عملي", copy: "معلومات قابلة للتطبيق تساعد القارئ على اتخاذ قرار أفضل.", icon: FileText },
  { title: "خبرات عقارية", copy: "محتوى من خبراء في دراسة الأصول وهيكلة المساهمات.", icon: UserRound },
  { title: "تحليلات سوقية", copy: "قراءات ومؤشرات مرتبطة بتوجهات السوق العقاري.", icon: Eye },
  { title: "محتوى متخصص", copy: "موضوعات مركزة في الاستثمار والتطوير والحوكمة.", icon: Bookmark },
];

function SmallList({ title, route, items }: { title: string; route: Variant; items: Article[] }) {
  return (
    <aside className="card-shell rounded-lg p-5">
      <h2 className="font-display text-xl font-extrabold text-navy">{title}</h2>
      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <Link key={item.id} href={`/${route === "news" ? "news" : "blog"}/${item.slug}`} className="grid grid-cols-[1fr_74px] gap-3 border-b border-line/70 pb-3 last:border-b-0 last:pb-0">
            <div className="min-w-0 text-right">
              <span className="text-[11px] font-extrabold text-[#A7815E]">{index + 1}</span>
              <h3 className="mt-1 line-clamp-2 text-xs font-extrabold leading-5 text-navy">{item.titleAr}</h3>
              <p className="mt-1 text-[10px] font-bold text-muted">{item.date}</p>
            </div>
            <div className="relative h-16 overflow-hidden rounded-md bg-surface">
              <Image src={item.image} alt="" fill className="object-cover grayscale-[16%] sepia-[8%]" sizes="74px" />
            </div>
          </Link>
        ))}
      </div>
      <Link href={route === "news" ? "/news" : "/blog"} className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-[#8F6B4C]">
        عرض جميع {route === "news" ? "الأخبار" : "المقالات"}
        <ArrowLeft className="h-3.5 w-3.5" />
      </Link>
    </aside>
  );
}

function ApprovedCommentsList({ comments }: { comments: PublicContentComment[] }) {
  if (comments.length === 0) {
    return (
      <p className="mt-4 rounded-md border border-line bg-[#fffdfa] px-4 py-3 text-sm font-bold text-muted">
        لا توجد تعليقات منشورة حتى الآن.
      </p>
    );
  }

  return (
    <div className="mt-4 grid gap-3">
      {comments.map((comment) => (
        <article key={comment.id} className="rounded-md border border-line bg-[#fffdfa] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-base font-extrabold text-navy">{comment.authorName}</h3>
            <time className="text-xs font-bold text-muted">{new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium" }).format(new Date(comment.createdAt))}</time>
          </div>
          <p className="mt-3 text-sm font-bold leading-8 text-muted">{comment.body}</p>
        </article>
      ))}
    </div>
  );
}

export async function ContentDetailPage({ item, variant }: { item: Article; variant: Variant }) {
  const isNews = variant === "news";
  const routeRoot = isNews ? "news" : "blog";
  const relatedResult = isNews ? await getPublicNewsArticles() : await getPublicKnowledgeResources();
  const relatedItems = relatedResult.data.filter((entry) => entry.slug !== item.slug);
  const related = relatedItems.slice(0, 4);
  const sidebarItems = relatedResult.data.slice(0, 5);
  const commentsResult = isNews ? await listApprovedContentComments({ contentSlug: item.slug, contentType: variant }) : { data: [] };
  const paragraphs = isNews ? newsParagraphs : articleParagraphs;

  return (
    <>
      <section className="section-compact">
        <div className="container-page">
          <nav className="mb-5 text-xs font-bold text-muted" aria-label="مسار الصفحة">
            <Link href="/" className="hover:text-gold">الرئيسية</Link>
            <span className="mx-2 text-gold">›</span>
            <Link href={isNews ? "/news" : "/blog"} className="hover:text-gold">{isNews ? "الأخبار" : "المدونة"}</Link>
            <span className="mx-2 text-gold">›</span>
            <span className="text-navy">{item.titleAr}</span>
          </nav>

          <div className="grid items-start gap-7 lg:grid-cols-[1.06fr_1fr]">
            <header className="text-right">
              <span className="inline-flex rounded-md bg-[#fff7ea] px-4 py-2 text-xs font-extrabold text-[#A7815E]">
                {isNews ? "أخبار مهابة" : item.categoryAr}
              </span>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.35] text-[#1D1916] md:text-5xl">{item.titleAr}</h1>
              <p className="mt-4 max-w-2xl text-base font-bold leading-9 text-muted">{item.excerptAr}</p>
              <div className="mt-5 flex flex-wrap gap-4 text-xs font-extrabold text-muted">
                <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4 text-[#A7815E]" />{item.date}</span>
                <span className="inline-flex items-center gap-1.5"><UserRound className="h-4 w-4 text-[#A7815E]" />{isNews ? "إدارة التحرير" : "د. عبدالله السبيعي"}</span>
                <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4 text-[#A7815E]" />8 دقائق قراءة</span>
                <span className="inline-flex items-center gap-1.5"><Eye className="h-4 w-4 text-[#A7815E]" />12.4K مشاهدة</span>
              </div>
              <div className="mt-6">
                <ContentUtilityActions contentType={variant} slug={item.slug} title={item.titleAr} />
              </div>
            </header>

            <div className="relative min-h-[380px] overflow-hidden rounded-lg border border-line bg-surface shadow-[0_12px_28px_rgb(24_23_21/0.035)]">
              <Image src={item.image} alt="" fill priority className="object-cover grayscale-[8%] sepia-[8%]" sizes="50vw" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-compact">
        <div className="container-page grid gap-6 lg:grid-cols-[330px_1fr]">
          <main className="space-y-5 lg:order-2">
            <article className="card-shell rounded-lg p-6 text-right">
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className="mb-5 text-base font-bold leading-10 text-muted">{paragraph}</p>
              ))}

              {isNews ? (
                <>
                  <h2 className="font-display text-2xl font-extrabold text-[#A7815E]">الأهداف الرئيسية للمشروع</h2>
                  <p className="mt-3 text-base font-bold leading-10 text-muted">
                    يستهدف المشروع تحقيق عدة أهداف استراتيجية من أبرزها تمكين الملاك، رفع كفاءة الأصول، جذب الاستثمارات، وتطوير مشاريع نوعية تسهم في التنمية العمرانية والاقتصادية.
                  </p>
                  <blockquote className="my-6 rounded-lg border-r-4 border-[#A7815E] bg-[#fff7ea] p-5 text-center text-base font-extrabold leading-8 text-navy">
                    نسعى في مهابة إلى بناء منظومة متكاملة تضمن تحويل الأصول العقارية إلى مساهمات استثمارية تعود بالنفع على الملاك والمستثمرين.
                  </blockquote>
                  <h2 className="font-display text-2xl font-extrabold text-[#A7815E]">آلية العمل</h2>
                  <p className="mt-3 text-base font-bold leading-10 text-muted">
                    تعتمد مهابة في هذا المشروع على منهجية متكاملة تبدأ بدراسة الأصول وتقييمها، ثم إعداد هيكلتها وتطويرها وفق نموذج استثماري واضح ومتوافق مع متطلبات السوق.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-extrabold text-[#A7815E]">1. تقييم الأصل العقاري</h2>
                  <p className="mt-3 text-base font-bold leading-10 text-muted">
                    تبدأ رحلة التحويل بتقييم دقيق للأصل العقاري من حيث الموقع، والقيمة السوقية، والفرص المتوقعة، والمخاطر المحتملة.
                  </p>
                  <div className="relative my-6 h-48 overflow-hidden rounded-lg border border-line bg-surface">
                    <Image src="/images/hero-panorama.png" alt="" fill className="object-cover grayscale-[12%] sepia-[8%]" sizes="60vw" />
                  </div>
                  <h2 className="font-display text-2xl font-extrabold text-[#A7815E]">2. هيكلة المساهمة العقارية</h2>
                  <p className="mt-3 text-base font-bold leading-10 text-muted">
                    يتم تحديد هيكل المساهمة المناسب من حيث حجم رأس المال، وعدد الوحدات، وحقوق المساهمين، ونموذج توزيع الأرباح.
                  </p>
                  <blockquote className="my-6 rounded-lg border-r-4 border-[#A7815E] bg-[#fff7ea] p-5 text-center text-base font-extrabold leading-8 text-navy">
                    الهيكلة الصحيحة هي الأساس لإنجاح أي مساهمة عقارية وتحقيق عوائد مستدامة للمساهمين.
                  </blockquote>
                  <h2 className="font-display text-2xl font-extrabold text-[#A7815E]">3. الامتثال والتنظيم</h2>
                  <p className="mt-3 text-base font-bold leading-10 text-muted">
                    الالتزام بالأنظمة واللوائح الصادرة من الجهات المختصة يعزز الثقة ويضمن الشفافية والموثوقية.
                  </p>
                </>
              )}

              <div className="relative my-6 h-44 overflow-hidden rounded-lg border border-line bg-surface">
                <Image src="/images/hero-full-cover.png" alt="" fill className="object-cover grayscale-[12%] sepia-[8%]" sizes="60vw" />
              </div>
              <h2 className="font-display text-2xl font-extrabold text-[#A7815E]">{isNews ? "الأثر المتوقع" : "خلاصة"}</h2>
              <p className="mt-3 text-base font-bold leading-10 text-muted">
                يمثل هذا المسار خطوة عملية نحو استثمار عقاري أكثر تنظيماً وشفافية، ويمنح الملاك والمستثمرين إطاراً واضحاً لإدارة الفرص وتحقيق قيمة مستدامة.
              </p>
              <div className="mt-6 border-t border-line pt-5">
                <ContentUtilityActions contentType={variant} slug={item.slug} title={item.titleAr} />
              </div>
            </article>

            <section>
              <SectionHeading compact title={isNews ? "أخبار ذات صلة" : "مقالات ذات صلة"} />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {related.map((entry) => (
                  <Link key={entry.id} href={`/${routeRoot}/${entry.slug}`} className="card-shell soft-lift overflow-hidden rounded-lg">
                    <Image src={entry.image} alt="" width={520} height={300} className="h-32 w-full object-cover grayscale-[16%] sepia-[8%]" sizes="25vw" />
                    <div className="p-4 text-right">
                      <span className="text-[11px] font-extrabold text-[#A7815E]">{entry.categoryAr}</span>
                      <h3 className="mt-2 line-clamp-2 font-display text-base font-extrabold leading-7 text-navy">{entry.titleAr}</h3>
                      <p className="mt-2 text-[11px] font-bold text-muted">{entry.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {isNews ? (
              <section className="card-shell rounded-lg p-5">
                <h2 className="font-display text-2xl font-extrabold text-navy">شارك رأيك</h2>
                <ApprovedCommentsList comments={commentsResult.data} />
                <ContentCommentForm contentSlug={item.slug} contentType={variant} />
              </section>
            ) : null}
          </main>

          <aside className="space-y-5 lg:order-1">
            <section className="card-shell rounded-lg p-5">
              <h2 className="font-display text-xl font-extrabold text-navy">{isNews ? "معلومات الخبر" : "معلومات المقال"}</h2>
              <dl className="mt-4 grid gap-3 text-sm font-bold text-muted">
                <div className="flex items-center justify-between gap-4"><dt>التصنيف</dt><dd className="text-navy">{item.categoryAr}</dd></div>
                <div className="flex items-center justify-between gap-4"><dt>{isNews ? "الكاتب" : "الكاتب"}</dt><dd className="text-navy">{isNews ? "إدارة التحرير" : "د. عبدالله السبيعي"}</dd></div>
                <div className="flex items-center justify-between gap-4"><dt>تاريخ النشر</dt><dd className="text-navy">{item.date}</dd></div>
                <div className="flex items-center justify-between gap-4"><dt>وقت القراءة</dt><dd className="text-navy">8 دقائق</dd></div>
                <div className="flex items-center justify-between gap-4"><dt>عدد المشاهدات</dt><dd className="text-navy">12,456</dd></div>
              </dl>
            </section>

            <SmallList title="الأكثر قراءة" route={variant} items={sidebarItems} />

            <section className="card-shell rounded-lg p-5 text-right">
              <h2 className="font-display text-xl font-extrabold text-navy">{isNews ? "اشترك ليصلك جديد الأخبار" : "اشترك ليصلك جديد المعرفة"}</h2>
              <p className="mt-2 text-xs leading-6 text-muted">اشترك لتصلك أحدث الأخبار والمقالات والدراسات والتحليلات العقارية.</p>
              <ContentDetailNewsletterForm />
            </section>

            {!isNews ? (
              <section className="card-shell rounded-lg p-5 text-center">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#f3eadf] text-2xl font-black text-navy">د</div>
                <h2 className="mt-3 font-display text-xl font-extrabold text-navy">د. عبدالله السبيعي</h2>
                <p className="mt-2 text-xs font-bold leading-6 text-muted">خبير في الاستثمار العقاري وإدارة المحافظ الاستثمارية.</p>
                <Link href="/blog" className="mt-3 inline-flex text-xs font-extrabold text-[#8F6B4C]">جميع مقالات الكاتب</Link>
              </section>
            ) : (
              <SmallList title="آخر الأخبار" route="news" items={sidebarItems} />
            )}
          </aside>
        </div>
      </section>

      <section className="section-compact">
        <div className="container-page">
          <SectionHeading compact title={isNews ? "لماذا تتابع أخبار مهابة؟" : "لماذا مكتبة المعرفة في مهابة؟"} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {valueCards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.title} className="card-shell rounded-lg p-5 text-center">
                  <Icon className="mx-auto h-10 w-10 stroke-[1.45] text-[#A7815E]" />
                  <h3 className="mt-3 font-display text-lg font-extrabold text-navy">{card.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-muted">{card.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
