"use client";

import type { ReactNode } from "react";

export function ScrollButton({
  targetId,
  direction,
  className,
  ariaLabel,
  children,
}: {
  targetId: string;
  direction: "previous" | "next";
  className?: string;
  ariaLabel: string;
  children: ReactNode;
}) {
  function handleClick() {
    const target = document.getElementById(targetId);
    if (!target) return;

    const amount = Math.max(260, Math.round(target.clientWidth * 0.75));
    target.scrollBy({
      left: direction === "next" ? -amount : amount,
      behavior: "smooth",
    });
  }

  return (
    <button type="button" className={className} aria-label={ariaLabel} onClick={handleClick}>
      {children}
    </button>
  );
}
