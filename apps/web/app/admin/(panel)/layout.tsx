import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  createSupabasePublicClient,
  createSupabaseServiceClient,
  getAdminAccessToken,
  hasSupabaseEnv
} from "@/lib/supabase/server";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production" && !hasSupabaseEnv) {
    redirect("/admin/login");
  }

  if (hasSupabaseEnv) {
    const token = await getAdminAccessToken();
    if (!token) {
      redirect("/admin/login");
    }

    const supabase = createSupabasePublicClient();
    const serviceClient = createSupabaseServiceClient();
    const { data, error } = await supabase!.auth.getUser(token);

    if (error || !data.user?.email || !serviceClient) {
      redirect("/admin/login");
    }
  }

  return <AdminShell>{children}</AdminShell>;
}
