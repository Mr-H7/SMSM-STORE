import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactClient } from "./ContactClient";
import { isLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolved = await params;
  if (!isLocale(resolved.locale)) return {};
  return localizedMetadata(resolved.locale, "contact", "/contact");
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolved = await params;
  if (!isLocale(resolved.locale)) notFound();
  return <ContactClient locale={resolved.locale} />;
}
