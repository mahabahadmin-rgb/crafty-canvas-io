import { NextResponse } from "next/server";
import { z } from "zod";
import { createDashboardEntityRequest } from "@/lib/supabase/mahabah";
import { dashboardScopeAccessError, getMahabahAuthContext } from "@/lib/supabase/auth";
import { localizedNumber } from "@/lib/validation/localized-number";
import { routeErrorBody } from "@/lib/api/route-errors";

const payloadValue = z.union([z.string(), z.number(), z.boolean(), z.null()]);

const schema = z.object({
  kind: z.enum(["asset", "contribution", "service_request"]),
  scope: z.enum(["individual", "business"]),
  mode: z.enum(["draft", "submitted"]).optional(),
  title: z.string().trim().min(1).max(180).optional(),
  description: z.string().trim().min(1).max(1200).optional(),
  city: z.string().trim().min(1).max(80).optional(),
  amount: z.preprocess(localizedNumber, z.number().finite().nonnegative()).optional(),
  areaSqm: z.preprocess(localizedNumber, z.number().finite().positive()).optional(),
  assetType: z.string().trim().min(1).max(120).optional(),
  payload: z.record(payloadValue).optional(),
});

function hasText(value: string | undefined) {
  return Boolean(value && value.trim().length > 0);
}

function requestValidationError(data: z.infer<typeof schema>) {
  const missing: string[] = [];
  const payload = data.payload ?? {};
  const payloadText = (key: string) => {
    const value = payload[key];
    return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
  };

  if (!hasText(data.title)) missing.push("title");
  if (data.mode === "draft") return missing.length ? missing : null;

  if (!hasText(data.description)) missing.push("description");
  if (!hasText(data.city) && !payloadText("city")) missing.push("city");

  if (data.kind === "asset") {
    if (!data.areaSqm || data.areaSqm <= 0) missing.push("areaSqm");
    if (!hasText(data.assetType) && !payloadText("assetType")) missing.push("assetType");
    if (!payloadText("deedNumber")) missing.push("deedNumber");
  }

  if (data.kind === "contribution") {
    if (!data.amount || data.amount <= 0) missing.push("amount");
    if (!payloadText("licenseNumber")) missing.push("licenseNumber");
    if (!payloadText("offeringUrl")) missing.push("offeringUrl");
  }

  if (data.kind === "service_request") {
    if (!payloadText("serviceType")) missing.push("serviceType");
    if (!payloadText("mobile")) missing.push("mobile");
    if (!payloadText("email")) missing.push("email");
  }

  return missing.length ? missing : null;
}

export async function POST(request: Request) {
  const result = schema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "بيانات الطلب غير مكتملة", issues: result.error.flatten() }, { status: 400 });
  }

  const missing = requestValidationError(result.data);
  if (missing) {
    return NextResponse.json({ error: "بيانات الطلب غير مكتملة", missing }, { status: 400 });
  }

  try {
    const actor = await getMahabahAuthContext(request);
    const accessError = dashboardScopeAccessError(actor, result.data.scope);
    if (accessError) {
      return NextResponse.json({ error: accessError === "auth_required" ? "يجب تسجيل الدخول قبل تنفيذ الإجراء" : "لا يملك الحساب صلاحية تنفيذ هذا الإجراء" }, { status: accessError === "auth_required" ? 401 : 403 });
    }
    const action = await createDashboardEntityRequest({ ...result.data, actor });
    if (!action.persisted && action.message === "business_account_required") {
      return NextResponse.json({ ...action, error: "إضافة المساهمات العقارية متاحة لحسابات الأعمال فقط" }, { status: 403 });
    }
    if (!action.persisted && ["asset_not_created", "contribution_not_created", "service_request_not_created"].includes(action.message ?? "")) {
      return NextResponse.json({ ...action, error: "تعذر إنشاء سجل الطلب في قاعدة البيانات" }, { status: 502 });
    }
    if (!action.persisted) {
      return NextResponse.json({ ...action, error: "اتصال Supabase غير مكتمل، لا يمكن حفظ الطلب حالياً" }, { status: 503 });
    }
    const actionLabel = action.status === "draft" ? "حفظ المسودة" : "إرسال الطلب";
    return NextResponse.json({
      ...action,
      message: `تم ${actionLabel} بنجاح`,
    });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر حفظ الطلب"), { status: 500 });
  }
}
