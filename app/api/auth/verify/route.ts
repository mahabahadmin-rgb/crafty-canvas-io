import { NextResponse } from "next/server";
import { z } from "zod";
import { getMahabahAuthContext, verifyMahabahAccessCode } from "@/lib/supabase/auth";
import { routeErrorBody } from "@/lib/api/route-errors";

const schema = z.object({
  code: z.string().trim().regex(/^\d{4,6}$/),
});

export async function POST(request: Request) {
  const result = schema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "رمز التحقق غير مكتمل", issues: result.error.flatten() }, { status: 400 });
  }

  const context = await getMahabahAuthContext(request);
  if (!context) {
    return NextResponse.json({ error: "يجب تسجيل الدخول قبل تأكيد الرمز" }, { status: 401 });
  }

  try {
    const verification = await verifyMahabahAccessCode(context, result.data.code);
    if (!verification.persisted) {
      return NextResponse.json({ ...verification, error: "اتصال Supabase غير مكتمل، لا يمكن تأكيد الرمز حالياً" }, { status: 503 });
    }
    return NextResponse.json({ ...verification, message: "تم تأكيد الرمز" });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر تأكيد رمز التحقق"), { status: 500 });
  }
}
