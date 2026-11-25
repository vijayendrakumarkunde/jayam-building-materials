"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Minus,
  Check, 
  ShoppingCart, 
  MessageCircle, 
  Eye, 
  Truck
} from "lucide-react";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useBrandSettings } from "@/lib/utils/settingsStore";
import { useCart } from "@/lib/context/CartContext";
import { ProductDetailModal } from "./ProductDetailModal";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, quantity?: number) => void;
  isAddedToCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart: propOnAddToCart,
  isAddedToCart: propIsAddedToCart = false,
}) => {
  const brand = useBrandSettings();
  const cart = useCart();
  const [selectedQuantity, setSelectedQuantity] = useState<number>(() => product.minOrderQuantity || 1);
  const [justAdded, setJustAdded] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Read current quantity in cart for this product
  const inCartQty = cart.getItemQuantity(product.id);
  const isAdded = propIsAddedToCart || (mounted && inCartQty > 0);
  const onAddToCart = propOnAddToCart || cart.addToCart;

  // Compute MRP and Discount
  const mrp = product.mrpPrice || Math.round(product.price * 1.35 / 50) * 50;
  const discount = product.discountPercent || Math.round(((mrp - product.price) / mrp) * 100);

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedQuantity((prev) => prev + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    if (onAddToCart) {
      onAddToCart(product, selectedQuantity);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const whatsappOrderText = encodeURIComponent(
    `Hello Jayam Building Materials, I would like to inquire about ${product.name} (Wholesale Price: ₹${product.price}/${product.unit}). Please confirm stock & delivery to my site.`
  );

  return (
    <>
      <div 
        className="group flex flex-col justify-between bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 hover:shadow-xl hover:border-[#F47B20]/40 transition-all duration-300 relative"
      >
        <div>
          {/* Visual Image Container with Discount & Stock Badges */}
          <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden bg-[#F5F6F8] flex items-center justify-center p-3 mb-4 group-hover:bg-[#F0F2F5] transition-colors border border-slate-100">
            
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />

            {/* Top-Left Discount Badge */}
            <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
              {discount > 0 && (
                <span className="bg-[#14243A] text-white text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Top-Right Availability Status Pill */}
            <div className="absolute top-2.5 right-2.5 z-10">
              {product.inStock ? (
                <span className="inline-flex items-center gap-1 bg-[#E8F7F0] text-[#159B68] text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200/80 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#159B68]"></span>
                  <span>In Stock</span>
                </span>
              ) : (
                <span className="bg-rose-50 text-rose-600 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border border-rose-200 shadow-xs">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Quick WhatsApp Hover Pill */}
            <a
              href={`https://wa.me/91${brand.whatsappNumber}?text=${whatsappOrderText}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-[#159B68] text-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#108055] hover:scale-110"
              title="Inquire on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
            </a>
          </div>

          {/* Product Category & Name */}
          <div className="space-y-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#F47B20] block">
              {product.categoryName}
            </span>

            <h3 className="font-extrabold text-sm sm:text-base text-[#14243A] group-hover:text-[#F47B20] transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>

            {/* Product Description */}
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed min-h-[2rem]">
              {product.description}
            </p>

            {/* Price & Unit Section */}
            <div className="pt-2 flex items-baseline justify-between border-t border-slate-100 mt-2">
              <div>
                {mrp > product.price && (
                  <span className="text-[11px] text-slate-400 line-through font-medium block">
                    ₹{mrp.toLocaleString("en-IN")}.00
                  </span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-base sm:text-lg font-black text-[#14243A] tracking-tight">
                    ₹{product.price.toLocaleString("en-IN")}.00
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    /{product.unit}
                  </span>
                </div>
              </div>

              {/* Delivery Unit Badge */}
              <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-[#F5F6F8] px-2 py-1 rounded-md">
                <Truck className="w-3 h-3 text-slate-500" />
                <span>Tipper / Truck</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quantity Controls & In-Cart Status */}
        <div className="pt-3 mt-3 border-t border-slate-100 space-y-2.5">
          {/* Pre-Add Quantity Plus/Minus Selector */}
          <div 
            className="flex items-center justify-between gap-2 bg-[#F8F9FA] p-2 rounded-xl border border-slate-200/80"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
              <span>Qty:</span>
              <span className="text-[11px] font-normal text-slate-400">({product.unit}s)</span>
            </div>

            <div className="flex items-center bg-white border border-slate-300 rounded-lg shadow-2xs overflow-hidden">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={selectedQuantity <= 1}
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              
              <span className="w-8 text-center text-xs font-black text-[#14243A] select-none">
                {selectedQuantity}
              </span>

              <button
                type="button"
                onClick={handleIncrement}
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Already in Cart Badge */}
          {mounted && inCartQty > 0 && (
            <div className="flex items-center justify-between text-[11px] font-bold text-[#159B68] bg-[#E8F7F0] px-2.5 py-1 rounded-lg border border-emerald-200/70">
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-[#159B68]" /> In your cart:
              </span>
              <span>{inCartQty} {product.unit}s</span>
            </div>
          )}

          {/* Action Footer: Details & Add to Cart */}
          <div className="grid grid-cols-2 gap-2">
            
            {/* View Details Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsDetailModalOpen(true);
              }}
              className="w-full py-2.5 px-2 rounded-xl border border-slate-200 hover:border-[#14243A] bg-white hover:bg-[#F5F6F8] text-[#14243A] text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Details</span>
            </button>

            {/* Add to Cart Button */}
            {product.inStock ? (
              <button
                type="button"
                onClick={handleAdd}
                className={`w-full py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 ${
                  justAdded
                    ? "bg-[#159B68] text-white"
                    : mounted && inCartQty > 0
                    ? "bg-[#14243A] hover:bg-[#20252D] text-white"
                    : "bg-[#F47B20] hover:bg-[#DC630D] text-white shadow-[#F47B20]/25"
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added!</span>
                  </>
                ) : mounted && inCartQty > 0 ? (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add More</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            ) : (
              <div className="w-full py-2.5 px-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold text-center flex items-center justify-center">
                Unavailable
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Technical Detail Modal */}
      <ProductDetailModal
        product={product}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onAddToCart={onAddToCart}
        isAddedToCart={isAdded}
      />
    </>
  );
};
