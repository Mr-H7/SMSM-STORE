import { notFound } from "next/navigation";
import { Footer } from "@/components/storefront/Footer";
import { Navbar } from "@/components/storefront/Navbar";
import { TopPromoBar } from "@/components/storefront/TopPromoBar";
import { CartProvider } from "@/components/shared/CartProvider";
import { getDictionary } from "@/lib/i18n/dictionary";
import { DEFAULT_LOCALE, getDirection, isLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolved = await params;
  const locale = isLocale(resolved.locale) ? resolved.locale : DEFAULT_LOCALE;
  if (!isLocale(resolved.locale)) {
    notFound();
  }
  const dictionary = getDictionary(locale);

  return (
    <CartProvider>
      <div dir={getDirection(locale)} className="min-h-screen text-[#EFEDE6]">
        <TopPromoBar text={dictionary.home.promo} />
        <Navbar locale={locale} dictionary={dictionary} />
        <main>{children}</main>
        <Footer locale={locale} dictionary={dictionary} />
      </div>
    </CartProvider>
  );
}
