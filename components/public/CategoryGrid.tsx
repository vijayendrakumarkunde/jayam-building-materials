"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { CATEGORIES_DATA } from "@/lib/data/categories";

interface CategoryGridProps {
  selectedCategory?: string | null;
  onSelectCategory?: (slug: string | null) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section id="category-menu" className="py-12 sm:py-16 bg-[#F5F6F8] border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#F47B20]/30 text-[#F47B20] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#F47B20]" />
              <span>Direct Wholesale Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#14243A] tracking-tight">
              Popular Building Materials
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
            Select any category below to filter verified wholesale materials with direct quarry and depot dispatch.
          </p>
        </div>

        {/* PRIMARY CARDS PASTEL GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6">
          {CATEGORIES_DATA.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                style={{ backgroundColor: cat.bgColor || "#F5F6F8" }}
                className={`rounded-3xl p-4 sm:p-6 flex flex-col justify-between h-[230px] sm:h-[290px] relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border ${
                  isSelected
                    ? "ring-2 ring-[#F47B20] ring-offset-2 border-transparent shadow-lg"
                    : "border-slate-200/80 hover:border-[#F47B20]/40"
                }`}
              >
                {/* Top Row: Category Title & Arrow Button */}
                <div className="flex items-start justify-between gap-2 z-10">
                  <div>
                    <h3 className="text-base sm:text-xl font-black text-[#14243A] leading-tight tracking-tight group-hover:text-[#F47B20] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5">
                      {cat.itemCount} products
                    </p>
                  </div>

                  {/* Circular White Arrow Button */}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-800 group-hover:scale-110 group-hover:bg-[#14243A] group-hover:text-white transition-all shrink-0">
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>

                {/* Bottom Row: Category Material Visual Representation */}
                <div className="relative h-32 sm:h-44 w-full flex items-end justify-center pt-2">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="max-h-full w-full object-cover rounded-2xl shadow-xs group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl pointer-events-none"></div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};
