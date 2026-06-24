import type { Metadata } from "next";
import "@/app/globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smsm-store.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SMSM STORE | Premium Sneakers in Egypt",
    template: "%s | SMSM STORE"
  },
  description: "Premium bilingual sneaker store in Egypt with curated drops, WhatsApp ordering, and local SMSM inventory.",
  alternates: {
    canonical: "/ar",
    languages: {
      ar: "/ar",
      en: "/en"
    }
  },
  openGraph: {
    type: "website",
    siteName: "SMSM STORE",
    title: "SMSM STORE | Premium Sneakers",
    description: "Shop curated sneakers and premium streetwear styles from SMSM STORE.",
    url: siteUrl,
    images: [{ url: "/images/smsm-logo.png", width: 1200, height: 630, alt: "SMSM STORE" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "SMSM STORE | Premium Sneakers",
    description: "Shop curated sneakers and premium streetwear styles from SMSM STORE.",
    images: ["/images/smsm-logo.png"]
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png"
  }
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar">
      <body>{children}</body>
    </html>
  );
}
