"use client";

import React from "react";
import { MessageCircle, Phone, Sparkles, Truck, CheckCircle2 } from "lucide-react";
import { BRAND_INFO } from "@/lib/constants";

export const PromotionalBanner: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative overflow-hidden rounded-3xl bg-[#14243A] text-white p-8 sm:p-12 border border-[#14243A] shadow-2xl">
          
          {/* Subtle Orange Glow Graphic */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#F47B20]/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F47B20]/20 text-[#FB923C] text-xs font-bold uppercase tracking-wider border border-[#F47B20]/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Special Contractor & Bulk Supply Scheme</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                Pouring Concrete Slabs or Constructing Foundations This Week?
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Book combination loads of <strong className="text-white">River Sand + 20mm Blue Metal + 53 Grade Cement</strong> in a single dispatch schedule. Enjoy dedicated tipper dispatch windows and consolidated logistics coordination.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-[#F47B20]"></span>
                  <span>Batch Delivery Priority</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-[#159B68]"></span>
                  <span>Weighbridge Slip Transparency</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-[#F47B20]"></span>
                  <span>Direct Site Hydraulic Unloading</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <a
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#159B68] hover:bg-[#108055] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#159B68]/30 transition-all transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire on WhatsApp</span>
              </a>

              <a
                href={BRAND_INFO.telUrl}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#1F334E] hover:bg-[#284266] text-white border border-slate-700 font-bold text-xs sm:text-sm transition-all"
              >
                <Phone className="w-4 h-4 text-[#F47B20]" />
                <span>Call Hotline ({BRAND_INFO.phone})</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
