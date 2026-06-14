import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ReviewCard } from "@/components/storefront/ReviewCard";
import { WhatsappButton } from "@/components/shared/WhatsappButton";
import { reviews } from "@/lib/data/reviews";
import { getPublicProducts } from "@/lib/supabase/queries";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/locale";

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
  const heroProduct = {
    name: locale === "ar" ? "ايرفورس ابيض ميرور" : "Air Force White Mirror",
    image: "/images/SHOES/AIR%20FORCE%20WHITE%20MIRROR%20MOLTEN%20METAL/FRONT.png"
  };
  const heroRotation = [
    { name: "Air Max 97", image: "/images/SHOES/AIR%20MAX%2097/FRONT.png" },
    { name: "New Balance 530", image: "/images/SHOES/NEW%20BALANCE%20530/FRONT.png" },
    { name: "Balenciaga Track", image: "/images/SHOES/BALENCIAGA%20TRACK/FRONT.png" }
  ];
  const comingThisWeek = [
    {
      title: locale === "ar" ? "لقطات من المتجر" : "In-store proof",
      image: "/images/smsm-store-hero.jpeg"
    },
    {
      title: "Air Max 95",
      image: "/images/SHOES/AIR%20MAX%2095/FRONT.png"
    },
    {
      title: "TN 3",
      image: "/images/SHOES/TN%203/FRONT.png"
    }
  ];

  return (
    <div className="animate-page-in pb-8">
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

          <div className="relative min-h-[420px] animate-section-in lg:min-h-[560px]">
            <div className="absolute inset-x-10 bottom-10 h-24 rounded-full bg-[#cd0000]/25 blur-3xl" />
            <div className="absolute left-1/2 top-8 h-[78%] w-[78%] -translate-x-1/2 rounded-full border border-[#cd0000]/25 bg-black/30 shadow-[0_0_90px_rgba(205,0,0,0.24)]" />
            <Image
              src={heroProduct.image}
              alt={heroProduct.name}
              fill
              priority
              sizes="(max-width: 1024px) 92vw, 52vw"
              className="object-contain drop-shadow-[0_38px_52px_rgba(0,0,0,0.72)]"
            />
            <div className="absolute bottom-2 left-1/2 flex w-full max-w-md -translate-x-1/2 justify-center gap-3 px-4">
              {heroRotation.map((item) => (
                <div
                  key={item.name}
                  className="relative h-20 flex-1 overflow-hidden border border-[#282828] bg-black/70 backdrop-blur"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="140px"
                    className="object-contain p-2"
                  />
                </div>
              ))}
            </div>
          </div>
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
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
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
              src="/images/template.svg"
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
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
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
              locale === "ar" ? "مقاسات متعددة واختيارات حصرية" : "Wide sizing and exclusive curated drops"
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
            <Image src="/images/template.svg" alt="Store display" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
          </div>
          <div className="smsm-panel relative h-60 w-full overflow-hidden">
            <Image src="/images/template.svg" alt="Sneaker shelf" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
          </div>
          <div className="smsm-panel relative h-60 w-full overflow-hidden">
            <Image src="/images/template.svg" alt="Premium shoes wall" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
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
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <input
              className="w-full max-w-sm rounded-none border border-[#f5beb9]/40 bg-black/15 px-4 py-3 text-sm placeholder:text-[#f0d4d2]"
              placeholder={locale === "ar" ? "البريد الإلكتروني" : "Email address"}
            />
            <button className="inline-flex items-center justify-center rounded-none bg-[#efe7df] px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#8c0000]">
              {locale === "ar" ? "اشترك الآن" : "Sign Up Now"}
              <ArrowRight className="ms-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
