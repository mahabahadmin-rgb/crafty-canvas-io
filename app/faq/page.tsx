import type { Metadata } from "next";
import { FAQSection } from "@/components/sections/faq-section";
export const metadata: Metadata = { title: "الأسئلة الشائعة", description: "إجابات حول المساهمات العقارية والرسوم والمراحل وتوزيع العوائد." };
export default function FAQPage() { return <FAQSection />; }
