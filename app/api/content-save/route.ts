import { NextResponse } from "next/server";
import { z } from "zod";
import { saveContentItem } from "@/lib/supabase/mahabah";
import { getMahabahAuthContext } from "@/lib/supabase/auth";
import { routeErrorBody } from "@/lib/api/route-errors";

const schema = z.object({
  contentSlug: z.string().trim().min(1).max(180),
  contentType: z.enum(["news", "article"]),
  title: z.string().trim().min(1).max(220),
});

export async function POST(request: Request) {
  const result = schema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "بيانات حفظ المحتوى غير مكتملة", issues: result.error.flatten() }, { status: 400 });
  }

  try {
    const actor = await getMahabahAuthContext(request);
    const action = await saveContentItem({ ...result.data, actor });
    if (!action.persisted && action.message === "auth_required") {
      return NextResponse.json({ ...action, error: "يجب تسجيل الدخول قبل حفظ المحتوى" }, { status: 401 });
    }
    if (!action.persisted && action.message === "saved_content_not_created") {
      return NextResponse.json({ ...action, error: "تعذر إنشاء سجل حفظ المحتوى" }, { status: 502 });
    }
    if (!action.persisted) {
      return NextResponse.json({ ...action, error: "اتصال Supabase غير مكتمل، لا يمكن حفظ المحتوى حالياً" }, { status: 503 });
    }
    return NextResponse.json({ ...action, message: "تم حفظ المحتوى في حسابك" });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر حفظ المحتوى"), { status: 500 });
  }
}
