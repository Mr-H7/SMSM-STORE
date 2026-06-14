"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/shared/CartProvider";
import { createCheckoutOrderAction } from "@/lib/supabase/actions";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/locale";
import { formatPriceEGP } from "@/lib/utils";
import { buildCartWhatsappUrl } from "@/lib/whatsapp";

export default function CartPage({ params }: { params: any }) {
  const locale = isLocale(params?.locale) ? params.locale : "ar";
  const dictionary = getDictionary(locale);
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const checkoutHref = useMemo(() => buildCartWhatsappUrl(locale, items, { name, phone, address, notes }), [locale, items, name, phone, address, notes]);
  const canCheckout = Boolean(items.length && name.trim() && phone.trim() && address.trim());

  if (items.length === 0) {
    return (
      <div className="smsm-container py-12">
        <div className="smsm-panel p-10 text-center">
          <h1 className="smsm-heading text-3xl font-bold">{dictionary.cart.empty}</h1>
          <p className="mt-2 text-[#b9b9b9]">{dictionary.cart.emptySub}</p>
          <Link href={`/${locale}/products`} className="smsm-btn-primary mt-6">{dictionary.actions.continueShopping}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="smsm-container animate-page-in space-y-8 py-8">
      <header className="border-b border-[#252525] pb-5">
        <h1 className="smsm-heading text-5xl font-extrabold">{dictionary.cart.title}</h1>
        <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[#8d8d8d]">
          {locale === "ar" ? "تجربة شراء آمنة وسريعة" : "Elite selection / secure checkout"}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-4">
          {items.map((item) => (
            <article key={`${item.productId}-${item.size}-${item.color}`} className="smsm-panel p-5 transition duration-300 hover:border-[#4a4a4a]">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative h-32 w-full overflow-hidden rounded-md border border-[#2f2f2f] sm:w-44">
                  <Image src={item.image} alt={item.nameEn} fill sizes="(max-width: 640px) 100vw, 176px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="smsm-heading text-3xl font-semibold">{locale === "ar" ? item.nameAr : item.nameEn}</h3>
                  <p className="mt-1 text-sm text-[#9f9f9f]">
                    {locale === "ar" ? "المقاس" : "Size"} {item.size} / {locale === "ar" ? "اللون" : "Color"} {item.color || "-"}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-green-300">
                    {locale === "ar" ? "سيتم تأكيد المخزون عند إتمام الطلب" : "Stock is verified when checkout is submitted"}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center border border-[#323232]">
                      <button className="px-3 py-2 transition hover:bg-[#1f1f1f]" onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}>-</button>
                      <span className="px-3 py-2">{item.quantity}</span>
                      <button
                        className="px-3 py-2 transition hover:bg-[#1f1f1f] disabled:opacity-40"
                        disabled={item.quantity >= (item.maxStock ?? item.quantity)}
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <p className="text-2xl font-bold text-[#ffb4a8]">{formatPriceEGP(item.price, locale)}</p>
                  </div>
                </div>
                <button className="self-start text-xs uppercase tracking-[0.15em] text-[#8f8f8f] transition hover:text-[#cd0000]" onClick={() => removeItem(item.productId, item.size, item.color)}>
                  {locale === "ar" ? "حذف" : "Remove"}
                </button>
              </div>
            </article>
          ))}

          <div className="smsm-panel space-y-4 p-6">
            <div className="flex justify-between text-sm text-[#b5b5b5]"><span>{dictionary.cart.subtotal}</span><span>{formatPriceEGP(totalPrice, locale)}</span></div>
            <div className="flex justify-between text-sm text-[#b5b5b5]"><span>{locale === "ar" ? "الشحن" : "Express Shipping"}</span><span className="text-[#cd0000]">{locale === "ar" ? "مجاني" : "Free"}</span></div>
            <div className="border-t border-[#2d2d2d] pt-4">
              <div className="flex justify-between text-4xl font-bold"><span>{dictionary.cart.total}</span><span>{formatPriceEGP(totalPrice, locale)}</span></div>
            </div>
          </div>
        </section>

        <section className="smsm-panel h-fit space-y-4 p-6">
          <h2 className="smsm-heading text-3xl font-bold">{dictionary.cart.customerInfo}</h2>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder={dictionary.cart.name} className="smsm-input" />
          <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder={dictionary.cart.phone} className="smsm-input" />
          <textarea value={address} onChange={(event) => setAddress(event.target.value)} placeholder={dictionary.cart.address} className="smsm-input h-28" />
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={dictionary.cart.notes} className="smsm-input h-20" />
          <button
            disabled={!canCheckout || submitting}
            onClick={async () => {
              setSubmitting(true);
              setCheckoutError("");
              const result = await createCheckoutOrderAction({ name, phone, address, notes }, items, locale);
              setSubmitting(false);
              if (!result.ok) {
                setCheckoutError(result.message);
                return;
              }
              clearCart();
              window.open(checkoutHref, "_blank", "noopener,noreferrer");
            }}
            className="smsm-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (locale === "ar" ? "جارٍ تأكيد المخزون..." : "Confirming stock...") : dictionary.actions.checkoutWhatsapp}
          </button>
          {checkoutError ? <p className="text-sm text-red-300">{checkoutError}</p> : null}
          <button onClick={clearCart} className="smsm-btn-secondary w-full">{locale === "ar" ? "تفريغ السلة" : "Clear Cart"}</button>
        </section>
      </div>
    </div>
  );
}
