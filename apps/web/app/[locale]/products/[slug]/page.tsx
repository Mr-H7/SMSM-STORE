import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailsClient } from "@/components/storefront/ProductDetailsClient";
import { getProductBySlug, getPublicProducts } from "@/lib/supabase/queries";
import { isLocale } from "@/lib/locale";

export default async function ProductDetailsPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const resolved = await params;
  if (!isLocale(resolved.locale)) notFound();
  const product = await getProductBySlug(resolved.slug);

  if (!product) {
    return (
      <div className="smsm-container py-8">
        <div className="smsm-panel p-8 text-center">
          <p>{resolved.locale === "ar" ? "المنتج غير موجود." : "Product not found."}</p>
          <Link href={`/${resolved.locale}/products`} className="smsm-btn-primary mt-4">
            {resolved.locale === "ar" ? "العودة للمنتجات" : "Back to products"}
          </Link>
        </div>
      </div>
    );
  }

  const related = (await getPublicProducts()).filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4);
  return <ProductDetailsClient locale={resolved.locale} product={product} related={related} />;
}
