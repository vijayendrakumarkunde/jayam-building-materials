"use client";

import React, { useState } from "react";
import { MessageCircle, Phone, X, HardHat } from "lucide-react";
import { BRAND_INFO } from "@/lib/constants";

export const FloatingQuickContact: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <aside aria-label="Quick contact buttons" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 sm:gap-3 pointer-events-auto">
      
      {/* Quick Greeting Popover (Desktop only to prevent mobile overlap) */}
      {showTooltip && (
        <div className="hidden sm:flex relative bg-brand-charcoal text-white text-xs py-2 px-3.5 rounded-xl shadow-2xl border border-brand-charcoal-700 items-center gap-2 animate-bounce">
          <HardHat className="w-3.5 h-3.5 text-brand-orange-400" />
          <span>Need sand or material quotation?</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white ml-1"
            aria-label="Dismiss quick help"
          >
            <X className="w-3 h-3" />
          </button>
          {/* Arrow indicator */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-brand-charcoal border-r border-b border-brand-charcoal-700 rotate-45"></div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Call Now Floating Button */}
        <a
          href={BRAND_INFO.telUrl}
          className="group relative flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 p-2.5 sm:p-3.5 bg-brand-charcoal hover:bg-brand-orange-600 text-white rounded-full shadow-2xl border-2 border-white/20 transition-all duration-300 transform hover:scale-110 active:scale-95"
          title={`Call Us Directly: ${BRAND_INFO.phoneFormatted}`}
          aria-label="Call Dispatch"
        >
          <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange-400 group-hover:text-white transition-colors" />
          
          <span className="hidden sm:inline-block max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
            Call Dispatch
          </span>
        </a>

        {/* WhatsApp Floating Button */}
        <a
          href={BRAND_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 p-2.5 sm:p-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl border-2 border-white/20 transition-all duration-300 transform hover:scale-110 active:scale-95"
          title="Chat on WhatsApp (+91 9505609865)"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white" />
          
          {/* Pulsing Aura */}
          <span className="absolute -inset-1 rounded-full bg-emerald-400/40 animate-ping -z-10"></span>
          
          <span className="hidden sm:inline-block max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
            WhatsApp
          </span>
        </a>
      </div>

    </aside>
  );
};
