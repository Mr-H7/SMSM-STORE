import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AdminLayout() {
  const base = process.env.SYSTEM_APP_URL?.trim() || "http://localhost:3000";
  redirect(new URL("/dashboard", base).toString());
}
