"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
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
    <section id="category-menu" className="py-8 sm:py-14 bg-slate-50 border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 text-brand-orange-600 text-xs font-bold tracking-widest uppercase mb-1">
              <Layers className="w-4 h-4" />
              <span>Direct Wholesale Catalog</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-brand-charcoal">
              All Materials Menu
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mt-1 md:mt-0">
            Select any category below to filter available building materials and instant tipper booking:
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {CATEGORIES_DATA.map((category) => {
            const isSelected = selectedCategory === category.slug;
            return (
              <div
                key={category.id}
                onClick={() => onSelectCategory ? onSelectCategory(category.slug) : undefined}
                className={`group relative overflow-hidden rounded-2xl bg-white border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  isSelected
                    ? "border-brand-orange-500 ring-2 ring-brand-orange-500/20 shadow-lg"
                    : "border-slate-200 hover:border-brand-orange-300"
                }`}
              >
                {/* Visual Image Container with Gradient */}
                <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal-900/80 via-transparent to-transparent"></div>
                  
                  {/* Item Count Tag */}
                  <span className="absolute top-2.5 right-2.5 bg-brand-charcoal-900/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-slate-700">
                    {category.itemCount} Varieties
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-3.5 sm:p-4">
                  <h3 className="text-sm sm:text-base font-bold text-brand-charcoal group-hover:text-brand-orange-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 mt-1 leading-snug">
                    {category.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-brand-orange-600 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                      View Stock <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
