import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/locale";

export default async function CheckoutIntentPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolved = await params;
  const locale = isLocale(resolved.locale) ? resolved.locale : "ar";
  const dictionary = getDictionary(locale);

  return (
    <div className="smsm-container py-8">
      <section className="smsm-panel max-w-3xl space-y-4 p-8">
        <p className="smsm-label text-[#cd0000]">{locale === "ar" ? "تأكيد الطلب" : "Order Intent"}</p>
        <h1 className="smsm-heading text-4xl font-extrabold">
          {locale === "ar" ? "تأكيد نية الشراء" : "Checkout Intent"}
        </h1>
        <p className="text-sm leading-8 text-[#c4c4c4]">
          {locale === "ar"
            ? "في هذه المرحلة يتم تأكيد الطلب عبر واتساب مع فريق SMSM STORE لاستكمال المقاسات وبيانات التسليم."
            : "At this stage, order intent is confirmed via WhatsApp with SMSM STORE for final sizing and delivery."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href={`/${locale}/cart`} className="smsm-btn-secondary">
            {dictionary.nav.cart}
          </Link>
          <Link
            href={`https://wa.me/${dictionary.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            className="smsm-btn-primary"
          >
            {dictionary.actions.checkoutWhatsapp}
          </Link>
        </div>
      </section>
    </div>
  );
}
