"use client";

import React from "react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { FloatingQuickContact } from "@/components/public/FloatingQuickContact";
import { DeliveryNoticeBanner } from "@/components/public/DeliveryNoticeBanner";
import { WhyChooseUs } from "@/components/public/WhyChooseUs";
import { HardHat, ShieldCheck, Truck, Scale, MapPin, Award, CheckCircle2 } from "lucide-react";
import { useBrandSettings } from "@/lib/utils/settingsStore";

export default function AboutPage() {
  const brand = useBrandSettings();
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#20252D]">
      <Navbar />
      <DeliveryNoticeBanner />

      {/* Hero Header in Deep Navy */}
      <div className="bg-[#14243A] text-white py-14 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-[#0F1B2B]">
        <div className="max-w-7xl mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#F47B20] text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
            <img src="/images/logo-icon.png" alt="" className="w-4 h-4 object-contain" />
            <span>The Jayam Story</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Building Materials With Uncompromised Integrity
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            "{brand.tagline}" We provide verified quality, triple-washed river sand, precision VSI aggregates, and genuine weighbridge tonnage directly to construction projects across the region.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold text-[#F47B20] uppercase tracking-widest block">
              Our Founding Mission
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#14243A] leading-tight tracking-tight">
              Solving the Three Biggest Headaches in Building Material Procurement.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Anyone who has managed a construction project knows the pain points: sand arriving with excessive mud/silt that weakens concrete, lorries arriving under-loaded by 2 to 4 tons, and hidden freight charges added at the time of gate unloading.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong className="text-[#14243A]">JAYAM BUILDING MATERIALS</strong> was established to bring radical transparency to the construction supply chain. We own our relationships with legal river reserves and granite quarries, operate digital weighbridges, and provide transparent site-specific transportation with zero surprises.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F5F6F8] border border-slate-200">
                <span className="text-2xl font-black text-[#F47B20]">48,000+</span>
                <p className="text-xs text-slate-600 mt-0.5 font-semibold">Tons Dispatched Safely</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F5F6F8] border border-slate-200">
                <span className="text-2xl font-black text-[#159B68]">100%</span>
                <p className="text-xs text-slate-600 mt-0.5 font-semibold">Weighbridge Transparency</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-[#F5F6F8]">
            <img
              src="/images/hero/jayam-construction-hero.jpg"
              alt="Jayam Building Materials Construction Site Supply & Fleet Logistics"
              className="w-full h-96 object-cover"
            />
          </div>
        </div>

        {/* Why Choose Us Block */}
        <WhyChooseUs />

      </main>

      <Footer />
      <FloatingQuickContact />
    </div>
  );
}
