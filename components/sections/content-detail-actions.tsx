"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bookmark, FileText, Loader2, Printer, Share2 } from "lucide-react";

type ContentType = "news" | "article";

type ActionState = {
  loading: boolean;
  message: string;
  error: string;
};

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

export function ContentUtilityActions({ contentType, slug, title }: { contentType: ContentType; slug: string; title: string }) {
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const saveLabel = contentType === "news" ? "حفظ الخبر" : "حفظ المقال";

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => null);
      setMessage("تم فتح خيارات المشاركة");
      return;
    }
    await navigator.clipboard?.writeText(url);
    setMessage("تم نسخ رابط الصفحة");
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/content-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, contentSlug: slug, title }),
      });
      const payload = await response.json().catch(() => null);
      if (response.status === 401) {
        router.push(`/auth/login?next=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      if (!response.ok) throw new Error(apiErrorMessage(payload, "save_failed"));
      if (isUnpersistedMutation(payload)) throw new Error(apiErrorMessage(payload, "save_not_persisted"));
      setMessage(payload?.message || `تم ${saveLabel}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر حفظ المحتوى حالياً");
    } finally {
      setSaving(false);
    }
  }

  function handlePrint(asPdf = false) {
    setMessage(asPdf ? "اختر حفظ كـ PDF من نافذة الطباعة" : "تم فتح نافذة الطباعة");
    window.print();
  }

  const actions = [
    { label: "مشاركة", icon: Share2, onClick: handleShare },
    { label: "PDF", icon: FileText, onClick: () => handlePrint(true) },
    { label: saving ? "جار الحفظ..." : saveLabel, icon: Bookmark, onClick: handleSave },
    { label: "طباعة", icon: Printer, onClick: () => handlePrint(false) },
  ];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line bg-white/78 px-4 text-xs font-extrabold text-navy transition hover:border-gold hover:text-gold"
            >
              <Icon className="h-4 w-4 text-[#A7815E]" />
              {action.label}
            </button>
          );
        })}
      </div>
      {message ? <p className="text-xs font-extrabold text-[#8F6B4C]">{message}</p> : null}
    </div>
  );
}

export function ContentCommentForm({ contentSlug, contentType }: { contentSlug: string; contentType: ContentType }) {
  const [state, setState] = useState<ActionState>({ loading: false, message: "", error: "" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const authorName = String(form.get("authorName") || "").trim();
    const body = String(form.get("body") || "").trim();
    if (authorName.length < 2 || body.length < 5) {
      setState({ loading: false, message: "", error: "اكتب الاسم والتعليق بشكل صحيح قبل الإرسال" });
      return;
    }

    setState({ loading: true, message: "", error: "" });
    try {
      const response = await fetch("/api/content-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentSlug, contentType, authorName, body }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(apiErrorMessage(payload, "comment_failed"));
      if (isUnpersistedMutation(payload)) throw new Error(apiErrorMessage(payload, "comment_not_persisted"));
      formElement.reset();
      setState({ loading: false, message: payload?.message || "تم استلام تعليقك وسيظهر بعد المراجعة", error: "" });
    } catch (error) {
      setState({ loading: false, message: "", error: error instanceof Error ? error.message : "تعذر حفظ التعليق حالياً. حاول مرة أخرى." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-3 md:grid-cols-[1fr_220px]">
      <textarea
        name="body"
        required
        minLength={5}
        maxLength={2000}
        className="min-h-24 min-w-0 rounded-md border border-line bg-[#fffdfa] p-4 text-sm font-bold outline-none focus:border-gold"
        placeholder="اكتب تعليقك هنا..."
      />
      <div className="grid min-w-0 gap-3">
        <input
          name="authorName"
          required
          minLength={2}
          maxLength={120}
          className="h-11 min-w-0 rounded-md border border-line bg-[#fffdfa] px-4 text-sm font-bold outline-none focus:border-gold"
          placeholder="الاسم"
        />
        <button disabled={state.loading} className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-md bg-[#A7815E] px-6 text-sm font-extrabold text-white disabled:opacity-60">
          {state.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {state.loading ? "جار الإرسال..." : "إرسال"}
        </button>
        {state.message ? <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs font-extrabold text-green-700">{state.message}</p> : null}
        {state.error ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-700">{state.error}</p> : null}
      </div>
    </form>
  );
}

export function ContentDetailNewsletterForm() {
  const [state, setState] = useState<ActionState>({ loading: false, message: "", error: "" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const email = String(form.get("email") || "").trim();
    if (!email) return;

    setState({ loading: true, message: "", error: "" });
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(apiErrorMessage(payload, "newsletter_failed"));
      if (isUnpersistedMutation(payload)) throw new Error(apiErrorMessage(payload, "newsletter_not_persisted"));
      formElement.reset();
      setState({ loading: false, message: payload?.message || "تم الاشتراك في النشرة", error: "" });
    } catch (error) {
      setState({ loading: false, message: "", error: error instanceof Error ? error.message : "تعذر حفظ الاشتراك. تأكد من البريد وحاول مرة أخرى." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-2">
      <div className="flex gap-2">
        <input
          name="email"
          required
          type="email"
          className="h-11 min-w-0 flex-1 rounded-md border border-line bg-[#fffdfa] px-4 text-xs font-bold outline-none focus:border-gold"
          placeholder="أدخل بريدك الإلكتروني"
        />
        <button disabled={state.loading} className="grid h-11 w-11 place-items-center rounded-md bg-[#A7815E] text-white disabled:opacity-60" aria-label="اشتراك">
          {state.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowLeft className="h-4 w-4" />}
        </button>
      </div>
      {state.message ? <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs font-extrabold text-green-700">{state.message}</p> : null}
      {state.error ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-700">{state.error}</p> : null}
    </form>
  );
}
