"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { FloatingQuickContact } from "@/components/public/FloatingQuickContact";
import { DeliveryNoticeBanner } from "@/components/public/DeliveryNoticeBanner";
import { formatCurrency } from "@/lib/utils";
import { BRAND_INFO } from "@/lib/constants";
import { 
  CheckCircle2, 
  Truck, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  FileText,
  Copy,
  Check
} from "lucide-react";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderRef = (params?.orderRef as string) || "JBM-2026-SAMPLE";

  const [copied, setCopied] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`jayam_order_${orderRef}`);
      if (stored) {
        setOrderData(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, [orderRef]);

  const copyOrderRef = () => {
    navigator.clipboard.writeText(orderRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Jayam Building Materials,\nI have placed an order on your website.\nOrder Reference: *${orderRef}*\nCustomer: ${orderData?.customerName || "Customer"}\nPhone: ${orderData?.customerPhone || ""}\nPlease confirm dispatch slot and tipper allocation.`
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <DeliveryNoticeBanner />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-8">
        
        {/* Top Success Badge */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Booking Received Successfully
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-charcoal">
              Thank You! Your Materials Order is Logged.
            </h1>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Our central dispatch coordinator is reviewing your site location and allocating the nearest tipper vehicle.
            </p>
          </div>

          {/* Highlighted Order Reference ID */}
          <div className="p-4 sm:p-6 rounded-2xl bg-brand-charcoal text-white max-w-md mx-auto space-y-2 border border-brand-charcoal-700 shadow-md">
            <span className="text-[11px] font-bold text-brand-orange-400 uppercase tracking-widest block">
              Unique Order Reference ID
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl font-black tracking-wider text-white">
                {orderRef}
              </span>
              <button
                onClick={copyOrderRef}
                className="p-2 rounded-lg bg-brand-charcoal-800 hover:bg-brand-charcoal-700 text-slate-300 hover:text-white transition-colors"
                title="Copy Reference ID"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Save this reference ID. You can use it along with your phone number to track your order anytime.
            </p>
          </div>

          {/* Quick Action CTAs: WhatsApp & Call */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-2">
            <a
              href={`https://wa.me/91${BRAND_INFO.whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Send Reference via WhatsApp</span>
            </a>

            <a
              href={BRAND_INFO.telUrl}
              className="py-3.5 px-4 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-orange-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Phone className="w-4 h-4" />
              <span>Call Dispatch ({BRAND_INFO.phone})</span>
            </a>
          </div>

        </div>

        {/* Order Details Breakdown Card */}
        {orderData && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-brand-charcoal border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-orange-500" />
              <span>Booking Summary & Site Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px] mb-1">
                  Customer & Contact
                </span>
                <p className="font-bold text-sm text-slate-800">{orderData.customerName}</p>
                <p className="text-slate-600 mt-0.5">Phone: {orderData.customerPhone}</p>
                {orderData.alternatePhone && (
                  <p className="text-slate-600">Alt Phone: {orderData.alternatePhone}</p>
                )}
                <p className="text-slate-500 mt-1">Booked on: {orderData.bookingDate}</p>
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px] mb-1">
                  Site Delivery Location
                </span>
                <p className="font-semibold text-slate-800 leading-relaxed">{orderData.deliveryAddress}</p>
                {orderData.landmark && (
                  <p className="text-slate-600 mt-0.5">Landmark: {orderData.landmark}</p>
                )}
                <p className="text-brand-orange-700 font-medium mt-1">
                  Access: {orderData.roadAccess}
                </p>
              </div>
            </div>

            {/* Materials Table */}
            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px] mb-2">
                Materials Booked
              </span>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Material</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3 text-right">Estimated Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orderData.items?.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-800">{item.product.name}</td>
                        <td className="p-3 text-slate-600">{item.quantity} {item.product.unit}</td>
                        <td className="p-3 text-right font-bold text-slate-900">
                          {formatCurrency(item.product.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold">
                      <td colSpan={2} className="p-3 text-slate-700">Estimated Materials Subtotal</td>
                      <td className="p-3 text-right text-brand-orange-600 text-sm">
                        {formatCurrency(orderData.subtotal)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Next Steps Guide */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <span className="font-bold block text-sm text-amber-950">Next Steps:</span>
              <p>1. Our dispatch desk will call you to confirm site approach and schedule tipper unloading.</p>
              <p>2. A printed digital weighbridge slip will be handed over to your supervisor upon site arrival.</p>
              <p>3. You can track live dispatch anytime using the Track Order page.</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <Link
                href="/track-order"
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-charcoal hover:text-brand-orange-600"
              >
                <Truck className="w-4 h-4 text-brand-orange-500" />
                <span>Go to Order Tracking Page</span>
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-orange-600 hover:underline"
              >
                <span>Continue Browsing Materials</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        )}

      </main>

      <Footer />
      <FloatingQuickContact />
    </div>
  );
}
