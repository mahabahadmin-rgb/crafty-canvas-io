import { NextResponse } from "next/server";
import { z } from "zod";
import { createDashboardAdminNotification, listDashboardAdminNotifications, updateDashboardAdminNotification } from "@/lib/supabase/mahabah";
import { adminAccessError, getMahabahAuthContext } from "@/lib/supabase/auth";
import { routeErrorBody } from "@/lib/api/route-errors";

const createSchema = z.object({
  target: z.enum(["individual", "business", "admin", "all"]),
  title: z.string().trim().min(3).max(140),
  body: z.string().trim().min(5).max(800),
  category: z.string().trim().min(2).max(60).optional(),
  actionUrl: z.string().trim().max(220).optional(),
});

const updateSchema = z.object({
  notificationId: z.string().trim().min(1),
  read: z.boolean(),
});

function adminErrorResponse(error: string) {
  return NextResponse.json({ error: error === "auth_required" ? "يجب تسجيل الدخول كمدير نظام" : "لا يملك الحساب صلاحية إدارة الإشعارات" }, { status: error === "auth_required" ? 401 : 403 });
}

export async function GET(request: Request) {
  const actor = await getMahabahAuthContext(request);
  const accessError = adminAccessError(actor);
  if (accessError) return adminErrorResponse(accessError);
  const result = await listDashboardAdminNotifications();
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const result = createSchema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "بيانات الإشعار غير مكتملة", issues: result.error.flatten() }, { status: 400 });
  }

  try {
    const actor = await getMahabahAuthContext(request);
    const accessError = adminAccessError(actor);
    if (accessError) return adminErrorResponse(accessError);
    const action = await createDashboardAdminNotification({ ...result.data, actor });
    if (!action.persisted && action.message === "admin_notification_not_created") {
      return NextResponse.json({ ...action, error: "تعذر إنشاء سجلات الإشعار في قاعدة البيانات" }, { status: 502 });
    }
    if (!action.persisted) {
      return NextResponse.json({ ...action, error: "اتصال Supabase غير مكتمل، لا يمكن إرسال الإشعار حالياً" }, { status: 503 });
    }
    return NextResponse.json({ ...action, message: "تم إرسال الإشعار" });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر إرسال الإشعار"), { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const result = updateSchema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "بيانات تحديث الإشعار غير مكتملة", issues: result.error.flatten() }, { status: 400 });
  }

  try {
    const actor = await getMahabahAuthContext(request);
    const accessError = adminAccessError(actor);
    if (accessError) return adminErrorResponse(accessError);
    const action = await updateDashboardAdminNotification({ ...result.data, actor });
    if (!action.persisted && action.message === "invalid_notification_id") {
      return NextResponse.json({ ...action, error: "معرف الإشعار غير صحيح" }, { status: 400 });
    }
    if (!action.persisted && action.message === "notification_not_found") {
      return NextResponse.json({ ...action, error: "لم يتم العثور على الإشعار" }, { status: 404 });
    }
    if (!action.persisted) {
      return NextResponse.json({ ...action, error: "اتصال Supabase غير مكتمل، لا يمكن تحديث الإشعار حالياً" }, { status: 503 });
    }
    return NextResponse.json({ ...action, message: "تم تحديث الإشعار" });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر تحديث الإشعار"), { status: 500 });
  }
}
