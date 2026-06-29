import { NextResponse } from "next/server";
import { z } from "zod";
import { updateDashboardSubscriptionPlan } from "@/lib/supabase/mahabah";
import { dashboardScopeAccessError, getMahabahAuthContext } from "@/lib/supabase/auth";
import { localizedNumber } from "@/lib/validation/localized-number";
import { routeErrorBody } from "@/lib/api/route-errors";

const subscriptionSchema = z.object({
  scope: z.enum(["individual", "business"]).default("individual"),
  planName: z.string().trim().min(2).max(80),
  amount: z.preprocess(localizedNumber, z.number().min(0).max(1_000_000)).default(0),
});

export async function POST(request: Request) {
  const result = subscriptionSchema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "بيانات الاشتراك غير مكتملة", issues: result.error.flatten() }, { status: 400 });
  }

  try {
    const actor = await getMahabahAuthContext(request);
    const accessError = dashboardScopeAccessError(actor, result.data.scope);
    if (accessError) {
      return NextResponse.json({ error: accessError === "auth_required" ? "يجب تسجيل الدخول قبل تنفيذ الإجراء" : "لا يملك الحساب صلاحية تنفيذ هذا الإجراء" }, { status: accessError === "auth_required" ? 401 : 403 });
    }
    const action = await updateDashboardSubscriptionPlan({ ...result.data, actor });
    if (!action.persisted && action.message === "subscription_owner_missing") {
      return NextResponse.json({ ...action, error: "تعذر تحديد مالك الاشتراك" }, { status: 400 });
    }
    if (!action.persisted && action.message === "subscription_plan_invalid") {
      return NextResponse.json({ ...action, error: "بيانات الباقة غير صحيحة" }, { status: 400 });
    }
    if (!action.persisted && action.message === "subscription_not_created") {
      return NextResponse.json({ ...action, error: "تعذر إنشاء سجل الاشتراك" }, { status: 502 });
    }
    if (!action.persisted) {
      return NextResponse.json({ ...action, error: "اتصال Supabase غير مكتمل، لا يمكن تحديث الاشتراك حالياً" }, { status: 503 });
    }
    return NextResponse.json({ ...action, message: "تم تحديث الاشتراك" });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر تحديث الاشتراك"), { status: 500 });
  }
}
