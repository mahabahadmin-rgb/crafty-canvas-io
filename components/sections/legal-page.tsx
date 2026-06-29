import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Building2,
  CalendarDays,
  FileText,
  Globe2,
  Handshake,
  Headphones,
  Info,
  KeyRound,
  Laptop,
  Link2,
  LockKeyhole,
  Mail,
  MapPin,
  PenLine,
  Phone,
  Scale,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { FinalCTA } from "@/components/sections/final-cta";

type LegalKind = "privacy" | "terms" | "disclaimer";

type LegalSection = {
  title: string;
  body: string;
  icon: LucideIcon;
  bullets?: string[];
};

type LegalConfig = {
  title: string;
  description: string;
  updated: string;
  hero: string;
  tabs: Array<{ label: string; icon: LucideIcon }>;
  sections: LegalSection[];
};

const pages: Record<LegalKind, LegalConfig> = {
  privacy: {
    title: "سياسة الخصوصية",
    description: "توضح هذه السياسة كيفية قيام مهابة بجمع واستخدام وحماية بياناتك الشخصية عند استخدامك لموقعنا وخدماتنا.",
    updated: "آخر تحديث: 12 مايو 2026",
    hero: "/images/knowledge-library.png",
    tabs: [
      { label: "المعلومات التي نجمعها", icon: FileText },
      { label: "حماية المعلومات", icon: ShieldCheck },
      { label: "مشاركة المعلومات", icon: LockKeyhole },
      { label: "حقوقك", icon: UserRound },
      { label: "التواصل معنا", icon: Phone },
    ],
    sections: [
      {
        title: "1. مقدمة",
        body: "تلتزم منصة مهابة لإدارة المساهمات العقارية بحماية خصوصيتك وبياناتك الشخصية، وتعمل وفق أعلى معايير الأمان والسرية والامتثال للأنظمة واللوائح المعمول بها في المملكة العربية السعودية.",
        icon: Info,
      },
      {
        title: "2. المعلومات التي نجمعها",
        body: "قد نجمع بعض المعلومات اللازمة عند استخدامك لموقعنا أو خدماتنا، وتشمل البيانات الشخصية وبيانات التواصل وبيانات الأصول والمساهمات والمستندات الضرورية لتقديم الخدمة.",
        icon: FileText,
        bullets: ["الاسم ورقم الهوية ورقم الجوال والبريد الإلكتروني.", "معلومات الأصول العقارية والصكوك والمستندات المرتبطة.", "طلبات الخدمات والمساهمات والتواصل مع فريق مهابة."],
      },
      {
        title: "3. كيفية استخدام المعلومات",
        body: "نستخدم المعلومات لتقديم الخدمات، دراسة الأصول، إدارة المساهمات، التواصل معك، تحسين تجربة المستخدم، وإرسال الإشعارات المرتبطة بطلباتك.",
        icon: PenLine,
        bullets: ["تقديم وعرض الخدمات المرتبطة بالأصول والمساهمات العقارية.", "معالجة الطلبات والمستندات والتحقق من البيانات.", "تحسين المنصة وتجربة الاستخدام والامتثال للمتطلبات النظامية."],
      },
      {
        title: "4. حماية المعلومات",
        body: "نلتزم بتطبيق إجراءات أمنية مناسبة لحماية بياناتك من الوصول غير المصرح به أو الإفصاح أو التعديل أو التلف، ويتم تخزين البيانات على أنظمة آمنة داخل المملكة العربية السعودية.",
        icon: ShieldCheck,
      },
      {
        title: "5. مشاركة المعلومات",
        body: "لا نقوم ببيع أو تأجير أو مشاركة بياناتك الشخصية مع أي طرف ثالث إلا عند الحاجة لمشاركة البيانات مع مزودي خدمات موثوقين لتنفيذ الخدمات المطلوبة، أو عند الامتثال للمتطلبات النظامية.",
        icon: LockKeyhole,
      },
      {
        title: "6. حقوقك",
        body: "يحق لك في أي وقت الوصول إلى بياناتك الشخصية، طلب نسخة منها، تصحيحها، تحديثها، أو طلب حذفها بما لا يتعارض مع المتطلبات النظامية أو التعاقدية.",
        icon: UserRound,
      },
      {
        title: "7. ملفات تعريف الارتباط (Cookies)",
        body: "قد نستخدم ملفات تعريف الارتباط لتحسين تجربتك على الموقع وتقديم محتوى مخصص، ويمكنك إدارة تفضيلات ملفات الارتباط من إعدادات المتصفح الخاص بك.",
        icon: Globe2,
      },
      {
        title: "8. روابط خارجية",
        body: "قد يحتوي موقعنا على روابط لمواقع أخرى، ولسنا مسؤولين عن ممارسات الخصوصية الخاصة بتلك المواقع.",
        icon: Link2,
      },
      {
        title: "9. التعديلات على سياسة الخصوصية",
        body: "قد نقوم بتحديث هذه السياسة من وقت لآخر، وسيتم نشر التحديثات على هذه الصفحة مع تحديث تاريخ آخر تعديل.",
        icon: CalendarDays,
      },
      {
        title: "10. التواصل معنا",
        body: "إذا كان لديك أي استفسار حول سياسة الخصوصية يمكنك التواصل معنا عبر وسائل الاتصال الرسمية أدناه.",
        icon: Headphones,
      },
    ],
  },
  terms: {
    title: "شروط الاستخدام",
    description: "تنظم هذه الشروط والأحكام استخدام منصة مهابة وخدماتها المتعلقة بالأصول العقارية والمساهمات العقارية والخدمات العقارية.",
    updated: "آخر تحديث: 12 مايو 2026",
    hero: "/images/knowledge-library.png",
    tabs: [
      { label: "قبول الشروط", icon: Handshake },
      { label: "الحسابات", icon: UserRound },
      { label: "استخدام المنصة", icon: Laptop },
      { label: "المسؤولية", icon: ShieldCheck },
      { label: "التواصل معنا", icon: Phone },
    ],
    sections: [
      { title: "1. مقدمة", body: "باستخدامك منصة مهابة فإنك توافق على الالتزام بجميع الشروط والأحكام الواردة في هذه الصفحة كما يحق لمهابة تحديث أي من هذه الشروط في أي وقت.", icon: FileText },
      { title: "2. التعريفات", body: "المستخدم هو كل شخص يقوم بالوصول إلى المنصة أو استخدامها. المنصة هي موقع وخدمات مهابة لإدارة الأصول والمساهمات والخدمات العقارية.", icon: FileText },
      { title: "3. الحسابات", body: "يلتزم المستخدم بتقديم معلومات صحيحة ودقيقة عند إنشاء الحساب، والمحافظة على سرية بيانات الدخول وتحمل المسؤولية عن أي نشاط يتم عبر حسابه.", icon: UserRound },
      { title: "4. استخدام المنصة", body: "يجب استخدام المنصة للأغراض المشروعة فقط وبما لا يتعارض مع الأنظمة واللوائح المعمول بها في المملكة العربية السعودية.", icon: Laptop },
      { title: "5. الأصول العقارية", body: "يتحمل المستخدم مسؤولية صحة ودقة البيانات والمستندات المضافة للأصول العقارية، ولا تضمن مهابة صحة البيانات المقدمة من المستخدمين.", icon: Building2 },
      { title: "6. المساهمات العقارية", body: "تعرض المنصة معلومات المساهمات العقارية والفرص الاستثمارية لأغراض الاطلاع فقط، ويجب على المستخدم اتخاذ قراراته بناء على دراسة خاصة.", icon: Scale },
      { title: "7. الخدمات العقارية", body: "يتم تنفيذ الخدمات العقارية وفق نطاق كل خدمة وشروطها الخاصة، وقد تتطلب بعض الخدمات مراجعات أو مستندات إضافية قبل التنفيذ.", icon: PenLine },
      { title: "8. الملكية الفكرية", body: "جميع الحقوق المتعلقة بالمنصة والشعارات والمحتوى والنصوص والرسومات والصور محفوظة لمهابة، ولا يجوز استخدامها أو نسخها دون إذن كتابي مسبق.", icon: KeyRound },
      { title: "9. حدود المسؤولية", body: "لا تتحمل مهابة أي مسؤولية عن أي خسائر مباشرة أو غير مباشرة تنتج عن استخدام المنصة أو الاعتماد على المعلومات المنشورة أو الخدمات المقدمة.", icon: ShieldCheck },
      { title: "10. تعديل الشروط", body: "يجوز لمهابة تعديل هذه الشروط والأحكام في أي وقت، وسيتم إشعار المستخدمين بالتحديثات عند نشرها على المنصة.", icon: PenLine },
      { title: "11. التواصل معنا", body: "لأي استفسارات أو ملاحظات تتعلق بهذه الشروط يمكنكم التواصل معنا عبر وسائل الاتصال الرسمية أدناه.", icon: Headphones },
    ],
  },
  disclaimer: {
    title: "إخلاء المسؤولية",
    description: "توضح هذه الصفحة حدود المسؤولية المتعلقة باستخدام منصة مهابة والمعلومات والخدمات المعروضة عبر المنصة.",
    updated: "آخر تحديث: 12 مايو 2026",
    hero: "/images/knowledge-library.png",
    tabs: [
      { label: "طبيعة المعلومات", icon: Info },
      { label: "حدود المسؤولية", icon: ShieldCheck },
      { label: "المخاطر", icon: AlertTriangle },
      { label: "الروابط الخارجية", icon: Link2 },
      { label: "التواصل معنا", icon: Phone },
    ],
    sections: [
      { title: "1. طبيعة المعلومات", body: "جميع المعلومات المعروضة على منصة مهابة هي لأغراض عامة وإرشادية فقط، ولا تشكل توصية أو عرضاً أو التزاماً قانونياً أو فنياً أو استثمارياً.", icon: Info },
      { title: "2. دقة المعلومات", body: "نسعى لتقديم معلومات دقيقة ومحدثة، ومع ذلك لا تضمن مهابة دقة أو اكتمال أو ملاءمة المعلومات لأي غرض، كما لا تتحمل أي مسؤولية عن أي أخطاء أو سهو قد تحدث.", icon: PenLine },
      { title: "3. حدود المسؤولية", body: "لا تتحمل مهابة أو أي من ممثليها أو شركائها أو موظفيها أي مسؤولية تجاه أي طرف عن أي أضرار مباشرة أو غير مباشرة تنشأ عن استخدام المنصة أو الاعتماد على المعلومات أو الخدمات المقدمة عبرها.", icon: ShieldCheck },
      { title: "4. القرارات الاستثمارية", body: "جميع القرارات الاستثمارية التي يتم اتخاذها بناء على المعلومات المعروضة على المنصة تعد مسؤولية المستخدم وحده، ونوصي دائماً باستشارة مستشار مالي أو قانوني مختص.", icon: Scale },
      { title: "5. الخدمات المقدمة", body: "قد تتغير الخدمات أو تتوقف مؤقتاً أو دائماً دون إشعار مسبق، كما قد تخضع بعض القيود حسب الأنظمة واللوائح المعمول بها في المملكة العربية السعودية.", icon: Building2 },
      { title: "6. المخاطر", body: "الاستثمار في الأصول العقارية والمساهمات العقارية ينطوي على مخاطر وقد لا يكون مناسباً لجميع المستثمرين، وقد لا يتحقق العائد المتوقع.", icon: AlertTriangle },
      { title: "7. الروابط الخارجية", body: "قد تحتوي المنصة على روابط لمواقع خارجية لا تخضع لإدارتنا، ولسنا مسؤولين عن محتواها أو سياساتها أو ممارسات الخصوصية الخاصة بها.", icon: Link2 },
      { title: "8. التعديلات", body: "يجوز لمهابة تعديل أو تحديث هذه الصفحة في أي وقت دون إشعار مسبق، ويعد استمرار المستخدم في استخدام المنصة بعد التعديل موافقة على الشروط المحدثة.", icon: PenLine },
      { title: "9. التواصل معنا", body: "لأي استفسارات أو ملاحظات بخصوص إخلاء المسؤولية يمكنكم التواصل معنا عبر وسائل الاتصال الرسمية أدناه.", icon: Headphones },
    ],
  },
};

const contactCards = [
  { title: "الجوال", value: "0510515010", icon: Phone },
  { title: "البريد الإلكتروني", value: "info@mahabah.sa", icon: Mail },
  { title: "الموقع الإلكتروني", value: "mahabah.sa", icon: Globe2 },
  { title: "الرياض", value: "المملكة العربية السعودية", icon: MapPin },
];

function LegalRow({ section, id }: { section: LegalSection; id: string }) {
  const Icon = section.icon;
  return (
    <section id={id} className="scroll-mt-28 grid gap-5 border-b border-line bg-white/68 p-6 text-right last:border-b-0 md:grid-cols-[1fr_260px]">
      <div className="text-sm font-bold leading-9 text-muted">
        <p>{section.body}</p>
        {section.bullets ? (
          <ul className="mt-3 grid gap-1 pr-5">
            {section.bullets.map((bullet) => <li key={bullet} className="list-disc">{bullet}</li>)}
          </ul>
        ) : null}
      </div>
      <div className="flex items-center justify-end gap-4 md:justify-start">
        <h2 className="font-display text-2xl font-extrabold text-[#1D1916]">{section.title}</h2>
        <Icon className="h-12 w-12 shrink-0 stroke-[1.25] text-[#A7815E]" />
      </div>
    </section>
  );
}

export function LegalPage({ kind }: { kind: LegalKind }) {
  const config = pages[kind];

  return (
    <>
      <section className="section-compact">
        <div className="container-page">
          <div className="grid min-h-[340px] items-center overflow-hidden rounded-lg border border-line bg-white/66 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[300px] lg:min-h-[340px]">
              <Image src={config.hero} alt="" fill priority className="object-cover grayscale-[22%] sepia-[14%]" sizes="55vw" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#F6F4F1]/72" />
            </div>
            <header className="p-8 text-right lg:p-12">
              <nav className="mb-5 text-xs font-bold text-muted">
                <Link href="/" className="hover:text-gold">الرئيسية</Link>
                <span className="mx-2 text-gold">›</span>
                <span>{config.title}</span>
              </nav>
              <h1 className="font-display text-5xl font-extrabold leading-tight text-[#1D1916]">{config.title}</h1>
              <p className="mt-5 max-w-xl text-base font-bold leading-8 text-muted">{config.description}</p>
              <p className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold text-[#A7815E]">
                <CalendarDays className="h-4 w-4" />
                {config.updated}
              </p>
            </header>
          </div>
        </div>
      </section>

      <section className="section-compact pt-0">
        <div className="container-page grid gap-3 md:grid-cols-5">
          {config.tabs.map((tab) => {
            const Icon = tab.icon;
            const sectionIndex = Math.max(0, config.sections.findIndex((section) => section.title.includes(tab.label) || section.body.includes(tab.label)));
            const href = `#legal-section-${sectionIndex + 1}`;
            return (
              <Link key={tab.label} href={href} className="flex h-16 items-center justify-center gap-3 rounded-md border border-line bg-white/72 px-4 text-sm font-extrabold text-navy transition hover:border-[#A7815E]/55 hover:text-[#8F6B4C]">
                <Icon className="h-5 w-5 text-[#A7815E]" />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section-compact pt-0">
        <div className="container-page">
          <div className="overflow-hidden rounded-lg border border-line shadow-[0_12px_26px_rgb(24_23_21/0.035)]">
            {config.sections.map((section, index) => <LegalRow key={section.title} id={`legal-section-${index + 1}`} section={section} />)}
          </div>
        </div>
      </section>

      <section className="section-compact pt-0">
        <div className="container-page grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {contactCards.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="grid min-h-24 grid-cols-[1fr_48px] items-center gap-3 rounded-lg border border-line bg-white/72 p-4 text-right">
                <div>
                  <h3 className="font-display text-base font-extrabold text-navy">{item.title}</h3>
                  <p className="mt-1 text-xs font-bold text-muted">{item.value}</p>
                </div>
                <Icon className="h-9 w-9 text-[#A7815E]" />
              </article>
            );
          })}
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
