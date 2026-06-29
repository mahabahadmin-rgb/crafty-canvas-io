import { NextResponse } from "next/server";
import { getContributionBySlug } from "@/lib/supabase/mahabah";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getContributionBySlug(slug);
  if (result.error) return NextResponse.json({ ...result, error: "تعذر تحميل بيانات المساهمة العقارية" }, { status: 502 });
  if (!result.data) return NextResponse.json({ ...result, error: "المساهمة غير موجودة" }, { status: 404 });
  return NextResponse.json(result);
}
