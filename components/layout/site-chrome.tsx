"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/footer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const appSurface = pathname.startsWith("/dashboard") || pathname.startsWith("/auth");

  if (appSurface) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
