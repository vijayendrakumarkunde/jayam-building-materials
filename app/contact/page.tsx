import React from "react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { FloatingQuickContact } from "@/components/public/FloatingQuickContact";
import { DeliveryNoticeBanner } from "@/components/public/DeliveryNoticeBanner";
import { ContactSection } from "@/components/public/ContactSection";
import { HardHat, Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import { BRAND_INFO } from "@/lib/constants";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <DeliveryNoticeBanner />

      <div className="bg-brand-charcoal text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-brand-charcoal-800">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange-500/20 text-brand-orange-400 text-xs font-bold uppercase tracking-wider border border-brand-orange-500/30">
            <Phone className="w-3.5 h-3.5" />
            <span>Direct Dispatch Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Contact Jayam Building Materials
          </h1>
          <p className="text-sm text-slate-300">
            Reach our central dispatch coordinators, tipper logistics desk, and sample testing lab directly.
          </p>
        </div>
      </div>

      <main className="flex-1">
        <ContactSection />
      </main>

      <Footer />
      <FloatingQuickContact />
    </div>
  );
}
