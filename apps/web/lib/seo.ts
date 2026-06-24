import type { Metadata } from "next";
import type { Locale, Product } from "@/lib/types";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://smsm-store.example.com").replace(/\/$/, "");

const pageMeta = {
  home: {
    ar: {
      title: "SMSM STORE | أحدث تشكيلات السنيكرز في مصر",
      description: "تسوق أحدث موديلات السنيكرز والأحذية الرياضية من SMSM STORE مع طلب سريع عبر واتساب.",
    },
    en: {
      title: "SMSM STORE | Premium Sneakers in Egypt",
      description: "Shop premium sneakers, latest drops, and curated sport shoes from SMSM STORE with fast WhatsApp ordering.",
    },
  },
  products: {
    ar: {
      title: "منتجات SMSM STORE",
      description: "اكتشف كتالوج SMSM STORE المعتمد من السنيكرز والأحذية الرياضية المتاحة الآن.",
    },
    en: {
      title: "SMSM STORE Products",
      description: "Explore the approved SMSM STORE sneaker catalog with current availability and WhatsApp ordering.",
    },
  },
  offers: {
    ar: {
      title: "عروض SMSM STORE",
      description: "تابع عروض SMSM STORE على موديلات مختارة من السنيكرز بجودة عالية وأسعار مميزة.",
    },
    en: {
      title: "SMSM STORE Offers",
      description: "Browse active SMSM STORE sneaker offers and limited-time premium deals.",
    },
  },
  about: {
    ar: {
      title: "عن SMSM STORE",
      description: "تعرف على SMSM STORE وتجربة اختيار أحذية رياضية بجودة وخامة عالية.",
    },
    en: {
      title: "About SMSM STORE",
      description: "Learn about SMSM STORE, a premium sneaker destination focused on high-quality products and materials.",
    },
  },
  contact: {
    ar: {
      title: "تواصل مع SMSM STORE",
      description: "تواصل مع SMSM STORE للاستفسار عن المقاسات والموديلات والطلبات عبر واتساب أو نموذج التواصل.",
    },
    en: {
      title: "Contact SMSM STORE",
      description: "Contact SMSM STORE for sizing, sneaker drops, orders, and direct WhatsApp support.",
    },
  },
} as const;

type PageKey = keyof typeof pageMeta;

function localizedPath(locale: Locale, path: string) {
  return "/" + locale + (path ? path : "");
}

export function localizedMetadata(locale: Locale, page: PageKey, path = ""): Metadata {
  const copy = pageMeta[page][locale];
  const canonical = localizedPath(locale, path);
  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: {
        ar: localizedPath("ar", path),
        en: localizedPath("en", path),
      },
    },
    openGraph: {
      type: "website",
      siteName: "SMSM STORE",
      title: copy.title,
      description: copy.description,
      url: siteUrl + canonical,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_EG"],
      images: [{ url: "/images/store/store-front.jpeg", width: 1200, height: 630, alt: "SMSM STORE" }],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: ["/images/store/store-front.jpeg"],
    },
  };
}

export function storeJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "SMSM STORE",
    url: siteUrl + "/" + locale,
    image: siteUrl + "/images/store/store-front.jpeg",
    logo: siteUrl + "/images/smsm-logo.png",
    telephone: "+201559978355",
    address: {
      "@type": "PostalAddress",
      addressLocality: locale === "ar" ? "بنها" : "Benha",
      streetAddress: locale === "ar" ? "الفلل شارع العبد" : "Al-Villas, Al-Abd Street",
      addressCountry: "EG",
    },
    sameAs: [
      "https://www.facebook.com/profile.php?id=61590026293806",
      "https://www.instagram.com/smsm_store01",
      "https://www.tiktok.com/@smsm88049",
    ],
  };
}

export function productJsonLd(locale: Locale, product: Product) {
  const path = "/" + locale + "/products/" + product.slug;
  const name = locale === "ar" ? product.nameAr : product.nameEn;
  const description = locale === "ar"
    ? product.shortDescriptionAr || product.descriptionAr
    : product.shortDescriptionEn || product.descriptionEn;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: (product.images?.length ? product.images : ["/images/smsm-logo.png"]).map((image) => siteUrl + image),
    sku: product.sku || product.slug,
    offers: {
      "@type": "Offer",
      url: siteUrl + path,
      priceCurrency: "EGP",
      price: product.price,
      availability: product.stock > 0 && product.status !== "out-of-stock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}
