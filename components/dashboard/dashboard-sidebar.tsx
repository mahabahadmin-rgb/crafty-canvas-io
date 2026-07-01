"use client";

import type * as React from "react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { type DashboardNavGroup, type DashboardRole } from "@/lib/data/dashboard";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { DashboardNavUser } from "@/components/dashboard/dashboard-nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export function DashboardSidebar({
  role,
  nav,
  activePath,
  ownerName,
  side: _side,
  collapsible: _collapsible,
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
        <div className="flex h-16 items-center px-2 group-data-[collapsible=icon]:h-12">
          {/* Expanded: logo on the right (RTL start), toggle on the left (inner edge) */}
          <div className="flex w-full items-center justify-between group-data-[collapsible=icon]:hidden">
            <BrandLogo height={52} priority />
            <SidebarTrigger
              className="h-8 w-8 shrink-0 rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground rtl:rotate-180"
              aria-label="طي الشريط الجانبي"
            />
          </div>
          {/* Collapsed: toggle button centered in icon strip */}
          <div className="hidden w-full items-center justify-center group-data-[collapsible=icon]:flex">
            <SidebarTrigger
              className="h-9 w-9 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground rtl:rotate-180"
              aria-label="فتح الشريط الجانبي"
            />
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
