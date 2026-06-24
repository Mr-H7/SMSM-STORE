import { CartItem, MessageStatus, OrderStatus, Product } from "@/lib/types";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const LIMITS = {
  name: 120,
  phone: 40,
  address: 300,
  notes: 500,
  contact: 120,
  message: 2000,
  slug: 80,
  model: 120,
  brand: 80,
  sku: 80,
  description: 2000,
  size: 20,
  color: 40,
  imageUrl: 500,
  maxImages: 10,
  maxCartItems: 20,
  maxQuantity: 99,
  maxUploadBytes: 3 * 1024 * 1024
} as const;

const ALLOWED_UPLOAD_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

export function clampText(value: unknown, max: number): string {
  return String(value ?? "").trim().slice(0, max);
}

export function parsePositiveInt(value: unknown, max = Number.MAX_SAFE_INTEGER): number | null {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > max) return null;
  return parsed;
}

export function parseNonNegativeInt(value: unknown, max = Number.MAX_SAFE_INTEGER): number | null {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > max) return null;
  return parsed;
}

export function isProductStatus(value: string): value is Product["status"] {
  return value === "active" || value === "inactive" || value === "out-of-stock";
}

export function isOrderStatus(value: string): value is OrderStatus {
  return ["new", "contacted", "processing", "completed", "cancelled"].includes(value);
}

export function isMessageStatus(value: string): value is MessageStatus {
  return value === "unread" || value === "read" || value === "archived";
}

export function isValidSlug(value: string): boolean {
  return value.length > 0 && value.length <= LIMITS.slug && SLUG_RE.test(value);
}

export type CheckoutCustomerInput = {
  name: string;
  phone: string;
  address: string;
  notes?: string;
};

export function validateCheckoutCustomer(customer: CheckoutCustomerInput): { ok: true; value: CheckoutCustomerInput } | { ok: false; message: string } {
  const name = clampText(customer.name, LIMITS.name);
  const phone = clampText(customer.phone, LIMITS.phone);
  const address = clampText(customer.address, LIMITS.address);
  const notes = customer.notes ? clampText(customer.notes, LIMITS.notes) : undefined;

  if (!name || !phone || !address) {
    return { ok: false, message: "Customer name, phone, and address are required." };
  }

  return { ok: true, value: { name, phone, address, notes } };
}

export function validateCartItems(items: CartItem[]): { ok: true; value: CartItem[] } | { ok: false; message: string } {
  if (!items.length) {
    return { ok: false, message: "Cart is empty." };
  }
  if (items.length > LIMITS.maxCartItems) {
    return { ok: false, message: "Cart has too many items." };
  }

  for (const item of items) {
    if (!isUuid(item.productId)) {
      return { ok: false, message: "Invalid product in cart." };
    }
    const quantity = parsePositiveInt(item.quantity, LIMITS.maxQuantity);
    if (!quantity) {
      return { ok: false, message: "Invalid quantity in cart." };
    }
    const size = clampText(item.size, LIMITS.size);
    if (!size) {
      return { ok: false, message: "Invalid size in cart." };
    }
    clampText(item.color, LIMITS.color);
  }

  return { ok: true, value: items };
}

export type ContactPayload = {
  name: string;
  contact: string;
  message: string;
  website?: string;
};

export function validateContactPayload(payload: ContactPayload): { ok: true; value: ContactPayload } | { ok: false; message: string } {
  if (payload.website?.trim()) {
    return { ok: false, message: "Message rejected." };
  }

  const name = clampText(payload.name, LIMITS.name);
  const contact = clampText(payload.contact, LIMITS.contact);
  const message = clampText(payload.message, LIMITS.message);

  if (!name || !contact || !message) {
    return { ok: false, message: "Name, contact, and message are required." };
  }

  return { ok: true, value: { name, contact, message } };
}

export type ProductPayload = {
  id?: string;
  category_id: string | null;
  sku?: string;
  slug: string;
  model: string;
  brand: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  short_description_ar?: string;
  short_description_en?: string;
  quality_grade?: string;
  sell_price: number;
  old_price?: number | null;
  stock: number;
  status: Product["status"];
  sizes: string[];
  colors: string[];
  images: string[];
  badge: string | null;
  featured: boolean;
  on_offer: boolean;
  best_seller: boolean;
};

export function validateProductPayload(formData: FormData, categoryId: string | null): { ok: true; value: ProductPayload } | { ok: false; message: string } {
  const id = String(formData.get("id") ?? "").trim();
  const slug = clampText(formData.get("slug"), LIMITS.slug).toLowerCase();
  const sellPrice = parseNonNegativeInt(formData.get("price"));
  const oldPrice = parseNonNegativeInt(formData.get("oldPrice"));
  const stock = parseNonNegativeInt(formData.get("stock"), 100000);
  const status = String(formData.get("status") ?? "active");
  const badge = String(formData.get("badge") ?? "").toUpperCase();

  if (id && !isUuid(id)) return { ok: false, message: "Invalid product id." };
  if (!isValidSlug(slug)) return { ok: false, message: "Invalid product slug." };
  if (sellPrice === null || sellPrice <= 0) return { ok: false, message: "Sell price must be a positive integer." };
  if (stock === null) return { ok: false, message: "Stock must be a non-negative integer." };
  if (!isProductStatus(status)) return { ok: false, message: "Invalid product status." };
  if (badge && !["NEW", "BESTSELLER", "LIMITED", "OFFER"].includes(badge)) {
    return { ok: false, message: "Invalid product badge." };
  }

  const sizes = String(formData.get("sizes") ?? "")
    .split(",")
    .map((item) => clampText(item, LIMITS.size))
    .filter(Boolean)
    .slice(0, 20);
  const colors = String(formData.get("colors") ?? "")
    .split(",")
    .map((item) => clampText(item, LIMITS.color))
    .filter(Boolean)
    .slice(0, 20);
  const images = String(formData.get("images") ?? "")
    .split(",")
    .map((item) => clampText(item, LIMITS.imageUrl))
    .filter(Boolean)
    .slice(0, LIMITS.maxImages);

  return {
    ok: true,
    value: {
      id: id || undefined,
      category_id: categoryId,
      sku: clampText(formData.get("sku"), LIMITS.sku) || undefined,
      slug,
      model: clampText(formData.get("model"), LIMITS.model),
      brand: clampText(formData.get("brand"), LIMITS.brand),
      name_ar: clampText(formData.get("nameAr"), LIMITS.name),
      name_en: clampText(formData.get("nameEn"), LIMITS.name),
      description_ar: clampText(formData.get("descriptionAr"), LIMITS.description),
      description_en: clampText(formData.get("descriptionEn"), LIMITS.description),
      short_description_ar: clampText(formData.get("shortDescriptionAr"), LIMITS.description) || undefined,
      short_description_en: clampText(formData.get("shortDescriptionEn"), LIMITS.description) || undefined,
      quality_grade: clampText(formData.get("qualityGrade"), LIMITS.brand) || "MIRROR",
      sell_price: sellPrice,
      old_price: oldPrice && oldPrice > sellPrice ? oldPrice : null,
      stock,
      status,
      sizes,
      colors,
      images: images.length ? images : ["/images/smsm-logo.png"],
      badge: badge || null,
      featured: formData.get("featured") === "on",
      on_offer: formData.get("onOffer") === "on",
      best_seller: formData.get("bestSeller") === "on"
    }
  };
}

export type CategoryPayload = {
  id?: string;
  name_ar: string;
  name_en: string;
  slug: string;
  image_url: string;
  is_active: boolean;
};

export function validateCategoryPayload(formData: FormData): { ok: true; value: CategoryPayload } | { ok: false; message: string } {
  const id = String(formData.get("id") ?? "").trim();
  const slug = clampText(formData.get("slug"), LIMITS.slug).toLowerCase();

  if (id && !isUuid(id)) return { ok: false, message: "Invalid category id." };
  if (!isValidSlug(slug)) return { ok: false, message: "Invalid category slug." };

  return {
    ok: true,
    value: {
      id: id || undefined,
      name_ar: clampText(formData.get("nameAr"), LIMITS.name),
      name_en: clampText(formData.get("nameEn"), LIMITS.name),
      slug,
      image_url: clampText(formData.get("image"), LIMITS.imageUrl) || "/images/smsm-logo.png",
      is_active: formData.get("isActive") === "on"
    }
  };
}

export function validateUploadFile(file: File): { ok: true; extension: string } | { ok: false; message: string } {
  if (!file || file.size <= 0) {
    return { ok: false, message: "No file selected." };
  }
  if (file.size > LIMITS.maxUploadBytes) {
    return { ok: false, message: "Image must be 3MB or smaller." };
  }
  if (!ALLOWED_UPLOAD_MIME.has(file.type)) {
    return { ok: false, message: "Only JPEG, PNG, and WebP images are allowed." };
  }

  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  return { ok: true, extension };
}
