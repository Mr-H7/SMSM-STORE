import { Category, CustomerMessage, Order, Product } from "@/lib/types";
import { getProductPrice, getPublicNames } from "@/lib/product-display";

type ProductRow = Record<string, any>;
type CategoryRow = Record<string, any>;
type MessageRow = Record<string, any>;
type OrderRow = Record<string, any>;

const IMAGE_FALLBACK = "/images/smsm-logo.png";
const missingLocalImages = new Set([
  "/images/SHOES/B22/REAR.png",
  "/images/SHOES/B22/SOLE.png"
]);
const normalizeImage = (value?: string | null) => {
  if (!value || value === "/images/template.svg" || missingLocalImages.has(value)) return IMAGE_FALLBACK;
  if (value === "/images/SHOES/TN%201/LEFTpng.png") return "/images/SHOES/TN%201/LEFT.png";
  return value;
};

export function mapCategory(row: CategoryRow, productCount = 0): Category {
  return {
    id: row.id,
    nameAr: row.name_ar,
    nameEn: row.name_en,
    slug: row.slug,
    image: normalizeImage(row.image_url),
    productCount,
    isActive: row.is_active
  };
}

export function mapProduct(row: ProductRow): Product {
  const names = getPublicNames({ slug: row.slug, nameAr: row.name_ar, nameEn: row.name_en, brand: row.brand });
  const normalizedImages = row.images?.length
    ? row.images.map((image: string) => normalizeImage(image))
    : [IMAGE_FALLBACK];
  const realImages = normalizedImages.filter((image: string) => image !== IMAGE_FALLBACK);
  const badge = ["NEW", "BESTSELLER", "LIMITED", "OFFER"].includes(String(row.badge ?? "").toUpperCase())
    ? String(row.badge).toUpperCase()
    : undefined;

  return {
    id: row.id,
    sku: row.sku ?? undefined,
    model: row.model,
    brand: row.brand,
    nameAr: names.nameAr,
    nameEn: names.nameEn,
    slug: row.slug,
    shortDescriptionAr: row.short_description_ar ?? undefined,
    shortDescriptionEn: row.short_description_en ?? undefined,
    descriptionAr: row.description_ar ?? "",
    descriptionEn: row.description_en ?? "",
    qualityGrade: row.quality_grade ?? undefined,
    price: getProductPrice(row.slug, row.sell_price),
    oldPrice: row.old_price ?? undefined,
    category: row.categories?.slug ?? row.category_slug ?? row.category ?? "",
    sizes: row.sizes ?? [],
    colors: row.colors ?? [],
    stock: row.stock ?? 0,
    status: row.status,
    badge,
    featured: Boolean(row.featured),
    onOffer: Boolean(row.on_offer),
    images: realImages.length ? realImages : [IMAGE_FALLBACK],
    isActive: row.status === "active",
    bestSeller: Boolean(row.best_seller),
    createdAt: row.created_at
  };
}

export function mapMessage(row: MessageRow): CustomerMessage {
  return {
    id: row.id,
    name: row.name,
    contact: row.contact,
    message: row.message,
    status: row.status,
    createdAt: row.created_at
  };
}

export function mapOrder(row: OrderRow): Order {
  return {
    id: row.order_number ?? row.id,
    customerName: row.customer_name,
    phone: row.phone,
    address: row.address,
    notes: row.notes ?? undefined,
    status: row.status,
    total: row.total,
    createdAt: row.created_at,
    items: (row.order_items ?? []).map((item: Record<string, any>) => ({
      productId: item.product_id,
      productNameAr: item.product_name_ar,
      productNameEn: item.product_name_en,
      image: normalizeImage(item.image),
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      unitPrice: item.unit_price
    }))
  };
}
