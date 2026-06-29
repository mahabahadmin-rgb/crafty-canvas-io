import { NextResponse } from "next/server";
import { z } from "zod";
import { loginMahabahAccount, setMahabahAuthCookies } from "@/lib/supabase/auth";
import { routeErrorBody } from "@/lib/api/route-errors";

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const result = schema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "بيانات الدخول غير مكتملة", issues: result.error.flatten() }, { status: 400 });
  }

  try {
    const login = await loginMahabahAccount(result.data);
    const { session, ...body } = login;
    if (body.persisted && !body.authenticated && body.message === "account_suspended") {
      return NextResponse.json({ ...body, error: "تم إيقاف الحساب. يرجى التواصل مع الدعم الفني." }, { status: 403 });
    }
    if (body.persisted && !body.authenticated && body.message === "auth_session_missing") {
      return NextResponse.json({ ...body, error: "تعذر إنشاء جلسة دخول. تحقق من تأكيد البريد أو أعد المحاولة." }, { status: 401 });
    }
    if (!body.persisted || !body.authenticated || !session) {
      return NextResponse.json({ ...body, error: "اتصال Supabase غير مكتمل، لا يمكن تسجيل الدخول حالياً" }, { status: 503 });
    }
    const response = NextResponse.json({ ...body, message: "تم تسجيل الدخول بنجاح" });
    setMahabahAuthCookies(response, session);
    return response;
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر تسجيل الدخول. تحقق من البريد وكلمة المرور."), { status: 401 });
  }
}
