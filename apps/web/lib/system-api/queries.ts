import "server-only";

import { categories as seedCategories } from "@/lib/data/categories";
import { products as seedProducts } from "@/lib/data/products";
import { Category, Product } from "@/lib/types";

type ProductsResponse = { ok: true; products: Product[] };
type ProductResponse = { ok: true; product: Product };
type CategoriesResponse = { ok: true; categories: Category[] };

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
  return (await getJson<ProductsResponse>("/api/storefront/v1/products", ["storefront-products"])).products;
}

export const getProducts = getPublicProducts;

export async function getProductBySlug(slug: string) {
  try {
    return (
      await getJson<ProductResponse>(
        "/api/storefront/v1/products/" + encodeURIComponent(slug),
        ["storefront-products", "storefront-product-" + slug]
      )
    ).product;
  } catch (error) {
    if (error instanceof Error && error.message === "Product not found.") return null;
    throw error;
  }
}

export async function getCategories() {
  return (await getJson<CategoriesResponse>("/api/storefront/v1/categories", ["storefront-categories"])).categories;
}
