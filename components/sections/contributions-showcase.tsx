import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { ScrollButton } from "@/components/ui/scroll-button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/landing-motion";

const landingContributions = [
  {
    title: "مشروع متعدد الاستخدام",
    city: "الرياض",
    min: "40,000",
    image: "/images/asset-commercial-complex.png",
    href: "/contributions/nakheel-commercial",
  },
  {
    title: "مشروع مكتبي",
    city: "الدمام",
    min: "25,000",
    image: "/images/asset-tower.png",
    href: "/contributions/almurooj-office",
  },
  {
    title: "مجمع تجاري",
    city: "جدة",
    min: "30,000",
    image: "/images/hero-completed.png",
    href: "/contributions/alwaha-residential",
  },
  {
    title: "مشروع سكني متكامل",
    city: "الرياض",
    min: "50,000",
    image: "/images/asset-commercial-complex.png",
    href: "/contributions/nakheel-land-structuring",
  },
];

function LandingContributionCard({ item }: { item: (typeof landingContributions)[number] }) {
  return (
    <article className="group overflow-hidden rounded-md border border-[#A7815E]/48 bg-[#111820] p-3 text-center text-white shadow-[0_14px_30px_rgb(0_0_0/0.16)] transition duration-300 hover:-translate-y-1 hover:border-[#B89A7A] hover:shadow-[0_24px_48px_rgb(0_0_0/0.22)]">
      <div className="relative h-32 overflow-hidden rounded-md bg-white/8">
        <Image src={item.image} alt="" fill className="object-cover grayscale-[8%] sepia-[8%] transition duration-700 ease-out group-hover:scale-105" sizes="25vw" />
      </div>
      <h3 className="mt-4 font-display text-xl font-extrabold">{item.title}</h3>
      <p className="mt-1 flex items-center justify-center gap-1 text-sm font-bold text-[#B89A7A]">
        <MapPin className="h-3.5 w-3.5" />
        {item.city}
      </p>
      <p className="mt-3 text-xs font-bold text-white/62">الحد الأدنى للاستثمار <span className="text-white">{item.min} رس</span></p>
      <Link href={item.href} className="mt-3 inline-flex items-center justify-center gap-2 text-sm font-extrabold text-[#B89A7A] transition group-hover:text-white">
        عرض المشروع
        <ArrowUpLeft className="h-4 w-4 transition duration-300 group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />
      </Link>
    </article>
  );
}

export function ContributionsShowcase() {
  return (
    <section className="py-3" id="contributions">
      <Reveal className="landing-container relative overflow-hidden rounded-lg px-5 py-5 shadow-[0_24px_65px_rgb(24_23_21/0.18)] md:px-8 navy-panel" direction="up">
        <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(135deg, transparent 0 48%, rgba(167,129,94,.45) 49% 50%, transparent 51% 100%)", backgroundSize: "42px 42px" }} />
        <ScrollButton targetId="landing-contributions-track" direction="previous" className="landing-desktop-grid-control absolute right-3 top-1/2 z-10 h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-[#A7815E]/35 bg-[#111820] text-[#B89A7A]" ariaLabel="السابق"><ChevronRight className="h-4 w-4" /></ScrollButton>
        <ScrollButton targetId="landing-contributions-track" direction="next" className="landing-desktop-grid-control absolute left-3 top-1/2 z-10 h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-[#A7815E]/35 bg-[#111820] text-[#B89A7A]" ariaLabel="التالي"><ChevronLeft className="h-4 w-4" /></ScrollButton>
        <div className="relative z-10 mb-5 grid items-center gap-3 md:grid-cols-[170px_1fr_170px]">
          <Link href="/contributions" className="inline-flex h-10 w-max items-center rounded-md border border-[#A7815E]/45 bg-transparent px-4 text-xs font-extrabold text-[#B89A7A] transition hover:bg-[#A7815E] hover:text-white">
            عرض جميع المساهمات
          </Link>
          <div className="text-center">
            <h2 className="gold-divider justify-center font-display text-3xl font-extrabold text-white">المساهمات العقارية</h2>
            <p className="mt-1 text-sm font-bold text-white/64">مشاريع عقارية مدروسة عبر بوابة الطرح الرسمية للجهات المرخصة</p>
          </div>
          <div />
        </div>
        <Stagger id="landing-contributions-track" className="landing-four-grid relative z-10 no-scrollbar flex gap-4 overflow-x-auto pb-3" delay={0.12}>
          {landingContributions.map((item) => <StaggerItem key={item.title} className="mobile-contribution"><LandingContributionCard item={item} /></StaggerItem>)}
        </Stagger>
      </Reveal>
    </section>
  );
}
