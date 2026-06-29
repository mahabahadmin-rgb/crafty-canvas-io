import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  UserRound,
} from "lucide-react";
import { AuthLoginForm, AuthOnboardingForm, AuthRegisterForm, AuthVerifyForm } from "@/components/auth/auth-client-forms";
import { Card, CardContent } from "@/components/ui/card";

type AuthKind =
  | "login"
  | "register"
  | "register-individual"
  | "register-business"
  | "account-type"
  | "verify"
  | "onboarding-individual"
  | "onboarding-business";

const individualFeatures = ["إضافة أصل عقاري", "استعراض المساهمات", "طلب خدمة عقارية", "متابعة الطلبات"];
const businessFeatures = ["إضافة أصل عقاري", "إضافة مساهمة عقارية", "طلب خدمة عقارية", "إدارة المنشأة"];
const authPanelHeight = { minHeight: "calc(100dvh - 2rem)" } satisfies CSSProperties;

function AuthArtwork() {
  return (
    <div className="relative hidden overflow-hidden bg-muted lg:block" style={authPanelHeight}>
      <Image
        src="/images/auth-side-architecture.png"
        alt=""
        fill
        priority
        className="object-cover object-[42%_50%]"
        sizes="36vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1D1916]/52 via-transparent to-[#F6F4F1]/8" />
      <div className="absolute bottom-8 right-8 max-w-sm text-right text-white">
        <p className="text-sm font-extrabold text-white/76">منصة مهابة</p>
        <h2 className="mt-2 font-display text-4xl font-extrabold leading-tight">دخول هادئ لإدارة أصولك العقارية</h2>
      </div>
    </div>
  );
}

function AuthShell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden bg-[linear-gradient(135deg,#f7f4ef_0%,#efe7dd_44%,#d9d1c7_100%)] px-3 py-4 sm:px-5 lg:px-6">
      <div className="mx-auto flex w-full max-w-[95rem]" style={authPanelHeight}>
        <Card className="w-full overflow-hidden border-line/80 bg-white/82 p-0 shadow-[0_30px_90px_rgb(29_25_22/0.12)] backdrop-blur" style={authPanelHeight}>
          <CardContent className={`grid p-0 ${wide ? "lg:grid-cols-[1.24fr_0.76fr]" : "lg:grid-cols-[1.08fr_0.92fr]"}`} style={authPanelHeight}>
            <section className="flex flex-col justify-center overflow-y-auto p-6 sm:p-8 lg:p-10 xl:p-12" style={authPanelHeight}>
              <nav className="mb-8 text-right text-xs font-bold text-muted-foreground">
                <Link href="/" className="hover:text-gold">الرئيسية</Link>
                <span className="mx-2 text-gold">›</span>
                <span>الحساب</span>
              </nav>
              {children}
            </section>
            <AuthArtwork />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export function AuthPage({ kind, nextPath }: { kind: AuthKind; nextPath?: string }) {
  if (kind === "login") return <LoginPage nextPath={nextPath} />;
  if (kind === "verify") return <VerifyPage />;
  if (kind === "register" || kind === "account-type") return <RegisterTypePage />;
  if (kind === "onboarding-individual" || kind === "onboarding-business") return <OnboardingPage business={kind === "onboarding-business"} />;
  if (kind === "register-business") return <RegisterPage active="business" />;
  return <RegisterPage active="individual" />;
}

function RegisterTypeCard({ business }: { business: boolean }) {
  const href = business ? "/auth/register/business" : "/auth/register/individual";
  const title = business ? "حساب الأعمال" : "حساب الأفراد";
  const features = business ? businessFeatures : individualFeatures;
  const Icon = business ? Building2 : UserRound;
  const cta = business ? "إنشاء حساب أعمال" : "إنشاء حساب أفراد";
  return (
    <article className="rounded-lg border border-line bg-white/72 p-6 text-right shadow-[0_12px_26px_rgb(24_23_21/0.035)]">
      <div className="grid gap-5 sm:grid-cols-[1fr_110px]">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-[#1D1916]">{title}</h2>
          <ul className="mt-4 grid gap-2 text-sm font-bold text-muted">
            {features.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#A7815E]" />
                {item}
              </li>
            ))}
          </ul>
          <Link href={href} className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-[#A7815E] px-7 text-sm font-extrabold text-white">
            {cta}
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid h-28 w-28 place-items-center rounded-full border border-[#A7815E]/18 bg-[#f8efe7] text-[#A7815E]">
          <Icon className="h-16 w-16 stroke-[1.25]" />
        </div>
      </div>
    </article>
  );
}

function RegisterTypePage() {
  return (
    <AuthShell wide>
      <div className="text-right">
        <h1 className="font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl">إنشاء حساب جديد</h1>
        <p className="mt-3 max-w-2xl text-sm font-bold leading-7 text-muted-foreground">
          اختر نوع الحساب ثم أكمل البيانات الأساسية للانتقال إلى لوحة التحكم المناسبة.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <RegisterTypeCard business={false} />
        <RegisterTypeCard business />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <span className="text-sm font-extrabold text-navy">لديك حساب بالفعل؟</span>
        <Link href="/auth/login" className="text-sm font-extrabold text-[#8F6B4C] underline underline-offset-4">
          تسجيل الدخول
        </Link>
      </div>
    </AuthShell>
  );
}

function RegisterForm({ business }: { business: boolean }) {
  return <AuthRegisterForm business={business} />;
}

function RegisterPage({ active }: { active: "individual" | "business" }) {
  return (
    <AuthShell wide>
      <RegisterForm business={active === "business"} />
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <span className="text-sm font-extrabold text-navy">لديك حساب بالفعل؟</span>
        <Link href="/auth/login" className="text-sm font-extrabold text-[#8F6B4C] underline underline-offset-4">
          تسجيل الدخول
        </Link>
      </div>
    </AuthShell>
  );
}

function LoginPage({ nextPath }: { nextPath?: string }) {
  return (
    <AuthShell>
      <AuthLoginForm nextPath={nextPath} />
    </AuthShell>
  );
}

function VerifyPage() {
  return (
    <AuthShell>
      <div className="mx-auto w-full max-w-xl">
        <AuthVerifyForm />
      </div>
    </AuthShell>
  );
}

function OnboardingPage({ business }: { business: boolean }) {
  return (
    <AuthShell wide>
      <div className="mx-auto w-full max-w-3xl">
        <AuthOnboardingForm business={business} />
      </div>
    </AuthShell>
  );
}
