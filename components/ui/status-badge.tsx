export function StatusBadge({ label, inverse = false }: { label: string; inverse?: boolean }) {
  return <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold ${inverse ? "border-gold/45 bg-gold/12 text-gold-light" : "border-gold/30 bg-gold/10 text-gold"}`}>{label}</span>;
}
