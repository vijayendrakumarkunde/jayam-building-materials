"use client";

import React, { useState } from "react";
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2,
  Building 
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

                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="p-2.5 rounded-xl bg-[#F47B20]/20 text-[#F47B20]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Primary Yard & Depot</span>
                    <span className="text-xs font-semibold text-slate-200">
                      {brand.address}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Map Guide Banner */}
            <div className="p-5 rounded-3xl bg-[#FFF7ED] border border-[#F47B20]/20 text-slate-700 text-xs leading-relaxed space-y-1">
              <span className="font-bold block text-sm text-[#14243A]">Site Inspection & Sample Verification</span>
              <p className="text-slate-600">
                Architects and contractors are welcome to visit our yard to inspect silt settlement tests and aggregate grading in person.
              </p>
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
                      <label className="block text-xs font-bold text-[#14243A] mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 98765 43210"
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#F47B20] focus:ring-1 focus:ring-[#F47B20]"
                      />
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
                        <option>Other Building Materials</option>
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
