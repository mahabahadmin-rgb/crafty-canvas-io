import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-gold text-white shadow-[0_16px_34px_rgb(167_129_94/0.24)] hover:bg-[#8F6B4C]",
  secondary: "bg-white/84 text-navy shadow-[0_10px_24px_rgb(24_23_21/0.07)] hover:bg-white hover:text-gold",
  dark: "bg-[#1D1916] !text-white shadow-[0_14px_28px_rgb(29_25_22/0.2)] hover:bg-[#2D2823] hover:!text-white",
  outline: "border border-gold/50 text-gold bg-transparent hover:bg-gold hover:text-white",
  ghost: "text-navy hover:text-gold",
};

export function ButtonLink({ href, children, variant = "primary", className }: { href: string; children: ReactNode; variant?: keyof typeof variants; className?: string }) {
  return (
    <Link
      href={href}
      style={variant === "dark" ? { backgroundColor: "#1D1916", color: "#fff" } : undefined}
      className={cn("inline-flex min-h-11 items-center justify-center rounded-full border border-transparent px-5 text-sm font-semibold transition soft-lift focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-ivory [&_svg]:shrink-0", variants[variant], className)}
    >
      {children}
    </Link>
  );
}
