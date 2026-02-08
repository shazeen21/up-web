"use client";

import { createContext, useContext, useEffect, useState } from "react";

type CartItem = {
  id: string;
  qty: number;
  options?: Record<string, any>;
};

type CommerceContextType = {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (id: string, qty?: number, options?: Record<string, any>) => void;
  removeFromCart: (index: number) => void;
  toggleWishlist: (id: string) => void;
};

const CommerceContext = createContext<CommerceContextType | null>(null);

/* ---------- SAFE JSON HELPERS (IMPORTANT FIX) ---------- */
const getSafeJSON = (key: string, fallback: any) => {
  if (typeof window === "undefined") return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() =>
    getSafeJSON("cart", [])
  );

  const [wishlist, setWishlist] = useState<string[]>(() =>
    getSafeJSON("wishlist", [])
  );

  /* ---------- PERSIST TO LOCALSTORAGE ---------- */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  /* ---------- ACTIONS ---------- */
  const addToCart = (id: string, qty: number = 1, options?: Record<string, any>) => {
    setCart((prev) => {
      // Create a unique key for comparison (simple stringify)
      const optionsKey = options ? JSON.stringify(options) : "";

      const existingIndex = prev.findIndex(
        (i) => i.id === id && (i.options ? JSON.stringify(i.options) : "") === optionsKey
      );

      if (existingIndex > -1) {
        // Item exists with same options -> update qty
        const newCart = [...prev];
        newCart[existingIndex].qty += qty;
        return newCart;
      }

      // New item with these specific options
      return [...prev, { id, qty, options }];
    });
  };

  const removeFromCart = (cartIndex: number) => {
    // Changed to remove by index because ID isn't unique enough anymore
    setCart((prev) => prev.filter((_, idx) => idx !== cartIndex));
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <CommerceContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        toggleWishlist,
      }}
    >
      {children}
    </CommerceContext.Provider>
  );
}

export const useCommerce = () => {
  const ctx = useContext(CommerceContext);
  if (!ctx) throw new Error("useCommerce must be used inside CommerceProvider");
  return ctx;
};
