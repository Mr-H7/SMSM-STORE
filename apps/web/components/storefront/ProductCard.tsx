import Link from "next/link";
import Image from "next/image";
import { Product, Locale } from "@/lib/types";
import { formatPriceEGP } from "@/lib/utils";

type Props = {
  product: Product;
  locale: Locale;
};

export function ProductCard({ product, locale }: Props) {
  const name = locale === "ar" ? product.nameAr : product.nameEn;
  const inStock = product.stock > 0 && product.status !== "out-of-stock";
  const lowStock = inStock && product.stock <= 3;

  return (
    <article className="smsm-card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#dfd6cc] hover:shadow-2xl hover:shadow-black/30">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#0f0f0f]">
        <Image
          src={product.images[0]}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-110"
        />
        {product.badge ? (
          <span className="absolute start-3 top-3 rounded-sm border border-[#ffb4a8]/30 bg-[#cd0000] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]">
            {product.badge}
          </span>
        ) : null}
        {!inStock ? (
          <span className="absolute inset-x-3 bottom-3 rounded-sm border border-[#ffb4a8]/30 bg-black/80 px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ffb4a8]">
            {locale === "ar" ? "غير متوفر" : "Out of Stock"}
          </span>
        ) : null}
      </div>

      <div className="space-y-3 p-4">
        <div className="smsm-label">{product.brand}</div>
        <h3 className="smsm-heading line-clamp-2 text-lg font-semibold">{name}</h3>
        <div className="text-xs text-[#8f8f8f]">
          {locale === "ar" ? "المقاسات" : "Sizes"}: {product.sizes.join(" / ")}
        </div>
        <div className="text-lg font-bold text-[#ffb4a8]">{formatPriceEGP(product.price, locale)}</div>
        <div className={`text-xs font-semibold ${lowStock ? "text-[#ffb4a8]" : inStock ? "text-green-300" : "text-red-300"}`}>
          {inStock
            ? locale === "ar"
              ? lowStock
                ? `كمية محدودة - ${product.stock} فقط`
                : `متوفر - ${product.stock} قطعة`
              : lowStock
                ? `Low stock - only ${product.stock} left`
                : `Available - ${product.stock} in stock`
            : locale === "ar"
              ? "غير متوفر"
              : "Out of Stock"}
        </div>
        <div className="flex gap-2">
          <Link href={`/${locale}/products/${product.slug}`} className="smsm-btn-secondary w-full text-center text-xs">
            {locale === "ar" ? "التفاصيل" : "Details"}
          </Link>
          {inStock ? (
            <Link href={`/${locale}/products/${product.slug}`} className="smsm-btn-primary w-full text-center text-xs">
              {locale === "ar" ? "أضف للسلة" : "Add to Cart"}
            </Link>
          ) : (
            <span className="inline-flex w-full items-center justify-center rounded-md border border-[#3a3a3a] bg-[#181818] px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.08em] text-[#777]">
              {locale === "ar" ? "غير متوفر" : "Sold Out"}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
