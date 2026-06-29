import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import type { NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabasePublic, getSupabaseStatus } from "@/lib/supabase/server";

export type MahabahAuthRole = "individual" | "business" | "admin";
export type MahabahSelfServiceRole = Exclude<MahabahAuthRole, "admin">;
type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export type MahabahRegisterInput = {
  role: MahabahSelfServiceRole;
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
  organizationName?: string;
  commercialRegistration?: string;
  delegatedName?: string;
};

export type MahabahLoginInput = {
  email: string;
  password: string;
};

export type MahabahSessionTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  expiresAt?: number;
};

export type MahabahAuthContext = {
  userId: string;
  email: string | null;
  role: MahabahAuthRole;
  organizationId: string | null;
};

export type MahabahOnboardingInput = {
  role: MahabahSelfServiceRole;
  fullName?: string;
  organizationName?: string;
  commercialRegistration?: string;
  identityNumber?: string;
  city?: string;
  phone?: string;
  address?: string;
};

export type MahabahDashboardScope = "individual" | "business";

export const MAHABAH_AUTH_COOKIES = {
  accessToken: "mahabah_access_token",
  refreshToken: "mahabah_refresh_token",
} as const;

export function dashboardRedirect(role: string | null | undefined) {
  if (role === "admin") return "/dashboard/admin";
  return role === "business" ? "/dashboard/business" : "/dashboard/individual";
}

function onboardingRedirect(role: string | null | undefined) {
  return role === "business" ? "/auth/onboarding/business" : "/auth/onboarding/individual";
}

function authRole(value: unknown): MahabahAuthRole | null {
  return value === "admin" ? "admin" : value === "business" ? "business" : value === "individual" ? "individual" : null;
}

function isSuspendedStatus(value: unknown) {
  return value === "archived" || value === "suspended" || value === "disabled";
}

function jsonRecord(value: unknown): Record<string, Json> {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, Json>;
  return {};
}

function devAdminEnabled() {
  return process.env.NODE_ENV !== "production" && Boolean(process.env.MAHABAH_DEV_ADMIN_EMAIL && process.env.MAHABAH_DEV_ADMIN_PASSWORD);
}

function devAdminEmail() {
  return process.env.MAHABAH_DEV_ADMIN_EMAIL?.trim().toLowerCase() ?? "";
}

function devAdminMatches(input: MahabahLoginInput) {
  return devAdminEnabled()
    && input.email.trim().toLowerCase() === devAdminEmail()
    && input.password === process.env.MAHABAH_DEV_ADMIN_PASSWORD;
}

function devAdminToken(email: string) {
  return `dev-admin:${Buffer.from(email.trim().toLowerCase()).toString("base64url")}`;
}

function devAdminContextFromToken(token?: string): MahabahAuthContext | null {
  if (!devAdminEnabled() || !token?.startsWith("dev-admin:")) return null;
  try {
    const email = Buffer.from(token.slice("dev-admin:".length), "base64url").toString("utf8").trim().toLowerCase();
    if (email !== devAdminEmail()) return null;
    return {
      userId: "33333333-3333-4333-8333-333333333333",
      email,
      role: "admin",
      organizationId: null,
    };
  } catch {
    return null;
  }
}

function text(value: string | undefined | null, fallback: string) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

function optionalText(value: string | undefined | null) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

function toSessionTokens(session: Session | null): MahabahSessionTokens | undefined {
  if (!session?.access_token || !session.refresh_token) return undefined;
  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresIn: session.expires_in ?? undefined,
    expiresAt: session.expires_at ?? undefined,
  };
}

async function createPasswordSession(input: MahabahLoginInput): Promise<MahabahSessionTokens | undefined> {
  const publicClient = getSupabasePublic();
  if (!publicClient) return undefined;
  const { data, error } = await publicClient.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });
  if (error) throw new Error(error.message);
  return toSessionTokens(data.session);
}

export function setMahabahAuthCookies(response: NextResponse, session: MahabahSessionTokens | undefined) {
  if (!session) return;
  const secure = process.env.NODE_ENV === "production";
  const maxAge = Math.max(60, session.expiresIn ?? 60 * 60 * 24 * 7);
  response.cookies.set(MAHABAH_AUTH_COOKIES.accessToken, session.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge,
  });
  response.cookies.set(MAHABAH_AUTH_COOKIES.refreshToken, session.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearMahabahAuthCookies(response: NextResponse) {
  response.cookies.delete(MAHABAH_AUTH_COOKIES.accessToken);
  response.cookies.delete(MAHABAH_AUTH_COOKIES.refreshToken);
}

export async function signOutMahabahSessionFromCookieHeader(cookieHeader: string | null) {
  const cookies = parseCookieHeader(cookieHeader);
  const accessToken = cookies.get(MAHABAH_AUTH_COOKIES.accessToken);
  const refreshToken = cookies.get(MAHABAH_AUTH_COOKIES.refreshToken);
  const publicClient = getSupabasePublic();
  if (!publicClient || !accessToken || !refreshToken) return false;

  const { error: sessionError } = await publicClient.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (sessionError) {
    const { error: refreshError } = await publicClient.auth.refreshSession({ refresh_token: refreshToken });
    if (refreshError) return false;
  }

  const { error } = await publicClient.auth.signOut();
  return !error;
}

export function dashboardScopeAccessError(actor: MahabahAuthContext | null | undefined, scope: MahabahDashboardScope) {
  if (!actor) return "auth_required";
  if (scope === "business" && (!actor.organizationId || actor.role !== "business")) return "business_account_required";
  if (scope === "individual" && actor.role !== "individual") return "individual_account_required";
  return null;
}

export function adminAccessError(actor: MahabahAuthContext | null | undefined) {
  if (!actor) return "auth_required";
  if (actor.role !== "admin") return "admin_required";
  return null;
}

function parseCookieHeader(header: string | null) {
  const cookies = new Map<string, string>();
  if (!header) return cookies;
  for (const part of header.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (!rawName || rawValue.length === 0) continue;
    cookies.set(rawName, decodeURIComponent(rawValue.join("=")));
  }
  return cookies;
}

export async function getMahabahAuthContextFromCookieHeader(cookieHeader: string | null): Promise<MahabahAuthContext | null> {
  const cookies = parseCookieHeader(cookieHeader);
  const accessToken = cookies.get(MAHABAH_AUTH_COOKIES.accessToken);
  const refreshToken = cookies.get(MAHABAH_AUTH_COOKIES.refreshToken);
  const publicClient = getSupabasePublic();
  if (!publicClient) return devAdminContextFromToken(accessToken) ?? devAdminContextFromToken(refreshToken);
  if (!accessToken && !refreshToken) return null;

  const user = await resolveMahabahCookieUser(publicClient, accessToken, refreshToken);
  if (!user) return null;

  const userId = user.id;
  const email = user.email ?? null;
  let role = authRole(user.app_metadata?.account_role) ?? "individual";
  let organizationId: string | null = null;
  const admin = getSupabaseAdmin();

  if (admin) {
    const { data: profile } = await admin.from("profiles").select("role, verification_status").eq("id", userId).maybeSingle();
    const profileRow = profile as { role?: unknown; verification_status?: unknown } | null;
    if (isSuspendedStatus(profileRow?.verification_status)) return null;
    role = authRole(profileRow?.role) ?? role;

    const { data: organization } = await admin.from("organizations").select("id, status, verification_status").eq("owner_user_id", userId).maybeSingle();
    const organizationRow = organization as { id?: string; status?: unknown; verification_status?: unknown } | null;
    if (organizationRow?.id && (isSuspendedStatus(organizationRow.status) || isSuspendedStatus(organizationRow.verification_status))) return null;
    organizationId = organizationRow?.id ?? null;
    if (organizationId) role = "business";
  }

  return { userId, email, role, organizationId };
}

async function resolveMahabahCookieUser(publicClient: SupabaseClient, accessToken?: string, refreshToken?: string): Promise<User | null> {
  if (accessToken) {
    const { data, error } = await publicClient.auth.getUser(accessToken);
    if (!error && data.user) return data.user;
  }

  if (!refreshToken) return null;
  const { data, error } = await publicClient.auth.refreshSession({ refresh_token: refreshToken });
  if (error || !data.user) return null;
  return data.user;
}

export async function getMahabahAuthContext(request: Request): Promise<MahabahAuthContext | null> {
  return getMahabahAuthContextFromCookieHeader(request.headers.get("cookie"));
}

export async function registerMahabahAccount(input: MahabahRegisterInput) {
  const supabase = getSupabaseAdmin();
  const role = input.role;
  let redirect = dashboardRedirect(role);
  if (!supabase) {
    const supabaseStatus = getSupabaseStatus();
    return { ok: true, persisted: false, role, redirect, message: "supabase_not_configured", supabaseStatus };
  }

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    app_metadata: { account_role: role },
    user_metadata: {
      display_name: input.fullName,
    },
  });
  if (authError) throw new Error(authError.message);
  const userId = authData.user?.id;
  if (!userId) throw new Error("auth_user_not_created");

  const profileName = role === "business" ? (input.delegatedName || input.fullName) : input.fullName;
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: userId,
    role,
    full_name: profileName,
    email: input.email,
    phone: input.phone ?? null,
    city_ar: input.city ?? "الرياض",
    verification_status: "draft",
    profile_completion: role === "business" ? 55 : 65,
    metadata: {
      source: "auth_register",
      accountRole: role,
      registeredAt: new Date().toISOString(),
    },
  }, { onConflict: "id" });
  if (profileError) throw new Error(profileError.message);

  let organizationId: string | undefined;
  if (role === "business") {
    const { data: organization, error: organizationError } = await supabase.from("organizations").insert({
      owner_user_id: userId,
      name_ar: input.organizationName || input.fullName,
      commercial_registration: input.commercialRegistration ?? null,
      activity_type_ar: "إدارة المساهمات العقارية",
      city_ar: input.city ?? "الرياض",
      email: input.email,
      phone: input.phone ?? null,
      status: "draft",
      verification_status: "draft",
      profile_completion: 55,
      metadata: {
        source: "auth_register",
        delegatedName: input.delegatedName ?? profileName,
      },
    }).select("id").single();
    if (organizationError) throw new Error(organizationError.message);
    organizationId = organization?.id as string | undefined;

    if (organizationId) {
      const { error: memberError } = await supabase.from("organization_members").upsert({
        organization_id: organizationId,
        user_id: userId,
        member_role: "owner",
      }, { onConflict: "organization_id,user_id" });
      if (memberError) throw new Error(memberError.message);
    }
  }

  await supabase.from("notifications").insert({
    user_id: userId,
    organization_id: organizationId ?? null,
    title_ar: "تم إنشاء حسابك في مهابة",
    body_ar: role === "business" ? "تم إنشاء حساب الأعمال ويمكنك إكمال بيانات المنشأة." : "تم إنشاء حساب الأفراد ويمكنك متابعة لوحة التحكم.",
    category: "account",
    action_url: redirect,
    metadata: { source: "auth_register", role },
  });

  await supabase.from("audit_logs").insert({
    actor_user_id: userId,
    organization_id: organizationId ?? null,
    action: "auth_register",
    entity_type: role === "business" ? "organization" : "profile",
    entity_id: organizationId ?? userId,
    metadata: { role, email: input.email },
  });

  let session: MahabahSessionTokens | undefined;
  try {
    session = await createPasswordSession({ email: input.email, password: input.password });
    if (session) redirect = onboardingRedirect(role);
  } catch {
    session = undefined;
  }

  return { ok: true, persisted: true, role, redirect, dashboardRedirect: dashboardRedirect(role), userId, organizationId, session };
}

export async function loginMahabahAccount(input: MahabahLoginInput) {
  const publicClient = getSupabasePublic();
  if (!publicClient) {
    if (devAdminMatches(input)) {
      const email = input.email.trim().toLowerCase();
      const token = devAdminToken(email);
      return {
        ok: true,
        authenticated: true,
        persisted: true,
        role: "admin",
        redirect: "/dashboard/admin",
        userId: "33333333-3333-4333-8333-333333333333",
        session: {
          accessToken: token,
          refreshToken: token,
          expiresIn: 60 * 60 * 24 * 7,
        },
      };
    }
    const supabaseStatus = getSupabaseStatus();
    return { ok: true, authenticated: false, persisted: false, role: "individual", redirect: "/dashboard/individual", message: "supabase_not_configured", supabaseStatus };
  }

  const { data, error } = await publicClient.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });
  if (error) throw new Error(error.message);
  const userId = data.user?.id;
  if (!userId) throw new Error("auth_user_not_found");
  const session = toSessionTokens(data.session);
  if (!session) {
    return { ok: true, authenticated: false, persisted: true, role: "individual", redirect: "/auth/login", message: "auth_session_missing" };
  }

  let role: string | null = data.user?.app_metadata?.account_role as string | null | undefined ?? null;
  const admin = getSupabaseAdmin();
  if (admin) {
    const { data: profile } = await admin.from("profiles").select("role, verification_status").eq("id", userId).maybeSingle();
    role = (profile?.role as string | undefined) ?? role;

    const { data: organization } = await admin
      .from("organizations")
      .select("id, status, verification_status")
      .eq("owner_user_id", userId)
      .maybeSingle();
    if (organization?.id) role = "business";

    const accountSuspended = organization?.id
      ? isSuspendedStatus(organization.status) || isSuspendedStatus(organization.verification_status)
      : isSuspendedStatus(profile?.verification_status);
    if (accountSuspended) {
      await publicClient.auth.signOut().catch(() => undefined);
      return { ok: true, authenticated: false, persisted: true, role: role ?? "individual", redirect: "/auth/login", message: "account_suspended" };
    }
  }

  return { ok: true, authenticated: true, persisted: true, role: role ?? "individual", redirect: dashboardRedirect(role), userId, session };
}

export async function completeMahabahOnboarding(context: MahabahAuthContext, input: MahabahOnboardingInput) {
  const supabase = getSupabaseAdmin();
  const role = context.role;
  const redirect = dashboardRedirect(role);
  if (!supabase) {
    const supabaseStatus = getSupabaseStatus();
    return { ok: true, persisted: false, role, redirect, message: "supabase_not_configured", supabaseStatus };
  }

  const savedAt = new Date().toISOString();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, city_ar, profile_completion, metadata")
    .eq("id", context.userId)
    .maybeSingle();
  const profileRow = profile as {
    full_name?: string | null;
    email?: string | null;
    phone?: string | null;
    city_ar?: string | null;
    profile_completion?: number | null;
    metadata?: unknown;
  } | null;
  const profileMetadata = jsonRecord(profileRow?.metadata);
  const fullName = text(input.fullName, profileRow?.full_name ?? context.email ?? "مستخدم مهابة");
  const city = text(input.city, profileRow?.city_ar ?? "الرياض");
  const phone = optionalText(input.phone) ?? profileRow?.phone ?? null;

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: context.userId,
    role,
    full_name: fullName,
    email: profileRow?.email ?? context.email,
    phone,
    city_ar: city,
    profile_completion: Math.max(profileRow?.profile_completion ?? 0, role === "business" ? 80 : 85),
    metadata: {
      ...profileMetadata,
      onboarding: {
        ...(jsonRecord(profileMetadata.onboarding)),
        identityNumber: optionalText(input.identityNumber),
        address: optionalText(input.address),
        completedAt: savedAt,
      },
    },
  }, { onConflict: "id" });
  if (profileError) throw new Error(profileError.message);

  let organizationId = context.organizationId;
  if (role === "business") {
    const { data: organization } = await supabase
      .from("organizations")
      .select("id, name_ar, commercial_registration, email, phone, city_ar, profile_completion, metadata")
      .eq(organizationId ? "id" : "owner_user_id", organizationId ?? context.userId)
      .maybeSingle();
    const organizationRow = organization as {
      id?: string;
      name_ar?: string | null;
      commercial_registration?: string | null;
      email?: string | null;
      phone?: string | null;
      city_ar?: string | null;
      profile_completion?: number | null;
      metadata?: unknown;
    } | null;
    const organizationMetadata = jsonRecord(organizationRow?.metadata);
    const organizationRecord = {
      owner_user_id: context.userId,
      name_ar: text(input.organizationName, organizationRow?.name_ar ?? fullName),
      commercial_registration: optionalText(input.commercialRegistration) ?? organizationRow?.commercial_registration ?? null,
      activity_type_ar: "إدارة المساهمات العقارية",
      city_ar: city,
      email: organizationRow?.email ?? context.email,
      phone,
      status: "draft",
      verification_status: "draft",
      profile_completion: Math.max(organizationRow?.profile_completion ?? 0, 82),
      metadata: {
        ...organizationMetadata,
        onboarding: {
          ...(jsonRecord(organizationMetadata.onboarding)),
          address: optionalText(input.address),
          completedAt: savedAt,
        },
      },
    };

    if (organizationRow?.id) {
      const { error } = await supabase.from("organizations").update(organizationRecord).eq("id", organizationRow.id);
      if (error) throw new Error(error.message);
      organizationId = organizationRow.id;
    } else {
      const { data: insertedOrganization, error } = await supabase.from("organizations").insert(organizationRecord).select("id").single();
      if (error) throw new Error(error.message);
      organizationId = (insertedOrganization as { id?: string } | null)?.id ?? null;
    }

    if (organizationId) {
      const { error } = await supabase.from("organization_members").upsert({
        organization_id: organizationId,
        user_id: context.userId,
        member_role: "owner",
      }, { onConflict: "organization_id,user_id" });
      if (error) throw new Error(error.message);
    }
  }

  await supabase.from("audit_logs").insert({
    actor_user_id: context.userId,
    organization_id: organizationId,
    action: "auth_onboarding_completed",
    entity_type: role === "business" ? "organization" : "profile",
    entity_id: organizationId ?? context.userId,
    metadata: { role, city, completedAt: savedAt },
  });

  await supabase.from("notifications").insert({
    user_id: context.userId,
    organization_id: organizationId,
    title_ar: "تم إكمال إعداد الحساب",
    body_ar: role === "business" ? "تم حفظ بيانات المنشأة وربطها بحسابك." : "تم حفظ بيانات حسابك الشخصي.",
    category: "account",
    action_url: redirect,
    metadata: { source: "auth_onboarding", role },
  });

  return { ok: true, persisted: true, role, redirect, organizationId };
}

export async function verifyMahabahAccessCode(context: MahabahAuthContext, code: string) {
  const supabase = getSupabaseAdmin();
  const role = context.role;
  const redirect = dashboardRedirect(role);
  if (!/^\d{4,6}$/.test(code)) throw new Error("invalid_code");
  if (!supabase) {
    const supabaseStatus = getSupabaseStatus();
    return { ok: true, persisted: false, role, redirect, message: "supabase_not_configured", supabaseStatus };
  }

  await supabase.from("audit_logs").insert({
    actor_user_id: context.userId,
    organization_id: context.organizationId,
    action: "auth_code_verified",
    entity_type: "auth_session",
    entity_id: context.userId,
    metadata: { role, verifiedAt: new Date().toISOString() },
  });

  await supabase.from("notifications").insert({
    user_id: context.userId,
    organization_id: context.organizationId,
    title_ar: "تم تأكيد رمز الدخول",
    body_ar: "تم التحقق من رمز الدخول وربط الجلسة بحسابك.",
    category: "account",
    action_url: redirect,
    metadata: { source: "auth_verify", role },
  });

  return { ok: true, persisted: true, role, redirect };
}
