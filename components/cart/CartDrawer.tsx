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
  ClipboardList
} from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { useBrandSettings } from "@/lib/utils/settingsStore";

export const CartDrawer: React.FC = () => {
  const brand = useBrandSettings();
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
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header in Deep Navy */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#14243A] text-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#F47B20] text-white">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black">Materials Order Cart</h3>
                <span className="text-xs text-[#FB923C] font-semibold">
                  {items.length} {items.length === 1 ? "material" : "materials"} selected
                </span>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-[#F5F6F8] text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-[#14243A]">Your materials cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse our certified River Sand, M-Sand, Cement, TMT Steel, and Aggregates catalogue.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-3 px-5 py-2.5 rounded-xl bg-[#F47B20] hover:bg-[#DC630D] text-white font-bold text-xs shadow-md transition-all"
                >
                  Browse Building Materials
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3.5 p-3.5 rounded-2xl border border-slate-200/90 bg-[#F5F6F8] relative group"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-white p-1 border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-[#14243A] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        ₹{item.product.price} / {item.product.unit}
                      </span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-slate-600 hover:text-slate-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#14243A]">
                          {item.quantity} {item.product.unit}s
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-slate-600 hover:text-slate-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-black text-[#14243A]">
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
            <div className="p-5 border-t border-slate-200 bg-[#F5F6F8] space-y-4">
              
              {/* Delivery Note */}
              <div className="p-3 rounded-xl bg-[#FFF7ED] border border-[#F47B20]/25 text-[11px] text-slate-700 flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#F47B20] shrink-0 mt-0.5" />
                <p>
                  <strong>No automatic delivery fees:</strong> Site transport is finalized based on distance and tipper access.
                </p>
              </div>

              {/* Subtotal */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Materials Subtotal</span>
                  <span className="font-bold text-[#14243A]">{formatCurrency(subtotal)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-[#14243A]">
                  <span>Estimated Total</span>
                  <span className="text-base text-[#F47B20]">{formatCurrency(subtotal)}</span>
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
                  className="w-full py-3 px-4 rounded-xl bg-[#F47B20] hover:bg-[#DC630D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#F47B20]/25 transition-all transform hover:-translate-y-0.5"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Book Online (Guest Checkout)</span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Link>

                {/* Option 2: WhatsApp Booking */}
                <a
                  href={`https://wa.me/91${brand.whatsappNumber}?text=${whatsappCheckoutMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#159B68] hover:bg-[#108055] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Book via WhatsApp ({brand.whatsappNumber})</span>
                </a>

                {/* Option 3: Phone Booking */}
                <a
                  href={brand.telUrl}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#14243A] hover:bg-[#20252D] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-4 h-4 text-[#F47B20]" />
                  <span>Book via Phone Call ({brand.phone})</span>
                </a>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
