"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { AdminTable } from "@/components/admin/AdminTable";
import { Category, Product } from "@/lib/types";
import { useAdminLocale } from "@/components/shared/AdminLocaleProvider";
import { getDictionary } from "@/lib/i18n/dictionary";
import { formatPriceEGP } from "@/lib/utils";
import { deleteProductAction, updateProductStatusAction } from "@/lib/supabase/actions";

export function AdminProductsManager({ initialProducts, categories }: { initialProducts: Product[]; categories: Category[] }) {
  const { locale } = useAdminLocale();
  const dictionary = getDictionary(locale);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => products.filter((product) => {
    const name = locale === "ar" ? product.nameAr : product.nameEn;
    return [name, product.brand, product.model].join(" ").toLowerCase().includes(search.toLowerCase()) && (category === "all" || product.category === category);
  }), [products, search, category, locale]);

  const updateStatus = async (id: string, status: Product["status"]) => {
    const result = await updateProductStatusAction(id, status);
    if (!result.ok) return;
    setProducts((prev) => prev.map((product) => product.id === id ? { ...product, status, isActive: status === "active" } : product));
  };

  const deleteProduct = async (id: string) => {
    const result = await deleteProductAction(id);
    if (!result.ok) return;
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const rows = filtered.map((product) => [
    <Image key="img" src={product.images[0]} alt={locale === "ar" ? product.nameAr : product.nameEn} width={80} height={56} className="h-14 w-20 object-cover" />,
    <span key="name" className="font-semibold">{locale === "ar" ? product.nameAr : product.nameEn}</span>,
    <span key="brand">{product.brand}</span>,
    <span key="model" className="text-[#bcbcbc]">{product.model}</span>,
    <span key="cat" className="uppercase tracking-[0.12em] text-[#a4a4a4]">{product.category}</span>,
    <span key="price">{formatPriceEGP(product.price, locale)}</span>,
    <span key="stock" className={product.stock <= 3 ? "font-bold text-red-300" : ""}>{product.stock}</span>,
    <select key="status" value={product.status} onChange={(event) => updateStatus(product.id, event.target.value as Product["status"])} className="smsm-input py-2 text-xs">
      <option value="active">active</option><option value="inactive">inactive</option><option value="out-of-stock">out of stock</option>
    </select>,
    <div key="actions" className="flex flex-wrap gap-2">
      <Link href={`/admin/products/${product.id}/edit`} className="smsm-btn-secondary px-3 text-[10px]">{locale === "ar" ? "تعديل" : "Edit"}</Link>
      <button onClick={() => deleteProduct(product.id)} className="smsm-btn-secondary px-3 text-[10px] text-red-300">{locale === "ar" ? "حذف" : "Delete"}</button>
    </div>
  ]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="smsm-heading text-4xl font-extrabold">{dictionary.admin.products}</h1>
        <Link href="/admin/products/new" className="smsm-btn-primary text-xs">{dictionary.admin.addProduct}</Link>
      </div>
      <div className="grid gap-3 border border-[#303030] bg-[#1a1a1a] p-4 sm:grid-cols-3">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={locale === "ar" ? "ابحث بالاسم أو البراند" : "Search name or brand"} className="smsm-input" />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="smsm-input">
          <option value="all">{locale === "ar" ? "كل الأقسام" : "All Categories"}</option>
          {categories.map((cat) => <option key={cat.id} value={cat.slug}>{locale === "ar" ? cat.nameAr : cat.nameEn}</option>)}
        </select>
      </div>
      <AdminTable headers={["Image", "Name", "Brand", "Model", "Category", "Sell Price", "Stock", "Status", "Actions"]} rows={rows} />
    </div>
  );
}
