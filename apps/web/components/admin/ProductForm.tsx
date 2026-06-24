"use client";

import { useState } from "react";
import { Category, Product } from "@/lib/types";
import { uploadAdminImageAction, upsertProductAction } from "@/lib/supabase/actions";

type Props = {
  categories: Category[];
  initial?: Product;
  locale: "ar" | "en";
};

export function ProductForm({ categories, initial, locale }: Props) {
  const [saved, setSaved] = useState(false);
  const [images, setImages] = useState(initial?.images.join(", ") ?? "/images/smsm-logo.png");

  return (
    <form
      action={async (formData) => {
        const result = await upsertProductAction(formData);
        setSaved(result.ok);
      }}
      className="space-y-5 rounded-md border border-[#353535] bg-[#1a1a1a] p-5"
    >
      {initial ? <input type="hidden" name="id" value={initial.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2"><span className="smsm-label block">SKU</span><input name="sku" defaultValue={initial?.sku ?? ""} className="smsm-input" /></label>
        <label className="space-y-2"><span className="smsm-label block">{locale === "ar" ? "درجة الجودة" : "Quality Grade"}</span><input name="qualityGrade" defaultValue={initial?.qualityGrade ?? "MIRROR"} className="smsm-input" /></label>
        <label className="space-y-2"><span className="smsm-label block">{locale === "ar" ? "الموديل" : "Model"}</span><input name="model" defaultValue={initial?.model ?? ""} className="smsm-input" /></label>
        <label className="space-y-2"><span className="smsm-label block">{locale === "ar" ? "البراند" : "Brand"}</span><input name="brand" defaultValue={initial?.brand ?? ""} className="smsm-input" /></label>
        <label className="space-y-2"><span className="smsm-label block">{locale === "ar" ? "اسم عربي" : "Name AR"}</span><input name="nameAr" defaultValue={initial?.nameAr ?? ""} className="smsm-input" /></label>
        <label className="space-y-2"><span className="smsm-label block">{locale === "ar" ? "اسم إنجليزي" : "Name EN"}</span><input name="nameEn" defaultValue={initial?.nameEn ?? ""} className="smsm-input" /></label>
        <label className="space-y-2"><span className="smsm-label block">Slug</span><input name="slug" defaultValue={initial?.slug ?? ""} className="smsm-input" /></label>
        <label className="space-y-2">
          <span className="smsm-label block">{locale === "ar" ? "الفئة" : "Category"}</span>
          <select name="category" defaultValue={initial?.category ?? categories[0]?.slug ?? ""} className="smsm-input">
            {categories.map((category) => <option key={category.id} value={category.slug}>{locale === "ar" ? category.nameAr : category.nameEn}</option>)}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <textarea name="shortDescriptionAr" defaultValue={initial?.shortDescriptionAr ?? ""} className="smsm-input h-20" placeholder={locale === "ar" ? "وصف قصير عربي" : "Arabic short description"} />
        <textarea name="shortDescriptionEn" defaultValue={initial?.shortDescriptionEn ?? ""} className="smsm-input h-20" placeholder={locale === "ar" ? "وصف قصير إنجليزي" : "English short description"} />
        <textarea name="descriptionAr" defaultValue={initial?.descriptionAr ?? ""} className="smsm-input h-24" placeholder={locale === "ar" ? "وصف عربي" : "Arabic description"} />
        <textarea name="descriptionEn" defaultValue={initial?.descriptionEn ?? ""} className="smsm-input h-24" placeholder={locale === "ar" ? "وصف إنجليزي" : "English description"} />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <label className="space-y-2"><span className="smsm-label block">{locale === "ar" ? "سعر البيع" : "Sell Price"}</span><input name="price" type="number" defaultValue={initial?.price ?? 0} className="smsm-input" /></label>
        <label className="space-y-2"><span className="smsm-label block">{locale === "ar" ? "السعر قبل العرض" : "Old Price"}</span><input name="oldPrice" type="number" defaultValue={initial?.oldPrice ?? ""} className="smsm-input" /></label>
        <label className="space-y-2"><span className="smsm-label block">{locale === "ar" ? "المخزون" : "Stock"}</span><input name="stock" type="number" defaultValue={initial?.stock ?? 0} className="smsm-input" /></label>
        <label className="space-y-2">
          <span className="smsm-label block">{locale === "ar" ? "الحالة" : "Status"}</span>
          <select name="status" defaultValue={initial?.status ?? "active"} className="smsm-input">
            <option value="active">active</option><option value="inactive">inactive</option><option value="out-of-stock">out of stock</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="smsm-label block">{locale === "ar" ? "شارة المنتج" : "Product Badge"}</span>
          <select
            name="badge"
            defaultValue={["NEW", "BESTSELLER", "LIMITED", "OFFER"].includes(initial?.badge ?? "") ? initial?.badge : ""}
            className="smsm-input"
          >
            <option value="">{locale === "ar" ? "بدون شارة" : "No badge"}</option>
            <option value="NEW">{locale === "ar" ? "جديد" : "New"}</option>
            <option value="BESTSELLER">{locale === "ar" ? "الأكثر مبيعاً" : "Bestseller"}</option>
            <option value="LIMITED">{locale === "ar" ? "محدود" : "Limited"}</option>
            <option value="OFFER">{locale === "ar" ? "عرض" : "Offer"}</option>
          </select>
        </label>
        <label className="space-y-2"><span className="smsm-label block">{locale === "ar" ? "المقاسات" : "Sizes"}</span><input name="sizes" defaultValue={initial?.sizes.join(", ") ?? "40, 41, 42, 43, 45"} className="smsm-input" /></label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2"><span className="smsm-label block">{locale === "ar" ? "الألوان" : "Colors"}</span><input name="colors" defaultValue={initial?.colors.join(", ") ?? ""} className="smsm-input" /></label>
        <label className="space-y-2">
          <span className="smsm-label block">{locale === "ar" ? "روابط الصور" : "Image Paths"}</span>
          <input name="images" value={images} onChange={(event) => setImages(event.target.value)} className="smsm-input" />
        </label>
      </div>

      <label className="space-y-2 block">
        <span className="smsm-label block">{locale === "ar" ? "رفع صور المنتج" : "Upload Product Images"}</span>
        <input
          type="file"
          multiple
          className="smsm-input"
          onChange={async (event) => {
            const files = Array.from(event.target.files ?? []);
            const urls: string[] = [];
            for (const file of files) {
              const result = await uploadAdminImageAction("product-images", file);
              if (!result.ok) {
                alert(locale === "ar" ? "تعذر رفع الصورة." : "Unable to upload image.");
                continue;
              }
              if (result.url) urls.push(result.url);
            }
            if (urls.length) setImages((current) => [current, ...urls].filter(Boolean).join(", "));
          }}
        />
      </label>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="smsm-panel flex items-center gap-3 p-3 text-sm"><input name="featured" type="checkbox" defaultChecked={initial?.featured ?? false} />{locale === "ar" ? "منتج مميز" : "Featured"}</label>
        <label className="smsm-panel flex items-center gap-3 p-3 text-sm"><input name="onOffer" type="checkbox" defaultChecked={initial?.onOffer ?? false} />{locale === "ar" ? "ضمن العروض" : "On Offer"}</label>
        <label className="smsm-panel flex items-center gap-3 p-3 text-sm"><input name="bestSeller" type="checkbox" defaultChecked={initial?.bestSeller ?? false} />{locale === "ar" ? "الأكثر مبيعاً" : "Bestseller"}</label>
      </div>

      <button type="submit" className="smsm-btn-primary w-full">{locale === "ar" ? "حفظ المنتج" : "Save Product"}</button>
      {saved ? <p className="text-sm text-[#ffb4a8]">{locale === "ar" ? "تم الحفظ في Supabase." : "Saved to Supabase."}</p> : null}
    </form>
  );
}
