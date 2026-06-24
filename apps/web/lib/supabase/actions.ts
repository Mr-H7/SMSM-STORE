"use server";

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { CartItem, MessageStatus, OrderStatus, Product } from "@/lib/types";
import { getSafeErrorDetails, toPublicError } from "@/lib/security/errors";
import { checkContactRateLimit } from "@/lib/security/rate-limit";
import {
  isMessageStatus,
  isOrderStatus,
  isProductStatus,
  isUuid,
  validateCartItems,
  validateCategoryPayload,
  validateCheckoutCustomer,
  validateContactPayload,
  validateProductPayload,
  validateUploadFile
} from "@/lib/security/validation";
import {
  adminCookieOptions,
  createSupabasePublicClient,
  createSupabaseServiceClient,
  getAdminAccessToken,
  requireAdmin
} from "@/lib/supabase/server";

type CheckoutCustomer = {
  name: string;
  phone: string;
  address: string;
  notes?: string;
};

const ADMIN_COOKIE = "smsm_admin_access_token";

export async function adminLoginAction(username: string, password: string) {
  const supabase = createSupabasePublicClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const email = username.trim().toLowerCase();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) {
    console.error("[admin-login] Supabase auth error:", error?.message ?? "No session returned");
    return { ok: false, message: error?.message ?? toPublicError("Invalid credentials", "login") };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, data.session.access_token, adminCookieOptions);

  return { ok: true, message: "Login successful" };
}

export async function adminLogoutAction() {
  const cookieStore = await cookies();
  const token = await getAdminAccessToken();
  const supabase = createSupabasePublicClient();

  if (supabase && token) {
    await supabase.auth.signOut();
  }

  cookieStore.set(ADMIN_COOKIE, "", { ...adminCookieOptions, maxAge: 0 });
}

export async function createContactMessageAction(payload: {
  name: string;
  contact: string;
  message: string;
  website?: string;
}) {
  const validated = validateContactPayload(payload);
  if (!validated.ok) {
    return { ok: false, message: toPublicError(validated.message, "contact") };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate = checkContactRateLimit(ip);
  if (!rate.ok) {
    return { ok: false, message: toPublicError(rate.message, "contact") };
  }

  const serviceClient = createSupabaseServiceClient();
  if (!serviceClient) {
    return { ok: false, message: toPublicError("Not configured", "contact") };
  }

  const { error } = await serviceClient.from("contact_messages").insert({
    name: validated.value.name,
    contact: validated.value.contact,
    message: validated.value.message,
    status: "unread"
  });

  if (error) {
    return { ok: false, message: toPublicError(error, "contact") };
  }

  return { ok: true, message: "Message saved." };
}

export async function createCheckoutOrderAction(
  customer: CheckoutCustomer,
  items: CartItem[],
  locale?: "ar" | "en"
) {
  const customerResult = validateCheckoutCustomer(customer);
  if (!customerResult.ok) {
    return { ok: false, message: toPublicError(customerResult.message, "checkout", locale) };
  }

  const itemsResult = validateCartItems(items);
  if (!itemsResult.ok) {
    return { ok: false, message: toPublicError(itemsResult.message, "checkout", locale) };
  }

  const serviceClient = createSupabaseServiceClient();
  if (!serviceClient) {
    return { ok: false, message: toPublicError("Not configured", "checkout", locale) };
  }

  const { data, error } = await serviceClient.rpc("create_order_with_stock", {
    customer: customerResult.value,
    items: itemsResult.value.map((item) => ({
      productId: item.productId,
      size: item.size,
      color: item.color,
      quantity: item.quantity
    }))
  });

  if (error) {
    console.error(
      "[checkout:order-rpc]",
      JSON.stringify(
        {
          stage: "create_order_with_stock",
          itemCount: itemsResult.value.length,
          productIds: itemsResult.value.map((item) => item.productId),
          error: getSafeErrorDetails(error)
        },
        null,
        2
      )
    );
    return { ok: false, message: toPublicError(error, "checkout", locale) };
  }

  revalidatePath("/ar");
  revalidatePath("/en");
  revalidatePath("/ar/products");
  revalidatePath("/en/products");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");

  return { ok: true, message: "Order created.", order: data };
}

export async function updateMessageStatusAction(id: string, status: MessageStatus) {
  if (!isUuid(id) || !isMessageStatus(status)) {
    return { ok: false, message: toPublicError("Invalid request", "admin") };
  }

  const { serviceClient } = await requireAdmin();
  const { error } = await serviceClient.from("contact_messages").update({ status }).eq("id", id);
  revalidatePath("/admin/messages");
  return { ok: !error, message: error ? toPublicError(error, "admin") : "Message updated." };
}

export async function deleteMessageAction(id: string) {
  if (!isUuid(id)) {
    return { ok: false, message: toPublicError("Invalid request", "admin") };
  }

  const { serviceClient } = await requireAdmin();
  const { error } = await serviceClient.from("contact_messages").delete().eq("id", id);
  revalidatePath("/admin/messages");
  return { ok: !error, message: error ? toPublicError(error, "admin") : "Message deleted." };
}

export async function updateOrderStatusAction(id: string, status: OrderStatus) {
  if (!isOrderStatus(status)) {
    return { ok: false, message: toPublicError("Invalid status", "admin") };
  }

  const { serviceClient } = await requireAdmin();
  const query = isUuid(id)
    ? serviceClient.from("orders").update({ status }).eq("id", id)
    : serviceClient.from("orders").update({ status }).eq("order_number", id.slice(0, 64));

  const { error } = await query;
  revalidatePath("/admin/orders");
  return { ok: !error, message: error ? toPublicError(error, "admin") : "Order updated." };
}

export async function updateProductStatusAction(id: string, status: Product["status"]) {
  if (!isUuid(id) || !isProductStatus(status)) {
    return { ok: false, message: toPublicError("Invalid request", "admin") };
  }

  const { serviceClient } = await requireAdmin();
  const { error } = await serviceClient.from("products").update({ status }).eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/ar/products");
  revalidatePath("/en/products");
  return { ok: !error, message: error ? toPublicError(error, "admin") : "Product updated." };
}

export async function deleteProductAction(id: string) {
  if (!isUuid(id)) {
    return { ok: false, message: toPublicError("Invalid request", "admin") };
  }

  const { serviceClient } = await requireAdmin();
  const { error } = await serviceClient.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/ar/products");
  revalidatePath("/en/products");
  return { ok: !error, message: error ? toPublicError(error, "admin") : "Product deleted." };
}

export async function upsertProductAction(formData: FormData) {
  const { serviceClient } = await requireAdmin();
  const categorySlug = String(formData.get("category") ?? "");
  const { data: category } = await serviceClient.from("categories").select("id").eq("slug", categorySlug).single();

  const validated = validateProductPayload(formData, category?.id ?? null);
  if (!validated.ok) {
    return { ok: false, message: validated.message };
  }

  const { id, ...payload } = validated.value;
  const query = id
    ? serviceClient.from("products").update(payload).eq("id", id)
    : serviceClient.from("products").insert(payload);

  const { error } = await query;
  revalidatePath("/admin/products");
  revalidatePath("/ar/products");
  revalidatePath("/en/products");
  return { ok: !error, message: error ? toPublicError(error, "admin") : "Product saved." };
}

export async function upsertCategoryAction(formData: FormData) {
  const { serviceClient } = await requireAdmin();
  const validated = validateCategoryPayload(formData);
  if (!validated.ok) {
    return { ok: false, message: validated.message };
  }

  const { id, ...payload } = validated.value;
  const query = id
    ? serviceClient.from("categories").update(payload).eq("id", id)
    : serviceClient.from("categories").insert(payload);

  const { error } = await query;
  revalidatePath("/admin/categories");
  revalidatePath("/ar/categories");
  revalidatePath("/en/categories");
  return { ok: !error, message: error ? toPublicError(error, "admin") : "Category saved." };
}

export async function deleteCategoryAction(id: string) {
  if (!isUuid(id)) {
    return { ok: false, message: toPublicError("Invalid request", "admin") };
  }

  const { serviceClient } = await requireAdmin();
  const { count } = await serviceClient.from("products").select("id", { count: "exact", head: true }).eq("category_id", id);
  if (count && count > 0) {
    return { ok: false, message: "Cannot delete a category that has products." };
  }

  const { error } = await serviceClient.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
  return { ok: !error, message: error ? toPublicError(error, "admin") : "Category deleted." };
}

export async function uploadAdminImageAction(bucket: "product-images" | "category-images", file: File) {
  const { serviceClient } = await requireAdmin();
  const validated = validateUploadFile(file);
  if (!validated.ok) {
    return { ok: false, message: toPublicError(validated.message, "upload"), url: "" };
  }

  const path = `${Date.now()}-${crypto.randomUUID()}.${validated.extension}`;
  const { error } = await serviceClient.storage.from(bucket).upload(path, file, {
    upsert: false,
    contentType: file.type
  });

  if (error) {
    return { ok: false, message: toPublicError(error, "upload"), url: "" };
  }

  const { data } = serviceClient.storage.from(bucket).getPublicUrl(path);
  return { ok: true, message: "Uploaded.", url: data.publicUrl };
}
