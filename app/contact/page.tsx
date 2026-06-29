import type { Metadata } from "next";
import { ContactPageContent } from "@/components/sections/contact-page";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description: "تواصل مع فريق مهابة للاستفسارات والخدمات والمساهمات العقارية.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
