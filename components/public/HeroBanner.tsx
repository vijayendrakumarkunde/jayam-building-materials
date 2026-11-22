import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Scale, 
  Clock, 
  MessageCircle,
  Sparkles
} from "lucide-react";
import { BRAND_INFO } from "@/lib/constants";

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative bg-brand-charcoal overflow-hidden text-white border-b border-brand-charcoal-800">
      {/* Background Graphic Pattern */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      {/* Decorative Gradient Orbs */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-brand-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-brand-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14 text-center">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange-500/15 border border-brand-orange-500/30 text-brand-orange-400 text-xs sm:text-sm font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange-400" />
            <span>Direct-from-Source Heavy Construction Materials</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Everything You Build,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange-400 to-amber-500">
              Starts With Us.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Certified River Sand, VSI M-Sand, 53 Grade Cements, TMT Steel, and 20mm Blue Metal Aggregates. Accurate weighbridge slips and prompt hydraulic tipper delivery to your site.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-row items-center justify-center gap-3 pt-1">
            <a
              href="#category-menu"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-brand-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Explore Materials Menu</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={BRAND_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>WhatsApp Direct</span>
            </a>
          </div>

          {/* Trust Badges Bar */}
          <div className="pt-4 border-t border-brand-charcoal-800 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center">
            <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-brand-charcoal-900/60 border border-brand-charcoal-800">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-orange-400 shrink-0" />
              <div className="text-left">
                <h4 className="text-[11px] font-bold text-white">Triple Washed</h4>
                <p className="text-[9px] text-slate-400">&lt;2.5% Silt River Sand</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-brand-charcoal-900/60 border border-brand-charcoal-800">
              <Scale className="w-3.5 h-3.5 text-brand-orange-400 shrink-0" />
              <div className="text-left">
                <h4 className="text-[11px] font-bold text-white">Digital Slips</h4>
                <p className="text-[9px] text-slate-400">Verified Weighbridge</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-brand-charcoal-900/60 border border-brand-charcoal-800">
              <Truck className="w-3.5 h-3.5 text-brand-orange-400 shrink-0" />
              <div className="text-left">
                <h4 className="text-[11px] font-bold text-white">Own Fleet</h4>
                <p className="text-[9px] text-slate-400">10 & 16-Ton Tippers</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-brand-charcoal-900/60 border border-brand-charcoal-800">
              <Clock className="w-3.5 h-3.5 text-brand-orange-400 shrink-0" />
              <div className="text-left">
                <h4 className="text-[11px] font-bold text-white">Fast Dispatch</h4>
                <p className="text-[9px] text-slate-400">Direct to Your Site</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
