import { AdminProductsManager } from "@/components/admin/AdminProductsManager";
import { getAdminCategories, getAdminProducts } from "@/lib/supabase/queries";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getAdminProducts(), getAdminCategories()]);
  return <AdminProductsManager initialProducts={products} categories={categories} />;
}
