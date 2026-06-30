# Dashboard sidebar refactor (RTL, shadcn sidebar-07 pattern)

## Problem

`components/dashboard/dashboard-shell.tsx` (925 lines) implements **three parallel, hand-rolled sidebars** — one each for `individual`, `business`, and `admin`/legacy roles (`SidebarContent`, `IndividualSidebarContent`, `BusinessSidebarContent`). Each duplicates:

- A collapse-toggle button (own absolutely-positioned circular button, separate from the `SidebarTrigger` already in the main header)
- Group expand/collapse state (`expandedGroups`)
- A mouse-tracking tooltip hack for collapsed icon-mode labels
- Inline hex-coded styling (`#1D1916`, `#8F6B4C`, `rgba(232, 222, 212, 0.85)`, etc.)
- A "dark mode" branch that swaps the whole sidebar to a dark theme on specific sub-pages (`communicationMode` for individual: messages/support/personal-profile/verification; `profileMode` for business: profile page)

This duplication is the direct cause of 8 prior commits churning on RTL/collapse bugs (`8e1db25`, `d40fb0c`, `866c455`, `68e1ee1`, `c787ba0`, `1aa4488`, etc.) — each fix landed in one variant and missed (or re-broke) the others.

Separately, five files are dead shadcn scaffold boilerplate from an abandoned `sidebar-07` install attempt, wired to nothing, still containing demo data ("Acme Inc", "shadcn", "Playground"):

- `components/app-sidebar.tsx`
- `components/nav-main.tsx`
- `components/nav-user.tsx`
- `components/nav-projects.tsx`
- `components/team-switcher.tsx`

## What's already correct (do not touch)

`components/ui/sidebar.tsx` is the real shadcn sidebar primitive library (`Sidebar`, `SidebarProvider`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton` (with built-in `tooltip` prop), `SidebarMenuBadge`, `SidebarMenuSub`, `SidebarMenuSubButton`, `SidebarTrigger`, `SidebarRail`, `SidebarInset`). It already handles RTL placement correctly:

```
side === "right" ? "md:order-last rtl:md:order-first" : "md:order-first rtl:md:order-last"
```

With the app's global `dir="rtl"` (`app/layout.tsx`), `side="right"` correctly docks the sidebar on the visual right (RTL flexbox main-start = right, and `order-first` under `rtl:` lands it there). Borders (`border-l` for `side=right`) are physical and already correct since the sidebar sits physically on the right regardless of text direction.

We will **not** run `npx shadcn add sidebar-07` against this file — it would risk overwriting already-correct RTL logic and dropping more demo files. Instead we compose the existing primitives following the sidebar-07 pattern, with real data.

All primitives needed to build the sidebar-07 pattern already exist in `components/ui/`: `avatar.tsx`, `collapsible.tsx`, `dropdown-menu.tsx`, `tooltip.tsx`, `separator.tsx`. No new shadcn components need to be added.

## Design

### 1. Delete dead code
Remove the 5 unused boilerplate files listed above.

### 2. One shared sidebar component
New files under `components/dashboard/`:

- **`dashboard-nav.tsx`** — renders `DashboardNavGroup[]` (from `lib/data/dashboard.ts`) as the sidebar body:
  - Each group → `SidebarGroup`. If `group.title` is set, wrap in `Collapsible` with `SidebarGroupLabel` as the trigger (chevron rotates on expand, matches today's behavior) and `CollapsibleContent` holding the items. If no title (e.g. the single "الرئيسية" home link), render the `SidebarMenu` directly, no label.
  - Each item → `SidebarMenuItem` > `SidebarMenuButton asChild tooltip={item.label}` wrapping a `next/link` `Link`, `isActive={item.path === activePath}`. The `tooltip` prop uses the primitive's built-in collapsed-state tooltip — replacing the manual `getBoundingClientRect`/mouse-tracking hack entirely.
  - Badge counts (`item.badge`) → `SidebarMenuBadge`.
  - When the sidebar is in icon-collapsed state, groups render expanded by default (icons only, no labels) — same as current behavior, but now it's the primitive's native `data-[collapsible=icon]` styling doing the work instead of a manual `collapsed` boolean threaded through every element.

- **`dashboard-nav-user.tsx`** — `SidebarFooter` content: `Avatar` (initials fallback, matches today's "م" badge) + `ownerName`, wrapped in a `DropdownMenu` (`DropdownMenuTrigger` = the button, `DropdownMenuContent` with a single "تسجيل الخروج" item linking to `/api/auth/logout`). Room to add profile/settings items later without restructuring.

- **`DashboardSidebar`** (in `dashboard-nav.tsx` or a thin wrapper) — assembles `SidebarHeader` (brand: `BrandLogo` expanded / "م" glyph collapsed, exactly as today, no team switcher needed since there's one brand), `SidebarContent` (the nav from above), `SidebarFooter` (NavUser from above). One component, parameterized by `role`/`nav`/`activePath`/`ownerName` — used identically by all three roles.

### 3. Simplify the three shell wrappers
`IndividualDashboardShellContent`, `BusinessDashboardShellContent`, `LegacyDashboardShellContent` keep existing — they still own their distinct main-content top header bars (bell/mail icons, profile chip), which carry real per-role content and are explicitly out of scope. Each now:
- Renders `<DashboardUiSidebar side="right" collapsible="icon"><DashboardSidebar ... /></DashboardUiSidebar>` instead of its own bespoke panel.
- Drops the `communicationMode`/`profileMode` dark-theme branch entirely (confirmed: one consistent light look everywhere).
- Drops its own floating collapse-toggle button — the single `SidebarTrigger` already in the main header remains the only collapse control.

### 4. Public API unchanged
`DashboardShell({ role, nav, activePath, ownerName, children })` keeps its exact signature. `components/dashboard/dashboard-page.tsx` and every other caller needs zero changes.

### 5. RTL checklist (verify after implementation)
- Sidebar docks visually on the right on desktop and as a right-sliding sheet on mobile.
- `SidebarTrigger` icon and group chevrons mirror correctly (`rtl:rotate-180` already used elsewhere in the file for `ChevronLeft`/`ChevronRight`).
- Collapsed icon-mode tooltips appear on the correct side (handled by the primitive, not custom logic).
- Text alignment, badges, and the NavUser dropdown all read right-to-left.

## Explicitly out of scope
- Main-content top header bars (notification bell counts, profile chip, mail icon) — unchanged except for losing the now-dead dark-mode conditional.
- Dashboard page widgets (`dashboard-ui.tsx`, `business-dashboard.tsx`, `business-extra-pages.tsx`, etc.).
- `components/ui/sidebar.tsx` primitive internals.

## Risk / rollback
This only touches `components/dashboard/dashboard-shell.tsx` plus two new files, and deletes 5 unused files. The public `DashboardShell` API is preserved, so blast radius is contained to visual/structural sidebar rendering — easy to verify by visiting `/dashboard/individual`, `/dashboard/business`, `/dashboard/admin` in both expanded and collapsed states.
