import "server-only";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const ADMIN_COOKIE = "smsm_admin_access_token";
const ADMIN_MAX_AGE_SECONDS = 8 * 60 * 60;

export const hasSupabaseEnv = Boolean(url && anonKey);

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ADMIN_MAX_AGE_SECONDS
};

export function createSupabasePublicClient() {
  if (!url || !anonKey) {
    return null;
  }
  return createClient(url, anonKey, {
    auth: { persistSession: false }
  });
}

export function createSupabaseServiceClient() {
  if (!url || !serviceKey) {
    return null;
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false }
  });
}

export async function getAdminAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value ?? null;
}

export async function requireAdmin() {
  const accessToken = await getAdminAccessToken();
  const publicClient = createSupabasePublicClient();
  const serviceClient = createSupabaseServiceClient();

  if (!accessToken || !publicClient || !serviceClient) {
    throw new Error("Admin authentication is not configured.");
  }

  const { data, error } = await publicClient.auth.getUser(accessToken);
  if (error || !data.user?.email) {
    throw new Error("Unauthorized admin request.");
  }

  return { user: data.user, serviceClient };
}
