import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  height = 64,
  imageClassName,
  priority = false,
}: {
  className?: string;
  height?: number;
  imageClassName?: string;
  priority?: boolean;
}) {
  return (
    <Link href="/" className={cn("inline-flex items-center", className)} aria-label="مهابة الرئيسية">
      <Image
        src="/brand/mahabah-logo-transparent.png"
        alt="مهابة لإدارة المساهمات العقارية"
        width={822}
        height={731}
        priority={priority}
        unoptimized
        sizes="(max-width: 768px) 96px, 132px"
        style={{ height, width: "auto" }}
        className={cn("object-contain", imageClassName)}
      />
    </Link>
  );
}
