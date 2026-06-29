import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicKnowledgeResources, getPublicNewsArticles } from "@/lib/supabase/mahabah";
import { ContentDetailPage } from "@/components/sections/content-detail-page";

async function getMediaContent() {
  const [news, resources] = await Promise.all([
    getPublicNewsArticles(),
    getPublicKnowledgeResources(),
  ]);
  return {
    news,
    resources,
    content: [...news.data, ...resources.data],
  };
}

export async function generateStaticParams() {
  const { content } = await getMediaContent();
  return content.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { content } = await getMediaContent();
  const item = content.find((article) => article.slug === slug);
  return { title: item?.titleAr ?? "المركز الإعلامي", description: item?.excerptAr };
}

export default async function MediaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { news, resources } = await getMediaContent();
  const newsItem = news.data.find((article) => article.slug === slug);
  if (newsItem) return <ContentDetailPage item={newsItem} variant="news" />;

  const resourceItem = resources.data.find((article) => article.slug === slug);
  if (resourceItem) return <ContentDetailPage item={resourceItem} variant="article" />;

  notFound();
}
