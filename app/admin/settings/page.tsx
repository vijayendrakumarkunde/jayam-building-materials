"use client";

import React, { useState } from "react";
import { Settings, Save, CheckCircle2, Phone, MessageCircle, MapPin } from "lucide-react";
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
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Website & Yard Settings</h1>
        <p className="text-xs text-slate-400">Configure central contact phone numbers, operating hours, and tagline</p>
      </div>

      <div className="bg-brand-charcoal-900 rounded-2xl border border-brand-charcoal-800 p-6 sm:p-8">
        {saved && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Settings updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                Official WhatsApp Number
              </label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full text-xs px-4 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
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

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Website Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
