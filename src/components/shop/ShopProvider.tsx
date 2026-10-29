"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";
import type { StoreSettings } from "@/types/admin";

export interface CartLine {
  productId: string;
  name: string;
  color: string;
  colorHex: string;
  storage: string;
  image: string;
  price: number;
  quantity: number;
}

export const MAX_COMPARE = 3;

type ShopContextType = {
  products: Product[];
  settings: Pick<StoreSettings, "storeName" | "storeEmail" | "storePhone" | "storeAddress">;
  getProduct: (id: string) => Product | undefined;

  cart: CartLine[];
  cartCount: number;
  cartTotal: number;
  addToCart: (line: Omit<CartLine, "quantity">, options?: { quantity?: number; openBag?: boolean }) => void;
  setQuantity: (line: CartLine, quantity: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  saved: string[];
  toggleSaved: (id: string) => void;

  compare: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;

  recent: string[];
  markViewed: (id: string) => void;

  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
};

const ShopContext = createContext<ShopContextType | null>(null);

const lineKey = (l: Pick<CartLine, "productId" | "color" | "storage">) =>
  `${l.productId}::${l.color}::${l.storage}`;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode, quota) — state still works for this visit.
  }
}

export function ShopProvider({
  products,
  settings,
  children,
}: {
  products: Product[];
  settings: ShopContextType["settings"];
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // Writes wait until the stored state has been restored, or the empty initial state would overwrite it.
  const [hydrated, setHydrated] = useState(false);

  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const getProduct = useCallback((id: string) => byId.get(id), [byId]);

  // Restore persisted state, dropping anything no longer in the catalog and refreshing prices.
  useEffect(() => {
    const known = (ids: string[]) => ids.filter((id) => byId.has(id));
    // localStorage only exists after hydration, so restoring has to happen here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCart(
      read<CartLine[]>("eri.cart", []).flatMap((l) => {
        const v = byId.get(l.productId)?.variants.find((x) => x.color === l.color && x.storage === l.storage);
        return v && v.inStock && v.stock > 0 ? [{ ...l, price: v.price, quantity: Math.min(l.quantity, v.stock) }] : [];
      })
    );
    setSaved(known(read<string[]>("eri.saved", [])));
    setCompare(known(read<string[]>("eri.compare", [])).slice(0, MAX_COMPARE));
    // Merge rather than replace: a product page marks itself viewed before this effect runs.
    setRecent((prev) => [...new Set([...prev, ...known(read<string[]>("eri.recent", []))])].slice(0, 8));
    setHydrated(true);
  }, [byId]);

  useEffect(() => { if (hydrated) write("eri.cart", cart); }, [hydrated, cart]);
  useEffect(() => { if (hydrated) write("eri.saved", saved); }, [hydrated, saved]);
  useEffect(() => { if (hydrated) write("eri.compare", compare); }, [hydrated, compare]);
  useEffect(() => { if (hydrated) write("eri.recent", recent); }, [hydrated, recent]);

  const addToCart = useCallback((line: Omit<CartLine, "quantity">, { quantity = 1, openBag = true } = {}) => {
    setCart((prev) => {
      const key = lineKey(line);
      const existing = prev.find((l) => lineKey(l) === key);
      if (existing) {
        return prev.map((l) => (lineKey(l) === key ? { ...l, quantity: l.quantity + quantity } : l));
      }
      return [...prev, { ...line, quantity }];
    });
    if (openBag) setCartOpen(true);
  }, []);

  const setQuantity = useCallback((line: CartLine, quantity: number) => {
    const key = lineKey(line);
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((l) => lineKey(l) !== key)
        : prev.map((l) => (lineKey(l) === key ? { ...l, quantity } : l))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleSaved = useCallback((id: string) => {
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      // Adding a fourth replaces the oldest, so the button never silently does nothing.
      return [...prev, id].slice(-MAX_COMPARE);
    });
  }, []);

  const clearCompare = useCallback(() => setCompare([]), []);

  const markViewed = useCallback((id: string) => {
    setRecent((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8));
  }, []);

  const value: ShopContextType = {
    products,
    settings,
    getProduct,
    cart,
    cartCount: cart.reduce((s, l) => s + l.quantity, 0),
    cartTotal: cart.reduce((s, l) => s + l.price * l.quantity, 0),
    addToCart,
    setQuantity,
    clearCart,
    cartOpen,
    setCartOpen,
    saved,
    toggleSaved,
    compare,
    toggleCompare,
    clearCompare,
    recent,
    markViewed,
    searchOpen,
    setSearchOpen,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
