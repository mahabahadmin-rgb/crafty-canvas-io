import type { Contribution } from "@/lib/types";

const journey = ["استقبال الأصل", "الدراسة", "الهيكلة", "التراخيص", "الطرح", "الإدارة", "التخارج"];
const contributionJourney = ["الاكتتاب", "تجميع رأس المال", "التطوير", "التنفيذ", "التشغيل", "التخارج", "توزيع العوائد"];

function timeline(currentIndex: number) {
  return journey.map((labelAr, index) => ({
    labelAr,
    completed: index < currentIndex,
    current: index === currentIndex,
  }));
}

export const contributions: Contribution[] = [
  {
    id: "contribution-01",
    slug: "nakheel-commercial",
    titleAr: "مساهمة النخيل التجاري",
    cityAr: "الرياض",
    stageAr: "تحت الطرح",
    capitalSar: 750000000,
    investorsCount: 1200,
    durationMonths: 36,
    fundedPercent: 45,
    expectedReturnPercent: 18,
    remainingDays: 28,
    image: "/images/asset-commercial-complex.png",
    timeline: contributionJourney.map((labelAr, index) => ({ labelAr, completed: index < 4, current: index === 3 })),
    excerptAr: "مساهمة لتطوير مجمع تجاري منظم في الرياض ضمن مسار حوكمة وإفصاح واضح.",
  },
  {
    id: "contribution-02",
    slug: "almurooj-office",
    titleAr: "مساهمة أبراج الرياض",
    cityAr: "الرياض",
    stageAr: "قيد الهيكلة",
    capitalSar: 90000000,
    investorsCount: 950,
    durationMonths: 36,
    fundedPercent: 42,
    remainingDays: 44,
    expectedReturnPercent: 16,
    image: "/images/asset-tower.png",
    timeline: timeline(2),
    excerptAr: "هيكلة أصل إداري مؤسسي وربطه بمسار تراخيص وطرح منظم للمستثمرين.",
  },
  {
    id: "contribution-03",
    slug: "alwaha-residential",
    titleAr: "مساهمة حي الواحة",
    cityAr: "جدة",
    stageAr: "تحت الدراسة",
    capitalSar: 210000000,
    investorsCount: 1800,
    durationMonths: 42,
    fundedPercent: 21,
    expectedReturnPercent: 15,
    remainingDays: 61,
    image: "/images/asset-land-masterplan.png",
    timeline: timeline(1),
    excerptAr: "دراسة تطوير سكني متعدد المراحل مع مراجعة فنية ومالية قبل التأهيل النهائي.",
  },
  {
    id: "contribution-04",
    slug: "nakheel-land-structuring",
    titleAr: "مساهمة مجمع الرخيص",
    cityAr: "جدة",
    stageAr: "تحت الدراسة",
    capitalSar: 68000000,
    investorsCount: 420,
    durationMonths: 30,
    fundedPercent: 18,
    expectedReturnPercent: 14,
    remainingDays: 72,
    image: "/images/hero-raw-land.png",
    timeline: timeline(1),
    excerptAr: "أصل أرض خام يجري تقييم قابليته للتحويل إلى مساهمة تطويرية بضمانات حوكمة واضحة.",
  },
];
