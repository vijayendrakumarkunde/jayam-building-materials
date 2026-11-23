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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline & Direct CTAs */}
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange-500/15 border border-brand-orange-500/30 text-brand-orange-400 text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-brand-orange-400" />
              <span>Direct-from-Source Heavy Construction Materials</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Everything You Build,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange-400 to-amber-500">
                Starts With Us.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Certified River Sand, VSI M-Sand, 53 Grade Cements, TMT Steel, and 20mm Blue Metal Aggregates. Accurate weighbridge slips and prompt hydraulic tipper delivery directly to your site.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#category-menu"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold text-sm shadow-xl shadow-brand-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explore Materials Menu</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>WhatsApp Direct</span>
              </a>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-6 border-t border-brand-charcoal-800 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-left">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-brand-charcoal-900/60 border border-brand-charcoal-800">
                <ShieldCheck className="w-4 h-4 text-brand-orange-400 shrink-0" />
                <div>
                  <h4 className="text-[11px] font-bold text-white">Triple Washed</h4>
                  <p className="text-[9px] text-slate-400">&lt;2.5% Silt Sand</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-brand-charcoal-900/60 border border-brand-charcoal-800">
                <Scale className="w-4 h-4 text-brand-orange-400 shrink-0" />
                <div>
                  <h4 className="text-[11px] font-bold text-white">Digital Slips</h4>
                  <p className="text-[9px] text-slate-400">Printed Weight</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-brand-charcoal-900/60 border border-brand-charcoal-800">
                <Truck className="w-4 h-4 text-brand-orange-400 shrink-0" />
                <div>
                  <h4 className="text-[11px] font-bold text-white">Own Fleet</h4>
                  <p className="text-[9px] text-slate-400">10 & 16-Ton Tippers</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-brand-charcoal-900/60 border border-brand-charcoal-800">
                <Clock className="w-4 h-4 text-brand-orange-400 shrink-0" />
                <div>
                  <h4 className="text-[11px] font-bold text-white">Fast Dispatch</h4>
                  <p className="text-[9px] text-slate-400">Direct to Site</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-700/60 group">
              <img
                src="/images/hero/jayam-construction-hero.jpg"
                alt="Jayam Building Materials Construction Site & Heavy Supply Operations"
                className="w-full h-[280px] sm:h-[360px] lg:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal-950/85 via-transparent to-transparent pointer-events-none"></div>

              {/* Floating Live Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-brand-charcoal-900/90 backdrop-blur-md border border-slate-700 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange-400 block">Jayam Supply Fleet</span>
                  <p className="text-xs font-semibold text-slate-200">Active Daily Deliveries Across Telangana & AP</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Live Dispatch</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
