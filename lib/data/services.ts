import {
  BadgeCheck,
  Banknote,
  ClipboardCheck,
  FileCheck2,
  FileSearch,
  HardHat,
  Megaphone,
  MessageSquareText,
  Scale,
  SearchCheck,
  UserCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ServiceItem = {
  id: string;
  slug: string;
  titleAr: string;
  descriptionAr: string;
  durationAr: string;
  levelAr: string;
  outputsAr: string;
  icon: LucideIcon;
};

export const realEstateServices: ServiceItem[] = [
  { id: "service-01", slug: "initial-real-estate-consultation", titleAr: "استشارة عقارية أولية", descriptionAr: "جلسة أولية لفهم الأصل العقاري وتحديد الفرص والتحديات.", durationAr: "1 - 3 أيام عمل", levelAr: "أساسية", outputsAr: "ملخص أولي", icon: MessageSquareText },
  { id: "service-02", slug: "detailed-real-estate-consultation", titleAr: "استشارة عقارية مفصلة", descriptionAr: "تحليل متكامل للأصل أو المشروع العقاري يتضمن دراسة الفرص والتحديات والتوصيات الاستثمارية والتطويرية.", durationAr: "5 - 10 أيام عمل", levelAr: "متقدمة", outputsAr: "تقرير شامل", icon: SearchCheck },
  { id: "service-03", slug: "initial-feasibility-study", titleAr: "دراسة جدوى عقارية أولية", descriptionAr: "تقدير سريع للجدوى الاقتصادية وإمكانات التطوير.", durationAr: "3 - 5 أيام عمل", levelAr: "أساسية", outputsAr: "تقرير أولي", icon: ClipboardCheck },
  { id: "service-04", slug: "detailed-feasibility-study", titleAr: "دراسة جدوى عقارية مفصلة", descriptionAr: "دراسة مالية وفنية وتسويقية متكاملة للمشروع العقاري.", durationAr: "10 - 15 يوم عمل", levelAr: "متقدمة", outputsAr: "دراسة تفصيلية", icon: FileSearch },
  { id: "service-05", slug: "real-estate-valuation", titleAr: "تقييم عقاري", descriptionAr: "تقدير القيمة السوقية للأصل العقاري بواسطة جهة متخصصة.", durationAr: "5 - 7 أيام عمل", levelAr: "متوسطة", outputsAr: "تقرير تقييم", icon: BadgeCheck },
  { id: "service-06", slug: "engineering-consultation", titleAr: "استشارة هندسية", descriptionAr: "دراسة الجوانب التخطيطية والهندسية وإمكانية التطوير.", durationAr: "7 - 10 أيام عمل", levelAr: "متخصصة", outputsAr: "تقرير فني", icon: HardHat },
  { id: "service-07", slug: "asset-marketing", titleAr: "تسويق أصل أو مشروع", descriptionAr: "تسويق الأصول والمشاريع للمستثمرين والمشترين والمؤهلين.", durationAr: "حسب النطاق", levelAr: "متخصصة", outputsAr: "خطة تسويق", icon: Megaphone },
  { id: "service-08", slug: "contribution-financing", titleAr: "تمويل مساهمة عقارية", descriptionAr: "ربط المشروع بالجهات التمويلية المناسبة.", durationAr: "حسب الحالة", levelAr: "متقدمة", outputsAr: "ترتيب تمويل", icon: Banknote },
  { id: "service-09", slug: "legal-contract-review", titleAr: "مراجعة عقود قانونية", descriptionAr: "مراجعة وصياغة العقود والاتفاقيات العقارية.", durationAr: "3 - 7 أيام عمل", levelAr: "متخصصة", outputsAr: "ملاحظات قانونية", icon: Scale },
  { id: "service-10", slug: "ejar-contract-documentation", titleAr: "توثيق عقد بمنصة إيجار", descriptionAr: "خدمة توثيق عقود الإيجار عبر منصة إيجار.", durationAr: "1 - 2 يوم عمل", levelAr: "إجرائية", outputsAr: "عقد موثق", icon: FileCheck2 },
  { id: "service-11", slug: "notary-service", titleAr: "خدمة موثق", descriptionAr: "خدمات التوثيق العدلي والعقاري.", durationAr: "حسب الموعد", levelAr: "إجرائية", outputsAr: "توثيق رسمي", icon: UserCheck },
  { id: "service-12", slug: "real-estate-registry", titleAr: "خدمة التسجيل العيني للعقار", descriptionAr: "إجراءات التسجيل العيني ومتابعة متطلبات التسجيل.", durationAr: "حسب المتطلبات", levelAr: "إجرائية", outputsAr: "ملف تسجيل", icon: FileCheck2 },
];
