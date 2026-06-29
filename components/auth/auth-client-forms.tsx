"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, CheckCircle2, FileText, Loader2, LockKeyhole, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type AuthFieldIcon = typeof UserRound;

function apiErrorMessage(data: unknown, fallback = "request_failed") {
  if (!data || typeof data !== "object") return fallback;
  const record = data as { error?: unknown; detail?: unknown; code?: unknown; details?: unknown; hint?: unknown; message?: unknown };
  const parts = [record.error, record.detail, record.code, record.details, record.hint, record.message]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0);
  return parts.length ? Array.from(new Set(parts)).join(" - ") : fallback;
}

function isUnpersistedMutation(data: unknown) {
  return Boolean(data && typeof data === "object" && (data as { persisted?: unknown }).persisted === false);
}

function AuthField({ name, placeholder, icon: Icon, type = "text", required = true }: { name: string; placeholder: string; icon?: AuthFieldIcon; type?: string; required?: boolean }) {
  return (
    <Field>
      <FieldLabel htmlFor={name} className="sr-only">{placeholder}</FieldLabel>
      <div className="relative">
        <Input
          id={name}
          name={name}
          required={required}
          type={type}
          placeholder={placeholder}
          className="h-14 border-line bg-[#fffdfa] ps-11 px-4 text-right text-sm font-bold focus-visible:ring-gold"
        />
        {Icon ? <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A7815E]" /> : null}
      </div>
    </Field>
  );
}

async function postJson(url: string, payload: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(apiErrorMessage(data));
  if (isUnpersistedMutation(data)) throw new Error(apiErrorMessage(data, "mutation_not_persisted"));
  return data as { redirect?: string; message?: string };
}

export function AuthRegisterForm({ business }: { business: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const acceptedTerms = form.get("acceptedTerms") === "on";
    const organizationName = String(form.get("organizationName") || "").trim();
    const delegatedName = String(form.get("delegatedName") || "").trim();
    const fullName = business ? (delegatedName || organizationName) : String(form.get("fullName") || "").trim();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const result = await postJson("/api/auth/register", {
        role: business ? "business" : "individual",
        fullName,
        organizationName: organizationName || undefined,
        commercialRegistration: String(form.get("commercialRegistration") || "").trim() || undefined,
        delegatedName: delegatedName || undefined,
        phone: String(form.get("phone") || "").trim(),
        email: String(form.get("email") || "").trim(),
        password: String(form.get("password") || ""),
        city: String(form.get("city") || "الرياض").trim(),
        acceptedTerms,
      });
      setMessage(result.message || "تم إنشاء الحساب");
      router.push(result.redirect || (business ? "/dashboard/business" : "/dashboard/individual"));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "تعذر إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-line bg-white/72 p-6 text-right">
      <h2 className="mb-4 flex items-center justify-end gap-2 font-display text-2xl font-extrabold text-navy">
        {business ? "الأعمال" : "الأفراد"}
        {business ? <Building2 className="h-6 w-6 text-[#A7815E]" /> : <UserRound className="h-6 w-6 text-[#A7815E]" />}
      </h2>
      <FieldGroup className="gap-4">
        <AuthField name={business ? "organizationName" : "fullName"} placeholder={business ? "اسم المنشأة" : "الاسم الكامل"} icon={business ? Building2 : UserRound} />
        {business ? <AuthField name="commercialRegistration" placeholder="رقم السجل التجاري" icon={FileText} /> : null}
        {business ? <AuthField name="delegatedName" placeholder="اسم المفوض" icon={UserRound} /> : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <AuthField name="phone" placeholder="رقم الجوال" icon={Phone} />
          <AuthField name="email" placeholder="البريد الإلكتروني" icon={Mail} type="email" />
        </div>
        <AuthField name="city" placeholder="المدينة" icon={Building2} required={false} />
        <AuthField name="password" placeholder="كلمة المرور" icon={LockKeyhole} type="password" />
        <label className="flex items-center gap-2 text-xs font-bold text-muted">
          <input name="acceptedTerms" required type="checkbox" className="h-4 w-4 accent-gold" />
          أوافق على الشروط والأحكام وسياسة الخصوصية
        </label>
        {message ? <FieldDescription className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs font-extrabold text-green-700">{message}</FieldDescription> : null}
        {error ? <FieldError className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-700">{error}</FieldError> : null}
          <Button type="submit" disabled={loading} className="h-14 bg-gold text-sm font-extrabold text-white shadow-[0_16px_34px_rgb(167_129_94/0.20)] hover:bg-[#8F6B4C]">
          {loading ? <Loader2 className="animate-spin" data-icon="inline-start" /> : null}
          {loading ? "جار إنشاء الحساب..." : "إنشاء الحساب"}
        </Button>
      </FieldGroup>
    </form>
  );
}

export function AuthLoginForm({ nextPath }: { nextPath?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError("");
    try {
      const result = await postJson("/api/auth/login", {
        email: String(form.get("email") || "").trim(),
        password: String(form.get("password") || ""),
      });
      router.push(nextPath || result.redirect || "/dashboard/individual");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "تعذر تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="text-right">
      <FieldGroup className="gap-4">
        <div className="flex flex-col gap-2 text-right">
          <h1 className="font-display text-4xl font-extrabold text-navy">تسجيل الدخول</h1>
          <p className="text-sm font-bold leading-7 text-muted-foreground">ادخل إلى لوحة التحكم لمتابعة أصولك ومساهماتك وخدماتك.</p>
        </div>
        <AuthField name="email" placeholder="البريد الإلكتروني" icon={Mail} type="email" />
        <AuthField name="password" placeholder="كلمة المرور" icon={LockKeyhole} type="password" />
        {error ? <FieldError className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-700">{error}</FieldError> : null}
        <Button type="submit" disabled={loading} className="mt-1 h-14 bg-gold text-sm font-extrabold text-white shadow-[0_16px_34px_rgb(167_129_94/0.20)] hover:bg-[#8F6B4C]">
          {loading ? <Loader2 className="animate-spin" data-icon="inline-start" /> : null}
          {loading ? "جار الدخول..." : "دخول لوحة التحكم"}
        </Button>
        <FieldDescription className="text-center text-sm font-extrabold">
          ليس لديك حساب؟ <Link href="/auth/register">إنشاء حساب</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}

export function AuthVerifyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const code = ["code-1", "code-2", "code-3", "code-4"].map((name) => String(form.get(name) || "").trim()).join("");
    setLoading(true);
    setError("");
    try {
      const result = await postJson("/api/auth/verify", { code });
      router.push(result.redirect || "/dashboard/individual");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "تعذر تأكيد الرمز");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-line bg-white/72 p-7 text-center shadow-card">
      <ShieldCheck className="mx-auto h-16 w-16 text-[#A7815E]" />
      <h1 className="mt-4 font-display text-4xl font-extrabold text-navy">تأكيد رمز التحقق</h1>
      <p className="mt-3 text-sm font-bold leading-7 text-muted">أدخل الرمز المرسل لإكمال الدخول وربط الجلسة بحسابك.</p>
      <div className="mt-7 grid grid-cols-4 gap-4" dir="ltr">
        {["code-1", "code-2", "code-3", "code-4"].map((name) => (
          <Input key={name} name={name} required inputMode="numeric" pattern="[0-9]*" maxLength={1} className="h-14 border-line bg-[#fffdfa] text-center text-xl font-bold focus-visible:ring-gold" />
        ))}
      </div>
      {error ? <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-700">{error}</p> : null}
      <Button type="submit" disabled={loading} className="mt-7 h-14 w-full bg-gold text-sm font-extrabold text-white shadow-[0_16px_34px_rgb(167_129_94/0.20)] hover:bg-[#8F6B4C]">
        {loading ? <Loader2 className="animate-spin" data-icon="inline-start" /> : null}
        {loading ? "جار التأكيد..." : "تأكيد والدخول"}
      </Button>
    </form>
  );
}

export function AuthOnboardingForm({ business }: { business: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const result = await postJson("/api/auth/onboarding", {
        role: business ? "business" : "individual",
        fullName: String(form.get("fullName") || "").trim(),
        organizationName: String(form.get("organizationName") || "").trim() || undefined,
        commercialRegistration: String(form.get("commercialRegistration") || "").trim() || undefined,
        identityNumber: String(form.get("identityNumber") || "").trim() || undefined,
        city: String(form.get("city") || "").trim(),
        phone: String(form.get("phone") || "").trim(),
        address: String(form.get("address") || "").trim(),
      });
      setMessage(result.message || "تم حفظ البيانات");
      router.push(result.redirect || (business ? "/dashboard/business" : "/dashboard/individual"));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "تعذر حفظ بيانات إعداد الحساب");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-line bg-white/72 p-8 text-right shadow-card">
      <h1 className="font-display text-4xl font-extrabold text-navy">{business ? "إعداد حساب الأعمال" : "إعداد حساب الأفراد"}</h1>
      <p className="mt-3 text-sm font-bold leading-7 text-muted">أكمل البيانات الأساسية لحفظها في الحساب قبل الانتقال إلى لوحة التحكم.</p>
      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {business ? <AuthField name="organizationName" placeholder="اسم المنشأة" icon={Building2} /> : null}
        <AuthField name="fullName" placeholder={business ? "اسم المفوض" : "الاسم الكامل"} icon={UserRound} />
        <AuthField name={business ? "commercialRegistration" : "identityNumber"} placeholder={business ? "رقم السجل التجاري" : "رقم الهوية"} icon={FileText} />
        <AuthField name="city" placeholder="المدينة" icon={Building2} />
        <AuthField name="phone" placeholder="رقم الجوال" icon={Phone} />
        <AuthField name="address" placeholder="العنوان المختصر" icon={Building2} required={false} />
      </div>
      <div className="mt-5 rounded-md border border-[#ece1d8] bg-[#fffdfa] p-4 text-sm font-bold text-muted">
        <div className="flex items-center gap-2 text-[#1D1916]">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          سيتم حفظ البيانات في ملف الحساب وتسجيل العملية في سجل النشاط.
        </div>
      </div>
      {message ? <p className="mt-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs font-extrabold text-green-700">{message}</p> : null}
      {error ? <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-700">{error}</p> : null}
      <Button type="submit" disabled={loading} className="mt-7 h-14 w-full bg-gold text-sm font-extrabold text-white shadow-[0_16px_34px_rgb(167_129_94/0.20)] hover:bg-[#8F6B4C]">
        {loading ? <Loader2 className="animate-spin" data-icon="inline-start" /> : null}
        {loading ? "جار الحفظ..." : "إكمال الإعداد"}
      </Button>
    </form>
  );
}
