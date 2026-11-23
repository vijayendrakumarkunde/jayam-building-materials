import { Product, MeasurementUnit } from "../types";
import { PRODUCTS_DATA } from "../data/products";

const OVERRIDES_KEY = "jayam_product_overrides";
const DELETED_KEY = "jayam_deleted_products";

export interface ProductOverride {
  id: string;
  slug?: string;
  name?: string;
  price?: number;
  mrpPrice?: number;
  inStock?: boolean;
  stockQuantity?: number;
  images?: string[];
  unit?: MeasurementUnit;
  gradeOrType?: string;
  categorySlug?: string;
  categoryName?: string;
  description?: string;
  specifications?: Record<string, string>;
}

export function getStoredOverrides(): Record<string, ProductOverride> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getDeletedProductIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DELETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveProductOverride(override: ProductOverride) {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredOverrides();
    // Save under id
    existing[override.id] = {
      ...(existing[override.id] || {}),
      ...override,
    };
    // Also save under slug if provided, so PRODUCTS_DATA (using slug) or UUIDs both resolve
    if (override.slug) {
      existing[override.slug] = {
        ...(existing[override.slug] || {}),
        ...override,
      };
    }
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(existing));
    window.dispatchEvent(new Event("jayam_products_updated"));
  } catch (err) {
    console.error("Failed to save product override:", err);
  }
}

export function deleteProductFromCatalog(id: string, slug?: string) {
  if (typeof window === "undefined") return;
  try {
    const deleted = getDeletedProductIds();
    if (!deleted.includes(id)) deleted.push(id);
    if (slug && !deleted.includes(slug)) deleted.push(slug);
    localStorage.setItem(DELETED_KEY, JSON.stringify(deleted));

    // Clean up override if exists
    const existing = getStoredOverrides();
    if (existing[id]) delete existing[id];
    if (slug && existing[slug]) delete existing[slug];
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(existing));

    window.dispatchEvent(new Event("jayam_products_updated"));
  } catch (err) {
    console.error("Failed to mark product deleted:", err);
  }
}

export function restoreProductToCatalog(id: string, slug?: string) {
  if (typeof window === "undefined") return;
  try {
    const deleted = getDeletedProductIds().filter(
      (dId) => dId !== id && (!slug || dId !== slug)
    );
    localStorage.setItem(DELETED_KEY, JSON.stringify(deleted));
    window.dispatchEvent(new Event("jayam_products_updated"));
  } catch (err) {
    console.error("Failed to restore product:", err);
  }
}

export function getMergedProducts(baseProducts: Product[] = PRODUCTS_DATA): Product[] {
  const deletedIds = new Set(getDeletedProductIds());
  const overrides = getStoredOverrides();

  // Filter out removed products by id or slug
  const activeBase = baseProducts.filter(
    (p) => !deletedIds.has(p.id) && (!p.slug || !deletedIds.has(p.slug))
  );

  if (!overrides || Object.keys(overrides).length === 0) {
    return activeBase;
  }

  return activeBase.map((p) => {
    // Match by id or by slug
    const ov = overrides[p.id] || (p.slug ? overrides[p.slug] : undefined);
    if (!ov) return p;

    const hasCustomValidImage =
      ov.images &&
      ov.images.length > 0 &&
      !ov.images[0].includes("photo-1600585154340") &&
      !ov.images[0].includes("photo-1541888946425") &&
      !ov.images[0].includes("photo-1584467735871");

    return {
      ...p,
      name: ov.name || p.name,
      price: ov.price !== undefined ? ov.price : p.price,
      mrpPrice: ov.mrpPrice !== undefined ? ov.mrpPrice : p.mrpPrice,
      inStock: ov.inStock !== undefined ? ov.inStock : p.inStock,
      stockQuantity: ov.stockQuantity !== undefined ? ov.stockQuantity : p.stockQuantity,
      images: hasCustomValidImage ? ov.images! : (p.images && p.images.length > 0 ? p.images : ov.images || []),
      unit: (ov.unit as any) || p.unit,
      gradeOrType: ov.gradeOrType || p.gradeOrType,
      description: ov.description || p.description,
      specifications: ov.specifications || p.specifications,
    };
  });
}

/**
 * Universal category matcher to ensure sand, river-sand, m-sand, and aggregates
 * all match the "Sand & Aggregates" category (slug: "sand") across admin & storefront.
 */
export function isProductInCategory(product: Product, categorySlug: string): boolean {
  if (!categorySlug || categorySlug === "all") return true;

  const pCat = (product.categorySlug || "").toLowerCase();
  const cName = (product.categoryName || "").toLowerCase();
  const pName = (product.name || "").toLowerCase();

  if (categorySlug === "sand") {
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

  if (categorySlug === "cement") {
    return pCat === "cement" || cName.includes("cement") || pName.includes("cement");
  }

  if (categorySlug === "steel") {
    return pCat === "steel" || cName.includes("steel") || pName.includes("steel") || pName.includes("tmt");
  }

  if (categorySlug === "bricks") {
    return (
      pCat === "bricks" ||
      cName.includes("brick") ||
      cName.includes("block") ||
      pName.includes("brick") ||
      pName.includes("block") ||
      pName.includes("aac")
    );
  }

  if (categorySlug === "stones") {
    return (
      pCat === "stones" ||
      pCat === "soil-stone" ||
      cName.includes("stone") ||
      pName.includes("rubble") ||
      pName.includes("granite")
    );
  }

  if (categorySlug === "red-soil") {
    return (
      pCat === "red-soil" ||
      pCat === "soil-stone" ||
      cName.includes("soil") ||
      pName.includes("soil")
    );
  }

  if (categorySlug === "electricals") {
    return (
      pCat === "electricals" ||
      pCat === "other-materials" ||
      cName.includes("electrical") ||
      pName.includes("wire") ||
      pName.includes("cable")
    );
  }

  return pCat === categorySlug;
}

