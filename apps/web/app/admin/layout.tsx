import { AdminAuthProvider } from "@/components/shared/AdminAuthProvider";
import { AdminLocaleProvider } from "@/components/shared/AdminLocaleProvider";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLocaleProvider>
      <AdminAuthProvider>{children}</AdminAuthProvider>
    </AdminLocaleProvider>
  );
}
