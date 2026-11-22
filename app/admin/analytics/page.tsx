"use client";

import React from "react";
import { BarChart3, TrendingUp, DollarSign, Truck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Sales & Material Analytics</h1>
        <p className="text-xs text-slate-400">Order trends, best-selling materials, and yard tonnage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-brand-charcoal-900 border border-brand-charcoal-800">
          <span className="text-xs font-bold text-slate-400 uppercase">Top Ordered Category</span>
          <p className="text-xl font-bold text-white mt-1">M-Sand (Manufactured Sand)</p>
          <span className="text-[11px] text-brand-orange-400 mt-1 block">62% of concrete casting loads</span>
        </div>

        <div className="p-5 rounded-2xl bg-brand-charcoal-900 border border-brand-charcoal-800">
          <span className="text-xs font-bold text-slate-400 uppercase">Average Order Size</span>
          <p className="text-xl font-bold text-white mt-1">₹24,500</p>
          <span className="text-[11px] text-emerald-400 mt-1 block">12-16 Ton Tipper loads</span>
        </div>

        <div className="p-5 rounded-2xl bg-brand-charcoal-900 border border-brand-charcoal-800">
          <span className="text-xs font-bold text-slate-400 uppercase">Dispatch Fulfillment</span>
          <p className="text-xl font-bold text-white mt-1">98.4%</p>
          <span className="text-[11px] text-slate-400 mt-1 block">On-time site unloading</span>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-brand-charcoal-900 border border-brand-charcoal-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-brand-orange-500" />
          <span>Material Popularity Breakdown</span>
        </h3>
        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Engineered M-Sand</span>
              <span>45%</span>
            </div>
            <div className="w-full bg-brand-charcoal-800 rounded-full h-2">
              <div className="bg-brand-orange-500 h-2 rounded-full" style={{ width: "45%" }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Natural River Sand (Triple Washed)</span>
              <span>30%</span>
            </div>
            <div className="w-full bg-brand-charcoal-800 rounded-full h-2">
              <div className="bg-brand-orange-500 h-2 rounded-full" style={{ width: "30%" }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>53 Grade Cement</span>
              <span>15%</span>
            </div>
            <div className="w-full bg-brand-charcoal-800 rounded-full h-2">
              <div className="bg-brand-orange-500 h-2 rounded-full" style={{ width: "15%" }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Steel & Aggregates</span>
              <span>10%</span>
            </div>
            <div className="w-full bg-brand-charcoal-800 rounded-full h-2">
              <div className="bg-brand-orange-500 h-2 rounded-full" style={{ width: "10%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
