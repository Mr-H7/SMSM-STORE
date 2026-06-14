import type { Locale } from "@/lib/types";

const CHECKOUT_MESSAGES: Record<string, { ar: string; en: string }> = {
  "cart is empty": { ar: "السلة فارغة.", en: "Your cart is empty." },
  "insufficient stock": { ar: "المخزون غير كافٍ لإتمام الطلب.", en: "Insufficient stock to complete your order." },
  "invalid product": { ar: "أحد المنتجات غير صالح.", en: "One or more products are invalid." },
  "invalid quantity": { ar: "الكمية غير صالحة.", en: "Invalid quantity." },
  "invalid customer": { ar: "بيانات العميل غير صالحة.", en: "Invalid customer details." },
  "invalid cart item": { ar: "عنصر في السلة غير صالح.", en: "Invalid cart item." },
  "too many items": { ar: "عدد عناصر السلة كبير جدًا.", en: "Too many items in cart." }
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
    if (lower.includes(key)) {
      return locale === "ar" ? messages.ar : messages.en;
    }
  }
  return null;
}

export function toPublicError(
  error: unknown,
  context: "checkout" | "contact" | "login" | "upload" | "admin" = "admin",
  locale?: Locale
): string {
  const raw = error instanceof Error ? error.message : String(error ?? "");
  console.error(`[${context}]`, raw);

  if (context === "checkout") {
    const mapped = matchCheckoutMessage(raw, locale);
    if (mapped) return mapped;
    return locale === "ar" ? DEFAULT_PUBLIC.ar : DEFAULT_PUBLIC.en;
  }

  if (context === "contact") {
    if (raw.toLowerCase().includes("rate limit") || raw.toLowerCase().includes("too many")) {
      return locale === "ar" ? "محاولات كثيرة. حاول لاحقًا." : "Too many attempts. Please try again later.";
    }
    if (raw.toLowerCase().includes("rejected") || raw.toLowerCase().includes("required")) {
      return locale === "ar" ? "تعذر إرسال الرسالة. تحقق من البيانات." : "Unable to send your message. Check your details.";
    }
    return locale === "ar" ? DEFAULT_PUBLIC.ar : DEFAULT_PUBLIC.en;
  }

  if (context === "login") {
    return locale === "ar" ? "بيانات الدخول غير صحيحة." : "Invalid credentials.";
  }

  if (context === "upload") {
    if (
      raw.toLowerCase().includes("3mb") ||
      raw.toLowerCase().includes("jpeg") ||
      raw.toLowerCase().includes("png") ||
      raw.toLowerCase().includes("webp") ||
      raw.toLowerCase().includes("no file")
    ) {
      return raw;
    }
    return locale === "ar" ? "تعذر رفع الصورة." : "Unable to upload image.";
  }

  return locale === "ar" ? DEFAULT_ADMIN.ar : DEFAULT_ADMIN.en;
}
