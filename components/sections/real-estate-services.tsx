import Link from "next/link";
import { getServices } from "@/lib/supabase/mahabah";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/landing-motion";

export async function RealEstateServices() {
  const servicesResult = await getServices();
  const services = servicesResult.data.slice(0, 12);

  return (
    <section className="pb-3 pt-4" id="services">
      <div className="landing-container">
        <Reveal className="mb-5 text-center">
          <h2 className="gold-divider justify-center font-display text-3xl font-extrabold text-[#1D1916]">الخدمات العقارية</h2>
          <p className="mt-2 text-sm font-bold text-muted">نقدم لك حلولاً متكاملة لإدارة وتطوير أصولك العقارية باحترافية</p>
        </Reveal>
        <Stagger className="landing-services-grid grid gap-3 md:grid-cols-3" stagger={0.045}>
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <StaggerItem key={service.id}>
                <article className="group relative grid min-h-32 place-items-center rounded-lg border border-line bg-white/72 px-3 py-4 text-center shadow-[0_8px_18px_rgb(29_25_22/0.025)] transition duration-300 hover:-translate-y-1 hover:border-[#A7815E]/55 hover:bg-white hover:shadow-[0_18px_34px_rgb(29_25_22/0.08)]">
                  <span className="absolute right-4 top-3 text-sm font-extrabold text-[#A7815E]">{String(index + 1).padStart(2, "0")}</span>
                  <Icon className="h-10 w-10 stroke-[1.45] text-[#A7815E] transition duration-300 group-hover:-translate-y-1 group-hover:scale-105" />
                  <h3 className="mt-2 font-display text-base font-extrabold leading-7 text-navy">{service.titleAr}</h3>
                  <p className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-muted">{service.descriptionAr}</p>
                  <Link href={`/services/${service.slug}`} className="absolute inset-0" aria-label={`عرض تفاصيل ${service.titleAr}`}>
                    <span className="sr-only">عرض التفاصيل</span>
                  </Link>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
