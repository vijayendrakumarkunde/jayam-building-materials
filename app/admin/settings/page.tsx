"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Settings, 
  Save, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock,
  Zap, 
  CreditCard, 
  ShieldCheck, 
  Building2, 
  Truck, 
  ExternalLink, 
  RefreshCw,
  AlertCircle,
  Eye,
  FileText,
  Sparkles
} from "lucide-react";
import { BRAND_INFO } from "@/lib/constants";
import { saveStoredSettings, getStoredSettings } from "@/lib/utils/settingsStore";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    businessName: BRAND_INFO.name,
    tagline: BRAND_INFO.tagline,
    phone: BRAND_INFO.phone,
    whatsapp: BRAND_INFO.whatsappNumber,
    address: BRAND_INFO.address,
    operatingHours: BRAND_INFO.operatingHours,
    deliveryNotice: BRAND_INFO.deliveryNotice,
    // Direct UPI Configuration
    upiId: BRAND_INFO.upiId,
    alternateUpiId: BRAND_INFO.alternateUpiId,
    merchantName: BRAND_INFO.merchantName,
  });

  // Fetch live settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        // First populate from local cache for instant UI
        const cached = getStoredSettings();
        setFormData({
          businessName: cached.name || BRAND_INFO.name,
          tagline: cached.tagline || BRAND_INFO.tagline,
          phone: cached.phone || BRAND_INFO.phone,
          whatsapp: cached.whatsappNumber || BRAND_INFO.whatsappNumber,
          address: cached.address || BRAND_INFO.address,
          operatingHours: cached.operatingHours || BRAND_INFO.operatingHours,
          deliveryNotice: cached.deliveryNotice || BRAND_INFO.deliveryNotice,
          upiId: cached.upiId || BRAND_INFO.upiId,
          alternateUpiId: cached.alternateUpiId || BRAND_INFO.alternateUpiId,
          merchantName: cached.merchantName || BRAND_INFO.merchantName,
        });

        // Next fetch from Supabase via /api/settings
        const res = await fetch("/api/settings", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data && data.settings) {
            setFormData({
              businessName: data.settings.businessName || data.settings.name || BRAND_INFO.name,
              tagline: data.settings.tagline || BRAND_INFO.tagline,
              phone: data.settings.phone || BRAND_INFO.phone,
              whatsapp: data.settings.whatsapp || data.settings.whatsappNumber || BRAND_INFO.whatsappNumber,
              address: data.settings.address || BRAND_INFO.address,
              operatingHours: data.settings.operatingHours || BRAND_INFO.operatingHours,
              deliveryNotice: data.settings.deliveryNotice || BRAND_INFO.deliveryNotice,
              upiId: data.settings.upiId || BRAND_INFO.upiId,
              alternateUpiId: data.settings.alternateUpiId || BRAND_INFO.alternateUpiId,
              merchantName: data.settings.merchantName || BRAND_INFO.merchantName,
            });
            // Also refresh local cache
            saveStoredSettings(data.settings);
          }
        }
      } catch (err: any) {
        console.warn("Could not load remote settings, using local defaults:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSavedSuccess(false);

    try {
      // 1. Save to Supabase via /api/settings
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || "Failed to save settings to database");
      }

      // 2. Save to local storage & broadcast event to all components
      saveStoredSettings(formData);

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 5000);
    } catch (err: any) {
      console.error("Save settings error:", err);
      // Fallback: still save locally so admin sees changes
      saveStoredSettings(formData);
      setErrorMessage(err.message || "Saved locally, but database sync had an issue.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset all settings back to default brand information?")) {
      setFormData({
        businessName: BRAND_INFO.name,
        tagline: BRAND_INFO.tagline,
        phone: BRAND_INFO.phone,
        whatsapp: BRAND_INFO.whatsappNumber,
        address: BRAND_INFO.address,
        operatingHours: BRAND_INFO.operatingHours,
        deliveryNotice: BRAND_INFO.deliveryNotice,
        upiId: BRAND_INFO.upiId,
        alternateUpiId: BRAND_INFO.alternateUpiId,
        merchantName: BRAND_INFO.merchantName,
      });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header section with theme Modern Industrial Luxury */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold text-[#F47B20] uppercase tracking-wider bg-[#FFF7ED] px-2.5 py-0.5 rounded-full border border-[#F47B20]/20">
              Central Administration
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Supabase Cloud Sync Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#14243A] tracking-tight flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-[#F47B20]" />
            Website & Yard Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update primary dispatch yard address, operating hours, hotline phone numbers, and PhonePe UPI configurations in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 shadow-sm transition-all"
          >
            <Eye className="w-4 h-4 text-slate-400" />
            <span>View Live Website</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="p-1 rounded-full bg-emerald-500 text-white shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="font-bold">Yard Details & Settings Saved Successfully!</p>
            <p className="text-xs text-emerald-700 mt-0.5">
              The physical yard address, operating hours, phone numbers, and payment settings have been saved directly to Supabase and are now live across the homepage, footer, contact section, and checkout.
            </p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Notice</p>
            <p className="text-xs text-amber-700 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* SECTION 1: PRIMARY YARD & DEPOT DETAILS */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] text-[#F47B20] flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#14243A]">
                  1. Dispatch Yard & Depot Details
                </h2>
                <p className="text-xs text-slate-500">
                  Controls the primary warehouse address and working hours shown on website footer, contact section, and logistics receipts.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex text-[11px] font-bold text-[#F47B20] bg-[#FFF7ED] px-3 py-1 rounded-full border border-[#F47B20]/20">
              Live Storefront Sync
            </span>
          </div>

          <div className="space-y-4">
            {/* Primary Yard Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F47B20]" />
                Primary Yard & Depot Address *
              </label>
              <textarea
                required
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Plot No. 42, Outer Ring Road Logistics Junction, Industrial Hub, Hyderabad - 502032"
                className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-[#F8F9FA] border border-slate-200 text-[#20252D] focus:bg-white focus:outline-none focus:border-[#F47B20] focus:ring-2 focus:ring-[#F47B20]/10 transition-all font-medium resize-y"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                This exact yard address is prominently displayed in the website footer, contact page, and delivery manifests.
              </p>
            </div>

            {/* Operating Hours */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#F47B20]" />
                Depot & Weighbridge Operating Hours *
              </label>
              <input
                type="text"
                required
                value={formData.operatingHours}
                onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                placeholder="Mon - Sat: 6:00 AM - 9:00 PM | Sunday: 7:00 AM - 2:00 PM"
                className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-slate-200 text-[#20252D] focus:bg-white focus:outline-none focus:border-[#F47B20] focus:ring-2 focus:ring-[#F47B20]/10 transition-all font-medium"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Working schedule for tipper dispatch and physical site sampling visits.
              </p>
            </div>

            {/* Phone & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#F47B20]" />
                  Central Dispatch Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="9505609865"
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-slate-200 text-[#20252D] focus:bg-white focus:outline-none focus:border-[#F47B20] focus:ring-2 focus:ring-[#F47B20]/10 transition-all font-mono font-bold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Connected to all "Call Dispatch" and "Direct Yard Line" call buttons.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-[#159B68]" />
                  Official WhatsApp Dispatch Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="9505609865"
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-slate-200 text-[#20252D] focus:bg-white focus:outline-none focus:border-[#159B68] focus:ring-2 focus:ring-[#159B68]/10 transition-all font-mono font-bold text-emerald-800"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Receives automated order booking summaries and WhatsApp inquiry chats.
                </p>
              </div>
            </div>

            {/* Business Name & Tagline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Company / Business Name
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-slate-200 text-[#20252D] focus:bg-white focus:outline-none focus:border-[#F47B20] focus:ring-2 focus:ring-[#F47B20]/10 transition-all font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-slate-200 text-[#20252D] focus:bg-white focus:outline-none focus:border-[#F47B20] focus:ring-2 focus:ring-[#F47B20]/10 transition-all"
                />
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 2: DIRECT UPI PAYMENT INTEGRATION */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#14243A]">
                  2. Direct UPI & Token Payment Configuration
                </h2>
                <p className="text-xs text-slate-500">
                  Payments are received 100% directly into your current bank account with zero intermediary gateway commissions.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              0% Gateway Fees
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Primary UPI ID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#F47B20]" />
                  Primary PhonePe / Universal UPI ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  placeholder="kundejayam@axl"
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-slate-200 text-[#F47B20] focus:bg-white focus:outline-none focus:border-[#F47B20] focus:ring-2 focus:ring-[#F47B20]/10 transition-all font-mono font-bold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Works with PhonePe, Google Pay, Paytm, BHIM, Cred, and all mobile banking UPI apps.
                </p>
              </div>

              {/* Alternate UPI ID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Alternate PhonePe UPI ID (Fallback Route)
                </label>
                <input
                  type="text"
                  value={formData.alternateUpiId}
                  onChange={(e) => setFormData({ ...formData, alternateUpiId: e.target.value })}
                  placeholder="kundejayam@ibl"
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-slate-200 text-slate-700 focus:bg-white focus:outline-none focus:border-[#F47B20] focus:ring-2 focus:ring-[#F47B20]/10 transition-all font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Secondary route displayed if the buyer's primary banking server is under maintenance.
                </p>
              </div>
            </div>

            {/* Payee Display Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Payee Display Name on UPI Apps
              </label>
              <input
                type="text"
                value={formData.merchantName}
                onChange={(e) => setFormData({ ...formData, merchantName: e.target.value })}
                placeholder="JAYAM BUILDING MATERIALS"
                className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-slate-200 text-[#20252D] focus:bg-white focus:outline-none focus:border-[#F47B20] focus:ring-2 focus:ring-[#F47B20]/10 transition-all font-semibold"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Appears as verified recipient business name on customer's PhonePe / GPay screen during checkout.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: DELIVERY & LOGISTICS NOTICE */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#14243A]/5 text-[#14243A] flex items-center justify-center font-bold">
                <Truck className="w-5 h-5 text-[#14243A]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#14243A]">
                  3. Delivery & Site Logistics Policy
                </h2>
                <p className="text-xs text-slate-500">
                  Site access requirements and transport charge calculation guidelines.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Customer Delivery Notice
            </label>
            <textarea
              rows={3}
              value={formData.deliveryNotice}
              onChange={(e) => setFormData({ ...formData, deliveryNotice: e.target.value })}
              className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-[#F8F9FA] border border-slate-200 text-[#20252D] focus:bg-white focus:outline-none focus:border-[#F47B20] focus:ring-2 focus:ring-[#F47B20]/10 transition-all resize-y"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Presented on the order confirmation screen and cart checkout step.
            </p>
          </div>
        </div>

        {/* LIVE STOREFRONT PREVIEW CARD */}
        <div className="bg-[#14243A] rounded-2xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F47B20]" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Live Storefront Card Preview
              </span>
            </div>
            <span className="text-[10px] text-slate-400 bg-white/10 px-2.5 py-0.5 rounded-full">
              Real-time Preview
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Yard Address Card */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-[#F47B20] font-bold">
                <MapPin className="w-4 h-4" />
                <span>Primary Depot & Yard</span>
              </div>
              <p className="text-slate-200 font-medium leading-relaxed">
                {formData.address || "No address provided"}
              </p>
              <div className="flex items-center gap-2 text-slate-400 pt-1 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-[#F47B20]" />
                <span>{formData.operatingHours}</span>
              </div>
            </div>

            {/* Dispatch Desk Card */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Phone className="w-4 h-4" />
                <span>Central Dispatch Contacts</span>
              </div>
              <div className="space-y-1 text-slate-200 font-mono">
                <p>Phone: <strong className="text-white">{formData.phone}</strong></p>
                <p>WhatsApp: <strong className="text-emerald-400">{formData.whatsapp}</strong></p>
                <p>UPI ID: <strong className="text-[#F47B20]">{formData.upiId}</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-600 transition-colors"
          >
            Reset to Defaults
          </button>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#F47B20] hover:bg-[#e06912] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#F47B20]/25 transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving to Supabase Database...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Website & Yard Settings</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
