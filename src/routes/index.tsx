import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  Search,
  MapPin,
  Building2,
  ArrowLeft,
  Plus,
  FileText,
  ShieldCheck,
  Layers,
  Megaphone,
  FileCheck,
  Handshake,
  ChevronDown,
  Phone,
  Mail,
  Globe,
  Target,
  Users,
  Sparkles,
  Award,
  Newspaper,
  BookOpen,
  Calendar,
  FileDown,
  TrendingUp,
  Clock,
  CheckCircle2,
  Lock,
  Map,
  Scale,
  Menu,
  X,
  ArrowRight,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Info,
} from "lucide-react";

import heroSketch from "@/assets/hero-sketch.png";
import assetLand from "@/assets/asset-land.png";
import assetTower from "@/assets/asset-tower.png";
import assetVilla from "@/assets/asset-villa.png";
import assetCommercial from "@/assets/asset-commercial.png";
import newsHero from "@/assets/news-hero.jpg";
import ctaBanner from "@/assets/cta-banner.jpg";
import contactPerson from "@/assets/contact-person.jpg";
import footerBg from "@/assets/footer-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "مهابة — إدارة المساهمات العقارية" },
      {
        name: "description",
        content:
          "نحوّل الأصول العقارية إلى مساهمات استثمارية ومشاريع منظمة وفق أعلى معايير الحوكمة والامتثال.",
      },
    ],
  }),
  component: Index,
});

// TYPES & MOCK DATA
interface Asset {
  id: number;
  title: string;
  city: string;
  area: string; // in sqm
  use: string;
  type: string;
  deedNumber: string;
  listedDate: string;
  status: "تحت الدراسة" | "تحت الهيكلة" | "تحت الطرح" | "مفتوحة" | "مغلقة";
  img: string;
  description: string;
  coordinates: { lat: number; lng: number };
}

interface Contribution {
  id: number;
  name: string;
  assetId: number;
  city: string;
  status:
    | "تحت الدراسة"
    | "تحت الطرح"
    | "مفتوحة"
    | "مغلقة"
    | "قيد التقييم"
    | "قيد الطرح"
    | "قيد الهيكلة";
  capital: number; // in SAR
  expectedReturn: string;
  duration: string;
  fundingPercentage: number;
  investorCount: number;
  description: string;
  timelineStep: number; // 0 to 4
  img: string;
}

const saudiCities = ["الرياض", "جدة", "الدمام", "الخبر", "القصيم"];
const assetTypes = ["أرض خام", "برج إداري", "مجمع تجاري", "أرض فضاء", "مجمع طبي"];
const usageTypes = ["سكني", "تجاري", "صناعي", "متعدد الاستخدامات"];

const mockAssets: Asset[] = [
  {
    id: 1,
    title: "أرض شمال الرياض",
    city: "الرياض",
    area: "25,750",
    use: "سكني",
    type: "أرض خام",
    deedNumber: "3600123457",
    listedDate: "15 مايو 2024",
    status: "تحت الدراسة",
    img: assetLand,
    description:
      "أرض سكنية متميزة تقع في شمال الرياض في موقع استراتيجي محاط بأرقى الأحياء وقريبة من الطرق الرئيسية والخدمات الحيوية كطريق الملك سلمان وطريق أبي بكر الصديق.",
    coordinates: { lat: 24.85, lng: 46.65 },
  },
  {
    id: 2,
    title: "برج المروج",
    city: "الرياض",
    area: "18,600",
    use: "تجاري",
    type: "برج إداري",
    deedNumber: "4100987654",
    listedDate: "2 يونيو 2024",
    status: "تحت الهيكلة",
    img: assetTower,
    description:
      "مبنى إداري ذكي بتصميم عصري يقع في قلب حي المروج المالي، مجهز بالكامل بأحدث التقنيات وأنظمة توفير الطاقة والاستدامة ومواقف ذكية متعددة الأدوار.",
    coordinates: { lat: 24.74, lng: 46.66 },
  },
  {
    id: 3,
    title: "أرض الواحة",
    city: "جدة",
    area: "32,500",
    use: "سكني",
    type: "أرض فضاء",
    deedNumber: "2200543210",
    listedDate: "28 مايو 2024",
    status: "تحت الدراسة",
    img: assetVilla,
    description:
      "أرض فضاء بمساحة واسعة في حي الواحة بمدينة جدة، مخصصة لتطوير مجمع مغلق يضم 75 فيلا سكنية فاخرة بنظام وتصاميم هندسية عصرية تلائم العائلات.",
    coordinates: { lat: 21.58, lng: 39.22 },
  },
  {
    id: 4,
    title: "مجمع النخيل التجاري",
    city: "الرياض",
    area: "25,000",
    use: "تجاري",
    type: "مجمع تجاري",
    deedNumber: "3400765432",
    listedDate: "10 أبريل 2024",
    status: "تحت الدراسة",
    img: assetCommercial,
    description:
      "مجمع تجاري حيوي يضم صالات عرض ومطاعم ومناطق ترفيهية متكاملة، يقع على طريق الملك فهد في قلب الرياض مما يجعله وجهة ممتازة للاستثمار والتسوق.",
    coordinates: { lat: 24.72, lng: 46.67 },
  },
  {
    id: 5,
    title: "أرض شرق الخبر",
    city: "الخبر",
    area: "16,400",
    use: "متعدد الاستخدامات",
    type: "أرض خام",
    deedNumber: "7800456123",
    listedDate: "8 مايو 2024",
    status: "تحت الدراسة",
    img: assetLand,
    description:
      "أرض خام بموقع فريد واستراتيجي على كورنيش الخبر مباشرة، تصلح لإقامة مجمع سكني وتجاري متكامل متعدد الأدوار وذو عائد استثماري مميز.",
    coordinates: { lat: 26.29, lng: 50.21 },
  },
  {
    id: 6,
    title: "أرض غرب القصيم",
    city: "القصيم",
    area: "23,300",
    use: "صناعي",
    type: "أرض فضاء",
    deedNumber: "9300654321",
    listedDate: "25 مايو 2024",
    status: "تحت الدراسة",
    img: assetLand,
    description:
      "أرض فضاء مسطحة تقع في غرب بريدة بمحاذاة الطرق اللوجستية الإقليمية، مهيأة بالكامل لإنشاء مستودعات حديثة ومراكز توزيع لدعم قطاع النقل والخدمات اللوجستية.",
    coordinates: { lat: 26.33, lng: 43.94 },
  },
];

const mockContributions: Contribution[] = [
  {
    id: 1,
    name: "مساهمة النخيل التجاري",
    assetId: 4,
    city: "الرياض",
    status: "قيد التقييم",
    capital: 75000000,
    expectedReturn: "14.2%",
    duration: "36 شهراً",
    fundingPercentage: 75,
    investorCount: 750,
    description:
      "مساهمة عقارية مرخصة ومغلقة تم الانتهاء من طرحها، تهدف لتطوير وتشغيل مجمع تجاري فاخر شمال مدينة الرياض وتوليد عوائد دورية ونمو رأسمالي قوي للمساهمين.",
    timelineStep: 3,
    img: assetCommercial,
  },
  {
    id: 2,
    name: "مساهمة المروج",
    assetId: 2,
    city: "الدمام",
    status: "قيد الطرح",
    capital: 90000000,
    expectedReturn: "12.6%",
    duration: "36 شهراً",
    fundingPercentage: 90,
    investorCount: 950,
    description:
      "مساهمة استثمارية مرخصة تهدف للاستحواذ على برج المروج المالي وإعادة هيكلته وتأجيره لجهات حكومية وخاصة كبرى بأسعار تنافسية وعقود طويلة الأجل.",
    timelineStep: 2,
    img: assetTower,
  },
  {
    id: 3,
    name: "مساهمة الواحة",
    assetId: 3,
    city: "جدة",
    status: "قيد الهيكلة",
    capital: 210000000,
    expectedReturn: "11.8%",
    duration: "42 شهراً",
    fundingPercentage: 210,
    investorCount: 1800,
    description:
      "مشروع تطوير عقاري لإقامة مجمع سكني مغلق يضم 75 فيلا فاخرة بتصاميم عمرانية عصرية في حي الواحة بجدة، مفتوح الآن للاكتتاب العام من قبل الأفراد والشركات.",
    timelineStep: 1,
    img: assetVilla,
  },
  {
    id: 4,
    name: "مساهمة النخيل",
    assetId: 1,
    city: "الرياض",
    status: "قيد التقييم",
    capital: 75000000,
    expectedReturn: "13.5%",
    duration: "36 شهراً",
    fundingPercentage: 75,
    investorCount: 750,
    description:
      "مساهمة عقارية مقترحة قيد الدراسة والتراخيص القانونية لتطوير برج النخيل السكني والتجاري الفاخر شمال الرياض بإطلالات مباشرة وجذابة.",
    timelineStep: 0,
    img: assetLand,
  },
];

const articles = [
  {
    category: "أخبار",
    date: "8 مايو 2024",
    title: "مهابة توقّع اتفاقية مع شركة رائدة لتطوير الأصول العقارية",
    desc: "أعلنت مهابة اليوم عن توقيع مذكرة تفاهم استراتيجية مع كبرى شركات التطوير الإنشائي في المنطقة بهدف حوكمة وإرساء معايير فنية عالية لمشاريع سكنية مقبلة.",
    img: assetVilla,
  },
  {
    category: "تقارير",
    date: "2 مايو 2024",
    title: "مساهمة جديدة في مدينة الدمام تنطلق رسمياً للاكتتاب العام",
    desc: "بدأ رسمياً طرح مجمع الصفوة الطبي بمدينة الدمام للاكتتاب العام للمساهمين برأس مال يبلغ 120 مليون ريال وعوائد إجمالية قوية ومحفزة.",
    img: assetCommercial,
  },
  {
    category: "دراسات",
    date: "20 أبريل 2024",
    title: "مشاركتنا في مؤتمر مستقبل الاستثمار العقاري والفرص البديلة",
    desc: "شاركت الإدارة التنفيذية لمهابة كمتحدث رئيسي في جلسات الحوار بمؤتمر الاستثمار العقاري لاستعراض نماذج الحوكمة الرقمية.",
    img: assetTower,
  },
  {
    category: "تحليلات",
    date: "10 أبريل 2024",
    title: "تحديث معمق وتفصيلي حول أداء المساهمات القائمة للربع الأول",
    desc: "أصدرت لجنة الرقابة تقرير الربع الأول الذي يوضح نسب إنجاز الأعمال الإنشائية في مشاريع الرياض وجدة مع استعراض التدفقات النقدية الجارية.",
    img: assetLand,
  },
];

const questions = [
  {
    category: "عامة",
    q: "ما هي المساهمة العقارية؟",
    a: "المساهمة العقارية هي مشروع استثماري عقاري مرخص يجمع مجموعة من المساهمين لتطوير أو تملك أصل عقاري وتقاسم عوائده التشغيلية أو الرأسمالية.",
  },
  {
    category: "عامة",
    q: "كيف يتم تحويل الأصل؟",
    a: "يتم ذلك عبر دراسة جدوى فنية ومالية للأصل أولاً، ثم صياغة مستندات الطرح، واستخراج ترخيص الطرح من الهيئة العامة للعقار، وربطه بحساب ضمان بنكي قبل الاكتتاب.",
  },
  {
    category: "عامة",
    q: "ما هي الرسوم؟",
    a: "تخضع دراسة الأصول وتأهيل المساهمات لرسوم فنية وإدارية معلنة تشمل دراسات الجدوى والتقييمات العقارية والرفع المساحي والتوثيق القانوني.",
  },
  {
    category: "المساهمات العقارية",
    q: "ما الحد الأدنى للاستثمار؟",
    a: "الحد الأدنى للمشاركة في المساهمات العقارية المطروحة هو 10,000 ريال سعودي، مقسمة إلى حصص متساوية قيمة الحصة 1,000 ريال.",
  },
  {
    category: "المساهمات العقارية",
    q: "كيف يتم توزيع الأرباح؟",
    a: "توزع العوائد التشغيلية الدورية (نصف سنوي غالباً) في حساب الضمان للمساهمين، أما العوائد الرأسمالية فتوزع بالكامل بعد تصفية الأصول وبيع الوحدات الإنشائية والتخارج النهائي.",
  },
];

function Index() {
  // CLIENT STATE ROUTER
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [selectedContributionId, setSelectedContributionId] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // GLOBAL SEARCH FILTER (From Hero)
  const [searchCity, setSearchCity] = useState("");
  const [searchAssetType, setSearchAssetType] = useState("");
  const [searchServiceType, setSearchServiceType] = useState("");

  // Sync hash routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash || "#home";
      const cleanHash = hash.replace("#", "");

      setMobileMenuOpen(false);

      if (cleanHash.startsWith("assets/")) {
        const id = parseInt(cleanHash.split("/")[1]);
        setSelectedAssetId(id);
        setCurrentPage("asset-details");
      } else if (cleanHash.startsWith("contributions/")) {
        const id = parseInt(cleanHash.split("/")[1]);
        setSelectedContributionId(id);
        setCurrentPage("contribution-details");
      } else {
        setCurrentPage(cleanHash);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleHash);
    handleHash(); // on mount

    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const navigateTo = (path: string) => {
    window.location.hash = path;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-copper-deep selection:text-white">
      {/* GLOBAL HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/90 border-b border-border/70 shadow-sm transition-all duration-300">
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between gap-6">
          {/* Logo on the right */}
          <a href="#home" className="flex items-center gap-3 group shrink-0">
            {/* Custom Premium Pillar SVG Mark */}
            <div className="relative w-12 h-12 rounded-lg border border-copper/50 grid place-items-center bg-parchment-dark shadow-inner overflow-hidden">
              <div className="absolute inset-1 border border-copper/20 rounded-md" />
              <svg
                className="w-6 h-6 text-copper-deep"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 5V19M12 3V21M18 5V19"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path d="M3 19H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="leading-tight text-right">
              <div className="font-display text-2xl font-bold tracking-tight text-foreground group-hover:text-copper transition">
                مهابة
              </div>
              <div className="text-[9px] text-muted-foreground tracking-wider uppercase font-semibold">
                إدارة المساهمات العقارية
              </div>
            </div>
          </a>

          {/* Navigation Items (Center) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {[
              { label: "الرئيسية", hash: "home" },
              { label: "المساهمات العقارية", hash: "contributions" },
              { label: "مهابة", hash: "about" },
              { label: "المركز الإعلامي", hash: "media" },
              { label: "الأسئلة الشائعة", hash: "faq" },
              { label: "تواصل معنا", hash: "request-study" },
            ].map((link) => {
              const isActive =
                currentPage === link.hash ||
                (link.hash === "assets" && currentPage === "asset-details") ||
                (link.hash === "contributions" && currentPage === "contribution-details");
              return (
                <a
                  key={link.hash}
                  href={`#${link.hash}`}
                  className={`relative py-2 transition-all duration-200 hover:text-copper-deep ${isActive ? "text-copper-deep font-semibold" : "text-foreground/80"}`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 right-0 left-0 h-[2px] bg-copper rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action CTAs (Left) */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#request-study"
              className="inline-flex items-center gap-2 px-4 h-11 text-xs font-semibold rounded-md border border-copper/40 bg-card hover:bg-parchment-dark text-copper-deep transition shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              طلب دراسة عقارية
            </a>
            <a
              href="#request-study"
              className="inline-flex items-center gap-2 px-4.5 h-11 text-xs font-semibold rounded-md bg-copper-deep text-white hover:bg-copper transition shadow-md hover:shadow-copper/10"
            >
              <Plus className="w-3.5 h-3.5" />
              عرض أصلك العقاري
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-parchment-dark transition text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/70 bg-background/95 backdrop-blur-md absolute top-20 left-0 right-0 p-6 shadow-xl flex flex-col gap-4 animate-fadeIn">
            {[
              { label: "الرئيسية", hash: "home" },
              { label: "المساهمات العقارية", hash: "contributions" },
              { label: "مهابة", hash: "about" },
              { label: "المركز الإعلامي", hash: "media" },
              { label: "الأسئلة الشائعة", hash: "faq" },
              { label: "تواصل معنا", hash: "request-study" },
            ].map((link) => (
              <a
                key={link.hash}
                href={`#${link.hash}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 text-base font-medium border-b border-border/40 ${currentPage === link.hash ? "text-copper-deep" : "text-foreground/80"}`}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3.5 pt-4">
              <a
                href="#request-study"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-sm font-semibold rounded-md border border-copper/40 bg-card text-copper-deep hover:bg-parchment-dark transition"
              >
                طلب دراسة عقارية
              </a>
              <a
                href="#request-study"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-sm font-semibold rounded-md bg-copper-deep text-white hover:bg-copper transition"
              >
                عرض أصلك العقاري
              </a>
            </div>
          </div>
        )}
      </header>

      {/* PAGE CONTAINER */}
      <main className="flex-1">
        {currentPage === "home" && (
          <PageHome
            navigateTo={navigateTo}
            setSearchCity={setSearchCity}
            setSearchAssetType={setSearchAssetType}
            setSearchServiceType={setSearchServiceType}
          />
        )}
        {currentPage === "about" && <PageAbout />}
        {currentPage === "assets" && (
          <PageAssets
            searchCity={searchCity}
            searchAssetType={searchAssetType}
            setSearchCity={setSearchCity}
            setSearchAssetType={setSearchAssetType}
          />
        )}
        {currentPage === "asset-details" && (
          <PageAssetDetails id={selectedAssetId} navigateTo={navigateTo} />
        )}
        {currentPage === "contributions" && <PageContributions />}
        {currentPage === "contribution-details" && (
          <PageContributionDetails id={selectedContributionId} />
        )}
        {currentPage === "request-study" && <PageRequestStudy />}
        {currentPage === "media" && <PageMedia />}
        {currentPage === "faq" && <PageFAQ />}
      </main>

      {/* GLOBAL FOOTER */}
      <Footer navigateTo={navigateTo} />
    </div>
  );
}

// ----------------------------------------------------
// PAGE 1: HOME COMPONENT (MOCK 1 LAYOUT)
// ----------------------------------------------------
function PageHome({
  navigateTo,
  setSearchCity,
  setSearchAssetType,
  setSearchServiceType,
}: {
  navigateTo: (p: string) => void;
  setSearchCity: (c: string) => void;
  setSearchAssetType: (t: string) => void;
  setSearchServiceType: (s: string) => void;
}) {
  const [cityVal, setCityVal] = useState("");
  const [typeVal, setTypeVal] = useState("");
  const [serviceVal, setServiceVal] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchCity(cityVal);
    setSearchAssetType(typeVal);
    setSearchServiceType(serviceVal);
    navigateTo("assets");
  };

  return (
    <div className="animate-fadeIn">
      {/* SECTION 1: HERO */}
      <section className="relative min-h-[85vh] flex items-center pt-10 pb-28 overflow-hidden border-b border-border/60">
        {/* Background Sketch Image Overlayed with Premium Radial Fades */}
        <div className="absolute inset-0 -z-10">
          <img
            src={heroSketch}
            alt="Saudi architectural draft"
            className="w-full h-full object-cover object-center opacity-85 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-parchment/20 via-background/95 to-background" />
        </div>

        <div className="mx-auto max-w-7xl px-6 w-full relative z-10 text-center">
          <div className="mb-6 inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-copper/35 bg-parchment/80 backdrop-blur-sm text-xs font-bold text-copper-deep">
            <Sparkles className="w-3.5 h-3.5" />
            تحت إشراف وتراخيص الهيئة العامة للعقار بالمملكة
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-[4.75rem] leading-[1.2] font-black tracking-tight max-w-5xl mx-auto text-foreground">
            تحويل الأصول العقارية إلى
            <br />
            <span className="text-copper-deep bg-gradient-to-l from-copper-deep to-copper bg-clip-text text-transparent">
              مساهمات عقارية ومشاريع استثمارية منظمة
            </span>
          </h1>
          <p className="mt-6 text-base md:text-lg max-w-2xl mx-auto text-muted-foreground/90 font-medium">
            وفق أعلى معايير الحوكمة والامتثال
          </p>

          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <a
              href="#request-study"
              className="px-8 h-13 inline-flex items-center justify-center font-bold text-sm rounded-md bg-copper-deep text-white hover:bg-copper transition-all duration-300 shadow-lg shadow-copper/25 hover:-translate-y-0.5"
            >
              ابدأ الآن
            </a>
            <a
              href="#about"
              className="px-8 h-13 inline-flex items-center justify-center font-bold text-sm rounded-md border border-copper/45 bg-card/65 backdrop-blur-sm text-copper-deep hover:bg-parchment-dark transition-all duration-300 hover:-translate-y-0.5"
            >
              اكتشف المزيد
            </a>
          </div>

          {/* Search Module Block */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-16 mx-auto max-w-4xl rounded-2xl bg-card border border-border/80 shadow-[0_25px_60px_-25px_rgba(40,20,5,0.15)] p-3 flex flex-col md:flex-row items-stretch gap-2.5"
          >
            <div className="flex-1 flex items-center gap-3 px-4 py-3 md:py-0 rounded-lg hover:bg-parchment-dark/50 transition">
              <MapPin className="w-5 h-5 text-copper shrink-0" />
              <div className="flex-1 text-right">
                <label className="block text-[10px] text-muted-foreground font-bold mb-0.5">
                  المدينة
                </label>
                <select
                  value={cityVal}
                  onChange={(e) => setCityVal(e.target.value)}
                  className="w-full bg-transparent outline-none text-xs md:text-sm font-semibold text-foreground cursor-pointer appearance-none pr-4"
                >
                  <option value="">كل المدن</option>
                  {saudiCities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="hidden md:block w-px bg-border/70 my-2.5" />

            <div className="flex-1 flex items-center gap-3 px-4 py-3 md:py-0 rounded-lg hover:bg-parchment-dark/50 transition">
              <Building2 className="w-5 h-5 text-copper shrink-0" />
              <div className="flex-1 text-right">
                <label className="block text-[10px] text-muted-foreground font-bold mb-0.5">
                  نوع الأصل
                </label>
                <select
                  value={typeVal}
                  onChange={(e) => setTypeVal(e.target.value)}
                  className="w-full bg-transparent outline-none text-xs md:text-sm font-semibold text-foreground cursor-pointer appearance-none pr-4"
                >
                  <option value="">كل الأنواع</option>
                  {assetTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="hidden md:block w-px bg-border/70 my-2.5" />

            <div className="flex-1 flex items-center gap-3 px-4 py-3 md:py-0 rounded-lg hover:bg-parchment-dark/50 transition">
              <Target className="w-5 h-5 text-copper shrink-0" />
              <div className="flex-1 text-right">
                <label className="block text-[10px] text-muted-foreground font-bold mb-0.5">
                  نوع الخدمة
                </label>
                <select
                  value={serviceVal}
                  onChange={(e) => setServiceVal(e.target.value)}
                  className="w-full bg-transparent outline-none text-xs md:text-sm font-semibold text-foreground cursor-pointer appearance-none pr-4"
                >
                  <option value="">كل الخدمات</option>
                  <option value="دراسة الأصل">دراسة أصل عقاري</option>
                  <option value="مساهمة استثمارية">مساهمة استثمارية</option>
                  <option value="تمويل تطوير">تمويل تطوير عقاري</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="py-3.5 px-8 inline-flex items-center justify-center gap-2 rounded-xl bg-copper-deep hover:bg-copper text-white transition font-bold text-sm shadow-md"
            >
              <Search className="w-4 h-4" />
              بحث
            </button>
          </form>
        </div>
      </section>

      {/* SECTION 2: VISION & MISSION */}
      <section className="py-24 border-b border-border/50 paper-texture">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <div className="card-sketch p-8 rounded-2xl bg-card flex flex-col gap-6 relative overflow-hidden group hover:border-copper/40 transition">
              <div className="absolute top-0 left-0 w-2 h-full bg-copper" />
              <div className="w-14 h-14 rounded-xl bg-parchment-dark border border-copper/30 grid place-items-center shrink-0">
                <svg
                  className="w-7 h-7 text-copper-deep"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">رؤيتنا</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  أن نكون الخيار الأول في إدارة المساهمات العقارية.
                </p>
              </div>
            </div>

            {/* Mission Card */}
            <div className="card-sketch p-8 rounded-2xl bg-card flex flex-col gap-6 relative overflow-hidden group hover:border-copper/40 transition">
              <div className="absolute top-0 left-0 w-2 h-full bg-copper-deep" />
              <div className="w-14 h-14 rounded-xl bg-parchment-dark border border-copper/30 grid place-items-center shrink-0">
                <svg
                  className="w-7 h-7 text-copper-deep"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">رسالتنا</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  تعظيم قيمة الأصول العقارية عبر حلول استثمارية منظمة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHAT MAHABAH PROVIDES */}
      <section className="py-24 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-extrabold text-foreground">
              ماذا تقدم مهابة؟
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">
              حلول تمويلية وتنظيمية متكاملة تغطي كافة مراحل الأصول.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                title: "دراسة الأصل",
                desc: "تحليل الإمكانيات الاستثمارية.",
                icon: Search,
                step: "1",
              },
              {
                title: "هيكلة المشروع",
                desc: "بناء الهيكل الاستثمارية.",
                icon: Layers,
                step: "2",
              },
              {
                title: "إدارة المساهمة",
                desc: "إدارة وتشغيل المشروع.",
                icon: ShieldCheck,
                step: "3",
              },
              {
                title: "الحوكمة والامتثال",
                desc: "إجراءات قانونية وتنظيمية.",
                icon: Scale,
                step: "4",
              },
              {
                title: "التخارج",
                desc: "إدارة توزيع العوائد.",
                icon: Handshake,
                step: "5",
              },
            ].map((item, idx) => (
              <div
                key={item.title}
                className="card-sketch p-6 rounded-xl bg-card border border-border/80 flex flex-col justify-between group hover:border-copper/40 transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <div className="w-12 h-12 rounded-lg bg-parchment-dark border border-copper/25 grid place-items-center text-copper-deep">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-copper/15">{item.step}</span>
                  </div>
                  <h4 className="font-display font-bold text-lg mb-2 text-foreground">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: GOVERNANCE & COMPLIANCE */}
      <section className="py-24 bg-parchment-dark/15 border-b border-border/50 paper-texture">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-extrabold text-foreground">
              الحوكمة والامتثال
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">
              بيئة استثمارية تحت الحوكمة والرقابة لضمان الحقوق.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "الالتزام بالأنظمة",
                desc: "مطابقة تامة لجميع اللوائح العقارية المعتمدة بوزارة الإسكان والهيئة العامة للعقار.",
                icon: FileCheck,
              },
              {
                title: "حوكمة الشركات",
                desc: "لجان مستقلة وصلاحيات مقسمة بوضوح بين المطور، مقاول التنفيذ، وإدارة المساهمة.",
                icon: Scale,
              },
              {
                title: "إدارة المخاطر",
                desc: "تحديد ودراسة وتقييم المخاطر العقارية والسوقية للمشروع قبل البدء وصياغة استراتيجية التخارج.",
                icon: ShieldCheck,
              },
              {
                title: "الشفافية والإفصاح",
                desc: "إعداد وإرسال تقارير هندسية ومالية دورية للمساهمين تكشف بوضوح نسب الإنجاز التشغيلي.",
                icon: Newspaper,
              },
            ].map((col) => (
              <div
                key={col.title}
                className="card-sketch p-6 rounded-xl bg-card border border-border/80 text-right flex flex-col gap-4"
              >
                <div className="w-11 h-11 rounded-lg bg-parchment-dark border border-copper/30 grid place-items-center text-copper-deep shrink-0">
                  <col.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-foreground mb-2">
                    {col.title}
                  </h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">{col.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: DIGITAL TRUST JOURNEY */}
      <section className="py-24 bg-ink text-ink-foreground relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-copper to-transparent" />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-[0.2em] text-copper uppercase block mb-3">
              رحلة الثقة الرقمية
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white">
              إجراءات الأمان والتوثيق
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line Connector */}
            <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-l from-white/10 via-copper/45 to-white/10 -translate-y-1/2 hidden lg:block" />

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
              {[
                {
                  step: "1",
                  title: "التحقق من الأفراد",
                  desc: "مطابقة الهوية الوطنية عبر النفاذ الوطني الموحد.",
                  icon: Users,
                },
                {
                  step: "2",
                  title: "حماية البيانات",
                  desc: "تشفير البيانات وحفظها وفق أعلى معايير الحماية السيبرانية.",
                  icon: Lock,
                },
                {
                  step: "3",
                  title: "التحقق من الأصول",
                  desc: "مراجعة الصكوك والتحقق من سلامتها مع كتابة العدل والبلدية.",
                  icon: Building2,
                },
                {
                  step: "4",
                  title: "التحقق من الشركات",
                  desc: "التأكد من السجلات التجارية والتراخيص وسوابق أعمال المطورين.",
                  icon: Scale,
                },
                {
                  step: "5",
                  title: "التوثيق الرقمي",
                  desc: "إصدار العقود والاتفاقيات بتواقيع رقمية معتمدة وقانونية.",
                  icon: FileCheck,
                },
              ].map((item, idx) => (
                <div key={item.title} className="flex flex-col items-center text-center group">
                  <div className="relative w-18 h-18 rounded-full border-2 border-copper/50 bg-ink hover:border-copper transition-all duration-300 grid place-items-center shadow-lg group-hover:scale-105">
                    <div className="absolute inset-1 border border-white/5 rounded-full" />
                    <item.icon className="w-7 h-7 text-copper" />
                    <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-copper text-ink text-xs font-black grid place-items-center">
                      {item.step}
                    </span>
                  </div>
                  <h4 className="font-display text-white font-bold text-base mt-5 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-ink-foreground/50 text-xs leading-relaxed max-w-[200px]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: CLOSING STATEMENT */}
      <section className="py-32 relative text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={footerBg} alt="" className="w-full h-full object-cover opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/50" />
        </div>

        <div className="mx-auto max-w-4xl px-6 relative z-10">
          <div className="relative w-24 h-24 mx-auto mb-10 rounded-full border border-copper/45 bg-card grid place-items-center shadow-lg">
            <svg
              className="w-10 h-10 text-copper-deep"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 5V19M12 3V21M18 5V19"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h2 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-tight tracking-tight">
            مهابة
          </h2>
          <p className="mt-4 font-display text-xl md:text-2xl text-copper-deep font-semibold italic">
            حيث تصان الثروة وتُبنى الأصول
          </p>
          <div className="w-24 h-0.5 bg-copper mx-auto mt-6" />
        </div>
      </section>
    </div>
  );
}

// ----------------------------------------------------
// PAGE 2: ABOUT COMPONENT
// ----------------------------------------------------
function PageAbout() {
  const values = [
    {
      name: "الشفافية",
      desc: "مشاركة تقارير الإنجاز ونسب الصرف المالي دورياً ودون تأخير مع المساهمين والمشرفين.",
    },
    {
      name: "الحوكمة",
      desc: "التزام كامل بالفصل القانوني بين إدارة المساهمة، المقاولين المنفذين ومطور المشروع.",
    },
    {
      name: "الاحترافية",
      desc: "إشراف هندسي ومالي رفيع المستوى من قبل خبراء يمتلكون سوابق إنجازات عقارية كبرى.",
    },
    {
      name: "الموثوقية",
      desc: "تقديم مساهمات عقارية مرخصة رسمياً ومحمية بالأنظمة والتعليمات التشريعية بوزارة الإسكان.",
    },
    {
      name: "الاستدامة",
      desc: "تبني تصاميم ومواد صديقة للبيئة وأنظمة البناء الذكية لرفع الجدوى والتشغيل المستقبلي.",
    },
  ];

  return (
    <div className="animate-fadeIn py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Page Hero */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-[0.2em] text-copper uppercase block mb-3">
            من نحن
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-foreground">
            من مهابة لإدارة المساهمات العقارية
          </h1>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            تأسست شركة مهابة ككيان سعودي استثماري رائد ومتخصص في إدارة وهيكلة المساهمات العقارية.
            نهدف لتقديم حلول بديلة ومبتكرة للتمويل العقاري والتطوير الإنشائي، مستلهمين من رؤية
            المملكة 2030 لتمكين الاستثمار المنظم والآمن.
          </p>
        </div>

        {/* Vision, Mission, Story Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-24">
          <div className="card-sketch p-8 rounded-2xl bg-card lg:col-span-2 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                قصتنا وتأسيسنا
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                بدأت مهابة كفكرة لسد الفجوة التنظيمية والتمويلية في قطاع الأصول العقارية غير
                المستغلة. من خلال جمع الأطراف الأساسية (مالك العقار، المطور المعتمد، المستثمر
                المؤهل)، وتحت إشراف مباشر وتراخيص رسمية من الهيئة العامة للعقار، استطعنا تقديم نموذج
                استثماري مبتكر يحول الأراضي الخام إلى مشاريع حيوية وواعدة تضيف قيمة حقيقية للناتج
                المحلي.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                ندير اليوم محفظة أصول عقارية كبرى تناهز المليارات، ونسعى للريادة عبر تبني
                التكنولوجيا المالية والتوقيعات الرقمية لتبسيط تجربة المستثمرين مع الحفاظ على أعلى
                معايير الحوكمة وإدارة المخاطر.
              </p>
            </div>
            <div className="border-t border-border/60 pt-6 mt-6 flex justify-between items-center text-xs text-muted-foreground">
              <span>تاريخ التأسيس: 2020م</span>
              <span>المقر الرئيسي: الرياض، المملكة العربية السعودية</span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="card-sketch p-8 rounded-2xl bg-card">
              <h3 className="font-display text-xl font-bold text-copper-deep mb-3">
                رؤيتنا الاستراتيجية
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                أن نكون الذراع الحوكمية والمظلة الاستثمارية الأولى للأصول والمساهمات العقارية في
                الشرق الأوسط، لنقود الابتكار العقاري والتنظيمي بكفاءة مطلقة.
              </p>
            </div>
            <div className="card-sketch p-8 rounded-2xl bg-card">
              <h3 className="font-display text-xl font-bold text-copper-deep mb-3">
                رسالتنا للمجتمع
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                تمكين المستثمرين والأفراد من تملك حصص مشاعة في أصول عقارية استراتيجية ومشاريع كبرى
                لا يمكن الوصول لها بشكل فردي، وتنميتها بأمان وثقة.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="font-display text-3xl font-extrabold text-foreground">
              القيم الراسخة في مهابة
            </h3>
            <p className="text-muted-foreground text-sm mt-2">
              المعايير والركائز المهنية التي يلتزم بها فريق عملنا كل يوم.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map((v) => (
              <div
                key={v.name}
                className="card-sketch p-6 rounded-xl bg-card hover:-translate-y-1 transition-all duration-300"
              >
                <h4 className="font-display text-lg font-bold text-copper-deep mb-2.5">{v.name}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-copper uppercase block mb-2">
              الهيكل الإداري
            </span>
            <h3 className="font-display text-3xl font-extrabold text-foreground">
              مجلس الإدارة والقيادة التنفيذية
            </h3>
            <p className="text-muted-foreground text-sm mt-2">
              نخبة من القيادات المالية والعقارية ذات الخبرة الطويلة بالأنظمة والأسواق.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "أ.د. عبد العزيز بن فهد",
                role: "رئيس مجلس الإدارة",
                bio: "أكثر من 25 عاماً في هيكلة المحافظ المالية والاستثمارية وعضو مجلس إدارة في عدة جهات حكومية.",
              },
              {
                name: "م. فهد بن خالد الرشيد",
                role: "الرئيس التنفيذي",
                bio: "خبرة هندسية وتطويرية ممتدة في أمانات المدن وقطاع إدارة التطوير العقاري الاستراتيجي.",
              },
              {
                name: "أ. محمد بن عبد الله السيف",
                role: "عضو مستقل - رئيس لجنة التدقيق",
                bio: "مستشار مالي معتمد وقانوني وخبير في مراجعة لوائح الالتزام والحوكمة للشركات المساهمة.",
              },
              {
                name: "د. نورة بنت سعد ال سعود",
                role: "عضو مجلس إدارة - مستشار تطوير أصول",
                bio: "أكاديمية وباحثة في التخطيط الحضري وتصميم المدن المستدامة ولها دراسات منشورة محلياً وعالمياً.",
              },
            ].map((member, idx) => (
              <div
                key={member.name}
                className="card-sketch p-6 rounded-xl bg-card text-center flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full border border-copper/45 bg-parchment-dark grid place-items-center text-copper-deep text-2xl font-black mb-4">
                  {member.name.charAt(member.name.indexOf(" ") + 1)}
                </div>
                <h4 className="font-display font-bold text-base text-foreground mb-1">
                  {member.name}
                </h4>
                <span className="text-[10px] font-bold text-copper bg-parchment/65 px-3 py-1 rounded-full mb-3">
                  {member.role}
                </span>
                <p className="text-muted-foreground text-xs leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Partners Section (Grayscale Layout) */}
        <div>
          <div className="text-center mb-10">
            <h3 className="font-display text-xl text-muted-foreground inline-flex items-center gap-3">
              <Award className="w-5 h-5 text-copper-deep" /> شركاء النجاح الاستراتيجيين
            </h3>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
            {["PIF", "SNB", "PwC", "KPMG", "JLL", "Colliers", "Knight Frank"].map((p) => (
              <div
                key={p}
                className="font-display text-2xl font-black text-foreground hover:text-copper hover:opacity-100 transition-all cursor-pointer tracking-wider"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// PAGE 3: REAL ESTATE ASSETS COMPONENT
// ----------------------------------------------------
function PageAssets({
  searchCity,
  searchAssetType,
  setSearchCity,
  setSearchAssetType,
}: {
  searchCity: string;
  searchAssetType: string;
  setSearchCity: (c: string) => void;
  setSearchAssetType: (t: string) => void;
}) {
  const [filterUse, setFilterUse] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterArea, setFilterArea] = useState("");

  const filteredAssets = useMemo(() => {
    return mockAssets.filter((asset) => {
      const cityMatch = !searchCity || asset.city === searchCity;
      const typeMatch = !searchAssetType || asset.type === searchAssetType;
      const useMatch = !filterUse || asset.use === filterUse;
      const statusMatch = !filterStatus || asset.status === filterStatus;

      // Simple area parsing for filtering
      let areaMatch = true;
      if (filterArea) {
        const areaNum = parseInt(asset.area.replace(",", ""));
        if (filterArea === "small") areaMatch = areaNum < 20000;
        else if (filterArea === "medium") areaMatch = areaNum >= 20000 && areaNum < 30000;
        else if (filterArea === "large") areaMatch = areaNum >= 30000;
      }

      return cityMatch && typeMatch && useMatch && statusMatch && areaMatch;
    });
  }, [searchCity, searchAssetType, filterUse, filterStatus, filterArea]);

  const clearFilters = () => {
    setSearchCity("");
    setSearchAssetType("");
    setFilterUse("");
    setFilterStatus("");
    setFilterArea("");
  };

  return (
    <div className="animate-fadeIn py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Title */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-copper uppercase tracking-wider block mb-2">
            المحفظة العقارية
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-foreground">
            الأصول العقارية المدرجة
          </h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">
            مجموعة مختارة من الأصول والفرص العقارية القابلة للدراسة والتأهيل للمساهمة.
          </p>
        </div>

        {/* Advanced Filters Bar */}
        <div className="bg-card border border-border/80 rounded-xl p-6 shadow-sm mb-10 flex flex-wrap items-center gap-4 justify-between">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            {/* City */}
            <div className="text-right">
              <label className="block text-[10px] font-bold text-muted-foreground mb-1">
                المدينة
              </label>
              <select
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="h-10 px-3 rounded-md border border-border bg-background text-xs font-semibold text-foreground"
              >
                <option value="">كل المدن</option>
                {saudiCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Asset Type */}
            <div className="text-right">
              <label className="block text-[10px] font-bold text-muted-foreground mb-1">
                نوع الأصل
              </label>
              <select
                value={searchAssetType}
                onChange={(e) => setSearchAssetType(e.target.value)}
                className="h-10 px-3 rounded-md border border-border bg-background text-xs font-semibold text-foreground"
              >
                <option value="">كل الأنواع</option>
                {assetTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Usage */}
            <div className="text-right">
              <label className="block text-[10px] font-bold text-muted-foreground mb-1">
                نوع الاستخدام
              </label>
              <select
                value={filterUse}
                onChange={(e) => setFilterUse(e.target.value)}
                className="h-10 px-3 rounded-md border border-border bg-background text-xs font-semibold text-foreground"
              >
                <option value="">كل الاستخدامات</option>
                {usageTypes.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="text-right">
              <label className="block text-[10px] font-bold text-muted-foreground mb-1">
                الحالة
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-10 px-3 rounded-md border border-border bg-background text-xs font-semibold text-foreground"
              >
                <option value="">كل الحالات</option>
                <option value="تحت الدراسة">تحت الدراسة</option>
                <option value="تحت الهيكلة">تحت الهيكلة</option>
                <option value="مفتوحة">مفتوحة</option>
                <option value="مغلقة">مغلقة</option>
              </select>
            </div>

            {/* Area */}
            <div className="text-right">
              <label className="block text-[10px] font-bold text-muted-foreground mb-1">
                المساحة
              </label>
              <select
                value={filterArea}
                onChange={(e) => setFilterArea(e.target.value)}
                className="h-10 px-3 rounded-md border border-border bg-background text-xs font-semibold text-foreground"
              >
                <option value="">كل المساحات</option>
                <option value="small">أقل من 20,000 م²</option>
                <option value="medium">20,000 - 30,000 م²</option>
                <option value="large">أكبر من 30,000 م²</option>
              </select>
            </div>
          </div>

          {(searchCity || searchAssetType || filterUse || filterStatus || filterArea) && (
            <button
              onClick={clearFilters}
              className="h-10 px-4 text-xs font-semibold rounded-md border border-border hover:bg-parchment-dark text-muted-foreground transition self-end"
            >
              إعادة تعيين
            </button>
          )}
        </div>

        {/* Assets Cards Grid */}
        {filteredAssets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredAssets.map((asset) => (
              <article
                key={asset.id}
                className="card-sketch card-sketch-hover rounded-2xl overflow-hidden group flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-parchment-dark shrink-0">
                  <img
                    src={asset.img}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <span className="absolute top-4 right-4 text-[10px] font-bold px-3 py-1 rounded-full bg-card border border-copper/35 text-copper-deep tracking-wider shadow-sm">
                    {asset.status}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <h3 className="font-display font-bold text-xl text-foreground group-hover:text-copper-deep transition">
                        {asset.title}
                      </h3>
                      <span className="text-xs font-semibold text-muted-foreground px-2 py-0.5 rounded bg-parchment-dark">
                        {asset.city}
                      </span>
                    </div>

                    <p className="text-muted-foreground text-xs leading-relaxed mb-5 line-clamp-2">
                      {asset.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-xs mb-6 border-t border-border/50 pt-4">
                      <div>
                        <div className="text-[10px] text-muted-foreground font-semibold mb-1">
                          المساحة الإجمالية
                        </div>
                        <div className="font-bold text-foreground text-sm">{asset.area} م²</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground font-semibold mb-1">
                          نوع الاستخدام
                        </div>
                        <div className="font-bold text-foreground text-sm">{asset.use}</div>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`#assets/${asset.id}`}
                    className="w-full h-11 text-xs font-semibold rounded-md border border-copper/40 text-copper-deep hover:bg-copper-deep hover:text-white transition flex items-center justify-center gap-2 group/btn shadow-sm"
                  >
                    عرض الأصل
                    <ArrowLeft className="w-3.5 h-3.5 transition group-hover/btn:-translate-x-1" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-2xl border border-border/80 p-8">
            <Building2 className="w-12 h-12 text-copper mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              لا توجد أصول مطابقة للفلاتر
            </h3>
            <p className="text-muted-foreground text-xs max-w-md mx-auto mb-6">
              جرّب تغيير خيارات الفلترة أو إعادة تعيين الفلاتر لعرض الأصول المتاحة.
            </p>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 bg-copper-deep text-white text-xs font-semibold rounded-md"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        )}

        {/* Pagination Section */}
        {filteredAssets.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button className="w-10 h-10 rounded-md border border-border flex items-center justify-center hover:bg-parchment-dark text-muted-foreground shrink-0">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-md border border-copper/50 bg-copper-deep text-white font-bold text-sm shrink-0">
              1
            </button>
            <button className="w-10 h-10 rounded-md border border-border hover:bg-parchment-dark text-foreground font-medium text-sm shrink-0">
              2
            </button>
            <button className="w-10 h-10 rounded-md border border-border flex items-center justify-center hover:bg-parchment-dark text-muted-foreground shrink-0">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// PAGE 4: ASSET DETAILS COMPONENT
// ----------------------------------------------------
function PageAssetDetails({
  id,
  navigateTo,
}: {
  id: number | null;
  navigateTo: (p: string) => void;
}) {
  const asset = useMemo(() => {
    return mockAssets.find((a) => a.id === (id || 1)) || mockAssets[0];
  }, [id]);

  const [activeTab, setActiveTab] = useState("about");
  const [galleryImg, setGalleryImg] = useState(asset.img);

  return (
    <div className="animate-fadeIn py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-6">
          <a href="#home" className="hover:text-copper">
            الرئيسية
          </a>
          <span>/</span>
          <a href="#assets" className="hover:text-copper">
            الأصول العقارية
          </a>
          <span>/</span>
          <span className="text-foreground">{asset.title}</span>
        </div>

        {/* Main Details Panel Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start mb-16">
          {/* LEFT: Large Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-border/80 bg-parchment-dark relative shadow-md">
              <img
                src={galleryImg}
                alt={asset.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 right-4 text-[10px] font-bold px-3 py-1 rounded-full bg-card border border-copper/35 text-copper-deep shadow-sm">
                {asset.status}
              </div>
            </div>

            {/* Thumbnail Slots */}
            <div className="grid grid-cols-4 gap-4">
              {[asset.img, assetLand, assetTower, assetCommercial].map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setGalleryImg(imgUrl)}
                  className={`aspect-[4/3] rounded-lg overflow-hidden border bg-parchment-dark transition ${galleryImg === imgUrl ? "border-copper-deep ring-2 ring-copper/30" : "border-border/80 hover:border-copper/45"}`}
                >
                  <img
                    src={imgUrl}
                    alt="gallery thumbnail"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Property Specification Panel */}
          <div className="lg:col-span-5 card-sketch p-8 rounded-2xl bg-card">
            <span className="text-[10px] font-black text-copper uppercase tracking-wider block mb-2">
              رقم الصك الموثق: {asset.deedNumber}
            </span>
            <h1 className="font-display text-3xl font-bold text-foreground mb-3">{asset.title}</h1>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-6">
              <MapPin className="w-4 h-4 text-copper shrink-0" />
              <span>{asset.city} — حي المخطط النموذجي</span>
            </div>

            {/* Spec Table */}
            <div className="space-y-4 border-y border-border/60 py-6 mb-8 text-sm">
              {[
                { label: "المدينة", val: asset.city },
                { label: "المساحة الإجمالية", val: `${asset.area} م²` },
                { label: "نوع الأصل", val: asset.type },
                { label: "نوع الاستخدام", val: asset.use },
                { label: "رقم الصك الشرعي", val: asset.deedNumber },
                { label: "تاريخ إدراج الأصل", val: asset.listedDate },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground text-xs font-medium">{row.label}</span>
                  <span className="font-bold text-foreground">{row.val}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3">
              <a
                href="#request-study"
                className="w-full h-12 inline-flex items-center justify-center gap-2 font-bold text-sm rounded-md bg-copper-deep text-white hover:bg-copper transition shadow-md"
              >
                <FileText className="w-4 h-4" />
                طلب دراسة
              </a>
              <a
                href="#request-study"
                className="w-full h-12 inline-flex items-center justify-center gap-2 font-bold text-sm rounded-md border border-copper/45 bg-card text-copper-deep hover:bg-parchment-dark transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                إضافة للمساهمات
              </a>
            </div>
          </div>
        </div>

        {/* TABS VIEW */}
        <div className="card-sketch rounded-2xl bg-card overflow-hidden mb-16">
          <div className="border-b border-border/60 flex flex-wrap bg-parchment-dark/30">
            {[
              { id: "about", label: "نبذة" },
              { id: "location", label: "الموقع" },
              { id: "attachments", label: "المرفقات" },
              { id: "documents", label: "المستندات" },
              { id: "status", label: "حالة الدراسة" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-xs font-bold transition-all border-b-2 ${activeTab === tab.id ? "border-copper-deep text-copper-deep bg-card" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === "about" && (
              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <h4 className="font-display font-bold text-lg text-foreground mb-2">
                  الملخص الاستثماري والمواصفات
                </h4>
                <p>{asset.description}</p>
                <p>
                  يتميز هذا الأصل بموقعه ضمن النطاق الحضري الجديد للمدينة، ويقع بمحاذاة مشاريع بنية
                  تحتية رئيسية مما يرفع من قيمته التقديرية. يعتبر خياراً مثالياً للتطوير السكني
                  والإنشائي المتكامل، ويحمل فرصة استثمارية ذات هوامش ربح متوقعة مرتفعة عند طرحه
                  كمساهمة عقارية.
                </p>
              </div>
            )}

            {activeTab === "location" && (
              <div className="space-y-6">
                <h4 className="font-display font-bold text-lg text-foreground mb-2">
                  إحداثيات وموقع الأصل الجغرافي
                </h4>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  يقع العقار في إحداثيات استراتيجية بمدينة {asset.city}، قريباً من الخدمات وشبكات
                  الطرق اللوجستية الحديثة.
                </p>

                {/* Google Maps Simulation Overlay */}
                <div className="h-[350px] w-full bg-parchment-dark border border-border/80 rounded-xl relative overflow-hidden flex items-center justify-center shadow-inner">
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 10px 10px, rgb(29 25 22 / 0.15) 1.5px, transparent 0)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* Mock Map Vector Visuals */}
                  <svg
                    className="absolute w-full h-full text-border/60"
                    viewBox="0 0 400 200"
                    preserveAspectRatio="none"
                  >
                    <line x1="0" y1="50" x2="400" y2="50" stroke="currentColor" strokeWidth="2" />
                    <line x1="0" y1="120" x2="400" y2="120" stroke="currentColor" strokeWidth="3" />
                    <line x1="150" y1="0" x2="150" y2="200" stroke="currentColor" strokeWidth="2" />
                    <line
                      x1="280"
                      y1="0"
                      x2="280"
                      y2="200"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="200"
                      cy="100"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                  </svg>

                  {/* Active Pin Pointer */}
                  <div className="relative z-10 flex flex-col items-center gap-1.5 animate-bounce">
                    <div className="w-9 h-9 rounded-full bg-copper-deep border border-white flex items-center justify-center text-white shadow-md">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="bg-card text-foreground px-3 py-1 rounded border border-copper/30 text-[10px] font-bold shadow-md whitespace-nowrap">
                      موقع {asset.title} (مخطط {asset.deedNumber.substring(0, 4)})
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm px-4 py-2.5 rounded border border-border text-[9px] text-muted-foreground text-right leading-tight">
                    <div className="font-bold text-foreground">
                      خط العرض: {asset.coordinates.lat}
                    </div>
                    <div className="font-bold text-foreground">
                      خط الطول: {asset.coordinates.lng}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "attachments" && (
              <div className="space-y-4">
                <h4 className="font-display font-bold text-lg text-foreground mb-4">
                  المرفقات الإضافية والمخططات
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: "تقرير الرفع المساحي المعتمد.pdf", size: "3.4 MB" },
                    { name: "مخطط كروكي معتمد من البلدية.pdf", size: "4.1 MB" },
                  ].map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/80 hover:border-copper/40 hover:bg-parchment-dark/20 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded bg-parchment-dark border border-copper/25 flex items-center justify-center text-copper-deep">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-foreground">{doc.name}</div>
                          <div className="text-[10px] text-muted-foreground">{doc.size}</div>
                        </div>
                      </div>
                      <FileDown className="w-4 h-4 text-muted-foreground hover:text-copper-deep" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "documents" && (
              <div className="space-y-4">
                <h4 className="font-display font-bold text-lg text-foreground mb-4">
                  المستندات القانونية الرسمية
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: "صورة الصك الشرعي الموثق.pdf", size: "1.8 MB" },
                    { name: "دراسة أولية لقدرات التطوير الإنشائي.pdf", size: "2.7 MB" },
                  ].map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/80 hover:border-copper/40 hover:bg-parchment-dark/20 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded bg-parchment-dark border border-copper/25 flex items-center justify-center text-copper-deep">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-foreground">{doc.name}</div>
                          <div className="text-[10px] text-muted-foreground">{doc.size}</div>
                        </div>
                      </div>
                      <FileDown className="w-4 h-4 text-muted-foreground hover:text-copper-deep" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "status" && (
              <div className="space-y-6">
                <h4 className="font-display font-bold text-lg text-foreground mb-4">
                  مراحل التدقيق والدراسة الحالية للأصل
                </h4>
                <div className="space-y-4 relative">
                  {/* Vertical line connector */}
                  <div className="absolute right-5 top-4 bottom-4 w-0.5 bg-border/80" />

                  {[
                    {
                      title: "التحقق من الصك والملكية",
                      desc: "مطابقة صك الملكية الإلكتروني مع كتابة العدل (مكتملة).",
                      done: true,
                    },
                    {
                      title: "الرفع المساحي والتخطيطي",
                      desc: "تحديد مساحة الأرض ومطابقتها على الطبيعة (مكتملة).",
                      done: true,
                    },
                    {
                      title: "دراسة الجدوى الفنية والمالية",
                      desc: "تحليل السوق لتحديد الاستخدام الأمثل والهوامش الربحية المستهدفة (جارية).",
                      done: false,
                    },
                    {
                      title: "اعتماد الهيئة والتراخيص",
                      desc: "استخراج التراخيص اللازمة لطرح الأصل كفرصة مساهمة عقارية (مجدولة).",
                      done: false,
                    },
                  ].map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start relative z-10">
                      <div
                        className={`w-10 h-10 rounded-full border-2 grid place-items-center shrink-0 ${step.done ? "bg-copper-deep border-copper-deep text-white" : "bg-card border-border text-muted-foreground"}`}
                      >
                        {step.done ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <div className="text-right pt-1.5">
                        <h5 className="font-bold text-sm text-foreground">{step.title}</h5>
                        <p className="text-muted-foreground text-xs leading-relaxed mt-0.5">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// PAGE 5: REAL ESTATE CONTRIBUTIONS COMPONENT
// ----------------------------------------------------
function PageContributions() {
  const [activeFilter, setActiveFilter] = useState("الكل");

  const filteredContributions = useMemo(() => {
    if (activeFilter === "الكل") return mockContributions;
    return mockContributions.filter((c) => c.status === activeFilter);
  }, [activeFilter]);

  return (
    <div className="animate-fadeIn py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Title Block */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-copper uppercase tracking-wider block mb-2">
            فرص الاستثمار
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-foreground">
            المساهمات العقارية المتاحة
          </h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">
            تصفّح وشارك في مساهمات عقارية مرخصة تُدار بمهنية وأعلى درجات الحوكمة.
          </p>
        </div>

        {/* Contribution Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 border-b border-border/60 pb-5">
          {["الكل", "تحت الدراسة", "تحت الطرح", "مفتوحة", "مغلقة"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-5 py-2 text-xs font-bold rounded-full border transition-all ${activeFilter === tab ? "bg-copper-deep text-white border-copper-deep" : "border-border hover:border-copper/45 text-muted-foreground bg-card"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {filteredContributions.map((c) => (
            <div
              key={c.id}
              className="card-sketch rounded-2xl overflow-hidden bg-card border border-border/80 group flex flex-col md:flex-row items-stretch"
            >
              <div className="md:w-5/12 relative aspect-video md:aspect-auto overflow-hidden bg-parchment-dark shrink-0">
                <img
                  src={c.img}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <span className="absolute top-4 right-4 text-[9px] font-black px-2.5 py-1 rounded bg-copper-deep text-white uppercase shadow-sm">
                  {c.status}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="mb-4">
                    <span className="text-[9px] font-bold text-copper-deep uppercase tracking-wider bg-parchment px-2.5 py-0.5 rounded">
                      {c.city}
                    </span>
                    <h3 className="font-display font-bold text-xl text-foreground mt-2 group-hover:text-copper-deep transition">
                      {c.name}
                    </h3>
                  </div>

                  <p className="text-muted-foreground text-xs leading-relaxed mb-5 line-clamp-2">
                    {c.description}
                  </p>

                  {/* Metrics Bar */}
                  <div className="grid grid-cols-3 gap-2 text-center py-4 border-y border-border/50 mb-5 text-sm">
                    <div>
                      <div className="text-[10px] text-muted-foreground mb-1">رأس المال</div>
                      <div className="font-display font-bold text-copper-deep text-base">
                        {(c.capital / 1000000).toFixed(0)} مليون
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground mb-1">العائد المتوقع</div>
                      <div className="font-display font-bold text-foreground text-base">
                        {c.expectedReturn}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground mb-1">مدة الاستثمار</div>
                      <div className="font-display font-bold text-foreground text-base">
                        {c.duration}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar (Only show if open or in offering) */}
                  {(c.status === "مفتوحة" || c.status === "تحت الطرح") && (
                    <div className="mb-5">
                      <div className="flex justify-between items-center text-xs font-semibold mb-1">
                        <span className="text-muted-foreground">نسبة التغطية</span>
                        <span className="text-copper-deep">{c.fundingPercentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-parchment border border-border overflow-hidden">
                        <div
                          className="h-full bg-copper-deep rounded-full transition-all duration-500"
                          style={{ width: `${c.fundingPercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1.5 font-bold">
                        <span>المساهمين: {c.investorCount} مستثمر</span>
                        <span>متبقي: {100 - c.fundingPercentage}%</span>
                      </div>
                    </div>
                  )}
                </div>

                <a
                  href={`#contributions/${c.id}`}
                  className="w-full h-11 text-xs font-semibold rounded-md bg-card border border-copper/40 text-copper-deep hover:bg-copper-deep hover:text-white transition flex items-center justify-center gap-2 group/btn"
                >
                  عرض التفاصيل
                  <ArrowLeft className="w-3.5 h-3.5 transition group-hover/btn:-translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// PAGE 6: CONTRIBUTION DETAILS COMPONENT
// ----------------------------------------------------
function PageContributionDetails({ id }: { id: number | null }) {
  const contribution = useMemo(() => {
    return mockContributions.find((c) => c.id === (id || 1)) || mockContributions[0];
  }, [id]);

  const [modalOpen, setModalOpen] = useState(false);
  const [investAmount, setInvestAmount] = useState("");
  const [investSuccess, setInvestSuccess] = useState(false);

  const handleInvestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInvestSuccess(true);
    setTimeout(() => {
      setInvestSuccess(false);
      setModalOpen(false);
      setInvestAmount("");
    }, 3000);
  };

  return (
    <div className="animate-fadeIn py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-6">
          <a href="#home" className="hover:text-copper">
            الرئيسية
          </a>
          <span>/</span>
          <a href="#contributions" className="hover:text-copper">
            المساهمات العقارية
          </a>
          <span>/</span>
          <span className="text-foreground">{contribution.name}</span>
        </div>

        {/* Investment Profile */}
        <div className="grid lg:grid-cols-12 gap-8 items-start mb-16">
          {/* LEFT: Image & Project Summary */}
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-border/80 bg-parchment-dark relative shadow-md">
              <img
                src={contribution.img}
                alt={contribution.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 right-4 text-[10px] font-bold px-3 py-1 rounded-full bg-card border border-copper/35 text-copper-deep shadow-sm">
                مرحلة {contribution.status}
              </span>
            </div>

            <div className="card-sketch p-8 rounded-2xl bg-card">
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                نبذة واستراتيجية المشروع
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {contribution.description}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                ترتكز خطة التطوير الإنشائي على إبرام عقد بنظام تسليم مفتاح مع مطور عقاري معتمد ومصنف
                لدى الهيئة العامة للعقار. يتم تسديد الأرباح التشغيلية والعوائد في حسابات الضمان
                المعتمدة للمساهمين دورياً، ويتم حجز العائد الرأسمالي لحين إتمام بيع وتصفية كامل
                وحدات المشروع الاستثماري.
              </p>
            </div>
          </div>

          {/* RIGHT: Investment Statistics Panel */}
          <div className="lg:col-span-5 card-sketch p-8 rounded-2xl bg-card">
            <span className="text-[10px] font-bold text-copper uppercase tracking-wider block mb-2">
              منصة المساهمات الموثوقة
            </span>
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              {contribution.name}
            </h1>

            <div className="grid grid-cols-2 gap-4 mb-6 border-b border-border/60 pb-6">
              <div>
                <div className="text-[10px] text-muted-foreground font-semibold mb-1">
                  رأس المال الكلي للمساهمة
                </div>
                <div className="text-xl font-display font-black text-copper-deep">
                  {contribution.capital.toLocaleString()} ريال
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-semibold mb-1">
                  العائد المتوقع سنويّاً
                </div>
                <div className="text-xl font-display font-black text-foreground">
                  {contribution.expectedReturn}
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between py-1 border-b border-border/30">
                <span className="text-muted-foreground text-xs">مدة الاستثمار الإجمالية</span>
                <span className="font-bold text-foreground">{contribution.duration}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/30">
                <span className="text-muted-foreground text-xs">عدد المساهمين الحالي</span>
                <span className="font-bold text-foreground">
                  {contribution.investorCount} مستثمر
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/30">
                <span className="text-muted-foreground text-xs">حساب الضمان البنكي</span>
                <span className="font-bold text-foreground font-mono">SA804000001234567890</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground text-xs">حالة الترخيص الجاري</span>
                <span className="font-bold text-copper-deep">مرخص من هيئة العقار</span>
              </div>
            </div>

            {/* Coverage (If open or offering) */}
            {(contribution.status === "مفتوحة" || contribution.status === "تحت الطرح") && (
              <div className="mb-6 border-t border-border/60 pt-6">
                <div className="flex justify-between items-center text-xs font-semibold mb-2">
                  <span className="text-muted-foreground">نسبة الاكتتاب والتغطية</span>
                  <span className="text-copper-deep">{contribution.fundingPercentage}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-parchment border border-border overflow-hidden">
                  <div
                    className="h-full bg-copper-deep rounded-full transition-all duration-500"
                    style={{ width: `${contribution.fundingPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {contribution.status === "مفتوحة" ? (
              <button
                onClick={() => setModalOpen(true)}
                className="w-full h-13 inline-flex items-center justify-center font-bold text-sm rounded-md bg-copper-deep text-white hover:bg-copper transition shadow-md shadow-copper/25"
              >
                ساهم الآن
              </button>
            ) : (
              <button
                disabled
                className="w-full h-13 inline-flex items-center justify-center font-bold text-sm rounded-md bg-muted text-muted-foreground border border-border cursor-not-allowed"
              >
                المساهمة مغلقة حاليّاً
              </button>
            )}
          </div>
        </div>

        {/* Investment Timeline */}
        <div className="card-sketch p-8 rounded-2xl bg-card mb-12">
          <h3 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
            الجدول الزمني ومراحل المشروع
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center relative">
            <div className="absolute top-[21px] left-10 right-10 h-0.5 bg-border/70 hidden md:block -z-10" />

            {[
              "الدراسة والترخيص",
              "الهيكلة الاستثمارية",
              "الطرح والاكتتاب",
              "مرحلة التطوير والإنشاء",
              "التخارج وتوزيع الأرباح",
            ].map((s, idx) => {
              const isDone = idx < contribution.timelineStep;
              const isCurrent = idx === contribution.timelineStep;
              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-11 h-11 rounded-full border-2 grid place-items-center ${isDone ? "bg-copper-deep border-copper-deep text-white" : isCurrent ? "bg-card border-copper text-copper-deep font-bold" : "bg-card border-border text-muted-foreground"}`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : <span>{idx + 1}</span>}
                  </div>
                  <div className="text-xs font-bold text-foreground mt-1">{s}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {isDone ? "مكتملة" : isCurrent ? "جارية حالياً" : "مجدولة"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PDF Downloads List & Specific FAQ */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card-sketch p-8 rounded-2xl bg-card">
            <h3 className="font-display text-xl font-bold text-foreground mb-6 inline-flex items-center gap-2">
              <FileText className="w-5 h-5 text-copper-deep" /> المستندات وشهادات المشروع
            </h3>
            <div className="space-y-4">
              {[
                "نشرة الإصدار الرسمية للمساهمة.pdf",
                "شهادة الترخيص الرسمية لهيئة العقار.pdf",
                "نموذج دراسة الجدوى المالية المعتمد.pdf",
                "اتفاقية التطوير مع المطور الإنشائي.pdf",
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-copper/40 transition cursor-pointer text-xs"
                >
                  <span className="font-semibold text-foreground">{doc}</span>
                  <FileDown className="w-4 h-4 text-muted-foreground hover:text-copper-deep" />
                </div>
              ))}
            </div>
          </div>

          <div className="card-sketch p-8 rounded-2xl bg-card text-right">
            <h3 className="font-display text-xl font-bold text-foreground mb-6 inline-flex items-center gap-2">
              <Info className="w-5 h-5 text-copper-deep" /> تساؤلات حول هذه المساهمة
            </h3>
            <div className="space-y-4 text-xs leading-relaxed text-muted-foreground">
              <div>
                <h4 className="font-bold text-foreground mb-1">ما هو الحد الأدنى للاكتتاب؟</h4>
                <p>
                  الحد الأدنى للمشاركة في هذه المساهمة هو 10,000 ريال سعودي، مقسمة إلى حصص متساوية
                  قيمة الحصة الواحدة 1,000 ريال.
                </p>
              </div>
              <div className="border-t border-border/50 pt-3">
                <h4 className="font-bold text-foreground mb-1">متى يتم توزيع العوائد المتوقعة؟</h4>
                <p>
                  توزع الأرباح التشغيلية بشكل نصف سنوي، بينما يوزع العائد الرأسمالي المتبقي فور بيع
                  الأصول بالكامل والتخارج النهائي.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INVESTMENT MODAL FOR APPLYING */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-card border border-copper/35 rounded-2xl max-w-md w-full p-8 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-parchment-dark text-muted-foreground transition"
            >
              <X className="w-5 h-5" />
            </button>

            {investSuccess ? (
              <div className="text-center py-8 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-copper-deep border border-white text-white flex items-center justify-center mb-6 animate-scaleUp">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                  تم تسجيل طلب المساهمة بنجاح
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-xs mx-auto">
                  تم إصدار فاتورة مساهمة مبدئية، وسيتواصل معك مستشار المحافظ الخاص بنا لإتمام عمليات
                  التحقق وسداد رأس المال عبر حساب الضمان.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInvestSubmit} className="space-y-5">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-parchment border border-copper/35 grid place-items-center text-copper-deep mx-auto mb-3">
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 3V21M3 12H21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    طلب مساهمة جديدة
                  </h3>
                  <p className="text-muted-foreground text-[11px] mt-1">{contribution.name}</p>
                </div>

                <div className="text-right">
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                    المبلغ المراد استثماره (ريال سعودي)
                  </label>
                  <input
                    type="number"
                    required
                    min="10000"
                    step="1000"
                    placeholder="مثال: 50000"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    className="w-full h-11 px-4 rounded-md border border-border bg-background text-sm font-semibold text-foreground focus:outline-none focus:border-copper-deep transition"
                  />
                  <span className="text-[10px] text-muted-foreground/80 mt-1 block">
                    الحد الأدنى للاكتتاب: 10,000 ريال
                  </span>
                </div>

                <div className="bg-parchment-dark/30 rounded-xl p-4 text-[10px] text-muted-foreground space-y-2 text-right">
                  <div className="flex justify-between">
                    <span>عدد الحصص المقابلة:</span>
                    <span className="font-bold text-foreground">
                      {investAmount ? (parseInt(investAmount) / 1000).toLocaleString() : 0} حصة
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>رسوم الاكتتاب الإدارية:</span>
                    <span className="font-bold text-foreground">خاضعة للشروط (0.5%)</span>
                  </div>
                </div>

                <label className="flex items-start gap-2.5 text-right text-[10px] text-muted-foreground">
                  <input type="checkbox" required className="accent-copper-deep mt-0.5" />
                  <span>
                    أقر بقراءتي لنشرة الإصدار الخاصة بالمشروع والموافقة على سياسة الخصوصية واستخدام
                    بياناتي لإجراء التحقق الرقمي.
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full h-12 font-bold text-xs rounded-md bg-copper-deep hover:bg-copper text-white transition shadow-md"
                >
                  إرسال طلب الاكتتاب
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// PAGE 7: REQUEST PROPERTY STUDY COMPONENT
// ----------------------------------------------------
function PageRequestStudy() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [assetType, setAssetType] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [fileAttached, setFileAttached] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFullname("");
      setPhone("");
      setEmail("");
      setAssetType("");
      setCity("");
      setArea("");
      setDescription("");
      setFileAttached(false);
    }, 4000);
  };

  return (
    <div className="animate-fadeIn py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* LEFT: Pencil Illustration Box */}
          <div className="lg:col-span-5 relative order-2 lg:order-1 text-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-copper/10 to-transparent rounded-3xl blur-2xl -z-10" />
            <img
              src={contactPerson}
              alt="Real Estate Analyst Sketch"
              className="relative w-full max-w-md mx-auto rounded-2xl border border-copper/35 shadow-[0_30px_70px_-30px_rgba(50,25,5,0.35)] object-cover aspect-[4/5]"
            />
          </div>

          {/* RIGHT: High-Fidelity Interactive Form */}
          <div className="lg:col-span-7 order-1 lg:order-2 bg-card border border-border/80 rounded-2xl p-8 shadow-sm">
            <span className="text-xs font-bold text-copper uppercase tracking-wider block mb-2">
              طلب دراسة عقارية
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-3">
              اعرض أصلك العقاري
            </h1>
            <p className="text-muted-foreground text-xs leading-relaxed mb-8">
              أدخل كافة بيانات أصلك العقاري بالتفصيل، وسيقوم المحللون الفنيون لدينا بمراجعة الصك
              ورفع طلب الترخيص الأولي في أقرب وقت.
            </p>

            {formSubmitted ? (
              <div className="text-center py-16 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-copper-deep border border-white text-white flex items-center justify-center mb-6 animate-scaleUp">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                  تم إرسال طلبك بنجاح
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-md mx-auto">
                  نشكرك على ثقتك بمهابة. لقد تم توجيه طلب دراسة الأصل المذكور للمحلل العقاري المختص،
                  وسنتواصل معك على بريدك أو جوالك خلال ثلاثة أيام عمل لتوفير تقرير الجدوى المبدئي.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5 text-right">
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1.5">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: صالح محمد الأحمد"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="w-full h-11 px-4 rounded-md border border-border bg-background text-sm font-semibold text-foreground focus:outline-none focus:border-copper-deep transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1.5">
                    رقم الجوال
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="05xxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 px-4 rounded-md border border-border bg-background text-sm font-semibold text-foreground focus:outline-none focus:border-copper-deep transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1.5">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-4 rounded-md border border-border bg-background text-sm font-semibold text-foreground focus:outline-none focus:border-copper-deep transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1.5">
                    نوع الأصل العقاري
                  </label>
                  <select
                    required
                    value={assetType}
                    onChange={(e) => setAssetType(e.target.value)}
                    className="w-full h-11 px-4 rounded-md border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:border-copper-deep transition cursor-pointer"
                  >
                    <option value="">اختر نوع الأصل</option>
                    {assetTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1.5">
                    المدينة
                  </label>
                  <select
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-11 px-4 rounded-md border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:border-copper-deep transition cursor-pointer"
                  >
                    <option value="">اختر المدينة</option>
                    {saudiCities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1.5">
                    المساحة (م²)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="أدخل المساحة الإجمالية"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full h-11 px-4 rounded-md border border-border bg-background text-sm font-semibold text-foreground focus:outline-none focus:border-copper-deep transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1.5">
                    وصف العقار ومميزاته
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="اكتب نبذة عن موقع العقار وشبكات الخدمات القريبة منه وأي دراسات سابقة..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 rounded-md border border-border bg-background text-sm font-semibold text-foreground focus:outline-none focus:border-copper-deep transition resize-none"
                  />
                </div>

                {/* File Uploader Mock */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1.5">
                    ملفات ومستندات كروكي وصك الملكية
                  </label>
                  <button
                    type="button"
                    onClick={() => setFileAttached(!fileAttached)}
                    className={`w-full h-12 rounded-lg border-2 border-dashed flex items-center justify-center gap-2.5 text-xs font-semibold transition ${fileAttached ? "bg-copper/10 border-copper text-copper-deep" : "border-border/80 text-muted-foreground hover:bg-parchment-dark/25"}`}
                  >
                    {fileAttached ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-copper-deep" />
                        تم إرفاق مستند الملكية بنجاح
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        اختر ملفاً أو اسحبه هنا للإرفاق
                      </>
                    )}
                  </button>
                </div>

                <label className="sm:col-span-2 flex items-start gap-2.5 text-xs text-muted-foreground mt-2">
                  <input type="checkbox" required className="accent-copper-deep mt-0.5" />
                  <span>
                    أوافق على سياسة الخصوصية واستخدام بيانات أملكي بهدف إعداد دراسات الجدوى والتحقق
                    الرقمي من صك الملكية.
                  </span>
                </label>

                <button
                  type="submit"
                  className="sm:col-span-2 h-13 font-bold text-sm rounded-md bg-copper-deep hover:bg-copper text-white transition shadow-md shadow-copper/15"
                >
                  إرسال الطلب
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// PAGE 8: MEDIA CENTER COMPONENT
// ----------------------------------------------------
function PageMedia() {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const categories = ["الكل", "أخبار", "تقارير", "دراسات", "تحليلات"];

  const filteredArticles = useMemo(() => {
    if (activeCategory === "الكل") return articles;
    return articles.filter((a) => a.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="animate-fadeIn py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Page Hero */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-copper uppercase block mb-2">
            المعرفة والمستجدات
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-foreground">
            المركز الإعلامي والمعرفي
          </h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">
            تابع التقارير العقارية الدورية وأخبار مساهمات مهابة أولاً بأول.
          </p>
        </div>

        {/* Featured News: Large Article */}
        <div className="card-sketch rounded-2xl overflow-hidden bg-card mb-12 grid lg:grid-cols-12 items-stretch group">
          <div className="lg:col-span-7 relative aspect-video lg:aspect-auto overflow-hidden bg-parchment-dark shrink-0">
            <img
              src={newsHero}
              alt="featured news article"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
            />
            <span className="absolute top-4 right-4 text-[9px] font-black bg-copper text-ink px-3 py-1 rounded shadow-sm">
              خبر رئيسي
            </span>
          </div>

          <div className="lg:col-span-5 p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-copper-deep">12 مايو 2024</span>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-foreground mt-3 leading-snug">
                مهابة تعلن عن شراكة استراتيجية لتطوير مشاريع نوعية في الرياض
              </h2>
              <p className="text-muted-foreground text-xs leading-relaxed mt-4">
                في إطار التوسع في المحفظة الاستثمارية العقارية، أبرمت شركة مهابة لإدارة المساهمات
                العقارية شراكة استراتيجية مع جهات هندسية رائدة لتمويل وتطوير مجمعات إدارية وتجارية
                متكاملة شمال الرياض، باستثمارات إجمالية تتجاوز 400 مليون ريال سعودي.
              </p>
            </div>
            <button className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-copper-deep border-b border-copper/60 pb-1 hover:gap-3.5 transition-all self-start">
              اقرأ التفاصيل كاملة
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Knowledge & News Section */}
        <div className="border-t border-border/60 pt-16 mb-16">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h3 className="font-display text-2xl font-bold text-foreground inline-flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-copper-deep" />
              مكتبة المعرفة والتقارير العقارية
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`px-4.5 py-1.5 text-xs font-bold rounded-full border transition ${activeCategory === c ? "bg-copper-deep text-white border-copper-deep" : "border-border hover:border-copper/45 text-muted-foreground bg-card"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredArticles.map((art, idx) => (
                <article
                  key={idx}
                  className="card-sketch p-6 rounded-2xl bg-card hover:border-copper/45 transition flex flex-col md:flex-row gap-5 items-stretch group"
                >
                  <div className="md:w-4/12 relative aspect-video md:aspect-auto rounded-lg overflow-hidden bg-parchment-dark shrink-0">
                    <img
                      src={art.img}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center text-[10px] mb-2 font-bold">
                        <span className="text-copper-deep">{art.category}</span>
                        <span className="text-muted-foreground">{art.date}</span>
                      </div>
                      <h4 className="font-display font-bold text-base text-foreground mb-2 leading-snug group-hover:text-copper-deep transition">
                        {art.title}
                      </h4>
                      <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                        {art.desc}
                      </p>
                    </div>
                    <button className="inline-flex items-center gap-1 text-[10px] font-bold text-copper-deep border-b border-copper/50 pb-0.5 mt-4 hover:gap-2.5 transition-all self-start">
                      اقرأ المقالة كاملة
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">لا توجد مقالات في هذا التصنيف حاليّاً.</div>
          )}
        </div>

        {/* Newsletter Subscription Block */}
        <div className="card-sketch p-8 md:p-12 rounded-3xl bg-ink text-ink-foreground relative overflow-hidden text-center">
          <div className="absolute inset-0 opacity-[0.04] mix-blend-screen">
            <img src={footerBg} alt="" className="w-full h-full object-cover" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-copper uppercase tracking-wider block mb-2">
              النشرة البريدية
            </span>
            <h3 className="font-display text-3xl font-extrabold text-white mb-3">
              اشترك لتلقي تحديثات المساهمات والتقارير
            </h3>
            <p className="text-ink-foreground/60 text-xs leading-relaxed max-w-lg mx-auto mb-8">
              كن على اطلاع دائم بفرص الاستثمار العقاري المرخصة وتلقى نشرات حصرية بالبريد الإلكتروني.
            </p>

            {newsletterSubscribed ? (
              <div className="inline-flex items-center gap-3 bg-white/10 px-6 py-3.5 rounded-xl border border-copper/50 animate-scaleUp">
                <CheckCircle2 className="w-5 h-5 text-copper" />
                <span className="text-xs font-bold text-white">تم اشتراكك في النشرة بنجاح</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setNewsletterSubscribed(true);
                  setTimeout(() => setNewsletterSubscribed(false), 3000);
                }}
                className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  placeholder="أدخل بريدك الإلكتروني"
                  className="flex-1 h-12 px-4 rounded-lg bg-white/5 border border-white/15 focus:outline-none focus:border-copper text-white placeholder:text-ink-foreground/30 text-xs text-right"
                />
                <button
                  type="submit"
                  className="h-12 px-6 rounded-lg bg-copper-deep hover:bg-copper text-white transition text-xs font-bold shadow-md"
                >
                  اشترك الآن
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// PAGE 9: FAQ COMPONENT
// ----------------------------------------------------
function PageFAQ() {
  const [activeFAQCategory, setActiveFAQCategory] = useState("الكل");
  const [faqSearchQuery, setFaqSearchQuery] = useState("");

  const faqCategories = ["الكل", "عامة", "المساهمات العقارية", "الحوكمة والامتثال"];

  const filteredFAQs = useMemo(() => {
    return questions.filter((item) => {
      const categoryMatch = activeFAQCategory === "الكل" || item.category === activeFAQCategory;
      const searchMatch =
        !faqSearchQuery || item.q.includes(faqSearchQuery) || item.a.includes(faqSearchQuery);
      return categoryMatch && searchMatch;
    });
  }, [activeFAQCategory, faqSearchQuery]);

  return (
    <div className="animate-fadeIn py-16">
      <div className="mx-auto max-w-4xl px-6">
        {/* Title Block */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-copper uppercase tracking-wider block mb-2">
            الأسئلة الشائعة
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-foreground">
            الأسئلة المكررة والمساعد المرجعي
          </h1>
          <p className="text-muted-foreground mt-3 text-sm">
            ابحث عن الإجابات والتوضيحات المرتبطة بحوكمة المساهمات وكيفية البدء والأنظمة.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="relative mb-10 max-w-md mx-auto">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="ابحث عن سؤال أو كلمة مفتاحية..."
            value={faqSearchQuery}
            onChange={(e) => setFaqSearchQuery(e.target.value)}
            className="w-full h-11 pr-11 pl-4 rounded-xl border border-border bg-card text-xs font-semibold text-foreground focus:outline-none focus:border-copper transition"
          />
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 border-b border-border/60 pb-5">
          {faqCategories.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFAQCategory(tab)}
              className={`px-4.5 py-1.5 text-xs font-bold rounded-full border transition-all ${activeFAQCategory === tab ? "bg-copper-deep text-white border-copper-deep" : "border-border hover:border-copper/45 text-muted-foreground bg-card"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* FAQ Accordions List */}
        {filteredFAQs.length > 0 ? (
          <div className="space-y-4">
            {filteredFAQs.map((item, idx) => (
              <details
                key={idx}
                className="group card-sketch rounded-xl px-6 py-4.5 cursor-pointer bg-card border border-border/80 transition-all duration-300"
              >
                <summary className="flex items-center justify-between gap-4 list-none text-right">
                  <span className="font-bold text-sm text-foreground group-hover:text-copper-deep transition-all">
                    {item.q}
                  </span>
                  <ChevronDown className="w-4 h-4 text-copper-deep transition-transform duration-300 group-open:rotate-180 shrink-0" />
                </summary>
                <div className="mt-3.5 border-t border-border/40 pt-3.5 text-xs leading-relaxed text-muted-foreground text-right">
                  <p>{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            لا توجد أسئلة تطابق استفسارك حاليّاً.
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// FOOTER COMPONENT
// ----------------------------------------------------
function Footer({ navigateTo }: { navigateTo: (p: string) => void }) {
  const footerLinks = [
    { label: "الرئيسية", hash: "home" },
    { label: "المساهمات العقارية", hash: "contributions" },
    { label: "مهابة", hash: "about" },
    { label: "المركز الإعلامي", hash: "media" },
    { label: "الأسئلة الشائعة", hash: "faq" },
    { label: "تواصل معنا", hash: "request-study" },
  ];

  return (
    <footer className="bg-ink text-ink-foreground pt-20 pb-8 relative overflow-hidden mt-auto">
      <div className="absolute inset-0 opacity-[0.06] mix-blend-screen pointer-events-none">
        <img src={footerBg} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-copper to-transparent" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg border border-copper/40 grid place-items-center bg-white/5">
                <svg
                  className="w-6 h-6 text-copper"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 5V19M12 3V21M18 5V19"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="leading-tight text-right">
                <div className="font-display text-2xl font-bold tracking-tight text-white">
                  مهابة
                </div>
                <div className="text-[9px] text-ink-foreground/50 tracking-wider">
                  إدارة المساهمات العقارية
                </div>
              </div>
            </div>
            <p className="text-xs text-ink-foreground/60 leading-relaxed max-w-sm">
              مؤسسة سعودية مالية وعقارية مرخصة وحاصلة على ثقة كبار المستثمرين لإدارة وتأهيل وهيكلة
              الأصول والمساهمات العقارية بنزاهة وحوكمة كاملة.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-copper text-sm">روابط سريعة</h4>
            <ul className="space-y-2.5 text-xs text-ink-foreground/75">
              {footerLinks.map((l) => (
                <li key={l.hash}>
                  <a href={`#${l.hash}`} className="hover:text-copper transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-copper text-sm">خدماتنا</h4>
            <ul className="space-y-2.5 text-xs text-ink-foreground/75">
              <li>دراسة الأصل</li>
              <li>إدارة المساهمة</li>
              <li>الحوكمة</li>
              <li>الامتثال</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4 text-right">
            <h4 className="font-display font-bold text-copper text-sm">بيانات التواصل</h4>
            <ul className="space-y-3.5 text-xs text-ink-foreground/75">
              <li className="flex items-center gap-3 justify-start">
                <Phone className="w-4 h-4 text-copper shrink-0" />
                <span className="font-mono">0510515010</span>
              </li>
              <li className="flex items-center gap-3 justify-start">
                <Mail className="w-4 h-4 text-copper shrink-0" />
                <span>info@mahabah.sa</span>
              </li>
              <li className="flex items-center gap-3 justify-start">
                <Globe className="w-4 h-4 text-copper shrink-0" />
                <span>mahabah.sa</span>
              </li>
              <li className="flex items-center gap-3 justify-start">
                <MapPin className="w-4 h-4 text-copper shrink-0" />
                <span>حي المروج المالي، الرياض، السعودية</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclaimers & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-ink-foreground/40 text-center md:text-right">
          <div>جميع الحقوق محفوظة © شركة مهابة لإدارة المساهمات العقارية، 2026.</div>
          <div className="max-w-md leading-relaxed">
            إخلاء المسؤولية: المعلومات الواردة في هذا الموقع لأغراض تعريفية وتثقيفية فقط، ولا تعد
            توصية استثمارية أو دعوة للاكتتاب أو الشراء أو البيع. تخضع جميع الفحوص والمشاريع الدراسة
            والتقييم والأنظمة المعمول بها في المملكة العربية السعودية.
          </div>
        </div>
      </div>
    </footer>
  );
}
