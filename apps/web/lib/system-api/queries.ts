import "server-only";

import { categories as seedCategories } from "@/lib/data/categories";
import { products as seedProducts } from "@/lib/data/products";
import { Category, Product } from "@/lib/types";

type ProductsResponse = { ok: true; products: Product[] };
type ProductResponse = { ok: true; product: Product };
type CategoriesResponse = { ok: true; categories: Category[] };

const localShoeImagePrefix = "/images/SHOES/";
const supabaseProductImageBucket = "product-images";

function decodePublicImagePath(path: string) {
  if (!path.startsWith("/images/")) return path;
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}

function productImageCdnBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_SHOE_IMAGE_CDN_BASE_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, "");
  if (!supabaseUrl) return null;

  return `${supabaseUrl}/storage/v1/object/public/${supabaseProductImageBucket}`;
}

function encodeStoragePath(path: string) {
  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function normalizePublicImagePath(path: string) {
  const decodedPath = decodePublicImagePath(path);
  if (!decodedPath.startsWith(localShoeImagePrefix)) return decodedPath;

  const baseUrl = productImageCdnBaseUrl();
  if (!baseUrl) return decodedPath;

  const storagePath = decodedPath.replace(/^\/images\//, "");
  return `${baseUrl}/${encodeStoragePath(storagePath)}`;
}

function normalizeProductImages(product: Product): Product {
  return {
    ...product,
    images: product.images.map((image) => normalizePublicImagePath(image)),
  };
}

function normalizeCategoryImage(category: Category): Category {
  return {
    ...category,
    image: normalizePublicImagePath(category.image),
  };
}

function apiBase() {
  const value = process.env.SYSTEM_API_URL?.trim().replace(/\/$/, "");
  if (!value) {
    if (process.env.SYSTEM_API_ALLOW_SEED_FALLBACK === "true") return null;
    throw new Error("SYSTEM_API_URL is required for storefront data.");
  }
  return value;
}

async function getJson<T>(path: string, tags: string[]): Promise<T> {
  const base = apiBase();
  if (!base) {
    if (path === "/api/storefront/v1/categories") {
      return { ok: true, categories: seedCategories } as T;
    }
    if (path.startsWith("/api/storefront/v1/products/")) {
      const slug = decodeURIComponent(path.split("/").pop() ?? "");
      const product = seedProducts.find((item) => item.slug === slug);
      if (!product) throw new Error("Product not found.");
      return { ok: true, product } as T;
    }
    return { ok: true, products: seedProducts } as T;
  }

  const response = await fetch(base + path, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60, tags },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.ok) {
    throw new Error(body?.error?.message ?? "System API request failed.");
  }
  return body as T;
}

export async function getPublicProducts() {
  return (await getJson<ProductsResponse>("/api/storefront/v1/products", ["storefront-products"])).products.map(normalizeProductImages);
}

export const getProducts = getPublicProducts;

export async function getProductBySlug(slug: string) {
  try {
    const response = await getJson<ProductResponse>(
      "/api/storefront/v1/products/" + encodeURIComponent(slug),
      ["storefront-products", "storefront-product-" + slug]
    );
    return normalizeProductImages(response.product);
  } catch (error) {
    if (error instanceof Error && error.message === "Product not found.") return null;
    throw error;
  }
}

export async function getCategories() {
  return (await getJson<CategoriesResponse>("/api/storefront/v1/categories", ["storefront-categories"])).categories.map(normalizeCategoryImage);
}
