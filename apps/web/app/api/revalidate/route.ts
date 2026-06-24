import crypto from "node:crypto";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const configured = process.env.SYSTEM_REVALIDATE_SECRET?.trim();
  const authorization = request.headers.get("authorization") ?? "";
  const supplied = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";

  if (!configured || !supplied || !safeEqual(configured, supplied)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  revalidateTag("storefront-products");
  revalidateTag("storefront-categories");

  return Response.json({ ok: true, revalidatedAt: new Date().toISOString() });
}
