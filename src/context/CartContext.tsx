"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedStorage: string;
  price: number;
  image: string;
}

function cartKey(productId: string, color: string, storage: string): string {
  return `${productId}::${color}::${storage}`;
}

function itemKey(item: CartItem): string {
  return cartKey(item.product.id, item.selectedColor, item.selectedStorage);
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, color: string, storage: string, price: number, image: string) => void;
  removeFromCart: (productId: string, color: string, storage: string) => void;
  updateQuantity: (productId: string, color: string, storage: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback(
    (product: Product, color: string, storage: string, price: number, image: string) => {
      const key = cartKey(product.id, color, storage);
      setItems((prev) => {
        const existing = prev.find((item) => itemKey(item) === key);
        if (existing) {
          return prev.map((item) =>
            itemKey(item) === key
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { product, quantity: 1, selectedColor: color, selectedStorage: storage, price, image }];
      });
      setIsCartOpen(true);
    },
    []
  );

  const removeFromCart = useCallback((productId: string, color: string, storage: string) => {
    const key = cartKey(productId, color, storage);
    setItems((prev) => prev.filter((item) => itemKey(item) !== key));
  }, []);

  const updateQuantity = useCallback((productId: string, color: string, storage: string, quantity: number) => {
    const key = cartKey(productId, color, storage);
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => itemKey(item) !== key));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        itemKey(item) === key ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
