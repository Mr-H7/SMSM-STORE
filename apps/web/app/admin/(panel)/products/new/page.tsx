import { ProductFormShell } from "@/components/admin/ProductFormShell";
import { getCategories } from "@/lib/supabase/queries";

export default async function AdminNewProductPage() {
  const categories = await getCategories();
  return <ProductFormShell categories={categories} />;
}
