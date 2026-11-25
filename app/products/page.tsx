"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { FloatingQuickContact } from "@/components/public/FloatingQuickContact";
import { DeliveryNoticeBanner } from "@/components/public/DeliveryNoticeBanner";
import { ProductCard } from "@/components/public/ProductCard";
import { PRODUCTS_DATA } from "@/lib/data/products";
import { CATEGORIES_DATA } from "@/lib/data/categories";
import { Product, MeasurementUnit } from "@/lib/types";
import { MEASUREMENT_UNITS } from "@/lib/constants";
import { useCart } from "@/lib/context/CartContext";
import { getMergedProducts, isProductInCategory } from "@/lib/utils/productStore";
import { Search, Filter, RefreshCw, Layers, Sparkles } from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const { items, addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>(() => getMergedProducts(PRODUCTS_DATA));
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedUnit, setSelectedUnit] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const refreshProducts = async () => {
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(getMergedProducts(data.products));
          return;
        }
      }
    } catch (e) {
      console.warn("Could not fetch live products, using local store:", e);
    }
    setProducts(getMergedProducts(PRODUCTS_DATA));
  };

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    refreshProducts();
    const handleUpdate = () => {
      refreshProducts();
    };
    window.addEventListener("jayam_products_updated", handleUpdate);
    return () => window.removeEventListener("jayam_products_updated", handleUpdate);
  }, []);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory = isProductInCategory(product, selectedCategory);
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
  }, [products, selectedCategory, selectedUnit, searchQuery, sortBy]);

  const addedProductIds = useMemo(() => {
    return new Set(items.map((i) => i.product.id));
  }, [items]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#20252D]">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <DeliveryNoticeBanner />

      {/* Page Header in Deep Navy */}
      <div className="bg-[#14243A] text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-[#0F1B2B]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#F47B20] text-xs font-bold uppercase tracking-wider mb-2 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#F47B20]" />
              <span>Direct-from-Quarry & Depot Inventory</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Building Materials Catalogue
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Wholesale pricing for Triple-Washed River Sand, VSI M-Sand, 53 Grade Cement, TMT Steel, Aggregates, Bricks, Blocks, and Foundation Stones with digital weighbridge guarantee.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-[#1F334E] text-slate-200 px-4 py-2 rounded-xl border border-slate-700 font-bold shadow-xs">
              Showing <strong>{filteredProducts.length}</strong> Materials
            </span>
          </div>
        </div>
      </div>

      {/* Fast Category Filter Strip */}
      <div className="bg-[#F5F6F8] border-b border-slate-200 sticky top-16 z-20 py-2.5 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#F47B20]" /> Category:
          </span>
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
              selectedCategory === "all"
                ? "bg-[#14243A] text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            All Categories ({products.length})
          </button>
          {CATEGORIES_DATA.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            const count = products.filter(
              (p) => p.categorySlug === cat.slug || (cat.slug === "sand" && p.categorySlug === "aggregates")
            ).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? "bg-[#F47B20] text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Catalog Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar Filters (Desktop 3 Cols) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-[#F5F6F8] p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 sticky top-36">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-sm font-extrabold text-[#14243A] flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#F47B20]" /> Filter Materials
                </h3>
                {(selectedCategory !== "all" || selectedUnit !== "all" || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedUnit("all");
                      setSearchQuery("");
                    }}
                    className="text-[11px] font-bold text-[#F47B20] hover:underline flex items-center gap-1"
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
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedCategory === "all"
                        ? "bg-[#14243A] text-white"
                        : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="text-[10px] opacity-75">{products.length}</span>
                  </button>

                  {CATEGORIES_DATA.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                        selectedCategory === cat.slug
                          ? "bg-[#F47B20] text-white"
                          : "text-slate-600 hover:bg-white"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] opacity-75">
                        {products.filter((p) => p.categorySlug === cat.slug).length}
                      </span>
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
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      selectedUnit === "all"
                        ? "bg-[#14243A] text-white"
                        : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    All Units
                  </button>
                  {MEASUREMENT_UNITS.map((unit) => (
                    <button
                      key={unit}
                      onClick={() => setSelectedUnit(unit)}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        selectedUnit === unit
                          ? "bg-[#F47B20] text-white"
                          : "text-slate-600 hover:bg-white"
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
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#F47B20] font-medium"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

            </div>
          </aside>

          {/* Right Product Grid */}
          <section className="lg:col-span-9 space-y-6">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-[#F5F6F8] rounded-3xl border border-dashed border-slate-300 p-8 shadow-xs">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#14243A]">No materials match your current criteria</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try clearing the category or measurement unit filters to browse our complete building supply catalog.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedUnit("all");
                    setSearchQuery("");
                  }}
                  className="mt-4 px-5 py-2.5 bg-[#F47B20] hover:bg-[#DC630D] text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
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
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-xs text-slate-400">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
