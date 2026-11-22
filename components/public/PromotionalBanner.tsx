import React from "react";
import Link from "next/link";
import { MessageCircle, Phone, Sparkles, Building, ArrowRight } from "lucide-react";
import { BRAND_INFO } from "@/lib/constants";

export const PromotionalBanner: React.FC = () => {
  return (
    <section className="py-12 bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-charcoal-950 via-brand-charcoal-900 to-brand-charcoal-800 text-white p-8 sm:p-12 border border-brand-charcoal-700 shadow-2xl">
          
          {/* Subtle Orange Glow Graphic */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange-500/20 text-brand-orange-400 text-xs font-bold uppercase tracking-wider border border-brand-orange-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Special Contractor & Bulk Supply Scheme</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Pouring Concrete Slabs or Constructing Foundations This Week?
              </h3>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Book combination loads of <strong>River Sand + 20mm Blue Metal + 53 Grade Cement</strong> in a single dispatch schedule. Enjoy dedicated tipper dispatch windows and consolidated logistics coordination.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-brand-orange-500"></span>
                  <span>Batch Delivery Priority</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-brand-orange-500"></span>
                  <span>Weighbridge Slip Transparency</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-brand-orange-500"></span>
                  <span>Direct Site Unloading</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5">
              <a
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire on WhatsApp</span>
              </a>

              <a
                href={BRAND_INFO.telUrl}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-brand-charcoal-800 hover:bg-brand-charcoal-700 text-white border border-brand-charcoal-600 font-bold text-sm transition-all"
              >
                <Phone className="w-4 h-4 text-brand-orange-400" />
                <span>Call Hotline ({BRAND_INFO.phone})</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
