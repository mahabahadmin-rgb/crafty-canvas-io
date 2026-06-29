import { NextResponse } from "next/server";
import { z } from "zod";
import { saveDashboardAccountSettings } from "@/lib/supabase/mahabah";
import { dashboardScopeAccessError, getMahabahAuthContext } from "@/lib/supabase/auth";
import { routeErrorBody } from "@/lib/api/route-errors";

const payloadValueSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

const accountSettingsSchema = z.object({
  scope: z.enum(["individual", "business"]),
  kind: z.enum(["profile", "security", "preferences"]),
  payload: z.record(z.string(), payloadValueSchema).optional(),
});

export async function POST(request: Request) {
  const result = accountSettingsSchema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "بيانات إعدادات الحساب غير مكتملة", issues: result.error.flatten() }, { status: 400 });
  }

  try {
    const actor = await getMahabahAuthContext(request);
    const accessError = dashboardScopeAccessError(actor, result.data.scope);
    if (accessError) {
      return NextResponse.json({ error: accessError === "auth_required" ? "يجب تسجيل الدخول قبل تنفيذ الإجراء" : "لا يملك الحساب صلاحية تنفيذ هذا الإجراء" }, { status: accessError === "auth_required" ? 401 : 403 });
    }
    const action = await saveDashboardAccountSettings({ ...result.data, actor });
    if (!action.persisted && action.message === "account_not_found") {
      return NextResponse.json({ ...action, error: "لم يتم العثور على الحساب" }, { status: 404 });
    }
    if (!action.persisted && action.message === "password_fields_incomplete") {
      return NextResponse.json({ ...action, error: "أكمل كلمة المرور الحالية والجديدة وتأكيدها" }, { status: 400 });
    }
    if (!action.persisted && action.message === "password_mismatch") {
      return NextResponse.json({ ...action, error: "كلمة المرور الجديدة وتأكيدها غير متطابقين" }, { status: 400 });
    }
    if (!action.persisted && action.message === "password_too_short") {
      return NextResponse.json({ ...action, error: "كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف" }, { status: 400 });
    }
    if (!action.persisted && action.message === "password_unchanged") {
      return NextResponse.json({ ...action, error: "كلمة المرور الجديدة يجب أن تختلف عن الحالية" }, { status: 400 });
    }
    if (!action.persisted && action.message === "password_current_invalid") {
      return NextResponse.json({ ...action, error: "كلمة المرور الحالية غير صحيحة" }, { status: 400 });
    }
    if (!action.persisted && action.message === "password_email_missing") {
      return NextResponse.json({ ...action, error: "تعذر التحقق من بريد الحساب قبل تحديث كلمة المرور" }, { status: 400 });
    }
    if (!action.persisted && action.message === "profile_email_invalid") {
      return NextResponse.json({ ...action, error: "صيغة البريد الإلكتروني غير صحيحة" }, { status: 400 });
    }
    if (!action.persisted && action.message === "supabase_public_not_configured") {
      return NextResponse.json({ ...action, error: "مفتاح Supabase العام غير مضبوط، لا يمكن التحقق من كلمة المرور الحالية" }, { status: 503 });
    }
    if (!action.persisted) {
      return NextResponse.json({ ...action, error: "اتصال Supabase غير مكتمل، لا يمكن حفظ إعدادات الحساب حالياً" }, { status: 503 });
    }
    return NextResponse.json(action);
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر حفظ إعدادات الحساب"), { status: 500 });
  }
}
