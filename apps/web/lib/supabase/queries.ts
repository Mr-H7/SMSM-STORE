import "server-only";

import { categories as seedCategories } from "@/lib/data/categories";
import { messages as seedMessages } from "@/lib/data/messages";
import { orders as seedOrders } from "@/lib/data/orders";
import { approvedProductSkus, products as seedProducts } from "@/lib/data/products";
import { createSupabasePublicClient, requireAdmin } from "@/lib/supabase/server";
import { mapCategory, mapMessage, mapOrder, mapProduct } from "@/lib/supabase/mappers";

const isStorefrontProduct = (status: string) => status === "active" || status === "out-of-stock";

export async function getProducts() {
  const supabase = createSupabasePublicClient();
  if (!supabase) return seedProducts;

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(slug)")
    .in("sku", approvedProductSkus)
    .order("created_at", { ascending: false });

  if (error || !data) return seedProducts;
  return data.map(mapProduct);
}

export async function getPublicProducts() {
  return (await getProducts()).filter((product) => isStorefrontProduct(product.status));
}

export async function getAdminProducts() {
  try {
    const { serviceClient } = await requireAdmin();
    const { data, error } = await serviceClient
      .from("products")
      .select("*, categories(slug)")
      .in("sku", approvedProductSkus)
      .order("created_at", { ascending: false });
    if (!error && data) return data.map(mapProduct);
  } catch {
    // fall through to public/seed data for local dev without auth
  }
  return getProducts();
}

export async function getAdminCategories() {
  try {
    const { serviceClient } = await requireAdmin();
    const { data, error } = await serviceClient.from("categories").select("*").order("created_at", { ascending: true });
    if (!error && data) {
      const products = await getAdminProducts();
      return data.map((row) => mapCategory(row, products.filter((product) => product.category === row.slug).length));
    }
  } catch {
    // fall through
  }
  return getCategories();
}

export async function getAdminOrders() {
  try {
    const { serviceClient } = await requireAdmin();
    const { data, error } = await serviceClient
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (!error && data) return data.map(mapOrder);
  } catch {
    // fall through
  }
  return getOrders();
}

export async function getAdminMessages() {
  try {
    const { serviceClient } = await requireAdmin();
    const { data, error } = await serviceClient.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (!error && data) return data.map(mapMessage);
  } catch {
    // fall through
  }
  return getMessages();
}

export async function getProductBySlug(slug: string) {
  return (await getProducts()).find((product) => product.slug === slug) ?? null;
}

export async function getCategories() {
  const supabase = createSupabasePublicClient();
  if (!supabase) return seedCategories;

  const { data, error } = await supabase.from("categories").select("*").order("created_at", { ascending: true });
  if (error || !data) return seedCategories;

  const products = await getProducts();
  return data.map((row) => mapCategory(row, products.filter((product) => product.category === row.slug).length));
}

export async function getOrders() {
  const supabase = createSupabasePublicClient();
  if (!supabase) return seedOrders;

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error || !data) return seedOrders;
  return data.map(mapOrder);
}

export async function getMessages() {
  const supabase = createSupabasePublicClient();
  if (!supabase) return seedMessages;

  const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
  if (error || !data) return seedMessages;
  return data.map(mapMessage);
}
