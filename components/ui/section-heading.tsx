export function SectionHeading({ title, subtitle, inverse = false, compact = false }: { title: string; subtitle?: string; inverse?: boolean; compact?: boolean }) {
  return (
    <div className={`mx-auto text-center ${compact ? "mb-5" : "mb-8"} max-w-3xl`}>
      <div className="flex items-center justify-center gap-4">
        <span className={`hidden h-px w-16 md:block ${inverse ? "bg-gold-light/70" : "bg-gold/70"}`} aria-hidden="true" />
        <h2 className={`font-display font-extrabold leading-tight ${compact ? "text-2xl md:text-[34px]" : "text-3xl md:text-5xl"} ${inverse ? "text-white" : "text-ink"}`}>{title}</h2>
        <span className={`hidden h-px w-16 md:block ${inverse ? "bg-gold-light/70" : "bg-gold/70"}`} aria-hidden="true" />
      </div>
      {subtitle ? <p className={`mx-auto mt-2 max-w-2xl text-xs leading-6 md:text-sm ${inverse ? "text-white/68" : "text-muted"}`}>{subtitle}</p> : null}
    </div>
  );
}
