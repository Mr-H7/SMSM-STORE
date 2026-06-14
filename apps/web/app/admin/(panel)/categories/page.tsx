import { AdminCategoriesManager } from "@/components/admin/AdminCategoriesManager";
import { getAdminCategories, getAdminProducts } from "@/lib/supabase/queries";

export default async function AdminCategoriesPage() {
  const [categories, products] = await Promise.all([getAdminCategories(), getAdminProducts()]);
  return <AdminCategoriesManager initialCategories={categories} products={products} />;
}
