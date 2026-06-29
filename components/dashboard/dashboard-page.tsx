import { DashboardOverview, StaticTablePage } from "@/components/dashboard/dashboard-ui";
import { BusinessContributionRequestPage, BusinessDashboardHome } from "@/components/dashboard/business-dashboard";
import { BusinessCompanyProfilePage, BusinessVerificationRequestPage } from "@/components/dashboard/business-extra-pages";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { DashboardRoleConfig } from "@/lib/data/dashboard";
import type { DashboardActorContext } from "@/lib/supabase/mahabah";

export function DashboardPage({ config, activePath, searchParams = {}, actor = null }: { config: DashboardRoleConfig; activePath: string; searchParams?: Record<string, string | string[] | undefined>; actor?: DashboardActorContext | null }) {
  if (config.role === "business" && activePath === "add-contribution") {
    return <BusinessContributionRequestPage config={config} actor={actor} />;
  }
  if (config.role === "business" && activePath === "verification") {
    return <BusinessVerificationRequestPage config={config} actor={actor} />;
  }
  if (config.role === "business" && activePath === "company-profile") {
    return <BusinessCompanyProfilePage config={config} actor={actor} />;
  }

  return (
    <DashboardShell role={config.role} nav={config.nav} activePath={activePath} ownerName={config.ownerName}>
      {activePath ? (
        <StaticTablePage config={config} activePath={activePath} searchParams={searchParams} actor={actor} />
      ) : config.role === "business" ? (
        <BusinessDashboardHome config={config} actor={actor} />
      ) : (
        <DashboardOverview config={config} actor={actor} />
      )}
    </DashboardShell>
  );
}
