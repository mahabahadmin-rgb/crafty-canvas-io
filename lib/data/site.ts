import type { JourneyStep, Metric, Partner } from "@/lib/types";

export const journeySteps: JourneyStep[] = [
  { id: "intake", titleAr: "استقبال الأصل", descriptionAr: "تسجيل بيانات الأصل والمستندات الأولية.", icon: "handshake" },
  { id: "study", titleAr: "الدراسة", descriptionAr: "فحص فني ومالي وقانوني لقابلية المساهمة.", icon: "search" },
  { id: "structure", titleAr: "الهيكلة", descriptionAr: "تحديد النموذج الاستثماري والحوكمة.", icon: "layers" },
  { id: "license", titleAr: "التراخيص", descriptionAr: "استكمال المتطلبات النظامية والرقابية.", icon: "license" },
  { id: "offering", titleAr: "الطرح", descriptionAr: "إتاحة الفرصة للمستثمرين وفق الإفصاح.", icon: "megaphone" },
  { id: "manage", titleAr: "الإدارة", descriptionAr: "متابعة التنفيذ والتقارير الدورية.", icon: "settings" },
  { id: "exit", titleAr: "التخارج", descriptionAr: "إغلاق المشروع وتوزيع العوائد.", icon: "exit" },
];

export const metrics: Metric[] = [
  { id: "assets", value: "28", labelAr: "أصل قيد الدراسة ضمن محفظة تتجاوز 4.6 مليار ريال", icon: "building" },
  { id: "contributions", value: "14", labelAr: "مساهمة تحت الإدارة بقيمة إجمالية 2.6 مليار ريال", icon: "briefcase" },
  { id: "partners", value: "120+", labelAr: "مزود خدمة معتمدون وشركاء موثوقون", icon: "users" },
  { id: "opportunities", value: "9", labelAr: "فرص استثمارية جاري دراستها وتهيئتها للمساهمات", icon: "target" },
];

export const partners: Partner[] = [
  { id: "pif", nameAr: "PIF" },
  { id: "snb", nameAr: "SNB" },
  { id: "pwc", nameAr: "pwc" },
  { id: "kpmg", nameAr: "KPMG" },
  { id: "jll", nameAr: "JLL" },
  { id: "colliers", nameAr: "Colliers" },
  { id: "knight-frank", nameAr: "Knight Frank" },
];
