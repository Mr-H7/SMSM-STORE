"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createContactMessageAction } from "@/lib/supabase/actions";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/locale";

export default function ContactPage({ params }: { params: any }) {
  const locale = isLocale(params?.locale) ? params.locale : "ar";
  const dictionary = getDictionary(locale);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const result = await createContactMessageAction({ name, contact, message, website });
    if (result.ok) {
      setDone(true);
      setName("");
      setContact("");
      setMessage("");
      setWebsite("");
      return;
    }
    setError(result.message);
  };

  return (
    <div className="smsm-container animate-page-in space-y-8 py-8">
      <section className="grid gap-6 border-b border-[#222] pb-8 lg:grid-cols-2">
        <div>
          <h1 className="smsm-heading text-6xl font-extrabold">{dictionary.nav.contact}</h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-[#b9b9b9]">
            {locale === "ar"
              ? "تواصل مع فريق SMSM STORE لأي استفسار عن الموديلات، المقاسات، أو الطلبات."
              : "Connect with SMSM STORE concierge for drops, sizing, and order support."}
          </p>
        </div>
        <div className="smsm-panel p-5">
          <p className="smsm-label text-[#cd0000]">{locale === "ar" ? "دعم واتساب مباشر" : "Live WhatsApp Support"}</p>
          <p className="mt-2 text-4xl font-bold">+20 11 52333633</p>
          <p className="mt-3 text-sm text-[#b9b9b9]">{locale === "ar" ? "بنها، الفلل شارع العبد" : "Benha, Al-Villas, Al-Abd Street"}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form className="relative smsm-panel space-y-4 p-6" onSubmit={onSubmit}>
          <h2 className="smsm-heading text-2xl font-bold">{locale === "ar" ? "استفسار مباشر" : "Direct Inquiry"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input required value={name} onChange={(event) => setName(event.target.value)} placeholder={locale === "ar" ? "الاسم الكامل" : "Full Name"} className="smsm-input" />
            <input required value={contact} onChange={(event) => setContact(event.target.value)} placeholder={locale === "ar" ? "الهاتف أو البريد الإلكتروني" : "Phone or Email"} className="smsm-input" />
          </div>
          <textarea required value={message} onChange={(event) => setMessage(event.target.value)} placeholder={locale === "ar" ? "الرسالة" : "Message"} className="smsm-input h-40" />
          <input
            type="text"
            name="website"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="pointer-events-none absolute h-0 w-0 opacity-0"
          />
          <button className="smsm-btn-primary w-full" type="submit">
            {locale === "ar" ? "إرسال الرسالة" : "Transmit Message"}
          </button>
          {done ? <p className="text-sm text-[#ffb4a8]">{locale === "ar" ? "تم إرسال رسالتك بنجاح." : "Your message was sent successfully."}</p> : null}
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
        </form>

        <aside className="space-y-4">
          <div className="smsm-panel p-5">
            <h3 className="smsm-label mb-2 text-[#cd0000]">{locale === "ar" ? "العنوان" : "Location"}</h3>
            <p className="text-sm leading-7 text-[#c4c4c4]">{locale === "ar" ? "بنها، الفلل شارع العبد" : "Benha, Al-Villas, Al-Abd Street"}</p>
          </div>
          <div className="smsm-panel p-5">
            <h3 className="smsm-label mb-2 text-[#cd0000]">{locale === "ar" ? "أوقات العمل" : "Hours"}</h3>
            <p className="text-sm text-[#c4c4c4]">{locale === "ar" ? "10:00 - 22:00 يوميًا" : "10:00 - 22:00 Daily"}</p>
          </div>
          <div className="smsm-panel p-5">
            <h3 className="smsm-label mb-2 text-[#cd0000]">{locale === "ar" ? "روابط" : "Social"}</h3>
            <div className="flex gap-3 text-sm">
              <Link href="https://instagram.com/smsmstore" target="_blank" className="smsm-btn-secondary px-4">Instagram</Link>
              <Link href="https://facebook.com/smsmstore" target="_blank" className="smsm-btn-secondary px-4">Facebook</Link>
            </div>
          </div>
        </aside>
      </section>

      <section className="smsm-panel relative h-72 overflow-hidden">
        <Image src="/images/smsm-store-hero.jpeg" alt="SMSM STORE" fill sizes="100vw" className="object-cover opacity-55" />
        <div className="absolute start-6 top-6 max-w-xs bg-[#151515]/90 p-5">
          <p className="smsm-label text-[#cd0000]">{locale === "ar" ? "زيارة المتجر" : "Visit the Store"}</p>
          <p className="mt-2 text-sm text-[#ddd4cb]">
            {locale === "ar" ? "يمكنك زيارة المعرض للحجز والاستلام المباشر." : "Visit our physical location for direct pickup and consultation."}
          </p>
        </div>
      </section>
    </div>
  );
}
