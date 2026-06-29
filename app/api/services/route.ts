import { NextResponse } from "next/server";
import { getServices } from "@/lib/supabase/mahabah";

export async function GET() {
  const result = await getServices();

  return NextResponse.json(
    {
      services: result.data.map(({ icon: _icon, ...service }) => service),
      source: result.source,
      error: result.error ?? null,
    },
    { status: result.error ? 502 : 200 },
  );
}
