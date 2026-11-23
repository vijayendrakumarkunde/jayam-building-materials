"use client";

import React from "react";
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Scale, 
  Clock, 
  MessageCircle, 
  Sparkles,
  CheckCircle2,
  PhoneCall
} from "lucide-react";
import { useBrandSettings } from "@/lib/utils/settingsStore";

export const HeroBanner: React.FC = () => {
  const brand = useBrandSettings();
  return (
    <section className="relative bg-[#F5F6F8] overflow-hidden border-b border-slate-200">
      {/* Background Architectural Subtle Pattern */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      {/* Subtle Warm Accent Ambient Orbs */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-[#F47B20]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-[#14243A]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Trust & Direct Action */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#F47B20]/30 shadow-xs text-[#F47B20] text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#F47B20]" />
              <span>Direct-from-Source Heavy Construction Materials</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#14243A] leading-[1.12]">
              Everything You Build,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47B20] to-[#DC630D]">
                Starts With Us.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed font-normal">
              Direct-from-quarry certified <strong className="text-[#14243A] font-semibold">River Sand</strong>, <strong className="text-[#14243A] font-semibold">VSI M-Sand</strong>, <strong className="text-[#14243A] font-semibold">53 Grade Cement</strong>, <strong className="text-[#14243A] font-semibold">TMT Steel</strong>, and <strong className="text-[#14243A] font-semibold">20mm Blue Metal Aggregates</strong>. 100% digital weighbridge slips and prompt hydraulic tipper delivery directly to your job site.
            </p>

            {/* Clear Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <a
                href="#catalog-section"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#F47B20] hover:bg-[#DC630D] text-white font-bold text-sm shadow-lg shadow-[#F47B20]/25 hover:shadow-xl hover:shadow-[#F47B20]/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explore Materials</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={brand.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#159B68] hover:bg-[#108055] text-white font-bold text-sm shadow-md shadow-[#159B68]/20 transition-all transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>WhatsApp Direct</span>
              </a>

              <a
                href={brand.telUrl}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm border border-slate-300 transition-all"
              >
                <PhoneCall className="w-4 h-4 text-[#F47B20]" />
                <span>Call Hotline</span>
              </a>
            </div>

            {/* Trust Indicators and Service Benefits Grid */}
            <div className="pt-6 border-t border-slate-200/90 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-[#FFF7ED] text-[#F47B20] flex items-center justify-center mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#14243A]">Triple Washed</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">&lt;2.5% Silt River Sand</p>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-[#E8F7F0] text-[#159B68] flex items-center justify-center mb-2">
                  <Scale className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#14243A]">Digital Slips</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">100% Verified Weight</p>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-[#F0F4F8] text-[#14243A] flex items-center justify-center mb-2">
                  <Truck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#14243A]">Dedicated Fleet</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">10 & 16-Ton Tippers</p>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-[#FFF7ED] text-[#F47B20] flex items-center justify-center mb-2">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#14243A]">Fast Dispatch</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Direct to Your Site</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase with Original AI Construction Site Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white group bg-slate-100">
              <img
                src="/images/hero/jayam-construction-hero.jpg"
                alt="Jayam Building Materials Active Construction Project Supply"
                className="w-full h-[320px] sm:h-[400px] lg:h-[460px] object-cover group-hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14243A]/90 via-[#14243A]/20 to-transparent pointer-events-none"></div>

              {/* Floating Bottom Info Card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg text-[#14243A] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#159B68] animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#F47B20]">Fleet Dispatch Active</span>
                  </div>
                  <p className="text-xs sm:text-sm font-extrabold text-[#14243A] mt-0.5">
                    Daily Material Delivery to Sites
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Hyderabad • Secunderabad • Medchal • Ranga Reddy
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-black text-[#F47B20]">48,000+</span>
                  <span className="text-[10px] font-semibold text-slate-600">Tons Delivered</span>
                </div>
              </div>
            </div>

            {/* Decorative Corner Badge */}
            <div className="hidden sm:flex absolute -top-3 -right-3 w-16 h-16 rounded-2xl bg-white p-2 items-center justify-center shadow-xl rotate-3 border border-slate-200">
              <img src="/images/logo-icon.png" alt="Jayam Icon" className="w-full h-full object-contain" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
