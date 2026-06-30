"use client";

import type * as React from "react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { type DashboardNavGroup, type DashboardRole } from "@/lib/data/dashboard";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { DashboardNavUser } from "@/components/dashboard/dashboard-nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from "@/components/ui/sidebar";

export function DashboardSidebar({
  role,
  nav,
  activePath,
  ownerName,
  ...props
}: {
  role: DashboardRole;
  nav: DashboardNavGroup[];
  activePath: string;
  ownerName: string;
} & React.ComponentProps<typeof Sidebar>) {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavigate = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar side="right" collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex h-16 items-center justify-center px-2 group-data-[collapsible=icon]:h-12">
          <div className="group-data-[collapsible=icon]:hidden">
            <BrandLogo height={56} priority />
          </div>
          <div
            aria-hidden="true"
            className="hidden h-9 w-9 items-center justify-center rounded-lg bg-sidebar-accent font-display text-base font-extrabold text-sidebar-accent-foreground group-data-[collapsible=icon]:flex"
          >
            م
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <DashboardNav role={role} nav={nav} activePath={activePath} onNavigate={handleNavigate} />
      </SidebarContent>
      <SidebarFooter>
        <DashboardNavUser ownerName={ownerName} onNavigate={handleNavigate} />
      </SidebarFooter>
    </Sidebar>
  );
}
