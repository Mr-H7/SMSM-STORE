import { AdminOrdersManager } from "@/components/admin/AdminOrdersManager";
import { getAdminOrders } from "@/lib/supabase/queries";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();
  return <AdminOrdersManager initialOrders={orders} />;
}
