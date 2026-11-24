"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, CartItem } from "@/lib/types";

export interface CartToastInfo {
  show: boolean;
  message: string;
  productName?: string;
  quantity?: number;
  unit?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getItemQuantity: (productId: string) => number;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  subtotal: number;
  totalItemCount: number;
  toast: CartToastInfo | null;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "jayam_materials_cart_v1";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [toast, setToast] = useState<CartToastInfo | null>(null);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [items, isInitialized]);

  // Auto-dismiss toast after 3.5 seconds
  useEffect(() => {
    if (toast && toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => (prev ? { ...prev, show: false } : null));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const addToCart = useCallback((product: Product, quantity?: number) => {
    const qtyToAdd = quantity && quantity > 0 ? quantity : (product.minOrderQuantity || 1);

    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + qtyToAdd }
            : i
        );
      }
      return [...prev, { product, quantity: qtyToAdd }];
    });

    // Trigger non-blocking toast notification (Amazon/Flipkart style)
    setToast({
      show: true,
      message: "Material added to cart successfully",
      productName: product.name,
      quantity: qtyToAdd,
      unit: product.unit,
    });

    // NOTE: Intentionally do NOT open cart drawer. Customer stays on product page!
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    // Quantity should never go below 1
    const safeQty = Math.max(1, quantity);
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: safeQty } : i))
    );
  }, []);

  const getItemQuantity = useCallback((productId: string) => {
    const found = items.find((i) => i.product.id === productId);
    return found ? found.quantity : 0;
  }, [items]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalItemCount = items.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        getItemQuantity,
        clearCart,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        subtotal,
        totalItemCount,
        toast,
        dismissToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
