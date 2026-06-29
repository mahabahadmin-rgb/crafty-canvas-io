const knownRouteErrors: Record<string, string> = {
  invoice_not_created: "تعذر إنشاء سجل الفاتورة في قاعدة البيانات",
  payment_not_created: "تعذر إنشاء سجل عملية الدفع في قاعدة البيانات",
  document_not_created: "تعذر إنشاء سجل المستند في قاعدة البيانات",
  message_not_created: "تعذر إنشاء سجل الرسالة في قاعدة البيانات",
  support_ticket_not_created: "تعذر إنشاء سجل تذكرة الدعم في قاعدة البيانات",
  admin_notification_not_created: "تعذر إنشاء سجلات الإشعار في قاعدة البيانات",
};

function knownMessage(message: unknown) {
  if (typeof message !== "string") return undefined;
  return knownRouteErrors[message.trim()];
}

export function routeErrorBody(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.trim()) {
    return { error: knownMessage(error.message) ?? fallback, detail: error.message };
  }

  if (typeof error === "object" && error !== null) {
    const record = error as { message?: unknown; code?: unknown; details?: unknown; hint?: unknown };
    const detail = typeof record.message === "string" && record.message.trim() ? record.message : undefined;
    return {
      error: knownMessage(record.message) ?? fallback,
      detail,
      code: typeof record.code === "string" && record.code.trim() ? record.code : undefined,
      details: typeof record.details === "string" && record.details.trim() ? record.details : undefined,
      hint: typeof record.hint === "string" && record.hint.trim() ? record.hint : undefined,
    };
  }

  return { error: fallback };
}
