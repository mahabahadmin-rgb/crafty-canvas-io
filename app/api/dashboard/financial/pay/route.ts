import { NextResponse } from "next/server";
import { z } from "zod";
import { payDashboardInvoice } from "@/lib/supabase/mahabah";
import { dashboardScopeAccessError, getMahabahAuthContext } from "@/lib/supabase/auth";
import { routeErrorBody } from "@/lib/api/route-errors";

const paymentMethods = ["mada", "visa", "apple_pay", "bank_transfer"] as const;

function normalizePaymentMethod(value: unknown) {
  if (typeof value !== "string") return "mada";
  const normalized = value.trim().toLowerCase().replace(/\s+/g, "_");
  if (normalized.includes("مدى") || normalized.includes("mada")) return "mada";
  if (normalized.includes("visa") || normalized.includes("فيزا")) return "visa";
  if (normalized.includes("apple")) return "apple_pay";
  if (normalized.includes("bank") || normalized.includes("تحويل")) return "bank_transfer";
  return normalized;
}

const paySchema = z.object({
  scope: z.enum(["individual", "business"]).default("individual"),
  invoiceId: z.string().optional(),
  invoiceNumber: z.string().optional(),
  method: z.preprocess(normalizePaymentMethod, z.enum(paymentMethods).default("mada")),
});

export async function POST(request: Request) {
  const result = paySchema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: "بيانات الدفع غير مكتملة", issues: result.error.flatten() }, { status: 400 });
  }

  try {
    const actor = await getMahabahAuthContext(request);
    const accessError = dashboardScopeAccessError(actor, result.data.scope);
    if (accessError) {
      return NextResponse.json({ error: accessError === "auth_required" ? "يجب تسجيل الدخول قبل تنفيذ الإجراء" : "لا يملك الحساب صلاحية تنفيذ هذا الإجراء" }, { status: accessError === "auth_required" ? 401 : 403 });
    }
    const action = await payDashboardInvoice({ ...result.data, actor });
    if (!action.persisted && action.message === "invoice_identifier_missing") {
      return NextResponse.json({ ...action, error: "رقم الفاتورة مطلوب لإتمام الدفع" }, { status: 400 });
    }
    if (!action.persisted && action.message === "invoice_not_found") {
      return NextResponse.json({ ...action, error: "لم يتم العثور على الفاتورة" }, { status: 404 });
    }
    if (!action.persisted && action.message === "invoice_not_payable") {
      return NextResponse.json({ ...action, error: "لا يمكن سداد هذه الفاتورة بحالتها الحالية" }, { status: 409 });
    }
    if (!action.persisted && action.message === "payment_not_created") {
      return NextResponse.json({ ...action, error: "تعذر إنشاء سجل عملية الدفع" }, { status: 502 });
    }
    if (!action.persisted) {
      return NextResponse.json({ ...action, error: "اتصال Supabase غير مكتمل، لا يمكن تنفيذ الدفع حالياً" }, { status: 503 });
    }
    if (action.message === "invoice_already_paid") {
      return NextResponse.json({ ...action, message: "الفاتورة مسددة مسبقاً" });
    }
    return NextResponse.json({ ...action, message: "تم تنفيذ عملية الدفع" });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر تنفيذ عملية الدفع"), { status: 500 });
  }
}
