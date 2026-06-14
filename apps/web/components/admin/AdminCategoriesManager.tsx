"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { AdminTable } from "@/components/admin/AdminTable";
import { Category, Product } from "@/lib/types";
import { useAdminLocale } from "@/components/shared/AdminLocaleProvider";
import { getDictionary } from "@/lib/i18n/dictionary";
import { deleteCategoryAction, uploadAdminImageAction, upsertCategoryAction } from "@/lib/supabase/actions";

export function AdminCategoriesManager({ initialCategories, products }: { initialCategories: Category[]; products: Product[] }) {
  const { locale } = useAdminLocale();
  const dictionary = getDictionary(locale);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ nameAr: "", nameEn: "", slug: "", image: "/images/template.svg", isActive: true });
  const productCounts = useMemo(() => Object.fromEntries(categories.map((category) => [category.slug, products.filter((product) => product.category === category.slug).length])), [categories, products]);

  const reset = () => {
    setEditing(null);
    setForm({ nameAr: "", nameEn: "", slug: "", image: "/images/template.svg", isActive: true });
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    if (editing) formData.set("id", editing.id);
    Object.entries(form).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        if (value) formData.set(key, "on");
      } else {
        formData.set(key, value);
      }
    });
    const result = await upsertCategoryAction(formData);
    if (!result.ok) return;
    if (editing) {
      setCategories((prev) => prev.map((category) => category.id === editing.id ? { ...category, ...form } : category));
    } else {
      setCategories((prev) => [...prev, { id: `pending-${Date.now()}`, ...form, productCount: 0 }]);
    }
    reset();
  };

  const remove = async (category: Category) => {
    if ((productCounts[category.slug] ?? 0) > 0) return;
    const result = await deleteCategoryAction(category.id);
    if (result.ok) setCategories((prev) => prev.filter((item) => item.id !== category.id));
  };

  const rows = categories.map((category) => [
    <Image key="img" src={category.image} alt={locale === "ar" ? category.nameAr : category.nameEn} width={80} height={56} className="h-14 w-20 object-cover" />,
    <span key="name" className="font-semibold">{locale === "ar" ? category.nameAr : category.nameEn}</span>,
    <span key="slug" className="uppercase tracking-[0.12em] text-[#a2a2a2]">{category.slug}</span>,
    productCounts[category.slug] ?? 0,
    <span key="active" className={`px-2 py-1 text-xs uppercase tracking-[0.12em] ${category.isActive ? "text-green-300" : "text-red-300"}`}>{category.isActive ? "Active" : "Inactive"}</span>,
    <div key="actions" className="flex flex-wrap gap-2">
      <button onClick={() => { setEditing(category); setForm({ nameAr: category.nameAr, nameEn: category.nameEn, slug: category.slug, image: category.image, isActive: category.isActive }); }} className="smsm-btn-secondary px-3 text-[10px]">{locale === "ar" ? "تعديل" : "Edit"}</button>
      <button onClick={() => remove(category)} className="smsm-btn-secondary px-3 text-[10px] text-red-300 disabled:opacity-40" disabled={(productCounts[category.slug] ?? 0) > 0}>{locale === "ar" ? "حذف" : "Delete"}</button>
    </div>
  ]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <section className="space-y-5">
        <h1 className="smsm-heading text-4xl font-extrabold">{dictionary.admin.categories}</h1>
        <AdminTable headers={["Image", "Name", "Slug", "Product Count", "Status", "Actions"]} rows={rows} />
      </section>
      <form onSubmit={save} className="h-fit space-y-4 border border-[#303030] bg-[#1a1a1a] p-4">
        <h2 className="smsm-heading text-2xl font-bold">{editing ? (locale === "ar" ? "تعديل فئة" : "Edit Category") : locale === "ar" ? "إضافة فئة" : "Create Category"}</h2>
        <input required className="smsm-input" value={form.nameAr} onChange={(event) => setForm({ ...form, nameAr: event.target.value })} placeholder={locale === "ar" ? "الاسم العربي" : "Arabic name"} />
        <input required className="smsm-input" value={form.nameEn} onChange={(event) => setForm({ ...form, nameEn: event.target.value })} placeholder={locale === "ar" ? "الاسم الإنجليزي" : "English name"} />
        <input required className="smsm-input" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="slug" />
        <input required className="smsm-input" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="/images/template.svg" />
        <input
          type="file"
          className="smsm-input"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const result = await uploadAdminImageAction("category-images", file);
            if (!result.ok) {
              alert(locale === "ar" ? "تعذر رفع الصورة." : "Unable to upload image.");
              return;
            }
            if (result.url) setForm((current) => ({ ...current, image: result.url }));
          }}
        />
        <label className="smsm-panel flex items-center gap-3 p-3 text-sm"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} />{locale === "ar" ? "نشطة" : "Active"}</label>
        <div className="flex gap-2"><button className="smsm-btn-primary flex-1" type="submit">{locale === "ar" ? "حفظ" : "Save"}</button><button className="smsm-btn-secondary" type="button" onClick={reset}>{locale === "ar" ? "إلغاء" : "Cancel"}</button></div>
      </form>
    </div>
  );
}
