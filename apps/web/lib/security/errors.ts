import type { Locale } from "@/lib/types";

const CHECKOUT_MESSAGES: Record<string, { ar: string; en: string }> = {
  "cart is empty": { ar: "السلة فارغة.", en: "Your cart is empty." },
  "insufficient stock": { ar: "المخزون غير كافٍ لإتمام الطلب.", en: "Insufficient stock to complete your order." },
  "invalid product": { ar: "أحد المنتجات غير صالح.", en: "One or more products are invalid." },
  "invalid quantity": { ar: "الكمية غير صالحة.", en: "Invalid quantity." },
  "invalid customer": { ar: "بيانات العميل غير صالحة.", en: "Invalid customer details." },
  "invalid cart item": { ar: "عنصر في السلة غير صالح.", en: "Invalid cart item." },
  "too many items": { ar: "عدد عناصر السلة كبير جداً.", en: "Too many items in cart." }
};

const DEFAULT_PUBLIC = {
  ar: "تعذر إكمال الطلب. حاول مرة أخرى.",
  en: "Unable to complete your request. Please try again."
};

const DEFAULT_ADMIN = {
  ar: "تعذر إكمال العملية.",
  en: "Unable to complete the operation."
};

function matchCheckoutMessage(raw: string, locale?: Locale): string | null {
  const lower = raw.toLowerCase();
  for (const [key, messages] of Object.entries(CHECKOUT_MESSAGES)) {
    if (lower.includes(key)) return locale === "ar" ? messages.ar : messages.en;
  }
  return null;
}

type SafeErrorDetails = {
  name?: string;
  message: string;
  code?: string;
  details?: string;
  hint?: string;
  status?: number;
};

function readErrorField(error: unknown, field: string): unknown {
  if (!error || typeof error !== "object") return undefined;
  return Reflect.get(error, field);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  const message = readErrorField(error, "message");
  if (typeof message === "string" && message.trim()) return message;
  return String(error ?? "Unknown error");
}

export function getSafeErrorDetails(error: unknown): SafeErrorDetails {
  const rawMessage = getErrorMessage(error);
  const details: SafeErrorDetails = { message: rawMessage.slice(0, 500) };
  for (const field of ["name", "code", "details", "hint"] as const) {
    const value = readErrorField(error, field);
    if (typeof value === "string" && value.trim()) details[field] = value.slice(0, 500);
  }
  const status = readErrorField(error, "status");
  if (typeof status === "number") details.status = status;
  return details;
}

export function toPublicError(
  error: unknown,
  context: "checkout" | "contact" | "login" | "upload" | "admin" = "admin",
  locale?: Locale
): string {
  const raw = getErrorMessage(error);
  console.error("[" + context + "]", JSON.stringify(getSafeErrorDetails(error), null, 2));

  if (context === "checkout") {
    const mapped = matchCheckoutMessage(raw, locale);
    return mapped ?? (locale === "ar" ? DEFAULT_PUBLIC.ar : DEFAULT_PUBLIC.en);
  }
  if (context === "contact") {
    if (raw.toLowerCase().includes("rate limit") || raw.toLowerCase().includes("too many")) {
      return locale === "ar" ? "محاولات كثيرة. حاول لاحقاً." : "Too many attempts. Please try again later.";
    }
    return locale === "ar" ? "تعذر إرسال الرسالة. تحقق من البيانات." : "Unable to send your message. Check your details.";
  }
  if (context === "login") return locale === "ar" ? "بيانات الدخول غير صحيحة." : "Invalid credentials.";
  if (context === "upload") return locale === "ar" ? "تعذر رفع الصورة." : "Unable to upload image.";
  return locale === "ar" ? DEFAULT_ADMIN.ar : DEFAULT_ADMIN.en;
}
