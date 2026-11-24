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
  ClipboardList,
  ExternalLink
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
    subtotal,
    totalItemCount
  } = useCart();

  if (!isCartOpen) return null;

  const whatsappCheckoutMessage = encodeURIComponent(
    `Hello Jayam Building Materials,\nI want to book the following materials for site delivery:\n\n` +
      items
        .map(
          (i, idx) =>
            `${idx + 1}. *${i.product.name}*\n   Quantity: ${i.quantity} ${i.product.unit}\n   Rate: ₹${i.product.price} / ${i.product.unit} (₹${(i.product.price * i.quantity).toLocaleString("en-IN")})`
        )
        .join("\n\n") +
      `\n\nEstimated Materials Value: ₹${subtotal.toLocaleString("en-IN")}\nPlease confirm vehicle availability and transport charges to my site.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header in Deep Navy */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#14243A] text-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#F47B20] text-white">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black">Materials Shopping Cart</h3>
                <span className="text-xs text-[#FB923C] font-semibold">
                  {items.length} {items.length === 1 ? "material" : "materials"} ({totalItemCount} total units)
                </span>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
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
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        ₹{item.product.price.toLocaleString("en-IN")}.00 / {item.product.unit}
                      </span>
                    </div>

                    {/* Quantity Controls - Never below 1 */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                          className="px-2 py-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#14243A] min-w-[2rem] text-center select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-slate-600 hover:text-slate-900 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-black text-[#14243A]">
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}.00
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout & Actions Options Bar */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-[#F5F6F8] space-y-4">
              
              {/* Delivery Note */}
              <div className="p-3 rounded-xl bg-[#FFF7ED] border border-[#F47B20]/25 text-[11px] text-slate-700 flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#F47B20] shrink-0 mt-0.5" />
                <p>
                  <strong>Direct Tipper Delivery:</strong> 100% digital weighbridge slips and prompt hydraulic tipper unloading directly to your site.
                </p>
              </div>

              {/* Subtotal */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Materials Subtotal ({totalItemCount} units)</span>
                  <span className="font-bold text-[#14243A]">₹{subtotal.toLocaleString("en-IN")}.00</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-[#14243A]">
                  <span>Grand Total</span>
                  <span className="text-base text-[#F47B20]">₹{subtotal.toLocaleString("en-IN")}.00</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* 1. Primary Checkout Button */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full py-3 px-4 rounded-xl bg-[#F47B20] hover:bg-[#DC630D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#F47B20]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Link>

                {/* 2. Full Cart Page Option */}
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#14243A] font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4 text-slate-500" />
                  <span>View Full Cart Page</span>
                </Link>

                {/* 3. WhatsApp Booking */}
                <a
                  href={`https://wa.me/91${brand.whatsappNumber}?text=${whatsappCheckoutMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#159B68] hover:bg-[#108055] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Book via WhatsApp ({brand.whatsappNumber})</span>
                </a>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
