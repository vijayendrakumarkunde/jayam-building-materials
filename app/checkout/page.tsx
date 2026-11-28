"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { FloatingQuickContact } from "@/components/public/FloatingQuickContact";
import { DeliveryNoticeBanner } from "@/components/public/DeliveryNoticeBanner";
import { useCart } from "@/lib/context/CartContext";
import { formatCurrency, buildUpiIntentUrl, buildUpiQrCodeUrl } from "@/lib/utils";
import { useBrandSettings } from "@/lib/utils/settingsStore";
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
  HelpCircle,
  QrCode,
  CreditCard,
  Banknote,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Zap,
  Navigation,
  AlertCircle
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const brand = useBrandSettings();
  const { items, subtotal, clearCart, addToCart } = useCart();

  // Active booking method tab: "website" | "whatsapp" | "call"
  const [bookingMethod, setBookingMethod] = useState<"website" | "whatsapp" | "call">("website");

  // Payment Option: "upi" (Direct UPI Payment) | "site" (Pay on Site Delivery)
  const [paymentChoice, setPaymentChoice] = useState<"upi" | "site">("upi");
  const [utrNumber, setUtrNumber] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Validation & Location States
  const [phoneError, setPhoneError] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationUrl, setLocationUrl] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const copyUpiId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const payableAmount = checkoutSubtotal;

  // GPS Current Site Location Detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser. You can paste your Google Maps or WhatsApp location link below.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        const mapUrl = `https://maps.google.com/?q=${lat},${lng}`;
        
        setLocationUrl(mapUrl);
        setIsLocating(false);

        // If delivery address is empty, set a helpful prompt
        if (!formData.deliveryAddress.trim()) {
          setFormData((prev) => ({
            ...prev,
            deliveryAddress: `Construction Site Location (GPS: ${lat}, ${lng})`,
          }));
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError("Location permission was denied. You can paste your Google Maps or WhatsApp location pin link below.");
        } else {
          setLocationError("Could not retrieve GPS coordinates. Please enter your address or paste your Google Maps link below.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Formatted WhatsApp Message
  const whatsappCheckoutMessage = encodeURIComponent(
    `Hello Jayam Building Materials,\nI want to book the following materials for site delivery:\n\n` +
      checkoutItems
        .map(
          (i, idx) =>
            `${idx + 1}. *${i.product.name}*\n   Quantity: ${i.quantity} ${i.product.unit}\n   Rate: ₹${i.product.price} / ${i.product.unit} (₹${(i.product.price * i.quantity).toLocaleString("en-IN")})`
        )
        .join("\n\n") +
      `\n\nEstimated Materials Value: ₹${checkoutSubtotal.toLocaleString("en-IN")}\n` +
      (locationUrl ? `📍 *Site Location Pin*: ${locationUrl.trim()}\n` : ``) +
      `Please confirm vehicle availability and transport charges to my site.`
  );

  const handleWebsiteBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Strict 10-digit phone number validation
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setPhoneError("Please enter a valid 10-digit mobile number.");
      const phoneInput = document.getElementById("phone-input");
      phoneInput?.focus();
      return;
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setPhoneError("Mobile number must be a valid 10-digit Indian number starting with 6, 7, 8, or 9.");
      const phoneInput = document.getElementById("phone-input");
      phoneInput?.focus();
      return;
    }

    // Alternate phone validation if provided
    if (formData.alternatePhone) {
      const cleanAlt = formData.alternatePhone.replace(/\D/g, "");
      if (cleanAlt.length !== 10) {
        setPhoneError("Alternate mobile number must be exactly 10 digits if provided.");
        return;
      }
    }

    setPhoneError("");
    setIsSubmitting(true);

    // Generate unique human-readable order reference ID (e.g. JBM-2026-4921)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderRef = `JBM-2026-${randomSuffix}`;

    const paymentMethodLabel = 
      paymentChoice === "upi" 
        ? `Direct UPI Payment (${formatCurrency(checkoutSubtotal)})` 
        : `Pay on Delivery (Cash / Driver UPI)`;

    const paymentStatusLabel = 
      paymentChoice === "site" 
        ? "Pay on Site Delivery" 
        : utrNumber.trim() 
        ? `Paid via UPI (UTR: ${utrNumber.trim()})` 
        : "Pending UPI Verification";

    const fullAddress = locationUrl && !formData.deliveryAddress.includes(locationUrl)
      ? `${formData.deliveryAddress.trim()}\n📍 Site Location Map: ${locationUrl.trim()}`
      : formData.deliveryAddress.trim();

    const orderDetails = {
      orderReference: orderRef,
      customerName: formData.fullName.trim(),
      customerPhone: cleanPhone,
      alternatePhone: formData.alternatePhone.trim() || undefined,
      deliveryAddress: fullAddress,
      locationUrl: locationUrl.trim() || undefined,
      landmark: formData.landmark.trim() || undefined,
      cityOrArea: formData.cityOrArea,
      roadAccess: formData.roadAccess,
      preferredDate: formData.preferredDate || "Earliest Available Tipper Slot",
      specialInstructions: formData.specialInstructions.trim() || undefined,
      items: checkoutItems,
      subtotal: checkoutSubtotal,
      paymentMethod: paymentMethodLabel,
      paymentStatus: paymentStatusLabel,
      utrNumber: utrNumber.trim(),
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
    <div className="min-h-screen flex flex-col bg-white text-[#20252D]">
      <Navbar />
      <DeliveryNoticeBanner />

      {/* Header Banner in Deep Navy */}
      <div className="bg-[#14243A] text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-[#0F1B2B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-brand-orange-400 font-semibold mb-1">
              <Link href="/" className="hover:underline">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <Link href="/products" className="hover:underline">Materials</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <Link href="/cart" className="hover:underline">Cart</Link>
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

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-white bg-[#1F334E] px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Review Cart
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-white bg-[#1F334E] px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
            >
              Add More Materials
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-6">
        
        {/* Notice if cart was empty but showing sample */}
        {items.length === 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <img src="/images/logo-icon.png" alt="" className="w-5 h-5 object-contain shrink-0" />
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
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Mobile Number *
                        </label>
                        <span className={`text-[11px] font-semibold ${formData.phone.length === 10 ? "text-emerald-600" : "text-slate-400"}`}>
                          {formData.phone.length}/10 digits
                        </span>
                      </div>
                      <div className="relative flex items-center">
                        <div className="absolute left-3 flex items-center gap-1 text-xs font-bold text-slate-600 border-r border-slate-300 pr-2.5 pointer-events-none select-none">
                          <span className="text-sm">🇮🇳</span>
                          <span>+91</span>
                        </div>
                        <input
                          id="phone-input"
                          type="tel"
                          required
                          inputMode="numeric"
                          maxLength={10}
                          value={formData.phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                            setFormData({ ...formData, phone: val });
                            if (phoneError && val.length === 10) setPhoneError("");
                          }}
                          placeholder="9876543210"
                          className={`w-full text-sm pl-20 pr-4 py-2.5 rounded-xl border ${
                            phoneError ? "border-rose-500 ring-1 ring-rose-200" : "border-slate-300 focus:border-brand-orange-500 focus:ring-brand-orange-500"
                          } focus:outline-none focus:ring-1 tracking-wider font-medium`}
                        />
                      </div>
                      {phoneError ? (
                        <p className="text-[11px] font-semibold text-rose-600 mt-1">{phoneError}</p>
                      ) : (
                        <p className="text-[11px] text-slate-500 mt-1">10-digit Indian mobile number for order tracking & dispatch.</p>
                      )}
                    </div>
                  </div>

                  {/* Alternate Phone */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Alternate Mobile / Site Supervisor Phone (Optional)
                      </label>
                      {formData.alternatePhone && (
                        <span className={`text-[11px] font-semibold ${formData.alternatePhone.length === 10 ? "text-emerald-600" : "text-amber-600"}`}>
                          {formData.alternatePhone.length}/10 digits
                        </span>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 flex items-center gap-1 text-xs font-bold text-slate-600 border-r border-slate-300 pr-2.5 pointer-events-none select-none">
                        <span className="text-sm">🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={formData.alternatePhone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setFormData({ ...formData, alternatePhone: val });
                        }}
                        placeholder="9505609865"
                        className="w-full text-sm pl-20 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-orange-500 tracking-wider font-medium"
                      />
                    </div>
                  </div>

                  {/* Delivery Address & GPS Location Option */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Delivery Site Address (Plot / Street / Area) *
                      </label>

                      {/* GPS Location Button */}
                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        disabled={isLocating}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
                        title="Detect and attach your current construction site GPS coordinates"
                      >
                        {isLocating ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
                            <span>Detecting GPS Location...</span>
                          </>
                        ) : (
                          <>
                            <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                            <span>📍 Use My Current Location (GPS Pin)</span>
                          </>
                        )}
                      </button>
                    </div>

                    <textarea
                      required
                      rows={2}
                      value={formData.deliveryAddress}
                      onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                      placeholder="e.g. Plot No 42, Behind Metro Pillar 14, Madhapur, Hyderabad"
                      className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-orange-500"
                    ></textarea>

                    {/* Location Pin Attached Card */}
                    {locationUrl ? (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs animate-in fade-in">
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div className="truncate">
                            <span className="font-bold block text-emerald-900">
                              ✓ Site Location Pin Attached for Tipper Driver
                            </span>
                            <a
                              href={locationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-emerald-700 underline font-mono flex items-center gap-1 hover:text-emerald-900 truncate"
                            >
                              <span>{locationUrl}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setLocationUrl("");
                            setLocationError(null);
                          }}
                          className="text-xs font-bold text-slate-500 hover:text-rose-600 ml-2 px-2.5 py-1 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 shrink-0"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    ) : (
                      /* Option to paste Google Maps or WhatsApp location pin link */
                      <div className="pt-0.5">
                        <div className="relative">
                          <input
                            type="text"
                            value={locationUrl}
                            onChange={(e) => setLocationUrl(e.target.value)}
                            placeholder="Optional: Paste Google Maps location link or WhatsApp location link here"
                            className="w-full text-xs pl-8 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-orange-500 text-slate-700"
                          />
                          <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          You can click "Use My Current Location" or paste a Google Maps link so the tipper lorry reaches your exact plot.
                        </p>
                      </div>
                    )}

                    {locationError && (
                      <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{locationError}</span>
                      </div>
                    )}
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

                  {/* SIMPLE PAYMENT OPTIONS */}
                  <div className="pt-6 border-t border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-brand-orange-600 uppercase tracking-wider block">
                          Step 2: Choose Payment Method
                        </span>
                        <h3 className="text-base font-bold text-brand-charcoal">
                          How Would You Like to Pay?
                        </h3>
                      </div>
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        0% UPI Surcharge
                      </span>
                    </div>

                    {/* 2 Clean Payment Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Option 1: Direct UPI (PhonePe / GPay / Paytm / QR) */}
                      <button
                        type="button"
                        onClick={() => setPaymentChoice("upi")}
                        className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                          paymentChoice === "upi"
                            ? "border-brand-orange-500 bg-brand-orange-50/40 shadow-md ring-2 ring-brand-orange-500/20"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
                              PhonePe • GPay • Paytm
                            </span>
                            <span className="text-xs font-black text-brand-orange-600">
                              Direct Bank Transfer
                            </span>
                          </div>
                          <div className="font-extrabold text-sm text-brand-charcoal flex items-center gap-1.5 pt-0.5">
                            <QrCode className="w-4 h-4 text-purple-600" />
                            <span>Pay via UPI / QR Code</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-snug">
                            Scan QR or tap to pay directly from your UPI app. Zero gateway fees.
                          </p>
                        </div>
                      </button>

                      {/* Option 2: Pay on Delivery (Cash / Driver UPI) */}
                      <button
                        type="button"
                        onClick={() => setPaymentChoice("site")}
                        className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                          paymentChoice === "site"
                            ? "border-brand-orange-500 bg-brand-orange-50/40 shadow-md ring-2 ring-brand-orange-500/20"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                              At Delivery Site
                            </span>
                            <span className="text-xs font-black text-emerald-700">
                              Pay After Inspection
                            </span>
                          </div>
                          <div className="font-extrabold text-sm text-brand-charcoal flex items-center gap-1.5 pt-0.5">
                            <Banknote className="w-4 h-4 text-emerald-600" />
                            <span>Pay on Delivery</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-snug">
                            Verify the tipper lorry and digital weighbridge slip at site, then pay cash or driver UPI.
                          </p>
                        </div>
                      </button>
                    </div>

                    {/* SIMPLE UPI PAYMENT CARD (Shown when paymentChoice === "upi") */}
                    {paymentChoice === "upi" && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-brand-charcoal text-white space-y-4 border border-brand-charcoal-700 shadow-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange-400">
                              Direct PhonePe UPI Payment
                            </span>
                            <h4 className="text-sm font-bold text-white">
                              Pay {formatCurrency(checkoutSubtotal)} to Jayam Materials
                            </h4>
                          </div>
                          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 self-start sm:self-auto">
                            Instant Bank Settlement
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                          {/* QR Code */}
                          <div className="sm:col-span-5 bg-white p-3 rounded-xl flex flex-col items-center justify-center text-center">
                            <img
                              src={buildUpiQrCodeUrl(checkoutSubtotal, "JAYAM")}
                              alt="Scan UPI QR Code"
                              className="w-36 h-36 rounded-lg object-contain"
                            />
                            <span className="text-[10px] font-bold text-slate-800 mt-1.5">
                              Scan with Any UPI App
                            </span>
                            <span className="text-[9px] text-slate-500">
                              PhonePe • Google Pay • Paytm • BHIM
                            </span>
                          </div>

                          {/* UPI IDs & 1-Tap Mobile Button */}
                          <div className="sm:col-span-7 space-y-3">
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                Primary UPI ID
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs font-mono font-bold text-brand-orange-300 flex-1 select-all">
                                  {brand.upiId}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => copyUpiId(brand.upiId)}
                                  className="p-2 rounded-lg bg-brand-orange-500 hover:bg-brand-orange-600 text-white transition-colors"
                                  title="Copy UPI ID"
                                >
                                  {copiedUpi ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                                </button>
                              </div>
                              {copiedUpi && (
                                <p className="text-[10px] text-emerald-400 font-semibold animate-pulse">
                                  ✓ UPI ID copied! Paste in your UPI app.
                                </p>
                              )}
                            </div>

                            {/* Mobile 1-Tap UPI Launch Button */}
                            <a
                              href={buildUpiIntentUrl(checkoutSubtotal, "JAYAM")}
                              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>1-Tap Pay via UPI App (PhonePe / GPay)</span>
                            </a>

                            <div className="text-[10px] text-slate-400 leading-snug">
                              Payee Name: <strong className="text-slate-200">{brand.merchantName}</strong><br />
                              Alternate UPI: <span className="font-mono text-slate-300">{brand.alternateUpiId}</span>
                            </div>
                          </div>
                        </div>

                        {/* Optional 12-Digit UPI Transaction / UTR Input */}
                        <div className="pt-3 border-t border-white/10 space-y-1.5">
                          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                            UPI Transaction Ref / UTR (Optional)
                          </label>
                          <input
                            type="text"
                            maxLength={16}
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(e.target.value)}
                            placeholder="e.g. 402918239012 (if paid now)"
                            className="w-full text-xs px-3.5 py-2 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange-500 font-mono"
                          />
                          <p className="text-[10px] text-slate-400">
                            You can also complete booking now and send the payment screenshot directly on WhatsApp.
                          </p>
                        </div>
                      </div>
                    )}
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
                        {isSubmitting
                          ? "Securing Your Booking & Generating Order ID..."
                          : paymentChoice === "upi"
                          ? `Confirm Online Booking & Pay via UPI (${formatCurrency(checkoutSubtotal)})`
                          : "Confirm Online Booking & Pay on Site Delivery"}
                      </span>
                    </button>
                    <p className="text-center text-[11px] text-slate-500">
                      {paymentChoice === "site"
                        ? "No advance payment required. Order reference ID generated immediately."
                        : "Official Order Reference ID generated immediately with instant WhatsApp dispatch connection."}
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
                      Direct WhatsApp Dispatch Desk: <strong>+91 {brand.whatsappNumber}</strong>
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
                    href={`https://wa.me/91${brand.whatsappNumber}?text=${whatsappCheckoutMessage}`}
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
                      Central Dispatch Desk: <strong>{brand.phoneFormatted}</strong>
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
                    href={brand.telUrl}
                    className="w-full py-4 px-6 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold text-sm shadow-xl shadow-brand-orange-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call Central Dispatch Now: {brand.phoneFormatted}</span>
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
