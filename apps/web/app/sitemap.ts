import type { MetadataRoute } from "next";
import { getPublicProducts } from "@/lib/system-api/queries";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://smsm-store.example.com").replace(new RegExp("/$"), "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/products", "/offers", "/about", "/contact"].flatMap((route) => [
    { url: siteUrl + "/ar" + route, lastModified: new Date(), changeFrequency: "weekly" as const, priority: route ? 0.7 : 1 },
    { url: siteUrl + "/en" + route, lastModified: new Date(), changeFrequency: "weekly" as const, priority: route ? 0.7 : 1 }
  ]);

  try {
    const products = await getPublicProducts();
    return [
      ...staticRoutes,
      ...products.flatMap((product) => [
        {
          url: siteUrl + "/ar/products/" + product.slug,
          lastModified: new Date(),
          changeFrequency: "daily" as const,
          priority: 0.8
        },
        {
          url: siteUrl + "/en/products/" + product.slug,
          lastModified: new Date(),
          changeFrequency: "daily" as const,
          priority: 0.8
        }
      ])
    ];
  } catch {
    return staticRoutes;
  }
}

