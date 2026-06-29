"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/lib/data/faqs";
import { SectionHeading } from "@/components/ui/section-heading";

export function FAQSection() {
  const [open, setOpen] = useState(faqs[0]?.id);
  return (
    <section className="py-6 relative overflow-hidden">
      <div className="container-page relative rounded-xl border border-line bg-white/72 p-5 shadow-sm">
        <div className="absolute inset-0 opacity-[0.045]"><Image src="/images/faq-villa-bg.png" alt="رسم خفيف لمجمع سكني سعودي خلف الأسئلة الشائعة" fill priority className="object-cover" sizes="100vw" /></div>
        <div className="relative z-10">
          <SectionHeading compact title="الأسئلة الشائعة" />
          <div className="grid gap-3 md:grid-cols-2">{faqs.map((faq) => { const isOpen = open === faq.id; return <article key={faq.id} className="rounded-lg border border-line bg-ivory/95 shadow-sm"><button type="button" onClick={() => setOpen(isOpen ? "" : faq.id)} className="flex min-h-11 w-full items-center justify-between gap-4 px-4 py-3 text-right text-xs font-bold text-navy" aria-expanded={isOpen}><span>{faq.questionAr}</span><ChevronDown className={`h-4 w-4 text-muted transition ${isOpen ? "rotate-180" : ""}`} /></button>{isOpen ? <p className="border-t border-line px-4 pb-4 pt-3 text-xs leading-7 text-muted">{faq.answerAr}</p> : null}</article>; })}</div>
        </div>
      </div>
    </section>
  );
}
