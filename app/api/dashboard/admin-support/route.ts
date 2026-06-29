import { NextResponse } from "next/server";
import { z } from "zod";
import { getDashboardAdminSupportTicket, listDashboardAdminSupportTickets, updateDashboardAdminSupportTicket } from "@/lib/supabase/mahabah";
import { adminAccessError, getMahabahAuthContext } from "@/lib/supabase/auth";
import { routeErrorBody } from "@/lib/api/route-errors";

const updateSchema = z.object({
  ticketId: z.string().trim().min(1),
  status: z.enum(["submitted", "in_progress", "completed", "cancelled"]).optional(),
  message: z.string().trim().min(2).max(1200).optional(),
  internal: z.boolean().optional(),
}).refine((value) => Boolean(value.status || value.message), { message: "status_or_message_required" });

function adminErrorResponse(error: string) {
  return NextResponse.json({ error: error === "auth_required" ? "يجب تسجيل الدخول كمدير نظام" : "لا يملك الحساب صلاحية إدارة الدعم الفني" }, { status: error === "auth_required" ? 401 : 403 });
}

export async function GET(request: Request) {
  const actor = await getMahabahAuthContext(request);
  const accessError = adminAccessError(actor);
  if (accessError) return adminErrorResponse(accessError);
  const ticketId = new URL(request.url).searchParams.get("ticketId") ?? undefined;
  const result = ticketId ? await getDashboardAdminSupportTicket(ticketId, actor) : await listDashboardAdminSupportTickets();
  return NextResponse.json(result);
}

export async function PATCH(request: Request) {
  const result = updateSchema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "بيانات تحديث التذكرة غير مكتملة", issues: result.error.flatten() }, { status: 400 });
  }

  try {
    const actor = await getMahabahAuthContext(request);
    const accessError = adminAccessError(actor);
    if (accessError) return adminErrorResponse(accessError);
    const action = await updateDashboardAdminSupportTicket({ ...result.data, actor });
    if (!action.persisted && action.message === "support_status_invalid") {
      return NextResponse.json({ ...action, error: "حالة التذكرة غير صحيحة" }, { status: 400 });
    }
    if (!action.persisted && action.message === "support_message_invalid") {
      return NextResponse.json({ ...action, error: "نص الرد غير صحيح" }, { status: 400 });
    }
    if (!action.persisted && action.message === "ticket_not_found") {
      return NextResponse.json({ ...action, error: "لم يتم العثور على التذكرة" }, { status: 404 });
    }
    if (!action.persisted) {
      return NextResponse.json({ ...action, error: "اتصال Supabase غير مكتمل، لا يمكن تحديث التذكرة حالياً" }, { status: 503 });
    }
    return NextResponse.json({ ...action, message: "تم تحديث التذكرة" });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر تحديث التذكرة"), { status: 500 });
  }
}
