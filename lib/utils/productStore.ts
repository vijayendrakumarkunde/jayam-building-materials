import { Product, MeasurementUnit } from "../types";
import { PRODUCTS_DATA } from "../data/products";

const OVERRIDES_KEY = "jayam_product_overrides";
const DELETED_KEY = "jayam_deleted_products";

export interface ProductOverride {
  id: string;
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
    existing[override.id] = {
      ...(existing[override.id] || {}),
      ...override,
    };
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(existing));
    window.dispatchEvent(new Event("jayam_products_updated"));
  } catch (err) {
    console.error("Failed to save product override:", err);
  }
}

export function deleteProductFromCatalog(id: string) {
  if (typeof window === "undefined") return;
  try {
    const deleted = getDeletedProductIds();
    if (!deleted.includes(id)) {
      deleted.push(id);
      localStorage.setItem(DELETED_KEY, JSON.stringify(deleted));
    }
    // Clean up override if exists
    const existing = getStoredOverrides();
    if (existing[id]) {
      delete existing[id];
      localStorage.setItem(OVERRIDES_KEY, JSON.stringify(existing));
    }
    window.dispatchEvent(new Event("jayam_products_updated"));
  } catch (err) {
    console.error("Failed to mark product deleted:", err);
  }
}

export function restoreProductToCatalog(id: string) {
  if (typeof window === "undefined") return;
  try {
    const deleted = getDeletedProductIds().filter((dId) => dId !== id);
    localStorage.setItem(DELETED_KEY, JSON.stringify(deleted));
    window.dispatchEvent(new Event("jayam_products_updated"));
  } catch (err) {
    console.error("Failed to restore product:", err);
  }
}

export function getMergedProducts(baseProducts: Product[] = PRODUCTS_DATA): Product[] {
  const deletedIds = new Set(getDeletedProductIds());
  const overrides = getStoredOverrides();

  // Filter out removed products
  const activeBase = baseProducts.filter((p) => !deletedIds.has(p.id));

  if (!overrides || Object.keys(overrides).length === 0) {
    return activeBase;
  }

  return activeBase.map((p) => {
    const ov = overrides[p.id];
    if (!ov) return p;
    return {
      ...p,
      name: ov.name || p.name,
      price: ov.price !== undefined ? ov.price : p.price,
      mrpPrice: ov.mrpPrice !== undefined ? ov.mrpPrice : p.mrpPrice,
      inStock: ov.inStock !== undefined ? ov.inStock : p.inStock,
      stockQuantity: ov.stockQuantity !== undefined ? ov.stockQuantity : p.stockQuantity,
      images: ov.images && ov.images.length > 0 ? ov.images : p.images,
      unit: (ov.unit as any) || p.unit,
      gradeOrType: ov.gradeOrType || p.gradeOrType,
    };
  });
}
