"use client";

import React from "react";
import { ArrowUpRight, ArrowRight, Sparkles } from "lucide-react";
import { CATEGORIES_DATA } from "@/lib/data/categories";

interface CategoryGridProps {
  selectedCategory?: string | null;
  onSelectCategory?: (slug: string | null) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  // Separate into Primary Grid and More Categories (like Builders9)
  const primaryCategories = CATEGORIES_DATA.filter((c) => !c.isMoreCategory);
  const moreCategories = CATEGORIES_DATA.filter((c) => c.isMoreCategory);

  return (
    <section id="category-menu" className="py-8 sm:py-12 bg-[#F8F9FA] border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black tracking-widest uppercase text-brand-orange-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Wholesale Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore All Categories
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
            Tap any category to filter verified building materials with direct quarry & depot delivery.
          </p>
        </div>

        {/* PRIMARY BUILDERS9-STYLE 2-COLUMN PASTEL CARDS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {primaryCategories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory ? onSelectCategory(cat.slug) : undefined}
                style={{ backgroundColor: cat.bgColor || "#F4F3F5" }}
                className={`rounded-3xl sm:rounded-[32px] p-4 sm:p-6 flex flex-col justify-between h-[220px] sm:h-[280px] relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  isSelected
                    ? "ring-2 ring-slate-900 ring-offset-2 shadow-lg"
                    : "border border-black/5 hover:border-black/10"
                }`}
              >
                {/* Top Row: Category Title & Arrow Button */}
                <div className="flex items-start justify-between gap-2 z-10">
                  <div>
                    <h3 className="text-base sm:text-xl font-black text-slate-900 leading-tight tracking-tight">
                      {cat.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                      {cat.itemCount} products
                    </p>
                  </div>

                  {/* Circular White Arrow Button */}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-800 group-hover:scale-110 group-hover:bg-slate-900 group-hover:text-white transition-all shrink-0">
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>

                {/* Bottom Row: Category Material Visual Representation */}
                <div className="relative h-28 sm:h-40 w-full flex items-end justify-center pt-2">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="max-h-full w-full object-cover rounded-2xl shadow-sm group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent rounded-2xl pointer-events-none"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* "MORE CATEGORIES" SECTION (BUILDERS9 SPECIFICATION) */}
        {moreCategories.length > 0 && (
          <div className="bg-white rounded-3xl sm:rounded-[32px] border border-slate-200/80 p-5 sm:p-8 shadow-sm space-y-4 sm:space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  More categories
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Everything else we stock for your project
                </p>
              </div>

              <span className="bg-[#FAF0DC] text-slate-900 text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-full">
                {moreCategories.length} more
              </span>
            </div>

            {/* List Rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {moreCategories.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <div
                    key={cat.id}
                    onClick={() => onSelectCategory ? onSelectCategory(cat.slug) : undefined}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-slate-100 border-slate-900 ring-1 ring-slate-900 shadow-sm"
                        : "bg-slate-50/70 border-slate-200/70 hover:bg-slate-100/80 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-200 shrink-0 shadow-sm"
                        loading="lazy"
                      />
                      <div>
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                          {cat.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {cat.itemCount} products
                        </p>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white transition-colors shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
