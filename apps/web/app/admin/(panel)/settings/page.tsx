"use client";

import { FormEvent, useState } from "react";
import { storeSettings } from "@/lib/data/settings";
import { useAdminLocale } from "@/components/shared/AdminLocaleProvider";
import { getDictionary } from "@/lib/i18n/dictionary";

export default function AdminSettingsPage() {
  const { locale } = useAdminLocale();
  const dictionary = getDictionary(locale);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(storeSettings);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSaved(true);
  };

  return (
    <div className="space-y-5">
      <h1 className="smsm-heading text-4xl font-extrabold">{dictionary.admin.settings}</h1>
      <form onSubmit={onSubmit} className="space-y-4 border border-[#303030] bg-[#1a1a1a] p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <input value={form.storeName} onChange={(event) => setForm({ ...form, storeName: event.target.value })} placeholder={locale === "ar" ? "اسم المتجر" : "Store Name"} className="smsm-input" />
          <input value={form.tagline} onChange={(event) => setForm({ ...form, tagline: event.target.value })} placeholder={locale === "ar" ? "الشعار" : "Tagline"} className="smsm-input" />
          <input value={form.whatsappNumber} onChange={(event) => setForm({ ...form, whatsappNumber: event.target.value })} placeholder="WhatsApp" className="smsm-input" />
          <input value={form.logo ?? ""} onChange={(event) => setForm({ ...form, logo: event.target.value })} placeholder="Logo URL" className="smsm-input" />
          <input value={form.addressAr} onChange={(event) => setForm({ ...form, addressAr: event.target.value })} placeholder={locale === "ar" ? "العنوان عربي" : "Address AR"} className="smsm-input" />
          <input value={form.addressEn} onChange={(event) => setForm({ ...form, addressEn: event.target.value })} placeholder={locale === "ar" ? "العنوان إنجليزي" : "Address EN"} className="smsm-input" />
          <input value={form.instagram} onChange={(event) => setForm({ ...form, instagram: event.target.value })} placeholder="Instagram" className="smsm-input" />
          <input value={form.facebook} onChange={(event) => setForm({ ...form, facebook: event.target.value })} placeholder="Facebook" className="smsm-input" />
          <input value={form.heroTitleAr} onChange={(event) => setForm({ ...form, heroTitleAr: event.target.value })} placeholder={locale === "ar" ? "عنوان البانر عربي" : "Hero title AR"} className="smsm-input" />
          <input value={form.heroTitleEn} onChange={(event) => setForm({ ...form, heroTitleEn: event.target.value })} placeholder={locale === "ar" ? "عنوان البانر إنجليزي" : "Hero title EN"} className="smsm-input" />
        </div>
        <button className="smsm-btn-primary w-full">{locale === "ar" ? "حفظ الإعدادات" : "Save Settings"}</button>
        {saved ? (
          <p className="text-sm text-[#ffb4a8]">
            {locale === "ar" ? "تم حفظ الإعدادات محليًا (Mock)." : "Settings saved locally (mock)."}
          </p>
        ) : null}
      </form>
    </div>
  );
}

