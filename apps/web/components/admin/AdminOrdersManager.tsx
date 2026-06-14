"use client";

import { useMemo, useState } from "react";
import { AdminTable } from "@/components/admin/AdminTable";
import { Order, OrderStatus } from "@/lib/types";
import { useAdminLocale } from "@/components/shared/AdminLocaleProvider";
import { getDictionary } from "@/lib/i18n/dictionary";
import { formatPriceEGP } from "@/lib/utils";
import { updateOrderStatusAction } from "@/lib/supabase/actions";

export function AdminOrdersManager({ initialOrders }: { initialOrders: Order[] }) {
  const { locale } = useAdminLocale();
  const dictionary = getDictionary(locale);
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeOrder, setActiveOrder] = useState<Order | null>(orders[0] ?? null);

  const filtered = useMemo(() => (status === "all" ? orders : orders.filter((order) => order.status === status)), [orders, status]);

  const updateStatus = async (id: string, next: OrderStatus) => {
    const result = await updateOrderStatusAction(id, next);
    if (!result.ok) return;
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status: next } : order)));
    setActiveOrder((prev) => (prev?.id === id ? { ...prev, status: next } : prev));
  };

  const rows = filtered.map((order) => [
    <button key="id" className="font-semibold text-[#ffb4a8]" onClick={() => setActiveOrder(order)}>{order.id}</button>,
    order.customerName,
    formatPriceEGP(order.total, locale),
    <span key="status" className="uppercase tracking-[0.12em] text-[#cd0000]">{order.status}</span>,
    <select key="action" value={order.status} onChange={(event) => updateStatus(order.id, event.target.value as OrderStatus)} className="smsm-input py-2 text-xs">
      {["new", "contacted", "processing", "completed", "cancelled"].map((value) => <option key={value} value={value}>{value}</option>)}
    </select>
  ]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_330px]">
      <section className="space-y-4">
        <h1 className="smsm-heading text-4xl font-extrabold">{dictionary.admin.orders}</h1>
        <div className="flex flex-wrap gap-2 border border-[#303030] bg-[#1a1a1a] p-3">
          {["all", "new", "contacted", "processing", "completed", "cancelled"].map((value) => (
            <button key={value} onClick={() => setStatus(value as OrderStatus | "all")} className={`px-3 py-2 text-xs uppercase tracking-[0.12em] ${status === value ? "bg-[#cd0000] text-white" : "border border-[#353535] text-[#d6d6d6]"}`}>{value}</button>
          ))}
        </div>
        <AdminTable headers={["Order ID", "Customer", "Total", "Status", "Update Status"]} rows={rows} />
      </section>
      <aside className="space-y-3 border border-[#303030] bg-[#1a1a1a] p-4">
        <h2 className="smsm-heading text-2xl font-bold">{locale === "ar" ? "تفاصيل الطلب" : "Order Details"}</h2>
        {activeOrder ? (
          <div className="space-y-3 text-sm">
            <div className="font-semibold">{activeOrder.id}</div>
            <div>{activeOrder.customerName}</div>
            <div>{activeOrder.phone}</div>
            <div className="text-[#c4c4c4]">{activeOrder.address}</div>
            <div className="border-t border-[#2d2d2d] pt-3">
              {activeOrder.items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="mb-2 border border-[#2b2b2b] p-2">
                  <div>{locale === "ar" ? item.productNameAr : item.productNameEn}</div>
                  <div className="text-xs text-[#9c9c9c]">{item.size} | {item.color} | x{item.quantity}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
