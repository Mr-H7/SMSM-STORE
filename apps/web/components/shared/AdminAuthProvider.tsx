"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { adminLoginAction, adminLogoutAction } from "@/lib/supabase/actions";

type LoginPayload = {
  username: string;
  password: string;
};

type AdminAuthValue = {
  login: (payload: LoginPayload) => Promise<{ ok: boolean; message: string }>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthValue | undefined>(undefined);
export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [, setStamp] = useState(0);

  const value = useMemo<AdminAuthValue>(
    () => ({
      login: ({ username, password }) => {
        return adminLoginAction(username, password).then((result) => {
          if (result.ok) {
            localStorage.setItem("smsm_admin_user", username.trim().toLowerCase());
            setStamp((prev) => prev + 1);
          }
          return result;
        });
      },
      logout: async () => {
        await adminLogoutAction();
        localStorage.removeItem("smsm_admin_user");
        setStamp((prev) => prev + 1);
      }
    }),
    []
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
