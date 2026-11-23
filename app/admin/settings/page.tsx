"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, CheckCircle2, Phone, MessageCircle, MapPin, Zap, CreditCard, ShieldCheck } from "lucide-react";
import { BRAND_INFO } from "@/lib/constants";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    businessName: BRAND_INFO.name,
    tagline: BRAND_INFO.tagline,
    phone: BRAND_INFO.phone,
    whatsapp: BRAND_INFO.whatsappNumber,
    address: BRAND_INFO.address,
    operatingHours: BRAND_INFO.operatingHours,
    // Direct UPI Configuration
    upiId: BRAND_INFO.upiId,
    alternateUpiId: BRAND_INFO.alternateUpiId,
    merchantName: BRAND_INFO.merchantName,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("jayam_custom_settings");
      if (stored) {
        setFormData((prev) => ({ ...prev, ...JSON.parse(stored) }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("jayam_custom_settings", JSON.stringify(formData));
    } catch (e) {
      console.error(e);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Website & Payment Settings</h1>
        <p className="text-xs text-slate-400">Configure central contact phone numbers, PhonePe UPI IDs, and advance token deposits</p>
      </div>

      <div className="bg-brand-charcoal-900 rounded-2xl border border-brand-charcoal-800 p-6 sm:p-8">
        {saved && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Settings and UPI configuration saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* GENERAL BRAND & CONTACT INFO */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-orange-400">
              1. Business Contact & Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full text-xs px-4 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full text-xs px-4 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Dispatch Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs px-4 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Official WhatsApp Number (Receives Order Alerts)
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full text-xs px-4 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Primary Yard & Depot Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full text-xs px-4 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Operating Hours
              </label>
              <input
                type="text"
                value={formData.operatingHours}
                onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                className="w-full text-xs px-4 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
              />
            </div>
          </div>

          {/* DIRECT UPI CONFIGURATION SECTION */}
          <div className="pt-6 border-t border-brand-charcoal-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-orange-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-brand-orange-500" />
                <span>2. Direct UPI & Payment Configuration</span>
              </h2>
              <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                0% Gateway Fees • Direct Bank Deposit
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Primary PhonePe / Universal UPI ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  placeholder="e.g. 9505609865@axl"
                  className="w-full text-xs px-4 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-brand-orange-300 font-mono font-bold focus:outline-none focus:border-brand-orange-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Accepts payments from PhonePe, Google Pay, Paytm, BHIM, Cred, and all bank UPI apps.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Alternate PhonePe UPI ID (Fallback)
                </label>
                <input
                  type="text"
                  value={formData.alternateUpiId}
                  onChange={(e) => setFormData({ ...formData, alternateUpiId: e.target.value })}
                  placeholder="e.g. kundejayam@ibl"
                  className="w-full text-xs px-4 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-slate-300 font-mono focus:outline-none focus:border-brand-orange-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Backup UPI ID displayed if buyer's bank route fails.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Payee Display Name on UPI
              </label>
              <input
                type="text"
                value={formData.merchantName}
                onChange={(e) => setFormData({ ...formData, merchantName: e.target.value })}
                className="w-full text-xs px-4 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Shown as recipient business in customer's PhonePe / GPay screen.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-brand-charcoal-800 flex items-center justify-between">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-orange-500/20 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Website & Payment Settings</span>
            </button>

            <span className="text-[11px] text-slate-400">
              You can change your UPI ID at any time.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
