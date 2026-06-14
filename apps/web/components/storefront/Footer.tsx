import Link from "next/link";
import Image from "next/image";
import { Dictionary } from "@/lib/i18n/dictionary";
import { Locale } from "@/lib/types";

type Props = {
  locale: Locale;
  dictionary: Dictionary;
};

export function Footer({ locale, dictionary }: Props) {
  const year = new Date().getFullYear();
  const city = locale === "ar" ? "بنها" : "Benha";
  const fullAddress = locale === "ar" ? "بنها، الفلل شارع العبد" : "Benha, Al-Villas, Al-Abd Street";

  return (
    <footer className="mt-16 border-t border-[#242424] bg-[#080808]">
      <div className="smsm-container py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <section className="space-y-4 lg:col-span-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/smsm-logo.png"
                alt="SMSM STORE"
                width={48}
                height={48}
                className="h-12 w-12 rounded-sm border border-[#2b2b2b] object-cover"
              />
              <div>
                <h3 className="smsm-heading text-2xl font-extrabold">SMSM STORE</h3>
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#8f8f8f]">BEST SHOES STORE</p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-7 text-[#a3a3a3]">
              {locale === "ar"
                ? "وجهة أحذية وسنيكرز فاخرة بجودة أصلية وتجربة شراء سريعة عبر واتساب."
                : "Premium sneaker destination with authentic quality and a fast WhatsApp ordering flow."}
            </p>
          </section>

          <section className="space-y-4 lg:col-span-2">
            <h4 className="smsm-label text-[#cd0000]">{locale === "ar" ? "التسوق" : "Shop"}</h4>
            <div className="space-y-2 text-sm text-[#c7c7c7]">
              <Link className="block transition hover:text-[#efe6dc]" href={`/${locale}/products`}>
                {dictionary.nav.products}
              </Link>
              <Link className="block transition hover:text-[#efe6dc]" href={`/${locale}/offers`}>
                {dictionary.nav.offers}
              </Link>
            </div>
          </section>

          <section className="space-y-4 lg:col-span-2">
            <h4 className="smsm-label text-[#cd0000]">{locale === "ar" ? "الدعم" : "Support"}</h4>
            <div className="space-y-2 text-sm text-[#c7c7c7]">
              <Link className="block transition hover:text-[#efe6dc]" href={`/${locale}/contact`}>
                {dictionary.nav.contact}
              </Link>
              <p>{dictionary.whatsapp}</p>
              <p>{city}</p>
            </div>
          </section>

          <section className="space-y-4 lg:col-span-2">
            <h4 className="smsm-label text-[#cd0000]">{locale === "ar" ? "الموقع" : "Location"}</h4>
            <p className="text-sm leading-7 text-[#c7c7c7]">{fullAddress}</p>
          </section>

          <section className="space-y-4 lg:col-span-2">
            <h4 className="smsm-label text-[#cd0000]">{locale === "ar" ? "النشرة" : "Newsletter"}</h4>
            <div className="space-y-2">
              <input
                className="smsm-input"
                placeholder={locale === "ar" ? "البريد الإلكتروني" : "Email address"}
              />
              <button className="smsm-btn-primary w-full px-4">{locale === "ar" ? "اشتراك" : "Join"}</button>
            </div>
          </section>
        </div>
      </div>

      <div className="border-t border-[#202020]">
        <div className="smsm-container flex flex-col gap-3 py-5 text-xs tracking-[0.14em] text-[#717171] sm:flex-row sm:items-center sm:justify-between">
          <p>(c) {year} SMSM STORE. {dictionary.footer.rights}</p>
          <Link
            href="/admin/login"
            className="text-[11px] uppercase tracking-[0.16em] text-[#8b8b8b] transition hover:text-[#cd0000]"
          >
            {locale === "ar" ? "دخول الإدارة" : "Admin Login"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
