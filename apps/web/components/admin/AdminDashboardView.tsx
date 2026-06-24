"use client";

import Link from "next/link";
import Image from "next/image";
import { CustomerMessage, Order, Product } from "@/lib/types";
import { useAdminLocale } from "@/components/shared/AdminLocaleProvider";
import { getDictionary } from "@/lib/i18n/dictionary";
import { formatPriceEGP } from "@/lib/utils";

type Props = {
  products: Product[];
  orders: Order[];
  messages: CustomerMessage[];
};

export function AdminDashboardView({ products, orders, messages }: Props) {
  const { locale } = useAdminLocale();
  const dictionary = getDictionary(locale);

  const pending = orders.filter((order) => order.status === "new" || order.status === "processing").length;
  const completed = orders.filter((order) => order.status === "completed").length;
  const lowStock = products.filter((product) => product.stock <= 10).length;
  const unreadMessages = messages.filter((message) => message.status === "unread").length;

  const cards = [
    { label: locale === "ar" ? "إجمالي المنتجات" : "Total Products", value: products.length, note: locale === "ar" ? "كتالوج مباشر" : "Live catalog" },
    { label: locale === "ar" ? "إجمالي الطلبات" : "Total Orders", value: orders.length, note: locale === "ar" ? "كل الوقت" : "All time" },
    { label: locale === "ar" ? "طلبات معلقة" : "Pending Orders", value: pending, note: locale === "ar" ? "يتطلب متابعة" : "Attention required" },
    { label: locale === "ar" ? "مكتملة" : "Completed", value: completed, note: locale === "ar" ? "طلبات منفذة" : "Fulfilled orders" },
    { label: locale === "ar" ? "مخزون منخفض" : "Low Stock", value: lowStock, note: locale === "ar" ? "10 قطع أو أقل" : "10 units or less" },
    { label: locale === "ar" ? "رسائل غير مقروءة" : "Unread Messages", value: unreadMessages, note: locale === "ar" ? "صندوق العملاء" : "Customer inbox" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {cards.map((card, idx) => (
          <div key={card.label} className={`border bg-[#1a1a1a] p-5 ${idx === 2 ? "border-[#cd0000]" : "border-[#303030]"}`}>
            <div className="smsm-label">{card.label}</div>
            <div className="mt-4 text-5xl font-bold text-[#efe7dd]">{card.value}</div>
            <div className={`mt-2 text-xs uppercase tracking-[0.12em] ${idx === 2 ? "text-[#cd0000]" : "text-[#57c57f]"}`}>
              {card.note}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="border border-[#303030] bg-[#1a1a1a]">
          <div className="flex items-center justify-between border-b border-[#2f2f2f] px-5 py-4">
            <h2 className="smsm-heading text-3xl font-bold">{dictionary.admin.recentOrders}</h2>
            <Link href="/admin/orders" className="smsm-btn-secondary text-xs">
              {locale === "ar" ? "عرض الكل" : "View All"}
            </Link>
          </div>
          <div className="divide-y divide-[#2b2b2b]">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="grid grid-cols-5 gap-2 px-5 py-4 text-sm">
                <div className="font-semibold">{order.id}</div>
                <div>{order.customerName}</div>
                <div>{order.createdAt}</div>
                <div className="uppercase tracking-[0.12em] text-[#cd0000]">{order.status}</div>
                <div className="text-end font-semibold">{formatPriceEGP(order.total, locale)}</div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="border border-[#303030] bg-[#1a1a1a] p-5">
            <h2 className="smsm-heading text-3xl font-bold">{locale === "ar" ? "الأكثر مبيعًا" : "Top Selling"}</h2>
            <div className="mt-4 space-y-3">
              {products.filter((product) => product.bestSeller).slice(0, 3).map((product) => (
                <div key={product.id} className="flex items-center gap-3 border border-[#2c2c2c] p-2">
                  <Image
                    src={product.images[0] ?? "/images/smsm-logo.png"}
                    alt={locale === "ar" ? product.nameAr : product.nameEn}
                    width={64}
                    height={56}
                    className="h-14 w-16 object-cover"
                  />
                  <div className="flex-1">
                    <p className="smsm-label text-[#cd0000]">{product.category}</p>
                    <p className="text-sm font-semibold">{locale === "ar" ? product.nameAr : product.nameEn}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatPriceEGP(product.price, locale)}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
