"use client";

import Image from "next/image";
import { Building2, ChevronDown, MapPin, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { SoftFloat } from "@/components/ui/landing-motion";

const heroEase = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.68, ease: heroEase } },
};

const heroGroup: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const heroCopyGroup: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const heroArt: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.86, ease: heroEase } },
};

const searchReveal: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.985, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { delay: 0.26, duration: 0.72, ease: heroEase } },
};

function SelectBox({ label, name, icon: Icon, options }: { label: string; name: string; icon: LucideIcon; options: Array<{ label: string; value: string }> }) {
  return (
    <label className="relative min-w-0 flex-1">
      <span className="sr-only">{label}</span>
      <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A7815E]" />
      <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <select name={name} className="h-14 w-full appearance-none rounded-md border border-line bg-white pr-10 pl-11 text-sm font-extrabold text-navy outline-none transition focus:border-[#A7815E]">
        <option value="">{label}</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion === true ? false : "hidden";

  return (
    <section className="relative overflow-hidden py-6 sm:py-8">
      <div className="mx-auto w-full max-w-none px-3 sm:px-5 lg:px-7">
        <motion.div initial={initial} animate="visible" variants={heroGroup} className="landing-hero-grid grid min-h-[360px] items-center gap-7 py-2 md:min-h-[430px] xl:min-h-[500px]">
          <motion.div variants={heroArt} className="landing-hero-art relative overflow-visible" style={{ minHeight: 380 }}>
            <SoftFloat className="absolute inset-0">
              <Image
                src="/images/landing-hero-architecture.png"
                alt="رسم معماري لأصل عقاري قابل للتطوير"
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </SoftFloat>
          </motion.div>

          <motion.div variants={heroCopyGroup} className="landing-hero-copy pb-5 text-right">
            <motion.h1 variants={fadeUp} className="landing-hero-title font-display text-4xl font-black leading-[1.18] text-[#1D1916]">
              نحول الأصول العقارية إلى
              <span className="block text-[#A7815E]">مساهمات عقارية منظمة</span>
              وفق أعلى معايير الحوكمة والشفافية والامتثال.
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-[15px] font-bold leading-8 text-muted">
              منصة متخصصة في تطوير الأصول العقارية وتحويلها إلى مساهمات عقارية ذات قيمة مستدامة تحقق عوائد مجزية وتنمو عبر الزمن.
            </motion.p>
          </motion.div>
        </motion.div>

        <motion.form
          action="/assets"
          initial={initial}
          animate="visible"
          variants={searchReveal}
          className="relative z-10 mx-auto mt-8 flex w-full max-w-[min(1100px,100%)] flex-col gap-3 rounded-lg border border-line bg-white p-4 shadow-[0_18px_34px_rgb(29_25_22/0.14)] md:flex-row"
          aria-label="بحث عن الأصول العقارية"
        >
          <SelectBox
            label="التخصص"
            name="type"
            icon={Building2}
            options={[
              { label: "أرض", value: "أرض" },
              { label: "تجاري", value: "تجاري" },
              { label: "سكني", value: "سكني" },
              { label: "صناعي", value: "صناعي" },
            ]}
          />
          <SelectBox
            label="المدينة"
            name="city"
            icon={MapPin}
            options={[
              { label: "الرياض", value: "الرياض" },
              { label: "جدة", value: "جدة" },
              { label: "الدمام", value: "الدمام" },
            ]}
          />
          <button type="submit" className="inline-flex h-14 shrink-0 items-center justify-center gap-3 rounded-md bg-[#A7815E] px-10 text-sm font-extrabold text-white shadow-[0_12px_24px_rgb(167_129_94/0.24)] transition hover:bg-[#8F6B4C]">
            بحث
            <Search className="h-4 w-4" />
          </button>
        </motion.form>
      </div>
    </section>
  );
}
