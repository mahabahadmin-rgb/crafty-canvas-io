# Dashboard Sidebar Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the three duplicated, hand-rolled sidebar implementations in `dashboard-shell.tsx` with one shared sidebar built from the existing shadcn sidebar primitives (sidebar-07 composition pattern), correctly docked on the right for the app's global RTL layout, and delete the dead unused shadcn boilerplate files.

**Architecture:** Three new small files (`dashboard-nav.tsx`, `dashboard-nav-user.tsx`, `dashboard-sidebar.tsx`) compose the existing `components/ui/sidebar.tsx` primitives, driven by the real `DashboardNavGroup[]` data already in `lib/data/dashboard.ts`. `dashboard-shell.tsx` is edited (not rewritten from scratch) to delete its three bespoke sidebar functions and call the new shared `DashboardSidebar` instead. The public `DashboardShell({ role, nav, activePath, ownerName, children })` API is unchanged.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS 4, shadcn/ui sidebar primitives (already present in `components/ui/sidebar.tsx`), lucide-react icons.

**No test framework exists for components** (no jest/vitest/testing-library — only Playwright route smoke tests). Verification for this plan is: TypeScript type-check, ESLint, and manual browser checks of `/dashboard/individual`, `/dashboard/business`, `/dashboard/admin` in expanded, icon-collapsed, and mobile states.

---

## Task 1: Delete dead shadcn boilerplate

**Files:**
- Delete: `components/app-sidebar.tsx`
- Delete: `components/nav-main.tsx`
- Delete: `components/nav-user.tsx`
- Delete: `components/nav-projects.tsx`
- Delete: `components/team-switcher.tsx`

- [ ] **Step 1: Confirm nothing imports these files**

Run: `grep -rn "app-sidebar\|nav-main\|nav-user\|nav-projects\|team-switcher" --include="*.tsx" --include="*.ts" . --exclude-dir=node_modules --exclude-dir=.next`

Expected: only the 5 files themselves appear (each importing from `@/components/ui/*`, never imported elsewhere). If any other file imports one of these, stop and investigate before deleting.

- [ ] **Step 2: Delete the files**

```bash
git rm components/app-sidebar.tsx components/nav-main.tsx components/nav-user.tsx components/nav-projects.tsx components/team-switcher.tsx
```

- [ ] **Step 3: Commit**

```bash
git commit -m "Remove unused shadcn sidebar-07 scaffold boilerplate"
```

---

## Task 2: Create the shared nav renderer

**Files:**
- Create: `components/dashboard/dashboard-nav.tsx`

- [ ] **Step 1: Write the file**

```tsx
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
```

Note the `tooltip={{ children: item.label, side: "left" }}` override: the primitive's `SidebarMenuButton` defaults its collapsed-state tooltip to `side="right"`, which assumes a left-docked sidebar. Our sidebar is `side="right"`, so the tooltip must point `left` (toward the main content) or it renders off the edge of the viewport.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors referencing `dashboard-nav.tsx` (errors elsewhere from later tasks are expected until this plan is finished — ignore those for now).

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/dashboard-nav.tsx
git commit -m "Add shared DashboardNav sidebar-07 style nav renderer"
```

---

## Task 3: Create the NavUser footer dropdown

**Files:**
- Create: `components/dashboard/dashboard-nav-user.tsx`

- [ ] **Step 1: Write the file**

```tsx
"use client";

import Link from "next/link";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function DashboardNavUser({
  ownerName,
  onNavigate,
}: {
  ownerName: string;
  onNavigate?: () => void;
}) {
  const initial = ownerName.trim().charAt(0) || "م";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">{initial}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-semibold">{ownerName}</span>
              </div>
              <ChevronsUpDown className="ms-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-56 rounded-lg" side="top" align="end">
            <DropdownMenuItem asChild>
              <Link href="/api/auth/logout" onClick={onNavigate}>
                <LogOut className="me-2 h-4 w-4" />
                تسجيل الخروج
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors referencing `dashboard-nav-user.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/dashboard-nav-user.tsx
git commit -m "Add DashboardNavUser footer dropdown"
```

---

## Task 4: Create the assembled DashboardSidebar

**Files:**
- Create: `components/dashboard/dashboard-sidebar.tsx`

- [ ] **Step 1: Write the file**

```tsx
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
```

`...props` lets callers still pass extra props (e.g. `className="z-30"`) the way `dashboard-shell.tsx` does today. Note `side="right"` and `collapsible="icon"` are spread *before* `{...props}`, so if a caller ever explicitly passed `side`/`collapsible`, it would win — but no caller in Task 5 does, so the fixed right/icon behavior always applies in practice.

Note: `BrandLogo` (in `components/layout/brand-logo.tsx`) already renders its own internal `<Link href="/">` wrapping the logo image — wrapping it in another `Link` here would produce invalid nested `<a>` tags. The collapsed-state "م" glyph is a plain non-interactive `div` (matching the existing pattern in `dashboard-shell.tsx`, e.g. lines ~422-424 and ~650-652, which use a styled `div` with `aria-hidden`, not a link) — clicking it does nothing, consistent with current behavior; the brand mark is only a home-link when expanded, exactly as it behaves today via `dashboardHref`/`BrandLogo` placement elsewhere in this codebase. `dashboardHref` is no longer needed in this file since neither glyph is a link anymore.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors referencing `dashboard-sidebar.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/dashboard-sidebar.tsx
git commit -m "Add assembled DashboardSidebar (header + nav + footer)"
```

---

## Task 5: Rewire dashboard-shell.tsx onto the shared sidebar

**Files:**
- Modify: `components/dashboard/dashboard-shell.tsx`

This task deletes the three duplicated sidebar implementations and the inline icon map, and wires each role's shell wrapper to `<DashboardSidebar>`. The main-content header bars (bell/mail icons, profile chip) inside each `*DashboardShellContent` are untouched — only the sidebar half of each wrapper changes.

- [ ] **Step 1: Replace the import block and remove the inline icon map**

Find the existing import block at the top of the file (from `"use client";` down through the closing brace of the `Icon()` helper function and the line `const sidebarBorderColor = "rgba(232, 222, 212, 0.85)";`) and replace it with:

```tsx
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
import { dashboardHref, type DashboardNavGroup, type DashboardRole } from "@/lib/data/dashboard";
import { dashboardBusinessCss } from "@/lib/styles/dashboard-business-css";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
```

This drops: every lucide icon that was only used inside the now-deleted nav-rendering code (`Camera`, `ChevronDown`, `ChevronRight`, `CircleDollarSign`, `Clock3`, `ClipboardList`, `Crown`, `File`, `FileText`, `Folder`, `Heart`, `Home`, `IdCard`, `LayoutDashboard`, `PieChart`, `Plus`, `ReceiptText`, `Search`, `Settings2`, `ShieldCheck`, `Star`, `Tag`, `Users`, `WalletCards`, `BarChart3`, `MessageSquare`, `BriefcaseBusiness`, `Building2`, `LogOut`, `X`, `XCircle`, `type LucideIcon`); the `icons` map and `Icon()` helper (moved into `dashboard-nav.tsx`); the `useSidebar` import (no longer called directly in this file); the `Sidebar as DashboardUiSidebar` / `SidebarHeader` / `SidebarFooter` / `SidebarRail` imports (now internal to `dashboard-sidebar.tsx`); and the `sidebarBorderColor` constant (only used by the deleted sidebar markup).

- [ ] **Step 2: Delete the generic `SidebarContent` function**

Delete the entire function with signature `function SidebarContent({ role, nav, activePath, collapsed = false, onToggleCollapsed, onNavigate }: {...})` — from its opening line through its closing brace — in full, including the `showCollapsedTooltip` helper and the floating collapse-toggle `<button>` inside it. This is the legacy/admin sidebar body; its job is now done by `DashboardNav` + `DashboardSidebar`.

- [ ] **Step 3: Delete the `DashboardSidebarPanel` function**

Delete the entire `function DashboardSidebarPanel({ role, nav, activePath, collapsed = false, onToggleCollapsed }: {...}) { ... }` function — the role-dispatch switcher (`if (role === "individual") return <IndividualSidebarContent .../>` etc.). `DashboardSidebar` now plays this role directly and identically for every role.

- [ ] **Step 4: Delete the `IndividualSidebarContent` function**

Delete the entire `function IndividualSidebarContent({ role, nav, activePath, collapsed = false, onNavigate, onToggleCollapsed }: {...}) { ... }` function, including its dark "communication mode" branch.

Leave `_IndividualTopHeader` untouched directly below where `IndividualSidebarContent` used to be — it's a separate, currently-unused main-header component, out of scope for this refactor.

- [ ] **Step 5: Update `IndividualDashboardShellContent`**

Find:

```tsx
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
  const { state, toggleSidebar } = useSidebar();

  return (
    <div className="min-h-screen bg-white mb-text-ink" dir="rtl">
      <div className="flex min-h-screen w-full">
        <DashboardUiSidebar side="right" className="z-30" collapsible="icon">
          <DashboardSidebarPanel role={role} nav={nav} activePath={activePath} collapsed={state === "collapsed"} onToggleCollapsed={toggleSidebar} />
        </DashboardUiSidebar>

        <SidebarInset className="min-w-0">
```

Replace with:

```tsx
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
```

Everything below this point in the function (the header with bell/mail/profile links, the closing style block) stays exactly as-is.

- [ ] **Step 6: Delete the `BusinessSidebarContent` function**

Delete the entire `function BusinessSidebarContent({ role, nav, activePath, collapsed = false, onNavigate, onToggleCollapsed }: {...}) { ... }` function, including its dark "profile mode" branch and the `isHomeGroup` special-case rendering (the unified `DashboardNav` already renders untitled groups as plain, unwrapped menus — equivalent behavior).

- [ ] **Step 7: Update the `BusinessDashboardShellContent` signature and remove `useSidebar`**

Find:

```tsx
  const pathname = usePathname();
  const profileMode = activePath === "profile";
  const { state, toggleSidebar } = useSidebar();

  return (
    <div className="min-h-screen bg-white mb-text-navy" dir="rtl">
```

Replace with:

```tsx
  const pathname = usePathname();
  const profileMode = activePath === "profile";

  return (
    <div className="min-h-screen bg-white mb-text-navy" dir="rtl">
```

`profileMode` stays — it still drives the main-content header's conditional layout further down in the function, which is unchanged and out of scope. Leave the line that injects `dashboardBusinessCss` immediately below this block untouched.

- [ ] **Step 8: Swap the Business sidebar render**

Find:

```tsx
      <div className="flex min-h-screen w-full">
        <DashboardUiSidebar side="right" className="z-30" collapsible="icon">
          <DashboardSidebarPanel role={role} nav={nav} activePath={activePath} collapsed={state === "collapsed"} onToggleCollapsed={toggleSidebar} />
        </DashboardUiSidebar>

        <SidebarInset className="min-w-0">
          <main className="min-w-0 flex-1 px-4 py-4 lg:px-5">
            <div className="mb-4 flex min-h-12 items-center justify-between border-b mb-border-subtle pb-3">
```

Replace with:

```tsx
      <div className="flex min-h-screen w-full">
        <DashboardSidebar role={role} nav={nav} activePath={activePath} ownerName={ownerName} className="z-30" />

        <SidebarInset className="min-w-0">
          <main className="min-w-0 flex-1 px-4 py-4 lg:px-5">
            <div className="mb-4 flex min-h-12 items-center justify-between border-b mb-border-subtle pb-3">
```

- [ ] **Step 9: Thread `ownerName` into the Legacy (admin) shell and update `LegacyDashboardShellContent`**

Find:

```tsx
function LegacyDashboardShell({ role, nav, activePath, children }: { role: DashboardRole; nav: DashboardNavGroup[]; activePath: string; children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LegacyDashboardShellContent role={role} nav={nav} activePath={activePath}>
        {children}
      </LegacyDashboardShellContent>
    </SidebarProvider>
  );
}

function LegacyDashboardShellContent({
  role,
  nav,
  activePath,
  children,
}: {
  role: DashboardRole;
  nav: DashboardNavGroup[];
  activePath: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();

  return (
    <div className="min-h-screen mb-bg-cream text-ink" dir="rtl">
      <div className="fixed inset-0 -z-10 mb-legacy-backdrop" />
      <div dir="ltr" className="grid min-h-screen w-full grid-cols-1 gap-0 md:grid-cols-[minmax(0,1fr)_auto] lg:px-4">
        <div dir="rtl" className="md:col-start-2 md:row-start-1">
          <DashboardUiSidebar side="right" className="z-30" collapsible="icon">
            <DashboardSidebarPanel role={role} nav={nav} activePath={activePath} collapsed={state === "collapsed"} onToggleCollapsed={toggleSidebar} />
          </DashboardUiSidebar>
        </div>

        <SidebarInset dir="rtl" className="min-w-0 md:col-start-1 md:row-start-1">
```

Replace with:

```tsx
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
```

- [ ] **Step 10: Update the `DashboardShell` dispatcher to pass `ownerName` to Legacy**

Find:

```tsx
  return <LegacyDashboardShell role={role} nav={nav} activePath={activePath}>{children}</LegacyDashboardShell>;
```

Replace with:

```tsx
  return <LegacyDashboardShell role={role} nav={nav} activePath={activePath} ownerName={ownerName}>{children}</LegacyDashboardShell>;
```

(`ownerName` is already a parameter of `DashboardShell` with a `"بندر"` default and already correctly populated per-role from `config.ownerName` in `dashboard-page.tsx` — this just stops dropping it for the admin role.)

- [ ] **Step 11: Type-check and lint**

Run: `npx tsc --noEmit`
Expected: no errors. If any "X is declared but never used" errors appear for icons/types in `dashboard-shell.tsx`, remove that specific import — it means Step 1's import list missed accounting for one of the now-deleted usages.

Run: `npm run lint`
Expected: no errors (warnings about pre-existing, unrelated code are fine — do not fix unrelated lint debt in this change).

- [ ] **Step 12: Commit**

```bash
git add components/dashboard/dashboard-shell.tsx
git commit -m "Replace per-role duplicated sidebars with shared DashboardSidebar"
```

---

## Task 6: Manual verification in the browser

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

- [ ] **Step 2: Log in and check each role's dashboard, expanded sidebar**

Visit `/dashboard/individual`, `/dashboard/business`, `/dashboard/admin` (use whatever local auth/seed the project already supports — check `scripts/smoke-routes.mjs` env vars `MAHABAH_SMOKE_EMAIL`/`MAHABAH_SMOKE_PASSWORD` if a seeded test account exists). For each role, confirm:
- Sidebar is docked on the visual right edge of the screen.
- Nav groups show your real Arabic labels (no "Acme Inc" / "Playground" placeholder text anywhere).
- Clicking a group's label toggles its items open/closed, chevron rotates.
- The active nav item (matching the current path) is visually highlighted.
- Badge counts (e.g. "3" on الإشعارات, "2" on الرسائل) render correctly positioned.
- Footer shows the avatar + owner name; clicking it opens a dropdown with "تسجيل الخروج"; clicking that logs out.

- [ ] **Step 3: Check the collapsed (icon) state**

Click the `SidebarTrigger` in each role's main header to collapse the sidebar. Confirm:
- Sidebar shrinks to icon-only width, docked on the right.
- Brand logo swaps to the small "م" glyph.
- Hovering an icon shows a tooltip with the item's label, appearing to the **left** of the icon (toward the main content), not clipped off the right edge of the viewport.
- Footer avatar still works (dropdown still opens).

- [ ] **Step 4: Check mobile width**

Resize the browser to a mobile width (or use device toolbar at ~390px). Confirm the sidebar opens as a right-sliding sheet (triggered by `SidebarTrigger`), and closing/navigating closes it.

- [ ] **Step 5: Confirm nothing else broke**

Run: `npm run smoke:routes` if a local seeded account with `MAHABAH_SMOKE_EMAIL`/`MAHABAH_SMOKE_PASSWORD` is available; otherwise skip and rely on the manual checks above. This script screenshots the protected dashboard routes — visually scan the output in `tmp/smoke-routes/` for layout breakage.

If everything above checks out, the refactor is complete.
