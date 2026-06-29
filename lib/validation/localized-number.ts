export function localizedNumber(value: unknown) {
  if (typeof value !== "string") return value;
  const normalized = value
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replaceAll(",", "")
    .replace(/[^\d.-]/g, "");
  return normalized ? Number(normalized) : value;
}
