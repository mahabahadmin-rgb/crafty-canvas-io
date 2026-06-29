import { NextResponse } from "next/server";
import { clearMahabahAuthCookies, signOutMahabahSessionFromCookieHeader } from "@/lib/supabase/auth";

export async function GET(request: Request) {
  await signOutMahabahSessionFromCookieHeader(request.headers.get("cookie"));
  const response = NextResponse.redirect(new URL("/auth/login", request.url));
  clearMahabahAuthCookies(response);
  return response;
}

export async function POST(request: Request) {
  return GET(request);
}
