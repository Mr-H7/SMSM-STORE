import { Locale } from "@/lib/types";

const publicNames: Record<string, { ar: string; en: string }> = {
  "adidas-adizero-mirror": { ar: "أدزيرو", en: "Adizero" },
  "adidas-adistar-mirror": { ar: "أديستار", en: "Adistar" },
  "asics-runner-mirror": { ar: "أسكس", en: "Asics" },
  "dior-b22-mirror": { ar: "B22", en: "B22" },
  "louis-vuitton-skate-sneaker": { ar: "LV سكايت", en: "LV Skate" },
  "louis-vuitton-trainer-sneaker": { ar: "LV ترينر", en: "LV Trainer" },
  "new-balance-530-mirror": { ar: "NB 530", en: "NB 530" },
  "new-balance-2000-mirror": { ar: "NB 2000", en: "NB 2000" },
  "new-balance-9060-mirror": { ar: "NB 9060", en: "NB 9060" },
  "nike-vm-sneaker-mirror": { ar: "VM", en: "VM" },
  "nike-shox-mirror": { ar: "شوكس", en: "Shox" },
  "nike-shox-supreme-mirror": { ar: "شوكس سوبريم", en: "Shox Supreme" },
  "nike-tn-1-mirror": { ar: "TN1", en: "TN1" },
  "nike-tn-3-mirror": { ar: "TN3", en: "TN3" }
};

export const productPriceOverrides: Record<string, number> = {
  "adidas-adistar-mirror": 1550,
  "nike-travis-sb-mirror": 1500,
  "nike-tn-3-mirror": 1600,
  "nike-tn-1-mirror": 1500,
  "nike-vm-sneaker-mirror": 1800,
  "nike-shox-supreme-mirror": 1600,
  "nike-shox-mirror": 1600,
  "new-balance-530-mirror": 1500,
  "new-balance-2000-mirror": 1800,
  "new-balance-9060-mirror": 1600,
  "louis-vuitton-skate-sneaker": 2200,
  "louis-vuitton-trainer-sneaker": 2200,
  "jordan-13-mirror": 1750,
  "jordan-11-mirror": 1500,
  "jordan-4-mirror": 1500,
  "dior-b22-mirror": 2200,
  "asics-runner-mirror": 1700,
  "nike-air-force-black-red-mirror": 1500,
  "nike-air-force-white-limited-mirror": 1500
};

const stripBrand = (name: string, brand: string) => {
  const suffix = ` - ${brand}`;
  if (name.endsWith(suffix)) return name.slice(0, -suffix.length).trim();
  const prefix = `${brand} `;
  if (name.toLowerCase().startsWith(prefix.toLowerCase())) return name.slice(prefix.length).trim();
  return name;
};

export function getPublicProductName(
  product: { slug: string; nameAr: string; nameEn: string; brand: string },
  locale: Locale
) {
  return publicNames[product.slug]?.[locale] ?? stripBrand(locale === "ar" ? product.nameAr : product.nameEn, product.brand);
}

export function getPublicNames(product: { slug: string; nameAr: string; nameEn: string; brand: string }) {
  return {
    nameAr: getPublicProductName(product, "ar"),
    nameEn: getPublicProductName(product, "en")
  };
}

export function getProductPrice(slug: string, fallback: number) {
  return productPriceOverrides[slug] ?? fallback;
}

export function getProductBadgeLabel(badge: string | undefined, locale: Locale) {
  if (!badge) return undefined;
  const normalized = badge.toUpperCase();
  const labels: Record<string, { ar: string; en: string }> = {
    NEW: { ar: "جديد", en: "New" },
    BESTSELLER: { ar: "الأكثر مبيعاً", en: "Bestseller" },
    LIMITED: { ar: "محدود", en: "Limited" },
    OFFER: { ar: "عرض", en: "Offer" }
  };
  return labels[normalized]?.[locale];
}
