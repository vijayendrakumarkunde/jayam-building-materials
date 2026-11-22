import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Scale, 
  Clock, 
  MessageCircle,
  HardHat,
  Sparkles
} from "lucide-react";
import { BRAND_INFO } from "@/lib/constants";

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative bg-brand-charcoal overflow-hidden text-white border-b border-brand-charcoal-800">
      {/* Background Graphic Pattern & Construction Accent */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      {/* Decorative Gradient Orbs */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-brand-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-brand-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange-500/15 border border-brand-orange-500/30 text-brand-orange-400 text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-brand-orange-400" />
              <span>Direct-from-Source Heavy Construction Materials</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Everything You Build, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange-400 to-amber-500">
                Starts With Us.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Order certified River Sand, VSI-crushed M-Sand, Grade 53 Cements, and Primary Fe 550D TMT Steel. Direct quarry loading, accurate digital weighbridge slips, and prompt hydraulic tipper delivery directly to your building site.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold text-base shadow-xl shadow-brand-orange-500/25 hover:shadow-brand-orange-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Browse Materials Catalogue</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-brand-charcoal-800 hover:bg-brand-charcoal-700 text-emerald-400 border border-brand-charcoal-700 font-semibold text-base transition-all transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span>WhatsApp Instant Booking</span>
              </a>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-6 border-t border-brand-charcoal-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-brand-charcoal-800 border border-brand-charcoal-700 text-brand-orange-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Triple Washed</h4>
                  <p className="text-[11px] text-slate-400">&lt;2.5% Silt River Sand</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-brand-charcoal-800 border border-brand-charcoal-700 text-brand-orange-400">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Accurate Weight</h4>
                  <p className="text-[11px] text-slate-400">Digital Weighbridge Slip</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-brand-charcoal-800 border border-brand-charcoal-700 text-brand-orange-400">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Own Fleet</h4>
                  <p className="text-[11px] text-slate-400">10 & 16-Ton Tippers</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-brand-charcoal-800 border border-brand-charcoal-700 text-brand-orange-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Fast Dispatch</h4>
                  <p className="text-[11px] text-slate-400">Scheduled Site Delivery</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Highlight Visual Card (Right 5 Cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl p-1 bg-gradient-to-b from-brand-orange-500/40 via-brand-charcoal-700 to-brand-charcoal-800 shadow-2xl">
              <div className="bg-brand-charcoal-900 rounded-[14px] p-6 space-y-5 border border-brand-charcoal-700/60">
                
                {/* Header of Quick Dispatch Box */}
                <div className="flex items-center justify-between pb-4 border-b border-brand-charcoal-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Live Yard Dispatch Status
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Stock Ready
                  </span>
                </div>

                {/* Popular Stock Highlights */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-brand-charcoal-800/60 border border-brand-charcoal-700 hover:border-brand-orange-500/50 transition-colors">
                    <div>
                      <h4 className="text-sm font-bold text-white">River Sand (Grade A)</h4>
                      <p className="text-xs text-slate-400">Natural Riverbed • Silt Free</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-brand-orange-400">₹1,850</span>
                      <span className="text-[10px] text-slate-400 block">/ Ton</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-brand-charcoal-800/60 border border-brand-charcoal-700 hover:border-brand-orange-500/50 transition-colors">
                    <div>
                      <h4 className="text-sm font-bold text-white">VSI M-Sand (Concrete)</h4>
                      <p className="text-xs text-slate-400">IS 383 Zone II Compliant</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-brand-orange-400">₹1,100</span>
                      <span className="text-[10px] text-slate-400 block">/ Ton</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-brand-charcoal-800/60 border border-brand-charcoal-700 hover:border-brand-orange-500/50 transition-colors">
                    <div>
                      <h4 className="text-sm font-bold text-white">53 Grade OPC Cement</h4>
                      <p className="text-xs text-slate-400">Top Brands (UltraTech / ACC)</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-brand-orange-400">₹395</span>
                      <span className="text-[10px] text-slate-400 block">/ 50kg Bag</span>
                    </div>
                  </div>
                </div>

                {/* Direct Hotline Box */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-brand-orange-900/40 to-brand-charcoal-800 border border-brand-orange-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-brand-orange-300 uppercase tracking-wide">
                        Bulk Site Inquiry Hotline
                      </p>
                      <p className="text-base font-extrabold text-white mt-0.5">
                        {BRAND_INFO.phoneFormatted}
                      </p>
                    </div>
                    <a
                      href={BRAND_INFO.telUrl}
                      className="px-3 py-2 rounded-lg bg-brand-orange-500 hover:bg-brand-orange-600 text-white text-xs font-bold transition-colors"
                    >
                      Call Now
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
