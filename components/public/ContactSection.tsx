"use client";

import React, { useState } from "react";
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2 
} from "lucide-react";
import { BRAND_INFO } from "@/lib/constants";

export const ContactSection: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    material: "River Sand",
    siteLocation: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pre-fill WhatsApp message as a fallback or instant response
    const text = encodeURIComponent(
      `Hello Jayam Building Materials,\nName: ${formData.name}\nPhone: ${formData.phone}\nRequired Material: ${formData.material}\nSite Location: ${formData.siteLocation}\nDetails: ${formData.message}`
    );
    window.open(`https://wa.me/91${BRAND_INFO.whatsappNumber}?text=${text}`, "_blank");
    setFormSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-brand-orange-600 uppercase tracking-widest block mb-1">
            Dispatch Yard & Office
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-charcoal">
            Get In Touch With Our Dispatch Team
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Have questions regarding sand silt tests, tipper availability, or delivery routes? Reach us directly via phone, WhatsApp, or through the site dispatch request form.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 rounded-2xl bg-brand-charcoal text-white space-y-5 border border-brand-charcoal-700 shadow-xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Direct Contact Information</span>
              </h3>

              <div className="space-y-4 text-sm">
                <a
                  href={BRAND_INFO.telUrl}
                  className="flex items-start gap-3.5 p-3 rounded-xl bg-brand-charcoal-800 hover:bg-brand-charcoal-700 transition-colors group"
                >
                  <div className="p-2.5 rounded-lg bg-brand-orange-500/20 text-brand-orange-400 group-hover:bg-brand-orange-500 group-hover:text-white transition-all">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Direct Yard Dispatch Line</span>
                    <span className="text-base font-bold text-white group-hover:text-brand-orange-400">
                      {BRAND_INFO.phoneFormatted}
                    </span>
                  </div>
                </a>

                <a
                  href={BRAND_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 p-3 rounded-xl bg-brand-charcoal-800 hover:bg-brand-charcoal-700 transition-colors group"
                >
                  <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Official WhatsApp Booking</span>
                    <span className="text-base font-bold text-emerald-400">
                      +91 {BRAND_INFO.whatsappNumber}
                    </span>
                  </div>
                </a>

                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-brand-charcoal-800">
                  <div className="p-2.5 rounded-lg bg-brand-orange-500/20 text-brand-orange-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Dispatch Operations Hours</span>
                    <span className="text-xs font-semibold text-slate-200">
                      {BRAND_INFO.operatingHours}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-brand-charcoal-800">
                  <div className="p-2.5 rounded-lg bg-brand-orange-500/20 text-brand-orange-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Primary Yard & Depot</span>
                    <span className="text-xs font-semibold text-slate-200">
                      {BRAND_INFO.address}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Map Guide Banner */}
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-1">
              <span className="font-bold block text-sm text-amber-950">Site Inspection & Sample Verification</span>
              <p>
                Architects and contractors are welcome to visit our yard to inspect silt settlement tests and aggregate grading in person.
              </p>
            </div>

          </div>

          {/* Right Column: Quick Request Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-brand-charcoal mb-2">
                Request Quick Material Rate & Availability
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Fill this quick form and our dispatch coordinator will respond via phone or WhatsApp within 15 minutes.
              </p>

              {formSubmitted ? (
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-emerald-900">Inquiry Sent Successfully!</h4>
                  <p className="text-xs text-emerald-700">
                    Our team is reviewing your requirements. You will receive a direct confirmation on WhatsApp shortly.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="text-xs font-bold text-emerald-800 underline mt-2"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-brand-orange-500 focus:ring-1 focus:ring-brand-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 98765 43210"
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-brand-orange-500 focus:ring-1 focus:ring-brand-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Material Required
                      </label>
                      <select
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-brand-orange-500"
                      >
                        <option>River Sand (Triple Washed)</option>
                        <option>M-Sand (VSI Concrete)</option>
                        <option>Plastering Sand (P-Sand)</option>
                        <option>53 Grade Cement</option>
                        <option>Fe 550D TMT Steel</option>
                        <option>Red Clay Bricks</option>
                        <option>20mm Blue Metal Aggregates</option>
                        <option>Drainage Gravel</option>
                        <option>Other Building Materials</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Delivery Site Area / Landmark *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.siteLocation}
                        onChange={(e) => setFormData({ ...formData, siteLocation: e.target.value })}
                        placeholder="e.g. Madhapur, Near Metro Pillar 14"
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-brand-orange-500 focus:ring-1 focus:ring-brand-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Estimated Quantity or Special Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. Need 2 tippers (32 tons) of River Sand and 100 bags of OPC cement for slab casting on Thursday."
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-brand-orange-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold text-sm shadow-lg shadow-brand-orange-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
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
