import { NextResponse } from "next/server";
import { z } from "zod";
import { createDashboardSupportTicket, getDashboardSupportTicket, listDashboardSupportTickets, updateDashboardSupportTicket } from "@/lib/supabase/mahabah";
import { dashboardScopeAccessError, getMahabahAuthContext } from "@/lib/supabase/auth";
import { routeErrorBody } from "@/lib/api/route-errors";

const ticketSchema = z.object({
  scope: z.enum(["individual", "business"]).optional(),
  category: z.string().trim().min(2),
  title: z.string().trim().min(4),
  description: z.string().trim().min(10),
  priority: z.string().optional(),
  clientReference: z.string().trim().min(1).max(160).optional(),
});

const updateTicketSchema = z.object({
  scope: z.enum(["individual", "business"]).optional(),
  ticketId: z.string().trim().min(1),
  status: z.enum(["submitted", "in_progress", "completed", "cancelled"]).optional(),
  message: z.string().trim().min(2).max(1200).optional(),
}).refine((value) => Boolean(value.status || value.message), { message: "status_or_message_required" });

function dashboardScope(request: Request) {
  const value = new URL(request.url).searchParams.get("scope");
  return value === "business" ? "business" : "individual";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ticketId = url.searchParams.get("ticketId") ?? undefined;
  const scope = dashboardScope(request);
  const actor = await getMahabahAuthContext(request);
  const accessError = dashboardScopeAccessError(actor, scope);
  if (accessError) {
    return NextResponse.json({ error: accessError === "auth_required" ? "يجب تسجيل الدخول قبل عرض التذاكر" : "لا يملك الحساب صلاحية عرض هذه التذاكر" }, { status: accessError === "auth_required" ? 401 : 403 });
  }
  const result = ticketId
    ? await getDashboardSupportTicket(scope, ticketId, actor)
    : await listDashboardSupportTickets(scope, actor);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const result = ticketSchema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "بيانات التذكرة غير مكتملة", issues: result.error.flatten() }, { status: 400 });
  }

  try {
    const actor = await getMahabahAuthContext(request);
    const scope = result.data.scope ?? "individual";
    const accessError = dashboardScopeAccessError(actor, scope);
    if (accessError) {
      return NextResponse.json({ error: accessError === "auth_required" ? "يجب تسجيل الدخول قبل تنفيذ الإجراء" : "لا يملك الحساب صلاحية تنفيذ هذا الإجراء" }, { status: accessError === "auth_required" ? 401 : 403 });
    }
    const action = await createDashboardSupportTicket({ ...result.data, actor });
    if (!action.persisted && action.message === "support_payload_invalid") {
      return NextResponse.json({ ...action, error: "بيانات التذكرة غير صحيحة" }, { status: 400 });
    }
    if (!action.persisted && action.message === "support_priority_invalid") {
      return NextResponse.json({ ...action, error: "أولوية التذكرة غير صحيحة" }, { status: 400 });
    }
    if (!action.persisted && action.message === "support_ticket_not_created") {
      return NextResponse.json({ ...action, error: "تعذر إنشاء سجل التذكرة" }, { status: 502 });
    }
    if (!action.persisted) {
      return NextResponse.json({ ...action, error: "اتصال Supabase غير مكتمل، لا يمكن إرسال التذكرة حالياً" }, { status: 503 });
    }
    return NextResponse.json({ ...action, message: "تم إرسال التذكرة" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر إرسال التذكرة"), { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const result = updateTicketSchema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "بيانات تحديث التذكرة غير مكتملة", issues: result.error.flatten() }, { status: 400 });
  }

  try {
    const actor = await getMahabahAuthContext(request);
    const scope = result.data.scope ?? "individual";
    const accessError = dashboardScopeAccessError(actor, scope);
    if (accessError) {
      return NextResponse.json({ error: accessError === "auth_required" ? "يجب تسجيل الدخول قبل تنفيذ الإجراء" : "لا يملك الحساب صلاحية تنفيذ هذا الإجراء" }, { status: accessError === "auth_required" ? 401 : 403 });
    }
    const action = await updateDashboardSupportTicket({ ...result.data, actor });
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
