import { Locale } from "@/lib/types";

export const LOCALES: Locale[] = ["ar", "en"];
export const DEFAULT_LOCALE: Locale = "ar";

export const isLocale = (value: string): value is Locale =>
  LOCALES.includes(value as Locale);

export const getDirection = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");

export const withLocalePath = (locale: Locale, path: string) => {
  if (!path || path === "/") {
    return `/${locale}`;
  }
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
};

