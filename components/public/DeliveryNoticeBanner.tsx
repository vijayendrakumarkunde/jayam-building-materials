"use client";

import React from "react";
import { Truck, PhoneCall } from "lucide-react";
import { useBrandSettings } from "@/lib/utils/settingsStore";

export const DeliveryNoticeBanner: React.FC = () => {
  const brand = useBrandSettings();
  return (
    <div className="bg-[#FFF7ED] border-y border-[#F47B20]/25 py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#F47B20]/15 text-[#F47B20] shrink-0 mt-0.5">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-[#14243A] flex items-center gap-2">
              <span>Transparent Delivery & Direct Transport Policy</span>
              <span className="text-[10px] bg-white text-[#F47B20] font-extrabold px-2.5 py-0.5 rounded-full border border-[#F47B20]/30 shadow-xs">
                Direct Yard Logistics
              </span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5 max-w-3xl leading-relaxed">
              We do not add hidden automated delivery fees. Transport charges depend on your delivery site distance, road approach, and unloading requirements (Tipper vs. Manual). Our logistics desk confirms vehicle arrangements before dispatch.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <a
            href={brand.telUrl}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14243A] hover:text-[#F47B20] bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs hover:border-[#F47B20]/50 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#F47B20]" />
            <span>Confirm Transport: {brand.phoneFormatted}</span>
          </a>
        </div>

      </div>
    </div>
  );
};
