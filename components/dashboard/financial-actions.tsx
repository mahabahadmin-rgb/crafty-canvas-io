"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { Download, Loader2 } from "lucide-react";
import type { DashboardFinancialScope } from "@/lib/supabase/mahabah";

type ActionState = "idle" | "loading" | "success" | "error";

class DashboardFinancialActionError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "DashboardFinancialActionError";
    this.status = status;
  }
}

function financialApiErrorMessage(data: unknown, fallback = "request_failed") {
  if (!data || typeof data !== "object") return fallback;
  const record = data as { error?: unknown; detail?: unknown; code?: unknown; details?: unknown; hint?: unknown; message?: unknown };
  const parts = [record.error, record.detail, record.code, record.details, record.hint, record.message]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0);
  return parts.length ? Array.from(new Set(parts)).join(" - ") : fallback;
}

function isUnpersistedMutation(data: unknown) {
  return Boolean(data && typeof data === "object" && (data as { persisted?: unknown }).persisted === false);
}

async function postJson<T>(url: string, payload: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new DashboardFinancialActionError(financialApiErrorMessage(data), response.status);
  if (isUnpersistedMutation(data)) throw new DashboardFinancialActionError(financialApiErrorMessage(data, "mutation_not_persisted"), 409);
  return data as T;
}

function redirectToLogin(router: ReturnType<typeof useRouter>) {
  const next = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/dashboard/individual";
  router.push(`/auth/login?next=${encodeURIComponent(next)}`);
}

function handleAuthError(error: unknown, router: ReturnType<typeof useRouter>) {
  if (error instanceof DashboardFinancialActionError && error.status === 401) {
    redirectToLogin(router);
    return true;
  }
  return false;
}

export function PayInvoiceButton({
  scope,
  invoiceId,
  invoiceNumber,
  method = "mada",
  testId,
  className,
  children = "ادفع الآن",
}: {
  scope: DashboardFinancialScope;
  invoiceId?: string;
  invoiceNumber?: string;
  method?: string;
  testId?: string;
  className?: string;
  children?: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<ActionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const resolvedTestId = testId ?? `pay-invoice-${(invoiceNumber || invoiceId || "unknown").replace(/[^a-zA-Z0-9_-]/g, "-")}`;

  async function handleClick() {
    setState("loading");
    setErrorMessage("");
    try {
      await postJson("/api/dashboard/financial/pay", {
        scope,
        invoiceId,
        invoiceNumber,
        method,
      });
      setState("success");
      router.refresh();
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(error instanceof Error ? error.message : "تعذر الدفع");
      setState("error");
    }
  }

  return (
    <button type="button" data-testid={resolvedTestId} onClick={handleClick} disabled={state === "loading" || state === "success"} className={className} aria-busy={state === "loading"} title={state === "error" ? errorMessage || "تعذر الدفع" : undefined}>
      {state === "loading" ? (
        <span className="inline-flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          جاري الدفع...
        </span>
      ) : state === "success" ? "تم الدفع" : state === "error" ? "تعذر الدفع" : children}
    </button>
  );
}

export function SubscriptionPlanButton({
  scope,
  planName,
  amount,
  testId,
  className,
  children = "اختيار الخطة",
}: {
  scope: DashboardFinancialScope;
  planName: string;
  amount: number;
  testId?: string;
  className?: string;
  children?: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<ActionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const resolvedTestId = testId ?? `select-plan-${planName.replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, "-")}`;

  async function handleClick() {
    setState("loading");
    setErrorMessage("");
    try {
      await postJson("/api/dashboard/financial/subscription", {
        scope,
        planName,
        amount,
      });
      setState("success");
      router.refresh();
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(error instanceof Error ? error.message : "تعذر تحديث الاشتراك");
      setState("error");
    }
  }

  return (
    <button type="button" data-testid={resolvedTestId} onClick={handleClick} disabled={state === "loading" || state === "success"} className={className} aria-busy={state === "loading"} title={state === "error" ? errorMessage || "تعذر تحديث الاشتراك" : undefined}>
      {state === "loading" ? (
        <span className="inline-flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          جاري التحديث...
        </span>
      ) : state === "success" ? "تم اختيار الخطة" : state === "error" ? "تعذر التحديث" : children}
    </button>
  );
}

export function FinancialExportButton({
  filename,
  rows,
  testId,
  className,
  style,
  children = "تحميل كشف الحساب",
}: {
  filename: string;
  rows: Array<Record<string, string | number | null | undefined>>;
  testId?: string;
  className?: string;
  style?: CSSProperties;
  children?: string;
}) {
  const [exported, setExported] = useState(false);
  const resolvedTestId = testId ?? `export-${filename.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  const csv = useMemo(() => {
    const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
    const escapeCell = (value: string | number | null | undefined) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    return [
      headers.map(escapeCell).join(","),
      ...rows.map((row) => headers.map((header) => escapeCell(row[header])).join(",")),
    ].join("\n");
  }, [rows]);

  function handleDownload() {
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setExported(true);
  }

  return (
    <button type="button" data-testid={resolvedTestId} onClick={handleDownload} className={className} style={style}>
      <Download className="h-4 w-4" />
      {exported ? "تم تجهيز الملف" : children}
    </button>
  );
}
