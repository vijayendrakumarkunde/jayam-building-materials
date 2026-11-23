"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Phone, 
  ShoppingCart, 
  Menu, 
  X, 
  Search, 
  HardHat, 
  MapPin, 
  Clock, 
  MessageCircle,
  Truck
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
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Notification / Dispatch Bar */}
      <div className="bg-brand-charcoal-900 text-slate-300 text-xs py-2 px-4 border-b border-brand-charcoal-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-brand-orange-400 font-semibold">
              <Truck className="w-3.5 h-3.5" /> Direct Site Delivery Across the Region
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" /> Mon - Sat: 6:00 AM - 9:00 PM
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href={BRAND_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Support
            </a>
            <span className="text-slate-600">|</span>
            <a
              href={BRAND_INFO.telUrl}
              className="flex items-center gap-1 text-slate-200 hover:text-brand-orange-400 font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brand-orange-500" /> {BRAND_INFO.phoneFormatted}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-brand-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden border border-white/20 shrink-0">
                <img
                  src="/images/logo.png"
                  alt="JAYAM Building Materials Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">
                  JAYAM
                </span>
                <span className="text-[10px] sm:text-xs font-bold tracking-widest text-brand-orange-400 uppercase mt-0.5">
                  Building Materials
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              <Link
                href="/"
                className="px-3.5 py-2 text-sm font-medium text-white hover:text-brand-orange-400 rounded-lg hover:bg-brand-charcoal-800 transition-all"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-brand-orange-400 rounded-lg hover:bg-brand-charcoal-800 transition-all"
              >
                Products
              </Link>
              <Link
                href="/about"
                className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-brand-orange-400 rounded-lg hover:bg-brand-charcoal-800 transition-all"
              >
                About Us
              </Link>
              <Link
                href="/track-order"
                className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-brand-orange-400 rounded-lg hover:bg-brand-charcoal-800 transition-all flex items-center gap-1.5"
              >
                <Truck className="w-4 h-4 text-brand-orange-400" /> Track Order
              </Link>
              <Link
                href="/contact"
                className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-brand-orange-400 rounded-lg hover:bg-brand-charcoal-800 transition-all"
              >
                Contact Us
              </Link>
            </div>

            {/* Search, Cart & Call CTA */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Search Toggle for Mobile / Quick Search Input */}
              <div className="relative hidden md:block w-48 lg:w-64">
                <input
                  type="text"
                  placeholder="Search sand, cement, steel..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full bg-brand-charcoal-800 text-sm text-white placeholder-slate-400 rounded-full pl-9 pr-4 py-2 border border-brand-charcoal-700 focus:outline-none focus:border-brand-orange-500 focus:ring-1 focus:ring-brand-orange-500 transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>

              {/* Shopping Cart Button */}
              <button
                onClick={onOpenCart}
                className="relative p-2.5 rounded-xl bg-brand-charcoal-800 hover:bg-brand-charcoal-700 text-white border border-brand-charcoal-700 transition-all flex items-center justify-center group"
                aria-label="View shopping cart"
              >
                <ShoppingCart className="w-5 h-5 text-slate-200 group-hover:text-brand-orange-400 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Instant Call CTA */}
              <a
                href={BRAND_INFO.telUrl}
                className="hidden sm:inline-flex items-center gap-2 bg-brand-orange-500 hover:bg-brand-orange-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-brand-orange-500/25 hover:shadow-brand-orange-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Phone className="w-4 h-4" />
                <span>Call Dispatch</span>
              </a>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-brand-charcoal-800 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search sand, cement, steel, bricks..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full bg-brand-charcoal-800 text-sm text-white placeholder-slate-400 rounded-lg pl-10 pr-4 py-2.5 border border-brand-charcoal-700 focus:outline-none focus:border-brand-orange-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-brand-charcoal-800 bg-brand-charcoal-900 px-4 pt-3 pb-6 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-white hover:bg-brand-charcoal-800 hover:text-brand-orange-400"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-brand-charcoal-800 hover:text-brand-orange-400"
            >
              Products Catalogue
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-brand-charcoal-800 hover:text-brand-orange-400"
            >
              About Jayam Materials
            </Link>
            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-brand-charcoal-800 hover:text-brand-orange-400 flex items-center gap-2"
            >
              <Truck className="w-4 h-4 text-brand-orange-400" /> Track My Order
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-brand-charcoal-800 hover:text-brand-orange-400"
            >
              Contact Us
            </Link>

            <div className="pt-4 border-t border-brand-charcoal-800 space-y-2">
              <a
                href={BRAND_INFO.telUrl}
                className="w-full flex items-center justify-center gap-2 bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold py-3 rounded-lg"
              >
                <Phone className="w-4 h-4" /> Call Direct ({BRAND_INFO.phone})
              </a>
              <a
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Us
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
