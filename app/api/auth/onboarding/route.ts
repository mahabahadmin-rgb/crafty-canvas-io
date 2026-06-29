import { NextResponse } from "next/server";
import { z } from "zod";
import { completeMahabahOnboarding, getMahabahAuthContext } from "@/lib/supabase/auth";
import { routeErrorBody } from "@/lib/api/route-errors";

const schema = z.object({
  role: z.enum(["individual", "business"]),
  fullName: z.string().trim().optional(),
  organizationName: z.string().trim().optional(),
  commercialRegistration: z.string().trim().optional(),
  identityNumber: z.string().trim().optional(),
  city: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
});

export async function POST(request: Request) {
  const result = schema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "بيانات إعداد الحساب غير مكتملة", issues: result.error.flatten() }, { status: 400 });
  }

  const context = await getMahabahAuthContext(request);
  if (!context) {
    return NextResponse.json({ error: "يجب تسجيل الدخول قبل إكمال إعداد الحساب" }, { status: 401 });
  }
  if (context.role !== result.data.role) {
    return NextResponse.json({ error: "نوع الحساب لا يطابق جلسة الدخول الحالية" }, { status: 403 });
  }

  try {
    const onboarding = await completeMahabahOnboarding(context, result.data);
    if (!onboarding.persisted) {
      return NextResponse.json({ ...onboarding, error: "اتصال Supabase غير مكتمل، لا يمكن حفظ إعداد الحساب حالياً" }, { status: 503 });
    }
    return NextResponse.json({ ...onboarding, message: "تم إكمال إعداد الحساب" });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر حفظ بيانات إعداد الحساب"), { status: 500 });
  }
}
