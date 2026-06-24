"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/storefront/ProductCard";
import { useCart } from "@/components/shared/CartProvider";
import { WhatsappButton } from "@/components/shared/WhatsappButton";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getProductBadgeLabel } from "@/lib/product-display";
import { Locale, Product } from "@/lib/types";
import { formatPriceEGP } from "@/lib/utils";
import { buildProductWhatsappUrl } from "@/lib/whatsapp";

export function ProductDetailsClient({ locale, product, related }: { locale: Locale; product: Product; related: Product[] }) {
  const dictionary = getDictionary(locale);
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const galleryImages = useMemo(() => {
    const unique = Array.from(new Set(product.images.filter(Boolean)));
    const productImages = unique.filter((image) => image !== "/images/smsm-logo.png");
    return productImages.length ? productImages : ["/images/smsm-logo.png"];
  }, [product.images]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [galleryPaused, setGalleryPaused] = useState(false);
  const activeImage = galleryImages[activeImageIndex] ?? galleryImages[0] ?? "/images/smsm-logo.png";
  const inStock = product.stock > 0 && product.status !== "out-of-stock";
  const lowStock = inStock && product.stock <= 3;
  const safeQuantity = Math.min(quantity, Math.max(product.stock, 1));
  const stockLabel = !inStock
    ? locale === "ar" ? "غير متوفر" : "Out Of Stock"
    : lowStock
      ? locale === "ar" ? "مخزون منخفض" : "Low Stock"
      : locale === "ar" ? "متوفر" : "In Stock";
  const badge = lowStock
    ? locale === "ar" ? "مخزون منخفض" : "Low Stock"
    : getProductBadgeLabel(product.badge, locale);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product.id]);

  useEffect(() => {
    if (galleryImages.length < 2 || galleryPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % galleryImages.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [galleryImages.length, galleryPaused]);

  return (
    <div className="smsm-container animate-page-in space-y-10 py-8">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-4" onMouseEnter={() => setGalleryPaused(true)} onMouseLeave={() => setGalleryPaused(false)}>
          <div className="smsm-panel relative min-h-[420px] overflow-hidden">
            <Image key={activeImage} src={activeImage} alt={product.nameEn} fill priority quality={82} sizes="(max-width: 1024px) 100vw, 58vw" className="animate-gallery-image object-contain transition duration-500 hover:scale-105" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {galleryImages.map((image, idx) => (
              <button key={image} onClick={() => setActiveImageIndex(idx)} className={`relative h-24 overflow-hidden border transition ${activeImageIndex === idx ? "border-[#cd0000]" : "border-[#323232] hover:border-[#9f9f9f]"}`}>
                <Image src={image} alt={`${product.nameEn} ${idx + 1}`} fill loading="lazy" quality={55} sizes="(max-width: 1024px) 25vw, 10vw" className="object-contain" />
              </button>
            ))}
          </div>
        </section>

        <section className="smsm-panel space-y-5 p-6">
          <div className="flex items-center justify-between">
            {badge ? <span className="smsm-label text-[#cd0000]">{badge}</span> : <span />}
          </div>
          <h1 className="smsm-heading text-4xl font-extrabold">{locale === "ar" ? product.nameAr : product.nameEn}</h1>
          <p className="text-sm leading-7 text-[#bcbcbc]">
            {locale === "ar" ? product.shortDescriptionAr ?? product.descriptionAr : product.shortDescriptionEn ?? product.descriptionEn}
          </p>
          <div className="text-3xl font-bold text-[#efe6dc]">{formatPriceEGP(product.price, locale)}</div>

          <div>
            <p className="smsm-label mb-2">{locale === "ar" ? "مقاسك كام؟" : "Select Size"}</p>
            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((option) => (
                <button key={option} onClick={() => setSize(option)} disabled={!inStock} className={`h-11 border text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${size === option ? "border-[#cd0000] bg-[#cd0000]/20" : "border-[#323232] bg-[#141414] hover:border-[#777]"}`}>
                  {option}
                </button>
              ))}
            </div>
          </div>

          {product.colors.length > 0 ? (
            <div>
              <p className="smsm-label mb-2">{locale === "ar" ? "اختر اللون" : "Select Color"}</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((option) => (
                  <button key={option} onClick={() => setColor(option)} disabled={!inStock} className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.08em] transition disabled:cursor-not-allowed disabled:opacity-40 ${color === option ? "border-[#cd0000] text-[#efe6dc]" : "border-[#323232] text-[#9f9f9f] hover:border-[#777]"}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex items-end gap-4 border-y border-[#2c2c2c] py-4">
            <div>
              <p className="smsm-label mb-2">{locale === "ar" ? "الكمية" : "Quantity"}</p>
              <input type="number" min={1} max={Math.max(product.stock, 1)} value={quantity} disabled={!inStock} onChange={(event) => setQuantity(Math.min(Math.max(1, Number(event.target.value)), Math.max(product.stock, 1)))} className="smsm-input w-24 disabled:cursor-not-allowed disabled:opacity-50" />
            </div>
            <p className={`text-sm font-semibold ${lowStock ? "text-[#ffb4a8]" : inStock ? "text-green-400" : "text-red-300"}`}>
              {stockLabel}
            </p>
          </div>

          <button disabled={!inStock} onClick={() => addItem({ product, size, color, quantity: safeQuantity })} className="smsm-btn-primary w-full disabled:cursor-not-allowed disabled:border-[#3a3a3a] disabled:bg-[#242424] disabled:text-[#777]">
            {inStock ? dictionary.actions.addToCart : locale === "ar" ? "غير متوفر" : "Out of Stock"}
          </button>
          {inStock ? <WhatsappButton href={buildProductWhatsappUrl(locale, product, size, color, safeQuantity)} label={dictionary.actions.orderWhatsapp} full /> : null}
        </section>
      </div>

      <section className="grid gap-6 border-t border-[#252525] pt-10 lg:grid-cols-2">
        <div>
          <h2 className="smsm-heading text-2xl font-bold">{locale === "ar" ? "الوصف" : "Description"}</h2>
          <p className="mt-4 text-sm leading-8 text-[#bdbdbd]">{locale === "ar" ? product.descriptionAr : product.descriptionEn}</p>
        </div>
        <div>
          <h2 className="smsm-heading text-2xl font-bold">{locale === "ar" ? "المواصفات" : "Specs"}</h2>
          <div className="mt-4 divide-y divide-[#2b2b2b] border border-[#2b2b2b]">
            <div className="flex justify-between p-3 text-sm"><span>{locale === "ar" ? "الموديل" : "Model"}</span><span>{locale === "ar" ? product.nameAr : product.nameEn}</span></div>
            <div className="flex justify-between p-3 text-sm"><span>SKU</span><span>{product.sku ?? "-"}</span></div>
            <div className="flex justify-between p-3 text-sm"><span>{locale === "ar" ? "الجودة" : "Grade"}</span><span>{product.qualityGrade ?? "MIRROR"}</span></div>
            <div className="flex justify-between p-3 text-sm"><span>{locale === "ar" ? "المقاسات" : "Sizes"}</span><span>{product.sizes.join(" / ")}</span></div>
          </div>
        </div>
      </section>

      <section className="space-y-4 border-t border-[#252525] pt-10">
        <div className="flex items-end justify-between">
          <h2 className="smsm-heading text-2xl font-bold">{locale === "ar" ? "منتجات مشابهة" : "Related Products"}</h2>
          <Link href={`/${locale}/products`} className="smsm-btn-secondary text-xs">{locale === "ar" ? "عرض الكل" : "View Collections"}</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, index) => <ProductCard key={item.id} product={item} locale={locale} index={index} />)}
        </div>
      </section>
    </div>
  );
}
