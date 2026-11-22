"use client";

import React from "react";
import { Layers, Plus } from "lucide-react";
import { CATEGORIES_DATA } from "@/lib/data/categories";

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories Management</h1>
          <p className="text-xs text-slate-400">Configure building material classifications</p>
        </div>

        <button
          onClick={() => alert("Add category feature connects to Supabase in Phase 5")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES_DATA.map((cat) => (
          <div key={cat.id} className="p-4 rounded-2xl bg-brand-charcoal-900 border border-brand-charcoal-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={cat.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <h3 className="text-sm font-bold text-white">{cat.name}</h3>
                <span className="text-[10px] text-slate-400">{cat.itemCount} Varieties • Slug: {cat.slug}</span>
              </div>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">Active</span>
          </div>
        ))}
      </div>
    </div>
  );
}
