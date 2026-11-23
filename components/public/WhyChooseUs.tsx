"use client";

import React from "react";
import { 
  ShieldCheck, 
  Scale, 
  Truck, 
  BadgePercent, 
  CheckCircle2, 
  Phone
} from "lucide-react";
import { useBrandSettings } from "@/lib/utils/settingsStore";

export const WhyChooseUs: React.FC = () => {
  const brand = useBrandSettings();
  const points = [
    {
      icon: ShieldCheck,
      title: "Lab-Tested Silt-Free Sand",
      subtitle: "Certified <2.5% Silt Content",
      description: "Our natural river sand is dredged from legal river beds and triple washed to remove organic matter, mud, and dust, ensuring maximum compressive RCC strength.",
      color: "text-[#F47B20]",
      bg: "bg-[#FFF7ED]",
    },
    {
      icon: Scale,
      title: "100% Honest Digital Weighing",
      subtitle: "Government-Approved Weighbridge Slip",
      description: "Every lorry and tipper is weighed gross and tare on automated digital weighbridges. A printed digital slip is handed to you on delivery.",
      color: "text-[#159B68]",
      bg: "bg-[#E8F7F0]",
    },
    {
      icon: Truck,
      title: "Dedicated Tipper Fleet",
      subtitle: "Fast Site Unloading & Access",
      description: "Operating our own fleet of 10-wheeler and 16-ton hydraulic tippers. Experienced drivers capable of navigating challenging site access roads.",
      color: "text-[#14243A]",
      bg: "bg-[#F0F4F8]",
    },
    {
      icon: BadgePercent,
      title: "Direct Quarry Wholesale Pricing",
      subtitle: "Zero Intermediary Commissions",
      description: "Direct ties with certified granite crushing plants and river concessions provide rock-bottom wholesale prices for builders and individual home owners alike.",
      color: "text-[#F47B20]",
      bg: "bg-[#FFF7ED]",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#F5F6F8] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#F47B20]/30 text-[#F47B20] text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#F47B20]" />
            <span>The Jayam Quality Standard</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#14243A] tracking-tight">
            Why Top Builders & Engineers Trust Jayam Materials
          </h2>
          <p className="mt-3 text-xs sm:text-base text-slate-600 leading-relaxed">
            Building a home or commercial project is a lifetime investment. We protect your structure with uncompromised quality, verified quantities, and transparent pricing.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-[#F47B20]/40 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <span className="text-[11px] font-bold text-[#F47B20] uppercase tracking-wide block mb-1">
                    {item.subtitle}
                  </span>

                  <h3 className="text-base sm:text-lg font-black text-[#14243A] mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#159B68] mr-1.5 shrink-0" />
                  <span>Verified & Assured</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Builder Hotline Strip in Modern Deep Navy */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#14243A] text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-[#14243A] shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg sm:text-2xl font-black tracking-tight">
              Require 50+ Tons or Multi-Truck Delivery for Ongoing Projects?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Speak directly with our senior yard supervisor for scheduled batch deliveries and special contractor rates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={brand.telUrl}
              className="px-6 py-3.5 rounded-xl bg-[#F47B20] hover:bg-[#DC630D] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#F47B20]/25 transition-all transform hover:-translate-y-0.5"
            >
              <Phone className="w-4 h-4" /> Call Hotline: {brand.phoneFormatted}
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
