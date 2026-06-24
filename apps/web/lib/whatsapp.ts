import type { CartItem, Locale, Product } from "@/lib/types";

const WHATSAPP_NUMBER = "201559978355";

export function getWhatsappBaseUrl() {
  return "https://wa.me/" + WHATSAPP_NUMBER;
}

export function buildProductWhatsappUrl(
  locale: Locale,
  product: Product,
  selectedSize: string,
  selectedColor: string,
  quantity: number
) {
  const productName = locale === "ar" ? product.nameAr : product.nameEn;
  const message =
    locale === "ar"
      ? "مرحباً SMSM STORE، أريد طلب:\n- المنتج: " + productName + "\n- المقاس: " + selectedSize + "\n- اللون: " + (selectedColor || "-") + "\n- الكمية: " + quantity
      : "Hello SMSM STORE, I would like to order:\n- Product: " + productName + "\n- Size: " + selectedSize + "\n- Color: " + (selectedColor || "-") + "\n- Quantity: " + quantity;

  return getWhatsappBaseUrl() + "?text=" + encodeURIComponent(message);
}

export function buildCartWhatsappUrl(
  locale: Locale,
  items: CartItem[],
  customer: { name: string; phone: string; address: string; notes: string },
  orderNumber?: string
) {
  const lines = items.map((item) => {
    const productName = locale === "ar" ? item.nameAr : item.nameEn;
    return locale === "ar"
      ? productName + " | مقاس: " + item.size + " | لون: " + (item.color || "-") + " | كمية: " + item.quantity
      : productName + " | Size: " + item.size + " | Color: " + (item.color || "-") + " | Qty: " + item.quantity;
  });

  const customerLine =
    locale === "ar"
      ? "الاسم: " + customer.name + "\nالهاتف: " + customer.phone + "\nالعنوان: " + customer.address + "\nملاحظات: " + (customer.notes || "-")
      : "Name: " + customer.name + "\nPhone: " + customer.phone + "\nAddress: " + customer.address + "\nNotes: " + (customer.notes || "-");

  const header = locale === "ar" ? "طلب جديد من الموقع:" : "New order from website:";
  const orderLine = orderNumber
    ? locale === "ar"
      ? "رقم الطلب: " + orderNumber
      : "Order number: " + orderNumber
    : "";
  const message = header + "\n" + (orderLine ? orderLine + "\n" : "") + lines.join("\n") + "\n\n" + customerLine;
  return getWhatsappBaseUrl() + "?text=" + encodeURIComponent(message);
}
