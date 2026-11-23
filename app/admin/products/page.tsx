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
  Layers,
  RotateCcw,
  LayoutGrid,
  Table as TableIcon,
  Save,
  Tag,
  Boxes,
  ShieldCheck,
  Truck,
  Sparkles
} from "lucide-react";
import { PRODUCTS_DATA } from "@/lib/data/products";
import { CATEGORIES_DATA } from "@/lib/data/categories";
import { MEASUREMENT_UNITS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { 
  getMergedProducts, 
  saveProductOverride, 
  deleteProductFromCatalog,
  restoreProductToCatalog,
  getDeletedProductIds,
  ProductOverride 
} from "@/lib/utils/productStore";
import { Product, MeasurementUnit } from "@/lib/types";

// Preset AI product images for 1-click photo assignment
const PRESET_PRODUCT_PHOTOS = [
  { name: "Natural River Sand", url: "/images/products/river-sand.jpg", cat: "sand" },
  { name: "VSI M-Sand (Concrete)", url: "/images/products/m-sand.jpg", cat: "sand" },
  { name: "Blue Metal 20mm Aggregate", url: "/images/products/aggregates-20mm.jpg", cat: "aggregates" },
  { name: "Blue Metal 40mm Aggregate", url: "/images/products/aggregates-40mm.jpg", cat: "aggregates" },
  { name: "Granite Rubble Stone", url: "/images/products/granite-stones.jpg", cat: "aggregates" },
  { name: "53 Grade Cement Bags", url: "/images/products/cement-bags.jpg", cat: "cement" },
  { name: "TMT Steel Fe 550D Bars", url: "/images/products/tmt-steel.jpg", cat: "steel" },
  { name: "Red Clay Bricks", url: "/images/products/red-bricks.jpg", cat: "bricks" },
  { name: "AAC Lightweight Blocks", url: "/images/products/aac-blocks.jpg", cat: "bricks" },
  { name: "Natural Red Soil", url: "/images/products/red-soil.jpg", cat: "soil-stone" },
  { name: "Sand Tipper Truck", url: "/images/products/sand-truck.jpg", cat: "logistics" },
];

// Helper function to robustly match product categories across variants
function isProductInCategory(p: Product, catSlug: string): boolean {
  if (catSlug === "all") return true;

  const pCat = (p.categorySlug || "").toLowerCase();
  const cName = (p.categoryName || "").toLowerCase();
  const pName = (p.name || "").toLowerCase();

  if (catSlug === "sand") {
    return (
      pCat === "sand" ||
      pCat === "river-sand" ||
      pCat === "m-sand" ||
      pCat === "plastering-sand" ||
      pCat === "aggregates" ||
      pCat === "gravel" ||
      cName.includes("sand") ||
      cName.includes("aggregate") ||
      pName.includes("sand") ||
      pName.includes("aggregate") ||
      pName.includes("blue metal")
    );
  }

  if (catSlug === "cement") {
    return pCat === "cement" || cName.includes("cement") || pName.includes("cement");
  }

  if (catSlug === "steel") {
    return pCat === "steel" || cName.includes("steel") || pName.includes("steel") || pName.includes("tmt");
  }

  if (catSlug === "bricks") {
    return (
      pCat === "bricks" ||
      cName.includes("brick") ||
      cName.includes("block") ||
      pName.includes("brick") ||
      pName.includes("block") ||
      pName.includes("aac")
    );
  }

  if (catSlug === "stones") {
    return (
      pCat === "stones" ||
      pCat === "soil-stone" ||
      cName.includes("stone") ||
      pName.includes("rubble") ||
      pName.includes("granite")
    );
  }

  if (catSlug === "red-soil") {
    return (
      pCat === "red-soil" ||
      pCat === "soil-stone" ||
      cName.includes("soil") ||
      pName.includes("soil")
    );
  }

  if (catSlug === "electricals") {
    return (
      pCat === "electricals" ||
      pCat === "other-materials" ||
      cName.includes("electrical") ||
      pName.includes("wire") ||
      pName.includes("cable")
    );
  }

  return pCat === catSlug;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Inline quick editing tracking: { [productId]: { price?: number, stock?: number, isSaving?: boolean } }
  const [quickEdits, setQuickEdits] = useState<Record<string, { price: string; stock: string }>>({});
  const [savingQuickId, setSavingQuickId] = useState<string | null>(null);

  // Modal: Delete Confirmation
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal: Restore Removed Materials
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);

  // Modal: Add New Product
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addPhotoSource, setAddPhotoSource] = useState<"preset" | "upload" | "url">("preset");
  const [addUploading, setAddUploading] = useState(false);
  const [addImagePreview, setAddImagePreview] = useState<string | null>("/images/products/river-sand.jpg");
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

  // Modal: Change Photo
  const [photoModalProduct, setPhotoModalProduct] = useState<Product | null>(null);
  const [photoSourceTab, setPhotoSourceTab] = useState<"preset" | "device" | "url">("preset");
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [photoWebUrl, setPhotoWebUrl] = useState<string>("");
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);
  const replaceFileRef = useRef<HTMLInputElement | null>(null);

  // Modal: Edit Material Full Details
  const [editModalProduct, setEditModalProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    categorySlug: string;
    productType: string;
    price: string;
    mrpPrice: string;
    unit: MeasurementUnit;
    minOrderQuantity: string;
    inStock: boolean;
    stockQuantity: string;
    gradeOrType: string;
    imageUrl: string;
    description: string;
  }>({
    name: "",
    categorySlug: "sand",
    productType: "",
    price: "",
    mrpPrice: "",
    unit: "Ton",
    minOrderQuantity: "1",
    inStock: true,
    stockQuantity: "100",
    gradeOrType: "",
    imageUrl: "",
    description: "",
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadProducts = async () => {
    setLoading(true);
    setDeletedIds(getDeletedProductIds());
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();
      if (data.products && Array.isArray(data.products) && data.products.length > 0) {
        const merged = getMergedProducts(data.products);
        setProducts(merged);
        initQuickEdits(merged);
      } else {
        const merged = getMergedProducts(PRODUCTS_DATA);
        setProducts(merged);
        initQuickEdits(merged);
      }
    } catch (e) {
      console.warn("Using offline/cached products:", e);
      const merged = getMergedProducts(PRODUCTS_DATA);
      setProducts(merged);
      initQuickEdits(merged);
    } finally {
      setLoading(false);
    }
  };

  const initQuickEdits = (prods: Product[]) => {
    const edits: Record<string, { price: string; stock: string }> = {};
    prods.forEach((p) => {
      edits[p.id] = {
        price: String(p.price),
        stock: String(p.stockQuantity || 0),
      };
    });
    setQuickEdits(edits);
  };

  useEffect(() => {
    loadProducts();

    const handleUpdate = () => {
      loadProducts();
    };
    window.addEventListener("jayam_products_updated", handleUpdate);
    return () => window.removeEventListener("jayam_products_updated", handleUpdate);
  }, []);

  // Handle Quick Price & Stock Save
  const handleSaveQuickPriceAndStock = async (product: Product) => {
    const edit = quickEdits[product.id];
    if (!edit) return;

    const newPrice = Number(edit.price);
    const newStock = Number(edit.stock);

    if (isNaN(newPrice) || newPrice < 0) {
      alert("Please enter a valid price.");
      return;
    }

    setSavingQuickId(product.id);
    try {
      // 1. Save locally with both id and slug
      saveProductOverride({
        id: product.id,
        slug: product.slug,
        price: newPrice,
        stockQuantity: newStock,
        inStock: newStock > 0 ? product.inStock : false,
      });

      // 2. Persist to API
      await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          slug: product.slug,
          base_price: newPrice,
          stock_qty: newStock,
          in_stock: newStock > 0 ? product.inStock : false,
        }),
      });

      // 3. Update state
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? { ...p, price: newPrice, stockQuantity: newStock, inStock: newStock > 0 ? p.inStock : false }
            : p
        )
      );

      showToast(`Updated rate for "${product.name}" to ₹${newPrice.toLocaleString("en-IN")}`);
    } catch (err) {
      console.error(err);
      showToast(`Saved locally: ₹${newPrice}`);
    } finally {
      setSavingQuickId(null);
    }
  };

  // Quick In-Stock Toggle
  const handleToggleInStock = async (product: Product) => {
    const nextInStock = !product.inStock;
    try {
      // 1. Save locally
      saveProductOverride({
        id: product.id,
        slug: product.slug,
        inStock: nextInStock,
      });

      // 2. Persist to API
      await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          slug: product.slug,
          in_stock: nextInStock,
        }),
      });

      // 3. Update state
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, inStock: nextInStock } : p))
      );

      showToast(`${product.name} is now ${nextInStock ? "IN STOCK" : "OUT OF STOCK"}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Remove / Delete Material
  const handleConfirmDelete = async () => {
    if (!deleteConfirmProduct) return;
    setIsDeleting(true);
    const prodToRemove = deleteConfirmProduct;

    try {
      // 1. Delete locally from catalog state & localStorage
      deleteProductFromCatalog(prodToRemove.id, prodToRemove.slug);

      // 2. Call API DELETE endpoint
      await fetch(`/api/admin/products?id=${prodToRemove.id}&slug=${prodToRemove.slug}`, {
        method: "DELETE",
      });

      // 3. Update state
      setProducts((prev) => prev.filter((p) => p.id !== prodToRemove.id));
      setDeletedIds(getDeletedProductIds());
      setDeleteConfirmProduct(null);
      showToast(`"${prodToRemove.name}" removed from catalog.`);
    } catch (err) {
      console.error(err);
      setProducts((prev) => prev.filter((p) => p.id !== prodToRemove.id));
      setDeletedIds(getDeletedProductIds());
      setDeleteConfirmProduct(null);
      showToast(`"${prodToRemove.name}" removed.`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Restore Material
  const handleRestoreProduct = (id: string) => {
    restoreProductToCatalog(id);
    loadProducts();
    showToast("Material restored to catalog!");
  };

  // When opening Photo Modal
  const handleOpenPhotoModal = (p: Product) => {
    setPhotoModalProduct(p);
    const currentImg = p.images?.[0] || "/images/products/river-sand.jpg";
    setPhotoPreview(currentImg);
    setPhotoWebUrl(currentImg);
    setPhotoSourceTab("preset");
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

  // Save the new photo (preset, device upload or pasted URL)
  const handleSavePhoto = async () => {
    if (!photoModalProduct) return;
    const finalUrl = (photoSourceTab === "url" ? photoWebUrl.trim() : photoPreview.trim()) || photoModalProduct.images[0];
    if (!finalUrl) {
      alert("Please select a photo or enter an image URL.");
      return;
    }

    setIsSavingPhoto(true);
    try {
      // 1. Save locally in localStorage override with id & slug
      saveProductOverride({
        id: photoModalProduct.id,
        slug: photoModalProduct.slug,
        images: [finalUrl],
      });

      // 2. Persist to API/Supabase
      await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: photoModalProduct.id,
          slug: photoModalProduct.slug,
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
      categorySlug: p.categorySlug,
      productType: p.productType,
      price: String(p.price),
      mrpPrice: p.mrpPrice ? String(p.mrpPrice) : "",
      unit: p.unit,
      minOrderQuantity: String(p.minOrderQuantity || 1),
      inStock: p.inStock,
      stockQuantity: String(p.stockQuantity || 100),
      gradeOrType: p.gradeOrType || "",
      imageUrl: p.images?.[0] || "/images/products/river-sand.jpg",
      description: p.description || "",
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
    const numericMinOrder = Number(editFormData.minOrderQuantity) || 1;
    const imgUrl = editFormData.imageUrl.trim() || editModalProduct.images[0];
    const cat = CATEGORIES_DATA.find((c) => c.slug === editFormData.categorySlug);

    try {
      // 1. Save locally with id and slug
      saveProductOverride({
        id: editModalProduct.id,
        slug: editModalProduct.slug,
        name: editFormData.name,
        categorySlug: editFormData.categorySlug,
        categoryName: cat?.name || editModalProduct.categoryName,
        price: numericPrice,
        mrpPrice: numericMrp,
        unit: editFormData.unit,
        inStock: editFormData.inStock,
        stockQuantity: numericStock,
        gradeOrType: editFormData.gradeOrType,
        images: [imgUrl],
        description: editFormData.description,
      });

      // 2. Sync to API
      await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editModalProduct.id,
          slug: editModalProduct.slug,
          name: editFormData.name,
          category_slug: editFormData.categorySlug,
          product_type: editFormData.productType,
          base_price: numericPrice,
          mrp_price: numericMrp,
          in_stock: editFormData.inStock,
          stock_qty: numericStock,
          measurement_unit: editFormData.unit,
          min_order_qty: numericMinOrder,
          grade_or_type: editFormData.gradeOrType,
          description: editFormData.description,
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
                categorySlug: editFormData.categorySlug,
                categoryName: cat?.name || item.categoryName,
                productType: editFormData.productType,
                price: numericPrice,
                mrpPrice: numericMrp,
                unit: editFormData.unit,
                minOrderQuantity: numericMinOrder,
                inStock: editFormData.inStock,
                stockQuantity: numericStock,
                gradeOrType: editFormData.gradeOrType,
                images: [imgUrl],
                description: editFormData.description,
              }
            : item
        )
      );

      // Also update quick edits
      setQuickEdits((prev) => ({
        ...prev,
        [editModalProduct.id]: {
          price: String(numericPrice),
          stock: String(numericStock),
        },
      }));

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
      "/images/products/river-sand.jpg";

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
        slug: newProd.slug,
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
        description: newProd.description,
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
          mrp_price: newProd.mrpPrice,
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
      initQuickEdits([newProd, ...products]);
      setIsAddModalOpen(false);
      setAddImagePreview("/images/products/river-sand.jpg");
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
    const matchesCategory = isProductInCategory(p, selectedCategory);
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(search.toLowerCase()) ||
      (p.gradeOrType && p.gradeOrType.toLowerCase().includes(search.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Calculate live stats
  const totalProductsCount = products.length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = totalProductsCount - inStockCount;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#159B68] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-xs animate-in slide-in-from-top-3 border border-emerald-400/40">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header with Modern Industrial Luxury styling */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#F47B20]/10 text-[#F47B20]">
              <Package className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#14243A] tracking-tight">
              Materials & Products Catalogue
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 max-w-xl">
            Live catalog control for JAYAM BUILDING MATERIALS. Edit wholesale prices (₹), update photos from camera/file/URL, adjust stock quantities, and remove materials in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Public Store Link */}
          <Link
            href="/products"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#F5F6F8] hover:bg-slate-200/80 text-[#14243A] border border-slate-200 text-xs font-bold transition-all"
            title="View Live Storefront"
          >
            <Eye className="w-4 h-4 text-[#F47B20]" />
            <span className="hidden sm:inline">Live Store</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          {/* Refresh Button */}
          <button
            onClick={loadProducts}
            className="p-2.5 rounded-xl bg-[#F5F6F8] text-slate-600 hover:text-[#14243A] border border-slate-200 hover:bg-slate-200/80 transition-colors"
            title="Reload from Cloud Database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#F47B20]" : ""}`} />
          </button>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-[#F5F6F8] p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === "grid"
                  ? "bg-white text-[#14243A] shadow-xs"
                  : "text-slate-500 hover:text-[#14243A]"
              }`}
              title="Storefront Card View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline text-[11px]">Cards</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === "table"
                  ? "bg-white text-[#14243A] shadow-xs"
                  : "text-slate-500 hover:text-[#14243A]"
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
              <span className="hidden md:inline text-[11px]">Table</span>
            </button>
          </div>

          {/* Removed Materials Button */}
          {deletedIds.length > 0 && (
            <button
              onClick={() => setIsRestoreModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-all"
              title="View removed materials"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Removed ({deletedIds.length})</span>
            </button>
          )}

          {/* Add New Material Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F47B20] hover:bg-[#DC630D] text-white font-black text-xs shadow-md shadow-[#F47B20]/25 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Material</span>
          </button>
        </div>
      </div>

      {/* 2. Key Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Materials</span>
            <span className="text-xl sm:text-2xl font-black text-[#14243A]">{totalProductsCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">In Stock</span>
            <span className="text-xl sm:text-2xl font-black text-[#159B68]">{inStockCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#E8F7F0] text-[#159B68] flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Out of Stock</span>
            <span className="text-xl sm:text-2xl font-black text-rose-500">{outOfStockCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Categories</span>
            <span className="text-xl sm:text-2xl font-black text-[#F47B20]">{CATEGORIES_DATA.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FFF6EE] text-[#F47B20] flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Category Filter Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
            selectedCategory === "all"
              ? "bg-[#14243A] text-white shadow-md shadow-[#14243A]/20"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>All Materials</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            selectedCategory === "all" ? "bg-[#F47B20] text-white" : "bg-slate-100 text-slate-600"
          }`}>
            {products.length}
          </span>
        </button>

        {CATEGORIES_DATA.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          const count = products.filter((p) => isProductInCategory(p, cat.slug)).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                isSelected
                  ? "bg-[#14243A] text-white shadow-md shadow-[#14243A]/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isSelected ? "bg-[#F47B20] text-white" : "bg-slate-100 text-slate-600"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Search and Controls Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search material name, grade, type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs px-4 py-2.5 pl-9 rounded-xl bg-[#F5F6F8] border border-slate-200 text-[#14243A] placeholder-slate-400 focus:outline-none focus:border-[#F47B20] focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> building materials
        </div>
      </div>

      {/* 5. Main Materials Display: Grid Cards View vs Compact Table View */}
      {viewMode === "grid" ? (
        /* ================= STOREFRONT CARD VIEW ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((p) => {
            const img = p.images?.[0] || "/images/products/river-sand.jpg";
            const quick = quickEdits[p.id] || { price: String(p.price), stock: String(p.stockQuantity || 0) };
            const isSavingThis = savingQuickId === p.id;
            const hasChanged = Number(quick.price) !== p.price || Number(quick.stock) !== (p.stockQuantity || 0);

            return (
              <div 
                key={p.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container with Change Photo Overlay */}
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-[#F5F6F8] flex items-center justify-center p-3 mb-4 border border-slate-100 group/img">
                    <img 
                      src={img} 
                      alt={p.name} 
                      className="w-full h-full object-contain mix-blend-multiply group-hover/img:scale-105 transition-transform duration-300"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
                      <span className="bg-[#14243A] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                        {p.categoryName}
                      </span>
                    </div>

                    {/* Stock Status Badge */}
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <button
                        onClick={() => handleToggleInStock(p)}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-xs transition-transform active:scale-95 ${
                          p.inStock
                            ? "bg-[#E8F7F0] text-[#159B68] border-emerald-200"
                            : "bg-rose-50 text-rose-600 border-rose-200"
                        }`}
                        title="Click to toggle In Stock / Out of Stock"
                      >
                        <span className={`w-2 h-2 rounded-full ${p.inStock ? "bg-[#159B68]" : "bg-rose-500"}`}></span>
                        <span>{p.inStock ? "In Stock" : "Out of Stock"}</span>
                      </button>
                    </div>

                    {/* Hover "Change Photo" Button */}
                    <button
                      onClick={() => handleOpenPhotoModal(p)}
                      className="absolute bottom-2.5 right-2.5 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#14243A]/90 hover:bg-[#14243A] text-white text-[11px] font-bold shadow-md backdrop-blur-sm transition-all transform hover:scale-105"
                      title="Update product photo"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#F47B20]" />
                      <span>Change Photo</span>
                    </button>
                  </div>

                  {/* Title & Grade */}
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-base text-[#14243A] line-clamp-1">
                        {p.name}
                      </h3>
                      {p.gradeOrType && (
                        <span className="text-[10px] font-bold text-[#F47B20] bg-[#FFF6EE] px-2 py-0.5 rounded-md shrink-0">
                          {p.gradeOrType}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed min-h-[2rem]">
                      {p.description || "High-grade verified building material."}
                    </p>
                  </div>

                  {/* Inline Price & Stock Quantity Quick Controls */}
                  <div className="mt-4 p-3 rounded-2xl bg-[#F5F6F8] border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                        <span>Wholesale Rate (₹/{p.unit})</span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-2.5 text-xs font-bold text-slate-400">₹</span>
                        <input
                          type="number"
                          value={quick.price}
                          onChange={(e) =>
                            setQuickEdits((prev) => ({
                              ...prev,
                              [p.id]: { ...quick, price: e.target.value },
                            }))
                          }
                          className="w-28 text-xs font-black pl-6 pr-2 py-1.5 rounded-lg bg-white border border-slate-300 text-[#14243A] focus:outline-none focus:border-[#F47B20]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                        <span>Stock Quantity</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={quick.stock}
                          onChange={(e) =>
                            setQuickEdits((prev) => ({
                              ...prev,
                              [p.id]: { ...quick, stock: e.target.value },
                            }))
                          }
                          className="w-20 text-xs font-bold px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-[#14243A] text-right focus:outline-none focus:border-[#F47B20]"
                        />
                        <span className="text-[10px] font-semibold text-slate-500">{p.unit}</span>
                      </div>
                    </div>

                    {/* Quick Save Rate & Stock Button */}
                    <button
                      onClick={() => handleSaveQuickPriceAndStock(p)}
                      disabled={isSavingThis}
                      className={`w-full py-1.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                        hasChanged
                          ? "bg-[#159B68] text-white hover:bg-emerald-700 shadow-sm"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {isSavingThis ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving to Cloud...</span>
                        </>
                      ) : hasChanged ? (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Changed Rate & Stock</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Rate & Stock Saved</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Action Buttons: Edit Full Details & Remove Material */}
                <div className="pt-4 mt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenEditModal(p)}
                    className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-[#14243A] border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    title="Edit name, unit, description, specs"
                  >
                    <Edit className="w-3.5 h-3.5 text-[#F47B20]" />
                    <span>Edit Details</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirmProduct(p)}
                    className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    title="Remove from Catalog"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ================= COMPACT TABLE VIEW ================= */
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#20252D]">
              <thead className="bg-[#F5F6F8] text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Material & Photo</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Wholesale Rate</th>
                  <th className="p-4">Unit</th>
                  <th className="p-4">Stock Qty</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const img = p.images?.[0] || "/images/products/river-sand.jpg";
                  const quick = quickEdits[p.id] || { price: String(p.price), stock: String(p.stockQuantity || 0) };

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div 
                            onClick={() => handleOpenPhotoModal(p)}
                            className="relative group/img w-12 h-12 rounded-xl overflow-hidden bg-[#F5F6F8] border border-slate-200 shrink-0 cursor-pointer shadow-xs flex items-center justify-center"
                            title="Click to change photo"
                          >
                            <img src={img} alt={p.name} className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                              <Camera className="w-3.5 h-3.5 text-[#F47B20]" />
                            </div>
                          </div>
                          <div>
                            <p className="font-extrabold text-[#14243A] text-sm">{p.name}</p>
                            <span className="text-[10px] text-[#F47B20] font-semibold">{p.gradeOrType || p.productType}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-lg bg-[#F5F6F8] border border-slate-200 text-slate-600 font-semibold text-[11px]">
                          {p.categoryName}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-400">₹</span>
                          <input
                            type="number"
                            value={quick.price}
                            onChange={(e) =>
                              setQuickEdits((prev) => ({
                                ...prev,
                                [p.id]: { ...quick, price: e.target.value },
                              }))
                            }
                            className="w-24 text-xs font-black px-2 py-1 rounded bg-slate-50 border border-slate-200 text-[#14243A]"
                          />
                        </div>
                      </td>

                      <td className="p-4 font-bold text-slate-600">
                        {p.unit}
                      </td>

                      <td className="p-4">
                        <input
                          type="number"
                          value={quick.stock}
                          onChange={(e) =>
                            setQuickEdits((prev) => ({
                              ...prev,
                              [p.id]: { ...quick, stock: e.target.value },
                            }))
                          }
                          className="w-20 text-xs font-bold px-2 py-1 rounded bg-slate-50 border border-slate-200 text-[#14243A]"
                        />
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleToggleInStock(p)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                            p.inStock
                              ? "bg-[#E8F7F0] text-[#159B68] border-emerald-200"
                              : "bg-rose-50 text-rose-600 border-rose-200"
                          }`}
                        >
                          {p.inStock ? "In Stock" : "Out of Stock"}
                        </button>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSaveQuickPriceAndStock(p)}
                            className="p-1.5 rounded-lg bg-[#159B68] text-white hover:bg-emerald-700"
                            title="Save Rate & Stock"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenPhotoModal(p)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="Change Photo"
                          >
                            <Camera className="w-3.5 h-3.5 text-[#F47B20]" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="Edit Details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmProduct(p)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CHANGE / UPDATE PHOTO (PRESET AI GALLERY + DEVICE + URL)        */}
      {/* ========================================================================= */}
      {photoModalProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in-50">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#FFF6EE] text-[#F47B20]">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#14243A]">Change Product Photo</h3>
                  <p className="text-xs text-slate-500 truncate max-w-xs">{photoModalProduct.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setPhotoModalProduct(null)} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current / Selected Image Preview */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#F5F6F8] border border-slate-200">
              <div className="w-40 h-40 rounded-2xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-contain p-2" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-slate-300" />
                )}
              </div>
              <span className="text-[11px] font-semibold text-slate-500 mt-2">Active Photo Preview</span>
            </div>

            {/* Tabs for Source */}
            <div className="flex rounded-xl bg-[#F5F6F8] p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setPhotoSourceTab("preset")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  photoSourceTab === "preset"
                    ? "bg-white text-[#14243A] shadow-xs"
                    : "text-slate-500 hover:text-[#14243A]"
                }`}
              >
                ✨ AI Material Library
              </button>
              <button
                type="button"
                onClick={() => setPhotoSourceTab("device")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  photoSourceTab === "device"
                    ? "bg-white text-[#14243A] shadow-xs"
                    : "text-slate-500 hover:text-[#14243A]"
                }`}
              >
                📱 Upload from Device
              </button>
              <button
                type="button"
                onClick={() => setPhotoSourceTab("url")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  photoSourceTab === "url"
                    ? "bg-white text-[#14243A] shadow-xs"
                    : "text-slate-500 hover:text-[#14243A]"
                }`}
              >
                🔗 Custom URL
              </button>
            </div>

            {/* Source Content */}
            {photoSourceTab === "preset" && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-600 block">Select from Jayam High-Res AI Product Photos:</span>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
                  {PRESET_PRODUCT_PHOTOS.map((preset) => {
                    const isSelected = photoPreview === preset.url;
                    return (
                      <div
                        key={preset.url}
                        onClick={() => {
                          setPhotoPreview(preset.url);
                          setPhotoWebUrl(preset.url);
                        }}
                        className={`group relative rounded-xl overflow-hidden border p-1 cursor-pointer transition-all aspect-square flex flex-col items-center justify-center bg-white ${
                          isSelected ? "border-[#F47B20] ring-2 ring-[#F47B20]/30" : "border-slate-200 hover:border-slate-300"
                        }`}
                        title={preset.name}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-contain" />
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-[#F47B20] text-white rounded-full p-0.5">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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
                  className="w-full py-8 border-2 border-dashed border-slate-300 hover:border-[#F47B20] rounded-2xl flex flex-col items-center justify-center gap-2 bg-[#F5F6F8] hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <Upload className="w-6 h-6 text-[#F47B20]" />
                  <span className="text-xs font-bold text-[#14243A]">Choose file from phone or computer</span>
                  <span className="text-[10px] text-slate-400">JPG, PNG, WebP up to 10MB</span>
                </button>
              </div>
            )}

            {photoSourceTab === "url" && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block">Direct Image Web Address (URL):</label>
                <input
                  type="url"
                  placeholder="https://example.com/materials/sand.jpg"
                  value={photoWebUrl}
                  onChange={(e) => {
                    setPhotoWebUrl(e.target.value);
                    setPhotoPreview(e.target.value);
                  }}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#F47B20]"
                />
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPhotoModalProduct(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePhoto}
                disabled={isSavingPhoto}
                className="px-5 py-2.5 rounded-xl bg-[#F47B20] hover:bg-[#DC630D] text-white text-xs font-black shadow-md shadow-[#F47B20]/25 transition-all flex items-center gap-2"
              >
                {isSavingPhoto ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply & Save Photo</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT FULL MATERIAL DETAILS ("CHANGE EVERYTHING")                 */}
      {/* ========================================================================= */}
      {editModalProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in-50 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#FFF6EE] text-[#F47B20]">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#14243A]">Edit Material Details</h3>
                  <p className="text-xs text-slate-500">Change name, category, pricing, stock and specs</p>
                </div>
              </div>
              <button 
                onClick={() => setEditModalProduct(null)} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditDetails} className="space-y-4">
              
              {/* Product Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Material Name *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 text-[#14243A] focus:outline-none focus:border-[#F47B20]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={editFormData.categorySlug}
                    onChange={(e) => setEditFormData({ ...editFormData, categorySlug: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 text-[#14243A] bg-white focus:outline-none focus:border-[#F47B20]"
                  >
                    {CATEGORIES_DATA.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grade / Type & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Grade / Quality</label>
                  <input
                    type="text"
                    placeholder="e.g. Zone II, 53 Grade"
                    value={editFormData.gradeOrType}
                    onChange={(e) => setEditFormData({ ...editFormData, gradeOrType: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 text-[#14243A] focus:outline-none focus:border-[#F47B20]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Unit of Sale *</label>
                  <select
                    value={editFormData.unit}
                    onChange={(e) => setEditFormData({ ...editFormData, unit: e.target.value as MeasurementUnit })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 text-[#14243A] bg-white focus:outline-none focus:border-[#F47B20]"
                  >
                    {MEASUREMENT_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Min Order Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={editFormData.minOrderQuantity}
                    onChange={(e) => setEditFormData({ ...editFormData, minOrderQuantity: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 text-[#14243A] focus:outline-none focus:border-[#F47B20]"
                  />
                </div>
              </div>

              {/* Price, MRP, Stock & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#F5F6F8] border border-slate-200">
                <div>
                  <label className="text-xs font-bold text-[#14243A] block mb-1">Wholesale Rate (₹) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editFormData.price}
                      onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                      className="w-full text-xs font-black pl-7 pr-3 py-2 rounded-xl bg-white border border-slate-300 text-[#14243A] focus:outline-none focus:border-[#F47B20]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">MRP Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Optional"
                      value={editFormData.mrpPrice}
                      onChange={(e) => setEditFormData({ ...editFormData, mrpPrice: e.target.value })}
                      className="w-full text-xs pl-7 pr-3 py-2 rounded-xl bg-white border border-slate-300 text-[#14243A] focus:outline-none focus:border-[#F47B20]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={editFormData.stockQuantity}
                    onChange={(e) => setEditFormData({ ...editFormData, stockQuantity: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-300 text-[#14243A] focus:outline-none focus:border-[#F47B20]"
                  />
                </div>

                <div className="sm:col-span-3 flex items-center justify-between pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="edit-in-stock-checkbox"
                      checked={editFormData.inStock}
                      onChange={(e) => setEditFormData({ ...editFormData, inStock: e.target.checked })}
                      className="w-4 h-4 text-[#F47B20] rounded border-slate-300 focus:ring-[#F47B20]"
                    />
                    <label htmlFor="edit-in-stock-checkbox" className="text-xs font-bold text-[#14243A] cursor-pointer">
                      Mark as In Stock (Available for ordering)
                    </label>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    editFormData.inStock ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                  }`}>
                    {editFormData.inStock ? "Active in Store" : "Shown as Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Photo URL */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={editFormData.imageUrl}
                  onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 text-[#14243A] focus:outline-none focus:border-[#F47B20]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 text-[#14243A] focus:outline-none focus:border-[#F47B20]"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModalProduct(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-6 py-2.5 rounded-xl bg-[#F47B20] hover:bg-[#DC630D] text-white text-xs font-black shadow-md shadow-[#F47B20]/25 transition-all flex items-center gap-2"
                >
                  {isSavingEdit ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save All Details</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD NEW PRODUCT                                                  */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in-50 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#FFF6EE] text-[#F47B20]">
                  <Plus className="w-5 h-5 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#14243A]">Add New Building Material</h3>
                  <p className="text-xs text-slate-500">Insert material into database catalogue and public store</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Material Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stone Dust / Quarry Dust"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 text-[#14243A] focus:outline-none focus:border-[#F47B20]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={formData.categorySlug}
                    onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 text-[#14243A] bg-white focus:outline-none focus:border-[#F47B20]"
                  >
                    {CATEGORIES_DATA.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Grade / Quality</label>
                  <input
                    type="text"
                    placeholder="e.g. 0-4mm Washed"
                    value={formData.gradeOrType}
                    onChange={(e) => setFormData({ ...formData, gradeOrType: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 text-[#14243A] focus:outline-none focus:border-[#F47B20]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Unit of Sale *</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value as MeasurementUnit })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 text-[#14243A] bg-white focus:outline-none focus:border-[#F47B20]"
                  >
                    {MEASUREMENT_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Min Order Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minOrderQuantity}
                    onChange={(e) => setFormData({ ...formData, minOrderQuantity: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 text-[#14243A] focus:outline-none focus:border-[#F47B20]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#F5F6F8] border border-slate-200">
                <div>
                  <label className="text-xs font-bold text-[#14243A] block mb-1">Wholesale Rate (₹) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="e.g. 1650"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full text-xs font-black pl-7 pr-3 py-2 rounded-xl bg-white border border-slate-300 text-[#14243A] focus:outline-none focus:border-[#F47B20]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">MRP Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Optional"
                      value={formData.mrpPrice}
                      onChange={(e) => setFormData({ ...formData, mrpPrice: e.target.value })}
                      className="w-full text-xs pl-7 pr-3 py-2 rounded-xl bg-white border border-slate-300 text-[#14243A] focus:outline-none focus:border-[#F47B20]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Initial Stock Qty</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-300 text-[#14243A] focus:outline-none focus:border-[#F47B20]"
                  />
                </div>
              </div>

              {/* Photo Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Select Material Photo</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {PRESET_PRODUCT_PHOTOS.slice(0, 6).map((preset) => (
                    <div
                      key={preset.url}
                      onClick={() => {
                        setAddImagePreview(preset.url);
                        setAddPhotoSource("preset");
                      }}
                      className={`p-1 rounded-xl border cursor-pointer aspect-square bg-white flex items-center justify-center ${
                        addImagePreview === preset.url ? "border-[#F47B20] ring-2 ring-[#F47B20]/30" : "border-slate-200"
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Material specs, source quarry, grade certifications..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 text-[#14243A] focus:outline-none focus:border-[#F47B20]"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#F47B20] hover:bg-[#DC630D] text-white text-xs font-black shadow-md shadow-[#F47B20]/25 transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Adding Material...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Publish Material to Catalog</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DELETE CONFIRMATION                                              */}
      {/* ========================================================================= */}
      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in-50">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-600">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#14243A]">Remove Material?</h3>
                <p className="text-xs text-slate-500">This will hide it from the customer store.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F5F6F8] border border-slate-200">
              <p className="font-extrabold text-sm text-[#14243A]">{deleteConfirmProduct.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {deleteConfirmProduct.categoryName} • ₹{deleteConfirmProduct.price}/{deleteConfirmProduct.unit}
              </p>
            </div>

            <p className="text-xs text-slate-500">
              You can restore this item at any time using the <strong>Removed Materials</strong> button.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmProduct(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Keep Material
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md shadow-rose-600/25 flex items-center gap-1.5"
              >
                {isDeleting ? "Removing..." : "Yes, Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: RESTORE REMOVED MATERIALS                                        */}
      {/* ========================================================================= */}
      {isRestoreModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in-50">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#14243A]">Removed Materials</h3>
                  <p className="text-xs text-slate-500">{deletedIds.length} materials hidden from public catalogue</p>
                </div>
              </div>
              <button onClick={() => setIsRestoreModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto p-1">
              {deletedIds.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No removed materials.</p>
              ) : (
                deletedIds.map((delId) => {
                  const original = PRODUCTS_DATA.find((p) => p.id === delId || p.slug === delId);
                  return (
                    <div key={delId} className="flex items-center justify-between p-3 rounded-2xl bg-[#F5F6F8] border border-slate-200">
                      <div>
                        <p className="font-extrabold text-xs text-[#14243A]">{original?.name || delId}</p>
                        <p className="text-[10px] text-slate-500">{original?.categoryName || "Catalog Item"}</p>
                      </div>
                      <button
                        onClick={() => handleRestoreProduct(delId)}
                        className="px-3 py-1.5 rounded-xl bg-[#159B68] hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsRestoreModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
