import { NextResponse } from "next/server";
import { z } from "zod";
import { toggleDashboardInterest } from "@/lib/supabase/mahabah";
import { getMahabahAuthContext } from "@/lib/supabase/auth";
import { routeErrorBody } from "@/lib/api/route-errors";

const schema = z.object({
  entityType: z.enum(["asset", "contribution"]),
  entityId: z.string().optional(),
  slug: z.string().optional(),
  title: z.string().optional(),
  interested: z.boolean().optional(),
});

export async function POST(request: Request) {
  const result = schema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "بيانات الاهتمام غير مكتملة", issues: result.error.flatten() }, { status: 400 });
  }

  try {
    const actor = await getMahabahAuthContext(request);
    if (!actor) {
      return NextResponse.json({ error: "يجب تسجيل الدخول قبل تنفيذ الإجراء" }, { status: 401 });
    }
    const action = await toggleDashboardInterest({ ...result.data, actor });
    if (!action.persisted && action.message === "entity_not_found") {
      return NextResponse.json({ ...action, error: "لم يتم العثور على العنصر المطلوب" }, { status: 404 });
    }
    if (!action.persisted) {
      return NextResponse.json({ ...action, error: "اتصال Supabase غير مكتمل، لا يمكن تحديث الاهتمام حالياً" }, { status: 503 });
    }
    return NextResponse.json({
      ...action,
      message: action.interested ? "تمت إضافة الاهتمام" : "تمت إزالة الاهتمام",
    });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر تحديث الاهتمام"), { status: 500 });
  }
}
