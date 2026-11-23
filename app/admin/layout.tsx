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
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If on login page, don't show admin chrome/sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
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
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      
      {/* Desktop Sidebar (Fixed 64) */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-brand-charcoal-950 border-r border-brand-charcoal-800 shrink-0 select-none">
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-brand-charcoal-800 gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white p-1 flex items-center justify-center shadow-lg overflow-hidden border border-white/20 shrink-0">
            <img
              src="/images/logo.png"
              alt="JAYAM Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-base font-black text-white tracking-tight block">JAYAM</span>
            <span className="text-[10px] font-bold text-brand-orange-400 uppercase tracking-widest block">
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
                    ? "bg-brand-orange-500 text-white shadow-lg shadow-brand-orange-500/20"
                    : "text-slate-400 hover:text-white hover:bg-brand-charcoal-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile & Logout */}
        <div className="p-4 border-t border-brand-charcoal-800 space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-brand-charcoal-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-brand-orange-400" />
              <span>View Live Website</span>
            </span>
            <span className="text-[10px] bg-brand-charcoal-800 text-slate-400 px-1.5 py-0.5 rounded">Store</span>
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-brand-charcoal-900 border-b border-brand-charcoal-800 flex items-center justify-between px-4 sm:px-6 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-brand-charcoal-800"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h2 className="text-sm sm:text-base font-bold text-white capitalize">
              {pathname.replace("/admin/", "").replace("/", " ➔ ") || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-brand-charcoal-800 px-3 py-1.5 rounded-lg border border-brand-charcoal-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Supabase Cloud Connected</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-brand-charcoal-800 lg:hidden"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Dropdown */}
        {mobileSidebarOpen && (
          <div className="lg:hidden bg-brand-charcoal-950 border-b border-brand-charcoal-800 p-4 space-y-1">
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
                      ? "bg-brand-orange-500 text-white"
                      : "text-slate-400 hover:text-white hover:bg-brand-charcoal-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-brand-charcoal-800 flex justify-between items-center text-xs">
              <a href="/" target="_blank" className="text-brand-orange-400 hover:underline">
                View Website ➔
              </a>
              <button onClick={handleLogout} className="text-rose-400 hover:underline">
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-900">
          {children}
        </main>

      </div>

    </div>
  );
}
