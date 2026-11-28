"use client";

import React, { useState } from "react";
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2,
  Building,
  Navigation,
  ExternalLink
} from "lucide-react";
import { useBrandSettings } from "@/lib/utils/settingsStore";

export const ContactSection: React.FC = () => {
  const brand = useBrandSettings();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    material: "River Sand (Triple Washed)",
    siteLocation: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hello Jayam Building Materials,\nName: ${formData.name}\nPhone: ${formData.phone}\nRequired Material: ${formData.material}\nSite Location: ${formData.siteLocation}\nDetails: ${formData.message}`
    );
    window.open(`https://wa.me/91${brand.whatsappNumber}?text=${text}`, "_blank");
    setFormSubmitted(true);
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF7ED] border border-[#F47B20]/30 text-[#F47B20] text-xs font-bold uppercase tracking-wider mb-2">
            <Building className="w-3.5 h-3.5" />
            <span>Dispatch Yard & Office</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#14243A] tracking-tight">
            Get In Touch With Our Dispatch Team
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Have questions regarding sand silt tests, tipper availability, or delivery routes? Reach us directly via phone, WhatsApp, or submit your site delivery request below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Direct Contact Details in Deep Navy (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 sm:p-7 rounded-3xl bg-[#14243A] text-white space-y-5 border border-[#14243A] shadow-xl">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>Direct Contact Information</span>
              </h3>

              <div className="space-y-3.5 text-sm">
                <a
                  href={brand.telUrl}
                  className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
                >
                  <div className="p-2.5 rounded-xl bg-[#F47B20]/20 text-[#F47B20] group-hover:bg-[#F47B20] group-hover:text-white transition-all">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Direct Yard Dispatch Line</span>
                    <span className="text-base font-bold text-white group-hover:text-[#F47B20] transition-colors">
                      {brand.phoneFormatted}
                    </span>
                  </div>
                </a>

                <a
                  href={brand.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
                >
                  <div className="p-2.5 rounded-xl bg-[#159B68]/20 text-[#159B68] group-hover:bg-[#159B68] group-hover:text-white transition-all">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Official WhatsApp Booking</span>
                    <span className="text-base font-bold text-emerald-400">
                      +91 {brand.whatsappNumber}
                    </span>
                  </div>
                </a>

                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="p-2.5 rounded-xl bg-[#F47B20]/20 text-[#F47B20]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Dispatch Operations Hours</span>
                    <span className="text-xs font-semibold text-slate-200">
                      {brand.operatingHours}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-[#F47B20]/20 text-[#F47B20] shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block font-medium">Primary Dumping Yard & Depot</span>
                      <span className="text-xs font-semibold text-slate-200 leading-relaxed block">
                        {brand.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Interactive Dumping Yard Map Image Card */}
            <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-lg hover:shadow-xl transition-all">
              {/* Map Card Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#EA4335]/10 text-[#EA4335] flex items-center justify-center font-bold">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#14243A]">Dumping Yard Map Location</h4>
                    <p className="text-[11px] text-slate-500">LB Nagar Metro · Beside Vasavi Ananda Nilayam</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#E8F0FE] text-[#1967D2] text-[10px] font-bold tracking-wide">
                  Live GPS Pin
                </span>
              </div>

              {/* Clickable Map-like Image */}
              <a
                href={brand.dumpingYardMapsUrl || "https://maps.app.goo.gl/whYExk6fkqk9Bj1B7"}
                target="_blank"
                rel="noopener noreferrer"
                title="Click to open Jayam Dumping Yard in Google Maps"
                className="relative block group overflow-hidden bg-slate-100"
              >
                <img
                  src="/images/maps/dumping-yard-map.svg"
                  alt="Jayam Dumping Yard Map Location near LB Nagar Metro Station and Vasavi Ananda Nilayam"
                  className="w-full h-[220px] sm:h-[260px] object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  loading="lazy"
                />

                {/* Hover Action Overlay Pill */}
                <div className="absolute inset-0 bg-[#14243A]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <div className="px-4 py-2 rounded-xl bg-[#14243A] text-white text-xs font-bold shadow-xl border border-[#F47B20] flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5 text-[#F47B20]" />
                    <span>Open in Google Maps ↗</span>
                  </div>
                </div>
              </a>

              {/* Map Card Footer Note */}
              <div className="p-3.5 bg-white text-[11px] text-slate-600 flex items-center justify-between border-t border-slate-100">
                <span>Direct tipper logistics & on-site inspection</span>
                <span className="font-bold text-[#F47B20]">Tap map to navigate ↗</span>
              </div>
            </div>

          </div>

          {/* Right Column: Quick Request Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#F5F6F8] rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <h3 className="text-xl font-black text-[#14243A] mb-1">
                Request Material Rate & Availability
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Fill this quick form and our dispatch coordinator will respond via phone or WhatsApp within 15 minutes.
              </p>

              {formSubmitted ? (
                <div className="p-6 rounded-2xl bg-[#E8F7F0] border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#159B68] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#14243A]">Inquiry Sent Successfully!</h4>
                  <p className="text-xs text-slate-600">
                    Our team is reviewing your requirements. You will receive a direct confirmation on WhatsApp shortly.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="text-xs font-bold text-[#159B68] underline mt-2"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#14243A] mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#F47B20] focus:ring-1 focus:ring-[#F47B20]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-[#14243A]">
                          Mobile Number *
                        </label>
                        <span className={`text-[10px] font-semibold ${formData.phone.length === 10 ? "text-emerald-600" : "text-slate-400"}`}>
                          {formData.phone.length}/10 digits
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
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                          placeholder="Enter 10-digit number"
                          className="w-full text-sm pl-16 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#F47B20] focus:ring-1 focus:ring-[#F47B20] tracking-wider"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#14243A] mb-1">
                        Material Required
                      </label>
                      <select
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#F47B20]"
                      >
                        <option>River Sand (Triple Washed)</option>
                        <option>M-Sand (VSI Concrete)</option>
                        <option>Plastering Sand (P-Sand)</option>
                        <option>53 Grade Cement</option>
                        <option>Fe 550D TMT Steel</option>
                        <option>Red Clay Bricks</option>
                        <option>20mm Blue Metal Aggregates</option>
                        <option>40mm Foundation Aggregate</option>
                        <option>Natural Red Soil & Earth</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#14243A] mb-1">
                        Delivery Site Area / Landmark *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.siteLocation}
                        onChange={(e) => setFormData({ ...formData, siteLocation: e.target.value })}
                        placeholder="e.g. Madhapur, Near Metro Pillar 14"
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#F47B20] focus:ring-1 focus:ring-[#F47B20]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#14243A] mb-1">
                      Estimated Quantity or Special Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. Need 2 tippers (32 tons) of River Sand and 100 bags of OPC cement for slab casting on Thursday."
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#F47B20]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-[#F47B20] hover:bg-[#DC630D] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#F47B20]/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry to Dispatch Desk</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
