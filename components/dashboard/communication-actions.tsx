"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, Send, UploadCloud } from "lucide-react";
import { DashboardDocumentUploadButton } from "@/components/dashboard/dashboard-actions";

type ActionState = "idle" | "loading" | "success" | "error";
type DashboardCommunicationScope = "individual" | "business";
type AdminNotificationTarget = "individual" | "business" | "admin" | "all";
type DashboardThreadMessage = { id?: string; text: string; time: string; mine?: boolean };

class DashboardCommunicationError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "DashboardCommunicationError";
    this.status = status;
  }
}

function communicationApiErrorMessage(data: unknown, fallback = "request_failed") {
  if (!data || typeof data !== "object") return fallback;
  const record = data as { error?: unknown; detail?: unknown; code?: unknown; details?: unknown; hint?: unknown; message?: unknown };
  const parts = [record.error, record.detail, record.code, record.details, record.hint, record.message]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0);
  return parts.length ? Array.from(new Set(parts)).join(" - ") : fallback;
}

function isUnpersistedMutation(data: unknown) {
  return Boolean(data && typeof data === "object" && (data as { persisted?: unknown }).persisted === false);
}

async function requestJson<T>(url: string, method: "POST" | "PATCH", payload: unknown): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new DashboardCommunicationError(communicationApiErrorMessage(data), response.status);
  if (isUnpersistedMutation(data)) throw new DashboardCommunicationError(communicationApiErrorMessage(data, "mutation_not_persisted"), 409);
  return data as T;
}

async function postJson<T>(url: string, payload: unknown): Promise<T> {
  return requestJson<T>(url, "POST", payload);
}

async function patchJson<T>(url: string, payload: unknown): Promise<T> {
  return requestJson<T>(url, "PATCH", payload);
}

function redirectToLogin(router: ReturnType<typeof useRouter>) {
  const next = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/dashboard/individual";
  router.push(`/auth/login?next=${encodeURIComponent(next)}`);
}

function handleAuthError(error: unknown, router: ReturnType<typeof useRouter>) {
  if (error instanceof DashboardCommunicationError && error.status === 401) {
    redirectToLogin(router);
    return true;
  }
  return false;
}

function communicationErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

function DashboardField({
  label,
  name,
  placeholder,
  textarea,
  required = true,
}: {
  label: string;
  name: string;
  placeholder: string;
  textarea?: boolean;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-extrabold text-[#1D1916]">
      {label}
      {textarea ? (
        <textarea name={name} required={required} className="min-h-24 rounded-md border border-[#ece1d8] bg-white p-3 text-sm font-bold outline-none focus:border-[#A7815E]" placeholder={placeholder} />
      ) : (
        <input name={name} required={required} className="h-12 rounded-md border border-[#ece1d8] bg-white px-3 text-sm font-bold outline-none focus:border-[#A7815E]" placeholder={placeholder} />
      )}
    </label>
  );
}

export function MarkNotificationsReadButton({ scope = "individual", className, children }: { scope?: DashboardCommunicationScope; className?: string; children: string }) {
  const [state, setState] = useState<ActionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  async function handleClick() {
    setState("loading");
    setErrorMessage("");
    try {
      await postJson("/api/dashboard/notifications", { scope });
      setState("success");
      router.refresh();
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(communicationErrorMessage(error, "تعذر تحديث الإشعارات"));
      setState("error");
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={state === "loading"} className={className} aria-busy={state === "loading"} title={state === "error" ? errorMessage || "تعذر التحديث" : undefined}>
      {state === "loading" ? "جار التحديث..." : state === "success" ? "تم تحديد الكل كمقروء" : state === "error" ? "تعذر التحديث" : children}
    </button>
  );
}

export function AdminNotificationSendForm() {
  const [state, setState] = useState<ActionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const target = String(form.get("target") || "individual") as AdminNotificationTarget;
    const title = String(form.get("title") || "").trim();
    const body = String(form.get("body") || "").trim();
    const category = String(form.get("category") || "system").trim();
    const actionUrl = String(form.get("actionUrl") || "").trim();
    if (!title || !body) return;

    setState("loading");
    setErrorMessage("");
    try {
      await postJson("/api/dashboard/admin-notifications", { target, title, body, category, actionUrl: actionUrl || undefined });
      formElement.reset();
      setState("success");
      router.refresh();
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(communicationErrorMessage(error, "تعذر إرسال الإشعار"));
      setState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <label className="grid gap-2 text-sm font-extrabold text-[#1D1916]">
        المستهدف
        <select name="target" defaultValue="individual" className="h-12 rounded-md border border-[#ece1d8] bg-white px-3 text-sm font-bold outline-none focus:border-[#A7815E]">
          <option value="individual">حسابات الأفراد</option>
          <option value="business">حسابات الأعمال</option>
          <option value="admin">فريق الإدارة</option>
          <option value="all">الجميع</option>
        </select>
      </label>
      <DashboardField label="عنوان الإشعار" name="title" placeholder="مثال: تم تحديث حالة طلبك" />
      <DashboardField label="نص الإشعار" name="body" placeholder="اكتب الرسالة التي ستظهر للمستخدم..." textarea />
      <DashboardField label="التصنيف" name="category" placeholder="system, account, support..." required={false} />
      <DashboardField label="رابط الإجراء" name="actionUrl" placeholder="/dashboard/individual/notifications" required={false} />
      <button disabled={state === "loading"} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#A7815E] px-5 text-sm font-extrabold text-white disabled:opacity-60">
        {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {state === "success" ? "تم إرسال الإشعار" : state === "error" ? "تعذر الإرسال" : "إرسال الإشعار"}
      </button>
      {state === "error" ? <p className="rounded-md border border-[#efc5b9] bg-[#fff0eb] px-3 py-2 text-xs font-extrabold text-[#9C3D22]">{errorMessage || "تعذر إرسال الإشعار"}</p> : null}
    </form>
  );
}

export function AdminNotificationReadButton({ notificationId, read, className, children }: { notificationId: string; read: boolean; className?: string; children: string }) {
  const [state, setState] = useState<ActionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  async function handleClick() {
    setState("loading");
    setErrorMessage("");
    try {
      await patchJson("/api/dashboard/admin-notifications", { notificationId, read });
      setState("success");
      router.refresh();
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(communicationErrorMessage(error, "تعذر تحديث الإشعار"));
      setState("error");
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={state === "loading" || state === "success"} className={className} aria-busy={state === "loading"} title={state === "error" ? errorMessage || "تعذر التحديث" : undefined}>
      {state === "loading" ? "جار التحديث..." : state === "success" ? "تم التحديث" : state === "error" ? "تعذر التحديث" : children}
    </button>
  );
}

function ChatBubbleClient({ text, mine = false, time }: { text: string; mine?: boolean; time: string }) {
  return (
    <div className={mine ? "flex justify-start" : "flex justify-end"}>
      <div
        className="max-w-[72%] rounded-lg border px-5 py-4 text-sm font-bold leading-7 shadow-[0_8px_18px_rgb(29_25_22/0.035)]"
        style={mine ? { backgroundColor: "#F4EAE0", borderColor: "#F4EAE0", color: "#1D1916" } : { backgroundColor: "#ffffff", borderColor: "#ece1d8", color: "#1D1916" }}
      >
        {text}
        <span className="mt-1 block text-[11px] text-[#6E6258]">{time}</span>
      </div>
    </div>
  );
}

export function DashboardMessageThread({
  scope = "individual",
  conversationId,
  initialMessages = [],
  createNew = false,
  subject,
}: {
  scope?: DashboardCommunicationScope;
  conversationId?: string;
  initialMessages?: DashboardThreadMessage[];
  createNew?: boolean;
  subject?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<DashboardThreadMessage[]>(initialMessages);
  const [body, setBody] = useState("");
  const [state, setState] = useState<ActionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  function focusMessageInput() {
    inputRef.current?.focus();
  }

  function addEmoji() {
    setBody((current) => `${current}${current.endsWith(" ") || current.length === 0 ? "" : " "}🙂`);
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;

    setState("loading");
    setErrorMessage("");
    try {
      const result = await postJson<{ body?: string; conversationId?: string }>("/api/dashboard/messages", { scope, conversationId, body: trimmed, createNew, subject });
      setMessages((current) => [...current, { text: result.body || trimmed, time: "الآن", mine: true }]);
      setBody("");
      setState("success");
      if (createNew && result.conversationId) {
        router.replace(`/dashboard/${scope}/messages?conversation=${encodeURIComponent(result.conversationId)}`);
        router.refresh();
      }
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(communicationErrorMessage(error, "تعذر إرسال الرسالة"));
      setState("error");
    }
  }

  return (
    <>
      <div className="grid content-start gap-4 p-6">
        <div className="text-center text-xs font-bold text-[#6E6258]">2025/06/03</div>
        {!messages.length ? <p className="rounded-md border border-[#eee4dc] bg-white p-4 text-center text-sm font-extrabold text-[#6E6258]">لا توجد رسائل بعد. ابدأ المحادثة من الأسفل.</p> : null}
        {messages.map((message, index) => (
          <ChatBubbleClient key={`${message.time}-${index}`} {...message} />
        ))}
        {state === "error" ? <p className="text-center text-xs font-extrabold text-[#9C3D22]">{errorMessage || "تعذر إرسال الرسالة، حاول مرة أخرى."}</p> : null}
      </div>
      <form onSubmit={handleSubmit} className="mt-auto flex flex-wrap items-center gap-3 border-t border-[#eee4dc] p-4">
        <button type="button" onClick={focusMessageInput} className="grid h-11 w-11 place-items-center rounded-md border border-[#ece1d8] text-[#1D1916]" aria-label="التركيز على كتابة الرسالة">⌕</button>
        <button type="button" onClick={addEmoji} className="grid h-11 w-11 place-items-center rounded-md border border-[#ece1d8] text-[#1D1916]" aria-label="إضافة رمز تعبيري">☺</button>
        <input ref={inputRef} value={body} onChange={(event) => setBody(event.target.value)} className="h-11 min-w-[14rem] flex-1 rounded-md border border-[#ece1d8] px-4 text-sm font-bold outline-none" placeholder="اكتب رسالتك هنا..." />
        <button disabled={state === "loading"} className="grid h-11 w-11 place-items-center rounded-md bg-[#A7815E] text-white disabled:opacity-60" aria-label="إرسال">
          {state === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
      </form>
    </>
  );
}

export function ArchiveConversationButton({ scope = "individual", conversationId, className, children }: { scope?: DashboardCommunicationScope; conversationId?: string; className?: string; children: string }) {
  const [state, setState] = useState<ActionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  async function handleClick() {
    if (!conversationId) return;
    setState("loading");
    setErrorMessage("");
    try {
      await patchJson("/api/dashboard/messages", { scope, conversationId });
      setState("success");
      router.replace(`/dashboard/${scope}/messages`);
      router.refresh();
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(communicationErrorMessage(error, "تعذر حذف المحادثة"));
      setState("error");
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={!conversationId || state === "loading" || state === "success"} className={className} aria-busy={state === "loading"} title={state === "error" ? errorMessage || "تعذر حذف المحادثة" : undefined}>
      {state === "loading" ? "جار الحذف..." : state === "success" ? "تم حذف المحادثة" : state === "error" ? "تعذر حذف المحادثة" : children}
    </button>
  );
}

export function AdminMessageThread({ conversationId, initialMessages = [] }: { conversationId?: string; initialMessages?: DashboardThreadMessage[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<DashboardThreadMessage[]>(initialMessages);
  const [body, setBody] = useState("");
  const [state, setState] = useState<ActionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = body.trim();
    if (!trimmed || !conversationId) return;

    setState("loading");
    setErrorMessage("");
    try {
      const result = await postJson<{ body?: string }>("/api/dashboard/admin-messages", { conversationId, body: trimmed });
      setMessages((current) => [...current, { text: result.body || trimmed, time: "الآن", mine: true }]);
      setBody("");
      setState("success");
      router.refresh();
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(communicationErrorMessage(error, "تعذر إرسال الرد"));
      setState("error");
    }
  }

  return (
    <>
      <div className="grid max-h-[520px] content-start gap-4 overflow-auto p-6">
        {!messages.length ? <p className="rounded-md border border-[#eee4dc] bg-white p-4 text-center text-sm font-extrabold text-[#6E6258]">لا توجد رسائل في هذه المحادثة.</p> : null}
        {messages.map((message, index) => (
          <ChatBubbleClient key={`${message.time}-${index}`} {...message} />
        ))}
        {state === "error" ? <p className="text-center text-xs font-extrabold text-[#9C3D22]">{errorMessage || "تعذر إرسال الرد، حاول مرة أخرى."}</p> : null}
      </div>
      <form onSubmit={handleSubmit} className="mt-auto flex flex-wrap items-center gap-3 border-t border-[#eee4dc] p-4">
        <button type="button" onClick={() => inputRef.current?.focus()} className="grid h-11 w-11 place-items-center rounded-md border border-[#ece1d8] text-[#1D1916]" aria-label="التركيز على كتابة الرد">⌕</button>
        <input ref={inputRef} value={body} onChange={(event) => setBody(event.target.value)} disabled={!conversationId} className="h-11 min-w-[14rem] flex-1 rounded-md border border-[#ece1d8] px-4 text-sm font-bold outline-none disabled:bg-[#f8f5f1]" placeholder="اكتب رد الإدارة هنا..." />
        <button disabled={!conversationId || state === "loading"} className="grid h-11 w-11 place-items-center rounded-md bg-[#A7815E] text-white disabled:opacity-60" aria-label="إرسال الرد">
          {state === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
      </form>
    </>
  );
}

export function AdminArchiveConversationButton({ conversationId, className, children }: { conversationId?: string; className?: string; children: string }) {
  const [state, setState] = useState<ActionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  async function handleClick() {
    if (!conversationId) return;
    setState("loading");
    setErrorMessage("");
    try {
      await patchJson("/api/dashboard/admin-messages", { conversationId });
      setState("success");
      router.replace("/dashboard/admin/messages");
      router.refresh();
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(communicationErrorMessage(error, "تعذر أرشفة المحادثة"));
      setState("error");
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={!conversationId || state === "loading" || state === "success"} className={className} aria-busy={state === "loading"} title={state === "error" ? errorMessage || "تعذر الأرشفة" : undefined}>
      {state === "loading" ? "جار الأرشفة..." : state === "success" ? "تمت الأرشفة" : state === "error" ? "تعذر الأرشفة" : children}
    </button>
  );
}

export function DashboardSupportTicketForm({ scope = "individual" }: { scope?: DashboardCommunicationScope }) {
  const [state, setState] = useState<ActionState>("idle");
  const [reference, setReference] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [clientReference, setClientReference] = useState(() => `support-ticket-${Date.now().toString(36)}-${Math.floor(1000 + Math.random() * 9000)}`);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      scope,
      category: String(form.get("category") || "").trim(),
      title: String(form.get("title") || "").trim(),
      description: String(form.get("description") || "").trim(),
      clientReference,
    };

    setState("loading");
    setErrorMessage("");
    try {
      const result = await postJson<{ reference?: string }>("/api/dashboard/support", payload);
      setReference(result.reference || "");
      formElement.reset();
      setClientReference(`support-ticket-${Date.now().toString(36)}-${Math.floor(1000 + Math.random() * 9000)}`);
      setState("success");
      router.refresh();
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(communicationErrorMessage(error, "تعذر إرسال التذكرة"));
      setState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <DashboardField label="نوع المشكلة" name="category" placeholder="مثال: خدمات عقارية، فواتير، حساب" />
      <DashboardField label="عنوان المشكلة" name="title" placeholder="اكتب عنواناً مختصراً لمشكلتك" />
      <DashboardField label="وصف المشكلة" name="description" placeholder="يرجى وصف المشكلة بالتفصيل لمساعدتنا على فهمها وحلها بشكل أسرع..." textarea />
      <div className="rounded-md border border-[#ece1d8] bg-white p-5 text-center">
        <UploadCloud className="mx-auto h-7 w-7 text-[#A7815E]" />
        <DashboardDocumentUploadButton
          scope={scope}
          entityType="support_ticket_attachment"
          entityId={clientReference}
          label="مرفق تذكرة دعم"
          className="mt-2 inline-flex cursor-pointer items-center justify-center rounded-md border border-[#B89A7A] px-5 py-2 text-sm font-extrabold text-[#1D1916]"
        >
          اضغط لاختيار ملف
        </DashboardDocumentUploadButton>
        <p className="mt-1 text-xs font-bold text-[#6E6258]">الحد الأقصى لحجم الملف 10 ميجابايت</p>
      </div>
      {state === "success" ? (
        <div className="rounded-md border border-[#CDE9D8] bg-[#EAF6EF] px-4 py-3 text-sm font-extrabold text-[#087342]">
          تم إرسال التذكرة {reference ? `برقم ${reference}` : "بنجاح"}.
        </div>
      ) : null}
      {state === "error" ? <div className="rounded-md border border-[#efc5b9] bg-[#fff0eb] px-4 py-3 text-sm font-extrabold text-[#9C3D22]">{errorMessage || "تعذر إرسال التذكرة، تحقق من البيانات وحاول مرة أخرى."}</div> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <button disabled={state === "loading"} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#A7815E] text-sm font-extrabold text-white disabled:opacity-60">
          {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
          إرسال التذكرة
        </button>
        <button type="reset" className="min-h-12 rounded-md border border-[#ece1d8] bg-white text-sm font-extrabold text-[#1D1916]">إعادة تعيين</button>
      </div>
    </form>
  );
}

export function DashboardSupportTicketUpdateButton({
  scope = "individual",
  ticketId,
  status,
  className,
  children,
}: {
  scope?: DashboardCommunicationScope;
  ticketId: string;
  status: "submitted" | "in_progress" | "completed" | "cancelled";
  className?: string;
  children: string;
}) {
  const [state, setState] = useState<ActionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  async function handleClick() {
    setState("loading");
    setErrorMessage("");
    try {
      await patchJson("/api/dashboard/support", { scope, ticketId, status });
      setState("success");
      router.refresh();
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(communicationErrorMessage(error, "تعذر تحديث التذكرة"));
      setState("error");
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={state === "loading" || state === "success"} className={className} aria-busy={state === "loading"} title={state === "error" ? errorMessage || "تعذر التحديث" : undefined}>
      {state === "loading" ? "جار التحديث..." : state === "success" ? "تم التحديث" : state === "error" ? "تعذر التحديث" : children}
    </button>
  );
}

export function DashboardSupportTicketReplyForm({ scope = "individual", ticketId }: { scope?: DashboardCommunicationScope; ticketId: string }) {
  const [state, setState] = useState<ActionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const message = String(form.get("message") || "").trim();
    if (!message) return;

    setState("loading");
    setErrorMessage("");
    try {
      await patchJson("/api/dashboard/support", { scope, ticketId, message });
      formElement.reset();
      setState("success");
      router.refresh();
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(communicationErrorMessage(error, "تعذر إرسال الرد"));
      setState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <textarea name="message" required className="min-h-24 rounded-md border border-[#ece1d8] bg-white p-3 text-sm font-bold outline-none focus:border-[#A7815E]" placeholder="اكتب ردك أو التحديث المطلوب..." />
      <button disabled={state === "loading"} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#A7815E] px-5 text-sm font-extrabold text-white disabled:opacity-60">
        {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {state === "success" ? "تم إرسال الرد" : state === "error" ? "تعذر إرسال الرد" : "إرسال الرد"}
      </button>
      {state === "error" ? <p className="rounded-md border border-[#efc5b9] bg-[#fff0eb] px-3 py-2 text-xs font-extrabold text-[#9C3D22]">{errorMessage || "تعذر إرسال الرد"}</p> : null}
    </form>
  );
}

export function AdminSupportTicketUpdateButton({
  ticketId,
  status,
  className,
  children,
}: {
  ticketId: string;
  status: "submitted" | "in_progress" | "completed" | "cancelled";
  className?: string;
  children: string;
}) {
  const [state, setState] = useState<ActionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  async function handleClick() {
    setState("loading");
    setErrorMessage("");
    try {
      await patchJson("/api/dashboard/admin-support", { ticketId, status });
      setState("success");
      router.refresh();
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(communicationErrorMessage(error, "تعذر تحديث التذكرة"));
      setState("error");
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={state === "loading" || state === "success"} className={className} aria-busy={state === "loading"} title={state === "error" ? errorMessage || "تعذر التحديث" : undefined}>
      {state === "loading" ? "جار التحديث..." : state === "success" ? "تم التحديث" : state === "error" ? "تعذر التحديث" : children}
    </button>
  );
}

export function AdminSupportTicketReplyForm({ ticketId }: { ticketId: string }) {
  const [state, setState] = useState<ActionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const message = String(form.get("message") || "").trim();
    const internal = form.get("internal") === "on";
    if (!message) return;

    setState("loading");
    setErrorMessage("");
    try {
      await patchJson("/api/dashboard/admin-support", { ticketId, message, internal });
      formElement.reset();
      setState("success");
      router.refresh();
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(communicationErrorMessage(error, "تعذر إرسال رد الدعم"));
      setState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <textarea name="message" required className="min-h-24 rounded-md border border-[#ece1d8] bg-white p-3 text-sm font-bold outline-none focus:border-[#A7815E]" placeholder="اكتب رد الدعم أو ملاحظة داخلية..." />
      <label className="flex items-center gap-2 text-sm font-bold text-[#1D1916]">
        <input name="internal" type="checkbox" className="h-4 w-4 accent-[#A7815E]" />
        ملاحظة داخلية لا تظهر للعميل
      </label>
      <button disabled={state === "loading"} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#A7815E] px-5 text-sm font-extrabold text-white disabled:opacity-60">
        {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {state === "success" ? "تم إرسال الرد" : state === "error" ? "تعذر إرسال الرد" : "إرسال رد الدعم"}
      </button>
      {state === "error" ? <p className="rounded-md border border-[#efc5b9] bg-[#fff0eb] px-3 py-2 text-xs font-extrabold text-[#9C3D22]">{errorMessage || "تعذر إرسال رد الدعم"}</p> : null}
    </form>
  );
}
