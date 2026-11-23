import { Product, MeasurementUnit } from "../types";
import { PRODUCTS_DATA } from "../data/products";

const OVERRIDES_KEY = "jayam_product_overrides";

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

export function getMergedProducts(baseProducts: Product[] = PRODUCTS_DATA): Product[] {
  const overrides = getStoredOverrides();
  if (!overrides || Object.keys(overrides).length === 0) {
    return baseProducts;
  }

  return baseProducts.map((p) => {
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
