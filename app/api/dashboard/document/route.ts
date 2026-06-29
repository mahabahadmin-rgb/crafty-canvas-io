import { NextResponse } from "next/server";
import { z } from "zod";
import { uploadDashboardDocument } from "@/lib/supabase/mahabah";
import { adminAccessError, dashboardScopeAccessError, getMahabahAuthContext } from "@/lib/supabase/auth";
import { routeErrorBody } from "@/lib/api/route-errors";

const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);

const schema = z.object({
  scope: z.enum(["individual", "business", "admin"]),
  entityType: z.string().trim().min(1).max(80),
  entityId: z.string().trim().min(1).max(160).optional(),
  label: z.string().trim().min(1).max(140).optional(),
});

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "تعذر قراءة بيانات الرفع" }, { status: 400 });

  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "اختر ملفاً للرفع" }, { status: 400 });
  if (file.size <= 0) return NextResponse.json({ error: "الملف فارغ" }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "حجم الملف يتجاوز 10MB" }, { status: 400 });
  if (file.type && !allowedMimeTypes.has(file.type)) return NextResponse.json({ error: "نوع الملف غير مدعوم" }, { status: 400 });

  const payload = schema.safeParse({
    scope: formData.get("scope"),
    entityType: formData.get("entityType"),
    entityId: formData.get("entityId") || undefined,
    label: formData.get("label") || undefined,
  });
  if (!payload.success) {
    return NextResponse.json({ error: "بيانات المستند غير مكتملة", issues: payload.error.flatten() }, { status: 400 });
  }

  try {
    const actor = await getMahabahAuthContext(request);
    if (payload.data.scope === "admin") {
      const accessError = adminAccessError(actor);
      if (accessError) {
        return NextResponse.json({ error: accessError === "auth_required" ? "يجب تسجيل الدخول كمدير نظام قبل رفع المستند" : "لا يملك الحساب صلاحية رفع مستندات الإدارة" }, { status: accessError === "auth_required" ? 401 : 403 });
      }
    } else {
      const accessError = dashboardScopeAccessError(actor, payload.data.scope);
      if (accessError) {
        return NextResponse.json({ error: accessError === "auth_required" ? "يجب تسجيل الدخول قبل رفع المستند" : "لا يملك الحساب صلاحية رفع هذا المستند" }, { status: accessError === "auth_required" ? 401 : 403 });
      }
    }
    const action = await uploadDashboardDocument({ ...payload.data, file, actor });
    if (!action.persisted && action.message === "document_target_forbidden") {
      return NextResponse.json({ ...action, error: "لا يمكن ربط المستند بسجل لا يخص هذا الحساب" }, { status: 403 });
    }
    if (!action.persisted && action.message === "document_not_created") {
      return NextResponse.json({ ...action, error: "تم رفع الملف لكن تعذر إنشاء سجل المستند" }, { status: 502 });
    }
    if (!action.persisted) {
      return NextResponse.json({ ...action, error: "اتصال Supabase غير مكتمل، لا يمكن رفع المستند حالياً" }, { status: 503 });
    }
    return NextResponse.json({
      ...action,
      message: "تم رفع المستند وربطه بالطلب",
    });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر رفع المستند"), { status: 500 });
  }
}
