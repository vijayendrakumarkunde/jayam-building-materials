"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { 
  Package, 
  Plus, 
  Search, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  X, 
  RefreshCw, 
  Camera, 
  Trash2, 
  ExternalLink,
  Edit,
  Link2,
  Check,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  Layers
} from "lucide-react";
import { PRODUCTS_DATA } from "@/lib/data/products";
import { CATEGORIES_DATA } from "@/lib/data/categories";
import { MEASUREMENT_UNITS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { 
  getMergedProducts, 
  saveProductOverride, 
  ProductOverride 
} from "@/lib/utils/productStore";
import { Product, MeasurementUnit } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal 1: Add New Product
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addPhotoSource, setAddPhotoSource] = useState<"upload" | "url">("upload");
  const [addUploading, setAddUploading] = useState(false);
  const [addImagePreview, setAddImagePreview] = useState<string | null>(null);
  const [addCustomUrl, setAddCustomUrl] = useState<string>("");
  const addFileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    categorySlug: "sand",
    categoryName: "Sand & Aggregates",
    productType: "Natural Sand",
    price: "",
    mrpPrice: "",
    unit: "Ton" as MeasurementUnit,
    minOrderQuantity: "5",
    stockQuantity: "500",
    inStock: true,
    gradeOrType: "Zone II River Sand",
    description: "",
  });

  // Modal 2: Change Photo
  const [photoModalProduct, setPhotoModalProduct] = useState<Product | null>(null);
  const [photoSourceTab, setPhotoSourceTab] = useState<"device" | "url">("device");
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [photoWebUrl, setPhotoWebUrl] = useState<string>("");
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);
  const replaceFileRef = useRef<HTMLInputElement | null>(null);

  // Modal 3: Edit Material Details (Price, Stock, Name, Unit, etc.)
  const [editModalProduct, setEditModalProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    price: string;
    mrpPrice: string;
    unit: MeasurementUnit;
    inStock: boolean;
    stockQuantity: string;
    gradeOrType: string;
    imageUrl: string;
  }>({
    name: "",
    price: "",
    mrpPrice: "",
    unit: "Ton",
    inStock: true,
    stockQuantity: "100",
    gradeOrType: "",
    imageUrl: "",
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.products && data.products.length > 0) {
        // Map Supabase rows to Product shape if necessary
        const mappedFromDb: Product[] = data.products.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          categorySlug: p.categories?.slug || "sand",
          categoryName: p.categories?.name || "Sand & Aggregates",
          productType: p.product_type || "Building Material",
          description: p.description || "",
          price: Number(p.base_price || 0),
          mrpPrice: p.mrp_price ? Number(p.mrp_price) : undefined,
          unit: (p.measurement_unit || "Ton") as MeasurementUnit,
          minOrderQuantity: Number(p.min_order_qty || 1),
          inStock: Boolean(p.in_stock),
          stockQuantity: Number(p.stock_qty || 0),
          images: p.product_images?.map((img: any) => img.image_url) || [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
          ],
          gradeOrType: p.grade_or_type || "",
          specifications: p.specifications || {},
        }));
        
        // Merge with local overrides
        setProducts(getMergedProducts(mappedFromDb));
      } else {
        // Use default comprehensive PRODUCTS_DATA merged with localStorage overrides
        setProducts(getMergedProducts(PRODUCTS_DATA));
      }
    } catch (e) {
      console.warn("Using offline/cached products:", e);
      setProducts(getMergedProducts(PRODUCTS_DATA));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();

    const handleUpdate = () => {
      setProducts((prev) => getMergedProducts(prev));
    };
    window.addEventListener("jayam_products_updated", handleUpdate);
    return () => window.removeEventListener("jayam_products_updated", handleUpdate);
  }, []);

  // When opening Photo Modal, prepopulate photoPreview
  const handleOpenPhotoModal = (p: Product) => {
    setPhotoModalProduct(p);
    const currentImg = p.images?.[0] || "";
    setPhotoPreview(currentImg);
    setPhotoWebUrl(currentImg);
    setPhotoSourceTab("device");
  };

  // Upload file from device for Photo Modal
  const handlePhotoDeviceFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setPhotoPreview(localUrl);
    setIsSavingPhoto(true);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", "products");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (data.url) {
        setPhotoPreview(data.url);
        setPhotoWebUrl(data.url);
      }
    } catch (err) {
      console.warn("Upload fallback to local preview:", err);
    } finally {
      setIsSavingPhoto(false);
    }
  };

  // Save the new photo (device upload or pasted URL)
  const handleSavePhoto = async () => {
    if (!photoModalProduct) return;
    const finalUrl = photoPreview.trim() || photoWebUrl.trim();
    if (!finalUrl) {
      alert("Please select a photo or enter an image URL.");
      return;
    }

    setIsSavingPhoto(true);
    try {
      // 1. Save locally in localStorage override for instant application
      saveProductOverride({
        id: photoModalProduct.id,
        images: [finalUrl],
      });

      // 2. Persist to API/Supabase
      await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: photoModalProduct.id,
          image_url: finalUrl,
        }),
      });

      // 3. Update state
      setProducts((prev) =>
        prev.map((item) =>
          item.id === photoModalProduct.id
            ? { ...item, images: [finalUrl] }
            : item
        )
      );

      setPhotoModalProduct(null);
      showToast(`Photo updated for "${photoModalProduct.name}"!`);
    } catch (err) {
      console.error(err);
      showToast("Photo saved locally and applied to website.");
      setPhotoModalProduct(null);
    } finally {
      setIsSavingPhoto(false);
    }
  };

  // When opening Edit Details Modal
  const handleOpenEditModal = (p: Product) => {
    setEditModalProduct(p);
    setEditFormData({
      name: p.name,
      price: String(p.price),
      mrpPrice: p.mrpPrice ? String(p.mrpPrice) : "",
      unit: p.unit,
      inStock: p.inStock,
      stockQuantity: String(p.stockQuantity || 100),
      gradeOrType: p.gradeOrType || "",
      imageUrl: p.images?.[0] || "",
    });
  };

  // Save Material Details
  const handleSaveEditDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalProduct) return;

    setIsSavingEdit(true);
    const numericPrice = Number(editFormData.price) || editModalProduct.price;
    const numericMrp = editFormData.mrpPrice ? Number(editFormData.mrpPrice) : undefined;
    const numericStock = Number(editFormData.stockQuantity) || 0;
    const imgUrl = editFormData.imageUrl.trim() || editModalProduct.images[0];

    try {
      // 1. Save locally
      saveProductOverride({
        id: editModalProduct.id,
        name: editFormData.name,
        price: numericPrice,
        mrpPrice: numericMrp,
        unit: editFormData.unit,
        inStock: editFormData.inStock,
        stockQuantity: numericStock,
        gradeOrType: editFormData.gradeOrType,
        images: [imgUrl],
      });

      // 2. Sync to API
      await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editModalProduct.id,
          name: editFormData.name,
          base_price: numericPrice,
          in_stock: editFormData.inStock,
          stock_qty: numericStock,
          grade_or_type: editFormData.gradeOrType,
          image_url: imgUrl,
        }),
      });

      // 3. Update state
      setProducts((prev) =>
        prev.map((item) =>
          item.id === editModalProduct.id
            ? {
                ...item,
                name: editFormData.name,
                price: numericPrice,
                mrpPrice: numericMrp,
                unit: editFormData.unit,
                inStock: editFormData.inStock,
                stockQuantity: numericStock,
                gradeOrType: editFormData.gradeOrType,
                images: [imgUrl],
              }
            : item
        )
      );

      setEditModalProduct(null);
      showToast(`Details updated for "${editFormData.name}"!`);
    } catch (err) {
      console.error(err);
      showToast("Updated successfully!");
      setEditModalProduct(null);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Add Product Image File handler
  const handleAddFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setAddImagePreview(localUrl);
    setAddUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", "products");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (data.url) {
        setAddImagePreview(data.url);
      }
    } catch (err) {
      console.warn("Upload fallback to local preview:", err);
    } finally {
      setAddUploading(false);
    }
  };

  // Submit Add New Product Form
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalImageUrl =
      (addPhotoSource === "url" ? addCustomUrl.trim() : addImagePreview) ||
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

    const matchedCat = CATEGORIES_DATA.find((c) => c.slug === formData.categorySlug);

    const newProd: Product = {
      id: `prod-custom-${Date.now()}`,
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
      categorySlug: formData.categorySlug,
      categoryName: matchedCat?.name || "Sand & Aggregates",
      productType: formData.productType || "Building Material",
      description: formData.description || "Premium construction grade material.",
      price: Number(formData.price),
      mrpPrice: formData.mrpPrice ? Number(formData.mrpPrice) : undefined,
      unit: formData.unit,
      minOrderQuantity: Number(formData.minOrderQuantity) || 1,
      inStock: formData.inStock,
      stockQuantity: Number(formData.stockQuantity) || 100,
      images: [finalImageUrl],
      gradeOrType: formData.gradeOrType,
      specifications: {
        "Usage": "Construction & Structural Work",
        "Grade": formData.gradeOrType || "Standard Grade",
      },
    };

    try {
      // 1. Save in local overrides
      saveProductOverride({
        id: newProd.id,
        name: newProd.name,
        price: newProd.price,
        mrpPrice: newProd.mrpPrice,
        unit: newProd.unit,
        inStock: newProd.inStock,
        stockQuantity: newProd.stockQuantity,
        images: newProd.images,
        gradeOrType: newProd.gradeOrType,
        categorySlug: newProd.categorySlug,
        categoryName: newProd.categoryName,
      });

      // 2. Also send to API
      await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProd.name,
          category_slug: newProd.categorySlug,
          product_type: newProd.productType,
          base_price: newProd.price,
          measurement_unit: newProd.unit,
          min_order_qty: newProd.minOrderQuantity,
          stock_qty: newProd.stockQuantity,
          in_stock: newProd.inStock,
          grade_or_type: newProd.gradeOrType,
          description: newProd.description,
          image_url: finalImageUrl,
        }),
      });

      setProducts((prev) => [newProd, ...prev]);
      setIsAddModalOpen(false);
      setAddImagePreview(null);
      setAddCustomUrl("");
      showToast(`"${newProd.name}" added successfully to the catalog!`);
    } catch (err) {
      console.error(err);
      setProducts((prev) => [newProd, ...prev]);
      setIsAddModalOpen(false);
      showToast(`"${newProd.name}" added to catalog.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "all" || p.categorySlug === selectedCategory;
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(search.toLowerCase()) ||
      (p.gradeOrType && p.gradeOrType.toLowerCase().includes(search.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-xs animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Package className="w-6 h-6 text-brand-orange-500" />
            <span>Materials & Products Catalogue</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage all 10 material categories, update photos from phone or web URLs, and adjust live wholesale rates in ₹.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/products"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 hover:bg-brand-charcoal-700 text-slate-300 hover:text-white border border-brand-charcoal-700 text-xs font-bold transition-all"
            title="View Live Storefront"
          >
            <Eye className="w-4 h-4 text-brand-orange-400" />
            <span className="hidden sm:inline">View Public Store</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>

          <button
            onClick={loadProducts}
            className="p-2.5 rounded-xl bg-brand-charcoal-800 text-slate-400 hover:text-white border border-brand-charcoal-700"
            title="Reload List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          {/* ADD MATERIAL BUTTON */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold text-xs shadow-lg shadow-brand-orange-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Material</span>
          </button>
        </div>
      </div>

      {/* CATEGORY FILTER PILL BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
            selectedCategory === "all"
              ? "bg-brand-orange-500 text-white shadow-md shadow-brand-orange-500/20"
              : "bg-brand-charcoal-900 text-slate-300 hover:bg-brand-charcoal-800 border border-brand-charcoal-800"
          }`}
        >
          <span>All Materials</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
            {products.length}
          </span>
        </button>

        {CATEGORIES_DATA.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          const count = products.filter((p) => p.categorySlug === cat.slug).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                isSelected
                  ? "bg-brand-orange-500 text-white shadow-md shadow-brand-orange-500/20"
                  : "bg-brand-charcoal-900 text-slate-300 hover:bg-brand-charcoal-800 border border-brand-charcoal-800"
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Summary */}
      <div className="p-4 rounded-2xl bg-brand-charcoal-900 border border-brand-charcoal-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search material name, grade, type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs px-4 py-2.5 pl-9 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>
            Displaying <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> items
          </span>
        </div>
      </div>

      {/* Main Materials Table */}
      <div className="bg-brand-charcoal-900 rounded-2xl border border-brand-charcoal-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-brand-charcoal-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-4">Material & Photo</th>
                <th className="p-4">Category</th>
                <th className="p-4">Wholesale Rate</th>
                <th className="p-4">Unit of Sale</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-charcoal-800">
              {filteredProducts.map((p) => {
                const img = p.images?.[0] || "";
                return (
                  <tr key={p.id} className="hover:bg-brand-charcoal-800/40 transition-colors">
                    
                    {/* Material Name & Photo */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div 
                          onClick={() => handleOpenPhotoModal(p)}
                          className="relative group/img w-14 h-14 rounded-xl overflow-hidden bg-slate-800 border border-brand-charcoal-700 shrink-0 cursor-pointer shadow-sm"
                          title="Click to change photo"
                        >
                          {img ? (
                            <img src={img} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                            <Camera className="w-4 h-4 text-brand-orange-400" />
                            <span className="text-[8px] font-bold mt-0.5">Edit</span>
                          </div>
                        </div>

                        <div>
                          <p className="font-bold text-white text-sm hover:text-brand-orange-400 transition-colors">
                            {p.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {p.gradeOrType && (
                              <span className="text-[10px] text-brand-orange-400 font-semibold bg-brand-orange-500/10 px-2 py-0.5 rounded-full">
                                {p.gradeOrType}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-500 font-mono">
                              Min: {p.minOrderQuantity} {p.unit}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-brand-charcoal-800 border border-brand-charcoal-700 text-slate-300 font-semibold text-[11px]">
                        {p.categoryName}
                      </span>
                    </td>

                    {/* Wholesale Rate in ₹ */}
                    <td className="p-4">
                      <div>
                        <span className="font-black text-white text-base">
                          {formatCurrency(Number(p.price))}
                        </span>
                        {p.mrpPrice && p.mrpPrice > p.price && (
                          <span className="block text-[10px] text-slate-500 line-through">
                            MRP ₹{p.mrpPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Unit of Sale */}
                    <td className="p-4 font-bold text-slate-200">
                      Per {p.unit}
                    </td>

                    {/* Stock Status */}
                    <td className="p-4">
                      {p.inStock ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({p.stockQuantity})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-rose-400 font-bold bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                          <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
                        </span>
                      )}
                    </td>

                    {/* Action Buttons: Change Photo & Edit Details */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        
                        {/* Change Photo Button */}
                        <button
                          onClick={() => handleOpenPhotoModal(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-charcoal-800 hover:bg-brand-charcoal-700 text-brand-orange-400 hover:text-brand-orange-300 border border-brand-charcoal-700 font-bold text-xs transition-colors"
                          title="Change Material Photo"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Change Photo</span>
                        </button>

                        {/* Edit Details Button */}
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-charcoal-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-brand-charcoal-700 font-bold text-xs transition-colors"
                          title="Edit Rate & Stock"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CHANGE / UPDATE PHOTO (DEVICE FILE UPLOAD + WEB URL INPUT)          */}
      {/* ========================================================================= */}
      {photoModalProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-charcoal-900 border border-brand-charcoal-700 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in-50">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-brand-charcoal-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-brand-orange-500/20 text-brand-orange-400">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Update Photo</h3>
                  <p className="text-xs text-slate-400 truncate max-w-xs">{photoModalProduct.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setPhotoModalProduct(null)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Photo Preview Card */}
            <div className="text-center space-y-2">
              <div className="relative w-48 h-36 rounded-2xl overflow-hidden border-2 border-brand-charcoal-700 mx-auto bg-black shadow-lg">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => {
                      // fallback if bad URL
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                    <ImageIcon className="w-8 h-8 mb-1" />
                    <span className="text-xs">No image preview</span>
                  </div>
                )}
                {isSavingPhoto && (
                  <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white text-xs gap-1.5">
                    <RefreshCw className="w-5 h-5 animate-spin text-brand-orange-400" />
                    <span>Processing photo...</span>
                  </div>
                )}
              </div>
              <span className="text-[11px] text-slate-400 block">
                Current Live Display Preview
              </span>
            </div>

            {/* Photo Source Tabs (Device Upload vs Web URL) */}
            <div className="grid grid-cols-2 gap-2 bg-brand-charcoal-950 p-1 rounded-2xl border border-brand-charcoal-800">
              <button
                type="button"
                onClick={() => setPhotoSourceTab("device")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  photoSourceTab === "device"
                    ? "bg-brand-orange-500 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload from Device</span>
              </button>
              <button
                type="button"
                onClick={() => setPhotoSourceTab("url")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  photoSourceTab === "url"
                    ? "bg-brand-orange-500 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Paste Image URL</span>
              </button>
            </div>

            {/* TAB 1: DEVICE UPLOAD */}
            {photoSourceTab === "device" && (
              <div className="space-y-3">
                <input
                  ref={replaceFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoDeviceFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => replaceFileRef.current?.click()}
                  className="w-full py-3.5 px-4 rounded-xl border-2 border-dashed border-brand-charcoal-700 hover:border-brand-orange-500 bg-brand-charcoal-950 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all"
                >
                  <Camera className="w-6 h-6 text-brand-orange-400 mb-0.5" />
                  <span>Choose Photo from Phone Camera or Gallery</span>
                  <span className="text-[10px] text-slate-400 font-normal">Supports JPG, PNG, WebP</span>
                </button>
              </div>
            )}

            {/* TAB 2: WEB URL */}
            {photoSourceTab === "url" && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Image Web URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={photoWebUrl}
                    onChange={(e) => {
                      setPhotoWebUrl(e.target.value);
                      setPhotoPreview(e.target.value);
                    }}
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(photoWebUrl)}
                    className="px-3 py-2.5 rounded-xl bg-brand-charcoal-800 hover:bg-brand-charcoal-700 text-brand-orange-400 text-xs font-bold border border-brand-charcoal-700"
                  >
                    Preview
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Paste any image link from Unsplash, Google Images, or manufacturer site.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-3 border-t border-brand-charcoal-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPhotoModalProduct(null)}
                className="px-4 py-2.5 rounded-xl bg-brand-charcoal-800 text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSavingPhoto}
                onClick={handleSavePhoto}
                className="px-5 py-2.5 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white text-xs font-bold shadow-lg shadow-brand-orange-500/25 flex items-center gap-1.5 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>Save & Update Photo</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT MATERIAL DETAILS (PRICE, STOCK, NAME, GRADE)                   */}
      {/* ========================================================================= */}
      {editModalProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-charcoal-900 border border-brand-charcoal-700 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in-50 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-brand-charcoal-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-brand-orange-500/20 text-brand-orange-400">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Edit Material Details</h3>
                  <p className="text-xs text-slate-400">{editModalProduct.categoryName}</p>
                </div>
              </div>
              <button 
                onClick={() => setEditModalProduct(null)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditDetails} className="space-y-4">
              
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Material Name *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                />
              </div>

              {/* Price & MRP */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Wholesale Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    MRP / Strikethrough Price (₹)
                  </label>
                  <input
                    type="number"
                    value={editFormData.mrpPrice}
                    onChange={(e) => setEditFormData({ ...editFormData, mrpPrice: e.target.value })}
                    placeholder="e.g. 2500"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                  />
                </div>
              </div>

              {/* Unit of Sale & Stock Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Unit of Measurement
                  </label>
                  <select
                    value={editFormData.unit}
                    onChange={(e) => setEditFormData({ ...editFormData, unit: e.target.value as MeasurementUnit })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                  >
                    {MEASUREMENT_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Stock Availability
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditFormData({ ...editFormData, inStock: !editFormData.inStock })}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                      editFormData.inStock
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : "bg-rose-500/20 text-rose-400 border-rose-500/40"
                    }`}
                  >
                    {editFormData.inStock ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>In Stock</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Out of Stock</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Stock Quantity & Grade Tag */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={editFormData.stockQuantity}
                    onChange={(e) => setEditFormData({ ...editFormData, stockQuantity: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Grade / Type Badge
                  </label>
                  <input
                    type="text"
                    value={editFormData.gradeOrType}
                    onChange={(e) => setEditFormData({ ...editFormData, gradeOrType: e.target.value })}
                    placeholder="e.g. Zone II / Fe 550D"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                  />
                </div>
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Photo Web URL
                </label>
                <input
                  type="url"
                  value={editFormData.imageUrl}
                  onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-brand-charcoal-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalProduct(null)}
                  className="px-4 py-2.5 rounded-xl bg-brand-charcoal-800 text-slate-400 hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2.5 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white text-xs font-bold shadow-lg shadow-brand-orange-500/25 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSavingEdit ? "Saving..." : "Save Details"}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW MATERIAL & UPLOAD PHOTO                                    */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
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
              
              {/* IMAGE SELECTION */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Material Photo *
                </label>

                {/* Switch between Upload & URL */}
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setAddPhotoSource("upload")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      addPhotoSource === "upload"
                        ? "bg-brand-orange-500 text-white"
                        : "bg-brand-charcoal-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    Upload from Device
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddPhotoSource("url")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      addPhotoSource === "url"
                        ? "bg-brand-orange-500 text-white"
                        : "bg-brand-charcoal-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    Image Web URL
                  </button>
                </div>

                {addPhotoSource === "upload" ? (
                  <div className="border-2 border-dashed border-brand-charcoal-700 hover:border-brand-orange-500 rounded-2xl p-6 text-center bg-brand-charcoal-950 transition-colors relative">
                    {addImagePreview ? (
                      <div className="space-y-3">
                        <div className="relative w-40 h-32 mx-auto rounded-xl overflow-hidden border border-brand-charcoal-700 shadow-lg">
                          <img src={addImagePreview} alt="Preview" className="w-full h-full object-cover" />
                          {addUploading && (
                            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white text-xs gap-1">
                              <RefreshCw className="w-5 h-5 animate-spin text-brand-orange-400" />
                              <span>Uploading...</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-center gap-3">
                          <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
                            <CheckCircle2 className="w-4 h-4" /> Ready for catalog
                          </span>
                          <button
                            type="button"
                            onClick={() => setAddImagePreview(null)}
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
                            Supports JPG, PNG, WebP
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addFileInputRef.current?.click()}
                          className="px-4 py-2 rounded-xl bg-brand-charcoal-800 hover:bg-brand-charcoal-700 text-brand-orange-400 text-xs font-bold border border-brand-charcoal-700"
                        >
                          Browse Files
                        </button>
                      </div>
                    )}

                    <input
                      ref={addFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAddFileSelect}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={addCustomUrl}
                      onChange={(e) => setAddCustomUrl(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                    />
                    {addCustomUrl && (
                      <div className="w-32 h-24 rounded-xl overflow-hidden border border-brand-charcoal-700">
                        <img src={addCustomUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}
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
                    placeholder="e.g. UltraTech Super Cement (53 OPC)"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.categorySlug}
                    onChange={(e) => {
                      const selCat = CATEGORIES_DATA.find((c) => c.slug === e.target.value);
                      setFormData({ 
                        ...formData, 
                        categorySlug: e.target.value,
                        categoryName: selCat?.name || "Sand & Aggregates"
                      });
                    }}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                  >
                    {CATEGORIES_DATA.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
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
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 385"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Unit of Measurement *
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value as MeasurementUnit })}
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
                    value={formData.minOrderQuantity}
                    onChange={(e) => setFormData({ ...formData, minOrderQuantity: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                  />
                </div>
              </div>

              {/* Grade Tag & Stock Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Grade / Type Badge
                  </label>
                  <input
                    type="text"
                    value={formData.gradeOrType}
                    onChange={(e) => setFormData({ ...formData, gradeOrType: e.target.value })}
                    placeholder="e.g. 53 Grade OPC / Fe 550D"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Stock Quantity Available
                  </label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white focus:outline-none focus:border-brand-orange-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Technical Description & Applications
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. High early strength 53 Grade OPC cement for columns, beams, slabs, and bridges."
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
                  disabled={isSubmitting || addUploading}
                  className="px-6 py-2.5 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white text-xs font-bold shadow-lg shadow-brand-orange-500/25 flex items-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSubmitting ? "Publishing..." : "Publish Material to Catalog"}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
