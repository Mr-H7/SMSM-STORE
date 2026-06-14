"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Locale } from "@/lib/types";

type Props = {
  locale: Locale;
  label: string;
};

export function LanguageSwitcher({ locale, label }: Props) {
  const [pathname, setPathname] = useState("");
  const segments = (pathname ?? "").split("/").filter(Boolean);
  const opposite: Locale = locale === "ar" ? "en" : "ar";

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const targetPath =
    segments.length === 0
      ? `/${opposite}`
      : `/${[opposite, ...segments.slice(1)].join("/")}`;

  return (
    <Link href={targetPath} className="smsm-heading text-[11px] uppercase tracking-[0.14em] text-[#bdbdbd] transition hover:text-[#cd0000]">
      {label}
    </Link>
  );
}
