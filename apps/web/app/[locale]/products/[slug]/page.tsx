export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailsClient } from "@/components/storefront/ProductDetailsClient";
import { getProductBySlug, getPublicProducts } from "@/lib/system-api/queries";
import { isLocale } from "@/lib/locale";
import { productJsonLd } from "@/lib/seo";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://smsm-store.example.com").replace(new RegExp("/$"), "");

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const resolved = await params;
  if (!isLocale(resolved.locale)) return {};
  const product = await getProductBySlug(resolved.slug);
  if (!product) return { title: resolved.locale === "ar" ? "المنتج غير موجود" : "Product Not Found" };

  const title = resolved.locale === "ar" ? product.nameAr : product.nameEn;
  const description = resolved.locale === "ar"
    ? product.shortDescriptionAr || product.descriptionAr
    : product.shortDescriptionEn || product.descriptionEn;
  const path = "/" + resolved.locale + "/products/" + product.slug;

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        ar: "/ar/products/" + product.slug,
        en: "/en/products/" + product.slug
      }
    },
    openGraph: {
      title: title + " | SMSM STORE",
      description,
      url: siteUrl + path,
      type: "website",
      images: product.images?.length ? [{ url: product.images[0], alt: title }] : [{ url: "/images/smsm-logo.png", alt: "SMSM STORE" }]
    },
    twitter: {
      card: "summary_large_image",
      title: title + " | SMSM STORE",
      description,
      images: product.images?.length ? [product.images[0]] : ["/images/smsm-logo.png"]
    }
  };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const resolved = await params;
  if (!isLocale(resolved.locale)) notFound();
  const product = await getProductBySlug(resolved.slug);

  if (!product) {
    return (
      <div className="smsm-container py-8">
        <div className="smsm-panel p-8 text-center">
          <p>{resolved.locale === "ar" ? "المنتج غير موجود." : "Product not found."}</p>
          <Link href={"/" + resolved.locale + "/products"} className="smsm-btn-primary mt-4">
            {resolved.locale === "ar" ? "العودة للمنتجات" : "Back to products"}
          </Link>
        </div>
      </div>
    );
  }

  const products = await getPublicProducts();
  const related = products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(resolved.locale, product)) }} />
      <ProductDetailsClient locale={resolved.locale} product={product} related={related} />
    </>
  );
}
