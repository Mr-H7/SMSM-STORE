"use client";

import { useMemo, useState } from "react";
import { AdminTable } from "@/components/admin/AdminTable";
import { CustomerMessage, MessageStatus } from "@/lib/types";
import { useAdminLocale } from "@/components/shared/AdminLocaleProvider";
import { getDictionary } from "@/lib/i18n/dictionary";
import { deleteMessageAction, updateMessageStatusAction } from "@/lib/supabase/actions";

export function AdminMessagesManager({ initialMessages }: { initialMessages: CustomerMessage[] }) {
  const { locale } = useAdminLocale();
  const dictionary = getDictionary(locale);
  const [messages, setMessages] = useState<CustomerMessage[]>(initialMessages);
  const [status, setStatus] = useState<MessageStatus | "all">("all");
  const [active, setActive] = useState<CustomerMessage | null>(initialMessages[0] ?? null);

  const filtered = useMemo(() => (status === "all" ? messages : messages.filter((message) => message.status === status)), [messages, status]);

  const updateStatus = async (id: string, nextStatus: MessageStatus) => {
    const result = await updateMessageStatusAction(id, nextStatus);
    if (!result.ok) return;
    setMessages((prev) => prev.map((message) => (message.id === id ? { ...message, status: nextStatus } : message)));
    setActive((current) => (current?.id === id ? { ...current, status: nextStatus } : current));
  };

  const remove = async (id: string) => {
    const result = await deleteMessageAction(id);
    if (!result.ok) return;
    setMessages((prev) => prev.filter((message) => message.id !== id));
    setActive((current) => (current?.id === id ? null : current));
  };

  const rows = filtered.map((message) => [
    <button key="name" className="font-semibold text-[#ffb4a8]" onClick={() => setActive(message)}>{message.name}</button>,
    message.contact,
    <span key="message" className="line-clamp-1 max-w-xs text-[#cfc7bf]">{message.message}</span>,
    message.createdAt,
    <span key="status" className={`uppercase tracking-[0.12em] ${message.status === "unread" ? "text-[#cd0000]" : message.status === "archived" ? "text-[#777]" : "text-green-300"}`}>{message.status}</span>,
    <div key="actions" className="flex flex-wrap gap-2">
      <button className="smsm-btn-secondary px-3 py-2 text-[10px]" onClick={() => updateStatus(message.id, message.status === "read" ? "unread" : "read")}>{message.status === "read" ? "Unread" : "Read"}</button>
      <button className="smsm-btn-secondary px-3 py-2 text-[10px]" onClick={() => updateStatus(message.id, "archived")}>Archive</button>
      <button className="smsm-btn-secondary px-3 py-2 text-[10px] text-red-300" onClick={() => remove(message.id)}>Delete</button>
    </div>
  ]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="smsm-heading text-4xl font-extrabold">{dictionary.admin.messages}</h1>
          <div className="smsm-label text-[#cd0000]">{messages.filter((message) => message.status === "unread").length} {locale === "ar" ? "غير مقروءة" : "unread"}</div>
        </div>
        <div className="flex flex-wrap gap-2 border border-[#303030] bg-[#1a1a1a] p-3">
          {["all", "unread", "read", "archived"].map((value) => (
            <button key={value} onClick={() => setStatus(value as MessageStatus | "all")} className={`px-3 py-2 text-xs uppercase tracking-[0.12em] ${status === value ? "bg-[#cd0000] text-white" : "border border-[#353535] text-[#d6d6d6]"}`}>{value}</button>
          ))}
        </div>
        <AdminTable headers={["Name", "Phone / Email", "Message", "Date", "Status", "Actions"]} rows={rows} />
      </section>
      <aside className="h-fit space-y-4 border border-[#303030] bg-[#1a1a1a] p-4">
        <h2 className="smsm-heading text-2xl font-bold">{locale === "ar" ? "تفاصيل الرسالة" : "Message Detail"}</h2>
        {active ? (
          <div className="space-y-3 text-sm">
            <div className="font-semibold text-[#ffb4a8]">{active.name}</div>
            <div>{active.contact}</div>
            <div className="smsm-label">{active.createdAt}</div>
            <p className="whitespace-pre-wrap break-words border-y border-[#2d2d2d] py-4 leading-7 text-[#d8d0c8]">{active.message}</p>
            <div className="flex flex-wrap gap-2">
              <button className="smsm-btn-primary text-xs" onClick={() => updateStatus(active.id, "read")}>Mark Read</button>
              <button className="smsm-btn-secondary text-xs" onClick={() => updateStatus(active.id, "unread")}>Mark Unread</button>
            </div>
          </div>
        ) : <p className="text-sm text-[#999]">{locale === "ar" ? "لا توجد رسالة محددة." : "No selected message."}</p>}
      </aside>
    </div>
  );
}
