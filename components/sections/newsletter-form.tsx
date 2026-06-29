"use client";

import { type FormEvent, useState } from "react";
import { Loader2, Search } from "lucide-react";

function apiErrorMessage(data: unknown, fallback: string) {
  if (!data || typeof data !== "object") return fallback;
  const record = data as { error?: unknown; detail?: unknown; code?: unknown; details?: unknown; hint?: unknown; message?: unknown };
  const parts = [record.error, record.detail, record.code, record.details, record.hint, record.message]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0);
  return parts.length ? Array.from(new Set(parts)).join(" - ") : fallback;
}

function isUnpersistedMutation(data: unknown) {
  return Boolean(data && typeof data === "object" && (data as { persisted?: unknown }).persisted === false);
}

export function NewsletterForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const email = String(form.get("email") || "").trim();
    if (!email) return;

    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(apiErrorMessage(payload, "newsletter_failed"));
      if (isUnpersistedMutation(payload)) throw new Error(apiErrorMessage(payload, "newsletter_not_persisted"));
      setMessage(payload?.message || "تم الاشتراك في النشرة");
      formElement.reset();
    } catch (error) {
      setError(error instanceof Error ? error.message : "تعذر حفظ الاشتراك. تأكد من البريد الإلكتروني وحاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 md:contents">
      <input name="email" required type="email" className="h-12 rounded-md border border-line bg-white px-4 text-sm font-bold outline-none" placeholder="أدخل بريدك الإلكتروني" />
      <button disabled={loading} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#A7815E] text-sm font-extrabold text-white disabled:opacity-60">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        {loading ? "جار الاشتراك..." : "اشترك"}
      </button>
      {message ? <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs font-extrabold text-green-700 md:col-span-4">{message}</p> : null}
      {error ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-700 md:col-span-4">{error}</p> : null}
    </form>
  );
}
