import React from "react";
import { Truck, Info, PhoneCall, ShieldAlert } from "lucide-react";
import { BRAND_INFO } from "@/lib/constants";

export const DeliveryNoticeBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-brand-orange-500/10 to-amber-500/10 border-y border-amber-200/80 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-brand-orange-700 shrink-0 mt-0.5">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-brand-charcoal flex items-center gap-1.5">
              <span>Transparent Delivery & Transport Policy</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                Direct Yard Logistics
              </span>
            </h4>
            <p className="text-xs text-slate-700 mt-0.5 max-w-3xl leading-relaxed">
              We do not add hidden automated delivery fees. Transport charges depend on your delivery site distance, road approach, and unloading requirements (Tipper vs. Manual). Our logistics desk confirms vehicle arrangements before dispatch.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <a
            href={BRAND_INFO.telUrl}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-charcoal hover:text-brand-orange-600 bg-white border border-slate-300 px-3.5 py-2 rounded-lg shadow-sm hover:border-brand-orange-400 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-brand-orange-500" />
            <span>Confirm Transport: {BRAND_INFO.phoneFormatted}</span>
          </a>
        </div>

      </div>
    </div>
  );
};
