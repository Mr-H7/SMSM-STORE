export const productionSiteUrl = "https://smsmstore1.com";

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || productionSiteUrl).trim().replace(/\/$/, "");
}

export function absoluteSiteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return getSiteUrl() + (pathOrUrl.startsWith("/") ? pathOrUrl : "/" + pathOrUrl);
}
