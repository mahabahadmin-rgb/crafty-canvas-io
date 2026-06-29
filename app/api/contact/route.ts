import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupportTicket } from "@/lib/supabase/mahabah";
import { routeErrorBody } from "@/lib/api/route-errors";

const schema = z.object({ fullName: z.string().min(2), mobile: z.string().min(8), email: z.string().email(), description: z.string().min(10) }).passthrough();

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "تعذر قراءة بيانات التواصل" }, { status: 400 });
  const result = schema.safeParse(Object.fromEntries(form.entries()));
  if (!result.success) return NextResponse.json({ error: "بيانات التواصل غير مكتملة", issues: result.error.flatten() }, { status: 400 });

  try {
    const ticket = await createSupportTicket(result.data);
    if (!ticket.persisted && ticket.message === "support_ticket_not_created") {
      return NextResponse.json({ ...ticket, error: "تعذر إنشاء تذكرة التواصل" }, { status: 502 });
    }
    if (!ticket.persisted) {
      return NextResponse.json({ ...ticket, error: "اتصال Supabase غير مكتمل، لا يمكن حفظ رسالة التواصل حالياً" }, { status: 503 });
    }
    return NextResponse.json({ ...ticket, message: "تم إرسال الرسالة بنجاح" });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر حفظ رسالة التواصل"), { status: 500 });
  }
}
