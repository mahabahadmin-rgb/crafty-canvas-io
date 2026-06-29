export type AssetStatus = "قيد الدراسة" | "مؤهل" | "قيد الهيكلة" | "مغلق";
export type ContributionStage = "تحت الدراسة" | "قيد الهيكلة" | "تحت الطرح" | "مفتوحة" | "مغلقة" | "تخارج";

export type Asset = {
  id: string;
  slug: string;
  titleAr: string;
  cityAr: string;
  districtAr?: string;
  assetTypeAr: string;
  usageTypeAr: string;
  areaSqm: number;
  pricePerSqm?: number;
  streetWidthM?: number;
  frontageCount?: number;
  statusAr: AssetStatus;
  deedNumber?: string;
  listingDate: string;
  image: string;
  gallery?: string[];
  coordinates?: { lat: number; lng: number };
  excerptAr: string;
};

export type Contribution = {
  id: string;
  slug: string;
  titleAr: string;
  cityAr: string;
  stageAr: ContributionStage;
  capitalSar: number;
  investorsCount: number;
  durationMonths: number;
  fundedPercent: number;
  expectedReturnPercent?: number;
  remainingDays?: number;
  image: string;
  timeline: { labelAr: string; completed: boolean; current?: boolean }[];
  excerptAr: string;
};

export type Article = {
  id: string;
  slug: string;
  titleAr: string;
  categoryAr: string;
  date: string;
  excerptAr: string;
  image: string;
  featured?: boolean;
};

export type KnowledgeResource = Article & { tabAr: string };

export type FAQ = {
  id: string;
  categoryAr: string;
  questionAr: string;
  answerAr: string;
};

export type Partner = {
  id: string;
  nameAr: string;
  href?: string;
};

export type JourneyStep = {
  id: string;
  titleAr: string;
  descriptionAr: string;
  icon: "handshake" | "search" | "layers" | "license" | "megaphone" | "settings" | "exit";
};

export type Metric = {
  id: string;
  value: string;
  labelAr: string;
  icon: "building" | "briefcase" | "users" | "target";
};

export type NavigationItem = {
  labelAr: string;
  href: string;
};
