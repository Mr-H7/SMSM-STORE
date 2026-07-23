import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getPublicProducts } from "@/lib/system-api/queries";

const siteUrl = getSiteUrl();

function getProductLastModified(product: object) {
  if (!("updatedAt" in product) || typeof product.updatedAt !== "string") return undefined;
  return Number.isNaN(Date.parse(product.updatedAt)) ? undefined : product.updatedAt;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/products", "/offers", "/about", "/contact"].flatMap((route) => [
    { url: siteUrl + "/ar" + route, changeFrequency: "weekly" as const, priority: route ? 0.7 : 1 },
    { url: siteUrl + "/en" + route, changeFrequency: "weekly" as const, priority: route ? 0.7 : 1 }
  ]);

  try {
    const products = await getPublicProducts();
    return [
      ...staticRoutes,
      ...products.flatMap((product) => {
        const lastModified = getProductLastModified(product);
        return [
          {
            url: siteUrl + "/ar/products/" + product.slug,
            ...(lastModified ? { lastModified } : {}),
            changeFrequency: "daily" as const,
            priority: 0.8
          },
          {
            url: siteUrl + "/en/products/" + product.slug,
            ...(lastModified ? { lastModified } : {}),
            changeFrequency: "daily" as const,
            priority: 0.8
          }
        ];
      })
    ];
  } catch {
    return staticRoutes;
  }
}
