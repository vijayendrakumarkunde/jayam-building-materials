"use client";

import React from "react";
import { 
  ShieldCheck, 
  Truck, 
  Scale, 
  Clock, 
  Sparkles
} from "lucide-react";

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative bg-[#F5F6F8] overflow-hidden border-b border-slate-200">
      {/* Background Architectural Subtle Pattern */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      {/* Subtle Warm Accent Ambient Orbs */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-[#F47B20]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-[#14243A]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14">
        <div className="space-y-6 text-left">
          
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
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed font-normal">
            Direct-from-quarry certified <strong className="text-[#14243A] font-semibold">River Sand</strong>, <strong className="text-[#14243A] font-semibold">VSI M-Sand</strong>, <strong className="text-[#14243A] font-semibold">53 Grade Cement</strong>, <strong className="text-[#14243A] font-semibold">TMT Steel</strong>, and <strong className="text-[#14243A] font-semibold">20mm Blue Metal Aggregates</strong>. 100% digital weighbridge slips and prompt hydraulic tipper delivery directly to your job site.
          </p>

          {/* Trust Indicators and Service Benefits Grid */}
          <div className="pt-6 border-t border-slate-200/90 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-[#FFF7ED] text-[#F47B20] flex items-center justify-center mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#14243A]">Triple Washed</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">&lt;2.5% Silt River Sand</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-[#E8F7F0] text-[#159B68] flex items-center justify-center mb-2">
                <Scale className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#14243A]">Digital Slips</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">100% Verified Weight</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-[#F0F4F8] text-[#14243A] flex items-center justify-center mb-2">
                <Truck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#14243A]">Dedicated Fleet</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">10 & 16-Ton Tippers</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-[#FFF7ED] text-[#F47B20] flex items-center justify-center mb-2">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#14243A]">Fast Dispatch</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Direct to Your Site</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
