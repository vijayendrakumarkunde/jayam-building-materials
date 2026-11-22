"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { FloatingQuickContact } from "@/components/public/FloatingQuickContact";
import { DeliveryNoticeBanner } from "@/components/public/DeliveryNoticeBanner";
import { useCart } from "@/lib/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { BRAND_INFO } from "@/lib/constants";
import { PRODUCTS_DATA } from "@/lib/data/products";
import { 
  ClipboardList, 
  MessageCircle, 
  Phone, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft, 
  Clock, 
  Building2,
  HardHat,
  ChevronRight,
  PlusCircle,
  HelpCircle
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, addToCart } = useCart();

  // Active booking method tab: "website" | "whatsapp" | "call"
  const [bookingMethod, setBookingMethod] = useState<"website" | "whatsapp" | "call">("website");

  // Website Form State (Guest checkout - no login required!)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    alternatePhone: "",
    deliveryAddress: "",
    landmark: "",
    cityOrArea: "Hyderabad & Surrounding Industrial Regions",
    roadAccess: "10-Wheeler Tipper Accessible (Wide Road 30ft+)",
    preferredDate: "Earliest Available Tipper Slot",
    specialInstructions: "",
  });

  // Calculate items list or default sample if testing
  const checkoutItems = items.length > 0 ? items : [
    { product: PRODUCTS_DATA[0], quantity: 16 }, // Sample 16 Ton River Sand for testing
  ];
  const checkoutSubtotal = items.length > 0 ? subtotal : PRODUCTS_DATA[0].price * 16;

  // Formatted WhatsApp Message
  const whatsappCheckoutMessage = encodeURIComponent(
    `Hello Jayam Building Materials,\nI want to book the following materials for site delivery:\n\n` +
      checkoutItems
        .map(
          (i, idx) =>
            `${idx + 1}. *${i.product.name}*\n   Quantity: ${i.quantity} ${i.product.unit}\n   Rate: ₹${i.product.price} / ${i.product.unit} (₹${i.product.price * i.quantity})`
        )
        .join("\n\n") +
      `\n\nEstimated Materials Value: ₹${checkoutSubtotal}\nPlease confirm vehicle availability and transport charges to my site.`
  );

  const handleWebsiteBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate unique human-readable order reference ID (e.g. JBM-2026-4921)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderRef = `JBM-2026-${randomSuffix}`;

    const orderDetails = {
      orderReference: orderRef,
      customerName: formData.fullName,
      customerPhone: formData.phone,
      alternatePhone: formData.alternatePhone,
      deliveryAddress: formData.deliveryAddress,
      landmark: formData.landmark,
      cityOrArea: formData.cityOrArea,
      roadAccess: formData.roadAccess,
      preferredDate: formData.preferredDate || "Earliest Available Tipper Slot",
      specialInstructions: formData.specialInstructions,
      items: checkoutItems,
      subtotal: checkoutSubtotal,
      bookingDate: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "Pending Dispatch Review",
    };

    try {
      localStorage.setItem(`jayam_order_${orderRef}`, JSON.stringify(orderDetails));

      // Send to server-side API (connects to Supabase PostgreSQL)
      await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDetails),
      });
    } catch (err) {
      console.error("Order submit notice:", err);
    } finally {
      clearCart();
      setIsSubmitting(false);
      router.push(`/order-confirmation/${orderRef}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <DeliveryNoticeBanner />

      {/* Header Banner */}
      <div className="bg-brand-charcoal text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-brand-charcoal-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-brand-orange-400 font-semibold mb-1">
              <Link href="/" className="hover:underline">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <Link href="/products" className="hover:underline">Materials</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-white">Checkout & Booking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Complete Your Materials Booking
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Choose your booking method: Online Website Booking, Instant WhatsApp Booking, or Direct Phone Call.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-brand-orange-400 self-start sm:self-auto bg-brand-charcoal-800 px-3.5 py-2 rounded-xl border border-brand-charcoal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Add More Materials
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-6">
        
        {/* Notice if cart was empty but showing sample */}
        {items.length === 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <HardHat className="w-5 h-5 text-brand-orange-600 shrink-0" />
              <span>
                <strong>Quick Test Mode:</strong> Showing sample order (16 Tons River Sand). You can also add materials from our catalog.
              </span>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-brand-orange-700 hover:underline shrink-0"
            >
              Browse Catalog ➔
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left 7 Columns: 3 DISTINCT BOOKING CHANNELS */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Channel Tabs */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-3 gap-2">
              
              {/* Tab 1: Normal Website Booking */}
              <button
                type="button"
                onClick={() => setBookingMethod("website")}
                className={`py-3.5 px-2 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                  bookingMethod === "website"
                    ? "bg-brand-charcoal text-white shadow-md ring-2 ring-brand-charcoal/20"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <ClipboardList className={`w-4 h-4 ${bookingMethod === "website" ? "text-brand-orange-400" : "text-slate-500"}`} />
                <div className="text-center sm:text-left">
                  <span className="block font-bold">1. Online Form</span>
                  <span className="text-[10px] opacity-75 font-normal block hidden sm:inline">Guest Checkout</span>
                </div>
              </button>

              {/* Tab 2: WhatsApp Booking */}
              <button
                type="button"
                onClick={() => setBookingMethod("whatsapp")}
                className={`py-3.5 px-2 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                  bookingMethod === "whatsapp"
                    ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/20"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <div className="text-center sm:text-left">
                  <span className="block font-bold">2. WhatsApp</span>
                  <span className="text-[10px] opacity-75 font-normal block hidden sm:inline">Instant Reply</span>
                </div>
              </button>

              {/* Tab 3: Phone Booking */}
              <button
                type="button"
                onClick={() => setBookingMethod("call")}
                className={`py-3.5 px-2 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                  bookingMethod === "call"
                    ? "bg-brand-orange-600 text-white shadow-md ring-2 ring-brand-orange-500/20"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Phone className="w-4 h-4" />
                <div className="text-center sm:text-left">
                  <span className="block font-bold">3. Phone Call</span>
                  <span className="text-[10px] opacity-75 font-normal block hidden sm:inline">Speak to Desk</span>
                </div>
              </button>

            </div>

            {/* CHANNEL 1: NORMAL WEBSITE BOOKING (GUEST FORM) */}
            {bookingMethod === "website" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange-50 text-brand-orange-700 text-xs font-bold uppercase tracking-wider mb-2 border border-brand-orange-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-orange-600" />
                    <span>No Login or Password Required</span>
                  </div>
                  <h2 className="text-xl font-bold text-brand-charcoal">
                    Site Delivery & Contact Details
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill this quick booking form. We will generate an Order ID and our dispatch desk will call you to confirm transport and unloading.
                  </p>
                </div>

                <form onSubmit={handleWebsiteBookingSubmit} className="space-y-4">
                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-orange-500 focus:ring-1 focus:ring-brand-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Mobile Number (For Order Tracking) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                        className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-orange-500 focus:ring-1 focus:ring-brand-orange-500"
                      />
                    </div>
                  </div>

                  {/* Alternate Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Alternate Mobile / Site Supervisor Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.alternatePhone}
                      onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                      placeholder="e.g. 9505609865"
                      className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-orange-500"
                    />
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Delivery Site Address (Plot / Street / Area) *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.deliveryAddress}
                      onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                      placeholder="e.g. Plot No 42, Behind Metro Pillar 14, Madhapur, Hyderabad"
                      className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-orange-500"
                    ></textarea>
                  </div>

                  {/* Landmark & Road Accessibility */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Nearby Landmark (For Driver)
                      </label>
                      <input
                        type="text"
                        value={formData.landmark}
                        onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                        placeholder="e.g. Near Water Tank / Electric Substation"
                        className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Site Road Accessibility
                      </label>
                      <select
                        value={formData.roadAccess}
                        onChange={(e) => setFormData({ ...formData, roadAccess: e.target.value })}
                        className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-brand-orange-500"
                      >
                        <option>10-Wheeler Tipper Accessible (Wide Road 30ft+)</option>
                        <option>6-Wheeler Tipper Accessible (Road 20ft)</option>
                        <option>Narrow Street / Small Vehicle Preferred</option>
                        <option>Need Guidance from Dispatch Coordinator</option>
                      </select>
                    </div>
                  </div>

                  {/* Preferred Delivery Schedule & Special Instructions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Preferred Delivery Timing
                      </label>
                      <input
                        type="text"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        placeholder="e.g. Tomorrow Morning before 9:00 AM"
                        className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Special Instructions
                      </label>
                      <input
                        type="text"
                        value={formData.specialInstructions}
                        onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                        placeholder="e.g. Call supervisor 30 mins before arrival"
                        className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-orange-500"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold text-sm shadow-xl shadow-brand-orange-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                    >
                      <ClipboardList className="w-4 h-4" />
                      <span>
                        {isSubmitting ? "Generating Your Order ID..." : "Confirm Online Booking & Generate Order ID"}
                      </span>
                    </button>
                    <p className="text-center text-[11px] text-slate-400">
                      No upfront prepayment required. You will receive an official Order Reference ID to track live dispatch.
                    </p>
                  </div>
                </form>
              </div>
            )}

            {/* CHANNEL 2: BOOK VIA WHATSAPP */}
            {bookingMethod === "whatsapp" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-brand-charcoal">
                      Book Instantly via WhatsApp
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Direct WhatsApp Dispatch Desk: <strong>+91 {BRAND_INFO.whatsappNumber}</strong>
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                    Automatic WhatsApp Message Ready to Send:
                  </span>
                  <div className="p-3.5 bg-white rounded-lg border border-slate-200 text-slate-700 font-mono text-[11px] whitespace-pre-line max-h-48 overflow-y-auto">
                    {decodeURIComponent(whatsappCheckoutMessage)}
                  </div>
                </div>

                <div className="space-y-3">
                  <a
                    href={`https://wa.me/91${BRAND_INFO.whatsappNumber}?text=${whatsappCheckoutMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
                  >
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span>Open WhatsApp & Send Order List</span>
                  </a>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                    ✓ Our dispatch manager responds immediately on WhatsApp to confirm tipper loading, weighbridge slip, and transport fees.
                  </div>
                </div>
              </div>
            )}

            {/* CHANNEL 3: BOOK VIA DIRECT PHONE CALL */}
            {bookingMethod === "call" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3.5 rounded-2xl bg-brand-orange-50 text-brand-orange-600">
                    <Phone className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-brand-charcoal">
                      Book via Direct Phone Call
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Central Dispatch Desk: <strong>{BRAND_INFO.phoneFormatted}</strong>
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-brand-charcoal text-white space-y-3">
                  <span className="text-xs text-brand-orange-400 font-bold uppercase tracking-wider">
                    Quick Verbal Checklist for the Coordinator
                  </span>
                  <ul className="text-xs space-y-2 text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Materials: <strong>{checkoutItems.map(i => `${i.quantity} ${i.product.unit} ${i.product.name}`).join(", ")}</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Your Site Location / Area for tipper driver navigation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Estimated Value: <strong>{formatCurrency(checkoutSubtotal)}</strong></span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <a
                    href={BRAND_INFO.telUrl}
                    className="w-full py-4 px-6 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold text-sm shadow-xl shadow-brand-orange-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call Central Dispatch Now: {BRAND_INFO.phoneFormatted}</span>
                  </a>

                  <p className="text-center text-xs text-slate-500">
                    Lines open Mon - Sat: 6:00 AM - 9:00 PM | Sunday: 7:00 AM - 2:00 PM. Instant booking confirmation over the phone.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Right 5 Columns: Real-Time Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 sticky top-28">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-brand-charcoal">
                  Selected Materials Summary
                </h3>
                <span className="text-xs font-semibold text-brand-orange-600 bg-brand-orange-50 px-2.5 py-1 rounded-md border border-brand-orange-200">
                  {checkoutItems.length} {checkoutItems.length === 1 ? "Material" : "Materials"}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {checkoutItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-11 h-11 rounded-lg object-cover bg-slate-200 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-slate-800 line-clamp-1">{item.product.name}</h4>
                        <span className="text-[10px] text-slate-500 block">
                          {item.quantity} {item.product.unit} × {formatCurrency(item.product.price)}
                        </span>
                      </div>
                    </div>

                    <span className="font-bold text-brand-charcoal">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Materials Subtotal</span>
                  <span className="font-bold text-slate-900">{formatCurrency(checkoutSubtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Site Transport & Freight</span>
                  <span className="font-semibold text-brand-orange-600">Calculated by Destination Distance</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-brand-charcoal">
                  <span>Total Estimated Value</span>
                  <span className="text-brand-orange-600">{formatCurrency(checkoutSubtotal)}</span>
                </div>
              </div>

              {/* Transparent Logistics Notice */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Jayam Delivery & Weight Promise:</span>
                </div>
                <p className="leading-snug">
                  • 100% digital weighbridge slip handed to site engineer.<br />
                  • Triple-washed sand with lab silt test certificate.<br />
                  • Direct delivery by company-operated tippers.
                </p>
              </div>

            </div>
          </div>

        </div>

      </main>

      <Footer />
      <FloatingQuickContact />
    </div>
  );
}
