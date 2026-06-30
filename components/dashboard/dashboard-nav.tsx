"use client";

import Link from "next/link";
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  Camera,
  ChevronDown,
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
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { dashboardHref, type DashboardNavGroup, type DashboardNavItem, type DashboardRole } from "@/lib/data/dashboard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
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

function NavIcon({ name, className }: { name: string; className?: string }) {
  const Component = icons[name] ?? File;
  return <Component className={className} />;
}

function DashboardNavLink({
  role,
  item,
  activePath,
  onNavigate,
}: {
  role: DashboardRole;
  item: DashboardNavItem;
  activePath: string;
  onNavigate?: () => void;
}) {
  const active = item.path === activePath;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} tooltip={{ children: item.label, side: "left" }}>
        <Link href={dashboardHref(role, item.path)} onClick={onNavigate} aria-current={active ? "page" : undefined}>
          <NavIcon name={item.icon} />
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
      {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
    </SidebarMenuItem>
  );
}

export function DashboardNav({
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
  return (
    <>
      {nav.map((group, groupIndex) => {
        const groupKey = `${group.title || "root"}-${groupIndex}`;

        if (!group.title) {
          return (
            <SidebarGroup key={groupKey}>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <DashboardNavLink key={item.path || item.label} role={role} item={item} activePath={activePath} onNavigate={onNavigate} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        }

        return (
          <Collapsible key={groupKey} defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  <span>{group.title}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <DashboardNavLink key={item.path || item.label} role={role} item={item} activePath={activePath} onNavigate={onNavigate} />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        );
      })}
    </>
  );
}
