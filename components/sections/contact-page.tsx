"use client";

import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import {
  Building2,
  Globe2,
  Handshake,
  Headphones,
  Loader2,
  Mail,
  MapPin,
  MessageCircleQuestion,
  Phone,
  Send,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import { FinalCTA } from "@/components/sections/final-cta";

const contactCards = [
  { title: "الجوال", value: "0510515010", icon: Phone },
  { title: "البريد الإلكتروني", value: "info@mahabah.sa", icon: Mail },
  { title: "الموقع الإلكتروني", value: "mahabah.sa", icon: Globe2 },
  { title: "المملكة العربية السعودية", value: "الرياض", icon: MapPin },
];

const helpCards = [
  { title: "استفسار عن أصل عقاري", copy: "إرسال بيانات الأصل العقاري وسيقوم فريقنا بدراسته والتواصل معك.", icon: Building2 },
  { title: "استفسار عن مساهمة عقارية", copy: "توضيح حالة المساهمات العقارية والإجراءات النظامية المتبعة.", icon: TrendingUp },
  { title: "طلب خدمة عقارية", copy: "اطلب خدمة إدارة أو تقييم أو دراسة للسوق أو أصل عقاري.", icon: Settings },
  { title: "التعاون والشراكات", copy: "نرحب بفرص التعاون والشراكة مع الشركات والمستثمرين والجهات.", icon: Handshake },
  { title: "الدعم الفني", copy: "للمساعدة في الخدمات الرقمية أو المنصة الإلكترونية.", icon: Headphones },
  { title: "الاستفسارات العامة", copy: "جميع الاستفسارات العامة نستقبلها ويتم التعامل معها بسرعة.", icon: MessageCircleQuestion },
];

const digitalChannels = [
  { title: "البريد الإلكتروني", value: "info@mahabah.sa", icon: Mail },
  { title: "LinkedIn", value: "Mahabah Contrib", icon: Users },
  { title: "منصة X", value: "@mahabah_contrib", icon: Globe2 },
  { title: "الموقع الإلكتروني", value: "mahabah.sa", icon: Globe2 },
];

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

export function ContactPageContent() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData(formElement);
      const response = await fetch("/api/contact", { method: "POST", body: formData });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(apiErrorMessage(payload, "تعذر إرسال الرسالة. الرجاء مراجعة البيانات والمحاولة مرة أخرى."));
        return;
      }
      if (isUnpersistedMutation(payload)) {
        setError(apiErrorMessage(payload, "تعذر حفظ الرسالة في قاعدة البيانات."));
        return;
      }

      setSent(true);
      formElement.reset();
    } catch (error) {
      setError(error instanceof Error ? error.message : "تعذر إرسال الرسالة حالياً.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="section-compact">
        <div className="container-page">
          <div className="grid min-h-[360px] items-center overflow-hidden rounded-lg border border-line bg-white/66 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative min-h-[310px] lg:min-h-[360px]">
              <Image src="/images/knowledge-library.png" alt="" fill priority className="object-cover grayscale-[18%] sepia-[14%]" sizes="55vw" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#F6F4F1]/68" />
            </div>
            <header className="p-8 text-right lg:p-12">
              <nav className="mb-5 text-xs font-bold text-muted">
                <Link href="/" className="hover:text-gold">الرئيسية</Link>
                <span className="mx-2 text-gold">›</span>
                <span>تواصل معنا</span>
              </nav>
              <h1 className="font-display text-5xl font-extrabold leading-tight text-[#1D1916]">تواصل معنا</h1>
              <p className="mt-5 max-w-xl text-base font-bold leading-8 text-muted">
                نسعد باستقبال استفساراتك ومشاركاتك المتعلقة بالأصول العقارية والمساهمات العقارية والخدمات العقارية.
              </p>
              <div className="mt-7 flex flex-wrap justify-end gap-3">
                <Link href="/submit-asset" className="inline-flex h-12 items-center gap-2 rounded-md bg-[#A7815E] px-7 text-sm font-extrabold text-white">
                  إضافة أصل عقاري
                  <Building2 className="h-4 w-4" />
                </Link>
                <Link href="/request-study" className="inline-flex h-12 items-center gap-2 rounded-md border border-[#A7815E]/50 bg-white px-7 text-sm font-extrabold text-[#8F6B4C]">
                  طلب خدمة عقارية
                  <Settings className="h-4 w-4" />
                </Link>
              </div>
            </header>
          </div>
        </div>
      </section>

      <section className="section-compact pt-0">
        <div className="container-page grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {contactCards.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="grid min-h-28 grid-cols-[1fr_56px] items-center gap-4 rounded-lg border border-line bg-white/72 p-5 text-right">
                <div>
                  <h2 className="font-display text-base font-extrabold text-navy">{item.title}</h2>
                  <p className="mt-2 text-sm font-bold text-muted">{item.value}</p>
                </div>
                <Icon className="h-11 w-11 stroke-[1.35] text-[#A7815E]" />
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-compact pt-0">
        <div className="container-page">
          <form onSubmit={onSubmit} className="rounded-lg border border-line bg-white/72 p-6 text-right shadow-[0_12px_26px_rgb(24_23_21/0.035)]">
            <h2 className="font-display text-3xl font-extrabold text-navy">نموذج التواصل</h2>
            <p className="mt-2 text-sm font-bold leading-7 text-muted">يرجى تعبئة النموذج وسيتواصل معكم فريقنا في أقرب وقت ممكن.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <input required name="fullName" className="h-12 rounded-md border border-line bg-[#fffdfa] px-4 text-sm font-bold outline-none focus:border-gold" placeholder="الاسم الكامل" />
              <input required name="mobile" className="h-12 rounded-md border border-line bg-[#fffdfa] px-4 text-sm font-bold outline-none focus:border-gold" placeholder="رقم الجوال" />
              <input required name="email" type="email" className="h-12 rounded-md border border-line bg-[#fffdfa] px-4 text-sm font-bold outline-none focus:border-gold" placeholder="البريد الإلكتروني" />
              <select name="inquiryType" defaultValue="" className="h-12 rounded-md border border-line bg-[#fffdfa] px-4 text-sm font-bold outline-none focus:border-gold md:col-span-1">
                <option value="" disabled>نوع الطلب</option>
                <option>استفسار عام</option>
                <option>أصل عقاري</option>
                <option>مساهمة عقارية</option>
                <option>خدمة عقارية</option>
                <option>شراكة</option>
                <option>دعم فني</option>
              </select>
              <textarea required name="description" rows={6} className="rounded-md border border-line bg-[#fffdfa] p-4 text-sm font-bold leading-7 outline-none focus:border-gold md:col-span-2" placeholder="اكتب رسالتك هنا..." />
            </div>
            {sent ? <p className="mt-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-extrabold text-green-700">تم إرسال الرسالة بنجاح.</p> : null}
            {error ? <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-extrabold text-red-700">{error}</p> : null}
            <button disabled={loading} className="mt-5 inline-flex h-12 min-w-64 items-center justify-center gap-2 rounded-md bg-[#A7815E] px-8 text-sm font-extrabold text-white disabled:opacity-60">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              إرسال الرسالة
            </button>
          </form>
        </div>
      </section>

      <section className="section-compact pt-0">
        <div className="container-page">
          <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-navy gold-divider">كيف يمكننا مساعدتك؟</h2>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {helpCards.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-lg border border-line bg-white/72 p-5 text-center">
                  <Icon className="mx-auto h-10 w-10 stroke-[1.35] text-[#A7815E]" />
                  <h3 className="mt-3 font-display text-base font-extrabold text-navy">{item.title}</h3>
                  <p className="mt-2 text-xs font-bold leading-6 text-muted">{item.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-compact pt-0">
        <div className="container-page">
          <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-navy gold-divider">مواقعنا الرقمية</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {digitalChannels.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="grid min-h-24 grid-cols-[1fr_48px] items-center gap-3 rounded-lg border border-line bg-white/72 p-4 text-right">
                  <div>
                    <h3 className="font-display text-base font-extrabold text-navy">{item.title}</h3>
                    <p className="mt-1 text-xs font-bold text-muted">{item.value}</p>
                  </div>
                  <Icon className="h-9 w-9 text-[#A7815E]" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-compact pt-0">
        <div className="container-page grid gap-5 rounded-lg border border-line bg-white/72 p-5 lg:grid-cols-[1fr_330px]">
          <div className="relative min-h-[260px] overflow-hidden rounded-md border border-line bg-[#eee6dc]">
            <Image src="/images/final-cta-map-building.png" alt="" fill className="object-cover opacity-70 grayscale-[20%] sepia-[12%]" sizes="70vw" />
            <div className="absolute inset-0 bg-[#F6F4F1]/42" />
            <MapPin className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 fill-[#8F6B4C] text-[#8F6B4C]" />
          </div>
          <div className="self-center text-right">
            <h2 className="font-display text-3xl font-extrabold text-navy">موقعنا</h2>
            <p className="mt-4 text-sm font-bold leading-8 text-muted">الرياض - المملكة العربية السعودية</p>
            <Link href="https://www.google.com/maps/search/?api=1&query=Riyadh%20Saudi%20Arabia" target="_blank" rel="noreferrer" className="mt-5 inline-flex h-11 items-center gap-2 rounded-md border border-[#A7815E]/50 bg-white px-6 text-xs font-extrabold text-[#8F6B4C]">
              عرض الاتجاهات
              <MapPin className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
