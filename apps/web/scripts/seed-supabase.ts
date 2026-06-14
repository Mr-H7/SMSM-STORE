/**
 * One-time / idempotent seed for SMSM STORE Supabase.
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 *
 * Usage: npm run seed:supabase --prefix apps/web
 */
import { createClient } from "@supabase/supabase-js";
import { categories } from "../lib/data/categories";
import { products } from "../lib/data/products";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function seedCategories() {
  const slugToId = new Map<string, string>();

  for (const category of categories) {
    const { data: existing } = await supabase.from("categories").select("id").eq("slug", category.slug).maybeSingle();
    if (existing?.id) {
      slugToId.set(category.slug, existing.id);
      console.log(`Category exists: ${category.slug}`);
      continue;
    }

    const { data, error } = await supabase
      .from("categories")
      .insert({
        slug: category.slug,
        name_ar: category.nameAr,
        name_en: category.nameEn,
        image_url: category.image,
        is_active: category.isActive
      })
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(`Failed to seed category ${category.slug}: ${error?.message}`);
    }

    slugToId.set(category.slug, data.id);
    console.log(`Category created: ${category.slug}`);
  }

  return slugToId;
}

async function seedProducts(slugToId: Map<string, string>) {
  let created = 0;
  let skipped = 0;

  for (const product of products) {
    const { data: existing } = await supabase.from("products").select("id").eq("slug", product.slug).maybeSingle();
    if (existing?.id) {
      skipped += 1;
      continue;
    }

    const categoryId = slugToId.get(product.category);
    const { error } = await supabase.from("products").insert({
      category_id: categoryId ?? null,
      slug: product.slug,
      model: product.model,
      brand: product.brand,
      name_ar: product.nameAr,
      name_en: product.nameEn,
      description_ar: product.descriptionAr,
      description_en: product.descriptionEn,
      sell_price: product.price,
      sizes: product.sizes,
      colors: product.colors,
      stock: product.stock,
      status: product.status,
      badge: product.badge ?? null,
      featured: product.featured,
      on_offer: product.onOffer,
      best_seller: product.bestSeller ?? false,
      images: product.images
    });

    if (error) {
      throw new Error(`Failed to seed product ${product.slug}: ${error.message}`);
    }

    created += 1;
  }

  console.log(`Products created: ${created}, skipped (already exist): ${skipped}, total inventory: ${products.length}`);
}

async function main() {
  const slugToId = await seedCategories();
  await seedProducts(slugToId);
  console.log("Seed completed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
