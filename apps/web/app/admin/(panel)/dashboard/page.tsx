import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import { getAdminMessages, getAdminOrders, getAdminProducts } from "@/lib/supabase/queries";

export default async function AdminDashboardPage() {
  const [products, orders, messages] = await Promise.all([
    getAdminProducts(),
    getAdminOrders(),
    getAdminMessages()
  ]);

  return <AdminDashboardView products={products} orders={orders} messages={messages} />;
}
