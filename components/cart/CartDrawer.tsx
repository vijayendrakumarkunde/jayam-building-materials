"use client";

import React from "react";
import Link from "next/link";
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowRight, 
  Truck, 
  MessageCircle,
  Phone,
  HardHat,
  ClipboardList
} from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { BRAND_INFO } from "@/lib/constants";

export const CartDrawer: React.FC = () => {
  const { 
    items, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart, 
    subtotal 
  } = useCart();

  if (!isCartOpen) return null;

  const whatsappCheckoutMessage = encodeURIComponent(
    `Hello Jayam Building Materials,\nI want to book the following materials for site delivery:\n\n` +
      items
        .map(
          (i, idx) =>
            `${idx + 1}. *${i.product.name}*\n   Quantity: ${i.quantity} ${i.product.unit}\n   Rate: ₹${i.product.price} / ${i.product.unit} (₹${i.product.price * i.quantity})`
        )
        .join("\n\n") +
      `\n\nEstimated Materials Value: ₹${subtotal}\nPlease confirm vehicle availability and transport charges to my site.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-brand-charcoal text-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-brand-orange-500 text-white">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Materials Order Cart</h3>
                <span className="text-xs text-brand-orange-400">
                  {items.length} {items.length === 1 ? "material" : "materials"} selected
                </span>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-brand-charcoal-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-700">Your cart is currently empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse our catalog to select River Sand, M-Sand, Cement, Steel, and Aggregates.
                </p>
                <button
                  onClick={closeCart}
                  className="px-5 py-2.5 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white text-xs font-bold transition-colors"
                >
                  Explore Materials
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3.5 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-colors"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-slate-200 shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold text-brand-charcoal line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors ml-1 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[10px] text-brand-orange-600 font-bold block mt-0.5">
                        {formatCurrency(item.product.price)} / {item.product.unit}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              Math.max(item.product.minOrderQuantity, item.quantity - 1)
                            )
                          }
                          className="p-1 text-slate-600 hover:bg-slate-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">
                          {item.quantity} {item.product.unit}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="p-1 text-slate-600 hover:bg-slate-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-black text-brand-charcoal">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Options Bar */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
              
              {/* Delivery Note */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <Truck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>No automatic delivery fees:</strong> Site transport is finalized based on distance and tipper access.
                </p>
              </div>

              {/* Subtotal */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Materials Subtotal</span>
                  <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-brand-charcoal">
                  <span>Estimated Total</span>
                  <span className="text-base text-brand-orange-600">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              {/* 3 DISTINCT BOOKING CHOICES */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">
                  Choose Your Preferred Booking Method
                </span>

                {/* Option 1: Normal Website Booking */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full py-3 px-4 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-orange-500/20 transition-all transform hover:-translate-y-0.5"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Book Online (Guest Checkout)</span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Link>

                {/* Option 2: WhatsApp Booking */}
                <a
                  href={`https://wa.me/91${BRAND_INFO.whatsappNumber}?text=${whatsappCheckoutMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Book via WhatsApp ({BRAND_INFO.whatsappNumber})</span>
                </a>

                {/* Option 3: Phone Booking */}
                <a
                  href={BRAND_INFO.telUrl}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-charcoal hover:bg-brand-charcoal-800 text-white font-bold text-xs flex items-center justify-center gap-2 border border-brand-charcoal-700 transition-all"
                >
                  <Phone className="w-4 h-4 text-brand-orange-400" />
                  <span>Book via Phone Call ({BRAND_INFO.phone})</span>
                </a>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
