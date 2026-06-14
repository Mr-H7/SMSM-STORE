import { Category, CustomerMessage, Order, Product } from "@/lib/types";

type ProductRow = Record<string, any>;
type CategoryRow = Record<string, any>;
type MessageRow = Record<string, any>;
type OrderRow = Record<string, any>;

export function mapCategory(row: CategoryRow, productCount = 0): Category {
  return {
    id: row.id,
    nameAr: row.name_ar,
    nameEn: row.name_en,
    slug: row.slug,
    image: row.image_url,
    productCount,
    isActive: row.is_active
  };
}

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    sku: row.sku ?? undefined,
    model: row.model,
    brand: row.brand,
    nameAr: row.name_ar,
    nameEn: row.name_en,
    slug: row.slug,
    shortDescriptionAr: row.short_description_ar ?? undefined,
    shortDescriptionEn: row.short_description_en ?? undefined,
    descriptionAr: row.description_ar ?? "",
    descriptionEn: row.description_en ?? "",
    qualityGrade: row.quality_grade ?? undefined,
    price: row.sell_price,
    oldPrice: row.old_price ?? undefined,
    category: row.categories?.slug ?? row.category_slug ?? row.category ?? "",
    sizes: row.sizes ?? [],
    colors: row.colors ?? [],
    stock: row.stock ?? 0,
    status: row.status,
    badge: row.badge ?? undefined,
    featured: Boolean(row.featured),
    onOffer: Boolean(row.on_offer),
    images: row.images?.length ? row.images : ["/images/template.svg"],
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
      image: item.image,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      unitPrice: item.unit_price
    }))
  };
}
