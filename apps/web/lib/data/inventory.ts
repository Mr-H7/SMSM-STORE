import { CartItem } from "@/lib/types";
import { products } from "@/lib/data/products";

const STOCK_KEY = "smsm_stock_v1";

type StockMap = Record<string, number>;

const baseStock = () =>
  products.reduce<StockMap>((stock, product) => {
    stock[product.id] = product.stock;
    return stock;
  }, {});

export const getStockMap = (): StockMap => {
  if (typeof window === "undefined") {
    return baseStock();
  }

  try {
    const saved = window.localStorage.getItem(STOCK_KEY);
    return { ...baseStock(), ...(saved ? JSON.parse(saved) : {}) };
  } catch {
    return baseStock();
  }
};

export const getAvailableStock = (productId: string) => getStockMap()[productId] ?? 0;

export const reduceStockForItems = (items: CartItem[]) => {
  if (typeof window === "undefined") {
    return;
  }

  const next = getStockMap();
  items.forEach((item) => {
    next[item.productId] = Math.max(0, (next[item.productId] ?? 0) - item.quantity);
  });
  window.localStorage.setItem(STOCK_KEY, JSON.stringify(next));
};
