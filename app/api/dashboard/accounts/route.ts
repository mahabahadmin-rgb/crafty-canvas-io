import { NextResponse } from "next/server";
import { z } from "zod";
import { listDashboardAdminAccounts, updateDashboardAdminAccountStatus } from "@/lib/supabase/mahabah";
import { adminAccessError, getMahabahAuthContext } from "@/lib/supabase/auth";
import { routeErrorBody } from "@/lib/api/route-errors";

const updateSchema = z.object({
  accountId: z.string().min(1),
  kind: z.enum(["individual", "business", "admin"]),
  status: z.enum(["pending", "verified", "suspended"]),
  note: z.string().optional(),
});

function adminErrorResponse(error: string) {
  return NextResponse.json({ error: error === "auth_required" ? "يجب تسجيل الدخول كمدير نظام" : "لا يملك الحساب صلاحية إدارة لوحة الإدارة" }, { status: error === "auth_required" ? 401 : 403 });
}

export async function GET(request: Request) {
  const accessError = adminAccessError(await getMahabahAuthContext(request));
  if (accessError) return adminErrorResponse(accessError);
  const result = await listDashboardAdminAccounts();
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const result = updateSchema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "بيانات الحساب غير مكتملة", issues: result.error.flatten() }, { status: 400 });
  }

  try {
    const actor = await getMahabahAuthContext(request);
    const accessError = adminAccessError(actor);
    if (accessError) return adminErrorResponse(accessError);
    const action = await updateDashboardAdminAccountStatus({ ...result.data, actor });
    if (!action.persisted && action.message === "account_not_found") {
      return NextResponse.json({ ...action, error: "لم يتم العثور على الحساب" }, { status: 404 });
    }
    if (!action.persisted) {
      return NextResponse.json({ ...action, error: "اتصال Supabase غير مكتمل، لا يمكن تحديث حالة الحساب حالياً" }, { status: 503 });
    }
    return NextResponse.json({
      ...action,
      message: action.status === "verified" ? "تم اعتماد الحساب" : action.status === "suspended" ? "تم إيقاف الحساب" : "تم تحويل الحساب للمراجعة",
    });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر تحديث حالة الحساب"), { status: 500 });
  }
}
