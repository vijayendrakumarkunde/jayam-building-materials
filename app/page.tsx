"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/public/Navbar";
import { HeroBanner } from "@/components/public/HeroBanner";
import { DeliveryNoticeBanner } from "@/components/public/DeliveryNoticeBanner";
import { CategoryGrid } from "@/components/public/CategoryGrid";
import { ProductCard } from "@/components/public/ProductCard";
import { WhyChooseUs } from "@/components/public/WhyChooseUs";
import { AboutSection } from "@/components/public/AboutSection";
import { ContactSection } from "@/components/public/ContactSection";
import { Footer } from "@/components/public/Footer";
import { FloatingQuickContact } from "@/components/public/FloatingQuickContact";
import { PRODUCTS_DATA } from "@/lib/data/products";
import { CATEGORIES_DATA } from "@/lib/data/categories";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/context/CartContext";
import { getMergedProducts, isProductInCategory } from "@/lib/utils/productStore";
import { Sparkles, Search, Layers, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  const { items, addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>(() => getMergedProducts(PRODUCTS_DATA));
  // Default to primary material: "sand"
  const [selectedCategory, setSelectedCategory] = useState<string>("sand");
  const [searchQuery, setSearchQuery] = useState("");

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
    refreshProducts();
    const handleUpdate = () => {
      refreshProducts();
    };
    window.addEventListener("jayam_products_updated", handleUpdate);
    return () => window.removeEventListener("jayam_products_updated", handleUpdate);
  }, []);

  // Filtered products based on search and selected material category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = isProductInCategory(product, selectedCategory);
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const addedProductIds = useMemo(() => {
    return new Set(items.map((i) => i.product.id));
  }, [items]);

  const currentCategory = useMemo(() => {
    return CATEGORIES_DATA.find((c) => c.slug === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#20252D]">
      {/* 1. Professional Navigation Bar with Announcement Bar & Search */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Modern Industrial Luxury Hero Section with Original AI Photo */}
      <HeroBanner />

      {/* 3. Popular Building Materials Section */}
      <CategoryGrid
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => {
          setSelectedCategory(slug || "sand");
          const el = document.getElementById("catalog-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* 4. Delivery Notice Banner */}
      <DeliveryNoticeBanner />

      {/* 5. Featured Products & Specific Material Varieties Section */}
      <section id="catalog-section" className="py-12 sm:py-16 bg-white border-b border-slate-200 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Quick Material Switcher Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Select:
            </span>
            {CATEGORIES_DATA.map((cat) => {
              const isActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setSearchQuery("");
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                    isActive
                      ? "bg-[#14243A] text-white shadow-md ring-2 ring-[#F47B20]/40"
                      : "bg-[#F5F6F8] text-slate-700 hover:bg-slate-200/80 border border-slate-200/80"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-[#F47B20] text-white"
                        : "bg-white text-slate-600 border border-slate-200"
                    }`}
                  >
                    {cat.itemCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Section Header for Selected Material */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6 sm:mb-8 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[#F47B20] text-xs font-bold uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4 text-[#159B68]" />
                <span>Verified Stock Ready For Dispatch</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#14243A] flex flex-wrap items-center gap-2">
                <span>Available Varieties of {currentCategory?.name || "Selected Material"}</span>
                <span className="text-xs font-bold bg-[#FFF7ED] text-[#F47B20] border border-[#F47B20]/30 px-3 py-1 rounded-full">
                  {filteredProducts.length} Option{filteredProducts.length > 1 ? "s" : ""}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {currentCategory?.description || "Choose your required grade, packaging, or bulk tipper load:"}
              </p>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="self-start md:self-auto text-xs font-bold text-[#F47B20] bg-[#FFF7ED] border border-[#F47B20]/30 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Search Query Notice if active */}
          {searchQuery && (
            <div className="mb-6 p-3 rounded-xl bg-[#F5F6F8] text-xs text-slate-700 flex items-center justify-between border border-slate-200">
              <span>
                Showing results for "<strong>{searchQuery}</strong>" ({filteredProducts.length} materials found)
              </span>
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs font-bold text-rose-600 underline"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Product Cards Grid with consistent dimensions */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-[#F5F6F8] rounded-3xl border border-dashed border-slate-300">
              <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h4 className="text-base font-bold text-[#14243A]">No materials matched your filter</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Try selecting a different material from the menu above.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("sand");
                  setSearchQuery("");
                }}
                className="mt-4 px-5 py-2.5 bg-[#F47B20] hover:bg-[#DC630D] text-white rounded-xl text-xs font-bold shadow-md"
              >
                View Sand Varieties
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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

        </div>
      </section>

      {/* 7. Why Choose Jayam Materials */}
      <WhyChooseUs />

      {/* 8. About The Company & Verified Tonnage */}
      <AboutSection />

      {/* 9. Direct Contact & Dispatch Yard Section */}
      <ContactSection />

      {/* 12. Professional Modern Industrial Luxury Footer */}
      <Footer />

      {/* 13. Floating WhatsApp and Phone CTA */}
      <FloatingQuickContact />
    </div>
  );
}
