import { Product } from "@/lib/types";
import { resolveProductImages } from "@/lib/data/product-images";

const defaultSizes = ["40", "41", "42", "43", "45"];
const image = "/images/template.svg";

type SeedProduct = {
  sku: string;
  modelAr: string;
  modelEn: string;
  brand: string;
  slug: string;
  imageFolder: string;
  category: string;
  price: number;
  stock: number;
  colors: string[];
  badge?: string;
  featured?: boolean;
  onOffer?: boolean;
  bestSeller?: boolean;
  oldPrice?: number;
};

const categoryAr: Record<string, string> = {
  sneakers: "سنيكرز",
  "sport-shoes": "أحذية رياضية",
  "casual-shoes": "أحذية كاجوال",
  running: "جري وأداء",
  "luxury-sneakers": "سنيكرز فاخر",
  "air-max": "اير ماكس",
  jordan: "جوردن",
  adidas: "أديداس",
  "new-balance": "نيو بالنس"
};

const makeProduct = (index: number, item: SeedProduct): Product => {
  const lowStock = item.stock <= 3;
  const badge = lowStock ? "LOW STOCK" : item.badge;
  const qualityGrade = "MIRROR";
  const shortDescriptionAr = `${item.modelAr} من ${item.brand} بجودة ${qualityGrade} وسعر بيع واضح.`;
  const shortDescriptionEn = `${item.brand} ${item.modelEn} in ${qualityGrade} grade with clear sell-only pricing.`;

  return {
    id: `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`,
    sku: item.sku,
    model: item.modelAr,
    brand: item.brand,
    nameAr: `${item.modelAr} - ${item.brand}`,
    nameEn: `${item.brand} ${item.modelEn}`,
    slug: item.slug,
    shortDescriptionAr,
    shortDescriptionEn,
    descriptionAr: `${shortDescriptionAr} اختيار مناسب لعشاق السنيكرز من SMSM STORE، بتفاصيل Premium ومقاسات ${defaultSizes.join(" / ")}. التصنيف: ${categoryAr[item.category] ?? "سنيكرز"}.`,
    descriptionEn: `${shortDescriptionEn} A premium SMSM STORE sneaker pick with clean styling, daily comfort, and sizes ${defaultSizes.join(" / ")}. Category: ${item.category.replace(/-/g, " ")}.`,
    qualityGrade,
    price: item.price,
    oldPrice: item.oldPrice,
    category: item.category,
    sizes: defaultSizes,
    colors: item.colors,
    stock: item.stock,
    status: item.stock > 0 ? "active" : "out-of-stock",
    badge,
    featured: item.featured ?? index <= 10,
    onOffer: item.onOffer ?? false,
    images: resolveProductImages(item, [image, image]),
    isActive: true,
    bestSeller: item.bestSeller ?? false,
    createdAt: `2026-06-${String(Math.min(index, 30)).padStart(2, "0")}`
  };
};

const catalog: SeedProduct[] = [
  { sku: "SMSM-MIR-ADZ-001", modelAr: "أديداس أدزيرو", modelEn: "Adizero", brand: "Adidas", slug: "adidas-adizero-mirror", imageFolder: "ADIDAS ADZIRO", category: "adidas", price: 1550, stock: 9, colors: ["Black", "White"], badge: "NEW", featured: true },
  { sku: "SMSM-MIR-AFBR-002", modelAr: "اير فورس أسود في أحمر", modelEn: "Air Force Black Red", brand: "Nike", slug: "nike-air-force-black-red-mirror", imageFolder: "AIR FORCE BLACK RED", category: "sneakers", price: 1400, oldPrice: 1550, stock: 4, colors: ["Black", "Red"], badge: "OFFER", onOffer: true },
  { sku: "SMSM-MIR-AFWL-003", modelAr: "اير فورس أبيض ليمتد", modelEn: "Air Force White Limited", brand: "Nike", slug: "nike-air-force-white-limited-mirror", imageFolder: "AIR FORCE WHITE LIMITED", category: "sneakers", price: 1250, stock: 8, colors: ["White"], badge: "LIMITED", featured: true },
  { sku: "SMSM-MIR-AFWM-004", modelAr: "اير فورس أبيض ميرور مولتن", modelEn: "Air Force White Mirror Molten", brand: "Nike", slug: "nike-air-force-white-mirror-molten", imageFolder: "AIR FORCE WHITE MIRROR MOLTEN METAL", category: "sneakers", price: 1100, stock: 13, colors: ["White"], badge: "BESTSELLER", bestSeller: true, featured: true },
  { sku: "SMSM-MIR-AM95C-005", modelAr: "اير ماكس 95 كورتز", modelEn: "Air Max 95 Cortz", brand: "Nike", slug: "nike-air-max-95-cortz-mirror", imageFolder: "AIR MAX 95 CORTZ", category: "air-max", price: 1850, stock: 7, colors: ["Black", "Gray"], badge: "NEW" },
  { sku: "SMSM-MIR-AM95W-006", modelAr: "اير ماكس 95 ليمتد وايت", modelEn: "Air Max 95 Limited White", brand: "Nike", slug: "nike-air-max-95-limited-white", imageFolder: "AIR MAX 95 LIMITED WHITE", category: "air-max", price: 1800, stock: 6, colors: ["White", "Gray"], badge: "LIMITED" },
  { sku: "SMSM-MIR-AM95S-007", modelAr: "اير ماكس 95 ساينا", modelEn: "Air Max 95 Sayna", brand: "Nike", slug: "nike-air-max-95-sayna-mirror", imageFolder: "AIR MAX 95 SAYNA", category: "air-max", price: 1800, stock: 6, colors: ["Gray", "Black"], badge: "NEW" },
  { sku: "SMSM-MIR-AM97-008", modelAr: "اير ماكس 97", modelEn: "Air Max 97", brand: "Nike", slug: "nike-air-max-97-mirror", imageFolder: "AIR MAX 97", category: "air-max", price: 1500, oldPrice: 1700, stock: 27, colors: ["Silver", "White"], badge: "OFFER", onOffer: true, bestSeller: true },
  { sku: "SMSM-MIR-AM720-009", modelAr: "اير ماكس 720", modelEn: "Air Max 720", brand: "Nike", slug: "nike-air-max-720-mirror", imageFolder: "AIR MAX 720", category: "air-max", price: 1650, stock: 12, colors: ["Black", "Silver"], badge: "NEW", featured: true },
  { sku: "SMSM-MIR-AM2021-010", modelAr: "اير ماكس 2021 SE", modelEn: "Air Max 2021 SE", brand: "Nike", slug: "nike-air-max-2021-se-mirror", imageFolder: "AIR MAX 2021 SE", category: "air-max", price: 1750, stock: 5, colors: ["Black", "White"], badge: "LIMITED" },
  { sku: "SMSM-MIR-AMQ-011", modelAr: "الكسندر ماكوين", modelEn: "Oversized Sneaker", brand: "Alexander McQueen", slug: "alexander-mcqueen-oversized-mirror", imageFolder: "ALEXANDER MCQUEEN", category: "luxury-sneakers", price: 1100, stock: 10, colors: ["White"], badge: "LIMITED" },
  { sku: "SMSM-MIR-ASX-012", modelAr: "اسكس", modelEn: "Runner", brand: "Asics", slug: "asics-runner-mirror", imageFolder: "ASICS", category: "running", price: 1700, stock: 12, colors: ["White", "Black"], badge: "BESTSELLER", bestSeller: true, featured: true },
  { sku: "SMSM-MIR-B22-013", modelAr: "ديور B22", modelEn: "B22", brand: "Dior", slug: "dior-b22-mirror", imageFolder: "B22", category: "luxury-sneakers", price: 1700, stock: 2, colors: ["White", "Gray"], badge: "LIMITED" },
  { sku: "SMSM-MIR-BTRK-014", modelAr: "بالنسياجا تراك", modelEn: "Track Sneaker", brand: "Balenciaga", slug: "balenciaga-track-sneaker-mirror", imageFolder: "BALENCIAGA TRACK", category: "luxury-sneakers", price: 3300, stock: 3, colors: ["Black", "Gray"], badge: "LIMITED", featured: true },
  { sku: "SMSM-MIR-BAPE-015", modelAr: "بايب", modelEn: "Bape Style", brand: "Bape", slug: "bape-style-mirror", imageFolder: "BAPE", category: "casual-shoes", price: 1600, stock: 6, colors: ["Black", "White"], badge: "NEW" },
  { sku: "SMSM-MIR-J4-016", modelAr: "جوردن 4", modelEn: "Jordan 4", brand: "Jordan", slug: "jordan-4-mirror", imageFolder: "JORDAN 4", category: "jordan", price: 1500, stock: 10, colors: ["Black", "White"], badge: "BESTSELLER", bestSeller: true, featured: true },
  { sku: "SMSM-MIR-J11-017", modelAr: "جوردن 11", modelEn: "Jordan 11", brand: "Jordan", slug: "jordan-11-mirror", imageFolder: "JORDAN 11", category: "jordan", price: 1800, stock: 8, colors: ["Black", "White"], badge: "NEW", featured: true },
  { sku: "SMSM-MIR-J13-018", modelAr: "جوردن 13", modelEn: "Jordan 13", brand: "Jordan", slug: "jordan-13-mirror", imageFolder: "JORDAN 13", category: "jordan", price: 1850, stock: 5, colors: ["Black", "Red"], badge: "LIMITED" },
  { sku: "SMSM-MIR-LVSK-019", modelAr: "لوي فيتون سكايت", modelEn: "Skate Sneaker", brand: "Louis Vuitton", slug: "louis-vuitton-skate-sneaker", imageFolder: "LV SKATE", category: "luxury-sneakers", price: 2200, stock: 11, colors: ["White", "Brown"], badge: "LIMITED", featured: true },
  { sku: "SMSM-MIR-LVTR-020", modelAr: "لوي فيتون ترينر", modelEn: "Trainer Sneaker", brand: "Louis Vuitton", slug: "louis-vuitton-trainer-sneaker", imageFolder: "LV TRAINER", category: "luxury-sneakers", price: 2300, stock: 8, colors: ["White", "Black"], badge: "NEW" },
  { sku: "SMSM-MIR-NB530-021", modelAr: "نيو بالنس 530", modelEn: "530", brand: "New Balance", slug: "new-balance-530-mirror", imageFolder: "NEW BALANCE 530", category: "new-balance", price: 1400, stock: 10, colors: ["White", "Navy"], badge: "BESTSELLER", bestSeller: true },
  { sku: "SMSM-MIR-NB2000-022", modelAr: "نيو بالنس 2000", modelEn: "2000", brand: "New Balance", slug: "new-balance-2000-mirror", imageFolder: "NEW BALANCE 2000", category: "new-balance", price: 1700, stock: 6, colors: ["Gray", "Black"], badge: "NEW" },
  { sku: "SMSM-MIR-NB9060-023", modelAr: "نيو بالنس 9060", modelEn: "9060", brand: "New Balance", slug: "new-balance-9060-mirror", imageFolder: "NEW BALANCE 9060", category: "new-balance", price: 1550, stock: 6, colors: ["Gray", "White"], badge: "BESTSELLER", bestSeller: true },
  { sku: "SMSM-MIR-SHX-024", modelAr: "نايكي شوكس", modelEn: "Shox", brand: "Nike", slug: "nike-shox-mirror", imageFolder: "NIKE SHOX", category: "sport-shoes", price: 1600, stock: 17, colors: ["Black", "Red"], badge: "NEW", featured: true },
  { sku: "SMSM-MIR-SHXS-025", modelAr: "نايكي شوكس سوبريم", modelEn: "Shox Supreme", brand: "Nike", slug: "nike-shox-supreme-mirror", imageFolder: "NIKE SHOX SUPREME", category: "sport-shoes", price: 1600, stock: 5, colors: ["Black", "Red"], badge: "LIMITED" },
  { sku: "SMSM-MIR-VM-026", modelAr: "نايكي VM", modelEn: "VM Sneaker", brand: "Nike", slug: "nike-vm-sneaker-mirror", imageFolder: "NIKE VM", category: "sport-shoes", price: 1800, stock: 2, colors: ["Black"], badge: "LIMITED" },
  { sku: "SMSM-MIR-TN1-027", modelAr: "تي ان 1", modelEn: "TN 1", brand: "Nike", slug: "nike-tn-1-mirror", imageFolder: "TN 1", category: "sport-shoes", price: 1400, stock: 7, colors: ["Black", "Orange"], badge: "NEW" },
  { sku: "SMSM-MIR-TN3-028", modelAr: "تي ان 3", modelEn: "TN 3", brand: "Nike", slug: "nike-tn-3-mirror", imageFolder: "TN 3", category: "sport-shoes", price: 1550, stock: 12, colors: ["Black", "Blue"], badge: "NEW" },
  { sku: "SMSM-MIR-TSB-029", modelAr: "ترافيس SB", modelEn: "Travis SB", brand: "Nike", slug: "nike-travis-sb-mirror", imageFolder: "TRAVIS SB", category: "casual-shoes", price: 1900, stock: 4, colors: ["Brown", "Black"], badge: "LIMITED" },
  { sku: "SMSM-MIR-ADISTAR-030", modelAr: "أديداس أديستار", modelEn: "Adistar", brand: "Adidas", slug: "adidas-adistar-mirror", imageFolder: "ADIDAS ADISTAR", category: "adidas", price: 1550, stock: 26, colors: ["Black", "White"], badge: "BESTSELLER", bestSeller: true, featured: true }
];

export const approvedProductSkus = catalog.map((item) => item.sku);
export const products: Product[] = catalog.map((item, index) => makeProduct(index + 1, item));
