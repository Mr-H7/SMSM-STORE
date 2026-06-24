import type { Metadata } from "next";
export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { ProductCatalogClient } from "@/components/storefront/ProductCatalogClient";
import { getCategories, getPublicProducts } from "@/lib/system-api/queries";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolved = await params;
  if (!isLocale(resolved.locale)) return {};
  return localizedMetadata(resolved.locale, "products", "/products");
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolved = await params;
  if (!isLocale(resolved.locale)) notFound();
  const locale = resolved.locale;
  const dictionary = getDictionary(locale);
  const [products, categories] = await Promise.all([getPublicProducts(), getCategories()]);

  return (
    <div className="smsm-container py-8">
      <header className="mb-8 border-b border-[#252525] pb-6">
        <p className="smsm-label text-[#cd0000]">{dictionary.nav.products}</p>
        <h1 className="smsm-heading mt-2 text-4xl font-extrabold">{dictionary.products.title}</h1>
        <p className="mt-2 text-sm text-[#b8b8b8]">{dictionary.products.subtitle}</p>
      </header>
      <ProductCatalogClient locale={locale} products={products} categories={categories} />
    </div>
  );
}
