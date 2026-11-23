"use client";

import React from "react";
import Link from "next/link";
import { HardHat, ShieldCheck, Truck, Check, ArrowRight } from "lucide-react";
import { BRAND_INFO } from "@/lib/constants";

export const AboutSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-[#F5F6F8]">
              <img
                src="/images/about/construction-site-operations.jpg"
                alt="Jayam Building Materials Operations & Logistics"
                className="w-full h-[360px] sm:h-[460px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14243A]/85 via-transparent to-transparent"></div>
              
              {/* Overlay Stat Card */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 text-[#14243A] shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-[#F47B20]">48,000+</span>
                    <p className="text-[11px] text-slate-500 font-semibold">Tons of Materials Dispatched</p>
                  </div>
                  <div className="h-8 w-px bg-slate-200"></div>
                  <div>
                    <span className="text-2xl font-black text-[#159B68]">1,250+</span>
                    <p className="text-[11px] text-slate-500 font-semibold">Homes & Sites Supplied</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Corner Badge */}
            <div className="hidden sm:flex absolute -top-3 -left-3 w-16 h-16 rounded-2xl bg-white p-2 items-center justify-center shadow-lg rotate-3 border border-slate-200">
              <img src="/images/logo.png" alt="Jayam Logo" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Right Column: Copy & Principles */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF7ED] border border-[#F47B20]/30 text-[#F47B20] text-xs font-bold uppercase tracking-wider">
              <span>About Jayam Building Materials</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-[#14243A] leading-tight tracking-tight">
              Building Trust from the Ground Up, One Truck at a Time.
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Founded on the values of absolute honesty in quantity and zero-compromise on quality, <strong className="text-[#14243A]">JAYAM BUILDING MATERIALS</strong> bridges the gap between primary quarries and your active construction site.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Traditional building material sourcing often suffers from adulterated river sand, under-weight deliveries, and unpredictable logistics. We solve this by operating dedicated crushing plant alignments, certified digital weighbridges, and our own logistics fleet.
            </p>

            {/* Core Commitments Checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#E8F7F0] text-[#159B68] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  Direct quarry & riverbed concessions with government transport permits
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#E8F7F0] text-[#159B68] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  No automated surprise charges: transport is customized to your site access
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#E8F7F0] text-[#159B68] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  Instant booking via WhatsApp and Phone with zero mandatory app signups
                </span>
              </div>
            </div>

            <div className="pt-3 flex items-center gap-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#F47B20] hover:text-[#DC630D] transition-colors"
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
