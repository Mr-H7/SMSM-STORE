import { ProductCard } from "@/components/storefront/ProductCard";
import Image from "next/image";
import { getPublicProducts } from "@/lib/supabase/queries";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/locale";

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
          src="/images/template.svg"
          alt="Offers"
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {offerProducts.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </div>
  );
}
