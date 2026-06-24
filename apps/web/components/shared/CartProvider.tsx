"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product } from "@/lib/types";

type AddPayload = {
  product: Product;
  size: string;
  color: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (payload: AddPayload) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (
    productId: string,
    size: string,
    color: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "smsm_cart_system_v1";
const LEGACY_STORAGE_KEYS = ["smsm_cart", "smsm_cart_ar", "smsm_cart_en", "smsm_cart_v1"];

function parseCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as CartItem[] : [];
  } catch {
    return [];
  }
}

function loadStoredCart() {
  const current = parseCart(window.localStorage.getItem(STORAGE_KEY));
  if (current.length) return current;

  for (const key of LEGACY_STORAGE_KEYS) {
    const legacy = parseCart(window.localStorage.getItem(key));
    if (legacy.length) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
      return legacy;
    }
  }

  return [];
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadStoredCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const addItem = ({ product, size, color, quantity }: AddPayload) => {
    const availableStock = product.stock;
    if (availableStock <= 0 || product.status === "out-of-stock") {
      return;
    }

    setItems((prev) => {
      const index = prev.findIndex(
        (it) => it.productId === product.id && it.size === size && it.color === color
      );
      if (index >= 0) {
        return prev.map((it, idx) =>
          idx === index
            ? {
                ...it,
                quantity: Math.min(availableStock, it.quantity + quantity),
                maxStock: availableStock
              }
            : it
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          slug: product.slug,
          nameAr: product.nameAr,
          nameEn: product.nameEn,
          image: product.images[0] ?? "/images/smsm-logo.png",
          price: product.price,
          size,
          color,
          quantity: Math.min(availableStock, quantity),
          maxStock: availableStock
        }
      ];
    });
  };

  const removeItem = (productId: string, size: string, color: string) => {
    setItems((prev) =>
      prev.filter(
        (it) => !(it.productId === productId && it.size === size && it.color === color)
      )
    );
  };

  const updateQuantity = (
    productId: string,
    size: string,
    color: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeItem(productId, size, color);
      return;
    }
    setItems((prev) =>
      prev.map((it) =>
        it.productId === productId && it.size === size && it.color === color
          ? { ...it, quantity: Math.min(it.maxStock ?? quantity, quantity) }
          : it
      )
    );
  };

  const clearCart = () => setItems([]);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
