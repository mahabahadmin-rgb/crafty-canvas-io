import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicNewsArticles } from "@/lib/supabase/mahabah";
import { ContentDetailPage } from "@/components/sections/content-detail-page";

export async function generateStaticParams() {
  const result = await getPublicNewsArticles();
  return result.data.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublicNewsArticles();
  const item = result.data.find((article) => article.slug === slug);
  return {
    title: item?.titleAr ?? "الخبر",
    description: item?.excerptAr,
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getPublicNewsArticles();
  const item = result.data.find((article) => article.slug === slug);
  if (!item) notFound();

  return <ContentDetailPage item={item} variant="news" />;
}
