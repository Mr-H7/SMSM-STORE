"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  ListOrdered,
  Tags,
  Settings,
  Languages,
  Search,
  MessageSquare
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAdminLocale } from "@/components/shared/AdminLocaleProvider";
import { useAdminAuth } from "@/components/shared/AdminAuthProvider";
import { getDictionary } from "@/lib/i18n/dictionary";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = useState("");
  const { locale, setLocale, dir } = useAdminLocale();
  const dictionary = getDictionary(locale);
  const { logout } = useAdminAuth();

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const links = [
    { href: "/admin/dashboard", label: dictionary.admin.dashboard, icon: LayoutDashboard },
    { href: "/admin/products", label: dictionary.admin.products, icon: Package },
    { href: "/admin/orders", label: dictionary.admin.orders, icon: ListOrdered },
    { href: "/admin/messages", label: dictionary.admin.messages, icon: MessageSquare },
    { href: "/admin/categories", label: dictionary.admin.categories, icon: Tags },
    { href: "/admin/settings", label: dictionary.admin.settings, icon: Settings }
  ];

  return (
    <div dir={dir} className="min-h-screen bg-[#0f0f0f] text-[#efe6dd]">
      <div className="grid min-h-screen lg:grid-cols-[300px_1fr]">
        <aside className="border-e border-[#2a2a2a] bg-[#161616] p-5">
          <div className="flex items-center gap-3">
            <Image
              src="/images/smsm-logo.png"
              alt="SMSM STORE"
              width={52}
              height={52}
              className="h-[52px] w-[52px] rounded-sm border border-[#2b2b2b] object-cover"
            />
            <div>
              <h2 className="smsm-heading text-3xl font-extrabold leading-none">SMSM STORE</h2>
              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#8f8f8f]">BEST SHOES STORE</p>
            </div>
          </div>
          <p className="smsm-label mt-3 text-[#cd0000]">ADMIN PROTOCOL V2.4</p>
          <nav className="mt-10 space-y-2">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 border-s-2 px-4 py-3 text-sm uppercase tracking-[0.12em] ${
                  pathname === item.href
                    ? "border-[#cd0000] bg-[#2b1616] text-[#efe6dd]"
                    : "border-transparent text-[#b8b8b8] hover:border-[#8b2424] hover:bg-[#1f1f1f]"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-14 border-t border-[#2a2a2a] pt-5 text-xs text-[#9d9d9d]">
            {locale === "ar" ? "جلسة الإدارة: نشطة" : "System Admin Session: Active"}
          </div>
        </aside>

        <div>
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2a2a2a] bg-[#111111] px-6 py-4">
            <div>
              <h1 className="smsm-heading text-2xl font-bold">
                {locale === "ar" ? "مرحبًا بعودة المدير" : "Welcome Back Admin"}
              </h1>
              <p className="smsm-label mt-1">
                {locale === "ar" ? "ملخص اليوم" : "System Status: Nominal / Today's Summary"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 border border-[#353535] bg-[#1d1d1d] px-3 py-2 md:flex">
                <Search className="h-4 w-4 text-[#8d8d8d]" />
                <input
                  className="w-56 bg-transparent text-sm text-[#f0ede8] placeholder:text-[#6f6f6f] focus:outline-none"
                  placeholder={locale === "ar" ? "بحث..." : "Global search..."}
                />
              </div>
              <button className="smsm-btn-primary text-xs">
                {locale === "ar" ? "طلب واتساب" : "Order WhatsApp"}
              </button>
              <button
                className="smsm-btn-secondary px-3"
                onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
              >
                <Languages className="h-4 w-4" />
              </button>
              <button
                className="smsm-btn-secondary text-xs"
                onClick={() => {
                  logout().then(() => {
                    window.location.href = "/admin/login";
                  });
                }}
              >
                {dictionary.admin.logout}
              </button>
            </div>
          </header>
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
