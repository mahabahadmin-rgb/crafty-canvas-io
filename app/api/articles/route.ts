import { NextResponse } from "next/server";
import { getPublicKnowledgeResources, getPublicNewsArticles } from "@/lib/supabase/mahabah";

export async function GET() {
  const [articles, resources] = await Promise.all([
    getPublicNewsArticles(),
    getPublicKnowledgeResources(),
  ]);

  return NextResponse.json({
    data: {
      articles: articles.data,
      resources: resources.data,
    },
    source: {
      articles: articles.source,
      resources: resources.source,
    },
    errors: [articles.error, resources.error].filter(Boolean),
  });
}
