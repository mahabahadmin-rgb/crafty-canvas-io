"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronLeft,
  Headphones,
  Mail,
  Menu,
  UserRound,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { cn } from "@/lib/utils";
import { navigation } from "@/lib/data/navigation";
import { dashboardHref, type DashboardNavGroup, type DashboardRole } from "@/lib/data/dashboard";
import { dashboardBusinessCss } from "@/lib/styles/dashboard-business-css";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

function _IndividualTopHeader({ ownerName, onMenu }: { ownerName: string; onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b mb-border-individual bg-white/96 backdrop-blur-xl">
      <div className="flex min-h-20 items-center gap-5 px-4 lg:px-8">
        <div className="flex shrink-0 items-center justify-start">
          <BrandLogo priority height={74} />
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-12 text-[15px] font-extrabold mb-text-ink lg:flex" aria-label="تنقل الحساب">
          {navigation.filter((item) => item.href !== "/about").map((item, index) => (
            <Link key={item.href} href={item.href} className={cn("relative px-1 py-2 transition hover:mb-text-personal-accent", index === 0 ? "mb-text-personal-accent after:absolute after:inset-x-1 after:bottom-0 after:h-px after:mb-bg-personal-accent" : "")}>
              {item.labelAr === "الأصول" ? "الأصول العقارية" : item.labelAr === "المساهمات" ? "المساهمات العقارية" : item.labelAr}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-4 mb-text-ink">
          <Link href={dashboardHref("individual", "notifications")} className="relative grid h-11 w-11 place-items-center rounded-full bg-white transition hover:mb-bg-warm" aria-label="الإشعارات">
            <Bell className="h-6 w-6" />
            <span className="absolute -end-1 top-0 grid h-5 min-w-5 place-items-center rounded-full mb-bg-notice px-1 text-[11px] font-extrabold text-white">3</span>
          </Link>
          <Link href={dashboardHref("individual", "messages")} className="hidden h-11 w-11 place-items-center rounded-full bg-white transition hover:mb-bg-warm sm:grid" aria-label="الرسائل">
            <Mail className="h-6 w-6" />
          </Link>
          <div className="hidden h-10 w-px mb-bg-individual-line sm:block" />
          <Link href={dashboardHref("individual", "personal-profile")} className="hidden items-center gap-3 sm:flex" aria-label="قائمة المستخدم">
            <div className="grid h-11 w-11 place-items-center rounded-full border mb-border-individual-soft mb-bg-warm mb-text-personal-accent">
              <UserRound className="h-6 w-6" />
            </div>
            <span className="text-sm font-extrabold">{ownerName}</span>
            <ChevronLeft className="h-4 w-4 -rotate-90 mb-text-gray" />
          </Link>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-lg border border-line bg-white text-navy lg:hidden" onClick={onMenu} aria-label="فتح قائمة لوحة التحكم">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function IndividualDashboardShell({ role, nav, activePath, ownerName, children }: { role: DashboardRole; nav: DashboardNavGroup[]; activePath: string; ownerName: string; children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <IndividualDashboardShellContent role={role} nav={nav} activePath={activePath} ownerName={ownerName}>
        {children}
      </IndividualDashboardShellContent>
    </SidebarProvider>
  );
}

function IndividualDashboardShellContent({
  role,
  nav,
  activePath,
  ownerName,
  children,
}: {
  role: DashboardRole;
  nav: DashboardNavGroup[];
  activePath: string;
  ownerName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white mb-text-ink" dir="rtl">
      <div className="flex min-h-screen w-full">
        <DashboardSidebar role={role} nav={nav} activePath={activePath} ownerName={ownerName} className="z-30" />

        <SidebarInset className="min-w-0">
          <main className="min-w-0 flex-1 px-4 py-5 lg:px-5">
            <div className="mb-5 flex min-h-11 items-center justify-between">
              <SidebarTrigger className="grid h-11 w-11 place-items-center rounded-lg border border-line bg-white text-navy rtl:rotate-180 md:hidden" aria-label="فتح/طي قائمة لوحة التحكم" />
              <div className="hidden lg:block" />
              <div className="ms-auto flex items-center gap-3">
                <Link href={dashboardHref(role, "notifications")} className="relative grid h-11 w-11 place-items-center rounded-md border mb-border-individual-soft bg-white mb-text-ink transition hover:mb-bg-warm" aria-label="الإشعارات">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full mb-bg-notice px-1 text-[11px] font-extrabold text-white">3</span>
                </Link>
                <Link href={dashboardHref(role, "messages")} className="grid h-11 w-11 place-items-center rounded-md border mb-border-individual-soft bg-white mb-text-ink transition hover:mb-bg-warm" aria-label="الرسائل">
                  <Mail className="h-5 w-5" />
                </Link>
                <Link href={dashboardHref(role, "personal-profile")} className="grid h-11 w-11 place-items-center rounded-md border mb-border-individual-soft bg-white mb-text-ink transition hover:mb-bg-warm" aria-label={ownerName}>
                  <UserRound className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <div key={pathname} className="w-full animate-[dashIn_260ms_ease-out]">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>

      <style jsx global>{`
        @keyframes dashIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export function DashboardShell({ role, nav, activePath, ownerName = "بندر", children }: { role: DashboardRole; nav: DashboardNavGroup[]; activePath: string; ownerName?: string; children: React.ReactNode }) {
  if (role === "individual") {
    return <IndividualDashboardShell role={role} nav={nav} activePath={activePath} ownerName={ownerName}>{children}</IndividualDashboardShell>;
  }

  if (role === "business") {
    return <BusinessDashboardShell role={role} nav={nav} activePath={activePath} ownerName={ownerName}>{children}</BusinessDashboardShell>;
  }

  return <LegacyDashboardShell role={role} nav={nav} activePath={activePath} ownerName={ownerName}>{children}</LegacyDashboardShell>;
}

function BusinessDashboardShell({ role, nav, activePath, ownerName, children }: { role: DashboardRole; nav: DashboardNavGroup[]; activePath: string; ownerName: string; children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <BusinessDashboardShellContent role={role} nav={nav} activePath={activePath} ownerName={ownerName}>
        {children}
      </BusinessDashboardShellContent>
    </SidebarProvider>
  );
}

function BusinessDashboardShellContent({
  role,
  nav,
  activePath,
  ownerName,
  children,
}: {
  role: DashboardRole;
  nav: DashboardNavGroup[];
  activePath: string;
  ownerName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const profileMode = activePath === "profile";

  return (
    <div className="min-h-screen bg-white mb-text-navy" dir="rtl">
      <style dangerouslySetInnerHTML={{ __html: dashboardBusinessCss }} />
      <div className="flex min-h-screen w-full">
        <DashboardSidebar role={role} nav={nav} activePath={activePath} ownerName={ownerName} className="z-30" />

        <SidebarInset className="min-w-0">
          <main className="min-w-0 flex-1 px-4 py-4 lg:px-5">
            <div className="mb-4 flex min-h-12 items-center justify-between border-b mb-border-subtle pb-3">
              <SidebarTrigger className="grid h-11 w-11 place-items-center rounded-lg border mb-border-page bg-white mb-text-navy rtl:rotate-180 md:hidden" aria-label="فتح/طي قائمة لوحة التحكم" />
              <div className={cn("hidden lg:block", profileMode ? "flex-1" : "")} />
              <div className={cn("flex items-center mb-text-navy", profileMode ? "gap-3" : "gap-5")}>
                {profileMode ? (
                  <>
                    <div className="me-5 hidden items-center gap-3 border-s border-[#E8DED4] ps-5 lg:flex">
                      <div className="text-right">
                        <p className="text-[15px] font-extrabold leading-6 text-[#1D1916]">أحمد عبدالله</p>
                        <p className="mt-0.5 text-xs font-bold text-[#1D1916]">مستثمر فرد.</p>
                      </div>
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-[#F4F0EC] text-[#1D1916]">
                        <UserRound className="h-7 w-7" />
                      </div>
                      <ChevronLeft className="h-4 w-4 -rotate-90 text-[#1D1916]" />
                    </div>
                    <Link href={dashboardHref(role, "notifications")} className="relative grid h-11 w-11 place-items-center rounded-md border border-[#E8DED4] bg-white text-[#1D1916]" aria-label="الإشعارات">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#C54B00] px-1 text-[11px] font-extrabold text-white">4</span>
                    </Link>
                    <Link href={dashboardHref(role, "messages")} className="relative grid h-11 w-11 place-items-center rounded-md border border-[#E8DED4] bg-white text-[#1D1916]" aria-label="الرسائل">
                      <Mail className="h-5 w-5" />
                      <span className="absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#C54B00] px-1 text-[11px] font-extrabold text-white">2</span>
                    </Link>
                    <Link href={dashboardHref(role, "profile")} className="grid h-11 w-11 place-items-center rounded-md border border-[#E8DED4] bg-white text-[#1D1916]" aria-label="الملف الشخصي">
                      <UserRound className="h-5 w-5" />
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href={dashboardHref(role, "profile")} className="grid h-12 w-12 place-items-center rounded-full border mb-border-page text-[18px] font-extrabold" aria-label={ownerName}>
                      م
                    </Link>
                    <ChevronLeft className="h-4 w-4 -rotate-90 fill-mb-navy" />
                    <Link href={dashboardHref(role, "messages")} className="grid h-11 w-11 place-items-center" aria-label="الرسائل">
                      <Mail className="h-7 w-7 stroke-[1.8]" />
                    </Link>
                    <Link href={dashboardHref(role, "support")} className="grid h-11 w-11 place-items-center" aria-label="الدعم الفني">
                      <Headphones className="h-7 w-7 stroke-[1.8]" />
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div key={pathname} className="w-full animate-[dashIn_260ms_ease-out]">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>

      <style jsx global>{`
        @keyframes dashIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function LegacyDashboardShell({ role, nav, activePath, ownerName, children }: { role: DashboardRole; nav: DashboardNavGroup[]; activePath: string; ownerName: string; children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LegacyDashboardShellContent role={role} nav={nav} activePath={activePath} ownerName={ownerName}>
        {children}
      </LegacyDashboardShellContent>
    </SidebarProvider>
  );
}

function LegacyDashboardShellContent({
  role,
  nav,
  activePath,
  ownerName,
  children,
}: {
  role: DashboardRole;
  nav: DashboardNavGroup[];
  activePath: string;
  ownerName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen mb-bg-cream text-ink" dir="rtl">
      <div className="fixed inset-0 -z-10 mb-legacy-backdrop" />
      <div dir="ltr" className="grid min-h-screen w-full grid-cols-1 gap-0 md:grid-cols-[minmax(0,1fr)_auto] lg:px-4">
        <div dir="rtl" className="md:col-start-2 md:row-start-1">
          <DashboardSidebar role={role} nav={nav} activePath={activePath} ownerName={ownerName} className="z-30" />
        </div>

        <SidebarInset dir="rtl" className="min-w-0 md:col-start-1 md:row-start-1">
          <main className="min-w-0 flex-1 px-4 py-4 sm:px-6 lg:px-7">
            <div className="mb-4 flex min-h-20 items-center justify-between rounded-2xl border border-line bg-white/86 px-4 mb-shadow-legacy-top backdrop-blur lg:hidden">
              <BrandLogo height={70} />
              <SidebarTrigger className="grid h-11 w-11 place-items-center rounded-full bg-white text-navy rtl:rotate-180" aria-label="فتح/طي قائمة لوحة التحكم" />
            </div>
            <div key={pathname} className="w-full animate-[dashIn_260ms_ease-out]">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>

      <style jsx global>{`
        @keyframes dashIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
