import { createFileRoute } from "@tanstack/react-router";
import {
  Search, MapPin, Building2, ArrowLeft, Plus, FileText,
  ShieldCheck, Layers, Megaphone, FileCheck, Handshake,
  ChevronDown, Phone, Mail, Globe, Target,
  Users, Sparkles, Award, Newspaper, BookOpen,
} from "lucide-react";
import heroSketch from "@/assets/hero-sketch.jpg";
import assetLand from "@/assets/asset-land.jpg";
import assetTower from "@/assets/asset-tower.jpg";
import assetVilla from "@/assets/asset-villa.jpg";
import assetCommercial from "@/assets/asset-commercial.jpg";
import newsHero from "@/assets/news-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "مهابة — إدارة المساهمات العقارية" },
      { name: "description", content: "نحوّل الأصول العقارية إلى مساهمات استثمارية ومشاريع منظمة وفق أعلى معايير الحوكمة والامتثال." },
    ],
  }),
  component: Index,
});

const navLinks = [
  { label: "الرئيسية", href: "#" },
  { label: "مهابة", href: "#about" },
  { label: "الأصول", href: "#assets" },
  { label: "المساهمات", href: "#contributions" },
  { label: "المركز الإعلامي", href: "#media" },
  { label: "تواصل معنا", href: "#contact" },
];

const assets = [
  { title: "أرض شمال الرياض", city: "الرياض", area: "25,750", use: "سكني", img: assetLand },
  { title: "برج المروج", city: "الرياض", area: "18,600", use: "تجاري", img: assetTower },
  { title: "أرض الواحة", city: "جدة", area: "32,500", use: "سكني", img: assetVilla },
  { title: "مجمع النخيل التجاري", city: "الرياض", area: "25,000", use: "تجاري", img: assetCommercial },
];

const contributions = [
  { name: "مساهمة النخيل التجاري", city: "الرياض", status: "قيد التقييم", value: "75", contributors: "1,200", months: "36" },
  { name: "مساهمة المروج", city: "الدمام", status: "قيد الطرح", value: "90", contributors: "950", months: "36" },
  { name: "مساهمة الواحة", city: "جدة", status: "قيد الهيكلة", value: "210", contributors: "1,800", months: "42" },
  { name: "مساهمة النخيل", city: "الرياض", status: "قيد التقييم", value: "75", contributors: "750", months: "36" },
];

const journey = [
  { icon: Sparkles, label: "استقبال الأصل" },
  { icon: FileText, label: "الدراسة" },
  { icon: Layers, label: "الهيكلة" },
  { icon: FileCheck, label: "الترخيص" },
  { icon: Megaphone, label: "الطرح" },
  { icon: ShieldCheck, label: "الإدارة" },
  { icon: Handshake, label: "التخارج" },
];

const stats = [
  { value: "28", label: "أصول قيد الدراسة", sub: "بقيمة تقديرية تتجاوز 3.6 مليار ريال", icon: Building2 },
  { value: "14", label: "مساهمات قيد الإدارة", sub: "بقيمة إجمالية تتجاوز 2.6 مليار ريال", icon: Users },
  { value: "+120", label: "مزود خدمات معتمدين", sub: "من شركاء خبرة موثوقين", icon: Sparkles },
  { value: "9", label: "فرص استثمارية", sub: "جارٍ دراستها وتحويلها لمساهمات", icon: Target },
];

const partners = ["PIF", "SNB", "PwC", "KPMG", "JLL", "Colliers", "Knight Frank"];

const news = [
  { date: "8 مايو 2024", title: "مهابة توقّع اتفاقية مع شركة رائدة لتطوير الأصول العقارية" },
  { date: "2 مايو 2024", title: "مساهمة جديدة في مدينة الدمام تنطلق رسمياً للاكتتاب" },
  { date: "20 أبريل 2024", title: "مشاركة في مؤتمر مستقبل الاستثمار العقاري 2024" },
  { date: "10 أبريل 2024", title: "تحديث حول أداء المساهمات العقارية القائمة" },
];

const faqs = [
  "كيف يتم تحويل الأصل إلى مساهمة عقارية؟",
  "ما هي مزايا الاستثمار في مساهمة عقارية؟",
  "ما هي رسوم الاشتراك في المساهمة؟",
  "ما هو الحد الأدنى للاكتتاب؟",
  "ما هي آلية توزيع الأرباح؟",
  "ما هي مدة دراسة الأصول؟",
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Assets />
      <Contributions />
      <Journey />
      <Media />
      <Knowledge />
      <Stats />
      <Partners />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/85 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between gap-6">
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-md border border-copper/40 grid place-items-center bg-parchment-dark">
            <div className="absolute inset-1 border border-copper/30 rounded-sm" />
            <span className="font-display text-copper-deep text-xl font-bold">م</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-xl font-bold tracking-tight">مهابة</div>
            <div className="text-[10px] text-muted-foreground tracking-widest">إدارة المساهمات العقارية</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-8 text-sm">
          {navLinks.map((l, i) => (
            <a key={l.href} href={l.href} className={`relative transition hover:text-copper-deep ${i === 0 ? "text-copper-deep" : "text-foreground/80"}`}>
              {l.label}
              {i === 0 && <span className="absolute -bottom-2 right-0 left-0 h-px bg-copper" />}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button className="hidden md:inline-flex items-center gap-2 px-4 h-10 text-sm rounded-md border border-border bg-card hover:bg-secondary transition">
            <FileText className="w-4 h-4 text-copper-deep" />
            طلب دراسة عقارية
          </button>
          <button className="inline-flex items-center gap-2 px-4 h-10 text-sm rounded-md bg-copper-deep text-primary-foreground hover:bg-copper transition shadow-sm">
            <Plus className="w-4 h-4" />
            اعرض أصلك العقاري
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img src={heroSketch} alt="" className="w-full h-full object-cover opacity-90" width={1920} height={900} />
        <div className="absolute inset-0 bg-gradient-to-b from-parchment/30 via-parchment/40 to-background" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-20 pb-32 lg:pt-32 lg:pb-44">
        <div className="flex flex-wrap justify-between gap-4 mb-12 text-xs tracking-widest text-copper-deep/90">
          <span className="px-3 py-1 rounded-full border border-copper/30 bg-parchment/70 backdrop-blur">مرحلة الانتهاء</span>
          <span className="px-3 py-1 rounded-full border border-copper/30 bg-parchment/70 backdrop-blur">مرحلة البناء</span>
          <span className="px-3 py-1 rounded-full border border-copper/30 bg-parchment/70 backdrop-blur">أرض فضاء</span>
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] font-bold tracking-tight">
            نحوّل الأصول العقارية
            <br />
            <span className="text-copper-deep">إلى مساهمات استثمارية</span>
            <br />
            <span className="text-foreground/90">ومشاريع وفق أعلى معايير الحوكمة</span>
          </h1>

          <div className="mt-12 mx-auto max-w-3xl rounded-2xl bg-card/95 backdrop-blur border border-border shadow-[0_30px_80px_-40px_rgba(60,40,20,0.4)] p-2 flex flex-col md:flex-row items-stretch gap-2">
            <div className="flex-1 flex items-center gap-3 px-4 h-12 rounded-lg hover:bg-secondary/40 transition">
              <Search className="w-4 h-4 text-copper-deep shrink-0" />
              <input
                placeholder="ابحث عن مزود خدمة عقارية"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground text-right"
              />
            </div>
            <div className="hidden md:block w-px bg-border my-2" />
            <div className="flex items-center gap-3 px-4 h-12 rounded-lg hover:bg-secondary/40 transition cursor-pointer text-sm">
              <Building2 className="w-4 h-4 text-copper-deep" />
              <span>نوع الخدمة</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="hidden md:block w-px bg-border my-2" />
            <div className="flex items-center gap-3 px-4 h-12 rounded-lg hover:bg-secondary/40 transition cursor-pointer text-sm">
              <MapPin className="w-4 h-4 text-copper-deep" />
              <span>المدينة</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-lg bg-copper-deep text-primary-foreground hover:bg-copper transition font-medium">
              <Search className="w-4 h-4" />
              بحث
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div className="text-center mb-12 max-w-2xl mx-auto">
      {eyebrow && (
        <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] text-copper-deep uppercase mb-3">
          <span className="w-8 h-px bg-copper" />
          {eyebrow}
          <span className="w-8 h-px bg-copper" />
        </div>
      )}
      <h2 className="font-display text-4xl md:text-5xl font-bold mb-3">{title}</h2>
      {sub && <p className="text-muted-foreground leading-relaxed">{sub}</p>}
    </div>
  );
}

function Assets() {
  return (
    <section id="assets" className="py-24 paper-texture">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="فرص متاحة"
          title="الأصول العقارية"
          sub="مجموعة مختارة من الأصول العقارية القابلة للدراسة والتطوير والتحويل إلى فرص استثمارية منظمة."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {assets.map((a) => (
            <article key={a.title} className="card-sketch card-sketch-hover rounded-xl overflow-hidden group">
              <div className="relative aspect-[4/3] overflow-hidden bg-parchment-dark">
                <img src={a.img} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                <span className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full bg-card/95 backdrop-blur border border-copper/30 text-copper-deep tracking-wider">
                  قيد الدراسة
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-bold text-lg">{a.title}</h3>
                  <span className="text-xs text-muted-foreground">{a.city}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <div className="text-[11px] text-muted-foreground mb-1">المساحة</div>
                    <div className="font-medium">{a.area} م²</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground mb-1">الاستخدام</div>
                    <div className="font-medium">{a.use}</div>
                  </div>
                </div>
                <button className="w-full text-sm py-2.5 rounded-md border border-copper/40 text-copper-deep hover:bg-copper-deep hover:text-primary-foreground transition flex items-center justify-center gap-2 group/btn">
                  عرض التفاصيل
                  <ArrowLeft className="w-3.5 h-3.5 transition group-hover/btn:-translate-x-1" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contributions() {
  return (
    <section id="contributions" className="py-24 bg-ink text-ink-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "32px 32px",
      }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-copper to-transparent" />

      <div className="mx-auto max-w-7xl px-6 relative">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] text-copper uppercase mb-3">
            <span className="w-8 h-px bg-copper" />
            استثمار منظم
            <span className="w-8 h-px bg-copper" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-3">المساهمات العقارية</h2>
          <p className="text-ink-foreground/60 max-w-2xl mx-auto">
            مساهمات عقارية تُدار وفق أعلى معايير الحوكمة والشفافية حتى التخارج.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {contributions.map((c) => (
            <div key={c.name} className="relative rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur p-6 hover:border-copper/40 transition group">
              <div className="absolute top-0 right-6 -translate-y-1/2 text-[10px] px-2.5 py-1 rounded-full bg-copper text-ink font-medium tracking-wider">
                {c.status}
              </div>
              <div className="mb-5">
                <h3 className="font-display font-bold text-lg mb-1">{c.name}</h3>
                <div className="text-xs text-copper/90">{c.city}</div>
              </div>

              <div className="relative flex items-center justify-between mb-6 px-1">
                <div className="absolute right-2 left-2 top-[5px] h-px bg-white/10" />
                {["الدراسة", "الهيكلة", "الطرح", "التنفيذ", "التخارج"].map((s, i) => (
                  <div key={s} className="relative z-10 flex flex-col items-center gap-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${i < 2 ? "bg-copper" : "bg-white/15 border border-white/20"}`} />
                    <span className="text-[9px] text-ink-foreground/40 tracking-tight">{s}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center border-t border-white/10 pt-4">
                <div>
                  <div className="text-[10px] text-ink-foreground/50 mb-1">قيمة المشروع</div>
                  <div className="font-display font-bold text-copper text-lg">{c.value}<span className="text-[10px] text-ink-foreground/50 mr-1">م</span></div>
                </div>
                <div>
                  <div className="text-[10px] text-ink-foreground/50 mb-1">المساهمين</div>
                  <div className="font-display font-bold text-lg">{c.contributors}</div>
                </div>
                <div>
                  <div className="text-[10px] text-ink-foreground/50 mb-1">المدة</div>
                  <div className="font-display font-bold text-lg">{c.months}<span className="text-[10px] text-ink-foreground/50 mr-1">شهر</span></div>
                </div>
              </div>

              <button className="mt-5 w-full text-xs py-2 rounded-md border border-copper/40 text-copper hover:bg-copper hover:text-ink transition">
                عرض التفاصيل
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader title="رحلة مهابة" sub="من استقبال الأصل وحتى التخارج، رحلة منظمة وشفافة في كل مرحلة." />

        <div className="relative">
          <div className="absolute top-8 right-8 left-8 h-px bg-gradient-to-l from-transparent via-copper/40 to-transparent" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6 relative">
            {journey.map((j, i) => (
              <div key={j.label} className="flex flex-col items-center text-center">
                <div className="relative w-16 h-16 rounded-full bg-parchment-dark border border-copper/40 grid place-items-center shadow-sm">
                  <j.icon className="w-6 h-6 text-copper-deep" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-copper-deep text-primary-foreground text-[10px] grid place-items-center font-bold">
                    {i + 1}
                  </span>
                </div>
                <div className="mt-3 text-sm font-medium">{j.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Media() {
  return (
    <section id="media" className="py-24 bg-parchment-dark/40 paper-texture">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] text-copper-deep uppercase mb-3">
              <Newspaper className="w-3.5 h-3.5" /> آخر المستجدّات
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold">المركز الإعلامي والمعرفي</h2>
          </div>
          <a href="#" className="text-sm text-copper-deep hover:text-copper inline-flex items-center gap-1">
            عرض جميع الأخبار <ArrowLeft className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <article className="lg:col-span-3 card-sketch rounded-2xl overflow-hidden group">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img src={newsHero} alt="featured" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 right-0 left-0 p-8">
                <span className="text-[11px] px-2 py-1 rounded-full bg-copper text-ink tracking-wider">12 مايو 2024</span>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white mt-3 leading-snug">
                  مهابة تعلن عن شراكة استراتيجية لتطوير مشاريع نوعية في الرياض
                </h3>
                <button className="mt-4 inline-flex items-center gap-2 text-sm text-white border-b border-copper pb-1 hover:gap-3 transition-all">
                  اقرأ الخبر <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </article>

          <div className="lg:col-span-2 space-y-4">
            {news.map((n) => (
              <article key={n.title} className="card-sketch card-sketch-hover rounded-xl p-5 flex gap-4 items-start">
                <div className="w-14 h-14 rounded-lg bg-parchment-dark border border-copper/30 grid place-items-center shrink-0">
                  <Newspaper className="w-5 h-5 text-copper-deep" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-copper-deep mb-1">{n.date}</div>
                  <h4 className="font-display font-bold leading-snug">{n.title}</h4>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Knowledge() {
  const tabs = ["دراسات", "أدلة استثمارية", "حوكمة المساهمات", "تحليلات السوق", "أفضل الممارسات"];
  const articles = [
    "دراسات جدوى المشاريع العقارية",
    "خطوات هيكلة الأصول العقارية",
    "مستقبل الاستثمار العقاري في السعودية",
    "اتجاهات السوق العقاري في المملكة 2024",
    "دليل المستثمر في المساهمات العقارية",
  ];
  const imgs = [assetLand, assetVilla, assetCommercial, assetTower, assetLand];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold inline-flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-copper-deep" />
            مكتبة المعرفة
          </h2>
          <div className="flex flex-wrap gap-2">
            {tabs.map((t, i) => (
              <button key={t} className={`px-4 py-1.5 text-xs rounded-full border transition ${i === 0 ? "bg-copper-deep text-primary-foreground border-copper-deep" : "border-border hover:border-copper/50"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
          {articles.map((title, i) => (
            <article key={title} className="card-sketch card-sketch-hover rounded-xl overflow-hidden group">
              <div className="aspect-[4/3] bg-parchment-dark overflow-hidden">
                <img src={imgs[i]} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold text-sm leading-snug mb-2 min-h-[2.5rem]">{title}</h3>
                <div className="text-[11px] text-muted-foreground">{1 + i * 4} أبريل 2024</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="py-20 border-y border-border bg-parchment-dark/30">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg border border-copper/40 bg-card grid place-items-center shrink-0">
              <s.icon className="w-5 h-5 text-copper-deep" />
            </div>
            <div>
              <div className="font-display text-4xl font-bold text-copper-deep">{s.value}</div>
              <div className="font-medium text-sm mt-1">{s.label}</div>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Partners() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h3 className="font-display text-xl text-muted-foreground mb-8 inline-flex items-center gap-3">
          <Award className="w-5 h-5 text-copper-deep" /> شركاء النجاح
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {partners.map((p) => (
            <div key={p} className="font-display text-2xl font-bold text-foreground/40 hover:text-copper-deep transition tracking-wider">
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="py-24 bg-parchment-dark/30">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeader title="الأسئلة الشائعة" />
        <div className="grid sm:grid-cols-2 gap-3">
          {faqs.map((q) => (
            <details key={q} className="group card-sketch rounded-lg px-5 py-4 cursor-pointer">
              <summary className="flex items-center justify-between gap-3 list-none">
                <span className="font-medium text-sm">{q}</span>
                <ChevronDown className="w-4 h-4 text-copper-deep transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                نحرص في مهابة على تقديم إجابات شفافة ومفصّلة لكل استفسار، وفق أعلى معايير الحوكمة والامتثال.
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-copper/30 bg-gradient-to-bl from-parchment-dark via-parchment to-parchment-dark p-10 md:p-16">
          <div className="absolute -bottom-10 -left-10 w-80 h-80 rounded-full bg-copper/10 blur-3xl" />
          <div className="absolute -top-10 -right-10 w-80 h-80 rounded-full bg-copper-deep/10 blur-3xl" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-xs tracking-[0.3em] text-copper-deep uppercase mb-3">انضم إلى مهابة</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-4">
                هل تمتلك أصلاً عقارياً؟
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                قد يكون أصلك مؤهلاً للتحول إلى مساهمة عقارية أو مشروع استثماري منظم.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
              <button className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-md bg-copper-deep text-primary-foreground hover:bg-copper transition font-medium">
                <Plus className="w-4 h-4" /> اعرض أصلك العقاري
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-md border border-copper-deep text-copper-deep hover:bg-copper-deep hover:text-primary-foreground transition font-medium">
                <FileText className="w-4 h-4" /> طلب دراسة عقارية
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-ink text-ink-foreground pt-16 pb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-copper to-transparent" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-md border border-copper/40 grid place-items-center">
                <span className="font-display text-copper text-xl font-bold">م</span>
              </div>
              <div>
                <div className="font-display text-xl font-bold">مهابة</div>
                <div className="text-[10px] text-ink-foreground/50 tracking-widest">إدارة المساهمات العقارية</div>
              </div>
            </div>
            <p className="text-sm text-ink-foreground/60 leading-relaxed font-display italic">
              حيث نصان الثروة ونبني الأصول.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4 text-copper">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-ink-foreground/70">
              {navLinks.map((l) => <li key={l.href}><a href={l.href} className="hover:text-copper transition">{l.label}</a></li>)}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4 text-copper">خدماتنا</h4>
            <ul className="space-y-2 text-sm text-ink-foreground/70">
              <li>دراسة الأصول العقارية</li>
              <li>الهيكلة الاستثمارية</li>
              <li>إدارة المساهمات</li>
              <li>الطرح والاكتتاب</li>
              <li>إدارة المشروع حتى التخارج</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4 text-copper">بيانات التواصل</h4>
            <ul className="space-y-3 text-sm text-ink-foreground/70">
              <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-copper" /> 0510515010</li>
              <li className="flex items-center gap-3"><Globe className="w-4 h-4 text-copper" /> mahabah.sa</li>
              <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-copper" /> info@mahabah.sa</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ink-foreground/50">
          <div>© مهابة لإدارة المساهمات العقارية، 2026 — جميع الحقوق محفوظة.</div>
          <div>حيث نصان الثروة ونبني الأصول</div>
        </div>
      </div>
    </footer>
  );
}
