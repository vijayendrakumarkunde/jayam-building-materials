"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { FloatingQuickContact } from "@/components/public/FloatingQuickContact";
import { DeliveryNoticeBanner } from "@/components/public/DeliveryNoticeBanner";
import { formatCurrency, buildWhatsAppOrderMessage, buildUpiQrCodeUrl, buildUpiIntentUrl } from "@/lib/utils";
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
  Check,
  CreditCard,
  Banknote,
  QrCode,
  ExternalLink,
  Zap,
  Sparkles
} from "lucide-react";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderRef = (params?.orderRef as string) || "JBM-2026-SAMPLE";

  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
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
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const copyUpiId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const whatsappMessage = orderData
    ? buildWhatsAppOrderMessage(orderData)
    : encodeURIComponent(
        `🚨 *NEW ORDER NOTIFICATION - JAYAM BUILDING MATERIALS*\n` +
          `Order Reference: *${orderRef}*\n` +
          `Please confirm tipper vehicle dispatch slot and transport fees.`
      );

  const payableToken = orderData?.tokenAmount || BRAND_INFO.advanceTokenAmount;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <DeliveryNoticeBanner />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        
        {/* Top Success Badge */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
              Booking Received Successfully
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal">
              Thank You! Your Materials Order is Logged.
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Our central dispatch desk is calculating the route for nearest tipper loading.
            </p>
          </div>

          {/* Highlighted Order Reference ID */}
          <div className="p-4 sm:p-5 rounded-2xl bg-brand-charcoal text-white max-w-md mx-auto space-y-2 border border-brand-charcoal-700 shadow-md">
            <span className="text-[11px] font-bold text-brand-orange-400 uppercase tracking-widest block">
              Unique Order Reference ID
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl font-black tracking-wider text-white select-all">
                {orderRef}
              </span>
              <button
                onClick={copyOrderRef}
                className="p-2 rounded-lg bg-brand-charcoal-800 hover:bg-brand-charcoal-700 text-slate-300 hover:text-white transition-colors"
                title="Copy Reference ID"
              >
                {copiedRef ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Track live tipper loading anytime using this reference ID and your phone number.
            </p>
          </div>

          {/* PROMINENT WHATSAPP DISPATCH CTA */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-500/30 text-left space-y-4 max-w-2xl mx-auto shadow-md">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
                <MessageCircle className="w-6 h-6 fill-white" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Direct Owner WhatsApp
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700">
                    +91 {BRAND_INFO.whatsappNumber}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Send Complete Order Bill to Owner on WhatsApp
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tap below to immediately open WhatsApp with your full itemized materials list, site address, and road accessibility prefilled. The owner/dispatch team will confirm the dispatch slot immediately.
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/91${BRAND_INFO.whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-xl shadow-emerald-900/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Send Order Details to Owner on WhatsApp Now</span>
            </a>
          </div>

          {/* Quick Call Desk */}
          <div className="max-w-md mx-auto pt-1">
            <a
              href={BRAND_INFO.telUrl}
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-200"
            >
              <Phone className="w-4 h-4 text-brand-orange-500" />
              <span>Need Urgent Tipper Dispatch? Call Central Desk: {BRAND_INFO.phoneFormatted}</span>
            </a>
          </div>

        </div>

        {/* DIRECT UPI PAYMENT DESK (Shown for advance deposit / UPI confirmation) */}
        <div className="bg-gradient-to-br from-slate-900 to-brand-charcoal text-white rounded-3xl border border-brand-charcoal-700 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange-500/20 text-brand-orange-400 text-xs font-bold uppercase tracking-wider mb-1.5 border border-brand-orange-500/30">
                <Zap className="w-3.5 h-3.5" />
                <span>Direct UPI Payment Desk</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {orderData?.paymentMethod?.includes("Full") 
                  ? `Full UPI Payment: ${formatCurrency(orderData?.subtotal || 0)}` 
                  : `Advance Booking Deposit: ₹2,000`}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Scan with PhonePe, Google Pay, Paytm, BHIM, or any UPI bank app (0% Fee, Instant Settlement).
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 inline-block">
                Recipient: {BRAND_INFO.merchantName}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Dynamic QR Code */}
            <div className="sm:col-span-5 bg-white p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg">
              <img
                src={buildUpiQrCodeUrl(payableToken, orderRef)}
                alt="Scan to Pay via UPI"
                className="w-44 h-44 rounded-xl object-contain"
              />
              <span className="text-xs font-bold text-slate-800 mt-2">
                Scan with Any UPI App
              </span>
              <span className="text-[10px] text-slate-500">
                Amount: ₹{payableToken.toLocaleString("en-IN")} • Direct Bank Transfer
              </span>
            </div>

            {/* UPI ID Details */}
            <div className="sm:col-span-7 space-y-4">
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Primary PhonePe / Universal UPI ID
                </span>
                <div className="flex items-center gap-2">
                  <div className="px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-sm font-mono font-bold text-brand-orange-300 flex-1 select-all">
                    {BRAND_INFO.upiId}
                  </div>
                  <button
                    type="button"
                    onClick={() => copyUpiId(BRAND_INFO.upiId)}
                    className="p-2.5 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white transition-colors"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? <Check className="w-5 h-5 text-emerald-200" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                {copiedUpi && (
                  <p className="text-xs text-emerald-400 font-semibold animate-pulse">
                    ✓ UPI ID copied! Paste in PhonePe, GPay, or Paytm.
                  </p>
                )}
              </div>

              {/* Mobile 1-Tap UPI Launch Button */}
              <a
                href={buildUpiIntentUrl(payableToken, orderRef)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>1-Tap Pay ₹{payableToken.toLocaleString("en-IN")} via UPI App</span>
              </a>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1">
                <p>• Alternate UPI ID: <span className="font-mono text-brand-orange-300">{BRAND_INFO.alternateUpiId}</span></p>
                <p>• After paying, take a screenshot and tap the WhatsApp button above to share it with our dispatch desk.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Breakdown Card */}
        {orderData && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-brand-charcoal border-b border-slate-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-orange-500" />
                <span>Booking Summary & Site Address</span>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {orderData.bookingDate}
              </span>
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

            {/* Payment Info Banner */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">
                  Payment Method Selected
                </span>
                <span className="font-bold text-brand-charcoal text-sm">
                  {orderData.paymentMethod || "Pay on Site Delivery"}
                </span>
                {orderData.utrNumber && (
                  <p className="text-emerald-700 font-mono text-[11px] mt-0.5">
                    UTR / UPI Ref: {orderData.utrNumber}
                  </p>
                )}
              </div>
              <div className="text-right sm:text-right">
                <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">
                  Payment Status
                </span>
                <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  {orderData.paymentStatus || "Pending Verification"}
                </span>
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
