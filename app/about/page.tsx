import React from "react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { FloatingQuickContact } from "@/components/public/FloatingQuickContact";
import { DeliveryNoticeBanner } from "@/components/public/DeliveryNoticeBanner";
import { WhyChooseUs } from "@/components/public/WhyChooseUs";
import { HardHat, ShieldCheck, Truck, Scale, MapPin, Award, CheckCircle2 } from "lucide-react";
import { BRAND_INFO } from "@/lib/constants";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <DeliveryNoticeBanner />

      {/* Hero Header */}
      <div className="bg-brand-charcoal text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-brand-charcoal-800">
        <div className="max-w-7xl mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange-500/20 text-brand-orange-400 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-orange-500/30">
            <img src="/images/logo-icon.png" alt="" className="w-4 h-4 object-contain" />
            <span>The Jayam Story</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Building Materials With Uncompromised Integrity
          </h1>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            "{BRAND_INFO.tagline}" We provide verified quality, triple-washed river sand, precision VSI aggregates, and genuine weighbridge tonnage directly to construction projects across the region.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold text-brand-orange-600 uppercase tracking-widest block">
              Our Founding Mission
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal leading-tight">
              Solving the Three Biggest Headaches in Building Material Procurement.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Anyone who has managed a construction project knows the pain points: sand arriving with excessive mud/silt that weakens concrete, lorries arriving under-loaded by 2 to 4 tons, and hidden freight charges added at the time of gate unloading.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong>JAYAM BUILDING MATERIALS</strong> was established to bring radical transparency to the construction supply chain. We own our relationships with legal river reserves and granite quarries, operate digital weighbridges, and provide transparent site-specific transportation with zero surprises.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <span className="text-2xl font-black text-brand-orange-600">48,000+</span>
                <p className="text-xs text-slate-600 mt-0.5">Tons Dispatched Safely</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <span className="text-2xl font-black text-brand-orange-600">100%</span>
                <p className="text-xs text-slate-600 mt-0.5">Weighbridge Transparency</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1000&q=80"
              alt="Jayam Building Materials Crushing Plant & Yard"
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
