"use client";

import React from "react";
import Link from "next/link";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  Truck, 
  ShieldCheck, 
  Scale, 
  MessageCircle, 
  Phone, 
  ClipboardList,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { FloatingQuickContact } from "@/components/public/FloatingQuickContact";
import { useCart } from "@/lib/context/CartContext";
import { useBrandSettings } from "@/lib/utils/settingsStore";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const brand = useBrandSettings();
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    subtotal, 
    totalItemCount 
  } = useCart();

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
    <div className="min-h-screen flex flex-col bg-[#F5F6F8] text-[#20252D]">
      <Navbar />

      {/* Breadcrumbs Header */}
      <div className="bg-[#14243A] text-white py-8 sm:py-10 px-4 sm:px-6 lg:px-8 border-b border-[#0F1B2B]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-slate-300 mb-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white transition-colors">Materials</Link>
            <span>/</span>
            <span className="text-[#F47B20] font-bold">Shopping Cart</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                <ShoppingCart className="w-7 h-7 sm:w-9 sm:h-9 text-[#F47B20]" />
                <span>Materials Shopping Cart</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Review your building supplies, adjust quantities, or proceed to site booking.
              </p>
            </div>

            {items.length > 0 && (
              <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-white/10 text-[#F47B20] text-xs font-bold border border-white/10">
                {items.length} {items.length === 1 ? "Material" : "Materials"} · {totalItemCount} Total Units
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Cart Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {items.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/90 shadow-sm text-center max-w-2xl mx-auto space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-[#F5F6F8] text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
              <ShoppingCart className="w-10 h-10" />
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-[#14243A]">
              Your Materials Cart is Empty
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              You haven't added any building materials to your cart yet. Explore our direct wholesale catalog for certified River Sand, VSI M-Sand, 53 Grade Cement, TMT Steel, and Aggregates.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/products"
                className="w-full sm:w-auto px-6 py-3 bg-[#F47B20] hover:bg-[#DC630D] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-[#F47B20]/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Browse Building Materials</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-[#14243A] border border-slate-200 rounded-xl text-xs sm:text-sm font-bold transition-colors"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        ) : (
          /* Active Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 Cols: Material Items List */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Header Card */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-[#14243A]">
                    Cart Items ({items.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Direct-from-source wholesale materials ready for site delivery
                  </p>
                </div>

                <button
                  onClick={clearCart}
                  className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-rose-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>

              {/* Items Card List */}
              <div className="space-y-3">
                {items.map((item) => {
                  const lineTotal = item.product.price * item.quantity;
                  return (
                    <div
                      key={item.product.id}
                      className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs hover:border-[#F47B20]/30 transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                    >
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#F5F6F8] p-2 border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[#F47B20] uppercase tracking-wider block">
                            {item.product.categoryName}
                          </span>
                          
                          <h3 className="text-sm sm:text-base font-black text-[#14243A] leading-snug">
                            {item.product.name}
                          </h3>

                          <p className="text-xs text-slate-500 line-clamp-1">
                            {item.product.description}
                          </p>

                          <div className="pt-1 flex items-center gap-3 text-xs">
                            <span className="font-bold text-[#14243A]">
                              ₹{item.product.price.toLocaleString("en-IN")}.00
                              <span className="text-slate-500 font-normal"> / {item.product.unit}</span>
                            </span>

                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                              <span>In Stock</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls & Line Total */}
                      <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {/* Line Total */}
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-slate-400 block font-medium">Material Total:</span>
                          <span className="text-base sm:text-lg font-black text-[#14243A]">
                            ₹{lineTotal.toLocaleString("en-IN")}.00
                          </span>
                        </div>

                        {/* Quantity Plus/Minus Selector (Never below 1) */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-slate-300 rounded-xl bg-[#F8F9FA] shadow-2xs overflow-hidden">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>

                            <span className="w-10 text-center text-xs font-black text-[#14243A] select-none">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Remove material from cart"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Continue Shopping Link */}
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#F47B20] hover:text-[#DC630D] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Continue Browsing & Adding More Materials</span>
                </Link>
              </div>

            </div>

            {/* Right 4 Cols: Order Summary & Checkout Card */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Order Summary Box */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
                <h2 className="text-base font-black text-[#14243A] border-b border-slate-100 pb-3 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-xs font-bold text-slate-400">
                    {totalItemCount} Total Units
                  </span>
                </h2>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Materials Subtotal</span>
                    <span className="font-bold text-[#14243A]">₹{subtotal.toLocaleString("en-IN")}.00</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Digital Weighbridge Slip</span>
                    <span className="font-bold text-emerald-600">100% Free / Included</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Site Transport Logistics</span>
                    <span className="font-bold text-slate-700">Distance-based Tipper</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="text-sm font-black text-[#14243A]">Estimated Total</span>
                    <span className="text-xl font-black text-[#F47B20]">
                      ₹{subtotal.toLocaleString("en-IN")}.00
                    </span>
                  </div>
                </div>

                {/* Primary Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full py-3.5 px-4 bg-[#F47B20] hover:bg-[#DC630D] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-[#F47B20]/25 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Link>

                {/* Quick WhatsApp Booking */}
                <a
                  href={`https://wa.me/91${brand.whatsappNumber}?text=${whatsappCheckoutMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#159B68] hover:bg-[#108055] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Instant Booking via WhatsApp</span>
                </a>

                {/* Quick Phone Call */}
                <a
                  href={brand.telUrl}
                  className="w-full py-2.5 px-4 bg-[#14243A] hover:bg-[#20252D] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#F47B20]" />
                  <span>Call Dispatch: {brand.phoneFormatted}</span>
                </a>

                {/* Logistics Transparency Notice */}
                <div className="p-3.5 rounded-xl bg-[#FFF7ED] border border-[#F47B20]/25 text-[11px] text-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#14243A]">
                    <Truck className="w-3.5 h-3.5 text-[#F47B20]" />
                    <span>Hydraulic Tipper Unloading</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Vehicles depart directly from our LB Nagar dumping yard depot or quarry with digital weight verification slips.
                  </p>
                </div>
              </div>

              {/* Jayam Quality Guarantees */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#159B68]" />
                  <span className="font-semibold">Lab-Tested Silt & Grading Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#14243A]" />
                  <span className="font-semibold">Exact Computerized Net Weight Slips</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#F47B20]" />
                  <span className="font-semibold">Dedicated 10 & 16-Ton Tipper Fleet</span>
                </div>
              </div>

            </div>

          </div>
        )}
      </main>

      <Footer />
      <FloatingQuickContact />
    </div>
  );
}
