"use client";

import React, { useState, useMemo } from "react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { FloatingQuickContact } from "@/components/public/FloatingQuickContact";
import { DeliveryNoticeBanner } from "@/components/public/DeliveryNoticeBanner";
import { ProductCard } from "@/components/public/ProductCard";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { PRODUCTS_DATA } from "@/lib/data/products";
import { CATEGORIES_DATA } from "@/lib/data/categories";
import { Product, MeasurementUnit } from "@/lib/types";
import { MEASUREMENT_UNITS } from "@/lib/constants";
import { useCart } from "@/lib/context/CartContext";
import { Search, Filter, RefreshCw } from "lucide-react";

export default function ProductsPage() {
  const { items, addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedUnit, setSelectedUnit] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS_DATA.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.categorySlug === selectedCategory;
      const matchesUnit =
        selectedUnit === "all" || product.unit === selectedUnit;
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesUnit && matchesSearch;
    });

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedCategory, selectedUnit, searchQuery, sortBy]);

  const addedProductIds = useMemo(() => {
    return new Set(items.map((i) => i.product.id));
  }, [items]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <DeliveryNoticeBanner />

      {/* Page Header */}
      <div className="bg-brand-charcoal text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-brand-charcoal-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-orange-400 uppercase tracking-widest block mb-1">
              Direct-from-Quarry Inventory
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Building Materials Catalogue
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Order River Sand, M-Sand, Plastering Sand, 53 Grade Cement, Fe 550D TMT Steel, and Aggregates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-brand-charcoal-800 text-slate-300 px-3 py-1.5 rounded-lg border border-brand-charcoal-700">
              Showing <strong>{filteredProducts.length}</strong> Materials
            </span>
          </div>
        </div>
      </div>

      {/* Main Catalog Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar Filters (3 Cols) */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6 sticky top-28">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-brand-charcoal flex items-center gap-2">
                  <Filter className="w-4 h-4 text-brand-orange-500" /> Filter Materials
                </h3>
                {(selectedCategory !== "all" || selectedUnit !== "all" || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedUnit("all");
                      setSearchQuery("");
                    }}
                    className="text-[11px] font-bold text-brand-orange-600 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedCategory === "all"
                        ? "bg-brand-charcoal text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="text-[10px] opacity-75">{PRODUCTS_DATA.length}</span>
                  </button>

                  {CATEGORIES_DATA.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                        selectedCategory === cat.slug
                          ? "bg-brand-orange-500 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] opacity-75">{cat.itemCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Measurement Unit Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Unit of Sale
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedUnit("all")}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      selectedUnit === "all"
                        ? "bg-brand-charcoal text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    All Units
                  </button>
                  {MEASUREMENT_UNITS.map((unit) => (
                    <button
                      key={unit}
                      onClick={() => setSelectedUnit(unit)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        selectedUnit === unit
                          ? "bg-brand-orange-500 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Sort Order
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-brand-orange-500"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

            </div>
          </aside>

          {/* Right Product Grid (9 Cols) */}
          <section className="lg:col-span-9 space-y-6">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No materials match your current criteria</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try clearing the category or measurement unit filters to browse our complete building supply catalog.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedUnit("all");
                    setSearchQuery("");
                  }}
                  className="mt-4 px-4 py-2 bg-brand-orange-500 hover:bg-brand-orange-600 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    isAddedToCart={addedProductIds.has(product.id)}
                  />
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

      <Footer />
      <FloatingQuickContact />
      <CartDrawer />
    </div>
  );
}
