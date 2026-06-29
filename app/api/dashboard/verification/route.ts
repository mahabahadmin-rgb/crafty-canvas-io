import { NextResponse } from "next/server";
import { z } from "zod";
import { createDashboardVerificationRequest } from "@/lib/supabase/mahabah";
import { dashboardScopeAccessError, getMahabahAuthContext } from "@/lib/supabase/auth";
import { routeErrorBody } from "@/lib/api/route-errors";

const payloadValue = z.union([z.string(), z.number(), z.boolean(), z.null()]);

const schema = z.object({
  scope: z.enum(["individual", "business"]),
  mode: z.enum(["draft", "submitted"]).optional(),
  displayName: z.string().trim().min(1).max(140).optional(),
  note: z.string().trim().min(1).max(500).optional(),
  payload: z.record(payloadValue).optional(),
});

function hasPayloadText(payload: Record<string, z.infer<typeof payloadValue>>, key: string) {
  const value = payload[key];
  return typeof value === "string" && value.trim().length > 0;
}

function verificationValidationError(data: z.infer<typeof schema>) {
  if (data.mode === "draft") return null;

  const payload = data.payload ?? {};
  const missing: string[] = [];
  for (const field of ["identityType", "identityNumber", "displayName", "acceptedTerms", "formReference"]) {
    if (field === "displayName") {
      if (!data.displayName?.trim() && !hasPayloadText(payload, field)) missing.push(field);
      continue;
    }
    if (field === "acceptedTerms") {
      if (payload.acceptedTerms !== true) missing.push(field);
      continue;
    }
    if (!hasPayloadText(payload, field)) missing.push(field);
  }

  if (data.scope === "business" && !hasPayloadText(payload, "commercialRegistration")) {
    missing.push("commercialRegistration");
  }

  return missing.length ? missing : null;
}

export async function POST(request: Request) {
  const result = schema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "بيانات طلب التوثيق غير مكتملة", issues: result.error.flatten() }, { status: 400 });
  }

  const missing = verificationValidationError(result.data);
  if (missing) {
    return NextResponse.json({ error: "بيانات طلب التوثيق غير مكتملة", missing }, { status: 400 });
  }

  try {
    const actor = await getMahabahAuthContext(request);
    const accessError = dashboardScopeAccessError(actor, result.data.scope);
    if (accessError) {
      return NextResponse.json({ error: accessError === "auth_required" ? "يجب تسجيل الدخول قبل تنفيذ الإجراء" : "لا يملك الحساب صلاحية تنفيذ هذا الإجراء" }, { status: accessError === "auth_required" ? 401 : 403 });
    }
    const action = await createDashboardVerificationRequest({ ...result.data, actor });
    if (!action.persisted && action.message === "verification_request_not_created") {
      return NextResponse.json({ ...action, error: "تعذر إنشاء طلب التوثيق في قاعدة البيانات" }, { status: 502 });
    }
    if (!action.persisted) {
      return NextResponse.json({ ...action, error: "اتصال Supabase غير مكتمل، لا يمكن إرسال طلب التوثيق حالياً" }, { status: 503 });
    }
    return NextResponse.json({
      ...action,
      message: "تم إرسال طلب التوثيق إلى فريق المراجعة",
    });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر إرسال طلب التوثيق"), { status: 500 });
  }
}
