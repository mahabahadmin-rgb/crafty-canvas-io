import { NextResponse } from "next/server";
import { supabaseRuntimeState } from "@/lib/supabase/mahabah";

export async function GET() {
  const supabase = supabaseRuntimeState();

  return NextResponse.json({
    ok: supabase.configured,
    supabase,
    app: {
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? null,
      nodeEnv: process.env.NODE_ENV ?? "development",
    },
  }, {
    status: supabase.configured ? 200 : 503,
  });
}
