"use server";

import { headers } from "next/headers";
import { CartItem, Locale } from "@/lib/types";
import { checkContactRateLimit } from "@/lib/security/rate-limit";
import { getSafeErrorDetails } from "@/lib/security/errors";

type CheckoutCustomer = {
  name: string;
  phone: string;
  address: string;
  notes?: string;
};

function apiConfig() {
  const base = process.env.SYSTEM_API_URL?.trim().replace(new RegExp("/$"), "");
  const key = process.env.SYSTEM_API_KEY?.trim();
  if (!base || !key) throw new Error("System API is not configured.");
  return { base, key };
}

function clean(value: unknown, max: number) {
  return String(value ?? "").replace(new RegExp("[\\u0000-\\u001f\\u007f]", "g"), " ").replace(new RegExp("\\s+", "g"), " ").trim().slice(0, max);
}

function checkoutMessage(code: string, locale: Locale) {
  const messages: Record<string, { ar: string; en: string }> = {
    RATE_LIMITED: { ar: "محاولات كثيرة. حاول مرة أخرى بعد قليل.", en: "Too many attempts. Please try again shortly." },
    INSUFFICIENT_STOCK: { ar: "المخزون غير كافٍ لإتمام الطلب.", en: "Insufficient stock to complete your order." },
    PRODUCT_UNAVAILABLE: { ar: "أحد المنتجات لم يعد متاحاً.", en: "One or more products are no longer available." },
    INVALID_SIZE: { ar: "المقاس المختار غير متاح.", en: "The selected size is unavailable." },
    INVALID_COLOR: { ar: "اللون المختار غير متاح.", en: "The selected color is unavailable." },
    INVALID_CUSTOMER: { ar: "بيانات العميل غير مكتملة.", en: "Customer details are incomplete." },
    INVALID_REQUEST: { ar: "بيانات الطلب غير صالحة.", en: "Order details are invalid." }
  };
  return messages[code]?.[locale] ?? (locale === "ar" ? "تعذر إكمال الطلب. حاول مرة أخرى." : "Unable to complete order. Please try again.");
}

async function systemPost<T>(
  path: string,
  payload: unknown,
  extraHeaders: Record<string, string> = {}
): Promise<T> {
  const { base, key } = apiConfig();
  const response = await fetch(base + path, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...extraHeaders,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.ok) {
    const error = new Error("System API request failed.");
    Object.assign(error, { code: body?.error?.code ?? "SYSTEM_API_ERROR", status: response.status });
    throw error;
  }
  return body as T;
}

export async function createCheckoutOrderAction(
  customer: CheckoutCustomer,
  items: CartItem[],
  locale: Locale,
  idempotencyKey: string
) {
  try {
    const normalizedCustomer = {
      name: clean(customer.name, 120),
      phone: clean(customer.phone, 40),
      address: clean(customer.address, 300),
      notes: clean(customer.notes, 500),
    };
    if (!normalizedCustomer.name || !normalizedCustomer.phone || !normalizedCustomer.address) {
      return { ok: false as const, message: checkoutMessage("INVALID_CUSTOMER", locale) };
    }
    if (!Array.isArray(items) || !items.length || items.length > 50) {
      return { ok: false as const, message: locale === "ar" ? "السلة فارغة أو غير صالحة." : "Cart is empty or invalid." };
    }

    const payload = {
      customer: normalizedCustomer,
      locale,
      items: items.map((item) => ({
        storefrontProductId: item.productId,
        selectedSize: clean(item.size, 20),
        selectedColor: clean(item.color, 40),
        quantity: item.quantity,
      })),
    };
    const result = await systemPost<{
      ok: true;
      order: { id: string; orderNumber: string; status: string; total: number; createdAt: string };
    }>("/api/storefront/v1/orders", payload, { "Idempotency-Key": clean(idempotencyKey, 128) });

    return { ok: true as const, message: "Order created.", order: result.order };
  } catch (error) {
    const details = getSafeErrorDetails(error);
    console.error("[checkout:system-api]", JSON.stringify(details, null, 2));
    const code = typeof Reflect.get(Object(error), "code") === "string" ? String(Reflect.get(Object(error), "code")) : "";
    return { ok: false as const, message: checkoutMessage(code, locale) };
  }
}

export async function createContactMessageAction(payload: {
  name: string;
  contact: string;
  message: string;
  website?: string;
}) {
  if (payload.website?.trim()) {
    return { ok: false as const, message: "Unable to send message." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate = checkContactRateLimit(ip);
  if (!rate.ok) return { ok: false as const, message: rate.message };

  try {
    await systemPost("/api/storefront/v1/contact-messages", {
      name: clean(payload.name, 120),
      contact: clean(payload.contact, 160),
      message: clean(payload.message, 2000),
    });
    return { ok: true as const, message: "Message saved." };
  } catch (error) {
    console.error("[contact:system-api]", JSON.stringify(getSafeErrorDetails(error), null, 2));
    return { ok: false as const, message: "Unable to send your message. Please try again." };
  }
}
