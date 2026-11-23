"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HardHat, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";
import { BRAND_INFO } from "@/lib/constants";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Invalid administrator credentials.");
        setLoading(false);
        return;
      }

      // Read redirect query safely on client side without triggering Next.js CSR bailout
      let redirectPath = "/admin/dashboard";
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        redirectPath = urlParams.get("redirect") || "/admin/dashboard";
      }

      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setError("Network or server connection error. Please try again.");
      setLoading(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setEmail("jayamvenkatesh1982@gmail.com");
    setPassword("@Jayam4489");
  };

  return (
    <div className="min-h-screen bg-brand-charcoal flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Graphic Patterns */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-orange-500 to-brand-orange-700 flex items-center justify-center shadow-xl shadow-brand-orange-500/25 mx-auto">
            <HardHat className="w-9 h-9 text-white" />
          </div>

          <div>
            <span className="text-xs font-bold text-brand-orange-400 uppercase tracking-widest block">
              Internal Management Suite
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              JAYAM ADMIN PORTAL
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Secure dispatch, inventory, and order management
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="mt-8 bg-brand-charcoal-900 border border-brand-charcoal-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Email or Phone
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jayamvenkatesh1982@gmail.com"
                  className="w-full text-sm px-4 py-3 pl-10 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange-500 focus:ring-1 focus:ring-brand-orange-500 transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-sm px-4 py-3 pl-10 pr-10 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange-500 focus:ring-1 focus:ring-brand-orange-500 transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold text-sm shadow-xl shadow-brand-orange-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
              >
                <span>{loading ? "Authenticating Admin..." : "Sign In to Dashboard"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>

          {/* Quick Demo Access Credentials Helper */}
          <div className="pt-4 border-t border-brand-charcoal-800 text-center space-y-2">
            <p className="text-[11px] text-slate-400">
              Owner Credentials (jayamvenkatesh1982@gmail.com):
            </p>
            <button
              type="button"
              onClick={handleFillDemoCredentials}
              className="inline-flex items-center gap-1.5 text-xs text-brand-orange-400 hover:text-brand-orange-300 bg-brand-charcoal-800 px-3 py-1.5 rounded-lg border border-brand-charcoal-700 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Fill Master Credentials</span>
            </button>
          </div>

        </div>

        {/* Back to Public Website Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-slate-500 hover:text-brand-orange-400 transition-colors"
          >
            ← Return to Jayam Building Materials Storefront
          </a>
        </div>

      </div>
    </div>
  );
}
