import type { Metadata } from "next";
import { FormPage } from "@/components/sections/form-page";

export const metadata: Metadata = {
  title: "طلب خدمة عقارية",
  description: "نموذج طلب خدمة عقارية من مهابة لدراسة الأصل أو تقييمه أو تسويقه أو مراجعته.",
};

export default function RequestStudyPage() {
  return <FormPage mode="study" />;
}
