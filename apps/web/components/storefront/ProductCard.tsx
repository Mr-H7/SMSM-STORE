"use client";

import Link from "next/link";
import Image from "next/image";
import { CSSProperties } from "react";
import { useCart } from "@/components/shared/CartProvider";
import { getProductBadgeLabel } from "@/lib/product-display";
import { Product, Locale } from "@/lib/types";
import { formatPriceEGP } from "@/lib/utils";

type Props = {
  product: Product;
  locale: Locale;
  index?: number;
};

export function ProductCard({ product, locale, index = 0 }: Props) {
  const { addItem } = useCart();
  const name = locale === "ar" ? product.nameAr : product.nameEn;
  const inStock = product.stock > 0 && product.status !== "out-of-stock";
  const lowStock = inStock && product.stock <= 3;
  const badge = lowStock
    ? locale === "ar" ? "مخزون منخفض" : "Low Stock"
    : getProductBadgeLabel(product.badge, locale);
  const stockLabel = !inStock
    ? locale === "ar" ? "غير متوفر" : "Out Of Stock"
    : lowStock
      ? locale === "ar" ? "مخزون منخفض" : "Low Stock"
      : locale === "ar" ? "متوفر" : "In Stock";

  return (
    <div
      className="animate-product-card-reveal h-full"
      style={{ animationDelay: `${Math.min(index, 12) * 70}ms` } as CSSProperties}
    >
      <article className="smsm-card group relative h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#dfd6cc] hover:shadow-2xl hover:shadow-black/30">
      <Link href={`/${locale}/products/${product.slug}`} className="absolute inset-0 z-10" aria-label={name}>
        <span className="sr-only">{name}</span>
      </Link>

      <div className="relative aspect-[4/5] overflow-hidden bg-[#0f0f0f]">
        <Image
          src={product.images[0] ?? "/images/smsm-logo.png"}
          alt={name}
          fill
          quality={72}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain transition duration-500 group-hover:scale-110"
        />
        {badge ? (
          <span className="absolute start-3 top-3 rounded-sm border border-[#ffb4a8]/30 bg-[#cd0000] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="space-y-3 p-4">
        <h3 className="smsm-heading line-clamp-2 text-lg font-semibold">{name}</h3>
        <div className="text-xs text-[#8f8f8f]">
          {locale === "ar" ? "المقاسات" : "Sizes"}: {product.sizes.join(" / ")}
        </div>
        <div className="text-lg font-bold text-[#ffb4a8]">{formatPriceEGP(product.price, locale)}</div>
        <div className={`text-xs font-semibold ${lowStock ? "text-[#ffb4a8]" : inStock ? "text-green-300" : "text-red-300"}`}>
          {stockLabel}
        </div>

        {inStock ? (
          <button
            type="button"
            className="smsm-btn-primary relative z-20 w-full text-center text-xs"
            onClick={() => addItem({
              product,
              size: product.sizes[0] ?? "",
              color: product.colors[0] ?? "",
              quantity: 1
            })}
          >
            {locale === "ar" ? "أضف للسلة" : "Add to Cart"}
          </button>
        ) : (
          <span className="relative z-20 inline-flex w-full items-center justify-center rounded-md border border-[#3a3a3a] bg-[#181818] px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.08em] text-[#777]">
            {stockLabel}
          </span>
        )}
      </div>
      </article>
    </div>
  );
}
