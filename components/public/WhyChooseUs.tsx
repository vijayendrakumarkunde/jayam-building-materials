import React from "react";
import { 
  ShieldCheck, 
  Scale, 
  Truck, 
  BadgePercent, 
  CheckCircle2, 
  Phone
} from "lucide-react";
import { BRAND_INFO } from "@/lib/constants";

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      icon: ShieldCheck,
      title: "Lab-Tested Silt-Free Sand",
      subtitle: "Certified <2.5% Silt Content",
      description: "Our natural river sand is dredged from legal river beds and triple washed to remove organic matter, mud, and dust, ensuring maximum compressive RCC strength.",
    },
    {
      icon: Scale,
      title: "100% Honest Digital Weighing",
      subtitle: "Government-Approved Weighbridge Slip",
      description: "Every lorry and tipper is weighed gross and tare on automated digital weighbridges. A printed digital slip is handed to you on delivery.",
    },
    {
      icon: Truck,
      title: "Dedicated Tipper Fleet",
      subtitle: "Fast Site Unloading & Access",
      description: "Operating our own fleet of 6-wheeler and 10-wheeler hydraulic tippers. Experienced drivers capable of navigating challenging site access roads.",
    },
    {
      icon: BadgePercent,
      title: "Direct Quarry Wholesale Pricing",
      subtitle: "Zero Intermediary Commissions",
      description: "Direct ties with certified granite crushing plants and river concessions provide rock-bottom wholesale prices for builders and individual home owners alike.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange-50 border border-brand-orange-200 text-brand-orange-700 text-xs font-bold uppercase tracking-wider mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange-600" />
            <span>The Jayam Quality Standard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-charcoal tracking-tight">
            Why Top Builders & Engineers Trust Jayam Materials
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Building a home or commercial project is a lifetime investment. We protect your structure with uncompromised quality, verified quantities, and transparent pricing.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-orange-400 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-orange-500/10 border border-brand-orange-500/20 text-brand-orange-600 flex items-center justify-center mb-5 group-hover:bg-brand-orange-500 group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <span className="text-[11px] font-bold text-brand-orange-600 uppercase tracking-wide block mb-1">
                    {item.subtitle}
                  </span>

                  <h3 className="text-lg font-bold text-brand-charcoal mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
                  <span>Quality Guaranteed</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Builder Hotline Strip */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-brand-charcoal text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-brand-charcoal-700 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">
              Require 50+ Tons or Multi-Truck Delivery for Ongoing Projects?
            </h3>
            <p className="text-sm text-slate-400">
              Speak directly with our senior yard supervisor for scheduled batch deliveries and special contractor rates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={BRAND_INFO.telUrl}
              className="px-6 py-3 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-brand-orange-500/20 transition-all"
            >
              <Phone className="w-4 h-4" /> Call: {BRAND_INFO.phoneFormatted}
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
