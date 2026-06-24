export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { HeroProductShowcase } from "@/components/storefront/HeroProductShowcase";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ReviewCard } from "@/components/storefront/ReviewCard";
import { WhatsappButton } from "@/components/shared/WhatsappButton";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { NewsletterForm } from "@/components/storefront/NewsletterForm";
import { reviews } from "@/lib/data/reviews";
import { getPublicProducts } from "@/lib/system-api/queries";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/locale";
import { localizedMetadata, storeJsonLd } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolved = await params;
  if (!isLocale(resolved.locale)) return {};
  return localizedMetadata(resolved.locale, "home");
}

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolved = await params;
  if (!isLocale(resolved.locale)) {
    notFound();
  }
  const locale = resolved.locale;
  const dictionary = getDictionary(locale);
  const products = await getPublicProducts();
  const bestSellers = products.filter((product) => product.bestSeller).slice(0, 4);
  const newArrivals = [...products]
    .sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)))
    .slice(0, 4);
  return (
    <div className="animate-page-in pb-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd(locale)) }} />
      <section className="relative overflow-hidden border-b border-[#232323] bg-[#050505]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(205,0,0,0.32),transparent_34%),radial-gradient(circle_at_12%_15%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(135deg,#050505_0%,#101010_48%,#050505_100%)]" />
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
        <div className="smsm-container relative grid min-h-[76vh] items-center gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
          <div className="animate-section-in space-y-6 text-center lg:text-start">
            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <Image
                src="/images/smsm-logo.png"
                alt="SMSM STORE"
                width={42}
                height={42}
                className="h-10 w-10 rounded-sm border border-[#2b2b2b] object-cover"
                priority
              />
              <p className="smsm-label text-[#cd0000]">{dictionary.tagline}</p>
            </div>
            <h1 className="smsm-heading text-4xl font-extrabold leading-[1.05] text-[#f5efe8] md:text-7xl">
              {dictionary.home.heroTitle}
            </h1>
            <p className="mx-auto max-w-xl text-sm leading-7 text-[#cbc3b8] md:text-base lg:mx-0">
              {dictionary.home.heroSubtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link href={`/${locale}/products`} className="smsm-btn-primary">
                {dictionary.actions.shopNow}
              </Link>
              <WhatsappButton
                href={`https://wa.me/${dictionary.whatsapp.replace(/\D/g, "")}`}
                label={dictionary.actions.orderWhatsapp}
              />
            </div>
          </div>

          <HeroProductShowcase products={products} locale={locale} />
        </div>
      </section>

      <section className="smsm-section animate-section-in bg-[#121212]">
        <div className="smsm-container">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="smsm-label text-[#cd0000]">{dictionary.home.bestSellers}</p>
              <h2 className="smsm-heading mt-2 text-3xl font-bold">{dictionary.home.bestSellers}</h2>
            </div>
            <Link href={`/${locale}/products`} className="smsm-btn-secondary text-xs">
              {locale === "ar" ? "عرض الكل" : "View All"}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellers.map((product, index) => (
              <ProductCard key={product.id} product={product} locale={locale} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="smsm-container smsm-section animate-section-in">
        <div className="smsm-panel grid items-center gap-6 overflow-hidden p-7 md:grid-cols-2">
          <div>
            <p className="smsm-label text-[#ffb4a8]">{locale === "ar" ? "عرض محدود" : "Limited Offer"}</p>
            <h3 className="smsm-heading mt-3 text-3xl font-extrabold leading-tight">
              {locale === "ar"
                ? "خصم حتى 30% على موديلات مختارة"
                : "Up to 30% off selected elite models"}
            </h3>
            <p className="mt-4 max-w-xl text-sm text-[#bcbcbc]">
              {locale === "ar"
                ? "استفد من عروض موسمية على أفضل أحذية SMSM STORE لفترة محدودة."
                : "Claim curated seasonal drops with premium pricing for a limited time."}
            </p>
            <Link href={`/${locale}/offers`} className="smsm-btn-primary mt-6">
              {dictionary.nav.offers}
            </Link>
          </div>
          <div className="relative min-h-[240px] w-full overflow-hidden rounded-md border border-[#2e2e2e]">
            <Image
              src="/images/store/promo-banner.png"
              alt="Promotional banner"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="smsm-container smsm-section animate-section-in">
        <h2 className="smsm-heading mb-6 text-3xl font-bold">{dictionary.home.newArrivals}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((product, index) => (
            <ProductCard key={product.id} product={product} locale={locale} index={index} />
          ))}
        </div>
      </section>

      <section className="smsm-section animate-section-in border-y border-[#202020] bg-[#0b0b0b]">
        <div className="smsm-container">
          <h2 className="smsm-heading mb-6 text-center text-3xl font-bold">{dictionary.home.whyUs}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              locale === "ar" ? "منتجات أصلية 100%" : "100% Authentic products",
              locale === "ar" ? "توصيل سريع وخدمة مباشرة" : "Fast delivery and concierge support",
              locale === "ar" ? "منتجات بجودة وخامة عالية" : "High-quality products and materials"
            ].map((item) => (
              <div key={item} className="smsm-panel p-6 text-center text-sm text-[#d3d3d3]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="smsm-container smsm-section animate-section-in">
        <h2 className="smsm-heading mb-6 text-3xl font-bold">{dictionary.home.gallery}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="smsm-panel relative h-60 w-full overflow-hidden">
            <ImageWithFallback src="/images/store/store-wall.jpeg" fallbackSrc="/images/store/store-front.jpeg" alt="Store display" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
          </div>
          <div className="smsm-panel relative h-60 w-full overflow-hidden">
            <ImageWithFallback src="/images/store/sneaker-shelf.jpeg" fallbackSrc="/images/store/store-front.jpeg" alt="Sneaker shelf" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
          </div>
          <div className="smsm-panel relative h-60 w-full overflow-hidden">
            <ImageWithFallback src="/images/store/premium-shoes-wall.jpeg" fallbackSrc="/images/store/store-front.jpeg" alt="Premium shoes wall" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="smsm-container smsm-section animate-section-in">
        <h2 className="smsm-heading mb-6 text-3xl font-bold">{dictionary.home.reviews}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} locale={locale} />
          ))}
        </div>
      </section>

      <section className="smsm-section bg-[#cd0000]">
        <div className="smsm-container text-center text-[#efe7df]">
          <h2 className="smsm-heading text-3xl font-extrabold">{dictionary.home.finalCta}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm">
            {locale === "ar"
              ? "سجّل بريدك للحصول على تنبيهات الإصدارات والعروض الحصرية أولاً."
              : "Join the elite list for early access to limited drops and offers."}
          </p>
          <div className="mx-auto mt-6 max-w-xl">
            <NewsletterForm locale={locale} variant="red" buttonLabel={locale === "ar" ? "اشترك الآن" : "Sign Up Now"} />
          </div>
        </div>
      </section>
    </div>
  );
}
