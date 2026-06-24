import type { Metadata } from "next";
export const dynamic = "force-dynamic";

import { ProductCard } from "@/components/storefront/ProductCard";
import Image from "next/image";
import Link from "next/link";
import { getPublicProducts } from "@/lib/system-api/queries";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolved = await params;
  if (!isLocale(resolved.locale)) return {};
  return localizedMetadata(resolved.locale, "offers", "/offers");
}

export default async function OffersPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolved = await params;
  const locale = isLocale(resolved.locale) ? resolved.locale : "ar";
  const dictionary = getDictionary(locale);
  const products = await getPublicProducts();
  const offerProducts = products.filter((product) => product.onOffer);

  return (
    <div className="smsm-container space-y-8 py-8">
      <section className="smsm-panel relative overflow-hidden p-8">
        <Image
          src="/images/store/promo-banner.png"
          alt="Offers"
          fill
          priority
          quality={82}
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />
        <div className="relative">
          <p className="smsm-label text-[#ffb4a8]">{locale === "ar" ? "عروض حصرية" : "Exclusive Offers"}</p>
          <h1 className="smsm-heading mt-2 text-5xl font-extrabold">{dictionary.nav.offers}</h1>
          <p className="mt-3 max-w-2xl text-sm text-[#d4d4d4]">
            {locale === "ar"
              ? "خصومات موسمية على موديلات مختارة مع الحفاظ على نفس جودة SMSM STORE."
              : "Seasonal discounts on selected sneakers with the same premium SMSM quality."}
          </p>
        </div>
      </section>

      {offerProducts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {offerProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} locale={locale} index={index} />
          ))}
        </div>
      ) : (
        <section className="smsm-panel p-10 text-center">
          <h2 className="smsm-heading text-2xl font-bold">
            {locale === "ar" ? "لا توجد عروض حالياً" : "No active offers right now"}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[#bdbdbd]">
            {locale === "ar" ? "تصفح أحدث موديلات SMSM STORE المتاحة الآن." : "Browse the latest SMSM STORE models available now."}
          </p>
          <Link href={`/${locale}/products`} className="smsm-btn-primary mt-6">
            {dictionary.actions.shopNow}
          </Link>
        </section>
      )}
    </div>
  );
}
