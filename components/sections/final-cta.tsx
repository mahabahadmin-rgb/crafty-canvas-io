import Image from "next/image";
import { Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal, SoftFloat } from "@/components/ui/landing-motion";

export function FinalCTA() {
  return (
    <section className="pb-7 pt-3">
      <div className="landing-container">
        <Reveal className="relative overflow-hidden rounded-lg border border-line bg-[#f7f2ec] px-5 py-6 shadow-card md:px-8">
          <SoftFloat className="pointer-events-none absolute inset-0">
            <Image src="/images/final-cta-map-building.png" alt="رسم معماري لأصل عقاري" fill priority className="object-contain object-left-bottom opacity-95 grayscale-[8%] sepia-[8%]" sizes="100vw" />
          </SoftFloat>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f7f2ec]/82 to-[#f7f2ec]/98" />
          <div className="relative z-10 grid items-center gap-5 lg:grid-cols-[280px_1fr_auto]">
            <div className="relative hidden h-28 lg:block" />
            <div className="text-right">
              <h2 className="font-display text-2xl font-extrabold text-[#1D1916] md:text-3xl">لديك أصل عقاري وترغب في تطويره أو استثماره؟</h2>
              <p className="mt-3 max-w-2xl text-sm font-bold leading-8 text-muted">انضم إلى منصة مهابة وابدأ رحلتك نحو تحويل أصولك العقارية إلى مساهمات عقارية منظمة وفق معايير الحوكمة والشفافية والامتثال.</p>
            </div>
            <ButtonLink href="/submit-asset" variant="primary" className="min-h-12 rounded-md px-7 text-sm">
              <Plus className="ml-2 h-4 w-4" />
              إضافة أصل عقاري
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
