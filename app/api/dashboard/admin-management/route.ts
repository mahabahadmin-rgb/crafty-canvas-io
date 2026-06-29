import { NextResponse } from "next/server";
import { z } from "zod";
import { saveDashboardAdminManagementAction } from "@/lib/supabase/mahabah";
import { adminAccessError, getMahabahAuthContext } from "@/lib/supabase/auth";
import { routeErrorBody } from "@/lib/api/route-errors";

const payloadValueSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
const adminActionStatusSchema = z.enum([
  "pending",
  "submitted",
  "approved",
  "rejected",
  "published",
  "draft",
  "review",
  "archived",
  "due",
  "paid",
  "overdue",
  "cancelled",
  "succeeded",
  "failed",
  "refunded",
  "active",
  "expired",
]);

const schema = z.object({
  action: z.enum([
    "service_catalog_save",
    "invoice_status",
    "payment_status",
    "subscription_status",
    "provider_status",
    "provider_save",
    "content_status",
    "content_save",
    "content_comment_status",
    "admin_role_save",
    "admin_user_save",
    "admin_security_action",
    "settings_save",
  ]),
  entityId: z.string().optional(),
  slug: z.string().optional(),
  title: z.string().optional(),
  status: adminActionStatusSchema.optional(),
  payload: z.record(z.string(), payloadValueSchema).optional(),
});

const notFoundMessages: Record<string, string> = {
  provider_not_found: "لم يتم العثور على مزود الخدمة",
  invoice_not_found: "لم يتم العثور على الفاتورة",
  payment_not_found: "لم يتم العثور على عملية الدفع",
  subscription_not_found: "لم يتم العثور على الاشتراك",
  content_not_found: "لم يتم العثور على المحتوى",
  content_comment_not_found: "لم يتم العثور على تعليق المحتوى",
  admin_profile_not_found: "لم يتم العثور على مدير النظام",
};

const badRequestMessages: Record<string, string> = {
  provider_status_invalid: "حالة مزود الخدمة غير صحيحة",
  invoice_status_invalid: "حالة الفاتورة غير صحيحة",
  payment_status_invalid: "حالة عملية الدفع غير صحيحة",
  subscription_status_invalid: "حالة الاشتراك غير صحيحة",
  content_status_invalid: "حالة المحتوى غير صحيحة",
  content_kind_invalid: "نوع المحتوى غير صحيح",
  content_comment_status_invalid: "حالة تعليق المحتوى غير صحيحة",
  admin_profile_email_invalid: "صيغة بريد مدير النظام غير صحيحة",
  admin_security_action_invalid: "إجراء أمان مدير النظام غير صحيح",
  admin_profile_email_missing: "لا يوجد بريد إلكتروني لهذا المدير لإرسال رابط إعادة التعيين",
  settings_key_invalid: "مفتاح الإعداد غير صحيح",
};

const notSavedMessages: Record<string, string> = {
  service_catalog_save_not_saved: "تعذر حفظ الخدمة العقارية في قاعدة البيانات",
  invoice_status_not_saved: "تعذر تحديث حالة الفاتورة في قاعدة البيانات",
  payment_status_not_saved: "تعذر تحديث حالة عملية الدفع في قاعدة البيانات",
  subscription_status_not_saved: "تعذر تحديث حالة الاشتراك في قاعدة البيانات",
  provider_status_not_saved: "تعذر تحديث حالة مزود الخدمة في قاعدة البيانات",
  provider_save_not_saved: "تعذر حفظ مزود الخدمة في قاعدة البيانات",
  content_status_not_saved: "تعذر تحديث حالة المحتوى في قاعدة البيانات",
  content_save_not_saved: "تعذر حفظ المحتوى في قاعدة البيانات",
  content_comment_status_not_saved: "تعذر تحديث حالة تعليق المحتوى في قاعدة البيانات",
  admin_role_save_not_saved: "تعذر حفظ الدور الوظيفي في قاعدة البيانات",
  admin_user_save_not_saved: "تعذر حفظ مدير النظام في قاعدة البيانات",
  admin_security_action_not_saved: "تعذر حفظ إجراء أمان مدير النظام في قاعدة البيانات",
};

export async function POST(request: Request) {
  const result = schema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "بيانات إجراء الإدارة غير مكتملة", issues: result.error.flatten() }, { status: 400 });
  }

  try {
    const actor = await getMahabahAuthContext(request);
    const accessError = adminAccessError(actor);
    if (accessError) {
      return NextResponse.json({ error: accessError === "auth_required" ? "يجب تسجيل الدخول كمدير نظام" : "لا يملك الحساب صلاحية إدارة النظام" }, { status: accessError === "auth_required" ? 401 : 403 });
    }
    const action = await saveDashboardAdminManagementAction({ ...result.data, actor });
    if (!action.persisted && action.message) {
      const badRequest = badRequestMessages[action.message];
      if (badRequest) return NextResponse.json({ ...action, error: badRequest }, { status: 400 });
      const notFound = notFoundMessages[action.message];
      if (notFound) return NextResponse.json({ ...action, error: notFound }, { status: 404 });
      const notSaved = notSavedMessages[action.message];
      if (notSaved) return NextResponse.json({ ...action, error: notSaved }, { status: 502 });
    }
    if (!action.persisted) {
      return NextResponse.json({ ...action, error: "اتصال Supabase غير مكتمل، لا يمكن حفظ إجراء الإدارة حالياً" }, { status: 503 });
    }
    return NextResponse.json(action);
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر حفظ إجراء الإدارة"), { status: 500 });
  }
}
