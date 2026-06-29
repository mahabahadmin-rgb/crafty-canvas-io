import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { formatArea } from "@/lib/utils";
import { ScrollButton } from "@/components/ui/scroll-button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/landing-motion";

const landingAssets = [
  {
    title: "مستودع صناعي",
    city: "الرياض",
    district: "حي السلي - الرياض",
    area: 12000,
    label: "صناعي",
    image: "/images/hero-raw-land.png",
    href: "/assets/dammam-raw-land",
  },
  {
    title: "مبنى تجاري",
    city: "الدمام",
    district: "حي الشاطئ - الدمام",
    area: 6200,
    label: "تجاري",
    image: "/images/asset-tower.png",
    href: "/assets/jeddah-existing-commercial-complex",
  },
  {
    title: "مبنى سكني",
    city: "جدة",
    district: "حي الروضة - شمال جدة",
    area: 4680,
    label: "سكني",
    image: "/images/asset-commercial-complex.png",
    href: "/assets/king-fahd-commercial-land",
  },
  {
    title: "أرض سكنية",
    city: "الرياض",
    district: "حي الياسمين - شمال الرياض",
    area: 8125,
    label: "أرض",
    image: "/images/asset-land-masterplan.png",
    href: "/assets/north-riyadh-residential-land",
  },
];

function LandingAssetCard({ asset }: { asset: (typeof landingAssets)[number] }) {
  return (
    <Link href={asset.href} className="group block overflow-hidden rounded-lg border border-line bg-white shadow-[0_10px_22px_rgb(29_25_22/0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#A7815E]/55 hover:shadow-[0_20px_42px_rgb(29_25_22/0.1)]">
      <div className="relative h-36 bg-[#f3eee8]">
        <Image src={asset.image} alt="" fill className="object-cover grayscale-[12%] sepia-[10%] transition duration-700 ease-out group-hover:scale-105" sizes="25vw" />
        <span className="absolute right-3 top-3 rounded-br-md rounded-tl-md bg-[#A7815E] px-3 py-1 text-xs font-extrabold text-white">{asset.label}</span>
      </div>
      <div className="p-4 text-center">
        <div className="flex items-center justify-center gap-1 text-xs font-bold text-muted">
          <MapPin className="h-3.5 w-3.5 text-[#A7815E]" />
          {asset.city}
        </div>
        <h3 className="mt-2 font-display text-xl font-extrabold text-navy">{asset.title}</h3>
        <p className="mt-1 text-xs font-bold leading-6 text-muted">{asset.district}</p>
        <p className="mt-2 text-xs font-bold text-muted">المساحة <span className="text-navy">{formatArea(asset.area)}</span></p>
      </div>
    </Link>
  );
}

export function AssetsCarousel() {
  return (
    <section className="pb-3 pt-2" id="assets">
      <div className="landing-container relative">
        <Reveal className="mb-4 grid items-end gap-3 md:grid-cols-[160px_1fr_160px]">
          <Link href="/assets" className="inline-flex h-10 w-max items-center justify-center rounded-md border border-[#A7815E]/45 bg-white px-4 text-xs font-extrabold text-[#1D1916] transition hover:bg-[#A7815E] hover:text-white">
            عرض جميع الأصول
          </Link>
          <div className="text-center">
            <h2 className="gold-divider justify-center font-display text-3xl font-extrabold text-[#1D1916]">الأصول العقارية</h2>
            <p className="mt-2 text-sm font-bold text-muted">أصول متنوعة جاهزة للدراسة والتطوير والتحويل إلى مشاريع استثمارية</p>
          </div>
          <div />
        </Reveal>
        <ScrollButton targetId="landing-assets-track" direction="previous" className="landing-desktop-grid-control absolute right-[-7px] top-[56%] h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-muted shadow-[0_10px_22px_rgb(24_23_21/0.08)]" ariaLabel="السابق"><ChevronRight className="h-4 w-4" /></ScrollButton>
        <ScrollButton targetId="landing-assets-track" direction="next" className="landing-desktop-grid-control absolute left-[-7px] top-[56%] h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-muted shadow-[0_10px_22px_rgb(24_23_21/0.08)]" ariaLabel="التالي"><ChevronLeft className="h-4 w-4" /></ScrollButton>
        <Stagger id="landing-assets-track" className="landing-four-grid no-scrollbar flex gap-5 overflow-x-auto px-1 pb-3 md:grid md:grid-cols-2 md:overflow-visible">
          {landingAssets.map((asset) => <StaggerItem key={asset.title} className="mobile-card"><LandingAssetCard asset={asset} /></StaggerItem>)}
        </Stagger>
      </div>
    </section>
  );
}
