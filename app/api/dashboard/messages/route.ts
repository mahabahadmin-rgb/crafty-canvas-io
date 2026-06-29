import { NextResponse } from "next/server";
import { z } from "zod";
import { archiveDashboardConversation, listDashboardConversations, listDashboardMessages, sendDashboardMessage } from "@/lib/supabase/mahabah";
import { dashboardScopeAccessError, getMahabahAuthContext } from "@/lib/supabase/auth";
import { routeErrorBody } from "@/lib/api/route-errors";

const messageSchema = z.object({
  scope: z.enum(["individual", "business"]).optional(),
  body: z.string().trim().min(2).max(3000),
  conversationId: z.string().optional(),
  createNew: z.boolean().optional(),
  subject: z.string().trim().min(2).max(140).optional(),
});

const conversationArchiveSchema = z.object({
  scope: z.enum(["individual", "business"]).optional(),
  conversationId: z.string().trim().min(1),
});

function dashboardScope(request: Request) {
  const value = new URL(request.url).searchParams.get("scope");
  return value === "business" ? "business" : "individual";
}

export async function GET(request: Request) {
  const scope = dashboardScope(request);
  const url = new URL(request.url);
  const actor = await getMahabahAuthContext(request);
  const accessError = dashboardScopeAccessError(actor, scope);
  if (accessError) {
    return NextResponse.json({ error: accessError === "auth_required" ? "يجب تسجيل الدخول قبل عرض الرسائل" : "لا يملك الحساب صلاحية عرض هذه الرسائل" }, { status: accessError === "auth_required" ? 401 : 403 });
  }
  const conversations = await listDashboardConversations(scope, actor);
  const activeConversationId = url.searchParams.get("conversationId") ?? url.searchParams.get("conversation") ?? conversations.data[0]?.id;
  const messages = await listDashboardMessages(scope, activeConversationId, actor);
  return NextResponse.json({ conversations, messages });
}

export async function POST(request: Request) {
  const result = messageSchema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "نص الرسالة مطلوب", issues: result.error.flatten() }, { status: 400 });
  }

  try {
    const actor = await getMahabahAuthContext(request);
    const scope = result.data.scope ?? "individual";
    const accessError = dashboardScopeAccessError(actor, scope);
    if (accessError) {
      return NextResponse.json({ error: accessError === "auth_required" ? "يجب تسجيل الدخول قبل تنفيذ الإجراء" : "لا يملك الحساب صلاحية تنفيذ هذا الإجراء" }, { status: accessError === "auth_required" ? 401 : 403 });
    }
    const action = await sendDashboardMessage({ ...result.data, actor });
    if (!action.persisted && action.message === "message_body_invalid") {
      return NextResponse.json({ ...action, error: "نص الرسالة غير صحيح" }, { status: 400 });
    }
    if (!action.persisted && action.message === "conversation_not_found") {
      return NextResponse.json({ ...action, error: "لم يتم العثور على المحادثة" }, { status: 404 });
    }
    if (!action.persisted && action.message === "message_not_created") {
      return NextResponse.json({ ...action, error: "تعذر إنشاء سجل الرسالة" }, { status: 502 });
    }
    if (!action.persisted) {
      return NextResponse.json({ ...action, error: "اتصال Supabase غير مكتمل، لا يمكن إرسال الرسالة حالياً" }, { status: 503 });
    }
    return NextResponse.json({ ...action, message: "تم إرسال الرسالة" });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر إرسال الرسالة"), { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const result = conversationArchiveSchema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "رقم المحادثة مطلوب", issues: result.error.flatten() }, { status: 400 });
  }

  try {
    const actor = await getMahabahAuthContext(request);
    const scope = result.data.scope ?? "individual";
    const accessError = dashboardScopeAccessError(actor, scope);
    if (accessError) {
      return NextResponse.json({ error: accessError === "auth_required" ? "يجب تسجيل الدخول قبل تنفيذ الإجراء" : "لا يملك الحساب صلاحية تنفيذ هذا الإجراء" }, { status: accessError === "auth_required" ? 401 : 403 });
    }
    const action = await archiveDashboardConversation({ ...result.data, actor });
    if (!action.persisted && (action.message === "conversation_id_required" || action.message === "invalid_conversation_id")) {
      return NextResponse.json({ ...action, error: "رقم المحادثة غير صالح" }, { status: 400 });
    }
    if (!action.persisted && action.message === "conversation_not_found") {
      return NextResponse.json({ ...action, error: "لم يتم العثور على المحادثة" }, { status: 404 });
    }
    if (!action.persisted) {
      return NextResponse.json({ ...action, error: "اتصال Supabase غير مكتمل، لا يمكن حذف المحادثة حالياً" }, { status: 503 });
    }
    return NextResponse.json({ ...action, message: "تم حذف المحادثة" });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر حذف المحادثة"), { status: 500 });
  }
}
