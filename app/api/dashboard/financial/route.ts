import { NextResponse } from "next/server";
import { z } from "zod";
import { listDashboardFinancial } from "@/lib/supabase/mahabah";
import { adminAccessError, dashboardScopeAccessError, getMahabahAuthContext } from "@/lib/supabase/auth";

const querySchema = z.object({
  scope: z.enum(["individual", "business", "admin"]).default("individual"),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const result = querySchema.safeParse({ scope: searchParams.get("scope") ?? "individual" });
  if (!result.success) {
    return NextResponse.json({ error: "نطاق البيانات المالية غير صحيح", issues: result.error.flatten() }, { status: 400 });
  }

  const actor = await getMahabahAuthContext(request);
  if (result.data.scope === "admin") {
    const accessError = adminAccessError(actor);
    if (accessError) {
      return NextResponse.json({ error: accessError === "auth_required" ? "يجب تسجيل الدخول كمدير نظام قبل عرض البيانات المالية" : "لا يملك الحساب صلاحية عرض بيانات الإدارة المالية" }, { status: accessError === "auth_required" ? 401 : 403 });
    }
  } else {
    const accessError = dashboardScopeAccessError(actor, result.data.scope);
    if (accessError) {
      return NextResponse.json({ error: accessError === "auth_required" ? "يجب تسجيل الدخول قبل عرض البيانات المالية" : "لا يملك الحساب صلاحية عرض هذه البيانات المالية" }, { status: accessError === "auth_required" ? 401 : 403 });
    }
  }
  const data = await listDashboardFinancial(result.data.scope, actor);
  return NextResponse.json(data);
}
