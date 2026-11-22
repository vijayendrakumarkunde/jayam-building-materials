"use client";

import React from "react";
import { Boxes, AlertTriangle, CheckCircle2 } from "lucide-react";
import { PRODUCTS_DATA } from "@/lib/data/products";

export default function AdminInventoryPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Stock & Inventory Management</h1>
        <p className="text-xs text-slate-400">Track material stock levels, tipper reserves, and reorder thresholds</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-brand-charcoal-900 border border-brand-charcoal-800">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Tracked Items</span>
          <p className="text-2xl font-black text-white mt-1">{PRODUCTS_DATA.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-brand-charcoal-900 border border-brand-charcoal-800">
          <span className="text-xs font-bold text-slate-400 uppercase">Available for Dispatch</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{PRODUCTS_DATA.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-brand-charcoal-900 border border-brand-charcoal-800">
          <span className="text-xs font-bold text-slate-400 uppercase">Low Stock Alerts</span>
          <p className="text-2xl font-black text-slate-400 mt-1">0</p>
        </div>
      </div>

      <div className="bg-brand-charcoal-900 rounded-2xl border border-brand-charcoal-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-brand-charcoal-950 text-slate-400 uppercase text-[10px] font-bold">
            <tr>
              <th className="p-4">Material</th>
              <th className="p-4">Unit</th>
              <th className="p-4">Current Stock</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-charcoal-800">
            {PRODUCTS_DATA.map((p) => (
              <tr key={p.id} className="hover:bg-brand-charcoal-800/40">
                <td className="p-4 font-bold text-white">{p.name}</td>
                <td className="p-4">{p.unit}</td>
                <td className="p-4 font-bold text-white">{p.stockQuantity} {p.unit}</td>
                <td className="p-4">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Sufficient Stock
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
