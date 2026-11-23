"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Check, 
  ArrowUpRight,
  MessageCircle,
  Truck
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
  const [justAdded, setJustAdded] = useState(false);

  // Compute MRP and Discount if not explicitly specified
  const mrp = product.mrpPrice || Math.round(product.price * 1.35 / 50) * 50;
  const discount = product.discountPercent || Math.round(((mrp - product.price) / mrp) * 100);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    if (onAddToCart) {
      onAddToCart(product);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const whatsappOrderText = encodeURIComponent(
    `Hello Jayam Building Materials, I would like to inquire about ${product.name} (Wholesale Price: ₹${product.price}/${product.unit}). Please confirm stock & delivery to my site.`
  );

  return (
    <div className="group flex flex-col justify-between bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-3 sm:p-4 hover:shadow-xl hover:border-slate-300 transition-all duration-300 relative">
      
      <div>
        {/* Visual Image Container with Discount / Stock Badges */}
        <div className="relative h-36 sm:h-48 w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#F8F9FA] flex items-center justify-center p-2 mb-3">
          
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Top-Left Discount Badge (Exact Builders9 Look) */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {discount > 0 && (
              <span className="bg-black text-white text-[9px] sm:text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Out of Stock Pill */}
          {!product.inStock && (
            <div className="absolute top-2 right-2 z-10">
              <span className="bg-white/95 text-slate-800 text-[9px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">
                Out of stock
              </span>
            </div>
          )}

          {/* Quick WhatsApp Hover Pill */}
          <a
            href={`https://wa.me/91${BRAND_INFO.whatsappNumber}?text=${whatsappOrderText}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-700"
            title="Inquire on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
          </a>
        </div>

        {/* Product Information */}
        <div className="space-y-1">
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug min-h-[2.25rem]">
            {product.name}
          </h3>

          <p className="text-[10px] sm:text-xs text-slate-400 font-medium line-clamp-1">
            {product.categoryName}
          </p>

          {/* Price Section */}
          <div className="pt-1.5 space-y-0.5">
            {mrp > product.price && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through font-medium block">
                ₹{mrp.toLocaleString("en-IN")}.00
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                ₹{product.price.toLocaleString("en-IN")}.00
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                /{product.unit}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Footer: "View product" & Circular (+) Button */}
      <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
        <Link
          href={`/products`}
          className="text-[11px] sm:text-xs font-semibold text-slate-700 hover:text-brand-orange-600 transition-colors"
        >
          View product
        </Link>

        {product.inStock ? (
          <button
            type="button"
            onClick={handleAdd}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-sm transition-all active:scale-90 ${
              isAddedToCart || justAdded
                ? "bg-emerald-600 text-white"
                : "bg-slate-900 hover:bg-brand-orange-500 text-white"
            }`}
            title="Add to cart"
          >
            {isAddedToCart || justAdded ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <Plus className="w-4 h-4 text-white" />
            )}
          </button>
        ) : (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm opacity-80">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        )}
      </div>

    </div>
  );
};
