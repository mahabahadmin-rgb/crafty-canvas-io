import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: "سياسة خصوصية منصة مهابة وحماية بيانات المستخدمين.",
};

export default function PrivacyPage() {
  return <LegalPage kind="privacy" />;
}
