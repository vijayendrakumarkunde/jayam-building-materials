"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  Package, 
  Plus, 
  Search, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  X, 
  RefreshCw, 
  DollarSign, 
  SlidersHorizontal,
  Camera,
  Trash2,
  ExternalLink
} from "lucide-react";
import { PRODUCTS_DATA } from "@/lib/data/products";
import { CATEGORIES_DATA } from "@/lib/data/categories";
import { MEASUREMENT_UNITS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>(CATEGORIES_DATA);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State for Adding New Product
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "11111111-1111-1111-1111-111111111101",
    productType: "Natural River Sand",
    basePrice: "",
    measurementUnit: "Ton",
    minOrderQty: "5",
    stockQty: "500",
    inStock: true,
    gradeOrType: "Zone II River Sand",
    description: "",
  });

  // Modal State for Quick Photo Replace on existing product
  const [photoModalProduct, setPhotoModalProduct] = useState<any | null>(null);
  const [replaceUploading, setReplaceUploading] = useState(false);
  const replaceFileRef = useRef<HTMLInputElement | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const supabase = createClient();
    if (!supabase) {
      setProducts(PRODUCTS_DATA);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.products && data.products.length > 0) {
        setProducts(data.products);
      } else {
        setProducts(PRODUCTS_DATA);
      }
    } catch (e) {
      console.error(e);
      setProducts(PRODUCTS_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle File Selection and Upload to Supabase Storage
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    setUploadingImage(true);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", "products");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        alert(data.error || "Failed to upload image to Supabase Storage");
        return;
      }

      setUploadedImageUrl(data.url);
    } catch (err: any) {
      console.error("Upload error:", err);
      alert("Error uploading image.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit New Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalImageUrl = uploadedImageUrl || imagePreview || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

    const payload = {
      name: formData.name,
      category_id: formData.categoryId,
      product_type: formData.productType,
      base_price: Number(formData.basePrice),
      measurement_unit: formData.measurementUnit,
      min_order_qty: Number(formData.minOrderQty),
      stock_qty: Number(formData.stockQty),
      in_stock: formData.inStock,
      grade_or_type: formData.gradeOrType,
      description: formData.description,
      image_url: finalImageUrl,
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || result.error) {
        alert(result.error || "Failed to save product.");
        return;
      }

      // Reset and refresh
      setIsAddModalOpen(false);
      setImagePreview(null);
      setUploadedImageUrl("");
      setFormData({
        name: "",
        categoryId: "11111111-1111-1111-1111-111111111101",
        productType: "",
        basePrice: "",
        measurementUnit: "Ton",
        minOrderQty: "1",
        stockQty: "100",
        inStock: true,
        gradeOrType: "",
        description: "",
      });

      fetchProducts();
      alert("Material added successfully with your uploaded image!");
    } catch (err) {
      console.error(err);
      alert("Error saving material.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Replacing Photo for Existing Product
  const handleReplacePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !photoModalProduct) return;

    setReplaceUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", "products");

      const resUpload = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData,
      });

      const uploadResult = await resUpload.json();
      if (!resUpload.ok || uploadResult.error) {
        alert(uploadResult.error || "Upload failed.");
        setReplaceUploading(false);
        return;
      }

      // Update product with new photo URL
      const resUpdate = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: photoModalProduct.id,
          image_url: uploadResult.url,
        }),
      });

      if (resUpdate.ok) {
        setPhotoModalProduct(null);
        fetchProducts();
        alert("Product photo updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Error replacing photo.");
    } finally {
      setReplaceUploading(false);
    }
  };

  // Filter products by search
  const filteredProducts = products.filter((p) => {
    const catName = p.categories?.name || p.categoryName || "";
    return (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      catName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-brand-orange-500" />
            <span>Materials & Products Catalogue</span>
          </h1>
          <p className="text-xs text-slate-400">
            Add materials, upload your own photos to Supabase Storage, and update rates in ₹.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="p-2.5 rounded-xl bg-brand-charcoal-800 text-slate-400 hover:text-white border border-brand-charcoal-700"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          {/* ADD NEW PRODUCT BUTTON */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold text-xs shadow-lg shadow-brand-orange-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Material & Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-brand-charcoal-900 border border-brand-charcoal-800 flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by material name, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs px-4 py-2.5 pl-9 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <span className="text-xs text-slate-400">
          Showing <strong>{filteredProducts.length}</strong> Materials
        </span>
      </div>

      {/* Products Table with Custom Photo Upload Action */}
      <div className="bg-brand-charcoal-900 rounded-2xl border border-brand-charcoal-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-brand-charcoal-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-4">Material & Photo</th>
                <th className="p-4">Category</th>
                <th className="p-4">Unit of Sale</th>
                <th className="p-4">Wholesale Rate</th>
                <th className="p-4">Min Order</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 text-right">Photo Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-charcoal-800">
              {filteredProducts.map((p) => {
                const img = p.product_images?.[0]?.image_url || p.images?.[0] || "";
                const catName = p.categories?.name || p.categoryName || "General";
                return (
                  <tr key={p.id} className="hover:bg-brand-charcoal-800/40 transition-colors">
                    
                    {/* Material & Image */}
                    <td className="p-4 flex items-center gap-3">
                      <div className="relative group/img w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-brand-charcoal-700 shrink-0">
                        {img ? (
                          <img src={img} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                        <button
                          onClick={() => setPhotoModalProduct(p)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white transition-opacity"
                          title="Change photo"
                        >
                          <Camera className="w-4 h-4 text-brand-orange-400" />
                        </button>
                      </div>

                      <div>
                        <p className="font-bold text-white text-sm">{p.name}</p>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Slug: {p.slug}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-brand-orange-400 font-medium">
                      {catName}
                    </td>

                    <td className="p-4 font-semibold text-slate-200">
                      {p.measurement_unit || p.unit}
                    </td>

                    <td className="p-4 font-black text-white text-sm">
                      {formatCurrency(Number(p.base_price || p.price))}
                    </td>

                    <td className="p-4 text-slate-300">
                      {p.min_order_qty || p.minOrderQuantity} {p.measurement_unit || p.unit}
                    </td>

                    <td className="p-4">
                      {p.in_stock || p.inStock ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> In Stock ({p.stock_qty || p.stockQuantity})
                        </span>
                      ) : (
                        <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full">
                          Out of Stock
                        </span>
                      )}
                    </td>

                    {/* Change Photo Button */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setPhotoModalProduct(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-charcoal-800 hover:bg-brand-charcoal-700 text-brand-orange-400 hover:text-brand-orange-300 border border-brand-charcoal-700 font-bold text-xs transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Change Photo</span>
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD NEW MATERIAL & UPLOAD OWN IMAGE                             */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-charcoal-900 border border-brand-charcoal-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-brand-charcoal-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-brand-orange-500/20 text-brand-orange-400">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Add New Building Material</h3>
                  <p className="text-xs text-slate-400">Upload your own photo and set wholesale pricing</p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-5">
              
              {/* IMAGE UPLOAD SECTION (DRAG & DROP / DEVICE PICKER) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Material Photography (Upload from Your Device) *
                </label>

                <div className="border-2 border-dashed border-brand-charcoal-700 hover:border-brand-orange-500 rounded-2xl p-6 text-center bg-brand-charcoal-950 transition-colors relative">
                  
                  {imagePreview ? (
                    <div className="space-y-3">
                      <div className="relative w-40 h-32 mx-auto rounded-xl overflow-hidden border border-brand-charcoal-700 shadow-lg">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        {uploadingImage && (
                          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white text-xs gap-1">
                            <RefreshCw className="w-5 h-5 animate-spin text-brand-orange-400" />
                            <span>Uploading to Supabase...</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-center gap-3">
                        <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-4 h-4" /> Ready for catalog
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setUploadedImageUrl("");
                          }}
                          className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-brand-charcoal-800 text-brand-orange-400 flex items-center justify-center mx-auto">
                        <Camera className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          Click to select a photo from your computer or phone
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Supports JPG, PNG, WebP up to 10MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-brand-charcoal-800 hover:bg-brand-charcoal-700 text-brand-orange-400 text-xs font-bold border border-brand-charcoal-700"
                      >
                        Browse Files on Device
                      </button>
                    </div>
                  )}

                  {/* Hidden Native File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Material Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Material Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. River Sand (Grade A Triple Washed)"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                  >
                    {CATEGORIES_DATA.map((cat, idx) => (
                      <option key={cat.id} value={`11111111-1111-1111-1111-11111111110${idx + 1}`}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Wholesale Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    placeholder="e.g. 1850"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Unit of Measurement *
                  </label>
                  <select
                    value={formData.measurementUnit}
                    onChange={(e) => setFormData({ ...formData, measurementUnit: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                  >
                    {MEASUREMENT_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Min Order Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.minOrderQty}
                    onChange={(e) => setFormData({ ...formData, minOrderQty: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                  />
                </div>
              </div>

              {/* Initial Stock Quantity & Grade Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Grade / Type Pill Tag
                  </label>
                  <input
                    type="text"
                    value={formData.gradeOrType}
                    onChange={(e) => setFormData({ ...formData, gradeOrType: e.target.value })}
                    placeholder="e.g. Zone II River Sand / Fe 550D"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Stock Quantity Available
                  </label>
                  <input
                    type="number"
                    value={formData.stockQty}
                    onChange={(e) => setFormData({ ...formData, stockQty: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Technical Description & Uses
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Dredged and washed to ensure silt <2.5%. Recommended for RCC columns and roof slabs."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-brand-charcoal-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-brand-charcoal-800 text-slate-400 hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || uploadingImage}
                  className="px-6 py-2.5 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white text-xs font-bold shadow-lg shadow-brand-orange-500/25 flex items-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSubmitting ? "Saving to Supabase..." : "Publish Material to Catalog"}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CHANGE PHOTO ON EXISTING MATERIAL                                */}
      {/* ========================================================================= */}
      {photoModalProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-charcoal-900 border border-brand-charcoal-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-brand-charcoal-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-brand-orange-400" />
                <span>Update Photo for {photoModalProduct.name}</span>
              </h3>
              <button onClick={() => setPhotoModalProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-4">
              <div className="w-40 h-32 rounded-2xl overflow-hidden border border-brand-charcoal-700 mx-auto bg-black">
                <img
                  src={photoModalProduct.product_images?.[0]?.image_url || photoModalProduct.images?.[0]}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-xs text-slate-400">
                Choose a new photo from your device to replace this material's display image:
              </p>

              <input
                ref={replaceFileRef}
                type="file"
                accept="image/*"
                onChange={handleReplacePhotoUpload}
                className="hidden"
              />

              <button
                type="button"
                disabled={replaceUploading}
                onClick={() => replaceFileRef.current?.click()}
                className="w-full py-3 px-4 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>{replaceUploading ? "Uploading to Supabase..." : "Select New Photo from Device"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
