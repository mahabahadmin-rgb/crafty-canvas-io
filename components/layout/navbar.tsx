"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Building2, LogIn, Menu, Plus, X } from "lucide-react";
import { navigation } from "@/lib/data/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/layout/brand-logo";

const responsiveLandingCss = `
.landing-desktop-nav,
.landing-desktop-actions,
.landing-desktop-grid-control {
  display: none !important;
}
.landing-mobile-trigger,
.landing-mobile-overlay {
  display: grid !important;
}
@media (min-width: 940px) {
  .landing-desktop-nav,
  .landing-desktop-actions {
    display: flex !important;
  }
  .landing-desktop-grid-control {
    display: grid !important;
  }
  .landing-mobile-trigger,
  .landing-mobile-overlay {
    display: none !important;
  }
  .landing-hero-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
  .landing-hero-art {
    order: 2 !important;
  }
  .landing-hero-copy {
    order: 1 !important;
    padding-bottom: 2.5rem !important;
  }
  .landing-hero-title {
    font-size: 40px !important;
  }
  .landing-four-grid {
    display: grid !important;
    grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
    overflow: visible !important;
    padding-inline: 2.5rem !important;
  }
  .landing-three-grid {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    overflow: visible !important;
  }
  .landing-three-item {
    min-width: 0 !important;
  }
  .landing-five-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
  }
  .landing-services-grid {
    grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
  }
}
@media (min-width: 1280px) {
  .landing-hero-title {
    font-size: 44px !important;
  }
}
`;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: responsiveLandingCss }} />
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-line/70 bg-[#F6F4F1]/94 transition-all duration-300 backdrop-blur-xl",
          scrolled ? "shadow-[0_12px_32px_rgb(24_23_21/0.055)]" : "shadow-none",
        )}
      >
      <div className="container-page py-0">
        <div
          className={cn(
            "flex items-center justify-between gap-4 px-0 transition-all duration-300",
            scrolled ? "min-h-[72px]" : "min-h-[86px]",
          )}
        >
          <div className="flex justify-start">
            <BrandLogo
              priority
              height={scrolled ? 66 : 78}
              className="transition-transform duration-300 hover:-translate-y-0.5"
            />
          </div>

          <nav className="landing-desktop-nav justify-self-center gap-1 text-[13px] font-extrabold text-navy xl:gap-2 xl:text-[14px]" aria-label="التنقل الرئيسي">
            {navigation.map((item) => {
              const hrefPath = item.href.split("#")[0] || "/";
              const active = hrefPath === "/" ? pathname === "/" : pathname === hrefPath;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative px-2 py-3 transition-all duration-200 after:absolute after:inset-x-2 after:bottom-1 after:h-px after:origin-center after:scale-x-0 after:bg-gold after:transition-transform hover:text-gold hover:after:scale-x-100 xl:px-3 xl:after:inset-x-3",
                    active ? "text-gold after:scale-x-100" : "text-navy",
                  )}
                >
                  {item.labelAr}
                </Link>
              );
            })}
          </nav>

          <div className="landing-desktop-actions items-center justify-end gap-2">
            <ButtonLink href="/submit-asset" variant="primary" className="min-h-11 rounded-md px-4 text-xs shadow-[0_12px_24px_rgb(167_129_94/0.22)]">
              <Plus className="ml-2 h-3.5 w-3.5" />
              إضافة أصل عقاري
            </ButtonLink>
            <ButtonLink href="/auth/login" variant="secondary" className="min-h-11 rounded-md border border-line bg-white px-4 text-xs shadow-none">
              <LogIn className="ml-2 h-3.5 w-3.5" />
              تسجيل الدخول
            </ButtonLink>
          </div>

          <button
            type="button"
            className="landing-mobile-trigger h-11 w-11 justify-self-end place-items-center rounded-lg bg-white text-navy shadow-[0_10px_22px_rgb(24_23_21/0.08)] transition hover:bg-[#fff7ea] hover:text-gold"
            onClick={() => setOpen(true)}
            aria-label="فتح القائمة"
            aria-expanded={open}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open ? (
        <div className="landing-mobile-overlay fixed inset-0 z-[60] bg-navy/35 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <aside
            className="mr-auto flex h-screen w-[min(88vw,390px)] animate-[mobileMenuIn_220ms_ease-out] flex-col bg-ivory p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            aria-label="القائمة الجانبية"
          >
            <div className="flex items-center justify-between gap-3 pb-5">
              <BrandLogo height={80} />
              <button type="button" className="grid h-11 w-11 place-items-center rounded-lg bg-white text-navy shadow-[0_10px_22px_rgb(24_23_21/0.07)] transition hover:bg-[#fff7ea] hover:text-gold" onClick={() => setOpen(false)} aria-label="إغلاق القائمة">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-6 grid gap-2 text-base font-bold text-navy" aria-label="التنقل الجانبي">
              {navigation.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn("flex min-h-12 items-center justify-between rounded-lg px-5 transition", active ? "bg-white text-gold shadow-[0_10px_22px_rgb(167_129_94/0.1)]" : "bg-white/55 text-navy hover:bg-white hover:text-gold")}
                  >
                    {item.labelAr}
                    {active ? <Building2 className="h-4 w-4" /> : null}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto grid gap-3 pt-5">
              <ButtonLink href="/submit-asset" variant="dark" className="rounded-lg">
                <Plus className="ml-2 h-4 w-4" />
                إضافة أصل عقاري
              </ButtonLink>
              <ButtonLink href="/auth/login" variant="secondary" className="rounded-lg border-transparent bg-white">
                <LogIn className="ml-2 h-4 w-4" />
                تسجيل الدخول
              </ButtonLink>
            </div>
          </aside>
        </div>
      ) : null}
      </header>
    </>
  );
}
