import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolved = await params;
  if (!isLocale(resolved.locale)) return {};
  return localizedMetadata(resolved.locale, "about", "/about");
}

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolved = await params;
  const locale = isLocale(resolved.locale) ? resolved.locale : "ar";
  const dictionary = getDictionary(locale);

  return (
    <div className="smsm-container space-y-8 py-8">
      <section className="grid gap-6 border-b border-[#222] pb-8 md:grid-cols-2">
        <div>
          <p className="smsm-label text-[#cd0000]">{dictionary.nav.about}</p>
          <h1 className="smsm-heading mt-2 text-5xl font-extrabold">
            {locale === "ar" ? "هوية SMSM STORE" : "The SMSM STORE Story"}
          </h1>
          <p className="mt-4 text-sm leading-8 text-[#c4c4c4]">
            {locale === "ar"
              ? "بدأ SMSM STORE كمشروع يركز على الأحذية الرياضية الأصلية بتقديم راقٍ وتجربة شراء مباشرة. نختار كل موديل بعناية ليجمع بين الأداء والشكل."
              : "SMSM STORE started as a shoes-first concept focused on curated originals, premium execution, and practical ordering flow."}
          </p>
        </div>
        <div className="smsm-panel relative flex min-h-[320px] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,rgba(205,0,0,0.2),transparent_48%),#090909]">
          <Image
            src="/images/smsm-logo.png"
            alt="About SMSM STORE"
            width={220}
            height={220}
            sizes="220px"
            className="h-48 w-48 object-contain drop-shadow-[0_24px_50px_rgba(205,0,0,0.2)] md:h-56 md:w-56"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="smsm-panel p-5">
          <h3 className="smsm-heading text-xl">{locale === "ar" ? "الرؤية" : "Vision"}</h3>
          <p className="mt-3 text-sm text-[#c4c4c4]">
            {locale === "ar"
              ? "أن نكون الوجهة الأولى للأحذية الرياضية الفاخرة محليًا."
              : "To become the leading premium sneaker destination in the region."}
          </p>
        </div>
        <div className="smsm-panel p-5">
          <h3 className="smsm-heading text-xl">{locale === "ar" ? "الرسالة" : "Mission"}</h3>
          <p className="mt-3 text-sm text-[#c4c4c4]">
            {locale === "ar"
              ? "جودة عالية"
              : "High quality"}
          </p>
        </div>
        <div className="smsm-panel p-5">
          <h3 className="smsm-heading text-xl">{locale === "ar" ? "القيم" : "Values"}</h3>
          <p className="mt-3 text-sm text-[#c4c4c4]">
            {locale === "ar" ? "التنوع" : "Variety"}
          </p>
        </div>
      </section>

      <div className="smsm-panel p-6 text-center">
        <p className="mb-4 text-sm text-[#bdbdbd]">
          {locale === "ar"
            ? "استكشف تشكيلتنا المميزة واطلب مباشرة عبر واتساب."
            : "Explore our curated collection and order directly via WhatsApp."}
        </p>
        <Link href={`/${locale}/products`} className="smsm-btn-primary">
          {dictionary.actions.shopNow}
        </Link>
      </div>
    </div>
  );
}
