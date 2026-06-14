import { ProductFormShell } from "@/components/admin/ProductFormShell";
import { getAdminCategories, getAdminProducts } from "@/lib/supabase/queries";

export default async function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params;
  const [categories, products] = await Promise.all([getAdminCategories(), getAdminProducts()]);
  const product = products.find((item) => item.id === resolved.id);

  if (!product) {
    return <div className="smsm-card p-6">Product not found.</div>;
  }

  return <ProductFormShell categories={categories} product={product} />;
}
