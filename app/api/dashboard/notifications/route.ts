import { NextResponse } from "next/server";
import { z } from "zod";
import { listDashboardNotifications, markDashboardNotificationsRead } from "@/lib/supabase/mahabah";
import { dashboardScopeAccessError, getMahabahAuthContext } from "@/lib/supabase/auth";
import { routeErrorBody } from "@/lib/api/route-errors";

const readSchema = z.object({
  scope: z.enum(["individual", "business"]).optional(),
  notificationId: z.string().optional(),
});

function dashboardScope(request: Request) {
  const value = new URL(request.url).searchParams.get("scope");
  return value === "business" ? "business" : "individual";
}

export async function GET(request: Request) {
  const scope = dashboardScope(request);
  const actor = await getMahabahAuthContext(request);
  const accessError = dashboardScopeAccessError(actor, scope);
  if (accessError) {
    return NextResponse.json({ error: accessError === "auth_required" ? "يجب تسجيل الدخول قبل عرض الإشعارات" : "لا يملك الحساب صلاحية عرض هذه الإشعارات" }, { status: accessError === "auth_required" ? 401 : 403 });
  }
  const result = await listDashboardNotifications(scope, actor);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const result = readSchema.safeParse(await request.json().catch(() => ({})));
  if (!result.success) {
    return NextResponse.json({ error: "بيانات الإشعارات غير مكتملة", issues: result.error.flatten() }, { status: 400 });
  }

  try {
    const actor = await getMahabahAuthContext(request);
    const scope = result.data.scope ?? "individual";
    const accessError = dashboardScopeAccessError(actor, scope);
    if (accessError) {
      return NextResponse.json({ error: accessError === "auth_required" ? "يجب تسجيل الدخول قبل تنفيذ الإجراء" : "لا يملك الحساب صلاحية تنفيذ هذا الإجراء" }, { status: accessError === "auth_required" ? 401 : 403 });
    }
    const action = await markDashboardNotificationsRead({ ...result.data, actor });
    if (!action.persisted && action.message === "notification_not_found") {
      return NextResponse.json({ ...action, error: "لم يتم العثور على الإشعار" }, { status: 404 });
    }
    if (!action.persisted) {
      return NextResponse.json({ ...action, error: "اتصال Supabase غير مكتمل، لا يمكن تحديث الإشعارات حالياً" }, { status: 503 });
    }
    return NextResponse.json({ ...action, message: "تم تحديث حالة الإشعارات" });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر تحديث الإشعارات"), { status: 500 });
  }
}
