import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { dashboardRedirect, getMahabahAuthContextFromCookieHeader } from "@/lib/supabase/auth";

export default async function DashboardIndex() {
  const requestHeaders = await headers();
  const authContext = await getMahabahAuthContextFromCookieHeader(requestHeaders.get("cookie"));
  redirect(authContext ? dashboardRedirect(authContext.role) : "/auth/login?next=%2Fdashboard%2Findividual");
}
