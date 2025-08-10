"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = { key: string; title: string; price: number; qty: number };

type CartCtx = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (key: string) => void;
  clear: () => void;
  total: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("CartContext missing");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    const raw = globalThis.localStorage?.getItem("tm_cart");
    if (raw) setItems(JSON.parse(raw));
  }, []);
  useEffect(() => {
    globalThis.localStorage?.setItem("tm_cart", JSON.stringify(items));
  }, [items]);
  const add = (item: CartItem) => {
    setItems((prev) => {
      const found = prev.find((p) => p.key === item.key);
      if (found) return prev.map((p) => (p.key === item.key ? { ...p, qty: p.qty + item.qty } : p));
      return [...prev, item];
    });
  };
  const remove = (key: string) => setItems((prev) => prev.filter((p) => p.key !== key));
  const clear = () => setItems([]);
  const total = useMemo(() => items.reduce((sum, it) => sum + it.price * it.qty, 0), [items]);
  const value = useMemo(() => ({ items, add, remove, clear, total }), [items, total]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}


