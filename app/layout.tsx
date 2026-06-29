import type { Metadata } from "next";
import "./globals.css";
import { SiteChrome } from "@/components/layout/site-chrome";

export const metadata: Metadata = {
  metadataBase: new URL("https://mahabah.sa"),
  title: {
    default: "مهابة - إدارة المساهمات العقارية",
    template: "%s | مهابة",
  },
  description: "منصة سعودية لتحويل الأصول العقارية إلى مساهمات عقارية ومشاريع استثمارية وفق أعلى معايير الحوكمة.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/mahabah-icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "مهابة - إدارة المساهمات العقارية",
    description: "حيث تتحول الأصول العقارية إلى مساهمات منظمة عالية الحوكمة.",
    locale: "ar_SA",
    type: "website",
    images: ["/brand/mahabah-logo-transparent.png"],
  },
  twitter: { card: "summary_large_image", images: ["/brand/mahabah-logo-transparent.png"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
