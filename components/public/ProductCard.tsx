"use client";

import React from "react";
import Link from "next/link";
import { 
  ShoppingCart, 
  Check, 
  MessageCircle, 
  Info, 
  ShieldCheck, 
  PackageCheck
} from "lucide-react";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { BRAND_INFO } from "@/lib/constants";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  isAddedToCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  isAddedToCart = false,
}) => {
  const whatsappOrderText = encodeURIComponent(
    `Hello Jayam Building Materials, I would like to inquire/order ${product.name} (Unit: ${product.unit}, Min Order: ${product.minOrderQuantity} ${product.unit}). Please confirm delivery availability.`
  );
  const productWhatsappUrl = `https://wa.me/91${BRAND_INFO.whatsappNumber}?text=${whatsappOrderText}`;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-brand-orange-300 transition-all duration-300">
      
      {/* Product Image & Badges Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges (Category & Unit) */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="bg-brand-charcoal-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-700">
            {product.categoryName}
          </span>
          <span className="bg-brand-orange-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-md shadow-sm">
            Per {product.unit}
          </span>
        </div>

        {/* Stock Status Tag */}
        <div className="absolute top-3 right-3 z-10">
          {product.inStock ? (
            <span className="inline-flex items-center gap-1 bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              <PackageCheck className="w-3 h-3" /> In Stock
            </span>
          ) : (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          
          {/* Product Type / Grade Tag */}
          {product.gradeOrType && (
            <p className="text-[11px] font-semibold text-brand-orange-600 uppercase tracking-wide">
              {product.gradeOrType}
            </p>
          )}

          <h3 className="text-base font-bold text-brand-charcoal group-hover:text-brand-orange-600 transition-colors line-clamp-2">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Quick Specs Pill */}
          <div className="pt-2 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium border border-slate-200">
              Min. Order: {product.minOrderQuantity} {product.unit}
            </span>
            <span className="inline-flex items-center text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium border border-slate-200">
              Direct Quarry Dispatch
            </span>
          </div>
        </div>

        {/* Pricing & Order Actions */}
        <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
          
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Wholesale Rate</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-brand-charcoal">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  / {product.unit}
                </span>
              </div>
            </div>
            
            <a
              href={productWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
              title="Instant WhatsApp Order"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>

          {/* Buttons: Add to Cart */}
          <button
            onClick={() => onAddToCart?.(product)}
            disabled={!product.inStock}
            className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
              isAddedToCart
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : product.inStock
                ? "bg-brand-charcoal hover:bg-brand-orange-500 text-white active:scale-[0.98]"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isAddedToCart ? (
              <>
                <Check className="w-4 h-4" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" /> Add to Order Cart
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
};
