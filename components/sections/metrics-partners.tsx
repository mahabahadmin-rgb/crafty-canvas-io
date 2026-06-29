import { BriefcaseBusiness, Building2, ChevronLeft, ChevronRight, Target, Users } from "lucide-react";
import { metrics, partners } from "@/lib/data/site";
import { ScrollButton } from "@/components/ui/scroll-button";

const icons = { building: Building2, briefcase: BriefcaseBusiness, users: Users, target: Target };

export function MetricsPartners() {
  const beltPartners = [...partners, ...partners];

  return (
    <section className="py-5" id="partners">
      <div className="container-page">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{metrics.map((metric) => { const Icon = icons[metric.icon]; return <div key={metric.id} className="grid grid-cols-[64px_1fr] items-center gap-3 px-2 py-3 text-right"><Icon className="h-12 w-12 stroke-[1.6] text-[#1D1916]" /><div><div className="font-display text-3xl font-extrabold text-[#A7815E]">{metric.value}</div><p className="text-xs leading-5 text-muted">{metric.labelAr}</p></div></div>; })}</div>
        <div className="relative mt-4 overflow-hidden rounded-lg border border-line bg-white/58 p-4">
          <ScrollButton targetId="landing-partners-track" direction="previous" className="absolute right-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white text-muted shadow-[0_8px_18px_rgb(24_23_21/0.08)] lg:grid" ariaLabel="السابق"><ChevronRight className="h-4 w-4" /></ScrollButton>
          <ScrollButton targetId="landing-partners-track" direction="next" className="absolute left-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white text-muted shadow-[0_8px_18px_rgb(24_23_21/0.08)] lg:grid" ariaLabel="التالي"><ChevronLeft className="h-4 w-4" /></ScrollButton>
          <h2 className="mb-4 text-center font-display text-2xl font-extrabold text-navy">شركاء النجاح</h2>
          <div
            id="landing-partners-track"
            className="partners-belt relative overflow-hidden px-8 py-1"
            aria-label="شركاء النجاح"
          >
            <div className="partners-belt-track flex w-max items-center gap-3">
              {beltPartners.map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  className="grid min-h-14 w-[150px] shrink-0 place-items-center rounded-md border border-line/70 bg-[#fffdfa] px-3 text-center text-sm font-extrabold text-[#1D1916] shadow-[0_8px_18px_rgb(24_23_21/0.025)] transition hover:text-gold"
                  aria-hidden={index >= partners.length}
                >
                  {partner.nameAr}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
