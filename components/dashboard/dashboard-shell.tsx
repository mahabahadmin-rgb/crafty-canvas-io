"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  Camera,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  ClipboardList,
  Crown,
  File,
  FileText,
  Folder,
  Headphones,
  Heart,
  Home,
  IdCard,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  PieChart,
  Plus,
  ReceiptText,
  Search,
  Settings2,
  ShieldCheck,
  Star,
  Tag,
  UserRound,
  Users,
  WalletCards,
  X,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { cn } from "@/lib/utils";
import { navigation } from "@/lib/data/navigation";
import { dashboardHref, type DashboardNavGroup, type DashboardRole } from "@/lib/data/dashboard";
import { dashboardBusinessCss } from "@/lib/styles/dashboard-business-css";
import {
  Sidebar as DashboardUiSidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const icons: Record<string, LucideIcon> = {
  home: Home,
  box: BriefcaseBusiness,
  users: Users,
  plus: Plus,
  heart: Heart,
  clipboard: ClipboardList,
  briefcase: BriefcaseBusiness,
  settings: Settings2,
  file: File,
  tag: Tag,
  camera: Camera,
  id: IdCard,
  user: UserRound,
  folder: Folder,
  bell: Bell,
  shield: ShieldCheck,
  crown: Crown,
  receipt: ReceiptText,
  wallet: WalletCards,
  chart: BarChart3,
  "file-text": FileText,
  pie: PieChart,
  message: MessageSquare,
  headset: Headphones,
  building: Building2,
  layout: LayoutDashboard,
  star: Star,
  "circle-dollar": CircleDollarSign,
  search: Search,
  clock: Clock3,
  x: XCircle,
};

function Icon({ name, className }: { name: string; className?: string }) {
  const Component = icons[name] ?? File;
  return <Component className={className} />;
}

const sidebarBorderColor = "rgba(232, 222, 212, 0.85)";

function SidebarContent({
  role,
  nav,
  activePath,
  collapsed = false,
  onToggleCollapsed,
  onNavigate,
}: {
  role: DashboardRole;
  nav: DashboardNavGroup[];
  activePath: string;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  onNavigate?: () => void;
}) {
  const [tooltip, setTooltip] = useState<{ label: string; top: number; right: number } | null>(null);

  const showCollapsedTooltip = (label: string, element: HTMLElement) => {
    if (!collapsed) return;
    const rect = element.getBoundingClientRect();
    setTooltip({
      label,
      top: rect.top + rect.height / 2,
      right: window.innerWidth - rect.left + 12,
    });
  };

  return (
    <div
      className={cn(
        "relative flex min-h-full flex-col bg-white py-5 text-[15px] mb-shadow-sidebar transition-[padding,width] duration-300 ease-out lg:border-s",
        collapsed ? "px-3" : "px-5",
      )}
      style={{ borderColor: sidebarBorderColor }}
    >
      {onToggleCollapsed ? (
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "توسيع الشريط الجانبي" : "طي الشريط الجانبي"}
          title={collapsed ? "توسيع الشريط الجانبي" : "طي الشريط الجانبي"}
          className="dashboard-collapse-toggle absolute z-20 hidden h-9 w-9 place-items-center rounded-full border bg-white mb-text-brown transition lg:grid"
          style={{
            insetInlineStart: "-18px",
            top: "28px",
            borderColor: sidebarBorderColor,
            backgroundColor: "#fffdf9",
            boxShadow: "0 12px 28px rgba(7, 26, 45, 0.12)",
            outline: "none",
          }}
        >
          {collapsed ? <ChevronLeft className="h-[18px] w-[18px] rtl:rotate-180" /> : <ChevronRight className="h-[18px] w-[18px] rtl:rotate-180" />}
        </button>
      ) : null}

      <div className={cn("mb-5 flex items-center gap-4 border-b pb-5", collapsed ? "justify-center" : "justify-between")} style={{ borderColor: sidebarBorderColor }}>
        {collapsed ? (
          <Link
            href={dashboardHref(role)}
            className="grid h-14 w-14 place-items-center rounded-2xl border mb-bg-brown-soft font-display text-2xl font-extrabold mb-text-brown"
            style={{ borderColor: sidebarBorderColor }}
            aria-label="مهابة"
            title="مهابة"
          >
            م
          </Link>
        ) : (
          <BrandLogo height={76} priority />
        )}
        <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-navy lg:hidden" onClick={onNavigate} aria-label="إغلاق القائمة">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="grid gap-0" aria-label="تنقل لوحة التحكم">
        {nav.map((group) => (
          <section key={group.title} className="border-b py-4 first:pt-0 last:border-b-0" style={{ borderColor: sidebarBorderColor }}>
            {collapsed ? (
              <div className="mx-auto mb-2 h-px w-8 rounded-full mb-bg-divider" aria-hidden="true" />
            ) : (
              <h2 className="mb-2 px-2 font-display text-[16px] font-extrabold leading-7 text-ink">{group.title}</h2>
            )}
            <div className="grid gap-1">
              {group.items.map((item) => {
                const active = item.path === activePath;
                return (
                  <Link
                    key={`${group.title}-${item.path}`}
                    href={dashboardHref(role, item.path)}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    style={
                      active
                        ? {
                            backgroundColor: "#f4ebe5",
                            color: "#8F6B4C",
                            boxShadow: "inset 0 0 0 1px rgba(232, 210, 195, 0.9)",
                          }
                        : undefined
                    }
                    className={cn(
                      "dashboard-sidebar-link group relative flex min-h-11 items-center rounded-xl text-[13px] font-bold leading-none transition",
                      collapsed ? "justify-center px-0" : "justify-between px-3",
                      active
                        ? "mb-bg-legacy-active mb-text-legacy-accent mb-shadow-inset"
                        : "text-navy hover:mb-bg-legacy hover:mb-text-legacy-accent",
                    )}
                    title={collapsed ? item.label : undefined}
                    aria-label={item.label}
                    onMouseEnter={(event) => showCollapsedTooltip(item.label, event.currentTarget)}
                    onMouseLeave={() => setTooltip(null)}
                    onFocus={(event) => showCollapsedTooltip(item.label, event.currentTarget)}
                    onBlur={() => setTooltip(null)}
                  >
                    <span className={cn("flex min-w-0 items-center", collapsed ? "justify-center" : "gap-3")}>
                      <Icon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
                      <span className={cn("truncate whitespace-nowrap", collapsed ? "sr-only" : "")}>{item.label}</span>
                    </span>
                    {item.badge ? (
                      <span
                        className={cn(
                          "grid h-5 min-w-5 shrink-0 place-items-center rounded-full mb-bg-red px-1.5 text-[11px] font-extrabold text-white",
                          collapsed ? "absolute -end-1 -top-1" : "",
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      <div className="mt-auto grid gap-2 pt-5">
        <Link
          href="/api/auth/logout"
          onClick={onNavigate}
          className={cn("flex min-h-11 items-center justify-center rounded-xl border border-line bg-white text-[13px] font-extrabold mb-text-legacy-accent transition hover:bg-white", collapsed ? "px-0" : "gap-2")}
          style={{ borderColor: sidebarBorderColor }}
          aria-label="تسجيل الخروج"
          title="تسجيل الخروج"
        >
          <LogOut className="h-[18px] w-[18px]" />
          <span className={collapsed ? "sr-only" : ""}>تسجيل الخروج</span>
        </Link>
        <Link href="/" onClick={onNavigate} className={cn("hidden min-h-10 items-center justify-center rounded-xl text-[12px] font-bold text-navy/55 transition hover:mb-text-legacy-accent lg:flex", collapsed ? "sr-only" : "")}>
          العودة للموقع
        </Link>
      </div>

      {collapsed && tooltip ? (
        <div
          className="pointer-events-none fixed whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold text-white"
          style={{
            top: tooltip.top,
            right: tooltip.right,
            zIndex: 80,
            transform: "translateY(-50%)",
            backgroundColor: "#1D1916",
            boxShadow: "0 12px 28px rgba(7, 26, 45, 0.16)",
          }}
        >
          {tooltip.label}
        </div>
      ) : null}
    </div>
  );
}

function DashboardSidebarPanel({
  role,
  nav,
  activePath,
}: {
  role: DashboardRole;
  nav: DashboardNavGroup[];
  activePath: string;
}) {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavigate = () => {
    if (isMobile) setOpenMobile(false);
  };

  if (role === "individual") {
    return (
      <IndividualSidebarContent
        role={role}
        nav={nav}
        activePath={activePath}
        onNavigate={handleNavigate}
      />
    );
  }

  if (role === "business") {
    return (
      <BusinessSidebarContent
        role={role}
        nav={nav}
        activePath={activePath}
        onNavigate={handleNavigate}
      />
    );
  }

  return (
    <SidebarContent
      role={role}
      nav={nav}
      activePath={activePath}
      onNavigate={handleNavigate}
    />
  );
}

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

function IndividualSidebarContent({
  role,
  nav,
  activePath,
  onNavigate,
}: {
  role: DashboardRole;
  nav: DashboardNavGroup[];
  activePath: string;
  onNavigate?: () => void;
}) {
  const communicationMode = ["messages", "support", "personal-profile", "verification"].includes(activePath);

  return (
    <div className={cn("relative flex min-h-full flex-col overflow-hidden px-5 py-3 text-[14px] mb-shadow-shell", communicationMode ? "bg-[#1D1916] text-white" : "bg-white")}>
      <div className={cn("relative z-10 mb-3 border-b pb-3 text-center", communicationMode ? "-mx-5 -mt-3 bg-white px-5 pt-4 mb-border-individual-line" : "mb-border-individual-line")}>
        {communicationMode ? (
          <Link href={dashboardHref(role)} className="mx-auto block w-fit text-center" aria-label="مهابة">
            <strong className="block font-display text-4xl font-extrabold leading-none text-[#1D1916]">مهابة</strong>
            <span className="mt-1 block text-[10px] font-bold tracking-[0.28em] text-[#A7815E]">MAHABAH</span>
            <span className="mt-1 block text-[10px] font-bold text-[#1D1916]">إدارة المساهمات العقارية</span>
          </Link>
        ) : (
          <BrandLogo height={64} priority />
        )}
        <div className="mt-3 flex items-center justify-center gap-3">
          <div className="text-right">
            <p className="text-[15px] font-extrabold leading-6 mb-text-ink">{communicationMode ? "أحمد عبدالله" : "بندر محمد"}</p>
            <p className="mt-0.5 flex items-center justify-end gap-2 text-xs font-bold mb-text-subtle">
              <span>{communicationMode ? "مستثمر فرد." : "عضو نشط"}</span>
              <span className="h-2 w-2 rounded-full bg-[#087342]" aria-hidden="true" />
            </p>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-full border mb-border-individual-soft bg-white mb-text-ink">
            <UserRound className="h-6 w-6 stroke-[1.45]" />
          </div>
        </div>
      </div>

      <nav className="relative z-10 grid gap-0" aria-label="تنقل حساب الأفراد">
        {nav.map((group, groupIndex) => (
          <section
            key={`${group.title || "root"}-${groupIndex}`}
            className={cn("border-b py-1 last:border-b-0", !group.title ? "py-1" : "", communicationMode ? "border-white/10" : "mb-border-individual-line")}
          >
            {group.title ? (
              <div className={cn("flex min-h-9 items-center justify-between rounded-lg px-3", communicationMode ? "text-white" : "mb-text-ink")}>
                <span className="flex items-center gap-3 font-display text-[15px] font-extrabold">
                  <Icon name={group.items[0]?.icon ?? "file"} className={cn("h-[18px] w-[18px]", communicationMode ? "text-[#A7815E]" : "mb-text-personal-accent")} />
                  {group.title}
                </span>
                <ChevronLeft className={cn("h-3.5 w-3.5 -rotate-90", communicationMode ? "text-[#A7815E]" : "mb-text-ink")} />
              </div>
            ) : null}

            <div className="grid gap-1">
              {group.items.map((item) => {
                const active = item.path === activePath || (activePath === "verification" && item.path === "personal-profile");
                return (
                  <Link
                    key={`${group.title}-${item.path}-${item.label}`}
                    href={dashboardHref(role, item.path)}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-7 items-center justify-between rounded-lg px-4 text-[14px] font-bold transition",
                      communicationMode
                        ? active
                          ? "bg-white/8 text-[#D18A42]"
                          : "text-white/82 hover:bg-white/6 hover:text-[#D18A42]"
                        : active
                          ? "mb-bg-personal-active mb-text-personal-accent"
                          : "mb-text-ink hover:mb-bg-personal hover:mb-text-personal-accent",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Icon name={item.icon} className={cn("h-4 w-4", communicationMode ? "text-[#A7815E]" : "mb-text-personal-accent")} />
                      {item.label}
                    </span>
                    {item.badge ? <span className="grid h-5 min-w-5 place-items-center rounded-full mb-bg-notice px-1.5 text-[11px] font-extrabold text-white">{item.badge}</span> : null}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      {communicationMode ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 opacity-25" aria-hidden="true">
          <div className="absolute bottom-8 right-6 h-32 w-52 border border-[#A7815E]/50" />
          <div className="absolute bottom-10 right-14 h-24 w-36 border border-[#A7815E]/40" />
          <div className="absolute bottom-8 right-0 h-px w-full bg-[#A7815E]/35" />
        </div>
      ) : null}

      <Link
        href="/api/auth/logout"
        onClick={onNavigate}
        className={cn(
          "relative z-10 mt-auto flex min-h-11 items-center justify-center gap-2 rounded-lg border text-sm font-extrabold transition",
          communicationMode ? "border-white/10 bg-transparent text-white hover:bg-white/6" : "mb-border-individual-soft bg-white mb-text-personal-accent hover:mb-bg-warm",
        )}
      >
        <LogOut className="h-4 w-4" />
        تسجيل الخروج
      </Link>
    </div>
  );
}

function IndividualDashboardShell({ role, nav, activePath, ownerName, children }: { role: DashboardRole; nav: DashboardNavGroup[]; activePath: string; ownerName: string; children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-white mb-text-ink" dir="rtl">
        <div className="mx-auto flex min-h-screen w-full max-w-[1536px]">
          <DashboardUiSidebar side="right" className="z-30" collapsible="offcanvas">
            <DashboardSidebarPanel role={role} nav={nav} activePath={activePath} />
          </DashboardUiSidebar>

          <SidebarInset className="min-w-0">
            <main className="min-w-0 flex-1 px-4 py-5 lg:px-5">
              <div className="mb-5 flex min-h-11 items-center justify-between">
                <SidebarTrigger className="grid h-11 w-11 place-items-center rounded-lg border border-line bg-white text-navy rtl:rotate-180 lg:hidden" aria-label="فتح قائمة لوحة التحكم" />
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

              <div key={pathname} className="mx-auto max-w-[1185px] animate-[dashIn_260ms_ease-out]">
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
    </SidebarProvider>
  );
}

export function DashboardShell({ role, nav, activePath, ownerName = "بندر", children }: { role: DashboardRole; nav: DashboardNavGroup[]; activePath: string; ownerName?: string; children: React.ReactNode }) {
  if (role === "individual") {
    return <IndividualDashboardShell role={role} nav={nav} activePath={activePath} ownerName={ownerName}>{children}</IndividualDashboardShell>;
  }

  if (role === "business") {
    return <BusinessDashboardShell role={role} nav={nav} activePath={activePath} ownerName={ownerName}>{children}</BusinessDashboardShell>;
  }

  return <LegacyDashboardShell role={role} nav={nav} activePath={activePath}>{children}</LegacyDashboardShell>;
}

function BusinessSidebarContent({
  role,
  nav,
  activePath,
  onNavigate,
}: {
  role: DashboardRole;
  nav: DashboardNavGroup[];
  activePath: string;
  onNavigate?: () => void;
}) {
  const profileMode = activePath === "profile";

  return (
    <div className={cn("relative flex min-h-full flex-col overflow-hidden px-5 pb-5 pt-4", profileMode ? "bg-[#1D1916] text-white" : "bg-white mb-text-navy")}>
      <div className={cn("relative z-10 mb-5 flex items-start justify-between border-b pb-4", profileMode ? "-mx-5 -mt-4 bg-white px-5 pt-4 mb-border-page" : "mb-border-page")}>
        {profileMode ? (
          <Link href={dashboardHref(role)} className="text-center" aria-label="مهابة">
            <strong className="block font-display text-4xl font-extrabold leading-none text-[#1D1916]">مهابة</strong>
            <span className="mt-1 block text-[10px] font-bold tracking-[0.28em] text-[#A7815E]">MAHABAH</span>
            <span className="mt-1 block text-[10px] font-bold text-[#1D1916]">إدارة المساهمات العقارية</span>
          </Link>
        ) : (
          <BrandLogo height={76} priority />
        )}
        <button type="button" className="grid h-10 w-10 place-items-center mb-text-navy lg:hidden" onClick={onNavigate} aria-label="إغلاق القائمة">
          <X className="h-6 w-6" />
        </button>
        <Menu className={cn("mt-3 hidden h-7 w-7 lg:block", profileMode ? "text-[#1D1916]" : "")} />
      </div>

      <nav className="relative z-10 grid gap-0" aria-label="تنقل حساب الأعمال">
        {nav.map((group, groupIndex) => {
          const isHomeGroup = groupIndex === 0;
          return (
            <section key={`${group.title}-${groupIndex}`} className={cn("border-b py-3", profileMode ? "border-white/10" : "mb-border-page", isHomeGroup ? "pb-4 pt-0" : "")}>
              {isHomeGroup ? (
                group.items.map((item) => {
                  const active = item.path === activePath;
                  return (
                    <Link
                      key={item.path || "home"}
                      href={dashboardHref(role, item.path)}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-11 items-center justify-between rounded-md px-4 text-[16px] font-extrabold transition",
                        profileMode
                          ? active
                            ? "bg-white/8 text-[#D18A42]"
                            : "text-white/82 hover:bg-white/6 hover:text-[#D18A42]"
                          : active
                            ? "mb-bg-nav-active mb-text-accent-dark"
                            : "hover:mb-bg-nav",
                      )}
                    >
                      <span>{item.label}</span>
                      <Icon name={item.icon} className={cn("h-6 w-6", profileMode ? "text-[#A7815E]" : "mb-text-accent-dark")} />
                    </Link>
                  );
                })
              ) : (
                <>
                  <div className={cn("mb-1 flex min-h-9 items-center justify-between px-3", profileMode ? "text-white" : "")}>
                    <span className="text-[18px] font-extrabold leading-7">{group.title}</span>
                    <Icon name={group.items[0]?.icon ?? "file"} className={cn("h-6 w-6", profileMode ? "text-[#A7815E]" : "mb-text-navy")} />
                  </div>
                  <div className="grid gap-0.5 ps-6">
                    {group.items.map((item) => {
                      const active = item.path === activePath;
                      return (
                        <Link
                          key={`${group.title}-${item.path}`}
                          href={dashboardHref(role, item.path)}
                          onClick={onNavigate}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex min-h-8 items-center justify-between rounded-md px-3 text-[14px] font-bold leading-6 transition",
                            profileMode
                              ? active
                                ? "bg-white/8 text-[#D18A42]"
                                : "text-white/82 hover:bg-white/6 hover:text-[#D18A42]"
                              : active
                                ? "mb-bg-nav-active mb-text-accent-dark"
                                : "mb-text-subtle hover:mb-bg-nav hover:mb-text-accent-dark",
                          )}
                        >
                          <span>{item.label}</span>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </section>
          );
        })}
      </nav>

      {profileMode ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 opacity-25" aria-hidden="true">
          <div className="absolute bottom-10 right-4 h-40 w-60 border border-[#A7815E]/50" />
          <div className="absolute bottom-12 right-12 h-32 w-44 border border-[#A7815E]/40" />
          <div className="absolute bottom-8 right-0 h-px w-full bg-[#A7815E]/35" />
        </div>
      ) : null}

      <Link href="/api/auth/logout" onClick={onNavigate} className={cn("relative z-10 mt-auto flex min-h-12 items-center justify-between border-t pt-5 text-[18px] font-extrabold", profileMode ? "border-white/10 text-white" : "mb-border-page mb-text-navy")}>
        <span>تسجيل الخروج</span>
        <LogOut className="h-7 w-7" />
      </Link>
    </div>
  );
}

function BusinessDashboardShell({ role, nav, activePath, ownerName, children }: { role: DashboardRole; nav: DashboardNavGroup[]; activePath: string; ownerName: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const profileMode = activePath === "profile";

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-white mb-text-navy" dir="rtl">
        <style dangerouslySetInnerHTML={{ __html: dashboardBusinessCss }} />
        <div className="mx-auto flex min-h-screen w-full max-w-[1536px]">
          <DashboardUiSidebar side="right" className="z-30" collapsible="offcanvas">
            <DashboardSidebarPanel role={role} nav={nav} activePath={activePath} />
          </DashboardUiSidebar>

          <SidebarInset className="min-w-0">
            <main className="min-w-0 flex-1 px-4 py-4 lg:px-5">
              <div className="mb-4 flex min-h-12 items-center justify-between border-b mb-border-subtle pb-3">
                <SidebarTrigger className="grid h-11 w-11 place-items-center rounded-lg border mb-border-page bg-white mb-text-navy rtl:rotate-180 lg:hidden" aria-label="فتح قائمة لوحة التحكم" />
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
              <div key={pathname} className="mx-auto max-w-[1180px] animate-[dashIn_260ms_ease-out]">
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
    </SidebarProvider>
  );
}

function LegacyDashboardShell({ role, nav, activePath, children }: { role: DashboardRole; nav: DashboardNavGroup[]; activePath: string; children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="min-h-screen mb-bg-cream text-ink" dir="rtl">
        <div className="fixed inset-0 -z-10 mb-legacy-backdrop" />
        <div className="mx-auto flex min-h-screen w-full max-w-[1500px] gap-0 lg:px-4">
          <DashboardUiSidebar side="right" className="z-30" collapsible="offcanvas">
            <DashboardSidebarPanel role={role} nav={nav} activePath={activePath} />
          </DashboardUiSidebar>

          <SidebarInset className="min-w-0">
            <main className="min-w-0 flex-1 px-4 py-4 sm:px-6 lg:px-7">
              <div className="mb-4 flex min-h-20 items-center justify-between rounded-2xl border border-line bg-white/86 px-4 mb-shadow-legacy-top backdrop-blur lg:hidden">
                <BrandLogo height={70} />
                <SidebarTrigger className="grid h-11 w-11 place-items-center rounded-full bg-white text-navy rtl:rotate-180 lg:hidden" aria-label="فتح قائمة لوحة التحكم" />
              </div>
              <div key={pathname} className="mx-auto max-w-[1180px] animate-[dashIn_260ms_ease-out]">
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
    </SidebarProvider>
  );
}
