"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Locale } from "@/lib/types";

type AdminLocaleContextValue = {
  locale: Locale;
  dir: "rtl" | "ltr";
  setLocale: (locale: Locale) => void;
};

const AdminLocaleContext = createContext<AdminLocaleContextValue | undefined>(undefined);
const STORAGE_KEY = "smsm_admin_locale";

export function AdminLocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ar");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "ar" || stored === "en") {
      setLocale(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const value = useMemo<AdminLocaleContextValue>(
    () => ({
      locale,
      dir: locale === "ar" ? "rtl" : "ltr",
      setLocale
    }),
    [locale]
  );

  return <AdminLocaleContext.Provider value={value}>{children}</AdminLocaleContext.Provider>;
}

export function useAdminLocale() {
  const context = useContext(AdminLocaleContext);
  if (!context) {
    throw new Error("useAdminLocale must be used inside AdminLocaleProvider");
  }
  return context;
}
