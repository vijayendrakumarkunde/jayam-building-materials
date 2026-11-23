"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Layers, 
  Users, 
  Boxes, 
  BarChart3, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  HardHat, 
  Bell,
  Truck
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If on login page, render cleanly without admin chrome
  if (pathname === "/admin/login") {
    return <main className="min-h-screen bg-brand-charcoal">{children}</main>;
  }

  const navLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Orders & Bookings", href: "/admin/orders", icon: ShoppingCart },
    { name: "Products Catalogue", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Layers },
    { name: "Customer Directory", href: "/admin/customers", icon: Users },
    { name: "Inventory & Stock", href: "/admin/inventory", icon: Boxes },
    { name: "Sales Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Website Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F5F6F8] text-[#20252D]">
      
      {/* Desktop Sidebar (Fixed 64) */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#14243A] border-r border-[#0F1B2B] shrink-0 select-none">
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-[#1E3350] gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white p-1 flex items-center justify-center shadow-lg overflow-hidden border border-white/20 shrink-0">
            <img
              src="/images/logo.png"
              alt="JAYAM Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-base font-black text-white tracking-tight block">JAYAM</span>
            <span className="text-[10px] font-bold text-[#F47B20] uppercase tracking-widest block">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#F47B20] text-white shadow-lg shadow-[#F47B20]/25"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-300"}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile & Logout */}
        <div className="p-4 border-t border-[#1E3350] space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#F47B20]" />
              <span>View Live Website</span>
            </span>
            <span className="text-[10px] bg-white/15 text-slate-200 px-1.5 py-0.5 rounded font-bold">Store</span>
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h2 className="text-sm sm:text-base font-extrabold text-[#14243A] capitalize">
              {pathname.replace("/admin/", "").replace("/", " ➔ ") || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-[#F5F6F8] px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-[#159B68] animate-pulse"></span>
              <span>Supabase Cloud Connected</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 lg:hidden"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Dropdown */}
        {mobileSidebarOpen && (
          <div className="lg:hidden bg-[#14243A] border-b border-[#0F1B2B] p-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#F47B20] text-white"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-[#1E3350] flex justify-between items-center text-xs">
              <a href="/" target="_blank" className="text-[#F47B20] font-bold hover:underline">
                View Website ➔
              </a>
              <button onClick={handleLogout} className="text-rose-300 font-bold hover:underline">
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F5F6F8]">
          {children}
        </main>

      </div>

    </div>
  );
}
