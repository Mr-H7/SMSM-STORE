"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Dictionary } from "@/lib/i18n/dictionary";
import { Locale } from "@/lib/types";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { WhatsappButton } from "@/components/shared/WhatsappButton";
import { useCart } from "@/components/shared/CartProvider";

type Props = {
  locale: Locale;
  dictionary: Dictionary;
};

export function Navbar({ locale, dictionary }: Props) {
  const [open, setOpen] = useState(false);
  const [pathname, setPathname] = useState("");
  const { totalItems } = useCart();

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const links = [
    { href: `/${locale}`, label: dictionary.nav.home },
    { href: `/${locale}/products`, label: dictionary.nav.products },
    { href: `/${locale}/offers`, label: dictionary.nav.offers },
    { href: `/${locale}/about`, label: dictionary.nav.about },
    { href: `/${locale}/contact`, label: dictionary.nav.contact }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#222] bg-[#060606]/95 backdrop-blur-md">
      <div className="smsm-container flex h-16 items-center justify-between gap-3 lg:h-[74px]">
        <Link href={`/${locale}`} className="flex items-center gap-3 transition duration-300 hover:opacity-90">
          <Image
            src="/images/smsm-logo.png"
            alt="SMSM STORE"
            width={44}
            height={44}
            className="h-11 w-11 rounded-sm border border-[#2b2b2b] object-cover"
            priority
          />
          <div className="hidden sm:block">
            <p className="smsm-heading text-xl font-extrabold leading-none text-[#f4f0e9]">SMSM STORE</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#9f9f9f]">
              BEST SHOES STORE
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`smsm-heading text-[12px] font-semibold tracking-[0.12em] transition duration-300 hover:-translate-y-0.5 ${
                pathname === link.href
                  ? "border-b border-[#cd0000] pb-1 text-[#cd0000]"
                  : "text-[#c3c3c3] hover:text-[#f0ece4]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button className="text-[#9b9b9b] transition duration-300 hover:-translate-y-0.5 hover:text-[#f3efe8]">
            <Search className="h-4 w-4" />
          </button>
          <Link
            href={`/${locale}/cart`}
            className="relative text-[#9b9b9b] transition duration-300 hover:-translate-y-0.5 hover:text-[#f3efe8]"
          >
            <ShoppingCart className="h-4 w-4" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#CD0000] text-[11px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>
          <LanguageSwitcher locale={locale} label={dictionary.actions.language} />
          <WhatsappButton
            href={`https://wa.me/${dictionary.whatsapp.replace(/\D/g, "")}`}
            label={dictionary.actions.orderWhatsapp}
            primary
          />
        </div>

        <button
          className="rounded border border-[#2c2c2c] p-2 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="animate-section-in border-t border-[#2d2d2d] bg-[#090909] md:hidden">
          <div className="smsm-container flex flex-col gap-4 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`smsm-heading text-[12px] tracking-[0.12em] ${
                  pathname === link.href ? "text-[#cd0000]" : "text-[#f0ece4]"
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3">
              <LanguageSwitcher locale={locale} label={dictionary.actions.language} />
              <Link href={`/${locale}/cart`} className="smsm-btn-secondary">
                {dictionary.nav.cart} ({totalItems})
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
