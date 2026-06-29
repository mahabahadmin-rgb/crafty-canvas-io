"use client";

import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  CloudUpload,
  Eye,
  FileText,
  Headphones,
  type LucideIcon,
  Loader2,
  MapPin,
  Send,
  UploadCloud,
} from "lucide-react";

type Mode = "submit" | "study";

const steps = ["بيانات الملكية", "بيانات الأصل", "الموقع", "المرفقات", "المراجعة والإرسال"];
const assetTypes = ["أرض خام", "أرض سكنية", "أرض تجارية", "أرض صناعية", "أصل قائم", "مشروع متعثر"];
const cities = ["الرياض", "جدة", "الدمام", "الخبر", "مكة", "المدينة المنورة"];

type ServiceOption = {
  id: string;
  slug: string;
  titleAr: string;
  descriptionAr: string;
  durationAr: string;
  levelAr: string;
  outputsAr: string;
};

const fallbackServiceOptions: ServiceOption[] = [
  { id: "service-fallback-01", slug: "initial-real-estate-consultation", titleAr: "استشارة عقارية أولية", descriptionAr: "جلسة أولية لفهم الأصل العقاري وتحديد الفرص والتحديات.", durationAr: "1 - 3 أيام عمل", levelAr: "أساسية", outputsAr: "ملخص أولي" },
  { id: "service-fallback-02", slug: "detailed-real-estate-consultation", titleAr: "استشارة عقارية مفصلة", descriptionAr: "تحليل متكامل للأصل أو المشروع العقاري يتضمن التوصيات الاستثمارية والتطويرية.", durationAr: "5 - 10 أيام عمل", levelAr: "متقدمة", outputsAr: "تقرير شامل" },
  { id: "service-fallback-03", slug: "initial-feasibility-study", titleAr: "دراسة جدوى عقارية أولية", descriptionAr: "تقدير سريع للجدوى الاقتصادية وإمكانات التطوير.", durationAr: "3 - 5 أيام عمل", levelAr: "أساسية", outputsAr: "تقرير أولي" },
  { id: "service-fallback-04", slug: "detailed-feasibility-study", titleAr: "دراسة جدوى عقارية مفصلة", descriptionAr: "دراسة مالية وفنية وتسويقية متكاملة للمشروع العقاري.", durationAr: "10 - 15 يوم عمل", levelAr: "متقدمة", outputsAr: "دراسة تفصيلية" },
];

const serviceIconCycle: LucideIcon[] = [Headphones, FileText, ClipboardCheck, Building2, BadgeCheck, UploadCloud];

function serviceIconForIndex(index: number) {
  return serviceIconCycle[index % serviceIconCycle.length] ?? FileText;
}

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

function Field({ label, name, placeholder, type = "text", required = true }: { label: string; name: string; placeholder?: string; type?: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-extrabold text-[#1D1916]">
      {label}
      <input required={required} name={name} type={type} placeholder={placeholder} className="h-12 rounded-md border border-line bg-white px-4 text-sm font-bold outline-none transition placeholder:text-muted/55 focus:border-[#A7815E]" />
    </label>
  );
}

function SelectField({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label className="grid gap-2 text-sm font-extrabold text-[#1D1916]">
      {label}
      <select required name={name} defaultValue="" className="h-12 rounded-md border border-line bg-white px-4 text-sm font-bold outline-none transition focus:border-[#A7815E]">
        <option value="" disabled>اختر</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function UploadBox({ title, required = false, onFilesChanged }: { title: string; required?: boolean; onFilesChanged?: (form: HTMLFormElement | null) => void }) {
  return (
    <label className="grid min-h-[110px] cursor-pointer place-items-center rounded-md border border-dashed border-[#A7815E]/45 bg-white p-4 text-center transition hover:bg-[#fff7ef]">
      <CloudUpload className="h-8 w-8 text-[#A7815E]" />
      <span className="mt-2 text-sm font-extrabold text-[#1D1916]">{title}{required ? " *" : ""}</span>
      <span className="mt-1 text-[11px] font-bold text-muted">JPG, PNG, PDF - الحد الأقصى 10MB</span>
      <input name="files" type="file" className="sr-only" multiple required={required} onChange={(event) => onFilesChanged?.(event.currentTarget.form)} />
    </label>
  );
}

function SuccessState({ mode }: { mode: Mode }) {
  return (
    <section className="section-y">
      <div className="container-page max-w-3xl">
        <div className="rounded-lg border border-line bg-white p-8 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-[#A7815E]" />
          <h1 className="mt-5 font-display text-4xl font-extrabold text-[#1D1916]">{mode === "submit" ? "تم استلام الأصل العقاري بنجاح" : "تم استلام طلب الخدمة بنجاح"}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm font-bold leading-8 text-muted">سيقوم فريق مهابة بمراجعة البيانات والتواصل معك لاستكمال الخطوات التالية.</p>
          <Link href="/" className="mt-6 inline-flex h-11 items-center rounded-md bg-[#A7815E] px-6 text-sm font-extrabold text-white">العودة للرئيسية</Link>
        </div>
      </div>
    </section>
  );
}

function Stepper() {
  return (
    <ol className="grid gap-3 rounded-lg border border-line bg-white/72 p-4 md:grid-cols-5">
      {steps.map((step, index) => (
        <li key={step} className="text-center">
          <span className={`mx-auto grid h-12 w-12 place-items-center rounded-full border text-sm font-black ${index === 0 ? "border-[#A7815E] bg-[#F6EDE4] text-[#8F6B4C]" : "border-line bg-white text-muted"}`}>{String(index + 1).padStart(2, "0")}</span>
          <p className={`mt-2 text-xs font-extrabold ${index === 0 ? "text-[#8F6B4C]" : "text-[#1D1916]"}`}>{step}</p>
        </li>
      ))}
    </ol>
  );
}

function SubmitAssetForm({
  loading,
  error,
  fileCount,
  onFilesChanged,
  onPreview,
}: {
  loading: boolean;
  error: string;
  fileCount: number;
  onFilesChanged: (form: HTMLFormElement | null) => void;
  onPreview: (form: HTMLFormElement | null) => void;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_250px]">
      <div className="space-y-5 rounded-lg border border-line bg-white/78 p-5">
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-extrabold text-[#1D1916]"><Headphones className="h-5 w-5 text-[#A7815E]" /> بيانات التواصل</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="الاسم الكامل *" name="fullName" placeholder="أدخل الاسم الكامل" />
            <Field label="رقم الجوال *" name="mobile" placeholder="05xxxxxxxx" />
            <Field label="البريد الإلكتروني *" name="email" type="email" placeholder="example@domain.com" />
          </div>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-extrabold text-[#1D1916]"><FileText className="h-5 w-5 text-[#A7815E]" /> بيانات الملكية (الصك)</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="رقم الصك *" name="deedNumber" placeholder="أدخل رقم الصك" />
            <Field label="تاريخ الصك *" name="deedDate" type="date" />
            <Field label="مساحة الصك (م²) *" name="area" type="number" placeholder="أدخل مساحة الصك" />
          </div>
          <p className="mt-3 rounded-md bg-[#F6EDE4] px-4 py-3 text-xs font-bold text-[#8F6B4C]">نأمل إدخال رقم الصك وتاريخ الصك بدقة لضمان دراسة أصلك العقاري بشكل صحيح.</p>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-extrabold text-[#1D1916]"><Building2 className="h-5 w-5 text-[#A7815E]" /> بيانات الأصل العقاري</h2>
          <div className="mb-4 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            {assetTypes.map((type, index) => (
              <label key={type} className={`flex h-16 cursor-pointer items-center justify-center rounded-md border px-3 text-center text-xs font-extrabold ${index === 1 ? "border-[#A7815E] bg-[#F6EDE4] text-[#8F6B4C]" : "border-line bg-white text-[#1D1916]"}`}>
                <input className="sr-only" type="radio" name="assetType" value={type} defaultChecked={index === 1} />
                {type}
              </label>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
            <Field label="اسم الأصل (اختياري)" name="assetName" placeholder="أدخل اسم الأصل" required={false} />
            <Field label="وصف الأصل *" name="description" placeholder="أدخل وصفاً مختصراً عن الأصل وميزاته وإمكانات التطوير أو الاستثمار." />
          </div>
          <div className="mt-4 flex flex-wrap gap-4 rounded-md border border-line bg-white p-4 text-sm font-bold text-muted">
            <span className="text-[#1D1916]">الواجهة *</span>
            {["شمالية", "جنوبية", "شرقية", "غربية"].map((side, index) => <label key={side} className="flex items-center gap-2"><input type="radio" name="frontage" defaultChecked={index === 0} className="accent-[#A7815E]" />{side}</label>)}
          </div>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-extrabold text-[#1D1916]"><MapPin className="h-5 w-5 text-[#A7815E]" /> الموقع</h2>
          <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
            <div className="relative min-h-[170px] overflow-hidden rounded-md border border-line bg-[#D9D1C7]">
              <Image src="/images/knowledge-library.png" alt="" fill className="object-cover opacity-65 grayscale-[8%] sepia-[8%]" sizes="45vw" />
              <MapPin className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 fill-[#A7815E] text-[#A7815E]" />
            </div>
            <div className="grid gap-4">
              <SelectField label="المدينة *" name="city" options={cities} />
              <Field label="الحي *" name="district" placeholder="اختر الحي" />
              <Field label="رابط الموقع (اختياري)" name="mapUrl" placeholder="https://maps.google.com" required={false} />
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-extrabold text-[#1D1916]"><UploadCloud className="h-5 w-5 text-[#A7815E]" /> المرفقات</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <UploadBox title="صورة الصك" required onFilesChanged={onFilesChanged} />
            <UploadBox title="مخطط الأرض" onFilesChanged={onFilesChanged} />
            <UploadBox title="صور الأصل" onFilesChanged={onFilesChanged} />
            <UploadBox title="ملفات إضافية" onFilesChanged={onFilesChanged} />
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-extrabold text-[#1D1916]"><BadgeCheck className="h-5 w-5 text-[#A7815E]" /> المراجعة والإرسال</h2>
          <label className="flex items-start gap-3 text-sm font-bold leading-7 text-muted"><input required type="checkbox" className="mt-1 accent-[#A7815E]" />أقر أن جميع البيانات المدخلة صحيحة.</label>
          <label className="mt-2 flex items-start gap-3 text-sm font-bold leading-7 text-muted"><input required type="checkbox" className="mt-1 accent-[#A7815E]" />أوافق على الشروط والأحكام وسياسة الخصوصية.</label>
        </section>

        {error ? <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}

        <div className="grid gap-3 md:grid-cols-3">
          <button disabled={loading} type="submit" name="intent" value="draft" className="h-12 rounded-md border border-[#A7815E]/45 bg-white text-sm font-extrabold text-[#8F6B4C] disabled:opacity-60">حفظ كمسودة</button>
          <button type="button" onClick={(event) => onPreview(event.currentTarget.form)} className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-[#A7815E]/45 bg-white text-sm font-extrabold text-[#8F6B4C]"><Eye className="h-4 w-4" /> معاينة الطلب</button>
          <button disabled={loading} type="submit" name="intent" value="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#A7815E] text-sm font-extrabold text-white disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {loading ? "جاري الإرسال" : "إرسال للمراجعة"}
          </button>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-lg border border-line bg-white/78 p-5">
          <h2 className="font-display text-xl font-extrabold text-[#1D1916]">ملخص الطلب</h2>
          {["بيانات الملكية", "بيانات الأصل", "الموقع", "المرفقات"].map((item) => <p key={item} className="mt-3 border-b border-line pb-2 text-sm font-bold text-muted">- {item}</p>)}
          <p className="mt-3 text-sm font-bold text-muted">عدد الملفات <span className="text-[#1D1916]">{fileCount}</span></p>
        </div>
        <div className="rounded-lg border border-line bg-white/78 p-5">
          <h2 className="font-display text-xl font-extrabold text-[#1D1916]">لماذا إضافة الأصل عبر مهابة؟</h2>
          {["دراسة الجدوى", "الهيكلة والتنظيم", "الحوكمة والامتثال", "تعظيم القيمة", "الوصول للمستثمرين"].map((item) => <p key={item} className="mt-3 text-sm font-bold text-muted">• {item}</p>)}
        </div>
      </aside>
    </div>
  );
}

function StudyForm({
  loading,
  error,
  fileCount,
  services,
  servicesLoading,
  onFilesChanged,
  onPreview,
}: {
  loading: boolean;
  error: string;
  fileCount: number;
  services: ServiceOption[];
  servicesLoading: boolean;
  onFilesChanged: (form: HTMLFormElement | null) => void;
  onPreview: (form: HTMLFormElement | null) => void;
}) {
  return (
    <div className="space-y-7">
      <section>
        <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">اختر الخدمة العقارية</h2>
        {servicesLoading ? <p className="mb-4 rounded-md border border-line bg-white/72 px-4 py-3 text-center text-xs font-extrabold text-muted">جاري تحميل الخدمات العقارية...</p> : null}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {services.map((service, index) => {
            const Icon = serviceIconForIndex(index);
            return (
              <label key={service.id} className={`cursor-pointer rounded-lg border bg-white/78 p-5 text-center shadow-[0_10px_24px_rgb(29_25_22/0.035)] ${index === 1 ? "border-[#A7815E] bg-[#F6EDE4]" : "border-line"}`}>
                <input className="sr-only" type="radio" name="serviceType" value={service.titleAr} defaultChecked={index === 1} />
                <span className="block text-right font-display text-lg font-black text-[#A7815E]">{String(index + 1).padStart(2, "0")}</span>
                <Icon className="mx-auto mt-2 h-10 w-10 text-[#A7815E]" />
                <span className="mt-3 block font-display text-base font-extrabold leading-7 text-[#1D1916]">{service.titleAr}</span>
                <span className="mt-2 block min-h-[58px] text-xs font-bold leading-6 text-muted">{service.descriptionAr}</span>
              </label>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_260px]">
        <div className="rounded-lg border border-line bg-white/78 p-5">
          <h2 className="mb-4 text-right font-display text-2xl font-extrabold text-[#1D1916]">بيانات الطلب</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="عنوان الطلب" name="fullName" placeholder="اكتب عنوان الطلب" />
            <SelectField label="المدينة" name="city" options={cities} />
            <Field label="رقم الجوال" name="mobile" placeholder="05xxxxxxxx" />
            <Field label="البريد الإلكتروني" name="email" type="email" placeholder="example@domain.com" />
            <Field label="مساحة الأصل (م²)" name="area" type="number" placeholder="2500" />
            <SelectField label="نوع الأصل" name="assetType" options={assetTypes} />
            <label className="grid gap-2 text-sm font-extrabold text-[#1D1916] md:col-span-2">
              وصف الطلب
              <textarea name="description" required rows={5} placeholder="اكتب وصفاً مختصراً عن طلبك والأهداف التي ترغب بتحقيقها..." className="rounded-md border border-line bg-white p-4 text-sm font-bold outline-none focus:border-[#A7815E]" />
            </label>
          </div>

          <h2 className="mb-4 mt-6 text-right font-display text-2xl font-extrabold text-[#1D1916]">المرفقات</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <UploadBox title="مستندات الطلب" onFilesChanged={onFilesChanged} />
            <UploadBox title="المخططات" onFilesChanged={onFilesChanged} />
            <UploadBox title="الصك" onFilesChanged={onFilesChanged} />
            <UploadBox title="ملفات إضافية" onFilesChanged={onFilesChanged} />
          </div>

          {error ? <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <button disabled={loading} type="submit" name="intent" value="draft" className="h-12 rounded-md border border-[#A7815E]/45 bg-white text-sm font-extrabold text-[#8F6B4C] disabled:opacity-60">حفظ كمسودة</button>
            <button type="button" onClick={(event) => onPreview(event.currentTarget.form)} className="h-12 rounded-md border border-[#A7815E]/45 bg-white text-sm font-extrabold text-[#8F6B4C]">معاينة الطلب</button>
            <button disabled={loading} type="submit" name="intent" value="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#A7815E] text-sm font-extrabold text-white disabled:opacity-60">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} إرسال الطلب</button>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-line bg-white/78 p-5 text-right">
            <h2 className="font-display text-xl font-extrabold text-[#1D1916]">ملخص الطلب</h2>
            <p className="mt-3 text-sm font-bold text-muted">الخدمة المختارة</p>
            <p className="font-display text-lg font-extrabold text-[#A7815E]">استشارة عقارية مفصلة</p>
            <p className="mt-3 text-sm font-bold text-muted">عدد المرفقات <span className="text-[#1D1916]">{fileCount}</span></p>
          </div>
        </aside>
      </section>

      <section>
        <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">ماذا يحدث بعد الإرسال؟</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {["مراجعة الطلب", "إسناد الطلب لمزود الخدمة المعتمد", "بدء التنفيذ والمتابعة"].map((title) => <article key={title} className="rounded-lg border border-line bg-white/72 p-5 text-center"><ClipboardCheck className="mx-auto h-10 w-10 text-[#A7815E]" /><h3 className="mt-3 font-display text-lg font-extrabold text-[#1D1916]">{title}</h3></article>)}
        </div>
      </section>
    </div>
  );
}

export function FormPage({ mode }: { mode: Mode }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileCount, setFileCount] = useState(0);
  const [services, setServices] = useState<ServiceOption[]>(fallbackServiceOptions);
  const [servicesLoading, setServicesLoading] = useState(mode === "study");
  const isSubmit = mode === "submit";

  useEffect(() => {
    if (mode !== "study") return;
    let active = true;

    async function loadServices() {
      setServicesLoading(true);
      try {
        const response = await fetch("/api/services", { headers: { Accept: "application/json" } });
        const payload = (await response.json()) as { services?: ServiceOption[] };
        if (active && response.ok && payload.services?.length) {
          setServices(payload.services);
        }
      } catch {
        // Keep the built-in fallback so the form remains usable if the catalog endpoint is unavailable.
      } finally {
        if (active) setServicesLoading(false);
      }
    }

    void loadServices();
    return () => {
      active = false;
    };
  }, [mode]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setPreviewOpen(false);
    updateFileCount(formElement);
    setLoading(true);
    setError("");
    try {
      const response = await fetch(isSubmit ? "/api/submit-asset" : "/api/request-study", {
        method: "POST",
        body: new FormData(formElement),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        setError(apiErrorMessage(payload, "تعذر إرسال الطلب. الرجاء مراجعة البيانات."));
        return;
      }
      if (isUnpersistedMutation(payload)) {
        setError(apiErrorMessage(payload, "تعذر حفظ الطلب في قاعدة البيانات."));
        return;
      }
      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "تعذر إرسال الطلب حالياً.");
    } finally {
      setLoading(false);
    }
  }

  function updateFileCount(form: HTMLFormElement | null) {
    if (!form) {
      setFileCount(0);
      return;
    }

    const count = Array.from(form.querySelectorAll<HTMLInputElement>('input[type="file"][name="files"]'))
      .reduce((total, input) => total + (input.files?.length ?? 0), 0);
    setFileCount(count);
  }

  function openPreview(form: HTMLFormElement | null) {
    if (!form?.reportValidity()) return;
    updateFileCount(form);
    setPreviewOpen(true);
  }

  if (success) return <SuccessState mode={mode} />;

  return (
    <>
      <section className="section-compact">
        <div className="container-page">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[390px] overflow-hidden">
              <Image src="/images/hero-full-cover.png" alt="" fill priority className="object-contain object-left-bottom" sizes="52vw" />
            </div>
            <div className="text-right">
              <nav className="mb-4 text-xs font-bold text-muted"><Link href="/">الرئيسية</Link><span className="mx-2 text-[#A7815E]">›</span>{isSubmit ? "إضافة أصل عقاري" : "طلب خدمة عقارية"}</nav>
              <h1 className="font-display text-[clamp(2.2rem,4.2vw,4.25rem)] font-black leading-[1.35] text-[#1D1916]">{isSubmit ? "إضافة أصل عقاري" : "طلب خدمة عقارية"}</h1>
              <p className="mt-4 font-display text-2xl font-extrabold leading-10 text-[#A7815E]">
                {isSubmit ? "ابدأ رحلة تطوير أصلك العقاري وتحويله إلى فرصة استثمارية أو مساهمة عقارية منظمة." : "اختر الخدمة العقارية المناسبة واحصل على دعم متخصص من مزودي خدمات معتمدين."}
              </p>
              <p className="mt-3 max-w-xl text-sm font-bold leading-8 text-muted">
                {isSubmit ? "أدخل بيانات الأصل العقاري وسيتولى فريق مهابة دراسة وتحليل فرص التطوير والاستثمار." : "املأ بيانات الطلب وسيقوم فريق مهابة بتوجيهك إلى المسار المناسب."}
              </p>
            </div>
          </div>

          <div className="mt-6">{isSubmit ? <Stepper /> : <Stepper />}</div>
        </div>
      </section>

      <section className="section-compact">
        <div className="container-page">
          <form onSubmit={onSubmit}>
            {previewOpen ? (
              <div className="mb-4 rounded-lg border border-[#A7815E]/35 bg-[#F6EDE4] px-5 py-4 text-right text-sm font-bold leading-7 text-[#8F6B4C]">
                المعاينة جاهزة. راجع البيانات الظاهرة في النموذج والملخص الجانبي قبل الإرسال أو حفظ المسودة.
              </div>
            ) : null}
            {isSubmit ? (
              <SubmitAssetForm
                loading={loading}
                error={error}
                fileCount={fileCount}
                onFilesChanged={updateFileCount}
                onPreview={openPreview}
              />
            ) : (
              <StudyForm
                loading={loading}
                error={error}
                fileCount={fileCount}
                services={services}
                servicesLoading={servicesLoading}
                onFilesChanged={updateFileCount}
                onPreview={openPreview}
              />
            )}
          </form>
        </div>
      </section>

      {isSubmit ? (
        <section className="section-compact">
          <div className="container-page">
            <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[#1D1916] gold-divider">ماذا يحدث بعد الإرسال؟</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { title: "مراجعة البيانات", icon: ClipboardCheck, copy: "يقوم فريق مهابة بمراجعة البيانات والتأكد من اكتمالها." },
                { title: "تحليل الأصل", icon: Building2, copy: "يتم دراسة الأصل وتحليل فرص التطوير والاستثمار المتاحة." },
                { title: "التواصل معك", icon: Headphones, copy: "يتواصل معك فريق مهابة لمناقشة النتائج والخطوات التالية." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-lg border border-line bg-white/72 p-5 text-center">
                    <Icon className="mx-auto h-10 w-10 text-[#A7815E]" />
                    <h3 className="mt-3 font-display text-lg font-extrabold text-[#1D1916]">{item.title}</h3>
                    <p className="mt-2 text-xs font-bold leading-7 text-muted">{item.copy}</p>
                  </article>
                );
              })}
            </div>

            <div className="relative mt-8 overflow-hidden rounded-lg border border-line bg-[#F6F4F1] p-6 text-center">
              <Image src="/images/final-cta-map-building.png" alt="" fill className="object-cover opacity-25 grayscale-[8%] sepia-[8%]" sizes="100vw" />
              <div className="relative z-10">
                <h2 className="font-display text-3xl font-extrabold text-[#1D1916]">تحتاج مساعدة في إضافة الأصل؟</h2>
                <p className="mx-auto mt-2 max-w-2xl text-sm font-bold leading-8 text-muted">فريق مهابة جاهز لمساعدتك في إدخال بيانات الأصل والإجابة على استفساراتك.</p>
                <Link href="/contact" className="mt-4 inline-flex h-11 items-center gap-2 rounded-md bg-[#A7815E] px-7 text-sm font-extrabold text-white"><Headphones className="h-4 w-4" /> تواصل معنا</Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
