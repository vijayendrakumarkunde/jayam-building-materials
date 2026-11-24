"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ShoppingCart, X, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";

export const CartToast: React.FC = () => {
  const { toast, dismissToast, openCart, items } = useCart();

  if (!toast || !toast.show) return null;

  return (
    <aside 
      aria-label="Cart notification"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 sm:max-w-md pointer-events-none animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="pointer-events-auto bg-[#14243A] text-white rounded-2xl p-4 shadow-2xl border-2 border-[#F47B20] flex items-start gap-3 relative">
        {/* Success Icon */}
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
          <CheckCircle2 className="w-5 h-5" />
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-wide text-white uppercase">
              Material Added to Cart
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-[#F47B20] text-white text-[10px] font-bold">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </div>

          <p className="text-xs text-slate-300 font-medium truncate mt-1">
            <strong className="text-white font-bold">{toast.quantity} {toast.unit}</strong> × {toast.productName}
          </p>

          {/* Action Row */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => {
                dismissToast();
                openCart();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F47B20] hover:bg-[#DC630D] text-white text-xs font-bold transition-colors shadow-sm"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>View Cart</span>
            </button>

            <Link
              href="/cart"
              onClick={dismissToast}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              <span>Full Cart Page</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={dismissToast}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
