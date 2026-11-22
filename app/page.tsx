"use client";

import React, { useState, useMemo } from "react";
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
import { Product } from "@/lib/types";
import { useCart } from "@/lib/context/CartContext";
import { Sparkles, Search } from "lucide-react";

export default function HomePage() {
  const { items, addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered products based on search and category
  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((product) => {
      const matchesCategory =
        !selectedCategory || product.categorySlug === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const addedProductIds = useMemo(() => {
    return new Set(items.map((i) => i.product.id));
  }, [items]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 1. Professional Navigation Bar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Hero Banner with Construction Photography & Dispatch Status */}
      <HeroBanner />

      {/* 3. Delivery Notice & Transparent Transport Banner */}
      <DeliveryNoticeBanner />

      {/* 4. Product Category Showcase (10 Initial Categories) */}
      <CategoryGrid
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => {
          setSelectedCategory(selectedCategory === slug ? null : slug);
          const el = document.getElementById("catalog-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* 5. Main Product Catalog & Filter Section */}
      <section id="catalog-section" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-brand-orange-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Certified Stock</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal">
                {selectedCategory
                  ? `Category: ${selectedCategory.replace("-", " ").toUpperCase()}`
                  : "Featured Construction Materials"}
              </h2>
            </div>

            {/* Quick Filter Reset */}
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="self-start md:self-auto text-xs font-bold text-brand-orange-600 bg-brand-orange-50 border border-brand-orange-200 px-3 py-1.5 rounded-lg hover:bg-brand-orange-100 transition-colors"
              >
                Clear Category Filter (Show All)
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
                Try searching for "River Sand", "M-Sand", "Cement", "Steel", or clear the current category filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-2 bg-brand-charcoal text-white rounded-lg text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
