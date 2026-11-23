"use client";

import React from "react";
import { 
  Truck, 
  Scale, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  PhoneCall
} from "lucide-react";
import { useBrandSettings } from "@/lib/utils/settingsStore";

export const DeliveryLogisticsSection: React.FC = () => {
  const brand = useBrandSettings();
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF7ED] border border-[#F47B20]/30 text-[#F47B20] text-xs font-bold uppercase tracking-wider mb-2">
              <Truck className="w-3.5 h-3.5 text-[#F47B20]" />
              <span>Direct-to-Site Logistics Fleet</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#14243A] tracking-tight">
              Heavy Material Logistics & Digital Weighbridge Delivery
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            No middleman brokers or unverified truck loads. We own our relationships with quarries and run verified hydraulic tippers directly to your site.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Original AI Transportation Photograph */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-[#F5F6F8] group">
              <img
                src="/images/products/tipper-truck-sand.jpg"
                alt="Jayam Heavy-Duty Hydraulic Tipper Truck Transporting River Sand"
                className="w-full h-[320px] sm:h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14243A]/85 via-transparent to-transparent pointer-events-none"></div>

              {/* Floating Stat Card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 text-[#14243A] flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-[10px] font-bold text-[#F47B20] uppercase tracking-wider block">Vehicle Fleet</span>
                  <p className="text-xs sm:text-sm font-extrabold text-[#14243A]">10-Wheeler & 16-Ton Hydraulic Tippers</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Dual-piston hydraulic tipping for clean site discharge</p>
                </div>
                <div className="hidden sm:flex flex-col items-end shrink-0 pl-2">
                  <span className="text-sm font-black text-[#159B68]">100% Honest</span>
                  <span className="text-[10px] text-slate-500">Tare & Gross Slip</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Logistics Benefits & Steps */}
          <div className="lg:col-span-6 space-y-5">
            
            <div className="p-5 rounded-2xl bg-[#F5F6F8] border border-slate-200/90 hover:border-[#F47B20]/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white text-[#F47B20] shadow-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                  <Scale className="w-5 h-5 text-[#F47B20]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#14243A]">Digital Automated Weighbridge Slips</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Zero guesswork or manual tallying. Every tipper lorry stops at government-certified digital weighbridges. You receive a printed slip stating gross weight, empty truck tare weight, and net material payload.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F5F6F8] border border-slate-200/90 hover:border-[#F47B20]/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white text-[#14243A] shadow-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                  <MapPin className="w-5 h-5 text-[#14243A]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#14243A]">Precision On-Site Hydraulic Tipping</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Our seasoned drivers are trained to navigate tight residential plots and tricky construction approaches. Power hydraulic tipping dumps materials exactly where your mixer needs them.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F5F6F8] border border-slate-200/90 hover:border-[#F47B20]/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white text-[#159B68] shadow-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                  <Clock className="w-5 h-5 text-[#159B68]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#14243A]">Concrete Slab & Casting Schedule Priority</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Pouring a roof slab this week? Reserve timed morning dispatch windows for River Sand, 20mm Blue Metal, and 53 Grade Cement so your labor never waits on site.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={brand.telUrl}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#14243A] hover:bg-[#20252D] text-white text-xs sm:text-sm font-bold shadow-md transition-all"
              >
                <PhoneCall className="w-4 h-4 text-[#F47B20]" />
                <span>Call Fleet Supervisor ({brand.phone})</span>
              </a>

              <a
                href="/track-order"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#F47B20] hover:text-[#DC630D] transition-colors"
              >
                <span>Track Live Dispatch Status</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
