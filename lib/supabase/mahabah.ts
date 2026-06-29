import type { Article, Asset, AssetStatus, Contribution, ContributionStage, KnowledgeResource } from "@/lib/types";
import { assets as staticAssets } from "@/lib/data/assets";
import { articles as staticArticles, knowledgeResources as staticKnowledgeResources } from "@/lib/data/articles";
import { contributions as staticContributions } from "@/lib/data/contributions";
import { realEstateServices as staticServices } from "@/lib/data/services";
import type { ServiceItem } from "@/lib/data/services";
import { getSupabaseAdmin, getSupabasePublic, getSupabaseStatus } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export const DEMO_INDIVIDUAL_USER_ID = "11111111-1111-4111-8111-111111111111";
export const DEMO_BUSINESS_USER_ID = "22222222-2222-4222-8222-222222222222";
export const DEMO_BUSINESS_ORG_ID = "44444444-4444-4444-8444-444444444444";
export const DEMO_ADMIN_USER_ID = "33333333-3333-4333-8333-333333333333";
const DEMO_CONVERSATION_ID = "d1000000-0000-4000-8000-000000000001";
const DEMO_BUSINESS_CONVERSATION_ID = "d1000000-0000-4000-8000-000000000002";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

type AssetRow = {
  id: string;
  slug: string;
  title_ar: string;
  city_ar: string;
  district_ar: string | null;
  asset_type_ar: string;
  usage_type_ar: string;
  area_sqm: number | string;
  estimated_value_sar: number | string | null;
  price_per_sqm: number | string | null;
  street_width_m: number | string | null;
  frontage_count: number | null;
  status: string;
  deed_number: string | null;
  listing_date: string;
  image_url: string;
  gallery: Json;
  excerpt_ar: string;
};

type ContributionRow = {
  id: string;
  slug: string;
  title_ar: string;
  city_ar: string;
  stage_ar: string;
  capital_sar: number | string;
  investors_count: number;
  duration_months: number;
  funded_percent: number;
  expected_return_percent: number | string | null;
  remaining_days: number | null;
  image_url: string;
  timeline: Json;
  excerpt_ar: string;
};

type ServiceCatalogRow = {
  id: string;
  slug: string;
  title_ar: string;
  description_ar: string;
  duration_ar: string | null;
  level_ar: string | null;
  outputs_ar: string | null;
  price_sar?: number | string | null;
  active?: boolean | null;
  updated_at?: string | null;
};

type PublicContentItemRow = {
  id: string;
  slug: string;
  title_ar: string;
  category_ar: string | null;
  excerpt_ar: string | null;
  body_ar: string | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
};

type PersistResult = {
  ok: true;
  persisted: boolean;
  id?: string;
  reference?: string;
};

type VerificationPayloadValue = string | number | boolean | null | undefined;
type EntityRequestPayloadValue = string | number | boolean | null | undefined;
type AdminManagementPayloadValue = string | number | boolean | null | undefined;
export type DashboardAccountSettingsPayloadValue = string | number | boolean | null | undefined;

export type DashboardVerificationRequestScope = "individual" | "business";
export type DashboardVerificationRequestMode = "draft" | "submitted";
export type DashboardEntityRequestKind = "asset" | "contribution" | "service_request";
export type DashboardEntityRequestScope = "individual" | "business";
export type DashboardEntityRequestMode = "draft" | "submitted";
export type DashboardDocumentScope = "individual" | "business" | "admin";

export type DashboardDocumentRow = {
  id: string;
  entityType: string;
  entityId?: string | null;
  entityRef?: string | null;
  fileName: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
  createdAt: string;
};

export type DashboardAdminServiceCatalogItem = ServiceItem & {
  status: string;
  category: string;
  basePrice: number;
  active: boolean;
  updatedAt?: string | null;
  source: "supabase" | "static";
};
export type DashboardAccountSettingsScope = "individual" | "business";
export type DashboardAccountSettingsKind = "profile" | "security" | "preferences";

export type DashboardActorContext = {
  userId?: string | null;
  organizationId?: string | null;
  role?: string | null;
  email?: string | null;
};

export type DashboardBusinessProfileData = {
  id: string;
  organizationName: string;
  commercialRegistration: string;
  activityType: string;
  city: string;
  email: string;
  phone: string;
  website: string;
  logoUrl?: string | null;
  status: string;
  verificationStatus: string;
  profileCompletion: number;
  createdAt?: string | null;
  updatedAt?: string | null;
  landline: string;
  district: string;
  street: string;
  buildingNumber: string;
  additionalNumber: string;
  postalCode: string;
  nationalAddress: string;
  delegateName: string;
  delegateId: string;
  delegatePhone: string;
  delegateEmail: string;
};

export type DashboardIndividualProfileData = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  avatarUrl?: string | null;
  verificationStatus: string;
  profileCompletion: number;
  createdAt?: string | null;
  updatedAt?: string | null;
  membershipNumber: string;
  accountType: string;
  identityNumber: string;
  birthDate: string;
  nationality: string;
  postalCode: string;
  country: string;
  address: string;
};

export type DashboardNotification = {
  id: string;
  title: string;
  body: string;
  category: string;
  unread: boolean;
  createdAt: string;
  actionUrl?: string | null;
  userId?: string | null;
  organizationId?: string | null;
  targetLabel?: string;
  targetType?: "individual" | "business" | "admin" | "unknown";
};

export type DashboardConversation = {
  id: string;
  subject: string;
  status: string;
  latestMessage?: string;
  latestAt?: string;
  ownerLabel?: string;
  organizationId?: string | null;
  createdBy?: string | null;
};

export type DashboardMessage = {
  id: string;
  conversationId: string;
  body: string;
  senderUserId?: string | null;
  mine: boolean;
  createdAt: string;
  readAt?: string | null;
};

export type DashboardSupportTicket = {
  id: string;
  ticketNumber: string;
  title: string;
  description?: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt?: string | null;
  requesterUserId?: string | null;
  organizationId?: string | null;
  ownerLabel?: string;
};

export type DashboardSupportTicketMessage = {
  id: string;
  ticketId: string;
  body: string;
  senderUserId?: string | null;
  mine: boolean;
  internal: boolean;
  createdAt: string;
};

export type DashboardFinancialScope = "individual" | "business" | "admin";
export type DashboardDataScope = "individual" | "business";
export type DashboardScopedListVariant = "all" | "owned" | "interested";
export type DashboardInvoiceStatus = "draft" | "due" | "paid" | "overdue" | "cancelled";
export type DashboardPaymentStatus = "pending" | "succeeded" | "failed" | "refunded";
export type DashboardRequestStatus = "draft" | "submitted" | "in_review" | "needs_changes" | "in_progress" | "completed" | "cancelled";

export type DashboardInvoice = {
  id: string;
  invoiceNumber: string;
  customer: string;
  customerType: "individual" | "business" | "platform";
  title: string;
  amount: number;
  status: DashboardInvoiceStatus;
  statusLabel: string;
  tone: "green" | "red" | "blue" | "gold";
  dueDate: string;
  issuedAt: string;
  paidAt?: string | null;
};

export type DashboardSubscription = {
  id: string;
  customer: string;
  customerType: "individual" | "business" | "platform";
  planName: string;
  status: string;
  statusLabel: string;
  startsAt: string;
  endsAt: string;
  amount: number;
  daysRemaining: number;
};

export type DashboardPayment = {
  id: string;
  invoiceId?: string | null;
  invoiceNumber?: string;
  customer: string;
  customerType: "individual" | "business" | "platform";
  title: string;
  amount: number;
  method: string;
  status: DashboardPaymentStatus;
  statusLabel: string;
  tone: "green" | "red" | "blue" | "gold";
  providerReference?: string | null;
  paidAt?: string | null;
  createdAt: string;
};

export type DashboardFinancialData = {
  invoices: DashboardInvoice[];
  subscriptions: DashboardSubscription[];
  payments: DashboardPayment[];
  summary: {
    totalInvoices: number;
    paidInvoices: number;
    pendingInvoices: number;
    overdueInvoices: number;
    totalPaid: number;
    outstanding: number;
    nextInvoiceAmount: number;
    activePlan: string;
    subscriptionStatus: string;
    subscriptionDaysRemaining: number;
    paymentMethods: string[];
  };
  source: "supabase" | "static";
  error?: string;
};

export type DashboardPlatformSetting = {
  key: string;
  value: unknown;
  updatedAt: string;
};

export type DashboardAdminAccountStatus = "pending" | "verified" | "suspended";
export type DashboardAdminAccountKind = "individual" | "business" | "admin";

export type DashboardAdminAccount = {
  id: string;
  name: string;
  kind: DashboardAdminAccountKind;
  typeLabel: string;
  status: DashboardAdminAccountStatus;
  city: string;
  email: string;
  phone: string;
  assets: number;
  contributions: number;
  joinedAt: string;
  lastLogin: string;
  profileCompletion: number;
  userId?: string | null;
  organizationId?: string | null;
  commercialRegistration?: string | null;
};

export type DashboardAdminReviewStatus = "pending" | "needs_changes" | "approved" | "rejected";
export type DashboardAdminProviderStatus = "pending" | "approved" | "rejected";
export type DashboardAdminContentStatus = "published" | "draft" | "review" | "archived";
export type DashboardAdminContentCommentStatus = "submitted" | "approved" | "rejected" | "archived";
export type DashboardAdminInvoiceStatus = "draft" | "due" | "paid" | "overdue" | "cancelled";
export type DashboardAdminPaymentStatus = "pending" | "succeeded" | "failed" | "refunded";
export type DashboardAdminSubscriptionStatus = "active" | "pending" | "expired" | "cancelled";
export type DashboardAdminManagementStatus = DashboardAdminProviderStatus | DashboardAdminContentStatus | DashboardAdminContentCommentStatus | DashboardAdminInvoiceStatus | DashboardAdminPaymentStatus | DashboardAdminSubscriptionStatus;
export type DashboardAdminContentKind = "page" | "article" | "category" | "media" | "banner" | "faq" | "partner";
const dashboardAdminProviderStatuses = new Set<DashboardAdminProviderStatus>(["pending", "approved", "rejected"]);
const dashboardAdminContentStatuses = new Set<DashboardAdminContentStatus>(["published", "draft", "review", "archived"]);
const dashboardAdminContentCommentStatuses = new Set<DashboardAdminContentCommentStatus>(["submitted", "approved", "rejected", "archived"]);
const dashboardAdminContentKinds = new Set<DashboardAdminContentKind>(["page", "article", "category", "media", "banner", "faq", "partner"]);

function dashboardAdminProviderStatus(value: unknown): DashboardAdminProviderStatus | null {
  return typeof value === "string" && dashboardAdminProviderStatuses.has(value as DashboardAdminProviderStatus)
    ? (value as DashboardAdminProviderStatus)
    : null;
}

function dashboardAdminContentStatus(value: unknown): DashboardAdminContentStatus | null {
  return typeof value === "string" && dashboardAdminContentStatuses.has(value as DashboardAdminContentStatus)
    ? (value as DashboardAdminContentStatus)
    : null;
}

function dashboardAdminContentCommentStatus(value: unknown): DashboardAdminContentCommentStatus | null {
  return typeof value === "string" && dashboardAdminContentCommentStatuses.has(value as DashboardAdminContentCommentStatus)
    ? (value as DashboardAdminContentCommentStatus)
    : null;
}

function dashboardAdminContentKind(value: unknown): DashboardAdminContentKind | null {
  return typeof value === "string" && dashboardAdminContentKinds.has(value as DashboardAdminContentKind)
    ? (value as DashboardAdminContentKind)
    : null;
}

export type DashboardAdminManagementAction =
  | "service_catalog_save"
  | "invoice_status"
  | "payment_status"
  | "subscription_status"
  | "provider_status"
  | "provider_save"
  | "content_status"
  | "content_save"
  | "content_comment_status"
  | "admin_role_save"
  | "admin_user_save"
  | "admin_security_action"
  | "settings_save";

export type DashboardAdminProvider = {
  id: string;
  slug: string;
  name: string;
  status: DashboardAdminProviderStatus;
  category: string;
  city: string;
  contact: string;
  requests: number;
  rating: number;
  joinedAt: string;
  license: string;
};

export type DashboardAdminContentItem = {
  id: string;
  slug: string;
  title: string;
  kind: DashboardAdminContentKind;
  typeLabel: string;
  status: DashboardAdminContentStatus;
  category: string;
  author: string;
  updatedAt: string;
  views: string;
};

export type DashboardAdminContentComment = {
  id: string;
  contentSlug: string;
  contentType: "news" | "article";
  authorName: string;
  body: string;
  status: DashboardAdminContentCommentStatus;
  createdAt: string;
  updatedAt: string;
};

export type DashboardAdminAuditKind = "login" | "activity" | "sensitive";

export type DashboardAdminAuditLog = {
  id: string;
  user: string;
  event: string;
  target: string;
  ip: string;
  time: string;
  status: "ناجح" | "مراجعة" | "مرفوض" | "حساس";
};

export type DashboardAdminRole = {
  id: string;
  slug: string;
  name: string;
  users: number;
  permissions: number;
  scope: string;
  status: "نشط" | "محدود" | "معطل";
  updated: string;
};

export type DashboardSystemAdmin = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "نشط" | "موقوف مؤقتاً";
  lastLogin: string;
  sessions: number;
};

export type DashboardAdminAssetRow = Asset & {
  status: DashboardAdminReviewStatus;
  rawStatus: string;
  owner: string;
  reviewer: string;
  submittedAt: string;
  estimatedValueSar: number;
  risk: "منخفض" | "متوسط" | "مرتفع";
  ownerUserId?: string | null;
  organizationId?: string | null;
};

export type DashboardAdminContributionRow = Contribution & {
  status: DashboardAdminReviewStatus;
  rawStatus: string;
  sponsor: string;
  reviewer: string;
  submittedAt: string;
  risk: "منخفض" | "متوسط" | "مرتفع";
  organizationId?: string | null;
  licenseNumber?: string | null;
  offeringUrl?: string | null;
};

export type DashboardAdminServiceRequestStatus = "new" | "assigned" | "completed" | "urgent" | "needs_changes" | "cancelled";

export type DashboardAdminServiceRequest = {
  id: string;
  title: string;
  serviceType: string;
  description: string;
  status: DashboardAdminServiceRequestStatus;
  rawStatus: string;
  priority: string;
  requester: string;
  provider: string;
  city: string;
  assetType: string;
  areaSqm: number;
  submittedAt: string;
  dueAt: string;
  price: number;
  latestReviewDecision?: ReviewDecision | null;
  latestReviewNote?: string | null;
  latestReviewAt?: string | null;
  requesterUserId?: string | null;
  organizationId?: string | null;
};

export type DashboardAdminVerificationRequest = {
  id: string;
  requester: string;
  type: "individual" | "business";
  typeLabel: string;
  status: DashboardAdminReviewStatus;
  rawStatus: string;
  city: string;
  completionPercent: number;
  submittedAt: string;
  reviewedAt?: string | null;
  reviewer: string;
  notes?: string | null;
  requesterUserId?: string | null;
  organizationId?: string | null;
};

type InterestEntityType = "asset" | "contribution";
type ReviewEntityType = InterestEntityType | "service_request" | "verification_request";
type ReviewDecision = "approved" | "needs_changes" | "rejected";

type AdminAccountReviewStatus = "draft" | "submitted" | "in_review" | "needs_changes" | "approved" | "rejected" | "archived";

type AdminProfileRow = {
  id: string;
  role: "individual" | "business" | "admin";
  full_name: string;
  email: string | null;
  phone: string | null;
  city_ar: string | null;
  verification_status: AdminAccountReviewStatus;
  profile_completion: number | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
};

type AdminOrganizationRow = {
  id: string;
  owner_user_id: string;
  name_ar: string;
  commercial_registration: string | null;
  city_ar: string | null;
  email: string | null;
  phone: string | null;
  status: AdminAccountReviewStatus;
  verification_status: AdminAccountReviewStatus;
  profile_completion: number | null;
  created_at: string;
  updated_at: string;
};

type AdminAssetReviewRow = AssetRow & {
  owner_user_id: string | null;
  organization_id: string | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
  status: string;
};

type AdminContributionReviewRow = ContributionRow & {
  organization_id: string | null;
  metadata: Json;
  status: string;
  license_number: string | null;
  offering_url: string | null;
  created_at: string;
  updated_at: string;
};

type AdminServiceRequestRow = {
  id: string;
  requester_user_id: string | null;
  organization_id: string | null;
  service_type_ar: string;
  title_ar: string;
  description_ar: string;
  city_ar: string | null;
  asset_type_ar: string | null;
  area_sqm: number | string | null;
  status: string;
  priority: string;
  amount_sar: number | string | null;
  due_date: string | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
};

type AdminVerificationRequestRow = {
  id: string;
  requester_user_id: string | null;
  organization_id: string | null;
  request_type: "individual" | "business";
  status: string;
  completion_percent: number | string | null;
  submitted_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type AdminServiceProviderRow = {
  id: string;
  slug: string;
  name_ar: string;
  category_ar: string;
  city_ar: string;
  contact: string | null;
  license_number: string | null;
  status: string;
  rating: number | string | null;
  requests_count: number | null;
  created_at: string;
  updated_at: string;
};

type AdminContentItemRow = {
  id: string;
  slug: string;
  title_ar: string;
  kind: DashboardAdminContentKind;
  status: DashboardAdminContentStatus;
  category_ar: string | null;
  author_ar: string | null;
  view_count: number | null;
  created_at: string;
  updated_at: string;
};

type AdminContentCommentRow = {
  id: string;
  content_slug: string;
  content_type: "news" | "article";
  author_name: string;
  body_ar: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type AdminAuditLogRow = {
  id: string;
  actor_user_id: string | null;
  organization_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Json;
  created_at: string;
};

type AdminRoleRow = {
  id: string;
  slug: string;
  name_ar: string;
  scope_ar: string;
  status: string;
  permissions_count: number | null;
  users_count: number | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
};

type ResolvedEntity = {
  id: string;
  slug?: string | null;
  titleAr: string;
  ownerUserId?: string | null;
  organizationId?: string | null;
  metadata?: Record<string, Json>;
};

type FinancialInvoiceRow = {
  id: string;
  invoice_number: string;
  user_id: string | null;
  organization_id: string | null;
  title_ar: string;
  amount_sar: number | string;
  status: DashboardInvoiceStatus;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
};

type FinancialSubscriptionRow = {
  id: string;
  user_id: string | null;
  organization_id: string | null;
  plan_name_ar: string;
  status: string;
  starts_at: string;
  ends_at: string | null;
  amount_sar: number | string;
};

type FinancialPaymentRow = {
  id: string;
  invoice_id: string | null;
  user_id: string | null;
  organization_id: string | null;
  amount_sar: number | string;
  method: string;
  status: DashboardPaymentStatus;
  provider_reference: string | null;
  paid_at: string | null;
  created_at: string;
};

type FinancialOwnerLookup = {
  users: Map<string, string>;
  organizations: Map<string, string>;
};

export function supabaseRuntimeState() {
  return getSupabaseStatus();
}

function toNumber(value: number | string | null | undefined, fallback = 0) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const normalized = value
      .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
      .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
      .replaceAll(",", "")
      .replace(/[^\d.-]/g, "");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function reviewStatusToAccountStatus(status: AdminAccountReviewStatus | string | null | undefined): DashboardAdminAccountStatus {
  if (status === "approved") return "verified";
  if (status === "archived" || status === "rejected") return "suspended";
  return "pending";
}

function accountStatusToReviewStatus(status: DashboardAdminAccountStatus): AdminAccountReviewStatus {
  if (status === "verified") return "approved";
  if (status === "suspended") return "archived";
  return "in_review";
}

function accountStatusLabel(status: DashboardAdminAccountStatus) {
  if (status === "verified") return "تم توثيق الحساب";
  if (status === "suspended") return "تم إيقاف الحساب";
  return "تم تحويل الحساب للمراجعة";
}

function reviewStatusToAdminStatus(status: string | null | undefined): DashboardAdminReviewStatus {
  if (status === "approved") return "approved";
  if (status === "needs_changes") return "needs_changes";
  if (status === "rejected" || status === "archived") return "rejected";
  return "pending";
}

function adminReviewRisk(status: DashboardAdminReviewStatus, value: number, index = 0): DashboardAdminAssetRow["risk"] {
  if (status === "rejected") return "مرتفع";
  if (status === "pending" || value >= 100_000_000 || index % 4 === 0) return "متوسط";
  return "منخفض";
}

function requestStatusToAdminStatus(status: string | null | undefined, priority?: string | null): DashboardAdminServiceRequestStatus {
  if (priority === "urgent" || priority === "high") return "urgent";
  if (status === "completed") return "completed";
  if (status === "cancelled") return "cancelled";
  if (status === "needs_changes") return "needs_changes";
  if (status === "in_progress" || status === "in_review") return "assigned";
  return "new";
}

function normalizeDashboardRequestStatus(status: string | null | undefined): DashboardRequestStatus | null {
  const normalized = status?.trim();
  const allowed: DashboardRequestStatus[] = ["draft", "submitted", "in_review", "needs_changes", "in_progress", "completed", "cancelled"];
  return allowed.includes(normalized as DashboardRequestStatus) ? normalized as DashboardRequestStatus : null;
}

function normalizeSupportPriority(priority: string | null | undefined) {
  const normalized = priority?.trim().toLowerCase() || "normal";
  const allowed = ["low", "normal", "high", "urgent"];
  return allowed.includes(normalized) ? normalized : null;
}

function dashboardMessageInvalid(body: string) {
  const trimmed = body.trim();
  return trimmed.length < 2 || trimmed.length > 3000;
}

function incrementMap(map: Map<string, number>, key: string | null | undefined) {
  if (!key) return;
  map.set(key, (map.get(key) ?? 0) + 1);
}

function staticAdminAccounts(): DashboardAdminAccount[] {
  return [
    {
      id: DEMO_INDIVIDUAL_USER_ID,
      userId: DEMO_INDIVIDUAL_USER_ID,
      name: "أحمد عبدالله",
      kind: "individual",
      typeLabel: "فرد",
      status: "verified",
      city: "الرياض",
      email: "ahmed.abdullah@example.com",
      phone: "+966 50 123 4567",
      assets: 1,
      contributions: 2,
      joinedAt: "2026-01-15T09:00:00Z",
      lastLogin: "2026-06-16T10:35:00Z",
      profileCompletion: 85,
    },
    {
      id: DEMO_BUSINESS_ORG_ID,
      userId: "22222222-2222-4222-8222-222222222222",
      organizationId: DEMO_BUSINESS_ORG_ID,
      commercialRegistration: "1010123456",
      name: "شركة الازدهار العقارية",
      kind: "business",
      typeLabel: "منشأة",
      status: "verified",
      city: "الرياض",
      email: "info@alazdehar.sa",
      phone: "+966 50 123 4567",
      assets: 2,
      contributions: 3,
      joinedAt: "2026-01-01T09:00:00Z",
      lastLogin: "2026-06-16T09:12:00Z",
      profileCompletion: 96,
    },
    {
      id: DEMO_ADMIN_USER_ID,
      userId: DEMO_ADMIN_USER_ID,
      name: "إدارة مهابة",
      kind: "admin",
      typeLabel: "مدير نظام",
      status: "verified",
      city: "الرياض",
      email: "admin@mahabah.sa",
      phone: "+966 55 555 0000",
      assets: 0,
      contributions: 0,
      joinedAt: "2026-01-01T09:00:00Z",
      lastLogin: "2026-06-16T11:01:00Z",
      profileCompletion: 100,
    },
  ];
}

function staticAdminAssetRows(): DashboardAdminAssetRow[] {
  return staticAssets.map((asset, index) => {
    const status = reviewStatusToAdminStatus(index % 5 === 0 ? "submitted" : index % 4 === 0 ? "rejected" : "approved");
    const estimatedValueSar = asset.areaSqm * (asset.pricePerSqm ?? 8500);
    return {
      ...asset,
      status,
      rawStatus: status === "pending" ? "submitted" : status,
      owner: index % 2 === 0 ? "شركة الازدهار العقارية" : "أحمد عبدالله",
      reviewer: ["نورة العتيبي", "سلمان الحربي", "هند القحطاني"][index % 3],
      submittedAt: asset.listingDate,
      estimatedValueSar,
      risk: adminReviewRisk(status, estimatedValueSar, index),
      ownerUserId: index % 2 === 0 ? null : DEMO_INDIVIDUAL_USER_ID,
      organizationId: index % 2 === 0 ? DEMO_BUSINESS_ORG_ID : null,
    };
  });
}

function staticAdminContributionRows(): DashboardAdminContributionRow[] {
  return staticContributions.map((contribution, index) => {
    const status = reviewStatusToAdminStatus(index % 4 === 0 ? "submitted" : index % 3 === 0 ? "rejected" : "approved");
    return {
      ...contribution,
      status,
      rawStatus: status === "pending" ? "submitted" : status,
      sponsor: "شركة الازدهار العقارية",
      reviewer: ["هند القحطاني", "سلمان الحربي", "نورة العتيبي"][index % 3],
      submittedAt: `2026-06-${String(14 - index).padStart(2, "0")}T09:00:00Z`,
      risk: adminReviewRisk(status, contribution.capitalSar, index),
      organizationId: DEMO_BUSINESS_ORG_ID,
      licenseNumber: `LIC-2026-00${index + 120}`,
      offeringUrl: null,
    };
  });
}

function staticAdminServiceRequests(): DashboardAdminServiceRequest[] {
  return staticServices.slice(0, 8).map((service, index) => {
    const rawStatus = (["submitted", "in_progress", "completed", "submitted"] as const)[index % 4];
    const priority = index % 4 === 3 ? "high" : "normal";
    return {
      id: `SRV-${2400 + index}`,
      title: service.titleAr,
      serviceType: service.titleAr,
      description: service.descriptionAr,
      status: requestStatusToAdminStatus(rawStatus, priority),
      rawStatus,
      priority,
      requester: index % 2 === 0 ? "شركة الازدهار العقارية" : "أحمد عبدالله",
      provider: ["مكتب أفق الهندسي", "شركة تقييم المتقدمة", "مكتب عدل للاستشارات", "بانتظار التعيين"][index % 4],
      city: ["الرياض", "جدة", "الدمام", "الخبر"][index % 4],
      assetType: index % 2 === 0 ? "أصل قائم" : "أرض خام",
      areaSqm: [6200, 4680, 2400, 9800][index % 4],
      submittedAt: `2026-06-${String(14 - index).padStart(2, "0")}T09:00:00Z`,
      dueAt: `2026-06-${String(18 + index).padStart(2, "0")}`,
      price: [4500, 12800, 6200, 18500][index % 4],
      requesterUserId: index % 2 === 0 ? null : DEMO_INDIVIDUAL_USER_ID,
      organizationId: index % 2 === 0 ? DEMO_BUSINESS_ORG_ID : null,
    };
  });
}

function staticAdminVerificationRequests(): DashboardAdminVerificationRequest[] {
  return [
    {
      id: "90000000-0000-4000-8000-000000000001",
      requesterUserId: DEMO_INDIVIDUAL_USER_ID,
      requester: "أحمد عبدالله",
      type: "individual",
      typeLabel: "حساب فردي",
      status: "pending",
      rawStatus: "submitted",
      city: "الرياض",
      completionPercent: 78,
      submittedAt: "2026-06-15T09:20:00Z",
      reviewedAt: null,
      reviewer: "مركز توثيق الحسابات",
      notes: "طلب شارة توثيق حساب فردي",
    },
    {
      id: "90000000-0000-4000-8000-000000000002",
      organizationId: DEMO_BUSINESS_ORG_ID,
      requester: "شركة الازدهار العقارية",
      type: "business",
      typeLabel: "منشأة",
      status: "approved",
      rawStatus: "approved",
      city: "الرياض",
      completionPercent: 100,
      submittedAt: "2026-06-10T11:00:00Z",
      reviewedAt: "2026-06-12T13:15:00Z",
      reviewer: "فريق اعتماد المنشآت",
      notes: "منشأة موثقة",
    },
    {
      id: "VRF-2026-0003",
      requesterUserId: DEMO_INDIVIDUAL_USER_ID,
      requester: "سارة خالد",
      type: "individual",
      typeLabel: "حساب فردي",
      status: "rejected",
      rawStatus: "rejected",
      city: "جدة",
      completionPercent: 54,
      submittedAt: "2026-06-08T08:45:00Z",
      reviewedAt: "2026-06-09T10:00:00Z",
      reviewer: "فريق الامتثال",
      notes: "صورة الهوية غير واضحة وتحتاج إعادة رفع.",
    },
  ];
}

function providerStatusToAdminStatus(status: string | null | undefined): DashboardAdminProviderStatus {
  if (status === "approved") return "approved";
  if (status === "rejected" || status === "archived") return "rejected";
  return "pending";
}

function providerStatusToReviewStatus(status: DashboardAdminProviderStatus): AdminAccountReviewStatus {
  if (status === "approved") return "approved";
  if (status === "rejected") return "rejected";
  return "submitted";
}

function contentKindLabel(kind: DashboardAdminContentKind) {
  if (kind === "article") return "خبر/مقال";
  if (kind === "category") return "تصنيف";
  if (kind === "media") return "وسائط";
  if (kind === "banner") return "بنر";
  if (kind === "faq") return "سؤال شائع";
  if (kind === "partner") return "شريك";
  return "صفحة";
}

function compactDateLabel(value: string | null | undefined) {
  if (!value) return "غير محدد";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-SA", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

function staticAdminProviders(): DashboardAdminProvider[] {
  return [
    { id: "PRV-1300", slug: "ruaa-real-estate", name: "شركة رؤى العقارية", status: "approved", category: "تقييم عقاري", city: "الرياض", contact: "+966 50 200 1001", requests: 42, rating: 4.8, joinedAt: "2026-06-14T09:00:00Z", license: "SP-2026-001" },
    { id: "PRV-1301", slug: "wathiq-consulting", name: "مكتب واثق للاستشارات", status: "approved", category: "دراسات جدوى", city: "جدة", contact: "+966 50 200 1002", requests: 38, rating: 4.7, joinedAt: "2026-06-10T09:00:00Z", license: "SP-2026-002" },
    { id: "PRV-1302", slug: "abad-engineering", name: "شركة أبعاد للاستشارات", status: "pending", category: "هندسة", city: "الدمام", contact: "+966 50 200 1003", requests: 21, rating: 4.4, joinedAt: "2026-06-02T09:00:00Z", license: "SP-2026-003" },
    { id: "PRV-1303", slug: "binaa-integrated", name: "مكتب البناء المتكامل", status: "rejected", category: "إدارة مشاريع", city: "الرياض", contact: "+966 50 200 1004", requests: 12, rating: 3.9, joinedAt: "2026-05-29T09:00:00Z", license: "SP-2026-004" },
  ];
}

function staticAdminContentItems(): DashboardAdminContentItem[] {
  return [
    { id: "CNT-7101", slug: "home", title: "الصفحة الرئيسية", kind: "page", typeLabel: "صفحة", status: "published", category: "صفحات الموقع", author: "فريق المحتوى", updatedAt: "14/06/2026", views: "12,430" },
    { id: "CNT-7102", slug: "about", title: "من نحن", kind: "page", typeLabel: "صفحة", status: "published", category: "صفحات تعريفية", author: "إدارة المنصة", updatedAt: "13/06/2026", views: "4,820" },
    { id: "CNT-7103", slug: "real-estate-investment-guide", title: "دليل الاستثمار العقاري", kind: "article", typeLabel: "خبر/مقال", status: "review", category: "مقالات", author: "سارة العتيبي", updatedAt: "12/06/2026", views: "1,245" },
    { id: "CNT-7104", slug: "terms", title: "شروط الاستخدام", kind: "page", typeLabel: "صفحة", status: "draft", category: "سياسات", author: "الشؤون القانونية", updatedAt: "10/06/2026", views: "980" },
    { id: "CNT-7105", slug: "riyadh-market-update", title: "تحديثات سوق الرياض", kind: "article", typeLabel: "خبر/مقال", status: "published", category: "أخبار", author: "محمد الشهري", updatedAt: "09/06/2026", views: "3,118" },
    { id: "CNT-7106", slug: "faq", title: "الأسئلة الشائعة", kind: "page", typeLabel: "صفحة", status: "published", category: "مساعدة", author: "الدعم", updatedAt: "08/06/2026", views: "6,540" },
  ];
}

function staticAdminContentComments(): DashboardAdminContentComment[] {
  return [
    { id: "CCM-9001", contentSlug: "real-estate-investment-guide", contentType: "article", authorName: "بندر محمد", body: "مقال واضح، أحتاج تفاصيل أكثر عن طريقة احتساب العوائد.", status: "submitted", createdAt: "14/06/2026", updatedAt: "14/06/2026" },
    { id: "CCM-9002", contentSlug: "riyadh-market-update", contentType: "news", authorName: "أحمد عبدالله", body: "البيانات مفيدة وتحتاج رابط التقرير الرسمي.", status: "approved", createdAt: "13/06/2026", updatedAt: "13/06/2026" },
    { id: "CCM-9003", contentSlug: "home", contentType: "article", authorName: "مستخدم المنصة", body: "تعليق بحاجة إلى مراجعة صياغة قبل الظهور.", status: "rejected", createdAt: "12/06/2026", updatedAt: "12/06/2026" },
  ];
}

function staticAdminAuditLogs(): DashboardAdminAuditLog[] {
  return [
    { id: "LOG-55101", user: "أحمد محمد السبيعي", event: "تسجيل دخول ناجح", target: "لوحة التحكم", ip: "188.48.21.10", time: "14/06/2026 - 10:25 ص", status: "ناجح" },
    { id: "LOG-55102", user: "نورة عبدالله الحربي", event: "تحديث حالة أصل", target: "AS-2026-0043", ip: "188.48.21.11", time: "14/06/2026 - 09:42 ص", status: "ناجح" },
    { id: "LOG-55103", user: "خالد عبدالعزيز", event: "تصدير تقرير مالي", target: "RPT-9004", ip: "188.48.21.18", time: "13/06/2026 - 03:18 م", status: "مراجعة" },
    { id: "LOG-55104", user: "غير معروف", event: "محاولة دخول مرفوضة", target: "admin@mahabah.sa", ip: "91.204.12.7", time: "13/06/2026 - 12:06 ص", status: "مرفوض" },
    { id: "LOG-55105", user: "مدير النظام العام", event: "تعديل صلاحيات دور", target: "مدير المحتوى", ip: "188.48.21.10", time: "12/06/2026 - 11:20 ص", status: "حساس" },
  ];
}

function staticAdminRoles(): DashboardAdminRole[] {
  return [
    { id: "ROLE-001", slug: "super-admin", name: "مدير النظام العام", users: 3, permissions: 90, scope: "كل المنصة", status: "نشط", updated: "14/06/2026" },
    { id: "ROLE-002", slug: "review-manager", name: "مدير المراجعة والاعتماد", users: 8, permissions: 46, scope: "مركز المراجعة", status: "نشط", updated: "13/06/2026" },
    { id: "ROLE-003", slug: "finance-manager", name: "المدير المالي", users: 4, permissions: 38, scope: "المالية والتقارير", status: "نشط", updated: "12/06/2026" },
    { id: "ROLE-004", slug: "content-manager", name: "مدير المحتوى", users: 6, permissions: 28, scope: "المحتوى والإعدادات", status: "نشط", updated: "10/06/2026" },
    { id: "ROLE-005", slug: "reports-viewer", name: "مشاهد التقارير", users: 12, permissions: 12, scope: "قراءة فقط", status: "محدود", updated: "09/06/2026" },
  ];
}

function staticSystemAdmins(): DashboardSystemAdmin[] {
  return [
    { id: DEMO_ADMIN_USER_ID, name: "أحمد محمد السبيعي", email: "admin@mahabah.sa", role: "مدير النظام العام", status: "نشط", lastLogin: "اليوم 10:25 ص", sessions: 2 },
    { id: "55555555-5555-4555-8555-555555555551", name: "نورة عبدالله الحربي", email: "review@mahabah.sa", role: "مدير المراجعة", status: "نشط", lastLogin: "اليوم 09:12 ص", sessions: 1 },
    { id: "55555555-5555-4555-8555-555555555552", name: "خالد عبدالعزيز", email: "finance@mahabah.sa", role: "المدير المالي", status: "نشط", lastLogin: "أمس 04:40 م", sessions: 1 },
    { id: "55555555-5555-4555-8555-555555555553", name: "سارة فهد", email: "content@mahabah.sa", role: "مدير المحتوى", status: "موقوف مؤقتاً", lastLogin: "12/06/2026", sessions: 0 },
  ];
}

function metadataRecord(value: Json): Record<string, Json> {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value : {};
}

function metadataString(metadata: Record<string, Json>, key: string, fallback: string) {
  const value = metadata[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function auditActionLabel(action: string, entityType: string) {
  if (action.includes("login_success")) return "تسجيل دخول ناجح";
  if (action.includes("login_rejected")) return "محاولة دخول مرفوضة";
  if (action.includes("review_approved")) return "اعتماد طلب";
  if (action.includes("review_rejected")) return "رفض طلب";
  if (action.includes("review_needs_changes")) return "طلب تعديل بيانات";
  if (action.includes("financial_report_exported")) return "تصدير تقرير مالي";
  if (action.includes("role_permissions_updated")) return "تعديل صلاحيات دور";
  if (action.includes("settings_save")) return "حفظ إعدادات النظام";
  if (action.includes("content_comment_status")) return "تحديث حالة تعليق محتوى";
  if (action.includes("content_status")) return "تحديث حالة محتوى";
  if (action.includes("provider_status")) return "تحديث حالة مزود خدمة";
  if (action.includes("dashboard_document_uploaded")) return "رفع مستند";
  if (action.includes("account_")) return "تحديث حالة حساب";
  return `${action.replaceAll("_", " ")} · ${entityType}`;
}

function auditStatus(action: string, metadata: Record<string, Json>): DashboardAdminAuditLog["status"] {
  const status = metadataString(metadata, "status", "");
  if (status === "ناجح" || status === "مراجعة" || status === "مرفوض" || status === "حساس") return status;
  if (action.includes("rejected")) return "مرفوض";
  if (action.includes("role_permissions") || action.includes("settings")) return "حساس";
  if (action.includes("exported")) return "مراجعة";
  return "ناجح";
}

function mapAdminAuditLog(row: AdminAuditLogRow, ownerLookup: FinancialOwnerLookup): DashboardAdminAuditLog {
  const metadata = metadataRecord(row.metadata);
  const user = metadataString(
    metadata,
    "actorName",
    row.actor_user_id ? ownerLookup.users.get(row.actor_user_id) ?? "مدير النظام" : "غير معروف",
  );
  return {
    id: `LOG-${row.id.slice(0, 8)}`,
    user,
    event: auditActionLabel(row.action, row.entity_type),
    target: metadataString(metadata, "target", row.entity_id ?? row.entity_type),
    ip: metadataString(metadata, "ip", "غير مسجل"),
    time: compactDateLabel(row.created_at),
    status: auditStatus(row.action, metadata),
  };
}

function adminRoleStatusLabel(status: string): DashboardAdminRole["status"] {
  if (status === "disabled") return "معطل";
  if (status === "limited") return "محدود";
  return "نشط";
}

function adminRoleStatusValue(status: string | undefined): string {
  if (status === "معطل" || status === "disabled") return "disabled";
  if (status === "محدود" || status === "limited") return "limited";
  return "active";
}

function mapAdminRole(row: AdminRoleRow): DashboardAdminRole {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name_ar,
    users: row.users_count ?? 0,
    permissions: row.permissions_count ?? 0,
    scope: row.scope_ar,
    status: adminRoleStatusLabel(row.status),
    updated: compactDateLabel(row.updated_at ?? row.created_at),
  };
}

function mapSystemAdmin(profile: AdminProfileRow): DashboardSystemAdmin {
  const metadata = metadataRecord(profile.metadata as Json);
  return {
    id: profile.id,
    name: profile.full_name,
    email: profile.email ?? "غير متوفر",
    role: metadataString(metadata, "adminRole", "مدير النظام"),
    status: profile.verification_status === "archived" || profile.verification_status === "rejected" ? "موقوف مؤقتاً" : "نشط",
    lastLogin: compactDateLabel(profile.updated_at),
    sessions: typeof metadata.sessions === "number" ? metadata.sessions : 1,
  };
}

function mapAdminProvider(row: AdminServiceProviderRow): DashboardAdminProvider {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name_ar,
    status: providerStatusToAdminStatus(row.status),
    category: row.category_ar,
    city: row.city_ar,
    contact: row.contact ?? "غير متوفر",
    requests: row.requests_count ?? 0,
    rating: toNumber(row.rating),
    joinedAt: row.created_at,
    license: row.license_number ?? "غير متوفر",
  };
}

function mapAdminContentItem(row: AdminContentItemRow): DashboardAdminContentItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title_ar,
    kind: row.kind,
    typeLabel: contentKindLabel(row.kind),
    status: row.status,
    category: row.category_ar ?? "غير مصنف",
    author: row.author_ar ?? "فريق المحتوى",
    updatedAt: compactDateLabel(row.updated_at ?? row.created_at),
    views: new Intl.NumberFormat("ar-SA").format(row.view_count ?? 0),
  };
}

function mapAdminContentComment(row: AdminContentCommentRow): DashboardAdminContentComment {
  return {
    id: row.id,
    contentSlug: row.content_slug,
    contentType: row.content_type,
    authorName: row.author_name,
    body: row.body_ar,
    status: dashboardAdminContentCommentStatus(row.status) ?? "submitted",
    createdAt: compactDateLabel(row.created_at),
    updatedAt: compactDateLabel(row.updated_at ?? row.created_at),
  };
}

function arrayFromJson(value: Json): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function timelineFromJson(value: Json): Contribution["timeline"] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is { labelAr?: Json; completed?: Json; current?: Json } => typeof item === "object" && item !== null && !Array.isArray(item))
    .map((item) => ({
      labelAr: typeof item.labelAr === "string" ? item.labelAr : "",
      completed: item.completed === true,
      current: item.current === true,
    }))
    .filter((item) => item.labelAr.length > 0);
}

function assetStatus(status: string): AssetStatus {
  if (status === "approved") return "مؤهل";
  if (status === "archived" || status === "rejected") return "مغلق";
  if (status === "needs_changes") return "قيد الهيكلة";
  return "قيد الدراسة";
}

function contributionStage(stage: string): ContributionStage {
  if (["تحت الدراسة", "قيد الهيكلة", "تحت الطرح", "مفتوحة", "مغلقة", "تخارج"].includes(stage)) {
    return stage as ContributionStage;
  }
  return "تحت الدراسة";
}

function slugify(input: string) {
  const slug = input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `item-${Date.now()}`;
}

function isUuid(value: string | undefined) {
  return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));
}

async function resolveAsset(input: { entityId?: string; slug?: string; title?: string }): Promise<ResolvedEntity | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  let query = supabase
    .from("real_estate_assets")
    .select("id, slug, title_ar, owner_user_id, organization_id, metadata")
    .limit(1);

  if (isUuid(input.entityId)) {
    query = query.eq("id", input.entityId);
  } else if (input.slug) {
    query = query.eq("slug", input.slug);
  } else if (input.title) {
    query = query.eq("title_ar", input.title);
  } else {
    return null;
  }

  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;

  return {
    id: data.id as string,
    slug: data.slug as string | null,
    titleAr: data.title_ar as string,
    ownerUserId: data.owner_user_id as string | null,
    organizationId: data.organization_id as string | null,
    metadata: jsonRecord(data.metadata),
  };
}

async function resolveContribution(input: { entityId?: string; slug?: string; title?: string }): Promise<ResolvedEntity | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  let query = supabase
    .from("real_estate_contributions")
    .select("id, slug, title_ar, organization_id, metadata")
    .limit(1);

  if (isUuid(input.entityId)) {
    query = query.eq("id", input.entityId);
  } else if (input.slug) {
    query = query.eq("slug", input.slug);
  } else if (input.title) {
    query = query.eq("title_ar", input.title);
  } else {
    return null;
  }

  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;

  return {
    id: data.id as string,
    slug: data.slug as string | null,
    titleAr: data.title_ar as string,
    organizationId: data.organization_id as string | null,
    metadata: jsonRecord(data.metadata),
  };
}

async function resolveReviewEntity(entityType: ReviewEntityType, input: { entityId?: string; slug?: string; title?: string }): Promise<ResolvedEntity | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  if (entityType === "asset") return resolveAsset(input);
  if (entityType === "contribution") return resolveContribution(input);
  if (!isUuid(input.entityId)) return null;

  if (entityType === "service_request") {
    const { data, error } = await supabase
      .from("service_requests")
      .select("id, title_ar, requester_user_id, organization_id, metadata")
      .eq("id", input.entityId)
      .maybeSingle();
    if (error || !data) return null;
    return {
      id: data.id as string,
      titleAr: data.title_ar as string,
      ownerUserId: data.requester_user_id as string | null,
      organizationId: data.organization_id as string | null,
      metadata: jsonRecord(data.metadata),
    };
  }

  const { data, error } = await supabase
    .from("verification_requests")
    .select("id, requester_user_id, organization_id, payload")
    .eq("id", input.entityId)
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id as string,
    titleAr: "طلب شارة توثيق",
    ownerUserId: data.requester_user_id as string | null,
    organizationId: data.organization_id as string | null,
    metadata: jsonRecord(data.payload),
  };
}

function mapAsset(row: AssetRow): Asset {
  const areaSqm = toNumber(row.area_sqm);
  const pricePerSqm = row.price_per_sqm ? toNumber(row.price_per_sqm) : areaSqm > 0 ? Math.round(toNumber(row.estimated_value_sar) / areaSqm) : undefined;

  return {
    id: row.id,
    slug: row.slug,
    titleAr: row.title_ar,
    cityAr: row.city_ar,
    districtAr: row.district_ar ?? undefined,
    assetTypeAr: row.asset_type_ar,
    usageTypeAr: row.usage_type_ar,
    areaSqm,
    pricePerSqm,
    streetWidthM: row.street_width_m ? toNumber(row.street_width_m) : undefined,
    frontageCount: row.frontage_count ?? undefined,
    statusAr: assetStatus(row.status),
    deedNumber: row.deed_number ?? undefined,
    listingDate: row.listing_date,
    image: row.image_url,
    gallery: arrayFromJson(row.gallery),
    excerptAr: row.excerpt_ar,
  };
}

function mapContribution(row: ContributionRow): Contribution {
  return {
    id: row.id,
    slug: row.slug,
    titleAr: row.title_ar,
    cityAr: row.city_ar,
    stageAr: contributionStage(row.stage_ar),
    capitalSar: toNumber(row.capital_sar),
    investorsCount: row.investors_count,
    durationMonths: row.duration_months,
    fundedPercent: row.funded_percent,
    expectedReturnPercent: row.expected_return_percent ? toNumber(row.expected_return_percent) : undefined,
    remainingDays: row.remaining_days ?? undefined,
    image: row.image_url,
    timeline: timelineFromJson(row.timeline),
    excerptAr: row.excerpt_ar,
  };
}

function mapServiceCatalog(row: ServiceCatalogRow): ServiceItem {
  const fallback = staticServices.find((service) => service.slug === row.slug) ?? staticServices[0];

  return {
    id: row.id,
    slug: row.slug,
    titleAr: row.title_ar,
    descriptionAr: row.description_ar,
    durationAr: row.duration_ar ?? fallback?.durationAr ?? "حسب الطلب",
    levelAr: row.level_ar ?? fallback?.levelAr ?? "تشغيلية",
    outputsAr: row.outputs_ar ?? fallback?.outputsAr ?? "تقرير خدمة",
    icon: fallback?.icon ?? staticServices[0].icon,
  };
}

function fallbackAdminServiceCatalog(): DashboardAdminServiceCatalogItem[] {
  return staticServices.map((service, index) => ({
    ...service,
    status: index % 5 === 0 ? "موقوفة مؤقتاً" : "نشطة",
    category: service.levelAr,
    basePrice: [2500, 4800, 7200, 12500, 6000, 9200][index % 6],
    active: index % 5 !== 0,
    updatedAt: null,
    source: "static",
  }));
}

function mapAdminServiceCatalog(row: ServiceCatalogRow): DashboardAdminServiceCatalogItem {
  const service = mapServiceCatalog(row);
  const active = row.active !== false;

  return {
    ...service,
    status: active ? "نشطة" : "موقوفة مؤقتاً",
    category: service.levelAr,
    basePrice: toNumber(row.price_sar, 0),
    active,
    updatedAt: row.updated_at ?? null,
    source: "supabase",
  };
}

function contentJsonRecord(value: Json): Record<string, Json> {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function contentJsonString(value: Json | undefined) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function contentDate(row: PublicContentItemRow) {
  const value = row.updated_at || row.created_at;
  return value ? value.slice(0, 10) : new Date().toISOString().slice(0, 10);
}

function contentImage(row: PublicContentItemRow, fallback: string) {
  const metadata = contentJsonRecord(row.metadata);
  return contentJsonString(metadata.image) ?? contentJsonString(metadata.imageUrl) ?? contentJsonString(metadata.coverImage) ?? fallback;
}

function contentIsNews(row: PublicContentItemRow) {
  const text = `${row.category_ar ?? ""} ${row.title_ar}`;
  return text.includes("أخبار") || text.includes("تحديث") || text.includes("إعلان");
}

function mapPublicContentArticle(row: PublicContentItemRow, variant: "news" | "blog", index: number): Article {
  const fallback = variant === "news"
    ? staticArticles[index % staticArticles.length]
    : staticKnowledgeResources[index % staticKnowledgeResources.length];

  return {
    id: row.id,
    slug: row.slug,
    titleAr: row.title_ar,
    categoryAr: row.category_ar ?? (variant === "news" ? "أخبار مهابة" : "المقالات"),
    date: contentDate(row),
    excerptAr: row.excerpt_ar ?? row.body_ar ?? fallback.excerptAr,
    image: contentImage(row, fallback.image),
    featured: index === 0,
  };
}

export async function getAssets() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { data: staticAssets, source: "static" as const };

  const { data, error } = await supabase
    .from("real_estate_assets")
    .select("id, slug, title_ar, city_ar, district_ar, asset_type_ar, usage_type_ar, area_sqm, estimated_value_sar, price_per_sqm, street_width_m, frontage_count, status, deed_number, listing_date, image_url, gallery, excerpt_ar")
    .order("listing_date", { ascending: false });

  if (error || !data) return { data: [] as Asset[], source: "supabase" as const, error: error?.message };
  return { data: (data as AssetRow[]).map(mapAsset), source: "supabase" as const };
}

export async function getAssetBySlug(slug: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { data: staticAssets.find((asset) => asset.slug === slug) ?? null, source: "static" as const };

  const { data, error } = await supabase
    .from("real_estate_assets")
    .select("id, slug, title_ar, city_ar, district_ar, asset_type_ar, usage_type_ar, area_sqm, estimated_value_sar, price_per_sqm, street_width_m, frontage_count, status, deed_number, listing_date, image_url, gallery, excerpt_ar")
    .eq("slug", slug)
    .maybeSingle();

  if (error) return { data: null as Asset | null, source: "supabase" as const, error: error.message };
  return { data: data ? mapAsset(data as AssetRow) : null, source: "supabase" as const };
}

export async function getContributions() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { data: staticContributions, source: "static" as const };

  const { data, error } = await supabase
    .from("real_estate_contributions")
    .select("id, slug, title_ar, city_ar, stage_ar, capital_sar, investors_count, duration_months, funded_percent, expected_return_percent, remaining_days, image_url, timeline, excerpt_ar")
    .order("created_at", { ascending: false });

  if (error || !data) return { data: [] as Contribution[], source: "supabase" as const, error: error?.message };
  return { data: (data as ContributionRow[]).map(mapContribution), source: "supabase" as const };
}

export async function getContributionBySlug(slug: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { data: staticContributions.find((contribution) => contribution.slug === slug) ?? null, source: "static" as const };

  const { data, error } = await supabase
    .from("real_estate_contributions")
    .select("id, slug, title_ar, city_ar, stage_ar, capital_sar, investors_count, duration_months, funded_percent, expected_return_percent, remaining_days, image_url, timeline, excerpt_ar")
    .eq("slug", slug)
    .maybeSingle();

  if (error) return { data: null as Contribution | null, source: "supabase" as const, error: error.message };
  return { data: data ? mapContribution(data as ContributionRow) : null, source: "supabase" as const };
}

export async function getServices() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { data: staticServices, source: "static" as const };

  const { data, error } = await supabase
    .from("services_catalog")
    .select("id, slug, title_ar, description_ar, duration_ar, level_ar, outputs_ar")
    .eq("active", true)
    .order("title_ar", { ascending: true });

  if (error || !data) return { data: [] as ServiceItem[], source: "supabase" as const, error: error?.message };
  return { data: (data as ServiceCatalogRow[]).map(mapServiceCatalog), source: "supabase" as const };
}

export async function listDashboardAdminServiceCatalog(): Promise<{ data: DashboardAdminServiceCatalogItem[]; source: "supabase" | "static"; error?: string }> {
  const fallback = fallbackAdminServiceCatalog();
  const supabase = getSupabaseAdmin();
  if (!supabase) return { data: fallback, source: "static" };

  const { data, error } = await supabase
    .from("services_catalog")
    .select("id, slug, title_ar, description_ar, duration_ar, level_ar, outputs_ar, price_sar, active, updated_at")
    .order("updated_at", { ascending: false });

  if (error || !data) return { data: [], source: "supabase", error: error?.message };
  const rows = (data as ServiceCatalogRow[]).map(mapAdminServiceCatalog);
  return { data: rows, source: "supabase" };
}

async function listPublishedContentItems() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { data: [] as PublicContentItemRow[], source: "static" as const };

  const { data, error } = await supabase
    .from("content_items")
    .select("id, slug, title_ar, category_ar, excerpt_ar, body_ar, metadata, created_at, updated_at")
    .eq("kind", "article")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  if (error || !data) return { data: [] as PublicContentItemRow[], source: "supabase" as const, error: error?.message };
  return { data: data as unknown as PublicContentItemRow[], source: "supabase" as const };
}

export async function getPublicNewsArticles() {
  const result = await listPublishedContentItems();
  const rows = result.data.filter(contentIsNews);
  if (!rows.length) return { data: result.source === "static" ? staticArticles : [], source: result.source, error: result.error };
  return { data: rows.map((row, index) => mapPublicContentArticle(row, "news", index)), source: result.source, error: result.error };
}

export async function getPublicKnowledgeResources() {
  const result = await listPublishedContentItems();
  const rows = result.data.filter((row) => !contentIsNews(row));
  if (!rows.length) return { data: result.source === "static" ? staticKnowledgeResources : [], source: result.source, error: result.error };

  const data: KnowledgeResource[] = rows.map((row, index) => {
    const article = mapPublicContentArticle(row, "blog", index);
    return { ...article, tabAr: article.categoryAr };
  });
  return { data, source: result.source, error: result.error };
}

export async function toggleDashboardInterest(input: {
  entityType: InterestEntityType;
  entityId?: string;
  slug?: string;
  title?: string;
  interested?: boolean;
  actor?: DashboardActorContext | null;
}): Promise<PersistResult & { interested: boolean; entityId?: string; message?: string }> {
  const supabase = getSupabaseAdmin();
  const interested = input.interested ?? true;
  if (!supabase) return { ok: true, persisted: false, interested, message: "supabase_not_configured" };

  const userId = input.actor?.userId || DEMO_INDIVIDUAL_USER_ID;
  const entity = input.entityType === "asset"
    ? await resolveAsset(input)
    : await resolveContribution(input);

  if (!entity) return { ok: true, persisted: false, interested, message: "entity_not_found" };

  if (input.entityType === "asset") {
    const query = interested
      ? supabase.from("asset_interests").upsert({ asset_id: entity.id, user_id: userId }, { onConflict: "asset_id,user_id" })
      : supabase.from("asset_interests").delete().eq("asset_id", entity.id).eq("user_id", userId);
    const { error } = await query;
    if (error) throw new Error(error.message);
  } else {
    const query = interested
      ? supabase.from("contribution_interests").upsert({ contribution_id: entity.id, user_id: userId }, { onConflict: "contribution_id,user_id" })
      : supabase.from("contribution_interests").delete().eq("contribution_id", entity.id).eq("user_id", userId);
    const { error } = await query;
    if (error) throw new Error(error.message);
  }

  const role = input.actor?.role === "business" ? "business" : "individual";
  const actionUrl = `/dashboard/${role}/${input.entityType === "asset" ? "asset-details" : "contribution-details"}?${input.entityType === "asset" ? "asset" : "contribution"}=${encodeURIComponent(entity.slug || entity.id)}`;
  const label = input.entityType === "asset" ? "الأصل العقاري" : "المساهمة العقارية";
  const organizationId = input.actor?.organizationId ?? null;

  await insertRequiredAuditLog(supabase, {
    actor_user_id: userId,
    organization_id: organizationId,
    action: interested ? "dashboard_interest_added" : "dashboard_interest_removed",
    entity_type: input.entityType,
    entity_id: entity.id,
    metadata: {
      titleAr: entity.titleAr,
      interested,
      scope: role,
    },
  });

  await insertRequiredNotification(supabase, {
    user_id: organizationId ? null : userId,
    organization_id: organizationId,
    title_ar: interested ? "تمت إضافة الاهتمام" : "تمت إزالة الاهتمام",
    body_ar: `${label} ${entity.titleAr} ${interested ? "تمت إضافته إلى قائمة الاهتمام." : "تمت إزالته من قائمة الاهتمام."}`,
    category: input.entityType === "asset" ? "asset_interest" : "contribution_interest",
    action_url: actionUrl,
    metadata: {
      entityType: input.entityType,
      entityId: entity.id,
      interested,
    },
  });

  return { ok: true, persisted: true, interested, entityId: entity.id };
}

function cleanVerificationPayload(payload?: Record<string, VerificationPayloadValue>): Record<string, Json> {
  if (!payload) return {};

  return Object.fromEntries(
    Object.entries(payload)
      .filter((entry): entry is [string, Exclude<VerificationPayloadValue, undefined>] => typeof entry[1] !== "undefined")
      .map(([key, value]) => [key, value]),
  );
}

function cleanEntityPayload(payload?: Record<string, EntityRequestPayloadValue>): Record<string, Json> {
  if (!payload) return {};

  return Object.fromEntries(
    Object.entries(payload)
      .filter((entry): entry is [string, Exclude<EntityRequestPayloadValue, undefined>] => typeof entry[1] !== "undefined")
      .map(([key, value]) => [key, value]),
  );
}

function cleanAdminManagementPayload(payload?: Record<string, AdminManagementPayloadValue>): Record<string, Json> {
  if (!payload) return {};

  return Object.fromEntries(
    Object.entries(payload)
      .filter((entry): entry is [string, Exclude<AdminManagementPayloadValue, undefined>] => typeof entry[1] !== "undefined")
      .map(([key, value]) => [key, value]),
  );
}

function cleanAccountSettingsPayload(payload?: Record<string, DashboardAccountSettingsPayloadValue>): Record<string, Json> {
  if (!payload) return {};

  return Object.fromEntries(
    Object.entries(payload)
      .filter((entry): entry is [string, Exclude<DashboardAccountSettingsPayloadValue, undefined>] => typeof entry[1] !== "undefined")
      .map(([key, value]) => [key, value]),
  );
}

const accountPasswordFields = new Set(["currentPassword", "newPassword", "confirmPassword"]);
const accountSettingsAllowedFields: Record<DashboardAccountSettingsKind, Set<string>> = {
  profile: new Set([
    "name",
    "fullName",
    "commercialRegistration",
    "identityNumber",
    "activityType",
    "email",
    "phone",
    "city",
    "website",
    "birthDate",
    "nationality",
    "postalCode",
    "country",
    "address",
    "profileCompletion",
  ]),
  security: new Set([
    "passwordRotationRequested",
    "passwordFieldsSubmitted",
    "passwordUpdatedAt",
    "twoFactorEnabled",
    "smsVerification",
    "emailVerification",
    "securityScore",
    "trustedDevices",
    "loginAlerts",
  ]),
  preferences: new Set([
    "preferredCities",
    "preferredContributions",
    "preferredAssets",
    "assetNotifications",
    "contributionNotifications",
    "messageNotifications",
    "opportunityNotifications",
    "preferencesSection",
  ]),
};

function redactAccountSettingsPayload(payload: Record<string, Json>): Record<string, Json> {
  return Object.fromEntries(Object.entries(payload).filter(([key]) => !accountPasswordFields.has(key)));
}

function allowedAccountSettingsPayload(kind: DashboardAccountSettingsKind, payload: Record<string, Json>): Record<string, Json> {
  const allowed = accountSettingsAllowedFields[kind];
  return Object.fromEntries(Object.entries(payload).filter(([key]) => allowed.has(key)));
}

function accountPasswordText(payload: Record<string, Json>, key: string) {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

function accountPasswordChange(payload: Record<string, Json>) {
  const currentPassword = accountPasswordText(payload, "currentPassword");
  const newPassword = accountPasswordText(payload, "newPassword");
  const confirmPassword = accountPasswordText(payload, "confirmPassword");
  const requested = Boolean(currentPassword || newPassword || confirmPassword || payload.passwordFieldsSubmitted === true);
  return {
    requested,
    complete: Boolean(currentPassword && newPassword && confirmPassword),
    currentPassword,
    newPassword,
    confirmPassword,
  };
}

function accountSettingsEmailInvalid(kind: DashboardAccountSettingsKind, payload: Record<string, Json>) {
  if (kind !== "profile" || !Object.prototype.hasOwnProperty.call(payload, "email")) return false;
  const email = payload.email;
  if (typeof email !== "string") return true;
  return !validDashboardEmail(email);
}

function validDashboardEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

async function dashboardActorEmail(supabase: SupabaseClient, actor: DashboardActorContext | null | undefined, userId: string) {
  if (actor?.email) return actor.email;
  const { data, error } = await supabase.auth.admin.getUserById(userId);
  if (error) throw new Error(error.message);
  return data.user?.email ?? null;
}

async function verifyDashboardCurrentPassword(email: string, password: string) {
  const publicClient = getSupabasePublic();
  if (!publicClient) return "supabase_public_not_configured" as const;
  const { error } = await publicClient.auth.signInWithPassword({ email, password });
  if (error) return "password_current_invalid" as const;
  await publicClient.auth.signOut().catch(() => undefined);
  return "verified" as const;
}

function jsonRecord(value: unknown): Record<string, Json> {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, Json>;
  return {};
}

function latestReviewFromMetadata(metadata: Json): { decision: ReviewDecision | null; note: string | null; reviewedAt: string | null } {
  const latestReview = jsonRecord(metadataRecord(metadata).latestReview);
  const decision = latestReview.decision;
  const note = latestReview.note;
  const reviewedAt = latestReview.reviewedAt;
  const parsedDecision: ReviewDecision | null = decision === "approved" || decision === "needs_changes" || decision === "rejected" ? decision : null;

  return {
    decision: parsedDecision,
    note: typeof note === "string" && note.trim().length > 0 ? note.trim() : null,
    reviewedAt: typeof reviewedAt === "string" && reviewedAt.trim().length > 0 ? reviewedAt.trim() : null,
  };
}

function reviewHistoryFromMetadata(metadata: Json) {
  const history = metadataRecord(metadata).reviewHistory;
  if (!Array.isArray(history)) return [];
  return history
    .map((entry) => jsonRecord(entry))
    .filter((entry) => entry.decision === "approved" || entry.decision === "needs_changes" || entry.decision === "rejected");
}

function publicSubmissionOwnerLabel(metadata: Json, fallback = "طلب عام من الموقع") {
  const record = metadataRecord(metadata);
  if (record.source !== "public") return fallback;

  const contact = metadataRecord(record.contact);
  for (const key of ["fullName", "name", "email", "mobile"]) {
    const value = contact[key];
    if (typeof value === "string" && value.trim().length > 0) return value.trim();
  }

  return fallback;
}

export async function listDashboardPlatformSettings(prefix?: string): Promise<{ data: DashboardPlatformSetting[]; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { data: [], source: "static", error: "supabase_not_configured" };

  let query = supabase
    .from("platform_settings")
    .select("key, value, updated_at")
    .order("updated_at", { ascending: false });

  if (prefix) query = query.ilike("key", `${prefix}%`);

  const { data, error } = await query;
  if (error) return { data: [], source: "supabase", error: error.message };

  return {
    data: (data ?? []).map((row) => ({
      key: String(row.key),
      value: row.value,
      updatedAt: String(row.updated_at ?? ""),
    })),
    source: "supabase",
  };
}

function compactText(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

function positiveNumber(value: number | undefined, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
}

function payloadText(payload: Record<string, Json>, key: string, fallback: string) {
  const value = payload[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function payloadNumber(payload: Record<string, Json>, key: string, fallback: number) {
  const value = payload[key];
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return value;
  if (typeof value === "string") {
    const parsed = toNumber(value, fallback);
    return parsed > 0 ? parsed : fallback;
  }
  return fallback;
}

function payloadNumeric(payload: Record<string, Json>, key: string, fallback: number) {
  const value = payload[key];
  if (typeof value === "number" || typeof value === "string") {
    const parsed = toNumber(value, fallback);
    return parsed > 0 ? parsed : fallback;
  }
  return fallback;
}

function payloadBoolean(payload: Record<string, Json>, key: string, fallback: boolean) {
  const value = payload[key];
  return typeof value === "boolean" ? value : fallback;
}

function profileMetadataText(metadata: Record<string, Json>, key: string, fallback: string) {
  const value = metadata[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function staticIndividualProfile(): DashboardIndividualProfileData {
  return {
    id: DEMO_INDIVIDUAL_USER_ID,
    fullName: "أحمد عبدالله محمد",
    email: "ahmed.abdullah@example.com",
    phone: "+966 50 123 4567",
    city: "الرياض",
    avatarUrl: null,
    verificationStatus: "approved",
    profileCompletion: 85,
    createdAt: "2024-03-15T00:00:00.000Z",
    updatedAt: "2026-06-20T09:00:00.000Z",
    membershipNumber: "MBH-2024-01578",
    accountType: "مستثمر فرد",
    identityNumber: "1010101010",
    birthDate: "1990/05/15",
    nationality: "سعودي",
    postalCode: "13336",
    country: "المملكة العربية السعودية",
    address: "حي العليا، طريق الملك سلمان",
  };
}

export async function getDashboardIndividualProfile(actor?: DashboardActorContext | null): Promise<{ data: DashboardIndividualProfileData; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  const fallback = staticIndividualProfile();
  if (!supabase) return { data: fallback, source: "static" };

  const userId = actor?.userId ?? DEMO_INDIVIDUAL_USER_ID;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, city_ar, avatar_url, verification_status, profile_completion, metadata, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return {
      source: "supabase",
      error: error?.message ?? "profile_not_found",
      data: {
        ...fallback,
        id: userId,
        fullName: "",
        email: actor?.email ?? "",
        phone: "",
        city: "",
        avatarUrl: null,
        verificationStatus: "draft",
        profileCompletion: 0,
        createdAt: null,
        updatedAt: null,
        membershipNumber: "",
        accountType: "",
        identityNumber: "",
        birthDate: "",
        nationality: "",
        postalCode: "",
        country: "",
        address: "",
      },
    };
  }

  const row = data as {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    city_ar: string | null;
    avatar_url: string | null;
    verification_status: string;
    profile_completion: number | null;
    metadata: unknown;
    created_at: string | null;
    updated_at: string | null;
  };
  const metadata = jsonRecord(row.metadata);
  const accountSettings = jsonRecord(metadata.accountSettings);
  const profile = jsonRecord(accountSettings.profile);

  return {
    source: "supabase",
    data: {
      id: row.id,
      fullName: row.full_name,
      email: row.email ?? fallback.email,
      phone: row.phone ?? fallback.phone,
      city: row.city_ar ?? fallback.city,
      avatarUrl: row.avatar_url ?? fallback.avatarUrl,
      verificationStatus: row.verification_status,
      profileCompletion: row.profile_completion ?? fallback.profileCompletion,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      membershipNumber: profileMetadataText(profile, "membershipNumber", fallback.membershipNumber),
      accountType: profileMetadataText(profile, "accountType", fallback.accountType),
      identityNumber: profileMetadataText(profile, "identityNumber", fallback.identityNumber),
      birthDate: profileMetadataText(profile, "birthDate", fallback.birthDate),
      nationality: profileMetadataText(profile, "nationality", fallback.nationality),
      postalCode: profileMetadataText(profile, "postalCode", fallback.postalCode),
      country: profileMetadataText(profile, "country", fallback.country),
      address: profileMetadataText(profile, "address", fallback.address),
    },
  };
}

function staticBusinessProfile(): DashboardBusinessProfileData {
  return {
    id: DEMO_BUSINESS_ORG_ID,
    organizationName: "شركة الازدهار العقارية",
    commercialRegistration: "1010123456",
    activityType: "إدارة المساهمات العقارية",
    city: "الرياض",
    email: "info@alazdehar.sa",
    phone: "+966 50 123 4567",
    website: "www.alazdehar.sa",
    logoUrl: "/brand/mahabah-icon-192.png",
    status: "approved",
    verificationStatus: "approved",
    profileCompletion: 96,
    createdAt: "2026-01-15T00:00:00.000Z",
    updatedAt: "2026-06-20T09:00:00.000Z",
    landline: "+966 11 234 5678",
    district: "الملك فهد",
    street: "شارع الملك فهد",
    buildingNumber: "5678",
    additionalNumber: "1233",
    postalCode: "12333",
    nationalAddress: "1233 4567 8901",
    delegateName: "أحمد محمد السبيعي",
    delegateId: "1010101010",
    delegatePhone: "+966 50 987 6543",
    delegateEmail: "ahmed@alazdehar.sa",
  };
}

export async function getDashboardBusinessProfile(actor?: DashboardActorContext | null): Promise<{ data: DashboardBusinessProfileData; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  const fallback = staticBusinessProfile();
  if (!supabase) return { data: fallback, source: "static" };

  const organizationId = actor?.organizationId ?? DEMO_BUSINESS_ORG_ID;
  const { data, error } = await supabase
    .from("organizations")
    .select("id, name_ar, commercial_registration, activity_type_ar, city_ar, email, phone, website, logo_url, status, verification_status, profile_completion, metadata, created_at, updated_at")
    .eq("id", organizationId)
    .maybeSingle();

  if (error || !data) {
    return {
      source: "supabase",
      error: error?.message ?? "organization_not_found",
      data: {
        ...fallback,
        id: organizationId,
        organizationName: "",
        commercialRegistration: "",
        activityType: "",
        city: "",
        email: actor?.email ?? "",
        phone: "",
        website: "",
        logoUrl: null,
        status: "draft",
        verificationStatus: "draft",
        profileCompletion: 0,
        createdAt: null,
        updatedAt: null,
        landline: "",
        district: "",
        street: "",
        buildingNumber: "",
        additionalNumber: "",
        postalCode: "",
        nationalAddress: "",
        delegateName: "",
        delegateId: "",
        delegatePhone: "",
        delegateEmail: "",
      },
    };
  }

  const row = data as {
    id: string;
    name_ar: string;
    commercial_registration: string | null;
    activity_type_ar: string | null;
    city_ar: string | null;
    email: string | null;
    phone: string | null;
    website: string | null;
    logo_url: string | null;
    status: string;
    verification_status: string;
    profile_completion: number | null;
    metadata: unknown;
    created_at: string | null;
    updated_at: string | null;
  };
  const metadata = jsonRecord(row.metadata);
  const accountSettings = jsonRecord(metadata.accountSettings);
  const profile = jsonRecord(accountSettings.profile);

  return {
    source: "supabase",
    data: {
      id: row.id,
      organizationName: row.name_ar,
      commercialRegistration: row.commercial_registration ?? fallback.commercialRegistration,
      activityType: row.activity_type_ar ?? fallback.activityType,
      city: row.city_ar ?? fallback.city,
      email: row.email ?? fallback.email,
      phone: row.phone ?? fallback.phone,
      website: row.website ?? fallback.website,
      logoUrl: row.logo_url ?? fallback.logoUrl,
      status: row.status,
      verificationStatus: row.verification_status,
      profileCompletion: row.profile_completion ?? fallback.profileCompletion,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      landline: profileMetadataText(profile, "landline", fallback.landline),
      district: profileMetadataText(profile, "district", fallback.district),
      street: profileMetadataText(profile, "street", fallback.street),
      buildingNumber: profileMetadataText(profile, "buildingNumber", fallback.buildingNumber),
      additionalNumber: profileMetadataText(profile, "additionalNumber", fallback.additionalNumber),
      postalCode: profileMetadataText(profile, "postalCode", fallback.postalCode),
      nationalAddress: profileMetadataText(profile, "nationalAddress", fallback.nationalAddress),
      delegateName: profileMetadataText(profile, "delegateName", fallback.delegateName),
      delegateId: profileMetadataText(profile, "delegateId", fallback.delegateId),
      delegatePhone: profileMetadataText(profile, "delegatePhone", fallback.delegatePhone),
      delegateEmail: profileMetadataText(profile, "delegateEmail", fallback.delegateEmail),
    },
  };
}

function dashboardRequestReference(kind: DashboardEntityRequestKind) {
  const prefix: Record<DashboardEntityRequestKind, string> = {
    asset: "AST",
    contribution: "CON",
    service_request: "SRV",
  };
  return `${prefix[kind]}-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`;
}

function dashboardRequestSlug(scope: DashboardEntityRequestScope, kind: DashboardEntityRequestKind) {
  return `${scope}-${kind}-${Date.now()}-${Math.floor(1000 + Math.random() * 8999)}`;
}

function dashboardRequestLabel(kind: DashboardEntityRequestKind) {
  if (kind === "asset") return "أصل عقاري";
  if (kind === "contribution") return "مساهمة عقارية";
  return "خدمة عقارية";
}

function dashboardRequestAdminUrl(kind: DashboardEntityRequestKind) {
  if (kind === "asset") return "/dashboard/admin/review-center/assets";
  if (kind === "contribution") return "/dashboard/admin/review-center/contributions";
  return "/dashboard/admin/review-center/services";
}

function dashboardRequestOwnerUrl(scope: DashboardEntityRequestScope, kind: DashboardEntityRequestKind, entityId?: string) {
  const base = `/dashboard/${scope}`;
  if (kind === "asset") return `${base}/${scope === "business" ? "company-assets" : "my-assets"}${entityId ? `?asset=${entityId}` : ""}`;
  if (kind === "contribution") return `${base}/${scope === "business" ? "company-contributions" : "browse-contributions"}${entityId ? `?contribution=${entityId}` : ""}`;
  return entityId ? `${base}/service-details?request=${encodeURIComponent(entityId)}` : `${base}/my-requests`;
}

function reviewEntityCategory(entityType: ReviewEntityType) {
  if (entityType === "asset") return "asset_review";
  if (entityType === "contribution") return "contribution_review";
  if (entityType === "service_request") return "service_review";
  return "verification_review";
}

function reviewEntityActionUrl(entityType: ReviewEntityType, entity: ResolvedEntity) {
  const role = entity.organizationId ? "business" : "individual";
  const ref = encodeURIComponent(entity.slug || entity.id);

  if (entityType === "asset") return `/dashboard/${role}/asset-details?asset=${ref}`;
  if (entityType === "contribution") return `/dashboard/${role}/contribution-details?contribution=${ref}`;
  if (entityType === "service_request") return `/dashboard/${role}/service-details?request=${ref}`;
  return `/dashboard/${role}/verification`;
}

function dashboardScopedOwner(scope: DashboardEntityRequestScope, actor?: DashboardActorContext | null) {
  const actorUserId = actor?.userId ?? (scope === "business" ? DEMO_BUSINESS_USER_ID : DEMO_INDIVIDUAL_USER_ID);
  if (scope === "business") {
    return {
      ownerUserId: null,
      requesterUserId: null,
      organizationId: actor?.organizationId ?? DEMO_BUSINESS_ORG_ID,
      actorUserId,
    };
  }

  return {
    ownerUserId: actorUserId,
    requesterUserId: actorUserId,
    organizationId: null,
    actorUserId,
  };
}

function dashboardDocumentOwner(scope: DashboardDocumentScope, actor?: DashboardActorContext | null) {
  if (scope === "business") {
    const organizationId = actor?.organizationId ?? DEMO_BUSINESS_ORG_ID;
    const uploadedBy = actor?.userId ?? DEMO_BUSINESS_USER_ID;
    return {
      ownerUserId: null,
      organizationId,
      uploadedBy,
      folder: `organizations/${organizationId}`,
    };
  }

  if (scope === "admin") {
    const userId = actor?.userId ?? DEMO_ADMIN_USER_ID;
    return {
      ownerUserId: userId,
      organizationId: null,
      uploadedBy: userId,
      folder: `users/${userId}`,
    };
  }

  const userId = actor?.userId ?? DEMO_INDIVIDUAL_USER_ID;
  return {
    ownerUserId: userId,
    organizationId: null,
    uploadedBy: userId,
    folder: `users/${userId}`,
  };
}

async function dashboardDocumentTargetAllowed(
  supabase: SupabaseClient,
  input: { scope: DashboardDocumentScope; entityType: string; entityId: string | null },
  owner: ReturnType<typeof dashboardDocumentOwner>,
) {
  if (!input.entityId || input.scope === "admin") return true;

  const entityType = input.entityType.toLowerCase();
  const assertOwnedRow = (row: { owner_user_id?: string | null; requester_user_id?: string | null; organization_id?: string | null } | null) => {
    if (!row) return false;
    if (input.scope === "business") return Boolean(owner.organizationId && row.organization_id === owner.organizationId);
    return Boolean(owner.ownerUserId && (row.owner_user_id === owner.ownerUserId || row.requester_user_id === owner.ownerUserId));
  };

  if (entityType.includes("organization") || entityType.includes("business_profile")) {
    return input.scope === "business" && input.entityId === owner.organizationId;
  }

  if (entityType.includes("profile") || entityType.includes("avatar")) {
    return input.scope === "individual" && input.entityId === owner.ownerUserId;
  }

  if (entityType.includes("asset")) {
    const { data, error } = await supabase
      .from("real_estate_assets")
      .select("owner_user_id, organization_id")
      .eq("id", input.entityId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return assertOwnedRow(data as { owner_user_id?: string | null; organization_id?: string | null } | null);
  }

  if (entityType.includes("contribution")) {
    const { data, error } = await supabase
      .from("real_estate_contributions")
      .select("organization_id")
      .eq("id", input.entityId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return assertOwnedRow(data as { organization_id?: string | null } | null);
  }

  if (entityType.includes("service_request")) {
    const { data, error } = await supabase
      .from("service_requests")
      .select("requester_user_id, organization_id")
      .eq("id", input.entityId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return assertOwnedRow(data as { requester_user_id?: string | null; organization_id?: string | null } | null);
  }

  if (entityType.includes("verification")) {
    const { data, error } = await supabase
      .from("verification_requests")
      .select("requester_user_id, organization_id")
      .eq("id", input.entityId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    const row = data as { requester_user_id?: string | null; organization_id?: string | null } | null;
    if (!row) return false;
    if (input.scope === "business") return Boolean(owner.organizationId && row.organization_id === owner.organizationId);
    return Boolean(owner.ownerUserId && row.requester_user_id === owner.ownerUserId);
  }

  if (entityType.includes("support_ticket")) {
    const { data, error } = await supabase
      .from("support_tickets")
      .select("requester_user_id, organization_id")
      .eq("id", input.entityId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return assertOwnedRow(data as { requester_user_id?: string | null; organization_id?: string | null } | null);
  }

  return false;
}

function safeStorageFileName(fileName: string) {
  const normalized = fileName.trim().replaceAll(/\s+/g, "-").replaceAll(/[^a-zA-Z0-9._-]/g, "");
  return normalized || `document-${Date.now()}`;
}

function safeStorageSegment(value: string) {
  const normalized = value.trim().replaceAll(/\s+/g, "_").replaceAll(/[^a-zA-Z0-9_-]/g, "");
  return normalized || "dashboard_document";
}

async function removeUploadedDocumentObject(supabase: SupabaseClient, bucket: string, storagePath: string) {
  await supabase.storage.from(bucket).remove([storagePath]).catch(() => undefined);
}

function dashboardDocumentEntityRefAllowed(scope: DashboardDocumentScope, entityRef: string | null, entityType: string) {
  if (!entityRef || scope === "admin") return true;
  if (!/^[a-zA-Z0-9@._-]{8,160}$/.test(entityRef)) return false;
  if (entityRef.startsWith(`${scope}-`)) return true;
  if (entityType.includes("support_ticket") && entityRef.startsWith("support-ticket-")) return true;
  return false;
}

export async function uploadDashboardDocument(input: {
  scope: DashboardDocumentScope;
  entityType: string;
  entityId?: string;
  label?: string;
  file: File;
  actor?: DashboardActorContext | null;
}): Promise<PersistResult & { bucket: string; storagePath: string; fileName: string; message?: string }> {
  const bucket = "mahabah-documents";
  const owner = dashboardDocumentOwner(input.scope, input.actor);
  const fileName = safeStorageFileName(input.file.name);
  const entityType = compactText(input.entityType, "dashboard_document");
  const storageEntityType = safeStorageSegment(entityType);
  const entityId = isUuid(input.entityId) ? input.entityId! : null;
  const entityRef = input.entityId && !entityId ? input.entityId : null;
  const storagePath = `${owner.folder}/${storageEntityType}/${Date.now()}-${Math.floor(1000 + Math.random() * 8999)}-${fileName}`;
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return {
      ok: true,
      persisted: false,
      bucket,
      storagePath,
      fileName,
      message: "supabase_not_configured",
    };
  }

  if (!dashboardDocumentEntityRefAllowed(input.scope, entityRef, entityType)) {
    return {
      ok: true,
      persisted: false,
      bucket,
      storagePath,
      fileName,
      message: "document_target_forbidden",
    };
  }

  const targetAllowed = await dashboardDocumentTargetAllowed(supabase, { scope: input.scope, entityType, entityId }, owner);
  if (!targetAllowed) {
    return {
      ok: true,
      persisted: false,
      bucket,
      storagePath,
      fileName,
      message: "document_target_forbidden",
    };
  }

  const fileBuffer = Buffer.from(await input.file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, fileBuffer, {
      contentType: input.file.type || "application/octet-stream",
      upsert: false,
    });
  if (uploadError) throw new Error(uploadError.message);

  const { data, error } = await supabase
    .from("documents")
    .insert({
      owner_user_id: owner.ownerUserId,
      organization_id: owner.organizationId,
      entity_type: entityType,
      entity_id: entityId,
      entity_ref: entityRef,
      bucket,
      storage_path: storagePath,
      file_name: input.label ? `${input.label} - ${input.file.name}` : input.file.name,
      mime_type: input.file.type || null,
      size_bytes: input.file.size,
      uploaded_by: owner.uploadedBy,
    })
    .select("id")
    .single();
  if (error) {
    await removeUploadedDocumentObject(supabase, bucket, storagePath);
    throw new Error(error.message);
  }
  const documentId = data?.id as string | undefined;
  if (!documentId) {
    await removeUploadedDocumentObject(supabase, bucket, storagePath);
    return { ok: true, persisted: false, bucket, storagePath, fileName, message: "document_not_created" };
  }

  await insertRequiredAuditLog(supabase, {
    actor_user_id: owner.uploadedBy,
    organization_id: owner.organizationId,
    action: "dashboard_document_uploaded",
    entity_type: "document",
    entity_id: documentId,
    metadata: {
      bucket,
      storagePath,
      fileName: input.file.name,
      scope: input.scope,
      label: input.label ?? null,
      targetEntityType: entityType,
      targetEntityId: entityId,
      entityRef,
    },
  });

  if (input.scope !== "admin") {
    await insertRequiredNotification(supabase, {
      user_id: owner.ownerUserId,
      organization_id: owner.organizationId,
      title_ar: "تم رفع المستند",
      body_ar: `${input.label || input.file.name} تم رفعه وربطه بالطلب بنجاح.`,
      category: "documents",
      action_url: `/dashboard/${input.scope}/notifications`,
      metadata: {
        documentId,
        bucket,
        storagePath,
        scope: input.scope,
        entityType,
        entityRef,
      },
    });

    await insertDashboardAdminNotifications(supabase, {
      title: "تم رفع مستند جديد",
      body: `${input.label || input.file.name} جاهز للمراجعة.`,
      category: "documents",
      actionUrl: "/dashboard/admin/providers/documents",
      metadata: {
        documentId,
        bucket,
        storagePath,
        scope: input.scope,
        entityRef,
      },
    });
  }

  return { ok: true, persisted: true, id: documentId, bucket, storagePath, fileName };
}

export async function uploadPublicSubmissionDocument(input: {
  entityType: string;
  entityId?: string;
  label?: string;
  file: File;
}): Promise<PersistResult & { bucket: string; storagePath: string; fileName: string; message?: string }> {
  const bucket = "mahabah-documents";
  const fileName = safeStorageFileName(input.file.name);
  const entityType = compactText(input.entityType, "public_submission_document");
  const storageEntityType = safeStorageSegment(entityType);
  const entityId = isUuid(input.entityId) ? input.entityId! : null;
  const storagePath = `public-submissions/${storageEntityType}/${entityId ?? "unlinked"}/${Date.now()}-${Math.floor(1000 + Math.random() * 8999)}-${fileName}`;
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return {
      ok: true,
      persisted: false,
      bucket,
      storagePath,
      fileName,
      message: "supabase_not_configured",
    };
  }

  const fileBuffer = Buffer.from(await input.file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, fileBuffer, {
      contentType: input.file.type || "application/octet-stream",
      upsert: false,
    });
  if (uploadError) throw new Error(uploadError.message);

  const { data, error } = await supabase
    .from("documents")
    .insert({
      owner_user_id: null,
      organization_id: null,
      entity_type: entityType,
      entity_id: entityId,
      entity_ref: null,
      bucket,
      storage_path: storagePath,
      file_name: input.label ? `${input.label} - ${input.file.name}` : input.file.name,
      mime_type: input.file.type || null,
      size_bytes: input.file.size,
      uploaded_by: null,
    })
    .select("id")
    .single();
  if (error) {
    await removeUploadedDocumentObject(supabase, bucket, storagePath);
    throw new Error(error.message);
  }
  const documentId = data?.id as string | undefined;
  if (!documentId) {
    await removeUploadedDocumentObject(supabase, bucket, storagePath);
    return { ok: true, persisted: false, bucket, storagePath, fileName, message: "document_not_created" };
  }

  await insertRequiredAuditLog(supabase, {
    actor_user_id: null,
    organization_id: null,
    action: "public_submission_document_uploaded",
    entity_type: "document",
    entity_id: documentId,
    metadata: {
      bucket,
      storagePath,
      fileName: input.file.name,
      targetEntityType: entityType,
      targetEntityId: entityId,
      source: "public",
      label: input.label ?? null,
    },
  });

  return { ok: true, persisted: true, id: documentId, bucket, storagePath, fileName };
}

export async function listDashboardDocumentsForEntity(input: {
  scope: DashboardDocumentScope;
  entityId?: string;
  entityRef?: string;
  entityTypes: string[];
  actor?: DashboardActorContext | null;
}): Promise<{ data: DashboardDocumentRow[]; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { data: [], source: "static", error: "supabase_not_configured" };

  const entityTypes = input.entityTypes.map((value) => value.trim()).filter(Boolean);
  if (entityTypes.length === 0 || (!input.entityId && !input.entityRef)) {
    return { data: [], source: "supabase" };
  }

  const owner = dashboardDocumentOwner(input.scope, input.actor);
  let query = supabase
    .from("documents")
    .select("id, entity_type, entity_id, entity_ref, file_name, mime_type, size_bytes, created_at")
    .in("entity_type", entityTypes)
    .order("created_at", { ascending: false })
    .limit(30);

  if (input.entityId && isUuid(input.entityId)) query = query.eq("entity_id", input.entityId);
  else if (input.entityRef) query = query.eq("entity_ref", input.entityRef);

  if (input.scope === "business") {
    query = query.eq("organization_id", owner.organizationId);
  } else if (input.scope === "individual") {
    query = query.eq("owner_user_id", owner.ownerUserId);
  }

  const { data, error } = await query;
  if (error || !data) return { data: [], source: "supabase", error: error?.message };

  return {
    source: "supabase",
    data: data.map((row) => ({
      id: row.id as string,
      entityType: row.entity_type as string,
      entityId: row.entity_id as string | null,
      entityRef: row.entity_ref as string | null,
      fileName: row.file_name as string,
      mimeType: row.mime_type as string | null,
      sizeBytes: typeof row.size_bytes === "number" ? row.size_bytes : row.size_bytes ? Number(row.size_bytes) : null,
      createdAt: row.created_at as string,
    })),
  };
}

async function attachDashboardPreSubmissionDocuments(
  supabase: SupabaseClient,
  input: {
    scope: DashboardEntityRequestScope;
    kind: DashboardEntityRequestKind;
    entityId?: string;
    formReference?: string;
    ownerUserId: string | null;
    organizationId: string | null;
  },
) {
  const formReference = input.formReference?.trim();
  if (!formReference || !input.entityId) return;

  let query = supabase
    .from("documents")
    .update({
      entity_id: input.entityId,
      entity_type: `${input.scope}_${input.kind}_request`,
    })
    .eq("entity_ref", formReference);

  query = input.organizationId
    ? query.eq("organization_id", input.organizationId)
    : query.eq("owner_user_id", input.ownerUserId);

  const { error } = await query;
  if (error) throw new Error(error.message);
}

function normalizeDashboardPaymentMethod(value: string) {
  const normalized = value.trim().toLowerCase().replaceAll(" ", "_").replaceAll("-", "_");
  if (["مدى", "mada"].includes(normalized)) return "mada";
  if (["visa", "فيزا", "mastercard", "master_card"].includes(normalized)) return "visa";
  if (["apple_pay", "applepay", "ابل_باي", "آبل_باي"].includes(normalized)) return "apple_pay";
  if (["bank_transfer", "transfer", "تحويل_بنكي"].includes(normalized)) return "bank_transfer";
  return "mada";
}

async function createDashboardRequestFinancialRecords(
  supabase: SupabaseClient,
  input: {
    scope: DashboardEntityRequestScope;
    kind: DashboardEntityRequestKind;
    entityId?: string;
    reference: string;
    title: string;
    label: string;
    amount: number;
    paymentMethod: string;
    owner: ReturnType<typeof dashboardScopedOwner>;
  },
) {
  if (!input.entityId || input.amount <= 0) return;

  const paidAt = new Date().toISOString();
  const requestPaymentRef = `${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const invoiceNumber = `INV-REQ-${requestPaymentRef}`;
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      invoice_number: invoiceNumber,
      user_id: input.owner.requesterUserId,
      organization_id: input.owner.organizationId,
      title_ar: `رسوم ${input.label}: ${input.title}`,
      amount_sar: input.amount,
      status: "paid",
      due_date: paidAt.slice(0, 10),
      paid_at: paidAt,
      metadata: {
        source: "dashboard_request_submission",
        scope: input.scope,
        kind: input.kind,
        entityId: input.entityId,
        reference: input.reference,
      },
    })
    .select("id, invoice_number")
    .single();
  if (invoiceError) throw new Error(invoiceError.message);
  const invoiceId = invoice?.id as string | undefined;
  if (!invoiceId) throw new Error("invoice_not_created");

  const paymentReference = `PAY-REQ-${requestPaymentRef}`;
  const method = normalizeDashboardPaymentMethod(input.paymentMethod);
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      invoice_id: invoiceId,
      user_id: input.owner.requesterUserId,
      organization_id: input.owner.organizationId,
      amount_sar: input.amount,
      method,
      status: "succeeded",
      provider_reference: paymentReference,
      paid_at: paidAt,
      metadata: {
        source: "dashboard_request_submission",
        scope: input.scope,
        kind: input.kind,
        entityId: input.entityId,
        reference: input.reference,
      },
    })
    .select("id")
    .single();
  if (paymentError) throw new Error(paymentError.message);
  const paymentId = payment?.id as string | undefined;
  if (!paymentId) throw new Error("payment_not_created");

  await insertRequiredAuditLog(supabase, {
    actor_user_id: input.owner.actorUserId,
    organization_id: input.owner.organizationId,
    action: "dashboard_request_payment_succeeded",
    entity_type: "payment",
    entity_id: paymentId,
    metadata: {
      invoiceId,
      invoiceNumber: invoice?.invoice_number,
      paymentReference,
      amount: input.amount,
      method,
      requestEntityId: input.entityId,
      requestKind: input.kind,
      reference: input.reference,
    },
  });

  await insertRequiredNotification(supabase, {
    user_id: input.owner.requesterUserId,
    organization_id: input.owner.organizationId,
    title_ar: "تم تسجيل السداد",
    body_ar: `تم سداد رسوم ${input.label} وربطها بالطلب ${input.title}.`,
    category: "financial",
    action_url: input.scope === "business" ? "/dashboard/business/invoices" : "/dashboard/individual/invoices",
    metadata: {
      invoiceId,
      paymentId,
      paymentReference,
      requestEntityId: input.entityId,
      requestKind: input.kind,
      reference: input.reference,
    },
  });
}

async function createDashboardVerificationFinancialRecords(
  supabase: SupabaseClient,
  input: {
    scope: DashboardVerificationRequestScope;
    requestId?: string;
    reference: string;
    displayName: string;
    amount: number;
    paymentMethod?: string;
    owner: ReturnType<typeof dashboardScopedOwner>;
  },
) {
  if (!input.requestId || input.amount <= 0) return;

  const now = new Date();
  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + 7);
  const ref = `${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const paid = Boolean(input.paymentMethod);
  const invoiceNumber = `INV-VRF-${ref}`;
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      invoice_number: invoiceNumber,
      user_id: input.owner.requesterUserId,
      organization_id: input.owner.organizationId,
      title_ar: `رسوم شارة التوثيق: ${input.displayName}`,
      amount_sar: input.amount,
      status: paid ? "paid" : "due",
      due_date: dueDate.toISOString().slice(0, 10),
      paid_at: paid ? now.toISOString() : null,
      metadata: {
        source: "verification_request_submission",
        scope: input.scope,
        requestId: input.requestId,
        reference: input.reference,
      },
    })
    .select("id, invoice_number")
    .single();
  if (invoiceError) throw new Error(invoiceError.message);
  const invoiceId = invoice?.id as string | undefined;
  if (!invoiceId) throw new Error("invoice_not_created");

  let paymentId: string | null = null;
  let paymentReference: string | null = null;
  const method = input.paymentMethod ? normalizeDashboardPaymentMethod(input.paymentMethod) : null;

  if (paid && method) {
    paymentReference = `PAY-VRF-${ref}`;
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        invoice_id: invoiceId,
        user_id: input.owner.requesterUserId,
        organization_id: input.owner.organizationId,
        amount_sar: input.amount,
        method,
        status: "succeeded",
        provider_reference: paymentReference,
        paid_at: now.toISOString(),
        metadata: {
          source: "verification_request_submission",
          scope: input.scope,
          requestId: input.requestId,
          reference: input.reference,
        },
      })
      .select("id")
      .single();
    if (paymentError) throw new Error(paymentError.message);
    paymentId = (payment?.id as string | undefined) ?? null;
    if (!paymentId) throw new Error("payment_not_created");
  }

  await insertRequiredAuditLog(supabase, {
    actor_user_id: input.owner.actorUserId,
    organization_id: input.owner.organizationId,
    action: paid ? "verification_fee_payment_succeeded" : "verification_fee_invoice_created",
    entity_type: paid ? "payment" : "invoice",
    entity_id: paid ? paymentId : invoiceId,
    metadata: {
      invoiceId,
      invoiceNumber: invoice?.invoice_number,
      paymentId,
      paymentReference,
      amount: input.amount,
      method,
      scope: input.scope,
      requestId: input.requestId,
      reference: input.reference,
    },
  });

  await insertRequiredNotification(supabase, {
    user_id: input.owner.requesterUserId,
    organization_id: input.owner.organizationId,
    title_ar: paid ? "تم سداد رسوم شارة التوثيق" : "تم إصدار فاتورة شارة التوثيق",
    body_ar: paid
      ? `تم سداد رسوم شارة التوثيق لطلب ${input.displayName}.`
      : `تم إصدار فاتورة رسوم شارة التوثيق لطلب ${input.displayName}.`,
    category: "financial",
    action_url: input.scope === "business" ? "/dashboard/business/invoices" : "/dashboard/individual/invoices",
    metadata: {
      invoiceId,
      paymentId,
      paymentReference,
      requestId: input.requestId,
      reference: input.reference,
    },
  });
}

async function attachDashboardVerificationDocuments(
  supabase: SupabaseClient,
  input: {
    scope: DashboardVerificationRequestScope;
    requestId?: string;
    formReference?: string;
    ownerUserId: string | null;
    organizationId: string | null;
  },
) {
  const formReference = input.formReference?.trim();
  if (!formReference || !input.requestId) return;

  let query = supabase
    .from("documents")
    .update({
      entity_id: input.requestId,
      entity_type: `${input.scope}_verification_request`,
    })
    .eq("entity_ref", formReference);

  query = input.organizationId
    ? query.eq("organization_id", input.organizationId)
    : query.eq("owner_user_id", input.ownerUserId);

  const { error } = await query;
  if (error) throw new Error(error.message);
}

async function attachDashboardAdminReferenceDocuments(
  supabase: SupabaseClient,
  input: {
    formReference?: string;
    entityId?: string;
    entityType: string;
    ownerUserId: string | null;
  },
) {
  const formReference = input.formReference?.trim();
  if (!formReference || !input.entityId) return;

  const { error } = await supabase
    .from("documents")
    .update({
      entity_id: input.entityId,
      entity_type: input.entityType,
    })
    .eq("entity_ref", formReference)
    .eq("owner_user_id", input.ownerUserId);
  if (error) throw new Error(error.message);
}

export async function createDashboardEntityRequest(input: {
  kind: DashboardEntityRequestKind;
  scope: DashboardEntityRequestScope;
  mode?: DashboardEntityRequestMode;
  title?: string;
  description?: string;
  city?: string;
  amount?: number;
  areaSqm?: number;
  assetType?: string;
  payload?: Record<string, EntityRequestPayloadValue>;
  actor?: DashboardActorContext | null;
}): Promise<PersistResult & { kind: DashboardEntityRequestKind; status: DashboardEntityRequestMode; message?: string }> {
  const mode = input.mode ?? "submitted";
  const reference = dashboardRequestReference(input.kind);
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: true, persisted: false, reference, kind: input.kind, status: mode, message: "supabase_not_configured" };

  const payload = cleanEntityPayload(input.payload);
  const isBusiness = input.scope === "business";
  const owner = dashboardScopedOwner(input.scope, input.actor);
  const requesterUserId = owner.requesterUserId;
  const organizationId = owner.organizationId;
  const reviewStatus = mode === "draft" ? "draft" : "submitted";
  const serviceStatus = mode === "draft" ? "draft" : "submitted";
  const label = dashboardRequestLabel(input.kind);
  const title = compactText(input.title, isBusiness ? `${label} من المنشأة` : `${label} فردي`);
  const description = compactText(input.description, `طلب ${label} تم إنشاؤه من لوحة التحكم.`);
  const city = compactText(input.city, payloadText(payload, "city", "الرياض"));
  const assetType = compactText(input.assetType, payloadText(payload, "assetType", "أصل عقاري"));
  const formReference = payloadText(payload, "formReference", "");
  let entityId: string | undefined;

  if (input.kind === "contribution" && !organizationId) {
    return { ok: true, persisted: false, reference, kind: input.kind, status: mode, message: "business_account_required" };
  }

  if (input.kind === "asset") {
    const { data, error } = await supabase
      .from("real_estate_assets")
      .insert({
        owner_user_id: requesterUserId,
        organization_id: organizationId,
        title_ar: title,
        slug: dashboardRequestSlug(input.scope, input.kind),
        city_ar: city,
        district_ar: payloadText(payload, "district", "غير محدد"),
        asset_type_ar: assetType,
        usage_type_ar: payloadText(payload, "usageType", "استثماري"),
        area_sqm: positiveNumber(input.areaSqm, payloadNumber(payload, "areaSqm", 500)),
        estimated_value_sar: positiveNumber(input.amount, payloadNumber(payload, "estimatedValue", 2500000)),
        status: reviewStatus,
        image_url: "/images/asset-commercial-complex.png",
        excerpt_ar: description,
        metadata: {
          reference,
          source: "dashboard",
          scope: input.scope,
          mode,
          ...payload,
        },
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    entityId = data?.id as string | undefined;
  }

  if (input.kind === "contribution") {
    const { data, error } = await supabase
      .from("real_estate_contributions")
      .insert({
        organization_id: organizationId,
        title_ar: title,
        slug: dashboardRequestSlug(input.scope, input.kind),
        city_ar: city,
        stage_ar: payloadText(payload, "stage", "تحت الدراسة"),
        capital_sar: positiveNumber(input.amount, payloadNumber(payload, "capitalSar", 25000000)),
        duration_months: Math.round(payloadNumber(payload, "durationMonths", 24)),
        funded_percent: 0,
        expected_return_percent: payloadNumber(payload, "expectedReturnPercent", 11),
        remaining_days: Math.round(payloadNumber(payload, "remainingDays", 45)),
        license_number: payloadText(payload, "licenseNumber", ""),
        offering_url: payloadText(payload, "offeringUrl", ""),
        status: reviewStatus,
        image_url: "/images/contribution-request-hero-sketch.png",
        excerpt_ar: description,
        metadata: {
          reference,
          source: "dashboard",
          scope: input.scope,
          mode,
          ...payload,
        },
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    entityId = data?.id as string | undefined;
  }

  if (input.kind === "service_request") {
    const { data, error } = await supabase
      .from("service_requests")
      .insert({
        requester_user_id: requesterUserId,
        organization_id: organizationId,
        service_type_ar: payloadText(payload, "serviceType", title),
        title_ar: title,
        description_ar: description,
        city_ar: city,
        asset_type_ar: assetType,
        area_sqm: positiveNumber(input.areaSqm, payloadNumber(payload, "areaSqm", 250)),
        status: serviceStatus,
        priority: payloadText(payload, "priority", "normal"),
        amount_sar: positiveNumber(input.amount, payloadNumber(payload, "amountSar", 0)),
        metadata: {
          reference,
          source: "dashboard",
          scope: input.scope,
          mode,
          ...payload,
        },
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    entityId = data?.id as string | undefined;
  }

  if (!entityId) {
    return {
      ok: true,
      persisted: false,
      reference,
      kind: input.kind,
      status: mode,
      message: `${input.kind}_not_created`,
    };
  }

  await attachDashboardPreSubmissionDocuments(supabase, {
    scope: input.scope,
    kind: input.kind,
    entityId,
    formReference,
    ownerUserId: owner.ownerUserId,
    organizationId,
  });

  if (mode === "submitted" && (input.kind === "service_request" || input.kind === "contribution")) {
    const payableAmount = input.kind === "service_request"
      ? positiveNumber(input.amount, payloadNumeric(payload, "amountSar", 0))
      : payloadNumeric(payload, "feeAmount", 0);
    if (payableAmount > 0) {
      await createDashboardRequestFinancialRecords(supabase, {
        scope: input.scope,
        kind: input.kind,
        entityId,
        reference,
        title,
        label,
        amount: payableAmount,
        paymentMethod: payloadText(payload, "paymentMethod", "mada"),
        owner,
      });
    }
  }

  await insertRequiredAuditLog(supabase, {
    actor_user_id: owner.actorUserId,
    organization_id: organizationId,
    action: mode === "draft" ? "dashboard_request_drafted" : "dashboard_request_submitted",
    entity_type: input.kind,
    entity_id: entityId ?? null,
    metadata: {
      reference,
      title,
      scope: input.scope,
      mode,
    },
  });

  await insertRequiredNotification(supabase, {
    user_id: requesterUserId,
    organization_id: organizationId,
    title_ar: mode === "draft" ? `تم حفظ مسودة ${label}` : `تم إرسال طلب ${label}`,
    body_ar: mode === "draft" ? `${title} محفوظ كمسودة ويمكنك استكماله لاحقاً.` : `${title} تم إرساله وسيظهر في مركز المراجعة والمتابعة.`,
    category: input.kind,
    action_url: dashboardRequestOwnerUrl(input.scope, input.kind, entityId),
    metadata: {
      entityId,
      reference,
      scope: input.scope,
      kind: input.kind,
      mode,
    },
  });

  if (mode === "submitted") {
    await insertDashboardAdminNotifications(supabase, {
      title: `طلب ${label} جديد`,
      body: `${title} جاهز للمراجعة من ${isBusiness ? "حساب الأعمال" : "حساب الأفراد"}.`,
      category: input.kind,
      actionUrl: dashboardRequestAdminUrl(input.kind),
      metadata: {
        entityId: entityId ?? null,
        reference,
        scope: input.scope,
        kind: input.kind,
      },
    });
  }

  return { ok: true, persisted: true, id: entityId, reference, kind: input.kind, status: mode };
}

export async function createDashboardVerificationRequest(input: {
  scope: DashboardVerificationRequestScope;
  mode?: DashboardVerificationRequestMode;
  displayName?: string;
  note?: string;
  payload?: Record<string, VerificationPayloadValue>;
  actor?: DashboardActorContext | null;
}): Promise<PersistResult & { reference: string; message?: string; status?: DashboardVerificationRequestMode }> {
  const reference = `VRF-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`;
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: true, persisted: false, reference, message: "supabase_not_configured" };

  const isBusiness = input.scope === "business";
  const owner = dashboardScopedOwner(input.scope, input.actor);
  const requesterUserId = owner.requesterUserId;
  const organizationId = owner.organizationId;
  const displayName = input.displayName?.trim() || (isBusiness ? "شركة الازدهار العقارية" : "أحمد عبدالله");
  const note = input.note?.trim() || (isBusiness ? "طلب شارة توثيق منشأة" : "طلب شارة توثيق حساب فردي");
  const mode = input.mode ?? "submitted";
  const reviewStatus = mode === "draft" ? "draft" : "submitted";
  const payload = cleanVerificationPayload(input.payload);
  const formReference = payloadText(payload, "formReference", "");

  const { data, error } = await supabase
    .from("verification_requests")
    .insert({
      requester_user_id: requesterUserId,
      organization_id: organizationId,
      request_type: input.scope,
      status: reviewStatus,
      completion_percent: isBusiness ? 96 : 85,
      notes: note,
      payload: {
        reference,
        displayName,
        mode,
        source: "dashboard",
        ...payload,
      },
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  const requestId = data?.id as string | undefined;
  if (!requestId) {
    return { ok: true, persisted: false, reference, status: reviewStatus, message: "verification_request_not_created" };
  }

  await attachDashboardVerificationDocuments(supabase, {
    scope: input.scope,
    requestId,
    formReference,
    ownerUserId: requesterUserId,
    organizationId,
  });

  const verificationFee = payloadNumeric(payload, "feeAmount", isBusiness ? 500 : 0);
  if (mode === "submitted" && verificationFee > 0) {
    await createDashboardVerificationFinancialRecords(supabase, {
      scope: input.scope,
      requestId,
      reference,
      displayName,
      amount: verificationFee,
      paymentMethod: payloadText(payload, "paymentMethod", ""),
      owner,
    });
  }

  if (mode === "submitted" && isBusiness) {
    const { error: organizationError } = await supabase
      .from("organizations")
      .update({ verification_status: "submitted" })
      .eq("id", organizationId)
      .neq("verification_status", "approved");
    if (organizationError) throw new Error(organizationError.message);
  } else if (mode === "submitted") {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ verification_status: "submitted" })
      .eq("id", owner.actorUserId)
      .neq("verification_status", "approved");
    if (profileError) throw new Error(profileError.message);
  }

  await insertRequiredAuditLog(supabase, {
    actor_user_id: owner.actorUserId,
    organization_id: organizationId,
    action: mode === "draft" ? "verification_request_drafted" : "verification_request_submitted",
    entity_type: "verification_request",
    entity_id: requestId ?? null,
    metadata: {
      reference,
      scope: input.scope,
      displayName,
      mode,
    },
  });

  if (mode === "submitted") {
    await insertDashboardAdminNotifications(supabase, {
      title: "طلب شارة توثيق جديد",
      body: `${displayName}: ${note}`,
      category: "verification",
      actionUrl: "/dashboard/admin/review-center/verification",
      metadata: {
        requestId: requestId ?? null,
        reference,
        scope: input.scope,
      },
    });
  }

  return { ok: true, persisted: true, id: requestId, reference, status: reviewStatus };
}

function accountSettingsMessage(kind: DashboardAccountSettingsKind) {
  if (kind === "security") return "تم حفظ إعدادات الأمان";
  if (kind === "preferences") return "تم حفظ التفضيلات";
  return "تم حفظ بيانات الحساب";
}

export async function saveDashboardAccountSettings(input: {
  scope: DashboardAccountSettingsScope;
  kind: DashboardAccountSettingsKind;
  payload?: Record<string, DashboardAccountSettingsPayloadValue>;
  actor?: DashboardActorContext | null;
}): Promise<PersistResult & { kind: DashboardAccountSettingsKind; message?: string }> {
  const supabase = getSupabaseAdmin();
  const message = accountSettingsMessage(input.kind);
  if (!supabase) return { ok: true, persisted: false, kind: input.kind, message: "supabase_not_configured" };

  const rawPayload = cleanAccountSettingsPayload(input.payload);
  const passwordChange = input.kind === "security" ? accountPasswordChange(rawPayload) : { requested: false, complete: false, currentPassword: "", newPassword: "", confirmPassword: "" };
  if (passwordChange.requested) {
    if (!passwordChange.complete) return { ok: true, persisted: false, kind: input.kind, message: "password_fields_incomplete" };
    if (passwordChange.newPassword !== passwordChange.confirmPassword) return { ok: true, persisted: false, kind: input.kind, message: "password_mismatch" };
    if (passwordChange.newPassword.length < 8) return { ok: true, persisted: false, kind: input.kind, message: "password_too_short" };
    if (passwordChange.currentPassword === passwordChange.newPassword) return { ok: true, persisted: false, kind: input.kind, message: "password_unchanged" };
  }
  const payload = allowedAccountSettingsPayload(input.kind, redactAccountSettingsPayload(rawPayload));
  if (accountSettingsEmailInvalid(input.kind, payload)) {
    return { ok: true, persisted: false, kind: input.kind, message: "profile_email_invalid" };
  }
  const savedAt = new Date().toISOString();
  const isBusiness = input.scope === "business";
  const owner = dashboardScopedOwner(input.scope, input.actor);
  const metadataKey = input.kind;
  let accountName = isBusiness ? "شركة الازدهار العقارية" : "أحمد عبدالله";
  let userId: string | null = isBusiness ? null : owner.actorUserId;
  let organizationId: string | null = isBusiness ? owner.organizationId : null;
  let passwordUpdated = false;
  let authProfileSynced = false;

  if (passwordChange.requested) {
    const email = await dashboardActorEmail(supabase, input.actor, owner.actorUserId);
    if (!email) return { ok: true, persisted: false, kind: input.kind, message: "password_email_missing" };
    const verification = await verifyDashboardCurrentPassword(email, passwordChange.currentPassword);
    if (verification !== "verified") return { ok: true, persisted: false, kind: input.kind, message: verification };
    const { error: passwordError } = await supabase.auth.admin.updateUserById(owner.actorUserId, {
      password: passwordChange.newPassword,
    });
    if (passwordError) throw new Error(passwordError.message);
    passwordUpdated = true;
    payload.passwordRotationRequested = true;
    payload.passwordUpdatedAt = savedAt;
  }

  if (isBusiness) {
    const { data: organization, error: fetchError } = await supabase
      .from("organizations")
      .select("id, owner_user_id, name_ar, commercial_registration, activity_type_ar, email, phone, city_ar, website, profile_completion, metadata")
      .eq("id", owner.organizationId)
      .maybeSingle();
    if (fetchError) throw new Error(fetchError.message);
    if (!organization) return { ok: true, persisted: false, kind: input.kind, message: "account_not_found" };

    const organizationRow = organization as {
      id: string;
      owner_user_id: string | null;
      name_ar: string;
      commercial_registration: string | null;
      activity_type_ar: string | null;
      email: string | null;
      phone: string | null;
      city_ar: string | null;
      website: string | null;
      profile_completion: number | null;
      metadata: unknown;
    };
    const metadata = jsonRecord(organizationRow.metadata);
    const accountSettings = jsonRecord(metadata.accountSettings);
    accountName = organizationRow.name_ar;
    userId = organizationRow.owner_user_id;
    organizationId = organizationRow.id;

    const record = {
      name_ar: input.kind === "profile" ? payloadText(payload, "name", organizationRow.name_ar) : organizationRow.name_ar,
      commercial_registration: input.kind === "profile" ? payloadText(payload, "commercialRegistration", payloadText(payload, "identityNumber", organizationRow.commercial_registration ?? "1010123456")) : organizationRow.commercial_registration,
      activity_type_ar: input.kind === "profile" ? payloadText(payload, "activityType", organizationRow.activity_type_ar ?? "إدارة المساهمات العقارية") : organizationRow.activity_type_ar,
      email: input.kind === "profile" ? payloadText(payload, "email", organizationRow.email ?? "info@alazdehar.sa") : organizationRow.email,
      phone: input.kind === "profile" ? payloadText(payload, "phone", organizationRow.phone ?? "+966 50 123 4567") : organizationRow.phone,
      city_ar: input.kind === "profile" ? payloadText(payload, "city", organizationRow.city_ar ?? "الرياض") : organizationRow.city_ar,
      website: input.kind === "profile" ? payloadText(payload, "website", organizationRow.website ?? "www.alazdehar.sa") : organizationRow.website,
      profile_completion: Math.min(100, Math.max(organizationRow.profile_completion ?? 0, Math.round(payloadNumber(payload, "profileCompletion", input.kind === "profile" ? 96 : organizationRow.profile_completion ?? 96)))),
      metadata: {
        ...metadata,
        accountSettings: {
          ...accountSettings,
          [metadataKey]: {
            ...payload,
            savedAt,
            source: "dashboard_account_settings",
          },
        },
      },
    };

    const { error } = await supabase
      .from("organizations")
      .update(record)
      .eq("id", organizationRow.id);
    if (error) throw new Error(error.message);
  } else {
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone, city_ar, profile_completion, metadata")
      .eq("id", owner.actorUserId)
      .maybeSingle();
    if (fetchError) throw new Error(fetchError.message);
    if (!profile) return { ok: true, persisted: false, kind: input.kind, message: "account_not_found" };

    const profileRow = profile as {
      id: string;
      full_name: string;
      email: string | null;
      phone: string | null;
      city_ar: string | null;
      profile_completion: number | null;
      metadata: unknown;
    };
    const metadata = jsonRecord(profileRow.metadata);
    const accountSettings = jsonRecord(metadata.accountSettings);
    accountName = profileRow.full_name;
    userId = profileRow.id;
    organizationId = null;

    const record = {
      full_name: input.kind === "profile" ? payloadText(payload, "fullName", profileRow.full_name) : profileRow.full_name,
      email: input.kind === "profile" ? payloadText(payload, "email", profileRow.email ?? "ahmed.abdullah@example.com") : profileRow.email,
      phone: input.kind === "profile" ? payloadText(payload, "phone", profileRow.phone ?? "+966 50 123 4567") : profileRow.phone,
      city_ar: input.kind === "profile" ? payloadText(payload, "city", profileRow.city_ar ?? "الرياض") : profileRow.city_ar,
      profile_completion: Math.min(100, Math.max(profileRow.profile_completion ?? 0, Math.round(payloadNumber(payload, "profileCompletion", input.kind === "profile" ? 85 : profileRow.profile_completion ?? 85)))),
      metadata: {
        ...metadata,
        accountSettings: {
          ...accountSettings,
          [metadataKey]: {
            ...payload,
            savedAt,
            source: "dashboard_account_settings",
          },
        },
      },
    };

    const { error } = await supabase
      .from("profiles")
      .update(record)
      .eq("id", profileRow.id);
    if (error) throw new Error(error.message);

    if (input.kind === "profile") {
      const { error: authProfileError } = await supabase.auth.admin.updateUserById(profileRow.id, {
        email: record.email ?? undefined,
        user_metadata: {
          display_name: record.full_name,
        },
      });
      if (authProfileError) throw new Error(authProfileError.message);
      authProfileSynced = true;
    }
  }

  await insertRequiredAuditLog(supabase, {
    actor_user_id: userId,
    organization_id: organizationId,
    action: "account_settings_saved",
    entity_type: isBusiness ? "organization" : "profile",
    entity_id: isBusiness ? organizationId : userId,
    metadata: {
      scope: input.scope,
      kind: input.kind,
      accountName,
      payload,
      passwordUpdated,
      authProfileSynced,
    },
  });

  await insertRequiredNotification(supabase, {
    user_id: userId,
    organization_id: organizationId,
    title_ar: message,
    body_ar: `${accountName}: ${message} من لوحة التحكم.`,
    category: "account",
    action_url: isBusiness ? "/dashboard/business/company-profile" : "/dashboard/individual/profile",
    metadata: {
      scope: input.scope,
      kind: input.kind,
      passwordUpdated,
      authProfileSynced,
    },
  });

  return { ok: true, persisted: true, kind: input.kind, message: passwordUpdated ? "تم تحديث كلمة المرور وحفظ إعدادات الأمان" : message };
}

export async function reviewDashboardEntity(input: {
  entityType: ReviewEntityType;
  entityId?: string;
  slug?: string;
  title?: string;
  decision: ReviewDecision;
  note?: string;
  actor?: DashboardActorContext | null;
}): Promise<PersistResult & { status: ReviewDecision; entityId?: string; message?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: true, persisted: false, status: input.decision, message: "supabase_not_configured" };
  if (!input.entityId && !input.slug && !input.title) {
    return { ok: true, persisted: false, status: input.decision, message: "entity_identifier_missing" };
  }

  const entity = await resolveReviewEntity(input.entityType, input);
  if (!entity) return { ok: true, persisted: false, status: input.decision, message: "entity_not_found" };
  const adminUserId = input.actor?.userId ?? DEMO_ADMIN_USER_ID;
  const reviewedAt = new Date().toISOString();
  const reviewEntry = {
    decision: input.decision,
    note: input.note || null,
    reviewedBy: adminUserId,
    reviewedAt,
  };
  const reviewMetadata = {
    ...jsonRecord(entity.metadata),
    latestReview: reviewEntry,
    reviewHistory: [...reviewHistoryFromMetadata(entity.metadata ?? {}), reviewEntry].slice(-20),
  };

  if (input.entityType === "asset") {
    const { error } = await supabase
      .from("real_estate_assets")
      .update({ status: input.decision, metadata: reviewMetadata })
      .eq("id", entity.id);
    if (error) throw new Error(error.message);
  } else if (input.entityType === "contribution") {
    const { error } = await supabase
      .from("real_estate_contributions")
      .update({ status: input.decision, metadata: reviewMetadata })
      .eq("id", entity.id);
    if (error) throw new Error(error.message);
  } else if (input.entityType === "verification_request") {
    const { error } = await supabase
      .from("verification_requests")
      .update({
        status: input.decision,
        reviewed_by: adminUserId,
        reviewed_at: reviewedAt,
        notes: input.note || null,
        payload: reviewMetadata,
      })
      .eq("id", entity.id);
    if (error) throw new Error(error.message);

    if (entity.organizationId) {
      const organizationUpdate = input.decision === "approved"
        ? { status: "approved", verification_status: input.decision }
        : { verification_status: input.decision };
      const { error: organizationError } = await supabase
        .from("organizations")
        .update(organizationUpdate)
        .eq("id", entity.organizationId);
      if (organizationError) throw new Error(organizationError.message);
    } else if (entity.ownerUserId) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ verification_status: input.decision })
        .eq("id", entity.ownerUserId);
      if (profileError) throw new Error(profileError.message);
    }
  } else {
    const requestStatus = input.decision === "approved" ? "in_progress" : input.decision === "rejected" ? "cancelled" : "needs_changes";
    const { error } = await supabase
      .from("service_requests")
      .update({ status: requestStatus, metadata: reviewMetadata })
      .eq("id", entity.id);
    if (error) throw new Error(error.message);
  }

  await insertRequiredAuditLog(supabase, {
    actor_user_id: adminUserId,
    organization_id: entity.organizationId ?? null,
    action: `review_${input.decision}`,
    entity_type: input.entityType,
    entity_id: entity.id,
    metadata: {
      titleAr: entity.titleAr,
      note: input.note || null,
    },
  });

  await insertRequiredNotification(supabase, {
    user_id: entity.ownerUserId ?? null,
    organization_id: entity.organizationId ?? null,
    title_ar: input.decision === "approved" ? "تم اعتماد الطلب" : input.decision === "rejected" ? "تم رفض الطلب" : "مطلوب تعديل البيانات",
    body_ar: `${entity.titleAr}: ${input.decision === "approved" ? "تم الاعتماد من لوحة الإدارة." : input.decision === "rejected" ? "تم الرفض من لوحة الإدارة." : "يرجى مراجعة الملاحظات وتحديث البيانات."}`,
    category: reviewEntityCategory(input.entityType),
    action_url: reviewEntityActionUrl(input.entityType, entity),
    metadata: {
      entityType: input.entityType,
      entityId: entity.id,
      decision: input.decision,
    },
  });

  return { ok: true, persisted: true, status: input.decision, entityId: entity.id };
}

export async function listDashboardAdminAccounts(): Promise<{ data: DashboardAdminAccount[]; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { data: staticAdminAccounts(), source: "static" };

  const [profilesResult, organizationsResult, assetsResult, contributionsResult, interestsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, role, full_name, email, phone, city_ar, verification_status, profile_completion, metadata, created_at, updated_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("organizations")
      .select("id, owner_user_id, name_ar, commercial_registration, city_ar, email, phone, status, verification_status, profile_completion, created_at, updated_at")
      .order("created_at", { ascending: false }),
    supabase.from("real_estate_assets").select("owner_user_id, organization_id"),
    supabase.from("real_estate_contributions").select("organization_id"),
    supabase.from("contribution_interests").select("user_id"),
  ]);

  if (profilesResult.error || organizationsResult.error || assetsResult.error || contributionsResult.error || interestsResult.error) {
    return {
      data: [],
      source: "supabase",
      error: profilesResult.error?.message || organizationsResult.error?.message || assetsResult.error?.message || contributionsResult.error?.message || interestsResult.error?.message,
    };
  }

  const assetCountByUser = new Map<string, number>();
  const assetCountByOrg = new Map<string, number>();
  for (const asset of (assetsResult.data ?? []) as Array<{ owner_user_id?: string | null; organization_id?: string | null }>) {
    incrementMap(assetCountByUser, asset.owner_user_id);
    incrementMap(assetCountByOrg, asset.organization_id);
  }

  const contributionCountByOrg = new Map<string, number>();
  for (const contribution of (contributionsResult.data ?? []) as Array<{ organization_id?: string | null }>) {
    incrementMap(contributionCountByOrg, contribution.organization_id);
  }

  const contributionInterestCountByUser = new Map<string, number>();
  for (const interest of (interestsResult.data ?? []) as Array<{ user_id?: string | null }>) {
    incrementMap(contributionInterestCountByUser, interest.user_id);
  }

  const profileRows = (profilesResult.data ?? []) as unknown as AdminProfileRow[];
  const organizationRows = (organizationsResult.data ?? []) as unknown as AdminOrganizationRow[];
  const accounts: DashboardAdminAccount[] = [
    ...organizationRows.map((organization) => ({
      id: organization.id,
      userId: organization.owner_user_id,
      organizationId: organization.id,
      commercialRegistration: organization.commercial_registration,
      name: organization.name_ar,
      kind: "business" as const,
      typeLabel: "منشأة",
      status: reviewStatusToAccountStatus(organization.verification_status === "approved" ? organization.status : organization.verification_status),
      city: organization.city_ar ?? "غير محدد",
      email: organization.email ?? "غير متوفر",
      phone: organization.phone ?? "غير متوفر",
      assets: assetCountByOrg.get(organization.id) ?? 0,
      contributions: contributionCountByOrg.get(organization.id) ?? 0,
      joinedAt: organization.created_at,
      lastLogin: organization.updated_at,
      profileCompletion: organization.profile_completion ?? 0,
    })),
    ...profileRows
      .filter((profile) => profile.role !== "business")
      .map((profile) => ({
        id: profile.id,
        userId: profile.id,
        organizationId: null,
        name: profile.full_name,
        kind: profile.role === "admin" ? "admin" as const : "individual" as const,
        typeLabel: profile.role === "admin" ? "مدير نظام" : "فرد",
        status: reviewStatusToAccountStatus(profile.verification_status),
        city: profile.city_ar ?? "غير محدد",
        email: profile.email ?? "غير متوفر",
        phone: profile.phone ?? "غير متوفر",
        assets: assetCountByUser.get(profile.id) ?? 0,
        contributions: contributionInterestCountByUser.get(profile.id) ?? 0,
        joinedAt: profile.created_at,
        lastLogin: profile.updated_at,
        profileCompletion: profile.profile_completion ?? 0,
      })),
  ];

  return { data: accounts, source: "supabase" };
}

export async function listDashboardAdminAssets(): Promise<{ data: DashboardAdminAssetRow[]; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { data: staticAdminAssetRows(), source: "static" };

  const { data, error } = await supabase
    .from("real_estate_assets")
    .select("id, slug, title_ar, city_ar, district_ar, asset_type_ar, usage_type_ar, area_sqm, estimated_value_sar, price_per_sqm, street_width_m, frontage_count, deed_number, listing_date, status, image_url, gallery, excerpt_ar, owner_user_id, organization_id, metadata, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error || !data) return { data: [], source: "supabase", error: error?.message };

  const rows = data as unknown as AdminAssetReviewRow[];
  const ownerLookup = await loadFinancialOwnerLookup(rows.map((row) => ({ user_id: row.owner_user_id, organization_id: row.organization_id })));
  return {
    source: "supabase",
    data: rows.map((row, index) => {
      const asset = mapAsset(row);
      const status = reviewStatusToAdminStatus(row.status);
      const estimatedValueSar = toNumber(row.estimated_value_sar, asset.areaSqm * (asset.pricePerSqm ?? 8500));
      return {
        ...asset,
        status,
        rawStatus: row.status,
        owner: row.organization_id ? ownerLookup.organizations.get(row.organization_id) ?? "منشأة عقارية" : row.owner_user_id ? ownerLookup.users.get(row.owner_user_id) ?? "مستخدم فردي" : publicSubmissionOwnerLabel(row.metadata),
        reviewer: status === "approved" ? "فريق اعتماد الأصول" : status === "rejected" ? "فريق الامتثال" : "مركز مراجعة الأصول",
        submittedAt: row.created_at ?? row.listing_date,
        estimatedValueSar,
        risk: adminReviewRisk(status, estimatedValueSar, index),
        ownerUserId: row.owner_user_id,
        organizationId: row.organization_id,
      };
    }),
  };
}

export async function listDashboardAdminContributions(): Promise<{ data: DashboardAdminContributionRow[]; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { data: staticAdminContributionRows(), source: "static" };

  const { data, error } = await supabase
    .from("real_estate_contributions")
    .select("id, slug, title_ar, city_ar, stage_ar, capital_sar, investors_count, duration_months, funded_percent, expected_return_percent, remaining_days, image_url, timeline, excerpt_ar, organization_id, metadata, status, license_number, offering_url, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error || !data) return { data: [], source: "supabase", error: error?.message };

  const rows = data as unknown as AdminContributionReviewRow[];
  const ownerLookup = await loadFinancialOwnerLookup(rows.map((row) => ({ organization_id: row.organization_id })));
  return {
    source: "supabase",
    data: rows.map((row, index) => {
      const contribution = mapContribution(row);
      const status = reviewStatusToAdminStatus(row.status);
      return {
        ...contribution,
        status,
        rawStatus: row.status,
        sponsor: row.organization_id ? ownerLookup.organizations.get(row.organization_id) ?? "منشأة عقارية" : publicSubmissionOwnerLabel(row.metadata),
        reviewer: status === "approved" ? "فريق اعتماد المساهمات" : status === "rejected" ? "فريق الامتثال" : "مركز مراجعة المساهمات",
        submittedAt: row.created_at,
        risk: adminReviewRisk(status, contribution.capitalSar, index),
        organizationId: row.organization_id,
        licenseNumber: row.license_number,
        offeringUrl: row.offering_url,
      };
    }),
  };
}

export async function listDashboardAdminServiceRequests(): Promise<{ data: DashboardAdminServiceRequest[]; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { data: staticAdminServiceRequests(), source: "static" };

  const { data, error } = await supabase
    .from("service_requests")
    .select("id, requester_user_id, organization_id, service_type_ar, title_ar, description_ar, city_ar, asset_type_ar, area_sqm, status, priority, amount_sar, due_date, metadata, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error || !data) return { data: [], source: "supabase", error: error?.message };

  const rows = data as unknown as AdminServiceRequestRow[];
  const ownerLookup = await loadFinancialOwnerLookup(rows.map((row) => ({ user_id: row.requester_user_id, organization_id: row.organization_id })));

  return {
    source: "supabase",
    data: rows.map((row) => {
      const latestReview = latestReviewFromMetadata(row.metadata);
      return {
        id: row.id,
        title: row.title_ar,
        serviceType: row.service_type_ar,
        description: row.description_ar,
        status: requestStatusToAdminStatus(row.status, row.priority),
        rawStatus: row.status,
        priority: row.priority,
        requester: row.organization_id
          ? ownerLookup.organizations.get(row.organization_id) ?? "منشأة عقارية"
          : row.requester_user_id
            ? ownerLookup.users.get(row.requester_user_id) ?? "مستخدم فردي"
            : publicSubmissionOwnerLabel(row.metadata),
        provider: row.status === "submitted" || row.status === "needs_changes" ? "بانتظار التعيين" : "فريق خدمات مهابة",
        city: row.city_ar ?? "غير محدد",
        assetType: row.asset_type_ar ?? "غير محدد",
        areaSqm: toNumber(row.area_sqm),
        submittedAt: row.created_at,
        dueAt: row.due_date ?? "",
        price: toNumber(row.amount_sar),
        latestReviewDecision: latestReview.decision,
        latestReviewNote: latestReview.note,
        latestReviewAt: latestReview.reviewedAt,
        requesterUserId: row.requester_user_id,
        organizationId: row.organization_id,
      };
    }),
  };
}

async function loadInterestedEntityIds(table: "asset_interests" | "contribution_interests", idColumn: "asset_id" | "contribution_id", userId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(table)
    .select(idColumn)
    .eq("user_id", userId);

  if (error || !data) return null;
  return new Set((data as unknown as Record<string, string>[]).map((row) => row[idColumn]).filter(Boolean));
}

export async function listDashboardAssetsForScope(scope: DashboardDataScope, variant: DashboardScopedListVariant = "all", actor?: DashboardActorContext | null): Promise<{ data: DashboardAdminAssetRow[]; source: "supabase" | "static"; error?: string }> {
  const result = await listDashboardAdminAssets();
  if (result.source === "static") return result;

  const owner = dashboardScopedOwner(scope, actor);
  let rows = result.data;
  if (variant === "owned") {
    rows = rows.filter((row) => scope === "business" ? row.organizationId === owner.organizationId : row.ownerUserId === owner.ownerUserId);
  }

  if (variant === "interested") {
    const interestedIds = await loadInterestedEntityIds("asset_interests", "asset_id", owner.actorUserId);
    rows = interestedIds ? rows.filter((row) => interestedIds.has(row.id)) : [];
  }

  return { ...result, data: rows };
}

export async function listDashboardContributionsForScope(scope: DashboardDataScope, variant: DashboardScopedListVariant = "all", actor?: DashboardActorContext | null): Promise<{ data: DashboardAdminContributionRow[]; source: "supabase" | "static"; error?: string }> {
  const result = await listDashboardAdminContributions();
  if (result.source === "static") return result;

  const owner = dashboardScopedOwner(scope, actor);
  let rows = result.data;
  if (variant === "owned") {
    rows = scope === "business" ? rows.filter((row) => row.organizationId === owner.organizationId) : [];
  }

  if (variant === "interested") {
    const interestedIds = await loadInterestedEntityIds("contribution_interests", "contribution_id", owner.actorUserId);
    rows = interestedIds ? rows.filter((row) => interestedIds.has(row.id)) : [];
  }

  return { ...result, data: rows };
}

export async function listDashboardServiceRequestsForScope(scope: DashboardDataScope, actor?: DashboardActorContext | null): Promise<{ data: DashboardAdminServiceRequest[]; source: "supabase" | "static"; error?: string }> {
  const result = await listDashboardAdminServiceRequests();
  if (result.source === "static") return result;
  const owner = dashboardScopedOwner(scope, actor);

  return {
    ...result,
    data: result.data.filter((row) => scope === "business" ? row.organizationId === owner.organizationId : row.requesterUserId === owner.requesterUserId),
  };
}

export async function listDashboardAdminVerificationRequests(): Promise<{ data: DashboardAdminVerificationRequest[]; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { data: staticAdminVerificationRequests(), source: "static" };

  const { data, error } = await supabase
    .from("verification_requests")
    .select("id, requester_user_id, organization_id, request_type, status, completion_percent, submitted_at, reviewed_by, reviewed_at, notes, created_at, updated_at")
    .order("submitted_at", { ascending: false });

  if (error || !data) return { data: [], source: "supabase", error: error?.message };

  const rows = data as unknown as AdminVerificationRequestRow[];
  const ownerLookup = await loadFinancialOwnerLookup(rows.map((row) => ({ user_id: row.requester_user_id, organization_id: row.organization_id })));
  const reviewerLookup = await loadFinancialOwnerLookup(rows.map((row) => ({ user_id: row.reviewed_by })));

  return {
    source: "supabase",
    data: rows.map((row) => {
      const business = row.request_type === "business";
      return {
        id: row.id,
        requester: row.organization_id
          ? ownerLookup.organizations.get(row.organization_id) ?? "منشأة عقارية"
          : row.requester_user_id
            ? ownerLookup.users.get(row.requester_user_id) ?? "مستخدم فردي"
            : "منصة مهابة",
        type: row.request_type,
        typeLabel: business ? "منشأة" : "حساب فردي",
        status: reviewStatusToAdminStatus(row.status),
        rawStatus: row.status,
        city: "غير محدد",
        completionPercent: toNumber(row.completion_percent),
        submittedAt: row.submitted_at ?? row.created_at,
        reviewedAt: row.reviewed_at,
        reviewer: row.reviewed_by ? reviewerLookup.users.get(row.reviewed_by) ?? "فريق توثيق مهابة" : "مركز توثيق الحسابات",
        notes: row.notes,
        requesterUserId: row.requester_user_id,
        organizationId: row.organization_id,
      };
    }),
  };
}

export async function listDashboardAdminProviders(): Promise<{ data: DashboardAdminProvider[]; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { data: staticAdminProviders(), source: "static" };

  const { data, error } = await supabase
    .from("service_providers")
    .select("id, slug, name_ar, category_ar, city_ar, contact, license_number, status, rating, requests_count, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error || !data) return { data: [], source: "supabase", error: error?.message };
  return { data: (data as unknown as AdminServiceProviderRow[]).map(mapAdminProvider), source: "supabase" };
}

export async function listDashboardAdminContentItems(): Promise<{ data: DashboardAdminContentItem[]; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { data: staticAdminContentItems(), source: "static" };

  const { data, error } = await supabase
    .from("content_items")
    .select("id, slug, title_ar, kind, status, category_ar, author_ar, view_count, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error || !data) return { data: [], source: "supabase", error: error?.message };
  return { data: (data as unknown as AdminContentItemRow[]).map(mapAdminContentItem), source: "supabase" };
}

export async function listDashboardAdminContentComments(status?: DashboardAdminContentCommentStatus): Promise<{ data: DashboardAdminContentComment[]; source: "supabase" | "static"; error?: string }> {
  const fallback = status ? staticAdminContentComments().filter((row) => row.status === status) : staticAdminContentComments();
  const supabase = getSupabaseAdmin();
  if (!supabase) return { data: fallback, source: "static" };

  let query = supabase
    .from("content_comments")
    .select("id, content_slug, content_type, author_name, body_ar, status, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(80);

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error || !data) return { data: [], source: "supabase", error: error?.message };
  return { data: (data as unknown as AdminContentCommentRow[]).map(mapAdminContentComment), source: "supabase" };
}

function filterAdminAuditLogs(rows: DashboardAdminAuditLog[], kind?: DashboardAdminAuditKind) {
  if (kind === "login") return rows.filter((row) => row.event.includes("دخول"));
  if (kind === "sensitive") return rows.filter((row) => row.status === "حساس" || row.status === "مراجعة" || row.status === "مرفوض");
  return rows;
}

export async function listDashboardAdminAuditLogs(kind?: DashboardAdminAuditKind): Promise<{ data: DashboardAdminAuditLog[]; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { data: filterAdminAuditLogs(staticAdminAuditLogs(), kind), source: "static" };

  const { data, error } = await supabase
    .from("audit_logs")
    .select("id, actor_user_id, organization_id, action, entity_type, entity_id, metadata, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data) return { data: [], source: "supabase", error: error?.message };

  const rows = data as unknown as AdminAuditLogRow[];
  const ownerLookup = await loadFinancialOwnerLookup(rows.map((row) => ({ user_id: row.actor_user_id, organization_id: row.organization_id })));
  const mappedRows = rows.map((row) => mapAdminAuditLog(row, ownerLookup));
  const filteredRows = filterAdminAuditLogs(mappedRows, kind);

  return { data: filteredRows, source: "supabase" };
}

export async function listDashboardAdminRoles(): Promise<{ data: DashboardAdminRole[]; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { data: staticAdminRoles(), source: "static" };

  const { data, error } = await supabase
    .from("admin_roles")
    .select("id, slug, name_ar, scope_ar, status, permissions_count, users_count, metadata, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error || !data) return { data: [], source: "supabase", error: error?.message };
  return { data: (data as unknown as AdminRoleRow[]).map(mapAdminRole), source: "supabase" };
}

export async function listDashboardSystemAdmins(): Promise<{ data: DashboardSystemAdmin[]; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { data: staticSystemAdmins(), source: "static" };

  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, full_name, email, phone, city_ar, verification_status, profile_completion, metadata, created_at, updated_at")
    .eq("role", "admin")
    .order("updated_at", { ascending: false });

  if (error || !data) return { data: [], source: "supabase", error: error?.message };
  const rows = (data as unknown as AdminProfileRow[]).map(mapSystemAdmin);
  return { data: rows, source: "supabase" };
}

async function resolveProviderForAdminAction(input: { entityId?: string; slug?: string; title?: string }) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  let query = supabase
    .from("service_providers")
    .select("id, slug, name_ar")
    .limit(1);

  if (isUuid(input.entityId)) query = query.eq("id", input.entityId);
  else if (input.slug) query = query.eq("slug", input.slug);
  else if (input.title) query = query.eq("name_ar", input.title);
  else return null;

  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;
  return data as { id: string; slug: string; name_ar: string };
}

async function resolveContentForAdminAction(input: { entityId?: string; slug?: string; title?: string }) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  let query = supabase
    .from("content_items")
    .select("id, slug, title_ar")
    .limit(1);

  if (isUuid(input.entityId)) query = query.eq("id", input.entityId);
  else if (input.slug) query = query.eq("slug", input.slug);
  else if (input.title) query = query.eq("title_ar", input.title);
  else return null;

  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;
  return data as { id: string; slug: string; title_ar: string };
}

async function resolveContentCommentForAdminAction(input: { entityId?: string; slug?: string }) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  let query = supabase
    .from("content_comments")
    .select("id, content_slug, content_type, author_name")
    .limit(1);

  if (isUuid(input.entityId)) query = query.eq("id", input.entityId);
  else if (input.slug) query = query.eq("content_slug", input.slug);
  else return null;

  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;
  return data as { id: string; content_slug: string; content_type: "news" | "article"; author_name: string };
}

function adminActionMessage(action: DashboardAdminManagementAction) {
  if (action === "invoice_status") return "تم تحديث حالة الفاتورة";
  if (action === "payment_status") return "تم تحديث حالة عملية الدفع";
  if (action === "subscription_status") return "تم تحديث حالة الاشتراك";
  if (action === "provider_status") return "تم تحديث حالة مزود الخدمة";
  if (action === "provider_save") return "تم حفظ مزود الخدمة";
  if (action === "content_status") return "تم تحديث حالة المحتوى";
  if (action === "content_save") return "تم حفظ المحتوى";
  if (action === "content_comment_status") return "تم تحديث حالة تعليق المحتوى";
  if (action === "admin_role_save") return "تم حفظ الدور الوظيفي";
  if (action === "admin_user_save") return "تم حفظ مدير النظام";
  if (action === "admin_security_action") return "تم تنفيذ إجراء أمان مدير النظام";
  if (action === "settings_save") return "تم حفظ إعدادات النظام";
  return "تم حفظ الخدمة";
}

function adminPermissionKeys(payload: Record<string, Json>) {
  return Object.entries(payload)
    .filter(([key, value]) => key.includes("permission_") && value === true)
    .map(([key]) => key)
    .sort();
}

const allowedAdminSecurityActions = new Set(["reset_password", "revoke_sessions"]);

function adminTempPassword() {
  const token = globalThis.crypto?.randomUUID?.().replaceAll("-", "") ?? `${Date.now()}${Math.floor(100000 + Math.random() * 899999)}`;
  return `Mahabah-${token.slice(0, 18)}!Aa1`;
}

function adminInviteRedirectTo() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    process.env.VERCEL_URL ||
    "";
  if (!baseUrl) return undefined;
  const normalizedBaseUrl = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;
  return `${normalizedBaseUrl.replace(/\/$/, "")}/auth/login`;
}

async function findAuthUserIdByEmail(supabase: SupabaseClient, email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return null;

  for (let page = 1; page <= 5; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(error.message);
    const found = data.users.find((user) => user.email?.toLowerCase() === normalizedEmail);
    if (found?.id) return found.id;
    if (data.users.length < 1000) break;
  }

  return null;
}

async function resolveAdminAuthProfileId(
  supabase: SupabaseClient,
  input: {
    profileId?: string;
    email: string;
    fullName: string;
    adminRole: string;
    status: string;
    activationInviteRequested: boolean;
  },
) {
  const appMetadata = { account_role: "admin", admin_role: input.adminRole };
  const userMetadata = {
    display_name: input.fullName,
    admin_role: input.adminRole,
    account_status: input.status,
    activation_invite_requested: input.activationInviteRequested,
  };

  const existingProfileId = input.profileId;
  if (isUuid(existingProfileId)) {
    const profileId = existingProfileId!;
    const { error } = await supabase.auth.admin.updateUserById(profileId, {
      email: input.email,
      app_metadata: appMetadata,
      user_metadata: userMetadata,
    });
    return { profileId, authUserCreated: false, authUserLinked: !error, authInviteSent: false, authInviteError: error?.message };
  }

  const existingUserId = await findAuthUserIdByEmail(supabase, input.email);
  if (existingUserId) {
    const { error } = await supabase.auth.admin.updateUserById(existingUserId, {
      app_metadata: appMetadata,
      user_metadata: userMetadata,
    });
    if (error) throw new Error(error.message);
    return { profileId: existingUserId, authUserCreated: false, authUserLinked: true, authInviteSent: false };
  }

  if (input.activationInviteRequested) {
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(input.email, {
      data: userMetadata,
      redirectTo: adminInviteRedirectTo(),
    });
    if (!error && data.user?.id) {
      const profileId = data.user.id;
      const { error: updateError } = await supabase.auth.admin.updateUserById(profileId, {
        app_metadata: appMetadata,
        user_metadata: userMetadata,
      });
      if (updateError) throw new Error(updateError.message);
      return { profileId, authUserCreated: true, authUserLinked: true, authInviteSent: true };
    }

    const fallback = await supabase.auth.admin.createUser({
      email: input.email,
      password: adminTempPassword(),
      email_confirm: false,
      app_metadata: appMetadata,
      user_metadata: userMetadata,
    });
    if (fallback.error) throw new Error(fallback.error.message);
    const profileId = fallback.data.user?.id;
    if (!profileId) throw new Error("admin_auth_user_not_created");
    return {
      profileId,
      authUserCreated: true,
      authUserLinked: true,
      authInviteSent: false,
      authInviteError: error?.message ?? "invite_failed_create_user_fallback_used",
    };
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: input.email,
    password: adminTempPassword(),
    email_confirm: false,
    app_metadata: appMetadata,
    user_metadata: userMetadata,
  });
  if (error) throw new Error(error.message);
  const profileId = data.user?.id;
  if (!profileId) throw new Error("admin_auth_user_not_created");
  return { profileId, authUserCreated: true, authUserLinked: true, authInviteSent: false };
}

export async function saveDashboardAdminManagementAction(input: {
  action: DashboardAdminManagementAction;
  entityId?: string;
  slug?: string;
  title?: string;
  status?: DashboardAdminManagementStatus;
  payload?: Record<string, AdminManagementPayloadValue>;
  actor?: DashboardActorContext | null;
}): Promise<PersistResult & { action: DashboardAdminManagementAction; message?: string }> {
  const supabase = getSupabaseAdmin();
  const message = adminActionMessage(input.action);
  if (!supabase) return { ok: true, persisted: false, action: input.action, message: "supabase_not_configured" };

  const payload = cleanAdminManagementPayload(input.payload);
  const adminUserId = input.actor?.userId ?? DEMO_ADMIN_USER_ID;
  let entityId: string | undefined;
  let entityType = "admin_management";
  let title = compactText(input.title, "تحديث إداري");
  let ownerFinancialNotification: {
    userId: string | null;
    organizationId: string | null;
    title: string;
    body: string;
    actionUrl: string;
    metadata: Record<string, Json>;
  } | null = null;

  if (input.action === "service_catalog_save") {
    const titleAr = payloadText(payload, "titleAr", title === "تحديث إداري" ? "خدمة عقارية" : title);
    const slug = payloadText(payload, "slug", input.slug || slugify(titleAr));
    const statusText = payloadText(payload, "status", "");
    const active = statusText
      ? statusText !== "موقوفة مؤقتاً" && statusText !== "غير نشطة"
      : payloadBoolean(payload, "active", true);
    const record = {
      slug,
      title_ar: titleAr,
      description_ar: payloadText(payload, "descriptionAr", "خدمة عقارية مدارة من لوحة الإدارة."),
      duration_ar: payloadText(payload, "durationAr", "حسب الطلب"),
      level_ar: payloadText(payload, "levelAr", "تشغيلية"),
      outputs_ar: payloadText(payload, "outputsAr", "تقرير خدمة"),
      price_sar: payloadNumber(payload, "priceSar", 0),
      active,
    };

    const query = isUuid(input.entityId)
      ? supabase.from("services_catalog").update(record).eq("id", input.entityId).select("id, title_ar").single()
      : supabase.from("services_catalog").upsert(record, { onConflict: "slug" }).select("id, title_ar").single();
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    entityId = data?.id as string | undefined;
    title = (data?.title_ar as string | undefined) ?? titleAr;
    entityType = "services_catalog";
  }

  if (input.action === "invoice_status") {
    const status = payloadText(payload, "status", "");
    const allowed: DashboardInvoiceStatus[] = ["draft", "due", "paid", "overdue", "cancelled"];
    if (!allowed.includes(status as DashboardInvoiceStatus)) return { ok: true, persisted: false, action: input.action, message: "invoice_status_invalid" };
    let query = supabase
      .from("invoices")
      .update({
        status,
        paid_at: status === "paid" ? new Date().toISOString() : null,
      })
      .select("id, invoice_number, title_ar, user_id, organization_id")
      .limit(1);
    if (isUuid(input.entityId)) query = query.eq("id", input.entityId);
    else if (input.slug) query = query.eq("invoice_number", input.slug);
    else return { ok: true, persisted: false, action: input.action, message: "invoice_not_found" };
    const { data, error } = await query.single();
    if (error || !data) return { ok: true, persisted: false, action: input.action, message: "invoice_not_found" };
    entityId = data.id as string;
    title = `${data.invoice_number}: ${data.title_ar}`;
    entityType = "invoice";
    ownerFinancialNotification = {
      userId: (data.user_id as string | null) ?? null,
      organizationId: (data.organization_id as string | null) ?? null,
      title: "تم تحديث حالة الفاتورة",
      body: `${data.invoice_number}: ${data.title_ar}`,
      actionUrl: data.organization_id ? "/dashboard/business/invoices" : "/dashboard/individual/invoices",
      metadata: {
        action: input.action,
        status,
        invoiceId: data.id as string,
        invoiceNumber: data.invoice_number as string,
      },
    };
  }

  if (input.action === "payment_status") {
    const status = payloadText(payload, "status", "");
    const allowed: DashboardPaymentStatus[] = ["pending", "succeeded", "failed", "refunded"];
    if (!allowed.includes(status as DashboardPaymentStatus)) return { ok: true, persisted: false, action: input.action, message: "payment_status_invalid" };
    let query = supabase
      .from("payments")
      .update({
        status,
        paid_at: status === "succeeded" ? new Date().toISOString() : null,
      })
      .select("id, invoice_id, provider_reference, user_id, organization_id")
      .limit(1);
    if (isUuid(input.entityId)) query = query.eq("id", input.entityId);
    else if (input.slug) query = query.eq("provider_reference", input.slug);
    else return { ok: true, persisted: false, action: input.action, message: "payment_not_found" };
    const { data, error } = await query.single();
    if (error || !data) return { ok: true, persisted: false, action: input.action, message: "payment_not_found" };
    entityId = data.id as string;
    title = (data.provider_reference as string | null) ?? data.id as string;
    entityType = "payment";
    const linkedInvoiceId = (data.invoice_id as string | null) ?? null;
    if (linkedInvoiceId) {
      const invoiceStatus: DashboardInvoiceStatus | null = status === "succeeded"
        ? "paid"
        : status === "failed" || status === "refunded"
          ? "due"
          : null;
      if (invoiceStatus) {
        const { error: invoiceSyncError } = await supabase
          .from("invoices")
          .update({
            status: invoiceStatus,
            paid_at: invoiceStatus === "paid" ? new Date().toISOString() : null,
          })
          .eq("id", linkedInvoiceId);
        if (invoiceSyncError) throw new Error(invoiceSyncError.message);
      }
    }
    ownerFinancialNotification = {
      userId: (data.user_id as string | null) ?? null,
      organizationId: (data.organization_id as string | null) ?? null,
      title: "تم تحديث حالة عملية الدفع",
      body: title,
      actionUrl: data.organization_id ? "/dashboard/business/payments" : "/dashboard/individual/payments",
      metadata: {
        action: input.action,
        status,
        paymentId: data.id as string,
        invoiceId: linkedInvoiceId,
        providerReference: (data.provider_reference as string | null) ?? null,
      },
    };
  }

  if (input.action === "subscription_status") {
    const status = payloadText(payload, "status", "");
    const allowed = ["active", "pending", "expired", "cancelled"];
    if (!allowed.includes(status)) return { ok: true, persisted: false, action: input.action, message: "subscription_status_invalid" };
    if (!isUuid(input.entityId)) return { ok: true, persisted: false, action: input.action, message: "subscription_not_found" };
    const { data, error } = await supabase
      .from("subscriptions")
      .update({ status })
      .eq("id", input.entityId)
      .select("id, plan_name_ar, user_id, organization_id")
      .single();
    if (error || !data) return { ok: true, persisted: false, action: input.action, message: "subscription_not_found" };
    entityId = data.id as string;
    title = data.plan_name_ar as string;
    entityType = "subscription";
    ownerFinancialNotification = {
      userId: (data.user_id as string | null) ?? null,
      organizationId: (data.organization_id as string | null) ?? null,
      title: "تم تحديث حالة الاشتراك",
      body: data.plan_name_ar as string,
      actionUrl: data.organization_id ? "/dashboard/business/subscriptions" : "/dashboard/individual/subscriptions",
      metadata: {
        action: input.action,
        status,
        subscriptionId: data.id as string,
        planName: data.plan_name_ar as string,
      },
    };
  }

  if (input.action === "provider_status") {
    const provider = await resolveProviderForAdminAction(input);
    if (!provider) return { ok: true, persisted: false, action: input.action, message: "provider_not_found" };

    const providerStatus = dashboardAdminProviderStatus(input.status);
    if (!providerStatus) return { ok: true, persisted: false, action: input.action, message: "provider_status_invalid" };
    const status = providerStatusToReviewStatus(providerStatus);
    const { error } = await supabase
      .from("service_providers")
      .update({ status })
      .eq("id", provider.id);
    if (error) throw new Error(error.message);
    entityId = provider.id;
    title = provider.name_ar;
    entityType = "service_provider";
  }

  if (input.action === "provider_save") {
    const name = payloadText(payload, "name", title === "تحديث إداري" ? "مزود خدمة جديد" : title);
    const slug = payloadText(payload, "slug", input.slug || slugify(name));
    const providerStatus = dashboardAdminProviderStatus(input.status ?? "pending");
    if (!providerStatus) return { ok: true, persisted: false, action: input.action, message: "provider_status_invalid" };
    const status = providerStatusToReviewStatus(providerStatus);
    const record = {
      slug,
      name_ar: name,
      category_ar: payloadText(payload, "category", "خدمات عقارية"),
      city_ar: payloadText(payload, "city", "الرياض"),
      contact: payloadText(payload, "contact", ""),
      license_number: payloadText(payload, "license", ""),
      status,
      rating: payloadNumber(payload, "rating", 0),
      requests_count: Math.round(payloadNumber(payload, "requests", 0)),
      metadata: {
        source: "admin_dashboard",
        updatedFrom: "admin_provider_form",
      },
    };
    const query = isUuid(input.entityId)
      ? supabase.from("service_providers").update(record).eq("id", input.entityId).select("id, name_ar").single()
      : supabase.from("service_providers").upsert(record, { onConflict: "slug" }).select("id, name_ar").single();
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    entityId = data?.id as string | undefined;
    title = (data?.name_ar as string | undefined) ?? name;
    entityType = "service_provider";
  }

  if (input.action === "content_status") {
    const content = await resolveContentForAdminAction(input);
    if (!content) return { ok: true, persisted: false, action: input.action, message: "content_not_found" };

    const status = dashboardAdminContentStatus(input.status);
    if (!status) return { ok: true, persisted: false, action: input.action, message: "content_status_invalid" };
    const { error } = await supabase
      .from("content_items")
      .update({ status })
      .eq("id", content.id);
    if (error) throw new Error(error.message);
    entityId = content.id;
    title = content.title_ar;
    entityType = "content_item";
  }

  if (input.action === "content_comment_status") {
    const comment = await resolveContentCommentForAdminAction(input);
    if (!comment) return { ok: true, persisted: false, action: input.action, message: "content_comment_not_found" };

    const status = dashboardAdminContentCommentStatus(input.status);
    if (!status) return { ok: true, persisted: false, action: input.action, message: "content_comment_status_invalid" };
    const { error } = await supabase
      .from("content_comments")
      .update({ status })
      .eq("id", comment.id);
    if (error) throw new Error(error.message);
    entityId = comment.id;
    title = `${comment.author_name}: ${comment.content_slug}`;
    entityType = "content_comment";
  }

  if (input.action === "content_save") {
    const titleAr = payloadText(payload, "title", title === "تحديث إداري" ? "محتوى جديد" : title);
    const kind = dashboardAdminContentKind(payloadText(payload, "kind", "page"));
    if (!kind) return { ok: true, persisted: false, action: input.action, message: "content_kind_invalid" };
    const status = dashboardAdminContentStatus(input.status ?? "draft");
    if (!status) return { ok: true, persisted: false, action: input.action, message: "content_status_invalid" };
    const slug = payloadText(payload, "slug", input.slug || slugify(titleAr));
    const formReference = payloadText(payload, "formReference", "");
    const record = {
      slug,
      title_ar: titleAr,
      kind,
      status,
      category_ar: payloadText(payload, "category", "صفحات الموقع"),
      author_ar: payloadText(payload, "author", "فريق المحتوى"),
      excerpt_ar: payloadText(payload, "excerpt", "ملخص المحتوى من لوحة الإدارة."),
      body_ar: payloadText(payload, "body", "محتوى قابل للتحرير من لوحة الإدارة."),
      view_count: Math.round(payloadNumber(payload, "views", 0)),
      metadata: {
        ...payload,
        source: "admin_dashboard",
        seo: payloadText(payload, "seo", ""),
      },
    };
    const query = isUuid(input.entityId)
      ? supabase.from("content_items").update(record).eq("id", input.entityId).select("id, title_ar").single()
      : supabase.from("content_items").upsert(record, { onConflict: "slug" }).select("id, title_ar").single();
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    entityId = data?.id as string | undefined;
    title = (data?.title_ar as string | undefined) ?? titleAr;
    entityType = "content_item";
    await attachDashboardAdminReferenceDocuments(supabase, {
      formReference,
      entityId,
      entityType: "content_image",
      ownerUserId: adminUserId,
    });
  }

  if (input.action === "admin_role_save") {
    const roleName = payloadText(payload, "name", title === "تحديث إداري" ? "دور وظيفي جديد" : title);
    const slug = payloadText(payload, "slug", input.slug || slugify(roleName));
    const permissions = adminPermissionKeys(payload);
    const record = {
      slug,
      name_ar: roleName,
      scope_ar: payloadText(payload, "scope", "مركز المراجعة والاعتماد"),
      status: adminRoleStatusValue(payloadText(payload, "status", "نشط")),
      permissions_count: permissions.length > 0 ? permissions.length : Math.round(payloadNumber(payload, "permissions", 46)),
      users_count: Math.round(payloadNumber(payload, "users", 0)),
      metadata: {
        source: "admin_dashboard",
        sensitivity: payloadText(payload, "sensitivity", "مرتفع"),
        permissions,
      },
    };
    const query = isUuid(input.entityId)
      ? supabase.from("admin_roles").update(record).eq("id", input.entityId).select("id, name_ar").single()
      : supabase.from("admin_roles").upsert(record, { onConflict: "slug" }).select("id, name_ar").single();
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    entityId = data?.id as string | undefined;
    title = (data?.name_ar as string | undefined) ?? roleName;
    entityType = "admin_role";
  }

  if (input.action === "admin_user_save") {
    const fullName = payloadText(payload, "fullName", title === "تحديث إداري" ? "مدير نظام جديد" : title);
    const email = payloadText(payload, "email", "admin.new@mahabah.sa");
    if (!validDashboardEmail(email)) {
      return { ok: true, persisted: false, action: input.action, message: "admin_profile_email_invalid" };
    }
    const adminRole = payloadText(payload, "adminRole", "مدير المراجعة والاعتماد");
    const permissions = adminPermissionKeys(payload);
    const activationInviteRequested = payloadBoolean(payload, "setting_إرسال_دعوة_تفعيل_بالبريد", true);
    const authProfile = await resolveAdminAuthProfileId(supabase, {
      profileId: input.entityId,
      email,
      fullName,
      adminRole,
      status: payloadText(payload, "status", "نشط"),
      activationInviteRequested,
    });
    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: authProfile.profileId,
        role: "admin",
        full_name: fullName,
        email,
        phone: payloadText(payload, "phone", "+966 50 123 4567"),
        city_ar: payloadText(payload, "city", "الرياض"),
        verification_status: adminRoleStatusValue(payloadText(payload, "status", "نشط")) === "disabled" ? "archived" : "approved",
        profile_completion: 100,
        metadata: {
          adminRole,
          language: payloadText(payload, "language", "العربية"),
          sessions: Math.round(payloadNumber(payload, "sessions", 1)),
          sessionDuration: payloadText(payload, "sessionDuration", "120 دقيقة"),
          allowedIp: payloadText(payload, "allowedIp", ""),
          activationInviteRequested,
          authUserCreated: authProfile.authUserCreated,
          authUserLinked: authProfile.authUserLinked,
          authInviteSent: authProfile.authInviteSent,
          authInviteError: authProfile.authInviteError,
          twoFactorRequired: payloadBoolean(payload, "setting_تفعيل_المصادقة_الثنائية", true),
          ipRestrictionEnabled: payloadBoolean(payload, "setting_تقييد_الوصول_حسب_ip", false),
          permissions,
          permissionsCount: permissions.length,
          source: "admin_dashboard",
        },
      }, { onConflict: "id" })
      .select("id, full_name")
      .single();
    if (error) throw new Error(error.message);
    entityId = data?.id as string | undefined;
    title = (data?.full_name as string | undefined) ?? fullName;
    entityType = "admin_profile";
  }

  if (input.action === "admin_security_action") {
    const adminId = payloadText(payload, "adminId", input.entityId ?? "");
    const securityAction = payloadText(payload, "securityAction", input.slug ?? "admin_security_action");
    if (!isUuid(adminId)) return { ok: true, persisted: false, action: input.action, message: "admin_profile_not_found" };
    if (!allowedAdminSecurityActions.has(securityAction)) {
      return { ok: true, persisted: false, action: input.action, message: "admin_security_action_invalid" };
    }

    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("id, full_name, email, metadata")
      .eq("id", adminId)
      .eq("role", "admin")
      .maybeSingle();
    if (fetchError) throw new Error(fetchError.message);
    if (!profile) return { ok: true, persisted: false, action: input.action, message: "admin_profile_not_found" };

    const profileRow = profile as { id: string; full_name: string; email: string | null; metadata: unknown };
    const metadata = jsonRecord(profileRow.metadata);
    const accountSecurity = jsonRecord(metadata.accountSecurity);
    const requestedAt = new Date().toISOString();
    const securityLabel = payloadText(payload, "label", securityAction === "reset_password" ? "إعادة تعيين كلمة المرور" : securityAction === "revoke_sessions" ? "إنهاء الجلسات المفتوحة" : "إجراء أمان مدير النظام");
    let recoveryEmailSent = false;
    let recoveryEmailError: string | null = null;

    if (securityAction === "reset_password") {
      if (!profileRow.email) return { ok: true, persisted: false, action: input.action, message: "admin_profile_email_missing" };
      const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(profileRow.email, {
        redirectTo: adminInviteRedirectTo(),
      });
      recoveryEmailSent = !recoveryError;
      recoveryEmailError = recoveryError?.message ?? null;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        metadata: {
          ...metadata,
          accountSecurity: {
            ...accountSecurity,
            [securityAction]: {
              requestedAt,
              requestedBy: adminUserId,
              label: securityLabel,
              source: "admin_dashboard",
              recoveryEmailSent,
              recoveryEmailError,
            },
          },
        },
      })
      .eq("id", profileRow.id);
    if (error) throw new Error(error.message);

    entityId = profileRow.id;
    title = `${profileRow.full_name}: ${securityLabel}`;
    entityType = "admin_profile_security";

    await insertRequiredNotification(supabase, {
      user_id: profileRow.id,
      organization_id: null,
      title_ar: "إجراء أمان على حسابك الإداري",
      body_ar: securityLabel,
      category: "security",
      action_url: "/dashboard/admin/system/admins/details",
      metadata: {
        securityAction,
        requestedAt,
        requestedBy: adminUserId,
        recoveryEmailSent,
        recoveryEmailError,
      },
    });
  }

  if (input.action === "settings_save") {
    const key = input.slug || input.entityId || "admin_settings";
    const previousKey = payloadText(payload, "previousKey", "");
    const validSettingsKey = /^[a-z0-9][a-z0-9_-]{1,159}$/i;
    if (!validSettingsKey.test(key) || (previousKey && !validSettingsKey.test(previousKey))) {
      return { ok: true, persisted: false, action: input.action, message: "settings_key_invalid" };
    }
    const settingValue = { ...payload };
    delete settingValue.previousKey;

    if (previousKey && previousKey !== key) {
      const { error: deleteError } = await supabase
        .from("platform_settings")
        .delete()
        .eq("key", previousKey);
      if (deleteError) throw new Error(deleteError.message);
    }

    const { error } = await supabase
      .from("platform_settings")
      .upsert({
        key,
        value: {
          ...settingValue,
          savedAt: new Date().toISOString(),
        },
        updated_by: adminUserId,
      }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    title = payloadText(payload, "label", key);
    entityType = "platform_settings";
  }

  const actionsRequiringEntityId: DashboardAdminManagementAction[] = [
    "service_catalog_save",
    "invoice_status",
    "payment_status",
    "subscription_status",
    "provider_status",
    "provider_save",
    "content_status",
    "content_save",
    "content_comment_status",
    "admin_role_save",
    "admin_user_save",
    "admin_security_action",
  ];
  if (actionsRequiringEntityId.includes(input.action) && !entityId) {
    return { ok: true, persisted: false, action: input.action, message: `${input.action}_not_saved` };
  }

  await insertRequiredAuditLog(supabase, {
    actor_user_id: adminUserId,
    organization_id: null,
    action: input.action,
    entity_type: entityType,
    entity_id: entityId && isUuid(entityId) ? entityId : null,
    metadata: {
      title,
      status: input.status ?? null,
      slug: input.slug ?? null,
      payload,
    },
  });

  await insertDashboardAdminNotifications(supabase, {
    title: message,
    body: title,
    category: "admin",
    actionUrl: "/dashboard/admin",
    metadata: {
      action: input.action,
      entityType,
      entityId: entityId ?? null,
    },
  });

  if (ownerFinancialNotification && (ownerFinancialNotification.userId || ownerFinancialNotification.organizationId)) {
    await insertRequiredNotification(supabase, {
      user_id: ownerFinancialNotification.organizationId ? null : ownerFinancialNotification.userId,
      organization_id: ownerFinancialNotification.organizationId,
      title_ar: ownerFinancialNotification.title,
      body_ar: ownerFinancialNotification.body,
      category: "financial",
      action_url: ownerFinancialNotification.actionUrl,
      metadata: ownerFinancialNotification.metadata,
    });
  }

  return { ok: true, persisted: true, id: entityId, action: input.action, message };
}

export async function updateDashboardAdminAccountStatus(input: {
  accountId: string;
  kind: DashboardAdminAccountKind;
  status: DashboardAdminAccountStatus;
  note?: string;
  actor?: DashboardActorContext | null;
}): Promise<PersistResult & { status: DashboardAdminAccountStatus; message?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: true, persisted: false, status: input.status, message: "supabase_not_configured" };

  const reviewStatus = accountStatusToReviewStatus(input.status);
  const label = accountStatusLabel(input.status);
  const adminUserId = input.actor?.userId ?? DEMO_ADMIN_USER_ID;
  let userId: string | null = null;
  let organizationId: string | null = null;
  let accountName = "حساب منصة";

  if (input.kind === "business") {
    const { data: organization, error: fetchError } = await supabase
      .from("organizations")
      .select("id, owner_user_id, name_ar")
      .eq("id", input.accountId)
      .maybeSingle();
    if (fetchError) throw new Error(fetchError.message);
    if (!organization) return { ok: true, persisted: false, status: input.status, message: "account_not_found" };

    const organizationRow = organization as { id: string; owner_user_id: string | null; name_ar: string };
    userId = organizationRow.owner_user_id;
    organizationId = organizationRow.id;
    accountName = organizationRow.name_ar;

    const { error } = await supabase
      .from("organizations")
      .update({ status: reviewStatus, verification_status: reviewStatus })
      .eq("id", input.accountId);
    if (error) throw new Error(error.message);
  } else {
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("id", input.accountId)
      .maybeSingle();
    if (fetchError) throw new Error(fetchError.message);
    if (!profile) return { ok: true, persisted: false, status: input.status, message: "account_not_found" };

    const profileRow = profile as { id: string; full_name: string };
    userId = profileRow.id;
    accountName = profileRow.full_name;

    const { error } = await supabase
      .from("profiles")
      .update({ verification_status: reviewStatus })
      .eq("id", input.accountId);
    if (error) throw new Error(error.message);
  }

  await insertRequiredAuditLog(supabase, {
    actor_user_id: adminUserId,
    organization_id: organizationId,
    action: `account_${input.status}`,
    entity_type: input.kind === "business" ? "organization" : "profile",
    entity_id: input.accountId,
    metadata: {
      accountName,
      note: input.note || null,
    },
  });

  await insertRequiredNotification(supabase, {
    user_id: userId,
    organization_id: organizationId,
    title_ar: label,
    body_ar: `${accountName}: ${label} من لوحة الإدارة.`,
    category: "account",
    action_url: input.kind === "business" ? "/dashboard/business/company-profile" : "/dashboard/individual/profile",
    metadata: {
      accountId: input.accountId,
      kind: input.kind,
      status: input.status,
    },
  });

  return { ok: true, persisted: true, status: input.status };
}

function dashboardCommunicationOwner(scope: DashboardEntityRequestScope = "individual", actor?: DashboardActorContext | null) {
  const actorUserId = actor?.userId ?? (scope === "business" ? DEMO_BUSINESS_USER_ID : DEMO_INDIVIDUAL_USER_ID);
  if (scope === "business") {
    const organizationId = actor?.organizationId ?? DEMO_BUSINESS_ORG_ID;
    return {
      userId: null,
      organizationId,
      actorUserId,
      conversationId: actor?.organizationId ? undefined : DEMO_BUSINESS_CONVERSATION_ID,
      subject: "محادثة منشأة الازدهار",
      customerLabel: "حساب الأعمال",
    };
  }

  return {
    userId: actorUserId,
    organizationId: null,
    actorUserId,
    conversationId: actor?.userId ? undefined : DEMO_CONVERSATION_ID,
    subject: "محادثة فريق مهابة",
    customerLabel: "حساب الأفراد",
  };
}

export async function listDashboardNotifications(scope: DashboardEntityRequestScope = "individual", actor?: DashboardActorContext | null): Promise<{ data: DashboardNotification[]; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  const owner = dashboardCommunicationOwner(scope, actor);
  if (!supabase) {
    return {
      source: "static",
      data: [
        { id: "static-1", title: "تم تحديث حالة أرض النخيل", body: "تم نقل الأصل إلى قيد الدراسة.", category: "assets", unread: true, createdAt: "منذ ساعتين", actionUrl: "/dashboard/individual/asset-details" },
        { id: "static-2", title: "تم نشر تقرير جديد", body: "تقرير مساهمة أبراج الرياض متاح الآن.", category: "contributions", unread: true, createdAt: "منذ 5 ساعات", actionUrl: "/dashboard/individual/contribution-details" },
        { id: "static-3", title: "تم اعتماد طلب دراسة الجدوى", body: "طلبك مكتمل ويمكنك متابعة التفاصيل.", category: "services", unread: false, createdAt: "منذ يوم", actionUrl: "/dashboard/individual/service-details" },
      ],
    };
  }

  let query = supabase
    .from("notifications")
    .select("id, title_ar, body_ar, category, read_at, action_url, created_at")
    .order("created_at", { ascending: false })
    .limit(20);
  query = owner.organizationId ? query.eq("organization_id", owner.organizationId) : query.eq("user_id", owner.userId);

  const { data, error } = await query;
  if (error || !data) return { source: "supabase", data: [], error: error?.message };
  return {
    source: "supabase",
    data: data.map((item) => ({
      id: item.id as string,
      title: item.title_ar as string,
      body: item.body_ar as string,
      category: item.category as string,
      unread: !item.read_at,
      createdAt: item.created_at as string,
      actionUrl: item.action_url as string | null,
    })),
  };
}

export async function markDashboardNotificationsRead(input: { scope?: DashboardEntityRequestScope; notificationId?: string; actor?: DashboardActorContext | null }): Promise<PersistResult & { updated: number; message?: string }> {
  const supabase = getSupabaseAdmin();
  const owner = dashboardCommunicationOwner(input.scope, input.actor);
  if (!supabase) return { ok: true, persisted: false, updated: input.notificationId ? 1 : 3, message: "supabase_not_configured" };

  let query = supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .is("read_at", null)
    .select("id");
  query = owner.organizationId ? query.eq("organization_id", owner.organizationId) : query.eq("user_id", owner.userId);

  if (input.notificationId) query = query.eq("id", input.notificationId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  if (input.notificationId && !data?.length) {
    return { ok: true, persisted: false, updated: 0, message: "notification_not_found" };
  }

  return { ok: true, persisted: true, updated: data?.length ?? 0 };
}

export type DashboardAdminNotificationTarget = "individual" | "business" | "admin" | "all";

function notificationTargetType(row: { user_id?: string | null; organization_id?: string | null }): DashboardNotification["targetType"] {
  if (row.organization_id) return "business";
  if (row.user_id === DEMO_ADMIN_USER_ID) return "admin";
  if (row.user_id) return "individual";
  return "unknown";
}

function notificationTargetLabel(row: { user_id?: string | null; organization_id?: string | null }) {
  if (row.organization_id === DEMO_BUSINESS_ORG_ID) return "شركة الازدهار العقارية";
  if (row.organization_id) return "منشأة أعمال";
  if (row.user_id === DEMO_ADMIN_USER_ID) return "فريق الإدارة";
  if (row.user_id === DEMO_INDIVIDUAL_USER_ID) return "أحمد عبدالله";
  if (row.user_id) return "مستخدم فردي";
  return "عام";
}

function mapNotificationRow(item: Record<string, unknown>): DashboardNotification {
  const userId = item.user_id as string | null | undefined;
  const organizationId = item.organization_id as string | null | undefined;
  return {
    id: item.id as string,
    title: item.title_ar as string,
    body: item.body_ar as string,
    category: item.category as string,
    unread: !item.read_at,
    createdAt: item.created_at as string,
    actionUrl: item.action_url as string | null,
    userId,
    organizationId,
    targetLabel: notificationTargetLabel({ user_id: userId, organization_id: organizationId }),
    targetType: notificationTargetType({ user_id: userId, organization_id: organizationId }),
  };
}

type DashboardAdminNotificationRecipient = {
  user_id: string | null;
  organization_id: string | null;
  action_url: string;
};

function staticAdminNotificationRecipients(target: DashboardAdminNotificationTarget, actionUrl?: string | null): DashboardAdminNotificationRecipient[] {
  const defaultUrl = (kind: Exclude<DashboardAdminNotificationTarget, "all">) => actionUrl || `/dashboard/${kind === "admin" ? "admin" : kind}/notifications`;
  const recipients = {
    individual: [{ user_id: DEMO_INDIVIDUAL_USER_ID, organization_id: null, action_url: defaultUrl("individual") }],
    business: [{ user_id: null, organization_id: DEMO_BUSINESS_ORG_ID, action_url: defaultUrl("business") }],
    admin: [{ user_id: DEMO_ADMIN_USER_ID, organization_id: null, action_url: defaultUrl("admin") }],
  };
  if (target === "all") return [...recipients.individual, ...recipients.business, ...recipients.admin];
  return recipients[target];
}

async function adminNotificationRecipients(supabase: SupabaseClient, target: DashboardAdminNotificationTarget, actionUrl?: string | null): Promise<DashboardAdminNotificationRecipient[]> {
  const requestedTargets = target === "all" ? ["individual", "business", "admin"] as const : [target];
  const defaultUrl = (kind: Exclude<DashboardAdminNotificationTarget, "all">) => actionUrl || `/dashboard/${kind === "admin" ? "admin" : kind}/notifications`;
  const recipients: DashboardAdminNotificationRecipient[] = [];

  if (requestedTargets.includes("individual")) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "individual")
      .limit(1000);
    if (error) throw new Error(error.message);
    recipients.push(...(data ?? []).map((profile) => ({
      user_id: profile.id as string,
      organization_id: null,
      action_url: defaultUrl("individual"),
    })));
  }

  if (requestedTargets.includes("business")) {
    const { data, error } = await supabase
      .from("organizations")
      .select("id")
      .limit(1000);
    if (error) throw new Error(error.message);
    recipients.push(...(data ?? []).map((organization) => ({
      user_id: null,
      organization_id: organization.id as string,
      action_url: defaultUrl("business"),
    })));
  }

  if (requestedTargets.includes("admin")) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "admin")
      .limit(1000);
    if (error) throw new Error(error.message);
    recipients.push(...(data ?? []).map((profile) => ({
      user_id: profile.id as string,
      organization_id: null,
      action_url: defaultUrl("admin"),
    })));
  }

  const seen = new Set<string>();
  const uniqueRecipients = recipients.filter((recipient) => {
    const key = recipient.organization_id ? `organization:${recipient.organization_id}` : `user:${recipient.user_id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return uniqueRecipients.length ? uniqueRecipients : staticAdminNotificationRecipients(target, actionUrl);
}

async function insertDashboardAdminNotifications(
  supabase: SupabaseClient,
  input: {
    title: string;
    body: string;
    category: string;
    actionUrl: string;
    metadata?: Record<string, Json>;
  },
) {
  const recipients = await adminNotificationRecipients(supabase, "admin", input.actionUrl);
  const { error } = await supabase.from("notifications").insert(recipients.map((recipient) => ({
    user_id: recipient.user_id,
    organization_id: recipient.organization_id,
    title_ar: input.title,
    body_ar: input.body,
    category: input.category,
    action_url: recipient.action_url,
    metadata: input.metadata ?? {},
  })));
  if (error) throw new Error(error.message);
}

async function insertRequiredAuditLog(supabase: SupabaseClient, payload: Record<string, unknown>) {
  const { error } = await supabase.from("audit_logs").insert(payload);
  if (error) throw new Error(error.message);
}

async function insertRequiredNotification(supabase: SupabaseClient, payload: Record<string, unknown>) {
  const { error } = await supabase.from("notifications").insert(payload);
  if (error) throw new Error(error.message);
}

async function dashboardAdminUserIds(supabase: SupabaseClient): Promise<string[]> {
  const recipients = await adminNotificationRecipients(supabase, "admin", "/dashboard/admin/notifications");
  const ids = recipients
    .map((recipient) => recipient.user_id)
    .filter((userId): userId is string => Boolean(userId));
  return ids.length ? Array.from(new Set(ids)) : [DEMO_ADMIN_USER_ID];
}

export async function listDashboardAdminNotifications(): Promise<{ data: DashboardNotification[]; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      source: "static",
      data: [
        { id: "static-admin-note-1", title: "تم اعتماد مساهمة جديدة", body: "مساهمة واجهة الرياض أصبحت جاهزة للعرض.", category: "contribution", unread: true, createdAt: "2026-06-22T10:00:00.000Z", actionUrl: "/dashboard/admin/contributions", userId: null, organizationId: DEMO_BUSINESS_ORG_ID, targetLabel: "شركة الازدهار العقارية", targetType: "business" },
        { id: "static-admin-note-2", title: "تنبيه تحديث بيانات", body: "يرجى إكمال بيانات الهوية للاستفادة من كامل الخدمات.", category: "account", unread: false, createdAt: "2026-06-21T14:30:00.000Z", actionUrl: "/dashboard/individual/profile", userId: DEMO_INDIVIDUAL_USER_ID, organizationId: null, targetLabel: "أحمد عبدالله", targetType: "individual" },
      ],
    };
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("id, user_id, organization_id, title_ar, body_ar, category, read_at, action_url, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error || !data) return { source: "supabase", data: [], error: error?.message };
  return { source: "supabase", data: data.map((item) => mapNotificationRow(item)) };
}

export async function createDashboardAdminNotification(input: {
  target: DashboardAdminNotificationTarget;
  title: string;
  body: string;
  category?: string;
  actionUrl?: string;
  actor?: DashboardActorContext | null;
}): Promise<PersistResult & { inserted: number; ids?: string[]; message?: string }> {
  const title = input.title.trim();
  const body = input.body.trim();
  const category = input.category?.trim() || "system";
  const actionUrl = input.actionUrl?.trim() || null;
  const adminUserId = input.actor?.userId ?? DEMO_ADMIN_USER_ID;
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const recipients = staticAdminNotificationRecipients(input.target, actionUrl);
    return { ok: true, persisted: false, inserted: recipients.length, ids: [], message: "supabase_not_configured" };
  }

  const recipients = await adminNotificationRecipients(supabase, input.target, actionUrl);

  const { data, error } = await supabase
    .from("notifications")
    .insert(recipients.map((recipient) => ({
      ...recipient,
      title_ar: title,
      body_ar: body,
      category,
      metadata: {
        target: input.target,
        sentBy: "admin-dashboard",
      },
    })))
    .select("id");
  if (error) throw new Error(error.message);
  const notificationIds = (data ?? []).map((item) => item.id as string).filter(Boolean);
  if (!notificationIds.length) {
    return { ok: true, persisted: false, inserted: 0, ids: [], message: "admin_notification_not_created" };
  }

  await insertRequiredAuditLog(supabase, {
    actor_user_id: adminUserId,
    action: "admin_notification_sent",
    entity_type: "notification",
    entity_id: notificationIds[0] ?? null,
    metadata: {
      target: input.target,
      category,
      inserted: notificationIds.length,
      title,
    },
  });

  return { ok: true, persisted: true, inserted: notificationIds.length, ids: notificationIds };
}

export async function updateDashboardAdminNotification(input: { notificationId: string; read: boolean; actor?: DashboardActorContext | null }): Promise<PersistResult & { read: boolean; message?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: true, persisted: false, id: input.notificationId, read: input.read, message: "supabase_not_configured" };
  if (!isUuid(input.notificationId)) return { ok: true, persisted: false, id: input.notificationId, read: input.read, message: "invalid_notification_id" };
  const adminUserId = input.actor?.userId ?? DEMO_ADMIN_USER_ID;

  const { data, error } = await supabase
    .from("notifications")
    .update({ read_at: input.read ? new Date().toISOString() : null })
    .eq("id", input.notificationId)
    .eq("user_id", adminUserId)
    .is("organization_id", null)
    .select("id, user_id, organization_id")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data?.id) return { ok: true, persisted: false, id: input.notificationId, read: input.read, message: "notification_not_found" };

  await insertRequiredAuditLog(supabase, {
    actor_user_id: adminUserId,
    organization_id: (data.organization_id as string | null) ?? null,
    action: input.read ? "admin_notification_marked_read" : "admin_notification_marked_unread",
    entity_type: "notification",
    entity_id: data.id as string,
    metadata: {
      userId: (data.user_id as string | null) ?? null,
      read: input.read,
    },
  });

  return { ok: true, persisted: true, id: data.id as string, read: input.read };
}

async function createDashboardConversationForOwner(
  supabase: SupabaseClient,
  scope: DashboardEntityRequestScope = "individual",
  actor?: DashboardActorContext | null,
  subject?: string,
  useFixedDemoId = false,
) {
  const owner = dashboardCommunicationOwner(scope, actor);
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      ...(useFixedDemoId && owner.conversationId ? { id: owner.conversationId } : {}),
      subject_ar: subject?.trim() || owner.subject,
      status: "open",
      created_by: owner.actorUserId,
      organization_id: owner.organizationId,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  const conversationId = data?.id as string | undefined;
  if (!conversationId) throw new Error("conversation_not_created");

  const adminUserIds = await dashboardAdminUserIds(supabase);
  const participantRows = Array.from(new Set([owner.actorUserId, ...adminUserIds])).map((userId) => ({
    conversation_id: conversationId,
    user_id: userId,
  }));
  const { error: participantsError } = await supabase
    .from("conversation_participants")
    .upsert(participantRows, { onConflict: "conversation_id,user_id" });
  if (participantsError) throw new Error(participantsError.message);

  return conversationId;
}

async function ensureDemoConversation(scope: DashboardEntityRequestScope = "individual", actor?: DashboardActorContext | null) {
  const supabase = getSupabaseAdmin();
  const owner = dashboardCommunicationOwner(scope, actor);
  if (!supabase) return null;

  if (owner.conversationId) {
    const { data: existing, error: existingError } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", owner.conversationId)
      .maybeSingle();
    if (existingError) throw new Error(existingError.message);
    if (existing?.id) return existing.id as string;
  } else {
    let existingQuery = supabase
      .from("conversations")
      .select("id")
      .eq("created_by", owner.actorUserId)
      .order("updated_at", { ascending: false })
      .limit(1);
    existingQuery = owner.organizationId ? existingQuery.eq("organization_id", owner.organizationId) : existingQuery.is("organization_id", null);
    const { data: existing, error: existingError } = await existingQuery.maybeSingle();
    if (existingError) throw new Error(existingError.message);
    if (existing?.id) return existing.id as string;
  }

  return createDashboardConversationForOwner(supabase, scope, actor, owner.subject, Boolean(owner.conversationId));
}

async function resolveDashboardConversationForOwner(supabase: SupabaseClient, scope: DashboardEntityRequestScope | undefined, actor: DashboardActorContext | null | undefined, conversationId?: string) {
  const owner = dashboardCommunicationOwner(scope, actor);
  if (!conversationId) return ensureDemoConversation(scope, actor);
  if (!isUuid(conversationId)) return null;

  let query = supabase
    .from("conversations")
    .select("id")
    .eq("id", conversationId)
    .neq("status", "archived")
    .limit(1);
  query = owner.organizationId ? query.eq("organization_id", owner.organizationId) : query.eq("created_by", owner.actorUserId).is("organization_id", null);

  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  return (data?.id as string | undefined) ?? null;
}

async function markDashboardConversationRead(supabase: SupabaseClient, conversationId: string, viewerUserId: string) {
  const { error } = await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .neq("sender_user_id", viewerUserId)
    .is("read_at", null);
  if (error) throw new Error(error.message);
}

export async function listDashboardConversations(scope: DashboardEntityRequestScope = "individual", actor?: DashboardActorContext | null): Promise<{ data: DashboardConversation[]; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  const owner = dashboardCommunicationOwner(scope, actor);
  if (!supabase) {
    return {
      source: "static",
      data: [
        { id: "CONV-2025-0001", subject: "فريق مهابة", status: "open", latestMessage: "على الرحب والسعة، في خدمتك دائماً.", latestAt: "10:20 ص" },
        { id: "CONV-2025-0002", subject: "الدعم الفني", status: "open", latestMessage: "تذكرة رقم SRV-2025-0012 تم تحديثها", latestAt: "أمس" },
      ],
    };
  }

  let query = supabase
    .from("conversations")
    .select("id, subject_ar, status, updated_at")
    .neq("status", "archived")
    .order("updated_at", { ascending: false })
    .limit(20);
  query = owner.organizationId ? query.eq("organization_id", owner.organizationId) : query.eq("created_by", owner.actorUserId).is("organization_id", null);
  const { data, error } = await query;
  if (error || !data) return { source: "supabase", data: [], error: error?.message };

  const conversationIds = data.map((item) => item.id as string).filter(Boolean);
  const latestByConversation = new Map<string, { body_ar?: string | null; created_at?: string | null }>();
  if (conversationIds.length) {
    const { data: latestMessages } = await supabase
      .from("messages")
      .select("conversation_id, body_ar, created_at")
      .in("conversation_id", conversationIds)
      .order("created_at", { ascending: false })
      .limit(100);
    latestMessages?.forEach((message) => {
      const conversationId = message.conversation_id as string;
      if (!latestByConversation.has(conversationId)) {
        latestByConversation.set(conversationId, {
          body_ar: message.body_ar as string | null,
          created_at: message.created_at as string | null,
        });
      }
    });
  }

  return {
    source: "supabase",
    data: data.map((item) => {
      const latest = latestByConversation.get(item.id as string);
      return {
        id: item.id as string,
        subject: item.subject_ar as string,
        status: item.status as string,
        latestMessage: latest?.body_ar ?? undefined,
        latestAt: latest?.created_at ?? (item.updated_at as string),
      };
    }),
  };
}

export async function listDashboardMessages(scope: DashboardEntityRequestScope = "individual", conversationId?: string, actor?: DashboardActorContext | null): Promise<{ data: DashboardMessage[]; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  const owner = dashboardCommunicationOwner(scope, actor);
  if (!supabase) {
    return {
      source: "static",
      data: [
        { id: "static-message-1", conversationId: "CONV-2025-0001", body: "مرحبا أحمد، شكراً لتواصلك معنا. كيف يمكننا مساعدتك اليوم؟", senderUserId: DEMO_ADMIN_USER_ID, mine: false, createdAt: "10:15 ص" },
        { id: "static-message-2", conversationId: "CONV-2025-0001", body: "مرحبا، أريد الاستفسار عن حالة طلب خدمة عقارية برقم SRV-2025-0018.", senderUserId: owner.actorUserId, mine: true, createdAt: "10:16 ص" },
        { id: "static-message-3", conversationId: "CONV-2025-0001", body: "تم استلام طلبك بنجاح وهو حالياً قيد المراجعة من قبل الفريق المختص.", senderUserId: DEMO_ADMIN_USER_ID, mine: false, createdAt: "10:18 ص" },
      ],
    };
  }

  const resolvedConversationId = await resolveDashboardConversationForOwner(supabase, scope, actor, conversationId);
  if (!resolvedConversationId) return { source: "supabase", data: [] };

  await markDashboardConversationRead(supabase, resolvedConversationId, owner.actorUserId);

  const { data, error } = await supabase
    .from("messages")
    .select("id, conversation_id, sender_user_id, body_ar, read_at, created_at")
    .eq("conversation_id", resolvedConversationId)
    .order("created_at", { ascending: true })
    .limit(80);
  if (error || !data) return { source: "supabase", data: [], error: error?.message };

  return {
    source: "supabase",
    data: data.map((message) => ({
      id: message.id as string,
      conversationId: message.conversation_id as string,
      body: message.body_ar as string,
      senderUserId: message.sender_user_id as string | null,
      mine: message.sender_user_id === owner.actorUserId,
      createdAt: message.created_at as string,
      readAt: message.read_at as string | null,
    })),
  };
}

export async function sendDashboardMessage(input: {
  body: string;
  conversationId?: string;
  scope?: DashboardEntityRequestScope;
  createNew?: boolean;
  subject?: string;
  actor?: DashboardActorContext | null;
}): Promise<PersistResult & { body: string; conversationId?: string; message?: string }> {
  const supabase = getSupabaseAdmin();
  const owner = dashboardCommunicationOwner(input.scope, input.actor);
  const body = input.body.trim();
  if (dashboardMessageInvalid(body)) {
    return { ok: true, persisted: false, body, conversationId: input.conversationId, message: "message_body_invalid" };
  }
  if (!supabase) return { ok: true, persisted: false, body, conversationId: input.conversationId || "CONV-2025-0001", message: "supabase_not_configured" };

  const conversationId = input.createNew
    ? await createDashboardConversationForOwner(supabase, input.scope, input.actor, input.subject)
    : await resolveDashboardConversationForOwner(supabase, input.scope, input.actor, input.conversationId);
  if (!conversationId) return { ok: true, persisted: false, body, conversationId: input.conversationId, message: "conversation_not_found" };

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_user_id: owner.actorUserId,
      body_ar: body,
      metadata: {
        scope: input.scope ?? "individual",
        organizationId: owner.organizationId,
      },
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  const messageId = data?.id as string | undefined;
  if (!messageId) return { ok: true, persisted: false, body, conversationId, message: "message_not_created" };

  const { error: conversationUpdateError } = await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);
  if (conversationUpdateError) throw new Error(conversationUpdateError.message);
  await insertDashboardAdminNotifications(supabase, {
    title: `رسالة جديدة من ${owner.customerLabel}`,
    body,
    category: "message",
    actionUrl: "/dashboard/admin/messages",
    metadata: { conversationId, scope: input.scope ?? "individual", organizationId: owner.organizationId },
  });

  return { ok: true, persisted: true, id: messageId, body, conversationId };
}

export async function archiveDashboardConversation(input: { conversationId: string; scope?: DashboardEntityRequestScope; actor?: DashboardActorContext | null }): Promise<PersistResult & { conversationId: string; message?: string }> {
  const conversationId = input.conversationId.trim();
  const supabase = getSupabaseAdmin();
  const owner = dashboardCommunicationOwner(input.scope, input.actor);
  if (!conversationId) return { ok: true, persisted: false, conversationId, message: "conversation_id_required" };
  if (!supabase) return { ok: true, persisted: false, conversationId, message: "supabase_not_configured" };
  if (!isUuid(conversationId)) return { ok: true, persisted: false, conversationId, message: "invalid_conversation_id" };

  let query = supabase
    .from("conversations")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("id", conversationId)
    .select("id");
  query = owner.organizationId ? query.eq("organization_id", owner.organizationId) : query.eq("created_by", owner.actorUserId).is("organization_id", null);

  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  if (!data?.id) return { ok: true, persisted: false, conversationId, message: "conversation_not_found" };

  const { error: auditError } = await supabase.from("audit_logs").insert({
    actor_user_id: owner.actorUserId,
    organization_id: owner.organizationId,
    action: "dashboard_conversation_archived",
    entity_type: "conversation",
    entity_id: conversationId,
    metadata: {
      scope: input.scope ?? "individual",
    },
  });
  if (auditError) throw new Error(auditError.message);

  return { ok: true, persisted: true, conversationId };
}

export async function listDashboardAdminConversations(): Promise<{ data: DashboardConversation[]; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      source: "static",
      data: [
        { id: DEMO_CONVERSATION_ID, subject: "محادثة فريق مهابة", status: "open", latestMessage: "تم استلام طلبك بنجاح وهو حالياً قيد المراجعة.", latestAt: "2026-06-03T10:18:00.000Z", ownerLabel: "أحمد عبدالله", createdBy: DEMO_INDIVIDUAL_USER_ID },
        { id: DEMO_BUSINESS_CONVERSATION_ID, subject: "محادثة منشأة الازدهار", status: "open", latestMessage: "تم ربط استفساركم بمركز المراجعة.", latestAt: "2026-06-03T12:12:00.000Z", ownerLabel: "شركة الازدهار العقارية", organizationId: DEMO_BUSINESS_ORG_ID },
      ],
    };
  }

  const { data, error } = await supabase
    .from("conversations")
    .select("id, subject_ar, status, created_by, organization_id, updated_at")
    .neq("status", "archived")
    .order("updated_at", { ascending: false })
    .limit(100);
  if (error || !data) return { source: "supabase", data: [], error: error?.message };

  const conversationIds = data.map((item) => item.id as string).filter(Boolean);
  const userIds = data.map((item) => item.created_by as string | null).filter((id): id is string => Boolean(id));
  const organizationIds = data.map((item) => item.organization_id as string | null).filter((id): id is string => Boolean(id));
  const latestByConversation = new Map<string, { body_ar?: string | null; created_at?: string | null }>();
  const profileLabels = new Map<string, string>();
  const organizationLabels = new Map<string, string>();

  if (conversationIds.length) {
    const { data: latestMessages } = await supabase
      .from("messages")
      .select("conversation_id, body_ar, created_at")
      .in("conversation_id", conversationIds)
      .order("created_at", { ascending: false })
      .limit(300);
    latestMessages?.forEach((message) => {
      const conversationId = message.conversation_id as string;
      if (!latestByConversation.has(conversationId)) {
        latestByConversation.set(conversationId, {
          body_ar: message.body_ar as string | null,
          created_at: message.created_at as string | null,
        });
      }
    });
  }

  if (userIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", Array.from(new Set(userIds)));
    profiles?.forEach((profile) => profileLabels.set(profile.id as string, (profile.full_name as string | null) || (profile.email as string | null) || "مستخدم"));
  }

  if (organizationIds.length) {
    const { data: organizations } = await supabase
      .from("organizations")
      .select("id, name_ar")
      .in("id", Array.from(new Set(organizationIds)));
    organizations?.forEach((organization) => organizationLabels.set(organization.id as string, (organization.name_ar as string | null) || "منشأة"));
  }

  return {
    source: "supabase",
    data: data.map((item) => {
      const id = item.id as string;
      const organizationId = item.organization_id as string | null;
      const createdBy = item.created_by as string | null;
      const latest = latestByConversation.get(id);
      return {
        id,
        subject: item.subject_ar as string,
        status: item.status as string,
        latestMessage: latest?.body_ar ?? undefined,
        latestAt: latest?.created_at ?? (item.updated_at as string),
        ownerLabel: organizationId ? organizationLabels.get(organizationId) ?? "منشأة" : createdBy ? profileLabels.get(createdBy) ?? "فرد" : "غير محدد",
        organizationId,
        createdBy,
      };
    }),
  };
}

async function resolveDashboardAdminConversation(supabase: SupabaseClient, conversationId?: string) {
  if (!conversationId) {
    const { data, error } = await supabase
      .from("conversations")
      .select("id")
      .neq("status", "archived")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (data?.id as string | undefined) ?? null;
  }
  if (!isUuid(conversationId)) return null;
  const { data, error } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", conversationId)
    .neq("status", "archived")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data?.id as string | undefined) ?? null;
}

export async function listDashboardAdminMessages(conversationId?: string, actor?: DashboardActorContext | null): Promise<{ data: DashboardMessage[]; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  const adminUserId = actor?.userId ?? DEMO_ADMIN_USER_ID;
  if (!supabase) {
    return {
      source: "static",
      data: [
        { id: "static-admin-message-1", conversationId: DEMO_CONVERSATION_ID, body: "مرحبا أحمد، شكراً لتواصلك معنا. كيف يمكننا مساعدتك اليوم؟", senderUserId: DEMO_ADMIN_USER_ID, mine: true, createdAt: "2026-06-03T10:15:00.000Z" },
        { id: "static-admin-message-2", conversationId: DEMO_CONVERSATION_ID, body: "مرحبا، أريد الاستفسار عن حالة طلب خدمة عقارية برقم SRV-2025-0018.", senderUserId: DEMO_INDIVIDUAL_USER_ID, mine: false, createdAt: "2026-06-03T10:16:00.000Z" },
      ],
    };
  }

  const resolvedConversationId = await resolveDashboardAdminConversation(supabase, conversationId);
  if (!resolvedConversationId) return { source: "supabase", data: [] };

  await markDashboardConversationRead(supabase, resolvedConversationId, adminUserId);

  const { data, error } = await supabase
    .from("messages")
    .select("id, conversation_id, sender_user_id, body_ar, read_at, created_at")
    .eq("conversation_id", resolvedConversationId)
    .order("created_at", { ascending: true })
    .limit(120);
  if (error || !data) return { source: "supabase", data: [], error: error?.message };

  return {
    source: "supabase",
    data: data.map((message) => ({
      id: message.id as string,
      conversationId: message.conversation_id as string,
      body: message.body_ar as string,
      senderUserId: message.sender_user_id as string | null,
      mine: message.sender_user_id === adminUserId,
      createdAt: message.created_at as string,
      readAt: message.read_at as string | null,
    })),
  };
}

export async function sendDashboardAdminMessage(input: { conversationId: string; body: string; actor?: DashboardActorContext | null }): Promise<PersistResult & { body: string; conversationId: string; message?: string }> {
  const supabase = getSupabaseAdmin();
  const body = input.body.trim();
  const conversationId = input.conversationId.trim();
  const adminUserId = input.actor?.userId ?? DEMO_ADMIN_USER_ID;
  if (!conversationId) return { ok: true, persisted: false, body, conversationId, message: "conversation_id_required" };
  if (dashboardMessageInvalid(body)) return { ok: true, persisted: false, body, conversationId, message: "message_body_invalid" };
  if (!supabase) return { ok: true, persisted: false, body, conversationId, message: "supabase_not_configured" };
  if (!isUuid(conversationId)) return { ok: true, persisted: false, body, conversationId, message: "invalid_conversation_id" };

  const { data: conversation, error: conversationError } = await supabase
    .from("conversations")
    .select("id, created_by, organization_id")
    .eq("id", conversationId)
    .neq("status", "archived")
    .maybeSingle();
  if (conversationError) throw new Error(conversationError.message);
  if (!conversation?.id) return { ok: true, persisted: false, body, conversationId, message: "conversation_not_found" };

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_user_id: adminUserId,
      body_ar: body,
      metadata: { sentBy: "admin-dashboard" },
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  const messageId = data?.id as string | undefined;
  if (!messageId) return { ok: true, persisted: false, body, conversationId, message: "message_not_created" };

  const { error: conversationUpdateError } = await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);
  if (conversationUpdateError) throw new Error(conversationUpdateError.message);
  const { error: participantError } = await supabase
    .from("conversation_participants")
    .upsert({ conversation_id: conversationId, user_id: adminUserId }, { onConflict: "conversation_id,user_id" });
  if (participantError) throw new Error(participantError.message);
  const { error: ownerNotificationError } = await supabase.from("notifications").insert({
    user_id: (conversation.created_by as string | null) ?? null,
    organization_id: (conversation.organization_id as string | null) ?? null,
    title_ar: "رد جديد من فريق مهابة",
    body_ar: body,
    category: "message",
    action_url: (conversation.organization_id as string | null) ? "/dashboard/business/messages" : "/dashboard/individual/messages",
    metadata: { conversationId, sentBy: "admin-dashboard" },
  });
  if (ownerNotificationError) throw new Error(ownerNotificationError.message);
  const { error: auditError } = await supabase.from("audit_logs").insert({
    actor_user_id: adminUserId,
    organization_id: (conversation.organization_id as string | null) ?? null,
    action: "admin_message_sent",
    entity_type: "conversation",
    entity_id: conversationId,
    metadata: { messageId },
  });
  if (auditError) throw new Error(auditError.message);

  return { ok: true, persisted: true, id: messageId, body, conversationId };
}

export async function archiveDashboardAdminConversation(input: { conversationId: string; actor?: DashboardActorContext | null }): Promise<PersistResult & { conversationId: string; message?: string }> {
  const conversationId = input.conversationId.trim();
  const supabase = getSupabaseAdmin();
  const adminUserId = input.actor?.userId ?? DEMO_ADMIN_USER_ID;
  if (!conversationId) return { ok: true, persisted: false, conversationId, message: "conversation_id_required" };
  if (!supabase) return { ok: true, persisted: false, conversationId, message: "supabase_not_configured" };
  if (!isUuid(conversationId)) return { ok: true, persisted: false, conversationId, message: "invalid_conversation_id" };

  const { data, error } = await supabase
    .from("conversations")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("id", conversationId)
    .select("id, organization_id")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data?.id) return { ok: true, persisted: false, conversationId, message: "conversation_not_found" };

  const { error: auditError } = await supabase.from("audit_logs").insert({
    actor_user_id: adminUserId,
    organization_id: (data.organization_id as string | null) ?? null,
    action: "admin_conversation_archived",
    entity_type: "conversation",
    entity_id: conversationId,
    metadata: {},
  });
  if (auditError) throw new Error(auditError.message);

  return { ok: true, persisted: true, conversationId };
}

export async function listDashboardSupportTickets(scope: DashboardEntityRequestScope = "individual", actor?: DashboardActorContext | null): Promise<{ data: DashboardSupportTicket[]; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  const owner = dashboardCommunicationOwner(scope, actor);
  if (!supabase) {
    return {
      source: "static",
      data: [
        { id: "static-ticket-1", ticketNumber: "TK-2025-00125", title: "استفسار عن طلب خدمة عقارية", description: "أحتاج لمعرفة حالة طلب الخدمة العقارية وآخر تحديث عليه.", category: "خدمات عقارية", status: "submitted", priority: "normal", createdAt: "2025/06/03" },
        { id: "static-ticket-2", ticketNumber: "TK-2025-00118", title: "تأخر في معالجة طلب", description: "تأخر الطلب عن الموعد المتوقع وأرغب في تحديث الحالة.", category: "طلبات", status: "in_progress", priority: "normal", createdAt: "2025/06/02" },
      ],
    };
  }

  let query = supabase
    .from("support_tickets")
    .select("id, ticket_number, title_ar, description_ar, category, status, priority, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(30);
  query = owner.organizationId ? query.eq("organization_id", owner.organizationId) : query.eq("requester_user_id", owner.userId);
  const { data, error } = await query;
  if (error || !data) return { source: "supabase", data: [], error: error?.message };

  return {
    source: "supabase",
    data: data.map((item) => ({
      id: item.id as string,
      ticketNumber: item.ticket_number as string,
      title: item.title_ar as string,
      description: item.description_ar as string,
      category: item.category as string,
      status: item.status as string,
      priority: item.priority as string,
      createdAt: item.created_at as string,
      updatedAt: item.updated_at as string | null,
    })),
  };
}

export async function getDashboardSupportTicket(scope: DashboardEntityRequestScope = "individual", ticketId?: string, actor?: DashboardActorContext | null): Promise<{ ticket: DashboardSupportTicket | null; messages: DashboardSupportTicketMessage[]; source: "supabase" | "static"; error?: string }> {
  const list = await listDashboardSupportTickets(scope, actor);
  const fallbackTicket = ticketId ? list.data.find((ticket) => ticket.id === ticketId || ticket.ticketNumber === ticketId) : list.data[0];
  const supabase = getSupabaseAdmin();
  const owner = dashboardCommunicationOwner(scope, actor);
  if (!supabase) {
    return {
      source: "static",
      ticket: fallbackTicket ?? null,
      messages: fallbackTicket ? [
        { id: "static-ticket-message-1", ticketId: fallbackTicket.id, body: fallbackTicket.description ?? "تم إنشاء التذكرة وسيتم متابعتها.", senderUserId: owner.actorUserId, mine: true, internal: false, createdAt: fallbackTicket.createdAt },
        { id: "static-ticket-message-2", ticketId: fallbackTicket.id, body: "تم استلام التذكرة من فريق الدعم وسيتم تحديثك عند المعالجة.", senderUserId: DEMO_ADMIN_USER_ID, mine: false, internal: false, createdAt: fallbackTicket.createdAt },
      ] : [],
    };
  }

  let ticketQuery = supabase
    .from("support_tickets")
    .select("id, ticket_number, title_ar, description_ar, category, status, priority, created_at, updated_at")
    .limit(1);
  ticketQuery = owner.organizationId ? ticketQuery.eq("organization_id", owner.organizationId) : ticketQuery.eq("requester_user_id", owner.userId);
  if (ticketId) {
    ticketQuery = isUuid(ticketId) ? ticketQuery.eq("id", ticketId) : ticketQuery.eq("ticket_number", ticketId);
  } else {
    ticketQuery = ticketQuery.order("created_at", { ascending: false });
  }

  const { data: ticketData, error: ticketError } = await ticketQuery.maybeSingle();
  if (ticketError) return { source: "supabase", ticket: null, messages: [], error: ticketError.message };
  if (!ticketData) return { source: "supabase", ticket: null, messages: [] };

  const ticket: DashboardSupportTicket = {
    id: ticketData.id as string,
    ticketNumber: ticketData.ticket_number as string,
    title: ticketData.title_ar as string,
    description: ticketData.description_ar as string,
    category: ticketData.category as string,
    status: ticketData.status as string,
    priority: ticketData.priority as string,
    createdAt: ticketData.created_at as string,
    updatedAt: ticketData.updated_at as string | null,
  };

  const { data: messagesData, error: messagesError } = await supabase
    .from("support_ticket_messages")
    .select("id, ticket_id, sender_user_id, body_ar, internal, created_at")
    .eq("ticket_id", ticket.id)
    .eq("internal", false)
    .order("created_at", { ascending: true })
    .limit(80);

  if (messagesError) return { source: "supabase", ticket, messages: [], error: messagesError.message };

  return {
    source: "supabase",
    ticket,
    messages: (messagesData ?? []).map((message) => ({
      id: message.id as string,
      ticketId: message.ticket_id as string,
      body: message.body_ar as string,
      senderUserId: message.sender_user_id as string | null,
      mine: message.sender_user_id === owner.actorUserId,
      internal: Boolean(message.internal),
      createdAt: message.created_at as string,
    })),
  };
}

export async function createDashboardSupportTicket(input: {
  scope?: DashboardEntityRequestScope;
  category: string;
  title: string;
  description: string;
  priority?: string;
  clientReference?: string;
  actor?: DashboardActorContext | null;
}): Promise<PersistResult & { reference: string; message?: string }> {
  const supabase = getSupabaseAdmin();
  const owner = dashboardCommunicationOwner(input.scope, input.actor);
  const reference = `TK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`;
  const category = input.category.trim();
  const title = input.title.trim();
  const description = input.description.trim();
  const priority = normalizeSupportPriority(input.priority);
  if (category.length < 2 || category.length > 80 || title.length < 4 || title.length > 180 || description.length < 10 || description.length > 3000) {
    return { ok: true, persisted: false, reference, message: "support_payload_invalid" };
  }
  if (!priority) return { ok: true, persisted: false, reference, message: "support_priority_invalid" };
  if (!supabase) return { ok: true, persisted: false, reference, message: "supabase_not_configured" };

  const { data, error } = await supabase
    .from("support_tickets")
    .insert({
      ticket_number: reference,
      requester_user_id: owner.userId,
      organization_id: owner.organizationId,
      category,
      title_ar: title,
      description_ar: description,
      status: "submitted",
      priority,
      metadata: {
        scope: input.scope ?? "individual",
        clientReference: input.clientReference ?? null,
      },
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  const ticketId = data?.id as string | undefined;
  if (!ticketId) return { ok: true, persisted: false, reference, message: "support_ticket_not_created" };

  if (input.clientReference) {
    const documentUpdate = supabase
      .from("documents")
      .update({
        entity_id: ticketId,
        entity_type: "support_ticket",
        entity_ref: reference,
      })
      .eq("entity_type", "support_ticket_attachment")
      .eq("entity_ref", input.clientReference);
    const scopedDocumentUpdate = owner.organizationId
      ? documentUpdate.eq("organization_id", owner.organizationId)
      : documentUpdate.eq("owner_user_id", owner.userId);
    const { error: documentsError } = await scopedDocumentUpdate;
    if (documentsError) throw new Error(documentsError.message);
  }

  const { error: messageError } = await supabase.from("support_ticket_messages").insert({
    ticket_id: ticketId,
    sender_user_id: owner.actorUserId,
    body_ar: description,
    internal: false,
  });
  if (messageError) throw new Error(messageError.message);

  await insertRequiredAuditLog(supabase, {
    actor_user_id: owner.actorUserId,
    organization_id: owner.organizationId,
    action: "support_ticket_created",
    entity_type: "support_ticket",
    entity_id: ticketId,
    metadata: {
      reference,
      scope: input.scope ?? "individual",
      category,
      clientReference: input.clientReference ?? null,
    },
  });

  await insertDashboardAdminNotifications(supabase, {
    title: `تذكرة دعم جديدة من ${owner.customerLabel}`,
    body: `${reference}: ${title}`,
    category: "support",
    actionUrl: "/dashboard/admin/support",
    metadata: { ticketId, reference, scope: input.scope ?? "individual", organizationId: owner.organizationId, clientReference: input.clientReference ?? null },
  });

  return { ok: true, persisted: true, id: ticketId, reference };
}

export async function updateDashboardSupportTicket(input: {
  scope?: DashboardEntityRequestScope;
  ticketId: string;
  status?: string;
  message?: string;
  actor?: DashboardActorContext | null;
}): Promise<PersistResult & { status?: string; messageCreated?: boolean; message?: string }> {
  const supabase = getSupabaseAdmin();
  const owner = dashboardCommunicationOwner(input.scope, input.actor);
  const status = normalizeDashboardRequestStatus(input.status);
  const reply = input.message?.trim();
  if (input.status && !status) {
    return { ok: true, persisted: false, id: input.ticketId, messageCreated: Boolean(reply), message: "support_status_invalid" };
  }
  if (status && !["submitted", "completed", "cancelled"].includes(status)) {
    return { ok: true, persisted: false, id: input.ticketId, messageCreated: Boolean(reply), message: "support_status_invalid" };
  }
  if (reply && (reply.length < 2 || reply.length > 1200)) {
    return { ok: true, persisted: false, id: input.ticketId, status: status ?? undefined, messageCreated: false, message: "support_message_invalid" };
  }
  if (!supabase) {
    return { ok: true, persisted: false, id: input.ticketId, status: status ?? undefined, messageCreated: Boolean(reply), message: "supabase_not_configured" };
  }

  let ticketQuery = supabase
    .from("support_tickets")
    .select("id, ticket_number, title_ar")
    .limit(1);
  ticketQuery = owner.organizationId ? ticketQuery.eq("organization_id", owner.organizationId) : ticketQuery.eq("requester_user_id", owner.userId);
  ticketQuery = isUuid(input.ticketId) ? ticketQuery.eq("id", input.ticketId) : ticketQuery.eq("ticket_number", input.ticketId);
  const { data: ticket, error: ticketError } = await ticketQuery.maybeSingle();
  if (ticketError) throw new Error(ticketError.message);
  if (!ticket?.id) return { ok: true, persisted: false, id: input.ticketId, status: status ?? undefined, messageCreated: Boolean(reply), message: "ticket_not_found" };

  if (status) {
    const { error } = await supabase
      .from("support_tickets")
      .update({ status })
      .eq("id", ticket.id);
    if (error) throw new Error(error.message);
  }

  if (reply) {
    const { error } = await supabase
      .from("support_ticket_messages")
      .insert({
        ticket_id: ticket.id,
        sender_user_id: owner.actorUserId,
        body_ar: reply,
        internal: false,
      });
    if (error) throw new Error(error.message);
  }

  await insertRequiredAuditLog(supabase, {
    actor_user_id: owner.actorUserId,
    organization_id: owner.organizationId,
    action: "support_ticket_updated",
    entity_type: "support_ticket",
    entity_id: ticket.id as string,
    metadata: {
      scope: input.scope ?? "individual",
      status: status ?? null,
      messageCreated: Boolean(reply),
      ticketNumber: ticket.ticket_number,
    },
  });

  await insertDashboardAdminNotifications(supabase, {
    title: status ? "تم تحديث حالة تذكرة دعم" : "رد جديد على تذكرة دعم",
    body: `${ticket.ticket_number}: ${ticket.title_ar}`,
    category: "support",
    actionUrl: "/dashboard/admin/support",
    metadata: {
      ticketId: ticket.id,
      status: status ?? null,
      scope: input.scope ?? "individual",
      organizationId: owner.organizationId,
    },
  });

  return { ok: true, persisted: true, id: ticket.id as string, status: status ?? undefined, messageCreated: Boolean(reply) };
}

function adminSupportOwnerLabel(row: { requester_user_id?: string | null; organization_id?: string | null }, lookup: FinancialOwnerLookup = emptyOwnerLookup()) {
  if (row.organization_id && lookup.organizations.has(row.organization_id)) return lookup.organizations.get(row.organization_id)!;
  if (row.requester_user_id && lookup.users.has(row.requester_user_id)) return lookup.users.get(row.requester_user_id)!;
  if (row.organization_id === DEMO_BUSINESS_ORG_ID) return "شركة الازدهار العقارية";
  if (row.requester_user_id === DEMO_INDIVIDUAL_USER_ID) return "أحمد عبدالله";
  if (row.organization_id) return "منشأة عقارية";
  if (row.requester_user_id) return "مستخدم فردي";
  return "زائر المنصة";
}

function mapSupportTicketRow(item: Record<string, unknown>, lookup: FinancialOwnerLookup = emptyOwnerLookup()): DashboardSupportTicket {
  const requesterUserId = item.requester_user_id as string | null | undefined;
  const organizationId = item.organization_id as string | null | undefined;
  return {
    id: item.id as string,
    ticketNumber: item.ticket_number as string,
    title: item.title_ar as string,
    description: item.description_ar as string | undefined,
    category: item.category as string,
    status: item.status as string,
    priority: item.priority as string,
    createdAt: item.created_at as string,
    updatedAt: item.updated_at as string | null | undefined,
    requesterUserId,
    organizationId,
    ownerLabel: adminSupportOwnerLabel({ requester_user_id: requesterUserId, organization_id: organizationId }, lookup),
  };
}

export async function listDashboardAdminSupportTickets(): Promise<{ data: DashboardSupportTicket[]; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      source: "static",
      data: [
        { id: "static-admin-ticket-1", ticketNumber: "TK-2025-00125", title: "استفسار عن طلب خدمة عقارية", description: "متابعة حالة طلب خدمة عقارية من حساب فردي.", category: "خدمات عقارية", status: "submitted", priority: "normal", createdAt: "2025/06/03", requesterUserId: DEMO_INDIVIDUAL_USER_ID, organizationId: null, ownerLabel: "أحمد عبدالله" },
        { id: "static-admin-ticket-2", ticketNumber: "TK-2025-00118", title: "استفسار منشأة عن التوثيق", description: "حساب أعمال يحتاج تحديث حالة التوثيق.", category: "التوثيق", status: "in_progress", priority: "high", createdAt: "2025/06/02", requesterUserId: null, organizationId: DEMO_BUSINESS_ORG_ID, ownerLabel: "شركة الازدهار العقارية" },
      ],
    };
  }

  const { data, error } = await supabase
    .from("support_tickets")
    .select("id, ticket_number, requester_user_id, organization_id, title_ar, description_ar, category, status, priority, created_at, updated_at")
    .order("updated_at", { ascending: false })
    .limit(80);
  if (error || !data) return { source: "supabase", data: [], error: error?.message };

  const lookup = await loadFinancialOwnerLookup(data.map((item) => ({ user_id: item.requester_user_id, organization_id: item.organization_id })));
  return { source: "supabase", data: data.map((item) => mapSupportTicketRow(item, lookup)) };
}

export async function getDashboardAdminSupportTicket(ticketId?: string, actor?: DashboardActorContext | null): Promise<{ ticket: DashboardSupportTicket | null; messages: DashboardSupportTicketMessage[]; source: "supabase" | "static"; error?: string }> {
  const list = await listDashboardAdminSupportTickets();
  const fallbackTicket = ticketId ? list.data.find((ticket) => ticket.id === ticketId || ticket.ticketNumber === ticketId) : list.data[0];
  const supabase = getSupabaseAdmin();
  const adminUserId = actor?.userId ?? DEMO_ADMIN_USER_ID;
  if (!supabase) {
    return {
      source: "static",
      ticket: fallbackTicket ?? null,
      messages: fallbackTicket ? [
        { id: "static-admin-ticket-message-1", ticketId: fallbackTicket.id, body: fallbackTicket.description ?? "تم إنشاء التذكرة.", senderUserId: fallbackTicket.requesterUserId ?? null, mine: false, internal: false, createdAt: fallbackTicket.createdAt },
        { id: "static-admin-ticket-message-2", ticketId: fallbackTicket.id, body: "تم استلام التذكرة من فريق الدعم.", senderUserId: adminUserId, mine: true, internal: false, createdAt: fallbackTicket.updatedAt ?? fallbackTicket.createdAt },
      ] : [],
    };
  }

  let ticketQuery = supabase
    .from("support_tickets")
    .select("id, ticket_number, requester_user_id, organization_id, title_ar, description_ar, category, status, priority, created_at, updated_at")
    .limit(1);
  if (ticketId) {
    ticketQuery = isUuid(ticketId) ? ticketQuery.eq("id", ticketId) : ticketQuery.eq("ticket_number", ticketId);
  } else {
    ticketQuery = ticketQuery.order("updated_at", { ascending: false });
  }

  const { data: ticketData, error: ticketError } = await ticketQuery.maybeSingle();
  if (ticketError) return { source: "supabase", ticket: null, messages: [], error: ticketError.message };
  if (!ticketData) return { source: "supabase", ticket: null, messages: [] };
  const lookup = await loadFinancialOwnerLookup([{ user_id: ticketData.requester_user_id, organization_id: ticketData.organization_id }]);
  const ticket = mapSupportTicketRow(ticketData, lookup);

  const { data: messagesData, error: messagesError } = await supabase
    .from("support_ticket_messages")
    .select("id, ticket_id, sender_user_id, body_ar, internal, created_at")
    .eq("ticket_id", ticket.id)
    .order("created_at", { ascending: true })
    .limit(100);
  if (messagesError) return { source: "supabase", ticket, messages: [], error: messagesError.message };

  return {
    source: "supabase",
    ticket,
    messages: (messagesData ?? []).map((message) => ({
      id: message.id as string,
      ticketId: message.ticket_id as string,
      body: message.body_ar as string,
      senderUserId: message.sender_user_id as string | null,
      mine: message.sender_user_id === adminUserId,
      internal: Boolean(message.internal),
      createdAt: message.created_at as string,
    })),
  };
}

export async function updateDashboardAdminSupportTicket(input: {
  ticketId: string;
  status?: string;
  message?: string;
  internal?: boolean;
  actor?: DashboardActorContext | null;
}): Promise<PersistResult & { status?: string; messageCreated?: boolean; message?: string }> {
  const supabase = getSupabaseAdmin();
  const status = normalizeDashboardRequestStatus(input.status);
  const reply = input.message?.trim();
  const adminUserId = input.actor?.userId ?? DEMO_ADMIN_USER_ID;
  if (input.status && !status) {
    return { ok: true, persisted: false, id: input.ticketId, messageCreated: Boolean(reply), message: "support_status_invalid" };
  }
  if (reply && (reply.length < 2 || reply.length > 1200)) {
    return { ok: true, persisted: false, id: input.ticketId, status: status ?? undefined, messageCreated: false, message: "support_message_invalid" };
  }
  if (!supabase) return { ok: true, persisted: false, id: input.ticketId, status: status ?? undefined, messageCreated: Boolean(reply), message: "supabase_not_configured" };

  let ticketQuery = supabase
    .from("support_tickets")
    .select("id, ticket_number, title_ar, requester_user_id, organization_id")
    .limit(1);
  ticketQuery = isUuid(input.ticketId) ? ticketQuery.eq("id", input.ticketId) : ticketQuery.eq("ticket_number", input.ticketId);
  const { data: ticket, error: ticketError } = await ticketQuery.maybeSingle();
  if (ticketError) throw new Error(ticketError.message);
  if (!ticket?.id) return { ok: true, persisted: false, id: input.ticketId, status: status ?? undefined, messageCreated: Boolean(reply), message: "ticket_not_found" };

  if (status) {
    const { error } = await supabase.from("support_tickets").update({ status }).eq("id", ticket.id);
    if (error) throw new Error(error.message);
  }

  if (reply) {
    const { error } = await supabase.from("support_ticket_messages").insert({
      ticket_id: ticket.id,
      sender_user_id: adminUserId,
      body_ar: reply,
      internal: Boolean(input.internal),
    });
    if (error) throw new Error(error.message);
  }

  await insertRequiredAuditLog(supabase, {
    actor_user_id: adminUserId,
    organization_id: ticket.organization_id as string | null,
    action: "admin_support_ticket_updated",
    entity_type: "support_ticket",
    entity_id: ticket.id as string,
    metadata: {
      status: status ?? null,
      messageCreated: Boolean(reply),
      internal: Boolean(input.internal),
      ticketNumber: ticket.ticket_number,
    },
  });

  if (status || (reply && !input.internal)) {
    await insertRequiredNotification(supabase, {
      user_id: (ticket.requester_user_id as string | null) ?? null,
      organization_id: (ticket.organization_id as string | null) ?? null,
      title_ar: status ? "تم تحديث حالة تذكرتك" : "رد جديد من الدعم الفني",
      body_ar: `${ticket.ticket_number}: ${ticket.title_ar}`,
      category: "support",
      action_url: ticket.organization_id ? "/dashboard/business/support" : "/dashboard/individual/support",
      metadata: {
        ticketId: ticket.id,
        status: status ?? null,
        messageCreated: Boolean(reply),
        internal: Boolean(input.internal),
      },
    });
  }

  return { ok: true, persisted: true, id: ticket.id as string, status: status ?? undefined, messageCreated: Boolean(reply) };
}

function financialIdentity(scope: DashboardFinancialScope, actor?: DashboardActorContext | null) {
  if (scope === "business") return { userId: null, organizationId: actor?.organizationId ?? DEMO_BUSINESS_ORG_ID };
  if (scope === "admin") return { userId: actor?.userId ?? DEMO_ADMIN_USER_ID, organizationId: null };
  return { userId: actor?.userId ?? DEMO_INDIVIDUAL_USER_ID, organizationId: null };
}

function emptyOwnerLookup(): FinancialOwnerLookup {
  return { users: new Map(), organizations: new Map() };
}

function financialOwner(row: { user_id?: string | null; organization_id?: string | null }, lookup: FinancialOwnerLookup) {
  if (row.organization_id) {
    return {
      customer: lookup.organizations.get(row.organization_id) ?? "منشأة عقارية",
      customerType: "business" as const,
    };
  }

  if (row.user_id) {
    return {
      customer: lookup.users.get(row.user_id) ?? "مستخدم فردي",
      customerType: "individual" as const,
    };
  }

  return {
    customer: "منصة مهابة",
    customerType: "platform" as const,
  };
}

function invoiceStatusMeta(status: DashboardInvoiceStatus): Pick<DashboardInvoice, "statusLabel" | "tone"> {
  if (status === "paid") return { statusLabel: "مدفوعة", tone: "green" };
  if (status === "overdue") return { statusLabel: "متأخرة", tone: "red" };
  if (status === "cancelled") return { statusLabel: "ملغاة", tone: "red" };
  if (status === "draft") return { statusLabel: "مسودة", tone: "blue" };
  return { statusLabel: "بانتظار الدفع", tone: "gold" };
}

function paymentStatusMeta(status: DashboardPaymentStatus): Pick<DashboardPayment, "statusLabel" | "tone"> {
  if (status === "succeeded") return { statusLabel: "ناجحة", tone: "green" };
  if (status === "failed") return { statusLabel: "فاشلة", tone: "red" };
  if (status === "refunded") return { statusLabel: "مستردة", tone: "blue" };
  return { statusLabel: "بانتظار الدفع", tone: "gold" };
}

function subscriptionStatusLabel(status: string) {
  if (status === "active") return "نشط";
  if (status === "cancelled") return "ملغي";
  if (status === "expired") return "منتهي";
  if (status === "pending") return "بانتظار التفعيل";
  return status || "غير محدد";
}

function daysRemaining(value: string | null | undefined) {
  if (!value) return 0;
  const end = new Date(`${value}T00:00:00`);
  if (Number.isNaN(end.getTime())) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((end.getTime() - today.getTime()) / 86_400_000));
}

function mapInvoice(row: FinancialInvoiceRow, lookup: FinancialOwnerLookup = emptyOwnerLookup()): DashboardInvoice {
  const meta = invoiceStatusMeta(row.status);
  const owner = financialOwner(row, lookup);
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    ...owner,
    title: row.title_ar,
    amount: toNumber(row.amount_sar),
    status: row.status,
    dueDate: row.due_date ?? "",
    issuedAt: row.created_at,
    paidAt: row.paid_at,
    ...meta,
  };
}

function mapSubscription(row: FinancialSubscriptionRow, lookup: FinancialOwnerLookup = emptyOwnerLookup()): DashboardSubscription {
  const owner = financialOwner(row, lookup);
  return {
    id: row.id,
    ...owner,
    planName: row.plan_name_ar,
    status: row.status,
    statusLabel: subscriptionStatusLabel(row.status),
    startsAt: row.starts_at,
    endsAt: row.ends_at ?? "",
    amount: toNumber(row.amount_sar),
    daysRemaining: daysRemaining(row.ends_at),
  };
}

function mapPayment(row: FinancialPaymentRow, invoiceById: Map<string, DashboardInvoice>, lookup: FinancialOwnerLookup = emptyOwnerLookup()): DashboardPayment {
  const invoice = row.invoice_id ? invoiceById.get(row.invoice_id) : undefined;
  const meta = paymentStatusMeta(row.status);
  const owner = invoice ? { customer: invoice.customer, customerType: invoice.customerType } : financialOwner(row, lookup);
  return {
    id: row.id,
    invoiceId: row.invoice_id,
    invoiceNumber: invoice?.invoiceNumber,
    ...owner,
    title: invoice?.title ?? "عملية دفع",
    amount: toNumber(row.amount_sar),
    method: row.method,
    status: row.status,
    providerReference: row.provider_reference,
    paidAt: row.paid_at,
    createdAt: row.created_at,
    ...meta,
  };
}

function buildFinancialSummary(invoices: DashboardInvoice[], subscriptions: DashboardSubscription[], payments: DashboardPayment[]): DashboardFinancialData["summary"] {
  const paidInvoices = invoices.filter((invoice) => invoice.status === "paid").length;
  const pendingInvoices = invoices.filter((invoice) => invoice.status === "due" || invoice.status === "draft").length;
  const overdueInvoices = invoices.filter((invoice) => invoice.status === "overdue").length;
  const totalPaid = payments
    .filter((payment) => payment.status === "succeeded")
    .reduce((total, payment) => total + payment.amount, 0);
  const outstanding = invoices
    .filter((invoice) => invoice.status === "due" || invoice.status === "overdue")
    .reduce((total, invoice) => total + invoice.amount, 0);
  const activeSubscription = subscriptions.find((subscription) => subscription.status === "active") ?? subscriptions[0];
  const nextInvoiceAmount = invoices.find((invoice) => invoice.status === "due" || invoice.status === "overdue")?.amount ?? activeSubscription?.amount ?? 0;
  const paymentMethods = Array.from(new Set(payments.map((payment) => payment.method))).filter(Boolean);

  return {
    totalInvoices: invoices.length,
    paidInvoices,
    pendingInvoices,
    overdueInvoices,
    totalPaid,
    outstanding,
    nextInvoiceAmount,
    activePlan: activeSubscription?.planName ?? "لا يوجد اشتراك",
    subscriptionStatus: activeSubscription?.statusLabel ?? "غير مفعل",
    subscriptionDaysRemaining: activeSubscription?.daysRemaining ?? 0,
    paymentMethods: paymentMethods.length ? paymentMethods : ["mada", "visa", "apple_pay"],
  };
}

function staticFinancialData(scope: DashboardFinancialScope): DashboardFinancialData {
  if (scope === "admin") {
    const individual = staticFinancialData("individual");
    const business = staticFinancialData("business");
    const invoices = [...individual.invoices, ...business.invoices];
    const subscriptions = [...individual.subscriptions, ...business.subscriptions];
    const payments = [...individual.payments, ...business.payments];
    return {
      invoices,
      subscriptions,
      payments,
      summary: buildFinancialSummary(invoices, subscriptions, payments),
      source: "static",
    };
  }

  const business = scope === "business";
  const ownerLookup: FinancialOwnerLookup = {
    users: new Map([[DEMO_INDIVIDUAL_USER_ID, "أحمد عبدالله"]]),
    organizations: new Map([[DEMO_BUSINESS_ORG_ID, "شركة الازدهار العقارية"]]),
  };
  const userId = business ? null : DEMO_INDIVIDUAL_USER_ID;
  const organizationId = business ? DEMO_BUSINESS_ORG_ID : null;
  const invoiceRows: FinancialInvoiceRow[] = [
    { id: business ? "b0000000-0000-4000-8000-000000000002" : "b0000000-0000-4000-8000-000000000001", invoice_number: business ? "INV-2026-00104" : "INV-2026-00035", user_id: userId, organization_id: organizationId, title_ar: business ? "فاتورة الباقة الاحترافية" : "فاتورة الباقة الأساسية", amount_sar: business ? 5000 : 500, status: business ? "due" : "paid", due_date: "2026-06-30", created_at: "2026-06-01T09:00:00Z", paid_at: business ? null : "2026-06-01T10:00:00Z" },
    { id: business ? "b0000000-0000-4000-8000-000000000005" : "b0000000-0000-4000-8000-000000000003", invoice_number: business ? "INV-2026-00103" : "INV-2026-00034", user_id: userId, organization_id: organizationId, title_ar: business ? "طلب تقييم أصل تجاري" : "دراسة جدوى تفصيلية", amount_sar: business ? 1500 : 2875, status: "paid", due_date: "2026-06-10", created_at: "2026-06-08T09:00:00Z", paid_at: "2026-06-10T11:00:00Z" },
    { id: business ? "b0000000-0000-4000-8000-000000000006" : "b0000000-0000-4000-8000-000000000004", invoice_number: business ? "INV-2026-00102" : "INV-2026-00033", user_id: userId, organization_id: organizationId, title_ar: business ? "رسوم طرح مساهمة" : "تقييم عقاري", amount_sar: business ? 2500 : 1500, status: "paid", due_date: "2026-05-28", created_at: "2026-05-20T09:00:00Z", paid_at: "2026-05-28T11:00:00Z" },
  ];
  const invoices = invoiceRows.map((invoice) => mapInvoice(invoice, ownerLookup));
  const subscriptionRows: FinancialSubscriptionRow[] = [
    { id: business ? "a0000000-0000-4000-8000-000000000002" : "a0000000-0000-4000-8000-000000000001", user_id: userId, organization_id: organizationId, plan_name_ar: business ? "الباقة الاحترافية" : "الباقة الأساسية", status: "active", starts_at: "2026-01-01", ends_at: "2026-12-31", amount_sar: business ? 5000 : 500 },
  ];
  const subscriptions = subscriptionRows.map((subscription) => mapSubscription(subscription, ownerLookup));
  const invoiceById = new Map(invoices.map((invoice) => [invoice.id, invoice]));
  const payments = [
    { id: business ? "PAY-DEMO-BIZ-001" : "PAY-DEMO-IND-001", invoice_id: invoices[1]?.id ?? null, user_id: userId, organization_id: organizationId, amount_sar: invoices[1]?.amount ?? 0, method: "mada", status: "succeeded" as DashboardPaymentStatus, provider_reference: business ? "PAY-DEMO-ORG-001" : "PAY-DEMO-001", paid_at: "2026-06-10T11:00:00Z", created_at: "2026-06-10T11:00:00Z" },
    { id: business ? "PAY-DEMO-BIZ-002" : "PAY-DEMO-IND-002", invoice_id: invoices[2]?.id ?? null, user_id: userId, organization_id: organizationId, amount_sar: invoices[2]?.amount ?? 0, method: "visa", status: "succeeded" as DashboardPaymentStatus, provider_reference: business ? "PAY-DEMO-ORG-002" : "PAY-DEMO-002", paid_at: "2026-05-28T11:00:00Z", created_at: "2026-05-28T11:00:00Z" },
  ].map((payment) => mapPayment(payment, invoiceById, ownerLookup));

  return {
    invoices,
    subscriptions,
    payments,
    summary: buildFinancialSummary(invoices, subscriptions, payments),
    source: "static",
  };
}

function emptySupabaseFinancialData(error?: string): DashboardFinancialData {
  const invoices: DashboardInvoice[] = [];
  const subscriptions: DashboardSubscription[] = [];
  const payments: DashboardPayment[] = [];
  return {
    invoices,
    subscriptions,
    payments,
    summary: buildFinancialSummary(invoices, subscriptions, payments),
    source: "supabase",
    error,
  };
}

async function loadFinancialOwnerLookup(rows: Array<{ user_id?: string | null; organization_id?: string | null }>): Promise<FinancialOwnerLookup> {
  const supabase = getSupabaseAdmin();
  const userIds = Array.from(new Set(rows.map((row) => row.user_id).filter((id): id is string => Boolean(id))));
  const organizationIds = Array.from(new Set(rows.map((row) => row.organization_id).filter((id): id is string => Boolean(id))));
  const lookup = emptyOwnerLookup();
  if (!supabase || (!userIds.length && !organizationIds.length)) return lookup;

  const [profilesResult, organizationsResult] = await Promise.all([
    userIds.length ? supabase.from("profiles").select("id, full_name").in("id", userIds) : Promise.resolve({ data: [], error: null }),
    organizationIds.length ? supabase.from("organizations").select("id, name_ar").in("id", organizationIds) : Promise.resolve({ data: [], error: null }),
  ]);

  if (!profilesResult.error) {
    for (const profile of profilesResult.data ?? []) {
      const row = profile as { id?: string; full_name?: string };
      if (row.id && row.full_name) lookup.users.set(row.id, row.full_name);
    }
  }

  if (!organizationsResult.error) {
    for (const organization of organizationsResult.data ?? []) {
      const row = organization as { id?: string; name_ar?: string };
      if (row.id && row.name_ar) lookup.organizations.set(row.id, row.name_ar);
    }
  }

  return lookup;
}

export async function listDashboardFinancial(scope: DashboardFinancialScope = "individual", actor?: DashboardActorContext | null): Promise<DashboardFinancialData> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return staticFinancialData(scope);

  const { userId, organizationId } = financialIdentity(scope, actor);
  const ownerFilter = organizationId ? { column: "organization_id", value: organizationId } : { column: "user_id", value: userId };

  const invoiceQuery = supabase
    .from("invoices")
    .select("id, invoice_number, user_id, organization_id, title_ar, amount_sar, status, due_date, paid_at, created_at")
    .order("created_at", { ascending: false });
  const subscriptionQuery = supabase
    .from("subscriptions")
    .select("id, user_id, organization_id, plan_name_ar, status, starts_at, ends_at, amount_sar")
    .order("created_at", { ascending: false });
  const paymentQuery = supabase
    .from("payments")
    .select("id, invoice_id, user_id, organization_id, amount_sar, method, status, provider_reference, paid_at, created_at")
    .order("created_at", { ascending: false });

  if (scope !== "admin") {
    invoiceQuery.eq(ownerFilter.column, ownerFilter.value);
    subscriptionQuery.eq(ownerFilter.column, ownerFilter.value);
    paymentQuery.eq(ownerFilter.column, ownerFilter.value);
  }

  const [invoiceResult, subscriptionResult, paymentResult] = await Promise.all([invoiceQuery, subscriptionQuery, paymentQuery]);
  if (invoiceResult.error || subscriptionResult.error || paymentResult.error) {
    return emptySupabaseFinancialData(invoiceResult.error?.message || subscriptionResult.error?.message || paymentResult.error?.message);
  }

  const invoiceRows = (invoiceResult.data ?? []) as unknown as FinancialInvoiceRow[];
  const subscriptionRows = (subscriptionResult.data ?? []) as unknown as FinancialSubscriptionRow[];
  const paymentRows = (paymentResult.data ?? []) as unknown as FinancialPaymentRow[];
  const ownerLookup = await loadFinancialOwnerLookup([...invoiceRows, ...subscriptionRows, ...paymentRows]);

  const invoices = invoiceRows.map((invoice) => mapInvoice(invoice, ownerLookup));
  const subscriptions = subscriptionRows.map((subscription) => mapSubscription(subscription, ownerLookup));
  const invoiceById = new Map(invoices.map((invoice) => [invoice.id, invoice]));
  const payments = paymentRows.map((payment) => mapPayment(payment, invoiceById, ownerLookup));

  return {
    invoices,
    subscriptions,
    payments,
    summary: buildFinancialSummary(invoices, subscriptions, payments),
    source: "supabase",
  };
}

export async function payDashboardInvoice(input: {
  scope?: DashboardFinancialScope;
  invoiceId?: string;
  invoiceNumber?: string;
  method?: string;
  actor?: DashboardActorContext | null;
}): Promise<PersistResult & { status: DashboardInvoiceStatus; invoiceNumber?: string; paymentReference?: string; message?: string }> {
  const scope = input.scope ?? "individual";
  const method = input.method || "mada";
  const supabase = getSupabaseAdmin();
  if (scope === "admin") {
    return { ok: true, persisted: false, status: "due", invoiceNumber: input.invoiceNumber, message: "admin_financial_mutation_not_allowed" };
  }
  if (!supabase) {
    return { ok: true, persisted: false, status: "paid", invoiceNumber: input.invoiceNumber, paymentReference: `PAY-DEMO-${Date.now()}`, message: "supabase_not_configured" };
  }

  const { userId, organizationId } = financialIdentity(scope, input.actor);
  const ownerFilter = organizationId ? { column: "organization_id", value: organizationId } : { column: "user_id", value: userId };
  let query = supabase
    .from("invoices")
    .select("id, invoice_number, title_ar, amount_sar, status, user_id, organization_id")
    .limit(1);

  query = query.eq(ownerFilter.column, ownerFilter.value);

  if (isUuid(input.invoiceId)) {
    query = query.eq("id", input.invoiceId);
  } else if (input.invoiceNumber) {
    query = query.eq("invoice_number", input.invoiceNumber);
  } else {
    return { ok: true, persisted: false, status: "due", message: "invoice_identifier_missing" };
  }

  const { data: invoice, error: invoiceError } = await query.maybeSingle();
  if (invoiceError || !invoice) {
    return { ok: true, persisted: false, status: "due", invoiceNumber: input.invoiceNumber, message: "invoice_not_found" };
  }

  const invoiceRecord = invoice as unknown as {
    id: string;
    invoice_number: string;
    title_ar: string;
    amount_sar: number | string;
    status: DashboardInvoiceStatus;
    user_id: string | null;
    organization_id: string | null;
  };

  if (invoiceRecord.status === "paid") {
    const { data: existingPayment, error: existingPaymentError } = await supabase
      .from("payments")
      .select("id, provider_reference")
      .eq("invoice_id", invoiceRecord.id)
      .eq("status", "succeeded")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (existingPaymentError) throw existingPaymentError;

    const existing = existingPayment as { id?: string; provider_reference?: string | null } | null;
    return {
      ok: true,
      persisted: true,
      id: existing?.id,
      status: "paid",
      invoiceNumber: invoiceRecord.invoice_number,
      paymentReference: existing?.provider_reference ?? undefined,
      message: "invoice_already_paid",
    };
  }

  if (!["due", "overdue"].includes(invoiceRecord.status)) {
    return {
      ok: true,
      persisted: false,
      status: invoiceRecord.status,
      invoiceNumber: invoiceRecord.invoice_number,
      message: "invoice_not_payable",
    };
  }

  const { data: paymentResult, error: paymentError } = await supabase
    .rpc("pay_dashboard_invoice", {
      p_invoice_id: invoiceRecord.id,
      p_invoice_number: invoiceRecord.invoice_number,
      p_owner_user_id: organizationId ? null : userId,
      p_organization_id: organizationId,
      p_method: method,
      p_actor_user_id: input.actor?.userId ?? userId,
      p_scope: scope,
    })
    .maybeSingle();
  if (paymentError) throw paymentError;
  if (!paymentResult) {
    return { ok: true, persisted: false, status: "due", invoiceNumber: invoiceRecord.invoice_number, message: "invoice_not_found" };
  }

  const paidInvoice = paymentResult as {
    payment_id?: string | null;
    invoice_number?: string | null;
    payment_reference?: string | null;
  };
  if (!paidInvoice.payment_id) {
    return { ok: true, persisted: false, status: "due", invoiceNumber: invoiceRecord.invoice_number, message: "payment_not_created" };
  }

  return {
    ok: true,
    persisted: true,
    id: paidInvoice.payment_id,
    status: "paid",
    invoiceNumber: paidInvoice.invoice_number ?? invoiceRecord.invoice_number,
    paymentReference: paidInvoice.payment_reference ?? undefined,
  };
}

export async function updateDashboardSubscriptionPlan(input: {
  scope?: DashboardFinancialScope;
  planName: string;
  amount?: number;
  actor?: DashboardActorContext | null;
}): Promise<PersistResult & { planName: string; status: string; message?: string }> {
  const scope = input.scope ?? "individual";
  const planName = input.planName.trim();
  const amount = Number.isFinite(input.amount) ? Math.max(0, input.amount ?? 0) : 0;
  const startsAt = new Date();
  const endsAt = new Date(startsAt);
  endsAt.setDate(endsAt.getDate() + 30);

  const supabase = getSupabaseAdmin();
  if (scope === "admin") {
    return { ok: true, persisted: false, planName, status: "active", message: "admin_financial_mutation_not_allowed" };
  }
  if (planName.length < 2 || planName.length > 80 || amount > 1_000_000) {
    return { ok: true, persisted: false, planName, status: "active", message: "subscription_plan_invalid" };
  }
  if (!supabase) {
    return { ok: true, persisted: false, planName, status: "active", message: "supabase_not_configured" };
  }

  const { userId, organizationId } = financialIdentity(scope, input.actor);
  const ownerFilter = organizationId ? { column: "organization_id", value: organizationId } : { column: "user_id", value: userId };

  if (!ownerFilter.value) {
    return { ok: true, persisted: false, planName, status: "active", message: "subscription_owner_missing" };
  }

  const { data: existing, error: findError } = await supabase
    .from("subscriptions")
    .select("id")
    .eq(ownerFilter.column, ownerFilter.value)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (findError) throw findError;

  const payload = {
    plan_name_ar: planName,
    status: "active",
    starts_at: startsAt.toISOString().slice(0, 10),
    ends_at: endsAt.toISOString().slice(0, 10),
    amount_sar: amount,
    updated_at: new Date().toISOString(),
  };

  const persisted = existing as { id?: string } | null;
  const mutation = persisted?.id
    ? supabase.from("subscriptions").update(payload).eq("id", persisted.id).select("id").single()
    : supabase
        .from("subscriptions")
        .insert({
          ...payload,
          user_id: organizationId ? null : userId,
          organization_id: organizationId,
        })
        .select("id")
        .single();

  const { data: subscription, error: mutationError } = await mutation;
  if (mutationError) throw mutationError;
  const subscriptionId = (subscription?.id as string | undefined) ?? persisted?.id ?? null;
  if (!subscriptionId) return { ok: true, persisted: false, planName, status: "active", message: "subscription_not_created" };
  let invoiceCreated = false;
  let cancelledStaleInvoices = 0;
  let cancelledStaleSubscriptions = 0;

  if (subscriptionId) {
    const { data: staleSubscriptions, error: staleSubscriptionLookupError } = await supabase
      .from("subscriptions")
      .select("id")
      .eq(ownerFilter.column, ownerFilter.value)
      .neq("id", subscriptionId)
      .in("status", ["active", "pending"]);
    if (staleSubscriptionLookupError) throw staleSubscriptionLookupError;

    const staleSubscriptionIds = (staleSubscriptions ?? [])
      .map((row) => (row as { id?: string }).id)
      .filter((id): id is string => Boolean(id));
    if (staleSubscriptionIds.length > 0) {
      const { error: staleSubscriptionError } = await supabase
        .from("subscriptions")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .in("id", staleSubscriptionIds);
      if (staleSubscriptionError) throw staleSubscriptionError;
      cancelledStaleSubscriptions = staleSubscriptionIds.length;
    }
  }

  const { data: existingInvoices, error: invoiceLookupError } = await supabase
    .from("invoices")
    .select("id, amount_sar, status, metadata")
    .eq(ownerFilter.column, ownerFilter.value)
    .eq("subscription_id", subscriptionId)
    .in("status", ["draft", "due", "overdue"])
    .order("created_at", { ascending: false })
    .limit(10);
  if (invoiceLookupError) throw invoiceLookupError;

  const matchingInvoice = amount > 0
    ? (existingInvoices ?? []).find((row) => {
        const invoice = row as { amount_sar?: number | string; metadata?: { planName?: unknown } | null };
        return toNumber(invoice.amount_sar) === amount && invoice.metadata?.planName === planName;
      })
    : null;

  const staleInvoices = (existingInvoices ?? [])
    .map((row) => row as { id?: string; metadata?: unknown })
    .filter((row): row is { id: string; metadata?: unknown } => Boolean(row.id && row.id !== (matchingInvoice as { id?: string } | null)?.id));

  if (staleInvoices.length > 0) {
    const cancelledAt = new Date().toISOString();
    const staleInvoiceUpdates = await Promise.all(staleInvoices.map((invoice) => supabase
      .from("invoices")
      .update({
        status: "cancelled",
        metadata: {
          ...jsonRecord(invoice.metadata),
          source: "subscription_plan_selection",
          replacedByPlan: planName,
          cancelledAt,
        },
      })
      .eq("id", invoice.id)));
    const staleInvoiceError = staleInvoiceUpdates.find((result) => result.error)?.error;
    if (staleInvoiceError) throw staleInvoiceError;
    cancelledStaleInvoices = staleInvoices.length;
  }

  if (amount > 0) {
    if (!matchingInvoice) {
      const dueDate = new Date(startsAt);
      dueDate.setDate(dueDate.getDate() + 7);
      const { error: invoiceError } = await supabase.from("invoices").insert({
        invoice_number: `INV-SUB-${Date.now()}`,
        user_id: organizationId ? null : userId,
        organization_id: organizationId,
        subscription_id: subscriptionId,
        title_ar: `اشتراك ${planName}`,
        amount_sar: amount,
        status: "due",
        due_date: dueDate.toISOString().slice(0, 10),
        metadata: { source: "subscription_plan_selection", planName },
      });
      if (invoiceError) throw invoiceError;
      invoiceCreated = true;
    }
  }

  await insertRequiredAuditLog(supabase, {
    actor_user_id: input.actor?.userId ?? userId,
    organization_id: organizationId,
    action: "subscription_plan_updated",
    entity_type: "subscription",
    entity_id: subscriptionId,
    metadata: {
      planName,
      amount,
      scope,
      invoiceCreated,
      cancelledStaleInvoices,
      cancelledStaleSubscriptions,
    },
  });

  await insertRequiredNotification(supabase, {
    user_id: organizationId ? null : userId,
    organization_id: organizationId,
    title_ar: "تم تحديث الاشتراك",
    body_ar: `تم اختيار ${planName} بنجاح.`,
    category: "financial",
    action_url: scope === "business" ? "/dashboard/business/subscriptions" : "/dashboard/individual/subscriptions",
    metadata: { planName, amount, invoiceCreated, cancelledStaleInvoices, cancelledStaleSubscriptions },
  });

  return { ok: true, persisted: true, id: subscriptionId, planName, status: "active" };
}

async function notifyAdminAboutPublicSubmission(
  supabase: SupabaseClient,
  input: {
    title: string;
    body: string;
    category: string;
    actionUrl: string;
    entityId?: string;
    entityType: string;
    metadata?: Record<string, Json>;
  },
) {
  await insertDashboardAdminNotifications(supabase, {
    title: input.title,
    body: input.body,
    category: input.category,
    actionUrl: input.actionUrl,
    metadata: {
      entityId: input.entityId ?? null,
      entityType: input.entityType,
      source: "public",
      ...(input.metadata ?? {}),
    },
  });

  await insertRequiredAuditLog(supabase, {
    actor_user_id: null,
    organization_id: null,
    action: "public_submission_received",
    entity_type: input.entityType,
    entity_id: input.entityId ?? null,
    metadata: {
      title: input.title,
      category: input.category,
      actionUrl: input.actionUrl,
      source: "public",
      ...(input.metadata ?? {}),
    },
  });
}

export async function createAssetSubmission(input: {
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  district?: string;
  assetType: string;
  area: number;
  deedNumber?: string;
  deedDate?: string;
  assetName?: string;
  description: string;
  mapUrl?: string;
  intent?: string;
}): Promise<PersistResult & { status?: "draft" | "submitted" }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: true, persisted: false, message: "supabase_not_configured" };

  const title = input.assetName?.trim() || `${input.assetType} - ${input.city}`;
  const slug = `${slugify(title)}-${Date.now()}`;
  const status = input.intent === "draft" ? "draft" : "submitted";
  const { data, error } = await supabase
    .from("real_estate_assets")
    .insert({
      owner_user_id: null,
      organization_id: null,
      title_ar: title,
      slug,
      city_ar: input.city,
      district_ar: input.district || null,
      asset_type_ar: input.assetType,
      usage_type_ar: input.assetType.includes("تجارية") || input.assetType.includes("تجاري") ? "تجاري" : "سكني",
      area_sqm: input.area,
      deed_number: input.deedNumber || null,
      deed_date: input.deedDate || null,
      status,
      excerpt_ar: input.description,
      metadata: {
        source: "public",
        contact: { fullName: input.fullName, mobile: input.mobile, email: input.email },
        mapUrl: input.mapUrl || null,
      },
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  const assetId = data?.id as string | undefined;
  if (!assetId) return { ok: true, persisted: false, status, message: "asset_not_created" };
  if (status === "submitted") {
    await notifyAdminAboutPublicSubmission(supabase, {
      title: "طلب إضافة أصل جديد",
      body: `${title} من ${input.fullName} جاهز للمراجعة.`,
      category: "asset",
      actionUrl: "/dashboard/admin/assets",
      entityId: assetId,
      entityType: "real_estate_asset",
      metadata: { city: input.city, assetType: input.assetType, mobile: input.mobile, email: input.email },
    });
  } else {
    await insertRequiredAuditLog(supabase, {
      actor_user_id: null,
      organization_id: null,
      action: "public_asset_drafted",
      entity_type: "real_estate_asset",
      entity_id: assetId ?? null,
      metadata: { title, city: input.city, assetType: input.assetType, source: "public" },
    });
  }
  return { ok: true, persisted: true, id: assetId, status };
}

export async function createContributionSubmission(input: {
  fullName?: string;
  mobile?: string;
  email?: string;
  title: string;
  city: string;
  contributionType: string;
  capitalSar: number;
  durationMonths: number;
  description: string;
  offeringUrl?: string;
}): Promise<PersistResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: true, persisted: false, message: "supabase_not_configured" };

  const { data, error } = await supabase
    .from("real_estate_contributions")
    .insert({
      organization_id: null,
      title_ar: input.title,
      slug: `${slugify(input.title)}-${Date.now()}`,
      city_ar: input.city,
      stage_ar: input.contributionType,
      capital_sar: input.capitalSar,
      duration_months: input.durationMonths,
      funded_percent: 0,
      offering_url: input.offeringUrl || null,
      status: "submitted",
      excerpt_ar: input.description,
      metadata: {
        source: "public",
        contact: {
          fullName: input.fullName ?? null,
          mobile: input.mobile ?? null,
          email: input.email ?? null,
        },
      },
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  const contributionId = data?.id as string | undefined;
  if (!contributionId) return { ok: true, persisted: false, message: "contribution_not_created" };
  await notifyAdminAboutPublicSubmission(supabase, {
    title: "طلب مساهمة عقارية جديد",
    body: `${input.title} بقيمة ${input.capitalSar.toLocaleString("ar-SA")} ريال جاهزة للمراجعة.`,
    category: "contribution",
    actionUrl: "/dashboard/admin/contributions",
    entityId: contributionId,
    entityType: "real_estate_contribution",
    metadata: { city: input.city, contributionType: input.contributionType, fullName: input.fullName ?? null, mobile: input.mobile ?? null, email: input.email ?? null },
  });
  return { ok: true, persisted: true, id: contributionId };
}

export async function createServiceRequest(input: {
  title: string;
  mobile: string;
  email: string;
  city: string;
  assetType: string;
  area: number;
  serviceType: string;
  description: string;
  intent?: string;
}): Promise<PersistResult & { status?: "draft" | "submitted" }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: true, persisted: false, message: "supabase_not_configured" };

  const status = input.intent === "draft" ? "draft" : "submitted";
  const { data, error } = await supabase
    .from("service_requests")
    .insert({
      requester_user_id: null,
      organization_id: null,
      service_type_ar: input.serviceType,
      title_ar: input.title,
      description_ar: input.description,
      city_ar: input.city,
      asset_type_ar: input.assetType,
      area_sqm: input.area,
      status,
      metadata: {
        source: "public",
        contact: { mobile: input.mobile, email: input.email },
      },
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  const requestId = data?.id as string | undefined;
  if (!requestId) return { ok: true, persisted: false, status, message: "service_request_not_created" };
  if (status === "submitted") {
    await notifyAdminAboutPublicSubmission(supabase, {
      title: "طلب خدمة عقارية جديد",
      body: `${input.serviceType}: ${input.title}`,
      category: "service",
      actionUrl: "/dashboard/admin/service-requests",
      entityId: requestId,
      entityType: "service_request",
      metadata: { city: input.city, assetType: input.assetType, mobile: input.mobile, email: input.email },
    });
  } else {
    await insertRequiredAuditLog(supabase, {
      actor_user_id: null,
      organization_id: null,
      action: "public_service_request_drafted",
      entity_type: "service_request",
      entity_id: requestId ?? null,
      metadata: { serviceType: input.serviceType, city: input.city, assetType: input.assetType, source: "public" },
    });
  }
  return { ok: true, persisted: true, id: requestId, status };
}

export async function createSupportTicket(input: {
  fullName: string;
  mobile: string;
  email: string;
  description: string;
  category?: string;
}): Promise<PersistResult> {
  const supabase = getSupabaseAdmin();
  const reference = `TK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`;
  if (!supabase) return { ok: true, persisted: false, reference, message: "supabase_not_configured" };

  const { data, error } = await supabase
    .from("support_tickets")
    .insert({
      ticket_number: reference,
      category: input.category ?? "contact",
      title_ar: `رسالة تواصل من ${input.fullName}`,
      description_ar: input.description,
      status: "submitted",
      metadata: {
        contact: { fullName: input.fullName, mobile: input.mobile, email: input.email },
      },
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  const ticketId = data?.id as string | undefined;
  if (!ticketId) return { ok: true, persisted: false, reference, message: "support_ticket_not_created" };
  if (ticketId) {
    const { error: messageError } = await supabase.from("support_ticket_messages").insert({
      ticket_id: ticketId,
      sender_user_id: null,
      body_ar: input.description,
      internal: false,
    });
    if (messageError) throw new Error(messageError.message);
  }
  await notifyAdminAboutPublicSubmission(supabase, {
    title: "رسالة تواصل جديدة",
    body: `${reference}: ${input.fullName}`,
    category: "support",
    actionUrl: "/dashboard/admin/support",
    entityId: ticketId,
    entityType: "support_ticket",
    metadata: { reference, fullName: input.fullName, mobile: input.mobile, email: input.email },
  });
  return { ok: true, persisted: true, id: ticketId, reference };
}

export async function subscribeNewsletter(email: string): Promise<PersistResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: true, persisted: false, message: "supabase_not_configured" };

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email, source: "website" }, { onConflict: "email" })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  const subscriberId = data?.id as string | undefined;
  if (!subscriberId) return { ok: true, persisted: false, message: "newsletter_not_created" };
  await notifyAdminAboutPublicSubmission(supabase, {
    title: "اشتراك جديد في النشرة",
    body: `${email} انضم إلى النشرة البريدية.`,
    category: "newsletter",
    actionUrl: "/dashboard/admin/settings/email",
    entityId: subscriberId,
    entityType: "newsletter_subscriber",
    metadata: { email },
  });
  return { ok: true, persisted: true, id: subscriberId };
}

export async function createContentComment(input: {
  contentSlug: string;
  contentType: "news" | "article";
  authorName: string;
  body: string;
}): Promise<PersistResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: true, persisted: false, message: "supabase_not_configured" };

  const { data, error } = await supabase
    .from("content_comments")
    .insert({
      content_slug: input.contentSlug,
      content_type: input.contentType,
      author_name: input.authorName,
      body_ar: input.body,
      status: "submitted",
      metadata: { source: "content_detail_page" },
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  const commentId = data?.id as string | undefined;
  if (!commentId) return { ok: true, persisted: false, message: "content_comment_not_created" };
  await notifyAdminAboutPublicSubmission(supabase, {
    title: "تعليق محتوى جديد",
    body: `${input.authorName} أضاف تعليقاً بانتظار المراجعة.`,
    category: "content",
    actionUrl: "/dashboard/admin/content",
    entityId: commentId,
    entityType: "content_comment",
    metadata: { contentSlug: input.contentSlug, contentType: input.contentType },
  });
  return { ok: true, persisted: true, id: commentId };
}

export type PublicContentComment = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export async function listApprovedContentComments(input: {
  contentSlug: string;
  contentType: "news" | "article";
}): Promise<{ data: PublicContentComment[]; source: "supabase" | "static"; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { data: [], source: "static", error: "supabase_not_configured" };

  const { data, error } = await supabase
    .from("content_comments")
    .select("id, author_name, body_ar, created_at")
    .eq("content_slug", input.contentSlug)
    .eq("content_type", input.contentType)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return { data: [], source: "supabase", error: error.message };

  return {
    source: "supabase",
    data: (data ?? []).map((comment) => ({
      id: comment.id as string,
      authorName: comment.author_name as string,
      body: comment.body_ar as string,
      createdAt: comment.created_at as string,
    })),
  };
}

export async function saveContentItem(input: {
  contentSlug: string;
  contentType: "news" | "article";
  title: string;
  actor?: DashboardActorContext | null;
}): Promise<PersistResult & { savedAt?: string; message?: string }> {
  const supabase = getSupabaseAdmin();
  const userId = input.actor?.userId;
  const savedAt = new Date().toISOString();
  if (!userId) return { ok: true, persisted: false, message: "auth_required" };
  if (!supabase) return { ok: true, persisted: false, savedAt, message: "supabase_not_configured" };

  const { data, error } = await supabase
    .from("saved_content")
    .upsert({
      user_id: userId,
      content_type: input.contentType,
      content_slug: input.contentSlug,
      title_ar: input.title,
      metadata: { source: "content_detail_page" },
      updated_at: savedAt,
    }, { onConflict: "user_id,content_type,content_slug" })
    .select("id, updated_at")
    .single();

  if (error) throw new Error(error.message);
  const savedContentId = data?.id as string | undefined;
  if (!savedContentId) return { ok: true, persisted: false, savedAt, message: "saved_content_not_created" };

  await insertRequiredAuditLog(supabase, {
    actor_user_id: userId,
    organization_id: input.actor?.organizationId ?? null,
    action: "content_saved",
    entity_type: "saved_content",
    entity_id: savedContentId,
    metadata: {
      contentSlug: input.contentSlug,
      contentType: input.contentType,
      title: input.title,
    },
  });

  return { ok: true, persisted: true, id: savedContentId, savedAt: (data?.updated_at as string | undefined) ?? savedAt };
}
