import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";

export const metadata: Metadata = {
  title: "شروط الاستخدام",
  description: "شروط استخدام منصة مهابة وخدماتها العقارية.",
};

export default function TermsPage() {
  return <LegalPage kind="terms" />;
}
