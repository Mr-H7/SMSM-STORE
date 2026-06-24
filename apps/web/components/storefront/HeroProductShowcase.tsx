"use client";

import Image from "next/image";
import Link from "next/link";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import { Locale, Product } from "@/lib/types";

type Props = {
  products: Product[];
  locale: Locale;
};

const MOBILE_ARC_POSITIONS = [
  { x: "-34vw", maxX: "-130px", minX: "-92px", y: "-8px", scale: 0.72, opacity: 0.72 },
  { x: "-19vw", maxX: "-76px", minX: "-48px", y: "-68px", scale: 0.88, opacity: 0.88 },
  { x: "0px", maxX: "0px", minX: "0px", y: "-92px", scale: 1, opacity: 1 },
  { x: "19vw", maxX: "76px", minX: "48px", y: "-68px", scale: 0.88, opacity: 0.88 },
  { x: "34vw", maxX: "130px", minX: "92px", y: "-8px", scale: 0.72, opacity: 0.72 },
];

function clampX(position: (typeof MOBILE_ARC_POSITIONS)[number]) {
  const value = position.x.startsWith("-")
    ? `clamp(${position.maxX}, ${position.x}, ${position.minX})`
    : position.x === "0px"
      ? "0px"
      : `clamp(${position.minX}, ${position.x}, ${position.maxX})`;
  return value;
}

export function HeroProductShowcase({ products, locale }: Props) {
  const showcaseProducts = products.slice(0, 30);
  const total = showcaseProducts.length;
  const fallbackImage = "/images/smsm-logo.png";
  const centerProduct =
    showcaseProducts.find((product) => product.slug === "louis-vuitton-skate-sneaker" && product.images[0]) ??
    showcaseProducts.find((product) => product.slug === "balenciaga-track-sneaker-mirror" && product.images[0]) ??
    showcaseProducts[0];
  const centerName = locale === "ar" ? centerProduct?.nameAr : centerProduct?.nameEn;
  const mobileProducts = useMemo(
    () => centerProduct
      ? [centerProduct, ...showcaseProducts.filter((product) => product.id !== centerProduct.id)]
      : showcaseProducts,
    [centerProduct, showcaseProducts]
  );
  const [mobileStart, setMobileStart] = useState(0);
  const [mobilePaused, setMobilePaused] = useState(false);
  const mobileCenterProduct = mobileProducts[mobileStart % Math.max(mobileProducts.length, 1)] ?? centerProduct;
  const mobileCenterName = locale === "ar" ? mobileCenterProduct?.nameAr : mobileCenterProduct?.nameEn;
  const visibleMobileProducts = useMemo(() => {
    if (!mobileProducts.length) return [];
    return MOBILE_ARC_POSITIONS.map((_, index) => mobileProducts[(mobileStart + index + 1) % mobileProducts.length]);
  }, [mobileProducts, mobileStart]);

  useEffect(() => {
    if (mobilePaused || mobileProducts.length <= MOBILE_ARC_POSITIONS.length) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1024px)");
    if (reduceMotion.matches || desktop.matches) return;

    const interval = window.setInterval(() => {
      setMobileStart((current) => (current + 1) % mobileProducts.length);
    }, 2600);

    return () => window.clearInterval(interval);
  }, [mobilePaused, mobileProducts.length]);

  return (
    <div className="animate-section-in min-w-0 overflow-hidden lg:overflow-visible">
      <div className="relative hidden min-h-[560px] lg:block">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#cd0000]/20 bg-black/20 shadow-[0_0_110px_rgba(205,0,0,0.2)]" />
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#343434] bg-[radial-gradient(circle,rgba(205,0,0,0.2),rgba(0,0,0,0.86)_62%)]" />
        <div className="absolute inset-x-16 bottom-10 h-20 rounded-full bg-[#cd0000]/25 blur-3xl" />

        <Link
          href={"/" + locale + "/products/" + (centerProduct?.slug ?? "")}
          className="group absolute left-1/2 top-1/2 z-20 flex h-56 w-72 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          aria-label={centerName}
        >
          <Image
            src={centerProduct?.images[0] ?? fallbackImage}
            alt={centerName ?? "SMSM STORE"}
            fill
            priority
            quality={82}
            sizes="320px"
            className="object-contain drop-shadow-[0_36px_46px_rgba(0,0,0,0.78)] transition duration-500 group-hover:scale-105"
          />
        </Link>

        <div
          className="smsm-product-orbit absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2"
          style={{ "--total": total } as CSSProperties}
        >
          {showcaseProducts.map((product, index) => {
            const name = locale === "ar" ? product.nameAr : product.nameEn;
            return (
              <Link
                key={product.id}
                href={"/" + locale + "/products/" + product.slug}
                aria-label={name}
                className="smsm-orbit-item group"
                style={{ "--i": index } as CSSProperties}
              >
                <span className="smsm-orbit-frame">
                  <Image
                    src={product.images[0] ?? fallbackImage}
                    alt={name}
                    fill
                    loading="lazy"
                    quality={55}
                    sizes="120px"
                    className="object-contain p-2 transition duration-500 group-hover:scale-110"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div
        className="w-full min-w-0 lg:hidden"
        onMouseEnter={() => setMobilePaused(true)}
        onMouseLeave={() => setMobilePaused(false)}
        onFocusCapture={() => setMobilePaused(true)}
        onBlurCapture={() => setMobilePaused(false)}
        onPointerDown={() => setMobilePaused(true)}
        onPointerUp={() => setMobilePaused(false)}
        onPointerCancel={() => setMobilePaused(false)}
        onTouchStart={() => setMobilePaused(true)}
        onTouchEnd={() => setMobilePaused(false)}
      >
        <div className="relative mx-auto h-[330px] w-full max-w-[430px] overflow-hidden sm:h-[390px] md:h-[430px] md:max-w-[640px]">
          <div className="absolute left-1/2 top-[56%] h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#cd0000]/20 bg-black/30 shadow-[0_0_70px_rgba(205,0,0,0.22)] sm:h-[250px] sm:w-[250px] md:h-[300px] md:w-[300px]" />
          <div className="absolute left-1/2 top-[56%] h-[150px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#cd0000]/18 blur-3xl md:h-[180px] md:w-[320px]" />

          <Link
            href={"/" + locale + "/products/" + (mobileCenterProduct?.slug ?? "")}
            className="group absolute left-1/2 top-[61%] z-20 flex h-44 w-[250px] -translate-x-1/2 -translate-y-1/2 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cd0000] sm:h-52 sm:w-[300px] md:h-60 md:w-[360px]"
            aria-label={mobileCenterName}
          >
            <Image
              src={mobileCenterProduct?.images[0] ?? fallbackImage}
              alt={mobileCenterName ?? "SMSM STORE"}
              fill
              priority
              quality={78}
              sizes="(max-width: 640px) 72vw, 360px"
              className="object-contain drop-shadow-[0_28px_38px_rgba(0,0,0,0.75)] transition duration-500 group-hover:scale-105 motion-reduce:transition-none"
            />
          </Link>

          <div className="absolute left-1/2 top-[48%] h-0 w-0">
            {visibleMobileProducts.map((product, index) => {
              const position = MOBILE_ARC_POSITIONS[index];
              const name = locale === "ar" ? product.nameAr : product.nameEn;
              return (
                <Link
                  key={product.id + "-" + index}
                  href={"/" + locale + "/products/" + product.slug}
                  className="group absolute z-30 flex h-16 w-20 items-center justify-center overflow-hidden rounded-full border border-[#3a3a3a] bg-black/75 shadow-[0_12px_28px_rgba(0,0,0,0.45)] transition duration-700 hover:border-[#cd0000]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cd0000] motion-reduce:transition-none sm:h-20 sm:w-24 md:h-24 md:w-28"
                  aria-label={name}
                  style={{
                    transform: `translate(calc(-50% + ${clampX(position)}), calc(-50% + ${position.y})) scale(${position.scale})`,
                    opacity: position.opacity,
                  }}
                >
                  <Image
                    src={product.images[0] ?? fallbackImage}
                    alt={name}
                    fill
                    loading="lazy"
                    quality={58}
                    sizes="112px"
                    className="object-contain p-2 transition duration-500 group-hover:scale-110 motion-reduce:transition-none"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
