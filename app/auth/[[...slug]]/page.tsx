import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthPage } from "@/components/auth/auth-pages";

export const metadata: Metadata = {
  title: "الدخول إلى مهابة",
  description: "واجهات دخول وتسجيل ثابتة للوحة تحكم مهابة.",
};

type PageProps = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function safeNextPath(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate) return undefined;
  if (!candidate.startsWith("/dashboard/")) return undefined;
  if (candidate.startsWith("//") || candidate.includes("://")) return undefined;
  return candidate;
}

export default async function AuthRoutePage({ params, searchParams }: PageProps) {
  const { slug = [] } = await params;
  const resolvedSearchParams = await searchParams;
  const nextPath = safeNextPath(resolvedSearchParams.next);
  const path = slug.join("/") || "login";
  if (path === "login") return <AuthPage kind="login" nextPath={nextPath} />;
  if (path === "register") return <AuthPage kind="register" />;
  if (path === "register/individual") return <AuthPage kind="register-individual" />;
  if (path === "register/business") return <AuthPage kind="register-business" />;
  if (path === "account-type") return <AuthPage kind="account-type" />;
  if (path === "verify") return <AuthPage kind="verify" />;
  if (path === "onboarding/individual") return <AuthPage kind="onboarding-individual" />;
  if (path === "onboarding/business") return <AuthPage kind="onboarding-business" />;
  notFound();
}
