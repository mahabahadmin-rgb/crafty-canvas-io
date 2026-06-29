"use client";

import { useRef, useState, type ChangeEvent, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import type {
  DashboardAccountSettingsKind,
  DashboardAccountSettingsPayloadValue,
  DashboardAccountSettingsScope,
  DashboardAdminAccountKind,
  DashboardAdminAccountStatus,
  DashboardAdminContentCommentStatus,
  DashboardAdminContentStatus,
  DashboardAdminManagementAction,
  DashboardAdminProviderStatus,
  DashboardDocumentScope,
  DashboardEntityRequestKind,
  DashboardEntityRequestMode,
  DashboardEntityRequestScope,
  DashboardVerificationRequestMode,
  DashboardVerificationRequestScope,
} from "@/lib/supabase/mahabah";

type InterestEntityType = "asset" | "contribution";
type ReviewEntityType = InterestEntityType | "service_request" | "verification_request";
type ReviewDecision = "approved" | "needs_changes" | "rejected";
type VerificationPayloadValue = string | number | boolean | null;
type RequestPayloadValue = string | number | boolean | null;
type AdminManagementPayloadValue = string | number | boolean | null | undefined;

type ActionState = "idle" | "saving" | "saved" | "error";
type UploadState = "idle" | "uploading" | "uploaded" | "error";
type DashboardAdminInvoiceStatus = "draft" | "due" | "paid" | "overdue" | "cancelled";
type DashboardAdminPaymentStatus = "pending" | "succeeded" | "failed" | "refunded";
type DashboardAdminSubscriptionStatus = "active" | "pending" | "expired" | "cancelled";
type AdminManagementStatus = DashboardAdminProviderStatus | DashboardAdminContentStatus | DashboardAdminContentCommentStatus | DashboardAdminInvoiceStatus | DashboardAdminPaymentStatus | DashboardAdminSubscriptionStatus;
type DashboardRequestResponse = {
  id?: string;
  kind?: DashboardEntityRequestKind;
  status?: DashboardEntityRequestMode;
};
const MAX_DOCUMENT_UPLOAD_BYTES = 10 * 1024 * 1024;

class DashboardActionError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "DashboardActionError";
    this.status = status;
  }
}

function dashboardApiErrorMessage(data: unknown, fallback = "request_failed") {
  if (!data || typeof data !== "object") return fallback;
  const record = data as { error?: unknown; detail?: unknown; code?: unknown; details?: unknown; hint?: unknown; message?: unknown };
  const parts = [record.error, record.detail, record.code, record.details, record.hint, record.message]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0);
  return parts.length ? Array.from(new Set(parts)).join(" - ") : fallback;
}

function isUnpersistedMutation(data: unknown) {
  return Boolean(data && typeof data === "object" && (data as { persisted?: unknown }).persisted === false);
}

function isAdminManagementStatus(value: string | undefined): value is AdminManagementStatus {
  return Boolean(value && ["pending", "approved", "rejected", "published", "draft", "review", "archived", "due", "paid", "overdue", "cancelled", "succeeded", "failed", "refunded", "active", "expired"].includes(value));
}

function dashboardPayloadContainer(button: HTMLButtonElement | null): HTMLFormElement | HTMLElement | null {
  return button?.closest("form") ?? button?.closest<HTMLElement>("[data-dashboard-form]") ?? null;
}

function reportDashboardContainerValidity(container: HTMLFormElement | HTMLElement | null) {
  if (!container) return true;
  if (container instanceof HTMLFormElement) return container.reportValidity();

  const fields = Array.from(container.querySelectorAll("input, textarea, select"));
  for (const element of fields) {
    if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) continue;
    if (!element.checkValidity()) {
      element.reportValidity();
      return false;
    }
  }
  return true;
}

function collectNamedFormPayload(button: HTMLButtonElement | null): Record<string, AdminManagementPayloadValue> {
  const container = dashboardPayloadContainer(button);
  if (!container) return {};

  const payload: Record<string, AdminManagementPayloadValue> = {};
  Array.from(container.querySelectorAll("input, textarea, select")).forEach((element) => {
    if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) return;
    if (!element.name || element.disabled) return;

    if (element instanceof HTMLInputElement && element.type === "checkbox") {
      payload[element.name] = element.checked;
      return;
    }

    if (element instanceof HTMLInputElement && element.type === "number") {
      const value = parseLocalizedNumber(element.value);
      payload[element.name] = Number.isFinite(value) ? value : undefined;
      return;
    }

    payload[element.name] = element.value.trim();
  });
  return payload;
}

function collectVerificationFormPayload(button: HTMLButtonElement | null): Record<string, VerificationPayloadValue> {
  const collected = collectNamedFormPayload(button);
  return Object.fromEntries(
    Object.entries(collected).filter((entry): entry is [string, VerificationPayloadValue] => typeof entry[1] !== "undefined"),
  );
}

function sanitizeAccountSettingsPayload(kind: DashboardAccountSettingsKind, payload: Record<string, AdminManagementPayloadValue>): Record<string, DashboardAccountSettingsPayloadValue> {
  const next = { ...payload };
  if (kind === "security") {
    const passwordFieldsComplete = Boolean(next.currentPassword && next.newPassword && next.confirmPassword);
    if (passwordFieldsComplete) {
      next.passwordRotationRequested = true;
      next.passwordFieldsSubmitted = true;
    } else if (!next.currentPassword) {
      delete next.currentPassword;
      delete next.newPassword;
      delete next.confirmPassword;
    }
  }
  return Object.fromEntries(
    Object.entries(next).filter((entry): entry is [string, DashboardAccountSettingsPayloadValue] => typeof entry[1] !== "undefined"),
  );
}

async function postJson<T>(url: string, payload: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new DashboardActionError(dashboardApiErrorMessage(data), response.status);
  if (isUnpersistedMutation(data)) throw new DashboardActionError(dashboardApiErrorMessage(data, "mutation_not_persisted"), 409);
  return data as T;
}

function redirectToLogin(router: ReturnType<typeof useRouter>) {
  const next = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/dashboard/individual";
  router.push(`/auth/login?next=${encodeURIComponent(next)}`);
}

function handleAuthError(error: unknown, router: ReturnType<typeof useRouter>) {
  if (error instanceof DashboardActionError && error.status === 401) {
    redirectToLogin(router);
    return true;
  }
  return false;
}

function dashboardRequestResultHref(scope: DashboardEntityRequestScope, kind: DashboardEntityRequestKind, id?: string) {
  const base = `/dashboard/${scope}`;
  if (!id) {
    if (kind === "asset") return `${base}/${scope === "business" ? "company-assets" : "my-assets"}`;
    if (kind === "contribution") return `${base}/${scope === "business" ? "company-contributions" : "browse-contributions"}`;
    return `${base}/my-requests`;
  }
  const encoded = encodeURIComponent(id);
  if (kind === "asset") return `${base}/asset-details?asset=${encoded}`;
  if (kind === "contribution") return `${base}/contribution-details?contribution=${encoded}`;
  return `${base}/service-details?request=${encoded}`;
}

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function formNumber(formData: FormData, key: string) {
  const value = formString(formData, key);
  if (!value) return undefined;
  const parsed = parseLocalizedNumber(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseLocalizedNumber(value: string) {
  const normalized = value
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replaceAll(",", "")
    .replace(/[^\d.-]/g, "");
  return Number(normalized);
}

function addPayloadValue(payload: Record<string, RequestPayloadValue>, key: string, value: RequestPayloadValue | undefined) {
  if (value === undefined || value === "") return;
  payload[key] = value;
}

function adminSettingsSlugFromPayload(slug: string | undefined, title: string | undefined, payload: Record<string, AdminManagementPayloadValue>) {
  if (payload.section !== "subscription_plans") return slug;

  const name = String(payload.title ?? payload.name ?? title ?? "new").trim();
  if (!name || name === "new") return slug || "subscription-plan-new";
  const normalized = name
    .toLowerCase()
    .replaceAll(/\s+/g, "-")
    .replaceAll(/[^\u0600-\u06FFa-z0-9-]/g, "")
    .replaceAll(/-+/g, "-")
    .replaceAll(/^-|-$/g, "");
  return `subscription-plan-${normalized || "new"}`;
}

export function InterestActionButton({
  entityType,
  entityId,
  slug,
  title,
  initialInterested = false,
  activeLabel = "إزالة من الاهتمام",
  inactiveLabel = "إضافة اهتمام",
  icon,
  iconClassName,
  activeIconClassName,
  ariaLabel,
  className,
  style,
}: {
  entityType: InterestEntityType;
  entityId?: string;
  slug?: string;
  title?: string;
  initialInterested?: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
  icon?: "heart";
  iconClassName?: string;
  activeIconClassName?: string;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const router = useRouter();
  const [interested, setInterested] = useState(initialInterested);
  const [state, setState] = useState<ActionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleClick() {
    const nextInterested = !interested;
    setState("saving");
    setErrorMessage("");

    try {
      const result = await postJson<{ interested?: boolean }>("/api/dashboard/interest", {
        entityType,
        entityId,
        slug,
        title,
        interested: nextInterested,
      });
      setInterested(typeof result.interested === "boolean" ? result.interested : nextInterested);
      setState("saved");
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(error instanceof Error ? error.message : "تعذر حفظ الاهتمام");
      setState("error");
    }
  }

  const iconNode = icon === "heart"
    ? <Heart className={interested ? activeIconClassName ?? iconClassName : iconClassName} />
    : null;
  const label = interested ? activeLabel : inactiveLabel;
  const iconOnly = Boolean(iconNode && !activeLabel && !inactiveLabel);

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={handleClick}
      disabled={state === "saving"}
      aria-busy={state === "saving"}
      aria-pressed={interested}
      aria-label={ariaLabel}
      title={state === "error" ? errorMessage || "تعذر حفظ الاهتمام" : state === "saved" ? "تم تحديث الاهتمام" : undefined}
    >
      {state === "saving" ? iconOnly ? iconNode : "جار الحفظ..." : <>{iconNode}{label}</>}
    </button>
  );
}

export function ReviewDecisionButton({
  entityType,
  entityId,
  slug,
  title,
  decision,
  note,
  className,
  style,
  children,
}: {
  entityType: ReviewEntityType;
  entityId?: string;
  slug?: string;
  title?: string;
  decision: ReviewDecision;
  note?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const router = useRouter();
  const [state, setState] = useState<ActionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleClick() {
    setState("saving");
    setErrorMessage("");

    try {
      await postJson("/api/dashboard/review", {
        entityType,
        entityId,
        slug,
        title,
        decision,
        note,
      });
      setState("saved");
      router.refresh();
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(error instanceof Error ? error.message : "تعذر الحفظ");
      setState("error");
    }
  }

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={handleClick}
      disabled={state === "saving"}
      aria-busy={state === "saving"}
      title={state === "error" ? errorMessage || "تعذر الحفظ" : undefined}
    >
      {state === "saving" ? "جار الحفظ..." : state === "saved" ? "تم الحفظ" : state === "error" ? "تعذر الحفظ" : children}
    </button>
  );
}

export function AdminAccountStatusButton({
  accountId,
  kind,
  status,
  note,
  className,
  style,
  children,
}: {
  accountId: string;
  kind: DashboardAdminAccountKind;
  status: DashboardAdminAccountStatus;
  note?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const router = useRouter();
  const [state, setState] = useState<ActionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleClick() {
    setState("saving");
    setErrorMessage("");

    try {
      await postJson("/api/dashboard/accounts", {
        accountId,
        kind,
        status,
        note,
      });
      setState("saved");
      router.refresh();
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(error instanceof Error ? error.message : "تعذر التحديث");
      setState("error");
    }
  }

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={handleClick}
      disabled={state === "saving"}
      aria-busy={state === "saving"}
      title={state === "error" ? errorMessage || "تعذر التحديث" : undefined}
    >
      {state === "saving" ? "جار التحديث..." : state === "saved" ? "تم التحديث" : state === "error" ? "تعذر التحديث" : children}
    </button>
  );
}

export function SaveAccountSettingsButton({
  scope,
  kind,
  payload,
  collectFormValues = true,
  className,
  style,
  children,
}: {
  scope: DashboardAccountSettingsScope;
  kind: DashboardAccountSettingsKind;
  payload?: Record<string, DashboardAccountSettingsPayloadValue>;
  collectFormValues?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const router = useRouter();
  const [state, setState] = useState<ActionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);

  async function handleClick() {
    const container = collectFormValues ? dashboardPayloadContainer(buttonRef.current) : null;
    if (collectFormValues && !reportDashboardContainerValidity(container)) return;

    setState("saving");
    setErrorMessage("");

    try {
      const formPayload = collectFormValues ? collectNamedFormPayload(buttonRef.current) : {};
      const nextPayload = sanitizeAccountSettingsPayload(kind, { ...payload, ...formPayload });
      await postJson("/api/dashboard/account-settings", {
        scope,
        kind,
        payload: nextPayload,
      });
      setState("saved");
      router.refresh();
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(error instanceof Error ? error.message : "تعذر الحفظ");
      setState("error");
    }
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className={className}
      style={style}
      onClick={handleClick}
      disabled={state === "saving"}
      aria-busy={state === "saving"}
      title={state === "error" ? errorMessage || "تعذر الحفظ" : undefined}
    >
      {state === "saving" ? "جار الحفظ..." : state === "saved" ? "تم الحفظ" : state === "error" ? "تعذر الحفظ" : children}
    </button>
  );
}

export function AdminManagementActionButton({
  action,
  entityId,
  slug,
  title,
  status,
  payload,
  collectFormValues = true,
  className,
  style,
  children,
}: {
  action: DashboardAdminManagementAction;
  entityId?: string;
  slug?: string;
  title?: string;
  status?: AdminManagementStatus;
  payload?: Record<string, AdminManagementPayloadValue>;
  collectFormValues?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const router = useRouter();
  const [state, setState] = useState<ActionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);

  async function handleClick() {
    const container = dashboardPayloadContainer(buttonRef.current);
    if (collectFormValues && !reportDashboardContainerValidity(container)) return;

    setState("saving");
    setErrorMessage("");

    try {
      const formPayload = collectFormValues ? collectNamedFormPayload(buttonRef.current) : {};
      const nextPayload = { ...payload, ...formPayload };
      const nextTitle = String(nextPayload.titleAr ?? nextPayload.name ?? nextPayload.title ?? title ?? "").trim() || title;
      const formStatus = typeof nextPayload.status === "string" ? nextPayload.status : undefined;
      const nextStatus = isAdminManagementStatus(formStatus) ? formStatus : status;
      const nextSlug = action === "settings_save" ? adminSettingsSlugFromPayload(slug, nextTitle, nextPayload) : slug;
      await postJson("/api/dashboard/admin-management", {
        action,
        entityId,
        slug: nextSlug,
        title: nextTitle,
        status: nextStatus,
        payload: nextPayload,
      });
      setState("saved");
      router.refresh();
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(error instanceof Error ? error.message : "تعذر الإرسال");
      setState("error");
    }
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className={className}
      style={style}
      onClick={handleClick}
      disabled={state === "saving"}
      aria-busy={state === "saving"}
      title={state === "error" ? errorMessage || "تعذر الحفظ" : undefined}
    >
      {state === "saving" ? "جار الحفظ..." : state === "saved" ? "تم الحفظ" : state === "error" ? "تعذر الحفظ" : children}
    </button>
  );
}

export function SubmitVerificationRequestButton({
  scope,
  mode = "submitted",
  displayName,
  note,
  payload,
  className,
  style,
  children,
}: {
  scope: DashboardVerificationRequestScope;
  mode?: DashboardVerificationRequestMode;
  displayName?: string;
  note?: string;
  payload?: Record<string, VerificationPayloadValue>;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const router = useRouter();
  const [state, setState] = useState<ActionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);

  async function handleClick() {
    const container = dashboardPayloadContainer(buttonRef.current);
    if (!reportDashboardContainerValidity(container)) return;

    setState("saving");
    setErrorMessage("");

    try {
      const formPayload = collectVerificationFormPayload(buttonRef.current);
      const nextPayload = { ...payload, ...formPayload };
      const nextDisplayName = typeof nextPayload.displayName === "string" && nextPayload.displayName.trim() ? nextPayload.displayName.trim() : displayName;
      await postJson("/api/dashboard/verification", {
        scope,
        mode,
        displayName: nextDisplayName,
        note,
        payload: nextPayload,
      });
      setState("saved");
      router.refresh();
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(error instanceof Error ? error.message : "تعذر الإرسال");
      setState("error");
    }
  }

  const isDraft = mode === "draft";
  const savedLabel = isDraft ? "تم حفظ المسودة" : "تم إرسال الطلب";
  const savingLabel = isDraft ? "جار الحفظ..." : "جار الإرسال...";
  const errorLabel = isDraft ? "تعذر حفظ المسودة" : "تعذر الإرسال";

  return (
    <button
      ref={buttonRef}
      type="button"
      className={className}
      style={style}
      onClick={handleClick}
      disabled={state === "saving" || state === "saved"}
      aria-busy={state === "saving"}
      title={state === "error" ? errorMessage || errorLabel : state === "saved" ? savedLabel : undefined}
    >
      {state === "saving" ? savingLabel : state === "saved" ? savedLabel : state === "error" ? errorLabel : children}
    </button>
  );
}

export function SubmitDashboardRequestButton({
  kind,
  scope,
  mode = "submitted",
  title,
  description,
  city,
  amount,
  areaSqm,
  assetType,
  payload,
  className,
  style,
  children,
}: {
  kind: DashboardEntityRequestKind;
  scope: DashboardEntityRequestScope;
  mode?: DashboardEntityRequestMode;
  title?: string;
  description?: string;
  city?: string;
  amount?: number;
  areaSqm?: number;
  assetType?: string;
  payload?: Record<string, RequestPayloadValue>;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const router = useRouter();
  const [state, setState] = useState<ActionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const isDraft = mode === "draft";

  async function handleClick() {
    setState("saving");
    setErrorMessage("");

    try {
      const result = await postJson<DashboardRequestResponse>("/api/dashboard/request", {
        kind,
        scope,
        mode,
        title,
        description,
        city,
        amount,
        areaSqm,
        assetType,
        payload,
      });
      setState("saved");
      router.push(dashboardRequestResultHref(scope, result.kind ?? kind, result.id));
      router.refresh();
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(error instanceof Error ? error.message : "تعذر الإرسال");
      setState("error");
    }
  }

  const savedLabel = isDraft ? "تم حفظ المسودة" : "تم إرسال الطلب";
  const savingLabel = isDraft ? "جار الحفظ..." : "جار الإرسال...";
  const errorLabel = isDraft ? "تعذر حفظ المسودة" : "تعذر الإرسال";

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={handleClick}
      disabled={state === "saving" || state === "saved"}
      aria-busy={state === "saving"}
      title={state === "error" ? errorMessage || errorLabel : state === "saved" ? savedLabel : undefined}
    >
      {state === "saving" ? savingLabel : state === "saved" ? savedLabel : state === "error" ? errorLabel : children}
    </button>
  );
}

export function DashboardRequestFormSubmitButton({
  kind,
  scope,
  mode = "submitted",
  className,
  style,
  children,
}: {
  kind: DashboardEntityRequestKind;
  scope: DashboardEntityRequestScope;
  mode?: DashboardEntityRequestMode;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const router = useRouter();
  const [state, setState] = useState<ActionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const isDraft = mode === "draft";

  async function handleClick(event: MouseEvent<HTMLButtonElement>) {
    const form = event.currentTarget.form;
    if (!form) {
      setErrorMessage("تعذر العثور على النموذج المرتبط بزر الإرسال");
      setState("error");
      return;
    }

    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const amount = formNumber(formData, "amount");
    const areaSqm = formNumber(formData, "areaSqm");
    const assetType = formString(formData, "assetType") ?? formString(formData, "serviceType");
    const payload: Record<string, RequestPayloadValue> = {};

    [
      "sourcePath",
      "sourceEntityId",
      "sourceEntitySlug",
      "formReference",
      "formLabel",
      "serviceType",
      "usageType",
      "stage",
      "district",
      "address",
      "selectedAsset",
      "mobile",
      "email",
      "contactName",
      "organizationName",
      "commercialRegistration",
      "priority",
      "licenseNumber",
      "licenseExpiry",
      "licenseStatus",
      "offeringUrl",
      "licensedEntityName",
      "authorizedPlatform",
      "assetDescription",
      "deedNumber",
      "deedDate",
      "deedType",
      "deedIssuer",
      "developmentNotes",
      "durationMonths",
      "unitsCount",
      "managerName",
      "expectedReturnPercent",
      "remainingDays",
      "feeAmount",
      "reviewNotes",
      "paymentMethod",
      "duration",
      "vatAmount",
      "selectedService",
      "acceptedAccuracy",
      "acceptedTerms",
      "privacyAccepted",
    ].forEach((key) => addPayloadValue(payload, key, formString(formData, key)));
    addPayloadValue(payload, "amountSar", amount);
    addPayloadValue(payload, "estimatedValue", amount);
    addPayloadValue(payload, "capitalSar", amount);
    addPayloadValue(payload, "areaSqm", areaSqm);
    addPayloadValue(payload, "assetType", assetType);

    setState("saving");
    setErrorMessage("");
    try {
      const result = await postJson<DashboardRequestResponse>("/api/dashboard/request", {
        kind,
        scope,
        mode,
        title: formString(formData, "title"),
        description: formString(formData, "description"),
        city: formString(formData, "city"),
        amount,
        areaSqm,
        assetType,
        payload,
      });
      setState("saved");
      router.push(dashboardRequestResultHref(scope, result.kind ?? kind, result.id));
      router.refresh();
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(error instanceof Error ? error.message : "تعذر الإرسال");
      setState("error");
    }
  }

  const savedLabel = isDraft ? "تم حفظ المسودة" : "تم إرسال الطلب";
  const savingLabel = isDraft ? "جار الحفظ..." : "جار الإرسال...";
  const errorLabel = isDraft ? "تعذر حفظ المسودة" : "تعذر الإرسال";

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={handleClick}
      disabled={state === "saving" || state === "saved"}
      aria-busy={state === "saving"}
      title={state === "error" ? errorMessage || errorLabel : state === "saved" ? savedLabel : undefined}
    >
      {state === "saving" ? savingLabel : state === "saved" ? savedLabel : state === "error" ? errorLabel : children}
    </button>
  );
}

export function DashboardDocumentUploadButton({
  scope,
  entityType,
  entityId,
  label,
  accept = ".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.txt",
  className,
  style,
  children,
}: {
  scope: DashboardDocumentScope;
  entityType: string;
  entityId?: string;
  label?: string;
  accept?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const router = useRouter();
  const [state, setState] = useState<UploadState>("idle");
  const [fileName, setFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const inputElement = event.currentTarget;
    const file = inputElement.files?.[0];
    if (!file) return;

    if (file.size > MAX_DOCUMENT_UPLOAD_BYTES) {
      setState("error");
      setFileName("الحد الأقصى للملف 10MB");
      setErrorMessage("حجم الملف يتجاوز 10MB");
      inputElement.value = "";
      return;
    }

    const form = new FormData();
    form.set("file", file);
    form.set("scope", scope);
    form.set("entityType", entityType);
    if (entityId) form.set("entityId", entityId);
    if (label) form.set("label", label);

    setState("uploading");
    setFileName(file.name);
    setErrorMessage("");
    try {
      const response = await fetch("/api/dashboard/document", {
        method: "POST",
        body: form,
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new DashboardActionError(dashboardApiErrorMessage(data, "upload_failed"), response.status);
      if (isUnpersistedMutation(data)) throw new DashboardActionError(dashboardApiErrorMessage(data, "upload_not_persisted"), 409);
      setState("uploaded");
      router.refresh();
    } catch (error) {
      if (handleAuthError(error, router)) return;
      setErrorMessage(error instanceof Error ? error.message : "تعذر رفع المستند");
      setState("error");
    } finally {
      inputElement.value = "";
    }
  }

  const stateLabel = state === "uploading"
    ? "جار الرفع..."
    : state === "uploaded"
      ? "تم الرفع"
      : state === "error"
        ? "تعذر الرفع"
        : children;

  return (
    <label
      className={className}
      style={style}
      title={state === "uploaded" && fileName ? fileName : state === "error" ? errorMessage || "تعذر رفع المستند" : undefined}
      aria-busy={state === "uploading"}
    >
      <input type="file" accept={accept} className="sr-only" onChange={handleFileChange} disabled={state === "uploading"} />
      {stateLabel}
    </label>
  );
}
