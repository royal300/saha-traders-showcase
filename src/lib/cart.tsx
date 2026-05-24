import * as React from "react";
import type { Product } from "./products";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const Ctx = React.createContext<CartCtx | null>(null);
const KEY = "saha_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [open, setOpen] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add: CartCtx["add"] = (p, qty = 1) => {
    setItems((prev) => {
      const ex = prev.find((i) => i.slug === p.slug);
      if (ex) return prev.map((i) => i.slug === p.slug ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { slug: p.slug, name: p.name, price: p.price, image: p.image, qty }];
    });
  };
  const remove: CartCtx["remove"] = (slug) =>
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  const setQty: CartCtx["setQty"] = (slug, qty) =>
    setItems((prev) => prev.map((i) => i.slug === slug ? { ...i, qty: Math.max(1, qty) } : i));
  const clear = () => setItems([]);

  const count = items.reduce((a, i) => a + i.qty, 0);
  const subtotal = items.reduce((a, i) => a + i.qty * i.price, 0);

  return (
    <Ctx.Provider value={{ items, add, remove, setQty, clear, count, subtotal, open, setOpen }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const v = React.useContext(Ctx);
  if (!v) throw new Error("useCart outside CartProvider");
  return v;
}