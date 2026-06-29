import { ChevronLeft } from "lucide-react";
import { journeySteps } from "@/lib/data/site";
import type { JourneyStep } from "@/lib/types";
import type { ReactElement, ReactNode } from "react";

type JourneyIconProps = {
  className?: string;
};

function IconFrame({ children, className }: JourneyIconProps & { children: ReactNode }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" fill="none">
      <path d="M32 7 52 18.5v27L32 57 12 45.5v-27L32 7Z" className="fill-[#fbf8f2]" />
      <path d="M32 7 52 18.5v27L32 57 12 45.5v-27L32 7Z" className="stroke-current" strokeWidth="2" strokeLinejoin="round" />
      <path d="M32 13 46 21v17.8L32 47 18 38.8V21l14-8Z" className="stroke-current opacity-25" strokeWidth="1.5" strokeLinejoin="round" />
      {children}
    </svg>
  );
}

function IntakeIcon(props: JourneyIconProps) {
  return (
    <IconFrame {...props}>
      <path d="M22 38.5h9.5c2.8 0 4.7-2 6.4-4.1l3.5-4.4c1-1.3 2.8-1.5 4-.4 1.1 1 1.2 2.7.2 3.9l-6.1 7.2c-1.5 1.8-3.8 2.9-6.2 2.9H22" className="stroke-current" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 34.2h9.7c1.7 0 3.1 1.2 3.1 2.8s-1.4 2.8-3.1 2.8H24" className="stroke-current" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 20h14v10H26z" className="fill-[#B89A7A] stroke-current" strokeWidth="2" strokeLinejoin="round" />
      <path d="M29 24h8" className="stroke-[#fbf8f2]" strokeWidth="1.8" strokeLinecap="round" />
    </IconFrame>
  );
}

function StudyIcon(props: JourneyIconProps) {
  return (
    <IconFrame {...props}>
      <path d="M23 20h17v22H23z" className="fill-[#fbf8f2] stroke-current" strokeWidth="2" strokeLinejoin="round" />
      <path d="M27 26h9M27 31h7M27 36h5" className="stroke-current opacity-55" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="39.5" cy="37.5" r="7.5" className="fill-[#B89A7A] stroke-current" strokeWidth="2" />
      <path d="m45 43 5 5" className="stroke-current" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M36 38.5 39 41l5-6" className="stroke-[#fbf8f2]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </IconFrame>
  );
}

function StructureIcon(props: JourneyIconProps) {
  return (
    <IconFrame {...props}>
      <path d="m22 24 10-5 10 5-10 5-10-5Z" className="fill-[#B89A7A] stroke-current" strokeWidth="2" strokeLinejoin="round" />
      <path d="m18 33 14-7 14 7-14 7-14-7Z" className="fill-[#fbf8f2] stroke-current" strokeWidth="2" strokeLinejoin="round" />
      <path d="m18 41 14-7 14 7-14 7-14-7Z" className="stroke-current" strokeWidth="2" strokeLinejoin="round" />
      <path d="M32 29v18" className="stroke-current opacity-35" strokeWidth="1.6" strokeLinecap="round" />
    </IconFrame>
  );
}

function LicenseIcon(props: JourneyIconProps) {
  return (
    <IconFrame {...props}>
      <path d="M24 19h16l5 5v22H24z" className="fill-[#fbf8f2] stroke-current" strokeWidth="2" strokeLinejoin="round" />
      <path d="M40 19v6h5" className="stroke-current" strokeWidth="2" strokeLinejoin="round" />
      <path d="M29 30h10M29 35h8" className="stroke-current opacity-55" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M32 43c3.5-1.1 5.5-3.5 5.5-7.2v-2.4L32 31l-5.5 2.4v2.4c0 3.7 2 6.1 5.5 7.2Z" className="fill-[#B89A7A] stroke-current" strokeWidth="2" strokeLinejoin="round" />
      <path d="m29.5 36.7 1.9 1.9 3.4-4" className="stroke-[#fbf8f2]" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </IconFrame>
  );
}

function OfferingIcon(props: JourneyIconProps) {
  return (
    <IconFrame {...props}>
      <path d="M19 38c7-5 19-5 26 0" className="stroke-current" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M24 31h16v13H24z" className="fill-[#B89A7A] stroke-current" strokeWidth="2" strokeLinejoin="round" />
      <path d="M28 31v13M36 31v13" className="stroke-[#fbf8f2]" strokeWidth="1.6" />
      <path d="M25 27h14l-7-7-7 7Z" className="fill-[#fbf8f2] stroke-current" strokeWidth="2" strokeLinejoin="round" />
      <path d="M43 24c3 1.4 5 4 5.4 7M21 24c-3 1.4-5 4-5.4 7" className="stroke-current opacity-55" strokeWidth="2" strokeLinecap="round" />
    </IconFrame>
  );
}

function ManageIcon(props: JourneyIconProps) {
  return (
    <IconFrame {...props}>
      <circle cx="32" cy="32" r="13" className="fill-[#fbf8f2] stroke-current" strokeWidth="2" />
      <path d="M32 21v4M32 39v4M21 32h4M39 32h4" className="stroke-current opacity-45" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m32 32 7-5-3.2 8.2L25 39l7-7Z" className="fill-[#B89A7A] stroke-current" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="32" cy="32" r="2.3" className="fill-[#fbf8f2] stroke-current" strokeWidth="1.5" />
    </IconFrame>
  );
}

function ExitIcon(props: JourneyIconProps) {
  return (
    <IconFrame {...props}>
      <path d="M20 42h25" className="stroke-current opacity-45" strokeWidth="2" strokeLinecap="round" />
      <path d="M23 38c5.5-9 12.5-12.5 22-13" className="stroke-current" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M39 20h9v9" className="stroke-current" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M25 42v-8h6v8M34 42V29h6v13" className="fill-[#B89A7A] stroke-current" strokeWidth="2" strokeLinejoin="round" />
      <path d="M21 25h8v17h-8z" className="fill-[#fbf8f2] stroke-current" strokeWidth="2" strokeLinejoin="round" />
    </IconFrame>
  );
}

const icons: Record<JourneyStep["icon"], (props: JourneyIconProps) => ReactElement> = {
  handshake: IntakeIcon,
  search: StudyIcon,
  layers: StructureIcon,
  license: LicenseIcon,
  megaphone: OfferingIcon,
  settings: ManageIcon,
  exit: ExitIcon,
};

export function JourneyTimeline() {
  return (
    <section className="py-3" id="journey">
      <div className="container-page px-4 py-3">
        <h2 className="mb-4 text-center font-display text-2xl font-extrabold text-navy">رحلة مهابة</h2>
        <ol className="no-scrollbar relative flex gap-3 overflow-x-auto pb-2 before:absolute before:left-8 before:right-8 before:top-[16px] before:hidden before:border-t before:border-dashed before:border-gold/35 md:grid md:grid-cols-7 md:overflow-visible md:before:block">
          {journeySteps.map((step, index) => {
            const Icon = icons[step.icon];

            return (
              <li key={step.id} className="mobile-step group relative z-10 flex flex-col items-center text-center">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gold text-sm font-extrabold text-white shadow-[0_8px_18px_rgb(167_129_94/0.18)]">
                  {index + 1}
                </div>
                <div className="mt-2 grid h-[48px] w-[48px] place-items-center rounded-full bg-white text-gold shadow-[inset_0_0_0_1px_rgb(222_208_191/0.9),0_8px_18px_rgb(24_23_21/0.045)] transition duration-200 group-hover:-translate-y-0.5 group-hover:text-navy">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="mt-2 text-xs font-extrabold text-ink">{step.titleAr}</h3>
                {index < journeySteps.length - 1 ? <ChevronLeft className="absolute left-[-10px] top-[52px] hidden h-4 w-4 text-muted/55 md:block" /> : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
