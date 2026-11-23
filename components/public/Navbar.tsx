"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Phone, 
  ShoppingCart, 
  Menu, 
  X, 
  Search, 
  Truck, 
  Clock, 
  MessageCircle, 
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { BRAND_INFO } from "@/lib/constants";
import { useCart } from "@/lib/context/CartContext";

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount: propCartCount,
  onOpenCart: propOnOpenCart,
  searchQuery = "",
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cart = useCart();

  const cartCount = propCartCount !== undefined ? propCartCount : cart.items.length;
  const onOpenCart = propOnOpenCart || cart.openCart;

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm bg-white">
      {/* 1. Modern Industrial Luxury Announcement Bar */}
      <div className="bg-[#14243A] text-slate-200 text-xs py-2 px-4 border-b border-[#0F1B2B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          {/* Left: Dispatch & Delivery Guarantee */}
          <div className="flex items-center space-x-3 text-[11px] sm:text-xs">
            <span className="inline-flex items-center gap-1.5 text-[#F47B20] font-bold">
              <Truck className="w-3.5 h-3.5" />
              <span>Direct Site Delivery Across Telangana & AP</span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#159B68]" />
              <span>100% Certified Weighbridge Slip</span>
            </span>
            <span className="hidden lg:inline text-slate-600">|</span>
            <span className="hidden lg:flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" /> Mon - Sat: 6:00 AM - 9:00 PM
            </span>
          </div>

          {/* Right: Instant Contact & WhatsApp */}
          <div className="flex items-center space-x-4 text-[11px] sm:text-xs">
            <a
              href={BRAND_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Support
            </a>
            <span className="text-slate-600">|</span>
            <a
              href={BRAND_INFO.telUrl}
              className="flex items-center gap-1 text-white hover:text-[#F47B20] font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#F47B20]" />
              <span>{BRAND_INFO.phoneFormatted}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar - Crisp Pure White with Navy / Charcoal Accents */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3.5 group shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all overflow-hidden border border-slate-200 shrink-0">
                <img
                  src="/images/logo.png"
                  alt="JAYAM Building Materials Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#14243A] leading-none group-hover:text-[#F47B20] transition-colors">
                  JAYAM
                </span>
                <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#F47B20] uppercase mt-1">
                  Building Materials
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              <Link
                href="/"
                className="px-3.5 py-2 text-sm font-bold text-[#20252D] hover:text-[#F47B20] hover:bg-[#F5F6F8] rounded-xl transition-all"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-[#F47B20] hover:bg-[#F5F6F8] rounded-xl transition-all"
              >
                Products
              </Link>
              <Link
                href="/about"
                className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-[#F47B20] hover:bg-[#F5F6F8] rounded-xl transition-all"
              >
                About Us
              </Link>
              <Link
                href="/track-order"
                className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-[#F47B20] hover:bg-[#F5F6F8] rounded-xl transition-all flex items-center gap-1.5"
              >
                <Truck className="w-4 h-4 text-[#F47B20]" />
                <span>Track Order</span>
              </Link>
              <Link
                href="/contact"
                className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-[#F47B20] hover:bg-[#F5F6F8] rounded-xl transition-all"
              >
                Contact Us
              </Link>
            </div>

            {/* Product Search Bar */}
            <div className="relative hidden md:flex items-center flex-1 max-w-xs lg:max-w-sm">
              <input
                type="text"
                placeholder="Search sand, cement, steel, bricks..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full bg-[#F5F6F8] text-sm text-[#20252D] placeholder-slate-400 rounded-full pl-10 pr-4 py-2.5 border border-slate-200/90 focus:bg-white focus:outline-none focus:border-[#F47B20] focus:ring-2 focus:ring-[#F47B20]/20 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange?.("")}
                  className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Shopping Cart & Call CTA */}
            <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
              {/* Shopping Cart Button */}
              <button
                onClick={onOpenCart}
                className="relative p-2.5 rounded-xl bg-[#F5F6F8] hover:bg-slate-200/80 text-slate-800 border border-slate-200 transition-all flex items-center justify-center group"
                aria-label="View shopping cart"
              >
                <ShoppingCart className="w-5 h-5 text-slate-700 group-hover:text-[#F47B20] transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#F47B20] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Instant Call CTA Button */}
              <a
                href={BRAND_INFO.telUrl}
                className="hidden sm:inline-flex items-center gap-2 bg-[#F47B20] hover:bg-[#DC630D] text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-[#F47B20]/25 hover:shadow-lg hover:shadow-[#F47B20]/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Phone className="w-4 h-4" />
                <span>Call Dispatch</span>
              </a>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl text-slate-600 hover:text-[#20252D] hover:bg-[#F5F6F8] border border-slate-200 focus:outline-none"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>

          {/* Mobile Search Bar in Navbar */}
          <div className="md:hidden pb-3.5 pt-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search sand, cement, steel, bricks..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full bg-[#F5F6F8] text-sm text-[#20252D] placeholder-slate-400 rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#F47B20] focus:ring-1 focus:ring-[#F47B20]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-4 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-3 duration-200">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-bold text-[#20252D] hover:bg-[#F5F6F8] hover:text-[#F47B20]"
            >
              <span>Home</span>
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-[#F5F6F8] hover:text-[#F47B20]"
            >
              <span>Products Catalogue</span>
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-[#F5F6F8] hover:text-[#F47B20]"
            >
              <span>About Jayam Materials</span>
            </Link>
            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-[#F5F6F8] hover:text-[#F47B20]"
            >
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#F47B20]" /> Track My Order
              </span>
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-[#F5F6F8] hover:text-[#F47B20]"
            >
              <span>Contact Us</span>
            </Link>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <a
                href={BRAND_INFO.telUrl}
                className="w-full flex items-center justify-center gap-2 bg-[#F47B20] hover:bg-[#DC630D] text-white font-bold py-3 rounded-xl shadow-md"
              >
                <Phone className="w-4 h-4" /> Call Direct ({BRAND_INFO.phone})
              </a>
              <a
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#159B68] hover:bg-[#108055] text-white font-bold py-3 rounded-xl shadow-md"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Dispatch Team
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
