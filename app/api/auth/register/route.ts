import { NextResponse } from "next/server";
import { z } from "zod";
import { registerMahabahAccount, setMahabahAuthCookies } from "@/lib/supabase/auth";
import { routeErrorBody } from "@/lib/api/route-errors";

const schema = z.object({
  role: z.enum(["individual", "business"]),
  fullName: z.string().trim().min(2),
  email: z.string().trim().email(),
  password: z.string().min(8),
  phone: z.string().trim().min(8).optional(),
  city: z.string().trim().optional(),
  organizationName: z.string().trim().optional(),
  commercialRegistration: z.string().trim().optional(),
  delegatedName: z.string().trim().optional(),
  acceptedTerms: z.boolean().refine(Boolean, "accepted_terms_required"),
});

export async function POST(request: Request) {
  const result = schema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "بيانات التسجيل غير مكتملة", issues: result.error.flatten() }, { status: 400 });
  }

  try {
    const registration = await registerMahabahAccount(result.data);
    const { session, ...body } = registration;
    if (!body.persisted) {
      return NextResponse.json({ ...body, error: "اتصال Supabase غير مكتمل، لا يمكن إنشاء الحساب حالياً" }, { status: 503 });
    }
    if (!session) {
      return NextResponse.json({
        ...body,
        redirect: "/auth/login",
        message: "تم إنشاء الحساب في Supabase، سجّل الدخول للمتابعة",
      }, { status: 201 });
    }
    const response = NextResponse.json({ ...body, message: "تم إنشاء الحساب بنجاح" });
    setMahabahAuthCookies(response, session);
    return response;
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر إنشاء الحساب. قد يكون البريد مستخدماً مسبقاً."), { status: 500 });
  }
}
