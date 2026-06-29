import { NextResponse } from "next/server";
import { z } from "zod";
import { archiveDashboardAdminConversation, listDashboardAdminConversations, listDashboardAdminMessages, sendDashboardAdminMessage } from "@/lib/supabase/mahabah";
import { adminAccessError, getMahabahAuthContext } from "@/lib/supabase/auth";
import { routeErrorBody } from "@/lib/api/route-errors";

const messageSchema = z.object({
  conversationId: z.string().trim().min(1),
  body: z.string().trim().min(2).max(3000),
});

const archiveSchema = z.object({
  conversationId: z.string().trim().min(1),
});

function adminErrorResponse(error: string) {
  return NextResponse.json({ error: error === "auth_required" ? "يجب تسجيل الدخول كمدير نظام" : "لا يملك الحساب صلاحية إدارة الرسائل" }, { status: error === "auth_required" ? 401 : 403 });
}

export async function GET(request: Request) {
  const actor = await getMahabahAuthContext(request);
  const accessError = adminAccessError(actor);
  if (accessError) return adminErrorResponse(accessError);

  const url = new URL(request.url);
  const conversationId = url.searchParams.get("conversationId") ?? url.searchParams.get("conversation") ?? undefined;
  const conversations = await listDashboardAdminConversations();
  const activeConversationId = conversationId ?? conversations.data[0]?.id;
  const messages = await listDashboardAdminMessages(activeConversationId, actor);
  return NextResponse.json({ conversations, messages });
}

export async function POST(request: Request) {
  const result = messageSchema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "نص الرسالة ورقم المحادثة مطلوبان", issues: result.error.flatten() }, { status: 400 });
  }

  try {
    const actor = await getMahabahAuthContext(request);
    const accessError = adminAccessError(actor);
    if (accessError) return adminErrorResponse(accessError);
    const action = await sendDashboardAdminMessage({ ...result.data, actor });
    if (!action.persisted && action.message === "message_body_invalid") {
      return NextResponse.json({ ...action, error: "نص الرد غير صحيح" }, { status: 400 });
    }
    if (!action.persisted && (action.message === "conversation_id_required" || action.message === "invalid_conversation_id")) {
      return NextResponse.json({ ...action, error: "رقم المحادثة غير صالح" }, { status: 400 });
    }
    if (!action.persisted && action.message === "conversation_not_found") {
      return NextResponse.json({ ...action, error: "لم يتم العثور على المحادثة" }, { status: 404 });
    }
    if (!action.persisted && action.message === "message_not_created") {
      return NextResponse.json({ ...action, error: "تعذر إنشاء سجل الرد" }, { status: 502 });
    }
    if (!action.persisted) {
      return NextResponse.json({ ...action, error: "اتصال Supabase غير مكتمل، لا يمكن إرسال الرد حالياً" }, { status: 503 });
    }
    return NextResponse.json({ ...action, message: "تم إرسال الرد" });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر إرسال الرد"), { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const result = archiveSchema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "رقم المحادثة مطلوب", issues: result.error.flatten() }, { status: 400 });
  }

  try {
    const actor = await getMahabahAuthContext(request);
    const accessError = adminAccessError(actor);
    if (accessError) return adminErrorResponse(accessError);
    const action = await archiveDashboardAdminConversation({ ...result.data, actor });
    if (!action.persisted && (action.message === "conversation_id_required" || action.message === "invalid_conversation_id")) {
      return NextResponse.json({ ...action, error: "رقم المحادثة غير صالح" }, { status: 400 });
    }
    if (!action.persisted && action.message === "conversation_not_found") {
      return NextResponse.json({ ...action, error: "لم يتم العثور على المحادثة" }, { status: 404 });
    }
    if (!action.persisted) {
      return NextResponse.json({ ...action, error: "اتصال Supabase غير مكتمل، لا يمكن أرشفة المحادثة حالياً" }, { status: 503 });
    }
    return NextResponse.json({ ...action, message: "تمت أرشفة المحادثة" });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر أرشفة المحادثة"), { status: 500 });
  }
}
