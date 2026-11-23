"use client";

import React from "react";
import Link from "next/link";
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Truck,
  Scale
} from "lucide-react";
import { BRAND_INFO, INITIAL_CATEGORIES } from "@/lib/constants";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#14243A] text-slate-300 border-t border-slate-800">
      
      {/* Top Value Assurance Ribbon */}
      <div className="border-b border-slate-800/80 py-8 bg-[#0F1B2B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-[#F47B20]">
              <ShieldCheck className="w-6 h-6 text-[#F47B20]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Lab-Certified Materials</h4>
              <p className="text-xs text-slate-400">Strict silt and IS 383 code compliance</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-[#159B68]">
              <Scale className="w-6 h-6 text-[#159B68]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Digital Weighbridge Receipts</h4>
              <p className="text-xs text-slate-400">100% accurate gross & tare printed slip</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-[#F47B20]">
              <Truck className="w-6 h-6 text-[#F47B20]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Own Tipper Logistics</h4>
              <p className="text-xs text-slate-400">Scheduled site unloading windows</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shadow-md overflow-hidden border border-white/20 shrink-0">
                <img
                  src="/images/logo.png"
                  alt="JAYAM Building Materials Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-2xl font-black text-white tracking-tight">JAYAM</span>
                <span className="text-[10px] font-bold text-[#F47B20] tracking-widest block uppercase mt-0.5">
                  Building Materials
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed italic">
              "{BRAND_INFO.tagline}"
            </p>

            <p className="text-xs text-slate-400 leading-relaxed">
              Premium marketplace for direct-from-source River Sand, VSI M-Sand, High-Grade Cements, TMT Steel, and Crushed Aggregates. Serving civil contractors, builders, and individual home makers with verified weighbridge slips.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs">
              <a
                href={BRAND_INFO.telUrl}
                className="flex items-center gap-2 text-white hover:text-[#F47B20] font-bold transition-colors"
              >
                <Phone className="w-4 h-4 text-[#F47B20]" />
                <span>Call Dispatch: {BRAND_INFO.phoneFormatted}</span>
              </a>

              <a
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: +91 {BRAND_INFO.whatsappNumber}</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-[#F47B20] transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#F47B20] transition-colors">Product Catalogue</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#F47B20] transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-[#F47B20] transition-colors">Track Your Order</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F47B20] transition-colors">Contact Dispatch</Link>
              </li>
              <li>
                <Link href="/admin/products" className="hover:text-[#F47B20] text-slate-400 transition-colors">Admin Portal</Link>
              </li>
            </ul>
          </div>

          {/* Material Categories (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Materials Catalogue</h4>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-2 text-xs">
              {INITIAL_CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link href={`/products?category=${c.slug}`} className="hover:text-[#F47B20] transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Operating Hours & Dispatch Address (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Depot & Dispatch</h4>
            
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F47B20] shrink-0 mt-0.5" />
                <span>{BRAND_INFO.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#F47B20] shrink-0 mt-0.5" />
                <span>{BRAND_INFO.operatingHours}</span>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-[11px] text-slate-500 leading-normal">
                Direct hydraulic tipper unloading is available for approved construction sites. Weighbridge slips are verified upon delivery.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Legal / Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-center sm:flex sm:justify-between sm:items-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {BRAND_INFO.name}. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Engineered for strength, transparency, and speed.
          </p>
        </div>
      </div>
    </footer>
  );
};
