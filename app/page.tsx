"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/public/Navbar";
import { HeroBanner } from "@/components/public/HeroBanner";
import { DeliveryNoticeBanner } from "@/components/public/DeliveryNoticeBanner";
import { CategoryGrid } from "@/components/public/CategoryGrid";
import { ProductCard } from "@/components/public/ProductCard";
import { WhyChooseUs } from "@/components/public/WhyChooseUs";
import { AboutSection } from "@/components/public/AboutSection";
import { CustomerTestimonials } from "@/components/public/CustomerTestimonials";
import { PromotionalBanner } from "@/components/public/PromotionalBanner";
import { ContactSection } from "@/components/public/ContactSection";
import { Footer } from "@/components/public/Footer";
import { FloatingQuickContact } from "@/components/public/FloatingQuickContact";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { PRODUCTS_DATA } from "@/lib/data/products";
import { CATEGORIES_DATA } from "@/lib/data/categories";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/context/CartContext";
import { getMergedProducts } from "@/lib/utils/productStore";
import { Sparkles, Search, Layers, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  const { items, addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>(() => getMergedProducts(PRODUCTS_DATA));
  // Default to primary material: "sand"
  const [selectedCategory, setSelectedCategory] = useState<string>("sand");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleUpdate = () => {
      setProducts(getMergedProducts(PRODUCTS_DATA));
    };
    handleUpdate();
    window.addEventListener("jayam_products_updated", handleUpdate);
    return () => window.removeEventListener("jayam_products_updated", handleUpdate);
  }, []);

  // Filtered products based on search and selected material category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        !selectedCategory ||
        selectedCategory === "all" ||
        product.categorySlug === selectedCategory ||
        (selectedCategory === "sand" && (product.categorySlug === "sand" || product.categorySlug === "aggregates"));
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
    <div className="min-h-screen flex flex-col">
      {/* 1. Professional Navigation Bar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Sleek Compact Hero Banner */}
      <HeroBanner />

      {/* 3. Primary Materials Menu (Direct Visual Category Showcase) */}
      <CategoryGrid
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => {
          setSelectedCategory(slug || "sand");
          const el = document.getElementById("catalog-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* 4. Delivery Notice & Transparent Transport Banner */}
      <DeliveryNoticeBanner />

      {/* 5. Specific Material Varieties Section */}
      <section id="catalog-section" className="py-10 sm:py-14 bg-white border-b border-slate-200 scroll-mt-16">
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
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                    isActive
                      ? "bg-brand-charcoal text-white shadow-lg ring-2 ring-brand-orange-500/40"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-brand-orange-500 text-white"
                        : "bg-slate-200 text-slate-600"
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
              <div className="inline-flex items-center gap-1.5 text-brand-orange-600 text-xs font-bold uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Verified Stock Ready For Dispatch</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-brand-charcoal flex flex-wrap items-center gap-2">
                <span>Available Varieties of {currentCategory?.name || "Selected Material"}</span>
                <span className="text-xs font-semibold bg-brand-orange-100 text-brand-orange-800 px-2.5 py-1 rounded-full">
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
                className="self-start md:self-auto text-xs font-bold text-brand-orange-600 bg-brand-orange-50 border border-brand-orange-200 px-3 py-1.5 rounded-lg hover:bg-brand-orange-100 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Search Query Notice if active */}
          {searchQuery && (
            <div className="mb-6 p-3 rounded-xl bg-slate-100 text-xs text-slate-700 flex items-center justify-between">
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

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-700">No materials matched your filter</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Try selecting a different material from the menu above.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("sand");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-2 bg-brand-charcoal text-white rounded-lg text-xs font-bold"
              >
                View Sand Varieties
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6">
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

      {/* 6. Promotional Banner for Commercial Projects & Batch Supply */}
      <PromotionalBanner />

      {/* 7. Why Choose Us (Four Core Pillars) */}
      <WhyChooseUs />

      {/* 8. About The Company & Quality Promise */}
      <AboutSection />

      {/* 9. Verified Customer Testimonials */}
      <CustomerTestimonials />

      {/* 10. Direct Contact & Dispatch Yard Section */}
      <ContactSection />

      {/* 11. Professional Footer */}
      <Footer />

      {/* 12. Floating WhatsApp and Direct Phone Call CTA */}
      <FloatingQuickContact />

      {/* 13. Shopping Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
