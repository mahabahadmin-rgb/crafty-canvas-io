import type { Metadata } from "next";
import Image from "next/image";
import {
  BadgeCheck,
  Boxes,
  Building2,
  ClipboardCheck,
  Eye,
  FileCheck2,
  FileSearch,
  Fingerprint,
  Gem,
  HandCoins,
  Landmark,
  Repeat2,
  SearchCheck,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FinalCTA } from "@/components/sections/final-cta";

export const metadata: Metadata = {
  title: "مهابة",
  description: "منصة مهابة لتحويل الأصول العقارية إلى مساهمات عقارية منظمة.",
};

const identity = [
  { title: "الرؤية", icon: Eye, copy: "أن تكون مهابة المنصة الرائدة في تحويل الأصول العقارية إلى مساهمات عقارية منظمة." },
  { title: "الرسالة", icon: Target, copy: "تمكين ملاك الأصول العقارية من تعظيم قيمة أصولهم وفق أعلى معايير الحوكمة والشفافية والامتثال." },
  { title: "القيم", icon: Gem, copy: "الشفافية، الحوكمة، الامتثال، الابتكار، الاستدامة." },
];

const offerings = [
  { title: "تحويل الأصول العقارية إلى مساهمات منظمة", icon: Building2 },
  { title: "دراسة وتحليل الأصول العقارية", icon: SearchCheck },
  { title: "هيكلة المساهمات العقارية", icon: Boxes },
  { title: "إدارة رحلة الطرح والتشغيل", icon: ClipboardCheck },
  { title: "التنسيق مع مزودي الخدمات المتخصصين", icon: Users },
  { title: "المتابعة حتى التخارج وتوزيع العوائد", icon: HandCoins },
];

const journey = ["إضافة الأصل العقاري", "الدراسة والتحليل", "هيكلة المساهمة", "استكمال المتطلبات النظامية", "الطرح عبر الجهات المرخصة", "التشغيل والتخارج"];
const governance = [
  { title: "حماية حقوق الأطراف", icon: ShieldCheck },
  { title: "الامتثال التنظيمي", icon: FileCheck2 },
  { title: "الشفافية والإفصاح", icon: ClipboardCheck },
  { title: "إدارة المخاطر", icon: BadgeCheck },
  { title: "المراجعة المستمرة", icon: Repeat2 },
];
const trust = [
  { title: "النفاذ الوطني", copy: "التحقق من هوية الأفراد.", icon: Fingerprint },
  { title: "واثق", copy: "التحقق من هوية الشركات والمنشآت.", icon: Landmark },
  { title: "الهيئة العامة للعقار", copy: "التحقق من صحة بيانات الملكية العقارية.", icon: FileSearch },
  { title: "التوقيع الإلكتروني", copy: "توثيق العقود والمعاملات إلكترونياً.", icon: FileCheck2 },
];

function IconCard({ title, icon: Icon, copy }: { title: string; icon: LucideIcon; copy?: string }) {
  return (
    <article className="rounded-lg border border-line bg-white/72 p-5 text-center shadow-[0_10px_24px_rgb(29_25_22/0.035)]">
      <Icon className="mx-auto h-10 w-10 stroke-[1.5] text-[#A7815E]" />
      <h3 className="mt-3 font-display text-xl font-extrabold text-[#1D1916]">{title}</h3>
      {copy ? <p className="mx-auto mt-2 max-w-xs text-sm font-bold leading-8 text-muted">{copy}</p> : null}
    </article>
  );
}

export default function AboutPage() {
  return (
    <>
      <section className="section-compact">
        <div className="container-page">
          <div className="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative min-h-[440px] overflow-hidden">
              <Image src="/images/hero-full-cover.png" alt="مبنى عقاري مؤسسي" fill priority className="object-contain object-left-bottom" sizes="55vw" />
            </div>
            <div className="text-right">
              <p className="mb-3 text-sm font-extrabold text-[#A7815E]">من مهابة</p>
              <h1 className="font-display text-[clamp(2.1rem,4.2vw,4.35rem)] font-black leading-[1.34] text-[#1D1916]">
                نحول الأصول العقارية إلى
                <span className="block text-[#A7815E]">مساهمات عقارية منظمة</span>
                وفق أعلى معايير الحوكمة والشفافية والامتثال.
              </h1>
              <p className="mt-5 max-w-2xl text-base font-bold leading-9 text-muted">
                نساعد ملاك الأصول العقارية على دراسة أصولهم وهيكلتها وتحويلها إلى مساهمات عقارية منظمة عبر منظومة متكاملة من الخدمات والشركاء والحوكمة.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 rounded-lg border border-line bg-white/62 p-4 md:grid-cols-3">
            {identity.map((item) => <IconCard key={item.title} {...item} />)}
          </div>
        </div>
      </section>

      <section className="section-compact">
        <div className="container-page">
          <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">ماذا تقدم مهابة؟</h2>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            {offerings.map((item) => <IconCard key={item.title} {...item} />)}
          </div>
        </div>
      </section>

      <section className="section-compact">
        <div className="container-page">
          <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">رحلة تحويل الأصل العقاري إلى مساهمة عقارية</h2>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            {journey.map((title, index) => (
              <article key={title} className="rounded-lg border border-line bg-white/72 p-5 text-center">
                <span className="mx-auto grid h-11 w-11 place-items-center rounded-full border border-[#A7815E]/45 text-sm font-black text-[#A7815E]">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-sm font-extrabold leading-7 text-[#1D1916]">{title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-compact">
        <div className="container-page grid items-center gap-6 rounded-lg border border-line bg-white/64 p-5 lg:grid-cols-[1fr_1.1fr]">
          <div className="relative min-h-[230px] overflow-hidden rounded-md">
            <Image src="/images/hero-full-cover.png" alt="" fill className="object-cover grayscale-[8%] sepia-[8%]" sizes="45vw" />
          </div>
          <div className="text-right">
            <h2 className="font-display text-3xl font-extrabold text-[#1D1916]">الحوكمة والامتثال</h2>
            <p className="mt-3 text-sm font-bold leading-8 text-muted">نلتزم في مهابة بأعلى معايير الحوكمة والشفافية والامتثال بما يحقق الثقة ويحفظ حقوق جميع الأطراف.</p>
            <div className="mt-5 grid gap-3 md:grid-cols-5">
              {governance.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="text-center">
                    <Icon className="mx-auto h-8 w-8 text-[#A7815E]" />
                    <p className="mt-2 text-xs font-extrabold leading-5 text-[#1D1916]">{item.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section-compact">
        <div className="container-page">
          <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">الثقة الرقمية</h2>
          <div className="grid gap-3 md:grid-cols-4">
            {trust.map((item) => <IconCard key={item.title} {...item} />)}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
