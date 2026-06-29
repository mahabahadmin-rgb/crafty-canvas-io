import { NextResponse } from "next/server";
import { z } from "zod";
import { reviewDashboardEntity } from "@/lib/supabase/mahabah";
import { adminAccessError, getMahabahAuthContext } from "@/lib/supabase/auth";
import { routeErrorBody } from "@/lib/api/route-errors";

const schema = z.object({
  entityType: z.enum(["asset", "contribution", "service_request", "verification_request"]),
  entityId: z.string().optional(),
  slug: z.string().optional(),
  title: z.string().optional(),
  decision: z.enum(["approved", "needs_changes", "rejected"]),
  note: z.string().optional(),
});

export async function POST(request: Request) {
  const result = schema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "بيانات قرار المراجعة غير مكتملة", issues: result.error.flatten() }, { status: 400 });
  }

  try {
    const actor = await getMahabahAuthContext(request);
    const accessError = adminAccessError(actor);
    if (accessError) {
      return NextResponse.json({ error: accessError === "auth_required" ? "يجب تسجيل الدخول كمدير نظام" : "لا يملك الحساب صلاحية مراجعة الطلبات" }, { status: accessError === "auth_required" ? 401 : 403 });
    }
    const action = await reviewDashboardEntity({ ...result.data, actor });
    if (!action.persisted && action.message === "entity_identifier_missing") {
      return NextResponse.json({ ...action, error: "رقم الطلب أو الرابط مطلوب لحفظ قرار المراجعة" }, { status: 400 });
    }
    if (!action.persisted && action.message === "entity_not_found") {
      return NextResponse.json({ ...action, error: "لم يتم العثور على الطلب المطلوب مراجعته" }, { status: 404 });
    }
    if (!action.persisted) {
      return NextResponse.json({ ...action, error: "اتصال Supabase غير مكتمل، لا يمكن حفظ قرار المراجعة حالياً" }, { status: 503 });
    }
    return NextResponse.json({
      ...action,
      message: action.status === "approved" ? "تم اعتماد الطلب" : action.status === "rejected" ? "تم رفض الطلب" : "تم طلب تعديل البيانات",
    });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر حفظ قرار المراجعة"), { status: 500 });
  }
}
