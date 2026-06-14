"use client";

import { ProductForm } from "@/components/admin/ProductForm";
import { useAdminLocale } from "@/components/shared/AdminLocaleProvider";
import { getDictionary } from "@/lib/i18n/dictionary";
import { Category, Product } from "@/lib/types";

export function ProductFormShell({ categories, product }: { categories: Category[]; product?: Product }) {
  const { locale } = useAdminLocale();
  const dictionary = getDictionary(locale);
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold">{product ? dictionary.admin.editProduct : dictionary.admin.addProduct}</h1>
      <ProductForm categories={categories} locale={locale} initial={product} />
    </div>
  );
}
