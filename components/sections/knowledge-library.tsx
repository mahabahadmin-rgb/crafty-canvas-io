import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { getPublicKnowledgeResources } from "@/lib/supabase/mahabah";
import type { Article } from "@/lib/types";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/landing-motion";

function BlogStripCard({ resource }: { resource: Article }) {
  return (
    <Link href={`/blog/${resource.slug}`} className="group block overflow-hidden rounded-md border border-line bg-white/76 shadow-[0_8px_18px_rgb(29_25_22/0.025)] transition duration-300 hover:-translate-y-1 hover:border-[#A7815E]/55 hover:bg-white hover:shadow-[0_18px_34px_rgb(29_25_22/0.08)]">
      <div className="relative h-24 bg-[#f3eee8]">
        <Image src={resource.image} alt="" fill className="object-cover grayscale-[20%] sepia-[12%] transition duration-700 ease-out group-hover:scale-105" sizes="210px" />
      </div>
      <div className="p-3 text-right">
        <div className="flex justify-end gap-1.5 text-[11px] font-bold text-muted">
          <span>{resource.date}</span>
          <Calendar className="h-3 w-3 text-[#A7815E]" />
        </div>
        <h3 className="mt-1 line-clamp-2 min-h-11 font-display text-sm font-extrabold leading-6 text-navy">{resource.titleAr}</h3>
        <span className="mt-2 inline-flex h-8 items-center rounded-md border border-[#A7815E]/45 px-3 text-[11px] font-extrabold text-[#8F6B4C] transition group-hover:bg-[#A7815E] group-hover:text-white">قراءة المقال</span>
      </div>
    </Link>
  );
}

export async function KnowledgeLibrary() {
  const result = await getPublicKnowledgeResources();
  const knowledgeResources = result.data.slice(0, 5);

  return (
    <section className="py-3" id="knowledge">
      <Reveal className="landing-container rounded-lg border border-line bg-white/44 p-4 shadow-[0_10px_24px_rgb(29_25_22/0.03)]">
        <div className="mb-4 grid items-center gap-3 md:grid-cols-[150px_1fr_150px]">
          <Link href="/blog" className="inline-flex h-9 w-max items-center justify-center rounded-md border border-[#A7815E]/45 bg-white px-4 text-xs font-extrabold text-[#1D1916] transition hover:bg-[#A7815E] hover:text-white">
            عرض جميع المقالات
          </Link>
          <h2 className="gold-divider justify-center text-center font-display text-3xl font-extrabold text-[#1D1916]">المدونة</h2>
          <div />
        </div>
        <Stagger className="landing-five-grid no-scrollbar flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible" delay={0.08} stagger={0.055}>
          {knowledgeResources.map((resource) => (
            <StaggerItem key={resource.id} className="mobile-resource">
              <BlogStripCard resource={resource} />
            </StaggerItem>
          ))}
        </Stagger>
      </Reveal>
    </section>
  );
}
