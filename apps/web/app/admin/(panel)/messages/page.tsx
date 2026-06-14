import { AdminMessagesManager } from "@/components/admin/AdminMessagesManager";
import { getAdminMessages } from "@/lib/supabase/queries";

export default async function AdminMessagesPage() {
  const messages = await getAdminMessages();
  return <AdminMessagesManager initialMessages={messages} />;
}
