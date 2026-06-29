import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { getPublicNewsArticles } from "@/lib/supabase/mahabah";
import type { Article } from "@/lib/types";
import { ScrollButton } from "@/components/ui/scroll-button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/landing-motion";

function NewsStripCard({ article }: { article: Article }) {
  return (
    <Link href={`/news/${article.slug}`} className="group grid min-h-[132px] grid-cols-[1fr_132px] gap-4 rounded-md border border-line bg-white/74 p-3 text-right shadow-[0_8px_18px_rgb(29_25_22/0.025)] transition duration-300 hover:-translate-y-1 hover:border-[#A7815E]/55 hover:bg-white hover:shadow-[0_18px_34px_rgb(29_25_22/0.08)]">
      <div className="min-w-0">
        <div className="flex items-center justify-end gap-2 text-xs font-bold text-muted">
          <span>{article.date}</span>
          <Calendar className="h-3.5 w-3.5 text-[#A7815E]" />
        </div>
        <h3 className="mt-2 line-clamp-2 font-display text-base font-extrabold leading-7 text-navy">{article.titleAr}</h3>
        <span className="mt-3 inline-flex h-8 items-center rounded-md border border-[#A7815E]/45 px-4 text-xs font-extrabold text-[#8F6B4C] transition group-hover:bg-[#A7815E] group-hover:text-white">قراءة الخبر</span>
      </div>
      <div className="relative min-h-[108px] overflow-hidden rounded-md bg-[#f3eee8]">
        <Image src={article.image} alt="" fill className="object-cover grayscale-[18%] sepia-[12%] transition duration-700 ease-out group-hover:scale-105" sizes="132px" />
      </div>
    </Link>
  );
}

export async function MediaCenter() {
  const result = await getPublicNewsArticles();
  const articles = result.data.slice(0, 3);

  return (
    <section className="py-3" id="media">
      <Reveal className="landing-container relative rounded-lg border border-line bg-white/44 p-4 shadow-[0_10px_24px_rgb(29_25_22/0.03)]">
        <ScrollButton targetId="landing-media-track" direction="previous" className="landing-desktop-grid-control absolute right-[-7px] top-1/2 h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-muted shadow-[0_10px_22px_rgb(24_23_21/0.08)]" ariaLabel="السابق"><ChevronRight className="h-4 w-4" /></ScrollButton>
        <ScrollButton targetId="landing-media-track" direction="next" className="landing-desktop-grid-control absolute left-[-7px] top-1/2 h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-muted shadow-[0_10px_22px_rgb(24_23_21/0.08)]" ariaLabel="التالي"><ChevronLeft className="h-4 w-4" /></ScrollButton>
        <div className="mb-4 grid items-end gap-3 md:grid-cols-[150px_1fr_150px]">
          <Link href="/news" className="inline-flex h-9 w-max items-center justify-center rounded-md border border-[#A7815E]/45 bg-white px-4 text-xs font-extrabold text-[#1D1916] transition hover:bg-[#A7815E] hover:text-white">
            عرض جميع الأخبار
          </Link>
          <div className="text-center">
            <h2 className="gold-divider justify-center font-display text-3xl font-extrabold text-[#1D1916]">المركز الإعلامي</h2>
            <div className="mt-2 flex items-center justify-center gap-7 text-sm font-extrabold">
              <span className="border-b-2 border-[#A7815E] pb-1 text-[#1D1916]">الأخبار</span>
              <span className="pb-1 text-muted">المدونة</span>
            </div>
          </div>
          <div />
        </div>
        <Stagger id="landing-media-track" className="landing-three-grid no-scrollbar flex gap-4 overflow-x-auto pb-2" delay={0.1}>
          {articles.map((article) => (
            <StaggerItem key={article.id} className="landing-three-item min-w-[310px]">
              <NewsStripCard article={article} />
            </StaggerItem>
          ))}
        </Stagger>
      </Reveal>
    </section>
  );
}
