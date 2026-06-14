import { CategoryCard } from "@/components/storefront/CategoryCard";
import { getCategories } from "@/lib/supabase/queries";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/locale";

export default async function CategoriesPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolved = await params;
  const locale = isLocale(resolved.locale) ? resolved.locale : "ar";
  const dictionary = getDictionary(locale);
  const categories = await getCategories();

  return (
    <div className="smsm-container space-y-8 py-8">
      <header className="border-b border-[#252525] pb-6">
        <p className="smsm-label text-[#cd0000]">{dictionary.nav.categories}</p>
        <h1 className="smsm-heading mt-2 text-5xl font-extrabold">
          {locale === "ar" ? "تسوق حسب الفئة" : "Shop by Category"}
        </h1>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} locale={locale} />
        ))}
      </div>
    </div>
  );
}
