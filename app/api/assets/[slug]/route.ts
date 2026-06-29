import { NextResponse } from "next/server";
import { getAssetBySlug } from "@/lib/supabase/mahabah";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getAssetBySlug(slug);
  if (result.error) return NextResponse.json({ ...result, error: "تعذر تحميل بيانات الأصل العقاري" }, { status: 502 });
  if (!result.data) return NextResponse.json({ ...result, error: "الأصل غير موجود" }, { status: 404 });
  return NextResponse.json(result);
}
