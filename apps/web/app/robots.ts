import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smsm-store.example.com";

  return {
    rules: {
      userAgent: "*",
      allow: ["/ar", "/en", "/images/"],
      disallow: ["/admin", "/api/"]
    },
    sitemap: siteUrl.replace(new RegExp("/$"), "") + "/sitemap.xml"
  };
}
