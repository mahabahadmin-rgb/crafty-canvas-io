import Link from "next/link";
import { Instagram, Linkedin, Mail, Phone, Twitter } from "lucide-react";
import { navigation } from "@/lib/data/navigation";
import { BrandLogo } from "@/components/layout/brand-logo";

export function SiteFooter() {
  return (
    <footer className="mt-6 bg-[#111820] text-white">
      <div className="container-page py-8">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.2fr_1fr]">
          <div className="relative hidden min-h-[120px] overflow-hidden rounded-md border border-white/10 lg:block">
            <div className="absolute inset-x-6 bottom-7 h-px bg-[#A7815E]/50" />
            <div className="absolute bottom-8 right-8 h-20 w-64 border-b border-[#A7815E]/40 opacity-70" style={{ background: "linear-gradient(135deg, transparent 30%, rgba(167,129,94,.28) 30%, rgba(167,129,94,.28) 31%, transparent 31%)" }} />
          </div>
          <div className="grid gap-6 text-center md:grid-cols-2 md:text-right">
            <div>
              <h3 className="mb-3 text-sm font-bold text-gold-light">تواصل معنا</h3>
              <ul className="grid gap-2 text-xs text-white/76">
                <li className="flex justify-center gap-2 md:justify-start"><Phone className="h-4 w-4 text-gold-light" /> <a href="tel:0510515010">0510515010</a></li>
                <li className="flex justify-center gap-2 md:justify-start"><Mail className="h-4 w-4 text-gold-light" /> <a href="mailto:info@mahabah.sa">info@mahabah.sa</a></li>
                <li className="flex justify-center gap-2 md:justify-start"><Twitter className="h-4 w-4 text-gold-light" /> @mahabah_sa</li>
              </ul>
              <div className="mt-4 flex justify-center gap-3 text-white/65 md:justify-start"><Linkedin className="h-4 w-4" /><Twitter className="h-4 w-4" /><Instagram className="h-4 w-4" /></div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-bold text-gold-light">روابط مهمة</h3>
              <ul className="grid gap-2 text-xs text-white/76">
                {navigation.slice(0, 5).map((item) => <li key={item.href}><Link className="hover:text-gold-light" href={item.href}>{item.labelAr}</Link></li>)}
                <li><Link className="hover:text-gold-light" href="/privacy">سياسة الخصوصية</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center lg:text-right">
            <div className="inline-flex rounded-lg bg-white/96 p-2 shadow-[0_18px_34px_rgb(0_0_0/0.18)]">
              <BrandLogo height={86} imageClassName="mix-blend-normal" />
            </div>
            <p className="mt-4 text-xs leading-7 text-white/72">مهابة - حيث تلتقي الرؤية وثمار الأصول.</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-3 text-center text-xs leading-6 text-white/72">جميع الحقوق محفوظة © 2024 | إدارة المساهمات العقارية</div>
    </footer>
  );
}
