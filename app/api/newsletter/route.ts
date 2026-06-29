import { NextResponse } from "next/server";
import { z } from "zod";
import { subscribeNewsletter } from "@/lib/supabase/mahabah";
import { routeErrorBody } from "@/lib/api/route-errors";

const schema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const result = schema.safeParse(body);
  if (!result.success) return NextResponse.json({ error: "البريد الإلكتروني غير صحيح" }, { status: 400 });

  try {
    const subscription = await subscribeNewsletter(result.data.email);
    if (!subscription.persisted && subscription.message === "newsletter_not_created") {
      return NextResponse.json({ ...subscription, error: "تعذر إنشاء سجل الاشتراك" }, { status: 502 });
    }
    if (!subscription.persisted) {
      return NextResponse.json({ ...subscription, error: "اتصال Supabase غير مكتمل، لا يمكن حفظ الاشتراك حالياً" }, { status: 503 });
    }
    return NextResponse.json({ ...subscription, message: "تم الاشتراك في النشرة" });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر حفظ الاشتراك في النشرة"), { status: 500 });
  }
}
