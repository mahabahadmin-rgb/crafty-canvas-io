import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { dashboardRoles, findNavItem, type DashboardRole } from "@/lib/data/dashboard";
import { adminAccessError, dashboardRedirect, dashboardScopeAccessError, getMahabahAuthContextFromCookieHeader } from "@/lib/supabase/auth";
import { hydrateDashboardConfig } from "@/lib/supabase/dashboard";

export const metadata: Metadata = {
  title: "لوحة التحكم",
  description: "لوحات تحكم مهابة للأفراد والأعمال وإدارة المنصة.",
};

type PageProps = {
  params: Promise<{ role: string; slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RoleDashboardPage({ params, searchParams }: PageProps) {
  const { role, slug = [] } = await params;
  const resolvedSearchParams = await searchParams;
  if (role !== "individual" && role !== "business" && role !== "admin") notFound();
  const typedRole = role as DashboardRole;
  const activePath = slug.join("/");
  if (activePath && !findNavItem(typedRole, activePath)) notFound();
  const requestHeaders = await headers();
  const authContext = await getMahabahAuthContextFromCookieHeader(requestHeaders.get("cookie"));
  const accessError = typedRole === "admin" ? adminAccessError(authContext) : dashboardScopeAccessError(authContext, typedRole);
  if (accessError) {
    if (authContext) redirect(dashboardRedirect(authContext.role));
    const next = encodeURIComponent(`/dashboard/${typedRole}${activePath ? `/${activePath}` : ""}`);
    redirect(`/auth/login?next=${next}`);
  }
  const actor = authContext;
  const config = await hydrateDashboardConfig(dashboardRoles[typedRole], actor);
  return <DashboardPage config={config} activePath={activePath} searchParams={resolvedSearchParams} actor={actor} />;
}
