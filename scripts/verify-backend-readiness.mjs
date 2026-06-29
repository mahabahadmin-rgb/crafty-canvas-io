import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function walk(dir, predicate = () => true) {
  const absolute = path.join(root, dir);
  if (!existsSync(absolute)) return [];
  const out = [];
  for (const entry of readdirSync(absolute)) {
    const current = path.join(absolute, entry);
    const relative = path.relative(root, current);
    if (statSync(current).isDirectory()) out.push(...walk(relative, predicate));
    else if (predicate(relative)) out.push(relative);
  }
  return out;
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function unique(values) {
  return [...new Set(values)].sort();
}

const migrationFiles = walk("supabase/migrations", (file) => file.endsWith(".sql")).sort();
const migrationSql = migrationFiles.map(read).join("\n");
const seedSql = read("supabase/seed.sql");
const mahabahSource = read("lib/supabase/mahabah.ts");
const authSource = read("lib/supabase/auth.ts");
const serverSource = read("lib/supabase/server.ts");
const supabaseDashboardSource = read("lib/supabase/dashboard.ts");
const dashboardSource = read("lib/data/dashboard.ts");
const dashboardPageSource = read("components/dashboard/dashboard-page.tsx");
const dashboardIndexRouteSource = read("app/dashboard/page.tsx");
const dashboardRoleRouteSource = read("app/dashboard/[role]/[[...slug]]/page.tsx");
const dashboardUiSource = read("components/dashboard/dashboard-ui.tsx");
const dashboardActionsSource = read("components/dashboard/dashboard-actions.tsx");
const dashboardCommunicationActionsSource = read("components/dashboard/communication-actions.tsx");
const dashboardFinancialActionsSource = read("components/dashboard/financial-actions.tsx");
const publicSubmitAssetSource = read("app/api/submit-asset/route.ts");
const publicRequestStudySource = read("app/api/request-study/route.ts");
const publicContactSource = read("app/api/contact/route.ts");
const publicAssetsSource = read("app/api/assets/route.ts");
const publicContributionsSource = read("app/api/contributions/route.ts");
const localizedNumberSource = read("lib/validation/localized-number.ts");
const contentDetailActionsSource = read("components/sections/content-detail-actions.tsx");
const contentDetailPageSource = read("components/sections/content-detail-page.tsx");
const contentSaveSource = read("app/api/content-save/route.ts");
const contentCommentsSource = read("app/api/content-comments/route.ts");
const dashboardRequestSource = read("app/api/dashboard/request/route.ts");
const dashboardVerificationSource = read("app/api/dashboard/verification/route.ts");
const dashboardSubscriptionSource = read("app/api/dashboard/financial/subscription/route.ts");
const dashboardDocumentSource = read("app/api/dashboard/document/route.ts");
const dashboardAccountSettingsSource = read("app/api/dashboard/account-settings/route.ts");
const dashboardAdminManagementSource = read("app/api/dashboard/admin-management/route.ts");
const dashboardSupportSource = read("app/api/dashboard/support/route.ts");
const dashboardAdminSupportSource = read("app/api/dashboard/admin-support/route.ts");
const dashboardMessagesSource = read("app/api/dashboard/messages/route.ts");
const dashboardAdminMessagesSource = read("app/api/dashboard/admin-messages/route.ts");
const dashboardNotificationsSource = read("app/api/dashboard/notifications/route.ts");
const dashboardAdminNotificationsSource = read("app/api/dashboard/admin-notifications/route.ts");
const dashboardFinancialPaySource = read("app/api/dashboard/financial/pay/route.ts");
const systemStatusSource = read("app/api/system/status/route.ts");
const authLoginSource = read("app/api/auth/login/route.ts");
const authLogoutSource = read("app/api/auth/logout/route.ts");
const authRegisterSource = read("app/api/auth/register/route.ts");
const authOnboardingSource = read("app/api/auth/onboarding/route.ts");
const authVerifySource = read("app/api/auth/verify/route.ts");
const middlewareSource = read("middleware.ts");
const packageSource = read("package.json");
const smokeRoutesSource = read("scripts/smoke-routes.mjs");

const createdTables = unique([...migrationSql.matchAll(/create table if not exists public\.([a-z0-9_]+)/gi)].map((match) => match[1]));
const referencedTables = unique([...mahabahSource.matchAll(/\.from\(["']([a-z0-9_]+)["']\)/gi)].map((match) => match[1]));
const explicitRlsTables = unique([...migrationSql.matchAll(/alter table public\.([a-z0-9_]+)\s+enable row level security/gi)].map((match) => match[1]));
const loopRlsTables = unique([...migrationSql.matchAll(/'([a-z0-9_]+)'/gi)].map((match) => match[1]).filter((table) => createdTables.includes(table)));
const rlsTables = unique([...explicitRlsTables, ...loopRlsTables]);
const selfReferencingPublicPolicies = [...migrationSql.matchAll(/create policy\s+"([^"]+)"\s+on\s+public\.([a-z0-9_]+)[\s\S]*?;/gi)]
  .filter((match) => new RegExp(`from\\s+public\\.${match[2]}\\b`, "i").test(match[0]))
  .map((match) => `${match[2]}.${match[1]}`);
const ignoredTables = new Set(["storage.objects"]);
const missingTables = referencedTables.filter((table) => !createdTables.includes(table) && !ignoredTables.has(table));

assert(migrationFiles.length >= 10, "Expected the Supabase migration set to be present.");
assert(missingTables.length === 0, `Tables used by lib/supabase/mahabah.ts are missing migrations: ${missingTables.join(", ")}`);
assert(selfReferencingPublicPolicies.length === 0, `RLS policies must not self-reference their own table because that can recurse: ${selfReferencingPublicPolicies.join(", ")}`);

for (const table of createdTables) {
  assert(rlsTables.includes(table), `Missing RLS enablement for public.${table}`);
}

const dataApiTables = [
  "real_estate_assets",
  "real_estate_contributions",
  "services_catalog",
  "service_requests",
  "verification_requests",
  "subscriptions",
  "invoices",
  "payments",
  "notifications",
  "conversations",
  "conversation_participants",
  "messages",
  "support_tickets",
  "support_ticket_messages",
  "newsletter_subscribers",
  "documents",
  "platform_settings",
  "audit_logs",
  "service_providers",
  "content_items",
  "content_comments",
  "saved_content",
  "admin_roles",
];

for (const table of dataApiTables) {
  assert(
    new RegExp(`grant\\s+[^;]*\\bon\\s+public\\.[^;]*\\b${table}\\b`, "i").test(migrationSql) ||
      /grant\s+[^;]*\bon all tables in schema public to authenticated/i.test(migrationSql),
    `Missing Data API grant for public.${table}`,
  );
}

const seedRequiredTables = [
  "profiles",
  "organizations",
  "organization_members",
  "services_catalog",
  "real_estate_assets",
  "real_estate_contributions",
  "asset_interests",
  "contribution_interests",
  "service_requests",
  "verification_requests",
  "subscriptions",
  "invoices",
  "payments",
  "notifications",
  "conversations",
  "conversation_participants",
  "messages",
  "support_tickets",
  "support_ticket_messages",
  "newsletter_subscribers",
  "content_comments",
  "saved_content",
  "documents",
  "platform_settings",
  "audit_logs",
];
for (const table of seedRequiredTables) {
  assert(new RegExp(`insert\\s+into\\s+public\\.${table}\\b`, "i").test(seedSql), `Seed data must include public.${table}.`);
}
for (const [label, id] of [
  ["individual demo user", "11111111-1111-4111-8111-111111111111"],
  ["business demo user", "22222222-2222-4222-8222-222222222222"],
  ["admin demo user", "33333333-3333-4333-8333-333333333333"],
  ["business demo organization", "44444444-4444-4444-8444-444444444444"],
]) {
  assert(seedSql.includes(id), `Seed data is missing ${label}.`);
}
assert(seedSql.includes('"account_role":"individual"') && seedSql.includes('"account_role":"business"') && seedSql.includes('"account_role":"admin"'), "Seed auth users must include app_metadata account roles for individual, business, and admin.");
assert(!/raw_user_meta_data[\s\S]{0,260}account_role/.test(seedSql), "Seed data must not place account_role in raw_user_meta_data.");
for (const status of ["'submitted'", "'in_review'", "'approved'", "'due'", "'paid'", "'completed'"]) {
  assert(seedSql.includes(status), `Seed data should include ${status} records for dashboard status coverage.`);
}
assert(migrationSql.includes("insert into public.service_providers"), "Migrations must seed admin service provider management data.");
assert(migrationSql.includes("insert into public.content_items"), "Migrations must seed admin content management data.");
assert(migrationSql.includes("insert into public.admin_roles"), "Migrations must seed admin role management data.");

assert(migrationSql.includes("insert into storage.buckets"), "Missing Storage bucket migration.");
assert(migrationSql.includes("'mahabah-documents'"), "Missing mahabah-documents bucket configuration.");
for (const action of ["select", "insert", "update", "delete"]) {
  assert(new RegExp(`storage\\.objects\\s+for\\s+${action}`, "i").test(migrationSql), `Missing storage.objects ${action} policy.`);
}

const forbiddenPatterns = [
  [/auth\.role\(/i, "Do not use deprecated auth.role() in policies or SQL."],
  [/security\s+definer/i, "Do not use SECURITY DEFINER in this app schema."],
  [/raw_user_meta_data[^;\n]*account_role/i, "Do not put account_role in user-editable raw_user_meta_data."],
  [/NEXT_PUBLIC_[A-Z0-9_]*SERVICE/i, "Do not expose service-role style env vars with NEXT_PUBLIC_."],
  [/eyJhbGci/i, "Do not commit JWT-looking secrets."],
];

for (const [pattern, message] of forbiddenPatterns) {
  assert(!pattern.test(migrationSql), `${message} Found in migrations.`);
  assert(!pattern.test(mahabahSource), `${message} Found in lib/supabase/mahabah.ts.`);
  assert(!pattern.test(authSource), `${message} Found in lib/supabase/auth.ts.`);
  assert(!pattern.test(serverSource), `${message} Found in lib/supabase/server.ts.`);
}

assert(serverSource.includes("import \"server-only\""), "Supabase service-role helper must stay server-only.");
assert(serverSource.includes("SUPABASE_SERVICE_ROLE_KEY"), "Server helper must read service role from SUPABASE_SERVICE_ROLE_KEY.");
assert(serverSource.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY"), "Supabase runtime status must require NEXT_PUBLIC_SUPABASE_ANON_KEY for auth flows.");
assert(!serverSource.includes("NEXT_PUBLIC_SUPABASE_SERVICE"), "Server helper must not use NEXT_PUBLIC service role variables.");
assert(systemStatusSource.includes("supabaseRuntimeState") && systemStatusSource.includes("status: supabase.configured ? 200 : 503"), "System status API must expose Supabase readiness and fail with 503 when backend env is incomplete.");
assert(authSource.includes("publicClient.auth.getUser(accessToken)"), "Auth context must validate cookie access tokens with Supabase getUser().");
assert(!/auth\.getSession\(/.test(authSource), "Server auth must not trust getSession() for authorization decisions.");
assert(authSource.includes("export async function signOutMahabahSessionFromCookieHeader") && authSource.includes("publicClient.auth.setSession") && authSource.includes("publicClient.auth.refreshSession({ refresh_token: refreshToken })") && authSource.includes("publicClient.auth.signOut()"), "Logout must revoke the Supabase session, including a refresh-token fallback, not only clear local cookies.");
assert(authLogoutSource.includes("signOutMahabahSessionFromCookieHeader(request.headers.get(\"cookie\"))") && authLogoutSource.includes("clearMahabahAuthCookies(response)"), "Logout API must revoke Supabase session before clearing Mahabah cookies.");
assert(authSource.includes("app_metadata: { account_role: role }"), "Registration must store account role in Supabase app_metadata.");
assert(!/user_metadata:\s*\{[\s\S]{0,220}account_role/.test(authSource), "Registration must not store account_role in user-editable user_metadata.");
assert(/drop policy if exists "profiles_update_own" on public\.profiles;[\s\S]*create policy "profiles_update_own_safe_fields"[\s\S]*role <> 'admin'[\s\S]*create policy "profiles_admin_manage"[\s\S]*auth\.jwt\(\) -> 'app_metadata' ->> 'account_role' = 'admin'/.test(migrationSql), "Profile RLS must prevent users from self-promoting their public profile role to admin and use app_metadata for admin management.");
assert(!/create policy "profiles_admin_manage"[\s\S]*from public\.profiles/.test(migrationSql), "Profile admin RLS policy must not query public.profiles from a policy on public.profiles.");
assert(authSource.includes("isSuspendedStatus(profileRow?.verification_status)"), "Auth context must reject suspended/disabled profiles.");
assert(authSource.includes("isSuspendedStatus(organizationRow.status)") && authSource.includes("isSuspendedStatus(organizationRow.verification_status)"), "Auth context must reject suspended/disabled organizations.");
assert(!/function isSuspendedStatus[\s\S]*?rejected[\s\S]*?}/.test(authSource), "Rejected verification/account review status must not be treated as a suspended login state.");
for (const [name, source] of [
  ["auth login", authLoginSource],
  ["auth register", authRegisterSource],
  ["auth onboarding", authOnboardingSource],
  ["auth verify", authVerifySource],
]) {
  assert(source.includes("request.json().catch"), `${name} route must handle malformed JSON.`);
}
assert(authOnboardingSource.includes("context.role !== result.data.role"), "Onboarding must reject account-role mismatches between payload and authenticated session.");
assert(middlewareSource.includes("auth.refreshSession") && middlewareSource.includes("mahabah_access_token"), "Middleware must refresh Mahabah auth cookies for protected routes.");
assert(dashboardIndexRouteSource.includes("getMahabahAuthContextFromCookieHeader") && dashboardIndexRouteSource.includes("dashboardRedirect(authContext.role)") && dashboardIndexRouteSource.includes("/auth/login?next=%2Fdashboard%2Findividual"), "Dashboard index must redirect authenticated users to their role dashboard and unauthenticated users to login.");
assert(dashboardRoleRouteSource.includes("getMahabahAuthContextFromCookieHeader") && dashboardRoleRouteSource.includes("dashboardScopeAccessError(authContext, typedRole)") && dashboardRoleRouteSource.includes("adminAccessError(authContext)"), "Dashboard role routes must enforce authenticated role access before rendering.");
assert(/if \(accessError\) \{[\s\S]*if \(authContext\) redirect\(dashboardRedirect\(authContext\.role\)\);[\s\S]*redirect\(`\/auth\/login\?next=\$\{next\}`\);[\s\S]*\}/.test(dashboardRoleRouteSource), "Dashboard role routes must redirect unauthorized authenticated users and send anonymous users to login.");
assert(/const actor = authContext;[\s\S]*hydrateDashboardConfig\(dashboardRoles\[typedRole\], actor\)[\s\S]*<DashboardPage[\s\S]*actor=\{actor\}/.test(dashboardRoleRouteSource), "Dashboard pages must hydrate Supabase data and render with the authenticated actor.");
assert(packageSource.includes("\"smoke:routes\": \"node scripts/smoke-routes.mjs\""), "Package scripts must expose the route smoke test.");
assert(smokeRoutesSource.includes("MAHABAH_SMOKE_EMAIL") && smokeRoutesSource.includes("MAHABAH_SMOKE_PASSWORD") && smokeRoutesSource.includes("/api/auth/login"), "Route smoke test must support authenticated dashboard checks through env-provided demo credentials.");
assert(smokeRoutesSource.includes("redirect-login") && smokeRoutesSource.includes("/dashboard/individual") && smokeRoutesSource.includes("/dashboard/business") && smokeRoutesSource.includes("/dashboard/admin"), "Route smoke test must cover unauthenticated dashboard protection across all roles.");
assert(smokeRoutesSource.includes("page.screenshot") && smokeRoutesSource.includes("MAHABAH_SMOKE_SCREENSHOT_DIR") && smokeRoutesSource.includes("tmp/smoke-routes"), "Route smoke test must capture screenshots for inspected pages.");
assert(smokeRoutesSource.includes("MAHABAH_SMOKE_SERVER_MODE") && smokeRoutesSource.includes("hasProductionBuild") && smokeRoutesSource.includes(".next/BUILD_ID") && smokeRoutesSource.includes("\"start\"") && smokeRoutesSource.includes("\"dev\""), "Route smoke test must support production-mode smoke with a dev fallback when no production build exists.");
assert(/OPEN_REQUEST_STATUSES\s*=\s*\[[^\]]*"submitted"[^\]]*"in_review"[^\]]*"needs_changes"[^\]]*"in_progress"[^\]]*\]/.test(supabaseDashboardSource), "Dashboard open-request counters must include the full non-terminal service request lifecycle, including needs_changes.");
assert(!/href=\{?["']#/.test(dashboardUiSource), "Dashboard UI must not contain placeholder # links.");
assert(!/javascript:/.test(dashboardUiSource), "Dashboard UI must not contain javascript: pseudo-links.");
assert(!/onClick=\{\(\) => \{\}\}/.test(dashboardUiSource), "Dashboard UI must not contain empty click handlers.");
assert(!/>•••</.test(dashboardUiSource), "Dashboard UI must not expose decorative ellipsis controls without a real menu/action.");
assert(/const query = stringParam\(searchParams, "q"\)[\s\S]*const status = stringParam\(searchParams, "status"\)[\s\S]*pageRows\(activePath\)\.filter/.test(dashboardUiSource), "Shared dashboard tables must apply submitted q/status filters to their rows.");
assert(dashboardUiSource.includes("لا توجد نتائج مطابقة للبحث الحالي."), "Shared dashboard tables must show an empty state when filters return no rows.");
assert(dashboardActionsSource.includes("parseLocalizedNumber"), "Dashboard action forms must keep localized number parsing shared.");
for (const source of [mahabahSource, dashboardActionsSource, localizedNumberSource]) {
  assert(/replace\(\s*\/\[٠-٩\]\/g/.test(source), "Arabic-Indic digit parsing is missing from dashboard numeric handling.");
  assert(/replace\(\s*\/\[۰-۹\]\/g/.test(source), "Persian digit parsing is missing from dashboard numeric handling.");
  assert(source.includes('replaceAll(",", "")'), "Comma-separated amount parsing is missing from dashboard numeric handling.");
}
for (const [name, source] of [
  ["submit asset", publicSubmitAssetSource],
  ["request study", publicRequestStudySource],
  ["assets", publicAssetsSource],
]) {
  assert(source.includes("localizedNumber"), `Public ${name} API must parse localized numeric input.`);
  assert(/z\.preprocess\(localizedNumber,\s*z\.number\(\)\.positive\(\)\)/.test(source), `Public ${name} API area validation must use localized number preprocessing.`);
  assert(source.includes("request.formData().catch"), `Public ${name} API must handle malformed form data.`);
}
assert(publicContributionsSource.includes("localizedNumber"), "Public contributions API must parse localized numeric input.");
assert(
  /capitalSar:\s*z\.preprocess\(localizedNumber,\s*z\.number\(\)\.positive\(\)\)/.test(publicContributionsSource),
  "Public contributions API capital validation must use localized number preprocessing.",
);
assert(
  /durationMonths:\s*z\.preprocess\(localizedNumber,\s*z\.number\(\)\.int\(\)\.positive\(\)\)/.test(publicContributionsSource),
  "Public contributions API duration validation must use localized number preprocessing.",
);
assert(publicContributionsSource.includes("fullName: z.string().trim().min(2).optional()") && publicContributionsSource.includes("mobile: z.string().trim().min(5).optional()") && publicContributionsSource.includes("email: z.string().trim().email().optional()"), "Public contributions API must accept optional submitter contact fields for admin follow-up.");
assert(publicContributionsSource.includes("request.formData().catch"), "Public contributions API must handle malformed form data.");
assert(publicContactSource.includes("request.formData().catch"), "Public contact API must handle malformed form data.");
assert(mahabahSource.includes("export async function uploadPublicSubmissionDocument"), "Public website form uploads must use a dedicated public submission document helper.");
assert(/storagePath = `public-submissions\/\$\{storageEntityType\}\/\$\{entityId \?\? "unlinked"\}/.test(mahabahSource), "Public submission documents must be stored outside demo dashboard owner folders.");
assert(/owner_user_id: null,[\s\S]*organization_id: null,[\s\S]*uploaded_by: null/.test(mahabahSource), "Public submission documents must not be assigned to demo user or organization ownership.");
assert(mahabahSource.includes("removeUploadedDocumentObject"), "Document uploads must define storage cleanup for metadata insert failures.");
assert(/export async function uploadPublicSubmissionDocument[\s\S]*if \(error\) \{[\s\S]*await removeUploadedDocumentObject\(supabase, bucket, storagePath\);[\s\S]*throw new Error\(error\.message\);[\s\S]*\}/.test(mahabahSource), "Public submission uploads must remove storage objects if the documents insert fails.");
assert(migrationSql.includes("metadata ->> 'source' = 'public'"), "Public ownerless submission constraints must explicitly allow metadata source public.");
assert(/export async function createAssetSubmission[\s\S]*owner_user_id: null,[\s\S]*organization_id: null,[\s\S]*metadata: \{[\s\S]*source: "public"/.test(mahabahSource), "Public asset submissions must not be assigned to demo individual ownership.");
assert(/export async function createContributionSubmission[\s\S]*organization_id: null,[\s\S]*metadata: \{[\s\S]*source: "public"/.test(mahabahSource), "Public contribution submissions must not be assigned to demo business ownership.");
assert(/export async function createContributionSubmission[\s\S]*contact: \{[\s\S]*fullName: input\.fullName \?\? null,[\s\S]*mobile: input\.mobile \?\? null,[\s\S]*email: input\.email \?\? null/.test(mahabahSource), "Public contribution submissions must persist optional submitter contact metadata.");
assert(/export async function createServiceRequest[\s\S]*requester_user_id: null,[\s\S]*organization_id: null,[\s\S]*metadata: \{[\s\S]*source: "public"/.test(mahabahSource), "Public service requests must not be assigned to demo individual ownership.");
assert(/function publicSubmissionOwnerLabel[\s\S]*record\.source !== "public"[\s\S]*metadataRecord\(record\.contact\)[\s\S]*"fullName", "name", "email", "mobile"/.test(mahabahSource), "Admin queues must derive owner labels for public submissions from metadata.contact.");
assert(/export async function listDashboardAdminAssets[\s\S]*\.select\("[^"]*metadata[^"]*"[\s\S]*publicSubmissionOwnerLabel\(row\.metadata\)/.test(mahabahSource), "Admin asset listings must show public submission contact labels for ownerless public assets.");
assert(/export async function listDashboardAdminServiceRequests[\s\S]*\.select\("[^"]*metadata[^"]*"[\s\S]*publicSubmissionOwnerLabel\(row\.metadata\)/.test(mahabahSource), "Admin service request listings must show public submission contact labels for ownerless public requests.");
for (const [name, source] of [
  ["assets", publicAssetsSource],
  ["submit asset", publicSubmitAssetSource],
  ["contributions", publicContributionsSource],
  ["request study", publicRequestStudySource],
]) {
  assert(source.includes("uploadPublicSubmissionDocument") && !source.includes("uploadDashboardDocument"), `Public ${name} submissions must not upload documents through the dashboard document owner helper.`);
}
assert(contentSaveSource.includes("saveContentItem"), "Content save API must persist saved articles/news through Supabase.");
assert(contentSaveSource.includes("getMahabahAuthContext"), "Content save API must require an authenticated actor.");
assert(contentDetailActionsSource.includes('fetch("/api/content-save"'), "Content save button must call the backend API.");
assert(!/localStorage\.setItem\(["']mahabah\.savedContent/.test(contentDetailActionsSource), "Content save must not rely on browser-only localStorage.");
assert(mahabahSource.includes("export async function listApprovedContentComments"), "Approved public content comments must be readable from Supabase.");
assert(/\.from\("content_comments"\)[\s\S]*\.eq\("content_slug", input\.contentSlug\)[\s\S]*\.eq\("content_type", input\.contentType\)[\s\S]*\.eq\("status", "approved"\)/.test(mahabahSource), "Public content comment listing must only return approved comments for the requested content.");
assert(contentCommentsSource.includes("export async function GET") && contentCommentsSource.includes("listApprovedContentComments"), "Content comments API must expose approved comment reads.");
assert(contentDetailPageSource.includes("listApprovedContentComments") && contentDetailPageSource.includes("ApprovedCommentsList"), "Content detail pages must render approved comments from Supabase.");
assert(mahabahSource.includes("export async function listDashboardAdminContentComments"), "Admin content comments must be listed from Supabase for moderation.");
assert(/export async function listDashboardAdminContentComments[\s\S]*\.from\("content_comments"\)[\s\S]*\.select\("id, content_slug, content_type, author_name, body_ar, status, created_at, updated_at"\)[\s\S]*\.order\("created_at", \{ ascending: false \}\)/.test(mahabahSource), "Admin content comment moderation must query content_comments with moderation fields.");
assert(dashboardUiSource.includes("AdminContentCommentsPanel") && dashboardUiSource.includes("listDashboardAdminContentComments"), "Admin content UI must render a live content comments moderation panel.");
assert(dashboardUiSource.includes('action="content_comment_status"') && dashboardUiSource.includes('status="approved"') && dashboardUiSource.includes('status="rejected"') && dashboardUiSource.includes('status="archived"'), "Admin content comment UI must expose approve, reject, and archive actions.");
const dashboardActionContracts = [
  [dashboardActionsSource, "/api/dashboard/interest", "Interest action button must persist interests through the dashboard API."],
  [dashboardActionsSource, "/api/dashboard/review", "Review decision button must call the review API."],
  [dashboardActionsSource, "/api/dashboard/accounts", "Admin account status button must call the accounts API."],
  [dashboardActionsSource, "/api/dashboard/account-settings", "Account settings save button must call the account-settings API."],
  [dashboardActionsSource, "/api/dashboard/admin-management", "Admin management actions must call the admin-management API."],
  [dashboardActionsSource, "/api/dashboard/verification", "Verification request button must call the verification API."],
  [dashboardActionsSource, "/api/dashboard/request", "Dashboard request forms must call the request API."],
  [dashboardActionsSource, "/api/dashboard/document", "Dashboard document upload must call the document API."],
  [dashboardCommunicationActionsSource, "/api/dashboard/notifications", "Notification mark-read action must call the notifications API."],
  [dashboardCommunicationActionsSource, "/api/dashboard/admin-notifications", "Admin notification actions must call the admin notifications API."],
  [dashboardCommunicationActionsSource, "/api/dashboard/messages", "Dashboard messages must call the messages API."],
  [dashboardCommunicationActionsSource, "/api/dashboard/admin-messages", "Admin messages must call the admin messages API."],
  [dashboardCommunicationActionsSource, "/api/dashboard/support", "Support ticket actions must call the support API."],
  [dashboardCommunicationActionsSource, "/api/dashboard/admin-support", "Admin support actions must call the admin support API."],
  [dashboardFinancialActionsSource, "/api/dashboard/financial/pay", "Invoice payment button must call the financial payment API."],
  [dashboardFinancialActionsSource, "/api/dashboard/financial/subscription", "Subscription plan button must call the subscription API."],
];
for (const [source, endpoint, message] of dashboardActionContracts) {
  assert(source.includes(endpoint), message);
}
assert(dashboardRequestSource.includes("function requestValidationError"), "Dashboard request API must validate submitted payloads at the backend boundary.");
assert(/if \(data\.mode === "draft"\) return missing\.length \? missing : null;/.test(dashboardRequestSource), "Dashboard request API must allow partial drafts but still validate submitted requests.");
for (const requiredField of ["deedNumber", "licenseNumber", "offeringUrl", "serviceType", "mobile", "email"]) {
  assert(dashboardRequestSource.includes(`"${requiredField}"`), `Dashboard request API must reject submitted requests missing ${requiredField}.`);
}
assert(dashboardVerificationSource.includes("function verificationValidationError"), "Dashboard verification API must validate submitted identity payloads at the backend boundary.");
assert(/if \(data\.mode === "draft"\) return null;/.test(dashboardVerificationSource), "Dashboard verification API must allow partial drafts but validate submitted requests.");
for (const requiredField of ["identityType", "identityNumber", "displayName", "acceptedTerms", "formReference", "commercialRegistration"]) {
  assert(dashboardVerificationSource.includes(`"${requiredField}"`), `Dashboard verification API must reject submitted requests missing ${requiredField}.`);
}
assert(!/toggleDashboardInterest\(input: \{[\s\S]*userId\?: string/.test(mahabahSource), "Interest persistence must not accept caller-supplied userId.");
assert(/export async function toggleDashboardInterest[\s\S]*const userId = input\.actor\?\.userId \|\| DEMO_INDIVIDUAL_USER_ID/.test(mahabahSource), "Interest persistence must derive the interested user from the authenticated actor.");
assert(!/toggleDashboardInterest\(\{[\s\S]{0,120}userId: actor\.userId/.test(contentSaveSource + dashboardActionsSource + dashboardPageSource + dashboardUiSource + dashboardRequestSource + dashboardMessagesSource + dashboardSupportSource + dashboardAdminManagementSource + read("app/api/dashboard/interest/route.ts")), "Interest API callers must not pass userId explicitly.");
assert(dashboardActionsSource.includes("collectFormValues = true"), "Account settings action button must support explicit form collection control.");
assert(/collectFormValues\s*\?\s*dashboardPayloadContainer/.test(dashboardActionsSource), "Account settings action button must not scan the full page when form collection is disabled.");
assert(/collectFormValues\s*\?\s*collectNamedFormPayload/.test(dashboardActionsSource), "Account settings action button must skip form payload collection for payload-only actions.");
assert(dashboardUiSource.includes("collectFormValues={false}"), "Payload-only account settings buttons must opt out of collecting unrelated page forms.");
assert(/payload=\{\{ source: "profile-hero-save" \}\}(?![\s\S]{0,220}collectFormValues=\{false\})/.test(dashboardUiSource), "Profile hero save button must collect the edited account form values instead of sending stale loaded data.");
assert(/kind="security"[\s\S]{0,180}passwordRotationRequested/.test(dashboardUiSource), "Password change action must remain a real security form submission.");
assert(/kind="security"[\s\S]{0,220}twoFactorEnabled[\s\S]{0,120}collectFormValues=\{false\}/.test(dashboardUiSource), "Two-factor security quick action must not collect password fields from the page.");
assert(mahabahSource.includes("redactAccountSettingsPayload(rawPayload)"), "Account settings persistence must redact password fields before metadata/audit writes.");
assert(mahabahSource.includes("accountSettingsAllowedFields"), "Account settings persistence must define server-side allowlists for saved settings fields.");
assert(mahabahSource.includes("allowedAccountSettingsPayload(input.kind, redactAccountSettingsPayload(rawPayload))"), "Account settings persistence must apply kind-specific allowlists after password redaction.");
for (const field of ["profile: new Set", "security: new Set", "preferences: new Set", "currentPassword", "newPassword", "confirmPassword"]) {
  assert(mahabahSource.includes(field), `Account settings allowlist/redaction coverage must include ${field}.`);
}
assert(mahabahSource.includes("accountSettingsEmailInvalid(input.kind, payload)"), "Account settings persistence must reject malformed profile emails before profile/Auth updates.");
assert(mahabahSource.includes("verifyDashboardCurrentPassword(email, passwordChange.currentPassword)"), "Password changes must verify the current password before admin update.");
assert(mahabahSource.includes("supabase.auth.admin.updateUserById(owner.actorUserId"), "Password changes must use Supabase admin auth update on the authenticated actor.");
assert(/commercial_registration: input\.kind === "profile" \? payloadText\(payload, "commercialRegistration", payloadText\(payload, "identityNumber"/.test(mahabahSource), "Business profile settings must accept the shared profile form identityNumber field as commercial registration.");
assert(/if \(input\.kind === "profile"\) \{[\s\S]*supabase\.auth\.admin\.updateUserById\(profileRow\.id,[\s\S]*email: record\.email \?\? undefined,[\s\S]*display_name: record\.full_name/.test(mahabahSource), "Individual profile settings must sync profile email/name back to Supabase Auth.");
assert(mahabahSource.includes("authProfileSynced"), "Account settings audit metadata must record whether Supabase Auth profile sync ran.");
for (const errorCode of ["password_fields_incomplete", "password_mismatch", "password_too_short", "password_unchanged", "password_current_invalid", "password_email_missing", "profile_email_invalid"]) {
  assert(dashboardAccountSettingsSource.includes(errorCode), `Account settings API must return a specific error for ${errorCode}.`);
}
for (const [name, source] of [
  ["dashboard actions", dashboardActionsSource],
  ["dashboard communication actions", dashboardCommunicationActionsSource],
  ["dashboard financial actions", dashboardFinancialActionsSource],
]) {
  assert(source.includes("redirectToLogin") && source.includes("status === 401"), `${name} must redirect unauthenticated action attempts back to login.`);
}
assert(dashboardActionsSource.includes("MAX_DOCUMENT_UPLOAD_BYTES = 10 * 1024 * 1024"), "Dashboard document upload must enforce the 10MB client limit.");
assert(dashboardDocumentSource.includes("allowedMimeTypes") && dashboardDocumentSource.includes("file.size > 10 * 1024 * 1024"), "Dashboard document API must validate mime type and 10MB size limit.");
assert(dashboardDocumentSource.includes("dashboardScopeAccessError") && dashboardDocumentSource.includes("adminAccessError"), "Dashboard document API must enforce scope-specific upload authorization.");
assert(mahabahSource.includes("dashboardDocumentTargetAllowed"), "Dashboard document uploads must verify target ownership before storage writes.");
assert(mahabahSource.includes("document_target_forbidden"), "Dashboard document upload must return a forbidden result for cross-account targets.");
assert(/function dashboardDocumentEntityRefAllowed[\s\S]*scope === "admin"[\s\S]*\^\[a-zA-Z0-9@\._-\]\{8,160\}\$[\s\S]*entityRef\.startsWith\(`\$\{scope\}-`\)[\s\S]*entityType\.includes\("support_ticket"\) && entityRef\.startsWith\("support-ticket-"\)/.test(mahabahSource), "Dashboard document uploads must restrict non-admin temporary entity references to generated dashboard/support references.");
assert(/if \(!dashboardDocumentEntityRefAllowed\(input\.scope, entityRef, entityType\)\)[\s\S]*message: "document_target_forbidden"/.test(mahabahSource), "Dashboard document upload must reject arbitrary non-admin entity references before storage upload.");
assert(/export async function uploadDashboardDocument[\s\S]*if \(error\) \{[\s\S]*await removeUploadedDocumentObject\(supabase, bucket, storagePath\);[\s\S]*throw new Error\(error\.message\);[\s\S]*\}/.test(mahabahSource), "Dashboard document uploads must remove storage objects if the documents insert fails.");
assert(mahabahSource.includes("export async function reviewDashboardEntity"), "Admin review decisions must persist through reviewDashboardEntity.");
for (const [entityType, table] of [
  ["asset", "real_estate_assets"],
  ["contribution", "real_estate_contributions"],
  ["service_request", "service_requests"],
  ["verification_request", "verification_requests"],
]) {
  assert(dashboardActionsSource.includes(`entityType="${entityType}"`) || dashboardActionsSource.includes(`entityType: ReviewEntityType`) || dashboardUiSource.includes(`entityType="${entityType}"`), `Dashboard UI must expose review actions for ${entityType}.`);
  assert(mahabahSource.includes(`.from("${table}")`), `Review persistence must update ${table}.`);
}
assert(mahabahSource.includes("review_${input.decision}") && mahabahSource.includes("reviewEntityActionUrl"), "Admin review decisions must write audit logs and owner-facing notification URLs.");
assert(/function reviewHistoryFromMetadata[\s\S]*metadataRecord\(metadata\)\.reviewHistory[\s\S]*Array\.isArray\(history\)[\s\S]*entry\.decision === "approved"[\s\S]*entry\.decision === "needs_changes"[\s\S]*entry\.decision === "rejected"/.test(mahabahSource), "Admin review metadata must parse existing review history safely.");
assert(/const reviewEntry = \{[\s\S]*decision: input\.decision,[\s\S]*note: input\.note \|\| null,[\s\S]*reviewedBy: adminUserId,[\s\S]*reviewedAt,[\s\S]*\};[\s\S]*latestReview: reviewEntry,[\s\S]*reviewHistory: \[\.\.\.reviewHistoryFromMetadata\(entity\.metadata \?\? \{\}\), reviewEntry\]\.slice\(-20\)/.test(mahabahSource), "Admin review decisions must append bounded review history while keeping latestReview.");
assert(/input\.decision === "approved"\s*\? \{ status: "approved", verification_status: input\.decision \}\s*:\s*\{ verification_status: input\.decision \}/.test(mahabahSource), "Verification review must not demote or block an organization when requesting changes or rejecting the badge request.");
assert(dashboardActionsSource.includes("export function AdminAccountStatusButton") && dashboardActionsSource.includes("/api/dashboard/accounts"), "Admin account status controls must call the accounts API.");
assert(dashboardUiSource.includes("kind={row.kind}") && dashboardUiSource.includes('status="verified"') && dashboardUiSource.includes('status="suspended"'), "Admin accounts UI must expose approve/suspend/reactivate actions for listed accounts.");
assert(/function accountStatusToReviewStatus[\s\S]*status === "verified"[\s\S]*"approved"[\s\S]*status === "suspended"[\s\S]*"archived"/.test(mahabahSource), "Admin account status updates must map verified/suspended to Supabase review states.");
assert(mahabahSource.includes('action: `account_${input.status}`') && mahabahSource.includes("accountStatusLabel(input.status)"), "Admin account status updates must write audit logs and owner notifications.");
assert(/if \(input\.kind === "business"\)[\s\S]*\.from\("organizations"\)[\s\S]*else[\s\S]*\.from\("profiles"\)/.test(mahabahSource), "Admin account status updates must cover business organizations and individual/admin profiles.");
assert(dashboardPageSource.includes('case "accounts"') || dashboardUiSource.includes("AdminAccountsPage"), "Admin accounts pages must be routed through the dashboard renderer.");
assert(dashboardUiSource.includes("function ReviewQueueActions") && dashboardUiSource.includes('decision="approved"') && dashboardUiSource.includes('decision="needs_changes"') && dashboardUiSource.includes('decision="rejected"'), "Admin review queues must expose approve, needs-changes, and reject quick actions.");
assert(/function reviewQueueManagementStatus[\s\S]*provider_status[\s\S]*"approved"[\s\S]*"rejected"[\s\S]*"published"[\s\S]*"archived"/.test(dashboardUiSource), "Admin provider/content review quick actions must map approve and reject to persisted management statuses.");
assert(/const appMetadata = \{ account_role: "admin", admin_role: input\.adminRole \}/.test(mahabahSource), "Admin user saves must place admin authorization data in app_metadata.");
assert(!/const userMetadata = \{[\s\S]{0,260}account_role/.test(mahabahSource), "Admin user saves must not place account_role in user-editable user_metadata.");
assert(/if \(input\.action === "admin_user_save"\)[\s\S]*validDashboardEmail\(email\)[\s\S]*admin_profile_email_invalid[\s\S]*resolveAdminAuthProfileId/.test(mahabahSource), "Admin user saves must validate email before touching Supabase Auth.");
assert(/inviteUserByEmail\(input\.email[\s\S]*redirectTo: adminInviteRedirectTo\(\)/.test(mahabahSource), "Admin user saves must send Supabase auth invites when requested.");
assert(/createUser\(\{[\s\S]*email: input\.email[\s\S]*password: adminTempPassword\(\)[\s\S]*app_metadata: appMetadata/.test(mahabahSource), "Admin user saves must create a real Supabase auth user fallback.");
assert(/const allowedAdminSecurityActions = new Set\(\["reset_password", "revoke_sessions"\]\)/.test(mahabahSource), "Admin security actions must be restricted to explicit supported actions.");
assert(/if \(input\.action === "admin_security_action"\)[\s\S]*allowedAdminSecurityActions\.has\(securityAction\)[\s\S]*admin_security_action_invalid/.test(mahabahSource), "Admin security actions must reject unsupported security action keys.");
assert(/if \(input\.action === "admin_security_action"\)[\s\S]*resetPasswordForEmail\(profileRow\.email[\s\S]*notifications"\)\.insert/.test(mahabahSource), "Admin security actions must trigger auth reset flow and notify the target admin.");
assert(dashboardUiSource.includes('action="admin_user_save"') && dashboardUiSource.includes('action="admin_security_action"'), "Admin system UI must expose user save and security actions through the admin-management API.");
assert(/if \(input\.action === "settings_save"\)[\s\S]*validSettingsKey[\s\S]*settings_key_invalid[\s\S]*\.from\("platform_settings"\)[\s\S]*\.upsert/.test(mahabahSource), "Admin settings saves must validate setting keys before writing platform_settings.");
assert(dashboardAdminManagementSource.includes("settings_key_invalid"), "Admin management API must return a specific error for invalid settings keys.");
assert(/if \(input\.action === "invoice_status"\)[\s\S]*\.select\("id, invoice_number, title_ar, user_id, organization_id"\)[\s\S]*ownerFinancialNotification = \{[\s\S]*actionUrl: data\.organization_id \? "\/dashboard\/business\/invoices" : "\/dashboard\/individual\/invoices"/.test(mahabahSource), "Admin invoice status updates must notify the affected individual or business owner.");
assert(/if \(input\.action === "payment_status"\)[\s\S]*\.select\("id, invoice_id, provider_reference, user_id, organization_id"\)[\s\S]*ownerFinancialNotification = \{[\s\S]*actionUrl: data\.organization_id \? "\/dashboard\/business\/payments" : "\/dashboard\/individual\/payments"/.test(mahabahSource), "Admin payment status updates must notify the affected individual or business owner.");
assert(/if \(input\.action === "payment_status"\)[\s\S]*const linkedInvoiceId = \(data\.invoice_id as string \| null\)[\s\S]*status === "succeeded"[\s\S]*\? "paid"[\s\S]*status === "failed" \|\| status === "refunded"[\s\S]*\? "due"[\s\S]*\.from\("invoices"\)[\s\S]*\.update\(\{[\s\S]*status: invoiceStatus/.test(mahabahSource), "Admin payment status updates must synchronize the linked invoice status.");
assert(/if \(input\.action === "subscription_status"\)[\s\S]*\.select\("id, plan_name_ar, user_id, organization_id"\)[\s\S]*ownerFinancialNotification = \{[\s\S]*actionUrl: data\.organization_id \? "\/dashboard\/business\/subscriptions" : "\/dashboard\/individual\/subscriptions"/.test(mahabahSource), "Admin subscription status updates must notify the affected individual or business owner.");
assert(/ownerFinancialNotification && \(ownerFinancialNotification\.userId \|\| ownerFinancialNotification\.organizationId\)[\s\S]*\.from\("notifications"\)\.insert\(\{[\s\S]*category: "financial"[\s\S]*metadata: ownerFinancialNotification\.metadata/.test(mahabahSource), "Admin financial owner notifications must be persisted as financial notifications.");
assert(mahabahSource.includes("dashboardAdminProviderStatus"), "Admin provider actions must validate provider status before persistence.");
assert(/if \(input\.action === "provider_status"\)[\s\S]*dashboardAdminProviderStatus\(input\.status\)[\s\S]*provider_status_invalid[\s\S]*providerStatusToReviewStatus\(providerStatus\)[\s\S]*\.from\("service_providers"\)[\s\S]*\.update\(\{ status \}\)/.test(mahabahSource), "Admin provider status updates must reject invalid statuses before updating service_providers.");
assert(/if \(input\.action === "provider_save"\)[\s\S]*dashboardAdminProviderStatus\(input\.status \?\? "pending"\)[\s\S]*provider_status_invalid[\s\S]*providerStatusToReviewStatus\(providerStatus\)[\s\S]*\.from\("service_providers"\)/.test(mahabahSource), "Admin provider saves must reject invalid provider status before upserting service_providers.");
assert(mahabahSource.includes("dashboardAdminContentStatus") && mahabahSource.includes("dashboardAdminContentKind"), "Admin content actions must validate content status and kind before persistence.");
assert(/if \(input\.action === "content_status"\)[\s\S]*dashboardAdminContentStatus\(input\.status\)[\s\S]*content_status_invalid[\s\S]*\.from\("content_items"\)[\s\S]*\.update\(\{ status \}\)/.test(mahabahSource), "Admin content status updates must reject invalid statuses before updating content_items.");
assert(/if \(input\.action === "content_save"\)[\s\S]*dashboardAdminContentKind\([\s\S]*content_kind_invalid[\s\S]*dashboardAdminContentStatus\(input\.status \?\? "draft"\)[\s\S]*content_status_invalid[\s\S]*\.from\("content_items"\)/.test(mahabahSource), "Admin content saves must reject invalid content kind/status before upserting content_items.");
assert(mahabahSource.includes("dashboardAdminContentCommentStatus") && mahabahSource.includes("resolveContentCommentForAdminAction"), "Admin content comment moderation must validate comment status and resolve comments.");
assert(/if \(input\.action === "content_comment_status"\)[\s\S]*resolveContentCommentForAdminAction\(input\)[\s\S]*content_comment_not_found[\s\S]*dashboardAdminContentCommentStatus\(input\.status\)[\s\S]*content_comment_status_invalid[\s\S]*\.from\("content_comments"\)[\s\S]*\.update\(\{ status \}\)/.test(mahabahSource), "Admin content comment moderation must reject invalid statuses before updating content_comments.");
assert(mahabahSource.includes('if (action.includes("content_comment_status")) return "تحديث حالة تعليق محتوى";'), "Admin audit logs must label content comment moderation actions.");
assert(dashboardAdminManagementSource.includes('"content_comment_status"') && dashboardAdminManagementSource.includes('"submitted"'), "Admin management API must accept content comment moderation actions and submitted status.");
for (const errorCode of ["provider_status_invalid", "content_status_invalid", "content_kind_invalid", "content_comment_status_invalid", "admin_profile_email_invalid", "admin_security_action_invalid"]) {
  assert(dashboardAdminManagementSource.includes(errorCode), `Admin management API must return a specific error for ${errorCode}.`);
}
assert(dashboardAdminManagementSource.includes("content_comment_not_found"), "Admin management API must return a specific not-found error for content comments.");
assert(/export async function updateDashboardAdminNotification[\s\S]*\.eq\("id", input\.notificationId\)[\s\S]*\.eq\("user_id", adminUserId\)[\s\S]*\.is\("organization_id", null\)/.test(mahabahSource), "Admin notification read toggles must only update the authenticated admin's own notification row.");
assert(/notification\.targetType === "admin"[\s\S]*AdminNotificationReadButton[\s\S]*سجل إرسال/.test(dashboardUiSource), "Admin notifications UI must not expose read toggles for individual/business recipient rows.");
assert(dashboardSupportSource.includes("clientReference"), "Support ticket API must accept pre-submission attachment references.");
assert(dashboardCommunicationActionsSource.includes("support_ticket_attachment") && dashboardCommunicationActionsSource.includes("clientReference"), "Support ticket form must upload attachments against a client reference.");
assert(/function normalizeSupportPriority[\s\S]*\["low", "normal", "high", "urgent"\]/.test(mahabahSource), "Support ticket persistence must normalize and whitelist priority values.");
assert(/export async function createDashboardSupportTicket[\s\S]*support_payload_invalid[\s\S]*support_priority_invalid[\s\S]*priority,\n\s*metadata/.test(mahabahSource), "Support ticket creation must reject invalid text payloads and unsupported priorities before insert.");
assert(dashboardSupportSource.includes('action.message === "support_payload_invalid"') && dashboardSupportSource.includes('action.message === "support_priority_invalid"'), "Support ticket API must return specific create validation errors.");
assert(/\.update\(\{\s*entity_id: data\.id,\s*entity_type: "support_ticket"/m.test(mahabahSource), "Support ticket creation must relink pre-submission attachments to the created ticket.");
const supportTicketCreatedAuditBlock = mahabahSource.match(/action: "support_ticket_created"[\s\S]*?metadata: \{[\s\S]*?\n\s{4}\},/)?.[0] ?? "";
assert(/reference,[\s\S]*scope: input\.scope \?\? "individual",[\s\S]*category,[\s\S]*clientReference: input\.clientReference \?\? null,/.test(supportTicketCreatedAuditBlock), "Support ticket audit metadata must keep reference, scope, category, and attachment reference.");
assert((supportTicketCreatedAuditBlock.match(/scope: input\.scope \?\? "individual"/g) ?? []).length === 1, "Support ticket audit metadata must not duplicate the scope key.");
assert(/export async function getDashboardSupportTicket[\s\S]*\.from\("support_ticket_messages"\)[\s\S]*\.eq\("ticket_id", ticket\.id\)[\s\S]*\.eq\("internal", false\)/.test(mahabahSource), "User support ticket details must hide internal admin notes.");
assert(/export async function getDashboardAdminSupportTicket[\s\S]*\.from\("support_ticket_messages"\)[\s\S]*\.eq\("ticket_id", ticket\.id\)[\s\S]*\.limit\(100\)/.test(mahabahSource), "Admin support ticket details must keep full support message history available.");
assert(/function adminSupportOwnerLabel[\s\S]*lookup\.organizations\.has\(row\.organization_id\)[\s\S]*lookup\.users\.has\(row\.requester_user_id\)/.test(mahabahSource), "Admin support ticket owner labels must resolve real Supabase organization/profile names before falling back to generic labels.");
assert(/export async function listDashboardAdminSupportTickets[\s\S]*loadFinancialOwnerLookup\(data\.map[\s\S]*mapSupportTicketRow\(item, lookup\)/.test(mahabahSource), "Admin support ticket list must hydrate owner labels from Supabase lookup data.");
assert(/export async function getDashboardAdminSupportTicket[\s\S]*loadFinancialOwnerLookup\(\[\{ user_id: ticketData\.requester_user_id, organization_id: ticketData\.organization_id \}\]\)[\s\S]*mapSupportTicketRow\(ticketData, lookup\)/.test(mahabahSource), "Admin support ticket detail must hydrate the selected ticket owner label from Supabase lookup data.");
assert(/if \(status \|\| \(reply && !input\.internal\)\) \{[\s\S]*\.from\("notifications"\)\.insert/.test(mahabahSource), "Internal admin support notes must not create customer-facing notifications unless a status update is included.");
assert(/export async function updateDashboardSupportTicket[\s\S]*status && !\["submitted", "completed", "cancelled"\]\.includes\(status\)[\s\S]*support_status_invalid/.test(mahabahSource), "Customer support ticket updates must not allow admin-only processing statuses.");
assert(/export async function updateDashboardSupportTicket[\s\S]*support_message_invalid/.test(mahabahSource) && /export async function updateDashboardAdminSupportTicket[\s\S]*support_message_invalid/.test(mahabahSource), "Support ticket update helpers must reject invalid reply text before writing messages.");
assert(dashboardSupportSource.includes('action.message === "support_message_invalid"') && dashboardAdminSupportSource.includes('action.message === "support_message_invalid"'), "User and admin support APIs must return specific invalid-message responses.");
assert(/DashboardSupportTicketUpdateButton[\s\S]*status="submitted"[\s\S]*إعادة فتح التذكرة[\s\S]*DashboardSupportTicketUpdateButton[\s\S]*status="completed"[\s\S]*إغلاق التذكرة[\s\S]*DashboardSupportTicketUpdateButton[\s\S]*status="cancelled"[\s\S]*إلغاء التذكرة/.test(dashboardUiSource), "Customer support ticket actions must expose reopen, close, and cancel rather than admin processing.");
assert(/AdminSupportTicketUpdateButton[\s\S]*status="in_progress"[\s\S]*معالجة[\s\S]*AdminSupportTicketUpdateButton[\s\S]*status="completed"[\s\S]*إغلاق[\s\S]*AdminSupportTicketUpdateButton[\s\S]*status="cancelled"[\s\S]*إلغاء/.test(dashboardUiSource), "Admin support ticket actions must keep processing, close, and cancel controls.");
assert(dashboardCommunicationActionsSource.includes("messages?conversation="), "Message thread redirects must keep the selected conversation in the dashboard URL.");
assert(dashboardMessagesSource.includes('searchParams.get("conversationId") ?? url.searchParams.get("conversation")'), "User messages API must accept both conversationId and dashboard conversation query parameters.");
assert(dashboardAdminMessagesSource.includes('searchParams.get("conversationId") ?? url.searchParams.get("conversation")'), "Admin messages API must accept both conversationId and dashboard conversation query parameters.");
assert(dashboardMessagesSource.includes("body: z.string().trim().min(2).max(3000)") && dashboardAdminMessagesSource.includes("body: z.string().trim().min(2).max(3000)"), "User and admin message APIs must bound message body length.");
assert(/function dashboardMessageInvalid[\s\S]*trimmed\.length < 2 \|\| trimmed\.length > 3000/.test(mahabahSource), "Message persistence helpers must share backend message body validation.");
assert(/export async function sendDashboardMessage[\s\S]*dashboardMessageInvalid\(body\)[\s\S]*message: "message_body_invalid"/.test(mahabahSource), "User message sends must reject invalid body text before resolving conversations.");
assert(/export async function sendDashboardAdminMessage[\s\S]*dashboardMessageInvalid\(body\)[\s\S]*message: "message_body_invalid"/.test(mahabahSource), "Admin message sends must reject invalid body text before inserting messages.");
assert(dashboardMessagesSource.includes('action.message === "message_body_invalid"') && dashboardAdminMessagesSource.includes('action.message === "message_body_invalid"'), "Message APIs must return specific invalid-body responses.");
assert(mahabahSource.includes("resolveDashboardConversationForOwner") && mahabahSource.includes("createDashboardConversationForOwner"), "User messages must resolve or create conversations through ownership-aware helpers.");
assert(/query = owner\.organizationId \? query\.eq\("organization_id", owner\.organizationId\) : query\.eq\("created_by", owner\.actorUserId\)\.is\("organization_id", null\)/.test(mahabahSource), "User conversation access must be scoped to organization or creator ownership.");
assert(mahabahSource.includes("admin_message_sent") && mahabahSource.includes("conversation_participants"), "Admin message replies must persist messages and participant/audit metadata.");
assert(/async function markDashboardConversationRead[\s\S]*\.from\("messages"\)[\s\S]*\.update\(\{ read_at: new Date\(\)\.toISOString\(\) \}\)[\s\S]*\.neq\("sender_user_id", viewerUserId\)[\s\S]*\.is\("read_at", null\)/.test(mahabahSource), "Conversation reads must mark messages from the other side as read in Supabase.");
assert(/export async function listDashboardMessages[\s\S]*await markDashboardConversationRead\(supabase, resolvedConversationId, owner\.actorUserId\)[\s\S]*\.from\("messages"\)/.test(mahabahSource), "User message threads must mark incoming messages read before returning the thread.");
assert(/export async function listDashboardAdminMessages[\s\S]*await markDashboardConversationRead\(supabase, resolvedConversationId, adminUserId\)[\s\S]*\.from\("messages"\)/.test(mahabahSource), "Admin message threads must mark incoming messages read before returning the thread.");
for (const [routeName, source] of [
  ["messages", dashboardMessagesSource],
  ["admin messages", dashboardAdminMessagesSource],
  ["support", dashboardSupportSource],
  ["admin notifications", dashboardAdminNotificationsSource],
]) {
  assert(source.includes("export async function PATCH"), `${routeName} API must expose PATCH for client update/archive actions.`);
}
for (const [routeName, source] of [
  ["notifications", dashboardNotificationsSource],
  ["admin notifications", dashboardAdminNotificationsSource],
  ["financial pay", dashboardFinancialPaySource],
  ["financial subscription", dashboardSubscriptionSource],
]) {
  assert(source.includes("export async function POST"), `${routeName} API must expose POST for client actions.`);
}
assert(migrationSql.includes("create or replace function public.pay_dashboard_invoice"), "Dashboard invoice payment RPC must be present in migrations.");
assert(/from public\.invoices i[\s\S]*p_organization_id is not null and i\.organization_id = p_organization_id[\s\S]*p_organization_id is null and p_owner_user_id is not null and i\.user_id = p_owner_user_id[\s\S]*for update/.test(migrationSql), "Dashboard invoice payment RPC must lock and scope invoices to the caller owner.");
assert(migrationSql.includes("grant execute on function public.pay_dashboard_invoice") && migrationSql.includes("to service_role"), "Dashboard invoice payment RPC must only be executable by the server service role.");
assert(mahabahSource.includes('message: "invoice_already_paid"'), "Dashboard invoice payment must detect already-paid invoices without creating duplicate payments.");
assert(mahabahSource.includes('message: "invoice_not_payable"') && mahabahSource.includes('["due", "overdue"].includes(invoiceRecord.status)'), "Dashboard invoice payment must reject draft or cancelled invoices before calling the payment RPC.");
assert(dashboardFinancialPaySource.includes('action.message === "invoice_already_paid"') && dashboardFinancialPaySource.includes("الفاتورة مسددة مسبقاً"), "Financial payment API must return a specific already-paid response.");
assert(dashboardFinancialPaySource.includes('action.message === "invoice_not_payable"') && dashboardFinancialPaySource.includes("لا يمكن سداد هذه الفاتورة بحالتها الحالية"), "Financial payment API must return a specific not-payable response.");
assert(dashboardSubscriptionSource.includes("planName: z.string().trim().min(2).max(80)") && dashboardSubscriptionSource.includes("z.number().min(0).max(1_000_000)"), "Financial subscription API must bound plan names and amounts before updating subscriptions.");
assert(mahabahSource.includes('message: "subscription_plan_invalid"') && mahabahSource.includes("amount > 1_000_000"), "Subscription plan updates must reject invalid names or excessive amounts inside the persistence helper.");
assert(dashboardSubscriptionSource.includes('action.message === "subscription_plan_invalid"') && dashboardSubscriptionSource.includes("بيانات الباقة غير صحيحة"), "Financial subscription API must return a specific invalid-plan response.");
assert(/const staleInvoices = \(existingInvoices \?\? \[\]\)[\s\S]*jsonRecord\(invoice\.metadata\)[\s\S]*replacedByPlan: planName/.test(mahabahSource), "Subscription plan changes must preserve existing invoice metadata when cancelling stale invoices.");
assert(/let cancelledStaleSubscriptions = 0[\s\S]*\.from\("subscriptions"\)[\s\S]*\.neq\("id", subscriptionId\)[\s\S]*\.in\("status", \["active", "pending"\]\)[\s\S]*status: "cancelled"[\s\S]*cancelledStaleSubscriptions = staleSubscriptionIds\.length/.test(mahabahSource), "Subscription plan changes must cancel older active or pending subscriptions for the same owner.");
assert(/action: "subscription_plan_updated"[\s\S]*cancelledStaleSubscriptions/.test(mahabahSource), "Subscription plan audit metadata must include cancelled stale subscription count.");
assert(/title_ar: "تم تحديث الاشتراك"[\s\S]*metadata: \{ planName, amount, invoiceCreated, cancelledStaleInvoices, cancelledStaleSubscriptions \}/.test(mahabahSource), "Subscription plan notifications must include stale subscription cleanup metadata.");
assert(mahabahSource.includes('action: "public_asset_drafted"'), "Public asset drafts must be audited without being sent to admin review.");
assert(mahabahSource.includes('action: "public_service_request_drafted"'), "Public service request drafts must be audited without being sent to admin review.");
assert(/if \(status === "submitted"\)\s*{\s*await notifyAdminAboutPublicSubmission/.test(mahabahSource), "Public draft submissions must not notify admins until submitted.");
assert(publicSubmitAssetSource.includes('submission.status === "draft"'), "Public asset API must return a draft-specific message.");
assert(publicRequestStudySource.includes('serviceRequest.status === "draft"'), "Public request study API must return a draft-specific message.");
assert(dashboardRequestSource.includes("localizedNumber"), "Dashboard request API must parse localized numeric input.");
assert(dashboardSubscriptionSource.includes("localizedNumber"), "Dashboard subscription API must parse localized amount input.");
assert(mahabahSource.includes("function dashboardCommunicationOwner"), "Dashboard communication owner helper is missing.");
assert(/if \(scope === "business"\)\s*{[\s\S]*userId: null,[\s\S]*organizationId,/m.test(mahabahSource), "Business communication ownership must use organization ownership rather than requester_user_id.");
assert(/query = owner\.organizationId \? query\.eq\("organization_id", owner\.organizationId\) : query\.eq\("requester_user_id", owner\.userId\)/.test(mahabahSource), "Support tickets must be filtered by organization for business and requester for individuals.");
assert(mahabahSource.includes("attachDashboardPreSubmissionDocuments"), "Dashboard request documents must be relinked after request creation.");
assert(/\.update\(\{\s*entity_id: input\.entityId,\s*entity_type: `\$\{input\.scope\}_\$\{input\.kind\}_request`,\s*\}\)/m.test(mahabahSource), "Pre-submission dashboard documents must be relinked to the created entity.");
assert(dashboardActionsSource.includes('"formReference"'), "Dashboard request forms must include formReference in submitted payloads for document relinking.");
assert(/if \(mode === "submitted" && \(input\.kind === "service_request" \|\| input\.kind === "contribution"\)\)[\s\S]*createDashboardRequestFinancialRecords/.test(mahabahSource), "Submitted payable dashboard requests must create financial records.");
assert(/if \(mode === "submitted"\) \{[\s\S]*insertDashboardAdminNotifications/.test(mahabahSource), "Dashboard request drafts must not notify admins before submission.");
assert(/action: mode === "draft" \? "dashboard_request_drafted" : "dashboard_request_submitted"/.test(mahabahSource), "Dashboard request drafts/submissions must write distinct audit actions.");
assert(/title_ar: mode === "draft" \? `تم حفظ مسودة/.test(mahabahSource), "Dashboard request drafts must create owner-facing draft notifications.");

const apiRoutes = walk("app/api", (file) => file.endsWith("route.ts")).sort();
assert(!/z\.coerce\.number\(\)/.test(apiRoutes.map(read).join("\n")), "API routes must use localizedNumber preprocessing instead of raw z.coerce.number().");
assert(apiRoutes.length >= 30, "Expected the dashboard/public API route surface to be present.");
for (const route of apiRoutes) {
  const source = read(route);
  assert(/export async function (GET|POST|PUT|PATCH|DELETE)/.test(source), `${route} has no HTTP handler export.`);
  if (/export async function (POST|PUT|PATCH|DELETE)/.test(source) && route !== "app/api/auth/logout/route.ts") {
    assert(/safeParse|formData\(\)|request\.json\(\)\.catch/.test(source), `${route} mutates data without an obvious validation/parsing guard.`);
  }
}

const navPaths = unique([...dashboardSource.matchAll(/path:\s*"([^"]*)"/g)].map((match) => match[1]).filter(Boolean));
assert(navPaths.includes("add-asset"), "Individual/business add asset route missing from dashboard navigation.");
assert(navPaths.includes("add-contribution"), "Business add contribution route missing from dashboard navigation.");
assert(navPaths.includes("company-profile"), "Business company profile route missing from dashboard navigation.");
assert(navPaths.includes("verification"), "Verification route missing from dashboard navigation.");
assert(navPaths.includes("messages"), "Messages route missing from dashboard navigation.");
assert(navPaths.includes("support"), "Support route missing from dashboard navigation.");
assert(navPaths.includes("review-center/verification"), "Admin verification review route missing from dashboard navigation.");

const requiredDashboardPaths = {
  individual: [
    "",
    "add-asset",
    "browse-assets",
    "my-assets",
    "interested-assets",
    "asset-details",
    "browse-contributions",
    "interested-contributions",
    "contribution-details",
    "request-service",
    "my-requests",
    "service-details",
    "profile",
    "account-notifications",
    "security",
    "invoices",
    "subscriptions",
    "payments",
    "notifications",
    "messages",
    "support",
    "personal-profile",
    "verification",
  ],
  business: [
    "",
    "add-asset",
    "browse-assets",
    "company-assets",
    "interested-assets",
    "asset-details",
    "add-contribution",
    "browse-contributions",
    "interested-contributions",
    "company-contributions",
    "contribution-details",
    "request-service",
    "my-requests",
    "service-details",
    "company-profile",
    "verification",
    "invoices",
    "subscriptions",
    "payments",
    "notifications",
    "messages",
    "support",
    "profile",
  ],
  admin: [
    "",
    "assets",
    "assets/details",
    "assets/pending",
    "assets/approved",
    "assets/rejected",
    "contributions",
    "contributions/details",
    "contributions/pending",
    "contributions/approved",
    "contributions/rejected",
    "service-requests",
    "service-requests/details",
    "services",
    "accounts",
    "accounts/individuals",
    "accounts/businesses",
    "users",
    "businesses",
    "billing",
    "billing/details",
    "payments",
    "payments/details",
    "subscriptions",
    "plans",
    "notifications",
    "messages",
    "support",
    "settings",
    "settings/identity",
    "settings/homepage",
    "settings/header",
    "settings/footer",
    "settings/notifications",
    "settings/messages",
    "settings/email",
    "settings/seo",
    "settings/integrations",
    "system/roles",
    "system/admins",
    "system/login-log",
    "system/activity-log",
    "system/sensitive-log",
    "review-center",
    "review-center/assets",
    "review-center/contributions",
    "review-center/services",
    "review-center/verification",
    "review-center/content",
    "review-center/approvals",
    "content",
    "content/articles",
    "reports",
    "reports/assets",
    "reports/contributions",
    "reports/services",
    "reports/financial",
  ],
};

function navPathsForRole(role) {
  const roleStart = dashboardSource.indexOf(`const ${role}Nav`);
  const nextRoleStart = ["individual", "business", "admin"]
    .map((name) => dashboardSource.indexOf(`const ${name}Nav`, roleStart + 1))
    .filter((index) => index > roleStart)
    .sort((a, b) => a - b)[0] ?? dashboardSource.indexOf("const individualSummary", roleStart);
  const block = dashboardSource.slice(roleStart, nextRoleStart);
  return unique([...block.matchAll(/path:\s*"([^"]*)"/g)].map((match) => match[1]).filter(Boolean));
}

function dispatcherHandles(role, navPath) {
  if (!navPath) return true;
  if (dashboardPageSource.includes(`config.role === "${role}" && activePath === "${navPath}"`)) return true;
  if (dashboardUiSource.includes(`config.role === "${role}" && activePath === "${navPath}"`)) return true;
  if (["asset-details", "contribution-details", "service-details"].includes(navPath)) {
    return dashboardUiSource.includes(`config.role === "${role}" && activePath.startsWith("${navPath}")`);
  }
  if (navPath.endsWith("/details")) return dashboardUiSource.includes(`config.role === "${role}" && activePath === "${navPath}"`);
  if (["add-asset", "profile", "company-profile", "verification", "settings", "security"].includes(navPath)) {
    return dashboardUiSource.includes(`activePath === "${navPath}"`) || dashboardSource.includes(`isFormPath(path)`);
  }
  return false;
}

for (const role of ["individual", "business", "admin"]) {
  const roleNavPaths = navPathsForRole(role);
  for (const requiredPath of requiredDashboardPaths[role]) {
    const isDynamicDetailPath = ["asset-details", "contribution-details", "service-details"].includes(requiredPath);
    const inNav = !requiredPath || roleNavPaths.includes(requiredPath);
    const findNavItemSupportsDynamicPath =
      isDynamicDetailPath &&
      dashboardSource.includes(`role === "${role}" && path.startsWith("${requiredPath}")`);
    assert(inNav || findNavItemSupportsDynamicPath, `Required /dashboard/${role}/${requiredPath || "(home)"} is missing from nav or dynamic route resolver.`);
    assert(dispatcherHandles(role, requiredPath), `Required /dashboard/${role}/${requiredPath || "(home)"} is not handled by the dashboard dispatcher.`);
  }
  for (const navPath of navPathsForRole(role)) {
    assert(dispatcherHandles(role, navPath), `Dashboard nav path /dashboard/${role}/${navPath} is not handled by the page dispatcher.`);
  }
}

if (failures.length) {
  console.error("Backend readiness verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Backend readiness verification passed.");
console.log(`- Migrations checked: ${migrationFiles.length}`);
console.log(`- Public tables declared: ${createdTables.length}`);
console.log(`- Supabase tables referenced by code: ${referencedTables.length}`);
console.log(`- API routes checked: ${apiRoutes.length}`);
console.log(`- Dashboard nav paths checked: ${navPaths.length}`);
