"use client";

import React, { useState } from "react";
import { 
  X, 
  Check, 
  ShoppingCart, 
  MessageCircle, 
  Phone, 
  Truck, 
  Scale, 
  ShieldCheck, 
  Sparkles,
  Info
} from "lucide-react";
import { Product } from "@/lib/types";
import { BRAND_INFO } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
  isAddedToCart?: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isAddedToCart = false,
}) => {
  const [quantity, setQuantity] = useState<number>(product?.minOrderQuantity || 1);
  const [justAdded, setJustAdded] = useState(false);

  if (!isOpen || !product) return null;

  const mrp = product.mrpPrice || Math.round(product.price * 1.35 / 50) * 50;
  const discount = product.discountPercent || Math.round(((mrp - product.price) / mrp) * 100);
  const subtotal = product.price * quantity;

  const handleAdd = () => {
    if (!product.inStock) return;
    if (onAddToCart) {
      onAddToCart(product, quantity);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Jayam Building Materials, I would like to order ${quantity} ${product.unit}(s) of ${product.name} (Estimated: ₹${subtotal.toLocaleString("en-IN")}). Please verify stock & site delivery timing.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F5F6F8]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F47B20]">
              {product.categoryName}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500">
              {product.productType || "Building Material"}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center border border-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            {/* Product Image */}
            <div className="sm:col-span-5 relative h-56 sm:h-64 rounded-2xl bg-[#F5F6F8] p-3 flex items-center justify-center overflow-hidden border border-slate-200/80">
              <img
                src={product.images[0]}
                alt={product.name}
                className="max-h-full w-full object-contain mix-blend-multiply"
              />
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-[#14243A] text-white text-xs font-black px-2.5 py-1 rounded-full shadow-xs">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Title & Pricing */}
            <div className="sm:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F7F0] text-[#159B68]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#159B68]"></span>
                <span>{product.inStock ? "In Stock (Ready for Dispatch)" : "Out of Stock"}</span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-[#14243A] leading-snug">
                {product.name}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Price Row */}
              <div className="pt-2 border-t border-slate-100 flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#14243A]">
                  ₹{product.price.toLocaleString("en-IN")}.00
                </span>
                <span className="text-sm font-semibold text-slate-500">
                  / {product.unit}
                </span>
                {mrp > product.price && (
                  <span className="text-xs text-slate-400 line-through ml-1">
                    MRP ₹{mrp.toLocaleString("en-IN")}.00
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="pt-2 flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600">Quantity ({product.unit}s):</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-[#F5F6F8]">
                  <button
                    onClick={() => setQuantity(Math.max((product.minOrderQuantity || 1), quantity - 1))}
                    className="px-3 py-1 text-slate-600 hover:text-slate-900 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-sm font-bold text-[#14243A] min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-slate-600 hover:text-slate-900 font-bold"
                  >
                    +
                  </button>
                </div>
                {product.minOrderQuantity && product.minOrderQuantity > 1 && (
                  <span className="text-[11px] text-slate-400">
                    Min: {product.minOrderQuantity} {product.unit}s
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#F47B20]" /> Technical Specifications
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="p-2.5 rounded-xl bg-[#F5F6F8] border border-slate-200/80 flex justify-between">
                    <span className="text-slate-500 font-medium">{key}:</span>
                    <span className="text-[#14243A] font-bold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quality & Delivery Assurance Badges */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
              <ShieldCheck className="w-4 h-4 text-[#159B68] mx-auto mb-1" />
              <p className="text-[10px] font-bold text-[#14243A]">Verified Quality</p>
              <p className="text-[9px] text-slate-400">Certified Material</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
              <Scale className="w-4 h-4 text-[#F47B20] mx-auto mb-1" />
              <p className="text-[10px] font-bold text-[#14243A]">Digital Slip</p>
              <p className="text-[9px] text-slate-400">Weighbridge Proof</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
              <Truck className="w-4 h-4 text-[#14243A] mx-auto mb-1" />
              <p className="text-[10px] font-bold text-[#14243A]">Direct Unloading</p>
              <p className="text-[9px] text-slate-400">Hydraulic Tipper</p>
            </div>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 bg-[#F5F6F8] border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left w-full sm:w-auto">
            <span className="text-[11px] text-slate-500 block">Total Estimated Cost:</span>
            <span className="text-xl font-black text-[#14243A]">
              ₹{subtotal.toLocaleString("en-IN")}.00
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={`https://wa.me/91${BRAND_INFO.whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#159B68] hover:bg-[#108055] text-white font-bold text-xs transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire WhatsApp</span>
            </a>

            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isAddedToCart || justAdded
                  ? "bg-[#159B68] text-white"
                  : "bg-[#F47B20] hover:bg-[#DC630D] text-white shadow-md shadow-[#F47B20]/25"
              }`}
            >
              {isAddedToCart || justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
