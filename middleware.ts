import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

const REFRESH_WINDOW_SECONDS = 5 * 60;
const MAHABAH_AUTH_COOKIES = {
  accessToken: "mahabah_access_token",
  refreshToken: "mahabah_refresh_token",
} as const;

function tokenExpiresSoon(accessToken?: string) {
  if (!accessToken) return true;

  const [, payload] = accessToken.split(".");
  if (!payload) return true;

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const parsed = JSON.parse(atob(padded)) as { exp?: unknown };
    const expiresAt = typeof parsed.exp === "number" ? parsed.exp : 0;
    return expiresAt <= Math.floor(Date.now() / 1000) + REFRESH_WINDOW_SECONDS;
  } catch {
    return true;
  }
}

async function refreshMahabahSession(request: NextRequest, response: NextResponse) {
  const accessToken = request.cookies.get(MAHABAH_AUTH_COOKIES.accessToken)?.value;
  const refreshToken = request.cookies.get(MAHABAH_AUTH_COOKIES.refreshToken)?.value;
  if (!refreshToken || !tokenExpiresSoon(accessToken)) return;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return;

  const supabase = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
  if (error || !data.session) return;

  const secure = process.env.NODE_ENV === "production";
  response.cookies.set(MAHABAH_AUTH_COOKIES.accessToken, data.session.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: Math.max(60, data.session.expires_in ?? 60 * 60 * 24 * 7),
  });
  response.cookies.set(MAHABAH_AUTH_COOKIES.refreshToken, data.session.refresh_token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  await refreshMahabahSession(request, response);
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/dashboard/:path*", "/api/auth/verify", "/api/auth/onboarding"],
};
