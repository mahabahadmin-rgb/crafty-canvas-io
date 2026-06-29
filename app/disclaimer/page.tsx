import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";

export const metadata: Metadata = {
  title: "إخلاء المسؤولية",
  description: "إخلاء مسؤولية منصة مهابة وحدود استخدام المعلومات المنشورة.",
};

export default function DisclaimerPage() {
  return <LegalPage kind="disclaimer" />;
}
