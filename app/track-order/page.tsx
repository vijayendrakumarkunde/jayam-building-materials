"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { FloatingQuickContact } from "@/components/public/FloatingQuickContact";
import { DeliveryNoticeBanner } from "@/components/public/DeliveryNoticeBanner";
import { 
  Truck, 
  Search, 
  CheckCircle2, 
  Clock, 
  Package, 
  MapPin, 
  Phone, 
  AlertCircle,
  ShieldCheck
} from "lucide-react";
import { useBrandSettings } from "@/lib/utils/settingsStore";

export default function TrackOrderPage() {
  const brand = useBrandSettings();
  const [orderRef, setOrderRef] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sample order result for Phase 2 demonstration
  const [orderResult, setOrderResult] = useState<any | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSearching(true);

    const cleanPhone = mobileNumber.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      setIsSearching(false);
      setOrderResult(null);
      return;
    }

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerPhone: mobileNumber,
          orderReference: orderRef,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        // Fallback to checking local storage if direct API didn't find DB record
        const localKey = orderRef.trim().toUpperCase();
        const localSaved = localKey ? localStorage.getItem(`jayam_order_${localKey}`) : null;
        if (localSaved) {
          const parsed = JSON.parse(localSaved);
          setOrderResult({
            orderReference: parsed.orderReference,
            customerName: parsed.customerName,
            customerPhone: parsed.customerPhone,
            bookingDate: parsed.bookingDate,
            status: parsed.status || "Pending Dispatch Review",
            deliveryAddress: parsed.deliveryAddress,
            materials: parsed.items?.map((i: any) => ({
              name: i.product.name,
              quantity: `${i.quantity} ${i.product.unit}`,
              rate: `₹${i.product.price * i.quantity}`,
            })) || [],
            subtotal: `₹${parsed.subtotal}`,
            vehicleType: "10-Wheeler Tipper (Assigning)",
            timeline: [
              { title: "Booking Received", time: "Logged on System", completed: true },
              { title: "Dispatch Logistics Allocation", time: "In Review", active: true },
              { title: "Tipper Loading & Weighbridge Slip", time: "Pending", completed: false },
              { title: "Site Delivery & Unloading", time: "Scheduled", completed: false },
            ],
          });
        } else {
          setError(data.error || "No booking found matching this mobile number.");
          setOrderResult(null);
        }
      } else {
        setOrderResult({
          ...data.order,
          timeline: [
            { title: "Booking Received", time: "Logged on System", completed: true },
            { title: "Dispatch Logistics Allocation", time: "In Review", active: true },
            { title: "Tipper Loading & Weighbridge Slip", time: "Pending", completed: false },
            { title: "Site Delivery & Unloading", time: "Scheduled", completed: false },
          ],
        });
      }
    } catch (err: any) {
      setError("Could not reach dispatch server. Please try again.");
    } finally {
      setIsSearching(false);
      setSearched(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#20252D]">
      <Navbar />
      <DeliveryNoticeBanner />

      {/* Header in Deep Navy */}
      <div className="bg-[#14243A] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#0F1B2B]">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#F47B20] text-xs font-bold uppercase tracking-wider border border-white/10">
            <Truck className="w-3.5 h-3.5" />
            <span>Live Site Logistics Tracking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Track Your Materials Order
          </h1>
          <p className="text-sm text-slate-300">
            Enter the mobile number used during booking and your order reference code (e.g., JBM-2026-4821) to check live dispatch and tipper progress.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-10">
        
        {/* Search Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Registered Mobile Number *
                  </label>
                  <span className={`text-[10px] font-semibold ${mobileNumber.length === 10 ? "text-emerald-600" : "text-slate-400"}`}>
                    {mobileNumber.length}/10 digits
                  </span>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center gap-1 text-xs font-bold text-slate-500 border-r border-slate-300 pr-2 pointer-events-none select-none">
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="9876543210"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full text-sm pl-16 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-orange-500 focus:ring-1 focus:ring-brand-orange-500 tracking-wider"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Order Reference ID (Optional or Sample)
                </label>
                <input
                  type="text"
                  placeholder="e.g. JBM-2026-4821"
                  value={orderRef}
                  onChange={(e) => setOrderRef(e.target.value)}
                  className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-orange-500 focus:ring-1 focus:ring-brand-orange-500 uppercase"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSearching}
              className="w-full py-3.5 px-6 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold text-sm shadow-lg shadow-brand-orange-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Search className="w-4 h-4" />
              <span>{isSearching ? "Verifying Dispatch Status..." : "Track My Materials Order"}</span>
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Privacy Protected
            </span>
            <span>Need help? Call Dispatch: {brand.phoneFormatted}</span>
          </div>
        </div>

        {/* Tracking Result View */}
        {orderResult && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden space-y-6">
            
            {/* Header Status Strip */}
            <div className="p-6 bg-brand-charcoal text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-brand-orange-400 font-bold uppercase tracking-wider">
                  Order Reference: {orderResult.orderReference}
                </span>
                <h3 className="text-xl font-bold mt-0.5">Status: {orderResult.status}</h3>
                <p className="text-xs text-slate-400 mt-1">Booked on {orderResult.bookingDate}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-brand-orange-500/20 border border-brand-orange-500 text-brand-orange-400 text-xs font-extrabold uppercase">
                  {orderResult.status}
                </span>
              </div>
            </div>

            {/* Delivery Progress Stepper */}
            <div className="px-6 py-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-6">
                Dispatch & Delivery Timeline
              </h4>

              <div className="relative border-l-2 border-brand-orange-500 ml-4 space-y-8 pb-4">
                {orderResult.timeline.map((step: any, idx: number) => (
                  <div key={idx} className="relative pl-6">
                    <span
                      className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 bg-white ${
                        step.completed
                          ? "border-emerald-600 bg-emerald-600"
                          : step.active
                          ? "border-brand-orange-500 bg-brand-orange-500 animate-ping"
                          : "border-slate-300"
                      }`}
                    ></span>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <span className={`text-sm font-bold ${step.active ? "text-brand-orange-600" : "text-slate-800"}`}>
                        {step.title}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{step.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Material Details Table */}
            <div className="px-6 pb-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Materials in Delivery Tipper
              </h4>

              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Material Name</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3 text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orderResult.materials.map((m: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-800">{m.name}</td>
                        <td className="p-3 text-slate-600">{m.quantity}</td>
                        <td className="p-3 text-right font-bold text-slate-900">{m.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Delivery Site Destination */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <MapPin className="w-4 h-4 text-brand-orange-500" />
                  <span>Site Destination:</span>
                </div>
                <p className="text-slate-600 pl-6">{orderResult.deliveryAddress}</p>
                <div className="flex items-center gap-2 text-slate-700 pt-1 pl-6">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Assigned Vehicle: {orderResult.vehicleType}</span>
                </div>
              </div>

              {/* Contact Dispatch Help */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-amber-900">Need to redirect the tipper or update site entry directions?</span>
                <a
                  href={brand.telUrl}
                  className="px-4 py-2 rounded-lg bg-brand-charcoal text-white font-bold hover:bg-brand-orange-600 transition-colors"
                >
                  Call Dispatch Desk
                </a>
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
