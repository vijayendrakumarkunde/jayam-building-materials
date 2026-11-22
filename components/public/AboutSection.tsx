import React from "react";
import Link from "next/link";
import { HardHat, ShieldCheck, Truck, Check, ArrowRight } from "lucide-react";
import { BRAND_INFO } from "@/lib/constants";

export const AboutSection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=1000&q=80"
                alt="Jayam Building Materials Operations"
                className="w-full h-[400px] sm:h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal-900/80 via-transparent to-transparent"></div>
              
              {/* Overlay Stat Card */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-brand-charcoal-900/90 backdrop-blur-md border border-slate-700 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-brand-orange-400">48,000+</span>
                    <p className="text-xs text-slate-300 font-medium">Tons of Materials Dispatched</p>
                  </div>
                  <div className="h-8 w-px bg-slate-700"></div>
                  <div>
                    <span className="text-2xl font-black text-brand-orange-400">1,250+</span>
                    <p className="text-xs text-slate-300 font-medium">Homes & Projects Built</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Corner Badge */}
            <div className="hidden sm:flex absolute -top-4 -left-4 w-20 h-20 rounded-2xl bg-brand-orange-500 text-white items-center justify-center shadow-xl rotate-3">
              <HardHat className="w-10 h-10" />
            </div>
          </div>

          {/* Right Column: Copy & Principles */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange-100 text-brand-orange-800 text-xs font-bold uppercase tracking-wider">
              <span>About Jayam Building Materials</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-charcoal leading-tight">
              Building Trust from the Ground Up, One Truck at a Time.
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              Founded on the values of absolute honesty in quantity and zero-compromise on quality, <strong>JAYAM BUILDING MATERIALS</strong> bridges the gap between primary quarries and your construction site.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Traditional building material sourcing often suffers from adulterated river sand, under-weight deliveries, and unpredictable logistics. We solve this by operating dedicated crushing plant alignments, certified digital weighbridges, and our own logistics fleet.
            </p>

            {/* Core Commitments Checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  Direct quarry & riverbed concessions with government transport permits
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  No automated surprise charges: transport is customized to your site access
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  Instant booking via WhatsApp and Phone with zero mandatory app signups
                </span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-orange-600 hover:text-brand-orange-700"
              >
                <span>Read Full Company Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
